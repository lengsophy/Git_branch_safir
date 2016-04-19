Session.set("pro","");
Session.set("proNew","");

Template.addlistproduct.helpers({
    getListPro:function(){
        var arr=[];
        var idArray=[];
        if(this._id){
            var string=this.products.toString();
            if(Session.get('pro')){
                string=Session.get('pro');
            }
            Session.set('pro',string);
            idArray=string.split(',');
            Session.set('idlistpro', idArray);
            for(var i=0;i<idArray.length;i++){
                if(idArray[i]!=""){
                    var result=products.findOne({_id:idArray[i]});
                    arr.push(result);
                }
            } 
        }else{
         var ids=Session.get('pro');
         idArray=ids.split(',');
         Session.set('idlistpro', idArray);
         for(var i=0;i<idArray.length;i++){
            if(idArray[i]!=""){
                var result=products.findOne({_id:idArray[i]});
                arr.push(result);
            }
        } 
    }

    return arr;
},
getListProduct: function(){
    return list_product.find();
},
getProcount: function(products){
    return products.length;
},
getProduct: function(){
    return products.find();
},
});
Template.updatelistproduct.helpers({
    getProduct: function(){
        return products.find();
    },
    getlistPro: function(){
        var id = this._id;
        var list = list_product.find({_id:id});
        return list;
    }
});
Template.addlistproduct.events({
    'click #btnAdd': function(e) {
        e.preventDefault();
        var site = $('#product').val();
        if(Session.get("pro")){
            var listTags=Session.get("pro")+","+site;
        }else{
            var listTags=site;  
        }
        Session.set('newIdpro',listTags);
        Session.set("pro", listTags);
    },
    'click #btnSubmit': function(e){
        var arr=[];
        e.preventDefault();
        var title = $('#title').val();
        var type = $('#type').val();
        if(title!=='' && type!==''){
            var myArray=Session.get('idlistpro');
            for(var i=0;i<myArray.length;i++){
                if(myArray[i]!=""){
                    arr.push(myArray[i]);
                }
            }
            var obj={
                title:title,
                type:type,
                products:arr
            }
            if(this._id){
                Meteor.call('updateList_pro',this._id,obj);
                Bert.alert('Add Successfully!','Success','growl-bottom-right');
            }else{
                Meteor.call('addlistPro',obj);
                Bert.alert('Update Successfully!','Success','growl-bottom-right');
            }
        }else{
            Bert.alert('Some fields is required, please check again!','danger','growl-bottom-right');
        }
        
        
        //alert("Successfully appended");
        Router.go('addlistproduct');
    },
    'click #removeSes':function(e){
        e.preventDefault();
        
        var alltags = Session.get('pro');
        var id = this._id;
        var resl = alltags.replace(id, "");
        var prolistId=$('#value_hidden').val();
        if(prolistId){
          Meteor.call('updateListpro',prolistId,id);  
      }

      Session.set("pro", resl);   
  },
  'click #remove': function(e){
    e.preventDefault();
    var id = this._id;
    return list_product.remove({_id:id});
},
'click #clear':function(e){
    e.preventDefault();
    Session.set('pro','');
},
"click #sortname":function(e){
    e.preventDefault();
    var result = products.find({}, {sort: {title:1}});
       // alert(result);
       return result;
   },
   'click #editListpro':function(e){
    e.preventDefault();
    delete Session.keys['pro'];
    var url='/updatelistproduct/'+this._id;
    Router.go(url);
}
});