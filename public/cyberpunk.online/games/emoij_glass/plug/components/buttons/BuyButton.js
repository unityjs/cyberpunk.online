function BuyButton(callback,price,groupID,x,y,parent){var self=this
self.container=Canvas.add(parent,x,y)
self.price=price
self.callback=callback
self.groupID=groupID
self.textField=Texts.spawn({container:self.container,x:0,y:-40,fontSize:30,strokeThickness:10,text:MathUtil.commas(price)})
self.data=[]
self.sprite=Sprites.spawn("gui","buyBtn",0,0,self.container)
var btn=new Button(self.sprite,onDown)
btn.id="buy"
var blank=Sprites.spawn("blank",null,null,-40)
blank.scale.set(1.3,1.3)
self.sprite.addChild(blank)
ButtonGroup.push(self,groupID)
ButtonGroup.push(self,"buyButtons")
function onDown(){console.log("buy",self.data)
Animation.click(self.textField)
self.callback(self)}
self.enable=function(){btn.enable()
self.textField.alpha=btn.sprite.alpha}
self.disable=function(){btn.disable()
self.textField.alpha=btn.sprite.alpha}
self.select=function(){}
self.deselect=function(){}}