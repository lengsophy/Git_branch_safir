Meteor.methods({
	addShopLearnIt:function(obj){
		return shopLearnIt.insert(obj);
	},
	updateShopLearnIt:function(id,obj){
		return shopLearnIt.update({_id:id},{$set:obj});
	},
	deleteShopLearnIt:function(id){
		shopLearnIt.remove(id);
	}
});