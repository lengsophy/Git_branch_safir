Meteor.methods({
	updateQuiz:function(id, obj){
		Meteor.users.update({_id:id},{$set: obj});
	}
});