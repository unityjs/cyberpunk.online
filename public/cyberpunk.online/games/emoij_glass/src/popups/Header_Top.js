var Header_Top=function(vars){var self=Header_Top=Popups.add("Top",{onMouseDown:onMouseDown,animation:"fade"})
self.show()
Canvas.nav.addChild(self)
var sprites=self.sprites
var Top_base=sprites.Top_base
var Top_refresh_button=sprites.Top_refresh_button
var Top_hint_button=sprites.Top_hint_button
var Top_ask_button=sprites.Top_ask_button
var Top_retry_button=sprites.Top_retry_button
var Top_levels_button=sprites.Top_levels_button
var Top_back_button=sprites.Top_back_button
var Top_home_button=sprites.Top_home_button
var Top_settings_button=sprites.Top_settings_button
var Top_settingstab_button=sprites.Top_settingstab_button
var X=Canvas.LEFT+100
var X2=X+200
Top_settings_button.x=Top_home_button.x=Top_back_button.x=X
new Displayer_Coins({x:X2})
new Displayer_Clues({x:Coins.x+630})
Top_base.width=Canvas.WIDTH+2
self.y=Canvas.TOP+2208/2-1
var powerbar=Canvas.add(self)
var bar=sprites.Top_powerbar_bar
var percentField=Texts.spawnBitmap("stroke",{text:"100%",x:-320,y:bar.y+3,anchorX:1,fontSize:30,tint:0x000000,parent:powerbar})
self.levelField=Texts.spawnBitmap("stroke",{text:"level",x:bar.x,y:bar.y+55,fontSize:30,tint:0x000000,parent:powerbar})
var mask=bar.mask=game.add.graphics(bar.x-bar.width/2,bar.y-bar.height/2)
powerbar.addChild(bar)
powerbar.addChild(sprites.Top_powerbar_top)
powerbar.addChild(sprites.Top_pencilicon)
mask.beginFill(0xFF0000)
mask.drawRect(0,0,bar.width,bar.height)
self.addChild(mask)
self.setPercent=function(percent){percentField.text=percent+"%"
mask.width=percent?bar.width*percent/100:.1}
self.setPercent(100)
new Stars({parent:self,x:Top_home_button.x+130,y:Top_base.y-5})
var hintText=Texts.spawnBitmap("stroke",{x:90,y:0,fontSize:40,tint:0xFFFFFF,parent:Top_hint_button})
function doHint(){if(!Clues.clues){Tracking.freeHintOffer()
Ads.playRewarded(function(bool){if(bool)Clues.collect(Cursor,2)})
return}
if(Levels.level.hint)return
Tracking.hintsUsed()
Clues.increase(-1)
Levels.level.showHint()}
Data.addListener("clues",onClues)
function onClues(value){var value=value||"+"
hintText.text="("+(value||"+")+")"
while(hintText.width>75)hintText.scale.set(hintText.scale.x*.9)}
onClues(Data.get("clues"))
function disable(){Stars.hide()
Cancel("showHint")
var mcs=[Top_refresh_button,Top_hint_button,Top_ask_button,Top_retry_button,Top_levels_button,Top_back_button,Top_home_button,Top_settings_button,Top_settingstab_button,Coins,Clues,Top_base,powerbar]
for(var n in mcs){var mc=mcs[n]
if(mc.disable!=null)mc.disable()
mc.visible=false}
Clues.textField.tint=Coins.textField.tint=0x000000}
function enable(mcs){for(var n in mcs){var mc=mcs[n]
if(mc.enable!=null)mc.enable()
mc.visible=true}
Coins.x=X2
Clues.x=Coins.x+300}
Data.addListener("currentScreen",onChangeScreen)
function onChangeScreen(mode){disable()
log("onChangeScreen",mode)
if(mode=="FortuneWheel"){enable([Clues,Coins])
Clues.textField.tint=Coins.textField.tint=0xFFFFFF
Canvas.aboveall.addChild(Clues)
Canvas.aboveall.addChild(Coins)
Coins.x=X
Clues.x=Coins.x+300
return}
if(mode=="Splash"){enable([Top_base,Top_levels_button,Top_settingstab_button,Coins,Clues])
Coins.x=X
Clues.x=Coins.x+300
return}
if(mode=="LevelPages"){Stars.show()
enable([Top_home_button])
return}
if(mode=="Levels"){Stars.show()
enable([Top_back_button])
return}
if(mode=="Shop"){enable([Top_home_button,Coins,Clues])
Coins.x=X2
Clues.x=Coins.x+300
return}
if(mode=="game"){enable([Top_base,Top_home_button,Top_hint_button,Top_refresh_button,powerbar])
return}
if(mode=="Over"){enable([Top_base,Top_home_button,Top_levels_button,Top_retry_button,Top_settingstab_button,Coins,Clues])
return}}
function onMouseDown(button){var atlasId=button.atlasId
Finger.hide()
log("atlasId",atlasId)
if(atlasId=="Top_ask_button"){return;}
if(atlasId=="Top_hint_button")return doHint()
if(atlasId=="Top_retry_button")return LevelLogic.retry(true)
if(atlasId=="Top_refresh_button")return LevelLogic.retry()
if(atlasId=="Top_home_button")return Engine.exit()
if(atlasId=="Top_settings_button")return Popups.overlay("Settings")
if(atlasId=="Top_settingstab_button")return Popups.overlay("Settings")
if(atlasId=="Top_back_button")return Popups.show("LevelPages")
if(atlasId=="Top_levels_button")return Popups.show("LevelPages")}
self.showHint=function(label){log("SHOW TOP HINT")}
disable()}
Pool.registerCanvas("Header_Top",Header_Top)