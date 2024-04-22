var log=function(){}
function trace(target,message){var output=""
output="-------------------------------------- \n"
output+="PRINT:"+message+"\n";output+="-------------------------------------- \n"
output+=toString(target)+"\n\n"
console.log(output)
function toString(target,brakeCount){brakeCount=brakeCount||0
var type=typeof(target)
var output=""
brakeCount+=1
var brake="\n"
for(var n=0;n<brakeCount;n++){brake+="\t"}
if(type=="string"||type=="number"||type=="boolean"){type=="string"?output+='"':null
output+=String(target)
type=="string"?output+='"':null}
if(type=="object"){output+="{"
for(var i in target){output+=brake+String(i)+" : "+toString(target[i],brakeCount)}
output+=brake
output+="}"}
if(type=="function")output+="(function) "+String(target)
return output}}