myapp.controller('fundProductInfoQueryController', function ($scope, $timeout) {
	
	// 初始化页面参数
    $scope.queryEntity = {};
    $scope.queryInsts = [];
    $scope.queryProducts = [];
    $scope.ModalEntity = {};
	
    // 机构信息
    getInstClientQueryConditionList(function(result){
    	$scope.queryInsts = angular.copy(result);
    	$scope.queryEntity.instClientID = $scope.queryInsts[0].instClientID;
    	$scope.currentInst = $scope.queryInsts[0].instClientID;
    	if($scope.queryInsts.length > 1){
    		$scope.noInst = false;
    	}else{
    		$scope.noInst = true;
    	}
    	$scope.getProductsInfo($scope.currentInst);
    });
    
    // 根据机构筛选产品
    $scope.getProductsInfo = function(instClientID){
    	findFundProduct(function (result) {
        	$scope.queryProducts = angular.copy(result);
        	if($scope.queryProducts.length > 0){
        		$scope.queryEntity.fundProductID = $scope.queryProducts[0].fundProductID;
        	}
        	$scope.$apply();
        },{
        	instClientID: instClientID
        });
    }
    
    // 查询
    $scope.find = function(queryEntity){
    	$scope.isQuery = true;
    	
    	if(queryEntity.fundProductID == undefined || queryEntity.fundProductID.trim() == ''){
    		layer.msg("产品代码不能为空",{icon: 2});
    		$scope.isQuery = false;
    		return false;
    	}
    	
    	findFundProduct(function(result){
    		if(result != null && result.length > 0){
    			$scope.ModalEntity = angular.copy(result[0]);
        		$scope.$apply();
    		}
    		$timeout(function() {
    			$scope.isQuery = false;
    		}, 1000);
    	},queryEntity);
    }
    
});

