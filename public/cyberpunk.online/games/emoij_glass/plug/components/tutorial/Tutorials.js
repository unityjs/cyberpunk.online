var Tutorials
function Tutorials(){var self=Tutorials=Canvas.cast(this)
var _keys=[]
var caźlbacks={}
var tutorials={}
self.isShowing=false
var lastKey
var keys=[]
self.isActive=!Data.get("tutorialFinished")
var isReplay=false
self.vars={}
var ids=0
var textField=self.textField=Texts.spawnBitmap("font",{parent:self,size:60,align:"center",tint:0xFFFFFF})
var nextButton=new Button_SpriteSimple("blank",onMouseDown,{id:"TUT",parent:self})
nextButton.width=Canvas.WIDTH
nextButton.height=Canvas.HEIGHT
self.start=function(){log("TUTORIAL START")
self.isActive=true
self.reset()
self.show()}
self.reset=function(){if(!self.isActive)return
keys=ArrayUtil.cloneArray(_keys)
self.clearVars()
self.isShowing=false}
self.add=function(key,text,validation){var key=key||"key_"+(++ids)
_keys.push(key)
tutorials[key]={key:key,text:text,validation:validation||function(){return true}}}
self.show=function(key,finger){Finger.hide()
log("SHOW TUTORIAL",self.isActive)
if(self.isShowing)self.hide()
if(!self.isActive)return
if(!keys.length)return self.finish()
doShow(key,finger)}
self.finish=function(){if(!self.isActive)return
self.isActive=false
self.hide()
self.clearVars({})
log("TUTORIAL finish")
Data.set("tutorialFinished",1)
Tracking.tutorialFinished()}
self.clearVars=function(vars){self.vars=vars||{}
log("CLEARVARS",self.vars)}
function doShow(key,finger){var key=key||getKey()
lastKey=self.currentKey=key
self.isShowing=true
ArrayUtil.removeItem(keys,key)
var data=tutorials[key]
textField.text=data.text
log("doShow TUTORIAL",key,data.text)
Cancel("tutorial")
Canvas.aboveall.addChild(self)
Depth.toFront(Finger)
Animation.fadeIn(self,350)
Delay(Cursor.enable,350)
if(self.onUpdate)Tick.start(self.onUpdate)
delete self.vars.tracking}
function getKey(){for(var n in keys)
if(tutorials[keys[n]].validation())return keys[n]}
self.hide=function(keepCursor){if(self.update)Tick.stop(self.update)
delete self.update
nextButton.disable()
Depth.removeChild(nextButton)
if(!keepCursor)Finger.hide()
if(!self.isShowing)return
self.isShowing=false
DelayUnique("tutorial",function(){Depth.removeChild(self)},10)
if(!self.isActive)return}
function onMouseDown(){log("SHOW")
self.hide()
if(self.onMouseDown)self.onMouseDown()}
self.delayShow=function(delay){self.hide()
DelayUnique("delayShow",self.show,delay||500)}
self.showNextButton=function(callback){self.onMouseDown=callback
nextButton.enable()
self.addChild(nextButton)}
Tutorial_Script()
self.reset()}
Utils.setPrototype(Tutorials,Phaser.Group)