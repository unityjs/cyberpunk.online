var Shop=new function(){var self=this
self.data=[]
self.shopData=[]
self.refresh=function(){self.unlocked=0
var pending=0
for(var n in self.data){var item=self.data[n]
if(item.refresh!=null)item.refresh()
if(!item.isLocked)self.unlocked++
if(item.canPurchase)pending++}
Data.set("shopPending",pending,true)
Achievements.set("unlockedShop",self.unlocked)}
self.isUnlocked=function(id){var item=self.shopData[id]
return item&&item.isUnlocked}
self.fill=function(array){self.data=array
self.refresh()}
self.increaseNemesis=function(key,inCookie){Data.increase(key+"_nemesis",1,inCookie)}
self.increaseUsed=function(key,inCookie){Data.increase(key+"_used",1,inCookie)}
self.getMostUsed=function(){return getMostOfOne("_used")}
self.getNemesis=function(){return getMostOfOne("_nemesis")}
function getMostOfOne(mod){var chosen
var max=0
for(var n in self.data){var title=self.data[n].title
var value=Data.get(title+mod)
if(value<=max)continue
max=value
chosen=title}
return chosen}
self.purchaseRandomLocked=function(ignoreCounter){if(!ignoreCounter)self.searchCount=0
self.searchCount++
var item=ArrayUtil.getRandomItem(self.data)
if(item.isLocked||self.searchCount>=100){item.purchase()
return item}
return self.purchaseRandomLocked(true)}
self.purchaseRandomUnlocked=function(ignoreCounter){if(!ignoreCounter)self.searchCount=0
self.searchCount++
var item=ArrayUtil.getRandomItem(self.data)
if(!item.isLocked||self.searchCount>=100){item.purchase()
return item}
return self.purchaseRandomUnlocked(true)}}
function Data_CardShop(vars){var self=this
self.id=vars.id||vars.sprite
self.sprite=vars.sprite
self.title=vars.title||" "
self.bio=vars.bio||" "
self.continent=vars.continent||" "
self.habitat=vars.habitat||" "
self.class=vars.class||" "
self.price=vars.price||" "
self.score=vars.score||" "
self.xp=vars.xp||" "
self.rarity=vars.rarity||" "
self.isLocked=vars.isLocked
self.isUnlocked=vars.isUnlocked
if(self.isUnlocked)self.isLocked=false
if(Data.get(self.id+"_u")){self.isLocked=false
self.isUnlocked=true}
self.level=vars.level
self.amount=Data.get(self.id)||1
self.levelUp=vars.levelUp
self.reachedMax=false
self.cardColor=vars.cardColor||0xFFFFFF
self.canPurchase
self.refresh=function(){self.canPurchase=self.isLocked&&self.unlocksAt<=Data.get("userLevel")
for(var n in self.levelUp){var max=self.levelUp[n]
if(self.amount<max){self.level=parseInt(n)
self.max=max
self.min=self.levelUp[parseInt(n)-1]
return}}
self.level=self.levelUp.length
self.reachedMax=true}
self.purchase=function(){if(!self.isLocked)return self.increase()
self.unlock()
self.isNew=true
Tracking.shopUnlocked(self.id)}
self.increase=function(value){self.unlock()
self.amount=MathUtil.hardLimit(self.amount+(value||1),1,self.levelUp[self.levelUp.length-1])
Data.set(self.id,self.amount)
self.refresh()}
self.unlock=function(){if(self.isUnlocked)return
self.isLocked=false
self.isUnlocked=true
Data.set(self.id+"_u",1)}
self.refresh()}
function Data_ShopItem(vars){var self=this
ArrayUtil.extract(vars,self)
self.id=StringUtil.simplify(vars.id||vars.sprite)
self.sprite=vars.sprite
self.price=vars.price
self.isLocked=true
self.isUnlocked=vars.isUnlocked!=null?vars.isUnlocked:false
self.title=vars.title||" "
self.amount=vars.amount||Data.get(self.id)
Data.set(self.id,self.amount)
if(self.amount){self.isLocked=false
self.isUnlocked=true}
self.canPurchase
self.refresh=function(){}
self.purchase=function(){if(!self.isLocked)return
self.unlock()
self.isNew=true
Tracking.shopUnlocked(self.id)}
self.unlock=function(){if(self.isUnlocked)return
self.isLocked=false
self.isUnlocked=true
Data.set(self.id,1)}}