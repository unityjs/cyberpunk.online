//var request = require('request');
const { google } = require('googleapis');
const androidpublisher = google.androidpublisher('v3');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://huihui:qwer1234@cluster0-v7xge.mongodb.net/test?retryWrites=true';
//const url = 'mongodb://admin:Qwer1234@usa.unityjs.net:27117';


module.exports = function (routerAPI, routerGA/*, qqwry*/) {
    var _appData = {};

    function getClientIp(req) {
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress || '';
    }


    class IncCache {
        constructor(filter) {
            this.incValue = {};
            this.filter = filter;
        }

        inc(value) {
            for (var key in value) {
                if (typeof this.incValue[key] === 'number')
                    this.incValue[key] += value[key];
                else
                    this.incValue[key] = value[key];
            }
        }

        async pushData(collection) {
            let err, data;
            [err, data] = await to(collection.updateOne(this.filter, { $inc: this.incValue }, { upsert: true }));
            if (err) { console.error("IncCache pushData " + err); }
        }
    }

    function GetIncCache(appName, collectionName, filter) {
        var incCaches = _appData[appName].incCaches;
        if (incCaches === undefined) {
            incCaches = {};
            _appData[appName].incCaches = incCaches;
        }
        var collection = incCaches[collectionName];
        if (collection === undefined) {
            collection = {};
            incCaches[collectionName] = collection;
        }
        var incCacheName = JSON.stringify(filter);
        var incCache = collection[incCacheName];
        if (incCache === undefined) {
            incCache = new IncCache(filter);
            collection[incCacheName] = incCache;
        }
        return incCache;
    }

    async function UpdateIncCaches() {
        console.time("UpdateIncCaches");
        var mongodb = await popDB();
        for (var appName in _appData) {
            var incCache = _appData[appName].incCaches;
            if (incCache === undefined) continue;
            for (var collectionName in incCache) {
                var dbCollection = mongodb.collection(collectionName);
                var collection = incCache[collectionName];
                for (var incCacheName in collection) {
                    var incCache = collection[incCacheName];
                    await incCache.pushData(dbCollection);
                }
                incCache[collectionName] = {};
            }
        }
        pushDB(mongodb);
        console.timeEnd("UpdateIncCaches");
    }

    // 每5分钟更新缓存数据到DB
    setInterval(UpdateIncCaches, 300000);


    routerAPI.post('/g/v1', initDB(async function (req, res) {
        var jsonData = req.query.data ? JSON.parse(req.query.data) : req.query;
        var appProfile = jsonData.appProfile;
        var deviceProfile = jsonData.deviceProfile;
        var events = jsonData.events;
        if (appProfile == null || deviceProfile == null || events == null) {
            console.warn("post error")
            res.errData = "post error";
            return;
        }

        var userId = deviceProfile.deviceId;
        var appName = appProfile.appName || "unknown";

        var filter = {
            channel: appProfile.partner || "unknown",
            version: appProfile.version || "1.0",
            cloud: appProfile.cloud || "0",
            region: appProfile.lang || "0",// qqwry.searchIP(getClientIp(req).match(/\d+.\d+.\d+.\d+/)[0]).Country;
        };

        var channel = appProfile.partner || "unknown";
        var version = appProfile.version || "1.0";
        var cloud = appProfile.cloud || "0";
        var region = appProfile.lang || "0";// qqwry.searchIP(getClientIp(req).match(/\d+.\d+.\d+.\d+/)[0]).Country;

        //console.warn("v1 " + userId + " 0");
        const db = req.mongodb.db(appName);

        await initAppData(db);
        // 渠道版本关键字检测
        await checkConfigKey(db, "channel", filter.channel);
        // 版本关键字检测
        await checkConfigKey(db, "version", filter.version);
        // 云控关键字检测
        await checkConfigKey(db, "cloud", filter.cloud);
        // 云控关键字检测
        await checkConfigKey(db, "region", filter.region);

        let err, data;
        for (var i = 0; i < events.length; ++i) {
            var eventData = events[i];
            //console.log(eventData.id);
            if (eventData.id == "G2") {// 新增用户
                console.warn("New User " + userId);
                const collectionUser = db.collection("user");
                [err, data] = await to(collectionUser.findOne({ _id: userId }));
                if (err) { console.error(err); }
                else if (data == null) {
                    await toRes(collectionUser.insertOne({ _id: userId, firstTime: Date.now() }), res);
                    //console.warn("v1 " + userId + " 6");
                    //console.log("新增玩家", userId);
                    // 新增用户
                    //var now = Date.now();
                    //var inc = {};
                    //inc["new"] = 1;
                    //inc["new_h" + get24HoursIndex()] = 1;
                    //db.collection("userAnalytics").update({ _id: "d" + getDays(now) }, { $inc: inc }, { upsert: true }, function (err, result) {
                    //    if (err) return reject(err); else resolve();
                    //});
                } else {
                    console.log("已经存在的新增玩家", userId);
                }
            } else if (eventData.id == "G9") {// 内购验证
                var nowDay = getDays(Date.now());
                var mission = eventData.data.mission;
                var sku = eventData.data.name;
                var success = eventData.data.success;
                var value = eventData.data.value;
                var eventKey = sku;
                var eventValue = 0;
                if (success && value) {
                    var subscriptionId_token = value.split("@");
                    const params = {
                        packageName: "com.logame.eliminateintruder3d",
                        subscriptionId: subscriptionId_token[0],
                        token: subscriptionId_token[1]
                    };
                    [err, data] = await to(androidpublisher.purchases.subscriptions.get(params));
                    if (err) { console.error(err); continue }
                    console.log(data);
                    const isValid = data && data.data && data.data.purchaseState === 0;
                    if (isValid) {
                        eventValue = 1;
                    } else {
                        eventKey += "Fake";
                    }
                }
                await checkConfigKey(db, "event", eventKey);

                var incEvent = {};
                var incMission = {};
                incEvent["eventCount." + eventKey] = 1;
                incEvent["eventValue." + eventKey] = eventValue;

                incMission["eventCount." + eventKey] = 1;
                incMission["eventValue." + eventKey] = eventValue;

                // 对内购进行分类
                if (!success && value.indexOf("User canceled") != -1) {
                } else
                    console.warn("purchase ", sku, success, value);

                GetIncCache(appName, "event", Object.assign({ day: nowDay }, filter)).inc(incEvent);
                GetIncCache(appName, "mission", Object.assign({ mission: parseInt(mission), day: nowDay }, filter)).inc(incMission);
                GetIncCache(appName, "purchase", Object.assign({ mission: parseInt(mission), day: nowDay, sku: sku, success: success, msg: value }, filter)).inc(incMission);
            } else if (eventData.id == "G3") {// 用户登录
                const collectionUser = db.collection("user");
                [err, data] = await to(collectionUser.findOne({ _id: userId }));
                if (err) { console.error("check user " + err); continue }

                var now = Date.now();
                var nowDay = getDays(now);

                var isOldActive = false;
                var isActive = false;
                var hoursIndex = get24HoursIndex();
                var userData = data || {};

                // 访问次数
                var inc = {};
                inc["login"] = 1;
                inc["login_h" + hoursIndex] = 1;

                var set = {};
                set.lastTime = now;

                if (userData.firstTime == null || userData.lastTime == null) {
                    // 新增用户
                    isActive = true;
                    inc["new"] = 1;
                    inc["new_h" + hoursIndex] = 1;
                    set.firstTime = now;

                    Object.assign(set, filter);
                } else if (nowDay != getDays(userData.lastTime)) {
                    isActive = true;
                    isOldActive = true;
                }
                if (userData.channel == null) {
                    Object.assign(set, filter);
                }
                // 活跃
                if (isActive) {

                    inc.active = 1;
                    inc["active_h" + hoursIndex] = 1;
                }

                // 更新lastTime或新增User
                [err, data] = await to(collectionUser.updateOne({ _id: userId }, { $set: set }, { upsert: true }));
                if (err) { console.error("update user " + err); continue }

                // 更新userAnalytics
                GetIncCache(appName, "userAnalytics", Object.assign({ day: nowDay }, filter)).inc(inc);

                // 增加次留
                if (isOldActive) {
                    var firstDay = getDays(userData.firstTime);
                    var newDays = nowDay - firstDay;
                    if (newDays > 0 && newDays < 30) {
                        var inc = {};
                        inc["new_d" + newDays] = 1;// 次留
                        GetIncCache(appName, "userAnalytics", Object.assign({ day: firstDay }, filter)).inc(inc);
                    }
                }
            } else if (eventData.id == "G6") {// 关卡
                var nowDay = getDays(Date.now());
                var mission = eventData.data.mission;
                var custom = eventData.data.custom || {};

                var status = eventData.data.status;
                if (status == 1) {//任务进入
                    custom["missionEnter"] = 1;
                } else if (status == 2) {//任务成功
                    custom["missionSuccess"] = 1;
                    if (eventData.data.timeConsuming) custom["missionDuration"] = eventData.data.timeConsuming;
                } else if (status == 3) {//任务失败
                    custom["missionSuccess"] = 0;
                }

                for (var key in custom) {
                    await checkConfigKey(db, "event", key);
                }
                //const collectionUser = db.collection("user");
                //[err, data] = await to(collectionUser.findOne( { _id: userId }));
                //if (err) { console.error(err); continue }

                //var userData = data || {};
                //var eventTimeData = userData.eventTime || {};
                //var eventMissionData = userData.eventMission || {};

                //var updateUser = false;
                //var setUser = {};
                var incEvent = {};
                var incMission = {};
                for (var key in custom) {
                    //if (eventTimeData[key] != nowDay) {
                    //    updateUser = true;
                    //    setUser["eventTime." + key] = nowDay;
                    //    incEvent["eventUser." + key] = 1;
                    //    incMission["eventUser." + key] = 1;
                    //}
                    //if (eventMissionData[key] != mission) {
                    //    updateUser = true;
                    //    setUser["eventMission." + key] = mission;
                    //    incMission["eventUser." + key] = 1;
                    //}

                    incEvent["eventCount." + key] = 1;
                    incEvent["eventValue." + key] = custom[key];

                    incMission["eventCount." + key] = 1;
                    incMission["eventValue." + key] = custom[key];
                }

                GetIncCache(appName, "event", Object.assign({ day: nowDay }, filter)).inc(incEvent);
                GetIncCache(appName, "mission", Object.assign({ mission: parseInt(mission), day: nowDay }, filter)).inc(incMission);
                //if (updateUser) {
                //    [err, data] = await to(collectionUser.updateOne( { _id: userId }, { $set: setUser }, { upsert: true }));
                //    if (err) { console.error(err); }
                //}
            }
        }
        res.jsonData = 'ok';

        //console.log('received bot webhook'+JSON.stringify(data));
        // Make sure this is a page subscription
        /*if (data.object === 'page') {
            // Iterate over each entry - there may be multiple if batched
            data.entry.forEach(function (entry) {
                var pageID = entry.id;
                var timeOfEvent = entry.time;
                // Iterate over each messaging event
                entry.messaging.forEach(function (event) {
                    if (event.message) {
                        receivedMessage(event);
                    } else if (event.game_play) {
                        receivedGameplay(event);
                    } else {
                        console.log("Webhook received unknown event: ", event);
                    }
                });
            });
        }*/
    }));

    function getDays(time) { return Math.floor(time / (3600000 * 24)); }
    function get24HoursIndex() { return Math.floor(Date.now() / (3600000)) % 24; }
    function floatFixed2(value) { return parseFloat(value.toFixed(2)); }
    function floatFixed(value, fractionDigits) { return parseFloat(value.toFixed(fractionDigits, fractionDigits)); }

    function to(promise, errorExt) {
        return promise.then((data) => [null, data])
            .catch((err) => {
                if (errorExt) {
                    Object.assign(err, errorExt);
                }
                return [err, undefined];
            });
    }

    function toRes(promise, res) {
        return promise.then((data) => { res.jsonData = data; return data; })
            .catch((err) => {
                console.error(err);
                if (res.errData == null) res.errData = err.toString();
                else res.errData += err.toString();
                //}
                //res.json({ success: false, msg: "db error" + err.toString() });
                return undefined;
            });
    }

    function GetDBQuery(query, dbQuery) {
        query.dayEnd = parseInt(query.dayEnd) || getDays(Date.now());
        query.dayBegin = parseInt(query.dayBegin) || (query.dayEnd - 1);

        if (dbQuery == null) dbQuery = {};
        dbQuery.day = { "$gte": query.dayBegin, "$lte": query.dayEnd };
        if (query.channel != null) dbQuery.channel = query.channel;
        if (query.version != null) dbQuery.version = query.version;
        if (query.cloud != null) dbQuery.cloud = query.cloud;
        if (query.region != null) dbQuery.region = query.region;
        return dbQuery;
    }

    /*var _mongodb = new MongoClient(url, {
        reconnectTries: 3,
        autoReconnect: true,
        poolSize: 100,
        minSize: 10,
        connectTimeoutMS: 500,
        useNewUrlParser: true
    });
    _mongodb.connect(function (err, mongodb) {
        if (err) {
            _mongodb = null;
            console.err(err);
        } else console.log("DB is connected!");
    });*/

    var _mongodbs = [];
    var _dbCount = 0;
    async function popDB() {
        if (_mongodbs.length == 0) {
            _dbCount++;
            if (_dbCount > 100) return null;
            return await MongoClient.connect(url, { useNewUrlParser: true });
        } else
            return _mongodbs.shift();
    }
    function pushDB(db) {
        _mongodbs.push(db);
    }
    //pushDB(await popDB());
    routerGA.get('/dbcount', function (req, res) {
        res.json({ success: true, data: { total: _dbCount, free: _mongodbs.length } });
    });

    /*var _connecting = false;
    function dbConnect() {
        if (_mongodb === undefined) {
            _mongodb = new MongoClient(url, { useNewUrlParser: true });
            _mongodb.connect();
        }
        if (_mongodb.isConnected())
    
            return new Promise(function (resolve, reject) {
                if (_mongodb) resolve(_mongodb);
                else if (_connecting) {
                    reject("DB connecting");
                } else {
                    _connecting = true;
                    MongoClient.connect(url, { useNewUrlParser: true }, function (err, mongodb) {
                        _mongodb = mongodb;
                        _connecting = false;
                        if (err) return reject(err);
                        console.log("DB is connected!");
                        resolve(mongodb);
                    });
                }
            });
    }*/

    function initDB(func) {
        return async function (req, res) {
            var mongodb = await popDB();
            if (mongodb == null) {
                res.errData = "DB connection failed!";
                console.error(res.errData);
            } else if (!mongodb.isConnected()) {
                res.errData = "DB is connecting";
                console.error(res.errData);
                pushDB(mongodb);
            } else {
                req.mongodb = mongodb;
                Object.assign(req.query, req.body);
                var query = req.query;
                try {
                    if (query.appName) req.db = req.mongodb.db(query.appName);
                    //await initAppData(req.db);
                    await func(req, res);
                } catch (err) {
                    console.error("Exception catch: " + err, req.url, JSON.stringify(req.query));
                    if (res.errData == null) res.errData = err.toString();
                    else res.errData += err.toString();
                };
                pushDB(mongodb);
            }
            if (res.errData)
                res.json({ success: false, data: res.errData });
            else if (res.jsonData)
                res.json({ success: true, data: res.jsonData });
        }
    }

    async function initAppData(db) {
        var appName = db.databaseName;
        if (_appData[appName] !== undefined) return;
        var appData = {};
        var keysMap = { channel: {}, version: {}, cloud: {}, event: {}, region: {} };
        var keysArr = { channel: [], version: [], cloud: [], event: [], region: [] };

        let err, data;
        [err, data] = await to(db.collection("configKeys").find({}).toArray());
        if (err) {
            console.error(err);
        }
        else {
            // 因为keys有先后顺序 所以需要数组保存
            for (var i = 0, l = data.length; i < l; ++i) {
                var item = data[i];
                var keyItem = { key: item.key, enable: item.enable, name: item.name, sort: item.sort || i }
                keysMap[item.type][item.key] = keyItem;
                keysArr[item.type].push(keyItem);
            }
        }
        appData.keysMap = keysMap;
        appData.keysArr = keysArr;
        _appData[appName] = appData;
    }

    async function checkConfigKey(db, type, keys) {
        var appData = _appData[db.databaseName];
        var typeKeysMap = appData.keysMap[type];
        var separator = "-";
        if (type === "cloud") separator = "_";
        var arrKey = keys.split(separator);
        var key = "";
        for (var it of arrKey) {
            key += it;
            if (key.length > 0 && typeKeysMap[key] === undefined) {
                console.log("new key", type, key);
                var sort = appData.keysArr[type].length;
                typeKeysMap[key] = { key: key, enable: true, name: it, sort: sort };
                appData.keysArr[type].push(typeKeysMap[key]);
                let err, data;
                [err, data] = await to(db.collection("configKeys").updateOne({ type: type, key: key }, { $set: { enable: true, name: it, sort: sort } }, { upsert: true }));
                if (err) { console.error(err); }
            }
            key += separator;
        }
    }

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

    routerGA.get('/getkeys', initDB(async function (req, res) {
        await initAppData(req.db);
        var keysArr = _appData[req.query.appName].keysArr;
        res.jsonData = [
            { type: "channel", name: "渠道", keys: keysArr.channel },
            { type: "version", name: "版本", keys: keysArr.version },
            { type: "region", name: "区域", keys: keysArr.region },
            { type: "cloud", name: "云控", keys: keysArr.cloud },
            { type: "event", name: "事件", default: true, keys: keysArr.event }
        ];
    }));

    routerGA.post('/delkey', initDB(async function (req, res) {
        var query = req.query;
        await initAppData(req.db);

        var typeKeysMap = _appData[query.appName].keysMap[query.type];
        var typeKeysArr = _appData[query.appName].keysArr[query.type];
        if (typeKeysMap === undefined || typeKeysArr === undefined) {
            res.json({ success: false, err: "error delkey" });
            console.error("error delkey", query.type, query.keys);
        } else {
            let data = await toRes(req.db.collection("configKeys").deleteMany({ type: query.type, key: { "$in": query.keys } }), res);
            if (data) {
                for (const key of query.keys) {
                    var keyItem = typeKeysMap[key];
                    delete typeKeysMap[key];
                    var index = typeKeysArr.indexOf(keyItem);
                    if (index > -1) typeKeysArr.splice(index, 1);
                }
                res.jsonData = data;
            }
        }
    }));
    routerGA.post('/topkey', initDB(async function (req, res) {
        var query = req.query;
        await initAppData(req.db);

        var typeKeysMap = _appData[query.appName].keysMap[query.type];
        var typeKeysArr = _appData[query.appName].keysArr[query.type];
        if (typeKeysMap === undefined || typeKeysArr === undefined) {
            res.json({ success: false, err: "error delkey" });
            console.error("error delkey", query.type, query.keys);
        } else {
            var sortMin = 0;
            var sortMax = 0;
            for (const keyItem of typeKeysArr) {
                if (query.keys.indexOf(keyItem.key) != -1) {
                    if (sortMin > keyItem.sort) sortMin = keyItem.sort;
                } else {
                    if (sortMax < keyItem.sort) sortMax = keyItem.sort;
                }
            }
            var sortOffset = sortMin - sortMax - 1;

            for (const key of query.keys) {
                var keyItem = typeKeysMap[key];
                keyItem.sort += sortOffset;
            }

            await toRes(req.db.collection("configKeys").updateMany({ type: query.type, key: { "$in": query.keys } }, { $inc: { sort: sortOffset } }, { upsert: false }), res);
        }
    }));

    routerGA.get('/register', initDB(async function (req, res) {
        var query = req.query;
        var db = req.mongodb.db("analytics");
        const collectionAdmin = db.collection("admin");
        let err, data;
        [err, data] = await to(collectionAdmin.findOne({ username: query.username }));
        if (err) res.errData = err;
        else if (data == null) {
            [err, data] = await to(collectionAdmin.insertOne({ username: query.username, password: query.password, registerTime: Date.now() }));
            if (err) res.errData = err;
            else res.jsonData = "ok";
        } else {
            res.errData = "账号已经存在";
        }
    }));

    routerGA.get('/login', initDB(async function (req, res) {
        if (req.session == null) {
            res.errData = "session error";
            return;
        }
        var query = req.query;
        if (query.username == null || query.username.length < 2 || query.password == null || query.password < 6) {
            res.errData = "账号或密码错误(50)";
            return;
        }
        var dbQuery = { username: query.username, password: query.password };
        var db = req.mongodb.db("analytics");
        const collectionAdmin = db.collection("admin");
        let data = await collectionAdmin.findOne(dbQuery);
        if (data == null) {
            res.errData = "账号或密码错误(51)";
        }
        else {
            // 添加响应头
            res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
            res.setHeader("Access-Control-Allow-Credentials", true);
            req.session.username = query.username; // 登录成功，设置 session
            res.jsonData = "ok ";
        }
    }));

    routerGA.get('/logout', function (req, res) {
        //req.session.username = null;
        //res.redirect('login');
    });


    routerGA.get('/appList', initDB(async function (req, res) {
        if (req.session == null) {
            res.errData = "session error";
            return;
        }
        if (req.session.username == null) {
            res.errData = req.session;
            return;
        }
        const adminDb = req.mongodb.db('test').admin();
        let data = await toRes(adminDb.listDatabases(), res);
        if (data) {
            var list = [];
            for (var db of data.databases) {
                if (db.name == "helixball" || db.name == "local" || db.name == "admin") continue;
                if (req.session.username != "logame" && db.name != "DustSettle") continue;
                list.push({ name: db.name, sizeOnDisk: db.sizeOnDisk, icon: "static/icon/" + db.name + ".jpg" })
            }
            res.jsonData = list;
        }
    }));

    routerGA.get('/setkey', initDB(async function (req, res) {
        await initAppData(req.db);
        var query = req.query;
        var typeKeysMap = _appData[query.appName].keysMap[query.type];
        if (typeKeysMap === undefined || typeKeysMap[query.key] === undefined) {
            res.json({ success: false, err: "error setkey" });
            console.error("error setkey", query.type, query.key, query.name, query.enable);
        } else {
            var keyItem = typeKeysMap[query.key];
            if (query.enable != null) keyItem.enable = query.enable == "true";
            if (query.name != null) keyItem.name = query.name;
            if (query.sort != null) keyItem.sort = parseInt(query.sort);
            await toRes(req.db.collection("configKeys").updateOne({ type: query.type, key: query.key }, { $set: { enable: keyItem.enable, name: keyItem.name, sort: keyItem.sort } }, { upsert: true }), res);
        }
    }));

    //inform
    routerGA.get('/inform', initDB(async function (req, res) {
        var query = req.query;
        query.dayEnd = getDays(Date.now()) - 1;
        var dbQuery = GetDBQuery(query);

        let data = await toRes(req.db.collection("userAnalytics").find(dbQuery).toArray(), res);
        if (data) {
            var arrValue = [];
            var arrLogin = [];
            var arrNew = [];
            var arrActive = [];
            var arrTime = [];
            var index = 0;

            for (var i = query.dayBegin; i <= query.dayEnd; ++i) {
                arrValue[index] = 0;
                arrLogin[index] = 0;
                arrNew[index] = 0;
                arrActive[index] = 0;
                arrTime[index] = 0;
                index++;
            }

            for (var i = 0, l = data.length; i < l; ++i) {
                var item = data[i];
                var curDay = item.day - query.dayBegin;
                arrLogin[curDay] += item.login || 0;
                arrNew[curDay] += item.new || 0;
                arrActive[curDay] += item.active || 0;
                arrTime[curDay] += item.time || 0;
            }

            index = 0;
            for (var i = query.dayBegin; i <= query.dayEnd; ++i) {
                if (arrActive[index] == 0) arrTime[curDay] = 0;
                else arrTime[curDay] = Math.floor(arrTime[curDay] / arrActive[index]);
                index++;
            }

            data = await toRes(req.db.collection("event").find(dbQuery).toArray(), res);
            if (data) {
                for (var i = 0, l = data.length; i < l; ++i) {
                    var item = data[i]
                    var itemValue = item.eventValue || {};
                    var curDay = item.day - query.dayBegin;
                    arrValue[curDay] += (itemValue.diamonds001 || 0) * 0.99;
                    arrValue[curDay] += (itemValue.diamonds002 || 0) * 1.99;
                    arrValue[curDay] += (itemValue.diamonds003 || 0) * 2.99;
                }

                res.jsonData = {
                    time: getDays(Date.now()) * 3600000 * 24,
                    activeCount: arrActive[1], activeGrown: floatFixed((arrActive[1] - arrActive[0]) / (arrActive[0] || 1), 4),
                    newCount: arrNew[1], newGrown: floatFixed((arrNew[1] - arrNew[0]) / (arrNew[0] || 1), 4),
                    earnCount: floatFixed(arrValue[1], 2), earnGrown: floatFixed((arrValue[1] - arrValue[0]) / (arrValue[0] || 1), 4)
                };
            }
        }
    }));

    //realtime
    routerGA.get('/realtime', initDB(async function (req, res) {
        var query = req.query;
        var dbQuery = GetDBQuery(query);
        let data = await toRes(req.db.collection("userAnalytics").find(dbQuery).toArray(), res);
        if (data) {
            var categories = [];
            var arrLogin = [];
            var arrNew = [];
            var arrActive = [];

            var hoursIndex = get24HoursIndex();

            for (var i = 0; i < 24; ++i) {
                categories[i] = (hoursIndex + 1 + i) % 24;
                arrLogin[i] = 0;
                arrNew[i] = 0;
                arrActive[i] = 0;
            }

            for (var i = 0, l = data.length; i < l; ++i) {
                var item = data[i];
                if (item.day == query.dayBegin) {
                    var index = 0;
                    for (var h = hoursIndex + 1; h < 24; ++h) {
                        arrLogin[index] += item["login_h" + h] || 0;
                        arrNew[index] += item["new_h" + h] || 0;
                        arrActive[index] += item["active_h" + h] || 0;
                        index++;
                    }
                } else {
                    var index = 24 - hoursIndex - 1;
                    for (var h = 0; h <= hoursIndex; ++h) {
                        arrLogin[index] += item["login_h" + h] || 0;
                        arrNew[index] += item["new_h" + h] || 0;
                        arrActive[index] += item["active_h" + h] || 0;
                        index++;
                    }
                }
            }
            res.jsonData = { categories: categories, series: [{ name: "实时访问次数", data: arrLogin }, { name: "实时新增人数", data: arrNew }, { name: "实时活跃人数", data: arrActive }] };
        }
    }));

    //user
    routerGA.get('/user', initDB(async function (req, res) {
        var query = req.query;
        var dbQuery = GetDBQuery(query);
        let data = await toRes(req.db.collection("userAnalytics").find(dbQuery).toArray(), res);
        if (data) {
            var categories = [];
            var arrNewD = [];
            var arrLogin = [];
            var arrNew = [];
            var arrActive = [];
            var arrTime = [];
            var index = 0;
            for (var i = query.dayBegin; i <= query.dayEnd; ++i) {
                arrLogin[index] = 0;
                arrNew[index] = 0;
                arrActive[index] = 0;
                arrTime[index] = 0;
                index++;
            }

            for (var j = 0; j < 8; ++j) {
                var arr = [];
                arrNewD[j] = arr;
                index = 0;
                for (var i = query.dayBegin; i <= query.dayEnd; ++i) {
                    arr[index] = 0;
                    index++;
                }
            }

            for (var i = 0, l = data.length; i < l; ++i) {
                var item = data[i];
                var curDay = item.day - query.dayBegin;
                arrLogin[curDay] += item.login || 0;
                arrNew[curDay] += item.new || 0;
                arrActive[curDay] += item.active || 0;
                arrTime[curDay] += item.time || 0;
                for (var j = 1; j < 8; ++j)
                    arrNewD[j][curDay] += item["new_d" + j] || 0;
            }

            index = 0;
            for (var i = query.dayBegin; i <= query.dayEnd; ++i) {
                categories[index] = new Date(i * 3600000 * 24).getUTCDate();
                if (arrActive[index] == 0) arrTime[curDay] = 0;
                else arrTime[curDay] = Math.floor(arrTime[curDay] / arrActive[index]);
                var curNew = arrNew[index];
                if (curNew == 0) {
                    for (var j = 1; j < 8; ++j) arrNewD[j][index] = 0;
                } else {
                    for (var j = 1; j < 8; ++j) arrNewD[j][index] = floatFixed(arrNewD[j][index] / curNew, 4);
                }
                index++;
            }

            var series = [{ name: "访问次数", data: arrLogin }, { name: "活跃人数", data: arrActive }, { name: "人均时长", data: arrTime }, { name: "新增人数", data: arrNew }];
            var arrNewName = ["新增人数", "次日留存", "二日留存", "三日留存", "四日留存", "五日留存", "六日留存", "七日留存"];
            for (var j = 1; j < 8; ++j) {
                series.push({ name: arrNewName[j], data: arrNewD[j] });
            }

            res.jsonData = { categories: categories, series: series };
        }
    }));

    // 留存
    routerGA.get('/retention', initDB(async function (req, res) {
        var query = req.query;
        var dbQuery = GetDBQuery(query);
        let data = await toRes(req.db.collection("userAnalytics").find(dbQuery).toArray(), res);
        if (data) {
            var arrNewD = [];
            var arrNew = [];
            //var arrActive = [];
            var series = [];
            var index = 0;

            for (var i = query.dayBegin; i <= query.dayEnd; ++i) {
                arrNew[index] = 0;
                //arrActive[index] = 0;
                arrNewD[index] = [0, 0, 0, 0, 0, 0, 0, 0];
                index++;
            }

            for (var i = 0, l = data.length; i < l; ++i) {
                var item = data[i];
                var curDay = item.day - query.dayBegin;
                arrNew[curDay] += item.new || 0;
                //arrActive[curDay] += item.active || 0;
                for (var j = 1; j < 8; ++j)
                    arrNewD[curDay][j] += item["new_d" + j] || 0;
            }

            index = 0;
            for (var i = query.dayBegin; i <= query.dayEnd; ++i) {
                var curNew = arrNew[index];
                arrNewD[index][0] = 1;
                if (curNew == 0) {
                    for (var j = 1; j < 8; ++j) arrNewD[index][j] = 0;
                } else {
                    for (var j = 1; j < 8; ++j) arrNewD[index][j] = floatFixed(arrNewD[index][j] / curNew, 4);
                }
                series.push({ name: new Date(i * 3600000 * 24).getUTCDate() + "日", data: arrNewD[index] });
                index++;
            }

            res.jsonData = { categories: ["首日", "次日留存", "二日留存", "三日留存", "四日留存", "五日留存", "六日留存", "七日留存"], series: series };
        }
    }));

    //mission
    /*app.get('/ga/mission', initDB(async function (req, res) {
        var query = req.query;
        var dbQuery = GetDBQuery(query);
    
        var missionBegin = parseInt(query.mission) || 1;
        var missionEnd = missionBegin + (parseInt(query.missionCount) || 50);
        dbQuery.mission = { "$gte": missionBegin, "$lte": missionEnd };
    
        let data = await toRes(req.db.collection("mission").find(dbQuery).toArray(), res);
        if (data) {
            var categories = [];
            var arrSuccess = [];
            var arrFail = [];
            var arrTime = [];
            var successKey = "count_2";
            var timeKey = "time_2";
            var failKey = "count_3";
            var index = 0;
    
            for (var i = missionBegin; i <= missionEnd; ++i) {
                categories[index] = i;
                arrFail[index] = 0;
                arrSuccess[index] = 0;
                arrTime[index] = 0;
                index++;
            }
    
            for (var i = 0, l = data.length; i < l; ++i) {
                var item = data[i];
                var curMission = item.mission - missionBegin;
                arrFail[curMission] += item[failKey] || 0;
                arrSuccess[curMission] += item[successKey] || 0;
                arrTime[curMission] += item[timeKey] || 0;
            }
    
            var arrCount = [];
            var arrSuccessRate = [];
            var arrEntryRate = [];
            var arrConversionRate = [];
            var conversions = arrSuccess[0];
    
            var count = missionEnd - missionBegin + 1;
            for (var i = 0; i < count; ++i) {
                arrCount[i] = arrFail[i] + arrSuccess[i];
                if (arrSuccess[i] <= 0) {
                    arrSuccessRate[i] = 0;
                    arrEntryRate[i] = 0;
                    arrConversionRate[i] = 0;
                    arrTime[i] = 0;
                } else {
                    arrSuccessRate[i] = floatFixed2(arrSuccess[i] / arrCount[i]);
                    arrEntryRate[i] = floatFixed2(arrSuccess[i] / arrSuccess[0]);
                    arrConversionRate[i] = floatFixed2(arrSuccess[i] / conversions);
                    arrTime[i] = Math.floor(arrTime[i] / arrSuccess[i]);
                }
                conversions = arrSuccess[i];
            }
            res.jsonData =  { categories: categories, series: [{ name: "通关率", data: arrSuccessRate }, { name: "进入率", data: arrEntryRate }, { name: "转化率", data: arrConversionRate }, { name: "通关时间", data: arrTime }, { name: "关卡次数", data: arrCount }] };
        }
    }));*/

    //event
    routerGA.get('/getevent', initDB(async function (req, res) {
        await initAppData(req.db);
        var query = req.query;
        var dbQuery = GetDBQuery(query);

        var eventName = query.event || query.name || "missionSuccess";
        var isMission = query.mission != null;
        if (isMission) {
            query.missionBegin = parseInt(query.missionBegin) || 1;
            query.missionEnd = parseInt(query.missionEnd) || query.missionBegin;
        }

        var categories = [];
        var categoryCount = 0;
        if (isMission) {
            dbQuery.mission = { "$gte": query.missionBegin, "$lte": query.missionEnd };
            for (var i = query.missionBegin; i <= query.missionEnd; ++i) {
                categories[categoryCount] = i;
                categoryCount++;
            }
        } else {
            for (var i = query.dayBegin; i <= query.dayEnd; ++i) {
                categories[categoryCount] = new Date(i * 3600000 * 24).getUTCDate();
                categoryCount++;
            }
        }

        let data = await toRes(req.db.collection(isMission ? "mission" : "event").find(dbQuery).toArray(), res);
        if (data) {
            var arrValue = [];
            var arrCount = [];
            //var arrUser = [];
            var arrAverageValue = [];
            //var arrPerCapitaValue = [];
            //var arrPerCapitaCount = [];

            for (var i = 0; i < categoryCount; ++i) {
                arrValue[i] = 0;
                arrCount[i] = 0;
                //arrUser[i] = 0;
                arrAverageValue[i] = 0;
                //arrPerCapitaValue[i] = 0;
                //arrPerCapitaCount[i] = 0;
            }

            for (var i = 0, l = data.length; i < l; ++i) {
                var item = data[i]
                var itemValue = item.eventValue || {};
                var itemCount = item.eventCount || {};
                //var itemUser = item.eventUser || {};

                var curCategory = isMission ? (item.mission - query.missionBegin) : (item.day - query.dayBegin);
                arrValue[curCategory] += itemValue[eventName] || 0;
                arrCount[curCategory] += itemCount[eventName] || 0;
                //arrUser[curCategory] += itemUser[eventName] || 0;
            }

            for (var i = 0; i < categoryCount; ++i) {
                if (arrCount[i] > 0) arrAverageValue[i] = floatFixed2(arrValue[i] / arrCount[i]);
                //if (arrUser[i] > 0) {
                //    arrPerCapitaValue[i] = floatFixed2(arrValue[i] / arrUser[i]);
                //    arrPerCapitaCount[i] = floatFixed2(arrCount[i] / arrUser[i]);
                //}
            }

            var series = [];
            series.push({ name: "总值", data: arrValue });
            series.push({ name: "总次数", data: arrCount });
            //series.push({ name: "总人数", data: arrUser });
            series.push({ name: "平均值", data: arrAverageValue });
            //series.push({ name: "人均值", data: arrPerCapitaValue });
            //series.push({ name: "人均次数", data: arrPerCapitaCount });

            if (!isMission) {
                data = await toRes(req.db.collection("userAnalytics").find(dbQuery).toArray(), res);
                if (data) {
                    var arrActive = [];
                    var arrPerActiveValue = [];
                    var arrPerActiveCount = [];
                    //var arrPerActiveUser = [];

                    for (var i = 0; i < categoryCount; ++i) {
                        arrActive[i] = 0;
                        arrPerActiveValue[i] = 0;
                        arrPerActiveCount[i] = 0;
                        //arrPerActiveUser[i] = 0;
                    }
                    for (var i = 0, l = data.length; i < l; ++i) {
                        var item = data[i];
                        var curDay = item.day - query.dayBegin;
                        arrActive[curDay] += item.active || 0;
                    }

                    for (var i = 0; i < categoryCount; ++i) {
                        arrPerActiveValue[i] = floatFixed(arrValue[i] / arrActive[i], 4);
                        arrPerActiveCount[i] = floatFixed(arrCount[i] / arrActive[i], 4);
                        //arrPerActiveUser[i] = floatFixed(arrUser[i] / arrActive[i], 4);
                    }
                    series.push({ name: "日活人数", data: arrActive });
                    series.push({ name: "日活均值", data: arrPerActiveValue });
                    series.push({ name: "日活均次", data: arrPerActiveCount });
                    //series.push({ name: "日活跃度", data: arrPerActiveUser });

                    res.jsonData = { categories: categories, series: series };
                }
            } else {
                res.jsonData = { categories: categories, series: series };
            }
        }
    }));

    function Rate(values, weights) {
        this.values = values;
        this.weights = weights;
        this.max = 0;
        for (var i = 0, l = this.weights.length; i < l; ++i) {
            this.max += this.weights[i];
        }

        this.rndValue = function () {
            var valueMax = 0;
            var value = Math.random() * this.max;
            //console.log(value, this.max, this.weights.length, this.weights);
            for (var i = 0, l = this.weights.length; i < l; ++i) {
                valueMax += this.weights[i];
                if (valueMax >= value)
                    return this.values[i];
            }
            return this.values[0];
        };
    }

    function initCloudData(appCloudData, cloudParameters, cloudCombines) {
        var cloudData = {};
        var cloudRandomData = {};
        var cloudRandomList = [];
        var cloudRandomWeights = [];
        for (const key in cloudParameters) {
            const element = cloudParameters[key];
            if (element.enable) {
                cloudData[key] = element.default;
            }
        }
        for (const key in cloudParameters) {
            const element = cloudParameters[key];
            if (element.enable && element.test) {
                var weight = (element.weight || 1) / element.test.length;
                for (var j = 0; j < element.test.length; ++j) {
                    cloudRandomList.push(element.id + "_" + j);
                    cloudRandomWeights.push(weight);
                    var newCloudData = {};//Object.assign({}, cloudData);
                    newCloudData[key] = element.test[j];
                    cloudRandomData[element.id + "_" + j] = newCloudData;
                }
            }
        }
        for (const key in cloudCombines) {
            const element = cloudCombines[key];
            cloudRandomList.push(key);
            cloudRandomWeights.push(element.weight || 1);
            cloudRandomData[key] = element.data;
        }
        appCloudData.cloudData = cloudData;
        appCloudData.cloudRandomData = cloudRandomData;
        appCloudData.cloudRate = new Rate(cloudRandomList, cloudRandomWeights);
    }

    var appsCloudData = {};
    appsCloudData.MergeTowerShoot = {}
    appsCloudData.DustSettle = {}

    initCloudData(appsCloudData.DustSettle, {
        enablePurchase: { id: "ep", enable: true, default: true },// 开启内购
        enablePropWeapon: { id: "ew", enable: true, default: true },// 开启武器
        interstitialLevel: { id: "il", enable: true, default: 7 },
        interstitialMinTime: { id: "it", enable: true, default: 30, test: [15, 20, 25, 30, 35, 40, 45], weight: 1 }, //插屏最少游戏时长/秒
        showInterstitial: { id: "si", enable: true, default: true },// 已废弃
        interstitialX: { id: "ix", enable: true, default: 1 },
        interstitialY: { id: "iy", enable: true, default: 0 },
        recommendPowerRate: { id: "rp", enable: true, default: 0.003 },//推荐战力系数
        difficultyRate: { id: "dr", enable: true, default: 0.75, test: [0.7, 0.72, 0.74, 0.76, 0.78, 0.8], weight: 1 },//难度系数
        boosLifeRate: { id: "bl", enable: true, default: 8, test: [7, 7.3, 7.6, 7.9, 8.2, 8.5], weight: 1 },//Boss的生命值系数
        enemyLifeRate: { id: "el", enable: false, default: 3 },//敌人的生命值系数（DPS*系数）
        enemyLifeMinRate: { id: "eln", enable: false, default: 2 },//敌人的生命值最小系数（DPS*系数）
        enemyLifeMaxRate: { id: "elx", enable: false, default: 12 }//敌人的生命值最大系数（DPS*系数）
    }, {
        c_0: { data: {}, weight: 1 },
        c_1: { data: { interstitialMinTime: 15, difficultyRate: 0.74, boosLifeRate: 7 }, weight: 4 },
    });

    initCloudData(appsCloudData.MergeTowerShoot, {
        /*BossLifeRate: { id: "blr", enable: true, default: "1.0" },// XX
        RecycleUpgradeTimeDuration: { id: "rutd", enable: true, default: "900", },// XX
        MergeUpgradeTimeDuration: { id: "mutd", enable: true, default: "300", },// XX
        UpgradeChanceAccurate: { id: "uca", enable: true, default: "1.0", },// XX
        MergeUpgradeAccurate: { id: "mca", enable: true, default: "1.0", },// XX
        LevelBossLifeRate: { id: "lblr", enable: true, default: [{ "8": "1.5" }, { "18": "2" }], },// XX
        useInterstitialAd: { id: "utad", enable: true, default: 1, test: [1, 0], weight: 1 },// XX
        adTimes: { id: "adt", enable: true, default: 120, },// XX
        dynamicHP: { id: "dhp", enable: true, default: 1, test: [1, 0], weight: 1 }// XX*/
    }, {
        c_0: { data: { useInterstitialAd: 1 }, weight: 1 },
        c_1: { data: { useInterstitialAd: 0, dynamicHP: 1, dynamicHPValue: 3, dynamicHPStartLevel: 1, fixcoin: 5 }, weight: 1 },
    });

    // config
    async function getConfig(req, res) {
        let query = (req.query && req.query.appName) ? req.query : req.body;
        let level = parseInt(query.level) || 1;
        let version = parseFloat(query.version) || 1;
        let bundleVersion = parseFloat(query.bundleVersion) || 1;
        var channel = query.channel || "unknown";
        let cloud = query.cloud || "0";
        let region = query.lang || "0" //qqwry.searchIP(getClientIp(req).match(/\d+.\d+.\d+.\d+/)[0]).Country;
        let debug = query.debug === 1 || query.debug === true;

        let data = {};
        let appCloudData = appsCloudData[query.appName];
        if (appCloudData != null) {
            data.cloud = cloud;
            if (cloud === "0" || appCloudData.cloudRate.values.indexOf(cloud) == -1) {
                data.cloud = appCloudData.cloudRate.rndValue();
            }
            data.cloudVersion = getDays(Date.now()).toString();
            Object.assign(data, appCloudData.cloudData, appCloudData.cloudRandomData[data.cloud]);
        }

        if (query.appName == "MergeTowerShoot") {
        } else if (query.appName == "DustSettle") {

            //data.skus = [{ sku: "diamonds001", originCount: 100, count: 200, price: "$ 0.99" },
            //{ sku: "diamonds002", originCount: 500, count: 1000, price: "$ 1.99" },
            //{ sku: "diamonds003", originCount: 800, count: 9999, price: "$ 2.99" }];

            // 中国区IOS关闭内购
            if (region === "ChineseSimplified" && query.channel === "apple") {
                data.enablePurchase = false;
            }
            // 编辑器强开
            if (query.channel === "editor") {
                data.enablePurchase = true;
                data.enableSkin = true;
                data.interstitialLevel = 7;
            }
            if (version >= 1.19) {
                data.enableSkin = true;
            }
            data.enablePurchase = true;

            data.spin = [
                [0.35, 0.1, 0.05, 0.3, 0.05, 0.3, 0.2, 0],
                [0.3, 0.1, 0.05, 0.2, 0.05, 0.3, 0.2, 0],
                [0.3, 0.15, 0.1, 0.2, 0.08, 0.3, 0.2, 0],
                [0.3, 0.2, 0.15, 0.2, 0.08, 0.3, 0.2, 0.1]
            ];

            //data.fakeAdRate = 1;
            //data.ad = [{ title: "", content: "", image: "https://api.unityjs.net/ad0.jpg", url: "https://www.facebook.com" }];;
            //data.push = [];
            //data.notice = [];
            //data.notification = [/*{ title: "通知", content: "你很久没玩游戏啦，快来领取你的金币!", time: time }*/];

            /*var time = ((Date.now() / 1000 + 8 * 3600 + 300) % (3600 * 24));
            var h = Math.floor(time / 3600);
            var m = Math.floor(time / 60) % 60;
            var s = Math.floor(time) % 60;*/
            /*if (bundleVersion == 1.29) {
                data.push = [{ id: 1,  title: "一次性测试", content: "点击后不再出现", button: "10钻", image: "https://api.unityjs.net/dustsettle.jpg",  tag: "New", diamond: 10
                }, { title: "战力提升！", content: "你的新机体到了", button: "签收", image: "https://api.unityjs.net/dustsettle.jpg", tag: "New"
                }, {//video: "https://vd4.bdstatic.com/mda-ji0g4r6a6kqyjrxm/sc/mda-ji0g4r6a6kqyjrxm.mp4", 
                    title: "视频测试", content: "这是一个测试", button: "试玩", video: "https://mp4.vjshi.com/2017-05-27/5f4c9548e01dc9cd83169cc18fee7ce9.mp4", tag: "Ad", }];
                data.notice = [
                    { id: 1, title: "版本更新通告", content: "V1.29版本\n新增了两种机体\n优化了UI界面", button: "确定", cancel: null, },
                    //{ id: 2, title: null, content: "感谢你的测试，赠送你1k个钻石，这个第二条消息"/*，后台通告会在" + h + ":" + m + ":" + s + "弹出", coin: "1k", button: "领取", cancel: null, },
                    //{ id: 3, title: "你好！", content: "感谢你的测试，赠送你10点体力，这个第三条消息", energy: 10, button: "领取", cancel: null, },
                ];
                if (channel == "apple") {
                    data.push[1].url = "itms-apps://itunes.apple.com/cn/app/id1461500552";
                    data.push[2].url = "itms-apps://itunes.apple.com/cn/app/id1461500552";
                    //data.notice[0].url = "itms-apps://itunes.apple.com/cn/app/id1461500552";
                    //data.notice[1].url = "itms-apps://itunes.apple.com/cn/app/id1461500552";
                } else {
                    data.push[1].url = "market://details?id=com.logame.eliminateintruder3d";
                    data.push[2].url = "market://details?id=com.logame.eliminateintruder3d";
                    //data.notice[0].url = "market://details?id=com.logame.eliminateintruder3d";
                    //data.notice[1].url = "market://details?id=com.logame.eliminateintruder3d";
                }
            } else if (bundleVersion == 1.28) {
                data.push = [{ title: "视频测试", content: "这是一个测试", button: "试玩", video: "https://mp4.vjshi.com/2017-05-27/5f4c9548e01dc9cd83169cc18fee7ce9.mp4", tag: "Ad" }];
     
                data.notice = [{ title: "通知", content: "请更新版本，最新版本 1.29", button: "更新", cancel: null, }];
                if (channel == "apple") {
                    data.push[0].url = "itms-apps://itunes.apple.com/cn/app/id1461500552";
                    data.notice[0].url = "itms-apps://itunes.apple.com/cn/app/id1461500552";
                } else {
                    data.push[0].url = "market://details?id=com.logame.eliminateintruder3d";
                    data.notice[0].url = "market://details?id=com.logame.eliminateintruder3d";
                }
            }*/

        }
        res.json(data);
    }
    routerAPI.post('/g/config', getConfig);
    routerAPI.get('/g/config', getConfig);

}