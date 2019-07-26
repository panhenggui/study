
myapp.controller('fileController', ['$scope', 'Upload',function($scope, Upload) {

    // init

    // Form submit upload
    $("#upload").attr("action",framework.file.uploadUrl("testService","uploadFile"));

    // jquery upload
    $("#fileuploader").uploadFile({
        url:framework.file.uploadUrl("testService","uploadFile"),
        fileName:"file" // 名字不能改
    });

    // angular upload
    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: framework.file.uploadUrl("testService","uploadFile"),
                    fields: {},
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {

                    framework.file.uploadCallback(data,function(errorCode,errMsg,data) {
                        if(errorCode != 0) {
                            alert(errorCode + " " + errMsg)
                        } else {
                            console.log(data);
                        }

                    })
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                })
            }
        }
    };

    // 文件下载
    $scope.download = function() {
        framework.file.download('testService', 'downloadFile', 'param1', function(errCode, errMsg) {
            if(errCode != 0) {
                alert(errCode + ': ' + errMsg);
            }
        });
    }


}]);

