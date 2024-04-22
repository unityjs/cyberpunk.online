function Button_Stats(vars){var self=Canvas.cast(this)
var blank=Sprites.get("blank",{parent:self})
var sprite
self.isButton=true
var textY=110
var titleField=Texts.spawnBitmap("font",{parent:self,y:textY,size:60,text:"title"})
var valueField=Texts.spawnBitmap("font",{parent:self,y:textY+55,size:60,text:"value",tint:0xffea00})
self.reset=function(vars){if(!vars)return
self.data=vars
if(vars.sprite)sprite=Sprites.get(vars.sprite,{parent:self,x:0,y:textY-40,anchorY:1})
titleField.text=vars.title
valueField.text=vars.value}
self.remove=function(){if(sprite)Sprites.remove(sprite)
sprite=null
Depth.removeChild(self)
Pool.remove(self)}
self.reset(vars)}
Pool.register("Button_Stats",Button_Stats,0,Phaser.Group)