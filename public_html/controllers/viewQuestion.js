app.controller('viewQuestion', ['$scope','$http','$routeParams', function ($scope, $http, $routeParams) {
      
        $scope.isConnected=IS_CONNECTED;
        $scope.USER_ID = USER_ID;
        var currentId = $routeParams.param;
	$http.get(SERVER_APP_BASE_URL+'post/' + currentId).success(function(data){
		$scope.question = data;
	});
        $http.get(SERVER_APP_BASE_URL+'comment/getByPost/' + currentId).success(function(data){
		$scope.comments = data;
	});
        
        $scope.$on('user-loaded', function(event, args) {
            $scope.isConnected=true;
            $scope.USER_ID = USER_ID;
         });
        $scope.questionVoteUp = function () {  
        $http.get(SERVER_APP_BASE_URL+'post/like?id=' + currentId).success(function(){ //still not connected!
            $scope.question.votes++;
	});};
    
         $scope.questionVoteDown = function () {   
        $http.get(SERVER_APP_BASE_URL+'post/dislike?id=' + currentId).success(function(){ //still not connected!
            $scope.question.votes--;
	});};
        
        $scope.answerVoteUp = function (ansId) {   
        $http.get(SERVER_APP_BASE_URL+'comment/like?id=' + ansId).success(function(){ //still not connected!
		for(var i in $scope.comments){
                    if($scope.comments[i].id==ansId){
                        $scope.comments[i].answerRate++;
                        break;
                    }
                }
	});};
        
         $scope.answerVoteDown = function (ansId) {   
        $http.get(SERVER_APP_BASE_URL+'comment/dislike?id=' + ansId).success(function(){ //still not connected!
		for(var i in $scope.comments){
                    if($scope.comments[i].id==ansId){
                        $scope.comments[i].answerRate--;
                        break;
                    }
                }
	});};
        
         $scope.acceptAnswer = function (ansId) {   
        $http.get(SERVER_APP_BASE_URL+'comment/accept/' + ansId+"?userTokenId="+USER_TOKEN).success(function(){
		location.reload();
	});};
        $scope.unAcceptAnswer = function (ansId) {   
        $http.get(SERVER_APP_BASE_URL+'comment/unaccept/' + ansId+"?userTokenId="+USER_TOKEN).success(function(){
		location.reload();
	});};
    
        $scope.filesIds = []; //empty file ids


        $scope.submitAnswar = function () {
            $('#loading_image').show();
            var data = {
                content: $scope.htmlContent,
                postId: $scope.question.id,
                files: $scope.filesIds
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
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (!file.$error) {
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
