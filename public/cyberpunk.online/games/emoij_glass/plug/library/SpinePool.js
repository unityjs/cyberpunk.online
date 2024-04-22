function mySpinePool(){var list={}
var spineIds=[]
var self=this
self.spawn=function(symbolId,animation){var spine=getPool(symbolId).shift()||game.add.spine(0,0,symbolId)
Depth.removeChild(spine)
spine.setAnimationByName(0,animation||'animation',false)
spine.visible=true
spine.alpha=1
spine.scale.set(1,1)
spine.setToSetupPose()
return spine}
self.remove=function(symbolId,spine){getPool(symbolId).push(spine)
spine.visible=false
if(spine.parent)spine.parent.removeChild(spine)}
function getPool(symbolId){if(!list[symbolId])list[symbolId]=[]
return list[symbolId]}
self.preload=function(symbolId){spineIds.push(symbolId)}
self.start=function(){for(var n in spineIds){var symbolId=spineIds[n]
self.remove(symbolId,self.spawn(symbolId))}}}
var SpinePool=new mySpinePool()