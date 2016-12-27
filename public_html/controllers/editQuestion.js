app.controller('editQuestion', ['$scope','$http','$routeParams', function ($scope, $http, $routeParams) {

     var currentId = $routeParams.param;
	$http.get(SERVER_APP_BASE_URL+'post/?id=' + currentId).success(function(data){
            if(data!=null){
		$scope.question = data;
	}
        else{
           window.location = "/question/view/" + currentId;
        }
    });
    $scope.faculties = [];

    $scope.courses = [];

    $scope.loadFaculties = function() {
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'faculty/getUserAllData?idTokenString=' + USER_TOKEN,
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
            url: SERVER_APP_BASE_URL + 'course/getUserAllData/?facultyId='.concat(id),
        }).success(function(result) {
            $scope.courses = result.allData;
        });
    };

    
    $scope.onAddQuestionNumber = function() {
        var data = {
            facultyId: $scope.selectedFaculty.id,
            courseId: $scope.selectedCourse.id,
            year: $scope.year,
            semester: $scope.selectedSemester,
            moed: $scope.selectedMoed,
            questionNumber: $scope.qnumber
        };
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        $http.post(SERVER_APP_BASE_URL + 'post/checkByQuestion', data, config)
            .success(function(data, status, headers, config) {
                $scope.PostDataResponse = data;
            })
            .error(function(data, status, header, config) {
                //   $scope.ResponseDetails = "Data: " + data +
                //	<hr />status: " + status +
                //       "<hr />headers: " + header +
                //       "<hr />config: " + config;
            });

    };

    $scope.courseSelected = function(item) {
        //$scope.item.size.code = $scope.selectedItem.code
        var id = item.id;
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'course/getCousreTags/?courseId='.concat(id),
        }).success(function(result) {
            $scope.optionsTags = result;
        });
    };
    $scope.optionsTags = [{
            id: 1,
            name: "Java"
        },
        {
            id: 2,
            name: "C"
        },
        {
            id: 3,
            name: "C++"
        },
        {
            id: 4,
            name: "AngularJs"
        },
        {
            id: 5,
            name: "JavaScript"
        }
    ];
    
    $scope.showName = function(item) {
        return item.name;
    };
    
    $scope.selectedFaculty = $scope.question.facultyId;
    $scope.facultySelected($scope.selectedFaculty);
    $scope.selectedCourse = $scope.question.courseId;;
    $scope.courseSelected($scope.selectedCourse);
    $scope.qnumber=$scope.question.questionNumber;
    $scope.selectedTags = $scope.question.tags;
    $scope.year = $scope.question.year;
    $scope.selectedSemester = $scope.question.semester;
    $scope.selectedMoed = $scope.question.moed;
    $scope.htmlContent = $scope.question.content;
    $scope.title = $scope.question.title;

        
    $scope.submit = function() {
        var data = {
            facultyId: $scope.selectedFaculty.id,
            courseId: $scope.selectedCourse.id,
            year: $scope.year,
            semester: $scope.selectedSemester,
            moed: $scope.selectedMoed,
            questionNumber: $scope.qnumber,
            title: $scope.title,
            content: $scope.htmlContent,
            tags: $scope.selectedTags
                //files: $scope.files
        };
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        $http.post(SERVER_APP_BASE_URL + 'post/edit?id='+currentId, data, config)
            .success(function(data, status, headers, config) {
                $scope.PostDataResponse = data;
                window.location = "/question/view/" + data.id;
            })
            .error(function(data, status, header, config) {
                //   $scope.ResponseDetails = "Data: " + data +
                //	<hr />status: " + status +
                //       "<hr />headers: " + header +
                //       "<hr />config: " + config;
            });
    };

}]);

app.controller('MyCtrl', ['$scope', 'Upload', '$timeout', function($scope, Upload, $timeout) {
    $scope.$watch('files', function() {
        $scope.upload($scope.files);
    });
    $scope.$watch('file', function() {
        if ($scope.file != null) {
            $scope.files = [$scope.file];
        }
    });
    $scope.log = '';

    $scope.upload = function(files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (!file.$error) {
                    Upload.upload({
                        url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                        data: {
                            username: $scope.username,
                            file: file
                        }
                    }).then(function(resp) {
                        $timeout(function() {
                            $scope.log = 'file: ' +
                                resp.config.data.file.name +
                                ', Response: ' + JSON.stringify(resp.data) +
                                '\n' + $scope.log;
                        });
                    }, null, function(evt) {
                        var progressPercentage = parseInt(100.0 *
                            evt.loaded / evt.total);
                        $scope.log = 'progress: ' + progressPercentage +
                            '% ' + evt.config.data.file.name + '\n' +
                            $scope.log;
                    });
                }
            }
        }
    };
}]);