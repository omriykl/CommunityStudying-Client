app.controller('editAnswere', ['$scope','$http','$routeParams', function ($scope, $http, $routeParams) {
        
     var currentId = $routeParams.param;

    $http.get(SERVER_APP_BASE_URL+'comment/?id=' + currentId).success(function(data){
		$scope.answer = data;
                $scope.htmlContent = data.content;
	});
    $scope.filesIds=[];
    
    $scope.submit = function () {
        var data = {
            content : $scope.htmlContent,
            files: $scope.filesIds
        };
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        $http.post(SERVER_APP_BASE_URL+ 'comment/update/'+currentId+'?userTokenId=' + USER_TOKEN, data, config)
            .success(function (data, status, headers, config) {
                $scope.PostDataResponse = data;
                window.location = "/question/view/" + $scope.answer.questionId;
            })
            .error(function (data, status, header, config) {
                //   $scope.ResponseDetails = "Data: " + data +
                //	<hr />status: " + status +
                //       "<hr />headers: " + header +
                //       "<hr />config: " + config;
            });
    };
    
    
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
        var bar = $('.progress');
        var percent = $('.percent');
        var submit = document.getElementById("submit");
        var submit2 = document.getElementById("submitTest");
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (!file.$error) {
                    submit.disabled = true;
                    submit2.disabled = true;
                    var percentVal = '0%';
                    bar.width(percentVal);
                    percent.html(percentVal);
                    Upload.upload({
                        url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                        data: {
                            USER_TOKEN: USER_TOKEN,
                            file: file
                        }
                    }).then(function(resp) {
                        $timeout(function() {
                            $scope.filesIds.push(resp.id);
                            $scope.mustAddFile = false;
                            submit.disabled = false;
                            submit2.disabled = false;
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

                        var percentVal = progressPercentage + '%';
                        bar.width(percentVal);
                        percent.html(percentVal);

                    });
                }
            }
        }
    };

}]);
