app.controller('newQuestion', ['$scope', '$http', function ($scope, $http) {
    $scope.firstname = "John";
    $scope.htmlContent = 'Place your question';

    $scope.selectedFaculty = null;
    $scope.faculties = [];

    $scope.selectedCourse = null;
    $scope.courses = [];

    $http({
        method: 'GET',
        url: SERVER_APP_BASE_URL + 'faculty/getUserAllData?idTokenString=[STR]',
    }).success(function (result) {
        $scope.faculties = result.allData;
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

    $scope.submit = function () {
        var data = $.param({
            faculty: selectedFaculty,
            id,
            course: $scope.selectedCourse.value,
            year: $scope.year,
            moed: $scope.selectedMoed.value,
            qnum: $scope.qnumber,
            title: $scope.title,
            content: $scope.htmlContent
        });
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        $http.post('http://localhost:8080/question/checkexist', data, config)
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


//example to use params. add to when :paramName. like that .when("/questions/:param1"
app.controller('AppCtrl', function ($routeParams) {
    var self = this;
    self.message = $routeParams.message;
});