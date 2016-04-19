/*Template.getusername.helper({
	getLocation: function(ip,id){
	        Meteor.http.get('https://freegeoip.net/json/'+ip,function(err,data){
	                if(err){
	                    console.log(err);
	                }else{
	                    var json=data.content;
	                    var d=JSON.parse(json);
	                    console.log("get ip");
	                    var str=d.city+','+d.zip_code+','+d.region_name+','+d.country_name;
	                    //console.log('ID='+id+' => '+str);
	                    console.log(JSON.stringify(d));
	                    $("."+id).text(str);
	                    console.log("end ip");
	                }
	            });
	    }

});

*/