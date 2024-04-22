var ImageUtil=new function(){var self=this
self.screenshot=function(target,size,andDownload){var bmd=self.capture(target,size)
var sprite=Sprites.clear(bmd.addToWorld())
sprite.base64=bmd.canvas.toDataURL('image/jpeg')
if(andDownload){var link=document.getElementById('linkID');link.href=sprite.base64
link.download="screenshot.jpg";link.click()}
return sprite}
self.capture=function(target,size){var size=size||target||game
var bmd=game.add.bitmapData(size.width,size.height)
bmd.drawFull(target||Canvas)
return bmd}
self.toBase64=function(target,size){var base64=self.capture(target,size).canvas.toDataURL('image/jpeg',1)
return base64}
self.crop=function(image,rect){}
self.newSprite=function(width,height){var bmd=game.add.bitmapData(width||game.width,height||game.height)
var sprite=Sprites.clear(bmd.addToWorld())
return sprite}}