myapp.controller('NewUserriskVarietyFOF', function ($scope, $timeout) {

    $scope.subCapitalAccountService = new com.quantdo.orgClear.service.SubCapitalAccountService();
    $scope.subAccountRiskParamService = new com.quantdo.orgClear.service.SubAccountRiskParamService();
    $scope.subCapitalAccountTradingLimitService = new com.quantdo.orgClear.service.SubCapitalAccountTradingLimitService();
    $scope.instrumentService = new com.quantdo.orgClear.service.InstrumentService();
    $scope.productService = new com.quantdo.orgClear.service.ProductService();
  
    $scope.entitys = [];
    $scope.subAccount = {};
    $scope.radioValue = [];
    $scope.heYue = {};
    $scope.subAccounts = [];
    $scope.instrumentEntitys = {};
    $scope.subAccountEntitys = [];
//    $scope.subAccounts = {};
    $scope.limitEntitys = [];
    $scope.products = [];
    $scope.listEntitys = {};
    $scope.buttonIsTrue = true; //交易品种限制button按钮默认为不可点击
    $scope.sourceIsTrue = true;
    $scope.targetIsTrue = true;
    $scope.ModalEntity = {};
    
    
    // 查询已经设置了品种限制的账户
    $scope.subCapitalAccountTradingLimitService.findAllCapitalAccountTradingLimit(function(result){
    	$scope.subCapitalAccountTradingLimitEntitys = result;
        $scope.$apply();
    });
    
	 // 查询客户账号
    findActiveCapitalAccount(function (result) {
	        $scope.subAccounts = result;
	        $scope.$apply();
	   });
    
    
    $scope.subCapitalAccountTradingLimitService.findfofAllLimit(function(result){
    	$scope.listEntitys = result;
        $scope.$apply();
    });

    // 批量删除
    $scope.del = function () {
    	if(undefined == $scope.limitEntitys || $scope.limitEntitys.length == 0){
    		layer.msg("请选择批量删除目标",{icon:2});
    		return;
    	}
    	layer.confirm("确定批量删除？",{icon:3},function(){
    		$scope.subCapitalAccountTradingLimitService.deleteBySubCapitalAccountTradingLimits(function(result){
        		layer.msg("批量删除成功",{icon:1});
        		
        		 $scope.subCapitalAccountTradingLimitService.findAllCapitalAccountTradingLimit(function(result){
        		    	$scope.subCapitalAccountTradingLimitEntitys = result;
        		    	 $scope.$apply();
        		    });
        		 
        		 $scope.subCapitalAccountTradingLimitService.findfofAllLimit(function(result){
        		    	$scope.listEntitys = result;
        		        $scope.$apply();
        		    });
        		// 查询客户账号
        		findActiveCapitalAccount(function (result) {
        	            $scope.subAccounts = result;
        	            $scope.$apply();
        	      });
        	   $scope.limitEntitys = [];
        	   $scope.isAllSelected = false;
        	   $scope.isSelected = false;
        	},$scope.limitEntitys);
    		
       });
    }

    $scope.find = function (entity) {
    	if(undefined != entity && undefined != entity.subAccountID){
    		$scope.subCapitalAccountTradingLimitService.findfofAllLimitBySubAccountID(function(result){
		    	$scope.listEntitys = result;
		        $scope.$apply();
    		},entity.subAccountID);
    	} else {
    		 $scope.subCapitalAccountTradingLimitService.findfofAllLimit(function(result){
    		    	$scope.listEntitys = result;
    		        $scope.$apply();
    		  });
    	}
    }
    
    //初始化新增
    $scope.insert = function(){
    	$scope.ModalEntity = {};
    	$scope.myForm.subAccountID.$setPristine();
    	$scope.myForm.exchID.$setPristine();
    	$scope.myForm.productID.$setPristine();
    	$scope.myForm.instrumentID.$setPristine();
    	$scope.buttonIsTrue = true;
    	$scope.isUpdate = false;
    	//查询所有交易所
//    	getAllExchanges(function(result){
//    		$scope.exchs = result;
//    		$scope.$apply();
//    	});
    	
//    	//查询全部产品代码
//    	getAllProductEntity(function(result){
//    		$scope.products = result;
//    		$scope.$apply();
//    	});
//    	
//    	//查询全部合约代码
//    	getAllInstrumentEntity(function(result){
//    		$scope.instruments = result;
//    		$scope.$apply();
//    	});
    	
    };
    
    //初始化修改
    $scope.update = function(index,entity){
    	$scope.ModalEntity = angular.copy(entity);
    	$scope.ModalEntity.recordIndex = index;
    	$scope.myForm.subAccountID.$setPristine();
    	$scope.myForm.exchID.$setPristine();
    	$scope.myForm.productID.$setPristine();
    	$scope.myForm.instrumentID.$setPristine();
//    	$scope.buttonIsTrue = true;
    	$scope.isUpdate = true;
    }
    
    //根据交易所查询有所产品
    $scope.findAllProduct = function(exchID,productID){
    	$scope.products = [];
    	if(undefined == exchID){
    		//查询全部产品代码
        	getAllProductEntity(function(result){
        		$scope.products = result;
        		$scope.$apply();
        	});
    	} else {
	    	$scope.productService.findByExchID(function(result){
	    		$scope.products = result;
	    		$scope.$apply();
	    	},exchID);
    	}
    };
    
    //根据产品代码查询合约
    $scope.findAllInstrument = function(exchID,productID){
    	$scope.instruments = [];
    	if(undefined == exchID || undefined == productID){
    		$scope.buttonIsTrue = true;
    	} else {
    		$scope.buttonIsTrue = false;
    	}
    	
    	if(undefined == exchID && undefined == productID ){
    		//查询全部合约代码
        	getAllInstrumentEntity(function(result){
        		$scope.instruments = result;
        		$scope.$apply();
        	});
    	} else {
	    	 $scope.instrumentService.findAllByProductIDAndExchID(function(result){
	    		$scope.instruments = result;
	    		$scope.$apply();
	    	},productID,exchID);
    	}
    };
    
    //复制前查询
    $scope.copyQuery = function(){
    	 // 查询已经设置了品种限制的账户
    	$scope.sourceSubAccount = {};
    	$scope.targetSubAccount = {};
        $scope.subCapitalAccountTradingLimitService.findAllCapitalAccountTradingLimit(function(result){
        	$scope.subCapitalAccountTradingLimitEntitys = result;
            $scope.$apply();
        });
    	
    	// 查询客户账号
        findActiveCapitalAccount(function (result) {
            $scope.subAccounts = result;
            $scope.$apply();
        });
        
        $scope.sourceIsTrue = true;
		$scope.targetIsTrue = true;
    }

    // 保存交易品种
    $scope.save = function (entity) {
    	
    	if(undefined == entity.subAccountID){
    		layer.msg("请选择资产单元",{icon:2});
    		return ;
    	}
    	
    	if(undefined == entity.exchID){
    		layer.msg("请选择交易所",{icon:2});
    		return ;
    	}
    	
    	if(undefined == entity.exchID){
    		layer.msg("请选择产品代码",{icon:2});
    		return ;
    	}
    	
        $scope.subCapitalAccountTradingLimitService.save(function (result) {
            layer.msg("保存交易品种成功",{icon:1});
            $("#newUserriskvarietyMyModalInsertfof").modal("hide");
            
            if(entity.recordIndex != undefined){
            	if(entity.instrumentID == undefined || entity.instrumentID == "" ){
            		entity.instrumentID = entity.productID;
            	}
            	$scope.listEntitys.splice(entity.recordIndex, 1, entity);
            	$scope.$apply();
            }else{
            	$scope.subCapitalAccountTradingLimitService.findfofAllLimit(function(result){
                	$scope.listEntitys = result;
                    $scope.$apply();
                });
            	// 查询已经设置了品种限制的账户
                $scope.subCapitalAccountTradingLimitService.findAllCapitalAccountTradingLimit(function(result){
                	$scope.subCapitalAccountTradingLimitEntitys = result;
                    $scope.$apply();
                });
            }
            $scope.entitys = [];
            $scope.ModalEntity = {};
        }, entity);
    };

    $scope.delete = function (entity) {
    	layer.confirm("确定删除这条记录？",{icon:3},function(){
    		 $scope.subCapitalAccountTradingLimitService.deleteByCondition(function(result){
    	              layer.msg("删除成功！",{icon:1});
    	              $scope.subCapitalAccountTradingLimitService.findAllCapitalAccountTradingLimit(function(result){
    	              	$scope.subCapitalAccountTradingLimitEntitys = result;
    	              	 $scope.$apply();
    	              });
    	              
    	              $scope.subCapitalAccountTradingLimitService.findfofAllLimit(function(result){
    	              	$scope.listEntitys = result;
    	                  $scope.$apply();
    	              });
    	              
    	        },entity);
        });
    }

    // 复制
    $scope.copy = function(sourceSubAccountID,targetSubAccountID){
        if(sourceSubAccountID == targetSubAccountID){
            layer.msg("源客户号与目的客户号不能相同",{icon:2});
            return;
        }

        layer.confirm("复制将清除目的客户号"+targetSubAccountID+"的原设置信息，是否继续？",{icon:3},function(){
        	
        	$scope.sourceSubAccount = {};
        	$scope.targetSubAccount = {};
        	
        	$scope.sourceSubAccount.subAccountID = sourceSubAccountID;
        	$scope.targetSubAccount.subAccountID = targetSubAccountID;
        	
            $scope.subCapitalAccountTradingLimitService.copy(function (result) {
                    layer.msg("复制成功",{icon:1});
                    
                    $scope.subCapitalAccountTradingLimitService.findAllCapitalAccountTradingLimit(function(result){
    	              	$scope.subCapitalAccountTradingLimitEntitys = result;
    	              	 $scope.$apply();
    	              });
    	              
    	              $scope.subCapitalAccountTradingLimitService.findfofAllLimit(function(result){
	    	              	$scope.listEntitys = result;
	    	                $scope.$apply();
    	              });
                    
                    $("#newUserriskvarietyCopyModalfof").modal("hide");
                    
                    $scope.sourceSubAccount = {};
                    $scope.targetSubAccount = {};
            },$scope.sourceSubAccount,$scope.targetSubAccount);
        });
    };
    
    //批量删除
    $scope.checkAdd = function(flag,entity){
    	if(flag) {
    		$scope.limitEntitys.push(entity);
		} else {
			var index = $scope.limitEntitys.indexOf(entity);
			 $scope.limitEntitys.splice(index, 1);
		}
    }
    
    $scope.allCheckedAdd = function(allChecked){
    	//全选
    	if(allChecked){
    		$scope.isSelected = true;
    		$scope.limitEntitys = angular.copy($scope.listEntitys);
    	} else {
    		$scope.isSelected = false;
			$scope.limitEntitys = [];
    	}
    };
    
    $scope.sourceChange = function(sourceSubAccount){
    	if(undefined == sourceSubAccount){
    		$scope.sourceIsTrue = true;
    	} else {
    		$scope.sourceIsTrue = false;
    	}
    }
    
    $scope.targetChange = function(targetSubAccount){
    	if(undefined == targetSubAccount){
    		  $scope.targetIsTrue = true;
    	} else {
    		  $scope.targetIsTrue = false;
    	}
    }
});
