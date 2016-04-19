

/*TAPi18n.publish("productsrewards", function() { ////console.log('categories:'+categories.find({}).fetch().length);
    return products.i18nFind({ "category": "tester" });
});*/

/*News related*/
Meteor.publish('productsrewards', function (){ 
   function makaraRendomArray(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
  }
  var myArray=[];
  var resultRandom=[];
    var result= products.find({"category": "tester"});
    result.forEach(function(value){
      myArray.push(value._id);
    });
    var arrayRandom=makaraRendomArray(myArray);
    for(var ran=0;ran<4;ran++){
      if(arrayRandom[ran]){
        resultRandom.push(arrayRandom[ran]); 
      }
    }
    console.log('sreyden='+resultRandom);
    return products.find({_id:{$in:resultRandom}});
    
});
TAPi18n.publish("categories", function() { 
    return categories.i18nFind({});
});

Meteor.publish('products', function(limit) {
    if (limit != -1) {
        return products.find({}, { limit: limit });
    } else {
        return products.find({});
    }
});

Meteor.publish('productsOrder', function(idOrder) {
    var curOrder=order.findOne({_id:idOrder});
    var listIdProducts=[];
    for(var i=0;i<curOrder.items.length;i++)
        listIdProducts.push(curOrder.items[i].id_product);
    return products.find({_id:{$in:listIdProducts}});
});

Meteor.publish('productsPage', function(){
    var page = pages.find({});
    var arrLp = [];
    if( page.count() > 0 ){
        page.forEach(function(d) {  
            if( d.productid !='' ){
                var da = d.productid;
                for( i=0; i < da.length; i++){
                    arrLp = arrLp.concat(da[i]);
                }
            }
        });
        return products.find({ _id: { $in: arrLp } });
    }
})
Meteor.publish('productsSuggested', function(limit, id) {
    if (limit != -1) {
        return products.find({}, { limit: limit });
    } else {
        var answers = answerquizz.find({ "quizzId": id });
        if (answers.fetch().length != 0) {
            var lastAnswer = answers.fetch()[answers.fetch().length - 1];
            var listTags = [];
            for (var i = 0; i < lastAnswer.quizz.length; i++) {
                listTags.push(lastAnswer.quizz[i].tag);
            }
            return products.find({ "tag_quizz": { $in: listTags } });
        }
    }
});
Meteor.publish('tutoSuggested', function(id) {
    var answers = answerquizz.find({ "quizzId": id });
    if (answers.fetch().length != 0) {
        var lastAnswer = answers.fetch()[answers.fetch().length - 1];
        var listTags = [];
        for (var i = 0; i < lastAnswer.quizz.length; i++) {
            listTags.push(lastAnswer.quizz[i].tag);
        }
        var result = contents_type.findOne({ type: "Tuto" });
        //return contents.find({ typeid: result._id },{ "tags": { $in: listTags } },{ limit: 3 });
        return contents.find({ $and: [ { typeid: result._id },{ "tags": { $in: listTags } } ] },{limit: 3});
    }/*else{
        var result = contents_type.findOne({ type: "Tuto" });
        var contentsresult = contents.find({ typeid: result._id }, { limit: 3 });
        return contentsresult;
    }*/
});
Meteor.publish('productsWebzine', function(limit,name) {
    if (limit == -1 && name) {
        var con=contents.findOne({title:name});
        //console.log('cat==='+con.category);
        var l = categories.findOne({ "_id": con.category });
        var finalList = [];
        finalList.push(l._id);
        var lvl1 = categories.find({ "parent": l._id }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        function makaraRendomArray(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
        }
        var myArray=[];
        var resultRandom=[];
        var result=products.find({ category: { $in: finalList } });  
        result.forEach(function(value){
            myArray.push(value);
        });
        var arrayRandom=makaraRendomArray(myArray);
        for(var ran=0;ran<4;ran++){
            if(arrayRandom[ran]){
               resultRandom.push(arrayRandom[ran]._id); 
            }
            
        }
        //console.log('category==='+finalList);
        return products.find({_id:{$in:resultRandom}});
      
    } else {
        return products.find({});
    }
});
Meteor.publish('productsHome', function(limit) {
    if (limit != -1) {
        return products.find({}, { limit: limit, fields: { _id: 1, title: 1, image: 1,price:1 } }); //return products.find({},{limit:limit});
    } else {
        /*var lp = list_product.find({});
        var arrLp = [];
        lp.forEach(function(l) {
            arrLp = arrLp.concat(l.products);
        });
        */
        var arrLp = [];
        var loc = locations.find({$or:[{type:'News'},{type:'Deal'}], productid:{$ne:""}});
        loc.forEach(function(d) {
            
            if( d.productid !='' ){
                var da = d.productid;
                for( i=0; i < da.length; i++){
                    arrLp = arrLp.concat(da[i]);
                }
            }
        });
        return products.find({ _id: { $in: arrLp } });
    }
});

Meteor.publish('productsDetails', function(limit, title) {
    if (limit == -1 && title) {
        var p = products.findOne({ "title": title });
        return products.find({ $or: [{ "title": title }, { category: p.category }] });
    }
    else
        return products.find({});
});
Meteor.publish('productsCategory', function(limit, name) {
    if (limit == -1 && name) {
        var l = categories.findOne({ "title": name });
        if (l == null) {
            var title = name;
            title = title.replace(/\-/g, " ");
            title = title.replace(/\(percentag\)/g, "%");
            title = title.replace(/\(plush\)/g, "+");
            title = title.replace(/\(ocir\)/g, "ô");
            title = title.replace(/\(minus\)/g, "-");
            title = title.replace(/\(copyright\)/g, "®");
            title = title.replace(/\(number\)/g, "°");
            title = title.replace(/\(bigocir\)/g, "Ô");
            title = title.replace(/\(square\)/g, "²");
            title = title.replace(/\(accentaigu\)/g, "`");
            title = title.replace(/\(eaccentaigu\)/g, "é");
            title = title.replace(/\(bigeaccentaigu\)/g, "É");
            title = title.replace(/\(and\)/g, "&");
            title = title.replace(/\(slash\)/g, "/");
            title = title.replace(/\(apostrophe\)/g, "’");
            title = title.replace(/\(quote\)/g, "'");
            title = title.replace(/\(warning\)/g, "!");
            title = title.replace(/\(question\)/g, "?");
            title = title.replace(/\(dolla\)/g, "$");
            title = title.replace(/\(eaccentgrave\)/g, "è");
            title = title.replace(/\(hyphen\)/g, "–");
            var l = categories.findOne({ "i18n.en.title": title });
        }
        var finalList = [];
        finalList.push(l._id);
        var lvl1 = categories.find({ "parent": l._id }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        return products.find({ category: { $in: finalList } }); 
    } else {
        return products.find({});
    }
});
Meteor.publish('images', function() {
    return images.find({});
});

Meteor.publish('shops', function() {
    return shops.find({})
});
TAPi18n.publish('categoryParent_tags', function(name) {
    if (name) {
        var l = categories.findOne({ "title": name });
        if (l == null) {
            var title = name;
            title = title.replace(/\-/g, " ");
            title = title.replace(/\(percentag\)/g, "%");
            title = title.replace(/\(plush\)/g, "+");
            title = title.replace(/\(ocir\)/g, "ô");
            title = title.replace(/\(minus\)/g, "-");
            title = title.replace(/\(copyright\)/g, "®");
            title = title.replace(/\(number\)/g, "°");
            title = title.replace(/\(bigocir\)/g, "Ô");
            title = title.replace(/\(square\)/g, "²");
            title = title.replace(/\(accentaigu\)/g, "`");
            title = title.replace(/\(eaccentaigu\)/g, "é");
            title = title.replace(/\(bigeaccentaigu\)/g, "É");
            title = title.replace(/\(and\)/g, "&");
            title = title.replace(/\(slash\)/g, "/");
            title = title.replace(/\(apostrophe\)/g, "’");
            title = title.replace(/\(quote\)/g, "'");
            title = title.replace(/\(warning\)/g, "!");
            title = title.replace(/\(question\)/g, "?");
            title = title.replace(/\(dolla\)/g, "$");
            title = title.replace(/\(eaccentgrave\)/g, "è");
            title = title.replace(/\(hyphen\)/g, "–");
            var l = categories.findOne({ "i18n.en.title": title });
        }
        var finalList = [];
        finalList.push(l._id);
        var lvl1 = categories.find({ "parent": l._id }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        return parent_tags.i18nFind({ category_id: { $in: finalList } }, { fields: { _id: 1, title: 1, category_id: 1 } });

    } else {
        return parent_tags.i18nFind({}, { fields: { _id: 1, title: 1, category_id: 1 } });

    }
});
TAPi18n.publish('detailsParent_tags', function(title) {
    if (title) {
        var p = products.findOne({ "title": { $regex: new RegExp(title, "i") } });
        var finalList = [];
        finalList.push(p.category);
        var lvl1 = categories.find({ "parent": p.category }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        return parent_tags.i18nFind({ category_id: { $in: finalList } });
    } else {
        return parent_tags.i18nFind({});
    }
});
TAPi18n.publish('detailsTags', function(title) {
    if (title) {
        var p = products.findOne({ "title": title });
        var finalList = [];
        finalList.push(p.category);
        var lvl1 = categories.find({ "parent": p.category }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        var pt = parent_tags.i18nFind({ category_id: { $in: finalList } });

        var arrTag = [];
        pt.forEach(function(t) {
            if (t._id) {
                arrTag.push(t._id);
            }
        });
        return tags.i18nFind({ parent: { $in: arrTag } });
    } else {
        return tags.i18nFind({});
    }
});
TAPi18n.publish('parent_tags', function(title) {
    return parent_tags.i18nFind({}, { fields: { _id: 1, title: 1, category_id: 1 } });
});
TAPi18n.publish('categoryTags', function(name) {
    if (name) {
        var l = categories.findOne({ "title": { $regex: new RegExp(name, "i") } });
        if (l == null) {
            var title = name;
            title = title.replace(/\-/g, " ");
            title = title.replace(/\(percentag\)/g, "%");
            title = title.replace(/\(plush\)/g, "+");
            title = title.replace(/\(ocir\)/g, "ô");
            title = title.replace(/\(minus\)/g, "-");
            title = title.replace(/\(copyright\)/g, "®");
            title = title.replace(/\(number\)/g, "°");
            title = title.replace(/\(bigocir\)/g, "Ô");
            title = title.replace(/\(square\)/g, "²");
            title = title.replace(/\(accentaigu\)/g, "`");
            title = title.replace(/\(eaccentaigu\)/g, "é");
            title = title.replace(/\(bigeaccentaigu\)/g, "É");
            title = title.replace(/\(and\)/g, "&");
            title = title.replace(/\(slash\)/g, "/");
            title = title.replace(/\(apostrophe\)/g, "’");
            title = title.replace(/\(quote\)/g, "'");
            title = title.replace(/\(warning\)/g, "!");
            title = title.replace(/\(question\)/g, "?");
            title = title.replace(/\(dolla\)/g, "$");
            title = title.replace(/\(eaccentgrave\)/g, "è");
            title = title.replace(/\(hyphen\)/g, "–");
            var l = categories.findOne({ "i18n.en.title": title });
        }
        var finalList = [];
        finalList.push(l._id);
        var lvl1 = categories.find({ "parent": l._id }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        var pt = parent_tags.i18nFind({ category_id: { $in: finalList } }, { fields: { _id: 1, title: 1, category_id: 1 } });
        var arrTag = [];
        pt.forEach(function(t) {
            if (t._id) {
                arrTag.push(t._id);
            }
        });
        return tags.i18nFind({ parent: { $in: arrTag } }, { fields: { _id: 1, title: 1, parent: 1, categoryId: 1 } });
    } else {
        return tags.i18nFind({}, { fields: { _id: 1, title: 1, parent: 1, categoryId: 1 } });
    }
});
TAPi18n.publish('tags', function() {
    return tags.i18nFind({}, { fields: { _id: 1, title: 1, parent: 1, categoryId: 1 } });
});
Meteor.publish('stats', function() {
    return stats.find({});
});
Meteor.publish('answerquizz', function() {
    return answerquizz.find({ "userId": this.userId });
});
Meteor.publish('quizzQA', function() {
    return quizzQA.find({});
});
Meteor.publish("attribute", function(product) {
    if (product == -1)
        return attribute.find({});
    else {
        var old = products.findOne({ "title": product });
        return attribute.find({ "product": old.oldId });
    }
});

Meteor.publish("attributeHome", function(product) {

    var allProdOldId=[];
    var list=list_product.find({}).fetch();
    for(var j=0;j<list.length;j++){
        var currentList=list[j];
        
        for(var i=0;i<currentList.products.length;i++){
            var current=products.findOne({_id:currentList.products[i]});
            
            allProdOldId.push(current.oldId);
        }
    }
    
    return attribute.find({ "product": { $in: allProdOldId } });
    
});

Meteor.publish("attributeSuggested", function(product, id) {
    if (product == -1) {
        var answers = answerquizz.find({ "quizzId": id });
        if (answers.fetch().length != 0) {
            var lastAnswer = answers.fetch()[answers.fetch().length - 1];
            var listTags = [];
            for (var i = 0; i < lastAnswer.quizz.length; i++) {
                listTags.push(lastAnswer.quizz[i].tag);
            }
            var listProducts = products.find({ "tags.value": { $in: listTags } });
            var iPro = [];
            listProducts.forEach(function(p) {
                if (p.oldId) {
                    iPro.push(p.oldId);
                }
            });
            return attribute.find({ "product": { $in: iPro } });
        }
    } else {
        var old = products.findOne({ "title": product });
        return attribute.find({ "product": old.oldId });
    }
});
Meteor.publish("attributeCategory", function(name) {
    if (name) {
        var l = categories.findOne({ "title": name });
        if (l == null) {
            var title = name;
            title = title.replace(/\-/g, " ");
            title = title.replace(/\(percentag\)/g, "%");
            title = title.replace(/\(plush\)/g, "+");
            title = title.replace(/\(ocir\)/g, "ô");
            title = title.replace(/\(minus\)/g, "-");
            title = title.replace(/\(copyright\)/g, "®");
            title = title.replace(/\(number\)/g, "°");
            title = title.replace(/\(bigocir\)/g, "Ô");
            title = title.replace(/\(square\)/g, "²");
            title = title.replace(/\(accentaigu\)/g, "`");
            title = title.replace(/\(eaccentaigu\)/g, "é");
            title = title.replace(/\(bigeaccentaigu\)/g, "É");
            title = title.replace(/\(and\)/g, "&");
            title = title.replace(/\(slash\)/g, "/");
            title = title.replace(/\(apostrophe\)/g, "’");
            title = title.replace(/\(quote\)/g, "'");
            title = title.replace(/\(warning\)/g, "!");
            title = title.replace(/\(question\)/g, "?");
            title = title.replace(/\(dolla\)/g, "$");
            title = title.replace(/\(eaccentgrave\)/g, "è");
            title = title.replace(/\(hyphen\)/g, "–");
            var l = categories.findOne({ "i18n.en.title": title });
        }
        var finalList = [];
        finalList.push(l._id);
        var lvl1 = categories.find({ "parent": l._id }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        var lp = products.find({ category: { $in: finalList } }); 
        var arrLp = [];
        lp.forEach(function(l) {

            if (l.oldId) {
                arrLp = arrLp.concat(l.oldId);
            }
        });
        return attribute.find({ product: { $in: arrLp } });
    } else {
        return attribute.find({});
    }
});
Meteor.publish("attributerecommandation", function(name) {
    if (name) {
        var l = categories.findOne({ "title": name });
        if (l == null) {
            var title = name;
            title = title.replace(/\-/g, " ");
            title = title.replace(/\(percentag\)/g, "%");
            title = title.replace(/\(plush\)/g, "+");
            title = title.replace(/\(ocir\)/g, "ô");
            title = title.replace(/\(minus\)/g, "-");
            title = title.replace(/\(copyright\)/g, "®");
            title = title.replace(/\(number\)/g, "°");
            title = title.replace(/\(bigocir\)/g, "Ô");
            title = title.replace(/\(square\)/g, "²");
            title = title.replace(/\(accentaigu\)/g, "`");
            title = title.replace(/\(eaccentaigu\)/g, "é");
            title = title.replace(/\(bigeaccentaigu\)/g, "É");
            title = title.replace(/\(and\)/g, "&");
            title = title.replace(/\(slash\)/g, "/");
            title = title.replace(/\(apostrophe\)/g, "’");
            title = title.replace(/\(quote\)/g, "'");
            title = title.replace(/\(warning\)/g, "!");
            title = title.replace(/\(question\)/g, "?");
            title = title.replace(/\(dolla\)/g, "$");
            title = title.replace(/\(eaccentgrave\)/g, "è");
            title = title.replace(/\(hyphen\)/g, "–");
            var l = categories.findOne({ "i18n.en.title": title });
        }
        var finalList = [];
        finalList.push(l._id);
        var lvl1 = categories.find({ "parent": l._id }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        var lp = products.find({ category: { $in: finalList } }); 
        var arrLp = [];
        lp.forEach(function(l) {

            if (l.oldId) {
                arrLp = arrLp.concat(l.oldId);
            }
        });
        return attribute.find({ product: { $in: arrLp } });
    } else {
        return attribute.find({});
    }
});
Meteor.publish("attributeSearch", function(name) {
    if (name) {
        var l = categories.findOne({ "title": name });
        if (l == null) {
            var title = name;
            title = title.replace(/\-/g, " ");
            title = title.replace(/\(percentag\)/g, "%");
            title = title.replace(/\(plush\)/g, "+");
            title = title.replace(/\(ocir\)/g, "ô");
            title = title.replace(/\(minus\)/g, "-");
            title = title.replace(/\(copyright\)/g, "®");
            title = title.replace(/\(number\)/g, "°");
            title = title.replace(/\(bigocir\)/g, "Ô");
            title = title.replace(/\(square\)/g, "²");
            title = title.replace(/\(accentaigu\)/g, "`");
            title = title.replace(/\(eaccentaigu\)/g, "é");
            title = title.replace(/\(bigeaccentaigu\)/g, "É");
            title = title.replace(/\(and\)/g, "&");
            title = title.replace(/\(slash\)/g, "/");
            title = title.replace(/\(apostrophe\)/g, "’");
            title = title.replace(/\(quote\)/g, "'");
            title = title.replace(/\(warning\)/g, "!");
            title = title.replace(/\(question\)/g, "?");
            title = title.replace(/\(dolla\)/g, "$");
            title = title.replace(/\(eaccentgrave\)/g, "è");
            title = title.replace(/\(hyphen\)/g, "–");
            var l = categories.findOne({ "i18n.en.title": title });
        }
        var finalList = [];
        finalList.push(l._id);
        var lvl1 = categories.find({ "parent": l._id }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        var lp = products.find({ category: { $in: finalList } }); 
        var arrLp = [];
        lp.forEach(function(l) {
            if (l.oldId) {
                arrLp = arrLp.concat(l.oldId);
            }

        });
        return attribute.find({ product: { $in: arrLp } });
    } else {
        return attribute.find({});
    }
});

Meteor.publish("attributeProDetails", function(product, title) {

    if (product == -1 && title) {
        var old = products.findOne({ "title": title });
        var result=attribute.find({ "product": old.oldId });
        console.log('manyattribute='+result.count());
        return result;
    } else {
        var old = products.findOne({ "title": product });
        return attribute.find({ "product": old.oldId });
    }

});
TAPi18n.publish("parentattr", function() {
    return parentattr.i18nFind({});
});
TAPi18n.publish("parentattrProDetails", function() {
    return parentattr.i18nFind({});
});

Meteor.publish("users", function(tab) {
    if (tab == null)
        tab = [];
    tab.push(this.userId);
    if (tab[0] == -1)
        return Meteor.users.find();
    return Meteor.users.find({ "_id": { $in: tab } });
    
});

Meteor.publish("cart", function(id) {
    return cart.find({ "userId": id });
});
//contents
Meteor.publish("contents", function() {
    return contents.find({});
});
Meteor.publish("contentsSuggested", function() {
    var result = contents_type.findOne({ type: "Tuto" });
    var contentsresult = contents.find({ typeid: result._id }, { limit: 3 });
    return contentsresult;
});
Meteor.publish("contentsProDetails", function() {
    return contents.find({});
});
Meteor.publish("contents_type", function() {
    return contents_type.find({});
});
// address
Meteor.publish("address", function() {
    return address.find({});
});
Meteor.publish("favorite", function() {
    return favorite.find({});
});

Meteor.publish("favoriteCategory", function(name) {
    if (name) {
        var l = categories.findOne({ "title": name });
        if (l == null) {
            var title = name;
            title = title.replace(/\-/g, " ");
            title = title.replace(/\(percentag\)/g, "%");
            title = title.replace(/\(plush\)/g, "+");
            title = title.replace(/\(ocir\)/g, "ô");
            title = title.replace(/\(minus\)/g, "-");
            title = title.replace(/\(copyright\)/g, "®");
            title = title.replace(/\(number\)/g, "°");
            title = title.replace(/\(bigocir\)/g, "Ô");
            title = title.replace(/\(square\)/g, "²");
            title = title.replace(/\(accentaigu\)/g, "`");
            title = title.replace(/\(eaccentaigu\)/g, "é");
            title = title.replace(/\(bigeaccentaigu\)/g, "É");
            title = title.replace(/\(and\)/g, "&");
            title = title.replace(/\(slash\)/g, "/");
            title = title.replace(/\(apostrophe\)/g, "’");
            title = title.replace(/\(quote\)/g, "'");
            title = title.replace(/\(warning\)/g, "!");
            title = title.replace(/\(question\)/g, "?");
            title = title.replace(/\(dolla\)/g, "$");
            title = title.replace(/\(eaccentgrave\)/g, "è");
            title = title.replace(/\(hyphen\)/g, "–");
            var l = categories.findOne({ "i18n.en.title": title });
        }
        var finalList = [];
        finalList.push(l._id);
        var lvl1 = categories.find({ "parent": l._id }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        var lp = products.find({ category: { $in: finalList } }, { fields: { _id: 1, Brand: 1, category: 1, description: 1, image: 1, price: 1, title: 1 } }); //return products.find({},{limit:limit});
        var arrLp = [];
        lp.forEach(function(l) {
            arrLp = arrLp.concat(l._id);
        });
        return favorite.find({ proId: { $in: arrLp } });
    } else {
        return favorite.find({});
    }

});

Meteor.publish("favoriteHome", function() {
    var lp = list_product.find({});
    var arrLp = [];
    lp.forEach(function(l) {
        arrLp = arrLp.concat(l.products);
    });
    return favorite.find({ proId: { $in: arrLp } });
});
Meteor.publish("role", function() {
    return Meteor.roles.find({});
});
Meteor.publish("question", function() {
    return question.find({});
});

Meteor.publish("journey", function() {
    return journey.find({});
});

Meteor.publish("linkselling", function() {
    return linkselling.find({});
});

Meteor.publish("membershipcard", function() {
    return membershipcard.find({});
});

TAPi18n.publish("list_product", function() {
    return list_product.i18nFind({});
});

Meteor.publish('attribute_value', function() {
    return attribute_value.find({});
});

Meteor.publish('translation', function() {
    return translation.find({});
});

Meteor.publish('payments', function() {
    return payments.find({});
});
Meteor.publish('banner', function() {
    return banner.find({});
});
Meteor.publish('bannerfavorite',function(){
    var arr=[];
    var result=banner.findOne({'typebanner':'favorite'});
    if(result==null)
        return;
    else
        return banner.find({_id:result._id});
    
});
Meteor.publish('daily', function() {
    return daily.find({});
});
Meteor.publish('imedation', function() {
    return imedation.find({});
});
Meteor.publish('anwser', function() {
    return anwser.find({});
});

Meteor.publish('barcode', function() {
    return barcode.find({});
});

Meteor.publish('userTracking', function(skip, field1, field2, field3) {
    if (field1 && field2 && field3 != null) {
        return userTracking.find({ time: { $gt: field2, $lt: field3 } }, { skip: skip, limit: 20 });
    }
    if (field1 && field2 && field3 == null) {
        if (field1 == "ip") {
            return userTracking.find({ ip: field2 }, { skip: skip, limit: 20 });
        }
        if (field1 == "currenturl") {
            return userTracking.find({ currenturl: { $regex: field2, $options: 'i' } }, { skip: skip, limit: 20 });
        }
        if (field1 == "location") {
            return userTracking.find({ location: field2 }, { skip: skip, limit: 20 });
        }
        if (field1 == "userId") {
            return userTracking.find({ userId: field2 }, { skip: skip, limit: 20 });
        }
    } else {
        return userTracking.find({}, { skip: skip, limit: 20 });

    }
});

Meteor.publish('mouse', function() {
    return mouse.find({});
});
Meteor.publish('quizz', function() {
    return quizz.find({});
});
Meteor.publish('tracking', function() {
    return tracking.find({});
});

Meteor.publish('order', function() {
    return order.find({});
});
//stock publisher
Meteor.publish('stock', function(skip, sesShop, field, val) {
    if (val != "") {
        return stock.find({ Barcode: val }, { skip: skip, limit: 20 });
    } else if (field != "") {
        return stock.find({ RetailStoreName: field }, { skip: skip, limit: 20 });
    } else if (sesShop != "") {
        return stock.find({ RetailStoreName: sesShop }, { skip: skip, limit: 20 });
    } else
        return stock.find({}, { skip: skip, limit: 20 });
});
Meteor.publish('products_node', function() {
    return products_node.find({});
});
Meteor.publish('discount', function() {
    return discount.find({});
});
Meteor.publish('collect', function() {
    return collect.find({});
});
Meteor.publish("posts", function() {
    return posts.find({});
});
//============makara========
Meteor.publish('rendomProduct', function(title) {
    function makaraRendomArray(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }
    var myArray=[];
    var resultRandom=[];
        var p = products.findOne({ "title": title });
        var result= products.find({ category: p.category } );
        result.forEach(function(value){
            myArray.push(value);
        });
        var arrayRandom=makaraRendomArray(myArray);
        for(var ran=0;ran<4;ran++){
            if(arrayRandom[ran]){
               resultRandom.push(arrayRandom[ran]._id); 
            }
            
        }
        resultRandom.push(p._id);
        return products.find({_id:{$in:resultRandom}});
});
TAPi18n.publish('productsAdvance', function(list_categories,list_brand,list_tags) {
    console.log('list_brand='+list_brand+'list_categories='+list_categories+'list_tags='+list_tags);
        if(list_tags!==''){
            return products.find({ category: { $in: list_categories },"tags.value": { $in: list_tags },Brand: { $in: list_brand } });
        }
        return products.find({ category: { $in: list_categories }, Brand: { $in: list_brand } });
});
TAPi18n.publish('quicklink',function(){
    return quicklink.i18nFind({});
});
Meteor.publish("shopLearnIt", function() {
    return shopLearnIt.find({});
});


Meteor.publish("userOrderAdmin", function() {
    var allOrders=order.find().fetch();
    var allUsers=[];
    for(var i=0;i<allOrders.length;i++){
        console.log('Order id: '+allOrders[i].userid);
        allUsers.push(allOrders[i].userid);
    }
    console.log('all'+allUsers);
    return Meteor.users.find({_id:{ $in: allUsers }},{fields: { _id: 1,username:1,emails:1,profile:1}});
});


Meteor.publish("locations", function() {
    return locations.find({});
});
Meteor.publish("pages", function() {
    return pages.find({});
});

Meteor.publish('membership',function(){
    return membership.find();
});

