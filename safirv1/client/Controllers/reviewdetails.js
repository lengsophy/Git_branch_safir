Session.set("filter","");
Session.set('fiterValue',"");
Session.set('removefilter','');
Session.set('numberReviews',false);
Template.addreviewsreyden.events({
	'click #addreview': function(e,tpl){
		e.preventDefault();
		var userid=Meteor.userId();
		var title=tpl.$("#title").val();
		var comment=tpl.$("#comment").val();
		var grade=tpl.$("#sel1").val();
		if(userid==null){
			if(TAPi18n.getLanguage()=='fa'){
				Bert.alert('شما باید وارد سیستم شوید برای ارسال یک بررسی!','success','growl-bottom-right');
			}else{
				Bert.alert('You have to be logged to submit a review!','success','growl-bottom-right');
			}
			$('.close').click();
			//alert("You have to be logged to submit a review!");
			return;
		}
		Meteor.call('add_review',title,comment,grade,userid,this._id);
		if(TAPi18n.getLanguage()=='fa'){
			Bert.alert('نقد و بررسی موفقیت اضافه شده است!','success','growl-bottom-right');
		}else{
			Bert.alert('Review added successfully!','success','growl-bottom-right');
		}
		$('.close').click();
		//alert("Review added successfully!")
	}
});

Template.addreviewsreyden.helpers({
	existReview:function(review){
		if(review){
			return true;
		}else{
			return false;
		}
	},
	getReviews: function(reviews,filtre,toremove){
		if(Session.get('fiterValue')=="" || Session.get('fiterValue')=="undefined"){
			var lastResult=[];
			var numberOfResult=Session.get('numberOfReviews');

			if(numberOfResult>reviews.length)
				numberOfResult=reviews.length
			console.log('NUMBER OF lastResult.length '+numberOfResult);
			for(var i=0;i<numberOfResult;i++)
				lastResult.push(reviews[i]);

			console.log('NUMBER OF lastResult.length '+lastResult.length);
			return lastResult;

		}
		console.log('Calling filterReview='+reviews.length);
		var values=Session.get('fiterValue').split(':');
			//fiterValue
			var ages=[];
			var myTags=[];
			var grades=[];

			for(var i=0;i<values.length;i++){
				var param=values[i];
				if(param=='')
					continue;
				console.log("Processing "+param);
				if(param.indexOf('-')>=0){
					ages.push(param);
				}else if(param.indexOf('/')>=0){
					grades.push(param);
				}else{
					myTags.push(param);
				}
			}

			console.log('ages:'+ages.length);
			console.log('myTags:'+myTags.length);
			console.log('grades:'+grades.length);

			var results=[];
			for(var i=0;i<ages.length;i++){
				var ageMin=Number(ages[i].split('-')[0]);
				var ageMax=Number(ages[i].split('-')[1]);

				console.log('min:'+ageMin);
				console.log('max:'+ageMax);
				//Loop into reviews
				for(var j=0;j<reviews.length;j++){
					Meteor.subscribe("users",reviews[j].user);
					var curUser=users.findOne({"_id":reviews[j].user});
					if(Number(curUser.profile.age)<= ageMax && Number(curUser.profile.age)>=ageMin){
						results.push(reviews[j]);

					}

				}
			}
			console.log('Size of the rest:'+reviews.length);
			console.log('Still in the sand after ager filter:'+results.length);
			if(results.length>0){
				console.log('remise a 0');
				reviews=[];
				reviews=results.slice(0);
				results=[];
			}

			console.log('Size of the rest:'+reviews.length);
			for(var i=0;i<myTags.length;i++){
				var curTag=myTags[i];
				console.log('tagging '+curTag);
				for(var j=0;j<reviews.length;j++){
					var curUser=users.findOne({"_id":reviews[j].user});
					if(curUser.profile.tag.indexOf(curTag)>=0)
						results.push(reviews[j]);
				}
			}

			console.log('Still in the sand(tags):'+results.length);
			if(results.length>0){
				console.log('remise a 0');
				reviews=[];
				reviews=results.slice(0);
				results=[];

			}
			if(grades.length==0)
				results=reviews.slice(0);
			console.log('Size of the rest:'+reviews.length);
			for(var i=0;i<grades.length;i++){
				var curGrade=grades[i].split('/')[0];
				//Loop into reviews
				for(var j=0;j<reviews.length;j++){
					
					if(Number(reviews[j].grade)==Number(curGrade) && results.indexOf(reviews[j])<0){
						results.push(reviews[j]);
						console.log('Comparing '+curGrade+' and '+reviews[j].grade);
					}

				}
			}

			console.log('Still in the sand(grades):'+results.length);
			console.log('afterFilter:'+results.length);

			var lastResult=[];
			var numberOfResult=Session.get('numberOfReviews');

			if(numberOfResult>results.length)
				numberOfResult=results.length
			console.log('NUMBER OF lastResult.length '+numberOfResult);
			for(var i=0;i<numberOfResult;i++)
				lastResult.push(results[i]);

			console.log('NUMBER OF lastResult.length '+lastResult.length);
			return lastResult;


		}
	});
