var toggleSearch = function() {
    jQuery('#hideshow').on('click', function(event) {
        jQuery('#searchPanel').toggle('show');
    });
};
app.controller('TestsCtr', ['$scope', '$http','$routeParams', function($scope, $http, $routeParams) {
    toggleSearch();
     var newTestModal = document.getElementById('newTestModal');

        var btn = document.getElementById("myBtn");

        // Get the <span> element that closes the modal
        var span = document.getElementById("closeModel");
        
        // When the user clicks the button, open the modal 
        btn.onclick = function() {
            newTestModal.style.display = "block";
        };
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            newTestModal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == newTestModal) {
                newTestModal.style.display = "none";
            }
        };
    
    $scope.tests = [];
    
    
      $scope.searchTests = function() {
        var data = {
            facultyId: $scope.faculty != null ? $scope.faculty.id : null,
            courseId: $scope.course != null ? $scope.course.id : null,
            year: $scope.year,
            semester: $scope.selectedSemester,
            moed: $scope.selectedMoed, 

        };
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        $http.post(SERVER_APP_BASE_URL + 'test/search', data, config)
            .success(function(data, status, headers, config) {
                $scope.tests = data;
                if(data.length==0){
                    newTestModal.style.display = "block";
                }
            })
            .error(function(data, status, header, config) {
                //   $scope.ResponseDetails = "Data: " + data +
                //	<hr />status: " + status +
                //       "<hr />headers: " + header +
                //       "<hr />config: " + config;
            });
    };
    
    if($routeParams.param!=null){
        if($routeParams.param.includes("userId=")){
            var id=$routeParams.param.split('userId=')[1];
           $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'test/getByUser?id='+id,
        }).success(function(result) {
            $scope.tests = result;
        });}
    }
    else{
    $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'test/getByUser?id='+USER_TOKEN
        }).success(function(result) {
            $scope.tests = result;
        });
    }
//$scope.tests=[{
//        userName : "guyyt",
//        comments : "3",
//        createdAt: "1.1.2016",
//        posts : "5",
//           title : "my quest",
//           content : "hdfhsdkhfk shkdfjhsdkfj hsdkj",
//           timeAgo: "1.1.2016",
//           year: "2016",
//           semester: "A",
//           moed: "B",
//            hasTestFile: true
//           
//}];

    $scope.selectedFaculty = null;
    $scope.faculties = [];

    $scope.selectedCourse = null;
    $scope.courses = [];

    $scope.loadFaculties = function() {
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'faculty/getUserAllData?idTokenString=' + USER_TOKEN
        }).success(function(result) {
            $scope.faculties = result.allData;
        });
    };
    $scope.loadFaculties(); // first call to get faculties 

    $scope.$on('user-loaded', function(event, args) {
        $scope.loadFaculties(); // second call to get faculties, but this time after user is signed in! 
    });

    $scope.facultySelected = function(item) {
        //$scope.item.size.code = $scope.selectedItem.code
        var id = item.id;
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'course/getUserAllData/?facultyId='.concat(id)
        }).success(function(result) {
            $scope.courses = result.allData;
        });
    };

    $scope.showName = function(item) {
        return item.name;
    };
    $scope.showHebName = function(item) {
        return item.nameHebrew;
    };
    
    $scope.submit = function() {
        $scope.searchTests();
    };
    
     $scope.addTest = function() {
        $('#loading_image').show();
        var data = {
            facultyId: $scope.faculty.id,
            courseId: $scope.course.id,
            year: $scope.year,
            semester: $scope.selectedSemester,
            moed: $scope.selectedMoed 
        };
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        $http.post(SERVER_APP_BASE_URL + 'test/?userTokenId='+USER_TOKEN, data, config)
            .success(function(data, status, headers, config) {
                $scope.PostDataResponse = data;
                newTestModal.style.display = "none";
            })
            .error(function(data, status, header, config) {
                //   $scope.ResponseDetails = "Data: " + data +
                //	<hr />status: " + status +
                //       "<hr />headers: " + header +
                //       "<hr />config: " + config;
            });
    };
    
    


}]);