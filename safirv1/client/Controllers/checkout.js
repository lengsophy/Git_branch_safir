Session.set("total", 0);
Template.checkout.helpers({
    resNum: function() {
        return Random.id();
    },
    getCart: function() {
        var total = 0;
        var userId = Session.get('userId');
        mycart = cart.find({ "userId": userId });

        mycart.forEach(function(value, index) {
            total = total + value.subtotal;
        });
        Session.set("total", total);

        return mycart;
    },
    getProductInfo: function(productid) {
        return products.findOne({ _id: productid });
    },
    getImage: function(id) {
        var image = products.findOne({ _id: id }).image;

        var res = image.replace("uploads", "upload");
        return res;
    },
    getShopName: function(id) {
        return shops.findOne({ "_id": id }).name;
    },
    getProname: function(id) {
        return products.findOne({ _id: id }).title;
    },
    getPrice: function(id) {
        return products.findOne({ _id: id }).price;
    },
    getTotal: function() {
        return Session.get("total");
    },
    getImageid: function(id) {

        return products.findOne({ _id: id }).image;
    }
});
Template.checkout.events({
    "click #bank": function(e, tpl) {
        var resNum = $("#ResNum").val();
        var amount = $("#Amount").val();
        var t = Date.now();
        var user = Session.get('userId');
        var obj = {
            resNum: resNum,
            amount: amount,
            time: t,
            user: user
        };
        console.log('inserting payment:' + JSON.stringify(obj));
        Meteor.call('addPayment', obj);

    },
    "change #quantity": function(e, tmp) {
        var qty = $(e.currentTarget).val();
        var id = this._id; //$(e.currentTarget).attr("data-id");
        var productid = this.id_product;
        $(e.currentTarget).attr("pro-id");
        var pro = products.findOne({ _id: productid });
        var subtotal = 0;
        if (pro) {
            subtotal = parseInt(pro.price) * parseInt(qty);
        }
        Meteor.call('updateCart', id, qty, subtotal);


        var mycart = '';
        if (Meteor.userId()) {
            userid = Meteor.userId();
            if (userid) {
                mycart = cart.find({ $and: [{ order_status: 0 }, { userId: userid }] });
            }
        } else {
            userid = Session.get('userId');
            if (userid) {
                mycart = cart.find({ $and: [{ order_status: 0 }, { userId: userid }] });
            }
        }
        var total = 0;

        mycart.forEach(function(value, index) {
            total = total + value.subtotal;
        });
        Session.set("total", total);
        //Meteor._reload.reload();
    },
    "click .glyphicon-trash": function(e, tmp) {
        var id = this._id;
        return cart.remove({ _id: id });
    },
    'click #removecheckout': function(e) {
        e.preventDefault();
        var id = this._id;
        var itemid = $(e.currentTarget).attr("data-remove");
        if (Meteor.userId()) {
            userid = Meteor.userId();
        } else {
            userid = Session.get('userId');
        }
        Meteor.call('removemycheckout', id, function(err) {
            if (err)
                console.log("Error Remove Checkout: " + err.reason);
            else
                console.log("Remove Checkout Success!!!");
        });
    },
    'click #btnAdd': function(e) {
        e.preventDefault();
        var userid = Session.get('userId');
        // if(Meteor.userId()){
        // 	userid=Meteor.userId();
        // }
        mycart = cart.find({ userId: userid });
        var total = 0;
        if (mycart.count() > 0) {
            var allItems = [];
            mycart.forEach(function(value) {
                var item = {
                    "id_product": value.id_product,
                    "qty": value.quantity,
                    "shop": value.shop,
                    "attribute": value.attribute,
                    "subtotal": value.subtotal,
                    "order_status": 1
                };
                total = total + value.subtotal;
                allItems.push(item);
                Meteor.call('updateCartStatus', value._id);
            });
            Session.setPersistent('orderId', Random.id());
            var obj = {
                userid: Meteor.userId(),
                orderId: Session.get('orderId'),
                total: total,
                items: allItems,
                time: getTimestamp(),
                status: 'pending'
            }
            Meteor.call('insertOrder', obj);
            Router.go("/confirmorder");
        } else {
            alert('Please make order product to check out!');
        }
    }
});
Template.checkout.helpers({
    getprofile: function() {
        var id = Meteor.userId();
        return Meteor.users.findOne({ _id: id });
    },
    numberItemCart: function() {
        var totalItem = 0;
        var userId = Session.get('userId');
        mycart = cart.find({ userId: userId });

        console.log('cartid:' + userId);
        console.log('DJIBCARTING:' + mycart.count());
        mycart.forEach(function(value) {
            totalItem += parseInt(value.quantity);
        });
        return totalItem;
    }
});
Template.confirmorder.helpers({
    getprofile: function() {
        var id = Meteor.userId();
        return Meteor.users.findOne({ _id: id });
    },
    getAddress1: function() {
        var id = Meteor.userId();
        return Meteor.users.findOne({ _id: id }).profile.address;
    }
});

Template.confirmorder2.helpers({
    getTotal: function() {
        return Session.get("total");
    },
    resNum: function() {
        var res = Random.id();
        Meteor.call('saveInvoice', res, Session.get("total"));
        return res;
    }
});

Template.confirmorder.events({
    'click #btnshopcart': function(e) {
        e.preventDefault();
        var add = $("#oldAddress").text();
        if(add ==''){
            Bert.alert('Please enter a valid address', 'danger', 'growl-bottom-right');
        }else{
            Meteor.call('addAdress', Session.get('orderId'), add);
            Router.go("/confirmorder2");
        }        

    },
    'click #btnAdd': function(e) {
        e.preventDefault();
        var add = $("#newAddress").val();
        if(add == ''){
            Bert.alert('Please enter a valid address', 'danger', 'growl-bottom-right');
        }else{
            Meteor.call('addAdress', Session.get('orderId'), add);
            Router.go("/confirmorder2");
        }
    }
});

Template.confirmorder2.events({
    'click #btnUpdate': function(e) {
        var idorder = Session.get('orderId');
        var delivery = $('#sel1').val();
        var userId = Session.get('userId');
        Meteor.call('addDelivery', idorder, delivery, userId, Session.get('orderId'));
    }
});
