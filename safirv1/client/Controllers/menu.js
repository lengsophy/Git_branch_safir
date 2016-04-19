
Session.set('children1','');
Session.set('children2','');
Session.set('selected_menu','');

Template.header.helpers({
	getParent: function(){
		Session.get('LANG');
		var menu = categories.find({"$or":[{"parent":"0"},{"parent":" "}]}).map(function(document, index) {
			document.index = index + 1;
			return document;
		});
		Session.set('NUMMENU', menu.length);
		return menu;
	},
	getChildren: function(parent){
		Session.get('LANG');
		var children = categories.find({"parent":parent}).map(function(document, index) {
			document.index = index + 1;
			return document;
		});
		
		return children;
		/*if( children.length > 0 ){
			return {hasChildren:true, children: children}
		}else{
			return {hasChildren:false}
		}*/
	},
	column: function( parent ){
		Meteor.call('categoryChildren', parent, function(err, result){
	        if(!err) Session.set('CATEGORYCHILD'+result.id, result.data);
    	})
    	var result = Session.get('CATEGORYCHILD'+parent);
		
		if( result == true) return '4';
		else return '12';

	},
	changeLanguage: function(){
		if(TAPi18n.getLanguage()=='fa')
			return 'English';
		if(TAPi18n.getLanguage()=='en')
			return 'فارسی';
	}
});
Template.header.onRendered(function () {
//default font
	$('body').css('font-family','Nazanin Bold');
	var userId = Meteor.userId();
	var time = Date.now();
	var currenturl = window.location.href;
	if( !Session.get('userId') || Session.get('userId') == ""){
		var newId=Random.id();
		Session.setPersistent('userId',newId);
		console.log('Newid'+newId);
	}
	console.log('MY CART USER ID='+Session.get('userId'));

});
Template.footer.events({
	'mouseenter #footer':function(e){
		e.preventDefault();
		var userId = Meteor.userId();
		var time = Date.now();
		var currenturl = window.location.href
		var location = 'Footer';

	}
});
Template.header.events({
	'mouseenter #header':function(e){
		e.preventDefault();
		var userId = Meteor.userId();
		var time = Date.now();
		var currenturl = window.location.href
		var location = 'Header';

	},
	'click .menuclick':function(){
		var id = this._id;
		//alert(id);
		Session.set("MENUID",id);
	}

});
Template.mainLayout.events({
	'mouseenter #mainContent':function(e){
		e.preventDefault();
		var userId = Meteor.userId();
		var time = Date.now();
		var currenturl = window.location.href
		var location = 'Content';

	}
});


Template.header.events({
	'click #en':function(e,tpl){
		e.preventDefault();
		$('body').removeClass('modal-open');
		if(TAPi18n.getLanguage()=='fa'){
			var lang='en';			
			$("body").css("font-family","HelveticaNeue, sans-serif");
			
		}
		else{	

			var lang='fa';		
			$('body').css('font-family','Nazanin Bold');
			
		}
		
		Session.set('LANG',lang);
		//Global Variable when language change
		item1 = 0,counter1 = 0, item2 = 0, counter2 = 0, item3 = 0, counter3 = 0, countmenu = 0, down = 12;
		
		TAPi18n.setLanguage(lang).done(function () {
			Session.set("showLoadingIndicator", false);
		})
		.fail(function (error_message) {
        // Handle the situation
        console.log(error_message);
    	});

	},
	'click .kesearch': function(e,tpl){
		var search=tpl.$("#textToSearch").val();
		//Session.set('keyword',search);
		var url="/searchproduct"+"/"+search;
		Router.go(url);
		
	}

});