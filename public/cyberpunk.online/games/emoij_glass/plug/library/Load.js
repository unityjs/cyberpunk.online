var Load=new function(){var self=this
var callbacks={}
var loaded={}
self.webImage=function(url,callback){if(loaded[url])return doWebImageCallback(url,callback)
if(!callbacks[url]){callbacks[url]=[]
new LoadWebImage(url)}
callbacks[url].push(callback)}
self.onLoadedWebImage=function(url){loaded[url]=true
for(var n in callbacks[url])doWebImageCallback(url,callbacks[url][n])}
function doWebImageCallback(url,callback){callback(Sprites.spawn(url))}
self.image=function(imageName,callback,preloadBar){return self.load({images:[imageName]},callback,preloadBar)}
self.soundsprite=function(name,callback,preloadBar){return self.load({soundsprite:[name]},callback,preloadBar)}
self.atlas=function(atlasId,callback,preloadBar){return self.load({atlas:[atlasId]},callback,preloadBar)}
self.video=function(video,callback,preloadBar){return self.load({video:[video]},callback,preloadBar)}
self.webm=function(webm,callback,preloadBar){return self.load({webm:[webm]},callback,preloadBar)}
self.load=function(object,callback,preloadBar){return new LoadInstance(object,callback,preloadBar)}}
function LoadInstance(object,callback,preloadBar){var self=this
self.load=new Phaser.Loader(game)
self.load.crossOrigin='anonymous'
if(preloadBar)self.load.onFileComplete.add(preloadBar.onProgress,self)
self.load.onLoadComplete.addOnce(callback)
for(var n in object.atlas)self.load.atlasJSONHash(object.atlas[n],'assets/atlas/'+object.atlas[n]+'.png','assets/atlas/'+object.atlas[n]+'.json')
for(var n in object.images)self.load.image(object.images[n],'assets/images/'+object.images[n]+".png")
for(var n in object.spine)self.load.spine(object.spine[n],'assets/spine/'+object.spine[n]+".json")
for(var n in object.fonts)self.load.bitmapFont(object.fonts[n],'assets/fonts/'+object.fonts[n]+".png",'assets/fonts/'+object.fonts[n]+".xml")
for(var n in object.sounds)self.load.audio(object.sounds[n],'assets/sounds/'+object.sounds[n]+'.mp3')
for(var n in object.soundsprites)self.load.audiosprite(object.soundsprites[n],['assets/soundsprites/'+object.soundsprites[n]+'.ogg','assets/soundsprites/'+object.soundsprites[n]+'.mp3'],'assets/soundsprites/'+object.soundsprites[n]+'.json')
for(var n in object.video)self.load.video(object.video[n],'assets/video/'+object.video[n]+'.mp4')
for(var n in object.webm)self.load.video(object.webm[n],'assets/webm/'+object.webm[n]+'.webm')
self.load.start()}
function LoadWebImage(url){var self=this
self.load=new Phaser.Loader(game)
self.load.crossOrigin='anonymous'
var hasFailed=false
self.load.onFileError.addOnce(function(e){hasFailed=true})
self.load.onLoadComplete.addOnce(function(){Delay(function(){if(hasFailed)return
Load.onLoadedWebImage(url)},2)})
self.load.image(url,url)
self.load.start()}