var app = angular.module('stockAdmin', ['ui.router', "ngTable"]);

app.factory('posts', [function() {
 var o = {
  posts: []
 };
 return o;
}])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

 $stateProvider
  .state('home', {
   url: '/',
   templateUrl: '/home.html',
   controller: 'MainCtrl'
  })
  .state('register', {
   url: '/register/{id}',
   templateUrl: '/register.html',
   controller: 'InsertNewCtrl'
  });
}])
.controller('MainCtrl', ['$scope', 'posts', function($scope, posts) {
 $scope.posts = posts.posts;
 $scope.names = ["ACOM", "SUBA", "SHOP", "SOUB"];
 $scope.rowCollection = [
 	{brand: "ACOM", structure: "123456", priority:"100", subinventory:"1001", warehouse:"34"}, 
 	{brand: "ACOM", structure: "153456", priority:"90", subinventory:"1001", warehouse:"77"}
 	];

 $scope.removeRow = function removeRow(row) {
        var index = $scope.rowCollection.indexOf(row);
        if (index !== -1) {
            $scope.rowCollection.splice(index, 1);
        }
    }

 $scope.retrievePriorities = function(){
 }
 
 $scope.addPost = function() {
  if (!$scope.title || $scope.title === '') {
   return;
  }
  $scope.posts.push({
   title: $scope.title,
   link: $scope.link,
   upvotes: 0,
   comments: [{
    author: 'Joe',
    body: 'Cool post!',
    upvotes: 0
   }, {
    author: 'Bob',
    body: 'Great idea but everything is wrong!',
    upvotes: 0
   }]
  });
 }

 $scope.incrementUpvotes = function(post) {
  post.upvotes += 1;
 };
}])
.controller('InsertNewCtrl', ['$scope', '$stateParams', 'posts', function($scope, $stateParams, posts) {
 $scope.post = posts.posts[$stateParams.id];
 $scope.names = ["ACOM", "SUBA", "SHOP", "SOUB"];
 $scope.warehouses = ["55 - Osasco","95 - Cajamar 2 Virtual","88 - Itapevi Virtual","461 - Santa Rita","63 - Caxias RJ","72 - Seropédica RJ Virtual","73 - Cajamar 3 Virtual","84 - Itajai Virtual","44 - Uberlandia","460 - Santa Rita bkp","98 - MarketPlace","75 - Uberlandia Virtual","86 - Recife Virtual","85 - Santa Cruz RJ Virtual","36 - Itajai","71 - Caxias RJ Virtual","64 - Seropédica RJ","37 - Cajamar 2","35 - Recife 2","48 - Cajamar","92 - Osasco Virtual","65 - Cajamar 3","34 - Santa Cruz RJ","87 - Cajamar Virtual","90 - backup 33","77 - Itapevi"];
 $scope.addComment = function() {
  if ($scope.body === '') {
   return;
  }
  $scope.post.comments.push({
   body: $scope.body,
   author: 'user',
   upvotes: 0
  });
  $scope.body = '';
 };
}]);