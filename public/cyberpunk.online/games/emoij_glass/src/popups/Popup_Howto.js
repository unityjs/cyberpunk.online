function Popup_Howto(){var self=Popups.add("Howto",{onMouseDown:onMouseDown,animation:"pan",animationOut:"fade",onShow:onShow,onHide:onHide,update:update,hasBlackCover:false})
var counter=0
var button=new Button_SpriteSimple(null,onMouseDown,{width:Canvas.WIDTH,height:Canvas.HEIGHT,parent:self})
function onMouseDown(button){var id=button.atlasId
Popups.hide("Howto")
LevelLogic.enablePencil()}
function update(){self.sprites.Howto_text.alpha=.7+Math.sin(counter+=.1)*.3}
function onHide(){button.disable()}
function onShow(){button.enable()}}
Pool.register("Popup_Howto",Popup_Howto)