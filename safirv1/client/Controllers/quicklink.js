Session.set('searchlinkproduct','');
Template.manageQuicklink.events({
	'click #addquicklink':function(e) {
		e.preventDefault();
		var title=$('#title').val();
		var link=$('#link').val();
		if(title!=="" && link!==""){
			var obj={
			title:title,
			link:link
			}
			if(this._id){
				Meteor.call('editquicklink',this._id,obj);
				$('#title').val('');
				$('#link').val('');
				Router.go('/manageQuicklink');
				Bert.alert('Update successfull !','success','growl-bottom-right');

			}else{
				Meteor.call('addquicklink',obj);
				$('#title').val('');
				$('#link').val('');
				Bert.alert('Insert successfull !','success','growl-bottom-right');
			}
			
		}else{
				Bert.alert('feild is empty!','danger','growl-bottom-right');
			
		}
		
	},
	'click #remove':function(e){
		e.preventDefault();
		quicklink.remove({_id:this._id});
		Bert.alert('Remove successfull !','success','growl-bottom-right');
	}
});
Template.manageQuicklink.helpers({
	getquicklink:function(){
		return quicklink.find();
	},
	
})
// Template.manageQuicklink.helpers({
// 	getQuicktype:function(){
// 		return quicklink_type.find();
// 	},
// 	getproduct:function(){
//         var keyword=Session.get('searchlinkproduct');
//         var result = products.find({ "title": { $regex: new RegExp(keyword, "i") } },{limit:20})
//         //alert(result.count());
//         return result;
//     }
// })
// Template.manageQuicklink.events({
// 	'keyup #searchpro':function(e){
// 		e.preventDefault();
// 		var keyword=$('#searchpro').val();
//         //alert(keyword);
//         Session.set('searchlinkproduct',keyword);
// 	},
// 	'click #btnAdd':function(e){
// 		e.preventDefault();
// 		alert();
//         var title=$('#searchpro').val();
//         if(title!==''){
//         	if(Session.get('protitle')==''){
//             var newSes=title+'|';
// 	        }else{
// 	            var newSes=Session.get('protitle')+title+'|';
// 	        }
// 	        Session.set('protitle',newSes);
// 	        Bert.alert( 'Add Success', 'success', 'growl-top-right' );	
//         }else{
//         	Bert.alert( 'products is empty', 'success', 'growl-top-right' );	
//         }
        
// })