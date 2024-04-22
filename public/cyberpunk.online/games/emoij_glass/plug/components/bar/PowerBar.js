function PowerBar(vars){var vars=vars||{}
var self=this.container=Canvas.cast(this,vars.parent,vars.x,vars.y)
var sinCount=0
if(vars.base)Sprites.get(vars.base,{parent:self,x:0,y:0})
var bar=Sprites.get(vars.bar,{anchorX:0,parent:self,y:0})
bar.x=-bar.width/2
if(vars.front)Sprites.get(vars.front,{parent:self,x:0,y:0})
self.percent=0
var animatePercent=0
self.reset=function(value){animatePercent=value||0
self.setPercent(animatePercent,true)}
self.setPercent=function(value,autoReach){self.percent=MathUtil.hardLimit(value,0,100)
bar.alpha=1
if(autoReach)return self.reach()
Tick.start(update)}
function update(){animatePercent+=(self.percent-animatePercent)/2
bar.alpha=1
if(Math.round(animatePercent)>=100){sinCount+=.2
bar.alpha=.5+Math.sin(sinCount)*.5
return}
if(Math.round(animatePercent)==self.percent)return self.reach()
render()}
self.reach=function(){animatePercent=self.percent
Tick.stop(update)
render()}
function render(){bar.scale.set(animatePercent/100,1)}
self.hide=function(){Animation.fadeOut(self,250)}
self.show=function(){Animation.fadeIn(self,250)}}
Pool.register("PowerBar",PowerBar,0,Phaser.Group)