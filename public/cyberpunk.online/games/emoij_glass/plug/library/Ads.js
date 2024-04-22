var Ads=new function(){var self=this
var pool={}
self.isPaused
self.init=function(){for(var label in Data.config.ads)pool[label]=new AdInstance(label)
game.onPause.add(function(){self.isPaused=true},this)
game.onResume.add(function(){self.isPaused=false
for(var n in pool)pool[n].doResume()},this)}
self.getRewarded=function(){for(var label in pool)
if(pool[label].isRewarded&&pool[label].isLoaded)return label}
self.playRewarded=function(callback){var label=self.getRewarded()
if(!label){Popups.unpause()
Popups.overlay("NoAds",{text:"no ads at the moment",callback:function(){if(callback!=null)callback(false)}})
return}
self.play(label,callback)}
self.play=function(label,callback){if(!self.isLoaded(label)){log("=============== AD",label,"NOT LOADED")
if(!pool[label].isRewarded){if(callback!=null)callback(true)
return}
Popups.unpause()
Popups.overlay("NoAds",{text:"no ads at the moment",callback:function(){if(callback!=null)callback(false)}})
return}
pool[label].play(callback)}
self.isLoaded=function(label){if(!pool[label]||!pool[label].isLoaded)return
return true}}
function AdInstance(label){var self=this
var label=label
var data=Data.config.ads[label]
var isRewarded=self.isRewarded=data.isRewarded
var id=data.id
var isLoading
var isPlaying
var isFinished
var ad
var tryCount=5
var onVideoPlayed=function(){}
self.isLoaded=false
self.load=function(force){if(!force&&isLoading)return
isFinished=false
isLoading=true
self.isLoaded=false
log("============ AD LOAD",label)}
function onVideo(video){ad=video
var msg=ad.loadAsync()
log("============ AD ON VIDEO",label,ad.getPlacementID(),msg)}
function onLoaded(){log("============ AD ON LOADED",label)
isLoading=false
self.isLoaded=true}
self.play=function(myCallback){console.log("============ AD PLAY",label)
isPlaying=true
isFinished=false
onVideoPlayed=myCallback||function(e){log("no VIDEO CALLBACK",label)}
tryCount=5
if(!self.isLoaded)return onVideoPlayed(false)
Popups.pause()
Delay(function(){ad.showAsync().then(onPlayed).catch(onERRORPLAY)},2)}
function onPlayed(e){isFinished=true
console.log("==== AD PLAYED, is Game paused?",Ads.isPaused)
if(!Ads.isPaused)return self.doResume()}
self.doResume=function(){console.log("resume ad?",isPlaying,isFinished);if(!isPlaying||!isFinished)return;console.log("YES RESUME NOW!")
isPlaying=false
Popups.unpause()
onVideoPlayed(true)
onVideoPlayed=null
Delay(function(){self.load(true)},1000)}
function onERRORLOAD(err){isPlaying=false
console.log("==== AD ERROR LOAD",label,err.message)
Tracking.noVideoInventory(label)
if(onVideoPlayed)onVideoPlayed(false)
onVideoPlayed=null
if(!canReload(err.message))return;Delay(function(){self.load(true)},2000)}
function onERRORPLAY(err){if(isFinished)return
isPlaying=false
var message=err.message
console.log("==== AD ERROR PLAY",label,err.message)
Popups.unpause()
Popups.overlay("NoAds",{text:"no ads at the moment",callback:function(){if(onVideoPlayed)onVideoPlayed(false)
onVideoPlayed=null}})
if(!canReload(err.message))return;Delay(function(){self.load(true)},5000)}
function canReload(message){log("CAN RELOAD!",message)
if(message=="Too many ad instances")return false
if(message=="ADS_TOO_MANY_INSTANCES")return false
if(message=="ADS_FREQUENT_LOAD")return false
if(message=="ADS_NO_FILL")return false
if(message=="ADS_NOT_LOADED")return false
if(message=="INVALID_OPERATION")return false
log("RELOAD AD PASSED")
return true}
self.load(true)}