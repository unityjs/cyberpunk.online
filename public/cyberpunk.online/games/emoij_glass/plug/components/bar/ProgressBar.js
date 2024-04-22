function ProgressBar(){var self=this
var container=game.add.group()
container.x=322
container.y=40
Canvas.gui.addChild(container)
var bar=Sprites.spawn("gameplay","progressbar")
bar.anchor.set(0,.5)
container.addChild(bar)
var mask=game.add.graphics(0,-bar.height*.5)
mask.beginFill(0x000000)
mask.drawRect(0,0,bar.width,bar.height)
container.addChild(mask)
var head=Sprites.spawn("gameplay","controlpanel_tonton",0,-6)
container.addChild(head)
self.progress=0
self.reset=function(){self.setProgress(0)}
self.setProgress=function(value){self.progress=MathUtil.hardLimit(value,0,100)
var targetX=bar.width*self.progress/100
head.x=targetX-5
mask.x=targetX
mask.width=bar.width*(100-self.progress)/100}
self.increase=function(inc){self.setProgress(self.progress+(inc||1))}
self.setProgress(0)}