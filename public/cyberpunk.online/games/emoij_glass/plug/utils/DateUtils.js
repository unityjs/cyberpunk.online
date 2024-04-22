var DateUtils=new function(){var self=this
var date=new Date()
self.getTime=function(){return new Date().getTime()}
self.formatDate=function(thedate){var thedate=thedate||date
return thedate.getFullYear()+"."+thedate.getMonth()+"."+thedate.getDate()}
self.daysFrom=function(oldTimestamp,newTimestamp){return Math.floor(new Date((newTimestamp?new Date(newTimestamp):new Date()).getTime()-new Date(oldTimestamp).getTime()).getTime()/86400000)}
self.secondsFrom=function(oldTimestamp,newTimestamp){return Math.floor(new Date((newTimestamp?new Date(newTimestamp):new Date()).getTime()-new Date(oldTimestamp).getTime()).getTime()/1000)}}