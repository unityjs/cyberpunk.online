Matter.enable=function(andRender){var engine=Matter.engine=Matter.Engine.create()
var runner=Matter.Runner.create()
Matter.world=engine.world
Matter.Runner.run(runner,engine)
Matter.spritePool=[]
Tick.startMill(Matter.updateSprites)
Math.categories=[0x0001,0x0002,0x0003,0x0004,0x0005,0x0006,0x0007,0x0008,0x0009,0x0010]
if(!andRender)return
Matter.Render.run(Matter.Render.create({element:document.body,engine:engine,options:{width:game.world.width,height:game.world.height,showAngleIndicator:true}}))}
Matter.addToWorld=function(matterSprite){Matter.World.add(Matter.world,matterSprite.matter)
Matter.spritePool.push(matterSprite)
Matter.updateSprite(matterSprite)}
Matter.startSprites=function(){for(var n in Matter.spritePool)
if(Matter.spritePool[n].start!=null)Matter.spritePool[n].start()}
Matter.hitCast=function(startPoint,endPoint,bodies){var collisions=Matter.Query.ray(bodies||Matter.Composite.allBodies(Matter.engine.world),startPoint,endPoint)
if(!collisions.length)return
for(var n in collisions)return collisions[n]}
Matter.remove=function(matterSprite){Matter.World.remove(Matter.world,matterSprite.matter)
Depth.removeChild(matterSprite)
ArrayUtil.removeItem(Matter.spritePool,matterSprite)}
Matter.addBody=function(matter){Matter.World.add(Matter.world,matter)}
Matter.removeBody=function(matter){Matter.World.remove(Matter.world,matter)}
Matter.updateSprites=function(){for(var n in Matter.spritePool)Matter.updateSprite(Matter.spritePool[n])}
Matter.updateSprite=function(matterSprite){matterSprite.x=matterSprite.matter.position.x
matterSprite.y=matterSprite.matter.position.y
matterSprite.rotation=matterSprite.matter.angle}