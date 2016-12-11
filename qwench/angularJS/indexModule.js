var app = angular.module('indexApp', ['ngRoute']);

app.config(function($routeProvider){
  $routeProvider.when("/questions",
    {
      templateUrl: "questionsList.html",
      controller: "QuestionsCtr",
      controllerAs: "app"
    }
  );
});

app.controller('QuestionsCtr', function($scope,$http) {
	$scope.questions =[];
	
	$http.get('http://localhost:8080/question/all').success(function(data){
		$scope.questions = data;
	});
});

//example to use params. add to when :paramName. like that .when("/questions/:param1"
app.controller('AppCtrl', function($routeParams) {
  var self = this;
  self.message = $routeParams.message;
});