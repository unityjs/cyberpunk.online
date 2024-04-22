function Rect(x,y,width,height){var self=this
var x=x||0
var y=y||0
var width=width||100
var height=height||100
self.hitTestCirc=function(obj,radius){var radius=radius||0
if(obj.x+radius<self.left)return false
if(obj.x-radius>self.right)return false
if(obj.y+radius<self.y-self.height/2)return false
if(obj.y-radius>self.y+self.height/2)return false
return{x:self.centerX-obj.x,y:self.centerY-obj.y}}
self.hitTestPoint=function(obj){return self.hitTestCirc(obj)}
self.hitTestRect=function(rect){return MathUtil.isBetweenAABB(self.top,self.bottom,rect.top,rect.bottom,self.left,self.right,rect.left,rect.right)}
self.isBetweenHorizontal=function(rect){return MathUtil.isBetweenAB(self.left,self.right,rect.left,rect.right)}
self.isBetweenVertical=function(rect){return MathUtil.isBetweenAB(self.top,self.bottom,rect.top,rect.bottom)}
self.collideHorizontal=function(rect){return self.collideLeft(rect)||self.collideRight(rect)}
self.collideFloor=function(rect){if(!MathUtil.isBetween(self.bottom,rect.top,rect.bottom)||!self.isBetweenHorizontal(rect))return
self.update(null,rect.top-self.halfHeight)
return true}
self.collideRoof=function(rect){if(!MathUtil.isBetween(self.top,rect.top,rect.bottom)||!self.isBetweenHorizontal(rect))return
self.update(null,rect.bottom+self.halfHeight)
return true}
self.collideRight=function(rect){if(!MathUtil.isBetween(self.right,rect.left,rect.right)||!self.isBetweenVertical(rect))return
self.update(rect.left-self.halfWidth)
return true}
self.collideLeft=function(rect){if(!MathUtil.isBetween(self.left,rect.left,rect.right)||!self.isBetweenVertical(rect))return
self.update(rect.right+self.halfWidth)
return true}
self.collideLeftValue=function(value,ignore){if(self.left>value)return
if(!ignore)self.update(value+self.halfWidth)
return true}
self.collideRightValue=function(value,ignore){if(self.right<value)return
if(!ignore)self.update(value-self.halfWidth)
return true}
self.collideTopValue=function(value,ignore){if(self.top>value)return
if(!ignore)self.update(null,value+self.halfHeight)
return true}
self.collideBottomValue=function(value,ignore){if(self.bottom<value)return
if(!ignore)self.update(null,value-self.halfHeight)
return true}
self.constrainHorizontal=function(rect,ignore){return self.constrainLeft(rect,ignore)||self.constrainRight(rect,ignore)}
self.constrainVertical=function(rect,ignore){return self.constrainTop(rect,ignore)||self.constrainBottom(rect,ignore)}
self.constrainLeft=function(rect,ignore){return self.collideLeftValue(rect.left,ignore)}
self.constrainRight=function(rect,ignore){return self.collideRightValue(rect.right,ignore)}
self.constrainTop=function(rect,ignore){return self.collideTopValue(rect.top,ignore)}
self.constrainBottom=function(rect,ignore){return self.collideBottomValue(rect.bottom,ignore)}
self.scanPoints=function(array){var left=99999999999999999999
var right=-99999999999999999999
var top=99999999999999999999
var bottom=-99999999999999999999
for(var n in array){var po=array[n]
if(po.x<left)left=po.x
if(po.y<top)top=po.y
if(po.x>right)right=po.x
if(po.y>bottom)bottom=po.y}
self.width=right-left
self.height=bottom-top
self.halfWidth=self.width/2
self.halfHeight=self.height/2
self.x=left+self.halfWidth
self.y=top+self.halfHeight
self.update()
return self}
self.update=function(x,y,width,height){if(x!=null)self.x=x
if(y!=null)self.y=y
if(width!=null)self.width=width
if(height!=null)self.height=height
self.halfWidth=self.width/2
self.halfHeight=self.height/2
self.top=self.y-self.halfHeight
self.bottom=self.y+self.halfHeight
self.left=self.x-self.halfWidth
self.right=self.x+self.halfWidth
self.topLeft={x:self.left,y:self.top}
self.topRight={x:self.right,y:self.top}
self.bottomLeft={x:self.left,y:self.bottom}
self.bottomRight={x:self.right,y:self.bottom}
self.corners=[self.topLeft,self.topRight,self.bottomRight,self.bottomLeft]}
self.getRandomCorner=function(){return ArrayUtil.getRandomItem(self.corners)}
self.update(x,y,width,height)}