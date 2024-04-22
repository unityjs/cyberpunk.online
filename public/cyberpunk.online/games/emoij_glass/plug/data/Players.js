var PlayerIDs=0
var Players=new function(){var self=Players=this
var ME=self.ME=null
var PLAYERS=self.PLAYERS=[]
var FRIENDS_VS=self.FRIENDS_VS=[]
var PLAYERS_FBIDS=self.PLAYERS_FBIDS=[]
var RIVAL=self.RIVAL={}
var POOL=self.POOL={}
var BOT=self.BOT=new PlayerBot()
self.ACTIVE_VS_FBIDS=[]
var FRIENDS_FBIDS=self.FRIENDS_FBIDS=[]
self.init=function(){if(typeof(FBInstant)=="undefined"||!FBInstant.player.getName()){ME=self.ME=new Player({userID:"1749712238467776",userName:"YoZero",userPhoto:"https://platform-lookaside.fbsbx.com/platform/instantgames/profile_pic.jpg?igpid=1749712238467776&height=256&width=256&ext=1563735413&hash=AeSi06lwi0_f0h1v"})
self.fillFriends([ME,new Player(),new Player()])
return}
ME=self.ME=new Player(FBInstant.player)
Connector.getFriends(self.fillFriends)}
self.parse=function(array){var output=[]
for(var n=0;n<array.length;n++)output.push(new Player(array[n]))
return output}
self.get=function(userID){return POOL[userID]}
self.getRandomFriend=function(){return ArrayUtil.getRandomItem(self.getUniqueFriends())}
self.getUniqueFriends=function(){var output=[]
for(var n in FRIENDS_VS)
if(self.ACTIVE_VS_FBIDS.indexOf(FRIENDS_VS[n].userID)==-1)output.push(FRIENDS_VS[n])
return output}
self.isFriend=function(userID){if(FRIENDS_FBIDS.indexOf(userID)==-1)return false
return true}
self.fillFriends=function(array){FRIENDS_VS=self.FRIENDS_VS=[]
var array=self.parse(array)
for(var n in array){var friend=array[n]
ArrayUtil.pushUnique(FRIENDS_FBIDS,friend.userID)
if(friend.userID!=ME.userID)FRIENDS_VS.push(friend)}}
self.fillPlayers=function(array){PLAYERS=self.PLAYERS=array
PLAYERS_FBIDS=self.PLAYERS_FBIDS=[]
RIVAL=BOT
for(var n=0;n<PLAYERS.length;n++){PLAYERS_FBIDS.push(PLAYERS[n].userID)
if(PLAYERS[n].userID!=ME.userID)RIVAL=self.RIVAL=PLAYERS[n]}}
self.getRival=function(userID){self.fillPlayers([ME,POOL[userID]||BOT])
self.isRivalBot=userID==null
if(!self.isRivalBot)return
Connector.getPlayers(function(array){var array=self.parse(array)
if(array.length!=2)return
for(var n in array)
if(array[n].userID!=ME.userID){self.getRival(array[n].userID)
break}})}}
function Player(fbObject){var self=this
self.getID=function(){return self.userID}
self.getName=function(){return self.userName}
self.getPhoto=function(){return self.userPhoto}
if(!fbObject){PlayerIDs++
self.userName="Guest00"+PlayerIDs
self.userID="guest00"+PlayerIDs
self.userPhoto=Connector.debugPhoto}else{if(fbObject.getName){self.userName=fbObject.getName()
self.userID=fbObject.getID()
self.userPhoto=fbObject.getPhoto()}else{self.userName=fbObject.userName
self.userID=fbObject.userID
self.userPhoto=fbObject.userPhoto}}
if(Players.POOL[self.userID])return
Players.POOL[self.userID]=self}
function PlayerBot(fbObject){var self=this
self.getID=function(){return self.userID}
self.getName=function(){return self.userName}
self.getPhoto=function(){return self.userPhoto}
self.userName="waiting"
self.userID="botID"
self.userPhoto=Connector.debugPhoto
Players.POOL[self.userID]=self}