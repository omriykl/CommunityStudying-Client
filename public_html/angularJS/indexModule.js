var SERVER_APP_BASE_URL = "http://localhost:8080/";
var app = angular.module('indexApp', ['ngRoute' , 'textAngular' ,'ngFileUpload','tagger' ]);
var USER_TOKEN = "";

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
    $routeProvider.when("/questions/view/:param", {
        templateUrl: "views/questions/View.html",
        controller: "viewQuestion",
        controllerAs: "app"
    });
    $routeProvider.when("/user/edit/:param", {
        templateUrl: "views/users/edit.html",
        controller: "editUser",
        controllerAs: "app"
    });
});

app.controller('LoginCtr', function ($scope, $http,$rootScope) {
    $scope.isConnected = false;
    $scope.login = function (googleUser) {
        var profile = googleUser.getBasicProfile();
        var id_token = googleUser.getAuthResponse().id_token;
        $http.get(SERVER_APP_BASE_URL+'user/getOrCreate?idTokenString=' + id_token).success(function (user) {
            $scope.userName = user.firstName+ " " +user.lastName;
            $scope.userPic=user.pictureUrl;
            $scope.isConnected = true;
            USER_TOKEN = id_token;
            $rootScope.$broadcast('user-loaded');

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