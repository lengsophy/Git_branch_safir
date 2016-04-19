Template.adminorder.onCreated(function(){
  // Here, we're making use of Meteor's new template-level subscriptions.
  this.subscribe( "adminorder" );
});
Template.adminorderdetail.onCreated(function(){
  // Here, we're making use of Meteor's new template-level subscriptions.
  this.subscribe( "adminattribute" );
});
$('#pageprev').hide();
numshow = 20;
Template.adminorder.events({
    'click .admin-listorder #checkAll': function(e){    
         $(".admin-listorder .check").prop('checked', $(e.currentTarget).prop('checked'));
    },
    'click #change-status': function(e){
        e.preventDefault();
        var status = $('#status').val();
        if( status !=''){
            var list = [];
            $(".admin-listorder .list").each ( function(){
                if( $(this).prop('checked') ){
                    list.push( $(this).val());
                }
            })
            console.log(list);
            if( list.length <= 0){
                Bert.alert( 'Not sucess, check at least of orders!', 'danger', 'growl-top-right' );
            }else{
                Meteor.call('updateOrderStatus', list, status, function(err, data){
                    if(!err) Bert.alert( 'Update successfully!', 'success', 'growl-top-right' );
                })
            }
        }else{
            Bert.alert( 'Not sucess, please choose of the status!', 'danger', 'growl-top-right' );
        }
    },
    'click #pagenext': function(e) {
        e.preventDefault();
        var status = $(e.currentTarget).attr('data-status');
        status = ( status !='all')? status:'';
        var total = Session.get('COUNTORDER'+status);
        var numpage = Math.ceil( total / numshow);
        //var page = Session.get('PAGE');
        Session.set('PAGE', Session.get('PAGE') + 1);
        $('.pagination li').removeClass('active');
        $(e.currentTarget).parent('li').addClass('active');

        if( Session.get('PAGE') >= numpage) 
            $('#pagenext').hide();
        else
            $('#pagenext').show();

        if( Session.get('PAGE') <= 1)
            $('#pageprev').hide();
        else
            $('#pageprev').show();
            
    },
    'click #pageprev': function(e) {
        e.preventDefault();
       var status = $(e.currentTarget).attr('data-status');
        status = ( status !='all')? status:'';
        var total = Session.get('COUNTORDER'+status);
        Session.set('PAGE', Session.get('PAGE') - 1);
        var numpage = Math.ceil( total / numshow);
        $('.pagination li').removeClass('active');
        $(e.currentTarget).parent('li').addClass('active');

       if( Session.get('PAGE') >= numpage ) 
            $('#pagenext').hide();
        else
            $('#pagenext').show();

       if( Session.get('PAGE') <= 1)
            $('#pageprev').hide();
        else
            $('#pageprev').show();
            
    },
    'click #numberpage': function(e) {
        e.preventDefault();
        var status = $(e.currentTarget).attr('data-status');
        status = ( status !='all')? status:'';
        var total = Session.get('COUNTORDER'+status);

        var num = $(e.currentTarget).text();
        var inte = Number(num);
        var numpage = Math.ceil( total / numshow);
        $('.pagination li').removeClass('active');
        $(e.currentTarget).parent('li').addClass('active');
        Session.set('PAGE', inte);
        
       if( Session.get('PAGE') >= numpage ) 
            $('#pagenext').hide();
        else
            $('#pagenext').show();

       if( Session.get('PAGE') <= 1)
            $('#pageprev').hide();
        else
            $('#pageprev').show();

        
    }
})
var page = Session.set('PAGE',1);
Template.adminorder.helpers({
    getOrder:function( status ){
        if( status != 'all')
            var ord = order.find({status:status},{sort: {time:-1}});
        else 
            var ord = order.find({},{sort: {time:-1}});

        var result = '';
        var status = ( status !='all')? status: '';
        var row = Session.get('COUNTORDER'+status);
        var page = Session.get('PAGE');

        var start = (numshow * page) - numshow;
        var end = (start + numshow ) - 1;
       
        /*
        if( keyword !='' || getfilter){
            result = tutorial.find({ "title": { $regex: new RegExp(keyword, "i") }, category_id:getfilter});
        }else{
            result = tutorial.find({});
        }
        var data = [];
        if( result.count() > 0){
            result.forEach( function(value, index){
                if(index >= start && index <= end ){
                    //console.log('Show:'+index);
                    data.push({_id:value._id, title:value.title, category_id:value.category_id, description:value.description, image:value.image,video:value.video, videoUrl:value.videoUrl, status: value.status});
                }
            });
        }
        return data;
        */
        var arrOrder = [];
        
        if( ord.count() > 0){
            ord.forEach(function(i, index){
                if(index >= start && index <= end ){
                    var obj = {
                        _id:i._id,
                        userid:i.userid,
                        orderId:i.orderId,
                        total:i.total,
                        items:i.items,
                        address:i.address,
                        delivery:i.delivery,
                        t:i.time,
                        status:i.status
                    }
                    arrOrder.push(obj);
                }
            });
            return arrOrder;
        }else return 0;
    },
    getuserOrder:function(id){
        console.log('hello'+Meteor.users.findOne({_id:id}));
         return Meteor.users.findOne({_id:id});
     },
    getUserorderName:function(userId){
        var result = users.findOne({_id:userId});
        return result.profile.firstname+" "+result.profile.lastname;
        
    },
    getTime:function(time){
        if(typeof(time) == "number"){
        var d = new Date(time), // Convert the passed timestamp to milliseconds
          yyyy = d.getFullYear(),
          mm = ('0' + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
          dd = ('0' + d.getDate()).slice(-2),   // Add leading 0.
          hh = d.getHours(),
          h = hh,
          min = ('0' + d.getMinutes()).slice(-2),  // Add leading 0.
          ampm = 'AM',
          time;
       
         if (hh > 12) {
            h = hh - 12;
            ampm = 'PM';
         } else if (hh === 12) {
         h = 12;
             ampm = 'PM';
         } else if (hh == 0) {
            h = 12;
         }
     // ie: 2013-02-18, 8:35 AM 
        time = yyyy + '-' + mm + '-' + dd ;
    
        return time;
        }else{
            return "no date";

        }
          
     },
     countOrder: function( status ){
        Meteor.call('countOrder', status, function(err, data){
            if(!err) Session.set('COUNTORDER'+data.status, data.count );
        })
        var count = Session.get('COUNTORDER'+status);
        return count;
     },
     getNumberpage: function( status ) {
        var status = (status !='all')? status:'';

        var allpags = Session.get('COUNTORDER'+status) / numshow;
        var intvalue = Math.ceil(allpags);
        var arraynumber = [];
        for (var i = 2; i <= intvalue; i++) {
            var obj = {
                num: i
            }
            arraynumber.push(obj);
        }

        return arraynumber;

    }
})
Template.adminorderdetail.helpers({
    getAttributeByID: function( attrid ){
        var attr = attribute.findOne({_id:attrid});
        return attr;
    }
})
Template.adminorderdetail.events({
    'click #back': function(e){
        e.preventDefault();
        Router.go('/admin/order/all');
    }
})