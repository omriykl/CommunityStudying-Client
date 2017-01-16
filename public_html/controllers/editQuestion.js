app.controller('editQuestion', ['$scope','$http','$routeParams', function ($scope, $http, $routeParams) {

     var currentId = $routeParams.param;
     $scope.isConnected=IS_CONNECTED;
        $scope.USER_ID = USER_ID;
        var currentId = $routeParams.param;
	$http.get(SERVER_APP_BASE_URL+'post/' + currentId).success(function(data){
		$scope.question = data;
	});
    
    

    $scope.submit = function() {
            $('#loading_image').show();
            var data = {
                title: $scope.question.title,
                content: $scope.question.content
            };
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            console.log(data);
            $http.put(SERVER_APP_BASE_URL + 'post/update/'+$scope.question.id+'?userTokenId=' + USER_TOKEN, data, config)
                .success(function(data, status, headers, config) {
                    $scope.PostDataResponse = data;
                    window.location = "#questions/view/" + data.id;
                })
                .error(function(data, status, header, config) {
                    //   $scope.ResponseDetails = "Data: " + data +
                    //	<hr />status: " + status +
                    //       "<hr />headers: " + header +
                    //       "<hr />config: " + config;
                });

    };


}]);