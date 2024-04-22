var Snow
function mySnow(){Snow=self=this
var isPlaying
var pool=[]
for(var n=0;n<3;n++)pool.push(new SnowItem())
self.container=Canvas.add(Canvas.background)
self.start=function(){if(isPlaying)return
isPlaying=true
for(var n in pool)pool[n].start()
Tick.start(update)
Animation.fadeIn(self.container)}
self.stop=function(){if(!isPlaying)return
isPlaying=false
Animation.fadeOut(self.container,200)
Delay(function(){for(var n in pool)pool[n].remove()
Tick.stop(update)},400)}
function update(){for(var n in pool)pool[n].update()}}
function SnowItem(){var self=this
var sprite=Sprites.get("star")
var sinA
var sinB
var sinC
var speedX
var speedY
var speedR
var speedC
var scale
var x
var y
self.start=function(){Snow.container.addChild(sprite)
sinA=Math.random()*999
sinB=Math.random()*999
sinC=Math.random()*999
sprite.x=x=Random.spectrum(game.world.width/2)
sprite.y=y=Random.spectrum(game.world.height/2)
scale=Random.value(8,4)/60
speedX=-Random.value(10,3)
speedY=Random.value(10,3)
speedR=Random.spectrum(100)/20
speedC=Random.spectrum(100)/500
sprite.alpha=Random.value(10,7)/10
sprite.scale.set(scale,scale)}
self.remove=function(){Animation.fadeOut(sprite)}
self.update=function(){x+=speedX
y+=speedY
sinA+=.03
sinB+=.06
sinC+=speedC
sprite.x=x+Math.sin(sinA)*100
sprite.y=y+Math.sin(sinB)*20
sprite.scale.set(scale*Math.sin(sinC),scale)
sprite.angle+=speedR
if(x<Canvas.LEFT)x+=Canvas.WIDTH*1.2
if(y>Canvas.BOTTOM)y-=Canvas.HEIGHT*1.2}}
Pool.register("SnowItem",SnowItem)