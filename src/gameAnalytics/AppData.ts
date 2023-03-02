import mongoose, { Schema, Model, Document, Types, _UpdateQuery } from 'mongoose'
import cron from "cron";
import { cacheCall, delayCall, floatFixed, floatFixed2, getDay, getDayInSeconds, getHoursInSeconds, getNowDay, getNowHours, sleep } from "../utils/time"
import { createChildLogger, logger } from '../utils/log';
import winston from 'winston';
import Counter from './models/Counter';
import lodash from 'lodash'
import { ApiError } from '../utils/HTTPException';
import { App, IApp, Rank } from './models/App';
import { getRegion } from '../utils/region';
import { appsConfig, Rate } from './cloudData';
import Report, { ReportModel } from './models/Report';

class DbCache {
    data: any = {}
    filter: any
    constructor(filter) {
        this.filter = Object.assign({}, filter)
    }

    inc(value) {
        this.data.$inc ||= {}
        var incValue = this.data.$inc
        for (var key in value) {
            if (typeof value[key] !== 'number') continue
            if (typeof incValue[key] === 'number') incValue[key] += value[key]
            else incValue[key] = value[key]
        }
    }

    set(value) {
        this.data.$set ||= {}
        Object.assign(this.data.$set, value)
    }
}

interface CollectionLog {
    name: string
    count: number
    total: number
}

interface AppLog {
    lastTime?: Date
    count?: number
    total?: number
    cachesTime?: string
    preTime?: string
    caches?: { [key: string]: CollectionLog }
}

export class AppData {
    private static initializing: boolean = false
    private static apps: { [key: string]: AppData } = {}
    dbCaches: { [key: string]: { [key: string]: DbCache } } = {}
    log: AppLog = {}
    inited: boolean = false
    cloudData: any;

    db: IApp
    collections: { [key: string]: mongoose.Collection } = {}
    logger: winston.Logger
    report: ReportModel

    private delaySave: () => void

    constructor() {
    }

    static async getAppByName(appName: string) {
        while (AppData.initializing) await sleep(1)
        AppData.initializing = true
        let app = AppData.apps[appName]
        if (!app) {
            var db = await App.findOne({ name: appName })
            if (!db) {
                db = new App({ name: appName })
                db.id = (await Counter.getNextSequenceValue('App')).toString()
                await db.save()
                //this.logger.info(`new app: id=${this.db._id}`)
            } else {
                if (!db.id)
                    db.id = escape(db.name)
            }
            app = new AppData()
            await app.setup(db)
            AppData.apps[app.db.name] = app
            AppData.apps[app.db.id] = app
        }
        AppData.initializing = false
        return app
    }

    static async getAppById(appId: string) {
        while (AppData.initializing) await sleep(1)
        AppData.initializing = true
        let app = AppData.apps[appId]
        if (!app) {
            const db = await App.findOne({ id: appId })
            if (!db)
                throw new ApiError("appId不存在")
            app = new AppData()
            await app.setup(db)
            AppData.apps[app.db.name] = app
            AppData.apps[app.db.id] = app
        }
        AppData.initializing = false
        return app
    }

    initCloudData() {
        if (!this.db.config?.cloud) return
        const { parameters, combines } = this.db.config.cloud

        const cloudData = {}
        const cloudRandomData = {}
        const cloudRandomList = []
        const cloudRandomWeights = []
        for (const key in parameters) {
            const element = parameters[key]
            if (element.enable) {
                cloudData[key] = element.default
            }
        }
        for (const key in parameters) {
            const element = parameters[key]
            if (element.enable && element.test) {
                const weight = (element.weight || 1) / element.test.length
                for (let j = 0; j < element.test.length; ++j) {
                    cloudRandomList.push(element.id + "." + j)
                    cloudRandomWeights.push(weight)
                    const newCloudData = {}//Object.assign({}, cloudData)
                    newCloudData[key] = element.test[j]
                    cloudRandomData[element.id + "." + j] = newCloudData
                }
            }
        }
        for (const key in combines) {
            const element = combines[key]
            cloudRandomList.push(key)
            cloudRandomWeights.push(element.weight || 1)
            cloudRandomData[key] = element.data
        }
        this.cloudData = { cloudData, cloudRandomData, cloudRate: new Rate(cloudRandomList, cloudRandomWeights) }
    }

    async setup(db: IApp) {
        this.db = db
        this.logger = createChildLogger(this.db.name)

        this.db.userCount ??= 0//await this.db.collection("user").estimatedDocumentCount()
        this.db.configKeys ??= {}//new Map<string, Map<string, ConfigKey>>()
        this.db.config ??= appsConfig[this.db.name]
        this.db.ranks ??= new Map<string, Rank>()
        // 初始化运控数据
        this.initCloudData()

        //{ top: [], total: 0, counter: [] }
        //获取排行榜
        this.db.ranks.forEach((value) => {
            value.top.sort((a, b) => b.score - a.score)
        })
        this.report = Report(this.db.id)

        this.logger.info(`Inited app, userCount:${this.db.userCount}, appName:${this.db.name}, appId:${this.db.id}`)
        // 每300秒更新缓存数据到DB
        this.inited = true

        // 30秒内存入数据库
        this.delaySave = cacheCall(async () => {
            try {
                await this.updateDbCaches()
            } catch (error) {
                logger.error(`updateDbCaches ${this.db.name} ${this.db.id}`, error)
            }
        }, 30000)

        //在每天的0点的第1分钟执行一次 UTC 0
        new cron.CronJob('* 1 0 * * *', this.refreshDaily, null, true, 'Europe/London');
    }

    checkKeyword(path: string) {
        if (!this.inited) return
        if (lodash.hasIn(this.db.configKeys, path)) return
        this.logger.info(`new keyword ${path}`)
        lodash.setWith(this.db.configKeys, path, null, Object)
        this.db.markModified('configKeys')
    }

    getDbCache(collectionName: string, filter): DbCache {
        this.dbCaches[collectionName] ??= {}
        const collection = this.dbCaches[collectionName]
        const dbCacheName = JSON.stringify(filter)
        collection[dbCacheName] ??= new DbCache(filter)
        const dbCache = collection[dbCacheName]
        return dbCache
    }

    collection(name: string): mongoose.Collection {
        this.collections[name] ??= mongoose.connection.collection(name + "_" + this.db.id)
        return this.collections[name]
    }

    async dailyCleaning() {
        var nowDay = getNowDay()
        var nowHours = getNowHours()
        await this.collection("mission").deleteMany({ day: { "$lt": nowDay - 7 } })
        await this.collection("event").deleteMany({ day: { "$lt": nowDay - 14 } })
        await this.collection("realtime").deleteMany({ hours: { "$lt": nowHours - 168 } })
        await this.collection("userAnalytics").deleteMany({ day: { "$lt": nowDay - 30 } })
        await this.collection("userActive").deleteMany({ day: { "$lt": nowDay - 90 } })
        //await this.collection("purchase").deleteMany({ day: { "$lt": nowDay - days } })
    }

    /** 每日刷新 */
    async refreshDaily() {
        try {
            await this.dailyCleaning()
        } catch (e) {
            this.logger.error('refreshDaily', e)
        }
    }

    async dbSize(): Promise<number> {
        let size = 0
        for (const name of ["realtime", "userAnalytics", "userActive"])
            size += (await this.collection(name).stats()).size
        return size
    }

    async updateDbCaches() {
        var lastCachesTime = Date.now()

        // 替换缓存
        var dbCaches = this.dbCaches
        this.dbCaches = {}
        // 日志更新
        this.log = { lastTime: new Date(lastCachesTime), count: 0, total: 0, cachesTime: '', preTime: '', caches: {} }
        for (var collName in dbCaches) {
            var collCaches = dbCaches[collName]
            var collLog: CollectionLog = { name: collName, count: 0, total: 0 }
            this.log.caches[collName] = collLog
            for (var dbCacheName in collCaches) {
                collLog.total++
                this.log.total++
            }
        }

        // 保存appDB
        try {
            if (this.db.isModified())
                await this.db.save()
        } catch (e) {
            this.logger.error(`updateDbCaches db.save ${this.db.name} ${this.db.id}`, e)
        }
        try {
            // 更新用户累计数量
            var nowDay = getNowDay()
            await this.collection("userActive").updateOne({ day: nowDay }, { $set: { count: this.db.userCount } }, { upsert: true })
        } catch (e) {
            this.logger.error(`updateDbCaches userActive updateOne ${this.db.name} ${this.db.id}`, e)
        }
        //提交缓存
        for (var collName in dbCaches) {
            var collCaches = dbCaches[collName]
            var coll = this.collection(collName)
            const collLog = this.log.caches[collName]
            for (var dbCacheName in collCaches) {
                var dbCache = collCaches[dbCacheName]
                collLog.count++
                this.log.count++
                try {
                    await coll.updateOne(dbCache.filter, dbCache.data, { upsert: true })
                } catch (e) {
                    this.logger.error(`updateDbCaches updateOne ${this.db.name} ${this.db.id}`, e)
                }
            }
        }

        var cachesTime = Date.now() - lastCachesTime
        this.log.cachesTime = floatFixed2(cachesTime / 1000) + "s"
        this.log.preTime = floatFixed(cachesTime / this.log.count, 0) + "ms"
        //this.logger.info(`updateDbCaches: ${JSON.stringify(this.log)}`)
    }

    async login(channel: string, version: string, cloud: string, lang: string, region: string, ip: string, loginTime: number, first: number, last: number) {
        lang ||= "unknown"
        if (ip) region = getRegion(ip)
        loginTime ||= Date.now() / 1000;

        const day = getDayInSeconds(loginTime)
        const hours = getHoursInSeconds(loginTime)

        let isOldActive = false
        let isActive = false

        let inc: any = {
            login: 1,
            [`region.${region}.login`]: 1,
            [`lang.${lang}.login`]: 1,
        }
        let incActive = {
            [`channel.${channel}.login`]: 1,
            [`version.${version}.login`]: 1,
            [`cloud.${cloud}.login`]: 1,
        }

        if (last == null || last == 0 || isNaN(last)) { // 新增用户
            isActive = true
            inc.new = 1
            inc[`region.${region}.new`] = 1
            inc[`lang.${lang}.new`] = 1
            incActive[`channel.${channel}.new`] = 1
            incActive[`version.${version}.new`] = 1
            incActive[`cloud.${cloud}.new`] = 1
            this.db.userCount++
        } else if (day != getDayInSeconds(last)) {
            isActive = true
            isOldActive = true
        }

        if (isActive) { // 活跃
            inc.active = 1
            inc[`region.${region}.active`] = 1
            inc[`lang.${lang}.active`] = 1
            incActive[`channel.${channel}.active`] = 1
            incActive[`version.${version}.active`] = 1
            incActive[`cloud.${cloud}.active`] = 1
        }

        // 更新user
        Object.assign(incActive, inc)
        this.getDbCache("realtime", { hours }).inc(incActive)
        this.getDbCache("userActive", { day }).inc(incActive)
        this.getDbCache("userAnalytics", { day, channel, version, cloud }).inc(inc)

        //this.logger.info("login: " + day + " region:" + region + " lang:" + lang)
        // 增加次留
        if (isOldActive) {
            let firstDay = getDayInSeconds(first)
            let newDays = day - firstDay
            if (newDays > 0 && newDays < 30) {
                let incFirstDay = {}
                incFirstDay["new_d" + newDays] = 1
                this.getDbCache("userActive", { day: firstDay }).inc(incFirstDay)
                this.getDbCache("userAnalytics", { day: firstDay, channel, version, cloud }).inc(incFirstDay)
            }
        }
        this.delaySave()
    }

    async event(channel: string, version: string, cloud: string, key: string, value: string | number, last?: number) {
        const day = getNowDay()
        key ||= "unknown"
        const inc = {}
        this.checkKeyword(`event.${key}`)
        inc[`event.${key}._value`] = value || 0
        inc[`event.${key}._count`] = 1

        if (last == null || last == 0 || isNaN(last)) {
            inc[`event.${key}._new`] = 1
            inc[`event.${key}._active`] = 1
        } else if (day != getDayInSeconds(last))
            inc[`event.${key}._active`] = 1

        this.getDbCache("userActive", { day }).inc(inc)
        this.getDbCache("userAnalytics", { day, channel, version, cloud }).inc(inc)
        this.delaySave()
    }
}