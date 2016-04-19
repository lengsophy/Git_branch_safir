Template.managemembership.events({
	'click #btnAdd':function(e){
		e.preventDefault();
		var minpoint=$('#minpoint').val();
		var maxpoint=$('#maxpoint').val();
		var name=$('#name').val();
		var obj={
			name:name,
			minpoint:Number(minpoint),
			maxpoint:Number(maxpoint),
			date:Date.now()
		}
		if(minpoint=='' && name==''){
			Bert.alert('feild is empty!','danger','growl-bottom-right');
		}else{
			if(this._id){
				Meteor.call('updateMembership',this._id,obj);
				Bert.alert('Update successfull !','success','growl-bottom-right');
				Router.go('/managemembership');
			}else{
				Meteor.call('addMembership',obj);
				Bert.alert('Insert successfull !','success','growl-bottom-right');
			}
			
			$('#minpoint').val('');
			$('#maxpoint').val('');
			$('#name').val('');
		}
		
	},
	'click #remove':function(e){
		e.preventDefault();
		membership.remove({_id:this._id});
		Bert.alert('Remove successfull !','success','growl-bottom-right');

	}

});
Template.managemembership.helpers({
	getMembership:function(){
		return membership.find();
	}
});