myapp.controller('fofRiskParamsController', function ($scope, $timeout) {
	
	$scope.tradeTypes = clearConstant.tradeTypes;//交易类型
	$scope.offsetFlags = clearConstant.offsetFlag;	//开平
	$scope.tradeDirections = clearConstant.tradeDirection;	//买卖方向
	$scope.riskWays = clearConstant.riskWay;	//风控方式
	$scope.riskLevels = clearConstant.riskLevels;	//风控等级
	$scope.isRecoverys = clearConstant.isRecovery;	//是否自动恢复
	$scope.contractTypes = clearConstant.contractType;	//市场
	
	$scope.fofRiskParamsService = new com.quantdo.orgClear.service.FOFRiskParamsService();
	
	$scope.fundProducts = [];	//下拉框产品信息集合
	$scope.queryFundProduct = {};	//查询的产品对象
	$scope.futureRestrictionLists = [];	//交易品种限制
	$scope.netRatio = [];		// 净值分档占比
	$scope.marketRatio = [];	// 市场占比
	$scope.positionRatio = [];	// 持仓占比
	$scope.perUnitStop = [];	//单位净值止损
	$scope.dailyMaxDrawDownStop = [];	//日内最大回撤止损
	
	//转换id
	$scope.transTradeType = function(key){
		for(var i = 0;i < $scope.tradeTypes.length;i++){
			if($scope.tradeTypes[i].key == key){
				return $scope.tradeTypes[i].text;
			}
		}
	};
	
	$scope.transOffsetFlag = function(key){
		for(var i = 0;i < $scope.offsetFlags.length;i++){
			if($scope.offsetFlags[i].key == key){
				return $scope.offsetFlags[i].text;
			}
		}
	};
	
	$scope.transTradeDirection = function(key){
		for(var i = 0;i < $scope.tradeDirections.length;i++){
			if($scope.tradeDirections[i].key == key){
				return $scope.tradeDirections[i].text;
			}
		}
	};
	
	$scope.transRiskWay = function(key){
		for(var i = 0;i < $scope.riskWays.length;i++){
			if($scope.riskWays[i].key == key){
				return $scope.riskWays[i].text;
			}
		}
	};
	
	$scope.transRiskLevel = function(key){
		for(var i = 0;i < $scope.riskLevels.length;i++){
			if($scope.riskLevels[i].key == key){
				return $scope.riskLevels[i].text;
			}
		}
	};
	
	$scope.transIsRecovery = function(key){
		for(var i = 0;i < $scope.isRecoverys.length;i++){
			if($scope.isRecoverys[i].key == key){
				return $scope.isRecoverys[i].text;
			}
		}
	};
	
	$scope.transContractTypes = function(key){
		for(var i = 0;i < $scope.contractTypes.length;i++){
			if($scope.contractTypes[i].key == key){
				return $scope.contractTypes[i].text;
			}
		}
	};
	
	// 获取当前登录用户所属机构下外部产品
	$scope.fofRiskParamsService.getAllSidesProduct(function(result){
		$scope.fundProducts = result;
		$scope.queryFundProduct = result[0];
		$scope.$apply();
	});
	
	$scope.search = function (queryFundProduct) {
		$scope.isQuery = true;
		
		// 交易品种限制
		$scope.fofRiskParamsService.findFutureRestrictionByCondition(function(result){
			$scope.futureRestrictionLists = result;
			
			// 净值分档占比
			$scope.fofRiskParamsService.findFundProductIdxByCondition(function(result){
				$scope.netRatio = result;
				
				// 市场占比
				$scope.fofRiskParamsService.findFundProductIdxByCondition(function(result){
					$scope.marketRatio = result;
					
					// 持仓占比
					$scope.fofRiskParamsService.findFundProductIdxByCondition(function(result){
						$scope.positionRatio = result;
						
						// 单位净值止损
						$scope.fofRiskParamsService.findFundProductIdxByCondition(function(result){
							$scope.perUnitStop = result;
							
							// 日内最大回撤止损
							$scope.fofRiskParamsService.findFundProductIdxByCondition(function(result){
								$scope.dailyMaxDrawDownStop = result;
								
								
							},queryFundProduct.source,"4",queryFundProduct.instClientID,
							queryFundProduct.fofRiskInstID, queryFundProduct.fundProductID);
							
						},queryFundProduct.source,"3",queryFundProduct.instClientID,
						queryFundProduct.fofRiskInstID, queryFundProduct.fundProductID);
						
					},queryFundProduct.source,"2",queryFundProduct.instClientID,
					queryFundProduct.fofRiskInstID, queryFundProduct.fundProductID);
					
					
				},queryFundProduct.source,"1",queryFundProduct.instClientID,
				queryFundProduct.fofRiskInstID, queryFundProduct.fundProductID);
				
			},queryFundProduct.source,"0",queryFundProduct.instClientID,
			queryFundProduct.fofRiskInstID, queryFundProduct.fundProductID);
			
			$timeout(function() {
	            $scope.isQuery = false;
	        }, 1000);
		},queryFundProduct.source,queryFundProduct.instClientID,
			queryFundProduct.fofRiskInstID, queryFundProduct.fundProductID);
		
		
	}
	
});
