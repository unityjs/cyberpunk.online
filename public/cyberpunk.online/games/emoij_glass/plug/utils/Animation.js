var Animation=new function(){var self=this
self.fadeIn=function(target,time,toAlpha){target.alpha=0
target.visible=true
return self.to(target,{alpha:toAlpha||1},time||500)}
self.fadeInOut=function(target,time,alpha){target.alpha=0
target.visible=true
var time=time||600
self.to(target,{alpha:alpha||1},time*.5,Phaser.Easing.Sinusoidal.In)
Delay(function(){self.to(target,{alpha:0},time*.5,Phaser.Easing.Sinusoidal.Out)},time*.5)}
self.to=function(target,params,time,easing,callback){var time=time||500
var tween=game.add.tween(target).to(params,time,easing||Phaser.Easing.Sinusoidal.InOut,true)
if(callback!=null)tween.onComplete.add(callback,this)
return tween}
self.toTint=function(target,color,time){var progess={step:0}
var startColor=target.tint
var tween=self.to(progess,{step:100},time)
tween.onUpdateCallback(function(){target.tint=Phaser.Color.interpolateColor(startColor,color,100,progess.step)})}
self.fadeOut=function(target,time,fromAlpha){target.alpha=fromAlpha||target.alpha
return self.to(target,{alpha:0},time||500)}
self.fadeTo=function(target,alpha,time){return self.to(target,{alpha:alpha||0},time)}
self.fadeUp=function(target,time){target.visible=true
target.alpha=1
if(target.tween)target.tween.stop()
target.tween=game.add.tween(target).to({alpha:0,y:target.y-50},time||500,"Linear",true)}
self.pan=function(target,y,isIn,time){game.add.tween(target).to({y:y},time||1000,isIn?Phaser.Easing.Circular.In:Phaser.Easing.Circular.Out,true)}
self.shockwave=function(target,time){target.visible=true
target.alpha=.8
target.scale.set(.5,.5)
game.add.tween(target).to({alpha:0},time||900,Phaser.Easing.Circular.Out,true)
game.add.tween(target.scale).to({x:1.4,y:1.4},time||900,Phaser.Easing.Circular.Out,true)}
self.blink=function(container,times,andOff){var blinkCount=0
var times=times||10
loop()
function loop(){if(++blinkCount<times){container.visible=!container.visible
Callback.delay(loop,100)
return}
container.visible=andOff?false:true}}
self.shake=function(target,position,x,y,duration){var count=1
var position=position||{x:0,y:0}
var x=x||40
var y=y||40
var duration=duration||500
Tick.start(shakingScreen)
Callback.delay(shakeEnd,duration)
function shakingScreen(){count+=.04
target.x=position.x+Math.random()*(x/count)*(Math.random()>.5?1:-1)
target.y=position.y+Math.random()*(y/count)*(Math.random()>.5?1:-1)}
function shakeEnd(){Tick.stop(shakingScreen)
game.add.tween(target).to(position,200,Phaser.Easing.Circular.Out,true)}}
self.shakeY=function(target,posY,y,duration){var count=1
var duration=duration||600
var posY=posY!=null?posY:target.y
var y=y||10
Tick.start(shakingScreen)
Callback.delay(shakeEnd,duration)
function shakingScreen(){count+=.04
target.y=posY+Math.random()*(y/count)*(Math.random()>.5?1:-1)}
function shakeEnd(){Tick.stop(shakingScreen)
game.add.tween(target).to({y:posY},200,Phaser.Easing.Circular.Out,true)}}
self.scaleInOut=function(target,scale,time){var scale=scale||1.1
var time=time||800
game.add.tween(target.scale).to({x:scale,y:scale},time,Phaser.Easing.Sinusoidal.InOut,this,0,-1,true)}
self.blinkInOut=function(target,time){var time=time||400
var scale=target.scale.x+.01
game.add.tween(target).to({alpha:.1},time,Phaser.Easing.Sinusoidal.InOut,this,0,-1,true)
game.add.tween(target.scale).to({x:scale,y:scale},time,Phaser.Easing.Sinusoidal.InOut,this,0,-1,true)}
self.click=function(sprite,scale){var scale=scale||1
game.add.tween(sprite.scale).to({x:scale,y:scale},100,Phaser.Easing.Circular.Out,true)
Callback.delay(function(){game.add.tween(sprite.scale).to({x:scale*1.2,y:scale*1.2},300,Phaser.Easing.Circular.Out,true)},100)
Callback.delay(function(){game.add.tween(sprite.scale).to({x:scale,y:scale},200,Phaser.Easing.Linear.None,true)},400)}
self.bounceScaleFloor=function(target,scale,sX,sY,duration,startSin){var ticks=(duration||1000)*60/1000
var totalticks=ticks
var sX=sX||.1
var sY=sY||.1
var scale=scale||{x:1,y:1}
var count=startSin||0
Tick.start(update)
Callback.delay(stop,ticks*16.6)
function update(){count+=.2
var friction=MathUtil.getPercent(--ticks,totalticks)/100
var tsX=Math.cos(count)*sX*friction
var tsY=Math.cos(count)*sY*friction
target.scale.set(scale.x+tsX,scale.y+tsY)}
function stop(){target.scale.set(scale.x,scale.y)
Tick.stop(update)}}
self.bounceScaleFloorX=function(target,scale,sX,duration,startSin){var ticks=(duration||1000)*60/1000
var totalticks=ticks
var sX=sX||.1
var scale=scale||{x:1,y:1}
var count=startSin||0
Tick.start(update)
Callback.delay(stop,ticks*16.6)
function update(){count+=.2
var friction=MathUtil.getPercent(--ticks,totalticks)/100
var tsX=Math.cos(count)*sX*friction
target.scale.set(scale.x+tsX,scale.y)}
function stop(){target.scale.set(scale.x,scale.y)
Tick.stop(update)}}
self.bounceAngle=function(target,angle,A,duration,startSin){var ticks=(duration||1000)*60/1000
var totalticks=ticks
var A=A||5
var angle=angle||target.angle
var count=startSin||Random.decimal()
Tick.start(update)
Callback.delay(stop,ticks*16.6)
function update(){count+=.2
var friction=MathUtil.getPercent(--ticks,totalticks)/100
target.angle=angle+Math.cos(count)*A*friction}
function stop(){target.angle=angle
Tick.stop(update)}}
self.flicker=function(target,time,isFadeOut){var time=time||1000
var alpha=0
var alphaInc=1/(time/16.66)
var alphaEnd=1
var bool=false
var counter=3
if(isFadeOut){alpha=1
alphaEnd=0
alphaInc*=-1}
target.alpha=alpha
Tick.start(update)
Callback.delay(stop,time+1)
function update(){alpha+=alphaInc
if(--counter)return
counter=Random.value(10,3)
target.alpha=alpha
bool=!bool
if(bool)target.alpha=alpha/2}
function stop(){target.alpha=alphaEnd
Tick.stop(update)}}
self.flickerIn=self.flicker
self.flickerOut=function(target,time){self.flicker(target,time,true)}
self.scaleTo=function(target,scale,overshoot,time){self.scaleXYTo(target,scale,scale,overshoot,time)}
self.scaleXYTo=function(target,scaleX,scaleY,overshoot,time){if(!target)return
var target=target.scale
var overshoot=overshoot||.05
var time=time||200
var scaleX=scaleX||1
var scaleY=scaleY||scaleX
var oX=target.x<=scaleX?scaleX*(1+overshoot):scaleX*(1-overshoot)
var oY=target.y<=scaleY?scaleY*(1+overshoot):scaleY*(1-overshoot)
if((scaleX<0&&target.x>0)||(scaleX>0&&target.x<0))target.x*=-1
if((scaleY<0&&target.y>0)||(scaleY>0&&target.y<0))target.y*=-1
self.to(target,{x:oX,y:oY},time)
Callback.delay(function(){self.to(target,{x:scaleX,y:scaleY},time*.5)},time+1)}
self.zoomOut=function(target,time){var time=time||500
self.to(target.scale,{x:.5,y:.5},time)
self.to(target,{alpha:0},time)}
self.springTo=function(target,vars,time,strength,elasticity){if(target._isSpringing)return
var vars=vars||{x:0,y:0}
var strength=strength||.1
var elasticity=elasticity||.9
var time=time||1000
target._anim=true
var diff={}
for(var key in vars)diff[key]=0
Tick.start(update)
Delay(stop,time)
function update(){for(var key in vars){diff[key]+=(vars[key]-target[key])*strength
diff[key]*=elasticity
target[key]+=diff[key]}}
function stop(){Tick.stop(update)
delete target._anim
ArrayUtil.extract(vars,target)}}
self.spring=function(target,vars,strength,elasticity){var vars=vars||{x:0,y:0}
var strength=strength||.2
var elasticity=elasticity||.8
var diff=target._diff=target._diff||{}
for(var key in vars){if(!diff[key])diff[key]=0
diff[key]+=(vars[key]-target[key])*strength
diff[key]*=elasticity
target[key]+=diff[key]}}
self.chase=function(target,vars,friction){var vars=vars||{x:0,y:0}
var friction=friction||5
for(var key in vars){target[key]+=(vars[key]-target[key])/friction}}
self.kick=function(target,position,x,y){var position=position||{x:0,y:0}
var pos={x:position.x+(x||0),y:position.y+(y||0)}
target.x=pos.x
target.y=pos.y
self.to(target,position,300)}
self.kickY=function(target,position,y){var position=position||0
var y=y||0
target.y=position+y
self.to(target,{y:position},300)}
self.animNumber=function(textField,to,from,prefix,suffix){var value=from||0
var to=to||0
var prefix=prefix||""
var suffix=suffix||""
Tick.start(update)
function update(){value+=(to-value)/10
if(Math.round(value)==Math.round(to)){Tick.stop(update)
value=to}
textField.text=prefix+MathUtil.commas(Math.round(value))+suffix}}}