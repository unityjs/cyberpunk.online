var bcountt=0
function Button_Text(atlasId,onMouseDown,vars){var self=Sprites.cast(this,atlasId)
self.id=bcountt++
self.sprite=self
self.inputEnabled=true
self.isButton=true
self.events.onInputDown.add(onDown)
self.events.onInputOut.add(onOut)
self.events.onInputUp.add(onUp)
self.events.onInputOver.add(onOver)
self.realWidth=self.width
var scale=1
var isEnabled=true
var counter=0
var isOver=false
var isClicked=false
var diffScale=0
var isShowing=true
var titleField=Texts.spawnBitmap("stroke",{parent:self,size:70,text:"title"})
self.onColor=0xFFFFFF
self.offColor=0xFFFFFF
var onSprite
var offSprite
var isMouseOver
self.reset=function(vars){if(onSprite)Sprites.remove(onSprite)
if(offSprite)Sprites.remove(offSprite)
onSprite=offSprite=null
var vars=self.data=vars||{title:""}
var spriteName=vars.sprite||vars.onSprite
if(spriteName)onSprite=offSprite=Sprites.get(spriteName,{x:0,y:0,parent:self})
if(vars.offSprite)offSprite=Sprites.get(offSprite,{x:0,y:0})
titleField.text=vars.title
self.pad=titleField.width
self.mute=vars.mute
self.onMouseDown=onMouseDown||vars.onMouseDown
self.onMouseUp=vars.onMouseUp
self.onClick=vars.onClick
scale=vars.scale||1
self.zoomScale=vars.zoomScale||1.1
self.overAlpha=vars.overAlpha||1
self.upAlpha=vars.upAlpha||1
self.canBeBlocked=vars.canBeBlocked!=null?vars.canBeBlocked:true}
function onDown(){isOver=false
if(!isEnabled||(self.canBeBlocked&&(Cursor.isBlocked||Cursor.isLocked)))return
Tick.start(update)
if(!isEnabled)return
if(!self.mute&&!self.onClick)Sounds.play("button")
if(self.onMouseDown!=null)self.onMouseDown(self)
self.setBoolean(true)
if(self.onClick==null){Tick.start(update)
self.scale.set(self.zoomScale*1.1,self.zoomScale*1.1)
return}}
function onOut(){isOver=false
isMouseOver=false
if(!isEnabled)return
if(self.onMouseOut)self.onMouseOut()
if(self.onMouseUp)self.onMouseUp(self)}
function onUp(){if((self.canBeBlocked&&(Cursor.isBlocked||Cursor.isLocked)))return
if(!isEnabled)return
if(self.onClick==null)return
Tick.start(update)
isOver=false
self.scale.set(self.zoomScale*1.1,self.zoomScale*1.1)
if(!self.mute)Sounds.play("button")
self.setBoolean(true)
self.onClick(self)}
function onOver(){if(!isEnabled||(self.canBeBlocked&&(Cursor.isBlocked||Cursor.isLocked)))return
isOver=true
isMouseOver=true
counter=0
Depth.toFront(self)
Tick.start(update)
if(self.onMouseOver)self.onMouseOver()}
function update(){var sca=self.scale.x
var targetScale=scale
if(isOver)targetScale*=self.zoomScale
diffScale+=(targetScale-sca)*.2
diffScale*=.8
sca+=diffScale
self.scale.set(sca,sca)
if(isShowing)self.alpha+=((isOver?self.overAlpha:self.upAlpha)-self.alpha)/4
if(isOver||++counter<100)return
self.scale.set(scale,scale)
Tick.stop(update)}
self.disable=function(){self.inputEnabled=false
isEnabled=false
if(isShowing)self.alpha=self.upAlpha*.5}
self.enable=function(force){self.inputEnabled=true
isEnabled=true
if(isShowing)self.alpha=self.upAlpha}
self.setAlphas=function(up,over){if(!isShowing)return
if(up!=null)self.upAlpha=self.alpha=up
if(over!=null)self.overAlpha=over}
self.show=function(){isShowing=true
isEnabled=true
self.inputEnabled=true
Animation.fadeIn(self,300)}
self.hide=function(){isShowing=false
isEnabled=false
self.inputEnabled=false
Animation.fadeOut(self,300)}
self.setBoolean=function(bool){self.boolean=bool
Depth.removeChild(onSprite)
Depth.removeChild(offSprite)
if(bool)Depth.toFront(self)
titleField.alpha=bool?1:.4
titleField.tint=bool?self.onColor:self.offColor
if(!onSprite)return
Depth.toFront(titleField)
self.addChild(self.boolean?onSprite:offSprite)}
self.setFalse=function(){self.setBoolean(false)}
self.remove=function(){Depth.removeChild(self)
self.disable()
Sprites.clear(self)
Pool.remove(self)}
self.click=onDown
if(vars)self.reset(vars)}
Pool.register("Button_Text",Button_Text,0,Phaser.Sprite)