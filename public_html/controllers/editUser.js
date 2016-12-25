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
                
  $scope.options = ["Text", "Markdown", "HTML", "PHP", "Python", "Java", "JavaScript", "Ruby", "VHDL", "Verilog", "C#", "C/C++"]
      $scope.courses = []

        var optionalTags=[];
        
      $scope.tags = {
        value: [],
        options: []

      }
      
        $scope.submit = function () {
            var data = $.param({
                firstName: $scope.user.firstName,
                lastName: $scope.user.lastName,
                email: $scope.user.email,
                password: $scope.user.password,
                courses : $scope.tags.value
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
