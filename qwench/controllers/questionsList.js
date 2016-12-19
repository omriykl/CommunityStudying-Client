var app = angular.module('indexApp', ['ngRoute']);



app.controller('QuestionsCtr', function($scope,$http) {
	$scope.questions =[];
	
	$http.get('http://localhost:8080/question/all').success(function(data){
		$scope.questions = data;
	});
});
