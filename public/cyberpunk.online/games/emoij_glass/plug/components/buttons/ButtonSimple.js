function ButtonSimple(sprite,onMouseDown,onMouseUp,onMouseOver){var self=this
self.sprite=sprite
self.onMouseDown=onMouseDown
self.onMouseUp=onMouseUp
self.onMouseOver=onMouseOver
self.id=bcount++
self.sprite.inputEnabled=true
var isEnabled=true
var isOver=false
self.sprite.events.onInputDown.add(function(){if(!isEnabled||Cursor.isBlocked)return
if(self.onMouseDown!=null)self.onMouseDown(self)})
self.sprite.events.onInputOut.add(function(){isOver=false
if(self.onMouseUp)self.onMouseUp(self)})
self.sprite.events.onInputOver.add(function(){isOver=true
if(!isEnabled||Cursor.isBlocked)return
if(self.onMouseOver!=null)self.onMouseOver(self)})
self.disable=function(){isEnabled=false
self.sprite.alpha=.5}
self.enable=function(force){isEnabled=true
self.sprite.alpha=1}}