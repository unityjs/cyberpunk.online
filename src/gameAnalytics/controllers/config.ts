import { getNowDay } from "../../utils/time"
import { AppData } from "../AppData"

// config
export async function config(query: { appName: string, appData: AppData, level: any, version: any, bundleVersion: any, channel: string, cloud: string, lang: string, debug: any }) {
    let level = parseInt(query.level) || 1
    const version = parseFloat(query.version) || 1
    let bundleVersion = parseFloat(query.bundleVersion) || 1
    var channel = query.channel || "unknown"
    const cloud = (query.cloud || "0").replace(/_/g, ".")
    const lang = query.lang || "unknown"
    //let region = query.region || getRegion(getClientIp(req))
    let debug = query.debug === 1 || query.debug === true

    let data: any = {}
    let appCloudData = query.appData.cloudData
    if (appCloudData != null) {
        data.cloud = cloud
        if (cloud === "0" || appCloudData.cloudRate.values.indexOf(cloud) == -1) {
            data.cloud = appCloudData.cloudRate.rndValue() || "0"
        }
        data.cloudVersion = getNowDay().toString()
        Object.assign(data, appCloudData.cloudData, appCloudData.cloudRandomData[data.cloud])
    }

    if (query.appName == "DustSettle") {

        //data.skus = [{ sku: "diamonds001", originCount: 100, count: 200, price: "$ 0.99" },
        //{ sku: "diamonds002", originCount: 500, count: 1000, price: "$ 1.99" },
        //{ sku: "diamonds003", originCount: 800, count: 9999, price: "$ 2.99" }]

        // 中国区IOS关闭内购
        if (lang === "ChineseSimplified" && query.channel === "apple") {
            data.enablePurchase = false
        }
        // 编辑器强开
        /*let ip = getClientIp(req)
        if ( (query.region == "IN" && getRegion(ip) == "印度" && Math.random() > 0.8)) {
            addEvent(query.appName, "myAdTest", 1)
            data.enablePurchase = true
            data.enableSkin = true
            data.cloud += '_a'
            data.adRate = 0.08
            data.adTakeLeftover = true
            data.adUrl = "https://www.unityjs.net/ad.html"

            //data.fakeAdRate = 1
            //data.ad = [{ title: "", content: "", image: "https://www.unityjs.net/ad0.jpg", url: "https://www.facebook.com" },
            //{ title: "", content: "", video: "https://www.unityjs.net/ad9.mp4", image: "https://www.unityjs.net/ad9.jpg", url: "https://www.facebook.com" }]
        }*/
        if (version >= 1.19) {
            data.enableSkin = true
        }

        data.spin = [
            [0.35, 0.1, 0.05, 0.3, 0.05, 0.3, 0.2, 0],
            [0.3, 0.1, 0.05, 0.2, 0.05, 0.3, 0.2, 0],
            [0.3, 0.15, 0.1, 0.2, 0.08, 0.3, 0.2, 0],
            [0.3, 0.2, 0.15, 0.2, 0.08, 0.3, 0.2, 0.1]
        ]

        //data.fakeAdRate = 1
        //data.ad = [{ title: "", content: "", image: "https://api.unityjs.net/ad0.jpg", url: "https://www.facebook.com" }]
        //data.push = []
        //data.notice = []
        //data.notification = [/*{ title: "通知", content: "你很久没玩游戏啦，快来领取你的金币!", time: time }*/]

        /*var time = ((Date.now() / 1000 + 8 * 3600 + 300) % (3600 * 24))
        var h = Math.floor(time / 3600)
        var m = Math.floor(time / 60) % 60
        var s = Math.floor(time) % 60*/
        /*if (bundleVersion == 1.29) {
            data.push = [{ id: 1,  title: "一次性测试", content: "点击后不再出现", button: "10钻", image: "https://api.unityjs.net/dustsettle.jpg",  tag: "New", diamond: 10
            }, { title: "战力提升！", content: "你的新机体到了", button: "签收", image: "https://api.unityjs.net/dustsettle.jpg", tag: "New"
            }, {//video: "https://vd4.bdstatic.com/mda-ji0g4r6a6kqyjrxm/sc/mda-ji0g4r6a6kqyjrxm.mp4", 
                title: "视频测试", content: "这是一个测试", button: "试玩", video: "https://mp4.vjshi.com/2017-05-27/5f4c9548e01dc9cd83169cc18fee7ce9.mp4", tag: "Ad", }]
            data.notice = [
                { id: 1, title: "版本更新通告", content: "V1.29版本\n新增了两种机体\n优化了UI界面", button: "确定", cancel: null, },
                //{ id: 2, title: null, content: "感谢你的测试，赠送你1k个钻石，这个第二条消息"/*，后台通告会在" + h + ":" + m + ":" + s + "弹出", coin: "1k", button: "领取", cancel: null, },
                //{ id: 3, title: "你好！", content: "感谢你的测试，赠送你10点体力，这个第三条消息", energy: 10, button: "领取", cancel: null, },
            ]
            if (channel == "apple") {
                data.push[1].url = "itms-apps://itunes.apple.com/cn/app/id1461500552"
                data.push[2].url = "itms-apps://itunes.apple.com/cn/app/id1461500552"
                //data.notice[0].url = "itms-apps://itunes.apple.com/cn/app/id1461500552"
                //data.notice[1].url = "itms-apps://itunes.apple.com/cn/app/id1461500552"
            } else {
                data.push[1].url = "market://details?id=com.logame.eliminateintruder3d"
                data.push[2].url = "market://details?id=com.logame.eliminateintruder3d"
                //data.notice[0].url = "market://details?id=com.logame.eliminateintruder3d"
                //data.notice[1].url = "market://details?id=com.logame.eliminateintruder3d"
            }
        } else if (bundleVersion == 1.28) {
            data.push = [{ title: "视频测试", content: "这是一个测试", button: "试玩", video: "https://mp4.vjshi.com/2017-05-27/5f4c9548e01dc9cd83169cc18fee7ce9.mp4", tag: "Ad" }]
 
            data.notice = [{ title: "通知", content: "请更新版本，最新版本 1.29", button: "更新", cancel: null, }]
            if (channel == "apple") {
                data.push[0].url = "itms-apps://itunes.apple.com/cn/app/id1461500552"
                data.notice[0].url = "itms-apps://itunes.apple.com/cn/app/id1461500552"
            } else {
                data.push[0].url = "market://details?id=com.logame.eliminateintruder3d"
                data.notice[0].url = "market://details?id=com.logame.eliminateintruder3d"
            }
        }*/

    }
    return data
}


//var request = require('request');
//const { google } = require('googleapis');
//const androidpublisher = google.androidpublisher('v3');
//const url = 'mongodb+srv://huihui:qwer1234@cluster0-v7xge.mongodb.net/test?retryWrites=true';

//module.exports = function (routerAPI, routerGA/*, qqwry*/) {
//routerAPI.use(useAPI);
//routerGA.use(useAPI);


///////////////////////////////////////////////////
/*app.get('/ga/debug', function (req, res) {
    if (debugData)
        res.json(debugData);
    else
        res.status(200).send("null");
});

function updateLoop(db, docs, callback) {
    if (docs.length <= 0) {
        callback();
        return;
    }
    var data = docs.pop();
    nowDay = data._id.substring(1);
    console.log("d" + nowDay);
    db.collection("userAnalytics").update({ _id: "d" + nowDay }, { $set: { day: parseInt(nowDay) } }, { upsert: true }, function (err, result) {
        if (err) callback(err);
        else updateLoop(db, docs, callback);
    });
}

app.get('/ga/update', function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, mongodb) {
        if (err) {
            mongodb.close();
            return res.status(200).send(err);
        }
        const db = mongodb.db("DustSettle");
        db.collection("userAnalytics").find().toArray(function (err, docs) {
            if (err) {
                mongodb.close();
                return res.status(200).send(err);
            }
            updateLoop(db, docs, function (err) {
                res.status(200).send(err ? err : "ok");
                mongodb.close();
            });
        });
    });
});*/
//}