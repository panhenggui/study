myapp.controller('TraderManage', function ($scope, $timeout) {

	$scope.tradeUserService = new com.quantdo.orgClear.service.TradeUserService();
	$scope.subCapitalAccountService = new com.quantdo.orgClear.service.SubCapitalAccountService();
	$scope.userTraderService = new com.quantdo.orgClear.service.UserTraderService
	$scope.tradeUserTypes = clearConstant.tradeUserTypes;
	$scope.ModalEntity = {};
	$scope.arrayMaps = [];
	$scope.tradeUsers = {};
	$scope.userID = {};
	$scope.tmpUsers = [];
	$scope.isCancel = false;//是否被注销了，  true ：是  false：否
	$scope.myModalTextareaShow = false;//textarea 框
	$scope.myModalUpdateShow = false; //更新框
	$scope.myModalEditShow = false;//编辑框
	$scope.pwdBlank = true;
	//初始化
	$scope.tradeUserService.findByUserType(function(result){
		//下拉框的值
		$scope.tradeUsers = result;
		//table的值
		$scope.listEntitys = result;
		$scope.$apply();
	},"1");
	
	$scope.isBlank = function(pwd){
		if(undefined == pwd || "" == pwd.trim()){
			$scope.pwdBlank = true;
		}else{
			$scope.pwdBlank = false;
		}
	}
	
	$scope.insert = function(){
		$scope.ModalEntity = {};
		$scope.ModalEntity.userType = $scope.tradeUserTypes[1].key;
	}

	//根据交易员查询
	$scope.find = function(tradeUser){
		if(undefined == tradeUser){
			$scope.tradeUserService.findByUserType(function(result){
				//下拉框的值
				$scope.tradeUsers = result;
				//table的值
				$scope.listEntitys = result;
				$scope.$apply();
			},"1");
		} else {
			$scope.tmp = {};
			$scope.tmp.userID = tradeUser;
			$scope.tradeUserService.findTradeUserByUserId(function(result){
				$scope.listEntitys = result;
				$scope.$apply();
				$scope.tmp = {};
			},$scope.tmp);
		}
	};

	//保存
	$scope.save = function(ModalEntity){
		if(ModalEntity.pwd != ModalEntity.password){
			layer.msg("2次输入的密码不一致。",{icon:2});
			return ;
		}
		ModalEntity.role ="200";
		$scope.tradeUserService.save(function(result){
			layer.msg("保存成功",{icon:1});
			$scope.ModalEntity = {};
			$("#traderManageMyModalInsert").modal("hide");
			$scope.tradeUserService.findByUserType(function(result){
				$scope.tradeUsers = result;
				$scope.listEntitys = result;
				$scope.$apply();
			},"1");
		},ModalEntity);


	}

	//修改
	$scope.update = function (entity) {
		entity.role= "200";
		$scope.tradeUserService.updateByEntity(function (result) {
			layer.msg("修改成功",{icon:1});
			$scope.ModalEntity = {};
			$("#traderManageMyModalUpdate").modal("hide");
		},entity);

	}

	//编辑
	$scope.edit = function(entity){
		if(isActive(entity.isActive)){
			$scope.ModalEntity = entity;
		}
	};


	$scope.query = function(entity){
		if(!isActive(entity.isActive)){
			return ;
		}
		
		$scope.subCapitalAccountService.findByUserId(function(result){
			var subId = "";
			var message = "管理资产单元：";
			angular.forEach(result, function (value, index, arrays) {
				subId += value.subAccountID + " ";
			});
			$scope.message = message + subId;
			$scope.$apply();
		},entity.userID,entity.userType)
	};

	$scope.querySub = function(entity){
		$scope.arrayMapsTem=[];
		$scope.subEntitysTem=[];
		if(!isActive(entity.isActive)){
			return ;
		}
		
		$scope.myModalTextareaShow = true;//textarea 框
		$scope.myModalUpdateShow = true; //更新框
		$scope.myModalEditShow = true;//编辑框
		
		$scope.arrayMaps = [];
		$scope.tmpUsers = [];

		//$scope.tradeUser = {};
		$scope.tmpUsers.push(entity);
		$scope.userID = $scope.tmpUsers[0].userID; //默认显示当前被选中的交易员
		$scope.subCapitalAccountService.findAllActive(function (result) {
		    $scope.ntmpResult =angular.copy(result);
			$scope.nResult = angular.copy(result);
			var tem =[];
			$scope.subCapitalAccountService.findByUserId(function(result){
				angular.forEach($scope.nResult, function (v, i, a) {
					angular.forEach(result, function (c, j, x) {
						if(c.traderID == v.traderID){
							$scope.nResult[i].isChecked = "0"; //设置选中状态
							$scope.arrayMaps.push(v);
							tem.push(i);
						}
					});
				});
				for (var j=1;tem.length>=j;j++) {
					$scope.ntmpResult.splice(tem[tem.length-j], 1);
				}

				$scope.subEntitys = $scope.ntmpResult;
				$scope.$apply();
			},entity.userID,entity.userType)
		});
		
	}

	//注销
	$scope.cancel = function(entity){
		layer.confirm("确定注销该交易员？",{icon:3},function(){
			$scope.tradeUserService.cancel(function (result) {
				layer.msg("注销成功",{icon:1});
				//初始化
				$scope.tradeUserService.findByUserType(function(result){
					//下拉框的值
					$scope.tradeUsers = result;
					//table的值
					$scope.listEntitys = result;
					$scope.$apply();
				},"1");
				
			},entity);
		});
	};

	//注销恢复
	$scope.cancelRestore = function(entity){
		layer.confirm("确定恢复该交易员？",{icon:3},function(){
			$scope.tradeUserService.cancelRestore(function (result) {
				layer.msg("恢复成功",{icon:1});	
				//初始化
				$scope.tradeUserService.findByUserType(function(result){
					//下拉框的值
					$scope.tradeUsers = result;
					//table的值
					$scope.listEntitys = result;
					$scope.$apply();
				},"1");
				
			},entity);
		});
	};

	$scope.add = function(index,listEntity){
		$scope.arrayMaps.push(listEntity);
		$scope.subEntitys.splice(index, 1);	
	    $scope.$apply();
	}

    $scope.deved = function(index,listEntity){
        $scope.subEntitys.push(listEntity);
        $scope.arrayMaps.splice(index, 1); 
        $scope.$apply();
    }
    
    $scope.addAllEntity = function(subEntitys){
        angular.forEach(subEntitys, function (v, i, x) {
                $scope.arrayMaps.push(v);
        });
        $scope.subEntitys=[];
        $scope.$apply();
    }
    
    $scope.deleteAllEntity = function(arrayMaps){
        $scope.tmpResult = arrayMaps;
        angular.forEach(arrayMaps, function (v, i, x) {
            $scope.subEntitys.push(v);
        });
        $scope.arrayMaps=[];
        $scope.$apply();
    }

	$scope.saveUserTrade = function (userID) {
		$scope.tmpEntity = {};
		$scope.tmpEntity.userID = userID;
		$scope.userTraderService.saveUserTrade(function (result) {
			layer.msg("设置成功",{icon:1});
			$("#traderManageMyModalEdit").modal("hide");
		},$scope.tmpEntity,$scope.arrayMaps);
	}
	
	function isActive(i){
		if(i == "0"){
			layer.msg("该交易员已经被注销！",{icon:2});
			$scope.myModalTextareaShow = false;//textarea 框
			$scope.myModalUpdateShow = false; //更新框
			$scope.myModalEditShow = false;//编辑框
			return false;
		} else {
			$scope.myModalTextareaShow = true;//textarea 框
			$scope.myModalUpdateShow = true; //更新框
			$scope.myModalEditShow = true;//编辑框
			return true;
		}
	}
	
	
	//添加单选按钮的事件集合
	
	//添加选择
	$scope.arrayMapsTem=[];	
	$scope.addSelect = function(index,listEntity){
		if(	listEntity.isSelectActive==false || listEntity.isSelectActive == undefined){
			$scope.arrayMapsTem.push(listEntity);
			listEntity.isSelectActive=true;
		}else{
			var i = $scope.arrayMapsTem.indexOf(listEntity);
			$scope.arrayMapsTem.splice(i, 1);	
			listEntity.isSelectActive=false;
		}
		
	}
	
	//删除选择
    $scope.subEntitysTem=[];	
	$scope.devedSelect = function(index,listEntity){
		if(listEntity.isSelectActive==false || listEntity.isSelectActive == undefined){
			$scope.subEntitysTem.push(listEntity);
			listEntity.isSelectActive=true;
		}else{
			var i = $scope.subEntitysTem.indexOf(listEntity);
			$scope.subEntitysTem.splice(i, 1);	
			listEntity.isSelectActive=false;
		}
		
	}
	//添加选择 移动  单个 > 按钮事件
	$scope.addSelectEntity = function(){
        angular.forEach($scope.arrayMapsTem, function (v, i, x) {
        	var index = $scope.subEntitys.indexOf(v);
        	$scope.subEntitys[index].isSelectActive=false;
			$scope.subEntitys.splice(index, 1);
            $scope.arrayMaps.push(v);
        });
        $scope.arrayMapsTem=[];
    }
	
	//删除选择 移动  单个 < 按钮事件
	$scope.deleteSelectEntity = function(){
        angular.forEach($scope.subEntitysTem, function (v, i, x) {
        	var index = $scope.arrayMaps.indexOf(v);
        	$scope.arrayMaps[index].isSelectActive=false;
			$scope.arrayMaps.splice(index, 1);
            $scope.subEntitys.push(v);
        });
        $scope.subEntitysTem=[];
    }
});
