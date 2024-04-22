function myTick(fps){var self=Tick=this
var listeners=[]
var listenersSecond=[]
var listenersMill=[]
game.time.events.loop(1000/(fps||60),update,this)
game.time.events.loop(1000,second,this)
game.time.events.loop(10,millisecond,this)
function update(){for(var n in listeners)listeners[n]()}
function second(){Data.increase("timePlayed",1,true)
for(var n in listenersSecond)listenersSecond[n]()}
function millisecond(){for(var n in listenersMill)listenersMill[n]()}
self.start=function(callback){self.stop(callback)
listeners.push(callback)}
self.startTimer=function(callback){self.stop(callback)
listenersSecond.push(callback)}
self.startMill=function(callback){listenersMill.push(callback)}
self.stop=function(callback){for(var n in listeners)
if(listeners[n]==callback)return listeners.splice(n,1)
for(var n in listenersSecond)
if(listenersSecond[n]==callback)return listenersSecond.splice(n,1)
for(var n in listenersMill)
if(listenersMill[n]==callback)return listenersMill.splice(n,1)}}