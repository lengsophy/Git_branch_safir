Session.set('sesIndex',0);
Session.set('strqu','');
Template.quizzQA.rendered = function(){
	$("#quizzpop").click();
}
Template.quizzQA.events({
	'click #goNext':function(e){
		var arr=[];
		e.preventDefault();
		var index=Session.get('sesIndex');
		Session.set('sesIndex',index+1);
		var question=$(".question").text();
		var answer=$("input[name='checkbox']:checked").val();
		var parent_tag=$(".question").attr('data-tag');
		var tag=$("input[name='checkbox']:checked").attr('data-tag');
	
		var str=question+'/'+answer+'/'+parent_tag+'/'+tag+';';
		if(Session.get('strqu')==''){
			var newstr=str;
		}else{
			var newstr=str+Session.get('strqu');
		}
		Session.set('strqu',newstr);

		var quAndan= Session.get('strqu').split(';');
		for(var i=0;i<quAndan.length;i++){
			if(quAndan[i]){
				var arrayquan=quAndan[i].split('/');
				var obj={
					question:arrayquan[0],
					answer:arrayquan[1],
					parent_tag:arrayquan[2],
					tag:arrayquan[3]
				}
				arr.push(obj);
			}
		}
		
		var countqu=Session.get('CountQuestion');
		var countses = Session.get('sesIndex');
		
		if(countqu == countses){
			Session.set('sesIndex',0);
			var userId=Meteor.userId();
			var quizz=arr;
			console.log("quizz " + quizz);
			var obj={
				quizzId:Session.get('quizzId'),
				userId:userId,
				quizz:arr
			};
			Meteor.call('insertQuestionAnswer',obj,function(err,res){
				if(!err){
					if(TAPi18n.getLanguage()=='fa'){
						Bert.alert('قرار دادن موفقیت سوال!','success','growl-bottom-right');
					}else{
						Bert.alert('Insert Question success!','success','growl-bottom-right');
					}
					$(".close").click();
					var route="/suggestpages/"+Session.get('quizzId');
					Router.go(route);
				}
				else{
					if(TAPi18n.getLanguage()=='fa'){
						Bert.alert('قرار دادن موفقیت سوال!','danger','growl-bottom-right');
					}else{
						Bert.alert('Error!','danger','growl-bottom-right');
					}
				}
					
				});	
			

		}
	},
	'change #selectQ':function(){
		var get_QA = $("#selectQ").val();
		Session.set("GET_QA", get_QA);
	},
	'click #question':function(){
		var qestion = $("#q_id").val();
		console.log(question);
	},
	'click #backqu':function(e){
		Session.set('sesIndex',Session.get('sesIndex')-1);
		if(Session.get('sesIndex')<0){
			Session.set('sesIndex',0);
		}
		var index=Session.get('sesIndex');
		var question=this.question[index].question;
		var answer=$("input[name='checkbox']:checked").val();
		var str=question+':'+answer+';';
		var newStr=Session.get('strqu').replace(str,'');
		Session.set('strqu',newStr);
	},
	'click #goBack':function(){
		Router.go('/listQuizz');
	}
});

Template.quizzQA.helpers({
	getFirstQu:function(question){
		var index=Session.get('sesIndex');
		if(question.length-1<index){
			Session.set('sesIndex',question.length-1);
			index=Session.get('sesIndex');
		}
		return question[index];
	},
	getQuestion:function(){
		return quizzQA.find();
	},
	countQuestion: function(id){
		var count=quizz.findOne({"_id":id});
		Session.set('CountQuestion',count.question.length);
		Session.set('quizzId',id);
	},
	getAnswer:function(){
		var get_AS = Session.get("GET_QA");
		return tags.find({_id:get_AS});
	}
});
