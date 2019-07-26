myapp.controller('OperationalManage', function ($scope, $timeout) {

	$scope.tradeUserService = new com.quantdo.orgClear.service.TradeUserService();
	$scope.subCapitalAccountService = new com.quantdo.orgClear.service.SubCapitalAccountService();
	$scope.capitalAccountService = new com.quantdo.orgClear.service.CapitalAccountService();
	$scope.userTraderService = new com.quantdo.orgClear.service.UserTraderService();


	$scope.tradeUserTypes = clearConstant.tradeUserTypes;
	$scope.ModalEntity = {};
	$scope.arrayMaps = [];
	$scope.pwdIsBlank = true;
	$scope.listEntitys = [];
	$scope.tradeUsers = [];
	$scope.myModalPwdResetShow = false;//密码重置框
	$scope.myModalUpdateShow = false; //更新框
	
	//初始化
	$scope.tradeUserService.findByUserType(function(result){
		//下拉框的值
		$scope.tradeUsers = result;
		//table的值
		$scope.listEntitys = result;
		$scope.$apply();
	},"0");

	$scope.insert = function(){
		$scope.ModalEntity = {};
		$scope.ModalEntity.userType = $scope.tradeUserTypes[0].key;
	}
	
	$scope.isBlank = function(pwd){
		if(undefined == pwd || "" == pwd.trim()){
			$scope.pwdIsBlank = true;
			return ;
		}
		$scope.pwdIsBlank = false;
	}
	
	//默认查询全部
//	$scope.tradeUserService.findTradeUserByUserId(function(result){
//		$scope.listEntitys = result;
//		$scope.$apply();
//	},userType);

	$scope.find = function(tradeUser){
		if(undefined == tradeUser){
			//初始化
			$scope.tradeUserService.findByUserType(function(result){
				//下拉框的值
				$scope.tradeUsers = result;
				//table的值
				$scope.listEntitys = result;
				$scope.$apply();
			},"0");
		} else {
			$scope.tmpEntity = {};
			$scope.tmpEntity.userID = tradeUser;
			$scope.tradeUserService.findTradeUserByUserId(function(result){
				$scope.listEntitys = result;
				$scope.$apply();
			},$scope.tmpEntity);
		}
	};

	//保存
	$scope.save = function(ModalEntity){
		if(ModalEntity.pwd.trim() != ModalEntity.password.trim()){
			layer.msg("2次输入的密码不一致。",{icon:2});
			return false;
		}
		
		if(trim(ModalEntity.userID).length <= 1){
			layer.msg("操作员代码长度必须不小于2位",{icon:2});
			return false;
		}
		ModalEntity.role="900";
		$scope.tradeUserService.save(function(result){
			layer.msg("保存成功",{icon:1});
			$scope.ModalEntity = {};
			$("#operAtionlMyModalInsert").modal("hide");
			$scope.tradeUserService.findByUserType(function(result){
				$scope.tradeUsers = result;
				$scope.listEntitys = result;
				$scope.$apply();
			},"0");
		},ModalEntity);
	}
	
	 function trim(str){ //删除左右两端的空格
	　　     return str.replace(/(^\s*)|(\s*$)/g, "");
	 }

	//修改基本信息
	$scope.update = function (entity) {
		entity.role="900";
		$scope.tradeUserService.updateByEntity(function (result) {
			layer.msg("修改成功",{icon:1});
			$scope.ModalEntity = {};
			$("#operAtionlMyModalUpdate").modal("hide");
		},entity);

	}
	
	//修改密码
	$scope.updatePwd = function (entity) {
		if(entity.pwd != entity.password){
			layer.msg("2次输入的密码不一致。",{icon:2});
			return ;
		}
		$scope.tradeUserService.updateByEntity(function (result) {
			layer.msg("修改成功",{icon:1});
			$scope.ModalEntity = {};
			$("#operAtionlMyModalPwdReset").modal("hide");
		},entity);

	}

	//编辑
	$scope.edit = function(entity){
		if(isActive(entity.isActive)){
			$scope.ModalEntity = entity;
		}
	};
	
	//密码重置
	$scope.pwdReset = function(entity){
		$scope.ModalEntity = entity;
		$scope.ModalEntity.password = undefined;
		$scope.ModalEntity.pwd = undefined;
	};


//	$scope.querySub = function(){
//		$scope.subCapitalAccountService.findAll(function (result) {
//			$scope.subEntitys = result;
//			$scope.$apply();
//		});
//	}

	//注销
	$scope.cancel = function(entity){
		layer.confirm("确定注销该操作员？",{icon:3},function(){
			$scope.tradeUserService.cancel(function (result) {
				layer.msg("注销成功",{icon:1});
				//初始化
				$scope.tradeUserService.findByUserType(function(result){
					//下拉框的值
					$scope.tradeUsers = result;
					//table的值
					$scope.listEntitys = result;
					$scope.$apply();
				},"0");
			},entity);
		});
	};

	//注销恢复
	$scope.cancelRestore = function(entity){
		layer.confirm("确定恢复该操作员？",{icon:3},function(){
			$scope.tradeUserService.cancelRestore(function (result) {
				layer.msg("恢复成功",{icon:1});
				//初始化
				$scope.tradeUserService.findByUserType(function(result){
					//下拉框的值
					$scope.tradeUsers = result;
					//table的值
					$scope.listEntitys = result;
					$scope.$apply();
				},"0");
			},entity);
		});
	};

	//删除
	$scope.remove = function(entity,index){
		layer.confirm("确定删除该操作员？",{icon:3},function(count){
			$scope.tradeUserService.remove(entity.id,function(result){
				$scope.listEntitys.splice(index, 1);
				$scope.tradeUsers = angular.copy($scope.listEntitys);
	    		$scope.$apply();   
	    		layer.close(count);
			});
		});
	}

	$scope.saveUserTrade = function (entity) {
		$scope.userTraderService.saveUserTrade(function (result) {
			layer.msg("设置成功",{icon:1});
			$("#operAtionlMyModalPwdReset").modal("hide");
		},entity,$scope.arrayMaps);
	}
	
	function isActive(i){
		if(i == "0"){
			layer.msg("该操作员已经被注销！",{icon:2});
			$scope.myModalPwdResetShow = false;//密码重置框
			$scope.myModalUpdateShow = false; //更新框
			return false;
		} else {
			$scope.myModalPwdResetShow = true;//密码重置框
			$scope.myModalUpdateShow = true; //更新框
			return true;
		}
	}
});
