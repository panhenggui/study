myapp.controller('BusAuditController', function ($scope,$rootScope, $timeout) {	
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	// 按钮权限
	$scope.busAudit_intra = isShow("busAudit_intra");
	$scope.busAudit_before = isShow("busAudit_before");

    $scope.listEntitys = [];
    $scope.service = new com.quantdo.orgClear.service.BusAuditService();
	
    $scope.auditBefore = function(){
    	$scope.service.auditBefore(function(result){
    		$scope.listEntitys = result;
    		$scope.$apply();
    	});
    }
    
    $scope.auditIntra = function(){
    	$scope.service.auditIntra(function(result){
    		$scope.listEntitys = result;
    		$scope.$apply();
    	});
    }
    
});
