var Level
function myLevel(){var self=this
self.level=0
var isSent
var textField=game.add.text(-190,-game.world.height*.5+53,"0")
textField.anchor.set(0,.5)
textField.font='Kanit'
textField.fontSize=30
textField.fill="#ffffff"
textField.stroke='#000000';textField.strokeThickness=8
Canvas.particles.addChild(textField)
self.reset=function(){self.setLevel(1)
self.show()}
self.setLevel=function(value){self.level=value
textField.text="LEVEL: "+self.level}
self.hide=function(){textField.visible=false}
self.show=function(){textField.visible=true}
self.reset()}