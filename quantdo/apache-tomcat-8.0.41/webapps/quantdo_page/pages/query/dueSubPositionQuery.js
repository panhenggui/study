myapp.controller('DueSubPositionQueryController', function ($scope, $timeout) {
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});		
    //初始化页面信息
    $scope.queryEntity = {};    

    $scope.ProductDates = {};
    //查询所有产品信息
    getProductByExchID(function (result) {
        $scope.ProductDates = result;
        $scope.$apply();
    }, {'exchID': '', 'productID': '', 'productType': '', 'productStatus': ''});

    $scope.tempEntity = {};
    //查询
    $scope.find = function (queryEntity) {
        //clear
        $scope.listEntitys = {};
        $scope.isQuery = true;
        $scope.tempEntity = angular.copy(queryEntity);        
        getDuePosition(function (result) {
            $scope.listEntitys = result;
            $scope.$apply();
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        }, $scope.tempEntity);
    };
});

