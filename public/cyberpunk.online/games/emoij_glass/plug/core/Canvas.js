var Canvas
function myCanvas(){var self=Canvas=this
Phaser.Group.call(this,game,null,"Canvas",true)
self.x=game.world.centerX
self.y=game.world.centerY
self.WIDTH=game.world.width
self.HEIGHT=game.world.height
self.TOP=-self.HEIGHT/2
self.BOTTOM=self.HEIGHT/2
self.LEFT=-self.WIDTH/2
self.RIGHT=self.WIDTH/2
self.add=function(parent,x,y){var group=game.add.group()
var parent=parent||self.limbo||null
if(parent)parent.addChild(group)
if(x!=null)group.x=x
if(y!=null)group.y=y
return group}
self.cast=function(group,parent,x,y){Phaser.Group.call(group,game)
if(parent)parent.addChild(group)
if(x!=null)group.x=x
if(y!=null)group.y=y
return group}
var add=self.add
self.limbo=add(self,-999999,-999999)
self.limbo.scale.set(.01,.01)
self.inputEnableChildren=false
self.limbo.kill()
self.underall=add(self)
self.background=add(self)
self.screen=add(self)
self.game=add(self.screen)
self.belowall=add(self.game)
self.foreground=add(self.game)
self.back=add(self.game)
self.mid=add(self.game)
self.front=add(self.game)
self.particles=add(self.screen)
self.gui=add(self.screen)
self.black=add(self)
self.hud=add(self)
self.hud2=add(self)
self.popups=add(self)
self.nav=add(self)
self.overlay=add(self)
self.aboveall=add(self)
self.marquee=add(self)}
Utils.setPrototype(myCanvas,Phaser.Group)