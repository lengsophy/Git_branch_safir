Template.editShopLearnIt.helpers({
	getCurrentCate:function(cateId){
		var cateName = categories.findOne({_id:cateId});
		return cateName.title;
	},
	getCategories:function(){
		return categories.find();
	}
});
Template.editShopLearnIt.events({
	'click #btnEdit':function(e,tpl){
		var id = this._id;
		var category = Session.get("CATEGORYIT");
		var image = Session.get("IMAGEIT");
		var pdfImage = Session.get("IMAGEPDF");
		var old_image = tpl.$('#old_image').val();
		var old_pdfImage = tpl.$('#old_pdfImage').val();
		if(image == undefined)
			image = old_image
		if(pdfImage == undefined)
			pdfImage = old_pdfImage
		var obj = {
			cateID:category,
			image_id:image,
			pdfImage_id:pdfImage
		}
		Meteor.call("updateShopLearnIt",id,obj,function(err){
			if(err)
				console.log("Error update SopLearnIt."+err.reason);
			else{
				console.log("Success!!!");
				Session.set("IMAGEIT",undefined);
				Session.set("IMAGEPDF",undefined);
				Router.go("/manageshoplearnit");
			}
		});
	},
	'change #category':function(e,tpl){
  		e.preventDefault();
  		var cate = tpl.$('#category').val();
  		Session.set("CATEGORYIT",cate);
  	},
	'change #image': function(e, tpl) {
		e.preventDefault();
	    var files = e.target.files;
	    for (var i = 0, ln = files.length; i < ln; i++) {
	      	images.insert(files[i], function (err, fileObj) {
		      	Session.set('IMAGEIT',fileObj._id);
	  		});
    	}
  	},
  	'change #pdf_image': function(e, tpl) {
		e.preventDefault();
	    var files = e.target.files;
	    for (var i = 0, ln = files.length; i < ln; i++) {
	      	images.insert(files[i], function (err, fileObj) {
		      	Session.set('IMAGEPDF',fileObj._id);
	  		});
    	}
  	}
});
Template.manageShopLearnIt.helpers({
	getShopLearnIt:function(){
		return shopLearnIt.find();
	},
	getCateName:function(cate){
		var cateId = categories.findOne({_id:cate});
		return cateId.title;
	}
});
Template.manageShopLearnIt.events({
	'click #remove':function(e){
		e.preventDefault();
		var id = this._id;
		if(confirm("Are you sure that you want to delete this?")){
			Meteor.call('deleteShopLearnIt', id);
		}
	}
});
Template.addShopLearnIt.helpers({
	getCategories:function(){
		return categories.find();
	}
});
Template.addShopLearnIt.events({
	'click #btnAdd':function(){
		var category = Session.get('CATEGORYIT');
		var image = Session.get('IMAGEIT');
		var pdfImage = Session.get('IMAGEPDF');
		var obj = {
			cateID:category,
			image_id:image,
			pdfImage_id:pdfImage
		}
		Meteor.call('addShopLearnIt',obj,function(err){
			if(err)
				console.log("Error Add Shop Learn It: "+err.reason);
			else{
				console.log("Add Shop Learn It Success!");
				Session.set("IMAGEIT",undefined);
				Session.set("IMAGEPDF",undefined);
				Router.go("/manageshoplearnit");
			}
		});
	},
  	'change #category':function(e,tpl){
  		e.preventDefault();
  		var cate = tpl.$('#category').val();
  		Session.set("CATEGORYIT",cate);
  	},
	'change #image': function(e, tpl) {
		e.preventDefault();
	    var files = e.target.files;
	    for (var i = 0, ln = files.length; i < ln; i++) {
	      	images.insert(files[i], function (err, fileObj) {
		      	Session.set('IMAGEIT',fileObj._id);
	  		});
    	}
  	},
  	'change #pdf_image': function(e, tpl) {
		e.preventDefault();
	    var files = e.target.files;
	    for (var i = 0, ln = files.length; i < ln; i++) {
	      	images.insert(files[i], function (err, fileObj) {
		      	Session.set('IMAGEPDF',fileObj._id);
	  		});
    	}
  	}
});