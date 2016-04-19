
Meteor.methods({
  insertanswer:function(obj){
    anwser.insert(obj);
  },
  insertQuestionAnswer:function(obj){
    var id=answerquizz.insert(obj);
    return id;
  }
});
