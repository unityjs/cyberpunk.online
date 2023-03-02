import { floatFixed2, getNowDay, floatFixed, getNowHours } from "../../utils/time"
import { AppData } from "../AppData"
import { App } from "../models/App"
import lodash from 'lodash'
import { ApiError } from "../../utils/HTTPException"

function checkNumber(value: any): number {
    value = parseInt(value)
    if (value <= Number.MAX_VALUE && value >= -Number.MAX_VALUE) return value
    return null
}

/**  */
export const getKeys = async (query: { appData: AppData }) => {
    return query.appData.db.configKeys
}

export const setKeys = async (query: { appData: AppData, keys: any }) => {
    query.appData.db.configKeys = query.keys
}

export const getConfig = async (query: { appData: AppData }) => {
    return query.appData.db.config
}

export const setConfig = async (query: { appData: AppData, config: any }) => {
    query.appData.db.config = query.config
    query.appData.initCloudData()
}

export async function clear(query: { appData: AppData }) { await query.appData.dailyCleaning() }

function GetDBQuery(query: any) {
    const dbQuery: any = {}
    if (query.hoursEnd) {
        query.hoursEnd = checkNumber(query.hoursEnd)
        query.hoursBegin = checkNumber(query.hoursBegin) ?? (query.hoursEnd - 1)
        dbQuery.hours = { "$gte": query.hoursBegin, "$lte": query.hoursEnd }
    }
    if (query.dayEnd) {
        query.dayEnd = checkNumber(query.dayEnd)
        query.dayBegin = checkNumber(query.dayBegin) ?? (query.dayEnd - 1)
        dbQuery.day = { "$gte": query.dayBegin, "$lte": query.dayEnd }
    }
    //query.dayBegin ||= new Date(query.begin).setUTCHours(0, 0, 0, 0) / 86_400_000
    //query.dayEnd ||= new Date(query.end).setUTCHours(0, 0, 0, 0) / 86_400_000
    ['hours', 'day', 'channel', 'version', 'cloud'].map(t => {
        const value = query[t]
        if (!value) return
        if (Array.isArray(value)) dbQuery[t] = { "$in": value }
        else dbQuery[t] = value
    })
    return dbQuery
}

//info
/*export async function info(query: { appData: AppData, dayBegin: number, dayEnd: number }) {
    if (!data) return
    for (let i = 0, l = data.length; i < l; ++i) {
        const item = data[i]
        const itemValue = item.eventValue || {}
        const curDay = item.day - query.dayBegin
        arrValue[curDay] += (itemValue.diamonds001 || 0) * 0.99
        arrValue[curDay] += (itemValue.diamonds002 || 0) * 1.99
        arrValue[curDay] += (itemValue.diamonds003 || 0) * 2.99
    }
    return {
        activeCount: arrActive[1], activeGrown: floatFixed((arrActive[1] - arrActive[0]) / (arrActive[0] || 1), 4),
        newCount: arrNew[1], newGrown: floatFixed((arrNew[1] - arrNew[0]) / (arrNew[0] || 1), 4),
        earnCount: floatFixed(arrValue[1], 2), earnGrown: floatFixed((arrValue[1] - arrValue[0]) / (arrValue[0] || 1), 4)
    }
}*/

/** 扁平化对象 */
function flattenObject(object: any) {
    const result = {};
    function flat(obj, path: string) {
        Object.keys(obj).forEach(key => {
            const value = obj[key]
            if (typeof value === 'object') flat(value, `${path}${key}.`)
            else result[`${path}${key}`] = value
        })
    }
    flat(object, '')
    return result
}

/** 查询序列 */
async function querySeries(query: { appData: AppData }, collection: string, keys: string[], values: string[]) {
    const data = await query.appData.collection(collection).find(GetDBQuery(query)).toArray()
    function customizer(objValue, srcValue) {
        if (lodash.isNumber(objValue) && lodash.isNumber(srcValue))
            return objValue + srcValue
    }
    const series: { [k: string]: number }[] = []
    for (const item of data) {
        const itemKey = flattenObject(lodash.pick(item, keys))
        let it = lodash.find(series, itemKey)

        if (it == null) {
            it = itemKey
            series.push(it)
        }
        const itemValue = lodash.pick(item, values)
        lodash.mergeWith(it, itemValue, customizer);
    }
    return lodash.sortBy(series, keys)
}

/** 获取实时在线信息 */
export async function realtime(query: { appData: AppData, values: string[] }) {
    const keys = ['hours']
    const values = query.values || ['new', 'active', 'login']
    return await querySeries(query, 'realtime', keys, values)
}

/** 获取数据分析 */
export async function analytics(query: { appData: AppData, channel: string, version: string, cloud: string, keys: string[], values: string[] }) {
    const collection = (query.channel || query.version || query.cloud) ? "userAnalytics" : "userActive"
    const keys = query.keys || ['day']
    const values = query.values || ['new', 'active', 'login']
    return await querySeries(query, collection, keys, values)
}