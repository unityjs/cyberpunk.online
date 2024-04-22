var PackageLoader
function myPackageLoader(vars){var self=PackageLoader=Canvas.cast(this,vars.parent,vars.x,vars.y)
var vars=vars||{}
var ground=45
var package=self.package=Sprites.get("package",{anchorY:1,parent:self,x:0,y:ground})
var powerBar=self.powerBar=new PowerBar({y:70,parent:self,base:"progressbar_base",bar:"progressbar_bar"})
var button=new Button_SpriteSimple("blank",openPackage,{parent:self,width:200,height:300})
self.reset=function(){package.y=ground
Tick.stop(update)
powerBar.reset()}
function openPackage(){if(powerBar.percent<100)return
self.reset()
Popups.show("Package")}
function onPackageLoaded(){powerBar.setPercent(100)
Tick.start(update)
bounce()}
function update(){package.y+=vel*.1
vel+=1
if(package.y>ground)return bounce()}
function bounce(){package.y=ground
vel=-17
package.scale.set(1.1,.9)
Animation.scaleTo(package)}
onPackageLoaded()}
Utils.setPrototype(myPackageLoader,Phaser.Group)