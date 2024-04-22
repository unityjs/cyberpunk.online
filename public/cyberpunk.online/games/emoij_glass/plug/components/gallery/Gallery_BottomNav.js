var BottomNav
function Gallery_BottomNav(onMouseDown){var parent=Canvas.nav
var self=BottomNav=Canvas.cast(this,parent,0,Canvas.BOTTOM)
var base=Sprites.get("menu_base",{y:0,x:0,anchorY:1,width:Canvas.WIDTH,parent:self})
base.inputEnabled=true
var margin=173
var marginSelected=70
var gallery=new Gallery({x:-500,y:-90,data:Data.config.bottomNav,marginX:margin,onMouseDown:onMouseDown,parent:self},"Button_BottomNav")
gallery.pool[2].click()
var isEnabled=true
self.onMouseDown=onMouseDown||function(){}
var current
function onMouseDown(button){var xpos=margin/2
for(var n in gallery.pool){var item=gallery.pool[n]
if(item==button)xpos+=marginSelected
isEnabled?Animation.to(item,{x:xpos},200):item.x=xpos
if(item==button)xpos+=marginSelected
xpos+=margin}
if(!isEnabled)return current=button
Popups.show(button.data.id,null,gallery.pool.indexOf(button)>gallery.pool.indexOf(current)?"left":"right")
current=button}
self.goto=function(label){for(var n in gallery.pool)
if(gallery.pool[n].data.id==label)return gallery.pool[n].click()}
self.show=function(label){Canvas.nav.visible=true
if(label){isEnabled=false
Popups.show(label)
self.goto(label)}
isEnabled=true
parent.addChild(self)}
self.hide=function(){Canvas.nav.visible=false
isEnabled=false
Depth.removeChild(self)}}
Utils.setPrototype(Gallery_BottomNav,Phaser.Group)