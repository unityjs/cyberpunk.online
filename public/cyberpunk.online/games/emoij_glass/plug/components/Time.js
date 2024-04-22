function Time(initialSeconds,onUpdate,onTimeOut){var self=this
self.onTimeOut=onTimeOut||function(){}
self.onUpdate=onUpdate||function(){}
self.initialSeconds=initialSeconds||60
self.textField=Texts.spawnBitmap("arb",{x:game.world.width*.5-200,y:-game.world.height*.5+50,size:50,text:"1999",parent:Canvas.gui})
self.seconds=0
var animateValue=0
self.reset=function(){self.stop()
self.seconds=animateValue=self.initialSeconds
self.setTime(self.seconds)}
self.addTime=function(value){self.setTime(self.seconds+parseInt(value||1))}
self.decreaseTime=function(value){tickRed()
self.addTime(-value)}
self.setTime=function(value){self.seconds=MathUtil.hardLimit(parseInt(value),0)
render()}
self.hide=function(){self.textField.visible=false}
self.show=function(){self.textField.visible=true}
function update(){return
animateValue+=(self.seconds-animateValue)/4
render()
if(Math.round(animateValue)==self.seconds)Tick.stop(update)}
function render(){self.textField.text=StringUtil.seconds2Minutes(Math.floor(self.seconds))}
self.start=function(){self.reset()
self.play()}
self.play=function(){Tick.startTime(onPassTime)}
self.pause=function(){Tick.stop(onPassTime)}
function onPassTime(){if(Engine.isPaused)return
self.addTime(-1)
self.onUpdate()
if(self.seconds>10)return
tickRed()
if(self.seconds)return
self.onTimeOut()
self.stop()}
function tickRed(){self.textField.tint=0xff0000
game.add.tween(self.textField.scale).to({x:1.3,y:1.3},500,Phaser.Easing.Elastic.Out,true)
Sounds.play("time")
Callback.delay(function(){self.textField.tint=0xffffff
game.add.tween(self.textField.scale).to({x:1,y:1},400,Phaser.Easing.Elastic.Out,true)},300)}
self.stop=self.pause
self.reset()}