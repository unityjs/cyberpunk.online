function Button_LevelPage(atlasId,onMouseDown,vars){var self=Sprites.cast(this,atlasId||"levelgroup_base")
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
var Y=330
var textField=Texts.spawnBitmap("stroke",{y:-Y,fontSize:70,parent:self})
var starsField=Texts.spawnBitmap("font3",{y:Y+10,fontSize:70,parent:self,tint:0x000000})
var isLocked
var blockImage=Sprites.get("levelgroup_block",{x:0,y:0,parent:self})
Texts.spawnBitmap("stroke",{text:"to unlock",y:330,fontSize:70,parent:blockImage})
var starContainer=Canvas.add(blockImage,0,150)
Sprites.get("symbol_star",{x:0,y:0,anchorX:0,scale:2,parent:starContainer})
var unlockField=Texts.spawnBitmap("stroke",{text:24,y:20,x:130,anchorX:0,fontSize:110,parent:starContainer})
var sprite
self.reset=function(vars){var vars=self.data=vars||{}
Sprites.applyVars(self,vars)
if(vars.sprite)sprite=Sprites.get(vars.sprite,{parent:self,fitArea:new Rect(0,0,433,433)})
textField.text=(vars.id*10+1)+"-"+(vars.id*10+vars.length)
starsField.text=StringUtil.fillZero(vars.stars)+"/"+StringUtil.fillZero(vars.totalStars)
self.mute=vars.mute
self.onMouseDown=onMouseDown||vars.onMouseDown
self.onMouseUp=vars.onMouseUp
self.onClick=vars.onClick
if(vars.sound)self.sound=vars.sound
self.enable()
isLocked=self.data.unlocksAt>Levels.stars
unlockField.text=self.data.unlocksAt
starContainer.x=-starContainer.width/2
isLocked?self.lock():self.unlock()}
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
function onUp(){if(isLocked)return;if(((Cursor.isBlocked||Cursor.isLocked)))return
if(!isEnabled)return
if(self.onClick==null)return
isOver=false
if(!self.mute)Sounds.play("button")
self.onClick(self)}
function onOver(){if(!isEnabled||((Cursor.isBlocked||Cursor.isLocked)))return
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
self.remove=function(){if(sprite)Sprites.remove(sprite)
sprite=null
Depth.removeChild(self)
self.disable()
Sprites.clear(self)
Pool.remove(self)}
self.lock=function(){starsField.visible=false
self.addChild(blockImage)}
self.unlock=function(){starsField.visible=true
Depth.removeChild(blockImage)}
self.click=onDown
if(vars)self.reset(vars)}
Pool.registerSprite("Button_LevelPage",Button_LevelPage)