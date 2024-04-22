function spawnAnimText(vars){return Pool.spawn("AnimText",vars)}
function AnimText(){var self=this
var text=self.text=Texts.spawnBitmap()
self.text=text
var initVars={font:'font',fontSize:120,fill:"#ffffff",align:'center',stroke:'#000000',strokeThickness:18,x:0,y:0,alpha:1}
text.anchor.set(.5,.5)
Depth.removeChild(text)
self.reset=function(vars){ArrayUtil.extract(ArrayUtil.extract(vars,ArrayUtil.clone(initVars)),text)
if(vars.parent)vars.parent.addChild(text)}
self.play=function(msg,time){var time=time||900
init(msg,time)
text.x=540
text.y=200
game.add.tween(text.scale).to({x:.3,y:.3},time,"Linear",true)}
self.zoomOut=function(msg,time){var time=time||1000
init(msg,time)
game.add.tween(text.scale).to({x:.5,y:.5},time,"Linear",true)
game.add.tween(text).to({alpha:0},time,"Linear",true)
return self}
self.fadeUp=function(msg,vars,time){var time=time||1000
init(msg,time)
ArrayUtil.extract(vars,text)
text.y+=50
text.alpha=0
game.add.tween(text).to({y:vars.y,alpha:1},time/2,"Linear",true)
Callback.delay(function(){game.add.tween(text).to({y:vars.y-50,alpha:0},time/2,"Linear",true)},time/2)
return self}
self.fadeOut=function(msg,vars,time){var time=time||1000
init(msg,time)
ArrayUtil.extract(vars,text)
text.alpha=0
game.add.tween(text).to({alpha:1},time/4,"Linear",true)
Callback.delay(function(){game.add.tween(text).to({alpha:0},time/2,"Linear",true)},time/2)
return self}
function init(msg,time){text.text=msg
Canvas.particles.addChild(text)
text.scale.set(1,1)
Callback.delay(self.remove,time+1)}
self.remove=function(){Depth.removeChild(text)
Pool.remove(self)}}
Pool.register("AnimText",AnimText)