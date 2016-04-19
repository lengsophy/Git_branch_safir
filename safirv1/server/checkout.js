Meteor.methods({
    // shop 
    insertCart: function(obj) {
        order.insert(obj);
    },
    removemycheckout: function(id) {
        cart.remove(id);
    },
    saveInvoice: function(res, amount, orderid) {
        var time = Date.now();
        var obj = {
            time: time,
            resNum: res,
            amount: amount,
            order: orderid
        };
        invoices.insert(obj);
    },
    addAdress: function(id, add) {
        order.update({ orderId: id }, { $addToSet: { address: add } });
    }

});
