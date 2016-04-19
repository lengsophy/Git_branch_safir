var datapage = '';
var router = '';
var tempname = '';
if( Meteor.isServer){
	var page = pages.find({});
	if( page.count() > 0){
		page.forEach( function(data, index){
			/*router = data.router;
			tempname = data.tempname;
			Router.map(function () {
			  this.route(tempname, {
			    	path: '/' + router
				});
			});*/
		})
	}
}
Router.map(function () {
  this.route('newarrival', {
    	path: '/newarrival',
    	waitOn: function() {
    		return [Meteor.subscribe( "pages" ), Meteor.subscribe( 'productsPage')];
    	}
	});
});
Router.map(function () {
  this.route('bestselling', {
    	path: '/bestselling',
    	waitOn: function() {
    		return [Meteor.subscribe( "pages" ), Meteor.subscribe( 'productsPage')];
    	}
	});
});
Router.map(function () {
  this.route('ideagift', {
    	path: '/ideagift',
    	waitOn: function() {
    		return [Meteor.subscribe( "pages" ), Meteor.subscribe( 'productsPage')];
    	}
	});
});