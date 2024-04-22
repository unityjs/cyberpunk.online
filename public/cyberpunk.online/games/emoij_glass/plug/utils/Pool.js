var Pool=new function(){var self=this
var _unused={}
var pool={}
var offset={}
var classes={}
self.register=function(className,clss,amount,parentClass){classes[className]=clss
self.validate(className)
if(parentClass){clss.prototype=Object.create(parentClass.prototype)
clss.prototype.constructor=clss}
for(var n=0;n<amount;n++)_unused[className].push(new classes[className]())}
self.getClass=function(className){return classes[className]}
self.registerCanvas=function(className,clss){self.register(className,clss,0,Phaser.Group)}
self.registerSprite=function(className,clss){self.register(className,clss,0,Phaser.Sprite)}
self.spawn=function(className,vars){var vars=vars||{}
var item=self.getItem(className,vars)
if(item.revive)item.revive()
if(item.reset)item.reset(vars)
return item}
self.spawnVars=self.spawn
self.getItem=function(className,vars){self.validate(className)
var item=_unused[className].shift()||new classes[className]()
pool[className].push(item)
return item}
self.getItemCycle=function(className){self.validate(className)
return _unused[className][++offset[className]%_unused[className].length]}
self.cycle=function(className){var item=self.getItemCycle(className)
item.reset()
return item}
self.cycleVars=function(className,vars){var item=self.getItemCycle(className)
item.reset(vars)
return item}
self.validate=function(className){if(_unused[className])return
if(!classes[className])console.log("CLASS NOT REGISTERED!",className)
_unused[className]=[]
pool[className]=[]
offset[className]=0}
self.remove=function(item){if(item.parent)item.parent.removeChild(item)
var classname=getClassName(item)
_unused[classname].push(item)
if(item.kill)item.kill()
function getClassName(item){for(var id in pool)
for(var n in pool[id])
if(pool[id][n]==item){pool[id].splice(n,1)
return id}}}
self.getPool=function(className){return pool[className]}}