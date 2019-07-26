myapp.controller('subCapitalRiskParamController', function ($scope, $timeout) {

    $scope.subCapitalAccountTradingLimitService = new com.quantdo.orgClear.service.SubCapitalAccountTradingLimitService();
    $scope.subCapitalAccountService = new com.quantdo.orgClear.service.SubCapitalAccountService();

    $scope.capRiskType = clearConstant.capRiskType;		//风控指标
    $scope.limitType = clearConstant.limitType;		//黑白名单限制类型
    $scope.bwProductType = clearConstant.bwProductType;		//黑白名单类别
    $scope.entitys = [];
    $scope.subAccounts = [];
    $scope.listEntitys = [];
    $scope.ModalEntity = {capRiskType: ''};
    $scope.queryEntity = {};
    $scope.exchs = [];
    $scope.bwInsertList = [];
    
    $scope.transCapRiskType = function(key){
    	for(var i = 0;i < $scope.limitType.length;i++){
    		if($scope.capRiskType[i].key == key){
    			return $scope.capRiskType[i].text;
    		}
    	}
    }
    
    $scope.transLimitType = function(key){
    	for(var i = 0;i < $scope.limitType.length;i++){
    		if($scope.limitType[i].key == key){
    			return $scope.limitType[i].text;
    		}
    	}
    }
    
    $scope.transBwProductType = function(key){
    	for(var i = 0;i < $scope.bwProductType.length;i++){
    		if($scope.bwProductType[i].key == key){
    			return $scope.bwProductType[i].text;
    		}
    	}
    }
    
    //查询所有交易所
	getAllExchanges(function(result){
		$scope.exchs = result;
		$scope.$apply();
	});
	
    // 查询有效资金账号
	$scope.subCapitalAccountService.findAllActive(function (result) {
        $scope.subAccounts = result;
        $scope.$apply();
    });
    
    $scope.subCapitalAccountTradingLimitService.findSubCapRiskParamByCondition(function(result){
    	$scope.listEntitys = result;
        $scope.$apply();
    },{},"");

    $scope.find = function (entity) {
    	$scope.isQuery = true;
        $scope.listEntitys = [];
        if(entity.capRiskType == undefined){
        	entity.capRiskType = '';
        }
        $scope.subCapitalAccountTradingLimitService.findSubCapRiskParamByCondition(function (result) {
            $scope.listEntitys = angular.copy(result);
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        }, entity,entity.capRiskType);
    }
    
 // 重置表单验证信息
	function formValidateReset() {
		$scope.blackWhiteForm.subAccountID.$setPristine();
		$scope.blackWhiteForm.exchID.$setPristine();
		$scope.blackWhiteForm.productID.$setPristine();
		$scope.blackWhiteForm.limitType.$setPristine();
	}
    
    //初始化新增
    $scope.insert = function(){
    	$scope.ModalEntity = {};
    	formValidateReset();
    	$scope.isUpdate = false;
    	$scope.codeEdit = false;
    	$scope.ModalEntity.subAccountID = $scope.subAccounts[0].subAccountID;
    	$scope.ModalEntity.limitType = $scope.limitType[0].key;
    	$scope.ModalEntity.productID = $scope.bwProductType[1].key;
    	$scope.ModalEntity.exchID = $scope.exchs[0].exchID;
    };
    
    $scope.canCodeEdit = function(productType){
    	if(productType == '0'){
    		$scope.ModalEntity.instrumentID = '';
    		$scope.codeEdit = true;
    	}else{
    		$scope.codeEdit = false;
    	}
    }
    
    //初始化修改
    $scope.initUpdate = function(entity, index){
    	$scope.ModalEntity = angular.copy(entity);
    	$scope.ModalEntity.recordIndex = index;
    	formValidateReset();
    	$scope.isUpdate = true;
    	$scope.canCodeEdit(entity.productID);
    }
    

    // 保存黑白名单
    $scope.save = function (entity) {
    	var index = entity.recordIndex;
        $scope.tempEntity = angular.copy(entity);
        if(!$scope.codeEdit && ($scope.tempEntity.instrumentID == undefined || $scope.tempEntity.instrumentID.trim() == '')){
        	layer.msg("代码不能为空",{icon: 2});
        	return false;
        }
        $scope.bwInsertList = [];
        if($scope.tempEntity.instrumentID == undefined || $scope.tempEntity.instrumentID.trim() == ''){
        	$scope.tempEntity.instrumentID = 'default';
        	$scope.bwInsertList.push($scope.tempEntity);
        }else{
        	var instrumentList = [];
        	instrumentList = $scope.tempEntity.instrumentID.split(',');
        	angular.forEach(instrumentList,function(data,index,list){
        		if(data.trim() != ''){
        			var tmpEntity = angular.copy($scope.tempEntity);
            		tmpEntity.instrumentID = data.trim();
            		$scope.bwInsertList.push(tmpEntity);
        		}
        	});
        }
        //增加
        if (index == undefined) {
        	$scope.subCapitalAccountTradingLimitService.addSubCapBwEntitys(function(results){
        		if(results != null && results.length > 0){
        			$scope.subCapitalAccountTradingLimitService.findSubCapRiskParamByCondition(function(result){
    			    	$scope.listEntitys = result;
    			        $scope.$apply();
    			    },{},"");
        			layer.msg("新增成功",{icon: 1});
        			$("#subCapBlackWhiteModal").modal("hide");
        		}else{
        			layer.msg("新增失败",{icon: 2});
        		}
        	},$scope.bwInsertList);
            //修改
        } else {
	    	$scope.subCapitalAccountTradingLimitService.updateSubCapBwEntitys(function(results){
	    		if(results != null && results.length > 0){
			    	$scope.listEntitys = results;
			        $scope.$apply();
			        layer.msg("操作成功",{icon: 1});
	    			$("#subCapBlackWhiteModal").modal("hide");
	    		}else{
	    			layer.msg("操作失败",{icon: 2});
	    		}
	    	},$scope.bwInsertList,$scope.listEntitys[index]);
        }
    };

    $scope.remove = function (entity, index) {
    	layer.confirm("确定删除这条记录？",{icon:3},function(count){
    		 $scope.subCapitalAccountTradingLimitService.deleteById(function(){
    	              layer.msg("删除成功！",{icon:1});
    	              $scope.listEntitys.splice(index, 1);
    	              layer.close(count);
    	              $scope.$apply();
    	        },entity.id);
        });
    }

});
