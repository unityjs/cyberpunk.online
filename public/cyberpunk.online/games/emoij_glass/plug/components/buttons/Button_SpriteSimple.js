function Button_SpriteSimple(atlasId,onMouseDown,vars){var self=Sprites.cast(this,atlasId)
self.id=bcounts++
self.sprite=self
self.inputEnabled=true
self.isButton=true
self.events.onInputDown.add(onDown)
self.events.onInputOut.add(onOut)
self.events.onInputUp.add(onUp)
self.events.onInputOver.add(onOver)
var isEnabled=true
var isOver=false
var isMouseOver
self.sound="button"
self.reset=function(vars){var vars=self.data=vars||{}
Sprites.applyVars(self,vars)
self.mute=vars.mute
self.onMouseDown=onMouseDown||vars.onMouseDown
self.onMouseUp=vars.onMouseUp
self.onClick=vars.onClick
self.canBeBlocked=vars.canBeBlocked!=null?vars.canBeBlocked:true
if(vars.sound)self.sound=vars.sound}
function onDown(){isOver=false
if(!isEnabled||(self.canBeBlocked&&(Cursor.isBlocked||Cursor.isLocked)))return
if(!isEnabled)return
if(!self.mute&&!self.onClick)Sounds.play(self.sound)
if(self.onMouseDown)self.onMouseDown(self)}
function onOut(){isOver=false
isMouseOver=false
if(!isEnabled)return
if(self.onMouseOut)self.onMouseOut()
if(self.onMouseUp)self.onMouseUp(self)}
function onUp(){if((self.canBeBlocked&&(Cursor.isBlocked||Cursor.isLocked)))return
if(!isEnabled)return
if(self.onClick==null)return
isOver=false
if(!self.mute)Sounds.play("button")
self.onClick(self)}
function onOver(){if(!isEnabled||(self.canBeBlocked&&(Cursor.isBlocked||Cursor.isLocked)))return
isOver=true
isMouseOver=true
if(self.onMouseOver)self.onMouseOver()}
self.disable=function(){self.inputEnabled=false
isEnabled=false}
self.enable=function(force){self.inputEnabled=true
isEnabled=true}
self.show=function(){self.inputEnabled=true
isEnabled=true
Animation.fadeIn(self,300)}
self.hide=function(){self.inputEnabled=false
isEnabled=false
Animation.fadeOut(self,300)}
self.click=onDown
if(vars)self.reset(vars)}
Pool.register("Button_SpriteSimple",Button_SpriteSimple,0,Phaser.Sprite)