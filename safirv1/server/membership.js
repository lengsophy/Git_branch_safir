Meteor.methods({
	addMembership:function(obj){
		membership.insert(obj);
	},
	updateMembership:function(id,obj){
		membership.update({_id:id},{$set:obj});
	}
});