

var toggleSearch= function(){
     jQuery('#hideshow').on('click', function(event) {        
             jQuery('#searchPanel').toggle('show');
});
}
app.controller('QuestionsCtr',  ['$scope', '$http', function($scope, $http) {
        toggleSearch();
             
	$scope.questions =[];
	
	$http.get(SERVER_APP_BASE_URL+'question/all').success(function(data){
		$scope.questions = data;
	});
        
            $scope.selectedFaculty = null;
    $scope.faculties = [];

    $scope.selectedCourse = null;
    $scope.courses = [];

    $http({
        method: 'GET',
        url: 'http://localhost:8080/faculty/getall',
        data: {
            applicationId: 3
        }
    }).success(function(result) {
        $scope.faculties = result;
    });

    $scope.facultySelected = function(item) {
        //$scope.item.size.code = $scope.selectedItem.code
        var id = item.id;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/course/getByFaculty/?facultyId='.concat(id),
            data: {
                applicationId: 3
            }
        }).success(function(result) {
            $scope.courses = result;
        });
    }

        $scope.onAddQuestionNumber = function() {
            var data = $.param({
                faculty: $scope.selectedFaculty.id,
                course: $scope.selectedCourse.value,
                year: $scope.year,
                moed: $scope.selectedMoed.value,
                qnum: $scope.qnumber
            });
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('http://localhost:8080/question/checkexist', data, config)
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
        
          $scope.courseSelected = function (item) {
        //$scope.item.size.code = $scope.selectedItem.code
        var id = item.id;
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'course/getCousreTags/?courseId='.concat(id),
        }).success(function (result) {
            optionalTags = result;
        });
    }
    
        optionalTags=["C3","bfs","dfs"];
        $scope.tags = {
        value: [],
        options: optionalTags,
        addOption: function() {
          $scope.tags.options.push(Math.random())
        }
      }
        
        
        $scope.submit = function() {
            var data = $.param({
                faculty: $scope.selectedFaculty !==null ? $scope.selectedFaculty.id : null,
                course: $scope.selectedCourse !==null ? $scope.selectedCourse.value : null,
                year: $scope.year,
                moed: $scope.selectedMoed !==null ? $scope.selectedMoed.value : null,
                qnum: $scope.qnumber,
                tags: $scope.tags.value,
                freeText: $scope.freeText
            });
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('http://localhost:8080/question/filter', data, config)
                .success(function(data, status, headers, config) {
                    $scope.questions = data;
                })
                .error(function(data, status, header, config) {
                    //   $scope.ResponseDetails = "Data: " + data +
                    //	<hr />status: " + status +
                    //       "<hr />headers: " + header +
                    //       "<hr />config: " + config;
                });
        };
        
        
}]);
