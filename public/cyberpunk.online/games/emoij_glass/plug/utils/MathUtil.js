var MathUtil=new function(){var self=this
self.hipotenusa=function(pointA,pointB){var pointB=pointB||{x:0,y:0}
var dx=pointB.x-pointA.x
var dy=pointB.y-pointA.y
return Math.sqrt(dx*dx+dy*dy)}
self.hipotenusaZ=function(pointA,pointB){var dx=pointB.x-pointA.x
var dz=pointB.z-pointA.z
return Math.sqrt(dx*dx+dz*dz)}
self.cycle=function(value,max,min,incremental){var incremental=incremental||1
var min=min||0
var max=(max||100)
var value=value+incremental
while(value>max)value-=max+incremental
while(value<min)value+=max+incremental
return value}
self.getSinCos=function(pointA,pointB){var dx=pointB.x-pointA.x
var dy=pointB.y-pointA.y
var h=Math.sqrt(dx*dx+dy*dy)
var cos=dx/h
var sin=dy/h
return{sin:sin,cos:cos}}
self.aroundRadius=function(radius,radians){return{x:radius*Math.cos(radians),y:radius*Math.sin(radians)}}
self.ceil=function(number,max){return number>max?max:number}
self.getPercent=function(number,max){return self.hardLimit(number*100/max,0,100)}
self.hardLimit=function(number,min,max){return self.clamp(number,max,min)}
self.clamp=function(number,max,min){var min=min||0
if(number<min)return min
if(number>max)return max
return number}
self.floor=function(number,min){return number<min?min:number}
self.commas=function(x){return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ");}
self.fillZero=function(x){return self.commas(x>=10?x:"0"+x)}
self.middlePoint=function(pointA,pointB){var x=pointA.x+(pointB.x-pointA.x)/2
var y=pointA.y+(pointB.y-pointA.y)/2
return{x:x,y:y}}
self.getRotation=function(container,lookat){var container=container||{x:0,y:0}
var lookat=lookat||{x:0,y:0}
return Math.atan2(lookat.y-container.y,lookat.x-container.x)}
self.radian2Degree=function(radian){var degree=radian*180/3.1459
degree+=90
if(degree<0)degree=360+degree
return degree}
self.degreeToRadians=function(degree){return(degree||0)*0.0174533}
self.radiansToDegree=function(radian){return radian/0.0174533}
self.pointToIso=function(from,to){var to=to||{}
to.x=(from.x-from.y)*.5
to.y=(from.x+from.y)*.289
return to}
self.isoToPoint=function(iso,normal){var normal=normal||{}
normal.x=(iso.y/.289+iso.x/.5)/2
normal.y=(iso.y/.289-iso.x/.5)/2
return normal}
self.getclosestPoint=function(lx1,ly1,lx2,ly2,px,py){var oy=ly2-ly1;var ox=lx1-lx2;var det=oy*oy+ox*ox;if(det==0)return undefined
var C1=oy*lx1+ox*ly1;var C2=-ox*px+oy*py;return[(oy*C1-ox*C2)/det,(oy*C2+ox*C1)/det]}
self.springMax=function(pointA,pointB,dist,friction){var friction=friction||10
var dx=pointB.x-pointA.x
var dy=pointB.y-pointA.y
var h=Math.sqrt(dx*dx+dy*dy)
if(h>dist)return false
var spring=(h-dist)/h
pointA.x+=dx*spring/friction
pointA.y+=dy*spring/friction
return{x:dx*spring,y:dy*spring}}
self.springMin=function(pointA,pointB,dist,friction){var friction=friction||1
var dx=pointB.x-pointA.x
var dy=pointB.y-pointA.y
var h=Math.sqrt(dx*dx+dy*dy)
if(h<dist)return false
var spring=(h-dist)/h
pointA.x+=dx*spring/friction
pointA.y+=dy*spring/friction
return{x:dx*spring,y:dy*spring}}
self.springMinValue=function(A,B,dist,friction){var friction=friction||1
var d=B-A
var h=Math.sqrt(d*d*2)
if(h<dist)return A
return A+d*((h-dist)/h)/friction}
self.springMaxValue=function(A,B,dist,friction){var friction=friction||1
var d=B-A
var h=Math.sqrt(d*d*2)
if(h>dist)return A
return A+d*((h-dist)/h)/friction}
self.higherValue=function(a,b){return a>b?a:b}
self.lowerValue=function(a,b){return a<b?a:b}
self.tsunami=function(pointA,pointB,aura){var aura=aura||500
var dx=pointB.x-pointA.x
var dy=pointB.y-pointA.y
var h=Math.sqrt(dx*dx+dy*dy)
if(h==0)return false
if(h>aura)return false
var cos=dx/h
var sin=dy/h
dx=pointB.x
dy=pointB.y
if(h<aura/2){dx+=cos*h/2
dy+=sin*h/2
return{x:dx,y:dy}}
dx+=cos*(aura-h)/2
dy+=sin*(aura-h)/2
return{x:dx,y:dy}}
self.isBetween=function(value,min,max){return!(value<min||value>max)}
self.isBetweenAB=function(aMin,aMax,bMin,bMax){return!(aMax<bMin||aMin>bMax)}
self.isBetweenAABB=function(aMin,aMax,bMin,bMax,cMin,cMax,dMin,dMax){return!(aMax<bMin||aMin>bMax||cMax<dMin||cMin>dMax)}
self.getClosest=function(array,to){var to=to||{x:0,y:0}
var closest=null
var distance=9999999999999
for(var n in array){var point=array[n]
var dist=self.hipotenusa(point,to)
if(dist>distance)continue
distance=dist
closest=point}
return closest}
self.roundDecimal=function(value,decimals){var decimals=decimals||10
return Math.round(value*decimals)/decimals}}