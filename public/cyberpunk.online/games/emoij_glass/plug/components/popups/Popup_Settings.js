var Settings
function Popup_Settings(){var self=Settings=this
Popups.add("Settings",{onMouseDown:onDown,animation:"pan",hasBlackCover:true})
var soundsBtn=new ButtonBoolean("Button_SFX",{default:false,varName:"muteSFX",x:-200,y:-320,parent:Popups.Settings.container,boolean:false})
var musicBtn=new ButtonBoolean("Button_Music",{default:false,varName:"muteMusic",x:200,y:-320,parent:Popups.Settings.container,boolean:false})
Popups.Settings.onShow=function(){Canvas.nav.visible=false}
function onDown(button){var id=button.atlasId
Canvas.nav.visible=true
if(id=="Settings_close_button")return Popups.show("Splash")
if(id=="Settings_tutorial_button"){Tutorials.start()
return}}}
Pool.register("Popup_Settings",Popup_Settings)