var SERVER_APP_BASE_URL = "http://localhost:8080/";
var app = angular.module('indexApp', ['ngRoute' , 'textAngular' ,'ngFileUpload' ]);

app.config(function ($routeProvider) {
    $routeProvider.when("/questions", {
        templateUrl: "questionsList.html",
        controller: "QuestionsCtr",
        controllerAs: "app"
    });
    $routeProvider.when("/questions/new", {
        templateUrl: "views/questions/newQuestion.html",
        controller: "newQuestion",
        controllerAs: "app"
    });
});

app.controller('LoginCtr', function ($scope, $http) {
    $scope.isConnected = false;
    $scope.login = function (googleUser) {
        console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
        var profile = googleUser.getBasicProfile();
        console.log("ID: " + profile.getId()); // Don't send this directly to your server!
        console.log('Full Name: ' + profile.getName());
        console.log('Given Name: ' + profile.getGivenName());
        console.log('Family Name: ' + profile.getFamilyName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());

        // The ID token you need to pass to your backend:
        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);
        $http.get(SERVER_APP_BASE_URL+'user/getOrCreate?idTokenString=' + id_token).success(function (user) {
            console.log(user);
            $scope.userName = user.firstName+ " " +user.lastName;
			$scope.userPic=user.pictureUrl;
            $scope.isConnected = true;

        });
    }
    $scope.logout = function () {
        $scope.isConnected = false;
        $scope.$apply();
    }
});


//example to use params. add to when :paramName. like that .when("/questions/:param1"
app.controller('AppCtrl', function ($routeParams) {
    var self = this;
    self.message = $routeParams.message;
});