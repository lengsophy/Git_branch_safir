Meteor.methods({
	categoryChildren: function( parent ){
		check(parent, String);
		var hasChildren = false;
		var result = categories.find({"parent":parent});
		if( result.count() > 0 ){
			hasChildren = true;
		}
		return {id:parent, data:hasChildren};
	}
})