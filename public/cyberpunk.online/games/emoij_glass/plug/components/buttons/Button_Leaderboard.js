function Button_Leaderboard(vars){var self=Sprites.cast(this,"listbox_base")
var id="pvp"+(bcount++)
self.isButton=true
var width=self.width
var actionBtn=new Button_Sprite("pvp_play_btn",onMouseDown,{onClick:onClick,x:344,y:0,zoomScale:1,parent:self,action:"action"})
var icon
var textY=-25
var textX=-285
var nameField=Texts.spawn("Roboto",{parent:self,anchorX:0,x:textX,y:textY,fontSize:60,text:"title",fill:"#000000",strokeThickness:0})
var thumbnail=new Thumbnail({parent:self,radius:143,x:-405})
var scoreField=Texts.spawnBitmap("font",{x:textX,anchorX:0,parent:self,y:textY+50,size:40,text:"value",tint:0xffea00})
var rankField=Texts.spawnBitmap("font",{x:thumbnail.x+40,parent:self,y:thumbnail.y+40,size:50,text:"value",tint:0xffea00})
var isBlocked
actionBtn.disable()
Depth.removeChild(actionBtn)
self.reset=function(vars){Sprites.applyVars(self,vars)
self.data=vars
if(vars.icon)icon=Sprites.get(vars.icon,{parent:self,x:0,y:textY-60,anchorY:1})
nameField.text=vars.userName||"Guest_"+vars.rank
scoreField.text=StringUtil.commas(vars.score)
rankField.text="#"+vars.rank
thumbnail.load(vars.userPhoto)
Depth.removeChild(actionBtn)
if(vars.userID==Players.ME.userID||!Players.isFriend(vars.userID))return
self.addChild(actionBtn)
actionBtn.enable()}
function onMouseDown(){if(isBlocked)return
self.onMouseDown(self)}
function onClick(button){if(isBlocked)return
self.onClick(self)}
self.select=function(){}
self.setFalse=function(){}
self.remove=function(){if(icon)Depth.removeChild(icon)
icon=null
actionBtn.disable()
Depth.removeChild(actionBtn)
Depth.removeChild(self)
Pool.remove(self)}
if(vars)self.reset(vars)}
Pool.register("Button_Leaderboard",Button_Leaderboard,0,Phaser.Sprite)