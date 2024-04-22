var Coins
function Displayer_Coins(vars){var vars=vars||{}
vars.x=vars.x||Canvas.RIGHT-width/2-60
vars.y=vars.y||Canvas.TOP+90
vars.parent=vars.parent||Canvas.aboveall
vars.atlasId=vars.atlasId||"blank"
var parent=vars.parent
var self=Coins=Sprites.cast(this,vars.atlasId,vars)
self.onMouseDown=vars.onMouseDown||function(){log("onMouseDown")}
var width=self.width
self.x=vars.x
var button=new Button_Sprite("coin",onDown,{x:0,y:0,parent:self,zoomScale:1})
var textField=self.textField=Texts.spawnBitmap(vars.font||"stroke",{y:0,x:70,size:60,anchorX:0,tint:0x000000})
self.addChild(textField)
self.coins=Data.get("coins")
var coin=Sprites.get("Plus_Btn",{x:35,y:-35,parent:button})
var animateValue=0
var mypos={x:self.x,y:self.y}
self.reset=function(){animateValue=0
self.setCoins(self.coins)}
self.addCoins=function(value){Animation.bounceScaleFloor(self)
self.setCoins(self.coins+parseInt(value))}
self.increase=self.addCoins
self.tryPurchase=function(price){if(price<=self.coins){self.addCoins(-price)
return true}
self.shake()
return false}
self.setCoins=function(value){self.coins=MathUtil.hardLimit(parseInt(value),0)
Data.set("coins",self.coins)
render()
Tick.start(update)}
self.hide=function(){self.visible=false}
self.show=function(){self.visible=true
Depth.toFront(self)}
self.tryPurchase=function(price){self.toFront()
if(price<=self.coins){self.addCoins(-price)
return true}
self.shake()
return false}
self.shake=function(){Animation.shake(self,mypos,10,10)}
function onDown(){HUHU_showRewardedVideoAd(()=>{self.increase(100);Tick.stop(updateTingle)},()=>{promptMessage("Failed to get the reward, please watch the ads to the end.");});}
function update(){animateValue+=(self.coins-animateValue)/4
render()
if(Math.round(animateValue)==self.coins)Tick.stop(update)}
function render(){textField.text=MathUtil.commas(Math.round(animateValue))
while(textField.width>175)textField.scale.set(textField.scale.x*.9)}
self.collect=function(position,amount,tint,inPlace){var amount=parseInt(amount)
Particles.collect(position,{texture:"coin",tint:0xFFFFFF,container:Canvas.aboveall,blendMode:0,scale:1,follow:{x:self.x+width/4,y:self.y},gravity:0})
textField.tint=tint
Delay(function(){self.increase(amount)},1000)
if(!inPlace)self.toFront()}
self.toFront=function(){return
Canvas.aboveall.addChild(self)
Delay(function(){parent.addChild(self)},3000)}
var count=0
function updateTingle(){if(--count>0)return
count=30
self.parent.addChild(Particles.shockwave({x:self.x,y:self.y},{texture:"condense",scale:.5,tint:0xfcf528}))}
self.enable=function(){}
self.disable=function(){}
self.reset()}
Pool.register("Displayer_Coins",Displayer_Coins,0,Phaser.Sprite)