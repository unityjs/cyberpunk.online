function Popup_LevelPages(){var self=Popups.add("LevelPages",{hasBlackCover:false,animation:"pan",onShow:onShow,onHide:onHide})
var scroller=new Scroller({y:Canvas.TOP,width:1200,height:Canvas.HEIGHT,x:Canvas.LEFT,parent:self})
scroller.mask=null
var X=Canvas.WIDTH/2
var Y=400
var gallery=new Gallery({y:Y+200,x:X-585/2,marginY:900,marginX:585,columns:1,parent:self,onStartDrag:scroller.startDrag,onMouseDown:onMouseDown,requireValidation:true},"Button_LevelPage")
var titleField=Texts.spawnBitmap("font",{text:"LEVELS",x:X,y:Y,fontSize:140,tint:0x0084ff,parent:scroller.content})
function onMouseDown(button){Levels.currentPage=button.data.id
Popups.show("Levels")}
function onShow(){isShowing=true
Levels.refresh()
gallery.fill(Levels.pages)
scroller.showGallery(gallery,false)}
function onHide(){isShowing=false
gallery.clear()
scroller.hide()}}
Pool.register("Popup_LevelPages",Popup_LevelPages)