Meteor.methods({
	AddQuizz:function(obj){
		quizz.insert(obj);
	},
	UpdateQuizz:function(id,obj){
		quizz.update({_id:id},{$set:obj});
	},
	deleteqa:function(id){
		quizz.remove({_id:id});
	},
	AddAnswerQuizz:function(obj){
		answerquizz.insert(obj);
	},
	getAnsQuizz:function(){
		console.log("Welcome to Answer Tag");
		var data = products.find().fetch();
		var alltags=[];
		for(var i=0;i<data.length;i++){
			for(var j=0;j<data[i].tag_quizz.length;j++){
				if(alltags.indexOf(data[i].tag_quizz[j])==-1){
					alltags.push(data[i].tag_quizz[j])
				}
			}
		}
		return alltags;
	}
});