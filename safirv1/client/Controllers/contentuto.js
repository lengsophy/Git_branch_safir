Template.contentuto.events({
    "click #remove": function(e, tpl) {
        var id = this._id;
        Meteor.call('deletePostt', id);
    }
});
Template.contentuto.helpers({
    tutotpost: function() {
        var userlogin = Meteor.userId();
        var result = contents.find({ author: userlogin });
        var result = contents.find({ type: { $ne: "News" } });
        return result;
    },
    typeName: function(nametype) {
        var typeresult = contents_type.findOne({ _id: nametype });
        return typeresult.type;
    }

});
