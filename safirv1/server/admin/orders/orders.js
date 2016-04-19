Meteor.methods({
	updateOrderStatus: function( orderid,  status){
		check( orderid, Array);
		check(status, String);
		if( orderid.length > 0){
			for( i=0; i< orderid.length; i++){
				order.update({_id:orderid[i]},{$set:{status:status}});
			}
		}
	},
	countOrder: function( status ){
		check(status, String);
		if( status !='')
			var result = order.find({status:status});
		else
			var result = order.find();

		if( result.count() > 0){
			return {status:status, count: result.count()};
		}else{
			return {status:status, count: 0};
		}
	}
})