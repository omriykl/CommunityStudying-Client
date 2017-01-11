var toggleSearch = function() {
    jQuery('#hideshow').on('click', function(event) {
        jQuery('#searchPanel').toggle('show');
    });
};

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

app.controller('QuestionsCtr', ['$scope', '$http','$routeParams', function($scope, $http, $routeParams) {
    toggleSearch();
    
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.numberOfPages=function(){
        return Math.ceil($scope.questions.length/$scope.pageSize);                
    };
    
     $scope.$on('user-loaded', function(event, args) {
        $scope.isConnected=true;
        $scope.loadUserQuestion();
    });
    
    $scope.questions = [];
    $scope.loadUserQuestion = function() {
   
   
      $scope.searchQuestions = function() {
          $('#loading_image').show();
        var data = {
            facultyId: $scope.faculty != null ? $scope.faculty.id : null,
            courseId: $scope.course != null ? $scope.course.id : null,
            year: $scope.year,
            semester: $scope.selectedSemester,
            moed: $scope.selectedMoed,
            questionNumber: $scope.qnumber,
            inContentText: $scope.freeText,
            tags: $scope.selectedTags
                //files: $scope.files
        };
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        $http.post(SERVER_APP_BASE_URL + 'post/search', data, config)
            .success(function(data, status, headers, config) {
                $scope.questions = data;
                $('#loading_image').hide();

            })
            .error(function(data, status, header, config) {
                //   $scope.ResponseDetails = "Data: " + data +
                //	<hr />status: " + status +
                //       "<hr />headers: " + header +
                //       "<hr />config: " + config;
            });
    };
    
    $scope.selectedFaculty = null;
    $scope.faculties = [];

    $scope.selectedCourse = null;
    $scope.courses = [];

    $scope.loadFaculties = function() {
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'faculty/getUserAllData?idTokenString=' + USER_TOKEN,
        }).success(function(result) {
            $scope.faculties = result.allData;

        })
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
            facultyId: $scope.faculty.id,
            courseId: $scope.course.id,
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
    $scope.showName = function(item) {
        return item.name;
    };
      $scope.showHebName = function(item) {
        return item.nameHebrew;
    }



    $scope.courseSelected = function(item) {
        //$scope.item.size.code = $scope.selectedItem.code
        var id = item.id;
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'course/getCousreTags/?courseId='.concat(id),
        }).success(function(result) {
            $scope.optionsTags = result;
            document.getElementById('tagsDiv').style.display="inline";

        });
    };
    
    
    $scope.facultySelectedWithId = function(item,courseId) {
        //$scope.item.size.code = $scope.selectedItem.code
        var id = item.id;
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'course/getUserAllData/?facultyId='.concat(id),
        }).success(function(result) {
            $scope.courses = result.allData;
            for(var i in $scope.courses){
                if($scope.courses[i].id==courseId){
                    $scope.course=$scope.courses[i];
                    $scope.courseSelected($scope.course);
                break;
                }
            }
            
        });
    };
    
    
    $scope.loadFacultiesWithId = function(facid,couid) {
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'faculty/getUserAllData?idTokenString=' + USER_TOKEN,
        }).success(function(result) {
            $scope.faculties = result.allData;
            for(var i in $scope.faculties){
                if($scope.faculties[i].id==facid){
                    $scope.faculty=$scope.faculties[i];
                    break;
                }
            }
            $scope.facultySelectedWithId($scope.faculty,couid);
            
        });
    };
       $scope.loadFromSearch= function(params){
                
           $scope.loadFacultiesWithId(params.split('faculty=')[1].split('&')[0],params.split('course=')[1].split('&')[0]);     
                $scope.year=parseInt(params.split('year=')[1].split('&')[0]);
                $scope.selectedSemester=params.split('semester=')[1].split('&')[0];
                $scope.selectedMoed=params.split('moed=')[1].split('&')[0];
                $scope.qnumber=parseInt(params.split('qnum=')[1]);
                $scope.searchQuestions();
    };
    
         if($routeParams.param!=null){
            if($routeParams.param.includes("userId=")){
                var id=$routeParams.param.split('userId=')[1];
               $http({
                method: 'GET',
                url: SERVER_APP_BASE_URL + 'post/getByUser?id='+id,
            }).success(function(result) {
                $scope.questions = result;
            });

            }
            else if($routeParams.param.includes("qnum=")){
                $scope.loadFromSearch($routeParams.param);

            }
            else{
               $scope.freeText= $routeParams.param;        
               $scope.searchQuestions();
            }

        }
        else{
        $http({
                method: 'GET',
                url: SERVER_APP_BASE_URL + 'post/getByUserCourses?userTokenId='+USER_TOKEN,
            }).success(function(result) {
                $scope.questions = result;
            });
        }
    };
    
        $scope.loadUserQuestion();
    
    
    $scope.submit = function() {
        $scope.searchQuestions();
    };


}]);