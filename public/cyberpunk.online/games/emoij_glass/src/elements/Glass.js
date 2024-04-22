var Glasses=new function(){var self=this
self.pool=[]
self.reset=function(){self.pool=[]}
self.updateFill=function(){var filled=0
for(var n in self.pool)filled+=self.pool[n].filled
LevelLogic.updateFill(filled)}}
var glassIDs=0
function Glass(label){var self=Canvas.cast(this)
var sprite=Sprites.get("Glass",{parent:self,x:2,y:0})
var front=Canvas.add()
Sprites.get("Glass_line",{parent:front,x:2,y:0})
var sensor
var floor
var wallL
var wallR
self.filled=0
var isActive=false
var counter=0
var id="glass"+(++glassIDs)
var vars
function makeBody(static){ArrayUtil.removeItem(PencilPhysics.collisionBodies,self.matter)
Canvas.foreground.addChild(self)
sensor=Matter.Bodies.rectangle(0,-50,170,450,{restitution:.1,mass:0,isSensor:true})
floor=Matter.Bodies.rectangle(0,208,210,41,{restitution:.1,chamfer:{radius:24}})
wallL=Matter.Bodies.rectangle(-140,-31-3,42,526,{restitution:.1,angle:MathUtil.degreeToRadians(-9),chamfer:{radius:24}})
wallR=Matter.Bodies.rectangle(140,-31-3,42,526,{restitution:.1,angle:MathUtil.degreeToRadians(9),chamfer:{radius:24}})
self.matter=Matter.Body.create({parts:[floor,wallL,wallR,sensor]})
Matter.Body.setAngle(self.matter,MathUtil.degreeToRadians(vars.angle))
Matter.Body.setPosition(self.matter,{x:vars.x,y:vars.y})
PencilPhysics.collisionBodies.push(self.matter)
Matter.addToWorld(self)
if(static)return Matter.Body.setStatic(self.matter,true)
Matter.Body.setMass(self.matter,2)
Matter.Body.setDensity(self.matter,.0000001)}
self.reset=function(v){vars=v
Glasses.pool.push(self)
makeBody(true)
self.filled=0
counter=0
updateFront()
Canvas.front.addChild(front)}
self.remove=function(){Depth.removeChild(front)
self.matter=null
isActive=false
Tick.stop(update)}
self.start=function(){Matter.Body.setStatic(self.matter,false)
Matter.Body.setMass(self.matter,2)
Matter.Body.setDensity(self.matter,.0000001)
isActive=true
Tick.start(update)}
function updateFront(){front.x=self.matter.position.x
front.y=self.matter.position.y
front.rotation=self.matter.angle}
function update(){updateFront()
if(!isActive)return
if(counter++<60)return
var lastFilled=self.filled
self.filled=0
var hitShape=false
if(!hitShape){for(var n in Emojis.pool){try{var emoji=Emojis.pool[n]
if(emoji.matter&&Matter.SAT.collides(sensor,emoji.matter).collided)self.filled++}catch(err){}}}
if(lastFilled!=self.filled){Glasses.updateFill()}
if(self.y>2000||Math.abs(self.x)>2000)return LevelLogic.start()}}
Pool.registerCanvas("Glass",Glass)