Session.set('NUM_QUESTION',0);
// ============================ ADD QUIZZ AND ANSWER ===================== //
Template.addquizz.helpers({
	listTag:function(){
		var list = Session.get('AddTag');
		if(list == ''){
			return;
		}
		var list = Session.get('AddTag').split(";");
		
		var arr =[];
		for(var i=0;i<list.length;i++){
			if(list[i]!=''){
				var obj={
					answer_tag:list[i]
				}
				arr.push(obj);
			}
			
		}
		return arr;
	},
	getParentTag:function(){
		return parent_tags.find();
	},
	getTag:function(){
		var tag = Session.get("TAG_VALUE");
		if(tag)
			return tags.find({parent:tag});
		else
			return false;
	},
	getAnsTag:function(){
		Meteor.call('getAnsQuizz',function(err,data){
			if(err){
				console.log("Cannot get ans quizz: "+err.reason);
			}else{
				Session.set('ANSQUIZZ',data);
			}
		});
		var ansqu = Session.get('ANSQUIZZ');
		var arr = [];
		for(var i=0;i<ansqu.length;i++){
			if(ansqu[i]!=''){
				var obj={
					tag_quizz:ansqu[i]
				}
				arr.push(obj);
			}
		}
		//console.log("ANSWER Q: "+JSON.stringify(arr));
		return arr;
	}
});

Template.addquizz.events({
	'change #ans_tag':function(){
		var ans_tag = $('#ans_tag').val();
		Session.set("ANSTAG",ans_tag);
	},
	'submit form':function(e){
		e.preventDefault();
		//var answer_tag =$("#alltag_input").val();
		var answer_tag = Session.get('ANSTAG');
		if(Session.get("AddTag")){
			var allTags = Session.get('AddTag')+";"+answer_tag;
			Session.set("AddTag",allTags);
		}else{
			Session.set("AddTag",answer_tag);
		}
		if(TAPi18n.getLanguage()=='fa'){
  				  Bert.alert('برچسب است، شده است اضافه کنید!','success','growl-bottom-right');
          }else{
            Bert.alert('Tag has been add','success','growl-bottom-right');
          }
          $('.close').click();
		//console.log(Session.get("AddTag"));
	},
	'click #quizzDelete':function(e){
		e.preventDefault();
		//alert();
		var answertag=$('#quizzDelete').attr("data-value");
		var newAnsTag=Session.get('AddTag').replace(answertag,'');
		Session.set('AddTag',newAnsTag);
		if(TAPi18n.getLanguage()=='fa'){
  				  Bert.alert('برچسب حذف شده است!','success','growl-bottom-right');
          }else{
            Bert.alert('Tag has been remove','success','growl-bottom-right');
          }
          $('.close').click();
	},
	"click #btn-save":function(){
		var arr_result = [];
		var quizz_name = $("#quizz_name").val();
		var quizz_type = $("#quizz_type").val();
		$(".tbodyquestion .quess-tbody").each(function(val){
			var arr_answer = [];
			var question = $("#key_quizz",this).val();
			var par_tag = $('tr.quest-list',this).attr("data-par");
			var quest_image = $('tr.quest-list',this).attr("data-quesImage");
			console.log("question"+question);
			$("tr.answer-list",this).each(function(val){
				var answer = $("#keysval",this).val();
				var answer_image = $(this).attr("data-answerImage");
			
				var answer_tag = $(this).attr("data-tag");
				answer_tag=answer_tag.split(';');

				console.log("answer"+answer);
				arr_answer.push({value:answer,image:answer_image,tag:answer_tag});
			});
			arr_result.push({question:question,parent_tag:par_tag,image:quest_image,answers:arr_answer});
		});
		console.log(arr_result);
		var new_obj = {
			name:quizz_name,
			type:quizz_type,
			question:arr_result
		}
		delete Session.keys['AddTag'];
		console.log("My test:"+new_obj);
		if(quizz_name == ""){
			$("#qiuzzInfo").html("Quizzname can't empty!!!");
		}else if(quizz_type == "Select Type"){
			$("#qiuzzInfo").html("Quizz Type can't empty!!!");
		}else{
			Meteor.call("AddQuizz",new_obj,function(error){
				if(error){
					console.log("AddQuizz problem!!");
				}else{
					console.log("AddQuizz Success");
					if(TAPi18n.getLanguage()=='fa'){
  				  		Bert.alert('','success', 'fixed-bottom', 'fa-frown-o');
		            }else{
		             	Bert.alert('AddQuizz Successfull!','success', 'fixed-bottom', 'fa-frown-o');
		            }
		          	$('.close').click();
					Router.go("managequizz");
				}
			});
		}
	},
	"change #quizz_type":function(){
		$("#qiuzzInfo").html("");
	},
	"keyup #quizz_name":function(){
		$("#qiuzzInfo").html("");
	},
	"click #add-answer":function(e){
		e.preventDefault();
    	var html = "";
    	var num = Session.get('NUM_QUESTION');
        var answer = $('#answer').val();
        var answer_image =  Session.get('ANSWER_IMAGE');
        var answer_tag = $("#tag_answer option:selected").text();
        var question = $('#question').val();
        var currentTags=Session.get('AddTag');
        if(answer == "" || question == ""){
        	$("#answer_required").html("Answer can't empty!!!");
        }else if(answer_tag == "Select Tag"){
        	$("#answer_required").html("Tag can't empty!!!");	
        }else{
	        html += '<tr class="answer-list" data-answer="'+answer+'" data-answertag="'+answer_tag+'" data-answerImage="'+answer_image+'" data-tag="'+currentTags+'">';
	            html += '<td>';
	        		html += '<img src="/images/2-bg.png" width="40">';
	        	html += '</td>';
				html += '<td><label style="color:blue">Answer: </label><input type="text" id="keysval" value="'+answer+'"></td>';
				html += '<td>';
					html += '<a href="#" class="remove pull-right">remove</a>';
				html += '</td>';
			html += '</tr>';
	        $(".answer-list"+num).append(html);
	    }
	    Session.set('AddTag','');
	},
	"click #add-question":function(e){
		e.preventDefault();
		var num = Session.get("NUM_QUESTION") + 1;
		Session.set("NUM_QUESTION",num);
		console.log("MYNUM="+num);	
    	var html = "";
    	var Remove = "remove";
    	var question_img = Session.get('QUESTION_IMAGE');
        var question = $('#question').val();
        var par_tag = $('#par_tag option:selected').text();
       if(question == ""){
       		$("#quizz_required").html("Question can't empty!!!");
       }else if(par_tag == "Select Parent_Tag"){
       		$("#quizz_required").html("Parentage can't empty!!!");
       }else{
	        html += '<tbody class="quess-tbody answer-list'+num+'" data-num="'+num+'">';
		        html += '<tr class="quest-list" data-question="'+question+'" data-par="'+par_tag+'" data-quesImage="'+question_img+'">';
		        	html += '<td>';
		        		html += '<img src="/images/p1.jpg" width="40">';
		        	html += '</td>';
		        	html += '<td><label style="color:red">Question: </label><input type="text"  id="key_quizz"  value="'+question+'"></td>';
		        	html += '<td>';
						html += '<a href="#" id="remove_div" class="remove_div pull-right">remove</a>';
					html += '</td>';
		        html += '<tr>';
		    html += '</tbody>'
	        $('.tbodyquestion').append(html);	
	    }
	},
	"change #img_quest": function(event, template) {
        var files = event.target.files;
        for (var i = 0, ln = files.length; i < ln; i++) {
            images.insert(files[i], function (err, fileObj) {
                Session.set('QUESTION_IMAGE', fileObj._id);
            });
        }
    },
    "change #img_answer": function(event, template) {
        var files = event.target.files;
        for (var i = 0, ln = files.length; i < ln; i++) {
            images.insert(files[i], function (err, fileObj) {
                Session.set('ANSWER_IMAGE', fileObj._id);
            });
        }
    },
    "change #par_tag":function(){
    	var tagname = $("#par_tag").val();
    	Session.set("TAG_VALUE",tagname);
    	$("#quizz_required").html("");
    },
    "change #tag_answer":function(){
    	$("#answer_required").html("");
    },
    'click .remove': function(e,tpl){
		$(e.currentTarget).parent().parent().remove();
	},
	'click #remove_div':function(e){
		// var num = $(e.currentTarget).attr("data-num");
		$(e.currentTarget).parent().parent().remove();
	},
	'keyup #question':function(){
		$("#quizz_required").html("");
	},
	'keyup #answer':function(){
		$("#answer_required").html("");
	}
});
// ============================ UPDATE QUIZZ AND ANSWER ===================== //
Template.updatequizz.helpers({
	listTag:function(){
		var list = Session.get('AddTag');
		if(list == ''){
			return;
		}
		var list = Session.get('AddTag').split(";");
		
		var arr =[];
		for(var i=0;i<list.length;i++){
			if(list[i]!=''){
				var obj={
					answer_tag:list[i]
				}
				arr.push(obj);
			}
			
		}
		return arr;
	}
});
Template.updatequizz.events({
	'submit form':function(e){
		e.preventDefault();
		var answer_tag =$("#alltag_input").val();
		if(Session.get("AddTag")){
			var allTags = Session.get('AddTag')+";"+answer_tag;
			Session.set("AddTag",allTags);
		}else{
			Session.set("AddTag",answer_tag);
		}
		if(TAPi18n.getLanguage()=='fa'){
  				  Bert.alert('برچسب است، شده است اضافه کنید!','success','growl-bottom-right');
          }else{
            Bert.alert('Tag has been add','success','growl-bottom-right');
          }
          $('.close').click();
		//console.log(Session.get("AddTag"));
	},
	'click #quizzDelete':function(e){
		e.preventDefault();
		//alert();
		var answertag=$('#quizzDelete').attr("data-value");
		var newAnsTag=Session.get('AddTag').replace(answertag,'');
		Session.set('AddTag',newAnsTag);
		if(TAPi18n.getLanguage()=='fa'){
  				  Bert.alert('برچسب حذف شده است!','success','growl-bottom-right');
          }else{
            Bert.alert('Tag has been remove','success','growl-bottom-right');
          }
          $('.close').click();
	},
	"click #btn-save":function(){
		var id = this._id;
		var arr_result = [];
		var quizz_name = $("#quizz_name").val();
		var quizz_type = $("#quizz_type").val();
		$(".tbodyquestion .quess-tbody").each(function(val){
			var arr_answer = [];
			var question = $("#key_quizz",this).val();
			var par_tag = $('tr.quest-list',this).attr("data-par");
			var quest_image = $('tr.quest-list',this).attr("data-quesImage");
			console.log("question"+question);
			$("tr.answer-list",this).each(function(val){
				var answer = $("#keysval",this).val();
				var answer_image = $(this).attr("data-answerImage");
				/*var answer_tag = $(this).attr("data-answertag");*/
				var answer_tag = $(this).attr("data-tag");
				answer_tag=answer_tag.split(';');

				console.log("answer"+answer);
				arr_answer.push({value:answer,image:answer_image,tag:answer_tag});
			});
			arr_result.push({question:question,parent_tag:par_tag,image:quest_image,answers:arr_answer});
		});
		console.log(arr_result);
		var new_obj = {
			name:quizz_name,
			type:quizz_type,
			question:arr_result
		}
		//delete Session.keys['AddTag'];
		Meteor.call("UpdateQuizz",id,new_obj,function(error){
			if(error){
				console.log("UpdateQuizz problem!!"+error.reason());
			}else{
				console.log("UpdateQuizz Success");
				if(TAPi18n.getLanguage()=='fa'){
  				  	Bert.alert('','success','fixed-bottom', 'fa-frown-o');
		        }else{
		            Bert.alert('UpdateQuizz Successfull!','success','fixed-bottom', 'fa-frown-o');
		        }
		        $('.close').click();
				Router.go("managequizz");
			}
		});
	},
	"click #add-answer":function(e){
		e.preventDefault();
    	var html = "";
    	var num = Session.get('NUM_QUESTION');
        var answer = $('#answer').val();
        var answer_image =  Session.get('ANSWER_IMAGE');
        	//alert(answer_image);
        var answer_tag =$("#tag_input").val(); //$("#tag_answer option:selected").text();
        if(answer == ""){
        	$("#answer_required").html("Answer can't empty!!!");
        }else if(answer_tag == "Select Tag"){
        	$("#answer_required").html("Tag can't empty!!!");	
        }else{
	        html += '<tr class="answer-list" data-answer="'+answer+'" data-answertag="'+answer_tag+'" data-answerImage="'+answer_image+'">';
	            html += '<td>';
	        		html += '<img src="/images/2-bg.png" width="40">';
	        	html += '</td>';
				html += '<td><label style="color:blue">Answer: </label><input type="text" id="keysval" value="'+answer+'"></td>';
				html += '<td>';
					html += '<a href="#" class="remove pull-right">remove</a>';
				html += '</td>';
			html += '</tr>';
	        $(".answer-list"+num).append(html);
	    }
	    //Session.set()
	},
	"click #add-question":function(e){
		e.preventDefault();
		var num = Session.get("NUM_QUESTION") + 1;
		Session.set("NUM_QUESTION",num);
		console.log("MYNUM="+num);	
    	var html = "";
    	var Remove = "remove";
    	var question_img = Session.get('QUESTION_IMAGE');
        var question = $('#question').val();
        var par_tag = $('#par_tag option:selected').text();
        if(question == ""){
        	$("#quizz_required").html("Question can't empty!!!");
        }else if(par_tag == "Select Parentage"){
        	$("#quizz_required").html("Parentage can't empty!!!");
        }else{
        	html += '<tbody class="quess-tbody answer-list'+num+'">';
		        html += '<tr class="quest-list" data-question="'+question+'" data-par="'+par_tag+'" data-quesImage="'+question_img+'">';
		        	html += '<td>';
		        		html += '<img src="/images/p1.jpg" width="40">';
		        	html += '</td>';
		        	html += '<td><label style="color:red">Question: </label><input type="text"  id="key_quizz"  value="'+question+'"></td>';
		        	html += '<td>';
						html += '<a href="#" class="remove_div pull-right">remove</a>';
					html += '</td>';
		        html += '<tr>';
		    html += '</tbody>'
	        $('.tbodyquestion').append(html);
        }	
	},
	"change #img_quest": function(event, template) {
        var files = event.target.files;
        for (var i = 0, ln = files.length; i < ln; i++) {
            images.insert(files[i], function (err, fileObj) {
                Session.set('QUESTION_IMAGE', fileObj._id);
            });
        }
    },
    "change #img_answer": function(event, template) {
        var files = event.target.files;
        for (var i = 0, ln = files.length; i < ln; i++) {
            images.insert(files[i], function (err, fileObj) {
                Session.set('ANSWER_IMAGE', fileObj._id);
            });
        }
    },
    "change #par_tag":function(){
    	var tagname = $("#par_tag").val();
    	Session.set("TAG_VALUE",tagname);
    	$("#quizz_required").html("");
    },
    "change #tag_answer":function(){
    	$("#answer_required").html("");
    },
    'click .remove': function(e,tpl){
		$(e.currentTarget).parent().parent().remove();
	},
	'keyup #question':function(){
		$("#quizz_required").html("");
	},
	'keyup #answer':function(){
		$("#answer_required").html("");
	}
});
Template.updatequizz.helpers({
	// getImage: function(image){
 //        var img = images.findOne({_id:image});
 //        if(img){
 //            console.log(img.copies.images.key);
 //            return img.copies.images.key;
 //        }else{
 //            return;
 //        }
 //    },
    getParentTag:function(){
		return parent_tags.find();
	},
	getTag:function(){
		var tag = Session.get("TAG_VALUE");
		if(tag)
			return tags.find({parent:tag});
		else
			return false;
	}
});
// ============================ MANAGE QUIZZ AND ANSWER ===================== //

Template.managequizz.helpers({
	getquizz:function(){
		return quizz.find();
	}
});
Template.updatequizz.events({
	"click .remove":function(){
		var id = this._id;
		if(confirm("Are you sure want to delete this?")){
			Meteor.call("deleteqa",id);
		}
		if(TAPi18n.getLanguage()=='fa'){
  				  Bert.alert('برچسب حذف شده است!','success','growl-bottom-right');
          }else{
            Bert.alert('Quiz has been remove','success','growl-bottom-right');
          }
	}
});
Template.managequizz.events({
	"click .remove":function(){
		var id = this._id;
		if(confirm("Are you sure want to delete this?")){
			Meteor.call("deleteqa",id);
		}
		if(TAPi18n.getLanguage()=='fa'){
  				  Bert.alert('برچسب حذف شده است!','success','growl-bottom-right');
          }else{
            Bert.alert('Quiz has been remove','success','growl-bottom-right');
          }
	}
});
//=============================== List Quizz =====================
Template.listQuizz.helpers({
	qetListQuizz:function(){
		return quizz.find({type:"Profile"});
	}
});
