var comboAnim
function myComboAnim(){var self=this
var sprite
var halo=Sprites.spawn("assets","halo")
var container=game.add.group()
var count=0
container.addChild(halo)
halo.alpha=.8
Depth.removeChild(container)
self.play=function(x,y,value){container.x=x
container.y=y
Animation.fadeIn(container,200)
Depth.removeChild(sprite)
Canvas.gui.addChild(container)
container.scale.set(.8,.8)
game.add.tween(container.scale).to({x:.6,y:.6},1000,"Linear",true)
sprite=Sprites.spawn("assets","x"+value)
sprite.scale.set(1.5,1.5)
container.addChild(sprite)
game.add.tween(sprite.scale).to({x:.7,y:.7},700,"Linear",true)
Callback.cancel("comboAnim")
Callback.delayUnique("comboAnim",self.hide,1000)
Callback.delay(function(){Animation.fadeOut(container,200)},800)
Tick.start(update)}
self.hide=function(){Depth.removeChild(container)
Tick.stop(update)
Depth.removeChild(sprite)
sprite=false}
function update(){halo.angle+=2}}