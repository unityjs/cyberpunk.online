function Popup_NoAds(){var self=Popups.add("NoAds",{onShow:onShow,onMouseDown:onDown,animation:"pan",hasBlackCover:true})
function onShow(){log("ON SHOW",self.data)
Tracking.noAds()}
function onDown(button){var id=button.atlasId
Popups.hide("NoAds")
if(self.data.callback)self.data.callback()}}
Pool.register("Popup_NoAds",Popup_NoAds)