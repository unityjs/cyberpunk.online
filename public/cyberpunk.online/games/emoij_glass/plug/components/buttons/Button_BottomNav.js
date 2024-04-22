function Button_BottomNav(atlasId,onMouseDown,vars){var self=Sprites.cast(this,"blank")
self.id=bcounts++
self.sprite=self
self.inputEnabled=true
self.isButton=true
self.events.onInputDown.add(onDown)
self.area=Sprites.get("blank",{height:220,width:200,parent:self})
var icon
var isEnabled=true
var textField=Texts.spawnBitmap("stroke",{parent:self,y:125,size:40,text:"value",tint:0x1a8dd4})
self.boolean=null
self.reset=function(vars){if(!vars)return
var vars=self.data=vars
icon=Sprites.get(vars.sprite,{scale:.7,x:0,y:55,anchorY:1,parent:self})
self.onMouseDown=vars.onMouseDown
textField.text=vars.text
self.enable()
if(vars.notification)Notifications.spawn({key:vars.notification,parent:self,x:60,y:-50,texture:vars.notificationTexture})}
function onDown(force){Sounds.play("button")
if(!force)
if(!isEnabled||Cursor.isBlocked)return
self.setBoolean(true)
self.onMouseDown(self)}
self.disable=function(){isEnabled=false}
self.enable=function(force){isEnabled=true}
self.setBoolean=function(bool){if(self.boolean===bool)return
self.boolean=bool
var scale=.9
var iconY=30
var textY=55
var textAlpha=1
if(!bool){scale=.7
iconY=55
textY=120
textAlpha=0}
Animation.to(icon,{y:iconY},200)
Animation.to(textField,{alpha:textAlpha,y:textY},200)
Animation.scaleTo(icon,scale)}
self.setFalse=function(){self.setBoolean(false)}
self.click=function(){onDown(true)}
self.reset(vars)}
Pool.register("Button_BottomNav",Button_BottomNav,0,Phaser.Sprite)