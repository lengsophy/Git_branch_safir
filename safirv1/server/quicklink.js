Meteor.methods({
	addquicklink:function(obj){
		quicklink.insert(obj);
	},
	editquicklink:function(id,obj){
		quicklink.update({_id:id},{$set:obj})
	}
})