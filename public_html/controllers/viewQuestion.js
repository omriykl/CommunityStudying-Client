app.controller('viewQuestion', ['$scope','$http','$routeParams', function ($scope, $http, $routeParams) {
      
        var currentId = $routeParams.param;
	$http.get(SERVER_APP_BASE_URL+'post/' + currentId).success(function(data){
		$scope.question = data;
	});
        $http.get(SERVER_APP_BASE_URL+'comment/getByPost/' + currentId).success(function(data){
		$scope.question.answers = data;
	});
        $scope.isTheSameUser=true;
        $scope.isConnected = true;
            $scope.loadQuestion=function(){
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
    };
        $scope.question={
            "id": "1",
            "user" :"guyyt",
            "title": "mt qyes",
            "createdOn" : "1.1.2013",
            "content": "hey hey hey hey hey hey",
            "tags" : [{"id":"1", "name":"tag1"}],
            questionNumber: 2,
            semester: "B",
            moed : "A",
            year: "2015",
            
            "answers": [{
                    "id": "10",
                    "username":  "guy",
                    "createdOn": "1.1.2013",
                    "isTheSameUser": true,
                    "accepted": true,
                    "content": "bla bla bla",
                    "votes": 5
            }]
        };
        
        $scope.answerVoteUp = function (ansId) {   
        $http.get(SERVER_APP_BASE_URL+'comment/like?id=' + ansId).success(function(){ //still not connected!
		location.reload();
	});};
        
         $scope.answerVoteDown = function (ansId) {   
        $http.get(SERVER_APP_BASE_URL+'comment/unlike?id=' + ansId).success(function(){ //still not connected!
		location.reload();
	});};
        
         $scope.acceptAnswer = function (ansId) {   
        $http.get(SERVER_APP_BASE_URL+'comment/accept/' + ansId+"?userTokenId="+USER_TOKEN).success(function(){
		location.reload();
	});};
        

        $scope.submitAnswar = function () {
            var data = {
                content: $scope.htmlContent,
                postId: $scope.question.id
            };
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http.post(SERVER_APP_BASE_URL +'comment/add?userTokenId='+USER_TOKEN, data, config)
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


app.controller('MyCtrl', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
    $scope.$watch('file', function () {
        if ($scope.file != null) {
            $scope.files = [$scope.file];
        }
    });
    $scope.log = '';

    $scope.upload = function (files) {
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
                    }).then(function (resp) {
                        $timeout(function () {
                            $scope.log = 'file: ' +
                                resp.config.data.file.name +
                                ', Response: ' + JSON.stringify(resp.data) +
                                '\n' + $scope.log;
                        });
                    }, null, function (evt) {
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