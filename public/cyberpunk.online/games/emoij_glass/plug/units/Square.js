function Square(atlasId,vars){var self=this
var vars=vars||{width:100,height:100,top:25,bottom:25,left:25,right:25}
if(!vars.top)vars.top=25
var keyAtlas=Sprites.getKeyAtlas(atlasId)
PhaserNineSlice.NineSlice.call(self,game,0,0,keyAtlas.key,keyAtlas.atlasId,vars.width,vars.height,vars)
self.reset=function(vars){Sprites.applyVars(self,vars)}
self.remove=function(){Depth.removeChilds(self)
Pool.remove(self)}
self.reset(vars)}
Pool.register("Square",Square,0,PhaserNineSlice.NineSlice)