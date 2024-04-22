function myPauseControl(){var self=this
var keyboardSpace=game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
self.pause=function(){isPaused=true
if(!isPlaying)return
popupInstructions.show()}
self.unpause=function(){isPaused=false
popupInstructions.close()}
function resetPausekey(){keyboardSpace.onDown.removeAll(self)
keyboardSpace.onDown.addOnce(onPausePress,self)}
function onPausePress(){isPaused?self.unpause():self.pause()
resetPausekey()}
resetPausekey()}
var PauseControl