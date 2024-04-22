var Cursor=function(){var self=Cursor=this
self.isDown=false
self.x=0
self.y=0
self.isBlocked=false
self.isLocked=false
self.velocity={x:0,y:0}
var last={x:0,y:0}
var isEnabled=false
var isClick=false
self.isReleased=false
var releaseCallBacks=[]
var waitingRelease
self.wheelVelocity=0
self.disable=function(){self.isLocked=true
self.block()}
self.enable=function(){if(self.isDown){self.isDown=false
return waitingRelease=true}
waitingRelease=false
self.isLocked=false
self.unblock()}
self.block=function(){self.isBlocked=true
isEnabled=false
isClick=false
self.isReleased=false}
self.unblock=function(){if(self.isLocked)return
self.isBlocked=false}
self.getClick=function(){if(!isClick)return
isClick=false
return true}
self.update=function(){self.x=game.input.x-Canvas.x-Canvas.game.x
self.y=game.input.y-Canvas.y-Canvas.game.y
self.velocity.x+=(last.x-self.x-self.velocity.x)/5
self.velocity.y+=(last.y-self.y-self.velocity.y)/5
last.x=self.x
last.y=self.y
self.wheelVelocity*=.9}
game.input.onUp.add(function(){self.isDown=false
isReleased=true
if(waitingRelease)self.enable()})
game.input.onDown.add(function(){self.isDown=true
if(Engine.isStarted)isClick=true
self.update()
last.x=self.x
last.y=self.y
self.velocity.x=0
self.velocity.y=0})
game.input.mouse.mouseWheelCallback=function(event){self.wheelVelocity+=game.input.mouse.wheelDelta}
setInterval(self.update,1)}