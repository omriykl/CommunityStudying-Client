






app.controller('newQuestion', ['$scope', '$http', function($scope, $http) {

            // Get the modal
        var newTestModal = document.getElementById('newTestModal');

var btn = document.getElementById("myBtn");

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks the button, open the modal 
        btn.onclick = function() {
            newTestModal.style.display = "block";
        }
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            newTestModal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
          //  if (event.target == modal) {
          //      modal.style.display = "none";
          //  }
        }
 
    $scope.faculties =  [{id: 1,
            name: "Java"
        }]

    $scope.courses =  [{id: 1,
            hebrewName: "Java"
        }];

    $scope.loadFaculties = function() {
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'faculty/getUserAllData?idTokenString=' + USER_TOKEN,
        }).success(function(result) {
            $scope.faculties = result.allData;
        })
    };
    $scope.loadFaculties(); // first call to get faculties 

    $scope.$on('user-loaded', function(event, args) {
        $scope.loadFaculties(); // second call to get faculties, but this time after user is signed in! 
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
        var params="facultyId="+$scope.faculty.id+
                    "&courseId="+$scope.course.id+
                    "&year="+$scope.year+
                    "&semester="+ $scope.selectedSemester+
                    "&moed="+$scope.selectedMoed;
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'post/checkByMoed?'.concat(params),
        }).success(function(result) {
            if(result==false){
                newTestModal.style.display = "block";
            }
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

        console.log(data);

        $http.post(SERVER_APP_BASE_URL + 'post/checkByQuestion', data, config)
            .success(function(data, status, headers, config) {
                $scope.PostDataResponse = data;
            })
            .error(function(data, status, header, config) {
                //   $scope.ResponseDetails = "Data: " + data +
                //	<hr />status: " + status +
                //       "<hr />headers: " + header +
                //       "<hr />config: " + config;
            });

    };
             document.getElementById('tagsDiv').style.display="inline";

    $scope.courseSelected = function(item) {
        //$scope.item.size.code = $scope.selectedItem.code
        var id = item.id;
        $http({
            method: 'GET',
            url: SERVER_APP_BASE_URL + 'course/getCousreTags/?courseId='.concat(id),
        }).success(function(result) {
            $scope.optionsTags = result;
             document.getElementById('tagsDiv').style.display="inline";
        });
    }
    
     $scope.addTag = function() {
        //$scope.item.size.code = $scope.selectedItem.code
        var name = $scope.newTag;
        if(name!=null && name!=""){
            $http({
                method: 'GET',
                url: SERVER_APP_BASE_URL + 'course/tags/add?name='.concat(name),
            }).success(function(result) {
                var item={id:$scope.course.id};
                courseSelected(item);
            });
        }      
    };
    $scope.optionsTags = [{
            id: 1,
            name: "Java"
        },
        {
            id: 2,
            name: "C"
        },
        {
            id: 3,
            name: "C++"
        },
        {
            id: 4,
            name: "AngularJs"
        },
        {
            id: 5,
            name: "JavaScript"
        }
    ];

    $scope.showName = function(item) {
        return item.name;
    }
    $scope.showHebName = function(item) {
        return item.hebrewName;
    }



    $scope.submit = function() {
        var data = {
            facultyId: $scope.faculty.id,
            courseId: $scope.course.id,
            year: $scope.year,
            semester: $scope.selectedSemester,
            moed: $scope.selectedMoed,
            questionNumber: $scope.qnumber,
            title: $scope.title,
            content: $scope.htmlContent,
            tags: $scope.selectedTags
                //files: $scope.files
        };
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        $http.post(SERVER_APP_BASE_URL + 'post/create', data, config)
            .success(function(data, status, headers, config) {
                $scope.PostDataResponse = data;
                window.location = "#question/view/" + data.id;
            })
            .error(function(data, status, header, config) {
                //   $scope.ResponseDetails = "Data: " + data +
                //	<hr />status: " + status +
                //       "<hr />headers: " + header +
                //       "<hr />config: " + config;
            });
    };

}]);


<!--
app.controller("TestCtrl", function($scope) {

        $scope.options = ["Text", "Markdown", "HTML", "PHP", "Python", "Java", "JavaScript", "Ruby", "VHDL", "Verilog", "C#", "C/C++"]
        $scope.tags = ["Markdown", "Ruby"]

        $scope.font = null
        $scope.fonts = [{
                id: 1,
                name: "Lucida"
            },
            {
                id: 2,
                name: "DejaVu"
            },
            {
                id: 3,
                name: "Bitstream"
            },
            {
                id: 4,
                name: "Liberation"
            },
            //  {id: 5, name: "Verdana"}
        ]

        $scope.font2 = $scope.fonts[1]

        $scope.showName = function(font) {
            return font.name;
        }
        $scope.createName = function(name) {
            return {
                name: name
            }
        }

        var optionalTags = [];

        $scope.tags = {
            value: [],
            options: [],
            addOption: function() {
                $scope.tags.options.push(Math.random())
            }
        }

        $scope.selected = function(item) {
            console.log("SELECTED ", item)
        }

        $scope.foc = function() {
            document.getElementById("s1").focus()
        }
    })
    -->

app.controller('MyCtrl', ['$scope', 'Upload', '$timeout', function($scope, Upload, $timeout) {
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
                    }).then(function(resp) {
                        $timeout(function() {
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
                    });
                }
            }
        }
    };
}]);