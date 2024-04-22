function Popup_Shop(){var self=Popups.add("Shop",{animation:"pan",onMouseDown:onDown,onShow:onShow,onHide:onHide,update:update,hasBlackCover:false})
var sprites=self.sprites
var s=sprites.Shop_wheel
s.x=-140
s.y=-80
sprites.Shop_more_button.addChild(s)
var shadow=sprites.Shop_shadow
shadow.alpha=.4
var scroller=new Scroller({y:-370,width:Canvas.WIDTH,height:Canvas.HEIGHT/2+Canvas.HEIGHT/4,x:Canvas.LEFT,parent:self})
var marginX=380
var gallery=new Gallery({y:70,x:Canvas.WIDTH/2-marginX*1.5,marginY:marginX,marginX:marginX,columns:3,parent:self,onStartDrag:scroller.startDrag,onMouseDown:onMouseDown,requireValidation:true},"Button_Shop")
var morePage=Canvas.add()
morePage.addChild(sprites.Shop_100coins_button)
morePage.addChild(sprites.Shop_wheel_button)
morePage.addChild(sprites.Shop_hint_button)
morePage.addChild(sprites.Shop_hinthearts_button)
var emoticonsData=[{"sprite":"face_1",price:0,isUnlocked:true},{"sprite":"face_2",price:50},{"sprite":"face_3",price:100},{"sprite":"face_4",price:400},{"sprite":"face_5",price:400},{"sprite":"face_6",price:400},{"sprite":"face_7",price:1000},{"sprite":"face_8",price:1000},{"sprite":"face_9",price:1000},{"sprite":"face_10",price:2000},{"sprite":"face_11",price:2000},{"sprite":"face_12",price:2000},{"sprite":"face_13",price:2000},{"sprite":"face_14",price:3000},{"sprite":"face_15",price:3000},{"sprite":"face_16",price:3000},{"sprite":"face_17",price:3000},{"sprite":"face_27",price:3000},{"sprite":"face_28",price:3000},{"sprite":"face_18",price:4000},{"sprite":"face_19",price:4000},{"sprite":"face_20",price:4000},{"sprite":"face_21",price:4000},{"sprite":"face_22",price:5000},{"sprite":"face_23",price:5000},{"sprite":"face_24",price:5000},{"sprite":"face_25",price:6000},{"sprite":"face_26",price:6000},{"sprite":"face_29",price:6000},{"sprite":"face_30",price:6000}]
for(var n in emoticonsData)emoticonsData[n]=new Data_ShopItem(emoticonsData[n])
Data.emoticons=emoticonsData
var pensData=[{"sprite":"pencil_1","tint":0x0084ff,price:0,type:"pen",isUnlocked:true},{"sprite":"pencil_2","tint":0xff04dd,price:50,type:"pen"},{"sprite":"pencil_3","tint":0x580dff,price:50,type:"pen"},{"sprite":"pencil2_1","tint":0x5e3935,price:150,type:"pen"},{"sprite":"pencil2_2","tint":0xde39d4,price:150,type:"pen"},{"sprite":"pencil2_3","tint":0x7b52ff,price:150,type:"pen"},{"sprite":"pen_1","tint":0xda25ef,price:150,type:"pen"},{"sprite":"pen_2","tint":0x25c4ef,price:150,type:"pen"},{"sprite":"pen_3","tint":0x25ef75,price:150,type:"pen"},{"sprite":"paint_1","tint":0x188e8b,price:400,type:"pen"},{"sprite":"paint_2","tint":0x689300,price:400,type:"pen"},{"sprite":"paint_3","tint":0xa50c1c,price:400,type:"pen"},{"sprite":"marker_1","tint":0x03ab49,price:400,type:"pen"},{"sprite":"marker_2","tint":0xab7d00,price:400,type:"pen"},{"sprite":"marker_3","tint":0xb9000f,price:400,type:"pen"},{"sprite":"marker2_1","tint":0xff3b75,price:1000,type:"pen"},{"sprite":"marker2_2","tint":0x635fff,price:1000,type:"pen"},{"sprite":"marker2_3","tint":0x22d0ff,price:1000,type:"pen"},{"sprite":"fountain_1","tint":0x6f00ff,price:2000,type:"pen"},{"sprite":"fountain_2","tint":0x00b086,price:2000,type:"pen"},{"sprite":"fountain_3","tint":0x08a500,price:2000,type:"pen"},{"sprite":"feather_1","tint":0x0090ff,price:4000,type:"pen"},{"sprite":"feather_2","tint":0x2eb402,price:4000,type:"pen"},{"sprite":"feather_3","tint":0xe5b300,price:4000,type:"pen"}]
Data.set("selPen",Data.get("selPen")||"pencil_1")
for(var n in pensData)pensData[n]=new Data_ShopItem(pensData[n])
var data=[]
var wheelData=[]
var lastLabel="Shop_emoji_button"
function onDown(button){var atlasId=button.atlasId
log(atlasId)
if(atlasId=="Shop_100coins_button"){HUHU_showRewardedVideoAd(()=>{Coins.collect(button,100);},()=>{promptMessage("Failed to get the reward, please watch the ads to the end.");});return}
if(atlasId=="Shop_wheel_button"){HUHU_showRewardedVideoAd(()=>{Popups.overlay("FortuneWheel",{autoSpin:true})},()=>{promptMessage("Failed to get the reward, please watch the ads to the end.");});return}
if(atlasId=="Shop_hint_button"){HUHU_showRewardedVideoAd(()=>{Clues.collect(button,1)},()=>{promptMessage("Failed to get the reward, please watch the ads to the end.");});return}
if(atlasId=="Shop_hinthearts_button"){if(!Coins.tryPurchase(100))return
HUHU_showRewardedVideoAd(()=>{showVideoAd();},()=>{promptMessage("Failed to get the reward, please watch the ads to the end.");});return}
onHide()
onDownContent(atlasId)}
function onDownContent(atlasId){lastLabel=atlasId
shadow.x=sprites[atlasId].x
if(atlasId=="Shop_emoji_button")return doShow(emoticonsData)
if(atlasId=="Shop_pens_button")return doShow(pensData)
if(atlasId=="Shop_more_button")return self.addChild(morePage)}
function onMouseDown(button){for(var n in gallery.pool){gallery.pool[n].setBoolean(false);}
if(!button.data.isUnlocked){if(!Coins.tryPurchase(button.data.price))return}
button.unlock()
if(button.data.type=="pen"){button.setBoolean(true)
Data.set("selPen",button.data.sprite)
Data.set("pencilHead",button.data.sprite)
Data.set("pencilTint",button.data.tint)}}
function update(){}
function onHide(){Depth.removeChild(morePage)
gallery.clear()
scroller.hide()}
function onShow(){onDownContent(self.data.label||lastLabel)
log(self.sprites)
for(var n in self.sprites)Depth.toFront(self.sprites[n])}
function doShow(newData){data=newData
gallery.fill(data)
scroller.showGallery(gallery,false)}
function play(id){}}
Pool.register("Popup_Shop",Popup_Shop)