function Popup_Levels(){var self=Popups.add("Levels",{hasBlackCover:false,animation:"pan",animationOut:"cut",onShow:onShow,onHide:onHide})
var scroller=new Scroller({y:Canvas.TOP,width:1200,height:Canvas.HEIGHT,x:Canvas.LEFT,parent:self})
scroller.mask=null
var X=Canvas.WIDTH/2
var Y=400
var gallery=new Gallery({y:Y+200,x:X-585,marginY:690,marginX:585,columns:2,parent:self,onStartDrag:scroller.startDrag,onMouseDown:onMouseDown,requireValidation:true},"Button_Level")
var titleField=Texts.spawnBitmap("font",{text:"LEVELS 1-10",x:X,y:Y,fontSize:140,tint:0x0084ff,parent:scroller.content})
Y+=130
var unlockField=Texts.spawnBitmap("font3",{text:"3/10",x:X+50,y:Y+5,anchorX:0,fontSize:53,tint:0x0000,parent:scroller.content})
var starsField=Texts.spawnBitmap("font3",{text:"3/10",x:X-50,y:Y+5,anchorX:1,fontSize:53,tint:0x0000,parent:scroller.content})
Sprites.get("Levels_separator",{x:X,y:Y,parent:scroller.content})
var star=Sprites.get("symbol_star",{x:X,y:Y-5,scale:.8,parent:scroller.content})
var page
Depth.removeChild(self.sprites.Levels_separator)
function onMouseDown(button){Levels.set(button.data.id)
Engine.startGame()}
function onShow(){isShowing=true
Levels.refresh()
page=Levels.getPage()
unlockField.text=StringUtil.fillZero(page.unlocked)+"/10"
starsField.text=StringUtil.fillZero(page.stars)+"/"+StringUtil.fillZero(page.totalStars)
star.x=starsField.x-starsField.width-50
gallery.fill(page.data)
scroller.showGallery(gallery,false)
titleField.text="LEVELS "+(page.id*10+1)+"-"+(page.id*10+10)}
function onHide(){isShowing=false
gallery.clear()
scroller.hide()}}
Pool.register("Popup_Levels",Popup_Levels)