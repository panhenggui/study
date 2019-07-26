myapp.controller('AccountLinkController', function ($scope,$rootScope, $timeout) {
	//调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
	$scope.tradeUserService = new com.quantdo.orgClear.service.TradeUserService();
	$scope.userManageService = new com.quantdo.orgClear.service.UserManageService();
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService;
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
	$scope.roleListEntitys = [];
	$scope.instClientListEntitys = [];
	$scope.tradeUserEntity = {};
	$scope.listEntitys = {};
	$scope.accountLink_add = isShow('accountLink_add');
	$scope.OkShow=true;
	$scope.flagGroup = false;//添加对应的资产单元checkbox
	$scope.flagAccountId = false;//添加对应的资产单元
	$scope.flagSubId = false; //添加对应的资金账号或资金账号组
	$scope.linkAccountTypes=clearConstant.linkAccountType;
	
	$scope.fofWF = true;
	$scope.amTyp = false;
	
	$scope.hideFundProduct = false;
	isHideFundProduct(function(result){
	    $scope.hideFundProduct = result;
	    $scope.$apply();
	});
	
    $scope.instClientID = '';
    queryInstClientID(function (result) {
        $scope.instClientID = result;
        if($scope.instClientID != undefined ){
        	$scope.isInstClient = true;
        	$scope.findAccountRelationByInstClientId($scope.instClientID);
        	$scope.tradeUserEntity.instClientID=$scope.instClientID;
        	  //初始化产品
        	findFundProduct(function (result) {
            	$scope.fundProductTems=result;
             	//初始化 yonhu
            	$scope.tradeUserService.findActiveUserByInstClientID(function(result){
            		//下拉框的值
            		$scope.tradeUsers = result;
            		$scope.$apply();
            	},{instClientID : $scope.instClientID });
            },{ instClientID : $scope.instClientID,linkAccountType:$scope.linkAccountTypes[0].key});
        }else{
        	$scope.isInstClient = false;
        }
        $scope.$apply();
    });
	$scope.getAllTraderUsers = function(){
		queryInstClientID(function (result) {
			$scope.instClientID = result;
			if($scope.instClientID != undefined ){
				$scope.isInstClient = true;
				$scope.tradeUserEntity.instClientID=$scope.instClientID;
				//初始化产品
				findFundProduct(function (result) {
					$scope.fundProductTems=result;
					//初始化 yonhu
					$scope.tradeUserService.findActiveUserByInstClientID(function(result){
						//下拉框的值
						$scope.tradeUsers = result;
						$scope.$apply();
					},{instClientID : $scope.instClientID });
				},{ instClientID : $scope.instClientID,linkAccountType:$scope.linkAccountTypes[0].key});
			}else{
				$scope.isInstClient = false;
			}
			$scope.$apply();
		});
	};
  
    
    $scope.showRole=false;
   
    $scope.accountRelationList=[];
    $scope.findAccountRelationByInstClientId = function(instClientId) {
    	$scope.accountRelationList=[];
    	findAccountRelationByInstClientId(function (result) {
    		$scope.accountRelationList =result;
        	$scope.$apply();
        },{instClientID:instClientId});
    };
    
    
	
    //机构级联产品
    $scope.fundProductTems=[];
    $scope.fundProductID="";
    $scope.changInstClient = function (instClientId) {
    	$scope.fundProductTems=[];
    	angular.forEach($scope.instClientListEntitys, function (value, index, arrays) {
			if(value.instClientID == instClientId){
				if(value.amType==2){
					 $scope.amTyp =true;
				}else{
					 $scope.amTyp =false;
				}
			}
		});
    	$scope.findAccountRelationByInstClientId(instClientId);
    	findFundProduct(function (result) {
        	$scope.fundProductTems=result;
        	//$scope.fundProductID=$scope.fundProductTems[0].fundProductID;
        	//初始化 yonhu
        	$scope.tradeUserService.findActiveUserByInstClientID(function(result){
        		//下拉框的值
        		$scope.tradeUsers =[];
        		if(result.length>0){
        			$scope.tradeUsers = result;
        			$scope.tradeUserEntity.userID=$scope.tradeUsers[0].userID;
        			$scope.changUserCode($scope.tradeUserEntity.userID);
        			$scope.$apply();
        		}
        		
        	},{instClientID : instClientId });
        },{instClientID:instClientId,linkAccountType:$scope.linkAccountTypes[0].key});
    };
    
    //产品级联账号

    $scope.changProduct = function (fundProductID) {
    	$scope.capitalAccountEntitys=[];
		$scope.temcapEntitys=[];
    	findCapAccIdByProductIdAndInstId(function (result) {
        	angular.forEach(result, function (value, index, arrays) {
        		var flages= true;
        		angular.forEach($scope.accountIdArrayMaps, function (mapValue, mapIndex, mapArrays) {
            		if(value.innerAccountID==mapValue.innerAccountID){
            			flages=false;
            		}
        		});
        		if(flages){
        			$scope.temcapEntitys.push(value);
        		}
    		});
    		$scope.capitalAccountEntitys =$scope.temcapEntitys;
        	$scope.$apply();
        },fundProductID,$scope.tradeUserEntity.instClientID);
    };

	//获取所有角色
	getAllRole(function (result) {
		$scope.temRoleListEntitys = result;
		$scope.$apply();
	},{});
	
	//改变用户类型
    $scope.changUserCode = function (userid) {
    	$scope.OkShow=false;
    	$scope.temTradeUser=[];
    	$scope.roleListEntitys=[];
    	
    	angular.forEach($scope.tradeUsers, function (value, index, arrays) {
    		if(value.userID==userid){
    			$scope.temTradeUser.push(value);
    		}
		});
    	
    	var roleID =$scope.temTradeUser[0].role;
    	
        if(roleID==5 ||roleID==12){
        	$scope.showRole=true;
        }else{
        	$scope.showRole=false;
        }
        
       /* if($scope.amTyp && (roleID == 6 || roleID == 8 || roleID == 13)){
        	$scope.fofWF = false;
        }else{
        	$scope.fofWF = true;
        }*/
    	
    	angular.forEach($scope.temRoleListEntitys, function (value, index, arrays) {
    		if(value.id==roleID){
    			$scope.roleListEntitys.push(value);
    			$scope.tradeUserEntity.id = $scope.roleListEntitys[0].id;
    		}
		});
    	editTab(userid);
    }
	
	
	$scope.userManageService.getUserByUserID(function(result){
		$scope.tradeUserEntity = result;
		$scope.$apply();
	});
    $scope.amType = '';
    queryAmType(function (result) {
        $scope.amType = result;
         if($scope.amType==2 ){
        	 $scope.amTyp =true;
         }
    });

	$scope.insert = function(){
		$scope.ModalEntity = {};
		$scope.ModalEntity.userType = $scope.tradeUserTypes[2].key;
	}

	$scope.instClientService.findInstClientByQuery(function(results){
        $scope.instClientListEntitys= angular.copy(results);
        $scope.$apply();
	},{});
	
	//账户管理设置
	 function editTab(userId){
        $scope.arrayGroupMapsTem=[];
        $scope.subGroupEntitysTem=[];
		$scope.arrayAccountMapsTem=[];
	    $scope.subAccEntitysTem=[];
        $scope.arrayClientMapsTem=[];
        $scope.subClientEntitysTem=[];

		$scope.flagGroup = false;//添加对应的资产单元checkbox
		$scope.flagAccountId = false;//添加对应的资产单元
		$scope.flagSubId = false; //添加对应的资金账号或资金账号组
		
		$scope.clientArrayMaps = []; //客户资金账号
		$scope.groupArrayMaps = []; //资金账号组
		$scope.accountIdArrayMaps = []; //资金账号

		$scope.tradeUserEntity.userID = userId;
		
		//资金账户组tab
		$scope.accountGroupService.findAllGroup(function (result) {
			$scope.accountGroupEntitys = [];
			angular.forEach(result, function (value, index, arrays) {
				if(value.isChecked == "0"){
					$scope.groupArrayMaps.push(value);
				}else{
					$scope.accountGroupEntitys.push(value);
				}
			});
			
			$scope.$apply();
		},$scope.tradeUserEntity);

		//资金账号tab
		$scope.capitalAccountService.findByAccountGroupIDIsNull(function (result) {
			$scope.capitalAccountEntitys = [];
			angular.forEach(result, function (value, index, arrays) {
				if(value.isChecked == "0"){
					$scope.accountIdArrayMaps.push(value);
				}else{
					$scope.capitalAccountEntitys.push(value);
				}
			});
			$scope.$apply();
		},$scope.tradeUserEntity);

		//资产单元信息tab
		$scope.subCapitalAccountService.findAllSubCapitalAccount(function(result){
		    $scope.SubCapitalAccountEntitys = [];
			angular.forEach(result, function (value, index, arrays) {
				if(value.isChecked == "0"){
					$scope.clientArrayMaps.push(value);
				}else{
					$scope.SubCapitalAccountEntitys.push(value);
				}
			});
			$scope.$apply();
		},$scope.tradeUserEntity);

	}

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
			var tem =[];
			angular.forEach($scope.groupArrayMaps, function (gValue, gIndex, gArrays) {
			
				angular.forEach(entitys, function (value, index, arrays) {
					//判断资金账号组里是否存在资产单元
					if(undefined != value.accountGroupID && "" != value.accountGroupID && value.accountGroupID == gValue.accountGroupID){
						
						var i = $scope.clientArrayMaps.indexOf(entitys[index]);
						if(i == -1){
							entitys[index].isChecked = "0"; //设置选中状态
							temArrMaps.push(entitys[index]);
							tem.push(index);
						}
					}
				});
			});
			//tem 排序 从小到大
	        tem.sort();
	        //tem 从尾 删除
	        for (var j=1;tem.length>=j;j++) {
				temEntitys.splice(tem[tem.length-j], 1);
			}
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
					}
				});
			});
			//tem 排序 从小到大
	        tem.sort();
	        //tem 从尾 删除
			for (var j=1;tem.length>=j;j++) {
				temEntitys.splice(tem[tem.length-j], 1);
			}
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
			var temAcc =[];
			var temGroup =[];
			angular.forEach(entitys, function (value, index, arrays) {
				//资产单元的资金账号组为空的情况下
				if(undefined == value.accountGroupID || "" == value.accountGroupID){
					//遍历资金账号
				
					angular.forEach(captalEntitys, function (cValue, cIndex, cArrays) {
						if(value.innerAccountID == cValue.innerAccountID){
							captalEntitys[cIndex].isChecked = "0";
							$scope.accountIdArrayMaps.push(cValue);
							temAcc.push(cIndex);
							$scope.$apply();
						}
					});
					
				} else if(undefined == value.innerAccountID || "" == value.innerAccountID){
					//遍历资金账号组

					angular.forEach(groupEntity, function (gValue, gIndex, gArrays) {
						if(value.accountGroupID == gValue.accountGroupID){
							groupEntity[gIndex].isChecked = "0";
							$scope.groupArrayMaps.push(gValue);
							temGroup.push(gIndex);
							$scope.$apply();
						}
					});
				}
			});
			
			//tem 排序 从小到大
	        temAcc.sort();
	        //tem 从尾 删除
	        for (var j=1;temAcc.length>=j;j++) {
				temCaptalEntitys.splice(temAcc[temAcc.length-j], 1);
			}
			
			$scope.capitalAccountEntitys=temCaptalEntitys;
			//tem 排序 从小到大
			temGroup.sort();
	        //tem 从尾 删除
			for (var j=1;temGroup.length>=j;j++) {
				temGroupEntity.splice(temGroup[temGroup.length-j], 1);
			}
			 $scope.accountGroupEntitys=temGroupEntity;
		}
		
	};
	
	//资金账号组添加选中
	$scope.addGroup = function(flag,listEntity){
		//删除选择
    	deleteSelect ();
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
			//tem 排序 从小到大
			tem.sort();
	        //tem 从尾 删除
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
    	//删除选择
    	deleteSelect ();
	    //资产单元集合
        var entitys = $scope.SubCapitalAccountEntitys;
        var tmpEntitys = angular.copy(entitys);
    	var tem =[];
        angular.forEach(listEntitys, function (groupEntity, index, x) {
            $scope.groupArrayMaps.push(groupEntity);
            if($scope.flagGroup){
                //遍历资产单元
                angular.forEach(entitys, function (value, index, arrays) {
                    //判断资金账号组里是否存在资产单元
                    if(undefined != value.accountGroupID && value.accountGroupID == groupEntity.accountGroupID){
                        entitys[index].isChecked = "0"; //设置选中状态
                        $scope.clientArrayMaps.push(entitys[index]);
                        //tmpEntitys.splice(index, 1);
                        tem.push(index);
                    }
                });
            	
            }
        });
      //tem 排序 从小到大
		tem.sort();
        //tem 从尾 删除
		for (var j=1;tem.length>=j;j++) {
			tmpEntitys.splice(tem[tem.length-j], 1);
		}
        $scope.SubCapitalAccountEntitys = [];
        $scope.accountGroupEntitys = [];
        $scope.SubCapitalAccountEntitys = tmpEntitys;
        //$scope.$apply();
	}

	//资金账号组删除选中
    $scope.devedGroup = function(flag,listEntity){
    	//删除选择
    	deleteSelect ();
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
            //tem 排序 从小到大
    		tem.sort();
            //tem 从尾 删除
            for (var j=1;tem.length>=j;j++) {
				tmpEntitys.splice(tem[tem.length-j], 1);
			}
        }
        $scope.clientArrayMaps=tmpEntitys;
       // $scope.$apply();
    }
    //资金账号组全删除
    $scope.deleteAllGroupEntity= function(listEntitys){
    	//删除选择
    	deleteSelect ();
        //资产单元集合
        var entitys = $scope.clientArrayMaps;
        var tmpEntitys = angular.copy(entitys);
    	var tem =[];
        angular.forEach(listEntitys, function (groupEntity, index, x) {
            $scope.accountGroupEntitys.push(groupEntity);
            if($scope.flagGroup){
                //var entitys = $scope.SubCapitalAccountEntitys;
                //遍历资产单元
                angular.forEach(entitys, function (value, index, arrays) {
                    //判断该组里面是否有对应的资产单元和该资产单元的选中状态为已选中
                    if(undefined != value.accountGroupID && value.accountGroupID == groupEntity.accountGroupID){
                        var i = $scope.clientArrayMaps.indexOf(entitys[index]);
                        tem.push(i);
                        $scope.SubCapitalAccountEntitys.push(value);
                    }
                });
                
            }
        });
        //tem 排序 从小到大
		tem.sort();
        //tem 从尾 删除
		for (var j=1;tem.length>=j;j++) {
			tmpEntitys.splice(tem[tem.length-j], 1);
		}
        $scope.groupArrayMaps=[];
        $scope.clientArrayMaps=tmpEntitys;
       // $scope.$apply();
    }

  //资金账号选中
	$scope.addAccountId = function(falg,listEntity){
		//删除选择
    	deleteSelect ();
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
			var temSub=[];
			angular.forEach(entitys, function (value, index, arrays) {
				//判断分组中是否存在资产单元
				if((undefined != value.innerAccountID && value.innerAccountID == listEntity.innerAccountID) || null ==value.innerAccountID ){
					if(null ==value.innerAccountID){
						angular.forEach($scope.accountRelationList, function (relationValue, relationIndex, relationArrays) {
							if(value.subAccountID ==relationValue.subAccountID){
								if(listEntity.innerAccountID == relationValue.innerAccountID){
									var flag =true;
									angular.forEach(temSub, function (temValue, temIndex, temArrays) {
										if(temValue ==relationValue.subAccountID ){
											flag =false;
										}
									});
									if(flag){
										entitys[index].isChecked = "0"; //设置选中状态
										$scope.clientArrayMaps.push(value);
										tem.push(index);
										temSub.push(relationValue.subAccountID);
									}
									
								}
							}
						});
					}else {
						entitys[index].isChecked = "0"; //设置选中状态
						$scope.clientArrayMaps.push(value);
						//tmpEntitys.splice(index, 1);
						  tem.push(index);
					}
				}
			});
			//tem 排序 从小到大
			tem.sort();
	        //tem 从尾 删除
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
    	//删除选择
    	deleteSelect ();
        //资产单元集合
        var entitys = $scope.SubCapitalAccountEntitys;
        var tmpEntitys =angular.copy(entitys);
    	var tem=[];
    	var temSub =[];
        angular.forEach(listEntitys, function (listEntity, index, x) {
            $scope.accountIdArrayMaps.push(listEntity);
            if($scope.flagAccountId){
                //遍历资产单元
            
                angular.forEach(entitys, function (value, index, arrays) {
                    //判断分组中是否存在资产单元
    				if((undefined != value.innerAccountID && value.innerAccountID == listEntity.innerAccountID) || null ==value.innerAccountID ){
    					if(null ==value.innerAccountID){
    						angular.forEach($scope.accountRelationList, function (relationValue, relationIndex, relationArrays) {
    							if(value.subAccountID ==relationValue.subAccountID){
    								if(listEntity.innerAccountID == relationValue.innerAccountID){
    									var flag =true;
    									angular.forEach(temSub, function (temValue, temIndex, temArrays) {
    										if(temValue ==relationValue.subAccountID ){
    											flag =false;
    										}
    									});
    									if(flag){
    										entitys[index].isChecked = "0"; //设置选中状态
    										$scope.clientArrayMaps.push(value);
    										tem.push(index);
    										temSub.push(relationValue.subAccountID);
    									}
    								}
    							}
    						});
    					}else {
    						entitys[index].isChecked = "0"; //设置选中状态
    						$scope.clientArrayMaps.push(value);
    						//tmpEntitys.splice(index, 1);
    						  tem.push(index);
    					}
    				}
                });
                      
            }
        });
        //tem 排序 从小到大
        tem.sort();
        //tem 从尾 删除
        for (var j=1;tem.length>=j;j++) {
				tmpEntitys.splice(tem[tem.length-j], 1);
			}
        $scope.SubCapitalAccountEntitys = [];
        $scope.capitalAccountEntitys =[];
        $scope.SubCapitalAccountEntitys = tmpEntitys;
       // $scope.$apply();
    }


  //资金账号取消选中
    $scope.devedAccountId = function(falg,listEntity){
    	//删除选择
    	deleteSelect ();
        var entitys = $scope.clientArrayMaps;
        
        var tmpEntitys = angular.copy(entitys);
        var index = $scope.accountIdArrayMaps.indexOf(listEntity);
        $scope.accountIdArrayMaps.splice(index, 1);
        $scope.capitalAccountEntitys.push(listEntity);
        if($scope.flagAccountId){
            //遍历资产单元
        	var tem=[];
        	var temSub =[];
            angular.forEach(entitys, function (value, index, arrays) {
                //判断该组里面是否有对应的资产单元和该资产单元的选中状态为已选中
/*                if(undefined != value.innerAccountID && "" != value.innerAccountID){
                    if(listEntity.innerAccountID == value.innerAccountID){
                        entitys[index].isChecked = "1"; //设置未选中状态
                        var i = $scope.clientArrayMaps.indexOf(entitys[index]);
                       // tmpEntitys.splice(i, 1);
                        tem.push(i);
                        $scope.SubCapitalAccountEntitys.push(value);
                    }
                }*/
                
                
                //判断分组中是否存在资产单元
				if((undefined != value.innerAccountID && value.innerAccountID == listEntity.innerAccountID) || null ==value.innerAccountID ){
					if(null ==value.innerAccountID){
						angular.forEach($scope.accountRelationList, function (relationValue, relationIndex, relationArrays) {
							if(value.subAccountID ==relationValue.subAccountID){
								if(listEntity.innerAccountID == relationValue.innerAccountID){
									var flag =true;
									angular.forEach(temSub, function (temValue, temIndex, temArrays) {
										if(temValue ==relationValue.subAccountID ){
											flag =false;
										}
									});
									if(flag){
										entitys[index].isChecked = "1"; //设置选中状态
										var i = $scope.clientArrayMaps.indexOf(entitys[index]);
    			                        // tmpEntitys.splice(i, 1);
    			                        tem.push(i);
    			                        $scope.SubCapitalAccountEntitys.push(value);
    			                        temSub.push(relationValue.subAccountID);
									} 
								}
							}
						});
					}else {
						entitys[index].isChecked = "1"; //设置未选中状态
                        var i = $scope.clientArrayMaps.indexOf(entitys[index]);
                        // tmpEntitys.splice(i, 1);
                        tem.push(i);
                        $scope.SubCapitalAccountEntitys.push(value);
					}
				}   
                
            });
            //tem 排序 从小到大
    		tem.sort();
            //tem 从尾 删除
            for (var j=1;tem.length>=j;j++) {
 				tmpEntitys.splice(tem[tem.length-j], 1);
 			}
        }
        $scope.clientArrayMaps=tmpEntitys;
        //$scope.$apply();
    }
    //资金账号删除全部
    $scope.deleteAllAccountEntity = function (listEntitys){
    	//删除选择
    	deleteSelect ();
        var entitys = $scope.clientArrayMaps;
        var tmpEntitys =angular.copy(entitys);
        var tem=[];
        var temSub=[];
        angular.forEach(listEntitys, function (arrayMap, index, x) {
            $scope.capitalAccountEntitys.push(arrayMap);
            if($scope.flagAccountId){
                //遍历资产单元
            	
                angular.forEach(entitys, function (value, index, arrays) {
                    //判断该组里面是否有对应的资产单元和该资产单元的选中状态为已选中
                    /*if(undefined != value.innerAccountID && "" != value.innerAccountID){
                        if(arrayMap.innerAccountID == value.innerAccountID){
                           entitys[index].isChecked = "1"; //设置未选中状态
                            var i = $scope.clientArrayMaps.indexOf(entitys[index]);
                           // tmpEntitys.splice(i, 1);
                            tem.push(i);
                            $scope.SubCapitalAccountEntitys.push(value);
                        }
                    }*/
                    //判断分组中是否存在资产单元
    				if((undefined != value.innerAccountID && value.innerAccountID == arrayMap.innerAccountID) || null ==value.innerAccountID ){
    					if(null ==value.innerAccountID){
    						angular.forEach($scope.accountRelationList, function (relationValue, relationIndex, relationArrays) {
    							if(value.subAccountID ==relationValue.subAccountID){
    								if(arrayMap.innerAccountID == relationValue.innerAccountID){
    									var flag =true;
    									angular.forEach(temSub, function (temValue, temIndex, temArrays) {
    										if(temValue ==relationValue.subAccountID ){
    											flag =false;
    										}
    									});
    									if(flag){
    										entitys[index].isChecked = "1"; //设置选中状态
    										var i = $scope.clientArrayMaps.indexOf(entitys[index]);
        			                        // tmpEntitys.splice(i, 1);
        			                        tem.push(i);
        			                        $scope.SubCapitalAccountEntitys.push(value);
        			                        temSub.push(relationValue.subAccountID);
    									} 
    								}
    							}
    						});
    					}else {
    						entitys[index].isChecked = "1"; //设置未选中状态
                            var i = $scope.clientArrayMaps.indexOf(entitys[index]);
                            // tmpEntitys.splice(i, 1);
                            tem.push(i);
                            $scope.SubCapitalAccountEntitys.push(value);
    					}
    				}
                    
                    
                });
                
            }
        });
        //tem 排序 从小到大
        tem.sort();
        //tem 从尾 删除
        for (var j=1;tem.length>=j;j++) {
				tmpEntitys.splice(tem[tem.length-j], 1);
			}
        $scope.clientArrayMaps=tmpEntitys;
        
        $scope.accountIdArrayMaps=[];
        //$scope.apply();
    }

  //资产单元选中事件
	$scope.addClient = function(falg,listEntity){
		//删除选择
    	deleteSelect ();
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
				//tem 排序 从小到大
				tem.sort();
		        //tem 从尾 删除
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
				//tem 排序 从小到大
				tem.sort();
		        //tem 从尾 删除
				for (var j=1;tem.length>=j;j++) {
					tmpGroupEntitys.splice(tem[tem.length-j], 1);
     			}
			}
		}
		$scope.accountGroupEntitys = tmpGroupEntitys;
		$scope.capitalAccountEntitys = tmpCaptalEntitys;
		//$scope.$apply();
	}
	
	//资产单元全选
	 $scope.addAllSubAccountEntity = function(listEntitys){
		 	//删除选择
	    	deleteSelect ();
	        //资金账号
	        var captalEntitys = $scope.capitalAccountEntitys;
	        var tmpCaptalEntitys=angular.copy(captalEntitys); 
	        //资金账号组
	        var groupEntitys = $scope.accountGroupEntitys;
	        var tmpGroupEntitys=angular.copy(groupEntitys); 
	        var temAcc =[];
	        var temGroup =[];
	        angular.forEach(listEntitys, function (listEntity, index, arrays) {
	            $scope.clientArrayMaps.push(listEntity);
	            if($scope.flagSubId){
	                if(undefined != listEntity.innerAccountID && "" != listEntity.innerAccountID.trim()){
	                    //遍历资金账号
	                	
	                    angular.forEach(captalEntitys, function (cValue, cIndex, cArrays) {
	                        if(listEntity.innerAccountID == cValue.innerAccountID){
	                            captalEntitys[cIndex].isChecked = "0";
	                            //tmpCaptalEntitys.splice(cIndex, 1);
	                            temAcc.push(cIndex);
	                            var i = $scope.accountIdArrayMaps.indexOf(captalEntitys[cIndex]);
	                            if(i == -1){
	                                $scope.accountIdArrayMaps.push(captalEntitys[cIndex]);
	                            }
	                        }
	                    });
	                   
	                } else if(undefined != listEntity.accountGroupID && "" != listEntity.accountGroupID.trim()){
	                    //遍历资金账号组
	                	
	                    angular.forEach(groupEntitys, function (gValue, gIndex, gArrays) {
	                        if(listEntity.accountGroupID == gValue.accountGroupID){
	                            groupEntitys[gIndex].isChecked = "0";
	                           // tmpGroupEntitys.splice(gIndex, 1);
	                            temGroup.push(gIndex);
	                            var i = $scope.groupArrayMaps.indexOf(groupEntitys[gIndex]);
	                            if(i == -1){
	                                $scope.groupArrayMaps.push(groupEntitys[gIndex]);
	                            }
	                        }
	                    }); 
	                   
	                }
	            }
	        });
	      //tem 排序 从小到大
	        temAcc.sort();
	        //tem 从尾 删除
	        for (var j=1;temAcc.length>=j;j++) {
            	tmpCaptalEntitys.splice(temAcc[temAcc.length-j], 1);
 			}
	        //tem 排序 从小到大
	        temGroup.sort();
	        //tem 从尾 删除
	        for (var j=1;temGroup.length>=j;j++) {
            	tmpGroupEntitys.splice(temGroup[temGroup.length-j], 1);
 			}
	        console.log(tmpGroupEntitys);
	        $scope.accountGroupEntitys = tmpGroupEntitys;
	        $scope.capitalAccountEntitys = tmpCaptalEntitys;
	        $scope.SubCapitalAccountEntitys=[];
	       // $scope.$apply();
	 }
	
	 //资产单元取消事件
	    $scope.devedClient = function(falg,listEntity){
	    	//删除选择
	    	deleteSelect ();
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
	                     }
	                });
	                //tem 排序 从小到大
	                tem.sort();
	    	        //tem 从尾 删除
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
	                //tem 排序 从小到大
	                tem.sort();
	    	        //tem 从尾 删除
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
	    	//删除选择
	    	deleteSelect ();
	        //资金账号
	        var captalEntitys = $scope.accountIdArrayMaps;
	        var tmpCaptalEntitys=angular.copy(captalEntitys); 
	        //资金账号组
	        var groupEntitys = $scope.groupArrayMaps;
	        var tmpGroupEntitys=angular.copy(groupEntitys); 
	        
	    	var temAcc =[];
	        var temGroup =[];
	        angular.forEach(listEntitys, function (listEntity, index, arrays) {
	            $scope.SubCapitalAccountEntitys.push(listEntity);
	            if($scope.flagSubId){
                    angular.forEach(captalEntitys, function (value, index, arrays) {
                         if(value.innerAccountID == listEntity.innerAccountID){
                             captalEntitys[index].isChecked = "1";
                             $scope.capitalAccountEntitys.push(value);
                             var i = $scope.accountIdArrayMaps.indexOf(captalEntitys[index]);
                            // tmpCaptalEntitys.splice(i, 1);
                             temAcc.push(i);
                             $scope.$apply();
                         }
                    });
                   
                    angular.forEach(groupEntitys, function (value, index, arrays) {
                         if(value.accountGroupID == listEntity.accountGroupID){
                             groupEntitys[index].isChecked = "1";
                             $scope.accountGroupEntitys.push(value);
                             var i = $scope.groupArrayMaps.indexOf(groupEntitys[index]);
                             //tmpGroupEntitys.splice(i, 1);
                             temGroup.push(i);
                             $scope.$apply();
                         }
                    });
	            }
	            $scope.accountIdArrayMaps=tmpCaptalEntitys;
	            $scope.groupArrayMaps=tmpGroupEntitys;
	        });
	        //tem 排序 从小到大
	        temAcc.sort();
	        //tem 从尾 删除
	        for (var j=1;temAcc.length>=j;j++) {
            	tmpCaptalEntitys.splice(temAcc[temAcc.length-j], 1);
 			}
	        //tem 排序 从小到大
	        temGroup.sort();
	        //tem 从尾 删除
	        for (var j=1;temGroup.length>=j;j++) {
            	tmpGroupEntitys.splice(temGroup[temGroup.length-j], 1);
 			}
	        
	        $scope.clientArrayMaps=[];
	       // $scope.$apply();
	    }

	$scope.saveSetting = function (entity) {
		$scope.OkShow=true;
		$scope.userTraderService.saveSetting(function (result) {
			if(result == 1){
				layer.msg("设置成功",{icon:1});
				$scope.OkShow = false;
			}else {
				layer.msg("设置失败！",{icon:1});
				$scope.OkShow = false;
			}
			$scope.$apply();
		},entity,$scope.groupArrayMaps,$scope.accountIdArrayMaps,$scope.clientArrayMaps);
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
	    //资产单元集合
        var entitys = $scope.SubCapitalAccountEntitys;
        var tmpEntitys = angular.copy(entitys);
		
    	var tem =[];
        angular.forEach($scope.arrayGroupMapsTem, function (groupEntity, ii, xx) {
        	var index = $scope.accountGroupEntitys.indexOf(groupEntity);
        	$scope.accountGroupEntitys[index].isSelectActive=false;
			$scope.accountGroupEntitys.splice(index, 1);
            $scope.groupArrayMaps.push(groupEntity);
            if($scope.flagGroup){
                //遍历资产单元
                angular.forEach(entitys, function (value, index, arrays) {
                    //判断资金账号组里是否存在资产单元
                    if(undefined != value.accountGroupID && value.accountGroupID == groupEntity.accountGroupID){
                        entitys[index].isChecked = "0"; //设置选中状态
                        $scope.clientArrayMaps.push(entitys[index]);
                        //tmpEntitys.splice(index, 1);
                        tem.push(index);
                    }
                });
            	
            }
        });
        //tem 排序 从小到大
        tem.sort();
        //tem 从尾 删除
        for (var j=1;tem.length>=j;j++) {
			tmpEntitys.splice(tem[tem.length-j], 1);
		}
        $scope.arrayGroupMapsTem=[];
        $scope.SubCapitalAccountEntitys = [];
        $scope.SubCapitalAccountEntitys = tmpEntitys;       
    }
	
	//删除组选择 移动  单个 < 按钮事件
	$scope.deleteSelectGroupEntity = function(){
		 //资产单元集合
        var entitys = $scope.clientArrayMaps;
        var tmpEntitys = angular.copy(entitys);
    	var tem =[];
    	var temSub=[];
        angular.forEach($scope.subGroupEntitysTem, function (groupEntity, ii, xx) {
        	var index = $scope.groupArrayMaps.indexOf(groupEntity);
        	$scope.groupArrayMaps[index].isSelectActive=false;
			$scope.groupArrayMaps.splice(index, 1);
            $scope.accountGroupEntitys.push(groupEntity);
            
            if($scope.flagGroup){
                //var entitys = $scope.SubCapitalAccountEntitys;
                //遍历资产单元
            
                angular.forEach(entitys, function (value, index, arrays) {
                    //判断该组里面是否有对应的资产单元和该资产单元的选中状态为已选中
              /*      if(undefined != value.accountGroupID && value.accountGroupID == groupEntity.accountGroupID){
                        var i = $scope.clientArrayMaps.indexOf(entitys[index]);
                        tem.push(i);
                        $scope.SubCapitalAccountEntitys.push(value);
                    }
                    */
                    
                    
                  //判断分组中是否存在资产单元
    				if((undefined != value.innerAccountID && value.innerAccountID == groupEntity.innerAccountID) || null ==value.innerAccountID ){
    					if(null ==value.innerAccountID){
    						angular.forEach($scope.accountRelationList, function (relationValue, relationIndex, relationArrays) {
    							if(value.subAccountID ==relationValue.subAccountID){
    								if(groupEntity.innerAccountID == relationValue.innerAccountID){
    			                        var flag =true;
    									angular.forEach(temSub, function (temValue, temIndex, temArrays) {
    										if(temValue ==relationValue.subAccountID ){
    											flag =false;
    										}
    									});
    									if(flag){
    										entitys[index].isChecked = "1"; //设置选中状态
    										var i = $scope.clientArrayMaps.indexOf(entitys[index]);
        			                        // tmpEntitys.splice(i, 1);
        			                        tem.push(i);
        			                        $scope.SubCapitalAccountEntitys.push(value);
    									} 
    								}
    							}
    						});
    					}else {
    						entitys[index].isChecked = "1"; //设置未选中状态
                            var i = $scope.clientArrayMaps.indexOf(entitys[index]);
                            // tmpEntitys.splice(i, 1);
                            tem.push(i);
                            $scope.SubCapitalAccountEntitys.push(value);
    					}
    				}
                });
                
            }
        });
        //tem 排序 从小到大
        tem.sort();
        //tem 从尾 删除
        for (var j=1;tem.length>=j;j++) {
			tmpEntitys.splice(tem[tem.length-j], 1);
		}
        $scope.subGroupEntitysTem=[];
        $scope.clientArrayMaps=[];
        $scope.clientArrayMaps=tmpEntitys;  
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
	      //资产单元集合
        var entitys = $scope.SubCapitalAccountEntitys;
        var tmpEntitys =angular.copy(entitys);
        var tem=[];
        var temSub= [];
        angular.forEach($scope.arrayAccountMapsTem, function (listEntity, ii, xx) {
        	var index = $scope.capitalAccountEntitys.indexOf(listEntity);
        	$scope.capitalAccountEntitys[index].isSelectActive=false;
			$scope.capitalAccountEntitys.splice(index, 1);
            $scope.accountIdArrayMaps.push(listEntity);
            if($scope.flagAccountId){
                //遍历资产单元
            	
                angular.forEach(entitys, function (value, index, arrays) {
                    //判断分组中是否存在资产单元
                    if((undefined != value.innerAccountID && value.innerAccountID == listEntity.innerAccountID ) || null ==value.innerAccountID){
                    	if(null ==value.innerAccountID){
    						angular.forEach($scope.accountRelationList, function (relationValue, relationIndex, relationArrays) {
    							if(value.subAccountID ==relationValue.subAccountID){
    								if(listEntity.innerAccountID == relationValue.innerAccountID){
    									var flag =true;
    									angular.forEach(temSub, function (temValue, temIndex, temArrays) {
    										if(temValue ==relationValue.subAccountID ){
    											flag =false;
    										}
    									});
    									if(flag){
    										entitys[index].isChecked = "0"; //设置选中状态
    										$scope.clientArrayMaps.push(value);
    										tem.push(index);
    										temSub.push(relationValue.subAccountID);
    									}
    								}
    							}
    						});
    					}else {
	                    	entitys[index].isChecked = "0"; //设置选中状态
	                        $scope.clientArrayMaps.push(value);
	                        //tmpEntitys.splice(index, 1);
	                        tem.push(index);
                        }
                    }
                });
            }
        });
        //tem 排序 从小到大
        tem.sort();
        //tem 从尾 删除
        for (var j=1;tem.length>=j;j++) {
				tmpEntitys.splice(tem[tem.length-j], 1);
		}
        $scope.arrayAccountMapsTem=[];
        $scope.SubCapitalAccountEntitys = tmpEntitys;  
    }
	
	//删除资金账号选择 移动  单个 < 按钮事件
	$scope.deleteSelectAccountEntity = function(){
        
        var entitys = $scope.clientArrayMaps;
        var tmpEntitys =angular.copy(entitys);
        var tem=[];
        var temSub =[];
        angular.forEach($scope.subAccEntitysTem, function (arrayMap, ii, xx) {
        	var index = $scope.accountIdArrayMaps.indexOf(arrayMap);
        	$scope.accountIdArrayMaps[index].isSelectActive=false;
			$scope.accountIdArrayMaps.splice(index, 1);
            $scope.capitalAccountEntitys.push(arrayMap);
            if($scope.flagAccountId){
                //遍历资产单元
            	
                angular.forEach(entitys, function (value, index, arrays) {
                    //判断该组里面是否有对应的资产单元和该资产单元的选中状态为已选中
/*                    if(undefined != value.innerAccountID && "" != value.innerAccountID){
                        if(arrayMap.innerAccountID == value.innerAccountID){
                           entitys[index].isChecked = "1"; //设置未选中状态
                            var i = $scope.clientArrayMaps.indexOf(entitys[index]);
                           // tmpEntitys.splice(i, 1);
                            tem.push(i);
                            $scope.SubCapitalAccountEntitys.push(value);
                        }
                    }*/
                    
        			if((undefined != value.innerAccountID && value.innerAccountID == arrayMap.innerAccountID) || null ==value.innerAccountID ){
    					if(null ==value.innerAccountID){
    						angular.forEach($scope.accountRelationList, function (relationValue, relationIndex, relationArrays) {
    							if(value.subAccountID ==relationValue.subAccountID){
    								if(arrayMap.innerAccountID == relationValue.innerAccountID){
    			                        var flag =true;
    									angular.forEach(temSub, function (temValue, temIndex, temArrays) {
    										if(temValue ==relationValue.subAccountID ){
    											flag =false;
    										}
    									});
    									if(flag){
    										entitys[index].isChecked = "1"; //设置选中状态
    										var i = $scope.clientArrayMaps.indexOf(entitys[index]);
        			                        // tmpEntitys.splice(i, 1);
        			                        tem.push(i);
        			                        $scope.SubCapitalAccountEntitys.push(value);
        			                        temSub.push(relationValue.subAccountID);
    									} 
    								}
    							}
    						});
    					}else {
    						entitys[index].isChecked = "1"; //设置未选中状态
                            var i = $scope.clientArrayMaps.indexOf(entitys[index]);
                            // tmpEntitys.splice(i, 1);
                            tem.push(i);
                            $scope.SubCapitalAccountEntitys.push(value);
    					}
    				}
                });
              
            }
        });
        //tem 排序 从小到大
        tem.sort();
        //tem 从尾 删除
        for (var j=1;tem.length>=j;j++) {
				tmpEntitys.splice(tem[tem.length-j], 1);
		}
        $scope.subAccEntitysTem=[];
        $scope.clientArrayMaps=tmpEntitys;
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
	       //资金账号
        var captalEntitys = $scope.capitalAccountEntitys;
        var tmpCaptalEntitys=angular.copy(captalEntitys); 
        //资金账号组
        var groupEntitys = $scope.accountGroupEntitys;
        var tmpGroupEntitys=angular.copy(groupEntitys);
    	var temAcc =[];
    	var temGroup =[];
        angular.forEach($scope.arrayClientMapsTem, function (listEntity, ii, xx) {
        	var index = $scope.SubCapitalAccountEntitys.indexOf(listEntity);
        	$scope.SubCapitalAccountEntitys[index].isSelectActive=false;
			$scope.SubCapitalAccountEntitys.splice(index, 1);
            $scope.clientArrayMaps.push(listEntity);
            if($scope.flagSubId){
                if(undefined != listEntity.innerAccountID && "" != listEntity.innerAccountID.trim()){
                    //遍历资金账号
                    angular.forEach(captalEntitys, function (cValue, cIndex, cArrays) {
                        if(listEntity.innerAccountID == cValue.innerAccountID){
                            captalEntitys[cIndex].isChecked = "0";
                            //tmpCaptalEntitys.splice(cIndex, 1);
                            temAcc.push(cIndex);
                            var i = $scope.accountIdArrayMaps.indexOf(captalEntitys[cIndex]);
                            if(i == -1){
                                $scope.accountIdArrayMaps.push(captalEntitys[cIndex]);
                            }
                        }
                    });
                   
                } else if(undefined != listEntity.accountGroupID && "" != listEntity.accountGroupID.trim()){
                    //遍历资金账号组
                    angular.forEach(groupEntitys, function (gValue, gIndex, gArrays) {
                        if(listEntity.accountGroupID == gValue.accountGroupID){
                            groupEntitys[gIndex].isChecked = "0";
                           // tmpGroupEntitys.splice(gIndex, 1);
                            temGroup.push(gIndex);
                            var i = $scope.groupArrayMaps.indexOf(groupEntitys[gIndex]);
                            if(i == -1){
                                $scope.groupArrayMaps.push(groupEntitys[gIndex]);
                            }
                        }
                    }); 
                   
                }
            }
        });
        //tem 排序 从小到大
        temAcc.sort();
        //tem 从尾 删除
        for (var j=1;temAcc.length>=j;j++) {
        	tmpCaptalEntitys.splice(temAcc[temAcc.length-j], 1);
		}
        //tem 排序 从小到大
        temGroup.sort();
        //tem 从尾 删除
        for (var j=1;temGroup.length>=j;j++) {
        	tmpGroupEntitys.splice(temGroup[temGroup.length-j], 1);
			}
        $scope.arrayClientMapsTem=[];
        $scope.accountGroupEntitys = tmpGroupEntitys;
        $scope.capitalAccountEntitys = tmpCaptalEntitys;
   
    }
	
	//删除资产单元选择 移动  单个 < 按钮事件
	$scope.deleteSelectSubAccountEntity = function(){
        
        //资金账号
        var captalEntitys = $scope.accountIdArrayMaps;
        var tmpCaptalEntitys=angular.copy(captalEntitys); 
        //资金账号组
        var groupEntitys = $scope.groupArrayMaps;
        var tmpGroupEntitys=angular.copy(groupEntitys); 
        var temGroup =[];
    	var temAcc =[];
        angular.forEach($scope.subClientEntitysTem, function (listEntity, ii, xx) {
        	var index = $scope.clientArrayMaps.indexOf(listEntity);
        	$scope.clientArrayMaps[index].isSelectActive=false;
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
                
                    angular.forEach(captalEntitys, function (value, index, arrays) {
                         if(value.innerAccountID == listEntity.innerAccountID){
                             captalEntitys[index].isChecked = "1";
                             $scope.capitalAccountEntitys.push(value);
                             var i = $scope.accountIdArrayMaps.indexOf(captalEntitys[index]);
                            // tmpCaptalEntitys.splice(i, 1);
                             temAcc.push(i);
                             $scope.$apply();
                         }
                    });
                   
                }
                
                if(tmpGroupCount == 0){
                	
                    angular.forEach(groupEntitys, function (value, index, arrays) {
                         if(value.accountGroupID == listEntity.accountGroupID){
                             groupEntitys[index].isChecked = "1";
                             $scope.accountGroupEntitys.push(value);
                             var i = $scope.groupArrayMaps.indexOf(groupEntitys[index]);
                             //tmpGroupEntitys.splice(i, 1);
                             temGroup.push(i);
                             $scope.$apply();
                         }
                    });
                   
                }
            }
        });
        //tem 排序 从小到大
        temAcc.sort();
        //tem 从尾 删除
        for (var j=1;temAcc.length>=j;j++) {
        	tmpCaptalEntitys.splice(temAcc[temAcc.length-j], 1);
			}
        //tem 排序 从小到大
        temGroup.sort();
        //tem 从尾 删除
        for (var j=1;temGroup.length>=j;j++) {
        	tmpGroupEntitys.splice(temGroup[temGroup.length-j], 1);
			}
        $scope.accountIdArrayMaps=tmpCaptalEntitys;
        $scope.groupArrayMaps=tmpGroupEntitys;
        $scope.subClientEntitysTem=[];
    }
	
	function deleteSelect (){
		//zu
		
		  angular.forEach($scope.arrayGroupMapsTem, function (v, i, x) {
			   if(!$scope.accountGroupEntitys.length == 0){
	        	   var index = $scope.accountGroupEntitys.indexOf(v);
	        	   if(0<=index){
	        		   $scope.accountGroupEntitys[index].isSelectActive=false;
	        	   }
	        	 
		       }
	        });
		  $scope.arrayGroupMapsTem=[];
		  
		 angular.forEach($scope.subGroupEntitysTem, function (v, i, x) {
			    if(!$scope.groupArrayMaps.length == 0){
	        	    var index = $scope.groupArrayMaps.indexOf(v);
	        	    if(0<=index){
	        	    	 $scope.groupArrayMaps[index].isSelectActive=false;
	        	    }
	        	   
			    }
	        });
		 $scope.subGroupEntitysTem=[];
		//资金账号
		   angular.forEach($scope.arrayAccountMapsTem, function (v, i, x) {
			    if(!$scope.capitalAccountEntitys.length == 0){
	        	    var index = $scope.capitalAccountEntitys.indexOf(v);
	        	    if(0<=index){
	        	    	 $scope.capitalAccountEntitys[index].isSelectActive=false;
	        	    }
	        	   
			    }
	        });
		   $scope.arrayAccountMapsTem=[];
		
		   angular.forEach($scope.subAccEntitysTem, function (v, i, x) {
			    if(!$scope.accountIdArrayMaps.length == 0){
	        	    var index = $scope.accountIdArrayMaps.indexOf(v);
	        	    if(0<=index){
	        	    	 $scope.accountIdArrayMaps[index].isSelectActive=false;
	        	    }
			    }
	        });
		   $scope.subAccEntitysTem=[];
		//资产单元
		 angular.forEach($scope.arrayClientMapsTem, function (v, i, x) {
			  if(!$scope.SubCapitalAccountEntitys.length == 0){
	        	   var index = $scope.SubCapitalAccountEntitys.indexOf(v);
	        	   if(0<=index){
	        		   $scope.SubCapitalAccountEntitys[index].isSelectActive=false;
	        	   }
	         	   
			  }
	      });
		 $scope.arrayClientMapsTem=[];
		
		 angular.forEach($scope.subClientEntitysTem, function (v, i, x) {
			 if(!$scope.clientArrayMaps.length == 0){
				 var index = $scope.clientArrayMaps.indexOf(v);
				 if(0<=index){
					 $scope.clientArrayMaps[index].isSelectActive=false;
				 }
		         
			 }
	     });
		 $scope.subClientEntitysTem=[];
	}
	
});
