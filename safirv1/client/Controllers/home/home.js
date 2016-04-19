Session.set('quickview','');

Template.home.rendered=function(){
	//$('#ca-container').contentcarousel();
	//$('#ca-container1').contentcarousel();
	//$('#ca-container2').contentcarousel();
    item1 = 0,counter1 = 0, item2 = 0, counter2 = 0, item3 = 0, counter3 = 0;								
};
var item = 0;
Template.home.helpers({
	list1: function(){
		return list_product.find().fetch()[0];
	},
	list2: function(){

		return list_product.find().fetch()[1];
	},
	list3: function(){

		return list_product.find().fetch()[2];
	},
    Deal: function(){
        var data = locations.findOne({type:'Deal'});

        if( data ){
            var id = data.productid;
            return {products: id}
        }
    },
	getProduct: function(id){
		var result =  products.findOne({"_id":id});
		return result;
	},
	contents : function(){
		var type=contents_type.findOne({"type":"Webzine"});
		if(type!=null)
			return contents.find({"typeid":type._id});
	},
	getContentImg: function(id){
		var p=contents.findOne({_id:id});
		if(p.image instanceof Array)
			return p.image[0];
		else
			return p.image;
	},
    getAttribprice: function(oldId) {
        Meteor.call('getAttrPrice', oldId, function(err, data) {
            if (!err) {
                var attr = '.price' + data.product;
                $(attr).html('ریال ' + data.price);
                Session.set('priceAttr',data.price);
            }
        });
    },
    getQuickLink: function(){
        var data = locations.find({type:'Quicklinks'},{sort:{order:1},limit:4});
        console.log('Quick:'+data.count());
        if( data.count() > 0 ){
            var quicklinkimage = '';
            var quicklink = ''
            var allQuicklink = '';
            var hasQuicklink = false;
            data.forEach( function(value, index){
                var img = getImg( value.image_id);
                if( index == 0){
                    quicklinkimage += '<div class="col-sm-8">';
                    quicklinkimage    += '<a href="'+value.link+'"><img class="img-responsive" src="'+img+'"></a>';
                    quicklinkimage += '</div>';
                }   
                else{
                    quicklink += '<li><a href="'+value.link+'">'+value.name+'</a></li>';
                    hasQuicklink = true;
                }
               
            })
            if( hasQuicklink == true ){
                allQuicklink += quicklinkimage
                allQuicklink += '<div class="col-sm-4 text-center">';
                    allQuicklink += '<div class="quicklink">';
                        allQuicklink += '<h2><b>QUICK LINKS</b></h2>';
                        allQuicklink += '<ul class="nav">'+quicklink+'</ul>';
                    allQuicklink += '</div>';
                allQuicklink += '</div>';
                return allQuicklink;
            }
            else return;
            
        }
    },
    newsBlockProducts: function(){
        var data = locations.findOne({type:'News', order:1, productid:{$ne:""}});
        var numpro = 2;
        if( data ){
            var id = [];
            var html = '';
            //data.forEach( function(value, index){
                id = data.productid;
                //console.log(id);
                for(i=0; i< id.length; i++){
                    if( i < numpro){
                       
                        var result = products.findOne({_id:id[i]},{limit:1});
                        console.log(result);
                        if( result ){
                            
                            html += oneProduct(result, false, false);
                        }
                    }
                }
            //});
            return html;
        }
    }
	/*getSelectedProduct: function(){
        var id=Session.get('quickview');

        if(id=='')
            return null;

        var currentProduct=products.find({"_id":id});
        return currentProduct;
    }*/
});

Template.home.events({
	/*'click #quickbtn': function(e,tpl){
         e.preventDefault();
        var productId = $(e.currentTarget).attr('data-id');
        Session.set('quickview', productId);
    },*/
    /*'mouseover .thumbnail': function(e,tpl){
        $(e.currentTarget).find('.caption').slideDown(250);

    },
     'mouseleave .thumbnail': function(e,tpl){
        $(e.currentTarget).find('.caption').slideUp(250);
    },*/
     /*'click #quickbtn': function(e,tpl){
        var productId=this._id;
        Session.set('quickview',productId);
    },*/
    'click #addtocart':function(e,tpl){       
        e.preventDefault();
        var id_product=this._id;
        var qty=tpl.$("#qty").val();
        var attribute=Session.get('selected_attr');
        if(attribute=='No attribute')
            attribute='';   
        var userId = Session.get('userId');
        var subtotal = 0;

        var sameproduct = cart.find({ id_product:id_product, userId:userId,attribute:attribute}).fetch();
        
        if( sameproduct.length>0){
            sameproduct=sameproduct[0];
            var pro = products.findOne({_id:id_product});
            upqty = parseInt( sameproduct.quantity ) + parseInt(qty);
            if( pro ){
                subtotal = upqty * parseInt(pro.price);
            }
            console.log('update of the cart');
            var obj={quantity: upqty, subtotal:subtotal};
            Meteor.call('updateStatus',sameproduct._id,obj);
            Bert.alert('محصول با موفقیت به سبد کالا اضافه شد ','success','growl-bottom-right');
            $('.close').click();
            Router.go("/checkout");
        }else{
            var pro = products.findOne({_id:id_product});
            if( pro ){
                subtotal = parseInt(qty) * parseInt(pro.price);
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
            Bert.alert('محصول با موفقیت به سبد کالا اضافه شد ','success','growl-bottom-right');
            $('.close').click();
            Router.go("/checkout");
        }
    }     
});

