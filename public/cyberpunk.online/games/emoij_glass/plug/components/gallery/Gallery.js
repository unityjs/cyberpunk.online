var galleryIDs=0
function Gallery(vars,buttonClassName){var vars=vars||{x:0,y:0}
var parent=vars.parent
var self=Canvas.cast(this,parent,vars.x,vars.y)
var marginX=vars.marginX||0
var marginY=vars.marginY||0
var pad=vars.pad||false
self.requireValidation=vars.requireValidation
self.onMouseDown=vars.onMouseDown||function(button){log(button.data)}
self.onStartDrag=vars.onStartDrag
var pool=self.pool=[]
var id="gallery"+(galleryIDs++)
var buttonClassName=buttonClassName||"Button_Sprite"
var selected
var posX=0
var posY=0
var buttons={}
var columns=vars.columns||0
var colInc=0
var cascadeColumn=vars.cascadeColumn
self.clear=function(){for(var n in pool)pool[n].remove()
buttons=self.buttons={}
pool=self.pool=[]
self.sort()}
self.fill=function(data){self.clear()
for(var n in data)self.addButton(data[n])}
self.addButton=function(data){var button=Pool.spawn(buttonClassName,data)
button.onMouseDown=onMouseDown
if(self.onStartDrag){button.onMouseDown=onStartDrag
button.onClick=onMouseDown}
pool.push(button)
buttons[data.id]=button
self.addChild(button)
sortButton(button)
return button}
self.removeButton=function(button){delete buttons[button.data.id]
ArrayUtil.removeItem(pool,button)
button.remove()
self.sort()}
self.sort=function(){posX=marginX/2
posY=marginY/2
colInc=0
for(var n in pool)sortButton(pool[n])}
function sortButton(button){if(pad)posX+=button.pad/2
button.x=posX
button.y=posY
if(cascadeColumn&&colInc==0)button.y+=marginY/4
adjustPosXY()
if(pad)posX+=button.pad/2}
function adjustPosXY(){if(columns){if(++colInc>=columns){colInc=0
posY+=marginY
posX=marginX/2}else{posX+=marginX}
return}
posX+=marginX
posY+=marginY}
function onStartDrag(button){self.onStartDrag()}
function onMouseDown(button){if(!self.onMouseDown(button)&&self.requireValidation)return
for(var n in pool)
if(pool[n]!=button)pool[n].setFalse()
self.selected=button}
self.select=function(id){if(buttons[id])buttons[id].click()}
self.show=function(){if(parent)parent.addChild(self)}
self.hide=function(){Canvas.limbo.addChild(self)
for(var n in pool)pool[n].setFalse()}
self.fill(vars.data)}
Utils.setPrototype(Gallery,Phaser.Group)