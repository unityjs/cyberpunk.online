function Button_Level(atlasId,onMouseDown,vars){var self=Sprites.cast(this,atlasId||"Levelbtn_base")
self.id=bcounts++
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
var Y=253
var textField=Texts.spawnBitmap("stroke",{y:-Y,fontSize:60,parent:self})
var starsBar=new StarsBar({x:-100,y:Y,parent:self,margin:100})
var blockSprite=Sprites.get("Levelbtn_lock",{parent:self,x:0,y:0})
var sprite
self.reset=function(vars){var vars=self.data=vars||{}
Sprites.applyVars(self,vars)
if(vars.sprite)sprite=Sprites.get(vars.sprite,{parent:self,fitArea:new Rect(0,-3,410,410)})
textField.setText("LEVEL "+((vars.id||0)+1))
self.mute=vars.mute
self.onMouseDown=onMouseDown||vars.onMouseDown
self.onMouseUp=vars.onMouseUp
self.onClick=vars.onClick
if(vars.sound)self.sound=vars.sound
starsBar.setStars(vars.stars)
vars.isLocked?self.disable():self.enable()}
function onDown(){isOver=false
if(!isEnabled||((Cursor.isBlocked||Cursor.isLocked)))return
if(!isEnabled)return
if(!self.mute&&!self.onClick)Sounds.play(self.sound)
if(self.onMouseDown!=null)self.onMouseDown(self)}
function onOut(){isOver=false
isMouseOver=false
if(!isEnabled)return
if(self.onMouseOut)self.onMouseOut()
if(self.onMouseUp)self.onMouseUp(self)}
function onUp(){if(self.data.isLocked)return;if(((Cursor.isBlocked||Cursor.isLocked)))return
if(!isEnabled)return
if(self.onClick==null)return
isOver=false
if(!self.mute)Sounds.play("button")
self.onClick(self)}
function onOver(){if(!isEnabled||((Cursor.isBlocked||Cursor.isLocked)))return
isOver=true
isMouseOver=true
if(self.onMouseOver)self.onMouseOver()}
self.disable=function(){self.addChild(blockSprite)
self.inputEnabled=false
isEnabled=false}
self.enable=function(force){Depth.removeChild(blockSprite)
self.inputEnabled=true
isEnabled=true}
self.show=function(){self.inputEnabled=true
isEnabled=true
Animation.fadeIn(self,300)}
self.hide=function(){self.inputEnabled=false
isEnabled=false
Animation.fadeOut(self,300)}
self.remove=function(){if(sprite)Sprites.remove(sprite)
sprite=null
Depth.removeChild(self)
self.disable()
Sprites.clear(self)
Pool.remove(self)}
self.click=onDown
if(vars)self.reset(vars)}
Pool.register("Button_Level",Button_Level,0,Phaser.Sprite)