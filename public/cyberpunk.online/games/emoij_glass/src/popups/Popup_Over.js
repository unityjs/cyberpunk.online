function Popup_Over(){var self=Popups.add("Over",{onMouseDown:onMouseDown,animation:"pan",animationOut:"cut",onShow:onShow,onHide:onHide,update:update})
var sprites=self.sprites
var Over_title=sprites.Over_title
var Over_whichfriend_button=sprites.Over_whichfriend_button
var Over_freehint_button=sprites.Over_freehint_button
var Over_freeemoji_button=sprites.Over_freeemoji_button
var Over_spin_button=sprites.Over_spin_button
var Over_next_button=sprites.Over_next_button
var Over_share_button=sprites.Over_share_button
var Over_social_button=sprites.Over_social_button
var ad_symbol=Sprites.get("ad_symbol",{parent:Over_freeemoji_button})
var buttonBlocker=new Button_SpriteSimple(null,function(){},{width:Canvas.WIDTH,height:Canvas.HEIGHT,parent:self})
var selectedButton
Over_share_button.x=Canvas.LEFT+40
var Over_store_button=sprites.Over_store_button
Over_store_button.x=Canvas.RIGHT
Over_store_button.y=Over_social_button.y
new BigStars({parent:self,y:Over_title.y-230})
var winCount=0
var sinCount=0
var interstitialCount=0
var hasClicked
var selectedEmoji
var emojiSprite
var emojiField=Texts.spawnBitmap("stroke",{y:-80,x:220,size:45,text:"100",parent:Over_freeemoji_button})
var scoreField=Texts.spawnBitmap("stroke",{parent:self,y:-105,x:0,size:50,tint:0x000000})
var willShowPrize
Sprites.get("discount_symbol",{x:emojiField.x,y:emojiField.y,parent:Over_freeemoji_button})
var wallEmoji
var wallContainer=ImageUtil.newSprite()
wallContainer.x=Canvas.LEFT
wallContainer.y=Canvas.TOP
var wallScreenshot
wallContainer.anchor.set(0,0)
Sprites.get("thisyou",{x:0,y:0,anchorX:0,anchorY:0,parent:wallContainer})
function update(){sprites.Over_halo.angle+=1
if(!emojiSprite)return
sinCount+=.2
emojiSprite.angle=Math.sin(sinCount)*10}
function onHide(){BigStars.hide()
Over_whichfriend_button.hide()
Over_freehint_button.hide()
Over_freeemoji_button.hide()
Over_spin_button.hide()
Over_social_button.hide()
Over_next_button.hide()
Over_store_button.hide()
Over_share_button.hide()
buttonBlocker.disable()
Over_title.alpha=0
Depth.removeChild(wallContainer)
if(emojiSprite)Sprites.remove(emojiSprite)
emojiSprite=null
if(wallEmoji)Sprites.remove(wallEmoji)
wallEmoji=null
if(wallScreenshot)wallScreenshot.destroy()
wallScreenshot=null}
function onShow(){Engine.exitGame()
onHide()
willShowPrize=Levels.get().id==0&&Levels.data[1].isLocked
Levels.unlockNext()
hasClicked=false
if(willShowPrize)buttonBlocker.enable()
Levels.refresh()
var stars=Levels.get().stars
Data.increase("score",stars)
BigStars.show(stars)
scoreField.text="SCORE "+Data.get("score");sprites.Over_halo.visible=stars>1
Animation.fadeIn(Over_title)
Animation.bounceScaleFloor(Over_title)
setButton()
Connector.gameOver()
Delay(function(){if(selectedButton){selectedButton.enable()
Animation.fadeIn(selectedButton)}
Delay(function(){Over_social_button.enable()
Animation.fadeIn(Over_social_button)
Delay(function(){Over_next_button.enable()
Animation.fadeIn(Over_next_button)
Delay(function(){Over_share_button.enable()
Animation.fadeIn(Over_share_button)
var X=Over_share_button.x
Over_share_button.x-=300
Animation.to(Over_share_button,{x:X})
Delay(function(){Over_store_button.enable()
Animation.fadeIn(Over_store_button)
var X=Over_store_button.x
Over_store_button.x+=300
Animation.to(Over_store_button,{x:X})
if(!willShowPrize)return
Delay(function(){Animation.fadeOut(Over_spin_button)
buttonBlocker.disable()
Popups.overlay("Claim")},1000)},100)},100)},50)},150)},stars*500)}
function onMouseDown(button){log("BUTTON PRESSED",id)
var id=button.atlasId
if(id=="Over_spin_button"){if(Levels.get().id==1)return Popups.overlay("FortuneWheel",{autoSpin:true})
Tracking.wheelSpinOffer()
Ads.playRewarded(function(bool){if(bool)Popups.overlay("FortuneWheel",{autoSpin:true})})
return}
if(id=="Over_next_button"){if(++interstitialCount>=4){interstitialCount=0
Ads.play("Interstitial")}
Levels.next()
return Engine.startGame()}
if(id=="Over_store_button")return Popups.show("Shop")
hasClicked=true
Cancel("twingle")
if(id=="Over_whichfriend_button"){console.log("ON CWHICH Over_whichfriend_button")
Tracking.whichFriendOffer()
wallEmoji=Sprites.get(selectedEmoji.sprite,{x:300,y:200,scale:1.5,parent:wallContainer})
Canvas.underall.addChild(wallContainer)
Connector.changeContextTo(null,function(){Particles.explodeObstacle(button,{parent:Canvas.aboveall,texture:"star"})
selectedEmoji.unlock()
animateSelectedButtonOut()
wallScreenshot.drawFull(wallContainer)
Particles.bubbles({texture:selectedEmoji.sprite})
Delay(function(){Messages.looksLikeEmoji(wallScreenshot.canvas.toDataURL('image/jpeg'))},40)})
return}
if(id=="Over_share_button"){console.log("share");return;}
if(id=="Over_social_button"){return}
if(id=="Over_freeemoji_button"){Tracking.emojiUnlockOffer()
Ads.playRewarded(function(bool){if(!bool)return
selectedEmoji.unlock()
animateSelectedButtonOut()
Particles.bubbles({texture:selectedEmoji.sprite})})
return}
if(id=="Over_freehint_button"){Tracking.freeHintOffer()
Ads.playRewarded(function(bool){if(!bool)return;Clues.collect(button,1)
animateSelectedButtonOut()})
return}}
function setButton(){selectedButton=null
var id=Levels.get().id
if(id==0||id==3||id==4)return setSpinButton()
if(id==1)return setFreeEmojiButton()
if(id==2)return setFreeHintButton()
if(id==5)return setWhichFriendButton()
if(++winCount<3)return setSpinButton()
winCount=0
ArrayUtil.getRandomItem([setFreeEmojiButton,setFreeHintButton,setWhichFriendButton])()}
function animateSelectedButtonOut(){selectedButton.rotation=0
selectedButton.disable()
Particles.explodeObstacle(selectedButton,{parent:Canvas.aboveall,texture:"star",scale:1})
Delay(function(){Animation.fadeOut(selectedButton)},60)}
function setSpinButton(){if(Levels.get().id!=1&&!Ads.getRewarded())return
selectedButton=Over_spin_button}
function setFreeEmojiButton(){if(!Ads.getRewarded())return
getEmoji()
selectedButton=Over_freeemoji_button
emojiField.text=StringUtil.commas(selectedEmoji.price)
emojiSprite=Sprites.get(selectedEmoji.sprite,{x:-230,y:-9,scale:1.5,parent:selectedButton})
ad_symbol.x=emojiSprite.x+emojiSprite.width*.37
ad_symbol.y=emojiSprite.y+emojiSprite.height*.37
Depth.toFront(ad_symbol)
startTwingle()}
function setWhichFriendButton(){getEmoji()
wallScreenshot=game.add.bitmapData(600,314)
selectedButton=Over_whichfriend_button
emojiSprite=Sprites.get(selectedEmoji.sprite,{x:245,y:-24,scale:1.5,parent:selectedButton})
startTwingle()}
function getEmoji(){var found
for(var n in Data.emoticons){var item=Data.emoticons[n]
if(item.isUnlocked||item.price<200)continue
found=item
break}
selectedEmoji=found||ArrayUtil.getRandomItem(Data.emoticons)
return}
function setFreeHintButton(){if(!Ads.getRewarded())return
selectedButton=Over_freehint_button
startTwingle()}
function startTwingle(){}}
Pool.register("Popup_Over",Popup_Over)
var BigStars=function(vars){var vars=vars||{}
var self=BigStars=Canvas.cast(this,vars.parent,vars.x,vars.y)
var stars=[]
stars.push(new BigStar({x:-220,y:0,parent:self,id:0}))
stars.push(new BigStar({x:0,y:-150,parent:self,id:1}))
stars.push(new BigStar({x:220,y:0,parent:self,id:2}))
self.show=function(number){for(var n in stars)
if(n<number)stars[n].show()}
self.hide=function(){for(var n in stars)stars[n].hide()}}
Pool.registerCanvas("BigStars",BigStars)
function BigStar(vars){var vars=vars||{}
var self=Canvas.cast(this,vars.parent,vars.x,vars.y)
var sprite=Sprites.get("starBig",{parent:self,x:0,y:0})
var stroke=Sprites.get("starBigStroke",{parent:self,x:0,y:0})
var id=vars.id
self.show=function(){self.hide()
Delay(function(){sprite.visible=true
self.parent.addChild(Particles.shockwave({x:self.x,y:self.y},{texture:"starBig",tint:0xFFFFFF,scale:2,angle:0}))
Delay(function(){Sounds.play("star")
Animation.bounceScaleFloor(self)
self.parent.addChild(Particles.shockwave({x:self.x,y:self.y},{texture:"starBig",tint:0xFFFFFF,scale:2,angle:0}))},250)
self.scale.set(1.6)
Animation.scaleTo(self)
Depth.toFront(self)},id*500)}
self.hide=function(){sprite.visible=false}
self.hide()}
Pool.registerCanvas("BigStar",BigStar)