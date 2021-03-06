var SERVER_APP_BASE_URL = "http://localhost:8080/";
var app = angular.module('indexApp', ['ngRoute' , 'textAngular' , 'ngFileUpload' ,'tagger', 'multipleSelect','ui.bootstrap','localytics.directives']);
var USER_TOKEN = "";
var USER_ID="";
var IS_CONNECTED = false;
var IS_ADMIN= false;
var thisFacultyId=null;
var thisCourseId=null;
var thisYear="----";
var thisMoed="";
var thisSemester="";
var thisQuesNum="";

app.config(function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "welcome.htm",
    });
    $routeProvider.when("/questions", {  
        templateUrl: "questionsList.html",
        controller: "QuestionsCtr",
        controllerAs: "app"
    });
    $routeProvider.when("/questions/search/:param", {
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
        templateUrl: "views/questions/view.html",
        controller: "viewQuestion",
        controllerAs: "app"
    });
    $routeProvider.when("/user/edit", {
        templateUrl: "views/users/edit.html",
        controller: "editUser",
        controllerAs: "app"
    });
    $routeProvider.when("/questions/edit/:param", {
        templateUrl: "views/questions/edit.html",
        controller: "editQuestion",
        controllerAs: "app"
    });
    $routeProvider.when("/answers/edit/:param", {
        templateUrl: "views/answers/edit.html",
        controller: "editAnswere",
        controllerAs: "app"
    });
     $routeProvider.when("/tests", {
        templateUrl: "views/tests/testsList.html",
        controller: "TestsCtr",
        controllerAs: "app"
    });
     $routeProvider.when("/tests/view/:param", {
        templateUrl: "views/tests/view.html",
        controller: "ViewTest",
        controllerAs: "app"
    });
     $routeProvider.when("/tests/search/:param", {
        templateUrl: "views/tests/testsList.html",
        controller: "TestsCtr",
        controllerAs: "app"
    });
    $routeProvider.when("/newfiles", {
        templateUrl: "views/managing/newFilesList.html",
        controller: "FilesCtr",
        controllerAs: "app"
    });
});

app.controller('LoginCtr', function ($scope, $http,$rootScope) {
    $scope.isConnected = false;
    $scope.login = function (googleUser) {
         var profile = googleUser.getBasicProfile();
         if(!(profile.U3.includes("tau") && profile.U3.includes("ac"))){
             alert("ניתן להתחבר רק מחשבון המשוייך לאוניברסיטת תל אביב הנגמר ב tau.ac.il או mail.tau.ac.il. יש להתנתק מחשבון ה Gmail שלך ולהתחבר שוב עם חשבון אוניברסיטאי");

             var auth2 = gapi.auth2.getAuthInstance();
             auth2.signOut().then(function () {
                 angular.element(document.getElementById('logInBox')).scope().logout();
             });
             return;
         }

         var id_token = googleUser.getAuthResponse().id_token;
         $http.get(SERVER_APP_BASE_URL+'user/login?idTokenString=' + id_token).success(function (user) {
             $scope.userName = user.firstName+ " " +user.lastName;
             $scope.userPic=user.pictureUrl;
             $scope.isConnected = true;
             $scope.userId=user.id;
             $scope.userRating=user.userRating;
             $scope.userCourses= user.courses;
             USER_TOKEN = id_token;
             USER_ID= user.id;
             IS_CONNECTED = true;
             IS_ADMIN = user.admin;
             $scope.isAdmin = user.admin;
             $rootScope.$broadcast('user-loaded');
             
         });
     };

    $scope.tauLogin = function(){
        var data = {
            student_username : $scope.student_username,
            student_id : $scope.student_id,
            student_password: $scope.student_password
        };
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        $http.post('https://store.student.co.il/ajax/student-login', data, config)
            .success(function (data, status, headers, config) {
                if(data.error){
                    alert(data.msg);
                }
                else if(data.isLogedIn){
                    alert("מחובר");
                }
                else{
                    alert(data + "לא ברור מה התשובה");
                }
            })
            .error(function (data, status, header, config) {
                //   $scope.ResponseDetails = "Data: " + data +
                //	<hr />status: " + status +
                //       "<hr />headers: " + header +
                //       "<hr />config: " + config;
            });
    };

     $scope.logout = function () {
         $scope.isConnected = false;
         $scope.$apply();
     };
 });
 
 app.controller('HomeCtr', function ($scope, $http,$rootScope) {
    
    var MyInfoModal = document.getElementById('userpanel');
    var infoOpen=false;
    
    $scope.OpenMyInfo=function(){
        if(infoOpen){
            $("#userpanel").slideUp();
            infoOpen=false;
            MyInfoModal.style.display = "none";
        }
        else{
            $("#userpanel").slideDown();
            infoOpen=true;
            MyInfoModal.style.display = "block";
        }
    };
    
     $scope.$on('user-loaded', function(event, args) {
        $scope.isConnected=true;
        $scope.USER_ID=USER_ID;
    });
     $scope.freesearch=function(){
          window.location = "#questions/search/" + $scope.searchInput;
     };

 });

//example to use params. add to when :paramName. like that .when("/questions/:param1"
app.controller('AppCtrl', function ($routeParams) {
    var self = this;
    self.message = $routeParams.message;
});