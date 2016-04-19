Session.set('querylimitsearch', 16);
Session.set('quickview', '');

var processScroll = true;
$(window).scroll(function() {
    if (processScroll && $(window).scrollTop() > $(document).height() - $(window).height() - 100) {
        processScroll = false;
        var oldLimit = Session.get('querylimitsearch');
        oldLimit += 16;
        Session.set('querylimitsearch', oldLimit);
        processScroll = true;
    }
});
Template.search.events({
    'click .tag': function(e) {
         var url = 'https://www.google-analytics.com/collect?v=1&t=event&tid=UA-71059459-2&cid=555&ec=search&ea=click&el=SearchByTag&ev=1';
        Meteor.call('eventCall', url, function(error, result) {
            if (error) {
                console.log('Analytic CLIENT ERRR');
                console.log(error);
            } else {
                console.log('Analytic CLIENT RESULT');
                console.log(result);
            }
        });
        var id = this._id + ";";
        var position = Session.get('search').indexOf(id);
        console.log(position);
        if (position < 0) {
            var newVal = Session.get('search') + this._id + ";";
            Session.set('search', newVal);
        } else {
            var newVal = Session.get('search').replace(this._id + ";", "");
            Session.set('search', newVal);
        }
        console.log("Search:" + Session.get('search'));
    },
    'click #favorite': function(e) {
        e.preventDefault();
        var id = this._id;
        console.log('id' + Session.get('userId'));
        if (Session.get('userId')) {
            var obj = {
                proId: id,
                userId: Session.get('userId')
            }

            Meteor.call('insertFavorite', obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.alert('محصول با موفقیت به مورد علاقه اضافه!', 'success', 'growl-bottom-right');
            } else {
                Bert.alert('Product successfully append to favorite!', 'success', 'growl-bottom-right');
            }
            $('.close').click();
            //alert('Product successfully append to favorite!');
        } else {
            var newId = Random.id();
            Session.setPersistent('userId', newId);

            var obj = {
                proId: id,
                userId: Session.get('userId')
            }

            Meteor.call('insertFavorite', obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.alert('محصول با موفقیت به مورد علاقه اضافه!', 'success', 'growl-bottom-right');
            } else {
                Bert.alert('Product successfully append to favorite!', 'success', 'growl-bottom-right');
            }
            $('.close').click();
            //alert('Product successfully added to favorite!');
        }
    }
});

Template.search.helpers({
    parentTag: function(category) {
        return parent_tags.find({ "category_id": category });
    },
    tags: function(parent) {
        return tags.find({ parent: parent });
    },
    search: function() {
        return Session.get('search');
    },
    refine: function() {
        return Session.get('refine');
    },
    rating: function() {
        return Session.get('rating');
    },
    filter: function(list, search, refine, rating) {
        console.log('list:' + list);
        console.log('search:' + search);
        console.log('rating:' + rating);
        console.log("rating.length: " + rating.length);
        var ids = list.split(";");
        var result;
        console.log("Refine: " + refine);
        if (refine.length > 0 || rating != "") {
            var min = parseInt(refine[0]);
            var max = parseInt(refine[1]);
            console.log("Min: " + min + "  /  Max:" + max);
            //console.log(rating);

            console.log("refine.length: " + refine.length);

            if (rating != "" && refine.length <= 0) {
                rating = parseInt(rating);
                result = products.find({ "review.grade": rating, 'title': { '$regex': search } });
                console.log("size1:" + result.fetch().length);
            } else if (refine.length > 0 && rating == "") {
                result = products.find({ "price": { $gte: min, $lte: max }, 'title': { '$regex': search } });
                console.log("size2:" + result.fetch().length);
            } else {
                rating = parseInt(rating);
                result = products.find({ "review.grade": rating, "price": { $gte: min, $lte: max }, 'title': { '$regex': search } });
                console.log("size3:" + result.fetch().length);
            }

        }
        //else if( refine.length > 0 )
        else {
            if (list == "") {
                result = products.find({ 'title': { '$regex': search } });
                console.log("size4:" + result.fetch().length);
            } else {
                result = products.find({ "tags": { $in: ids }, 'title': { '$regex': search } });
                console.log("size5:" + result.fetch().length);
            }
        }
        return result;
    }
});

/*Kis Search Product*/
Session.set('keyword', "");
Session.set('groupsearch', "");
Session.set("searchall", "");
Template.header.events({
    'click .kesearch': function(e) {
        e.preventDefault();
        var url = 'https://www.google-analytics.com/collect?v=1&t=event&tid=UA-71059459-2&cid=555&ec=search&ea=click&el=search&ev=1000';
        Meteor.call('eventCall', url, function(error, result) {
            if (error) {
                console.log('Analytic CLIENT ERRR');
                console.log(error);
            } else {
                console.log('Analytic CLIENT RESULT');
                console.log(result);
            }
        });
        var Search = $(".input-search").val();
        if (Search == '') {
            var currenturl = window.location.href
            Router.go(currenturl);
            Bert.alert('Please fill in search box!', 'success', 'growl-bottom-right');
            $('.close').click();
        } else {
            var key = $(".input-search").val();
            Session.set('keyword', key);
            if (Session.get('groupsearch') == '')
                Session.set('groupsearch', 10);
            Router.go('searchproduct');
            $('#textToSearch').val('');
        }
    },
    'click .searchselection': function(e, tpl) {

            var url = 'https://www.google-analytics.com/collect?v=1&t=event&tid=UA-71059459-1&cid=555&ec=search&ea=click&el=searchBySelection&ev=1000';
            Meteor.call('eventCall', url, function(error, result) {
                if (error) {
                    console.log('Analytic CLIENT ERRR');
                    console.log(error);
                } else {
                    console.log('Analytic CLIENT RESULT');
                    console.log(result);
                }
            });
            $(e.currentTarget).css("color", "red");
            $(e.currentTarget).parent().nextAll('li').children('a').removeAttr("style");
            $(e.currentTarget).parent().prevAll('li').children('a').removeAttr("style");

        // var url = 'https://www.google-analytics.com/collect?v=1&t=event&tid=UA-71059459-2&cid=555&ec=search&ea=click&el=searchBySelection&ev=1000';
        // Meteor.call('eventCall', url, function(error, result) {
        //     if (error) {
        //         console.log('Analytic CLIENT ERRR');
        //         console.log(error);
        //     } else {
        //         console.log('Analytic CLIENT RESULT');
        //         console.log(result);
        //     }
        // });

        // $(e.currentTarget).css( "color", "red" );
        // $(e.currentTarget).parent().nextAll('li').children('a').removeAttr("style"); 
        // $(e.currentTarget).parent().prevAll('li').children('a').removeAttr("style"); 
        
        var isOn = true;
        var id = $(e.currentTarget).attr("data-group");
        var getcurretmenu = $(e.currentTarget).attr("id");
        Session.set("getcurretmenu", getcurretmenu);
        Session.set('groupsearch', id);
        console.log('searching: ' + id);
        console.log("visal :" + isOn);
        if (isOn) {
            $('.search').css("width", '44%');
            $(".search-push-left").hide();
            isOn = true;
            $("#btn-all").attr("data-group",0)
        } else {
            $('.search').css("width", '60%');
            $(".search-push-left").show();
            isOn = false;
            $("#btn-all").attr("data-group",1)
        }
        return true;
        // $(".search-push-left").toggle();
        // $('.search').css("width", '44%');
    },
    'click #btn-all': function(e) {
            var isOn = $(e.currentTarget).attr("data-group");
            var mycurrentmenu = Session.get("getcurretmenu");
            
            if (isOn  == 0) {
                $('.search').css("width", '60%');
                $(".search-push-left").show();
                console.log("can not change style" + isOn);
                $(e.currentTarget).attr("data-group",1)
            } else {
                $('.search').css("width", '44%');
                $(".search-push-left").hide();
                console.log("can  change style" + isOn);
               $(e.currentTarget).attr("data-group",0)
            }
        }

});

Template.searchproduct.events({
    'click #quickbtn': function(e, tpl) {
        var productId = this._id;
        Session.set('quickview', productId);
    },
    'mouseover .thumbnail': function(e, tpl) {
        $(e.currentTarget).find('.caption').slideDown(250);

    },
    'mouseleave .thumbnail': function(e, tpl) {
        $(e.currentTarget).find('.caption').slideUp(250);
    },
    'click #quickbtn': function(e, tpl) {
        var productId = this._id;
        Session.set('quickview', productId);
    },
    'click #addtocart': function(e, tpl) {
        e.preventDefault();
        var url = 'https://www.google-analytics.com/collect?v=1&t=event&tid=UA-71059459-2&cid=555&ec=purchase&ea=click&el=addTocartAtSearchPage&ev=1000';
        Meteor.call('eventCall', url, function(error, result) {
            if (error) {
                console.log('Analytic CLIENT ERRR');
                console.log(error);
            } else {
                console.log('Analytic CLIENT RESULT');
                console.log(result);
            }
        });
        var id_product = this._id;
        var qty = tpl.$("#qty").val();
        var attribute = Session.get('selected_attr');
        if (attribute == 'No attribute')
            attribute = '';
        var userId = Session.get('userId');
        var selectPrice = Session.get('selected_price');
        var subtotal = 0;

        var sameproduct = cart.find({ id_product: id_product, userId: userId, attribute: attribute }).fetch();

        if (sameproduct.length > 0) {
            sameproduct = sameproduct[0];
            var pro = products.findOne({ _id: id_product });
            upqty = parseInt(sameproduct.quantity) + parseInt(qty);
            if (pro) {
                subtotal = upqty * parseInt(Session.get('selected_price'));
            }
            console.log('update of the cart');
            var obj = { quantity: upqty, subtotal: subtotal };
            Meteor.call('updateStatus', sameproduct._id, obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.alert('درج افزودن به سبد خرید موفقیت', 'success', 'growl-bottom-right');
            } else {
                Bert.alert('Insert Add To Cart success', 'success', 'growl-bottom-right');
            }
            $('.close').click();
            Router.go("/checkout");
        } else {
            var pro = products.findOne({ _id: id_product });
            if (pro) {
                subtotal = parseInt(qty) * parseInt(Session.get('selected_price'));
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
                Bert.alert('درج افزودن به سبد خرید موفقیت', 'success', 'growl-bottom-right');
            } else {
                Bert.alert('Insert Add To Cart success', 'success', 'growl-bottom-right');
            }
            $('.close').click();
            Router.go("/checkout");
        }
    }
});

Template.searchproduct.helpers({
    getSelectedProduct: function() {
        var id = Session.get('quickview');
        if (id == '')
            return null;
        var currentProduct = products.find({ "_id": id });
        return currentProduct;
    },
    getAttribprice: function(oldId) {
        //var attrprice = attribute.findOne({"product":oldId});
        Meteor.call('getAttrPrice', oldId, function(err, data) {
            if (!err) {
                var attr = '.price' + data.product;
                $(attr).html('ریال ' + data.price);
            }
        });
    },
    nbproducts: function() {
        return Session.get('nbproducts');
    },
    nbcontents: function() {
        return Session.get('nbcontents');
    },
    displayContent: function() {
        if (Number(Session.get('nbcontents')) > 0)
            return true;
        else
            return false;
    },
    displayproduct: function() {
        if (Number(Session.get('nbproducts')) > 0)
            return true;
        else
            return false;
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
});

Template.header.rendered = function() {
    $(document).ready(function() {
        $(".slide-toggle").click(function() {
            $(".box-inner").toggle();
        });

        $('#textToSearch').keypress(function(e) {
            var code = e.keyCode || e.which;
            if (code == 13) { //Enter keycode
                e.preventDefault();
                var Search = $('#textToSearch').val();
                if (Search == '') {
                    if (TAPi18n.getLanguage() == 'fa') {
                        Bert.alert('لطفا در کادر جستجو را پر کنید!', 'success', 'growl-bottom-right');
                    } else {
                        Bert.alert('Please fill in search box!', 'success', 'growl-bottom-right');
                    }
                    $('.close').click();

                } else {
                    Session.set('keyword', Search);
                    if (Session.get('groupsearch') == '')
                        Session.set('groupsearch', 10);
                    var url = "/searchproduct" + "/" + Search;
                    Router.go(url);
                    $('#textToSearch').val('');

                }
            }
        });
    });
}
