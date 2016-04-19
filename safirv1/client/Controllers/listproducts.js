Session.set('nbproducts', '');
Session.set('querylimit', 16);
Session.set('quickview', '');

var processScroll = true;
$(window).scroll(function() {
    if (processScroll && $(window).scrollTop() > $(document).height() - $(window).height() - 100) {
        processScroll = false;
        var oldLimit = Session.get('querylimit');
        oldLimit += 16;
        Session.set('querylimit', oldLimit);
        processScroll = true;
    }
});

Template.listproducts.helpers({
    getListprice: function(oldId) {
        var attrprice = attribute.findOne({ "product": oldId });
        return attrprice;
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
    totalProducts: function() {
        return Session.get('allproducts');
    },
    nbproducts: function() {
        return Session.get('nbproducts');
    },
    isLiked: function(productId) {
        if (Session.get('userId')) {
            var ses = Session.get('userId');
            var data = favorite.find({ userId: ses });
            var object = [];
            var obj = {};
            var found = false;
            data.forEach(function(entry) {
                var proid = entry.proId;
                if (proid == productId) {
                    found = true;
                }
            });

            return found;
        } else {
            return false;
        }

    },
    getBanner: function() {
        var result = categories.findOne({ _id: Session.get('idBanner') }).bannercat;
        return result;
    },
    getimagebanner: function() {
        var result = banner.find({});
        return result;
    },
    /*getSelectedProduct: function(){
    	var id=Session.get('quickview');
    	if(id=='')
    		return null;
    	var currentProduct=products.find({"_id":id});
    	return currentProduct;
    },*/
    getShop: function() {
        return shops.find({});
    },
    getShopname: function(id) {
        var shop = shops.findOne({ _id: id });
        if (shop) return shop.name;
    },
    checkBanner: function( param ){
        console.log('Param:'+param)
        if( typeof param !='undefined' && param !='') return true;
        else return false;
    }
});
Template.listproducts.events({
    'click #quickbtn': function(e, tpl) {
        $('.modal-backdrop').remove();
    },
    'click #favorite': function(e, tpl) {
        e.preventDefault();
        var id = this._id;
        var css = $(e.currentTarget).attr("class");
        if (css == "fa fa-heart red pull-right") {
            Meteor.call('deleteFavorite', id);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.alert('محصولات از برگزیدن حذف شده است', 'success', 'growl-bottom-right');
            } else {
                Bert.alert('Product has been Removed from Favorite', 'success', 'growl-bottom-right');
            }
            $('.close').click();

        } else {
            if (Session.get('userId')) {
                var obj = {
                    proId: id,
                    userId: Session.get('userId')
                }
                Meteor.call('insertFavorite', obj);
                if (TAPi18n.getLanguage() == 'fa') {
                    Bert.alert('محصول شده است اضافه به مورد علاقه', 'success', 'growl-bottom-right');
                } else {
                    Bert.alert('Product has been Add to Favorite', 'success', 'growl-bottom-right');
                }
                $('.close').click();

            } else {
                var newId = Random.id();
                Session.setPersistent('userId', newId);

                var obj = {
                    proId: id,
                    userId: Session.get('userId')
                }

                Meteor.call('insertFavorite', obj);
                if (TAPi18n.getLanguage() == 'fa') {
                    Bert.alert('محصول شده است اضافه به مورد علاقه', 'success', 'growl-bottom-right');
                } else {
                    Bert.alert('Product has been Add to Favorite', 'success', 'growl-bottom-right');
                }
                $('.close').click();

            }
        }

    },
    'click .more': function(e, tpl) {
        var limit = Number(Session.get('querylimit'));
        limit = limit + 16;
        Session.set('querylimit', limit);
    },
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
    'click #addtocart': function(e, tpl) {
        e.preventDefault();
        var id_product = this._id;
        var qty = tpl.$("#qty").val();
        var attribute = Session.get('selected_attr');
        if (attribute == 'No attribute')
            attribute = '';
        var userId = Session.get('userId');
        var subtotal = 0;

        var sameproduct = cart.find({ id_product: id_product, userId: userId, attribute: attribute }).fetch();

        if (sameproduct.length > 0) {
            sameproduct = sameproduct[0];
            var pro = products.findOne({ _id: id_product });
            upqty = parseInt(sameproduct.quantity) + parseInt(qty);
            if (pro) {
                subtotal = upqty * parseInt(Session.get('priceAttr'));
            }
            console.log('update of the cart');
            var obj = { quantity: upqty, subtotal: subtotal };
            Meteor.call('updateStatus', sameproduct._id, obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.alert('درج افزودن به سبد خرید موفقیت', 'success', 'growl-bottom-right');
            } else {
                 Bert.alert(' محصول با موفقیت به سبد کالا اضافه شد ', 'success', 'growl-bottom-right');
            }
            $('.close').click();
            Router.go("/checkout");
        } else {
            var pro = products.findOne({ _id: id_product });
            if (pro) {
                subtotal = parseInt(qty) * parseInt(Session.get('priceAttr'));
            } else
                subtotal = 0;
            var obj = {
                id_product: id_product,
                userId: Session.get('userId'),
                quantity: qty,
                subtotal: subtotal,
                /*shop:shop,*/
                attribute: attribute,
                order_status: 0
            };
            Meteor.call('addtocart', obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.alert('محصول با موفقیت به سبد کالا اضافه شد', 'success', 'growl-bottom-right');
            } else {
                Bert.alert(' محصول با موفقیت به سبد کالا اضافه شد ', 'success', 'growl-bottom-right');
            }
            $('.close').click();
            Router.go("/checkout");
        }
    },
    "click #name": function(e) {
        e.preventDefault();
        Session.set("GETName", 'name');
    },
    "click #price": function(e) {
        e.preventDefault();
        Session.set("GETName", 'price');
    },
    "click #bestSelling": function(e) {
        e.preventDefault();
        Session.set("GETName", 'sell');
    }

});

Template.details.rendered = function() {
    $("[rel='tooltip']").tooltip();
};