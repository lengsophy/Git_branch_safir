Session.set('nbproducts','');
Session.set('querylimit',16);
Session.set('quickview','');
var processScroll = true;
$(window).scroll(function() {
	if (processScroll  && $(window).scrollTop() > $(document).height() - $(window).height() - 100) {
		processScroll = false;
		var oldLimit=Session.get('querylimit');
		oldLimit+=16;
		Session.set('querylimit',oldLimit);
		processScroll = true;
	}
});
Template.fav.helpers({
	    getListprice: function(oldId) {
        //console.log("oldID="+oldId);
        var attrprice = attribute.findOne({ "product": oldId });
        //console.log("OLDID="+oldId+'price='+attrprice.price);
        return attrprice;
    },
	 getAttribprice:function(oldId){
        //var attrprice = attribute.findOne({"product":oldId});
        //console.log('oldId='+oldId);
        Meteor.call('getAttrPrice',oldId,function(err,data){
            if(!err){
                var attr='.price'+data.product;
                $(attr).html('ریال '+data.price);
            }
        });
    },
	totalProducts: function(){
		return Session.get('allproducts');
	},
	nbproducts: function(){
		return Session.get('nbproducts');
	},
	isLiked: function(productId){
		if(Session.get('userId')){
			var ses=Session.get('userId');
			var data=  favorite.find({userId:ses});
			var object=[];
			var obj={};
			var found=false;
			data.forEach(function(entry) {
				var proid=entry.proId;
				if(proid==productId){
	            	//console.log(productId+'=>'+proid+ " favorite?");
	            	found=true;
	            }
	        });

			return found;
		}else{
			//console.log(productId+' isNotFavorite');
			return false;
		}

	},
	getBanner: function(){
		var result=categories.findOne({_id:Session.get('idBanner')}).bannercat;
		return result;
	},
	getimagebanner:function(){
		var result=banner.find({});
		return result;
	},
	getSelectedProduct: function(){
		var id=Session.get('quickview');
		if(id=='')
			return null;
		var currentProduct=products.find({"_id":id});
		return currentProduct;
	},
	getShop: function(){
		return shops.find({});
	},
	getShopname: function( id ){
		var shop = shops.findOne({_id:id });
		if( shop ) return shop.name; 
	}
	,
	getParentDetails: function(parent){
		alert(parent);
		var re = parentattr.findOne({"_id":parent});
		console.log("kokokoko "+re );
		return re;
	},
	getParentAttr: function(product){
		var list=[];
		console.log('cherche les attr de '+product);
	 	var result=attribute.find({"product":product})
		result.forEach(function(value){
			list.push(value);
		})
		console.log(list.length);
		var out=[];
		for(var i=0;i<list.length;i++){
			var contains=0;
			for(var j=0;j<out.length;j++)
				if(out[j].parent==list[i].parent)
					contains=1;
				if(contains==0)
					out.push(list[i]);
			}
			console.log('finish=='+JSON.stringify(out));
			return out;
	},
	getAllAttributes: function(productId,parent){
		var result=attribute.find({"product":productId,"parent":parent});
		if(result.count()<2){
			Session.set('removescroll',true);
			
		}else{
			Session.set('removescroll',false);
		}
		return result;
	}
});
Template.fav.events({
	'click #quickbtn':function(e,tpl){
		$('.modal-backdrop').remove();
	},
	'click #favorite':function(e,tpl){
		e.preventDefault();
		var id=this._id;
		var css=$(e.currentTarget).attr("class");
		if(css=="fa fa-heart red pull-right"){
			Meteor.call('deleteFavorite',id);
			if(TAPi18n.getLanguage()=='fa'){
				Bert.alert('محصولات از برگزیدن حذف شده است','success','growl-bottom-right');
			}else{
				Bert.alert('Product has been Removed from Favorite','success','growl-bottom-right');
			}
			$('.close').click();

		}else{
			if(Session.get('userId')){
				var obj={
					proId:id,
					userId:Session.get('userId')
				}
				Meteor.call('insertFavorite',obj);
				if(TAPi18n.getLanguage()=='fa'){
					Bert.alert('محصول شده است اضافه به مورد علاقه','success','growl-bottom-right');
				}else{
					Bert.alert('Product has been Add to Favorite','success','growl-bottom-right');
				}
				$('.close').click();

			}else{
				var newId=Random.id();
				Session.setPersistent('userId',newId);

				var obj={
					proId:id,
					userId:Session.get('userId')
				}

				Meteor.call('insertFavorite',obj);
				if(TAPi18n.getLanguage()=='fa'){
					Bert.alert('محصول شده است اضافه به مورد علاقه','success','growl-bottom-right');
				}else{
					Bert.alert('Product has been Add to Favorite','success','growl-bottom-right');
				}
				$('.close').click();

			}
		}

	},
	'click .more': function(e,tpl){
		var limit=Number(Session.get('querylimit'));
		limit=limit+16;
		Session.set('querylimit',limit);
	},
	/*'mouseover .thumbnail': function(e,tpl){
		$(e.currentTarget).find('.caption').slideDown(250);

	},
	'mouseleave .thumbnail': function(e,tpl){
		$(e.currentTarget).find('.caption').slideUp(250);
	},
	'click #quickbtn': function(e,tpl){
		var productId=this._id;
		Session.set('quickview',productId);
	},*/
	'click #addtocart':function(e,tpl){
		e.preventDefault();
		var id_product=this._id;
		var qty=tpl.$("#qty").val();
		var shop=tpl.$("#shop").val();
		var attribute='none';

		if(shop==''){
			alert("Please select a shop!");
			return;
		}
		if(attribute=='No attribute')
			attribute='';

		if(Meteor.userId()){
			var userId = Meteor.userId();
			Session.setPersistent('userId',userId);
		}
		else{
			if( Session.get('userId') == ""){
				var newId=Random.id();
				Session.setPersistent('userId',newId);
			}
			var userId = Session.get('userId');
		}	

		var subtotal = 0;

		var sameproduct = cart.findOne({ id_product:id_product, userId:userId, shop:shop})
		if( sameproduct){
			var pro = products.findOne({_id:id_product})
			upqty = parseInt( sameproduct.quantity ) + parseInt(qty);
			if( pro ){
				subtotal = upqty * parseInt(pro.price);
			}
			cart.update(sameproduct._id, {$set: {quantity: upqty, subtotal:subtotal}});
		}else{
			var pro = products.findOne({_id:id_product})
			if( pro ){
				subtotal = parseInt(qty) * parseInt(pro.price);
			}
			var obj={
				id_product:id_product,
				userId:Session.get('userId'),
				quantity:qty,
				subtotal:subtotal,
				shop:shop,
				attribute:attribute,
				order_status:0
			};
			cart.insert(obj);
			if(TAPi18n.getLanguage()=='fa'){
				Bert.alert('!محصول با موفقیت به سبد خرید اضافه','success','growl-bottom-right');
			}else{
				Bert.alert('Product successfully append to cart!','success','growl-bottom-right');
			}
			$('.close').click();
			//alert('Product successfully append to cart!'+userId);
		}	 
	},
	"click #name":function(e){
		e.preventDefault();
		Session.set("GETName",'name');    		
	},
	"click #price":function(e){
		e.preventDefault();
		Session.set("GETName",'price');
	},
	"click #bestSelling":function(e){
		e.preventDefault();
		Session.set("GETName",'sell');
	}

});

Template.details.rendered=function(){
	$("[rel='tooltip']").tooltip(); 
};


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
Template.fav.helpers({
   getallprice: function(oldId){
    var attrprice = attribute.findOne({"product":oldId});
    return attrprice;
}
});
Template.fav.events({
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

Template.fav.onRendered(function(){
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


