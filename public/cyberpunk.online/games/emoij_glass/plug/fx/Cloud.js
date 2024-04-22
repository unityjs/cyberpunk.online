function Cloud(vars){var vars=vars||{}
vars.parent=vars.parent||Canvas.back
var self=Sprites.cast(this,vars.atlasId||"cloud",vars)
var count=0
var sinCount=0
var flipX=1
var speed=1
var scale=vars.scale||1
var scaleDiff=scale*.1
var myscale=scale
var centerX=vars.x||0
var centerY=vars.y||0
var isAlive=true
var rangeY=vars.rangeY||300
self.blendMode=vars.blendMode||0
self.alpha=0
self.reset=function(){}
function spawn(){if(!isAlive)return
flipX=Random.chance(.5)?1:-1
self.x=Random.spectrum(1000)+centerX
self.y=Random.spectrum(rangeY)+centerY
count=Random.decimal()
sinCount=Random.decimal()
speed=-(Random.value(20,5)/10)*scale
myscale=scale*(Math.random()*.5+.5)
Animation.fadeIn(self,2000)
Delay(despawn,Random.value(8600,2600))
Tick.start(render)}
function render(){sinCount+=.01
self.x+=speed+Math.cos(sinCount)
self.y+=Math.sin(sinCount)*.4
count+=.01
var s=Math.sin(count)*scaleDiff
self.scale.set((scale+s)*flipX,scale+s)}
function despawn(){Animation.fadeOut(self,2000)
Delay(function(){Tick.stop(render)},2000)
Delay(spawn,Random.value(7600,3600))}
Delay(spawn,Random.value(3000))}
Pool.register("Cloud",Cloud,0,Phaser.Sprite)