var Camera=new function(){var self=this
self.output=null
self.viewport={x:0,y:-30}
self.x=0
self.y=0
self.z=0
self.scale=1
self.fl=250
self.buffer3D=[]
self.update=function(){for(var n in self.buffer3D)self.buffer3D[n].update()}
self.render3DAll=function(){for(var n in self.buffer3D)self.render3D(self.buffer3D[n])
Depth.sort3D(self.buffer3D)}
self.render3D=function(target){var sprite=target.sprite
var shadow=target.shadow||{}
var offset=target.offset||{x:0,y:0}
var x=target.x+offset.x-self.x
var y=target.y+offset.y-self.y
var z=target.z-self.z
var rotation=target.rotation
var offsetR=target.offsetR
var fl=self.fl
sprite.visible=shadow.visible=true
var scale=fl/(fl+z)*self.scale
sprite.x=self.viewport.x+x*scale
sprite.y=self.viewport.y+(y+z)*scale
sprite.rotation=rotation+offsetR
sprite.scale.set(scale*target.scale,scale*target.scale)
if(!shadow)return
shadow.x=sprite.x
shadow.y=sprite.y-(target.y+offset.y)*scale
shadow.rotation=-shadow.rotation
shadow.scale.set(scale*target.scale,scale*target.scale*-.6)}}