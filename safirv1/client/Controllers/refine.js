Session.set('currentLetter', "A");
Session.setDefault('advanced_price_min', 0);
Session.setDefault('advanced_price_max', 100000000);
Session.setDefault('advanced_tags', '');
Session.setDefault('advanced_brand', '');
Session.setDefault('advanced_has_comment', 0);
Session.setDefault('advanced_is_favorite', 0);
Session.setDefault('currentCategory', '');
Session.setDefault('parentTagId', '');
Session.setDefault('click', '');
Template.myrefine.events({
    'click #refine_price_range': function(e, tpl) {
        var url = 'https://www.google-analytics.com/collect?v=1&t=event&tid=UA-71059459-2&cid=555&ec=refine&ea=click&el=refineByPrice&ev=1000';
        Meteor.call('eventCall', url, function(error, result) {
            if (error) {
                console.log('Analytic CLIENT ERRR');
                console.log(error);
            } else {
                console.log('Analytic CLIENT RESULT');
                console.log(result);
            }
        });
        $("#panel_price").slideToggle("slow");
    },
    'click #refineBrand': function(e, tpl) {
        var url = 'https://www.google-analytics.com/collect?v=1&t=event&tid=UA-71059459-2&cid=555&ec=refine&ea=click&el=refineByBrand&ev=1000';
        Meteor.call('eventCall', url, function(error, result) {
            if (error) {
                console.log('Analytic CLIENT ERRR');
                console.log(error);
            } else {
                console.log('Analytic CLIENT RESULT');
                console.log(result);
            }
        });
        console.log('changing');
        $(".refine-item").addClass('tohide');
        $(".refine-item").removeClass('toshow');
        $("#brands").removeClass('tohide');
        $("#brands").addClass('toshow');

    },
    'click #refinetag': function(e, tpl) {
        console.log('changing');
        $(".refine-item").addClass('tohide');
        $(".refine-item").removeClass('toshow');
        $("#parentTag").removeClass('tohide');
        $("#parentTag").addClass('toshow');

    },
    'click #refineRating': function(e, tpl) {
        console.log('changing');
        $(".refine-item").addClass('tohide');
        $(".refine-item").removeClass('toshow');
        $("#rating").removeClass('tohide');
        $("#rating").addClass('toshow');
    },
    'click #refinePrix': function(e, tpl) {
        console.log('changing');
        $(".refine-item").addClass('tohide');
        $(".refine-item").removeClass('toshow');
        $(".price-range").removeClass('tohide');
        $(".price-range").addClass('toshow');
        if (Session.get('click') == '') {
            $(".slider.slider-horizontal .slider-tick-label-container .slider-tick-label").css('margin-left', '35px');
            Session.set('click', true);
        }


        Router.go('advanced');
    },
    'click .alphabet': function(e, tpl) {
        e.preventDefault();
        Session.set('limit', -1);
        var value = $(e.currentTarget).text();

        console.log('selected value:' + value);
        letter = value.toUpperCase();
        var myBrands = [];

        var liste = products.find().fetch();
        console.log("Processing2:" + liste.length);
        for (var i = 0; i < liste.length; i++) {
            if (liste[i].hasOwnProperty('Brand')) {
                var first = liste[i].Brand;
                if (first != '' && first.toUpperCase().substr(0, 1) == letter && myBrands.indexOf(first) == -1)
                    myBrands.push(first);
            }

        }
        tpl.$("#allBrands").html("");
        console.log('myBrands=' + myBrands);
        for (var i = 0; i < myBrands.length; i++)
            tpl.$("#allBrands").append('<li><a href="/listproducts/' + myBrands[i] + '" class="targetBrand">' + myBrands[i] + '</a></li>');

    },
    'click #tagrefine': function(e, tpl) {
        e.preventDefault();
        console.log('this._id=' + this._id);
        Session.set('advanced_tagss', this._id);
        Router.go('/advanced');

    },
    'click #parentTags': function(e) {
        e.preventDefault();
        Session.set('parentTagId', this._id);
    },
    'click .targetBrand': function(e, tpl) {
        e.preventDefault();
        var brand = $(e.currentTarget).text();
        var oldValue = Session.get('advanced_brand');
        var newVal = oldValue + '' + brand + ';';


        Session.set('advanced_brand', newVal);
        console.log('brand Liste Brand= ' + Session.get('advanced_brand'));
        Router.go('advanced');
    },
    'click .targetTag': function(e, tpl) {
        e.preventDefault();
        var tag = $(e.currentTarget).text();
        var oldValue = Session.get('advanced_tags');
        var newVal = oldValue + '' + tag + ';';
        Session.set('advanced_tags', newVal);
        console.log('tag Liste Brand= ' + Session.get('advanced_tags'));
        Router.go('advanced');
    },
    'click .removeRefineItemBrand': function(e, tpl) {
        e.preventDefault();
        var brand = $(e.currentTarget).parent().text();
        brand = brand.substr(0, brand.length - 1);
        console.log('Deleting ' + brand);
        var oldValue = Session.get('advanced_brand');

        var toDelete = brand + ';';
        console.log('Brand to delete:' + toDelete);
        var newVal = oldValue.replace(toDelete, '');
        Session.set('advanced_brand', newVal);
        $(e.currentTarget).parent().parent().remove();
        Router.go('advanced');

    },
    'click .removeRefineItemTag': function(e, tpl) {
        e.preventDefault();
        var tags = $(e.currentTarget).parent().text();
        tags = tags.substr(0, tags.length - 1);
        var oldValue = Session.get('advanced_tags');
        var toDelete = tags + ';';
        console.log('Brand to delete:' + toDelete);
        var newVal = oldValue.replace(toDelete, '');
        Session.set('advanced_tags', newVal);
        $(e.currentTarget).parent().parent().remove();
        Router.go('advanced');

    },
    'click .removeRefineItemPrice': function(e, tpl) {
        e.preventDefault();
        $(e.currentTarget).parent().parent().remove();

        Session.set('advanced_price_min', 0);
        Session.set('advanced_price_max', 100000000);
    }
});

Template.myrefine.helpers({
    getParentTag: function() {
        var result = parent_tags.find({ "category_id": Session.get('refineCateId') });
        Session.set('getrresultparenttag', result.count());
        return result;
    },
    getNoParenttag: function() {
        if (Session.get('getrresultparenttag') < 1) return true;
        else return false;
    },
    getListTag: function() {
        if (Session.get('parentTagId') !== '')
            return tags.find({ "parent": Session.get('parentTagId') });
    },
    getPriceFilter: function() {
        var min = Session.get('advanced_price_min');
        var max = Session.get('advanced_price_max');
        return { min: min, max: max };
    },
    getAllFilter: function() {
        var allFilter = Session.get('advanced_brand').split(';');
        var res = [];
        for (var i = 0; i < allFilter.length; i++)
            if (allFilter[i] != '')
                res.push(allFilter[i]);
        return res;
    },
    getAllTag: function() {
        var allFilter = Session.get('advanced_tags').split(';');
        var res = [];
        for (var i = 0; i < allFilter.length; i++)
            if (allFilter[i] != '')
                res.push(allFilter[i]);
        return res;
    },
    isBrand: function(letter) {
        letter = letter.toUpperCase();
        var found = false;
        var liste = products.find().fetch();
        for (var i = 0; i < liste.length; i++) {
            if (liste[i].hasOwnProperty('Brand')) {
                var first = liste[i].Brand.toUpperCase().substr(0, 1);
                if (first == letter)
                    found = true;
            }

        }
        console.log('letter:' + letter + '= ' + found);
        return found;
    },
    listBrand: function(letter) {
        console.log("Processing " + letter);
        letter = letter.toUpperCase();
        var myBrands = [];
        var liste = products.find().fetch();
        for (var i = 0; i < liste.length; i++) {
            if (liste[i].hasOwnProperty('Brand')) {
                var first = liste[i].Brand.toUpperCase();
                if (first.substr(0, 1) == letter && myBrands.indexOf(first) == -1)
                    myBrands.push(first);
            }

        }

        console.log('myBrands=' + myBrands);
        return myBrands;
    },
    categories: function() {
        var currentCategory = Router.current().route.getName();
        if (route == 'details') {
            console.log('Entering details page');
            var productId = Router.current().params.id;
            var title = this.params.id;
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
            var product = products.findOne({ "title": { $regex: new RegExp(title, "i") } });

            currentCategory = product.category;
        } else if (route == 'listing') {

            var title = this._id;
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
            var currentCategory = categories.findOne({ "title": { $regex: new RegExp(title, "i") } })._id;
        } else {
            console.log('Entering any page');
            return;
        }
        var listCategories = [];
        var obj = categories.findOne({ "_id": currentCategory });
        while (obj != null && obj.parent != "0") {
            listCategories.push(obj);
            currentCategory = obj.parent;
            obj = categories.findOne({ "_id": currentCategory });
        }
        listCategories.push(obj);
        var res = [];
        for (var i = listCategories.length - 1; i >= 0; i--)
            res.push(listCategories[i]);
        return res;
    },
    currentLetter: function() {
        return Session.get('currentLetter');
    },
    getListParent: function() {
        // alert("id " + id);
        //console.log("MYID="+id);
        var id = Session.get("MENUID");
        var list = [];
        var currentCategory = categories.findOne({ "_id": id });
        console.log("currentCategory " + currentCategory);
        list.push(currentCategory);
        while (currentCategory.parent != " " && currentCategory.parent != "0") {
            currentCategory = categories.findOne({ "_id": currentCategory.parent });
            list.push(currentCategory);

        }
        var reverse = [];
        for (var i = list.length - 1; i > -1; i--) {
            reverse.push(list[i]);
        }
        console.log("reverse " + JSON.stringify(reverse));
        return reverse;
    }
});

Template.myrefine.onRendered(function() {
    // $('#sl2').slider(); 
    // $('#sl2').slider().on('slideStop', function(ev){
    //     console.log('sliderstop');
    //     var min=Number($(".tooltip-inner").text().split(':')[0].replace(' ',''));//$("#sl2").data('slider-min');
    //     var max=Number($(".tooltip-inner").text().split(':')[1].replace(' ',''));//$("#sl2").data('slider-max');
    //  console.log('valuePrice='+min+'-'+max);
    //  Session.set('advanced_price_max',max);
    //  Session.set('advanced_price_min',min);
    //  Router.go('/advanced');
    //  /*var interval=min+'-'+max;
    //  $(".removeRefineItemPrice").parent().parent().remove();
    //  $("#refineitem").append('<li><a href="" class="border-dashed">'+interval+' <span class="fa fa-times removeRefineItemPrice" ></span></a></li>');
    // 
    // });
    //$('#makara').slider(); 
    $('#makara').on('slideStop', function(ev) {
        $(".slider.slider-horizontal .slider-tick-label-container .slider-tick-label").css('margin-left', '0px');
        console.log('sliderstop');
        var slide = Number($(".tooltip-inner").text().split(':')[0].replace(' ', '')); //$("#sl2").data('slider-min');
        //var max=Number($(".tooltip-inner").text().split(':')[1].replace(' ',''));//$("#sl2").data('slider-max');
        //console.log('valuePrice='+min+'-'+max);
        Session.set('advanced_price_max', slide);
        Session.set('advanced_price_min', 0);
        Router.go('/advanced');
        /*var interval=min+'-'+max;
        $(".removeRefineItemPrice").parent().parent().remove();
        $("#refineitem").append('<li><a href="" class="border-dashed">'+interval+' <span class="fa fa-times removeRefineItemPrice" ></span></a></li>');
        */
    });
    var currenturl = window.location.href;
    if (currenturl.indexOf("category") == -1) {
        Session.set('advanced_brand', '');
        Session.set('advanced_tags', '');
        Session.set('advanced_price_max', 100000000);
        Session.set('parentTagId', '');
    }


});
