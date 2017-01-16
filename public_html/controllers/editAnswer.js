app.controller('editAnswere', ['$scope','$http','$routeParams', function ($scope, $http, $routeParams) {
        
     var currentId = $routeParams.param;

    $http.get(SERVER_APP_BASE_URL+'comment/' + currentId).success(function(data){
		$scope.answer = data;
	});
    
    $scope.submit = function () {
        var data = $scope.answer.content;
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        $http.put(SERVER_APP_BASE_URL+ 'comment/update/'+currentId+'?userTokenId=' + USER_TOKEN, data, config)
            .success(function (data, status, headers, config) {
                $scope.PostDataResponse = data;
                window.location = "#questions/view/" + $scope.answer.post.id;
            })
            .error(function (data, status, header, config) {
                //   $scope.ResponseDetails = "Data: " + data +
                //	<hr />status: " + status +
                //       "<hr />headers: " + header +
                //       "<hr />config: " + config;
            });
    };
    
}]);
