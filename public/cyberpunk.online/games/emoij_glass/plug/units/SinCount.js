function SinCount(){var self=this
var count=0
var inc=.1
var friction=.1
self.sin=0
self.cos=0
self.start=function(){Tick.start(update)}
self.stop=function(){Tick.stop(update)}
function update(){count+=inc
self.sin=Math.sin(count)*friction
self.cos=Math.cos(count)*friction}
self.start()}