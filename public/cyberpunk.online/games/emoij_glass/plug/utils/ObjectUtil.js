var ObjectUtil=new function(){var self=this
self.setup3D=function(target){target.x=target.x||0
target.y=target.y||0
target.z=target.z||0
target.rotation=0
target.offsetR=0
target.scale=1
target.sprite=Canvas.add()
target.shadow=Canvas.add()
target.speed=new Vector3D()
target.scale=1
Camera.buffer3D.push(target)
return target}}