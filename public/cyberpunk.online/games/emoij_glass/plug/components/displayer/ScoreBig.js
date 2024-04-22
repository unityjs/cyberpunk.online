var Score
function ScoreBig(vars){var vars=vars||{}
var self=Score=Canvas.cast(this,vars.parent||Canvas.screen,vars.x||0,vars.y||Canvas.TOP+50)
self.score=0
self.points=0
self.maxScore=0
var font=vars.font||"font"
var bestText=vars.bestText||"best:"
self.textField=Texts.spawnBitmap(font,{parent:self,y:135,size:vars.fontSize||250})
self.maxField=Texts.spawnBitmap(font,{parent:self,size:vars.fontSize||60})
self.isHighscore
self.maxScore=Data.get("maxScore")
var _renderScore=0
var isShowing=true
self.reset=function(){self.score=_renderScore=0
self.points=0
isSent=false
self.isHighscore=false
self.maxField.text=bestText+" "+self.maxScore
Data.set("maxScore",self.maxScore)
update()}
self.setScore=function(value){self.points=value
update()
Achievements.set("score",Math.floor(self.points))}
self.addScore=function(value,pos){var points=value||1
self.setScore(self.points+points)
if(!pos)return
Pool.spawn("AnimText").fadeUp("+"+points,{fontSize:150,x:pos.x,y:pos.y-150})}
function update(){self.score=Math.floor(self.points)
Data.set("score",self.score)
if(self.score>=self.maxScore){self.isHighscore=true
self.maxScore=self.score
Data.set("maxScore",self.maxScore)}
Tick.start(render)
render()}
function render(){_renderScore+=(self.score-_renderScore)/10
var rounded=Math.round(_renderScore)
self.textField.text=MathUtil.commas(rounded)
if(self.isHighscore)self.maxField.text=bestText+" "+MathUtil.commas(rounded)
if(rounded==self.score)Tick.stop(render)}
self.setMaxScore=function(value){self.maxScore=value
update()}
self.hide=function(){if(!isShowing)return
isShowing=false
Animation.fadeOut(self)}
self.show=function(){if(isShowing)return
isShowing=true
self.visible=true
Animation.fadeIn(self)}
self.send=function(){if(Game.isPlaying||isSent)return
isSent=true
document.getElementById("form_hidden").action=Data.config.url_continue
document.getElementById("input_score").value=self.score.toString()
document.getElementById("form_hidden").submit()}
self.isNearHighscore=function(margin){return self.score*100/self.maxScore>(margin||60)}
self.alpha=0
self.visible=false
self.reset()}
Pool.register("ScoreBig",ScoreBig,0,Phaser.Group)