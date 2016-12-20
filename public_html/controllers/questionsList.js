
app.controller('QuestionsCtr', function($scope,$http) {
	$scope.questions =[];
	
	$http.get(SERVER_APP_BASE_URL+'question/all').success(function(data){
		$scope.questions = data;
	});
});
