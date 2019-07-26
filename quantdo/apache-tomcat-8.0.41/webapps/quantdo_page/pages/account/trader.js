myapp.controller('traderController', function($scope, $timeout) {
	$scope.traderEntitys = {};// 所有属性集合
	$scope.trader = {};
	$scope.traderInfo = {};
	$scope.tradeUser = {};
	$scope.traderEntitys.updateIndex = -1;
	$scope.queryIDs = new Array();

	$scope.rightSelects = clearConstant.traderTypes;

	$scope.idTypeSelects = clearConstant.idTypeSelects;

	// 初始化页面记录
	getAllTraderEntity(function(result) {
		$scope.traderEntitys = result;
		$scope.queryIDs = angular.copy($scope.traderEntitys);
		$scope.$apply();
	}, null);
	// 初始化查询选项
	$scope.datas = [ {
		text : '全部',
		key : ''
	}, {
		text : '否',
		key : '0'
	}, {
		text : '是',
		key : '1'
	} ];

	// 重置表单验证信息
	function formValidateReset() {
		$scope.myForm.traderID.$setPristine();
		$scope.myForm.traderName.$setPristine();
//		$scope.myForm.traderType.$setPristine();
	}

	$scope.transTraderTypes = function (text){
    	var count = $scope.rightSelects.length;
        for (var i = 0; i < count; i++) {
            if ($scope.rightSelects[i].key == text) {
                return $scope.rightSelects[i].text;
            }
        }
    }
	
	$scope.transIdTypeSelects = function (text){
    	var count = $scope.idTypeSelects.length;
        for (var i = 0; i < count; i++) {
            if ($scope.idTypeSelects[i].key == text) {
                return $scope.idTypeSelects[i].text;
            }
        }
    }
	
	// 修改初始化页面参数
	$scope.initUpdate = function(index, obj) {
		if (obj.isActive == '0') {
			layer.msg("资产单元已销户，不允许修改", {
				icon : 2,
				time : 2000
			});
			$scope.dtarget = "";
			return false;
		} else {
			$scope.dtarget = "#traderModal";
			$scope.tempEntity = angular.copy(obj);
			$scope.tempEntity.updateIndex = index;
			$scope.traderModalEntity = angular.copy($scope.tempEntity);
			formValidateReset();
		}
	};

	// 销户
	$scope.remove = function(traderEntity, index) {
		// 使用内置Index
		checkSubAccount(function(delFlag) {
			if (delFlag) {
				layer.msg("风险资金帐号未销户，资产单元不能销户", {
					icon : 2,
					time : 2000
				});
				return false;
			} else {
				findTrader(function(traderResult) {
					$scope.trader = traderResult[0];
				}, {
					traderID : traderEntity.traderID
				});
				layer.confirm('确定注销此资产单元吗？', {
					icon : 3
				}, function(count) {
					$scope.trader.isActive = '0';
					updateTrader(function(result) {
						getAllTraderEntity(function(detailResult) {
							$scope.traderEntitys.splice(index, 1,detailResult[0]);
							$scope.$apply();
						}, {
							traderID : traderEntity.traderID
						});
					}, $scope.trader);
					layer.close(count);
				});
			}
		}, {
			innerAccountID : "",
			traderID : traderEntity.traderID,
			isActive : "1",
			instClientID :traderEntity.instClientID
		});
	};

	// 重新启用
	$scope.rebuild = function(traderEntity, index) {
		findTrader(function(traderResult) {
			$scope.trader = traderResult[0];
		}, {
			traderID : traderEntity.traderID
		});
		layer.confirm('确定重新启用此资产单元吗？', {
			icon : 3
		}, function(count) {
			$scope.trader.isActive = '1';
			updateTrader(function(result) {
				getAllTraderEntity(function(detailResult) {
					$scope.traderEntitys.splice(index, 1, detailResult[0]);
					$scope.$apply();
				}, {
					traderID : traderEntity.traderID
				});
			}, $scope.trader);
			layer.close(count);
		});
	};

	// 资产单元查询
	$scope.find = function(object) {
		$scope.isQuery = true;
		getAllTraderEntity(function(result) {
			$scope.traderEntitys = result;
			$timeout(function() {
				$scope.isQuery = false;
			}, 1000);
		}, object);
	};

	// 修改
	$scope.save = function(traderModalEntity) {
		var index = traderModalEntity.updateIndex;
		// 修改
		// if (trader.updateIndex != undefined) {
		findTrader(function(traderResult) {
			$scope.trader = traderResult[0];
			$scope.trader.traderName = traderModalEntity.traderName;
			updateTrader(function(result) {
				
				findTraderInfo(function(traderInfoResult) {
					$scope.traderInfo = traderInfoResult[0];
//					$scope.traderInfo.traderType = traderModalEntity.traderType;
//					$scope.traderInfo.idType = traderModalEntity.idType;
//					$scope.traderInfo.idNumber = traderModalEntity.idNumber;
					$scope.traderInfo.address = traderModalEntity.address;
					$scope.traderInfo.telephone = traderModalEntity.telephone;
					updateTraderInfo(function(result) {
						
						findTradeUser(function(tradeUserResult) {
							$scope.tradeUser = tradeUserResult[0];
							$scope.tradeUser.userName = traderModalEntity.traderName;
							updateTradeUser(function(result) {
								
								delete traderModalEntity.updateIndex;

								getAllTraderEntity(function(result) {
									$scope.traderEntitys.splice(index, 1, result[0]);
									$scope.$apply();
								}, {
									traderID : traderModalEntity.traderID
								});

								
							}, $scope.tradeUser);
						}, {
							userID : traderModalEntity.traderID
						});
						
						findSubCapitalEntity(function(subCapitalResult){
							if(subCapitalResult.length>0){	//子资金帐号已开，对应修改客户名称
								subCapitalResult[0].subAccountName=traderModalEntity.traderName;
								updateSubCapitalEntity(function(result){},subCapitalResult[0]);
							}
						},{
							traderID : traderModalEntity.traderID
						});
						
					}, $scope.traderInfo);
				}, {
					traderID : traderModalEntity.traderID
				});
				
			}, $scope.trader);
		}, {
			traderID : traderModalEntity.traderID
		});

		$("#traderModal").modal("hide");
	}
});
