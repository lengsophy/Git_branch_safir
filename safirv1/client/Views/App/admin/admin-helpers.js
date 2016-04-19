getTimestamp = function(){
	var date = new Date();
   	var timestamp = date.getTime() / 1000;
   	return timestamp;
}

Template.registerHelper('getHumanDate', function(timestamp){
 
  var d = new Date(timestamp * 1000),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        hour = d.getHours();
        min = d.getMinutes();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('/')+' '+hour+':'+min;
});