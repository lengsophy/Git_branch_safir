Session.set('compteur',0);
Session.set('rank','');
Session.set('quickview','');
Template.reward.helpers({	
	membership:function(){
		var point=Meteor.users.findOne({_id:Meteor.userId()}).profile.shipcard.point;
		var resultmembership=membership.find();
        var arrmem=[];
        resultmembership.forEach(function(value){
            if(value.minpoint <= point && point <=value.maxpoint){
                arrmem.push(value);
            }
        });
        if(arrmem[0].name=='black'){
            return 'black';
        }
        if(arrmem[0].name=='silver'){
            return 'silver';
        }
        if(arrmem[0].name=='gold'){
            return 'gold';
        }
	},
	short: function(count){
		return count.substr(0,20);
	},
	getCount: function(){
		var cc=Session.get('compteur');
		cc=Number(cc);
		cc=cc+1;
		Session.set('compteur',cc);
		return cc;
	},
	getpoint: function(){
		var me=Meteor.user();
		if(me==null)
			return;
		if(typeof me.profile.shipcard != "undefined")
			return me.profile.shipcard.point;
		else
			return 0;
	},
	isBronze: function(){
		if(Session.get('rank')==''){
			var me=Meteor.user();
			console.log('Getting user'+JSON.stringify(me));
		if(typeof me.profile.shipcard != "undefined")
			var point=Number(me.profile.shipcard.point);
		else
			point=0;

		console.log('ISBRONZEPOINT:'+point);
		if(point>=0 && point<1000){
			Session.set('rank','BRONZE');
			//$('#ranking').addClass("backpt");
		}
		else if(point>=1000 && point <10000){
			Session.set('rank','SILVER');
			//$('#ranking').addClass("backptsilver");
		}
  			
  		else{
  			//$('#ranking').addClass("backptgold");
  			Session.set('rank','GOLD');
  		}
  		console.log('rank:'+Session.get('rank'));
		}
		if(Session.get('rank')=='BRONZE')
			return true;
		else
			return false;
	},
	isSilver: function(){
		if(Session.get('rank')==''){
			var me=Meteor.user();
			console.log('Getting user ISSILVER');
		if(typeof me.profile.shipcard != "undefined")
			var point=Number(me.profile.shipcard.point);
		else
			point=0;

		console.log('POINT:'+point);
		if(point>=0 && point<1000){
			Session.set('rank','BRONZE');
			//$('#ranking').addClass("backpt");
		}
		else if(point>=1000 && point <10000){
			Session.set('rank','SILVER');
			//$('#ranking').addClass("backptsilver");
		}
  			
  		else{
  			//$('#ranking').addClass("backptgold");
  			Session.set('rank','GOLD');
  		}
  		console.log('rank:'+Session.get('rank'));
		}
		if(Session.get('rank')=='SILVER')
			return true;
		else
			return false;
	},
	isGold: function(){
		if(Session.get('rank')==''){
			var me=Meteor.user();
			console.log('Getting user ISGOLD');
		if(typeof me.profile.shipcard != "undefined")
			var point=Number(me.profile.shipcard.point);
		else
			point=0;

		console.log('POINT:'+point);
		if(point>=0 && point<1000){
			Session.set('rank','BRONZE');
			//$('#ranking').addClass("backpt");
		}
		else if(point>=1000 && point <10000){
			Session.set('rank','SILVER');
			//$('#ranking').addClass("backptsilver");
		}
  			
  		else{
  			//$('#ranking').addClass("backptgold");
  			Session.set('rank','GOLD');
  		}
  		console.log('rank:'+Session.get('rank'));
		}
		if(Session.get('rank')=='GOLD')
			return true;
		else
			return false;
	},
	isGold: function(){
		if(Session.get('rank')==''){
				var me=Meteor.user();
				console.log('Getting user ISSILVER');
			if(typeof me.profile.shipcard != "undefined")
				var point=Number(me.profile.shipcard.point);
			else
				point=0;
			return point;
		}
	},
	getproduct:function(){
		var me=Meteor.user();
		if(typeof me.profile.shipcard != "undefined")
			var point=Number(me.profile.shipcard.point);
		else
			point=0;
		
		//console.log('MyResult:'+point);
		var p = Number(point);
		console.log('MyResult:'+p);
			//var result = products.find({point:{$gte:0,$lte:p}});
			var result = products.find({point:p});

			console.log("NB result: "+result.fetch().length);
			return result;
		
	},
	getproductreward:function(){
		result = products.find({category:"tester"});
		return result;
	},
	getprofile:function(){
        var id = Meteor.userId();
        return Meteor.users.findOne({_id:id});
    },
	getSelectedProduct: function(){
        var id=Session.get('quickview');
        if(id=='')
            return null;
        var currentProduct=products.find({"_id":id});
        return currentProduct;
    }
	
});


Template.rewardsilver.helpers({
	getpoint: function(){
		var id = Meteor.userId();
		return Meteor.users.find({_id:id});
	},
	getproduct:function(){
		var point = Meteor.user().profile.shipcard.point;
		//console.log('MyResult:'+point);
		var p = Number(point);
		console.log('MyResult:'+p);
		var silver = 200;
		var gold = 300;
		var result = products.find({point:{$gte:silver,$lte:p}});
		return result;
	}
});
Template.rewardgold.helpers({
	getpoint: function(){
		var id = Meteor.userId();
		return Meteor.users.find({_id:id});
	},
	getproduct:function(){
		var point = Meteor.user().profile.shipcard.point;
		//console.log('MyResult:'+point);
		var p = Number(point);
		console.log('MyResult:'+p);
		var gold = 300;
		var result = products.find({point:{$gte:gold,$lte:p}});
		return result;
	}
});

Template.reward.events({
	'click #quickbtn': function(e,tpl){
        var productId=this._id;
        Session.set('quickview',productId);
    },
    //  'mouseover .thumbnail': function(e,tpl){
    //     $(e.currentTarget).find('.caption').slideDown(250);

    // },
    //  'mouseleave .thumbnail': function(e,tpl){
    //     $(e.currentTarget).find('.caption').slideUp(250);
    // },
    'click #addtocart':function(e,tpl){       
        e.preventDefault();
        var id_product=this._id;
    alert(id_product);
        var qty=tpl.$("#qty").val();
        var attribute=Session.get('selected_attr');
        if(attribute=='No attribute')
            attribute='';   
        var userId = Session.get('userId');
        var selectPrice=Session.get('selected_price');
        var subtotal = 0;

        var sameproduct = cart.find({ id_product:id_product, userId:userId,attribute:attribute}).fetch();
        
        if( sameproduct.length>0){
            sameproduct=sameproduct[0];
            var pro = products.findOne({_id:id_product});
            upqty = parseInt( sameproduct.quantity ) + parseInt(qty);
            if( pro ){
                subtotal = upqty * parseInt(Session.get('selected_price'));
            }
            console.log('update of the cart');
            var obj={quantity: upqty, subtotal:subtotal};
            Meteor.call('updateStatus',sameproduct._id,obj);
            if(TAPi18n.getLanguage()=='fa'){
            	Bert.alert('قرار دادن افزودن به سبد خرید موفقیت!','success','growl-bottom-right');
            }else{
            	Bert.alert('Insert Add To Cart success!','success','growl-bottom-right');
            }
            $('.close').click();
            Router.go("/checkout");
        }else{
            var pro = products.findOne({_id:id_product});
            if( pro ){
                subtotal = parseInt(qty) * parseInt(Session.get('selected_price'));
            }
            else
                subtotal=0;
            var obj={
                id_product:id_product,
                userId:Session.get('userId'),
                quantity:qty,
                subtotal:subtotal,
                /*shop:shop,*/
                attribute:attribute,
                order_status:0
            };
            Meteor.call('addtocart',obj);
            if(TAPi18n.getLanguage()=='fa'){
            	Bert.alert('قرار دادن افزودن به سبد خرید موفقیت!','success','growl-bottom-right');
            }else{
            	Bert.alert('Insert Add To Cart success!','success','growl-bottom-right');
            }
            $('.close').click();
            Router.go("/checkout");
        }
    }     
});
Template.reward.rendered=function(){
	$("#quickbtn").click();
};


