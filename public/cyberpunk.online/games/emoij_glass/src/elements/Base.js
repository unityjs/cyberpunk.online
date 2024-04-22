function Base(){var self=Canvas.cast(this)
var sprite
var vertices={}
vertices.Diamond=Matter.Vertices.fromPath("97 2 8 212 6 216 -4 218 -97 -2 -4 -217 4 -218 7 -212 97 -2")
vertices.Curve1=Matter.Vertices.fromPath("187 129 180 125 177 84 167 51 152 22 133 -3 103 -29 75 -45 44 -55 10 -60 -22 -60 -63 -50 -97 -33 -122 -14 -148 16 -164 44 -174 75 -180 125 -183 128 -244 128 -248 117 -247 97 -239 53 -221 6 -192 -38 -157 -73 -113 -102 -73 -117 -31 -126 22 -128 66 -120 113 -102 157 -73 192 -38 221 6 236 46 244 81 248 121 247 125 240 129")
vertices.Curve2=Matter.Vertices.fromPath("99 87 96 84 95 64 90 45 72 15 45 -6 14 -15 -23 -14 -44 -6 -63 7 -84 34 -92 59 -95 84 -98 87 -161 87 -164 84 -165 65 -159 32 -144 -3 -126 -29 -108 -47 -83 -65 -49 -79 -21 -85 14 -87 50 -80 84 -65 108 -48 126 -30 145 -3 159 32 166 83 162 87")
vertices.Curve3=Matter.Vertices.fromPath("36 55 30 35 24 26 12 17 -1 15 -11 17 -23 26 -29 35 -31 52 -35 54 -97 55 -100 52 -101 36 -97 17 -80 -16 -52 -41 -38 -48 -16 -53 17 -54 53 -41 81 -16 93 6 99 25 102 51 98 55")
vertices.Triangle=Matter.Vertices.fromPath("-171 124 -180 119 -182 104 -10 -121 2 -125 11 -118 180 103 181 116 170 124")
self.reset=function(vars){var label=vars.label
sprite=Sprites.get(label,{parent:self,x:0,y:0,scaleX:vars.scale,scaleY:vars.scaleY})
if(label=="Base"){self.matter=Matter.Bodies.rectangle(0,0,246*vars.scale,246*vars.scaleY,{isStatic:true,mass:100,restitution:.5,friction:.5})
Canvas.mid.addChild(self)}else if(label=="Undrawable"){self.matter=Matter.Bodies.rectangle(0,0,1364*vars.scale,950*vars.scaleY,{isStatic:true,isSensor:true,mass:100,restitution:.5,friction:.5})
Canvas.foreground.addChild(self)}else{self.matter=Matter.Bodies.fromVertices(0,0,vertices[label],true)
Matter.Body.scale(self.matter,vars.scale,vars.scaleY)
if(label=="Curve1")sprite.y=15
if(label=="Triangle")sprite.y=-40
Canvas.back.addChild(self)}
Matter.Body.setStatic(self.matter,true)
Matter.Body.setPosition(self.matter,vars)
Matter.Body.setAngle(self.matter,MathUtil.degreeToRadians(vars.angle))
Matter.addToWorld(self)
PencilPhysics.collisionBodies.push(self.matter)}
self.remove=function(){Sprites.remove(sprite)}}
Pool.registerCanvas("Base",Base)