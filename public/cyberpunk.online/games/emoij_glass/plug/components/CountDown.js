var CountDown
function myCountDown(){var self=this
CountDown=self
self.container=Canvas.add()
var count=0
var onFinish
var animText
self.play=function(callback){Cursor.block()
onFinish=callback
count=3
countAnimation()}
self.hide=function(){Cursor.unblock()
if(onFinish!=null)onFinish()
onFinish=null}
function countAnimation(){var animText=Pool.spawn("AnimText",{y:-40})
animText.zoomOut(count,500)
Callback.delay(onAnimationEnd,500)}
function onAnimationEnd(){if(!--count)return self.hide()
countAnimation()}}