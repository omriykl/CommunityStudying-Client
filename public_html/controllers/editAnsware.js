app.controller('editAnsware', ['$scope','$http','$routeParams', function ($scope, $http, $routeParams) {
        
     var currentId = $routeParams.param;

    $http.get(SERVER_APP_BASE_URL+'question/viewAnsware?id=' + currentId).success(function(data){
		$scope.answare = data;
	});
    $scope.htmlContent = '<h3>Place your question</h3>';

    $scope.selectedFaculty = null;
    $scope.faculties = [];

    $scope.selectedCourse = null;
    $scope.courses = [];
    
    $scope.loadFaculties = function () {
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'faculty/getUserAllData?idTokenString=' + USER_TOKEN,
        }).success(function (result) {
            $scope.faculties = result.allData;
        })
    };
    
    $scope.loadFaculties(); // first call to get faculties 
    
    $scope.$on('user-loaded', function (event, args) {
        $scope.loadFaculties(); // second call to get faculties, but this time after user is signed in! 
    });

    $scope.facultySelected = function (item) {
        //$scope.item.size.code = $scope.selectedItem.code
        var id = item.id;
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'course/getUserAllData/?facultyId='.concat(id),
        }).success(function (result) {
            $scope.courses = result.allData;
        });
    }

    $scope.onAddQuestionNumber = function () {
        var data = $.param({
            faculty: selectedFaculty,
            id,
            course: $scope.selectedCourse.value,
            year: $scope.year,
            moed: $scope.selectedMoed.value,
            qnum: $scope.qnumber
        });
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        $http.post(SERVER_APP_BASE_URL + 'question/checkexist', data, config)
            .success(function (data, status, headers, config) {
                $scope.PostDataResponse = data;
            })
            .error(function (data, status, header, config) {
                //   $scope.ResponseDetails = "Data: " + data +
                //	<hr />status: " + status +
                //       "<hr />headers: " + header +
                //       "<hr />config: " + config;
            });

    };
          var optionalTags=[];

     $scope.courseSelected = function (item) {
        //$scope.item.size.code = $scope.selectedItem.code
        var id = item.id;
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'course/getCousreTags/?courseId='.concat(id),
        }).success(function (result) {
            optionalTags = result;
        });
    }
 
        optionalTags=["C3","bfs","dfs"];
        $scope.tags = {
        value: [],
        options: optionalTags
      }


    $scope.submit = function () {
        var data = $.param({
            userId: USER_TOKEN,
            faculty: selectedFaculty,
            course: $scope.selectedCourse.value,
            year: $scope.year,
            moed: $scope.selectedMoed.value,
            qnum: $scope.qnumber,
            title: $scope.title,
            content: $scope.htmlContent,
            files: $scope.files
        });
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        $http.post(SERVER_APP_BASE_URL+ 'question/add', data, config)
            .success(function (data, status, headers, config) {
                $scope.PostDataResponse = data;
            })
            .error(function (data, status, header, config) {
                //   $scope.ResponseDetails = "Data: " + data +
                //	<hr />status: " + status +
                //       "<hr />headers: " + header +
                //       "<hr />config: " + config;
            });
    };

}]);
<!--
app.controller("TestCtrl", function($scope){
    
      $scope.options = ["Text", "Markdown", "HTML", "PHP", "Python", "Java", "JavaScript", "Ruby", "VHDL", "Verilog", "C#", "C/C++"]
      $scope.tags = ["Markdown", "Ruby"]

      $scope.font = null
      $scope.fonts = [
        {id: 1, name: "Lucida"},
        {id: 2, name: "DejaVu"},
        {id: 3, name: "Bitstream"},
        {id: 4, name: "Liberation"},
      //  {id: 5, name: "Verdana"}
      ]

      $scope.font2 = $scope.fonts[1]

      $scope.showName = function(font){ return font.name; }
      $scope.createName = function(name) { return {name: name} }

        var optionalTags=[];
        
      $scope.tags = {
        value: [],
        options: [],
        addOption: function() {
          $scope.tags.options.push(Math.random())
        }
      }

      $scope.selected = function(item){
        console.log("SELECTED ", item)
      }

      $scope.foc = function(){
        document.getElementById("s1").focus()
      }
    })
-->

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