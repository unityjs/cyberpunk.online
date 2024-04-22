var Hints=new function(){var self=this
self.pool=[]
self.reset=function(){self.pool=[]}
self.show=function(){for(var n in self.pool)self.pool[n].show()}
self.hide=function(){for(var n in self.pool)self.pool[n].hide()}}
function Hint(){var self=Sprites.cast(this,"Hint")
self.reset=function(vars){self.scale.set(vars.scale)
self.rotation=MathUtil.degreeToRadians(vars.angle)
self.x=vars.x
self.y=vars.y
Canvas.belowall.addChild(self)
Hints.pool.push(self)
self.visible=false}
self.show=function(){if(self.visible)return
self.visible=true
Animation.fadeIn(self)}
self.hide=function(){self.visible=false}
self.remove=function(){}}
Pool.registerSprite("Hint",Hint)