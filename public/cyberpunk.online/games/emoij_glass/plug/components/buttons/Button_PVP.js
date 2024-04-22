function Button_PVP(vars){var self=Sprites.cast(this,"listbox_base")
var baseBtn=new Button_SpriteSimple("blank",onMouseDownBase,{width:self.width,height:self.height,onClick:onSlideClick,x:0,y:0,zoomScale:1,parent:self})
var content=Canvas.add(self)
self.isButton=true
var id="pvp"+(bcount++)
var actionBtn=new Button_Sprite("blank",onMouseDown,{onClick:onClick,x:344,y:0,zoomScale:1,parent:content,action:"action"})
var removeBtn=new Button_Sprite("pvp_remove_btn",onMouseDown,{onClick:onClick,x:588,y:0,zoomScale:1,parent:content,action:"remove"})
var icon
var textY=-25
var textX=-285
var titleField=Texts.spawn("Roboto",{parent:content,anchorX:0,x:textX,y:textY,fontSize:60,text:"title",fill:"#000000",strokeThickness:0})
var subTextField=Texts.spawn("Roboto",{parent:content,anchorX:0,x:textX,y:textY+55,fontSize:40,text:"value",fill:"#bec0c5",strokeThickness:0})
var spriteNudge=Sprites.get("pvp_nudge_btn",{x:0,y:0})
var spritePlay=Sprites.get("pvp_play_btn",{x:0,y:0})
var thumbnail=new Thumbnail({parent:content,radius:143,x:-405})
var isOpen=false
var isDragging
var dragCount
var offsetX
var mask=game.add.graphics(-self.width/2,-self.height/2)
mask.beginFill(0xFF0000)
mask.drawRect(0,0,self.width,self.height)
self.mask=mask
self.addChild(mask)
var isBlocked
self.reset=function(vars){Sprites.applyVars(self,vars)
self.data=vars
if(icon)Depth.removeChild(icon)
if(vars.icon)icon=Sprites.get(vars.icon,{parent:self,x:0,y:textY-60,anchorY:1})
titleField.text=vars.userName
subTextField.text=vars.subText
Depth.removeChild(spriteNudge)
Depth.removeChild(spritePlay)
thumbnail.load(vars.userPhoto)
actionBtn.addChild(vars.turn?spritePlay:spriteNudge)
actionBtn.data.action=vars.turn?"play":"nudge"
actionBtn.enable()
baseBtn.enable()
isOpen=false
content.x=0}
function onMouseDown(){if(isBlocked)return
self.onMouseDown(self)}
function onClick(button){if(isBlocked)return
if(isOpen)onSlide(false)
self.action=button.data.action
self.onClick(self)
actionBtn.disable()}
function onMouseDownBase(){if(isBlocked)return
isDragging=true
Cancel(id)
if(isOpen)return onSlide(false)
offsetX=game.input.x-self.world.x-content.x
Tick.start(updateDrag)
self.onMouseDown(self)
dragCount=0
content.addChild(removeBtn)
removeBtn.enable()}
function onSlideClick(){if(isBlocked)return}
function onSlide(value){if(isBlocked)return
isDragging=true
isOpen=value
snapBack()}
function snapBack(){if(!isDragging)return
isBlocked=true
var time=350
Tick.stop(updateDrag)
Animation.springTo(content,{x:isOpen?-185:0},time,.1,.72)
isDragging=false
DelayUnique(id,function(){isBlocked=false
if(!isOpen){Depth.removeChild(removeBtn)
removeBtn.disable()}},time)}
function updateDrag(){if(Cursor.isBlocked)return snapBack()
dragCount++
content.x+=((game.input.x-self.world.x-offsetX)/10-content.x)/2
var dragMargin=20
if(content.x>dragMargin)content.x=dragMargin
if(content.x<-185-dragMargin)content.x=-185-dragMargin
if(!isOpen&&content.x<-20)onSlide(true)
if(isOpen&&content.x>-185)onSlide(false)}
game.input.onUp.add(function(){if(!isDragging)return
if(dragCount<20)isOpen=!isOpen
snapBack()
isDragging=false})
self.select=function(){}
self.setFalse=function(){}
self.remove=function(){Depth.removeChild(self)
Pool.remove(self)
actionBtn.disable()
baseBtn.disable()
removeBtn.disable()}
if(vars)self.reset(vars)}
Pool.register("Button_PVP",Button_PVP,0,Phaser.Sprite)