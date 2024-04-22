function Popup_BOT(){var self=Popups.add("BOT",{onMouseDown:onDown,animation:"pan"})
function onDown(button){var atlasId=button.atlasId
if(atlasId=="BOT_yes_button")Connector.subscribeBot()
Popups.hide("BOT")}}
Pool.register("Popup_BOT",Popup_BOT)