var PauseButton=new function(){var self=this
self.enable=self.disable=function(){}}
function Button_Pause(x,y){var self=PauseButton=this
var x=x||Canvas.LEFT+50
var y=y||Canvas.TOP+50
self.sprite=Sprites.get("Button_Pause",{x:x,y:y})
var btn=new Button(self.sprite,onDown)
var isEnabled=true
self.isButton=true
btn.id="pause"
Canvas.gui.addChild(self.sprite)
var keyboardSpace=game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
var isKeyboardEnabled=false
function onDown(){Engine.isPaused?Engine.play():Engine.pause()
if(Engine.isPaused)Music.stop()
self.sprite.visible=!Engine.isPaused}
function onKeyboardDown(){resetPausekey()
if(isKeyboardEnabled)onDown()}
function resetPausekey(){Callback.delayUnique("pauseKeyboard",function(){keyboardSpace.onDown.removeAll(self)
keyboardSpace.onDown.addOnce(onKeyboardDown,self)},500)}
self.enable=function(){isEnabled=true
btn.enable()
self.sprite.visible=true
self.sprite.x=x
self.sprite.y=y
self.enableKeyboard()}
self.disable=function(){isEnabled=false
btn.disable()
self.sprite.visible=false
self.sprite.x=-6000
self.sprite.y=-6000}
self.enableKeyboard=function(){isKeyboardEnabled=true}
self.disableKeyboard=function(){isKeyboardEnabled=false}
resetPausekey()}