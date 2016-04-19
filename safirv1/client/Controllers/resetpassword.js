
Template.ForgotPassword.events({
  'submit form': function(e) {
    var arr=[];
    e.preventDefault();
    var trimInput = function(val) {
      return val.replace(/^\s*|\s*$/g, "");
    }
    var code=e.target.code.value;
    if(code==Session.get('veryfy')){
      var email=trimInput(e.target.emailRecovery.value);

      Accounts.forgotPassword({email: email}, function(err) {
        if (err) {
          if (err.message === 'User not found [403]') {
            console.log('This email does not exist.');
          } else {
            console.log('We are sorry but something went wrong.');
            if(TAPi18n.getLanguage()=='fa'){
              Bert.alert('متأسفیم، اما چیزی را اشتباه رفت.','success','growl-bottom-right');
            }else{
              Bert.alert('We are sorry but something went wrong.','success','growl-bottom-right');
            }
            $('.close').click();
          }
        } else {
          console.log('Email Sent. Check your mailbox.');
          if(TAPi18n.getLanguage()=='fa'){
            Bert.alert('ایمیل ارسال شد. صندوق پستی خود را بررسی کنید.','success','growl-bottom-right');
          }else{
            Bert.alert('Email Sent. Check your mailbox.','success','growl-bottom-right');
          }
          $('.close').click();
        }
      });
      
      Session.set('email',email); 
      Router.go('ResetPassword');
    }
  }
});

Template.ResetPassword.events({
  'submit form': function(e) {
    e.preventDefault();  
    var passwords = e.target.password.value;
    Meteor.call('resetPwd',Session.get('email'),function(err,data){
      if(err){
        console.log(err);
      }else{

        Accounts.resetPassword(data, passwords, function(err) {
          if (err) {
            console.log('We are sorry but something went wrong.');
            if(TAPi18n.getLanguage()=='fa'){
              Bert.alert('متأسفیم، اما چیزی را اشتباه رفت.','success','growl-bottom-right');
            }else{
              Bert.alert('We are sorry but something went wrong.','success','growl-bottom-right');
            }
            $('.close').click();

          }else {
            console.log('Your password has been changed. Welcome back!');
            if(TAPi18n.getLanguage()=='fa'){
              Bert.alert('تنظیم مجدد رمز عبور با موفقیت!','success','growl-bottom-right');
            }else{
              Bert.alert('Reset Password Successfully','success','growl-bottom-right');
            }
            $('.close').click();
                //alert('Reset Password Successfully');
                Router.go('/');
              }
            });
      }

    });
}
});