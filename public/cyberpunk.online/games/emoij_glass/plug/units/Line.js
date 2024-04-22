function Line(vars){var self=Canvas.cast(this,Canvas.particles)
self.image
var oWidth=2000
self.thickness=1
self.tint=0x000000
var cornerA=Sprites.get("circle",{parent:self,width:10,height:10})
self.reset=function(vars){if(!vars)return
self.scale.set(1,1)
self.alpha=1
self.from=vars.from
self.to=vars.to
self.tint=vars.tint||self.tint
self.thickness=vars.thickness||self.thickness
self.visible=true
if(vars.parent)vars.parent.addChild(self)
self.draw()}
self.remove=function(){Depth.removeChild(self)
Pool.remove(self)}
self.draw=function(thickness,tint,from,to){var from=from||self.from
var to=to||self.to
self.x=from.x
self.y=from.y
var diffX=to.x-self.x
var diffY=to.y-self.y
var len=Math.sqrt(diffX*diffX+diffY*diffY)
if(!len)return
var scale=MathUtil.hardLimit(len/oWidth,.00001,1)
self.image.scale.set(scale,thickness||self.thickness)
self.centerX=from.x+(to.x-from.x)/2
self.centerY=from.y+(to.y-from.y)/2
self.rotation=self.rotation=Math.atan2(diffY,diffX)
self.image.tint=cornerA.tint=tint||self.tint
cornerA.height=cornerA.width=self.image.height}
self.setTint=function(tint){self.image.tint=tint}
self.setTexture=function(texture){Sprites.remove(self.image)
self.image=Sprites.get(texture||"Line",{anchorX:0,parent:self})}
self.setTexture()
if(vars)self.reset(vars)}
Pool.registerCanvas("Line",Line)