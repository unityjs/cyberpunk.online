function Finger(vars){var vars=vars||{}
var self=Finger=Canvas.cast(this)
var sprite=self.sprite=Sprites.get(vars.sprite||"finger",{anchorY:0,x:0,y:0})
var counter=0
var sprites={}
var isShowing
var action
var original=sprite
var parent
sprites.tap
sprites.press
self.show=function(data,fingerAction){if(isShowing||!data)return
isShowing=true
self.data=data
sprite=self.sprite=data.sprite?Sprites.get(data.sprite,{anchorY:0,x:0,y:0}):original
self.addChild(sprite)
sprite.visible=true
sprite.alpha=1
self.x=self.spawnX=data.x||0
self.y=self.spawnY=data.y||0
parent=data.parent||Canvas.aboveall
parent.addChild(self)
counter=Random.decimal()
Animation.fadeIn(self,200)
action=fingerAction||data.fingerAction||"touch"
sprite.rotation=data.rotation!=null?data.rotation:(self.y>900?-1.3:0)
self.scale.set(1)
if(sprites[fingerAction]){self.addChild(sprites[fingerAction])
Animation.fadeIn(sprites[fingerAction],250)}
if(action=="swipeTo")return swipeTo()
Tick.start(update)}
function update(){var pos=Math.sin(counter)
if(action=="touch"){counter+=.3
pos*=20
sprite.x=50+pos*2
sprite.y=50+pos
return}
if(action=="swipeUp"){counter+=.3
sprite.y=pos*=100}
if(action=="swipeLeftRight"){counter+=.05
sprite.x=pos*=250}
if(action=="tap"||action=="tapRandom"){counter+=.3
if(pos<0){if(!self.drawed){if(action=="tapRandom"){self.x=Random.spectrum(150)+self.spawnX
self.y=Random.spectrum(150)+self.spawnY}
parent.addChild(Particles.shockwave(self,{texture:"condense",scale:1,tint:0xFFFFFF}))
if(sprites.tap)Animation.fadeOut(sprites.tap,.3)}
self.drawed=true
Depth.toFront(self)
pos=0}else{self.drawed=false}
pos*=30
sprite.y=pos}
if(action=="press"){counter+=.3
if(self.drawed>=0){self.drawed=-20
parent.addChild(Particles.shockwave(self,{scale:1,tint:0xFFFFFF}))
Depth.toFront(self)}
self.drawed++}}
function swipeTo(){if(!isShowing)return
Callback.delayUnique("Finger",swipeTo,1000)
Depth.toFront(self)
sprite.alpha=1
sprite.x=0
sprite.y=0
Animation.to(sprite,{x:self.data.swipeToX||0,y:self.data.swipeToY||0},700)
Delay(function(){Animation.fadeOut(sprite,350)},350)}
self.hide=function(){if(!isShowing)return
isShowing=false
Cancel("Finger")
Depth.removeChild(sprite)
if(self.data.sprite)Sprites.remove(sprite)
for(var n in sprites)Depth.removeChild(sprites[n])
self.remove()}
self.remove=function(){Depth.removeChild(self)
Tick.stop(update)}}
Utils.setPrototype(Finger,Phaser.Group)