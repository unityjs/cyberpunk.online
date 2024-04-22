var Confirm
function Popup_Confirm(){var self=Confirm=this
Popups.add("Confirm",{animation:"scale",onShow:onShow,animationOut:"cut",update:update,onMouseDown:onMouseDown})
var container=Popups.Confirm
var base=Popups.Confirm.sprites.Confirm_base
Texts.spawnBitmap("font",{parent:container,y:base.y-base.height/2+200,size:80,text:"confirm purchase?"})
var closeBtn=Sprites.get("Settings_close_button",{x:base.x+base.width/2-20,y:base.y-base.height/2+20,parent:container,onMouseDown:hide})
var sprite
var sinCount=0
var valueField=Texts.spawnBitmap("font",{parent:container.sprites.Confirm_button,y:0,size:120,text:"value",tint:0xffea00})
function onShow(){valueField.text="$"+container.data.button.data.price
sprite=Sprites.get(container.data.button.data.sprite+"_blocked",{fitArea:new Rect(0,-195,300,300),parent:container})}
function update(){sinCount+=.05
sprite.rotation=Math.sin(sinCount)*.1}
function onMouseDown(button){container.data.onConfirm()
hide()}
function hide(){Sprites.remove(sprite)
Popups.hide("Confirm")}}
Pool.register("Popup_Confirm",Popup_Confirm)