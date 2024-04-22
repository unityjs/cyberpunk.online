var Sprites=new function(){var self=this
var pools={}
var _index={}
self.index=function(){var temp=[]
for(var n in Data.config.atlas){var atlasId=Data.config.atlas[n]
var frames=game.cache.getFrameData(atlasId).getFrames()
for(var f in frames){var name=frames[f].name
if(_index[name])console.log(name,"ALREADY EXISTS IN",_index[name])
_index[name]=atlasId}}}
self.getKey=function(atlasId){var key=_index[atlasId]
return key||atlasId}
self.spawn=function(atlasId,x,y,parent,scale){return self.get(atlasId,{x:x,y:y,parent:parent,scale:scale})}
self.getKeyAtlas=function(atlasId){var key=self.getKey(atlasId)
var atlasId=atlasId==key?null:atlasId
return{key:key,atlasId:atlasId}}
self.get=function(atlasId,vars){var vars=vars||{}
var keyAtlas=self.getKeyAtlas(atlasId)
var pool=getPool(atlasId)
var mouseDown=vars.onMouseDown||vars.mouseDown
var isButton=mouseDown
var sprite=pool.shift()||(isButton?new Button_Sprite(atlasId,mouseDown,{id:atlasId,zoomScale:vars.zoomScale}):game.add.sprite(0,0,keyAtlas.key,keyAtlas.atlasId))
sprite.revive()
sprite.atlasId=atlasId
sprite.isButton=isButton
var pos=Data.config.positions[atlasId]||{x:0,y:0}
if(pos.x!=null)sprite.x=pos.x
if(pos.y!=null)sprite.y=pos.y
if(isButton)sprite.enable()
self.applyVars(sprite,vars)
if(StringUtil.contains(atlasId,"outIn")){var s=sprite.scale.x-.1
var sX=sprite.scale.x
sprite.scale.set(s,s)
Animation.scaleInOut(sprite,sX)}
if(StringUtil.contains(atlasId,"inOut")){var s=sprite.scale.x+.1
var sX=sprite.scale.x
sprite.scale.set(s,s)
Animation.scaleInOut(sprite,sX)}
if(StringUtil.contains(atlasId,"blink"))Animation.blinkInOut(sprite)
return sprite}
self.applyVars=function(sprite,vars){var vars=vars||{}
sprite.x=vars.x!=null?vars.x:sprite.x
sprite.y=vars.y!=null?vars.y:sprite.y
var scaleY=vars.scaleY||vars.scale||1
var scaleX=vars.scaleX||vars.scale||1
var anchorX=vars.anchorX!=null?vars.anchorX:.5
var anchorY=vars.anchorY!=null?vars.anchorY:.5
sprite.angle=vars.angle||0
if(vars.rotation)sprite.rotation=vars.rotation
if(sprite.anchor)sprite.anchor.set(anchorX,anchorY)
sprite.scale.set(scaleX,scaleY)
sprite.alpha=vars.alpha!=null?vars.alpha:1
sprite.visible=vars.visible!=null?vars.visible:true
if(vars.color!=null){vars.tint=vars.color
log("vars.color deprecated")}
sprite.blendMode=vars.blendMode||0
sprite.tint=vars.tint!=null?vars.tint:0xFFFFFF
if(vars.text)sprite.text=vars.text
if(vars.width)sprite.width=vars.width
if(vars.height)sprite.height=vars.height
if(vars.fitArea)Align.fit(sprite,vars.fitArea)
var atlasId=sprite.atlasId||""
if(atlasId.indexOf("_FILL")!=-1){sprite.width=Canvas.WIDTH+10
sprite.height=Canvas.HEIGHT+10}
if(atlasId.indexOf("_WIDTH")!=-1)sprite.width=Canvas.WIDTH+50
if(atlasId.indexOf("_HEIGHT")!=-1)sprite.height=Canvas.HEIGHT+50
if(atlasId.indexOf("_RIGHT")!=-1)sprite.x=Canvas.RIGHT-sprite.width/2
if(atlasId.indexOf("_LEFT")!=-1)sprite.x=Canvas.LEFT+sprite.width/2
if(atlasId.indexOf("_TOP")!=-1)sprite.y=Canvas.TOP+sprite.height/2
if(atlasId.indexOf("_BOTTOM")!=-1)sprite.y=Canvas.BOTTOM-sprite.height/2
if(vars.parent)vars.parent.addChild(sprite)
return sprite}
self.getSprites=function(page,label,vars){var sprites={}
var vars=vars||{}
vars.parent=vars.parent||page.container||page
var varsB=ArrayUtil.clone(vars)
varsB.onMouseDown=vars.onMouseDown||page.onPageMouseDown
delete vars.onMouseDown
var atlasIDs=ArrayUtil.searchObjects(Data.config.positions,label)
for(var id in atlasIDs){sprites[id]=self.get(id,StringUtil.contains(id,"_button")?varsB:vars)}
return sprites}
self.cast=function(sprite,atlasId,vars){var keyAtlas=Sprites.getKeyAtlas(atlasId||"blank")
Phaser.Sprite.call(sprite,game,0,0,keyAtlas.key,keyAtlas.atlasId)
sprite.atlasId=atlasId
self.applyVars(sprite,vars)
return sprite}
function getPool(atlasId){if(!pools[atlasId])pools[atlasId]=[]
return pools[atlasId]}
self.remove=function(sprite){if(!sprite)return
if(sprite.onMouseDown)sprite.disable()
self.clear(sprite)
getPool(sprite.atlasId).push(sprite)
sprite.kill()}
self.clear=function(sprite){Depth.removeChild(sprite)
sprite.scale.set(1,1)
sprite.anchor.set(.5,.5)
sprite.alpha=1
sprite.visible=true
sprite.blendMode=0
sprite.angle=0
sprite.mask=null
sprite.x=sprite.y=0
return sprite}}