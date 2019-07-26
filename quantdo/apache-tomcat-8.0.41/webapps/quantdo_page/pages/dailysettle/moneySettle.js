myapp.controller('moneySettleController', function ($scope,$rootScope, $timeout) {
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});
    $scope.settleDate = clearConstant.formatDate(new Date());
    $scope.resultInfo = false;
    $scope.progress = false;
    $scope.iserror = false;
    $scope.currStatus = '';
    
    //结算状态
    $scope.settleStatus = [
        {text: '结算前', key: '1'},
        {text: '结算处理', key: '2'},
        {text: '结算完成', key: '3'}
    ];
    
    //开始资金清算
    $scope.moneysettle = function (object) {

    	$scope.progress = true;
    	moneySettle($scope.settleDate, function (errCode, errMsg) {
    		
    		if (errCode != 0) {
    			
    			$scope.errorcode = errCode;
    			$scope.errormsg = errMsg;
    			$scope.iserror = true;
    			$scope.$apply();
    		}
    		
    	});
    	
    	var statusInterval = setInterval(function () {
    		
    		$scope.getCurrStatus();
    		
    		if ($scope.currStatus == $scope.settleStatus[2].key) {
    			
    			$scope.progress = false;
    			$scope.resultInfo = true;
    			$scope.$apply();
    			clearInterval(statusInterval);
    		}
    		
    		if ($scope.iserror) {
    			
    			$scope.progress = false;
    			$scope.$apply();
    			clearInterval(statusInterval);
    		}
    		
    	}, 2000);

    	   	
    }
    
    //获取当前结算状态
    $scope.getCurrStatus = function () {
    	
    	findCurrStatus(function (result) {
    		
    		$scope.currStatus = result.settleStatus;
    	}, $scope.settleDate);
    }





    
});
