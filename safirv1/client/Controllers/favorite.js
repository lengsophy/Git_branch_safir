
Template.listpro.events({
    'click #favorite':function(e){
      e.preventDefault();
      var id=this._id;
      if(Session.get('userId')){
          var obj={
            proId:id,
            userId:Session.get('userId')
          }
        Meteor.call('insertFavorite',obj);          
      }
      else{
      	var newId=Random.id();
        Session.setPesistent('userId',newId);
        var obj={
              proId:id,
              userId:Session.get('userId')
            }
          Meteor.call('insertFavorite',obj);
          if(TAPi18n.getLanguage()=='fa'){
            Bert.alert('محصول شده است اضافه به مورد علاقه','success','growl-bottom-right');
          }else{
            Bert.alert('Product has been add to Favorite','success','growl-bottom-right');
          }
          $('.close').click();               
      }
    },
    'click #remove':function(e){
        var id=this._id;
        var obj=favorite.findOne({proId:id});
        favorite.remove(obj._id);
        if(TAPi18n.getLanguage()=='fa'){
          Bert.alert('محصول شده است به مورد علاقه حذف','success','growl-bottom-right');
        }else{
          Bert.alert('Product has been Removed to Favorite','success','growl-bottom-right'); 
        }
        $('.close').click();
    }
});

Template.listpro.helpers({
    favoriteList:function(){
    	if(Session.get('userId')){
    		var ses=Session.get('userId');
          var data=  favorite.find({userId:ses});
          var object=[];
          var obj={};
          data.forEach(function(entry) {
            var proid=entry.proId;
              obj=products.findOne({_id:proid})
              object.push(obj);                
           });
        return object;
    	}
         
    },
    getProduct:function(){
  		var result=products.find();
  		return result;
	  }
});
//==============favorite new
Template.searchproduct.events({
    /*'click #unlike':function(e){
        e.preventDefault();
        var unlike = '#unlike'+this._id;
        var like = '#like'+this._id;
        $(like).removeClass('nonelike');
        $(unlike).addClass('nonelike');
        if(Meteor.userId()){
            var userId=Meteor.userId();
          }else{
              var userId=Session.get('userId');
              if(!userId){
                  var newId=Random.id();
                  Session.setPersistent('userId',newId);
              }  
          } 
          var obj={
              proId:this._id,
              userId:userId
          }
        Meteor.call('insertFavoritee',obj); 
        if(TAPi18n.getLanguage()=='fa'){
          Bert.alert('محصول شده است اضافه به مورد علاقه','success','growl-bottom-right');
        }else{
          Bert.alert('Product has been add to Favorite','success','growl-bottom-right');
        }
        $('.close').click();      
    },
    'click #like':function(e){
        e.preventDefault();
        var unlike = '#unlike'+this._id;
        var like = '#like'+this._id;
        $(like).addClass('nonelike');
        $(unlike).removeClass('nonelike');
        if(Meteor.userId()){
                var userId=Meteor.userId();
        }else{
            var userId=Session.get('userId');
              
        }
        var obj=favorite.findOne({userId:userId},{proId:this._id});      
        favorite.remove(obj._id);
        if(TAPi18n.getLanguage()=='fa'){
          Bert.alert('محصول شده است به مورد علاقه حذف','success','growl-bottom-right');
        }else{
          Bert.alert('Product has been Removed from Favorite','success','growl-bottom-right');
        }
        $('.close').click();
    }*/
});

Template.searchproduct.onRendered(function(){
  var userId=Session.get('userId');
  if(Meteor.userId()){
    var userId=Meteor.userId();
  }
  var favoritelist=favorite.find({userId:userId});
  favoritelist.forEach(function(value){
    var like="#like"+value.proId;
    var unlike="#unlike"+value.proId;
    $(like).removeClass('nonelike');
    $(unlike).addClass('nonelike');
  });
});
Template.listproducts.helpers({
   getallprice: function(oldId){
    var attrprice = attribute.findOne({"product":oldId});
    return attrprice;
}
});
Template.listproducts.events({
/*'click .unlike':function(e){
        e.preventDefault();
        var unlike ='.unlike'+$(e.currentTarget).attr('data-id');
        var like = '.like'+$(e.currentTarget).attr('data-id');
        $(unlike).addClass('nonelike');
        $(like).removeClass('nonelike');    
        if(!Session.get('userId')){
            var newId=Random.id();
            Session.setPersistent('userId',newId);
        }             
        var userId=Session.get('userId');
        var obj={
            proId:this._id,
            userId:userId
        }
        Meteor.call('insertFavoritee',obj);
        if(TAPi18n.getLanguage()=='fa'){
          Bert.alert('محصول شده است اضافه به مورد علاقه','success','growl-bottom-right');
        }else{
          Bert.alert('Product has been add to Favorite','success','growl-bottom-right');
        }
        $('.close').click();
    },
    'click .like':function(e){
        e.preventDefault();
        var id=$(e.currentTarget).attr('data-id');
        var unlike ='.unlike'+$(e.currentTarget).attr('data-id');
        var like = '.like'+$(e.currentTarget).attr('data-id');
        $(like).addClass('nonelike');
        $(unlike).removeClass('nonelike');
        var userId=Session.get('userId');                    
        var obj=favorite.findOne({$and:[{userId:userId},{proId:id}]});       
        favorite.remove(obj._id);
        if(TAPi18n.getLanguage()=='fa'){
          Bert.alert('محصول شده است به مورد علاقه حذف','success','growl-bottom-right');
        }else{
          Bert.alert('Product has been Removed from Favorite','success','growl-bottom-right');
        }
        $('.close').click();
    }*/
});

Template.listproducts.onRendered(function(){
    var userId=Session.get('userId');
    var favoritelist=favorite.find({userId:userId});
    favoritelist.forEach(function(value){
      var like=".like"+value.proId;
      var unlike=".unlike"+value.proId;
      $(like).removeClass('nonelike');
      $(unlike).addClass('nonelike');
    });
});

Template.home.events({
    /*'click .unlike':function(e){
        e.preventDefault();
        var unlike ='.unlike'+$(e.currentTarget).attr('data-id');
        var like = '.like'+$(e.currentTarget).attr('data-id');
        $(unlike).addClass('nonelike');
        $(like).removeClass('nonelike');
          
        if(!Session.get('userId')){
            var newId=Random.id();
            Session.setPersistent('userId',newId);
        } 
        var userId=Session.get('userId');              
        var obj={
            proId:this._id,
            userId:userId
        }
        Meteor.call('insertFavoritee',obj);
        if(TAPi18n.getLanguage()=='fa'){
          Bert.alert('محصول شده است اضافه به مورد علاقه','success','growl-bottom-right');
        }else{
          Bert.alert('Product has been Add to Favorite','success','growl-bottom-right');
        }
        $('.close').click();
    },
    'click .like':function(e){
        e.preventDefault();
        var id=$(e.currentTarget).attr('data-id');
        var unlike ='.unlike'+$(e.currentTarget).attr('data-id');
        var like = '.like'+$(e.currentTarget).attr('data-id');
        $(like).addClass('nonelike');
        $(unlike).removeClass('nonelike');
        var userId=Session.get('userId');                   
        var obj=favorite.findOne({$and:[{userId:userId},{proId:id}]});      
        favorite.remove(obj._id);
        if(TAPi18n.getLanguage()=='fa'){
          Bert.alert('محصولات از برگزیدن حذف شده است','success','growl-bottom-right');
        }else{
          Bert.alert('Product has been Removed from Favorite','success','growl-bottom-right');
        }
        $('.close').click();
    }*/
});

Template.home.onRendered(function(){
    var userId=Session.get('userId');
    var favoritelist=favorite.find({userId:userId});
    favoritelist.forEach(function(value){
      var like=".like"+value.proId;
      var unlike=".unlike"+value.proId;
      $(like).removeClass('nonelike');
      $(unlike).addClass('nonelike');
    });
});
Template.suggestpages.onRendered(function(){
    var userId=Session.get('userId');
    var favoritelist=favorite.find({userId:userId});
    favoritelist.forEach(function(value){
      var like=".like"+value.proId;
      var unlike=".unlike"+value.proId;
      $(like).removeClass('nonelike');
      $(unlike).addClass('nonelike');
    });
});
Template.suggestpages.events({
    /*'click .unlike':function(e){
        e.preventDefault();
        var unlike ='.unlike'+$(e.currentTarget).attr('data-id');
        var like = '.like'+$(e.currentTarget).attr('data-id');
        $(unlike).addClass('nonelike');
        $(like).removeClass('nonelike');
          
        if(!Session.get('userId')){
            var newId=Random.id();
            Session.setPersistent('userId',newId);
        } 
        var userId=Session.get('userId');              
        var obj={
            proId:this._id,
            userId:userId
        }
        Meteor.call('insertFavoritee',obj);
        if(TAPi18n.getLanguage()=='fa'){
          Bert.alert('محصول شده است اضافه به مورد علاقه','success','growl-bottom-right');
        }else{
          Bert.alert('Product has been Add to Favorite','success','growl-bottom-right');
        }
        $('.close').click();
    },
    'click .like':function(e){
        e.preventDefault();
        var id=$(e.currentTarget).attr('data-id');
        var unlike ='.unlike'+$(e.currentTarget).attr('data-id');
        var like = '.like'+$(e.currentTarget).attr('data-id');
        $(like).addClass('nonelike');
        $(unlike).removeClass('nonelike');
        var userId=Session.get('userId');                   
        var obj=favorite.findOne({$and:[{userId:userId},{proId:id}]});      
        favorite.remove(obj._id);
        if(TAPi18n.getLanguage()=='fa'){
          Bert.alert('محصولات از برگزیدن حذف شده است','success','growl-bottom-right');
        }else{
          Bert.alert('Product has been Removed from Favorite','success','growl-bottom-right');
        }
        $('.close').click();
    }*/
});
