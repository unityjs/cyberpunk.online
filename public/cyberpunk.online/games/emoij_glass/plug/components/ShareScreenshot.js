var scrIDs=0
function ShareScreenshot(vars){var vars=vars||{}
var parent=vars.parent||Canvas.aboveall
var self=Canvas.cast(this,parent,vars.x||0,vars.y||600)
var picture=Canvas.add(self)
var white=Sprites.get("white",{parent:picture})
var screenshot=null
var wallScreenshot=null
var button=new Button_Sprite("Share_btn",onDown,{parent:self,x:200})
var myBase64
var isShared
var onShare=vars.onShare
var onAfterShare=vars.onAfterShare
var beforeWallCapture=vars.beforeWallCapture
var id="screenshotID_"+(scrIDs++)
var wallBase64
var wallContainer=self.wallContainer=ImageUtil.newSprite()
var background=self.background=Sprites.get(vars.background||"Wallshare_background",{x:0,y:0,anchorX:0,anchorY:0,parent:wallContainer})
wallContainer.anchor.set(0,0)
self.share=function(){return ImageUtil.toBase64(self)}
self.show=function(){isShared=false
white.width=Canvas.WIDTH+120
white.height=Canvas.HEIGHT+120
if(screenshot)Depth.removeChild(screenshot)
screenshot=ImageUtil.screenshot()
myBase64=screenshot.base64
wallBase64=null
picture.addChild(screenshot)
Sprites.applyVars(picture,{angle:0,scale:1,x:-self.x,y:-self.y})
var scale=.7
Animation.to(picture.scale,{x:scale,y:scale})
Animation.to(picture,{x:0,y:-700,angle:-6}),button.visible=false
Delay(function(){self.addChild(button)
button.enable()
Animation.fadeIn(button)},400)
parent.addChild(self)
self.visible=true}
function updateMax(value){self.maxField.text="Best: "+value}
function onDown(){self.shareWall()}
self.shareWall=function(andDownload){button.disable()
Depth.removeChild(button)
if(wallBase64){Connector.share(wallBase64)
if(onAfterShare!=null)onAfterShare(wallBase64)
if(andDownload){var link=document.getElementById('linkID');link.href=wallBase64
link.download="screenshot.jpg";link.click()}
return}
if(onShare!=null)onShare()
self.captureWall(function(wallBase64){Connector.share(wallBase64)
if(onAfterShare!=null)onAfterShare(wallBase64)},andDownload)}
self.captureWall=function(callback,andDownload){Canvas.game.y=0
Canvas.game.x=0
wallContainer.x=Canvas.LEFT
wallContainer.y=Canvas.TOP
Canvas.underall.addChild(wallContainer)
if(beforeWallCapture!=null)beforeWallCapture()
wallScreenshot=game.add.bitmapData(background.width,background.height)
background.width+=2
background.x=-1
Delay(function(){wallScreenshot.drawFull(wallContainer)
background.width=wallScreenshot.width
wallBase64=wallScreenshot.canvas.toDataURL('image/jpeg')
callback(wallBase64)
if(andDownload){var link=document.getElementById('linkID');link.href=wallBase64
link.download="screenshot.jpg";link.click()}},40)}
self.toBase64=function(){return myBase64}
self.hide=function(){if(screenshot)screenshot.destroy()
if(wallScreenshot)wallScreenshot.destroy()
wallScreenshot=screenshot=null
self.visible=false
Depth.removeChild(self)
button.disable()}
self.hide()}
Utils.setPrototype(ShareScreenshot,Phaser.Group)