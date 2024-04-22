var ArrayUtil=new function(){var self=this
self.clone=function(object){var output={}
for(var n in object)output[n]=object[n]
return output}
self.extract=function(from,to){var output=to||{}
if(!from)return output
for(var n in from)output[n]=from[n]
return output}
self.pushUnique=function(array,item){if(array.indexOf(item)==-1)array.push(item)}
self.cloneArray=function(array){var output=[]
for(var n in array)output[n]=array[n]
return output}
self.getRandomItem=function(array,andRemove,andAvoid){var n=Random.value(array.length-1)
var item=array[n]
if(item==andAvoid)return self.getRandomItem(array,andRemove,andAvoid)
if(andRemove)array.splice(n,1)
return item}
self.removeItem=function(array,item){array.splice(array.indexOf(item),1)}
self.removeItems=function(array,items){for(var n in items)self.removeItem(array,items[n])}
self.extractUnique=function(a,b){var output=[]
for(var n in a)
if(output.indexOf(a[n])==-1)output.push(a[n])
for(var n in b)
if(output.indexOf(b[n])==-1)output.push(b[n])
return output}
self.sortProperty=function(array,property){var unsorted=ArrayUtil.cloneArray(array)
var sorted=[]
while(unsorted.length){var lower=unsorted[0]
for(var n in unsorted)
if(unsorted[n][property]<=lower[property])lower=unsorted[n]
sorted.push(lower)
self.removeItem(unsorted,lower)}
return sorted}
self.push=function(array,output){var output=output||[]
for(var n in array)output.push(array[n])
return output}
self.shuffle=function(refArray,length){var array=self.cloneArray(refArray)
var output=[]
while(array.length){output.push(self.getRandomItem(array,true))
if(output.length==length)return output}
return output}
self.shuffleLinear=function(array){var output=self.cloneArray(array)
for(var n=0;n<array.length;n++)
if(Random.chance())self.firstToLast(output)
if(Random.chance())output.reverse()
return output}
self.firstToLast=function(array){array.push(array.shift())
return array}
self.lastToFirst=function(array){array.reverse()
self.firstToLast(array.shift())
array.reverse()
return array}
self.searchObjects=function(object,label){var output={}
for(var name in object)
if(StringUtil.containsStrict(name,label))output[name]=object[name]
return output}
self.smooth=function(array){}
self.pages=function(array,perpage){var array=self.cloneArray(array)
var output=[]
while(array.length){var page=[]
var i=0
while(++i<=perpage&&array.length)page.push(array.shift())
output.push(page)}
return output}
self.toNameVar=function(array,field){var output={}
for(var n in array)output[array[n][field]]=array[n]
return output}
self.parse=function(value){if(value){try{var json=JSON.parse(value)
return json}catch(e){log("----------JSON PARSE ERROR---------",value)}
return{}}
return{}}
self.rotate=function(grid,times){var times=times==null?Random.value(3):times
var newGrid=[];var rowLength=Math.sqrt(grid.length);newGrid.length=grid.length
for(var i=0;i<grid.length;i++){var x=i%rowLength;var y=Math.floor(i/rowLength);var newX=rowLength-y-1;var newY=x;var newPosition=newY*rowLength+newX;newGrid[newPosition]=grid[i];}
if(times>0)return self.rotate(newGrid,times-1)
return newGrid}
self.flip=function(grid){var output=[]
var n=0
var side=Math.sqrt(grid.length)
for(var y=0;y<side;y++){var line=[]
for(var x=0;x<side;x++)line.push(grid[n++])
self.push(line.reverse(),output)}
return output}
self.salchiche=function(array,andReverse){var count=0
var output=self.clone(array)
var halve=[]
while(halve.length<output.length)halve.push(output.shift())
if(andReverse)halve=halve.reverse()
while(halve.length)output.push(halve.shift())
return output}
self.mirror=function(array,length){var count=0
var array=self.clone(array)
var halve=[]
var length=length||array.length
while(halve.length<length)halve.push(array.shift())
var halve2=self.clone(halve)
halve2=halve2.reverse()
while(halve2.length)halve.push(halve2.shift())
return halve}
self.contains=function(array,value){return array.indexOf(value)!=-1}
self.getCue=function(array,source){if(!array.length)self.push(self.shuffle(source),array)
return array.shift()}
self.toString=function(array){var output=""
for(var n in array)output+=array[n]
return output}}