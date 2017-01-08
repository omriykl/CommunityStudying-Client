var toggleSearch = function() {
    jQuery('#hideshow').on('click', function(event) {
        jQuery('#searchPanel').toggle('show');
    });
};

app.controller('QuestionsCtr', ['$scope', '$http','$routeParams', function($scope, $http, $routeParams) {
    toggleSearch();
    
     $scope.$on('user-loaded', function(event, args) {
        $scope.isConnected=true;
        $scope.loadUserQuestion();
    });
    
    $scope.questions = [];
    $scope.loadUserQuestion = function() {
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
    
    
      $scope.searchQuestions = function() {
        var data = {
            facultyId: $scope.faculty != null ? $scope.faculty.id : null,
            courseId: $scope.course != null ? $scope.course.id : null,
            year: $scope.year,
            semester: $scope.selectedSemester,
            moed: $scope.selectedMoed,
            questionNumber: $scope.qnumber,
            inContentText: $scope.freeText,
            tags: $scope.tags
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
            })
            .error(function(data, status, header, config) {
                //   $scope.ResponseDetails = "Data: " + data +
                //	<hr />status: " + status +
                //       "<hr />headers: " + header +
                //       "<hr />config: " + config;
            });
    };
    $scope.loadUserQuestion();
    
//$scope.questions=[{
//    "id": 3,
//    "time": 1483484269000,
//    "lastUpdated": null,
//    "title": "dsfsd",
//    "content": "\n        <p>Write Here.. asdsad Write Here..\n<p>Write Here...</p>\n<p>Write Here...</p>\n<p>Write Here...</p>\n   ",
//    "answers": 0,
//    "votes": 0,
//    "tags": [
//    ],
//    "user": {
//        "id": 1,
//        "email": "omriykl@gmail.com",
//        "firstName": "Omri",
//        "lastName": "Yossefy",
//        "googleId": "105156277095611654045",
//        "pictureUrl": "https://lh4.googleusercontent.com/-w4Gduoky-wI/AAAAAAAAAAI/AAAAAAAAFkY/OzQZpYJxEPk/s96-c/photo.jpg",
//        "userRating": null,
//        "courses": [
//        ],
//        "created": 1483365088000,
//        "admin": false
//    },
//    "testQuestion": {
//        "id": 1,
//        "questionNumber": 1,
//        "answers": 0,
//        "votes": 0,
//        "tags": [
//        ],
//        "test": {
//            "id": 1,
//            "year": 1970,
//            "semester": "B",
//            "moed": "A",
//            "teacher": null,
//            "numOfquestions": "\u0000",
//            "difficulty": "\u0000",
//            "course": {
//                "id": 1048,
//                "faculty": {
//                    "id": 24,
//                    "university": null,
//                    "name": "אמנויות - ביה\"ס למוזיקה",
//                    "universityId": "0842"
//                },
//                "nameEnglish": "Diction B",
//                "nameHebrew": "היגוי ב",
//                "universityId": "08422387",
//                "tags": [
//                ]
//            }
//        }
//    }
//}
//];

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
            $scope.options = result;
            document.getElementById('tagsDiv').style.display="inline";

        });
    };
    $scope.submit = function() {
        $scope.searchQuestions();
    };


}]);