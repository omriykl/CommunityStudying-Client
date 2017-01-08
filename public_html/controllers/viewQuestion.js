app.controller('viewQuestion', ['$scope','$http','$routeParams', function ($scope, $http, $routeParams) {
      
        $scope.isConnected=IS_CONNECTED;
        var currentId = $routeParams.param;
	$http.get(SERVER_APP_BASE_URL+'post/' + currentId).success(function(data){
		$scope.question = data;
	});
        $http.get(SERVER_APP_BASE_URL+'comment/getByPost/' + currentId).success(function(data){
		$scope.comments = data;
	});
        
        $scope.$on('user-loaded', function(event, args) {
            $scope.isConnected=true;
         });
        
        $scope.USER_ID = USER_ID;
        
    
    $scope.comments=[
    {
        "id": 1,
        "timeStamp": 1483568472000,
        "lastUpdated": null,
        "content": "<p>Write here...sdfsd</p>",
        "answerRate": 0,
        "user": {
            "id": 1,
            "email": "omriykl@gmail.com",
            "firstName": "Omri",
            "lastName": "Yossefy",
            "googleId": "105156277095611654045",
            "pictureUrl": "https://lh4.googleusercontent.com/-w4Gduoky-wI/AAAAAAAAAAI/AAAAAAAAFkY/OzQZpYJxEPk/s96-c/photo.jpg",
            "userRating": null,
            "courses": [
            ],
            "created": 1483365088000,
            "admin": false
        },
        "isAccepted": null
    },
    {
        "id": 2,
        "timeStamp": 1483568820000,
        "lastUpdated": null,
        "content": "<p>sdfasdasd 2</p>",
        "answerRate": 0,
        "post": {
            "id": 3,
            "time": 1483484269000,
            "lastUpdated": null,
            "title": "dsfsd",
            "content": "\n        <p>Write Here...</p>\n    ",
            "answers": 0,
            "votes": 0,
            "tags": [
            ],
            "user": {
                "id": 1,
                "email": "omriykl@gmail.com",
                "firstName": "Omri",
                "lastName": "Yossefy",
                "googleId": "105156277095611654045",
                "pictureUrl": "https://lh4.googleusercontent.com/-w4Gduoky-wI/AAAAAAAAAAI/AAAAAAAAFkY/OzQZpYJxEPk/s96-c/photo.jpg",
                "userRating": null,
                "courses": [
                ],
                "created": 1483365088000,
                "admin": false
            },
            "testQuestion": {
                "id": 1,
                "questionNumber": 1,
                "answers": 0,
                "votes": 0,
                "tags": [
                ],
                "test": {
                    "id": 1,
                    "year": 1970,
                    "semester": "B",
                    "moed": "A",
                    "teacher": null,
                    "numOfquestions": "\u0000",
                    "difficulty": "\u0000",
                    "course": {
                        "id": 1048,
                        "faculty": {
                            "id": 24,
                            "university": null,
                            "name": "אמנויות - ביה\"ס למוזיקה",
                            "universityId": "0842"
                        },
                        "nameEnglish": "Diction B",
                        "nameHebrew": "היגוי ב",
                        "universityId": "08422387",
                        "tags": [
                        ]
                    }
                }
            },
            "acceptedComment": true
        },
        "user": {
            "id": 1,
            "email": "omriykl@gmail.com",
            "firstName": "Omri",
            "lastName": "Yossefy",
            "googleId": "105156277095611654045",
            "pictureUrl": "https://lh4.googleusercontent.com/-w4Gduoky-wI/AAAAAAAAAAI/AAAAAAAAFkY/OzQZpYJxEPk/s96-c/photo.jpg",
            "userRating": null,
            "courses": [
            ],
            "created": 1483365088000,
            "admin": false
        },
        "isAccepted": true
    }
]
    
    
    
    
    
        $scope.question={
    "id": 3,
     "acceptedComment": false,
    "time": 1483484269000,
    "lastUpdated": null,
    "title": "dsfsd",
    "content": "\n        <p>Write Here...</p>\n    ",
    "answers": 0,
    "votes": 0,
    "tags": [
    ],
    "user": {
        "id": 1,
        "email": "omriykl@gmail.com",
        "firstName": "Omri",
        "lastName": "Yossefy",
        "googleId": "105156277095611654045",
        "pictureUrl": "https://lh4.googleusercontent.com/-w4Gduoky-wI/AAAAAAAAAAI/AAAAAAAAFkY/OzQZpYJxEPk/s96-c/photo.jpg",
        "userRating": null,
        "courses": [
        ],
        "created": 1483365088000,
        "admin": false
    },
    "testQuestion": {
        "id": 1,
        "questionNumber": 1,
        "answers": 0,
        "votes": 0,
        "tags": [
        ],
        "test": {
            "id": 1,
            "year": 1970,
            "semester": "B",
            "moed": "A",
            "teacher": null,
            "numOfquestions": "\u0000",
            "difficulty": "\u0000",
            "course": {
                "id": 1048,
                "faculty": {
                    "id": 24,
                    "university": null,
                    "name": "אמנויות - ביה\"ס למוזיקה",
                    "universityId": "0842"
                },
                "nameEnglish": "Diction B",
                "nameHebrew": "היגוי ב",
                "universityId": "08422387",
                "tags": [
                ]
            }
        }
    }
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
        $scope.unAcceptAnswer = function (ansId) {   
        $http.get(SERVER_APP_BASE_URL+'comment/unaccept/' + ansId+"?userTokenId="+USER_TOKEN).success(function(){
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