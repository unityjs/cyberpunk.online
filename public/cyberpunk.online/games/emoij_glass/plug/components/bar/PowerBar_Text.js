function PowerBar_Text(vars){var vars=vars||{}
var self=this.container=Canvas.cast(this,vars.parent,vars.x,vars.y)
var sinCount=0
if(vars.base)self.base=Sprites.get(vars.base,{parent:self,x:0,y:0,tint:vars.baseColor})
var bar=self.bar=Sprites.get(vars.bar,{anchorX:0,parent:self,y:0})
bar.x=-bar.width/2
var head
if(vars.head){self.tail=Sprites.get(vars.head,{parent:self,x:bar.x,y:0})
self.head=head=Sprites.get(vars.head,{parent:self,x:0,y:0})}
if(vars.front)Sprites.get(vars.front,{parent:self,x:0,y:0})
self.percent=0
var animatePercent=0
var textField=self.textField=Texts.spawnBitmap("stroke",{parent:self,y:-1,size:35,text:"1/100",tint:0xFFFFFF})
self.min=0
self.max=100
self.amount=0
self.setAmount=function(value,min,max){if(min)self.min=min
if(max)self.max=max
self.amount=MathUtil.hardLimit(value,self.min,self.max)
self.setPercent((self.amount-self.min)*100/(self.max-self.min))}
self.reset=function(value){animatePercent=MathUtil.hardLimit(value||0,0,100)
self.setPercent(animatePercent,true)}
self.setPercent=function(value,autoReach){self.percent=MathUtil.hardLimit(value,0,100)
if(autoReach)return self.reach()
update()
Tick.start(update)}
function update(){animatePercent+=(self.percent-animatePercent)/2
if(Math.round(animatePercent)>=100){sinCount+=.2
bar.alpha=.5+Math.sin(sinCount)*.5
return}
bar.alpha=1
if(Math.round(animatePercent)==self.percent)return self.reach()
render()}
self.reach=function(){animatePercent=self.percent
Tick.stop(update)
render()}
function render(){bar.scale.set(MathUtil.hardLimit(animatePercent/100+.05,0,1),1)
if(head)head.x=bar.x+bar.width
textField.text=self.amount+"/"+self.max}
self.hide=function(){Animation.fadeOut(self,250)}
self.show=function(){Animation.fadeIn(self,250)}}
Pool.register("PowerBar_Text",PowerBar_Text,0,Phaser.Group)