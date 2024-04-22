var Tracking=new function(){var self=this
self.log=function(label,value,object){console.log(label+" "+value+" "+object);}
self.soloMode=function(){self.log("soloMode")}
self.friendsMode=function(){self.log("friendsMode")}
self.randomMode=function(){self.log("randomMode")}
self.coinBalance=function(){self.log("coinBalance",Coins.coins)}
self.missionAchieved=function(id){self.log("missionAchieved",null,{id:id})}
self.shopVisited=function(){self.log("shopVisited")}
self.noVideoInventory=function(id){self.log("functionName",null,{id:id})}
self.inviteSent=function(){self.log("inviteSent")}
self.sameContext=function(){self.log("sameContext")}
self.backendError=function(){self.log("backendError")}
self.networkFailure=function(){self.log("networkFailure")}
self.sessionStarted=function(){self.log("sessionStarted")}
self.inviteAccepted=function(){self.log("inviteAccepted")}
self.tutorialFinished=function(){self.log("tutorialFinished")}
self.shopUnlocked=function(id){self.log("shopUnlocked",null,{id:id})}
self.levelCompleted=function(level){self.log("levelCompleted",level,{level:level})}
self.levelFailed=function(level){self.log("levelFailed",level,{level:level})}
self.retryLevel=function(level){self.log("retryLevel",level,{level:level})}
self.wheelSpinOffer=function(){self.log("wheelSpinOffer")}
self.emojiUnlockOffer=function(){self.log("inviteAccepted")}
self.whichFriendOffer=function(){self.log("whichFriendOffer")}
self.freeHintOffer=function(){self.log("freeHintOffer")}
self.dailyPrize=function(){self.log("dailyPrize")}
self.playWithFriends=function(){self.log("playWithFriends")}
self.askFriend=function(){self.log("askFriend")}
self.hintsUsed=function(){self.log("hintsUsed")}
self.watchAdToSpin=function(){self.log("watchAdToSpin")}
self.watchAdForCoins=function(){self.log("watchAdForCoins")}
self.watchAdForHints=function(){self.log("watchAdForHints")}
self.heartsForHint=function(){self.log("heartsForHint")}
self.clickTopHearts=function(){self.log("clickTopHearts")}
self.clickTopHints=function(){self.log("clickTopHints")}
self.noAds=function(){self.log("noAds")}
self.entryPoint=function(){var object=FBInstant.getEntryPointData();if(!object)return
self.log(object.eventName,1,object)}}