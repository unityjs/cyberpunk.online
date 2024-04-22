function StarsBar(vars){var vars=vars||{}
var parent=vars.parent||Canvas.gui
var self=Canvas.cast(this,parent,vars.x,vars.y)
var max=vars.max||3
var sprites=[]
var margin=vars.margin||80
self.stars=max
for(var n=0;n<max;n++){Sprites.get("symbol_starStroke",{x:margin*n,y:0,parent:self})
sprites.push(Sprites.get("symbol_star",{x:margin*n,y:0,parent:self}))}
self.reset=function(){self.setStars(max)}
self.setStars=function(value){self.stars=MathUtil.hardLimit(value,0,max)
for(var n in sprites)sprites[n].visible=n<self.stars}
self.reset()}
Pool.registerCanvas("StarsBar",StarsBar)