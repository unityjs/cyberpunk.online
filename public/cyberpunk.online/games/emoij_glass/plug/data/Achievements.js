var Achievements=new function(){var self=this
var types={}
self.data=[]
var achievementData={}
function refresh(){var pending=0
for(var n in self.data)
if(self.data[n].isComplete)pending++
Data.set("achievementsPending",pending,true)}
self.getInGame=function(){var items=ArrayUtil.shuffle(self.data)
for(var n in items)
if(items[n].isInGame&&!items[n].isComplete)return items[n]}
self.fill=function(array){for(var n in array){var data=array[n]
if(Data.get(data.id))continue
var item=new Data_Achievement(data)
getPool(item.type).push(item)}
self.data=[]
achievementData={}
for(var n in types)tryPushType(n)
refresh()}
self.collect=function(item){delete achievementData[item.varName]
ArrayUtil.removeItem(self.data,item)
Data.set(item.id,1)
Tracking.missionAchieved(item.varName)
tryPushType(item.type)
refresh()}
function tryPushType(type){var pool=getPool(type)
for(var n in pool){var item=pool[n]
if(item.varName.indexOf("_Combine")!=-1){if(Shop.isUnlocked(item.varName.split("_")[0]))return pushItem(item)
continue}
return pushItem(item)}}
function pushItem(item){if(!item)return
ArrayUtil.removeItem(getPool(item.type),item)
achievementData[item.varName]=item
self.data.push(item)}
self.increase=function(varName){if(!achievementData[varName])return
self.set(varName,Data.increase(varName))}
self.set=function(varName,value){if(!achievementData[varName])return
Data.set(varName,value)
achievementData[varName].setValue(value)
if(Popups.Achievements)Popups.Achievements.refill()
refresh()}
function getPool(type){if(!types[type])types[type]=[]
return types[type]}
self.refresh=refresh}
function Data_Achievement(vars){var self=this
self.sprite=vars.sprite||"symbol_thropy"
self.id=vars.id
self.type=vars.type
self.title=vars.title
self.description=vars.description
self.objective=vars.objective
self.reward=vars.reward
self.xp=vars.xp
self.isReset=vars.isReset
self.varName=vars.varName
self.isComplete=false
self.isInGame=vars.isInGame
var hasShown=false
self.setValue=function(value){self.value=value
Data.set(self.varName,value)
self.refresh()
if(!QuickMatch.isActive&&Engine.isPlaying&&!hasShown&&self.isInGame&&self.isComplete){hasShown=true
Displayer_Achievement.show(self)}}
self.refresh=function(){self.isComplete=self.value>=self.objective}
self.setValue(Data.get(self.varName))}