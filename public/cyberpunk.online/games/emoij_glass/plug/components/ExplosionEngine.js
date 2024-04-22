var Explosion
function ExplosionEngine(){var self=this
var _unused=[]
var parent=Canvas.game
self.spawn=function(x,y)
{Sounds.play("explosion")
spawnOne()
function spawnOne(){var item=_unused.shift()||new ExplosionItem()
item.spawn(x,y,parent)}}
self.remove=function(item){_unused.push(item)}
function ExplosionItem(){var self=this
console.log("NEW EXPLOSION ITEM")
var spine=Sprites.spawn("explosion","explosion0001",0,0,self.container)
spine.animations.add('explosion',Phaser.Animation.generateFrameNames('explosion',1,24,'',4),24,false,false)
self.spawn=function(x,y,parent){spine.x=x
spine.y=y
var scale=Random.value(12,4)/10
var scaleX=Random.chance()?1:-1
spine.visible=true
spine.alpha=1
spine.animations.play("explosion")
Animation.fadeOut(spine,1200)
spine.blendMode=Phaser.blendModes.SCREEN
parent.addChild(spine)
Callback.delay(self.remove,1200)}
self.remove=function(){spine.animations.stop()
spine.visible=true
spine.alpha=1
spine.animations.stop()
Depth.removeChild(spine)
Explosion.remove(self)}}}