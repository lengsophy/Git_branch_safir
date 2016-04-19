Meteor.methods({
	addPages:function(obj, str){
		var id = pages.insert(obj);
		if( id ){
			var fs = Meteor.npmRequire('fs');
			fullpath=process.env.PWD;
			if( typeof fullpath == 'undefined' ){
				base_path = fs.realpathSync( process.cwd() + '../../../../../../' );
			}else{
				base_path=fullpath;
			}

			fs.writeFile(base_path+"/client/Views/App/page/"+obj.tempname+'.html', str, function(err) {
			    if(err) {
			        return console.log(err);
			    }
			    console.log("The file was saved!");
			}); 
		}
	},
	updatePages:function(id,obj){
		check(id, String);
		check(obj, Object)
		return pages.update({_id:id},{$set:obj});
	},
	deletePages:function(id){
		console.log( "ID:"+id)
		var fs = Meteor.npmRequire('fs');
		fullpath=process.env.PWD;
		if( typeof fullpath == 'undefined' ){
			base_path = fs.realpathSync( process.cwd() + '../../../../../../' );
		}else{
			base_path=fullpath;
		}

		var data = pages.findOne({_id:id});
		fs.unlinkSync(base_path+"/client/Views/App/page/"+data.tempname+'.html');
		pages.remove(id);

	},
	updatePagesProduct: function(id,pro){
		return pages.update({_id:id},{$set:{productid:pro}});
	},
	getpages: function(){
		return pages.find({});
	}
});