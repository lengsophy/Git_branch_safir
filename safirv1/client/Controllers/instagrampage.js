Session.get('users', '');
Session.set("idinstauser", "");
Session.set("msgerror", "");
Session.set("registerinstaError", "")
Template.instagrampage.onRendered(function() {
    this.$("#instaModal").modal('show');
    $(".modal").addClass("modal-backdrop-insta");
    $(".modal-backdrop").removeClass("modal-backdrop");
    $('#instaModal').on('hidden.bs.modal', function () {
        Router.go('/home');
    });
    $('#instaModalcomfirm').on('hidden.bs.modal', function () {
        Router.go('/profile');
    });
});

Template.instagrampage.events({
    'click #insta-login-instagram': function(event, tmpl) {
        event.preventDefault();
        Meteor.call("fetchFromService", function(error, result) {
            if (error) throw error;
            else {
                console.log(" instagram username " + result.data.username);
                Meteor.call('getMatchUser', result.data.username, function(err, matchId) {
                    if (err) {
                        console.log(" Not match " + err);
                    } else {
                        console.log("userId " + matchId + "  instaId " + result.data.id);
                    }

                });
            }
        });
        Meteor.loginWithInstagram({}, function(err) {
            if (err) {
                throw new Meteor.Error("Instagram login failed");
            } else {
                var user = Meteor.users.findOne({ _id: Meteor.userId() });
                var firstname = user.services.instagram.username;
                var istagramId = user.services.instagram.id;
                var lastname = '';
                // console.log("userid");
                // console.log(firstname);
                // console.log(istagramId);
                HTTP.post("http://localhost:3030/api/v1/instagramuserinfo", {
                    data: {
                        "api_key": "ab9ca2acb8ffad76cb31f21e543e11f2",
                        "ig_userid": istagramId

                    }
                }, function(error, response) {
                    if (error) {
                        console.log(error);
                    } else {
                        var obj = response.data.user;
                        Session.set('users', obj);

                    }
                });
                Session.set("idinstauser", istagramId);
                var image = user.services.instagram.profile_picture;
                var sex = '';
                if (user.profile.firstname) {
                    $('.close').click();
                } else {
                    var userObj = {
                        firstname: firstname,
                        lastname: lastname,
                        sex: sex,
                        shipcard: {
                            shipcardId: "",
                            point: 0
                        }
                    }
                    var obj = {
                        profile: userObj,
                        roles: { mygroup: ["member"] },
                        image: image
                    }
                    Meteor.call('updateRoleWithSocail', Meteor.userId(), obj, function(err, data) {
                        if (!err) {
                            $('.close').click();
                        }


                    });

                }
                $("#instaModal").hide();
                $("#instaModalcomfirm").show();

            }
        });
    },
    /*"click #instagram":function(e){
        // $("#instaModal").show();
        this.$("#instaModal").modal('show');
    },
    "click #instaModalcomfirm":function(e){
        $("#instaModalcomfirm").show();
    },*/
    // "click .modal-backdrop-insta":function(e){
    //     $("#instaModal").show();
    // },
    "click #askmeletter": function(e) {
        e.preventDefault();
        $("#instaModal").hide();
        $(".modal-backdrop-insta").removeClass("modal-backdrop-insta");
        Router.go("/");

    },
    "click .close-instagram":function(){
        $("#instaModal").hide();
        $(".modal-backdrop-insta").removeClass("modal-backdrop-insta");
        Router.go("/");
    },
    "click .close-instagram-infor":function(){
        $("#instaModalcomfirm").hide();
        $(".modal-backdrop-insta").removeClass("modal-backdrop-insta");
        Router.go("/profile");
    },
    "click #comfirminformatinsta": function(e) {
        e.preventDefault();
        var firstname = $("#FirstName").val();
        var lastname = $("#LastName").val();
        var email = $("#Email").val();

        var msgerror = "";
        var istagramuserId = Session.get("idinstauser");
        var checkemail="^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$";

        if (email == "" || !email.match(checkemail)) {
            if (email == "") {

                msgerror += "The email is required";
                console.log("email empty");
            }
            if (!email.match(checkemail)){
                msgerror +="The email invalide!";
            }


            Session.set("registerinstaError", msgerror);
            Session.set("msgerror", msgerror);
            console.log("======");
            console.log(Session.get("registerinstaError"));
            console.log("======");
            console.log(Session.get("msgerror"));
        } else {

            console.log("email" + email + "firstname" + firstname + "lastname" + lastname + "instaid" + istagramuserId);
            HTTP.post("http://52.90.80.46/api/v1/instagramuserinfo", {
                data: {
                    "api_key": "ab9ca2acb8ffad76cb31f21e543e11f2",
                    "ig_userid": istagramuserId,
                    "firstname": firstname,
                    "lastname": lastname,
                    "email": email
                }
            }, function(error, response) {
                if (error) {
                    console.log(error);
                } else {
                    var obj = response.data.user;
                    Session.set('users', obj);

                }
            });
            Session.set("registerinstaError", "");
            Session.set("msgerror", "");

        }
    },
   
    "keypress #FirstName": function() {
        Session.set("registerinstaError", "");
        Session.set("msgerror", "");

    },
    "keypress #LastName": function() {
        Session.set("registerinstaError", "");
        Session.set("msgerror", "");
    },
    "keypress #Email": function() {
        Session.set("registerinstaError", "");
        Session.set("msgerror", "");
    },
    "click #skipinsta":function(event){
        event.preventDefault();
        $(".modal-backdrop-insta").removeClass("modal-backdrop-insta");
        Router.go("/profile");
    }

});


Template.instagrampage.helpers({

    getmsg: function() {
        var msg = Session.get('msgerror');
        if (msg != "") return msg;
        else return;
    },
    registerinstaError: function() {
        var msg = Session.get("registerinstaError");
        if (msg) return true;
        else return false;
    },
    registerinstaErrormsg: function() {
        console.log(Session.get("registerinstaError"));
        return Session.get("registerinstaError");
    }
});
