var Align=new function(){var self=this
self.fit=function(target,fitArea,crop){var rad
target.scale.set(1,1)
var width=target.width
var height=target.height
rad=fitArea.width/width
target.width*=rad
target.height*=rad
height*=rad
if((crop&&height<fitArea.height)||(!crop&&height>fitArea.height)){rad=fitArea.height/height
target.width*=rad
target.height*=rad}
target.x=fitArea.x
target.y=fitArea.y}}