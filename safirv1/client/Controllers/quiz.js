Template.quiz.events({
    'click #link-sl': function(e) {
        var text3 = $(e.currentTarget).attr('data-value');
        Session.set('skin', text3);
    },
    "click .btn-update-quiz": function(e, tpl) {
        e.preventDefault();
        var id = Meteor.userId();
        var text1 = $('input[name="gender"]:checked');
        var result1 = text1.val();
        var text2 = $('input[name="skintype"]:checked');
        var result2 = text2.val();
        var text3 = Session.get('skin');
        //alert(text3);
        var text4 = $('input[name="sensitive"]:checked');
        var result4 = text4.val();
        console.log("result1 " + result1 + "result2 " + result2 + "result3 " + text3 + "result4 " + result4);
        var obj = {
            myInfo: {
                gender: result1,
                feelSkin: result2,
                skin: text3,
                define: result4
            }
        }

        Meteor.call("updateQuiz", id, obj, function(err) {
            if (err) {
                if (TAPi18n.getLanguage() == 'fa') {
                    Bert.alert('شما باید خطا، لطفا دوباره بررسی کنید!', 'fails', 'growl-bottom-right');
                } else {
                    Bert.alert('You have error, please check again!', 'fails', 'growl-bottom-right');
                }
                $('.close').click();
            } else {
                if (TAPi18n.getLanguage() == 'fa') {
                    Bert.alert('مسابقه شده است اضافه کنید!', 'success', 'growl-bottom-right');
                } else {
                    Bert.alert('Quiz has been add!', 'success', 'growl-bottom-right');
                }
                $('.close').click();
            }
        });


    }
});

Template.quiz.helpers({
    getprofile: function() {
        var id = Meteor.userId();
        return Meteor.users.findOne({ _id: id });
    },
    firstQuiz: function() {
        return quizz.find({}).fetch()[0];
    },
    allQuizz: function() {
        return quizz.find({});
    },
    hasCompleted: function(quizzId) {
        console.log('QUIZZID=' + quizzId + ' - User=' + Meteor.userId());
        var nb = answerquizz.find({ "quizzId": quizzId, "userId": Meteor.userId() });
        if (nb.fetch().length > 0)
            return true;
        else
            return false;
    },
    getquizz: function() {
        userId = Meteor.userId();

    },
    //gender
    isChekman: function() {
        var id = Meteor.userId();
        var result = Meteor.users.findOne({ _id: id }).myInfo.gender;
        if (result == "man")
            return "checked";
        else
            return;
    },
    isChekwoman: function() {
        var id = Meteor.userId();
        var result = Meteor.users.findOne({ _id: id }).myInfo.gender;
        if (result == "woman")
            return "checked";
        else
            return;
    },
    //end gender
    //start feelSkin
    isChekdry: function() {
        var id = Meteor.userId();
        var result = Meteor.users.findOne({ _id: id }).myInfo.feelSkin;
        if (result == "dry")
            return "checked";
        else
            return;
    },
    isChekoily: function() {
        var id = Meteor.userId();
        var result = Meteor.users.findOne({ _id: id }).myInfo.feelSkin;
        if (result == "oily")
            return "checked";
        else
            return;
    },
    isChekcombination: function() {
        var id = Meteor.userId();
        var result = Meteor.users.findOne({ _id: id }).myInfo.feelSkin;
        if (result == "combination")
            return "checked";
        else
            return;
    },
    //end feelSkin
    //start skin
    isChekstraight: function() {
        var id = Meteor.userId();
        var result = Meteor.users.findOne({ _id: id }).myInfo.skin;
        if (result == "straight")
            return "checked";
        else
            return;
    },
    isChekcurly: function() {
        var id = Meteor.userId();
        var result = Meteor.users.findOne({ _id: id }).myInfo.skin;
        if (result == "curly")
            return "checked";
        else
            return;
    },
    isChekshort: function() {
        var id = Meteor.userId();
        var result = Meteor.users.findOne({ _id: id }).myInfo.skin;
        if (result == "short")
            return "checked";
        else
            return;
    },
    //end skin
    //start define
    isChekpop: function() {
        var id = Meteor.userId();
        var result = Meteor.users.findOne({ _id: id }).myInfo.define;
        if (result == "pop")
            return "checked";
        else
            return;
    },
    isCheknaturel: function() {
        var id = Meteor.userId();
        var result = Meteor.users.findOne({ _id: id }).myInfo.define;
        if (result == "naturel")
            return "checked";
        else
            return;
    },
    isCheksophisticated: function() {
            var id = Meteor.userId();
            var result = Meteor.users.findOne({ _id: id }).myInfo.define;
            if (result == "sophisticated")
                return "checked";
            else
                return;
        }
        //end define

});
