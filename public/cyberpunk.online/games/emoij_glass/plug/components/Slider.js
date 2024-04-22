function Slider(onUpdate,vars){var self=this
var vars=vars||{}
self.container=Sprites.get("blank",{parent:vars.parent,x:vars.x,y:vars.y})
var barSprite=vars.barSprite||Sprites.get("Scroll_Base",{x:0,y:0})
var handleSprite=vars.handleSprite||Sprites.get("Scroll_Bar",{x:0,y:0})
self.container.addChild(barSprite)
self.container.addChild(handleSprite)
self.percent=0
self.onUpdate=onUpdate
var handleBtn=new ButtonSimple(handleSprite,startDrag)
var barBtn=new ButtonSimple(barSprite,startDrag)
var isEnabled
var position
var isHorizontal=barSprite.width>barSprite.height
var totalWidth=isHorizontal?barSprite.width-handleSprite.width:barSprite.height-handleSprite.height
var halfWidth=totalWidth/2
var isDragging
function startDrag(){if(!isEnabled)return
isDragging=true
Tick.start(updateDrag)}
function stopDrag(){Tick.stop(updateDrag)}
function barClick(){if(!isEnabled)return
if(isHorizontal){handleSprite.x=game.input.x-self.container.world.x}else{handleSprite.y=game.input.y-self.container.world.y}}
function updateDrag(){if(isHorizontal){position=MathUtil.hardLimit(game.input.x-self.container.world.x,-halfWidth,halfWidth)
handleSprite.x+=(position-handleSprite.x)/3}else{position=MathUtil.hardLimit(game.input.y-self.container.world.y,-halfWidth,halfWidth)
handleSprite.y+=(position-handleSprite.y)/3}
self.percent=(position+halfWidth)*100/totalWidth
if(self.onUpdate!=null)self.onUpdate(self.percent)}
game.input.onUp.add(function(){if(!isDragging)return
Tick.stop(updateDrag)
isDragging=false
moveHandler()})
function moveHandler(){position=self.percent*totalWidth/100-halfWidth
Animation.to(handleSprite,isHorizontal?{x:position}:{y:position},200,Phaser.Easing.Circular.Out)}
self.setPercent=function(percent){self.percent=MathUtil.hardLimit(percent,0,100)
moveHandler()}
self.disable=function(){isEnabled=false
self.container.visible=false}
self.enable=function(){isEnabled=true
self.container.visible=true}
self.disable()
self.setPercent(0)}