Template.details.events({
    'click .fa-star': function(e, tpl) {
        e.preventDefault();
        var value = tpl.$(e.currentTarget).attr('data-star');
        //alert("Rating "+value);
        Session.set("STARRATE", value);
    },
    'click div i.fa-star': function(e) {
        var currentStar = $(e.currentTarget).attr('class');
        if (!currentStar.match('yellow-star')) {
            $(e.currentTarget).addClass('yellow-star');
            $(e.currentTarget).parent().prevAll('div').children('i').addClass('yellow-star');
        } else {
            $(e.currentTarget).parent().nextAll('div').children('i').removeClass('yellow-star');
        }

    }
});
Template.details.events({
    "click .morereviews": function(e) {
        e.preventDefault();
        var counter = $(".morereviews").attr("data-toggle");
        var update = "";
        if (counter == 0) {
            Session.set("numberReviews",true);
            $(".morereviews").text("HIDE REVIEW");
            $(".morereviews").attr("data-toggle", "1")
        } else {
            Session.set("numberReviews",false);
            $(".morereviews").attr("data-toggle", "0")
            $(".morereviews").text("MORE REVIEWS");
        }
        return update;
    },
    'submit form': function(e, tpl) {
        e.preventDefault();
        var userid = Meteor.userId();
        if (userid == null) {
            alert("You have to be logged to submit a review!");
            return;
        }
        var title = tpl.$("#title").val();
        var text = tpl.$("#comment").val();
        var grade = tpl.$("#sel1").val();
        var profile = Meteor.users.findOne({ _id: userid }).profile;
        var oldpoint=profile.shipcard.point;
        var resultmembership=membership.find();
        var arrmem=[];
        resultmembership.forEach(function(value){
            if(value.minpoint <= oldpoint && oldpoint <=value.maxpoint){
                arrmem.push(value);
            }
        });
        if(arrmem[0].name=='black'){
            var point = 10;
        }
        if(arrmem[0].name=='silver'){
            var point=20;
        }
        if(arrmem[0].name=='gold'){
            var point=40
        }
        
        if (profile.shipcard != null)
            var upoint = Number(profile.shipcard.point);
        else
            var upoint = 0;
        upoint += point;
        var grade = Session.get("STARRATE");
        $("#bt_review").click();
        var idreview=Random.id();
        Meteor.call('addReview',idreview, title, text, grade, userid, this._id, function(err) {
            if (err) {
                console.log("error " + reason);
            } else {
                Meteor.call('earnPoint', userid, upoint, function(err) {
                    if (err) {
                        console.log("error " + reason);
                    } else {
                        console.log("success" + upoint);
                        if (upoint == 10) {
                            console.log("upoint ==10");
                            $("#myModaltuto").show();

                        } else if (upoint == 20) {
                            $("#myModaltuto2").show();

                        } else {
                            $("#myModaltuto").parent().hide();
                            $("#myModaltuto2").parent().hide();
                        }
                    }
                });
                if (TAPi18n.getLanguage() == 'fa') {
                    Bert.alert('شما باید کسب '+point+' امتیاز بیشتر!', 'success', 'growl-bottom-right');
                } else {
                    Bert.alert('You have earn '+point+' point more!', 'success', 'growl-bottom-right');
                }
                $(".close").click();
            }
        });

    },
    'click #popup': function(e) {
        e.preventDefault();
        $("#myModaltuto2").css("display", "none");
        $("#myModaltuto").parent().hide();
        console.log("hide");
    },
    'click #popup1': function(e) {
        $("#myModaltuto").parent().hide();
    }
});
Template.addreview.events({
    'click #bt_review': function(e, tpl) {
        if (tpl.$("#add_review").css("display") == 'none')
            tpl.$("#add_review").css("display", "block");
        else
            tpl.$("#add_review").css("display", 'none');
    }
});

Template.addreview.helpers({
    getImgUrl: function(userid) {
        console.log('avatar=' + userid);
        var user = users.findOne({ "_id": userid });
        if (!user.hasOwnProperty('image'))
            return 'unknown.png';
        var img = images.findOne({ _id: user.image });
        console.log("current img=" + img);

        if (img) {
            console.log(img.copies.images.key);
            return img.copies.images.key;
        } else {
            return;
        }
    }
});

Template.review.helpers({
    getUsername: function(userid) {
        return users.findOne({ _id: userid }).emails[0].address;
    },
    getImgUrl: function(userid) {
        console.log('avatar=' + userid);
        var user = users.findOne({ "_id": userid });
        if (!user.hasOwnProperty('image'))
            return 'unknown.png';
        var img = images.findOne({ _id: user.image });
        console.log("current img=" + img);

        if (img) {
            console.log(img.copies.images.key);
            return img.copies.images.key;
        } else {
            return;
        }
    },
    getImageUser: function(userId) {
        Meteor.call('getUserReview', userId, function(err, value) {
            if (err) {
                alert(err);
            } else {

                $('.' + value._id).text(value.profile.firstname);

            }
        });
    },
    getImages: function(userId) {

        Meteor.call('getUserReview', userId, function(err, value) {
            if (err) {
                alert(err);
            } else {
                //makara
                var id = value.image;
                if (id == '' || typeof id == "undefined")
                    $('.image' + value._id).attr('src', '/img/unknown.png');

                else if (id.indexOf("uploads") > -1) {
                    id = id.replace(/ /g, "%20");
                    console.log('repaclement====' + id);
                    path = id.replace('/uploads/images/', '');

                    $('.image' + value._id).attr('src', '/uploads/' + path);
                    //return id;
                } else if (id.indexOf("http://") > -1 || id.indexOf("https://") > -1) {
                    $('.image' + value._id).attr('src', id);

                } else {
                    var img = images.findOne({ _id: id });
                    if (img) {
                        var id = img.copies.images.key;
                        console.log("id img---jkghik" + id);
                        path = id.replace('UserUploads/', '');
                        console.log("path " + path);
                        $('.image' + value._id).attr('src', '/uploads/' + path);
                    }
                }
                //end makara


            }
        });
    },
    getRate: function(num) {
        var rate = $('fa-star-o');
        var allhtm = '';
        var html = '<div class="col-xs-2 rate-star" style="margin-left:-14px;"><i class="fa fa-star" data-star="1" style="font-size:15px;"></i></div>';
        var htmlyellow = '<div class="col-xs-2 rate-star" style="margin-left:-14px;"><i class="fa fa-star yellow-star" data-star="1" style="font-size:15px;"></i></div>';
        for (var i = 0; i < 5; i++) {
            if (i < Number(num)) {
                allhtm += htmlyellow;
            } else {
                allhtm += html;
            }
        }

        return allhtm;
    }
});
Template.review.events({

    "click .likereview": function(e) {
        var arraylike=[];
        var reivewid= this.idreview;
        var userid = Meteor.userId();
         var like = 1;
        var productsid=$("#reviwhidden").val();
        var reviews=products.findOne({_id:productsid}).review;
        var obj={
                "user":userid,
                "like":like 
            };
            // arraylike.push(obj);
        for(var i=0;i<reviews.length;i++){
            if(reviews[i].idreview==reivewid){
                if(reviews[i].likereview){
                    var myarraylike=reviews[i].likereview;
                    for(var j=0;j<myarraylike.length;j++){
                        if(myarraylike[j].user==userid){
                           myarraylike[j]={
                            'user':myarraylike[j].user,
                            'like':0
                            }
                            arraylike.push(myarraylike[j]); 
                        }else{
                            arraylike.push(obj); 
                            arraylike.push(myarraylike[j]); 
                        }
                        
                    }
                    
                }else{
                   arraylike.push(obj); 
                }
                reviews[i]={
                    "idreview" : reviews[i].idreview,
                    "title" : reviews[i].title,
                    "comment" : reviews[i].comment,
                    "grade" : reviews[i].grade,
                    "user" : reviews[i].user,
                    "likereview":arraylike,
                    "date" : Date.now()
                    }
            }
        }
        alert("like review"+productsid);
        $(e.currentTarget).toggleClass("addheart");
       
        Meteor.call("updatelikereview",reviews,productsid, function(error, result) {
            if (error) {
                console.log("error update like review" + error);
            } else {
                console.log("update like review" + result);
            }
        });
    }
});
