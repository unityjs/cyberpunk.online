var Levels=new function(){var self=this
var types={}
var data=self.data=[]
self.itemsPerPage=10
self.current=Data.get("level")
var pages=self.pages=[]
var page=self.page=null
self.currentPage=Data.get("page")
self.level=null
self.fill=function(array){self.l_l=StringUtil.toArray(Data.get("l_l"),true)
self.l_h=StringUtil.toArray(Data.get("l_h"),true)
self.l_s=StringUtil.toArray(Data.get("l_s"),true)
data=self.data=[]
var array=array||Data.config.levels
for(var n in array){var vars={isLocked:n>0,id:parseInt(n),data:array[n]}
data.push(new Data_Level(vars))}
pages=self.pages=[]
newPage()
for(var n in data){if(page.data.length>=self.itemsPerPage)newPage()
page.push(data[n])}
function newPage(){page=self.page=new LevelPage()}
self.currentPage=0
Data.set("page",self.currentPage)
self.refresh()
self.set(Data.get("level"))}
self.next=function(){return self.set(self.current+1)}
self.unlockNext=function(){var item=self.data[self.current+1]
if(!item)return
item.unlock()
Data.set("level",self.current+1)}
self.set=function(value){self.current=value!=null?value:self.current
while(self.current>=self.data.length)self.current-=self.data.length
Data.set("level",self.current)
self.level=self.data[self.current]
self.level.unlock()
return self.level}
self.setLast=function(){self.set(Data.get("level"))}
self.setLastUnlocked=function(){for(var n=self.data.length-1;n>=0;n--)
if(!self.data[n].isLocked)return self.set(n)}
self.get=function(value){return self.data[value!=null?value:self.current]}
self.getPage=function(id){self.currentPage=MathUtil.hardLimit(id||self.currentPage,0,self.pages.length-1)
return self.pages[self.currentPage]}
self.refresh=function(){self.totalStars=0
self.stars=0
for(var n in pages)pages[n].refresh()
Stars.refresh()
return pages}
self.save=function(){var l_l=""
var l_h=""
var l_s=""
for(var n in data){var level=data[n]
l_l+=level.isLocked
l_h+=level.hint
l_s+=level.stars}
Data.set("l_l",l_l)
Data.set("l_h",l_h)
Data.set("l_s",l_s)}}
function LevelPage(){var self=this
self.id=Levels.pages.length
self.totalStars=0
self.stars=0
self.length=0
self.unlocked=0
self.isLocked=true;self.unlocksAt=24*self.id
Levels.pages.push(self)
var data=self.data=[]
self.push=function(level){self.data.push(level)}
self.get=function(id){return self.data[id]}
self.refresh=function(){self.length=data.length
self.totalStars=self.length*3
self.stars=0
self.unlocked=0
self.sprite=data[0].sprite
for(var n in data){var level=data[n]
self.stars+=level.stars
if(!level.isLocked)self.unlocked++}
Levels.stars+=self.stars
Levels.totalStars+=self.totalStars
self.isLocked=self.unlocksAt>Levels.totalStars}}
function Data_Level(vars){var self=this
self.id=parseInt(vars.id)
self.data=vars.data
self.stars=Levels.l_s[self.id]||0
self.isLocked=self.stars?0:1
if(self.id==0)self.isLocked=0
self.sprite=vars.sprite||"Level ("+(self.id+1)+")"
self.hint=Levels.l_h[self.id]||0
self.setStars=function(value){log("SET STARS")
self.stars=value
Levels.save()}
self.unlock=function(){self.isLocked=0
Levels.save()}
self.showHint=function(){self.hint=1
Levels.save()
Hints.show()}}