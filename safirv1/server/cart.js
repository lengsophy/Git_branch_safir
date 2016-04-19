Meteor.methods({
	addtocart: function(obj){
		//console.log('start');
		var ipAddress=this.connection.clientAddress;
		//console.log("IP ADDRESS:"+ipAddress);
		obj.ip_address=ipAddress;
		//console.log('INSERTING '+JSON.stringify(obj));
		cart.insert(obj);
	},
	removemycart: function(id){
		cart.remove(id);
	},
	updateCart: function(id,qty,subtotal){
		cart.update(id, {$set: {quantity: qty, subtotal:subtotal}});
	},
	updateStatus:function(id,obj){
		cart.update({_id:id},{$set:obj});
	},
	
	updateCartStatus:function(id){
		cart.update({_id:id},{$set:{order_status:1}});
	}
});