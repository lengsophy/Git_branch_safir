Template.addcategory.events({	
	'click #delete':function(e){
		e.preventDefault();
		categories.remove(this._id);
	}
	
});
Template.addcategory.helpers({
	getImgBrous:function(){
		return Session.get('bannercategory');
	},
	getbanner:function(){
		return categories.find();
	},
	getbannerId:function(){
		return Session.get('bannerId');
	}
	
});
Template.updatecategory.events({
	'change #file': function(event, template) {
		event.preventDefault();
		var files = event.target.files;
		for (var i = 0, ln = files.length; i < ln; i++) {
			images.insert(files[i], function (err, fileObj) {
				Session.set('ADDIMAGEID', fileObj._id);
			});
		}
	}
});
Template.updatecategory.helpers({
	getImgBrous:function(){
		return Session.get('bannercategory');
	},
	getbannerId:function(){
		return Session.get('bannerId');
	}
});