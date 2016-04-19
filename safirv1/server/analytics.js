Meteor.methods({  
     eventCall: function(url) {  
        Meteor.http.post(url,function(err, result) {  
            if (!err)  
              console.log(" result "+result);  
        });  
    }  
});