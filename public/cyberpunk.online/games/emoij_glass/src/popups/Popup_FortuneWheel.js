function Popup_FortuneWheel(){var self=Popups.add("FortuneWheel",{animation:"down",animationOut:"cut",update:onUpdate,onShow:onShow,onHide:onHide,onMouseDown:onMouseDown,hasBlackCover:false})
var sprites=self.sprites
var button=sprites.FortuneWheel_spin_button
var noButton=sprites.FortuneWheel_no_button
var spinner=sprites.FortuneWheel_wheel
var top=sprites.FortuneWheel_wheel_top
var head=sprites.FortuneWheel_pick
var halo=Sprites.get("Halo",{alpha:1,x:spinner.x,y:spinner.y,parent:self})
var sin=0
var vel=0
var angleObj={}
var selectedAngle=0
var isAccelerating
var selectedItem
var bg=sprites.FortuneWheel_background
bg.x=bg.y=0
bg.width=Canvas.WIDTH+20
bg.height=Canvas.HEIGHT+20
Depth.toFront(spinner)
Depth.toFront(top)
Depth.toFront(head)
var items=[]
items.push(new WheelItem({n:0,clues:1,coins:0,parent:spinner}))
items.push(new WheelItem({n:1,clues:0,coins:150,parent:spinner}))
items.push(new WheelItem({n:2,clues:0,coins:50,parent:spinner}))
items.push(new WheelItem({n:3,clues:3,coins:0,parent:spinner}))
items.push(new WheelItem({n:4,clues:0,coins:250,parent:spinner}))
items.push(new WheelItem({n:5,clues:0,coins:100,parent:spinner}))
items.push(new WheelItem({n:6,clues:0,coins:25,parent:spinner}))
function onHide(){button.disable()
noButton.disable()}
function onShow(){Animation.fadeIn(bg)
hideButtons()
if(self.data&&self.data.autoSpin)return Delay(doSpin,500)
showButtons()}
function showButtons(){noButton.enable()
Animation.fadeIn(noButton)
button.enable()
Animation.fadeIn(button)}
function hideButtons(){button.disable()
noButton.disable()
button.visible=noButton.visible=false}
function onMouseDown(button){var atlasId=button.atlasId
if(atlasId=="FortuneWheel_no_button")return Popups.hide("FortuneWheel")
button.disable()
Animation.fadeOut(button)
hideButtons()
Tracking.wheelSpinOffer()
Ads.playRewarded(function(bool){if(!bool)return Popups.hide("FortuneWheel")
noButton.disable()
Animation.fadeOut(noButton)
Animation.bounceScaleFloor(spinner)
doSpin()})}
function doSpin(){vel=-7
isAccelerating=true
Tick.start(update)
Sounds.play("wheel")}
function onUpdate(){halo.angle+=1
sin+=.1
var s=1.2+Math.sin(sin)*.1
halo.scale.set(s,s)}
function update(){if(isAccelerating){spinner.angle+=vel
vel+=.3
if(vel>40){isAccelerating=false
selectedAngle=self.data.forceValue?2:Random.value(6)
delete self.data.forceValue
selectedItem=items[selectedAngle]
var angle=-selectedAngle*360/7
var time=2000
angleObj.vel=vel
spinner.angle=angleObj.angle=angle-2000
Animation.to(angleObj,{angle:angle+10,vel:0},time,Phaser.Easing.Sinusoidal.Out)
Delay(function(){Animation.to(angleObj,{angle:angle},time/3,Phaser.Easing.Sinusoidal.InOut)
Delay(onSelect,time/3)},time)}}else{vel=angleObj.vel
spinner.angle=angleObj.angle}}
function onSelect(){Sounds.play("gift")
Particles.explodeObstacle({x:spinner.x,y:spinner.y-260},{texture:"star",parent:Canvas.aboveall})
var point={x:head.x,y:head.y}
Animation.shake(head,point,5,5)
Animation.bounceScaleFloor(spinner)
if(selectedItem.coins)Coins.collect(point,selectedItem.coins,0xFFFFFF,true)
if(selectedItem.clues)Clues.collect(point,selectedItem.clues,0xFFFFFF,true)
selectedItem.win()
Tick.stop(update)
Delay(function(){if(!Ads.getRewarded())return Popups.hide("FortuneWheel")
showButtons()},500)}}
Pool.register("Popup_FortuneWheel",Popup_FortuneWheel)
function WheelItem(vars){var self=Canvas.cast(this,vars.parent)
var n=vars.n
self.coins=vars.coins||0
self.clues=vars.clues||0
self.value=n
self.angle=360/7*n
self.win=function(){Animation.bounceScaleFloor(self)}}
Pool.registerCanvas("WheelItem",WheelItem)