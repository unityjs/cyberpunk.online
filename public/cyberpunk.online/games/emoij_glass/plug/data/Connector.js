var gamesparks=new GameSparks()
var Connector=new function(){var self=this
self.isConnected=true
self.data={}
self.isInited=false
self.debugPhoto="symbol_user"
self.init=function(){if(Data.config.dataLocation=="facebook")return self.initFB()
if(!Data.config.GS_KEY)return
self.isDebug=true;self.isInited=true
self.isConnected=false
var initObject={key:Data.config.GS_KEY,secret:Data.config.GS_SECRET,onNonce:function(nonce){return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(nonce,Data.config.GS_SECRET))},onMessage:function(message){},onInit:onInit,logger:log,}
gamesparks.initLive(initObject)}
function onInit(data){gamesparks.authenticationRequest(Players.ME.userID,Players.ME.userID,function(response){if(!response.error)return initialize()
if(response.error.DETAILS=="UNRECOGNISED"){gamesparks.registrationRequest(Players.ME.userName,Players.ME.userID,Players.ME.userID,function(response){response.error?log('cannot register new user'):initialize()})}})
function initialize(){self.initPlayer(Players.ME,self.getSelfData)}}
function parseGSData(label,response,callback){if(response.error)return log("ERROR")
var data=response.scriptData.data
if(callback!=null)callback(data)
return data}
self.initPlayer=function(player,callback){gamesparks.logEventRequest("INIT_PLAYER",function(response){parseGSData("initPlayer",response,callback)},{"FBID":player.getID(),"FBNAME":player.getName(),"FBPHOTO":player.getPhoto(),"OVERRIDE":(player.getID()==Players.ME.getID()?"true":"false")})}
self.getSelfData=function(callback){gamesparks.logEventRequest("GET_FRIENDS_DATA",function(response){var data=parseGSData("getSelfData",response)
if(!data)return
self.isConnected=true
var d=data[Players.ME.userID]
Data.setState(d?d.customData.state:{})},{"PLAYER_FBIDS":[],"FIELDS":["state"]})}
self.getFriendsData=function(fields,callback)
{log("getFriendsData",fields,self.isInited)
if(!self.isInited)return
gamesparks.logEventRequest("GET_FRIENDS_DATA",function(response){parseGSData("getFriendsData",response,callback)},{"PLAYER_FBIDS":Players.FRIENDS_FBIDS,"FIELDS":fields||[]})}
self.save=function(key,value,mode)
{if(!self.isInited)return
gamesparks.logEventRequest("SUBMIT_SELF_DATA",function(response){},{"CUSTOM_DATA":{"KEY":key,"VALUE":value,"MODE":mode||"UPDATE"}})}
self.saveState=function(json)
{if(!self.isInited)return
self.save("state",json)}
self.updateLastActive=function(callback){if(!self.isInited)return
gamesparks.logEventRequest("UPDATE_LAST_ACTIVE",function(response){if(callback!=null)callback(response)})}
self.saveScore=function(){if(!self.isInited)return
gamesparks.logEventRequest("SUBMIT_SCORE",function(response){},{"SCORE":Score.score})}
self.getLeaderboard=function(leaderboardName,friendsOnly,callback)
{if(!self.isInited)return
log("get leaderboard",leaderboardName,friendsOnly,Players.FRIENDS_FBIDS)
gamesparks.logEventRequest("GET_LEADERBOARD",function(response){parseGSData("getLeaderboard",response,callback)},{"PLAYER_FBIDS":Players.FRIENDS_FBIDS,"SOCIAL":friendsOnly?"true":"false","LEADERBOARD_NAME":leaderboardName||"bestAllTime"})}
self.submitSession=function(sessionData){if(!self.isInited)return
var sessionData=sessionData||{}
ArrayUtil.extract({senderId:Players.ME.userID,senderName:Players.ME.userName,timestamp:Date.now(),score:Score.score},sessionData)
var fbids=[]
for(var n in Players.PLAYERS_FBIDS)
if(Players.PLAYERS_FBIDS[n]!="botID")fbids.push(Players.PLAYERS_FBIDS[n])
var obj={"SESSION_DATA":sessionData,"CONTEXT_ID":self.getContextId(),"SESSION_ID":VSBoard.sessionId,"PLAYER_FBIDS":fbids,"TURN":Players.RIVAL.userID}
gamesparks.logEventRequest("UPDATE_PUBLIC_SESSION",function(response){},obj)}
self.createSession=function(){if(!self.isInited)return
gamesparks.logEventRequest("UPDATE_PUBLIC_SESSION",function(response){},{"SESSION_DATA":" ","SESSION_ID":VSBoard.sessionId,"PLAYER_FBIDS":Players.PLAYERS_FBIDS})}
self.getSession=function(callback){if(!self.isInited)return
gamesparks.logEventRequest("GET_PUBLIC_SESSION",function(response){parseGSData("getSession",response,callback)},{"SESSION_ID":VSBoard.sessionId})}
self.getActiveSessions=function(callback){if(!self.isInited)return
var output=[]
var activeIDs=[]
gamesparks.logEventRequest("GET_ACTIVE_SESSION",function(response){parseGSData("getActiveSession",response,function(array){var activeSessions=array
for(var n in activeSessions){var item=activeSessions[n]
if(item.complete&&item.complete.indexOf(Players.ME.userID)!=-1)continue
activeIDs.push(item.sessionId)
output.push(item)}
if(!self.getContextId())return callback(output)
self.getActiveSessionsByContext(function(response){for(var n in response)
if(activeIDs.indexOf(response[n].sessionId)==-1)output.push(response[n])
callback(output)})})})}
self.getActiveSessionsByContext=function(callback){if(!self.isInited)return
gamesparks.logEventRequest("GET_ACTIVE_SESSION_BY_CONTEXT",function(response){parseGSData("getSessionByContextID",response,callback)},{"CONTEXT_ID":self.getContextId()})}
self.deleteSession=function(sessionId){if(!self.isInited)return
gamesparks.logEventRequest("SET_SESSION_COMPLETE",function(response){},{"SESSION_ID":sessionId||VSBoard.sessionId})
gamesparks.logEventRequest("DELETE_PUBLIC_SESSION",function(response){},{"SESSION_ID":sessionId||VSBoard.sessionId})}
self.setSessionTurn=function(userID){if(!self.isInited)return
gamesparks.logEventRequest("SET_SESSION_TURN",function(response){},{"PLAYER_FBID":userID||Players.RIVAL.userID,"SESSION_ID":VSBoard.sessionId})}
self.setSessionComplete=function(){if(!self.isInited)return
gamesparks.logEventRequest("SET_SESSION_COMPLETE",function(response){},{"SESSION_ID":VSBoard.sessionId})}
self.getContextId=function(){return "";}
self.initFB=function(){self.isConnected=false
Tracking.entryPoint()}
self.saveFB=function(state){}
self.isSOLO=function(){console.log("CONTEXT",FBInstant.context.getType())
return true;}
self.getGlobalLeaderboard=function(callback){callback(parseEntries(entries))}
self.getFriendsLeaderboard=function(callback){callback(parseEntries(entries))}
self.getLocalLeaderboardData=function(callback){console.log("GET LOCAL LEADERBOARD v2")}
function parseEntries(entries){console.log("parseEntries ",entries)
Data.set("score",0)
var data=[]
for(var i=0;i<entries.length;i++){var item=entries[i]
data.push({aFriendsID:item.getPlayer().getID(),aFriendsName:item.getPlayer().getName(),aFriendsScore:item.getScore(),playerImage:item.getPlayer().getPhoto()})
console.log("PARSE, RESET SCORE",item.getPlayer().getName(),Players.ME.userName)
if(item.getPlayer().getName()==Players.ME.userName){console.log("FOUND, RESET SCORE",item.getScore())
Data.set("score",item.getScore());self.rank=item.getRank()}}
return data}
self.saveScoreFB=function(){}
self.changeContextTo=function(aFriendsID,callback){if(self.isDebug)return success()
if(aFriendsID&&aFriendsID==Players.RIVAL.userID){Tracking.friendsMode()
success()
return}
if(aFriendsID=="random"){Tracking.randomMode()
FBInstant.matchPlayerAsync(null,true).then(success,error)
return}
if(aFriendsID){Tracking.friendsMode()
FBInstant.context.createAsync(aFriendsID).then(success,error)
return}
Tracking.inviteSent()
FBInstant.context.chooseAsync().then(success,error)
function success(e){self.getLocalLeaderboardData();console.log("changeContextTo")
callback()}
function error(e){if(e.code=="SAME_CONTEXT")success(e)}}
self.sendFriendMessage=function(aFriendsID,message,imageToShare,cta){self.changeContextTo(aFriendsID,function(){Connector.sendMessage(message,imageToShare,cta)})}
self.invite=function(imageToShare){FBInstant.shareAsync({intent:'INVITE',image:imageToShare||Data.config.logo,text:Players.ME.userName+' is looking for friends to play with!',data:{myReplayData:'...'},})}
self.getUserPictureLink=function(userID,size){var userID=userID||Players.ME.userID
var size=size||"square"
return "https://graph.facebook.com/"+userID+"/picture?type="+size}
self.getFriends=function(callback){FBInstant.player.getConnectedPlayersAsync().then(callback,function(e){log("ERROR!",e)})}
self.getPlayers=function(callback){FBInstant.context.getPlayersAsync().then(callback,function(e){log("ERROR!",e)})}
self.share=function(imageToShare,text){FBInstant.shareAsync({intent:'SHARE',image:imageToShare||Data.config.logo,text:text||Players.ME.userName+' is looking for friends to play!',data:{myReplayData:'...'},}).then(function(){});}
self.checkSubscribeBot=function(){log("CHECK SUBSCRIBE")}
self.addHomeShortcut=function(){}
self.subscribeBot=function(){FBInstant.player.subscribeBotAsync()}
self.sendMessage=function(message,imageToShare,cta){log(self.getContextId(),"SEND MESSAGE!!",message)
if(!self.getContextId())return
var message=message||"text here"
FBInstant.updateAsync({action:'CUSTOM',cta:cta||'Play',image:imageToShare||Data.config.logo,text:{default:message,localizations:{en_US:message,}},template:'first_place',data:{myReplayData:'...'},strategy:'IMMEDIATE',notification:'NO_PUSH',}).then(function(){log('Message was sent successfully',message);},function(e){log('Message was not sent',e)})}
self.sendBotMessage=function(userID,message){if(!self.isInited)return
gamesparks.logEventRequest("SEND_BOT_MESSAGE",function(response){},{"FBID":userID,"MESSAGE":message})}
self.gameOver=function(){var contextType="POST";var score=Data.get("score")
log("gameOver SEND THE SCORE!",contextType,score)}
self.setSOLOContextId=function(){}}