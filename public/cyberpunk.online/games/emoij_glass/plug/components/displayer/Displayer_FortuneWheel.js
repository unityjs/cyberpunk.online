function Displayer_FortuneWheel(vars){var vars=vars||{}
var self=Displayer_FortuneWheel=Canvas.cast(this,vars.parent||Popups.Splash,vars.x||Canvas.RIGHT-80,vars.y||Canvas.TOP+250)
Sprites.get("symbol_wheel",{parent:self,x:0,y:0})
var textField=Texts.spawnBitmap(vars.font||"font",{y:0,x:0,size:50,text:"",parent:self})
var timeField=Texts.spawnBitmap(vars.font||"font",{y:45,x:0,size:35,text:"spin",parent:self})
var button=new Button_SpriteSimple("blank",mouseDown,{parent:self,width:200,height:300})
function mouseDown(){Popups.show("FortuneWheel")}
self.startTimer=function(multiplier){Data.set("FW_multiplier",multiplier)
Data.set("FW_start",DateUtils.getTime())
resumeTimer()}
function resumeTimer(){if(Data.get("FW_multiplier")==1)return textField.text=""
textField.text="x"+Data.get("FW_multiplier")
Tick.startTimer(onTimer)}
function onTimer(){var seconds=3600-DateUtils.secondsFrom(Data.get("FW_start"))
Data.set("FW_seconds",seconds,true)
timeField.text=StringUtil.seconds(seconds)
if(seconds<=0){Data.set("FW_multiplier",1)
Data.set("FW_seconds",0)
Tick.stop(onTimer)
timeField.text="spin"
textField.text=""}}
if(3600-DateUtils.secondsFrom(Data.get("FW_start")))resumeTimer()}
Utils.setPrototype(Displayer_FortuneWheel,Phaser.Group)