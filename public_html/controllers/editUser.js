app.controller('editUser', ['$scope','$http','$routeParams', function ($scope, $http, $routeParams) {
   
        var currentId = $routeParams.param;
	$http.get(SERVER_APP_BASE_URL+'user/get?id=' + currentId).success(function(data){
		$scope.user = data;             
	});
        $scope.user={
                    "firstName": "guy",
                    "lastName": "gggg",
                "email": "guyuy",
                "password": "gjgjg"            
                };
                
                
         $scope.facultySelected = function(item) {
        //$scope.item.size.code = $scope.selectedItem.code
        var id = item.id;
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'course/getUserAllData/?facultyId='.concat(id),
        }).success(function(result) {
            $scope.courses = result.allData;
        });
    };

        

      
        $scope.submit = function () {
            var data = $.param({
                firstName: $scope.user.firstName,
                lastName: $scope.user.lastName,
                email: $scope.user.email,
                password: $scope.user.password,
                courses : $scope.selectedCourses
            });
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            $http.post(SERVER_APP_BASE_URL +'/user/update?id='+ currentId, data, config)
                .success(function (data, status, headers, config) {
                    $scope.PostDataResponse = data;
                    location.reload();

                })
                .error(function (data, status, header, config) {
                    //   $scope.ResponseDetails = "Data: " + data +
                    //	<hr />status: " + status +
                    //       "<hr />headers: " + header +
                    //       "<hr />config: " + config;
                });
        };

}]);
