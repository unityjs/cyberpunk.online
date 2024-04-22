var VSBoard=new function(){var self=this
var maxTurns=3
var onSessionCallback
var session
self.pool=[]
var A=self.A=[]
var B=self.B=[]
var scoreA=0
var scoreB=0
self.sessionId="sessionId"
var isFirstTime=true
self.playersInVS=[]
self.sendChallengeRandom=function(){self.sendChallenge({userID:"random"})}
self.sendChallenge=function(vars){var vars=vars||{}
var userID=vars.userID
var sessionId=vars.sessionId
Connector.changeContextTo(userID,onContextChange)
function onContextChange(){self.startSession(userID,sessionId)}}
self.startSession=function(userID,sessionId){BottomNav.hide()
Players.getRival(userID)
self.sessionId=sessionId||Players.ME.userID+DateUtils.getTime()
if(sessionId)return Popups.show("VSBoard")
Engine.startGameVS()}
self.refresh=function(){Players.ACTIVE_VS_FBIDS=[]
Data.set("VSActive",0,true)
Connector.getActiveSessions(function(data){self.pool=[]
for(var n in data){var item=data[n]
if(item.complete&&item.complete.indexOf(Players.ME.userID)!=-1)continue
var entry=new Data_VS(item)
if(entry.isValid)self.pool.push(entry)}
Data.set("VSActive",self.pool.length,true)
autoStart()})}
function autoStart(){if(!isFirstTime)return self.challengeFriend()
isFirstTime=false
var contextId=Connector.getContextId()
if(!contextId||contextId=="soloContextId")return
var session
for(var n in self.pool){if(self.pool[n].contextId!=contextId)continue
session=self.pool[n]
if(session.turn)return doAutoStart()}
doAutoStart()
function doAutoStart(){if(!session)return self.startSession()
self.startSession(session.userID,session.sessionId)}}
self.challengeFriend=function(){for(var n in self.pool)
if(self.pool[n].turn)return Displayer_ChallengeFriend.show(self.pool[n])
Displayer_ChallengeFriend.show()}
self.getSession=function(callback){onSessionCallback=callback
Connector.getSession(onSession)}
function onSession(vars){session=self.session=vars
var vars=vars||{}
var players=ArrayUtil.extract(vars.players||[])
self.rivalPhoto=Connector.debugPhoto
for(var n in players){if(players[n].userID==Players.ME.userID)continue
players[n]=Players.get(players[n].userID)
self.rivalPhoto=players[n].userPhoto}
A=self.A=[]
B=self.B=[]
scoreA=0
scoreB=0
var lastTurn=null
for(var n in vars.sessionData){var item=vars.sessionData[n]
var score=parseInt(item.score)
lastTurn=item.senderId
if(item.senderId==Players.ME.userID){A.push(score)
scoreA+=score}else{B.push(score)
scoreB+=score}}
self.turn=lastTurn!=Players.ME.userID
self.isReady=A.length+B.length>=maxTurns*2
self.scoreA=scoreA
self.scoreB=scoreB
self.winner=self.resultsA=self.resultsB="tie"
if(!self.isReady)return onSessionCallback()
if(scoreA>scoreB){self.winner="A"
self.resultsA="winner"
self.resultsB="loser"
Data.winGame()}
if(scoreB>scoreA){self.winner="B"
self.resultsA="loser"
self.resultsB="winner"
Data.loseGame()}
Connector.setSessionComplete()
onSessionCallback()}
self.submitTurn=function(){if(Data.get("gameMode")=="solo")return
Connector.submitSession()}}
function Data_VS(vars){var self=this
self.userID=self.userName="Waiting"
self.contextId=vars.contextId
self.sessionId=vars.sessionId||"sessionId"
var array=ArrayUtil.extract(vars.players||[])
var players=[]
for(var n in array){var player=Players.get(array[n].userID)
if(player)players.push(player)}
self.players=players
self.isValid=false
var hasMe
var hasRival
var hasBot
for(var n in players){var player=players[n]
if(player.userID==Players.ME.userID){hasMe=true}else if(player.userID=="botID"){hasBot=player}else{hasRival=player}}
if(!hasMe){if(players.length==1||hasBot)setPlayer(Players.ME,true)
return}
if(hasRival)return setPlayer(hasRival)
function setPlayer(player,forceTurn){self.userID=player.userID
self.userName=player.userName||"noname"
self.userPhoto=player.userPhoto
self.turn=forceTurn||vars.turn==Players.ME.userID
self.subText=self.turn?"your turn":"their turn"
self.isValid=players.length>1
if(player.userID==Players.ME.userID)return
ArrayUtil.pushUnique(Players.ACTIVE_VS_FBIDS,self.userID)
ArrayUtil.pushUnique(Players.FRIENDS_FBIDS,self.userID)}}