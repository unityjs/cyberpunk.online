var buttonBooleanIds=0
function ButtonBoolean(id,vars,onMouseDown){var self=this
var vars=vars||{}
self.sprite=Sprites.get("blank",vars)
self.onMouseDown=onMouseDown
var onSprite=Sprites.get(id+"_On",{x:0,y:0,parent:self.sprite})
var offSprite=Sprites.get(id+"_Off",{x:0,y:0})
var btn=self.button=new Button(self.sprite,onDown)
buttonBooleanIds++
var varName=vars.varName||"booleanVar_"+(buttonBooleanIds++)
function onDown(){self.setBoolean(!self.boolean)}
self.setBoolean=function(boolean){self.boolean=boolean
Depth.removeChild(onSprite)
Depth.removeChild(offSprite)
self.sprite.addChild(boolean?onSprite:offSprite)
if(self.onMouseDown!=null)self.onMouseDown(boolean)
if(!varName)return
Data.set(varName,boolean)
var i=boolean?1:0
if(varName=="muteSFX")Sounds.setMute(i)
if(varName=="muteMusic")Music.setMute(i)
log(varName,"SET BOOLEAN",boolean)}
var def=vars.default
if(def!=null){def=def?true:false}else{def=true}
if(!varName)return self.setBoolean(def)
var bool=Data.get(varName)
if(bool==0)bool=def
self.setBoolean(bool)}