function PreloadBar(){var self=this
var centerX=game.world.centerX
var centerY=game.world.centerY
var height=game.world.height
var bg=game.add.sprite(centerX,centerY,"preload_bg")
bg.anchor.set(.5,.5)
bg.width=game.world.width
bg.height=game.world.height
var group=game.add.group()
var logo=game.add.sprite(centerX,centerY-40,"preload_logo")
logo.anchor.set(.5,.5)
var barFront=game.add.sprite(centerX,height-260,"preload_bar")
var outline=game.add.sprite(centerX,barFront.y,"preload_outline")
group.addChild(logo)
group.addChild(barFront)
group.addChild(outline)
outline.anchor.set(0,.5)
barFront.anchor.set(0,.5)
outline.x-=outline.width/2
barFront.x=outline.x+2
var maxWidth=outline.width-2
var barWidth=0
barFront.width=0
Tick.start(update)
Animation.fadeIn(logo)
self.onProgress=function(progress){barWidth=Math.floor(maxWidth*progress/100)}
function update(){barFront.width+=(maxWidth-2-barFront.width)/10}
self.remove=function(){barFront.width=maxWidth
Tick.stop(update)
Animation.fadeOut(group,10)
Animation.fadeOut(bg,60)}}