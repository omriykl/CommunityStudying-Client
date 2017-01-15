app.controller('viewQuestion', ['$scope','$http','$routeParams','Upload', '$timeout', function ($scope, $http, $routeParams,Upload,$timeout) {
      
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
         
        var config = {
               headers: {
                   'Accept': 'text/plain'
               }
           };
         
        $scope.questionVoteUp = function () {  
        $http.get(SERVER_APP_BASE_URL+'post/like?id=' + currentId,config).success(function(data){ //still not connected!
            $scope.question.votes++;
	});};
    
         $scope.questionVoteDown = function () {   
        $http.get(SERVER_APP_BASE_URL+'post/dislike?id=' + currentId,config).success(function(){ //still not connected!
            $scope.question.votes--;
	});};
        
        $scope.answerVoteUp = function (ansId) {   
        $http.get(SERVER_APP_BASE_URL+'comment/like?id=' + ansId,config).success(function(){ //still not connected!
		for(var i in $scope.comments){
                    if($scope.comments[i].id==ansId){
                        $scope.comments[i].answerRate++;
                        break;
                    }
                }
	});};
        
         $scope.answerVoteDown = function (ansId) {   
        $http.get(SERVER_APP_BASE_URL+'comment/dislike?id=' + ansId,config).success(function(){ //still not connected!
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
    
        $scope.fileUrls = []; //empty file ids


        $scope.submitAnswar = function () {
            $('#loading_image').show();
            var data = {
                content: $scope.htmlContent,
                postId: $scope.question.id,
                files: $scope.fileUrls
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
                        url: SERVER_APP_BASE_URL + 'upload/',
                        data: {
                            USER_TOKEN: USER_TOKEN,
                            uploadingFiles: file
                        }
                    }).then(function(resp) {
                        $timeout(function() {
                           $scope.fileUrls.push(resp.data[0]); 
                            $scope.mustAddFile = false;
                        });
                    }, null, function(evt) {
                        var progressPercentage = parseInt(100.0 *
                            evt.loaded / evt.total);
                       

                        var percentVal = progressPercentage + '%';
                        bar.width(percentVal);
                        percent.html(percentVal);

                    });
                }
            }
        }
    };

}]);
