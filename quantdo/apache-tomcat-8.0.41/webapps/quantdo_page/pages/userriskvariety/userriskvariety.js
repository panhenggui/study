myapp.controller('UserriskVariety', function ($scope, $timeout) {

    $scope.subCapitalAccountService = new com.quantdo.orgClear.service.SubCapitalAccountService();
    $scope.subAccountRiskParamService = new com.quantdo.orgClear.service.SubAccountRiskParamService();
    $scope.subCapitalAccountTradingLimitService = new com.quantdo.orgClear.service.SubCapitalAccountTradingLimitService();
    $scope.instrumentService = new com.quantdo.orgClear.service.InstrumentService();

    $scope.entitys = [];
    $scope.subAccount = {};
    $scope.radioValue = [];
    $scope.heYue = {};
    $scope.subAccounts = [];
    $scope.instrumentEntitys = {};
    $scope.subAccountEntitys = [];
    $scope.subAccounts = {};
    $scope.allChecked = false;  //用来判断'全部'这个checkbox是否被选中，true：选中   false：未选中
    $scope.isChecked = "1";
    $scope.all = false;
    $scope.limitEntitys = [];
    $scope.products = [];
    var bool = false;
    var detailBool = false;
    var isInsert = false;//是否新增
    
    // 查询已经设置了品种限制的账户
    $scope.subCapitalAccountTradingLimitService.findAllSubCapitalAccountTradingLimit(function(result){
    	$scope.subCapitalAccountTradingLimitEntitys = result;
        $scope.$apply();
    });
    
	 // 查询客户账号
	   $scope.subCapitalAccountService.findAll(function (result) {
	        $scope.subAccounts = result;
	        $scope.$apply();
	   });
    
    
    $scope.subCapitalAccountTradingLimitService.findAllTradingLimit(function(result){
    	$scope.listEntitys = result;
        $scope.$apply();
    });

    // 批量删除
    $scope.del = function () {
    	if(undefined == $scope.limitEntitys || $scope.limitEntitys.length == 0){
    		layer.msg("请选择批量删除目标",{icon:2});
    		return;
    	}
    	layer.confirm("确定删除交易品种？",{icon:3},function(){
    		$scope.subCapitalAccountTradingLimitService.deletes(function(result){
        		layer.msg("批量删除成功",{icon:1});
        		
        		 $scope.subCapitalAccountTradingLimitService.findAllSubCapitalAccountTradingLimit(function(result){
        		    	$scope.subCapitalAccountTradingLimitEntitys = result;
        		    	 $scope.$apply();
        		    });
        		 
        		 $scope.subCapitalAccountTradingLimitService.findAllTradingLimit(function(result){
                 	$scope.listEntitys = result;
                     $scope.$apply();
                 });
        		// 查询客户账号
        	      $scope.subCapitalAccountService.findAll(function (result) {
        	            $scope.subAccounts = result;
        	            $scope.$apply();
        	      });
        		 
        	},$scope.limitEntitys);
    		$scope.limitEntitys = [];
       });
    }

    $scope.find = function (entity) {
    	if(undefined != entity.subAccountID){
    		 $scope.subCapitalAccountService.findBysubAccountID(function (result) {
    	            $scope.listEntitys = result;
    	            $scope.$apply();
    	        }, entity.subAccountID);
    	} else {
    		 $scope.subCapitalAccountTradingLimitService.findAllLimit(function(result){
    		    	$scope.listEntitys = result;
    		        $scope.$apply();
    		    });
    	}
    }
    

    $scope.findOne = function (subAccountID) {
        $scope.subAccountRiskParamService.findOne(function (result) {
            $scope.ModalEntity = result;
            $scope.$apply();
        }, subAccountID);
    };
    
    $scope.insert = function(){
    	isInsert = true;
    	$scope.allChecked = false; //不让全部checkbox被选中
    	$scope.isChecked = "1";
    	$(".empty").empty(); //清空合约li标签
    	bool = false;
    	detailBool = false;
    	 // 交易所商品查询
        $scope.subCapitalAccountTradingLimitService.findAll(function (result) {
            $.fn.zTree.init($("#ztree2"), ztreeSetting(), result);
        });
        $scope.entitys = []; 
        $scope.instrumentEntitys = {};
        $scope.btnOK = true; //显示确定按钮
    };
    
    //复制前查询
    $scope.copyQuery = function(){
    	
    	 // 查询已经设置了品种限制的账户
        $scope.subCapitalAccountTradingLimitService.findAllSubCapitalAccountTradingLimit(function(result){
        	$scope.subCapitalAccountTradingLimitEntitys = result;
            $scope.$apply();
        });
    	
    	// 查询客户账号
        $scope.subCapitalAccountService.findAll(function (result) {
            $scope.subAccounts = result;
            $scope.$apply();
        });
    }

    // 查询合约
    $scope.findHeYue = function (entity) {
    	$scope.entitys = [];
    	isInsert = false;
    	$scope.allChecked = false;//不让全部checkbox被选中
    	$scope.isChecked = "1";
    	$scope.all = false;
    	$(".empty").empty();//清空合约li标签
    	detailBool = false;
    	bool = true;
    	query(entity);
    	$scope.btnOK = true; //显示确定按钮
    	
    	//查询已经设置了交易限制的数据
    	$scope.subCapitalAccountTradingLimitService.findLimitBySubAccountID(function(result){
    		angular.forEach(result, function (value, index, s){
    			$scope.entitys.push(value);
    			if(value.att.productID == value.att.instrumentID){
    				$scope.products.push(value);
    			}
    		});
    	},entity.subAccountID);
    };

    //详细
    $scope.search = function(entity){
        $scope.subAccount = entity;
    	$scope.allChecked = false; //不让全部checkbox被选中
    	$scope.isChecked = "1";
    	$scope.all = false;
    	$(".empty").empty(); //清空合约li标签
    	detailBool = true;
    	query(entity);
    	$scope.btnOK = false; //隐藏确定按钮
    }
    
    //商品交易限制ztree查询、更新
    function query(entity){
    	angular.forEach($scope.subAccounts, function (value, index, arrays) {
            if (value != 0) {
                if(value.subAccountID == entity.subAccountID){
                	$scope.subAccount = value;
                }
            }
    	}); 
    	
            // 交易所商品查询
            $scope.subCapitalAccountTradingLimitService.findAll(function (result) {
            	$scope.allResult = result;
            	$.fn.zTree.init($("#ztree2"), ztreeSetting(), result);
                $scope.subCapitalAccountTradingLimitService.findBysubAccountID(function (result) {
                    var treeObj = $.fn.zTree.getZTreeObj("ztree2");
                    if (result.length > 0) {
                        angular.forEach(result, function (value, index, arrays) {
                            if (value != 0) {
                            	if(value.productID != null){
                            		var node = treeObj.getNodeByParam("id",value.productID);
                            		if(null != node){
                            			treeObj.checkNode(node, true, true);
                            		}
                            	}
                            }
                        });
                    }
                    
                    //详细数据筛选
                    if(detailBool){
                    	$scope.newResult = [];
                    	/*
                    	 *	$scope.allResult 全部合约数据集合
                    	 *  result 指定用户下的合约数据
                    	 */
                    	var exchID = "";
                    	var productID = "";
                    	
                    	angular.forEach($scope.allResult, function (value_1, i, a) {
                    		angular.forEach(result, function (value_2, j, s) {
                        		if(value_1.att.exchID == value_2.exchID && value_1.att.productID == value_2.productID){
                        			if(productID != value_1.att.productID && productID != value_1.att.instrumentID){
                        				$scope.newResult.push(value_1);
                        				exchID = value_1.att.exchID;
                                    	productID = value_1.att.productID;
                        			}
                        		}
                        	});
                    	});
                    	$.fn.zTree.init($("#ztree2"), ztreeSetting(), $scope.newResult);
                    }
                    
                },entity.subAccountID);
                
            });
    }

    // 保存交易品种
    $scope.savePinzhong = function (subAccount) {
    	if(undefined == subAccount.subAccountID){
    		layer.msg("请选择资产单元",{icon:2});
    		return ;
    	}
    	
    	
        $scope.subCapitalAccountTradingLimitService.savePinzhong(function (result) {
            layer.msg("保存交易品种成功",{icon:1});
            $("#myModalUpdate").modal("hide");
            $("#myModalInsert").modal("hide");
            
            $scope.subCapitalAccountTradingLimitService.findAllTradingLimit(function(result){
            	$scope.listEntitys = result;
                $scope.$apply();
            });
            
            // 查询已经设置了品种限制的账户
            $scope.subCapitalAccountTradingLimitService.findAllSubCapitalAccountTradingLimit(function(result){
            	$scope.subCapitalAccountTradingLimitEntitys = result;
                $scope.$apply();
            });
            $scope.entitys = [];
        }, subAccount, $scope.entitys,isInsert);
    };

    $scope.delete = function (entity) {
    	layer.confirm("确定删除交易品种？",{icon:3},function(){
    		 $scope.subCapitalAccountTradingLimitService.delete(function(result){
    	              layer.msg("删除交易品种成功！",{icon:1});
    	              $scope.subCapitalAccountTradingLimitService.findAllSubCapitalAccountTradingLimit(function(result){
    	              	$scope.subCapitalAccountTradingLimitEntitys = result;
    	              	 $scope.$apply();
    	              });
    	              
    	              $scope.subCapitalAccountTradingLimitService.findAllTradingLimit(function(result){
    	              	$scope.listEntitys = result;
    	                  $scope.$apply();
    	              });
    	              
    	        },entity.subAccountID);
        });
    }

    // 复制
    $scope.copy = function(sourceSubAccount,targetSubAccount){
        if(sourceSubAccount.subAccountID == targetSubAccount.subAccountID){
            layer.msg("源客户号与目的客户号不能相同",{icon:2});
            return;
        }

        layer.confirm("复制将清除目的客户号"+targetSubAccount.subAccountID+"的原设置信息，是否继续？",{icon:3},function(){
            $scope.subCapitalAccountTradingLimitService.copy(function (result) {
                    layer.msg("复制成功",{icon:1});
                    
                    $scope.subCapitalAccountTradingLimitService.findAllSubCapitalAccountTradingLimit(function(result){
    	              	$scope.subCapitalAccountTradingLimitEntitys = result;
    	              	 $scope.$apply();
    	              });
    	              
    	              $scope.subCapitalAccountTradingLimitService.findAllLimit(function(result){
    	              	$scope.listEntitys = result;
    	                  $scope.$apply();
    	              });
                    
                    $("#copyModal").modal("hide");
            },sourceSubAccount,targetSubAccount);
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
    
    //保存合约
    $scope.addCheck = function(flag,entity){
    	if(flag) {
    		 $scope.entitys.push(entity);
		} else {
			angular.forEach($scope.entitys, function (value, index, arrays) {
				if(entity.att.productID == value.att.instrumentID){
					var i = $scope.entitys.indexOf(value);
					$scope.entitys.splice(i, 1);
				}
			});
		}
    }
    
    //保存品种
    $scope.addCheckAll = function(flag){
    	
    	if(flag) {
    		 $scope.products.push($scope.heYue);
    		 $scope.entitys.push($scope.heYue);
		} else {
			angular.forEach($scope.entitys, function (value, index, arrays) {
				if($scope.heYue.att.productID == value.att.instrumentID){
					var i = $scope.entitys.indexOf(value);
					$scope.entitys.splice(i, 1);
					i = $scope.products.indexOf(value);
					$scope.products.splice(i, 1);
					//$scope.isChecked = "1";
				}
			});
		}
    }
    
    function ztreeSetting(){
    	return setting = {
    	        check: {
    	            enable: true,
    	            chkStyle: "radio",
    	            radioType: "all",
    	    		chkboxType: { "Y": "", "N": "" },
    	    		autoCheckTrigger: true

    	        },
    	        view: {
    	        	showIcon: false
    	        },
    	        data: {
    	            simpleData: {
    	                enable: true,
    	                idKey: "tree_id",
    	                pIdKey: "tree_fid",
    	                rootPId: "0"
    	            }
    	        },
    	        callback: {
    	            onCheck: check
    	            
    	        }

    	    };
    };
    
    function check(){
    	$scope.allChecked = false; //不让全部checkbox被选中
    	$scope.isChecked = "1";
    	/*$(".empty").empty(); //清空合约li标签*/
    	var treeObj = $.fn.zTree.getZTreeObj("ztree2");
    	var nodes = treeObj.getCheckedNodes(true);
    	$scope.radioValue.push(nodes);
    	var entity = new Object();
    	$scope.heYue = {};
    	angular.forEach(nodes, function (value, index, arrays) {
            if (value != 0) {
                entity.productID = value.att.productID;
                entity.exchID = value.att.exchID;
                $scope.heYue = value;
            }
        });
    	if(undefined == entity.productID){
    		return ;
    	}
    	var map = new Object();
    	
    	if(!bool){
    		map.flag = "0";  
    	} else {
    		map.flag = "1";
    		map.subAccountID = $scope.subAccount.subAccountID;
    	}
    	
    	if(detailBool){
    		map.flag = "2";
    		map.subAccountID = $scope.subAccount.subAccountID;
    	}
    	
    	//查询当前品种下的合约
    	$scope.instrumentService.getInstrument(function(result){
    		 $scope.nResult = [];
    		 angular.forEach(result, function (value, index, arrays) {
    			 	//当只选中品种时，保存的时候合约代码保存为品种代码
    			 	if(value.att.instrumentID != "0"){
    			 		$scope.nResult.push(value);
    			 	}
    			 	//当查询详细信息时，判断allBool是否为0，如果为0则选中全部
    			 	if(detailBool && value.att.allBool == "0"){
    			 		$scope.allChecked = true;
    			 		//$scope.isChecked = "0";
    			 	}
		     });
    		 /*$scope.instrumentEntitys =  $scope.nResult;
    		 $scope.$apply();*/
    		 $scope.instrumentEntitys =  $scope.nResult;
    		 $scope.$apply();
    		// if(bool){
    			 isChecked($scope.instrumentEntitys);
//    		 } else {
//    			 $scope.instrumentEntitys =  $scope.nResult;
//        		 $scope.$apply();
//    		 }
    		 
    		 //当点击更新的按钮
    		 if(bool){
    			 //将默认选中的值push
    			 angular.forEach(result, function (value, index, arrays) {
    		            if (value.att.bool == "0") {
    		            	//$scope.entitys.push(value);
    		            }
    		            if(value.att.allBool == "0"){
    		            	$scope.allChecked = true;
    		            	//$scope.isChecked = "0";
    		            	//$scope.entitys.push(value);
    		            	//$scope.products.push(value);
    		            }
    		            $scope.$apply();
    		        });
    		 }
    	},entity,map);
    	
    	
    }
    
    //当用户来回选择时，默认勾选之前的选择项
    function isChecked(nResult){
    	
    	//checkbox选中的对象集合
    	var checkedEntitys = $scope.entitys;
    	//所有合约对象集合
    	var heYueEntitys = nResult;
    	$scope.newResult = [];
    	//循环checkbox选中的对象集合
    	if(checkedEntitys.length > 0){
    		angular.forEach(checkedEntitys, function (c, cIndex, cs) {
        		//循环所有合约对象集合
        		angular.forEach(heYueEntitys, function (h, hIndex, hs) {
        			if(undefined != c.att){
        				if(c.att.exchID == h.att.exchID && c.att.productID == h.att.productID && c.att.instrumentID == h.att.instrumentID){
                        	heYueEntitys[hIndex].att.bool = "0";
                        }
        			}
       	     	});
    	     });
    	}
    	
    	if($scope.products.length > 0){
    		$scope.allChecked = false;
    		angular.forEach($scope.products, function (h, hIndex, hs) {
                if($scope.heYue.att.exchID == h.att.exchID && $scope.heYue.att.productID == h.att.productID){
                	//$scope.isChecked = "0";
                	//$scope.allChecked = true;
                	//return ;
                } else {
                	//$scope.isChecked = "1";
                	$scope.allChecked = false;
                }
    	     });
    	}
    	
    	$scope.allChecked = false;
    	    	
    	$scope.instrumentEntitys = heYueEntitys;
    	$scope.$apply();
    }
});
