function Button_News(atlasId,onMouseDown,vars){var self=Sprites.cast(this,atlasId||"news_base")
self.id=bcounts++
self.sprite=self
self.inputEnabled=true
self.isButton=true
self.events.onInputDown.add(onDown)
self.events.onInputOut.add(onOut)
self.events.onInputUp.add(onUp)
self.events.onInputOver.add(onOver)
var scale=1
var isEnabled=true
var counter=0
var isOver=false
var isClicked=false
var diffScale=0
var isShowing=true
var onSprite
var offSprite
var isMouseOver
var image
var dateField=Texts.spawnBitmap("stroke",{parent:self,y:235-30,x:-440,size:40,anchorX:0,text:"value",tint:0xff0078})
var textField=Texts.spawnBitmap("stroke",{parent:self,y:300-30,x:-440,size:70,anchorX:0,text:"value",tint:0x000000})
self.sound="button"
self.reset=function(vars){if(onSprite)Sprites.remove(onSprite)
if(offSprite)Sprites.remove(offSprite)
onSprite=offSprite=null
var vars=self.data=vars||{}
Sprites.applyVars(self,vars)
var spriteName=vars.sprite||vars.onSprite
if(spriteName)onSprite=Sprites.get(spriteName,{x:0,y:0,parent:self})
if(vars.offSprite)offSprite=Sprites.get(offSprite,{x:0,y:0})
if(vars.image.indexOf("http")!=-1){Load.webImage(vars.image,function(sprite){image=sprite
Sprites.applyVars(image,{x:0,y:-400,anchorY:0,parent:self})})}else{image=Sprites.get(vars.image,{x:0,y:-400,anchorY:0,parent:self});}
dateField.text=vars.date
textField.text=vars.text
self.mute=vars.mute
self.onMouseDown=onMouseDown||vars.onMouseDown
self.onMouseUp=vars.onMouseUp
self.onClick=vars.onClick
scale=vars.scale||1
self.zoomScale=vars.zoomScale||1
self.overAlpha=self._overAlpha=vars.overAlpha||1
self.upAlpha=self._upAlpha=vars.upAlpha||1
if(vars.sound)self.sound=vars.sound
self.canBeBlocked=vars.canBeBlocked!=null?vars.canBeBlocked:true
self.enable()}
function onDown(){isOver=false
if(!isEnabled||(self.canBeBlocked&&(Cursor.isBlocked||Cursor.isLocked)))return
Tick.start(update)
if(!isEnabled)return
if(!self.mute&&!self.onClick)Sounds.play(self.sound)
if(self.onMouseDown!=null)self.onMouseDown(self)
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
if(isShowing)self.alpha=self.upAlpha=self._upAlpha*.3}
self.enable=function(force){self.inputEnabled=true
isEnabled=true
if(isShowing)self.alpha=self.upAlpha=self._upAlpha}
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
self.setBoolean=function(bool){if(self.bool==bool)return
self.boolean=bool
Depth.removeChild(onSprite)
if(offSprite)Depth.removeChild(offSprite)
if(bool)Depth.toFront(self)
if(!onSprite)return
self.addChild(self.boolean?onSprite:offSprite||onSprite)}
self.setFalse=function(){self.setBoolean(false)}
self.remove=function(){if(image)Sprites.remove(image)
image=null
Depth.removeChild(self)
self.disable()
Sprites.clear(self)
Pool.remove(self)}
self.click=onDown
if(vars)self.reset(vars)}
Pool.register("Button_News",Button_News,0,Phaser.Sprite)