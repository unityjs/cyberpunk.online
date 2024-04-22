var colorPalette=[{color:0xff005d,id:"red"},{color:0x2eaef7,id:"blue"},{color:0xFFFFFF,id:"white"},{color:0xffbe00,id:"yellow"},{color:0x9a55ef,id:"purple"},{color:0xb0dd16,id:"green"}]
var Colors=new function(){var self=this
var max=5
self.maxColors=colorPalette.length
var pool=[]
self.patterns=[]
self.tutorialPatterns=[]
self.friction=10
self.increaseMaxColors=function(){self.setMaxColors(self.maxColors+1)}
self.setMaxColors=function(value){max=MathUtil.hardLimit(value,1,colorPalette.length)
console.log("MAX COL",max)
self.reset()}
self.reset=function(){self.maxColors=max
self.resetPool()}
self.getColorLib=function(value){return value!=null?colorPalette[value]:colorPalette[Random.value(self.maxColors-1)]}
self.getColor=function(value){return self.getColorLib(value).color}
self.getColorData=function(id){for(var n in colorPalette)
if(colorPalette[n].id==id)return colorPalette[n]}
self.getColorByID=function(id){for(var n in colorPalette)
if(colorPalette[n].id==id)return colorPalette[n].color}
self.resetPool=function(){pool=[]
var selcolors=[]
for(var n=0;n<self.maxColors;n++)selcolors.push(n)
selcolors=ArrayUtil.shuffle(selcolors)
var pattern=getPattern()
fillPool(pattern,Random.value(pattern.length/2,pattern.length/self.friction+1))
function getPattern(){if(self.patterns.length)return ArrayUtil.cloneArray(ArrayUtil.getRandomItem(self.patterns))
var len=Random.value(self.maxColors,1)
while(selcolors.length>len)selcolors.shift()
var amount=Random.value(25,10)
var output=[]
for(var n in selcolors)
for(var a=0;a<amount;a++)output.push(n)
return ArrayUtil.shuffle(output)}
function fillPool(pattern,length){selcolors=ArrayUtil.shuffle(selcolors)
var length=length||pattern.length
var mypattern=ArrayUtil.clone(pattern)
if(Random.chance())
for(var n=0;n<pattern.length/2;n++)mypattern.push(mypattern.shift())
if(Random.chance())mypattern.reverse()
for(var n=0;n<length;n++){var co=pattern[n]
while(co>=selcolors.length)co-=selcolors.length
pool.push(colorPalette[selcolors[co]])}
if(Random.chance())pool=ArrayUtil.shuffle(pool)}}
self.getFromPool=function(){if(!pool.length)self.resetPool()
var col=pool.shift()
if(!col){self.resetPool()
return self.getFromPool()}
return col}}