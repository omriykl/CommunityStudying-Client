app.controller('newQuestion', ['$scope', '$http', 'Upload', '$timeout', function($scope, $http, Upload, $timeout) {

    // Get the modal
    var newTestModal = document.getElementById('newTestModal');

    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementById("closeModel");

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        newTestModal.style.display = "block";
    };
    $scope.openNewTestDialog = function() {
        newTestModal.style.display = "block";
    };
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        newTestModal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == newTestModal) {
            newTestModal.style.display = "none";
        }
    };

    var questionExistModel = document.getElementById('questionExistModel');

    var span2 = document.getElementById("closeQuestModel");
    span2.onclick = function() {
        //questionExistModel.style.display = "none";
        $("#questionExistModel").fadeOut();
    };

    $scope.mustAddFile = false; //on default

    $scope.loadFaculties = function() {
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'faculty/getUserAllData?idTokenString=' + USER_TOKEN,
        }).success(function(result) {
            $scope.faculties = result.allData;
        });
    };
    $scope.loadFaculties(); // first call to get faculties 

    $scope.$on('user-loaded', function(event, args) {
        $scope.loadFaculties(); // second call to get faculties, but this time after user is signed in! 
        $scope.isConnected = true;
    });

    $scope.facultySelected = function(item) {
        //$scope.item.size.code = $scope.selectedItem.code
        var id = item.id;
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'course/getUserAllData/?facultyId='.concat(id),
        }).success(function(result) {
            $scope.courses = result.allData;
        });
    };

    $scope.moedSelected = function(item) {
        var params = "facultyId=" + $scope.faculty.id +
            "&courseId=" + $scope.course.id +
            "&year=" + $scope.year +
            "&semester=" + $scope.selectedSemester +
            "&moed=" + $scope.selectedMoed;
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'post/checkByMoed?'.concat(params),
        }).success(function(result) {
            if (result == false) {
                newTestModal.style.display = "block";
            }
        });
    };


    $scope.searchTests = function() {
        var data = {
            facultyId: $scope.faculty != null ? $scope.faculty.id : null,
            courseId: $scope.course != null ? $scope.course.id : null,
            year: $scope.year,
            semester: $scope.selectedSemester,
            moed: $scope.selectedMoed,

        };
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        $http.post(SERVER_APP_BASE_URL + 'test/search', data, config)
            .success(function(data, status, headers, config) {
                if (data == null || data.length == 0) {
                    $("#testNotExistModel").fadeIn();
                    $scope.mustAddFile = true;
                } else {
                    $("#testNotExistModel").fadeOut();
                    $scope.mustAddFile = false;
                }
            })
            .error(function(data, status, header, config) {
                //   $scope.ResponseDetails = "Data: " + data +
                //	<hr />status: " + status +
                //       "<hr />headers: " + header +
                //       "<hr />config: " + config;
            });
    };

    $scope.onAddQuestionNumber = function() {
        var data = {
            facultyId: $scope.faculty.id,
            courseId: $scope.course.id,
            year: $scope.year,
            semester: $scope.selectedSemester,
            moed: $scope.selectedMoed,
            questionNumber: $scope.qnumber
        };
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        $http.post(SERVER_APP_BASE_URL + 'post/checkByQuestion', data, config)
            .success(function(data, status, headers, config) {
                if (data == true) {
                    $("#questionExistModel").fadeIn();

                } else {
                    $("#questionExistModel").fadeOut();
                }
            })
            .error(function(data, status, header, config) {
                //   $scope.ResponseDetails = "Data: " + data +
                //	<hr />status: " + status +
                //       "<hr />headers: " + header +
                //       "<hr />config: " + config;
            });

    };

    $scope.courseSelected = function(item) {
        //$scope.item.size.code = $scope.selectedItem.code
        var id = item.id;
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'tag/getAllByCourseId/?courseId='.concat(id),
        }).success(function(result) {
            $scope.optionsTags = result;
            document.getElementById('tagsDiv').style.display = "inline";
        });
    }

    $scope.addTag = function() {
        var name = $scope.newTag;
        var id = $scope.course.id;
        if (name != null && name != "") {
            $http({
                method: 'GET',
                url: SERVER_APP_BASE_URL + 'tag/addTagToCourse/?courseId=' + id + "&tagName=" + name,
            }).success(function(result) {
                $scope.optionsTags.push(result);
                $scope.selectedTags.push(result);
                $scope.newTag = "";
            });
        }
    };

    $scope.showName = function(item) {
        return item.name;
    }
    $scope.showHebName = function(item) {
        return item.nameHebrew;
    }

    $scope.filesIds = []; //empty file ids


    $scope.addTest = function() {
        if ($scope.filesIds.length == 0) {

        } else {
            $('#loading_image').show();
            var data = {
                facultyId: $scope.faculty.id,
                courseId: $scope.course.id,
                year: $scope.year,
                semester: $scope.selectedSemester,
                moed: $scope.selectedMoed,
                files: $scope.filesIds
            };
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            $http.post(SERVER_APP_BASE_URL + 'test/?userTokenId=' + USER_TOKEN, data, config)
                .success(function(data, status, headers, config) {
                    $scope.PostDataResponse = data;
                    newTestModal.style.display = "none";
                })
                .error(function(data, status, header, config) {
                    //   $scope.ResponseDetails = "Data: " + data +
                    //	<hr />status: " + status +
                    //       "<hr />headers: " + header +
                    //       "<hr />config: " + config;
                });
        }

    };


    $scope.submit = function() {
        if ($scope.mustAddFile) {
            $("#testNotExistModel").focus();
            $("#testNotExistModel").fadeTo('slow', 0.5).fadeTo('slow', 1.0);
        } else {
            $('#loading_image').show();
            var data = {
                facultyId: $scope.faculty.id,
                courseId: $scope.course.id,
                year: $scope.year,
                semester: $scope.selectedSemester,
                moed: $scope.selectedMoed,
                questionNumber: $scope.qnumber,
                title: $scope.title,
                content: $scope.htmlContent,
                tags: $scope.selectedTags,
                files: $scope.filesIds
                //files: $scope.files
            };
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            $http.post(SERVER_APP_BASE_URL + 'post/?userTokenId=' + USER_TOKEN, data, config)
                .success(function(data, status, headers, config) {
                    $scope.PostDataResponse = data;
                    window.location = "#questions/view/" + data.id;
                })
                .error(function(data, status, header, config) {
                    //   $scope.ResponseDetails = "Data: " + data +
                    //	<hr />status: " + status +
                    //       "<hr />headers: " + header +
                    //       "<hr />config: " + config;
                });
        }

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

//
//app.controller('MyCtrl', ['$scope', 'Upload', '$timeout', function($scope, Upload, $timeout) {
//    $scope.$watch('files', function() {
//        $scope.upload($scope.files);
//    });
//    $scope.$watch('file', function() {
//        if ($scope.file != null) {
//            $scope.files = [$scope.file];
//        }
//    });
//    $scope.log = '';
//
//    $scope.upload = function(files) {
//        if (files && files.length) {
//            for (var i = 0; i < files.length; i++) {
//                var file = files[i];
//                if (!file.$error) {
//                    Upload.upload({
//                        url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
//                        data: {
//                            username: $scope.username,
//                            file: file
//                        }
//                    }).then(function(resp) {
//                        $timeout(function() {
//                            $scope.log = 'file: ' +
//                                resp.config.data.file.name +
//                                ', Response: ' + JSON.stringify(resp.data) +
//                                '\n' + $scope.log;
//                        });
//                    }, null, function(evt) {
//                        var progressPercentage = parseInt(100.0 *
//                            evt.loaded / evt.total);
//                        $scope.log = 'progress: ' + progressPercentage +
//                            '% ' + evt.config.data.file.name + '\n' +
//                            $scope.log;
//                    });
//                }
//            }
//        }
//    };
//}]);