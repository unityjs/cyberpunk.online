function HeatSpin(label){var self=Canvas.cast(this)
var speed
var sprite=Sprites.get("RotatorBad",{parent:self,x:0,y:0})
var vertices=Matter.Vertices.fromPath("211 6 230 2 255 26 254 45 169 129 254 213 255 233 236 253 217 256 129 169 45 253 24 255 2 229 2 216 89 129 3 45 1 27 25 1 38 1 131 90")
self.matter=Matter.Bodies.fromVertices(0,0,vertices,{isStatic:true,render:{fillStyle:"#556270",strokeStyle:"#556270",lineWidth:1}},true)
self.reset=function(vars){Matter.Body.setPosition(self.matter,vars)
Matter.Body.setAngle(self.matter,MathUtil.degreeToRadians(vars.angle))
Matter.addToWorld(self)
Canvas.front.addChild(self)
PencilPhysics.collisionBodies.push(self.matter)
speed=.03
Tick.start(update)}
self.remove=function(){Tick.stop(update)}
function update(){Matter.Body.setAngle(self.matter,self.matter.angle+speed)
for(var n in Emojis.pool)
if(Matter.SAT.collides(self.matter,Emojis.pool[n].matter).collided)Emojis.pool[n].moveOut()}}
Pool.registerCanvas("HeatSpin",HeatSpin)