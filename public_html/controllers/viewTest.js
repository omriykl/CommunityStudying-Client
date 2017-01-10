var toggleSearch = function() {
    jQuery('#hideshow').on('click', function(event) {
        jQuery('#searchPanel').toggle('show');
    });
};
app.controller('ViewTest', ['$scope','$http','$routeParams', function ($scope, $http, $routeParams) {
   
        toggleSearch();

        $scope.$on('user-loaded', function(event, args) {
        $scope.isConnected=true;
    });
    
       $scope.searchQuestions = function() {
        var data = {
            facultyId: $scope.test.course.faculty.Id,
            courseId: $scope.test.course.id ,
            year: $scope.test.year,
            semester: $scope.test.semester,
            moed: $scope.test.moed,
            questionNumber: $scope.qnumber,
            text: $scope.freeText,
            tags: $scope.tags
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
    
     var currentId = $routeParams.param;
	$http.get(SERVER_APP_BASE_URL+'test/?id=' + currentId).success(function(data){
		$scope.test = data;
                $scope.searchQuestions();
	});     
//    $scope.test={
//        files : [{type: "word"},{type: "pdf"}],
//        semester: "A",
//        moed: "B",
//        year: "2016"       
//    };
//    $scope.questions=[{
//        userName : "guyyt",
//        comments : "3",
//        createdAt: "1.1.2016",
//        likes : "5",
//           title : "my quest",
//           content : "hdfhsdkhfk shkdfjhsdkfj hsdkj",
//           timeAgo: "yesterday"    
//}];
        
     $scope.submit = function() {
        $scope.searchQuestions();
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