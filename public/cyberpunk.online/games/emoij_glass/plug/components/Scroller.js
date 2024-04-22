function Scroller(vars){var vars=vars||{}
vars.x=vars.x||Canvas.LEFT
vars.y=vars.y||Canvas.TOP
vars.width=vars.width||Canvas.WIDTH
vars.height=vars.height||Canvas.HEIGHT
var onMouseUp=vars.onMouseUp||function(e){}
var self=Sprites.cast(this,"blank",{x:vars.x,y:vars.y,parent:vars.parent})
var width=vars.width||500
var height=vars.height||500
var slider=vars.slider
var contentWidth
var contantHeight
var offset=0
var position=0
var isDragging
var dragOffset=0
var dragPosition=0
var isHorizontal=true
var dragCounter=0
new ButtonSimple(Sprites.get("blank",{anchorX:0,anchorY:0,width:width,height:height,parent:self}),startDrag)
self.content=Canvas.add(self)
self.percent=0
var velocity=new Vector3D()
var mask=game.add.graphics(0,0)
mask.beginFill(0xFF0000)
mask.drawRect(0,0,width,height)
mask.alpha=0
self.mask=mask
self.addChild(mask)
self.showGallery=function(gallery,landscape,extra){self.show()
self.content.addChild(gallery)
contentWidth=gallery.width+gallery.x+(extra||500)
contentHeight=gallery.height+gallery.y+(extra||500)
isHorizontal=landscape!=null?landscape:contentWidth>contentWidth
offset=isHorizontal?contentWidth-width:contentHeight-height
position=0
dragPosition=0
self.scrollToPercent(0)
Tick.start(update)
if(!self.slider)return
offset>0?self.slider.enable():self.slider.disable()
self.slider.setPercent(0)}
self.scrollToPercent=function(percent){self.percent=MathUtil.hardLimit(percent,0,100)
position=-percent*offset/100}
function update(){var a=isHorizontal?"x":"y"
self.content[a]+=(position-self.content[a])/2
if(Math.abs(Cursor.wheelVelocity)<1)return
self.scrollToPercent(self.percent-Cursor.wheelVelocity)
velocity.y-=Cursor.wheelVelocity*20
isDragging=false
dragCounter=0
Tick.start(updateDrag)}
self.hide=function(){Tick.stop(update)
if(self.slider)self.slider.disable()}
self.show=function(){Tick.start(update)}
self.setSlider=function(slider){self.slider=slider
if(!self.slider)return
self.slider.onUpdate=self.scrollToPercent}
self.disableMask=function(){self.mask=null}
self.enableMask=function(){self.mask=mask}
function startDrag(){self.startDrag()}
self.startDrag=function(){if(offset<0)return
self.startPos=isHorizontal?self.content.x:self.content.y
isDragging=true
dragOffset=isHorizontal?game.input.x-self.content.x:game.input.y-self.content.y
Tick.start(updateDrag)
updateDrag()}
game.input.onUp.add(function(){if(!isDragging)return
onMouseUp(dragPosition)
Callback.delay(Cursor.unblock,10)
self.elasticity=dragPosition
Cursor.update()
velocity.copy(Cursor.velocity).product(2)
dragCounter=0
isDragging=false})
function updateDrag(){if(!isDragging){dragPosition-=isHorizontal?velocity.x:velocity.y
velocity.product(.92)
scrollToDragPosition()
if(percent<=0||percent>=100){velocity.product(.9)
var target=percent<10?0:-offset
dragPosition+=(target-dragPosition)/5}
if(++dragCounter>120)Tick.stop(updateDrag)
return}
var target={x:game.input.x-dragOffset,y:game.input.y-dragOffset}
var value=isHorizontal?target.x:target.y
dragPosition+=(value-dragPosition)/3
scrollToDragPosition()
var dist=self.startPos-(isHorizontal?self.content.x:self.content.y)
if(Math.abs(dist)>25)Cursor.block()}
function scrollToDragPosition(){percent=-dragPosition*100/offset
if(percent<0)percent*=.5
if(percent>100)percent=100+(percent-100)*.5
self.scrollToPercent(percent)
if(self.slider)slider.setPercent(percent)}
self.setSlider(slider)}
Pool.register("Scroller",Scroller,0,Phaser.Sprite)