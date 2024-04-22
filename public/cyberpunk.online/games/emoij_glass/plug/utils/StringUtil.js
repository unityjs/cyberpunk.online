var StringUtil=new function(){var self=this
self.ALPHABET="#ABCDEFGHIJKLMNOPQRSTUVWXYZ"
self.contains=function(text,string){return text.toLowerCase().indexOf(string.toLowerCase())!=-1}
self.containsStrict=function(text,string){return text.indexOf(string)!=-1}
self.split=function(text,string){return text.toLowerCase().split(string.toLowerCase())[0]}
self.displaySign=function(number,msg){var text=number>0?"+"+number:number
if(msg)text+=" "+msg
return text}
self.trim=function(str){while(str.charAt(0)==" ")str=str.substr(1)
while(str.charAt(str.length-1)==" ")str=str.substr(0,-1)
return str}
self.lTrim=function(str){while(str.charAt(0)==" ")str=str.substr(1)
return str}
self.rTrim=function(str){while(str.charAt(str.length-1)==" ")str=str.substr(0,-1)
return str}
self.string=function(char,repeat){if(repeat<=0)return ""
var r=""
for(var i=0;i<repeat;i++)r+=char
return r}
self.validateEmail=function(email){var EMAIL_REGEX=/^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}$/i}
self.beginsWith=function(input,prefix){return prefix==input.substring(0,prefix.length)}
self.getPrefix=function(text,separator,toLowerCase){var separator=separator||"_"
var output=text.split(separator)[0]
if(toLowerCase)output.toLowerCase()
return output}
self.endsWith=function(input,suffix){return suffix==input.substring(input.length-suffix.length)}
self.replaceStr=function(input,replace,replaceWith){var sb=""
var found=false;var sLen=input.length;var rLen=replace.length;for(var i=0;i<sLen;i++){if(input.charAt(i)==replace.charAt(0)){found=true;for(var j=0;j<rLen;j++){if(!(input.charAt(i+j)==replace.charAt(j))){found=false;break;}}
if(found){sb+=replaceWith;i=i+(rLen-1);continue;}}
sb+=input.charAt(i);}
return sb;}
self.getFileExtension=function(target){return target.substring(target.lastIndexOf(".")+1,target.length).toLowerCase()}
self.containsKeys=function(txt,keywords){if(!keywords)return false
var keys=keywords.split(",")
var text=txt.toLowerCase()
for(var n in keys)
if(text.indexOf(keys[n])!=-1)return true}
self.strReplace=function(srch,replace,str){var string=str
return string.split(srch).join(replace);}
self.excludeChars=function(target,chars){var txt="",valid;var chars=chars||":,<>-'{}[]/*-+!;8!@#$%.^&*()"
for(var c=0;c<target.length;c++){valid=true;for(var z=0;z<chars.length;z++){if(target.charAt(c)==chars.charAt(z)){valid=false;break;}}
valid?txt+=target.charAt(c):null}
return txt;}
self.extractKeywords=function(text,length){var validChars="abcdefghijklmnopqrstuvwxyz"
var output=[]
var max=text.length
var text=text.toLowerCase()
var string=""
for(var n=0;n<max;n++){var char=text.charAt(n)
if(validChars.indexOf(char)!=-1){string+=char}else{if(string.length>length)output.push(string)
string=""}}
return output}
self.fillZero=function(input,z){var string=input+""
var zeros=(z||1)
while(string.length<zeros)string="0"+string
if(string=="0")string="00"
return string}
self.formatRank=function(input){var append="th"
if(input==1)append="st"
if(input==2)append="nd"
if(input==3)append="rd"
return input+append}
self.commas=function(num,interval){var num=num+""
var interval=interval||3
var output=""
var str
var c=0;for(var n=num.length-1;n>=0;n--){str="";(++c>=interval&&n>0)?(c=0,str=" "):null;str+=num.charAt(n);output=str+output;}
return output}
self.toDollars=function(value,sign,divider){var isNeg=value<0
var sign=sign|"$"
var divider=divider||1
var formatted=sign+self.commas(Math.abs(Math.round(value/divider)))
if(isNeg)formatted="-"+formatted
return formatted}
self.seconds=function(secs){var minutes=0
var hours=0
var seconds=secs
while(seconds>=60){seconds-=60
minutes++}
while(minutes>=60){minutes-=60
hours++}
return(hours?self.fillZero(hours,1)+":":"")+self.fillZero(minutes,1)+":"+self.fillZero(seconds,1)}
self.getTimeString=function(millisecs){var separator="."
var iSec=millisecs/1000
var iCent=(millisecs-iSec*1000)/10
var sec=self.lFill(iSec,"0",2)
var cent=self.lFill(iCent,"0",2)
return sec+separator+cent}
self.getFormatTime=function(millisecs,showMillisecs){var time=millisecs/1000
var tMin=time/60
var tSec=time-tMin*60
var tMil=millisecs-tMin*60000-tSec*1000
var format=""
format+=self.lFill(tMin,"0",2)+":"
format+=self.lFill(tSec,"0",2)
if(showMillisecs)format+="."+self.lFill(tMil.substr(0,2),"0",2)
return format}
self.simplify=function(string){var output=""
var vowels="aeiou"
var string=string.toLowerCase()
for(var n in string)
if(vowels.indexOf(string[n])==-1)output+=string[n]
return output}
self.toArray=function(string,isInt){var output=[]
if(!string)return output
for(var n in string){var value=string[n]
if(isInt)value=parseInt(value)
output.push(value)}
return output}}