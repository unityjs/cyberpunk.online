var Emojis=new function(){var self=this
var sprites=[]
var spritePool=[]
self.pool=[]
self.reset=function(){for(var n in self.pool)self.pool[n].remove()
self.pool=[]
sprites=[]
for(var n in Data.emoticons)
if(Data.emoticons[n].isUnlocked)
for(var i=0;i<3;i++)sprites.push(Data.emoticons[n].sprite)}
self.spawn=function(spawner){if(!spritePool.length)spritePool=ArrayUtil.shuffle(sprites)
self.pool.push(Pool.spawn("Emoji",{sprite:spritePool.shift(),spawner:spawner}))}
self.remove=function(emoji){emoji.remove()
ArrayUtil.removeItem(self.pool,emoji)}}
function Emoji(){var self=Canvas.cast(this)
var scale=.76
var sprite
var isMoved
var isRemoved
self.matter=Matter.Bodies.circle(0,0,48*scale,{collisionFilter:{category:0x0002},mass:.00001,friction:.00001,restitution:.3,density:.00000001})
self.matter.ignoreMe=true
self.reset=function(vars){isRemoved=isMoved=false
sprite=Sprites.get(vars.sprite,{parent:self,scale:scale})
var rot=MathUtil.degreeToRadians(vars.spawner.angle+90+180+Random.spectrum(5))
var speed=Random.value(1200,900)/70
Matter.Body.setPosition(self.matter,{x:vars.spawner.x,y:vars.spawner.y})
Matter.Body.setVelocity(self.matter,{x:Math.cos(rot)*speed,y:Math.sin(rot)*speed})
Matter.Body.setAngle(self.matter,MathUtil.degreeToRadians(Random.decimal(360)))
Matter.addToWorld(self)
Canvas.mid.addChild(self)
Tick.start(update)}
function update(){Matter.Body.setAngularVelocity(self.matter,self.matter.velocity.x*.02)
if(self.y>2000||Math.abs(self.x)>2000)self.die()}
self.die=function(){LevelLogic.emojiLost()
Emojis.remove(self)}
self.remove=function(){if(isRemoved)return
isRemoved=true
Sprites.remove(sprite)
Pool.remove(self)
Matter.remove(self)
Depth.removeChild(self)
Tick.stop(update)}
self.moveOut=function(){if(isMoved)return
Particles.shockwave(self,{texture:"face_die",scale:1.2,tint:0xFFFFFF})
isMoved=true
self.die()}}
Pool.registerCanvas("Emoji",Emoji)