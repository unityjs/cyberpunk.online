function Button_Friend(vars){var self=Sprites.cast(this,"listbox_base")
var id="pvp"+(bcount++)
var actionBtn=new Button_Sprite("pvp_play_btn",onMouseDown,{onClick:onClick,x:344,y:0,zoomScale:1,parent:self,action:"action"})
self.isButton=true
var icon
var textY=-25
var textX=-285
var titleField=Texts.spawn("Roboto",{parent:self,anchorX:0,x:textX,y:textY,fontSize:60,text:"title",fill:"#000000",strokeThickness:0})
var thumbnail=new Thumbnail({parent:self,radius:143,x:-405})
var isBlocked
self.reset=function(vars){Sprites.applyVars(self,vars)
self.data=vars
if(vars.icon)icon=Sprites.get(vars.icon,{parent:self,x:0,y:textY-60,anchorY:1})
titleField.text=vars.userName||"GUEST"
thumbnail.load(vars.userPhoto)
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
Depth.removeChild(self)
Pool.remove(self)}
if(vars)self.reset(vars)}
Pool.register("Button_Friend",Button_Friend,0,Phaser.Sprite)