var Utils=new function(){var self=this
self.setPrototype=function(myConstructor,myParentClass){myConstructor.prototype=Object.create(myParentClass.prototype)
myConstructor.prototype.constructor=myConstructor}}
function ga(var1,var2){}
var webFontsActive
var WebFontConfig={active:function(){webFontsActive=true},google:{families:["Roboto"]}}
function getParameterByName(name,url){if(!url)url=window.location.href;name=name.replace(/[\[\]]/g,"\\$&");var regex=new RegExp("[?&]"+name+"(=([^&#]*)|&|#|$)"),results=regex.exec(url);if(!results)return null;if(!results[2])return '';return decodeURIComponent(results[2].replace(/\+/g," "));}
function loadAtlases(labels){for(var n in labels){var label=labels[n]
game.load.atlasJSONHash(label,'assets/atlas/'+label+'.png','assets/atlas/'+label+'.json')}}
function debuglog(msg){window.trace(msg)}
function removeAllEvents(){game.tweens.removeAll()
game.time.events.removeAll()}