function Vector3D(x,y,z,rotation){var self=this
var fl=250
var vpX=0
var vpY=0
var cX=0
var cY=0
var cZ=0
self.x=x||0
self.y=y||0
self.z=z||0
self.rotation=rotation||0
self.applyTo=function(target,multiplier){var multiplier=multiplier||1
target.x+=self.x*multiplier
target.y+=self.y*multiplier
target.z+=self.z*multiplier
target.rotation+=self.rotation}
self.setValues=function(x,y,z,rotation){self.x=x||0
self.y=y||0
self.z=z||0
self.rotation=rotation||0}
self.product=function(value){self.x*=value
self.y*=value
self.z*=value
return self}
self.copy=function(vector){self.x=vector.x
self.y=vector.y
self.z=vector.z
return self}
self.reset=function(){self.setValues()}}