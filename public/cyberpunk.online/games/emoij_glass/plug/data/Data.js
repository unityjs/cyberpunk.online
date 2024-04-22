var Data=new function(){var self=this
self.config={}
self.state={}
var listeners={}
var cookieName="state1"
self.init=function(config){self.config=config
Ads.init()
config.dataLocation="local"
Players.init()
return self.load()
Connector.init()}
self.set=function(key,value,skipSave){self.state[key]=value
for(var n in listeners[key])listeners[key][n](value)
if(!skipSave)DelayUnique("doSave",doSave,1000)
return value}
self.setMax=function(key,value,inCookie){if(self.get(key)>=value)return
self.set(key,value,inCookie)}
self.get=function(key){if(self.state[key]==null)self.state[key]=0
return self.state[key]}
self.increase=function(key,value,skipSave){self.set(key,self.get(key)+(value||1),skipSave)
return self.get(key)}
self.decrease=function(key,value,inCookie){self.set(key,self.get(key)+(value||-1),inCookie)
return self.get(key)}
self.addListener=function(key,callback){if(!listeners[key])listeners[key]=[]
ArrayUtil.pushUnique(listeners[key],callback)}
self.removeListener=function(key,callback){if(!listeners[key])listeners[key]=[]
ArrayUtil.removeItem(listeners[key],callback)}
self.setCookie=function(sKey,sValue,vEnd,sPath,sDomain,bSecure){var value=escape(sKey)+"="+escape(sValue)
document.cookie=value}
self.getCookie=function(sKey){if(!sKey||!self.hasItem(sKey)){return}
var value=unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)"+escape(sKey).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"),"$1"))
return value}
self.hasItem=function(sKey){return(new RegExp("(?:^|;\\s*)"+escape(sKey).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=")).test(document.cookie)}
self.removeItem=function(sKey){if(!sKey||!this.hasItem(sKey))return
var oExpDate=new Date()
oExpDate.setDate(oExpDate.getDate()-1)
document.cookie=escape(sKey)+"=; expires="+oExpDate.toGMTString()+"; path=/";}
function doSave(){var json
try{json=JSON.stringify(self.state)}catch(err){log("JSON ENCODE FAILED")
return}
if(self.config.dataLocation=="remote")return Connector.saveState(json)
if(self.config.dataLocation=="facebook")return Connector.saveFB(json)
self.setCookie(cookieName,json)}
self.load=function(){self.setState(self.getCookie(cookieName))}
self.setState=function(json){self.state=json?ArrayUtil.parse(json):{}}
self.winGame=function(){self.increase("gamesWon")
self.increase("winStreak")}
self.loseGame=function(){self.set("winStreak",0)}
self.reset=function(){self.state={}
doSave()}}