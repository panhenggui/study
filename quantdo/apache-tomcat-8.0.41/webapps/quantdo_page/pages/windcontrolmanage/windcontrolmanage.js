myapp.controller('WindManage', function ($scope, $timeout) {

	$scope.tradeUserService = new com.quantdo.orgClear.service.TradeUserService();
	$scope.subCapitalAccountService = new com.quantdo.orgClear.service.SubCapitalAccountService();
	$scope.userTraderService = new com.quantdo.orgClear.service.UserTraderService
	$scope.capitalAccountService = new com.quantdo.orgClear.service.CapitalAccountService();
	$scope.traderService = new com.quantdo.orgClear.service.TraderService();
	$scope.accountGroupService = new com.quantdo.orgClear.service.AccountGroupService();
	$scope.userAccountService = new com.quantdo.orgClear.service.UserAccountService();
	$scope.userAccountGroupService = new  com.quantdo.orgClear.service.UserAccountGroupService();
	$scope.tradeUserTypes = clearConstant.tradeUserTypes;
	$scope.ModalEntity = {};
	
	$scope.clientArrayMaps = []; //客户资金账号
	$scope.groupArrayMaps = []; //资金账号组
	$scope.accountIdArrayMaps = []; //资金账号
	
	$scope.accountGroupEntitys = {};//资金账户组tab
	$scope.capitalAccountEntitys = {};//资金账号tab
	$scope.subCapitalAccountEntitys = {};//资产单元信息tab
	$scope.tradeUserEntitys = [];
	$scope.tradeUserEntity = {};
	$scope.listEntitys = {};
	
	$scope.pwdIsBlank = true; 
	$scope.flagGroup = false;//添加对应的资产单元checkbox
	$scope.flagAccountId = false;//添加对应的资产单元
	$scope.flagSubId = false; //添加对应的资金账号或资金账号组
	
	$scope.myModalTextareaShow = false;//textarea 框
	$scope.myModalUpdateShow = false; //更新框
	$scope.myModalEditShow = false;//编辑框
	
	//初始化
	$scope.tradeUserService.findByUserType(function(result){
		//下拉框的值
		$scope.tradeUsers = result;
		//table的值
		$scope.listEntitys = result;
		$scope.$apply();
	},"2");

	$scope.insert = function(){
		$scope.ModalEntity = {};
		$scope.ModalEntity.userType = $scope.tradeUserTypes[2].key;
	}
	
	//默认查询全部
//	$scope.tradeUserService.findTradeUserByUserId(function(result){
//		$scope.listEntitys = result;
//		$scope.$apply();
//	},null);

	
	$scope.isBlank = function(pwd){
		if(undefined == pwd || "" == pwd.trim()){
			$scope.pwdIsBlank = true;
			return ;
		}
		$scope.pwdIsBlank = false;
	}
	
	//账户管理设置
	$scope.editTab = function(entity){
        $scope.arrayGroupMapsTem=[];
        $scope.subGroupEntitysTem=[];
		$scope.arrayAccountMapsTem=[];
	    $scope.subAccEntitysTem=[];
        $scope.arrayClientMapsTem=[];
        $scope.subClientEntitysTem=[];
		//验证风控员是否已经注销
		if(!isActive(entity.isActive)){
//			$scope.myModalEditShow = false;
			//alert("1");
			return ;
		} 
		/*$scope.myModalEditShow = true;*///编辑框
		
		$scope.flagGroup = false;//添加对应的资产单元checkbox
		$scope.flagAccountId = false;//添加对应的资产单元
		$scope.flagSubId = false; //添加对应的资金账号或资金账号组
		
		$scope.clientArrayMaps = []; //客户资金账号
		$scope.groupArrayMaps = []; //资金账号组
		$scope.accountIdArrayMaps = []; //资金账号

		$scope.tradeUserEntitys = [];
		$scope.tradeUserEntitys.push(entity);
		$scope.tradeUserEntity.userID = $scope.tradeUserEntitys[0].userID;
		
		//资金账户组tab
		$scope.accountGroupService.findAllGroup(function (result) {
//		    $scope.accountGroupEntitys = angular.copy(result);
			$scope.accountGroupEntitys = [];
			angular.forEach(result, function (value, index, arrays) {
				if(value.isChecked == "0"){
//					$scope.flagGroup = true;
					$scope.groupArrayMaps.push(value);
//					var tmpPosition = $scope.accountGroupEntitys.indexOf(value);
//					$scope.accountGroupEntitys.splice(tmpPosition, 1); 
				}else{
					$scope.accountGroupEntitys.push(value);
				}
			});
			
			$scope.$apply();
		},entity);

		//资金账号tab
		$scope.capitalAccountService.findByAccountGroupIDIsNull(function (result) {
//		    $scope.capitalAccountEntitys =angular.copy(result);
			$scope.capitalAccountEntitys = [];
			angular.forEach(result, function (value, index, arrays) {
				if(value.isChecked == "0"){
//					$scope.flagAccountId = true;
					$scope.accountIdArrayMaps.push(value);
//					$scope.capitalAccountEntitys.splice(index, 1); 
				}else{
					$scope.capitalAccountEntitys.push(value);
				}
			});
			$scope.$apply();
		},entity);

		//资产单元信息tab
		$scope.subCapitalAccountService.findAllSubCapitalAccount(function(result){
//		    $scope.SubCapitalAccountEntitys =angular.copy(result);
		    $scope.SubCapitalAccountEntitys = [];
			angular.forEach(result, function (value, index, arrays) {
				if(value.isChecked == "0"){
//					$scope.flagSubId = true;
					$scope.clientArrayMaps.push(value);
//					$scope.SubCapitalAccountEntitys.splice(index, 1);
				}else{
					$scope.SubCapitalAccountEntitys.push(value);
				}
			});
			$scope.$apply();
		},entity);
		
		
		
	}

	$scope.find = function(tradeUser){
		if(undefined == tradeUser){
			$scope.tradeUserService.findByUserType(function(result){
				//下拉框的值
				$scope.tradeUsers = result;
				//table的值
				$scope.listEntitys = result;
				$scope.$apply();
			},"2");
		} else {
			$scope.entity = {};
			$scope.entity.userID = tradeUser;
			$scope.tradeUserService.findTradeUserByUserId(function(result){
				$scope.listEntitys = result;
				$scope.$apply();
			},$scope.entity);
		}
	};

	//保存
	$scope.save = function(ModalEntity){
		ModalEntity.role="303";
		if(undefined == ModalEntity.pwd || undefined == ModalEntity.password){
			layer.msg("密码不能为空！",{icon:2});
			return ;
		}
		if(ModalEntity.pwd.trim() != ModalEntity.password.trim()){
			layer.msg("2次输入的密码不一致！",{icon:2});
			return ;
		}
		$scope.tradeUserService.save(function(result){
			layer.msg("保存成功",{icon:1});
			$scope.ModalEntity = {};
			$("#windMyModalInsert").modal("hide");
			
			$scope.tradeUserService.findByUserType(function(result){
				$scope.tradeUsers = result;
				$scope.listEntitys = result;
				$scope.$apply();
			},"2");
			$scope.ModalEntity = {};
		},ModalEntity);
	}

	//修改
	$scope.update = function (entity) {
		entity.role="303";
		$scope.tradeUserService.updateByEntity(function (result) {
			layer.msg("修改成功",{icon:1});
			$scope.ModalEntity = {};
			$("#windMyModalUpdate").modal("hide");
			$scope.ModalEntity = {};
		},entity);

	}

	//编辑
	$scope.edit = function(entity){
		if(!isActive(entity.isActive)){
			$scope.myModalUpdateShow = false; //更新框
			return ;
		}
		$scope.myModalUpdateShow = true;
		$scope.ModalEntity = entity;
	};

	//textarea显示
	$scope.query = function(entity){
		if(!isActive(entity.isActive)){
			$scope.myModalTextareaShow = false;//textarea 框
			return ;
		}
		
		$scope.myModalTextareaShow = true;//textarea 框
		
		var t1 = "管理资产单元：";
		var t2 = "管理资金账号组：";
		var t3 = "管理资金账号：";
		//资金账户tab
		$scope.userAccountService.findByUserID(function(result){
			var text_3 = "";
			angular.forEach(result, function (value, index, arrays){
				text_3 += value.innerAccountID + " ";
			});
			$scope.message3 = t3 += text_3;
			//资金账号组tab
			$scope.userAccountGroupService.findByUserId(function(r){
				var text_2 = "";
				angular.forEach(r, function (value, index, arrays){
					text_2 += value.accountGroupID + " ";
				});
				$scope.message2 = t2 += text_2;
				
				//资产单元tab
				$scope.userAccountService.findByUserID(function(result){
					var text_1 = "";
					angular.forEach(result, function (value, index, arrays){
						text_1 += value.innerAccountID + " ";
					});
					$scope.message1 = t1 += text_1;
					//$scope.message = t2 + t1 + t3;
					$scope.$apply();
				},entity.userID,"2");
			},entity);
		},entity.userID,"1");
	}

	$scope.querySub = function(){
		$scope.subCapitalAccountService.findAll(function (result) {
			$scope.subEntitys = result;
			$scope.$apply();
		});
	}
	$scope.isCkick=false;
	//注销
	$scope.cancel = function(entity){
		layer.confirm("确定注销该风控员？",{icon:3},function(){
			$scope.tradeUserService.cancel(function (result) {
				layer.msg("注销成功",{icon:1});
				entity.isActive= "0";
				$scope.$apply();
//				$scope.tradeUserService.findByUserType(function(result){
//					//下拉框的值
//					$scope.tradeUsers = result;
////					//table的值
////					$scope.listEntitys = result;
//					$scope.$apply();
//				},"2");
			},entity);
			
		});
	};

	$scope.message = function(){
		layer.msg("该风控员已经被注销！",{icon:2});
	}
	
	//注销恢复
	$scope.cancelRestore = function(entity){
		layer.confirm("确定恢复该风控员？",{icon:3},function(){
			$scope.tradeUserService.cancelRestore(function (result) {
				layer.msg("恢复成功",{icon:1});
				entity.isActive = "1";
				$scope.$apply();
//				$scope.tradeUserService.findByUserType(function(result){
//					//下拉框的值
//					$scope.tradeUsers = result;
//					//table的值
//					$scope.listEntitys = result;
//					$scope.$apply();
//				},"2");
				
//				$scope.myModalTextareaShow = true;//textarea 框
//				$scope.myModalUpdateShow = true; //更新框
//				$scope.myModalEditShow = true;//编辑框
//				$("#windMyModalEditA").css("disabled:disabled");
			},entity);
		});
	};
	
	//选资金账号组时，同时添加对应的资产单元
	$scope.andAddGroup = function(falg){
		$scope.flagGroup = falg;
		//资产单元集合
		var entitys = $scope.SubCapitalAccountEntitys;
		var temEntitys = angular.copy(entitys);
		var tmp = {};
		var temArrMaps= angular.copy($scope.clientArrayMaps);
		if(falg){
			//遍历已选中资金账号组
			angular.forEach($scope.groupArrayMaps, function (gValue, gIndex, gArrays) {
				var tem =[];
				angular.forEach(entitys, function (value, index, arrays) {
					//判断资金账号组里是否存在资产单元
					if(undefined != value.accountGroupID && "" != value.accountGroupID && value.accountGroupID == gValue.accountGroupID){
						
						var i = $scope.clientArrayMaps.indexOf(entitys[index]);
						if(i == -1){
							entitys[index].isChecked = "0"; //设置选中状态
							temArrMaps.push(entitys[index]);
							tem.push(index);
						}
						/*tmp = $scope.clientArrayMaps[gIndex];
						if(undefined == tmp && tmp.length == 0){
							entitys[index].isChecked = "0"; //设置选中状态
							$scope.clientArrayMaps.push(entitys[index]);
						} else if(tmp.subAccountID == value.subAccountID && value.isChecked != "0"){
							entitys[index].isChecked = "0"; //设置选中状态
							$scope.clientArrayMaps.push(entitys[index]);
						} */
					}
				});
				for (var j=1;tem.length>=j;j++) {
					temEntitys.splice(tem[tem.length-j], 1);
				}
			});
		} else {
		/*	var tem =[];
			angular.forEach($scope.groupArrayMaps, function (gValue, gIndex, gArrays) {
				angular.forEach(entitys, function (value, index, arrays) {
					//判断资金账号组里是否存在资产单元
					if(undefined != value.accountGroupID && value.accountGroupID == gValue.accountGroupID){
						entitys[index].isChecked = "1"; //设置未选中状态
						var i = $scope.clientArrayMaps.indexOf(entitys[index]);
						temEntitys.push(entitys[index]);
						tem.push(index);
					}
				});
			});
			for (var j=1;tem.length>=j;j++) {
				temArrMaps.splice(tem[tem.length-j], 1);
			}*/
		}
		$scope.SubCapitalAccountEntitys = [];
		$scope.SubCapitalAccountEntitys = temEntitys;
		$scope.clientArrayMaps=[];
		$scope.clientArrayMaps=temArrMaps;
	};
	
	
	//选资金账号时，同时勾选资产单元
	$scope.andAddAccount = function(falg){
		$scope.flagAccountId = falg;
		var entitys = $scope.SubCapitalAccountEntitys;
		var temEntitys = angular.copy(entitys);
		var temArrMaps= angular.copy($scope.clientArrayMaps);
		if(falg){
			//资产单元集合
			var tem =[];
			angular.forEach($scope.accountIdArrayMaps, function (gValue, gIndex, gArrays) {
				angular.forEach(entitys, function (value, index, arrays) {
					//判断资金账号组里是否存在资产单元
					if(undefined != value.innerAccountID && value.innerAccountID == gValue.innerAccountID){
						
						var i = $scope.clientArrayMaps.indexOf(entitys[index]);
						if(i == -1){
							entitys[index].isChecked = "0"; //设置选中状态
							temArrMaps.push(entitys[index]);
							tem.push(index);
						}
//						var tmp = $scope.accountIdArrayMaps[gIndex];
//						if(undefined == tmp && tmp.length == 0){
//							entitys[index].isChecked = "0"; //设置选中状态
//							$scope.clientArrayMaps.push(entitys[index]);
//						} else if(tmp.subAccountID != value.subAccountID && value.isChecked == "1"){
//							entitys[index].isChecked = "0"; //设置选中状态
//							$scope.clientArrayMaps.push(entitys[index]);
//						}
					}
				});
			});
			for (var j=1;tem.length>=j;j++) {
				temEntitys.splice(tem[tem.length-j], 1);
			}
		} else {
			/*var tem =[];
			angular.forEach($scope.accountIdArrayMaps, function (gValue, gIndex, gArrays) {
				angular.forEach(entitys, function (value, index, arrays) {
					//判断资金账号组里是否存在资产单元
					if(undefined != value.innerAccountID && value.innerAccountID == gValue.innerAccountID && value.isChecked == "0"){
						entitys[index].isChecked = "1"; //设置未选中状态
						var index = $scope.clientArrayMaps.indexOf(entitys[index]);
						temEntitys.push(entitys[index]);
						tem.push(index);
					}
				});
			});
			for (var j=1;tem.length>=j;j++) {
				temArrMaps.splice(tem[tem.length-j], 1);
			}*/
		}
		$scope.SubCapitalAccountEntitys = [];
		$scope.SubCapitalAccountEntitys = temEntitys;
		$scope.clientArrayMaps=[];
		$scope.clientArrayMaps=temArrMaps;
		
	};
	
	//选中‘同时添加对应的资金账号或资金账号组’时，自动勾选对应的资金账号或资金账号组
	$scope.andAddsub = function(falg){
		$scope.flagSubId = falg;
		//已经选中的资产单元集合
		var entitys = $scope.clientArrayMaps;
		//资金账号
		var captalEntitys = $scope.capitalAccountEntitys;
		var temCaptalEntitys = angular.copy(captalEntitys);
		//资金账号组
		var groupEntity = $scope.accountGroupEntitys;
		var temGroupEntity = angular.copy(groupEntity);
		
		
		//已选中资金账号
		var temAccArrayMaps= angular.copy($scope.accountIdArrayMaps);
		//已选中资金账号组
		var temGroupArrayMaps =angular.copy($scope.groupArrayMaps);
		
		if(falg){
			angular.forEach(entitys, function (value, index, arrays) {
				//资产单元的资金账号组为空的情况下
				if(undefined == value.accountGroupID || "" == value.accountGroupID){
					//遍历资金账号
					var tem =[];
					angular.forEach(captalEntitys, function (cValue, cIndex, cArrays) {
						if(value.innerAccountID == cValue.innerAccountID){
							captalEntitys[cIndex].isChecked = "0";
							$scope.accountIdArrayMaps.push(cValue);
							tem.push(cIndex);
							$scope.$apply();
						}
					});
					for (var j=1;tem.length>=j;j++) {
						temCaptalEntitys.splice(tem[tem.length-j], 1);
					}
					
					$scope.capitalAccountEntitys=temCaptalEntitys;
				} else if(undefined == value.innerAccountID || "" == value.innerAccountID){
					//遍历资金账号组
					var tem =[];
					angular.forEach(groupEntity, function (gValue, gIndex, gArrays) {
						if(value.accountGroupID == gValue.accountGroupID){
							groupEntity[gIndex].isChecked = "0";
							$scope.groupArrayMaps.push(gValue);
							tem.push(gIndex);
							$scope.$apply();
						}
					});
					
					for (var j=1;tem.length>=j;j++) {
						temGroupEntity.splice(tem[tem.length-j], 1);
					}
					 $scope.accountGroupEntitys=temGroupEntity;
				}
			});
		} else {
			/*angular.forEach(entitys, function (value, index, arrays) {
				//资产单元的资金账号组为空的情况下
				if(undefined != value.accountGroupID && "" != value.accountGroupID){
					
					//遍历资金账号组
					var tem =[];
					angular.forEach(temGroupArrayMaps, function (gValue, gIndex, gArrays) {
						if(value.innerAccountID == gValue.innerAccountID ){
							groupEntity[gIndex].isChecked = "1";
							var i = $scope.groupArrayMaps.indexOf(groupEntity[index]);
							//$scope.groupArrayMaps.splice(i, 1);
							tem.push(i);
							 $scope.accountGroupEntitys.push(gValue);
						}
					});
					for (var j=1;tem.length>=j;j++) {
						temGroupArrayMaps.splice(tem[tem.length-j], 1);
					}
					$scope.groupArrayMaps=temGroupArrayMaps;
					
				} else if(undefined != value.innerAccountID && "" != value.innerAccountID){
					//遍历资金账号
					var tem =[];
					angular.forEach(temAccArrayMaps, function (cValue, cIndex, cArrays) {
						if(value.innerAccountID == cValue.innerAccountID ){
							captalEntitys[cIndex].isChecked = "1";
							var i = $scope.accountIdArrayMaps.indexOf(captalEntitys[index]);
							//$scope.accountIdArrayMaps.splice(i, 1);
							 tem.push(i);
							 $scope.capitalAccountEntitys.push(cValue);
						}
						
					});
					for (var j=1;tem.length>=j;j++) {
						temAccArrayMaps.splice(tem[tem.length-j], 1);
					}
					$scope.accountIdArrayMaps = temAccArrayMaps;
				}
			});*/
		}
		
	};
	
	//资金账号组添加选中
	$scope.addGroup = function(flag,listEntity){
		//资产单元集合
		var entitys = $scope.SubCapitalAccountEntitys;
	    var tmpEntitys = angular.copy(entitys);
		//资金账号组集合
		var groupEntitys = $scope.accountGroupEntitys;
		var tmpGroupEntitys =angular.copy(groupEntitys);
		$scope.groupArrayMaps.push(listEntity);
		//资金账号组集合
		angular.forEach(groupEntitys, function (value, index, arrays) {
			//判断资金账号组里是否存在资产单元
			if(value.accountGroupID == listEntity.accountGroupID){
				groupEntitys[index].isChecked = "0"; //设置选中状态
				tmpGroupEntitys.splice(index, 1);
			}
		});
		if($scope.flagGroup){
			//遍历资产单元
			var tem =[];
			angular.forEach(entitys, function (value, index, arrays) {
				//判断资金账号组里是否存在资产单元
				if(undefined != value.accountGroupID && value.accountGroupID == listEntity.accountGroupID){
					entitys[index].isChecked = "0"; //设置选中状态
					$scope.clientArrayMaps.push(entitys[index]);
					//tmpEntitys.splice(index, 1);
					tem.push(index);
				}
			});	
			
			for (var j=1;tem.length>=j;j++) {
				tmpEntitys.splice(tem[tem.length-j], 1);
			}
		}

		$scope.SubCapitalAccountEntitys = {};
		$scope.accountGroupEntitys = tmpGroupEntitys;
		$scope.SubCapitalAccountEntitys = tmpEntitys;
	}
	//资金账号组全添加
	$scope.addAllGroupEntity = function(listEntitys){
	    //资产单元集合
        var entitys = $scope.SubCapitalAccountEntitys;
        var tmpEntitys = angular.copy(entitys);
        angular.forEach(listEntitys, function (groupEntity, index, x) {
            $scope.groupArrayMaps.push(groupEntity);
            if($scope.flagGroup){
                //遍历资产单元
            	var tem =[];
                angular.forEach(entitys, function (value, index, arrays) {
                    //判断资金账号组里是否存在资产单元
                    if(undefined != value.accountGroupID && value.accountGroupID == groupEntity.accountGroupID){
                        entitys[index].isChecked = "0"; //设置选中状态
                        $scope.clientArrayMaps.push(entitys[index]);
                        //tmpEntitys.splice(index, 1);
                        tem.push(index);
                    }
                });
            	for (var j=1;tem.length>=j;j++) {
    				tmpEntitys.splice(tem[tem.length-j], 1);
    			}
            }
        });
        $scope.SubCapitalAccountEntitys = [];
        $scope.accountGroupEntitys = [];
        $scope.SubCapitalAccountEntitys = tmpEntitys;
        //$scope.$apply();
	}

	//资金账号组删除选中
    $scope.devedGroup = function(flag,listEntity){
        //资产单元集合
        var entitys = $scope.clientArrayMaps;
        var tmpEntitys = angular.copy(entitys);
        //资金账号组集合
        var groupEntitys = $scope.groupArrayMaps;
        var index = $scope.groupArrayMaps.indexOf(listEntity);
        $scope.groupArrayMaps.splice(index, 1);
        $scope.accountGroupEntitys.push(listEntity);
        if($scope.flagGroup){
            //var entitys = $scope.SubCapitalAccountEntitys;
            //遍历资产单元
        	var tem =[];
            angular.forEach(entitys, function (value, index, arrays) {
                //判断该组里面是否有对应的资产单元和该资产单元的选中状态为已选中
                if(undefined != value.accountGroupID && value.accountGroupID == listEntity.accountGroupID){
                    var i = $scope.clientArrayMaps.indexOf(entitys[index]);
                    tem.push(i);
                    $scope.SubCapitalAccountEntitys.push(value);
                  
                }
            });
            for (var j=1;tem.length>=j;j++) {
				tmpEntitys.splice(tem[tem.length-j], 1);
			}
        }
        $scope.clientArrayMaps=tmpEntitys;
       // $scope.$apply();
    }
    //资金账号组全删除
    $scope.deleteAllGroupEntity= function(listEntitys){
        //资产单元集合
        var entitys = $scope.clientArrayMaps;
        var tmpEntitys = angular.copy(entitys);
        angular.forEach(listEntitys, function (groupEntity, index, x) {
            $scope.accountGroupEntitys.push(groupEntity);
            if($scope.flagGroup){
                //var entitys = $scope.SubCapitalAccountEntitys;
                //遍历资产单元
            	var tem =[];
                angular.forEach(entitys, function (value, index, arrays) {
                    //判断该组里面是否有对应的资产单元和该资产单元的选中状态为已选中
                    if(undefined != value.accountGroupID && value.accountGroupID == groupEntity.accountGroupID){
                        var i = $scope.clientArrayMaps.indexOf(entitys[index]);
                        tem.push(i);
                        $scope.SubCapitalAccountEntitys.push(value);
                    }
                });
                for (var j=1;tem.length>=j;j++) {
    				tmpEntitys.splice(tem[tem.length-j], 1);
    			}
            }
        });
        $scope.groupArrayMaps=[];
        $scope.clientArrayMaps=tmpEntitys;
       // $scope.$apply();
    }

  //资金账号选中
	$scope.addAccountId = function(falg,listEntity){
		var entitys = $scope.SubCapitalAccountEntitys;
		var tmpEntitys = angular.copy(entitys);
		var capitalEntitys = $scope.capitalAccountEntitys;
		var tmpCapitalEntitys = angular.copy(capitalEntitys);
		$scope.accountIdArrayMaps.push(listEntity);
		//资金账号集合
		angular.forEach(capitalEntitys, function (value, index, arrays) {
			//判断分组中是否存在资产单元
			if(value.innerAccountID == listEntity.innerAccountID){
				capitalEntitys[index].isChecked = "0"; //设置选中状态
				tmpCapitalEntitys.splice(index, 1);
			}
		});
		
		if($scope.flagAccountId){
			//遍历资产单元
			var tem=[];
			angular.forEach(entitys, function (value, index, arrays) {
				//判断分组中是否存在资产单元
				if(undefined != value.innerAccountID && value.innerAccountID == listEntity.innerAccountID){
					entitys[index].isChecked = "0"; //设置选中状态
					$scope.clientArrayMaps.push(value);
					//tmpEntitys.splice(index, 1);
					  tem.push(index);
				}
			});
			 for (var j=1;tem.length>=j;j++) {
 				tmpEntitys.splice(tem[tem.length-j], 1);
 			}
		}
		$scope.SubCapitalAccountEntitys = [];
		$scope.capitalAccountEntitys = tmpCapitalEntitys;
		$scope.SubCapitalAccountEntitys = tmpEntitys;
		//$scope.$apply();
	}
	 //资金账号全添加
    $scope.addAllAccountEntity = function(listEntitys){
        //资产单元集合
        var entitys = $scope.SubCapitalAccountEntitys;
        var tmpEntitys =angular.copy(entitys);
        angular.forEach(listEntitys, function (listEntity, index, x) {
            $scope.accountIdArrayMaps.push(listEntity);
            if($scope.flagAccountId){
                //遍历资产单元
            	var tem=[];
                angular.forEach(entitys, function (value, index, arrays) {
                    //判断分组中是否存在资产单元
                    if(undefined != value.innerAccountID && value.innerAccountID == listEntity.innerAccountID){
                        entitys[index].isChecked = "0"; //设置选中状态
                        $scope.clientArrayMaps.push(value);
                        //tmpEntitys.splice(index, 1);
                        tem.push(index);
                    }
                });
                for (var j=1;tem.length>=j;j++) {
     				tmpEntitys.splice(tem[tem.length-j], 1);
     			}
            }
        });
        $scope.SubCapitalAccountEntitys = [];
        $scope.capitalAccountEntitys =[];
        $scope.SubCapitalAccountEntitys = tmpEntitys;
       // $scope.$apply();
    }


  //资金账号取消选中
    $scope.devedAccountId = function(falg,listEntity){
        var entitys = $scope.clientArrayMaps;
        
        var tmpEntitys = angular.copy(entitys);
        var index = $scope.accountIdArrayMaps.indexOf(listEntity);
        $scope.accountIdArrayMaps.splice(index, 1);
        $scope.capitalAccountEntitys.push(listEntity);
        if($scope.flagAccountId){
            //遍历资产单元
        	var tem=[];
            angular.forEach(entitys, function (value, index, arrays) {
                //判断该组里面是否有对应的资产单元和该资产单元的选中状态为已选中
                if(undefined != value.innerAccountID && "" != value.innerAccountID){
                    if(listEntity.innerAccountID == value.innerAccountID){
                        entitys[index].isChecked = "1"; //设置未选中状态
                        var i = $scope.clientArrayMaps.indexOf(entitys[index]);
                       // tmpEntitys.splice(i, 1);
                        tem.push(i);
                        $scope.SubCapitalAccountEntitys.push(value);
                    }
                }
            });
            for (var j=1;tem.length>=j;j++) {
 				tmpEntitys.splice(tem[tem.length-j], 1);
 			}
        }
        $scope.clientArrayMaps=tmpEntitys;
        //$scope.$apply();
    }
    //资金账号删除全部
    $scope.deleteAllAccountEntity = function (listEntitys){
        var entitys = $scope.clientArrayMaps;
        var tmpEntitys =angular.copy(entitys);
        angular.forEach(listEntitys, function (arrayMap, index, x) {
            $scope.capitalAccountEntitys.push(arrayMap);
            if($scope.flagAccountId){
                //遍历资产单元
            	var tem=[];
                angular.forEach(entitys, function (value, index, arrays) {
                    //判断该组里面是否有对应的资产单元和该资产单元的选中状态为已选中
                    if(undefined != value.innerAccountID && "" != value.innerAccountID){
                        if(arrayMap.innerAccountID == value.innerAccountID){
                           entitys[index].isChecked = "1"; //设置未选中状态
                            var i = $scope.clientArrayMaps.indexOf(entitys[index]);
                           // tmpEntitys.splice(i, 1);
                            tem.push(i);
                            $scope.SubCapitalAccountEntitys.push(value);
                        }
                    }
                });
                for (var j=1;tem.length>=j;j++) {
     				tmpEntitys.splice(tem[tem.length-j], 1);
     			}
            }
        });
        $scope.clientArrayMaps=tmpEntitys;
        $scope.accountIdArrayMaps=[];
    }

  //资产单元选中事件
	$scope.addClient = function(falg,listEntity){
		//资产单元集合
		var entitys = $scope.SubCapitalAccountEntitys;
		//资金账号
		var captalEntitys = $scope.capitalAccountEntitys;
		var tmpCaptalEntitys=angular.copy(captalEntitys); 
		//资金账号组
		var groupEntitys = $scope.accountGroupEntitys;
		var tmpGroupEntitys=angular.copy(groupEntitys); 
		
		$scope.clientArrayMaps.push(listEntity);
		
		angular.forEach(entitys, function (value, index, arrays) {
			if(listEntity.subAccountID == value.subAccountID){
			    $scope.SubCapitalAccountEntitys.splice(index, 1);
			}
		});
		
		if($scope.flagSubId){
			if(undefined != listEntity.innerAccountID && "" != listEntity.innerAccountID.trim()){
				//遍历资金账号
				var tem=[];
				angular.forEach(captalEntitys, function (cValue, cIndex, cArrays) {
					if(listEntity.innerAccountID == cValue.innerAccountID){
						captalEntitys[cIndex].isChecked = "0";
						//tmpCaptalEntitys.splice(cIndex, 1);
						   tem.push(cIndex);
						var i = $scope.accountIdArrayMaps.indexOf(captalEntitys[cIndex]);
						if(i == -1){
							$scope.accountIdArrayMaps.push(captalEntitys[cIndex]);
						}
					}
				});
				for (var j=1;tem.length>=j;j++) {
					tmpCaptalEntitys.splice(tem[tem.length-j], 1);
     			}
				
			} else if(undefined != listEntity.accountGroupID && "" != listEntity.accountGroupID.trim()){
				//遍历资金账号组
				var tem=[];
				angular.forEach(groupEntitys, function (gValue, gIndex, gArrays) {
					if(listEntity.accountGroupID == gValue.accountGroupID){
						groupEntitys[gIndex].isChecked = "0";
						//tmpGroupEntitys.splice(gIndex, 1);
						 tem.push(gIndex);
						var i = $scope.groupArrayMaps.indexOf(groupEntitys[gIndex]);
						if(i == -1){
							$scope.groupArrayMaps.push(groupEntitys[gIndex]);
						}
					}
				});	
				for (var j=1;tem.length>=j;j++) {
					tmpGroupEntitys.splice(tem[tem.length-j], 1);
     			}
			}
		}
		//console.log(tmpGroupEntitys);
		$scope.accountGroupEntitys = tmpGroupEntitys;
		$scope.capitalAccountEntitys = tmpCaptalEntitys;
		//$scope.$apply();
	}
	
	//资产单元全选
	 $scope.addAllSubAccountEntity = function(listEntitys){
	        //资金账号
	        var captalEntitys = $scope.capitalAccountEntitys;
	        var tmpCaptalEntitys=angular.copy(captalEntitys); 
	        //资金账号组
	        var groupEntitys = $scope.accountGroupEntitys;
	        var tmpGroupEntitys=angular.copy(groupEntitys); 
	        angular.forEach(listEntitys, function (listEntity, index, arrays) {
	            $scope.clientArrayMaps.push(listEntity);
	            if($scope.flagSubId){
	                if(undefined != listEntity.innerAccountID && "" != listEntity.innerAccountID.trim()){
	                    //遍历资金账号
	                	var tem =[];
	                    angular.forEach(captalEntitys, function (cValue, cIndex, cArrays) {
	                        if(listEntity.innerAccountID == cValue.innerAccountID){
	                            captalEntitys[cIndex].isChecked = "0";
	                            //tmpCaptalEntitys.splice(cIndex, 1);
	                            tem.push(cIndex);
	                            var i = $scope.accountIdArrayMaps.indexOf(captalEntitys[cIndex]);
	                            if(i == -1){
	                                $scope.accountIdArrayMaps.push(captalEntitys[cIndex]);
	                            }
	                        }
	                    });
	                    for (var j=1;tem.length>=j;j++) {
	                    	tmpCaptalEntitys.splice(tem[tem.length-j], 1);
	         			}
	                } else if(undefined != listEntity.accountGroupID && "" != listEntity.accountGroupID.trim()){
	                    //遍历资金账号组
	                	var tem =[];
	                    angular.forEach(groupEntitys, function (gValue, gIndex, gArrays) {
	                        if(listEntity.accountGroupID == gValue.accountGroupID){
	                            groupEntitys[gIndex].isChecked = "0";
	                           // tmpGroupEntitys.splice(gIndex, 1);
	                            tem.push(gIndex);
	                            var i = $scope.groupArrayMaps.indexOf(groupEntitys[gIndex]);
	                            if(i == -1){
	                                $scope.groupArrayMaps.push(groupEntitys[gIndex]);
	                            }
	                        }
	                    }); 
	                    for (var j=1;tem.length>=j;j++) {
	                    	tmpGroupEntitys.splice(tem[tem.length-j], 1);
	         			}
	                }
	            }
	        });
	        //console.log(tmpGroupEntitys);
	        $scope.accountGroupEntitys = tmpGroupEntitys;
	        $scope.capitalAccountEntitys = tmpCaptalEntitys;
	        $scope.SubCapitalAccountEntitys=[];
	       // $scope.$apply();
	 }
	
	 //资产单元取消事件
	    $scope.devedClient = function(falg,listEntity){
	        //资产单元集合
	        var entitys = $scope.clientArrayMaps;
	        //资金账号
	        var captalEntitys = $scope.accountIdArrayMaps;
	        var tmpCaptalEntitys=angular.copy(captalEntitys); 
	        //资金账号组
	        var groupEntitys = $scope.groupArrayMaps;
	        var tmpGroupEntitys=angular.copy(groupEntitys); 
	        var index = $scope.clientArrayMaps.indexOf(listEntity);
	        $scope.clientArrayMaps.splice(index, 1);
	        $scope.SubCapitalAccountEntitys.push(listEntity);

	        if($scope.flagSubId){
	            var tmpCapCount = 0;
	            var tmpGroupCount = 0;
	            
	            //遍历已经选中的资产单元
	            angular.forEach($scope.clientArrayMaps, function (value, index, arrays) {
	                 if(value.innerAccountID != undefined && listEntity.innerAccountID == value.innerAccountID){
	                     tmpCapCount ++ ;
	                 } else if(value.accountGroupID != undefined && value.accountGroupID == listEntity.accountGroupID){
	                     tmpGroupCount ++ ;
	                 }
	            });
	            //
	            if(tmpCapCount == 0){
	            	var tem =[];
	                angular.forEach(captalEntitys, function (value, index, arrays) {
	                     if(value.innerAccountID == listEntity.innerAccountID){
	                         captalEntitys[index].isChecked = "1";
	                         $scope.capitalAccountEntitys.push(value);
	                         var i = $scope.accountIdArrayMaps.indexOf(captalEntitys[index]);
	                        // tmpCaptalEntitys.splice(i, 1);
	                         tem.push(i);
	                         $scope.$apply();
	                     }
	                });
	                for (var j=1;tem.length>=j;j++) {
	                	tmpCaptalEntitys.splice(tem[tem.length-j], 1);
         			}
	            }
	            
	            if(tmpGroupCount == 0){
	            	var tem =[];
	                angular.forEach(groupEntitys, function (value, index, arrays) {
	                     if(value.accountGroupID == listEntity.accountGroupID){
	                         groupEntitys[index].isChecked = "1";
	                         $scope.accountGroupEntitys.push(value);
	                         var i = $scope.groupArrayMaps.indexOf(groupEntitys[index]);
	                         tem.push(i);
	                        // tmpGroupEntitys.splice(i, 1);
	                         $scope.$apply();
	                     }
	                });
	                for (var j=1;tem.length>=j;j++) {
	                	tmpGroupEntitys.splice(tem[tem.length-j], 1);
         			}
	            }
	        }
	        $scope.groupArrayMaps=tmpGroupEntitys;
	        $scope.accountIdArrayMaps=tmpCaptalEntitys;
	       // $scope.$apply();
	    }
	  //资产单元全取消事件
	    $scope.deleteAllSubAccountEntity = function(listEntitys){
	        //资金账号
	        var captalEntitys = $scope.accountIdArrayMaps;
	        var tmpCaptalEntitys=angular.copy(captalEntitys); 
	        //资金账号组
	        var groupEntitys = $scope.groupArrayMaps;
	        var tmpGroupEntitys=angular.copy(groupEntitys); 
	        
	        

	        angular.forEach(listEntitys, function (listEntity, index, arrays) {
	            $scope.SubCapitalAccountEntitys.push(listEntity);
	            if($scope.flagSubId){
	                var tmpCapCount = 0;
	                var tmpGroupCount = 0;
	                
	                //遍历已经选中的资产单元
	                angular.forEach($scope.clientArrayMaps, function (value, index, arrays) {
	                     if(value.innerAccountID != undefined && listEntity.innerAccountID == value.innerAccountID){
	                         tmpCapCount ++ ;
	                     } else if(value.accountGroupID != undefined && value.accountGroupID == listEntity.accountGroupID){
	                         tmpGroupCount ++ ;
	                     }
	                });
	                //
	                if(tmpCapCount == 0){
	                	var tem =[];
	                    angular.forEach(captalEntitys, function (value, index, arrays) {
	                         if(value.innerAccountID == listEntity.innerAccountID){
	                             captalEntitys[index].isChecked = "1";
	                             $scope.capitalAccountEntitys.push(value);
	                             var i = $scope.accountIdArrayMaps.indexOf(captalEntitys[index]);
	                            // tmpCaptalEntitys.splice(i, 1);
	                             tem.push(i);
	                             $scope.$apply();
	                         }
	                    });
	                    for (var j=1;tem.length>=j;j++) {
	                    	tmpCaptalEntitys.splice(tem[tem.length-j], 1);
	         			}
	                }
	                
	                if(tmpGroupCount == 0){
	                	var tem =[];
	                    angular.forEach(groupEntitys, function (value, index, arrays) {
	                         if(value.accountGroupID == listEntity.accountGroupID){
	                             groupEntitys[index].isChecked = "1";
	                             $scope.accountGroupEntitys.push(value);
	                             var i = $scope.groupArrayMaps.indexOf(groupEntitys[index]);
	                             //tmpGroupEntitys.splice(i, 1);
	                             tem.push(i);
	                             $scope.$apply();
	                         }
	                    });
	                    for (var j=1;tem.length>=j;j++) {
	                    	tmpGroupEntitys.splice(tem[tem.length-j], 1);
	         			}
	                }
	            }
	            $scope.accountIdArrayMaps=tmpCaptalEntitys;
	            $scope.groupArrayMaps=tmpGroupEntitys;
	        });
	        $scope.clientArrayMaps=[];
	       // $scope.$apply();
	    }

	$scope.saveSetting = function (entity) {
		$scope.userTraderService.saveSetting(function (result) {
			layer.msg("设置成功",{icon:1});
			
			$("#windMyModalUpdate").modal("hide");
			$("#windMyModalInsert").modal("hide");
			$("#windMyModalEdit").modal("hide");
			
		},entity,$scope.groupArrayMaps,$scope.accountIdArrayMaps,$scope.clientArrayMaps);
	}
	function isActive(i){
		if(i == "0"){
			layer.msg("该风控员已经被注销！",{icon:2});
			$("#dEditTable").attr("style","display:none;");
//			$scope.myModalTextareaShow = false;//textarea 框
//			$scope.myModalUpdateShow = false; //更新框
//			$scope.myModalEditShow = false;//编辑框
			return false;
		} else {
			$("#dEditTable").attr("style","display:block;");
//			$scope.myModalTextareaShow = true;//textarea 框
//			$scope.myModalUpdateShow = true; //更新框
//			$scope.myModalEditShow = true;//编辑框
			return true;
		}
	}
	
	
//添加单选按钮的事件集合
	
	//添加组选择
	$scope.arrayGroupMapsTem=[];	
	$scope.addGroupSelect = function(index,alistEntity){
		if(	alistEntity.isSelectActive==false || alistEntity.isSelectActive == undefined){
			$scope.arrayGroupMapsTem.push(alistEntity);
			alistEntity.isSelectActive=true;
		}else{
			var i = $scope.arrayGroupMapsTem.indexOf(alistEntity);
			$scope.arrayGroupMapsTem.splice(i, 1);	
			alistEntity.isSelectActive=false;
		}
		
	}
	
	//删除组选择
    $scope.subGroupEntitysTem=[];	
	$scope.devedGroupSelect = function(index,listEntity){
		if(listEntity.isSelectActive==false || listEntity.isSelectActive == undefined){
			$scope.subGroupEntitysTem.push(listEntity);
			listEntity.isSelectActive=true;
		}else{
			var i = $scope.subGroupEntitysTem.indexOf(listEntity);
			$scope.subGroupEntitysTem.splice(i, 1);	
			listEntity.isSelectActive=false;
		}
		
	}
	//添加组选择 移动  单个 > 按钮事件
	$scope.addSelectGroupEntity = function(){
        angular.forEach($scope.arrayGroupMapsTem, function (v, i, x) {
        	var index = $scope.accountGroupEntitys.indexOf(v);
        	$scope.accountGroupEntitys[index].isSelectActive=false;
			$scope.accountGroupEntitys.splice(index, 1);
            $scope.groupArrayMaps.push(v);
        });
        $scope.arrayGroupMapsTem=[];
    }
	
	//删除组选择 移动  单个 < 按钮事件
	$scope.deleteSelectGroupEntity = function(){
        angular.forEach($scope.subGroupEntitysTem, function (v, i, x) {
        	var index = $scope.groupArrayMaps.indexOf(v);
        	$scope.groupArrayMaps[index].isSelectActive=false;
			$scope.groupArrayMaps.splice(index, 1);
            $scope.accountGroupEntitys.push(v);
        });
        $scope.subGroupEntitysTem=[];
    }
	
	
	// ****************** 资金账号  单选按钮*********************
	//添加资金账号选择
	$scope.arrayAccountMapsTem=[];	
	$scope.addAccountSelect = function(index,alistEntity){
		if(	alistEntity.isSelectActive==false || alistEntity.isSelectActive == undefined){
			$scope.arrayAccountMapsTem.push(alistEntity);
			alistEntity.isSelectActive=true;
		}else{
			var i = $scope.arrayAccountMapsTem.indexOf(alistEntity);
			$scope.arrayAccountMapsTem.splice(i, 1);	
			alistEntity.isSelectActive=false;
		}
		
	}
	
	//删除资金账号选择
    $scope.subAccEntitysTem=[];	
	$scope.devedAccountSelect = function(index,listEntity){
		if(listEntity.isSelectActive==false || listEntity.isSelectActive == undefined){
			$scope.subAccEntitysTem.push(listEntity);
			listEntity.isSelectActive=true;
		}else{
			var i = $scope.subAccEntitysTem.indexOf(listEntity);
			$scope.subAccEntitysTem.splice(i, 1);	
			listEntity.isSelectActive=false;
		}
		
	}
	//添加资金账号选择 移动  单个 > 按钮事件
	$scope.addSelectAccountEntity = function(){
        angular.forEach($scope.arrayAccountMapsTem, function (v, i, x) {
        	var index = $scope.capitalAccountEntitys.indexOf(v);
        	$scope.capitalAccountEntitys[index].isSelectActive=false;
			$scope.capitalAccountEntitys.splice(index, 1);
            $scope.accountIdArrayMaps.push(v);
        });
        $scope.arrayAccountMapsTem=[];
    }
	
	//删除资金账号选择 移动  单个 < 按钮事件
	$scope.deleteSelectAccountEntity = function(){
        angular.forEach($scope.subAccEntitysTem, function (v, i, x) {
        	var index = $scope.accountIdArrayMaps.indexOf(v);
        	$scope.accountIdArrayMaps[index].isSelectActive=false;
			$scope.accountIdArrayMaps.splice(index, 1);
            $scope.capitalAccountEntitys.push(v);
        });
        $scope.subAccEntitysTem=[];
    }
	
	// ****************** 资产单元  单选按钮*********************
	//添加资产单元选择
	$scope.arrayClientMapsTem=[];	
	$scope.addClientSelect = function(index,alistEntity){
		if(	alistEntity.isSelectActive==false || alistEntity.isSelectActive == undefined){
			$scope.arrayClientMapsTem.push(alistEntity);
			alistEntity.isSelectActive=true;
		}else{
			var i = $scope.arrayClientMapsTem.indexOf(alistEntity);
			$scope.arrayClientMapsTem.splice(i, 1);	
			alistEntity.isSelectActive=false;
		}
		
	}
	
	//删除资产单元选择
    $scope.subClientEntitysTem=[];	
	$scope.devedClientSelect = function(index,listEntity){
		if(listEntity.isSelectActive==false || listEntity.isSelectActive == undefined){
			$scope.subClientEntitysTem.push(listEntity);
			listEntity.isSelectActive=true;
		}else{
			var i = $scope.subClientEntitysTem.indexOf(listEntity);
			$scope.subClientEntitysTem.splice(i, 1);	
			listEntity.isSelectActive=false;
		}
		
	}
	//添加资产单元选择 移动  单个 > 按钮事件
	$scope.addSelectSubAccountEntity = function(){
        angular.forEach($scope.arrayClientMapsTem, function (v, i, x) {
        	var index = $scope.SubCapitalAccountEntitys.indexOf(v);
        	$scope.SubCapitalAccountEntitys[index].isSelectActive=false;
			$scope.SubCapitalAccountEntitys.splice(index, 1);
            $scope.clientArrayMaps.push(v);
        });
        $scope.arrayClientMapsTem=[];
    }
	
	//删除资产单元选择 移动  单个 < 按钮事件
	$scope.deleteSelectSubAccountEntity = function(){
        angular.forEach($scope.subClientEntitysTem, function (v, i, x) {
        	var index = $scope.clientArrayMaps.indexOf(v);
        	$scope.clientArrayMaps[index].isSelectActive=false;
			$scope.clientArrayMaps.splice(index, 1);
            $scope.SubCapitalAccountEntitys.push(v);
        });
        $scope.subClientEntitysTem=[];
    }
});
