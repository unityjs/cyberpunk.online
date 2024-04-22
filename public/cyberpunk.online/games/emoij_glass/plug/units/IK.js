function IKNode(){var self=this
this.x=0
this.y=0
self.speedX=0
self.speedY=0
self.fixed=false
self.tick=function(){if(!self.fixed){self.x+=self.speedX*=.93
self.y+=self.speedY*=.93
self.speedY+=.8}}}
function IKLine(a,b,len,thickness){var self=this
self.a=a
self.b=b
var length=len*hoopScale
var image=game.add.sprite(0,0,'Line');image.anchor.set(0,.5)
hoop.addChild(image)
var oWidth=180
self.tick=function(){var ox=a.x-b.x
var oy=a.y-b.y
var distance=Math.sqrt(ox*ox+oy*oy)
var angle=Math.atan2(oy,ox)
if(distance>length){var adder=(distance-length)/8
a.speedX-=Math.cos(angle)*adder
a.speedY-=Math.sin(angle)*adder
b.speedX+=Math.cos(angle)*adder
b.speedY+=Math.sin(angle)*adder}
image.x=b.x
image.y=b.y
image.angle=angle*57.2958;image.scale.set(distance/oWidth,.5)}}
function IKSet(container){var self=this;var lines=[];var nodes=[];self.getNode=function(x,y){var node=new IKNode()
node.x=x*hoopScale;node.y=y*hoopScale;nodes.push(node)
return node;}
self.getLine=function(a,b,length,thickness){var line=new IKLine(a,b,length,thickness)
lines.push(line)
return line}
self.tick=function(){for(var a=0;a<nodes.length;a++){nodes[a].tick()}
for(var a=0;a<lines.length;a++){lines[a].tick()}}}