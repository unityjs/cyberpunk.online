var ButtonSound
function myButtonSound(vars){var vars=vars||{}
var self=ButtonSound=Canvas.cast(this,vars.parent||Canvas.aboveall,vars.x||Canvas.RIGHT-50,vars.y||Canvas.TOP+50)
var onSprite=Sprites.get("Button_Sound_On")
var offSprite=Sprites.get("Button_Sound_Off")
var btn=new Button_SpriteSimple("blank",onDown,{parent:self})
btn.canBeBlocked=false
btn.addChild(game.sound.mute?offSprite:onSprite)
function onDown(){game.sound.mute=!game.sound.mute
Depth.removeChild(onSprite)
Depth.removeChild(offSprite)
btn.addChild(game.sound.mute?offSprite:onSprite)}
self.show=btn.show
self.hide=btn.hide}
Utils.setPrototype(myButtonSound,Phaser.Group)