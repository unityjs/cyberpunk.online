var request = require('request');
var pg = require('pg');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://huihui:qwer1234@cluster0-v7xge.mongodb.net/test?retryWrites=true';

module.exports = function (app) {
    var apps = [];
    var gamerCount = 0;

    saveLogDataAsync = function (content) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, { useNewUrlParser: true }, function (err, mongodb) {
                const collection = mongodb.db("helixball").collection("logs");
                collection.insert({ time: new Date(), content: content }, { safe: true }, function (err, result) {
                    mongodb.close();
                    if (err) reject(err);
                    resolve();
                });
            });
            /*pg.connect(process.env.DATABASE_URL, function (err, client, done) {
                client.query('INSERT INTO logs (time, content) VALUES (NOW(), $1::text)', [content], function (err, result) {
                    done();
                    if (err) reject(err);
                    resolve();
                });
            });*/
        });
    };

    getLogDataAsync = function (data) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, { useNewUrlParser: true }, function (err, mongodb) {
                const collection = mongodb.db("helixball").collection("logs");
                collection.find().toArray(function (err, docs) {
                    mongodb.close();
                    if (err) reject(err);
                    resolve(docs);
                });
            });
            /*pg.connect(process.env.DATABASE_URL, function (err, client, done) {
                client.query('SELECT * FROM logs', [], function (err, result) {
                    done();
                    if (err) reject(err);
                    resolve(result.rows);
                });
            });*/
        });
    };

    app.get('/log', function (request, response) {
        saveLogDataAsync(JSON.stringify(request.query))
            .then(function (result) {
                response.json({ 'success': true });
            }).catch(function (err) { response.json({ 'success': false, 'error': err }); });
    });

    app.get('/getlog', function (request, response) {
        getLogDataAsync()
            .then(function (result) {
                //for(var i=0;i<result.length; ++i)
                response.json(result);
            }).catch(function (err) {
                response.json({ 'success': false, 'error': err });
            });
    });

    app.get('/mysql', function (request, response) {
        pg.connect(process.env.DATABASE_URL, function (err, client, done) {
            client.query(request.query['sql'], [], function (err, result) {
                if (err) response.json({ 'success': false, 'error': err });
                else response.json({ 'success': true, 'rows': result });
            });
        });
    });

    moveDataAsync = function (data) {
        return new Promise(function (resolve, reject) {
            pg.connect(process.env.DATABASE_URL, function (err, client, done) {
                client.query("SELECT * FROM user_" + apps[0] + " order by msgTime asc limit 1", [], function (err, pg_result) {

                    if (err || pg_result == null || pg_result.rows.length === 0) {
                        done();
                        return reject(err);
                    }
                    else {
                        var deleteData = pg_result.rows[0];
                        client.query("DELETE FROM user_" + apps[0] + " WHERE id = $1::text", [deleteData.id], function (err, result) {
                            done();
                            if (err) return reject(err);

                            MongoClient.connect(url, { useNewUrlParser: true }, function (err, mongodb) {
                                const collection = mongodb.db("helixball").collection("user");
                                collection.findOneAndUpdate({ id: deleteData.id }, { $set: { firstTime: deleteData.firsttime, msgTime: deleteData.msgtime, msgCount: deleteData.msgcount } }, { safe: true }, function (err, result) {
                                    if (err) {
                                        mongodb.close();
                                        return reject(err);
                                    }
                                    console.log("move Data OK", deleteData.id, deleteData.firsttime, deleteData.lasttime, deleteData.msgtime, deleteData.msgcount);
                                    if (result.value == null) {
                                        collection.insert({
                                            id: deleteData.id, firstTime: deleteData.firsttime, lastTime: deleteData.lasttime,
                                            msgTime: deleteData.msgtime, msgCount: deleteData.msgcount, session: null
                                        }, { safe: true }, function (err, result) {
                                            mongodb.close();
                                            if (err) reject(err); else resolve();
                                        });
                                    } else resolve();
                                });
                            });
                        });
                    }
                });
            });
        });
    };

    moveData = function (deleteCount, response) {
        if (deleteCount > 0) {
            moveDataAsync().then(function (result) {
                deleteCount--;
                if (deleteCount > 0) moveData(deleteCount, response);
                else response.json("OK");
            }).catch(function (err) {
                response.json({ 'success': false, 'error': err });
            });
        }
    }

    app.get('/move', function (request, response) {
        moveData(request.query['count'], response);
    });

    //
    // GET /bot
    //
    app.get('/bot', function (request, response) {
        if (request.query['hub.mode'] === 'subscribe' && request.query['hub.verify_token'] === process.env.BOT_VERIFY_TOKEN) {
            console.log("Validating webhook");
            response.status(200).send(request.query['hub.challenge']);
        } else {
            console.error("Failed validation. Make sure the validation tokens match.");
            response.sendStatus(403);
        }
    });

    //
    // POST /bot
    //
    app.post('/bot', function receiveBot(request, response) {
        var data = request.body;
        //console.log('received bot webhook'+JSON.stringify(data));
        // Make sure this is a page subscription
        if (data.object === 'page') {
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
        }
        response.sendStatus(200);
    });

    //
    // Handle messages sent by player directly to the game bot here
    //
    function receivedMessage(event) {
    }

    //
    // Handle game_play (when player closes game) events here. 
    //
    function receivedGameplay(event) {
        // Page-scoped ID of the bot user
        var senderId = event.sender.id;
        var playerId = event.game_play.player_id;
        var contextId = event.game_play.context_id;
        var gameId = event.game_play.game_id;
        // Check for payload
        /*if (event.game_play.payload) {
            //
            // The variable payload here contains data set by
            // FBInstant.setSessionData()
            //
            var payload = JSON.parse(event.game_play.payload);
    
            // In this example, the bot is just "echoing" the message received
            // immediately. In your game, you'll want to delay the bot messages
            // to remind the user to play 1, 3, 7 days after game play, for example.
            addSender(gameId, senderId, payload);
        }else{
            addSender(gameId, senderId, undefined);
        }*/
        if (apps.indexOf(gameId) == -1) {
            console.log("Unkonwn app: " + gameId);
            return;
        }

        saveUserLogoutDataAsync(gameId, senderId, event.game_play.payload).then(function () { }).catch(function (err) { console.log(err); });
    }

    // 28天时间内可以查询日活跃
    saveUserLogoutDataAsync = function (appId, userId, sessionData) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, { useNewUrlParser: true }, function (err, mongodb) {
                var nowDate = new Date();
                var msgTime = new Date();
                //if (userId === "2221877344523107") { console.log("TEST ID!!!", userId); msgTime.setMinutes(msgTime.getMinutes() + 1); } // 测试 id 
                //else msgTime.setDate(msgTime.getDate() + 1);
                msgTime.setMinutes(msgTime.getMinutes() + 1);
                //console.log(userId, result.databases.length);
                const collection = mongodb.db("helixball").collection("player");
                collection.findOneAndUpdate({ _id: userId }, { $set: { lastTime: nowDate, msgTime: msgTime, msgCount: 0, session: sessionData } }, { safe: true }, function (err, result) {
                    if (err) {
                        mongodb.close();
                        return reject(err);
                    }
                    //console.log("findOneAndUpdate", userId, msgTime);
                    if (result.value == null) {
                        collection.insert({ _id: userId, firstTime: nowDate, lastTime: nowDate, msgTime: msgTime, msgCount: 0, session: sessionData }, { safe: true }, function (err, result) {
                            mongodb.close();
                            if (err) reject(err); else resolve();
                        });
                    } else resolve();
                });
            });

            /*pg.connect(process.env.DATABASE_URL, function (err, client, done) {
                client.query('SELECT * FROM user_' + appId + ' WHERE id = $1::text', [userId], function (err, result) {
                    if (err) reject(err);
                    if (result.rows.length > 0) {
                        client.query("UPDATE user_" + appId + " SET lastTime = NOW(), msgTime = (NOW() + interval '1 D'), msgCount = 0, sessionData = $2::text WHERE id = $1::text", [userId, sessionData], function (err, result) {
                            if (err) reject(err);
                            //else if(userId === "2221877344523107"){// 测试 id 
                                client.query("UPDATE user_"+appId+" SET msgTime = $2::timestamp WHERE id = $1::text", [userId, new Date()], function(err, result) {
                                    if (err) console.log(err);
                                });
                            }//
                            done();
                            resolve();
                        });
                    } else {
                        client.query("INSERT INTO user_" + appId + " (id, firstTime, lastTime, msgTime, msgCount, sessionData) VALUES ($1::text, NOW(), NOW(), (NOW() + interval '1 D'), 0, $2::text)", [userId, sessionData], function (err, result) {
                            gamerCount++;
                            if (err) reject(err);
                            done();
                            resolve();
                        });
                    }
                });
            });*/
        });
    };

    // 获取最先发送Messages的对象
    getUserMessagesAsync = function (appId) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, { useNewUrlParser: true }, function (err, mongodb) {
                const collection = mongodb.db("helixball").collection("player");
                collection.findOne({}, { sort: { 'msgTime': 1 }, limit: 1 }, function (err, result) {
                    mongodb.close();
                    if (err) return reject(err);
                    else resolve(result);
                });
            });

            /*pg.connect(process.env.DATABASE_URL, function (err, client, done) {
                client.query("SELECT * FROM user_" + appId + " order by msgTime asc limit 1", [], function (err, result) {
                    done();
                    if (err || result == null || result.rows.length === 0) {
                  
                    }
                    else resolve(result.rows[0]);
                });
            });*/
        });
    };


    updateUserMessagesTimeAsync = function (appId, userId, msgCount, msgTime) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, { useNewUrlParser: true }, function (err, mongodb) {
                const collection = mongodb.db("helixball").collection("player");
                collection.update({ _id: userId }, { $set: { msgTime: msgTime, msgCount: msgCount } }, { safe: true }, function (err, result) {
                    mongodb.close();
                    if (err) reject(err); else resolve();
                });
            });

            /*pg.connect(process.env.DATABASE_URL, function (err, client, done) {
                client.query('DELETE user_' + appId + ' WHERE id = $1::text', [userId, msgTime], function (err, result) {
                    done();
                    /*if (err) {
      
    
                    }
                    else/ {
                        MongoClient.connect(url, { useNewUrlParser: true }, function (err, mongodb) {
                            const collection = mongodb.db("helixball").collection("user");
                            collection.find({ id: userId }, { safe: true }, function (err, result) {
                                if (err) {
                                    mongodb.close();
                                    return reject(err);
                                }
                                var nowDate = new Date();
                                //var msgTime = new Date();
                                //msgTime.setDate(msgTime.getDate() + 1);
                                if (result.databases.length > 0) {
                                    collection.update({ id: userId }, { $set: { msgTime: msgTime, msgCount: msgCount } }, { safe: true }, function (err, result) {
                                        mongodb.close();
                                        if (err) reject(err); else resolve();
                                    });
                                } else {
                                    collection.insert({ id: userId, firstTime: nowDate, lastTime: nowDate, msgTime: msgTime, msgCount: msgCount, session: null }, { safe: true }, function (err, result) {
                                        mongodb.close();
                                        if (err) reject(err); else resolve();
                                    });
                                }
                            });
                        });
                    }
                });
                client.query('UPDATE user_' + appId + ' SET msgCount = (msgCount + 1), msgTime = $2::timestamp WHERE id = $1::text', [userId, msgTime], function (err, result) {
                    done();
                    if (err) reject(err);
                    resolve();
                });
            });*/
        });
    };

    function messageNext(appId) {
        getUserMessagesAsync(appId).then(function (result) {
            if (result == null)
                setTimeout(messageNext, 10000, appId);
            else {
                //console.log("getUserMessagesAsync", result.id, result.msgTime, result.time);
                messageWait(appId, result);
            }
        }).catch(function (err) { console.log(err); });
    }

    var lastMessageID;
    function messageWait(appId, data) {
        var msgTime = new Date(data.msgTime);
        if (Date.now() > msgTime.getTime()) {
            var userID = data._id;
            var msgCount = data.msgCount;
            //console.log("Send Message: ", data);
            var time = new Date();
            if (msgCount === 0) time.setDate(time.getDate() + 1);//第2次 第2天
            else if (msgCount === 1) time.setDate(time.getDate() + 1);//第3次 第3天
            else if (msgCount === 2) time.setDate(time.getDate() + 1);//第4次 第5天
            else if (msgCount === 3) time.setDate(time.getDate() + 1);//第5次 第7天
            else time.setDate(time.getDate() + 10);// 第100天
            // Update DB message
            updateUserMessagesTimeAsync(appId, userID, msgCount + 1, time).then(function () {
                // Send bot message
                console.log('Send bot message ', userID, data.msgTime, msgCount);
                if (lastMessageID != userID)
                    sendBotMessage(appId, userID, null, "", msgCount, null);
                else console.error("error: same ID!!!");// 保险
                lastMessageID = userID;
                setTimeout(messageNext, 500, appId);
            }).catch(function (err) { console.log(err); });
        } else {
            console.log('Waitting Send bot message ', data._id, data.msgTime, data.msgCount);
            setTimeout(messageNext, 10000, appId);
        }
    }

    app.get('/gamer', function (request, response) {
        response.status(200).send(gamerCount.toString());
    });

    //
    // Send bot message
    //
    // player (string) : Page-scoped ID of the message recipient
    // context (string): FBInstant context ID. Opens the bot message in a specific context
    // message (string): Message text
    // cta (string): Button text
    // payload (object): Custom data that will be sent to game smessaging_typeession
    // 
    function sendBotMessage(gameId, recipientID, context, msgCount, payload) {
        var button = {
            type: "game_play",
            title: "PLAY NOW"
        };

        if (context) {
            button.context = context;
        }
        if (payload) {
            button.payload = JSON.stringify(payload)
        }
        var message = "Come back to win your ranking!";
        var subtitle = "Waiting for you!";
        if (msgCount == 0) {
            message = "Thanks for playing!";
            subtitle = "Come back anytime!";
        } else if (Math.random() > 0.33 && msgCount > 3) {
            message = "Miss our game?";
            subtitle = "Play again!";
        } else if (Math.random() > 0.33) {
            message = "it's brand new day, let's continue our challenge！";
            subtitle = "";
        } else if (Math.random() > 0.33) {
            message = Math.floor(Math.random() * 3 + 2).toString() + " players have surpassed you, take back lost rankings!";
            subtitle = "";
        }
        var imageUrl = "https://unityjs.herokuapp.com/helixball.png"
        var messageData = {
            recipient: { id: recipientID },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: [
                            {
                                title: message,
                                subtitle: subtitle,
                                image_url: imageUrl,
                                buttons: [button]
                            }
                        ]
                    }
                }
            }
        };
        callSendAPI(process.env["PAGE_ACCESS_TOKEN_" + gameId], messageData);
    }

    function callSendAPI(token, messageData) {
        var graphApiUrl = 'https://graph.facebook.com/me/messages?access_token=' + token;
        request({
            url: graphApiUrl,
            method: "POST",
            json: true,
            body: messageData
        }, function (error, response, body) {
            if (error != null) {
                console.error('send api returned', 'error', error, 'status code', response.statusCode, 'body', body);
            }
        });
    }

    runApp = function (appId) {
        /*MongoClient.connect(url, { useNewUrlParser: true }, function (err, mongodb){
            mongodb.db("helixball").createCollection('user', function (err, col) {
                mongodb.close();
                if (err) {
                    console.log('Create Database ' + appId + ' and example ' + ' Col Failed!' + err);
                    //closeDB(db);
                    messageNext(appId);
                    return;
                }
                console.log('Create Database ' + appId + ' and example ' + ' Col Success!');
                messageNext(appId);
                //isCreateSuccess(db);
            })
        });*/
        messageNext(appId);
        /* pg.connect(process.env.DATABASE_URL, function (err, client, done) {
    
            // 建表
            client.query("CREATE TABLE if not exists user_" + appId + "(id text NOT NULL, firstTime timestamp, lastTime timestamp, msgTime timestamp, msgCount smallint, sessionData text, PRIMARY KEY(id) )", [], function (err, result) {
                 if (err) console.error(err);
                 else {
                     //client.query("CREATE TABLE if not exists log_"+ appId + "(id text NOT NULL, time timestamp, content text )", [], function(err, result) {
                     //	if (err) console.error(err);
                     //	else{
                     console.log("running app: " + appId);
                     messageNext(appId);
                     //	}
                 }
             });
        });*/
    };

    function runBot() {
        /*pg.connect(process.env.DATABASE_URL, function (err, client, done) {
            if (err) console.error(err);
            client.query("CREATE TABLE if not exists logs (time timestamp, content text)", [], function (err, result) {
                if (err) console.error(err);
            });
        });*/

        /*MongoClient.connect(url, { useNewUrlParser: true }, function (err, mongodb){
            mongodb.db("helixball").createCollection('logs', function (err, col) {
                mongodb.close();
                if (err) console.log('Create Database ' + logs + ' and example ' + ' Col Failed!' + err);
                else console.log('Create Database ' + logs + ' and example ' + ' Col Success!');
            })
        });*/
        if (process.env.APPS) apps = process.env.APPS.split(",");
        for (var i = apps.length - 1; i >= 0; --i) {
            runApp(apps[i]);
        }
    }
    runBot();
}