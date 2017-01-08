app.controller('editUser', ['$scope','$http','$routeParams', function ($scope, $http, $routeParams) {
   
        var currentId = $routeParams.param;

        
        $scope.loadFaculties = function() {
        $http({
                method: 'GET',
                url: SERVER_APP_BASE_URL + 'faculty/getUserAllData?idTokenString=' + USER_TOKEN,
            }).success(function(result) {
                $scope.faculties = result.allData;
            });
        };
        
        $scope.showName = function(item) {
        return item.name;
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
    $scope.loadUser =  function (){
         $scope.loadFaculties(); // first call to get faculties 
         $scope.selectedFaculty=user.

    }
    
        	$http.get(SERVER_APP_BASE_URL+'user/getOrCreate?idTokenString=' + USER_TOKEN).success(function(data){
		$scope.user = data; 
                $scope.loadUser();
	});
        
        $scope.submit = function () {
            var data = $scope.selectedCourses;
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http.post(SERVER_APP_BASE_URL +'/user/updateCourses?userTokenId='+ USER_TOKEN, data, config)
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
