var toggleSearch = function() {
    jQuery('#hideshow').on('click', function(event) {
        jQuery('#searchPanel').toggle('show');
    });
};
app.controller('ViewTest', ['$scope','$http','$routeParams', function ($scope, $http, $routeParams) {
   
    toggleSearch();
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.numberOfPages=function(){
        return Math.ceil($scope.totalCount/$scope.pageSize);                
    };
        $scope.$on('user-loaded', function(event, args) {
        $scope.isConnected=true;
    });
    $scope.getFileSrc= function(file){
            var types=file.url.split(".");
            var type=types[types.length-1];
            if(type=="jpg" || type=="png" || type=="bmp") return file.url;
            else if(type=="pdf") return "img/pdf.jfif";
            else if(type=="docx" || type=="doc") return "img/word.png";
            else return "img/file_icon.png";
        };
		
		$scope.getFileName= function(file){
            var types=file.url.split("/");
            return types[types.length-1];          
        };
    
    $scope.getSemHebrew = function(sem) {
        switch (sem) {
            case "A": return "א'";
            case "B": return "ב'";
            case "C": return "קיץ";
            default: return sem;
        }
    };
    
    $scope.getMoedHebrew = function(moed) {
        switch (moed) {
            case "A": return "א'";
            case "B": return "ב'";
            case "C": return "ג'";
            default: return sem;
        }
    };
    
    $scope.getQuesDescription = function(x){
        var srt=x.testQuestion.test.course.nameHebrew;
        if(srt==null) srt="";
        if(x.testQuestion.test.year!=null){srt+= " - "+x.testQuestion.test.year;}
        if(x.testQuestion.test.semester!=null){srt+= " - סמסט "+$scope.getSemHebrew(x.testQuestion.test.semester);}
        if(x.testQuestion.test.moed!=null){srt+= " - מועד "+ $scope.getMoedHebrew(x.testQuestion.test.moed);}
        if(x.testQuestion.questionNumber!=null && x.testQuestion.questionNumber!=0){srt+= " - שאלה "+x.testQuestion.questionNumber;}
        return srt;
    };
    
 
    
       $scope.searchQuestions = function() {
        var data = {
            facultyId: $scope.test.course.faculty.id,
            courseId: $scope.test.course.id ,
            year: $scope.test.year,
            semester: $scope.test.semester,
            moed: $scope.test.moed,
            questionNumber: $scope.qnumber,
            text: $scope.freeText,
            tags: $scope.selectedTags
        };
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

       $http.post(SERVER_APP_BASE_URL + 'post/search?page='+$scope.currentPage+"&size="+$scope.pageSize, data, config)
            .success(function(data, status, headers, config) {
                $scope.questions = data;
                $('#loading_image').hide();

            })
            .error(function(data, status, header, config) {
                $scope.questions=[];
            });
            
            $http.post(SERVER_APP_BASE_URL + 'post/count', data, config)
            .success(function(data, status, headers, config) {
                $scope.totalCount = data;
            })
            .error(function(data, status, header, config) {
                $scope.questions=[];
            });
    };
    
     $scope.pageBack= function(){
        $scope.currentPage--;
        $scope.searchQuestions();
    };
    
    $scope.pageNext= function(){
        $scope.currentPage++;
        $scope.searchQuestions();
    };
     var currentId = $routeParams.param;
	$http.get(SERVER_APP_BASE_URL+'test/' + currentId).success(function(data){
		$scope.test = data;
                
                $scope.searchQuestions();
                $http({
                method: 'GET',
                url: SERVER_APP_BASE_URL + 'tag/getAllByCourseId/?courseId='.concat($scope.test.course.id),
            }).success(function(result) {
                $scope.optionsTags = result;
            });
            
	});     
//    $scope.test={
//        files : [{type: "word"},{type: "pdf"}],
//        semester: "A",
//        moed: "B",
//        year: "2016"       
//    };
//    $scope.questions=[{
//        userName : "guyyt",
//        comments : "3",
//        createdAt: "1.1.2016",
//        likes : "5",
//           title : "my quest",
//           content : "hdfhsdkhfk shkdfjhsdkfj hsdkj",
//           timeAgo: "yesterday"    
//}];
        
     $scope.submit = function() {
        $scope.searchQuestions();
    };
}]);

