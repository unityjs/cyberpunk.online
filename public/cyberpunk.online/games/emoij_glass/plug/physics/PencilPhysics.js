var PencilPhysics=function(){var self=PencilPhysics=Canvas.cast(this)
var lastValidPoint={}
var lastPoint={}
var fadeTime=.5
var isDown
var wasDown
var lines=[]
var head=Canvas.add(self)
var onDrawComplete
var onDrawUpdate
var isEnabled
var sound
self.shapes=[]
var wiggle=0
var wiggleLastic=0
var tint
var redLine=Pool.spawn("Line",{thickness:1.1,from:{x:0,y:0},to:{x:0,y:0}})
var headSprite
var hasCollided
var lastValidPointGhost
self.collisionBodies=[]
self.setHead=function(texture,tintcolor){if(headSprite)Sprites.remove(headSprite)
headSprite=Sprites.get(texture||"Pencil",{x:0,y:0,anchorX:0,anchorY:1,parent:head})
redLine.tint=tint=tintcolor||0x0084ff}
self.setHead()
self.enable=function(onComplete,onUpdate){isEnabled=true
onDrawComplete=onComplete
onDrawUpdate=onUpdate}
self.disable=function(){log("disable Pencil")
self.collisionBodies=[]
isEnabled=false
onUp()}
game.input.onDown.add(function(){if(Cursor.y<Canvas.TOP+290)return
if(!isEnabled||!Engine.isPlaying)return
Finger.hide()
hasCollided=false
wasDown=true
wiggle=wiggleLastic=0
self.visible=true
wasDown=true
lastValidPoint=null
lastPoint=null
isDown=true
lastValidPointGhost=null
sound=Sounds.loop("scribble")
Canvas.aboveall.addChild(redLine)
Tick.start(update)
Canvas.aboveall.addChild(self)
update()})
game.input.onUp.add(function(){if(!isEnabled)return
onUp()})
function onUp(){if(wasDown){var shape=createShape()
if(shape&&onDrawComplete!=null)onDrawComplete(shape)}
isDown=false
Depth.removeChild(redLine)
if(sound)sound.stop()
wasDown=false
Tick.stop(update)
self.visible=false
Depth.removeChild(self)}
self.reset=function(){self.collisionBodies=[]
for(var n in self.shapes)self.shapes[n].remove()
self.shapes=[]}
function update(){var newPoint={}
self.x=newPoint.x=game.input.x-game.world.centerX
self.y=newPoint.y=game.input.y-game.world.centerY
if(lastPoint)wiggle+=newPoint.x-lastPoint.x
lastPoint=newPoint
wiggle+=-wiggle/10
wiggleLastic+=(wiggle-wiggleLastic)*.2
wiggleLastic*=.8
head.angle=wiggleLastic/1.4
redLine.visible=false
if(!lastValidPoint)return updatelastValidPoint()
redLine.visible=true
redLine.from=lastValidPoint
redLine.to=newPoint
hasCollided=Matter.hitCast(lastValidPoint,newPoint,self.collisionBodies)
if(hasCollided&&!lines.length&&lastValidPointGhost&&!Matter.hitCast(lastValidPointGhost,newPoint)){lastValidPoint=lastValidPointGhost
hasCollided=false}
lastValidPointGhost=newPoint
redLine.tint=hasCollided?0xFF0000:tint
redLine.draw()
if(hasCollided)return
if(MathUtil.hipotenusa(lastValidPoint,newPoint)<20)return
var line=Pool.spawn("Line",{thickness:1.1,tint:tint,from:lastValidPoint,to:newPoint,parent:Canvas.particles})
lines.push(line)
updatelastValidPoint()
line.draw()
if(onDrawUpdate!=null)onDrawUpdate()
function updatelastValidPoint(){lastValidPoint=newPoint}}
function createShape(){if(!lines.length){lines=[]
return}
var shape=new Shape_Matter(lines,tint)
self.shapes.push(shape)
lines=[]
return shape}
self.disable()}
Pool.registerCanvas("PencilPhysics",PencilPhysics)