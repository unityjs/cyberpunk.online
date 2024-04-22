function Fan(label){var self=Canvas.cast(this)
var sprite=Sprites.get("Fan",{parent:self,x:0,y:420})
var windContainer=Canvas.add(sprite)
var fanContainer=Canvas.add(windContainer)
var fan=Sprites.get("fan_helix",{x:0,y:0,parent:fanContainer})
var wind=[]
var inWind=[]
for(var n=0;n<10;n++)wind.push(new Wind(windContainer,n))
fanContainer.scale.set(1.3,.23)
var vertices=Matter.Vertices.fromPath("155 173 24 141 1 102 31 47 78 22 172 4 292 0 409 16 475 50 503 104 481 142 338 177")
var base=Matter.Bodies.fromVertices(0,0,vertices,{},true)
var sensor=Matter.Bodies.rectangle(0,-500,400,1000,{mass:0,isSensor:true})
self.matter=Matter.Body.create({isStatic:true,parts:[base,sensor]})
self.matter.ignoreMe=true
self.reset=function(vars){self.x=vars.x
self.y=vars.y
Matter.Body.setPosition(self.matter,{x:vars.x,y:vars.y})
Matter.Body.setAngle(self.matter,MathUtil.degreeToRadians(vars.angle))
Matter.addToWorld(self)
Canvas.front.addChild(self)
Tick.start(update)}
self.remove=function(){Tick.stop(update)}
function update(){for(var n in Emojis.pool){var emoji=Emojis.pool[n]
if(Matter.SAT.collides(sensor,emoji.matter).collided)Matter.Body.setVelocity(emoji.matter,{x:emoji.matter.velocity.x,y:emoji.matter.velocity.y-.9})}
fan.angle+=5
for(var n in wind)wind[n].doUpdate()}}
Pool.registerCanvas("Fan",Fan)
function Wind(parent,n){var self=Sprites.cast(this,"Wind",{parent:parent})
self.x=self.y=0
var counter=0
var speed
self.spawn=function(){counter=Random.value(30,5)
self.alpha=1
self.x=n*40-180
self.y=100-Random.value(400)
speed=-Random.value(100,30)
self.scale.set(1,.5-speed/100)}
self.doUpdate=function(){if(--counter<0)self.spawn()
self.alpha+=(0-self.alpha)/5
self.y+=speed}
self.spawn()}
Pool.registerSprite("Wind",Wind)