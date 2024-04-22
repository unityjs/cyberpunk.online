var Popups=new function(){var self=this
self.pool=[]
self.current=false
self.add=function(label,vars){if(self[label]!=null){console.log("POPUP",label,"ALREADY EXISTS")}
self[label]=new myPopup(label,vars)
return self[label]}
self.show=function(label,vars,animation){if(self.current&&self.current===self[label])return
if(!self[label])Pool.spawn("Popup_"+label)
Data.set("currentScreen",label)
var last=self.current
self.current=self[label]
BlackCover.hide()
self.current.show(vars,animation)
Callback.cancel("Popups")
if(!last)return Callback.delay(Cursor.enable,610)
if(animation)return last.hide(animation=="left"?"right":"left")
last.doHide()}
self.hide=function(label){log("HIDE Popups")
BlackCover.hide()
if(!label&&!self.current)return
if(label&&(self.current!=self[label])){Data.set("currentScreen",self.current?self.current.label:"game")
self[label].hide()
BlackCover.hide()
return}
self.current.hide()
self.current=null}
self.overlay=function(label,vars,animation){if(!self[label])Pool.spawn("Popup_"+label)
BlackCover.show()
Delay(BlackCover.show,.1)
self[label].show(vars,animation)
Canvas.overlay.addChild(self[label])
Callback.cancel("Popups")
Data.set("currentScreen",label)
Callback.delay(Cursor.enable,1)}
self.pause=function(){self.isPaused=true
if(!self.Paused)Pool.spawn("Popup_Paused")
self.hadBlackCover=BlackCover.isShowing
BlackCover.show()
Canvas.aboveall.addChild(BlackCover)
self.Paused.show({callback:self.unpause},"instant")
Canvas.aboveall.addChild(self.Paused)
Callback.delay(Cursor.enable,1)}
self.unpause=function(){if(!self.isPaused)return
self.isPaused=false;BlackCover.show();self.Paused.hide()
Depth.removeChild(self.Paused)
Callback.delay(Cursor.enable,1)}}
function myPopup(label,vars){var self=Canvas.cast(this,Canvas.limbo,9000,9000)
var vars=vars||{}
var label=self.label=label
self.animationIn=vars.animation||"cut"
self.animationOut=vars.animationOut||self.animationIn
self.hasBlackCover=vars.hasBlackCover
self.onMouseDown=vars.onMouseDown
self.onShow=vars.onShow
self.onHide=vars.onHide
self.isBlocked=false
self.onUpdate=vars.update||function(){}
var isShowing=false
var time=800
var container=self.container=self
var buttons=self.buttons=[]
self.onPageMouseDown=function(data){if(self.onMouseDown!=null)self.onMouseDown(data)}
self.sprites=Sprites.getSprites(self,label+"_")
self.show=function(vars,animation){if(isShowing)return
isShowing=true
Cursor.disable()
self.data=vars||{}
Cancel(label)
Canvas.popups.addChild(self.container)
self.y=0
self.x=0
self.visible=true
self.alpha=true
self[(animation||self.animationIn)+"In"]()
for(var n in buttons)buttons[n].enable()
Tick.start(self.onUpdate)
if(self.onShow!=null)self.onShow()}
self.hide=function(animation){if(!isShowing)return
isShowing=false
Tick.stop(self.onUpdate)
self[(animation||self.animationOut)+"Out"]()
DelayUnique(label,self.doHide,600)}
self.doHide=function(){Tick.stop(self.onUpdate)
self.y=9000
isShowing=false
self.visible=false
for(var n in buttons)buttons[n].disable()
Cursor.enable()
Depth.removeChild(container)
if(self.onHide!=null)self.onHide()}
self.panIn=function(){self.y=100
Animation.to(container,{y:0},time*2,Phaser.Easing.Elastic.Out)}
self.panOut=function(){self.y=0
Animation.to(container,{y:-game.world.height},time)}
self.leftIn=function(){self.x=Canvas.RIGHT+Canvas.WIDTH
Animation.to(container,{x:0},600,Phaser.Easing.Exponential.InOut)}
self.leftOut=function(){self.x=0
Animation.to(container,{x:Canvas.RIGHT+Canvas.WIDTH},600,Phaser.Easing.Exponential.InOut)}
self.rightIn=function(){self.x=Canvas.LEFT-Canvas.WIDTH
Animation.to(container,{x:0},600,Phaser.Easing.Exponential.InOut)}
self.rightOut=function(){self.x=0
Animation.to(container,{x:Canvas.LEFT-Canvas.WIDTH},600,Phaser.Easing.Exponential.InOut)}
self.downIn=function(){self.y=-100
Animation.to(container,{y:0},time*2,Phaser.Easing.Elastic.Out)}
self.downOut=function(){self.y=0
Animation.to(container,{y:-game.world.height},time)}
self.downOut=function(){self.y=0
Animation.to(container,{y:game.world.height},time)}
self.fadeIn=function(){self.alpha=0
Animation.fadeIn(self,time)}
self.fadeOut=function(){self.alpha=1
Animation.fadeOut(self)}
self.flickerIn=function(){Animation.flickerIn(container)}
self.flickerOut=function(){Animation.flickerOut(container)}
self.scaleIn=function(){self.fadeIn()
self.scale.set(1.4,1.4)
game.add.tween(self.scale).to({x:1,y:1},time,Phaser.Easing.Elastic.Out,true)}
self.scaleOut=function(){self.fadeOut()}
self.cutIn=function(){self.alpha=1
self.y=0
game.add.tween(container).to({y:0,alpha:1},.1,Phaser.Easing.Circular.Out,true)}
self.cutOut=function(){log("CUT OUTS")
game.add.tween(container).to({alpha:0},.1,"Linear",true)}
self.instantIn=function(){self.y=0
container.y=0
container.alpha=1}
self.instantOut=function(){self.cutOut()}}
Utils.setPrototype(myPopup,Phaser.Group)