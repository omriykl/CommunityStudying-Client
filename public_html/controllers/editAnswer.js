app.controller('editAnswere', ['$scope','$http','$routeParams', function ($scope, $http, $routeParams) {
        
     var currentId = $routeParams.param;

    $http.get(SERVER_APP_BASE_URL+'comment/getById?id=' + currentId).success(function(data){
		$scope.answer = data;
                $scope.htmlContent = data.content;
	});
  
    $scope.submit = function () {
        var data = {
            content : $scope.htmlContent
        };
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        $http.post(SERVER_APP_BASE_URL+ 'comment/update'+currentId, data, config)
            .success(function (data, status, headers, config) {
                $scope.PostDataResponse = data;
                window.location = "/question/view/" + $scope.answer.questionId;
            })
            .error(function (data, status, header, config) {
                //   $scope.ResponseDetails = "Data: " + data +
                //	<hr />status: " + status +
                //       "<hr />headers: " + header +
                //       "<hr />config: " + config;
            });
    };

}]);
