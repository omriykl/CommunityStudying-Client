var toggleSearch = function() {
    jQuery('#hideshow').on('click', function(event) {
        jQuery('#searchPanel').toggle('show');
    });
};
app.controller('TestsCtr', ['$scope', '$http', '$routeParams', 'Upload', '$timeout', function($scope, $http, $routeParams,Upload, $timeout) {
    toggleSearch();
    var newTestModal = document.getElementById('newTestModal');

    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementById("closeModel");
    $scope.pressNewTest=false;
    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        $scope.pressNewTest=true;
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

    $scope.tests = [];
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.numberOfPages=function(){
        return Math.ceil($scope.totalCount/$scope.pageSize);                
    };

    $scope.searchTests = function() {
        $('#loading_image').show();
        thisFacultyId: $scope.faculty != null ? $scope.faculty.id : null;
            thisCourseId: $scope.course != null ? $scope.course.id : null;
            thisYear: $scope.year;
            thisSemester: $scope.selectedSemester;
            thisMoed: $scope.selectedMoed;
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

        $http.post(SERVER_APP_BASE_URL + 'test/search?page='+$scope.currentPage+"&size="+$scope.pageSize, data, config)
            .success(function(data, status, headers, config) {
                $scope.tests = data;
                $('#loading_image').hide();
                if (data==null || data.length == 0) {
                    newTestModal.style.display = "block";
                }
            })
            .error(function(data, status, header, config) {
                $scope.tests=[];
            });
            
            $http.post(SERVER_APP_BASE_URL + 'test/count', data, config)
            .success(function(data, status, headers, config) {
                $scope.totalCount = data;
                if ($scope.totalCount == 0) {
                    newTestModal.style.display = "block";
                }
            }).error(function(data, status, header, config) {
                $scope.tests=[];
            });
            
    };

    $scope.pageBack= function(){
        $scope.currentPage--;
        $scope.searchTests();
    };
    
    $scope.pageNext= function(){
        $scope.currentPage++;
        $scope.searchTests();
    };
    
    if ($routeParams.param != null) {
        if ($routeParams.param.includes("userId=")) {
            var id = $routeParams.param.split('userId=')[1];
            $http({
                method: 'GET',
                url: SERVER_APP_BASE_URL + 'test/getByUser?id=' + id,
            }).success(function(result) {
                $scope.tests = result;
            });
        }
    } else {
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'test/getByUser?id=' + USER_TOKEN
        }).success(function(result) {
            $scope.tests = result;
        });
    }
    //$scope.tests=[{
    //        userName : "guyyt",
    //        comments : "3",
    //        createdAt: "1.1.2016",
    //        posts : "5",
    //           title : "my quest",
    //           content : "hdfhsdkhfk shkdfjhsdkfj hsdkj",
    //           timeAgo: "1.1.2016",
    //           year: "2016",
    //           semester: "A",
    //           moed: "B",
    //            hasTestFile: true
    //           
    //}];

    $scope.selectedFaculty = null;
    $scope.faculties = [];

    $scope.selectedCourse = null;
    $scope.courses = [];

    $scope.loadFaculties = function() {
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'faculty/getUserAllData?userTokenId=' + USER_TOKEN
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
    });

    $scope.facultySelected = function() {
        $scope.courses=[];
        item = $scope.faculty;
        var id = item.id;
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'course/getUserAllData/?facultyId='+id+'&idTokenString=' + USER_TOKEN
        }).success(function(result) {
            if(result.userData!=null && result.userData.length>0){
                    $scope.courses= result.userData;
                    $scope.courses.push({id:-1, nameHebrew: "--------------"});
            }           
            $scope.courses= $scope.courses.concat(result.allData);
        });
    };

    $scope.showName = function(item) {
        return item.name;
    };
    $scope.showHebName = function(item) {
        return item.nameHebrew;
    };

    $scope.submit = function() {
        $scope.searchTests();
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
		$scope.loadFacultiesWithId(params.split('faculty=')[1].split('&')[0],params.split('course=')[1].split('&')[0]);     
                
                $scope.searchTests();
    };
    
    if(thisFacultyId!=null){
                var thisUserVars="faculty="+thisFacultyId+"&course="+thisCourseId+"&year="+thisYear+"&semester="+thisSemester+"&moed="+thisMoed;
                $scope.loadFromSearch(thisUserVars); 
            }

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
                    newTestModal.style.display = "none";
                    $('#loading_image').hide();
                    window.location = "#tests/view/" + data.id;
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