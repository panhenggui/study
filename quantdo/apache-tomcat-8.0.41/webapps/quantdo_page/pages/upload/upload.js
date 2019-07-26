myapp.controller('uploadController', ['$scope', 'Upload', function ($scope, Upload) {
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});		
    getAllTradeEntity(function (result) {
        $scope.tradeEntitys = result;
    });

    $scope.startDate = clearConstant.formatDate(new Date());

    // jquery upload
    $("#fileuploader").uploadFile({
        url: framework.file.uploadUrl("importTradeService", "importFile"),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
                if(errCode != 0) {
                    console.log(errCode);
                    layer.msg(errCode + ': ' + errMsg,{icon: 2});
                } else {
                    getAllTradeEntity(function (result) {
                        $scope.tradeEntitys = result;
                        $scope.$apply();
                    });
                }

            });
        },
        onSelect: function (files) {
        	var settleDate = $("#settleDate").val();
            framework.service.request('importTradeService', 'getDate', settleDate, function (errCode, errMsg, result) {
                if (errCode > 0) {
                    console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                }
            });
            return true;
        }
    });

}]);

