
app.controller('FilesCtr', ['$scope', '$http', '$routeParams' , function($scope, $http) {

    $scope.isConnected=IS_CONNECTED;
    $scope.USER_ID = USER_ID;
    $scope.IS_ADMIN = IS_ADMIN;

    $scope.files = [];
    $('#loading_image').show();

    $scope.searchFiles = function() {
        $http.get(SERVER_APP_BASE_URL+'file/unapproved').success(function(data){
            $scope.files = data;
            $('#loading_image').hide();
        });
    };
    $scope.searchFiles();

    $scope.$on('user-loaded', function(event, args) {
        $scope.isConnected=true;
        $scope.USER_ID = USER_ID;
        $scope.IS_ADMIN = IS_ADMIN;
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

    $scope.approveFile = function (fileId) {
        $http.get(SERVER_APP_BASE_URL+'file/accept/' + fileId+"?userTokenId="+USER_TOKEN).success(function(){
            location.reload();
        });};

    $scope.showName = function(item) {
        return item.name;
    };
    $scope.showHebName = function(item) {
        return item.nameHebrew;
    };



}]);