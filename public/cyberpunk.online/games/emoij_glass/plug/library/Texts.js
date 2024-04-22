var Texts=new function(){var self=this
var initVars={font:'Roboto',fontSize:400,fill:"#000000",align:'center',stroke:'#000000',strokeThickness:10,x:0,y:0,text:"text",alpha:1}
self.spawn=function(font,vars){var textField=game.add.text()
Depth.removeChild(textField)
ArrayUtil.extract(ArrayUtil.extract(vars,ArrayUtil.clone(initVars)),textField)
textField.anchor.set(textField.anchorX!=null?textField.anchorX:.5,.5)
if(vars.parent)vars.parent.addChild(textField)
return textField}
self.spawnBitmap=function(font,vars){var vars=vars||{}
var font=font||"font"
var size=vars.size||vars.fontSize||160
var text=vars.text!=null?vars.text:"text"
var align=vars.align||(vars.maxWidth?"center":null)
var textField=game.add.bitmapText(0,0,font,text,size)
if(vars.maxWidth)textField.maxWidth=vars.maxWidth
textField.align=align
Depth.removeChild(textField)
Sprites.applyVars(textField,vars)
return textField}}