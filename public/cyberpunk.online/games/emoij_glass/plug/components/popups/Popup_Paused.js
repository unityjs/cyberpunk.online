function Popup_Paused(){var self=Popups.add("Paused",{onShow:onShow,onMouseDown:onDown,animation:"pan",hasBlackCover:true})
var okBtn=new Button_Sprite("blank",onDown,{scale:30,parent:self,x:0,y:0})
function onShow(){}
function onDown(button){if(Popups.isPaused)return Popups.unpause()
Popups.hide("Paused")
if(self.data.callback)self.data.callback()}}
Pool.register("Popup_Paused",Popup_Paused)