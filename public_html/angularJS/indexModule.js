var app = angular.module('indexApp', ['ngRoute']);

app.config(function($routeProvider){
  $routeProvider.when("/questions",
    {
      templateUrl: "questionsList.html",
      controller: "QuestionsCtr",
      controllerAs: "app"
    }
  );
  $routeProvider.when("/questions/new",
    {
      templateUrl: "views/questions/newQuestion.html",
      controller: "newQuestion",
      controllerAs: "app"
    }
  );
});


//example to use params. add to when :paramName. like that .when("/questions/:param1"
app.controller('AppCtrl', function($routeParams) {
  var self = this;
  self.message = $routeParams.message;
});