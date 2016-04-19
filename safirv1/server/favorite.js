
Meteor.methods({
  insertFavoritee:function(attr){
    favorite.insert(attr);
  },
  deleteFavoritee:function(productId, userId){
    favorite.remove({proId:productId, userId: userId});
  },
  reviewtFavorite:function(attr){
    favoritereview.insert(attr);
  }

});