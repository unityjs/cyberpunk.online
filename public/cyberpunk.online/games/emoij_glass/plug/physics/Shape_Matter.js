var Shape_Pool=[]
var ShapeSensors_Pool=[]
function Shape_Matter(lines,tint){var self=Canvas.cast(this,Canvas.mid)
var lines=lines
var parts=[]
var sensors=[]
for(var n in lines){var line=lines[n]
var matter=Matter.Bodies.rectangle(line.centerX,line.centerY,line.image.width,line.image.height,{angle:line.rotation})
parts.push(matter)
line.matter=matter}
self.matter=Matter.Body.create({mass:.1,friction:0.5,restitution:0,parts:parts})
Matter.Body.setDensity(self.matter,.0000001)
Matter.addToWorld(self)
Shape_Pool.push(self)
var offset={x:0,y:0}
for(var n in lines){var line=lines[n]
self.addChild(line)
line.x-=self.x
line.y-=self.y}
Tick.startMill(update)
update()
function update(){for(var n in sensors){sensor=sensors[n]
Matter.Body.setPosition(sensor,{x:parts[n].position.x,y:parts[n].position.y})
Matter.Body.setVelocity(sensor,{x:0,y:0})}}
self.remove=function(){for(var n in lines)lines[n].remove()
for(var n in sensors){ArrayUtil.removeItem(ShapeSensors_Pool,sensors[n])
Matter.removeBody(sensors[n])}
lines=[]
Depth.removeChild(self)
ArrayUtil.removeItem(Shape_Pool,self)
Matter.remove(self)
Tick.stop(update)}}
Pool.registerCanvas("Shape_Matter",Shape_Matter)