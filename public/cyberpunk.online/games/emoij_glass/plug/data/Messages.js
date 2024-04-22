var Messages=new function(){var self=this
self.nudge=function(aFriendsID){var message="It's your turn to play! "+Players.ME.userName+" is waiting for you"
log("SEND MESSAGE NUDGE",message)
Connector.sendFriendMessage(aFriendsID,message)}
self.wantToPlay=function(){log("SEND MESSAGE wantToPlay")
Connector.sendFriendMessage(Players.RIVAL.userID,Players.ME.userName+" wants to play with you!")}
self.sendTurn=function(imageToShare){var message=Players.ME.userName+" scored "+Score.score+" points! it's your turn "+Players.RIVAL.userName
log("SEND MESSAGE TURN",message,imageToShare!=null)
Connector.sendFriendMessage(Players.RIVAL.userID,message,imageToShare)}
self.sendSolo=function(imageToShare){log("SEND MESSAGE sendSolo")
if(!FBInstant.context.getID())return Tracking.sameContext()
var message=Players.ME.userName+" played solo and scored "+Score.score+" points! how much can you stack?"
Connector.sendFriendMessage(Players.RIVAL.userID,message,imageToShare)}
self.sendResults=function(imageToShare){var scoreA=VSBoard.scoreA
var scoreB=VSBoard.scoreB
var message=Players.ME.userName+" and "+Players.RIVAL.userName+"both score"+scoreA+" and TIE!! Play again!"
if(VSBoard.winner=="A")message="You win, "+Players.ME.userName+". Well played! "
if(VSBoard.winner=="B")message="You win, "+Players.RIVAL.userName+". Well played! "
var cta="Rematch? Play"
log("SEND MESSAGE RESULTS",message,imageToShare!=null)
Connector.sendFriendMessage(Players.RIVAL.userID,message,imageToShare,cta)}
self.taunt=function(imageToShare){var score=Score.score
var message=Players.ME.userName+" beat your highscore with "+score+" pts, come back and reclaim the lead!"
Connector.getLeaderboard("bestAllTime",true,function(data){for(var n in data)
if(data[n].score<score&&data[n].userID!=Players.ME.userID)Connector.sendBotMessage(data[n].userID,message,imageToShare)})}
self.looksLikeEmoji=function(imageToShare){log("LOOKS LIKE Emoji")
var message=Players.ME.userName+"  just said this emoji looks like you!\n\nClick Play To Send An Emoji Back…"
Connector.sendMessage(message,imageToShare)}}