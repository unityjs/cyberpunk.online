function VarControl(vars){var self=this
var vars=vars||{}
vars.x=vars.x||0
vars.y=vars.y||0
vars.title=vars.title||"Title"
vars.value=vars.value||"0"
self.onUpdate=vars.onUpdate||function(value){}
self.minValue=vars.minValue||0
self.maxValue=vars.maxValue||9999999999999
self.increment=vars.increment||1
self.container=Canvas.add(vars.parent,vars.x,vars.y)
var titleField=Texts.spawnBitmap("stroke",{text:vars.title,parent:self.container,y:-60,size:60})
var valueField=Texts.spawnBitmap("stroke",{text:vars.value,parent:self.container,y:50,size:120})
new Button(Sprites.get("minusBtn",{parent:self.container,y:0,x:-400}),minusDown)
new Button(Sprites.get("plusBtn",{parent:self.container,y:0,x:400}),plusDown)
self.reset=function(){}
self.setValue=function(value){self.value=MathUtil.hardLimit(value,self.minValue,self.maxValue)
self.value=Math.round(self.value*10)/10
valueField.text=""+self.value
self.onUpdate(self.value)}
function minusDown(){self.setValue(self.value-self.increment)}
function plusDown(){self.setValue(self.value+self.increment)}
self.reset()}