var BlackCover
function myBlackCover(){var self=BlackCover=Sprites.cast(this,"cover")
self.inputEnabled=true
self.isShowing=false
self.show=function(isVisible){self.isShowing=true
self.width=Canvas.WIDTH+100
self.height=Canvas.HEIGHT+100
Canvas.popups.addChild(self)}
self.hide=function(){self.isShowing=false
Depth.removeChild(self)}}
Pool.register("myBlackCover",myBlackCover,0,Phaser.Sprite)