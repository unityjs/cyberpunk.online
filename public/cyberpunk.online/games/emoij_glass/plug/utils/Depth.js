var Depth=new function(){var self=this
self.removeChild=function(target){if(!target||!target.parent)return
Canvas?Canvas.limbo.addChild(target):target.parent.removeChild(target)
return target}
self.toFront=function(target){if(!target||!target.parent)return
target.parent.addChild(target)}
self.sort3D=function(array){if(!array||!array.length)return
var container=array[0].sprite.parent
var sorted=ArrayUtil.sortProperty(array,"z").reverse()
for(var n in sorted)container.addChild(sorted[n].sprite)}}