Template.lookdetail.helpers({
	getAuthor: function(id){
		return Meteor.users.findOne({_id:id})
	}
});
