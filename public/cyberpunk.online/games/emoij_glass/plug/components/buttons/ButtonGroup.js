var ButtonGroup=new function(){var self=this
self.pool={}
self.get=function(id){return self.pool[id]||new Group(id)}
self.push=function(button,id){var group=self.get(id)
group.push(button)
return button}
function Group(id){var self=this
var buttons=[]
var id=id
var _selMax=1
var selected=[]
ButtonGroup.pool[id]=self
self.push=function(button){ArrayUtil.pushUnique(buttons,button)
button.group=self}
self.remove=function(button){ArrayUtil.removeItem(buttons,button)}
self.select=function(button){ArrayUtil.pushUnique(selected,button)
while(selected.length>_selMax)selected[0].deselect()}
self.deselect=function(button){if(!button){for(var n in selected)selected[n].deselect()
selected=[]
return}
ArrayUtil.removeItem(selected,button)}
function getButtonsByData(data){selected=[]
for(var n in buttons)
if(buttons[n].data==data)selected.push(buttons[n])
return selected}}}