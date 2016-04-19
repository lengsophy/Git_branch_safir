Template.profile.helpers({
    getquestion: function() {
        return question.find({});
    },
    getAnswer: function(question_id) {
        var userId = Meteor.userId();
        var answer = users.find({ "_id": userId, "answerdata.qcmId": question_id }, { fields: { "answerdata": 1 } });
        if (answer.fetch().length == 0)
            return "";
        else {
            var ret = "";
            for (var i = 0; i < answer.fetch()[0].answerdata.length; i++) {
                if (answer.fetch()[0].answerdata[i].qcmId == question_id)
                    ret = answer.fetch()[0].answerdata[i].answer;
            }

            return ret;
        }
    }
});
Template.addquestion.events({
    'click #btnAdd': function(e) {
        e.preventDefault();
        var question = $('#question').val();
        var tag = $('#tag').val();
        var obj = {
            name: question,
            tag: tag
        }
        Meteor.call('insertQuestion', obj);
        if (TAPi18n.getLanguage() == 'fa') {
            Bert.alert('قرار دادن موفقیت سوال!', 'success', 'growl-bottom-right');
        } else {
            Bert.alert('Insert Question success!', 'success', 'growl-bottom-right');
        }
        $(".close").click();
        Router.go("/managequestion");
    }
});
Template.managequestion.helpers({
    getquestion: function() {
        return question.find();
    }
});
Template.updatequestion.events({
    'click #btnUpdate': function(e) {
        e.preventDefault();
        var id = this._id;
        var question = $('#question').val();
        var tag = $('#tag').val();
        var obj = {
            question: question,
            tag: tag
        }
        Meteor.call('updateQuestion', id, obj);
        if (TAPi18n.getLanguage() == 'fa') {
            Bert.alert('به روز رسانی سوال موفقیت!', 'success', 'growl-bottom-right');
        } else {
            Bert.alert('Updated Question success!', 'success', 'growl-bottom-right');
        }
        $(".close").click();
        Router.go("/managequestion");
    }
});
Template.managequestion.events({
    'click #delete': function(e) {
        e.preventDefault();
        question.remove({ _id: this._id });
    },
    'click #goadd': function() {
        Router.go("/addquestion");
    }
});
