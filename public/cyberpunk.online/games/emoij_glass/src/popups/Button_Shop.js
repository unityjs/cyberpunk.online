var bcounts=0
var LockSinCount
function Button_Shop(){var self=Sprites.cast(this,"shopbtn_base")
self.id=bcounts++
self.sprite=self
self.inputEnabled=true
if(!LockSinCount)LockSinCount=new SinCount()
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
var id
var onSprite
var isMouseOver
var type
var valueField=Texts.spawnBitmap("stroke",{parent:self,x:150,y:-120,size:40,text:"value",anchorX:1,tint:0x0000})
var checkMark=Sprites.get("shopbtnl_checkmark",{parent:self,x:100,y:valueField.y})
self.reset=function(vars){if(!vars)return
var vars=self.data=vars||{}
var spriteName=vars.sprite||vars.onSprite
onSprite=Sprites.get(spriteName,{x:0,y:0,fitArea:new Rect(0,0,200,200),parent:self})
id=vars.id
type=vars.type
self.mute=vars.mute
self.onMouseDown=vars.onMouseDown
self.onMouseUp=vars.onMouseUp
self.onClick=vars.onClick
scale=vars.scale||1
self.zoomScale=vars.zoomScale||1
valueField.text=StringUtil.commas(vars.price)
vars.isUnlocked?self.unlock():self.lock()
self.enable()
if(type=="pen")self.setBoolean(spriteName==Data.get("selPen"))}
function onDown(){isOver=false
if(!isEnabled||Cursor.isBlocked||Cursor.isLocked)return
Tick.start(update)
if(!isEnabled)return
if(!self.mute&&!self.onClick)Sounds.play("button")
if(self.onMouseDown!=null)self.onMouseDown(self)
if(self.onClick==null){Tick.start(update)
self.scale.set(self.zoomScale*1.1,self.zoomScale*1.1)
return}}
function onOut(){isOver=false
isMouseOver=false
if(!isEnabled)return
if(self.onMouseOut)self.onMouseOut()
if(self.onMouseUp)self.onMouseUp(self)}
function onUp(){if(self.onClick==null||!isEnabled||Cursor.isBlocked||Cursor.isLocked)return
Tick.start(update)
isOver=false
self.scale.set(self.zoomScale*1.1,self.zoomScale*1.1)
if(!self.mute)Sounds.play("button")
self.onClick(self)}
function onOver(){if(!isEnabled||Cursor.isBlocked||Cursor.isLocked)return
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
if(isOver||++counter<100)return
self.scale.set(scale,scale)
Tick.stop(update)}
self.disable=function(){isEnabled=false}
self.enable=function(force){isEnabled=true}
self.show=function(){isShowing=true
isEnabled=true}
self.hide=function(){isShowing=false
isEnabled=false}
self.setBoolean=function(bool){if(type!="pen")return
self.boolean=bool
Depth.removeChild(checkMark)
if(bool)self.addChild(checkMark)}
self.setFalse=function(){self.setBoolean(false)}
self.remove=function(){Sprites.remove(onSprite)
onSprite=null
Tick.stop(update)
Depth.removeChild(self)
self.disable()
Sprites.clear(self)
Pool.remove(self)}
self.lock=function(){valueField.visible=true
Depth.removeChild(checkMark)
Depth.toFront(valueField)}
self.unlock=function(){self.data.unlock()
if(type!="pen")self.addChild(checkMark)
valueField.visible=false
Depth.toFront(valueField)}
self.refresh=function(){}
self.click=onDown}
Pool.registerSprite("Button_Shop",Button_Shop)