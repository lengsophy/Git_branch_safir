Template.body.rendered = function() {
	var idpopup = Session.get("popup");
    if (!Session.get("popup")) {
        this.$("#instaModal").modal('show');
        //$(".modal").addClass("modalalert");
        $(".modal-backdrop").removeClass("modal-backdrop");
        $('#instaModal').on('hidden.bs.modal', function () {
            Router.go('/home');
        });
        $('#instaModalcomfirm').on('hidden.bs.modal', function () {
            Router.go('/profile');
        });

    	console.log("first time popup");
        setTimeout(function() {
            $('#popupfivemin').show();
        }, 300000);
         //}, 10000);

        setTimeout(function() {
           $('#popupfivemin').hide();
        }, 318000);

        var idcurrentuser = Random.id();
        var timeInMs = Date.now() / 1000;
        console.log("timestamp:" + timeInMs);

        if (!Session.get("timeuser") && !Session.get("popup")) {
            Session.setPersistent("popup", idcurrentuser);
            Session.setPersistent("timeuser", timeInMs);
        }

        var id = Session.get("popup");
        console.log("id user :" + id);
        console.log("timeuser :" + Session.get("timeuser"));

    } else {

    	console.log("after first time popup");
        setTimeout(function() {
            $('#popupfivemin').show();
        }, 18000000);

         setTimeout(function() {
            $('#popupfivemin').hide();
        },18030000);
    }

}
Template.body.events({
    "click #fiveminpopup": function() {
        $('#popupfivemin').hide();
        console.log("close modal");
    },
    "click .close-popupdaily":function(){
         $('#popupfivemin').hide();
    }

});
Template.header.helpers({
    myCart: function() {
        var totalItem = 0;
        var userId = Session.get('userId');
        mycart = cart.find({ userId: userId });
        mycart.forEach(function(value) {
            totalItem += parseInt(value.quantity);
        });
        return totalItem;
    },
    myfavorit: function() {
        var userId = getFavUserId(); //Session.get('userId');
        myfavorit = favorite.find({ userId: userId }).count();
        return myfavorit;
    }
});
