Meteor.methods({
	addLocation:function(obj){
		return locations.insert(obj);
	},
	updateLocation:function(id,obj){
		check(id, String);
		check(obj, Object)
		return locations.update({_id:id},{$set:obj});
	},
	deleteLocation:function(id){
		locations.remove(id);
	},
	updateOrderNum: function(id,num){
		return locations.update({_id:id},{$set:{order:num}});
	},
	updateLocationProduct: function(id,pro){
		return locations.update({_id:id},{$set:{productid:pro}});
	}
});