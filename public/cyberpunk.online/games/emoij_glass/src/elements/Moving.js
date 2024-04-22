var MovingPool=new function(){var self=this
self.pool=[]
self.reset=function(){self.pool=[]}}
function Moving(){var self=Canvas.cast(this)
var sprite
var radius=246
var label
self.reset=function(vars){label=vars.label
sprite=Sprites.get(label,{parent:self,x:0,y:0,scaleX:vars.scale,scaleY:vars.scaleY})
var params={isStatic:true,mass:.1,friction:.1,restitution:0,density:.1}
if(label=="MovingSquare")self.matter=Matter.Bodies.rectangle(0,0,radius*vars.scale,radius*vars.scaleY,params)
if(label=="MovingCircle")self.matter=Matter.Bodies.circle(0,0,radius*.5*vars.scale,params)
sprite.scale.set(vars.scale,vars.scaleY)
Matter.Body.setPosition(self.matter,vars)
Matter.Body.setAngle(self.matter,MathUtil.degreeToRadians(vars.angle))
Matter.addToWorld(self)
Canvas.foreground.addChild(self)
PencilPhysics.collisionBodies.push(self.matter)
MovingPool.pool.push(self)}
self.start=function(){Matter.Body.setStatic(self.matter,false)
Matter.Body.setMass(self.matter,label=="MovingCircle"?.005:.01)
Tick.start(update)}
function update(){if(self.y>2000||Math.abs(self.x)>2000)self.remove()}
self.remove=function(){Sprites.remove(sprite)}}
Pool.registerCanvas("Moving",Moving)