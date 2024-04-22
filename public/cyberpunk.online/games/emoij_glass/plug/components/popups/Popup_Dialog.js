function Popup_Dialog(){var self=Popups.add("Dialog",{onShow:onShow,onMouseDown:onDown,animation:"pan",hasBlackCover:true})
var base=new Square("nineslice50",{y:0,width:850,height:640,parent:self,tint:0xffea00})
var closeBtn=new Button_Sprite("close_button",onDown,{parent:self,x:Canvas.RIGHT-80,y:Canvas.TOP+80})
var okBtn=new Button_SpriteText("btn_base_medium",onDown,{text:"ok",parent:self,x:0,y:200})
var textField=Texts.spawnBitmap("stroke",{parent:self,tint:0x000000,size:90,maxWidth:650,y:-100})
function onShow(){textField.text=self.data.text||"text"
okBtn.textField.text=self.data.buttonText||"ok"
closeBtn.visible=!Popups.isPaused}
function onDown(button){var id=button.atlasId
if(Popups.isPaused)return Popups.unpause()
Popups.hide("Dialog")
if(self.data.callback)self.data.callback(id!="close_button")}}
Pool.register("Popup_Dialog",Popup_Dialog)