var Emotes
function Gallery_Emotes(vars){var vars=vars||{}
var openX=Canvas.LEFT-70
var closeX=Canvas.LEFT-672
if(!vars.parent)vars.parent=Canvas.screen
if(!vars.x)vars.x=closeX
if(!vars.y)vars.y=100
var parent=vars.parent
vars.anchorX=vars.anchorY=0
var self=Emotes=Sprites.cast(this,"Emotes_base",vars)
var data=[]
for(var n in Data.config.emotes)data.push({sprite:Data.config.emotes[n]})
var gallery=new Gallery({x:100,y:45,data:data,marginY:130,marginX:130,columns:4,onMouseDown:onMouseDown,parent:self},null)
var displayer=Canvas.add(self,750,110)
new Button_SpriteSimple("blank",onTab,{x:745,y:110,width:200,height:200,parent:self})
var sprite
var isEnabled=true
setSprite(Data.config.emotes[0])
function onMouseDown(button){if(!isEnabled)return
setSprite(button.data.sprite)
self.close()}
function setSprite(label){if(sprite)Sprites.remove(sprite)
sprite=Sprites.get(label,{x:0,y:0,parent:displayer,scale:1.5})
Animation.scaleTo(sprite)
if(self.onSetSprite)self.onSetSprite(label)}
self.open=function(){if(!isEnabled)return
disable()
self.isOpen=true
Animation.springTo(self,{x:openX},600,.1,.7)}
self.close=function(){if(!isEnabled)return
disable()
self.isOpen=false
Animation.springTo(self,{x:closeX},600,.1,.75)}
self.show=function(){isEnabled=true
parent.addChild(self)
if(self.isOpen)self.close()}
self.hide=function(){isEnabled=false
Depth.removeChild(self)
if(self.isOpen)self.close()}
function disable(){isEnabled=false
Delay(function(){isEnabled=true},630)}
function onTab(){self.isOpen?self.close():self.open()}}
Utils.setPrototype(Gallery_Emotes,Phaser.Sprite)