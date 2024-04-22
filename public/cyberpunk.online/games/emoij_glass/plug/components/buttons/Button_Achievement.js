function Button_Achievement(vars){var self=Sprites.cast(this,"achievement_base")
var id="achievement"+(bcount++)
self.isButton=true
var sprite
var textY=-110
var textX=0
var posX=252
var titleField=Texts.spawnBitmap("stroke",{parent:self,x:textX,y:textY,size:40,text:"title",tint:0xff0078})
var descriptionField=Texts.spawnBitmap("stroke",{parent:self,x:textX,y:textY+28,size:65,maxWidth:700,anchorY:0,text:"description",tint:0x000000})
var rewardContainer=Canvas.add(self,0,137)
var rewardField=Texts.spawnBitmap("font",{parent:rewardContainer,anchorX:0,size:55,text:" ",tint:0xFFFFFF})
var coin=Sprites.get("coin",{scale:.6,y:0,parent:rewardContainer})
var xpField=Texts.spawnBitmap("font",{parent:rewardContainer,anchorX:0,size:55,text:" ",tint:0xFFFFFF})
var xp=Sprites.get("displayer_level",{scale:.6,y:0,parent:rewardContainer})
var loadbar=new PowerBar({base:"achievement_progressbar_base",bar:"achievement_progressbar_bar",x:posX,y:rewardContainer.y,parent:self})
var progressField=Texts.spawnBitmap("font",{parent:self,x:posX,y:70,size:60,text:"0/10",tint:0xFFFFFF})
var actionBtn=new Button_Sprite("achievement_collect_btn",onMouseDown,{onClick:onClick,x:posX,y:107,zoomScale:1,action:"action"})
var hackBtn=new Button_SpriteSimple("blank",onMouseDown,{onClick:function(){Achievements.increase(self.data.varName)},parent:self,width:self.width,height:self.height})
hackBtn.disable()
var isBlocked
self.reset=function(vars){Sprites.applyVars(self,vars)
self.data=vars
titleField.text=self.data.title
descriptionField.text=self.data.description
xpField.text=self.data.xp
xp.x=xpField.x+xpField.width+35
rewardField.x=xp.x+60
rewardField.text=self.data.reward
coin.x=rewardField.x+rewardField.width+30
rewardContainer.alpha=1
rewardContainer.x=-130-rewardContainer.width/2
self.scale.set(1)
self.alpha=1
self.refill()}
self.refill=function(){progressField.visible=true
loadbar.visible=true
actionBtn.disable()
actionBtn.visible=false
if(self.data.value>=self.data.objective){Depth.removeChild(progressField)
Depth.removeChild(loadbar)
self.addChild(actionBtn)
actionBtn.enable()
actionBtn.visible=true
return}
self.addChild(progressField)
self.addChild(loadbar)
progressField.text=self.data.value+"/"+self.data.objective
loadbar.setPercent(self.data.value*100/self.data.objective)}
function onMouseDown(){if(isBlocked)return
if(self.onMouseDown!=null)self.onMouseDown(self)}
function onClick(button){if(isBlocked)return
self.onClick(self)}
self.select=function(){}
self.setFalse=function(){}
self.collect=function(){Animation.fadeOut(self)
actionBtn.disable()
Depth.removeChild(actionBtn)
Animation.blink(rewardContainer,5)
Animation.bounceScaleFloor(self)
self.data.value="completed"}
self.remove=function(){if(sprite)Sprites.remove(sprite)
sprite=null
loadbar.reset()
hackBtn.disable()
Depth.removeChild(self)
Pool.remove(self)
Depth.removeChild(actionBtn)
actionBtn.disable()}
self.disable=function(){}
if(vars)self.reset(vars)}
Pool.register("Button_Achievement",Button_Achievement,0,Phaser.Sprite)