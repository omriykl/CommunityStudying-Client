app.controller('newQuestion', ['$scope', '$http', 'Upload', '$timeout', function($scope, $http, Upload, $timeout) {

    // Get the modal
    var newTestModal = document.getElementById('newTestModal');

    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementById("closeModel");

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        newTestModal.style.display = "block";
         $scope.pressNewTest=true;
    };
     $scope.pressNewTest=false;
    $scope.openNewTestDialog = function() {
        newTestModal.style.display = "block";
    };
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        newTestModal.style.display = "none";
        $scope.pressNewTest=false;
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == newTestModal) {
            newTestModal.style.display = "none";
            $scope.pressNewTest=false;
        }
    };

    var questionExistModel = document.getElementById('questionExistModel');

    var span2 = document.getElementById("closeQuestModel");
    span2.onclick = function() {
        //questionExistModel.style.display = "none";
        $("#questionExistModel").fadeOut();
    };

    $scope.mustAddFile = false; //on default
    $scope.faculties=[];
    $scope.courses=[];
    
    $scope.loadFaculties = function() {
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'faculty/getUserAllData?userTokenId=' + USER_TOKEN,
        }).success(function(result) {
            if(result.userData!=null && result.userData.length>0){
                    $scope.faculties= result.userData;
                    $scope.faculties.push({id:-1, name: "--------------"});
            }        
            $scope.faculties= $scope.faculties.concat(result.allData);
        });
    };
    $scope.loadFaculties(); // first call to get faculties 

    $scope.$on('user-loaded', function(event, args) {
        $scope.loadFaculties(); // second call to get faculties, but this time after user is signed in! 
        $scope.isConnected = true;
    });

    $scope.facultySelected = function() {
        $scope.courses=[];
        item = $scope.faculty;
        var id = item.id;
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'course/getUserAllData/?facultyId='+id+'&idTokenString=' + USER_TOKEN,
        }).success(function(result) {
            if(result.userData!=null && result.userData.length>0){
                    $scope.courses= result.userData;
                    $scope.courses.push({id:-1, nameHebrew: "--------------"});
            }           
            $scope.courses= $scope.courses.concat(result.allData);
        });
    };

//    $scope.moedSelected = function(item) {
//        var params = "facultyId=" + $scope.faculty.id +
//            "&courseId=" + $scope.course.id +
//            "&year=" + $scope.year +
//            "&semester=" + $scope.selectedSemester +
//            "&moed=" + $scope.selectedMoed;
//        $http({
//            method: 'GET',
//            url: SERVER_APP_BASE_URL + 'post/checkByMoed?'.concat(params),
//        }).success(function(result) {
//            if (result == false) {
//                newTestModal.style.display = "block";
//            }
//        });
//    };


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

        $http.post(SERVER_APP_BASE_URL + 'test/count', data, config)
            .success(function(data, status, headers, config) {
                if (data == null || data == 0) {
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
        if($scope.qnumber!=null && $scope.qnumber!=0){
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
        }

    };

    $scope.courseSelected = function() {
        item = $scope.course;
        if (item == undefined)
            return;
        var id = item.id;
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'tag/getAllByCourseId/?courseId='.concat(id),
        }).success(function(result) {
            $scope.optionsTags = result;
        });
    };

    $scope.addTag = function() {
        var name = $scope.newTag;
        var id = $scope.course.id;
        if (name != null && name != "") {
            $http({
                method: 'GET',
                url: SERVER_APP_BASE_URL + 'tag/addTagToCourse/?courseId=' + id + "&tagName=" + name,
            }).success(function(result) {
                $scope.optionsTags.push(result);
                if ($scope.selectedTags == undefined)
                    $scope.selectedTags =[];
                $scope.selectedTags.push(result);
                $scope.newTag = "";
            });
        }
    };

    $scope.showName = function(item) {
        return item.name;
    };
    $scope.showHebName = function(item) {
        return item.nameHebrew;
    };

    $scope.fileUrls = []; //empty file ids


    $scope.addTest = function() {
        if ($scope.fileUrls.length == 0) {

        } else {
            $('#loading_image').show();
            var data = {
                facultyId: $scope.faculty.id,
                courseId: $scope.course.id,
                year: $scope.year,
                semester: $scope.selectedSemester,
                moed: $scope.selectedMoed,
                files: $scope.fileUrls
            };
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            $http.post(SERVER_APP_BASE_URL + 'test/?userTokenId=' + USER_TOKEN, data, config)
                .success(function(data, status, headers, config) {
                    $scope.PostDataResponse = data;
                    $scope.fileUrls=[];
                    var bar = $('.progress');
                    var percent = $('.percent');
                    bar.width("0%");
                    percent.html("0%");
                    $scope.mustAddFile=false;
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
    
    
    $scope.facultySelectedWithId = function(item,courseId) {
        //$scope.item.size.code = $scope.selectedItem.code
        var id = item.id;
        thisFacultyId=id;
        thisCourseId=courseId;
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'course/getUserAllData/?facultyId='.concat(id),
        }).success(function(result) {
            $scope.courses = result.allData;
            for(var i in $scope.courses){
                if($scope.courses[i].id==courseId){
                    $scope.course=$scope.courses[i];
                    $scope.courseSelected($scope.course);
                break;
                }
            }
			$scope.searchQuestions();
            
        });
    };
    
    
    $scope.loadFacultiesWithId = function(facid,couid) {
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'faculty/getUserAllData?userTokenId=' + USER_TOKEN,
        }).success(function(result) {
            $scope.faculties = result.allData;
            for(var i in $scope.faculties){
                if($scope.faculties[i].id==facid){
                    $scope.faculty=$scope.faculties[i];
                    break;
                }
            }
            $scope.facultySelectedWithId($scope.faculty,couid);
            
        });
    };
       $scope.loadFromSearch= function(params){
                $scope.year=parseInt(params.split('year=')[1].split('&')[0]);
                $scope.selectedSemester=params.split('semester=')[1].split('&')[0];
                $scope.selectedMoed=params.split('moed=')[1].split('&')[0];
                $scope.qnumber=parseInt(params.split('qnum=')[1]);
		$scope.loadFacultiesWithId(params.split('faculty=')[1].split('&')[0],params.split('course=')[1].split('&')[0]);     
                 };
    
    if(thisFacultyId!=null){
                var thisUserVars="faculty="+thisFacultyId+"&course="+thisCourseId+"&year="+thisYear+"&semester="+thisSemester+"&moed="+thisMoed+"&qnum=";
                $scope.loadFromSearch(thisUserVars); 
            }


    $scope.submit = function() {
        thisFacultyId: $scope.faculty != null ? $scope.faculty.id : null;
            thisCourseId: $scope.course != null ? $scope.course.id : null;
            thisYear: $scope.year;
            thisSemester: $scope.selectedSemester;
            thisMoed: $scope.selectedMoed;
            
        if ($scope.mustAddFile) {
            $("#testNotExistModel").focus();
            $("#testNotExistModel").fadeTo('slow', 0.5).fadeTo('slow', 1.0);
            $("#haveToAddFileLine").show();
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
                files: $scope.fileUrls
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
					$('#loading_image').show();
                    var percentVal = '0%';
                    bar.width(percentVal);
                    percent.html(percentVal);
                    Upload.upload({
                        url: SERVER_APP_BASE_URL + 'upload?userTokenId='+USER_TOKEN,
                        data: {
                            USER_TOKEN: USER_TOKEN,
                            uploadingFiles: file
                        }
                    }).then(function(resp) {
                        $timeout(function() {
                            $scope.fileUrls.push(resp.data[0]);                    
                            $scope.mustAddFile = false;
                            submit.disabled = false;
                            submit2.disabled = false;
							$('#loading_image').hide();
                            
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