var Stars=function(vars){var vars=vars||{}
var parent=vars.parent||Canvas.hud
var self=Stars=Canvas.cast(this,parent,vars.x||0,vars.y||Canvas.TOP+50)
var textField=Texts.spawnBitmap(vars.font||"font3",{parent:self,anchorX:0,x:50,y:10,size:vars.fontSize||53})
var star=Sprites.get("symbol_star",{parent:self,x:0,y:0})
self.show=function(){parent.addChild(self)}
self.hide=function(){Depth.removeChild(self)}
self.refresh=function(){textField.text=StringUtil.fillZero(Levels.stars)+"/"+StringUtil.fillZero(Levels.totalStars)}}
Pool.registerCanvas("Stars",Stars)