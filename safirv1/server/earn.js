// Meteor.methods({
// 	getPointByLevel:function(oldpoint){
// 		console.log('Mypoint=='+oldpoint)
// 		var arrmem=[];
// 		var resultmembership=membership.find();
//         resultmembership.forEach(function(value){
//             if(value.minpoint <= oldpoint && oldpoint <=value.maxpoint){
//                 arrmem.push(value);
//             }
//         });
//         if(arrmem[0].name=='black'){
//             return 10;
//         }
//         if(arrmem[0].name=='silver'){
//             return 20;
//         }
//         if(arrmem[0].name=='gold'){
//             return 40;
//         }
// 	}
// })