app.controller('viewQuestion', ['$scope','$http','$routeParams', function ($scope, $http, $routeParams) {
   
        var currentId = $routeParams.param;
	$http.get(SERVER_APP_BASE_URL+'question/viewQuestion?id=' + currentId).success(function(data){
		$scope.question = data;
	});
        $scope.isTheSameUser=true;
        $scope.isConnected = true;
        
        $scope.question={
            "id": "1",
            "user" :"guyyt",
            "title": "mt qyes",
            "createdOn" : "1.1.2013",
            "content": "hey hey hey hey hey hey",
            "tags" : [{"id":"1", "name":"tag1"}],
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
        $http.get(SERVER_APP_BASE_URL+'comment/like?id=' + ansId).success(function(){
		location.reload();
	});};
        
         $scope.answerVoteDown = function (ansId) {   
        $http.get(SERVER_APP_BASE_URL+'comment/unlike?id=' + ansId).success(function(){
		location.reload();
	});};
        
         $scope.acceptAnswer = function (ansId) {   
        $http.get(SERVER_APP_BASE_URL+'comment/accept?id=' + ansId).success(function(){
		location.reload();
	});};
        

        $scope.submit = function () {
            var data = $.param({
                content: $scope.htmlContent,
                postId: $scope.question.id
            });
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            $http.post(SERVER_APP_BASE_URL +'comment/create?userTokenId='+USER_TOKEN, data, config)
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