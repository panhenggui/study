myapp.controller('settleRollbackController', function ($scope, $timeout,$rootScope) {
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
    $scope.progress = false;
    $scope.iserror = false;
    $scope.currStatus = '';
    
    $scope.settleRollback_rollback = isShow("settleRollback_rollback");
    
    //结算状态
    $scope.settleStatus = [
        {text: '结算前', key: '1'},
        {text: '结算处理', key: '2'},
        {text: '结算完成', key: '3'}
    ];
    
    //获取当前结算状态
    $scope.getCurrStatus = function () {
    	
    	findCurrStatus(function (result) {
    		
    		$scope.currStatus = result.settleStatus;
    	}, $scope.settleDate);
    }
    
    //结算回退
    $scope.rollback = function (object) {
    	$scope.progress = true;
    	
    	var settleDate =$scope.settleDate;
    	if (settleDate ==""){
    		$scope.progress = false;
    		layer.msg("结算回退日期不能为空!", {icon: 2, time: 3000});
        	return false;
    	}else {
        	$scope.iserror = false;
	    	settleRollback($scope.settleDate, function (errCode, errMsg) {
	    		if (errCode != 0) {
	    			
	    			layer.msg(errMsg, {icon: 2, time: 3000});
	    			$scope.iserror = true;
	    			$scope.$apply();
	    		}
	    	});
	    	
	    	var statusInterval = setInterval(function () {
	    		$scope.getCurrStatus();
	    		if ($scope.currStatus == $scope.settleStatus[0].key && ! $scope.iserror) {
	    			$scope.progress = false;
	    			layer.msg("结算回退成功!", {icon: 1, time: 3000});
	    			$scope.$apply();
	    			clearInterval(statusInterval);
	    		}
	    		if ($scope.iserror) {
	    			$scope.progress = false;
	    			$scope.$apply();
	    			clearInterval(statusInterval);
	    		}
	    	}, 1000);
    	}
    }




    
});
