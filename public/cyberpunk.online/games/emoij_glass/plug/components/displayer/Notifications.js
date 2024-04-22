var Notifications=new function(){var self=this
var pool={}
var listeners={}
var ids=0
self.spawn=function(vars){var vars=vars||{}
if(!vars.key)vars.key="notif_"+(ids++)
var item=pool[vars.key]=Pool.spawn("Notification",vars)
return item}
self.show=function(key,amount){var item=pool[key]
item.show(amount)
return item}
self.hide=function(key){pool[key].hide()}
self.get=function(key){return pool[key]}}
function Notification(vars){var vars=vars||{}
var self=Sprites.cast(this,"blank")
var textField=Texts.spawnBitmap("stroke",{parent:self,size:45,text:"!"})
var parent
var value
var key
var sprite
self.reset=function(vars){if(sprite)Sprites.remove(sprite)
sprite=Sprites.get(vars.texture||"Notification",{x:0,y:0,parent:self})
Depth.toFront(textField)
var vars=vars||{}
self.x=vars.x||0
self.y=vars.y||0
parent=vars.parent||Canvas.aboveall
key=vars.key
Data.addListener(key,self.autoShow)
self.autoShow(Data.get(key))}
self.show=function(_va){if(_va!=value){self.scale.set(.1)
Animation.scaleTo(self)}
value=_va||0
textField.text=value||"!"
parent.addChild(self)}
self.autoShow=function(value){value?self.show(value):self.hide()}
self.hide=function(){value=0
Depth.removeChild(self)}}
Pool.register("Notification",Notification,0,Phaser.Sprite)