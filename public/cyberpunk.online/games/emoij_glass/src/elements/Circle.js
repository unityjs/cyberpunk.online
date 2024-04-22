function Circle(){var self=Canvas.cast(this)
var sprite=Sprites.get("Circle",{parent:self,x:0,y:0})
var radius=123
self.reset=function(vars){self.scale.set(vars.scale)
self.matter=Matter.Bodies.circle(0,0,123*vars.scale,{isStatic:true,mass:.001,friction:0.00001,restitution:.5,density:0.0001})
Matter.Body.setPosition(self.matter,vars)
Matter.Body.setAngle(self.matter,MathUtil.degreeToRadians(vars.angle))
Matter.addToWorld(self)
PencilPhysics.collisionBodies.push(self.matter)
Canvas.front.addChild(self)}
self.remove=function(){}}
Pool.registerCanvas("Circle",Circle)