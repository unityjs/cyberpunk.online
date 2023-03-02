import { Request } from "express"
import { AppData } from "../AppData"
import { getClientIp } from "../../utils/express"

async function verifyPurchase() {
    /*let success = eventData.success
    let value = eventData.value
    if (success && value) {
        let subscriptionId_token = value.split("@")
        const params = {
            packageName: "com.logame.eliminateintruder3d",
            subscriptionId: subscriptionId_token[0],
            token: subscriptionId_token[1]
        }
        [err, data] = await to(androidpublisher.purchases.subscriptions.get(params))
        if (err) { console.error(appName, err) continue }
        console.log(appName, data)
        const isValid = data && data.data && data.data.purchaseState === 0
        if (isValid) {
            eventValue = 1
        } else {
            eventKey += "Fake"
        }
    }*/
}

export async function v2(query: { appData: AppData, _req: Request, channel: string, version: string, cloud: string, region: string, events: any }) {
    if (query.events == null) throw new Error('no events')

    query.channel ??= 'unknown'
    query.version ??= 'unknown'
    query.cloud ??= 'unknown'
    query.cloud = query.cloud.replace(/_/g, '.') // 修正

    const { appData, channel, version, cloud } = query
    appData.checkKeyword(`channel.${channel}`) // 渠道版本关键字检测
    appData.checkKeyword(`version.${version}`) // 版本关键字检测
    appData.checkKeyword(`cloud.${cloud}`) // 云控关键字检测

    for (let eventData of query.events) {
        const { id } = eventData
        if (id == 'li') // 用户登录
            appData.login(channel, version, cloud, eventData.lang, query.region, getClientIp(query._req), eventData.login, eventData.first, eventData.last)
        else if (id == 'lo') // 用户登出
            appData.event(channel, version, cloud, 'logout', eventData.logout - eventData.login)
        else if (id == 'ev') // 事件
            appData.event(channel, version, cloud, eventData.key, eventData.value)
        else if (id == 'me') // 任务事件
            appData.event(channel, version, cloud, `${eventData.key}.${eventData.mission}`, eventData.value)
        else if (id == 'pu') {// 内购验证
            appData.event(channel, version, cloud, `purchase.${eventData.sku}`, (eventData.response == 0) ? 1 : 0)
            //if(eventData.response != 0)
            // addLog(eventData.response)
        }
    }
}

export async function v3(query: { appData: AppData, _req: Request, channel: string, version: string, cloud: string, region: string, lang: string, data: any[][] }) {
    if (query.data == null) throw new Error('no data')

    query.channel ??= 'unknown'
    query.version ??= 'unknown'
    query.cloud ??= 'unknown'
    query.cloud = query.cloud.replace(/_/g, '.') // 修正

    const { appData, channel, version, cloud, lang } = query
    appData.checkKeyword(`channel.${channel}`) // 渠道版本关键字检测
    appData.checkKeyword(`version.${version}`) // 版本关键字检测
    appData.checkKeyword(`cloud.${cloud}`) // 云控关键字检测

    for (let it of query.data) {
        const id = it[0]
        if (id == 'li') // 用户登录
            appData.login(channel, version, cloud, lang, query.region, getClientIp(query._req), null, it[1], it[2])
        else if (id == 'lo') // 用户登出
            appData.event(channel, version, cloud, 'logout', it[1], it[2])
        else if (id == 'ev') // 事件
            appData.event(channel, version, cloud, it[1], it[2], it[3])
        else if (id == 'rp') // 上报
            appData.report?.add('client', it[1], it[2], null, version)
    }
}


export async function v1(query: { appProfile: any, appName: string, appData: AppData, _req: Request, channel: string, version: string, cloud: string, region: string, events: any }) {
    //var jsonData = req.query.data ? JSON.parse(req.query.data) : req.query;
    if (query.appProfile == null || query.events == null)
        return //throw new Error('post error')

    query.appName ??= query.appProfile.appName || 'unknown'
    query.channel ??= query.appProfile.partner || 'unknown'
    query.version ??= query.appProfile.version || 'unknown'
    query.cloud ??= query.appProfile.cloud || 'unknown'
    query.appName += 'v1'
    query.appData = await AppData.getAppByName(query.appName);
    query.cloud = query.cloud.replace(/_/g, '.') // 修正

    const { appName, appData, channel, version, cloud } = query
    appData.checkKeyword(`channel.${channel}`) // 渠道版本关键字检测
    appData.checkKeyword(`version.${version}`) // 版本关键字检测
    appData.checkKeyword(`cloud.${cloud}`) // 云控关键字检测

    var events = query.events;

    //var userId = query.deviceProfile.deviceId;// 设备id
    for (var i = 0; i < events.length; ++i) {
        var eventData = events[i];
        if (eventData.id == 'G9') {// 内购验证
            const { mission, sku, success, value } = eventData.data
            appData.event(channel, version, cloud, `purchaseSkus.${sku}`, success ? 1 : 0)
            // 对内购进行分类
            if (success) { }
            else if (value.indexOf('UserCancelled') != -1) { }
            else if (value.indexOf('User canceled') != -1) { }
            else if (value.indexOf('Billing Unavailable') != -1) { }
            else console.warn(appName, 'purchase ', sku, success, value);
        } else if (eventData.id == 'G3') {// 用户登录
            eventData.first ||= query.appProfile.installationTime / 1000;
            if (eventData.data.interval != null) {
                eventData.last ||= (Date.now() / 1000) + eventData.data.interval;
                console.log('eventData: ' + JSON.stringify(eventData));
            }/* else if (appName != 'DustSettle') {
                const db = await req.db;
                const collectionUser = db.collection('user');
                let data = await collectionUser.findOneAndUpdate({ _id: userId }, { $set: { last: Date.now() } }, { upsert: true, returnNewDocument: false, new: false });
                if (data && (data.last || data.lastTime)) eventData.last = (data.last || data.lastTime) / 1000;
                collectionUser.deleteOne({ 'last': { $lt: Date.now() - 30 * 24 * 60 * 60000 } });
            }*/
            appData.login(channel, version, cloud, query.appProfile.lang, query.appProfile.region, getClientIp(query._req), eventData.login, eventData.first, eventData.last)
        } else if (eventData.id == 'G6') {// 关卡
            const { mission, custom, status } = eventData.data
            if (status == 1) appData.event(channel, version, cloud, `missionEnter.${mission}`, 1) //任务进入
            else if (status == 2) appData.event(channel, version, cloud, `missionSuccess.${mission}`, 1) //任务成功
            else if (status == 3) appData.event(channel, version, cloud, `missionSuccess.${mission}`, 0) //任务失败
            if (status == 2 && eventData.data.timeConsuming) appData.event(channel, version, cloud, `missionDuration.${mission}`, eventData.data.timeConsuming)
            if (custom) for (let key in custom) appData.event(channel, version, cloud, key, custom[key]);
        }
    }
}
