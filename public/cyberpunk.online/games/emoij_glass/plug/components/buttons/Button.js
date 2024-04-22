var bcount=0
function Button(sprite,callback,vars){var self=this
self.isButton=true
var callback=callback
var vars=self.data=vars||{}
var sprite=self.sprite=sprite||Sprites.get(vars.sprite||"blank",vars)
sprite.inputEnabled=true
self.scale=self.data.scale||sprite.scale.x
self.mute=false
self.onMouseUp=vars.onMouseUp
self.onClick=vars.onClick
self.zoomScale=vars.zoomScale||1.05
self.canBeBlocked=true
self.overAlpha=1
self.upAlpha=1
var isEnabled=true
self.id=bcount++
var counter=0
var isOver=false
var isMouseOver
var isClicked=false
var diffScale=0
var isShowing=true
self.sound="button"
sprite.events.onInputDown.add(onDown)
self.reset=function(vars){if(sprite)Sprites.remove(sprite)
sprite=self.sprite=Sprites.get(vars.sprite)}
function onDown(){isOver=false
if(!isEnabled||(self.canBeBlocked&&(Cursor.isBlocked||Cursor.isLocked)))return
Tick.start(update)
if(!isEnabled)return
if(!self.mute&&!self.onClick)Sounds.play(self.sound)
if(callback!=null)callback(self.data)
if(self.onClick==null){Tick.start(update)
sprite.scale.set(self.zoomScale*1.1,self.zoomScale*1.1)
return}}
sprite.events.onInputOut.add(onOut)
function onOut(){isOver=false
isMouseOver=false
if(!isEnabled)return
if(self.onMouseOut)self.onMouseOut()
if(self.onMouseUp)self.onMouseUp(self)}
sprite.events.onInputUp.add(onUp)
function onUp(){if((self.canBeBlocked&&(Cursor.isBlocked||Cursor.isLocked)))return
if(!isEnabled)return
if(self.onClick==null)return
Tick.start(update)
isOver=false
sprite.scale.set(self.zoomScale*1.1,self.zoomScale*1.1)
if(!self.mute)Sounds.play("button")
self.onClick(self)}
sprite.events.onInputOver.add(onOver)
function onOver(){if(!isEnabled||(self.canBeBlocked&&(Cursor.isBlocked||Cursor.isLocked)))return
isOver=true
isMouseOver=true
counter=0
Depth.toFront(self.sprite)
Tick.start(update)
if(self.onMouseOver)self.onMouseOver()}
function update(){var sca=sprite.scale.x
var targetScale=self.scale
if(isOver)targetScale*=self.zoomScale
diffScale+=(targetScale-sca)*.2
diffScale*=.8
sca+=diffScale
sprite.scale.set(sca,sca)
if(isShowing)sprite.alpha+=((isOver?self.overAlpha:self.upAlpha)-sprite.alpha)/4
if(isOver||++counter<100)return
sprite.scale.set(self.scale,self.scale)
Tick.stop(update)}
self.disable=function(){sprite.inputEnabled=false
isEnabled=false
if(isShowing)self.sprite.alpha=self.upAlpha*.5}
self.enable=function(force){sprite.inputEnabled=true
isEnabled=true
if(isShowing)self.sprite.alpha=self.upAlpha}
self.setAlphas=function(up,over){if(!isShowing)return
if(up!=null)self.upAlpha=sprite.alpha=up
if(over!=null)self.overAlpha=over}
self.show=function(){isShowing=true
isEnabled=true
Animation.fadeIn(self.sprite,300)}
self.hide=function(){isShowing=false
isEnabled=false
Animation.fadeOut(self.sprite,300)}
self.click=onDown}
Pool.register("Button",Button)