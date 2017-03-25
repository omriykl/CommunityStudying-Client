app.controller('editUser', ['$scope', '$http', function($scope, $http) {

    
    $http.get(SERVER_APP_BASE_URL + 'user/getOrCreate?idTokenString=' + USER_TOKEN).success(function(data) {
            $scope.user = data;
            $scope.loadUser();
        });


    $scope.loadFaculties = function() {
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'faculty/getUserAllData?userTokenId=' + USER_TOKEN,
        }).success(function(result) {
            $scope.faculties = result.allData;
        });
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
    $scope.loadUser = function() {
        $scope.loadFaculties(); // first call to get faculties 
        $scope.selectedCourses = $scope.user.courses;

    };
    $scope.$on('user-loaded', function(event, args) {
        $scope.loadFaculties(); // second call to get faculties, but this time after user is signed in! 
        $scope.isConnected = true;
        $http.get(SERVER_APP_BASE_URL + 'user/getOrCreate?idTokenString=' + USER_TOKEN).success(function(data) {
            $scope.user = data;
            $scope.loadUser();
        });
    });
    
    $scope.cTrig= function() { 
      if ($scope.user.emailSubscribed == true) {
        return false;
      } else {
       var box= confirm("האם אתה בטוח? שים לב שפעולה זאת תחסום באופן גורף את קבלת ההתראות מאיתנו");
        if (box==true){
                $scope.user.getEmailForNewPost=false;
                return true;   
        }   
        else
           $scope.user.emailSubscribed = true;

      }
    };
    
    $scope.showName = function(item) {
        return item.name;
    };
    $scope.submit = function() {
        var data = $scope.selectedCourses;
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        $http.post(SERVER_APP_BASE_URL + '/user/updateCourses?userTokenId=' + USER_TOKEN, data, config)
            .success(function(data, status, headers, config) {
                $scope.PostDataResponse = data;

            })
            .error(function(data, status, header, config) {
                //   $scope.ResponseDetails = "Data: " + data +
                //	<hr />status: " + status +
                //       "<hr />headers: " + header +
                //       "<hr />config: " + config;
            });
            data = {
            isEmailSubscribed: $scope.user.emailSubscribed,
            isEmailSubscribedForNewPost: $scope.user.getEmailForNewPost
        };
            $http.post(SERVER_APP_BASE_URL + '/user/updateEmailPref?userTokenId=' + USER_TOKEN, data, config)
            .success(function(data, status, headers, config) {
                $scope.PostDataResponse = data;
                location.reload();

            })
            .error(function(data, status, header, config) {
                //   $scope.ResponseDetails = "Data: " + data +
                //	<hr />status: " + status +
                //       "<hr />headers: " + header +
                //       "<hr />config: " + config;
            });
    };

}]);