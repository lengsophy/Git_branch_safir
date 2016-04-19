Template.recommendation.helpers({

    products: function() {
        function shuffle(o) {
            for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        }
        var myArray = [];
        var resultRandom = [];
        var result = products.find();
        result.forEach(function(value) {
            myArray.push(value);
        });
        var arrayRandom = shuffle(myArray);
        for (var ran = 0; ran < 4; ran++) {
            if (arrayRandom[ran]) {
                resultRandom.push(arrayRandom[ran]);
            }
        }
        return resultRandom;
    },
    getAttribprice: function(oldId) {
        //var attrprice = attribute.findOne({"product":oldId});
        Meteor.call('getAttrPrice', oldId, function(err, data) {
            if (!err) {
                var attr = '.price' + data.product;
                $(attr).html('ریال ' + data.price);
                console.log('oldiD= ' + data.product + "price =" + data.price)
            }
        });
    }
});
