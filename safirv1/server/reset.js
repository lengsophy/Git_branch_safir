Meteor.methods({
	resetPwd: function(email){late
    var arr=[];
		var result=Meteor.users.find({"emails.address":email});
    result.forEach(function(value){
      var token=value.services.password.reset.token;
      arr.push(token);
      
    })
    console.log('token='+arr[0]);
    return arr[0];   
      
	},
  validateUserByEmail:function(email){
     var result=Meteor.users.find({"emails.address":email});
     if(result.count()>0){
        return true;
     }else{
        return false;
     }
  }
  
});