function myRandom(){var self=this
self.value=function(max,min,avoid){var mymin=min||0
var value=Math.round(Math.random()*(max-mymin))+mymin
return value!=avoid?value:self.value(max,min,avoid)}
self.decimal=function(max,min){var max=max||999
var mymin=min||0
return Math.random()*(max-mymin)+mymin}
self.chance=function(probability){if(probability==0)return false
return Math.random()<=(probability||.5)}
self.spectrum=function(max,min){var val=self.value(max,min)
return self.chance(.5)?val:-val}
self.spectrumDecimal=function(max,min){var val=self.decimal(max,min)
return self.chance(.5)?val:-val}
self.boolean=function(){return self.chance()?true:false}
self.direction=function(){return self.chance()?1:-1}
self.fortune=function(amount){for(var n=0;n<amount;n++)
if(self.chance((1/(amount*2))*(amount-n)))return n
return 0}}
var Random=new myRandom()