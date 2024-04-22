function Popup_Claim(){var self=Popups.add("Claim",{onMouseDown:onMouseDown,animation:"fade",onShow:onShow,onHide:onHide,update:update,hasBlackCover:false})
function onMouseDown(button){var id=button.atlasId
Finger.hide()
Popups.hide("Claim")
Popups.overlay("FortuneWheel",{autoSpin:true,forceValue:true})}
function update(){}
function onHide(){}
function onShow(){Finger.show({x:310,y:220},"tap")}}
Pool.register("Popup_Claim",Popup_Claim)