var Elements=new function(){var self=this
var pool=[]
self.spawn=function(design){self.reset()
pool=[]
for(var label in design)
for(var n in design[label]){var array=design[label][n]
var className=getClassName(label)
pool.push(Pool.spawn(className,{label:label,x:array[0],y:array[1],angle:array[2],scale:array[3]||1,scaleY:array[4]||1}))}
function getClassName(label){if(label.indexOf("Base")!=-1)return "Base"
if(label.indexOf("Triangle")!=-1)return "Base"
if(label.indexOf("Curve")!=-1)return "Base"
if(label.indexOf("Undrawable")!=-1)return "Base"
if(label.indexOf("Diamond")!=-1)return "Base"
if(label.indexOf("Rotator")!=-1)return "Rotator"
if(label.indexOf("HeatSpin")!=-1)return "HeatSpin"
if(label.indexOf("SpikesHeat")!=-1)return "SpikesHeat"
if(label.indexOf("Heat")!=-1)return "Heat"
if(label.indexOf("Moving")!=-1)return "Moving"
return label}}
self.reset=function(){while(pool.length)self.remove(pool.shift())
Cannons.reset()}
self.remove=function(element,andSpawn){Depth.removeChild(element)
if(element.matter)Matter.remove(element)
element.remove()
Pool.remove(element)}}