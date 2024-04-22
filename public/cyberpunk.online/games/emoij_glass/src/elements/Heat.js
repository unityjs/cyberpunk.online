function Heat(label){var self=Canvas.cast(this)
var sprite=Sprites.get("Heat",{parent:self,x:0,y:0})
var vertices=Matter.Vertices.fromPath("5 34 11 0 245 0 251 33")
self.matter=Matter.Bodies.fromVertices(0,0,vertices,{isStatic:true,render:{fillStyle:"#556270",strokeStyle:"#556270",lineWidth:1}},true)
var data
self.reset=function(vars){data=vars
Matter.Body.setPosition(self.matter,vars)
Matter.Body.setAngle(self.matter,MathUtil.degreeToRadians(vars.angle))
Matter.Body.scale(self.matter,vars.scale,vars.scaleY)
Matter.addToWorld(self)
Canvas.mid.addChild(self)
sprite.scale.set(vars.scale)
Tick.start(update)
PencilPhysics.collisionBodies.push(self.matter)}
self.remove=function(){Matter.Body.scale(self.matter,1/data.scale,1/data.scaleY)
Tick.stop(update)}
function update(){for(var n in Emojis.pool)
if(Matter.SAT.collides(self.matter,Emojis.pool[n].matter).collided)Emojis.pool[n].moveOut()}}
Pool.registerCanvas("Heat",Heat)
var spikesID=0
function SpikesHeat(){var self=Canvas.cast(this,Canvas.game)
var sprite=Sprites.get("SpikesHeat",{parent:self,x:0,y:-30})
var vertices=Matter.Vertices.fromPath("-142 63 -122 -63 -100 62 -94 62 -74 -63 -52 62 -45 62 -25 -63 -3 62 3 62 23 -63 45 62 51 62 71 -63 93 62 99 62 121 -63 142 63")
var sensor=Matter.Bodies.fromVertices(0,23,vertices)
var base=Matter.Bodies.rectangle(0,90,378,50)
self.matter=Matter.Body.create({isSensor:true,isStatic:true,parts:[base,sensor]})
var id=spikesID++
var data
self.reset=function(vars){data=vars
Matter.Body.setPosition(self.matter,{x:vars.x,y:vars.y})
Matter.Body.setAngle(self.matter,MathUtil.degreeToRadians(vars.angle))
Matter.Body.scale(self.matter,data.scale,data.scaleY)
sprite.scale.set(vars.scale)
Matter.addToWorld(self)
Canvas.mid.addChild(self)
PencilPhysics.collisionBodies.push(self.matter)
Tick.start(update)}
self.remove=function(){Matter.Body.scale(self.matter,1/data.scale,1/data.scaleY)
Tick.stop(update)}
function update(){for(var n in Emojis.pool){if(Matter.SAT.collides(sensor,Emojis.pool[n].matter).collided)Emojis.pool[n].moveOut()}}}
Pool.registerCanvas("SpikesHeat",SpikesHeat)