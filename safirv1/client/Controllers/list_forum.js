Session.set('loadlimit',20);
var processScroll = true;
$(window).scroll(function() {
    if (processScroll  && $(window).scrollTop() > $(document).height() - $(window).height() - 100) {
        processScroll = false;
    var oldLimit=Session.get('loadlimit');
    oldLimit+=10;
    Session.set('loadlimit',oldLimit);
    processScroll = true;
}
});
//list forum
Template.listForum.helpers({
    allForums: function(){
        //return posts.find({});
        return posts.find({parentId:"0"},{limit:Session.get('loadlimit')});
    },
    getallForum: function(){
        //return posts.find({});
        var selectCategory = Session.get('SELECTCATEGORY');
        console.log('List by Category:'+selectCategory);
        var forum = '';
        if( selectCategory !='' ){
            forum = posts.find({parentId:"0",category:selectCategory},{sort: {date: -1}});
        }else{
            forum = posts.find({parentId:"0"},{sort: {date: -1}});
        }
        if( forum.count() <= 0) var status = false;
        else var status = true;
        //else $('#listing').html('');

        return {status:status, data:forum};
    }/*,
     getprofile:function( userId ){
        console.log('user:'+userId);
        var user = Meteor.users.findOne({_id:userId});
        //return user.profile.firstname;
        if(typeof user !='undefined' ){
            if(typeof user.image !='undefined'){
                return {status:true, imageId:user.image}
            }else{
                return {status:false};    
            }
        }else{
             return {status:false}; 
        }
        
    }*/,
    getImage: function(id){
            var img = images.findOne({_id:id});
            console.log(img);
            if(img){
                console.log(img.copies.images.key);
                return img.copies.images.key;
            }
            else{
                return;
            }
    },
    getReply: function(id){
        //var id = Meteor.userId();
        var data = posts.find({parentId:id});
        var counts = data.count();
        return counts;
    },
    listallmyforums: function(){
        var userid=Meteor.userId();
        return posts.find({userId:userid, parentId:"0"}); //get user logged in
    },
    listallmessagereply: function(){
        var time = new Date();
        var userid=Meteor.userId();
        return posts.find({userId:userid,parentId:{$not:"0"}}); //get user logged in
    },
    getProfilename: function( userId ){
        var user = Meteor.users.findOne({_id:userId});
        if(typeof user !='undefined' ){
            return user.profile.firstname
        }else return;
    },
    listCategory: function(){
        return categories.find();
    },
    displayCategory: function(cat){
        console.log("ID CAT "+cat);
        var cat = categories.findOne({_id:cat});
        if(typeof cat !='undefined' ) return cat.title
        else return;
    },

    webzineRelated: function(){
        
        var webzine =  contents.find({typeid:contents_type.findOne({type:'Webzine'})._id},{limit:2});
        console.log('Webzine:'+webzine.count());
        return webzine;
    }
});
Session.set('SELECTCATEGORY','');
Template.listForum.events({
    'change .selectpicker': function(e){
        e.preventDefault();
        var catid = $(e.currentTarget).val();
        Session.set('SELECTCATEGORY',catid);
    },
    'change #topicname':function(e){
        e.preventDefault();
        var myTopic = $('#topicname').val();
        Session.set('topic',myTopic);
    },

});
// list all forum  user logged in
Template.myforum.helpers({
    listallmyforums: function(){
        // return posts.find();
        var userId=Meteor.userId();
        return posts.find({userId:userId}); //get user logged in
    },
    getImage: function(id) {
        var img = images.findOne({
            _id: id
        });
        if (img) {
            console.log(img.copies.images.key);
            return img.copies.images.key;
        } else {
            return;
        }
    }
});
Template.myforum.events({
    'click #delete': function(){
        var user_id = Meteor.userId();
        var id = this._id;
        Meteor.call('deleteForum',id,user_id);
    }
});

Template.forumDetail.helpers({
    listReply: function(){
        var id = this._id;
        return posts.find({parentId:id});
    },
    getName: function(){
        return Meteor.users.find({});
    },
    getCateName:function(cate){
        return categories.findOne({_id:cate}).title;
    }/*,
    getprofile:function( userId ){
        console.log('user:'+userId);
        var user = Meteor.users.findOne({_id:userId});
        console.log(user);
        if(typeof user !='undefined' ){
            if(typeof user.image !='undefined'){
                return {status:true, imageId:user.image}
            }else{
                return {status:false};    
            }
        }else{
             return {status:false}; 
        }
        
    },*/
});
Template.addPost.events({
  'submit form': function(e,tpl){
    e.preventDefault();
    var id = Meteor.userId();
    var topic = $('#topic').val();
    var description = $('#description').val();
    /*var d = new Date();
    var date = d.getDate();
    var year = d.getFullYear();
    var month = d.getMonth()+1;
    var time = date+"-"+month+"-"+year;*/
    var time = (new Date()).getTime();
    
    var parent_id = "0";
    var category = $('#categoryid').val();
    if(Meteor.user()){
      Meteor.call('addPost', id,parent_id,topic,description,time,category, function(err){
        if(err){
          console.log(err.reason);
        }else{
          console.log("Success");
          Router.go('/forum/listing');
        }
      });
    }else{
      Router.go("/login");
    }
  
  },
    'change #image': function(event, template) {
    var files = event.target.files;
    for (var i = 0, ln = files.length; i < ln; i++) {
      images.insert(files[i], function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
       // alert("sess"+fileObj._id)
        Session.set('ADDIMAGEID', fileObj._id);
      });
    }
  },
  
});

Template.forumDetail.events({
    'click .send': function(e,tpl){
    e.preventDefault();
    var userid = Meteor.userId();
    var description = $('#description').val();
    var time = new Date();
    //var time = (new Date()).getTime();
    var id = this._id;
    var forum = posts.findOne({_id:id});
    var categoryid = (forum)? forum.category:'';
    var image = Session.get("ADDIMAGEID");
    Meteor.call('addReply', userid,id,description,categoryid,time,image,status, function(err){
      if(err){
        console.log(err.reason);
      }else{
        console.log("Success");
      }
    });
  },
    'change #image': function(event, template) {
    var files = event.target.files;
    for (var i = 0, ln = files.length; i < ln; i++) {
      images.insert(files[i], function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
       // alert("sess"+fileObj._id)
        Session.set('ADDIMAGEID', fileObj._id);
      });
    }
  }
});

Template.addPost.onRendered( function() {
 $( "#addPost" ).validate({
    rules: {
      topic: {
        required: true
      },
      description: {
        required: true
      }
    },
    messages: {
      topic: {
        required: "<p style='color:#FF0000;'>Please enter your forum topic!</p>"
      },
      description: {
        required: "<p style='color:#FF0000;'>Please enter your forum description!</p>"
      }
    }
  });
});

Template.reply.onRendered( function() {
 $( "#addReply" ).validate({
    rules: {
      topic: {
        required: true
      },
      description: {
        required: true
      }
    },
    messages: {
      topic: {
        required: "<p style='color:#FF0000;'>Please enter your forum topic!</p>"
      },
      description: {
        required: "<p style='color:#FF0000;'>Please enter your forum description!</p>"
      }
    }
  });
});

Template.addPost.helpers({
    listCategory: function(){
        return categories.find({});
    }
});

Template.forumDetail.events({
  'click #reply': function(){
      $("#form").css("visibility","visible");
  }
});