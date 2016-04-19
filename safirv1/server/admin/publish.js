Meteor.publish('adminorder', function() {
    return order.find({},{sort:{total:-1}});
});
Meteor.publish('adminattribute', function() {
    return attribute.find();
});
/*
Meteor.startup(function() {
 if(Meteor.isClient){
      return SEO.config({
        title: 'Manuel Schoebel - MVP Development',
        meta: {
          'description': 'Manuel Schoebel develops Minimal Viable Producs (MVP) for Startups'
        },
        og: {
          'image': 'http://manuel-schoebel.com/images/authors/manuel-schoebel.jpg' 
        }
      });
    }
});*/