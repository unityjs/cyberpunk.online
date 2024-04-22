var CannonID=0
var Cannons=new function(){var self=this
self.pool=[]
self.emojiCount=30
self.reset=function(){self.pool=[]}}
function Cannon(label){var self=this
var id="Cannon_"+(CannonID++)
var front=Canvas.add(Canvas.front)
var back=Canvas.add(Canvas.back)
var frontSprite=Sprites.get("Cannon_front",{x:3,y:60,parent:front})
var backSprite=Sprites.get("Cannon_base",{x:3,y:60,parent:back})
var vertices=Matter.Vertices.fromPath("81 107 68 122 -65 123 -75 117 -80 110 -81 -52 -93 -54 -99 -60 -99 -113 -83 -119 -51 -122 50 -123 95 -117 98 -114 99 -60 93 -54 81 -52")
self.matter=Matter.Bodies.fromVertices(0,0,vertices,{collisionFilter:{mask:0x0001},isStatic:true,render:{fillStyle:"#556270",strokeStyle:"#556270",lineWidth:1}},true)
var count=4
var isRemoved=false
self.reset=function(vars){Cancel(id)
self.angle=vars.angle
front.x=back.x=self.x=vars.x
front.y=back.y=self.y=vars.y
self.angle=front.angle=back.angle=vars.angle
Matter.Body.setPosition(self.matter,vars)
Matter.Body.setAngle(self.matter,MathUtil.degreeToRadians(vars.angle))
Matter.addToWorld(self)
Canvas.front.addChild(front)
Canvas.back.addChild(back)
Cannons.pool.push(self)
isRemoved=false
PencilPhysics.collisionBodies.push(self.matter)}
self.remove=function(){isRemoved=true
Matter.remove(self)
Depth.removeChild(front)
Depth.removeChild(back)
Cancel(id)}
self.start=function(){count=Cannons.emojiCount*Glasses.pool.length
spawn()}
function spawn(){if(isRemoved)return
--count>0?DelayUnique(id,spawn,200):LevelLogic.onCannonEnd()
Sounds.playRandom("cannon",5)
for(var n=0;n<1;n++){var sX=1.1
var sY=.9
front.scale.set(sX,sY)
back.scale.set(sX,sY)
Animation.scaleTo(front)
Animation.scaleTo(back)
Emojis.spawn(self)}}}
Pool.register("Cannon",Cannon)