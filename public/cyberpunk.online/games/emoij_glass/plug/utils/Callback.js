function myCallback(){var self=Callback=this
var callbackKey={}
var registry={}
self.pool={}
self.delay=function(callback,time){return new myCallBackInstance(callback,time)}
self.delayUnique=function(key,callback,time){self.cancel(key)
var instance=new myCallBackInstance(callback,time)
callbackKey[key]=instance
return instance}
self.cancel=function(key){var instance=callbackKey[key]
if(instance)instance.cancel()}
self.store=function(key,callback){registry[key]=callbackKey[key]=callback}
self.onKey=function(key,andDelete){if(!callbackKey[key])return
var fn=callbackKey[key]
if(andDelete)delete callbackKey[key]
fn()}
self.resetRegit=function(){for(var key in registry)callbackKey[key]=registry[key]}
self.pause=function(){for(var n in self.pool)self.pool[n].pause()}
self.resume=function(){for(var n in self.pool)self.pool[n].resume()}}
var callBackIDs=0
function myCallBackInstance(callback,time){var self=this
var isActive=true
var timer=game.time.create(false)
var isPaused=false
self.id="c"+(callBackIDs++)
if(!callback)return log("Callback Empty")
timer.add(time||1,function(){if(!isActive)return
isActive=false
callback()
self.cancel()})
self.pause=function(){if(isPaused)return
isPaused=true
timer.pause()}
self.resume=function(){if(!isPaused)return
isPaused=false
timer.resume()}
self.cancel=function(){isActive=false
timer.destroy()
delete Callback.pool[self.id]}
timer.start()}
var Callback=new myCallback()
var Delay=Callback.delay
var DelayUnique=Callback.delayUnique
var Cancel=Callback.cancel