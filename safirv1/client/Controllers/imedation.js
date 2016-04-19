Template.imedation.events({
	'submit form':function(e){
		e.preventDefault();
		var subject = 'My friend invite you!';
                var sendTo = event.target.email.value;
                var message= "you success to member";
                console.log(Meteor.userId());
                Meteor.call('inviteFriends',sendTo,subject,message,function(err){
                       if(err){
                              console.log("error" + err);
                      }else{
                              obj={
                                     user_id:Meteor.userId(),
                                     email_imedate:sendTo,
                                     date:Date.now()
                             }
                             Meteor.call('insertImedation',obj)
                     }
             });
        }
});
