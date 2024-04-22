var Particles=new function(){var self=this
var particles=[]
var layers=[]
self.blendMode=0
function play(){render()
Tick.start(render)}
function stop(){Tick.stop(render)}
function createParticle(texture,tint,isStandalone,container){var particle=null
var texture=texture||"particle"
if(texture=="cloud")texture+=Random.value(3,1)
particle=Sprites.get(texture)
var tint=tint!=null?tint:Colors.getColor()
if(Array.isArray(tint))tint=ArrayUtil.getRandomItem(tint)
particle.tint=tint
particle.alpha=1
particle.visible=true
particle.blendMode=self.blendMode
if(!isStandalone)particles.push(particle)
container?container.addChild(particle):Canvas.particles.addChild(particle)
return particle}
self.clear=function(){for(var n in particles)Depth.removeChild(particles[n])
particles=[]}
function render(){if(!particles.length)return stop()
for(var i=particles.length-1;i>=0;i--){var p=particles[i]
var data=p.data
var ttlFac=(data.ttl/data.duration)
if(data.gravity!=null)data.speedY+=data.gravity
if(data.friction!=null){data.speedX*=data.friction
data.speedY*=data.friction}
if(data.endColor!=null)p.tint=(data.startColor-data.endColor)*ttlFac+data.endColor
if(data.endAlpha!=null){var startAlpha=data.startAlpha
var endAlpha=data.endAlpha
var fac=ttlFac
if(data.midAlpha!=null){fac*=2
if(data.ttl>data.duration/2){startAlpha=data.startAlpha
endAlpha=data.midAlpha}else{startAlpha=data.midAlpha
endAlpha=data.endAlpha}}
p.alpha=(startAlpha-endAlpha)*fac+endAlpha}
if(data.cumulT){p.scale.x=Math.sin(data.cumulT*data.vscale)*data.basicScale;data.cumulT++}
if(data.cumulX){data.speedX+=Math.sin(data.cumulX)
data.cumulX++}
if(data.sinCount){data.sinCount+=data.sinInc;var sin=Math.sin(data.sinCount)
p.x+=data.sinX*sin*.1}
if(data.endScale!=null){var endscaleX=data.endScaleX||data.endScale
var startScaleX=data.startScaleX||data.startScale
var scale=(data.startScale-data.endScale)*ttlFac+data.endScale
var scaleX=(startScaleX-endscaleX)*ttlFac+endscaleX
p.scale.set(scale,scale)}
if(data.floorY&&p.y>data.floorY){p.y=data.floorY
data.speedY*=-.8
data.speedX*=.8
p.rotation=data.rotation=0}
if(data.rotation!=null)p.rotation+=data.rotation
if(data.follow){if(!data.accelFollow)data.accelFollow=0
data.accelFollow+=.02
var oX=0
var oY=0
if(data.fOffset){oX=data.fOffset.x
oY=data.fOffset.y}
var myFollow={x:data.follow.x+oX,y:data.follow.y+oY}
var rot=MathUtil.getRotation(p,myFollow)
data.speedX+=data.accelFollow*Math.cos(rot)
data.speedY+=data.accelFollow*Math.sin(rot)
var f=15+data.ttl/100
p.x+=(myFollow.x-p.x)/f
p.y+=(myFollow.y-p.y)/f}
if(data.speedX!=null)p.x+=data.speedX
if(data.speedY!=null)p.y+=data.speedY
data.ttl-=30
if(data.ttl<=0){particles.splice(i,1)
Depth.removeChild(p)
if(!p.avoidRemove)Sprites.remove(p)}}}
self.shockwave=function(point,vars){var point=point||{x:0,y:0}
var vars=vars||{}
var tint=vars.tint
var texture=vars.texture||"shockwave"
var scale=vars.scale||4
var fromScale=vars.fromScale||scale*.5
var time=vars.time||400
var alpha=vars.alpha||1
var delay=vars.delay||1
var container=vars.container
var angle=vars.angle!=null?vars.angle:Random.spectrum(360)
var particle=createParticle(texture,tint,true,container)
particle.angle=angle
particle.x=point.x
particle.y=point.y
particle.alpha=0
particle.scale.set(fromScale)
Callback.delay(function(){particle.alpha=alpha
Animation.to(particle.scale,{x:scale,y:scale,easing:Phaser.Easing.Circular.Out},time)
Animation.fadeOut(particle,time)},delay)
Callback.delay(function(){Sprites.remove(particle)},time+delay+30)
return particle}
self.collect=function(point,vars){var vars=vars||{}
var amount=vars.amount||7
var scale=vars.scale||.2
var velX=vars.velX||50
var velY=vars.velY||50
var forceX=vars.forceX||0
var forceY=vars.forceY||0
var alpha=vars.alpha||1
var time=vars.time||3000
var texture=vars.texture||"circle"
var follow=vars.follow||null
var gravity=vars.gravity!=null?vars.gravity:0
var container=vars.container||vars.parent
var endScale=vars.endScale
var floorY=vars.floorY
for(var i=0;i<amount;i++){Delay(function(){var particle=createParticle(texture,vars.tint)
if(container)container.addChild(particle)
var forceFriction=.5+Math.random()*.5
var rotation=Math.PI*2*Math.random()
var speedX=Math.cos(rotation)*velX+forceX*forceFriction
var speedY=Math.sin(rotation)*velY+forceY*forceFriction
var ttl=Random.value(time,time*.5)
var startScale=scale*.5+scale*.5*Math.random()
var myEndScale=startScale*(endScale||Math.random()*.5)
var sX=speedX*.2
var sY=speedY*.2
particle.x=point.x+speedX*.2*Math.random()
particle.y=point.y+speedY*.2*Math.random()
particle.rotation=rotation
particle.data={startAlpha:alpha,endAlpha:1,startScale:startScale,endScale:myEndScale,speedX:sX,speedY:sY,rotation:rotation/25,fOffset:{x:Random.spectrum(40),y:Random.spectrum(40)},follow:follow,fCount:0,duration:ttl,ttl:ttl,friction:.99,floorY:floorY?floorY+Random.spectrum(50):null,gravity:gravity}
play()},i*15)}}
self.splatt=function(point,vars){var vars=vars||{}
var amount=vars.amount||10
var scale=vars.scale||.2
var velX=vars.velX||40
var velY=vars.velY||40
var forceX=vars.forceX||0
var forceY=vars.forceY||0
var alpha=vars.alpha||1
var time=vars.time||4000
var texture=vars.texture||"circle"
var follow=vars.follow||null
var gravity=vars.gravity!=null?vars.gravity:1
var container=vars.container||vars.parent
var endScale=vars.endScale
var floorY=vars.floorY
for(var i=0;i<amount;i++){var particle=createParticle(texture,vars.tint)
if(container)container.addChild(particle)
var forceFriction=.5+Math.random()*.5
var rotation=Math.PI*2*Math.random()
var speedX=Math.cos(rotation)*velX+forceX*forceFriction
var speedY=Math.sin(rotation)*velY+forceY*forceFriction
var ttl=Random.value(time,time*.5)
var startScale=scale*.5+scale*.5*Math.random()
var myEndScale=startScale*(endScale||Math.random()*.3)
var sX=speedX*.2
var sY=speedY*.2
particle.x=point.x+speedX*.5*Math.random()
particle.y=point.y+speedY*.5*Math.random()
particle.rotation=rotation
particle.data={startAlpha:alpha,endAlpha:1,startScale:startScale,endScale:myEndScale,speedX:sX,speedY:sY,rotation:rotation/50,follow:follow,fCount:0,duration:ttl,ttl:ttl,friction:.99,floorY:floorY?floorY+Random.spectrum(50):null,gravity:gravity}}
play()}
self.splattParticle=function(particle,vars){var vars=vars||{}
var amount=vars.amount||10
var scale=vars.scale||.2
var velX=vars.velX||40
var velY=vars.velY||20
var alpha=vars.alpha||1
var time=vars.time||3000
var scaleX=vars.scaleX||scale
var x=vars.x||particle.x
var y=vars.y||particle.y
var gravity=vars.gravity||1
var container=vars.container||Canvas.particles
var endScale=vars.endScale
var floorY=vars.floorY
container.addChild(particle)
var rotation=Math.PI*2*Math.random()
var speedX=Math.cos(rotation)*velX
var speedY=Math.sin(rotation)*velY
var ttl=Random.value(time,time*.5)
var startScale=scale
var startScaleX=scaleX
var myEndScale=startScale*(endScale||Math.random()*.3)
var endScaleX=scaleX*myEndScale
var sX=speedX*.2
var sY=speedY*.2-Random.value(velY,velY/2)
particle.x+=speedX
particle.y+=speedY
particle.rotation=rotation
particle.data={startAlpha:alpha,endAlpha:1,startScale:startScale,startScaleX:startScaleX,endScale:myEndScale,endScaleX:endScaleX,speedX:sX,speedY:sY,rotation:rotation/50,duration:ttl,ttl:ttl,friction:.99,floorY:floorY?floorY+Random.spectrum(50):null,gravity:1,avoidRemove:vars.avoidRemove}
particles.push(particle)
play()}
self.splattParticleNoScale=function(particle,point,vars){var vars=vars||{}
var amount=vars.amount||10
var velX=vars.velX||40
var velY=vars.velY||20
var alpha=vars.alpha||1
var time=vars.time||3000
var container=vars.container||Canvas.particles
var floorY=vars.floorY
container.addChild(particle)
var rotation=Math.PI*2*Math.random()
var speedX=Math.cos(rotation)*velX
var speedY=Math.sin(rotation)*velY
var ttl=Random.value(time,time*.5)
var sX=speedX*.2
var sY=speedY*.2-Random.value(velY,velY/2)
particle.x=point.x+speedX
particle.y=point.y+speedY
particle.rotation=rotation
particle.data={startAlpha:alpha,endAlpha:1,speedX:sX,speedY:sY,rotation:rotation/50,duration:ttl,ttl:ttl,friction:.99,floorY:floorY?floorY+Random.spectrum(50):null,gravity:vars.gravity||1,avoidRemove:vars.avoidRemove}
particles.push(particle)
play()}
self.bubbles=function(vars){var vars=vars||{}
var amount=vars.amount||10
var velY=vars.velY||6
var alpha=vars.alpha||1
var time=vars.time||20000
var y=vars.y||Canvas.BOTTOM+400
var width=vars.width||Canvas.WIDTH
var margin=width/amount
for(var i=0;i<amount;i++){var particle=createParticle(vars.texture,vars.tint||0xFFFFFF)
Canvas.aboveall.addChild(particle)
particle.x=-width/2+margin*i+Random.spectrum(margin*2)
particle.y=y+Random.spectrum(margin*2)
var ttl=Random.value(time,time*.5)
particle.data={startAlpha:alpha,endAlpha:1,startScale:Random.decimal(2,1),endScale:0,sinCount:Random.decimal(),sinInc:Random.decimal(.1,.01),sinX:Random.decimal(margin,margin/2),speedY:-Random.decimal(velY,velY/10),duration:ttl,ttl:ttl,gravity:-Random.decimal(1,.3)/10}}
play()}
self.smokeBurst=function(point,vars){var counter=0
var count=0
Tick.start(animateSmoke)
function animateSmoke(){if(!count)Particles.smoke(point,vars)
if(++count>1)count=0
if(++counter>40)Tick.stop(animateSmoke)}}
self.smoke=function(point,vars){var vars=vars||{}
var radius=vars.radius||Random.value(100,10)
var texture=vars.texture||"cloud"
var scale=vars.scale||1
var tint=vars.tint||0x000000
var particle=createParticle(texture,tint)
var rotation=Math.PI*2*Math.random()
particle.x=point.x+Random.value(radius)
particle.y=point.y
particle.rotation=Math.random()*1.5
particle.blendMode=self.blendMode
particle.data={startAlpha:Random.value(30,10)/100,endAlpha:0,startScale:scale*(1+Math.random()),endScale:scale*0.2,speedX:0,speedY:-6,rotation:Random.spectrum(10)/300,duration:2000,ttl:2000,gravity:0}
play()}
self.fire=function(point,vars){var vars=vars||{}
var radius=vars.radius||Math.random()*(radius||50)+5
var texture=vars.texture
var scale=vars.scale||1
var tint=vars.tint
var container=vars.container||vars.parent
var isSmoke=Random.chance(.3)
var particle=createParticle(texture,isSmoke?0x0000:(tint||0xffff00),container)
var rotation=Math.PI*2*Math.random()
particle.x=point.x+Math.cos(rotation)*radius
particle.y=point.y+Math.sin(rotation)*radius
particle.rotation=Math.random()*1.5
particle.blendMode=1
particle.data={startAlpha:.3+Math.random()/2,endAlpha:0,startScale:scale*(1+Math.random()),endScale:scale*0.2,speedX:0,speedY:0,rotation:Math.random()/100,duration:1500,ttl:1500,gravity:-0.1-Math.random()*.1}
play()
return particle}
self.explode=function(tint,count,x,y,speed,ttl,gravity){var count=count||10
for(var i=0;i<count;i++){var particle=createParticle(null,tint)
var rotation=Math.PI*2*Math.random()
var tempVx=Math.cos(rotation)*speed*2
var tempVy=Math.sin(rotation)*speed*2
particle.x=x+tempVx
particle.y=y+tempVy
particle.data={startColor:tint,endColor:0x0,startAlpha:1,endAlpha:0,startScale:1,endScale:0.2,speedX:tempVx,speedY:tempVy,rotation:0,duration:ttl,ttl:ttl,gravity:gravity};}
play()}
self.confetti=function(vars){var vars={}
var speedY=vars.speedY||1
var amount=vars.amount||60
var ttl=5000
var tints=[0xffdd1c,0x3fe3ff,0xf24b3a,0x90ff3f,0xcb3ef9,0xffaaaa]
for(var i=0;i<amount;i++){var particle=createParticle("square",tints,false,Canvas.aboveall)
particle.x=Random.spectrum(Canvas.WIDTH/2)
particle.y=-Random.value(Canvas.HEIGHT)
particle.scale.y=Random.decimal(.5,.25)/5
particle.data={speedY:speedY+Math.random()*5+5,rotation:((5+Math.random()*5)*((Math.random()*2>>0)*2-1))/100,vscale:Math.random()*0.1+0.1,cumulT:Random.decimal(),cumulX:Random.decimal(),speedX:0,basicScale:particle.scale.y,duration:ttl,ttl:ttl}
Animation.fadeIn(particle)}
play()}
self.explodeObstacle=function(point,vars){var vars=vars||{}
var x=point.x
var y=point.y
var speed=vars.speed||15
var ttl=vars.duration||1000
var gravity=gravity||0
var ptint=vars.tint
var count=vars.amount||10
var scale=vars.scale||.3
var container=vars.parent||Canvas.particles
var texture=vars.texture
for(var i=0;i<=count;i++){var tint=ptint||Colors.getColor()
var particle=createParticle(texture,tint,true,container)
var rotation=360/count*i
var tempVx=Math.cos(rotation)*speed
var tempVy=Math.sin(rotation)*speed
particle.x=x+tempVx
particle.y=y+tempVy
particle.data={startScale:scale,endScale:scale*.1,speedX:tempVx,speedY:tempVy,duration:ttl,ttl:ttl}
particles.push(particle)}
play()}
self.trail=function(point,vars){var vars=vars||{}
var gravity=vars.gravity||0
var startScale=vars.startScale||.2
var alpha=vars.alpha||1
var endAlpha=vars.endAlpha||0
var tint=vars.tint
var radius=vars.radius||20
var container=vars.container||vars.parent
var texture=vars.texture
var time=vars.time||600
startScale*=.5+.5*Math.random()
radius=Random.value(radius*100,100)/10
var particle=createParticle(texture,tint,null,container)
var rotation=Math.PI*2*Math.random()
particle.x=point.x+Math.cos(rotation)*radius
particle.y=point.y+Math.sin(rotation)*radius
particle.rotation=Math.random()*1.5
particle.data={startAlpha:alpha,endAlpha:endAlpha,startScale:startScale,endScale:startScale*.1,speedX:Math.random()*4-2,speedY:Math.random()*4-2,rotation:Math.random()/100,duration:time,ttl:time,gravity:gravity}
play()}
self.sparkle=function(point,tint){for(var a=0;a<4;a++){addParticle(point.x,point.y,-Math.PI/2)
addParticle(point.x,point.y,Math.PI/2)}
function addParticle(x,y,offset){var particle=createParticle()
particle.alpha=1;particle.tint=tint!=null?tint:Colors.getColor()
ArrayUtil.removeItem(particles,particle)
var direction=Math.PI*Math.random()+offset;var size=Math.random()*200+200
var distance=Math.random()*20+20
var rotation=Math.random()*-0.5*15
var duration=Math.random()*.7+.75
var fadeDuration=duration-Math.random()*.5+.25
particle.scale.set(size/400,size/400)
particle.x=x+Math.cos(direction)*108-50
particle.y=y+Math.sin(direction)*108-50
particle.visible=true
new Tween(particle,{x:particle.x+Math.cos(direction)*(distance),y:particle.y+Math.sin(direction)*(distance),rotation:rotation},duration,Tween.easeout)
Callback.delay(function(){new Tween(particle,{alpha:0},fadeDuration,Tween.easeout).callback=function(){Sprites.remove(particle)}},(duration-fadeDuration)*1000)}
play()}
self.kaboom=function(point,vars){var vars=vars||{}
var tint=vars.tint||0xFFFFFF
var texture=vars.texture||"condense"
var scale=vars.scale||.5
var time=vars.time||400
var alpha=vars.alpha
var delay=vars.delay||1
var container=vars.container||vars.parent
var particle=createParticle(texture,tint,true,container)
particle.rotation=Random.spectrum(360)
particle.x=point.x
particle.y=point.y
particle.scale.set(scale*.5,scale*.5)
Animation.to(particle.scale,{x:2*scale,y:2*scale},time,Phaser.Easing.Circular.Out)
Animation.fadeOut(particle)
Animation.blink(particle,10)
Delay(function(){self.shockwave(particle,{tint:tint,scale:3*scale})
Sprites.remove(particle)},400)
return particle}
self.condense=function(point,vars){var vars=vars||{}
var tint=vars.tint
var texture=vars.texture||"condense"
var scale=vars.scale||2
var time=vars.time||500
var alpha=vars.alpha||1
var delay=vars.delay||1
var container=vars.container
var particle=createParticle(texture,tint,true,container)
particle.angle=Random.spectrum(360)
particle.x=point.x
particle.y=point.y
particle.scale.set(2*scale,2*scale)
particle.visible=true
Animation.to(particle.scale,{x:.5*scale,y:.5*scale},time,Phaser.Easing.Circular.Out)
Animation.fadeInOut(particle,null,alpha)
Delay(function(){Sprites.remove(particle)},time)
return particle}
self.linewave=function(point,tint,isHorizontal,wavewidth){var particle=Sprites.spawn("linewave")
particle.alpha=.5;particle.tint=tint
particle.x=point.x
particle.y=point.y
particle.rotation=isHorizontal?0:MathUtil.degreeToRadians(90)
particle.scale.set(.9,.9)
var destination={x:particle.x,y:particle.y,alpha:.2}
var destscale={x:8,y:wavewidth}
Animation.blink(particle,10)
new Tween(particle,destination,.5,Tween.linear)
new Tween(particle.scale,destscale,.5,Tween.linear).callback=function(){Sprites.remove(particle)}
self.addChild(particle)}
self.radialLines=function(bubble,array){var myLines=[]
for(var n in array){var line=Pool.cycle("Line")
line.alpha=.3
line.draw(1,bubble.getColor(),bubble.x,bubble.y,array[n].x,array[n].y)
line.visible=true
myLines.push(line)
Particles.addChild(line)}
Animation.blinkArray(myLines,10)}
self.radialBolts=function(bubble,array,tint){for(var n in array)Pool.cycle("Bolt").draw(bubble,array[n],tint)}}