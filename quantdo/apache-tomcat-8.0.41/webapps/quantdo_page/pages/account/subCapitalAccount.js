myapp.controller('SubCapitalAccountController', function ($scope, $timeout, $rootScope,$route) {
	$scope.businessGroupService = new com.quantdo.orgClear.service.BusinessGroupManageService();
	$scope.subAccountGroupIDs = [];
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$scope.fundWorkFlowService = new com.quantdo.orgClear.service.FundWorkFlowService();
    $scope.subCapitalAccountProcessService = new com.quantdo.orgClear.service.subCapitalAccountProcessService();
    $scope.CapitalAccountService = new com.quantdo.orgClear.service.CapitalAccountService();
	
    // 初始化页面参数
    $scope.modalSelects = [
        {text: '是', key: '1'},
        {text: '否', key: '0'}
    ];
    $scope.queryEntity = {};
    $scope.subCapitalAccountEntitys = [];
    $scope.queryEntitys = [];
    $scope.tmpSubCapitalAccount = {};
    $scope.capitalAccountEntitys = [];
    $scope.SubCapitalAccountEntitys = [];
    $scope.tempEntity = {};
    $scope.tempEntity.recordIndex = -1;
    $scope.modalEntity = {};
    $scope.traderEntitys = [];
    $scope.radio = {};
    $scope.activeAccEntitys = [];

    $scope.trader = {};
    $scope.traderInfo = {};
    $scope.positionTypes = clearConstant.positionTypes;
    $scope.currencys = clearConstant.currenys;
    $scope.linkAccountTypes=clearConstant.linkAccountType;
    $scope.marketTypes = clearConstant.marketType;
	$scope.SubCapitalAccountDataset = [];
    //初始化基金产品下拉列表
    $scope.fundProductTems=[];
	findFundProduct(function (result) {
    	$scope.fundProductTems=result;
    	$scope.$apply();
    },{linkAccountType:$scope.linkAccountTypes[1].key});
	
	// 按钮权限
	$scope.subCapitalAccount_query = isShow("subCapitalAccount_query");
	$scope.subCapitalAccount_add = isShow("subCapitalAccount_add");
	$scope.subCapitalAccount_startOrCancel = isShow("subCapitalAccount_startOrCancel");
	$scope.subCapitalAccount_update = isShow("subCapitalAccount_update");

	//定义固定列头
    $scope.SubCapitalAccount_columns = [
        {title: "序号"},
        {title: "资产单元"},
        {title: "资产单元名称"},
        {title: "联系电话"},
        {title: "基金产品名称"},
        {title: "基础币种"},
        {title: "持仓类型",visible:false},
        {title: "所属业务组"},
        {title: "所属业务组ID",visible:false},
        {title: "对应资金账号"},
        {title: "状态"},
        {title: "备注"},
		{title: "操作"},
        {title: "跟随父帐号费率",visible:false}

	];
    
    $scope.hideFundProduct = false;
    isHideFundProduct(function(result){
    	$scope.hideFundProduct = result;
    	if(result == true){
    		//定义固定列头
    	    $scope.SubCapitalAccount_columns = [
    	        {title: "序号"},
    	        {title: "资产单元"},
    	        {title: "资产单元名称"},
    	        {title: "联系电话"},
    	        {title: "基金产品名称",visible:false},
    	        {title: "基础币种"},
    	        {title: "持仓类型",visible:false},
    	        {title: "所属业务组"},
    	        {title: "所属业务组ID",visible:false},
    	        {title: "对应资金账号"},
    	        {title: "状态"},
    	        {title: "备注"},
    			{title: "操作"},
    	        {title: "跟随父帐号费率",visible:false}
    		];
    	}
    	
    	$scope.SubCapitalAccountTable = $('#SubCapitalAccount_dynamic_table').DataTable( {
    		data : $scope.SubCapitalAccountDataset,
        	columns :$scope.SubCapitalAccount_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: []
    	});
    	
    	$scope.$apply();
    	$scope.find();
    });

    /**************获得业务组***************/
   /* $scope.getBusinessGroup = function(){*/
    	$scope.subAccountGroupIDs = [];
    	$scope.businessGroupService.getBusinessGroup(function(result){
    		if(result){
    			for(var i=0;i<result.length;i++){
                    result[i].subAccountGroupID = result[i].id;
				}
    			$scope.subAccountGroupIDs = result;
    		}
    		$scope.$apply();
    		
    		/*$("#subbusinessGroup").select2({
    		    data:$scope.subAccountGroupIDs,
    		    minimumResultsForSearch: -1//去掉搜索框
    		});*/
    	});
/*    }
    $scope.getBusinessGroup();*/
    
    // 初始化客户号下拉列表
    getAllTraderEntity(function (result) {
        $scope.queryEntitys =result;
        $scope.traderEntitys = result;
        $scope.$apply();
    },null);
    
    // 持仓类型名称转换
    $scope.transPositionType = function (key) {
    	for(var i = 0;i < $scope.positionTypes.length; i++){
    		if($scope.positionTypes[i].key == key){
    			return $scope.positionTypes[i].text;
    		}
    	}
    }
    
    // 转换币种
    $scope.transCurrencys = function (key){
    	var count = $scope.currencys.length;
        for (var i = 0; i < count; i++) {
            if ($scope.currencys[i].key == key) {
                return $scope.currencys[i].text;
            }
        }
    }

    // 转换允许交易市场类型
    $scope.transMarketTypes = function (text){
        var count = $scope.marketTypes.length;
        for (var i = 0; i < count; i++) {
            if ($scope.marketTypes[i].key == text) {
                return $scope.marketTypes[i].text;
            }
        }
    }
    
    // 重置表单验证信息
	function formValidateReset() {
		$scope.myForm.traderID.$setPristine();
		$scope.myForm.traderName.$setPristine();
		$scope.myForm.subAccountID.$setPristine();
		$scope.myForm.currency.$setPristine();
        $scope.myForm.accountGroupID.$setPristine();
        $scope.myForm.subAccountGroupID.$setPristine();
	}

    // 初始化页面记录
	getTraderDetailList(function (result) {
        $scope.subCapitalAccountEntitys = result;
        $scope.$apply();
    },{});

    // 查询所有经济公司代码
    getAllBrokerageFirmEntity(function (result) {
        $scope.brokerages = result;
        $scope.$apply();
    })

    // 页面经济公司名称转换
    $scope.transBrokerageFirm = function (text) {
        var count = $scope.brokerages.length;
        for (var i = 0; i < count; i++) {
            if ($scope.brokerages[i].brokerageFirmID == text) {
                return $scope.brokerages[i].brokerageFirmName;
            }
        }
    };

	/*// 资金帐号组
	getAllSubCapitalAccountsEntity(function (result) {
        $scope.SubCapitalAccountEntitys = result;
        $scope.$apply();
    });*/

    /*// radio按键时触发
    $scope.changeState = function (){
		if($scope.radio.selected=="1"){
			$scope.isSelected2=true;
			$scope.isSelected1=false;
		}
		if($scope.radio.selected=="2"){
			$scope.isSelected1=true;
			$scope.isSelected2=false;
		}
	}*/
	$("body").undelegate("#SubCapitalAccount_dynamic_table_wrapper td .update-row","click");
    //表格修改事件
    $("body").delegate("#SubCapitalAccount_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.SubCapitalAccountTable.row(mytr).data();
        var id = tempArr[0];
        var traderID = tempArr[1];
        var traderName = tempArr[2];
        var innerAccountID = tempArr[9];
        var isActive = $scope.revTransActiveDesc(tempArr[10]);
        var subGroupID = tempArr[8];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(traderID==$scope.listEntitys[i].traderID && traderName==$scope.listEntitys[i].traderName
        		&& innerAccountID==$scope.listEntitys[i].innerAccountID && isActive==$scope.listEntitys[i].isActive	){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.isReBuild = false;
        $scope.initUpdateParam(id,$scope.modalEntity);
    });
    $("body").undelegate("#SubCapitalAccount_dynamic_table_wrapper td .delete-row","click");
        //表格注销事件
    $("body").delegate("#SubCapitalAccount_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.SubCapitalAccountTable.row(mytr).data();
        var traderID = tempArr[1];
        var traderName = tempArr[2];
        var innerAccountID = tempArr[9];
        var isActive = $scope.revTransActiveDesc(tempArr[10]);
        var id = tempArr[0];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(traderID==$scope.listEntitys[i].traderID && traderName==$scope.listEntitys[i].traderName
        		&& innerAccountID==$scope.listEntitys[i].innerAccountID && isActive==$scope.listEntitys[i].isActive	){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
       $scope.remove(id,$scope.modalEntity);
    });
    $("body").undelegate("#SubCapitalAccount_dynamic_table_wrapper td .start-row","click");
        //表格启用事件
    $("body").delegate("#SubCapitalAccount_dynamic_table_wrapper td .start-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.SubCapitalAccountTable.row(mytr).data();
        var id = tempArr[0];
        var traderID = tempArr[1];
        var traderName = tempArr[2];
        var innerAccountID = tempArr[9];
        var isActive = $scope.revTransActiveDesc(tempArr[10]);
        
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(traderID==$scope.listEntitys[i].traderID && traderName==$scope.listEntitys[i].traderName
        		&& innerAccountID==$scope.listEntitys[i].innerAccountID && isActive==$scope.listEntitys[i].isActive	){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.isReBuild = true;
        $scope.rebuild(id,$scope.modalEntity);
    });

    // 根据页面条件查询
    $scope.find = function () {  	
    	$scope.isQuery = true;
		$scope.SubCapitalAccountDataset = [];
		$scope.listEntitys = [];
		getTraderDetailList(function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			//$scope.queryEntitys =result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator1  = "";
				if($scope.subCapitalAccount_update){
					operator1 = operator1.concat("<a class='update-row' data-toggle='modal'>修改</a>");
				}
				var operator2 = $scope.transActive(con[i].isActive);  
		    	var tempArr = [(i+1),con[i].traderID,con[i].traderName,con[i].telephone,$scope.transFundProducts(con[i].instClientID,con[i].fundProductID),$scope.transCurrencys(con[i].currency),$scope.transPositionType(con[i].positionType)
		    	               ,con[i].subAccountGroupName,con[i].subAccountGroupID
		    	               ,con[i].innerAccountID,$scope.transActiveDesc(con[i].isActive),con[i].address,operator1+operator2,con[i].followAccount]

		    	$scope.SubCapitalAccountDataset.push(tempArr); 
		    	con[i].index = i+1;
			}
			$scope.listEntitys = con;
			//$scope.queryEntitys =con;
			//重新绘表
	        $scope.SubCapitalAccountTable.clear().draw();
	        $scope.SubCapitalAccountTable.rows.add($scope.SubCapitalAccountDataset).draw();
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		},$scope.queryEntity);
    };
    /*$timeout(function() {
    	$scope.find(); 
     }, 500);*/
    
    // 转换基金产品
    $scope.transFundProducts = function (instClientID,fundProductID){
    	var result = "";
    	var count = $scope.fundProductTems.length;
    	if(instClientID!=null&&instClientID!=undefined&&fundProductID!=null&&fundProductID!=undefined){
    		 for (var i = 0; i < count; i++) {
            	 if ($scope.fundProductTems[i].instClientID == instClientID && $scope.fundProductTems[i].fundProductID == fundProductID) {
            		 result = $scope.fundProductTems[i].fundProductName;
                 }
            }
    	}
       return result;
    }
    
    //改变状态显示
    $scope.transActiveDesc = function(isActive){
    	var result = "";
    	if(isActive==0){
    		result = "注销"; 
    	}else if(isActive==1){
    		result = "启用"; 
    	}
    	return result;
    }
    $scope.revTransActiveDesc = function(isActive){
    	var result = "";
    	if(isActive=="注销"){
    		result = 0; 
    	}else if(isActive=="启用"){
    		result = 1; 
    	}
    	return result;
    }
    
    //改变状态显示
    $scope.transActive = function(isActive){
    	var result = "";
    	if(isActive==0 && $scope.subCapitalAccount_startOrCancel){
    		result = "<a class='start-row'>启用</a>"
    	}else if(isActive==1 && $scope.subCapitalAccount_startOrCancel){
    		result = "<a class='delete-row'>注销</a>"
    	}
    	return result;
    }
    
    // 注销
    $scope.remove = function (index, entity) {
    	$scope.fundWorkFlowService.validateLinkAccount(function(result){
			if(result != null && result.length > 0){
				layer.msg("该资产单元有对应工作流配置，无法注销",{icon : 2});
				return false;
			}else{
		        layer.confirm('确定注销此账户？', {icon: 3}, function (count) {
			        //1.	校验资金账号资金情况
			        findInvestorAccountByBroAndAccountID (function (result) {
				        if(result.length > 0){
				        	  layer.msg("资产单元权益不为0，不允许注销", {icon: 2, time: 3000});
				              return false;
				        }else {
				            //2.	校验资金账号持仓情况
				        	 findByBroAndAccountID(function (result) {
			        	          if(result.length > 0){
			        	        	  layer.msg("资产单元还有持仓，不允许注销", {icon: 2, time: 3000});
			        	              return false;
			        	          }else {
			        	        	   	//1）	删除资金账户与用户的对应关系
		      	                	  deleUserAccBySubInnAccId(function (resultInt) {
			      	                		  if(resultInt > 0){
			      	                			  	return false;
			      	                		  }else{
				      	                			updateTraderIsActive(function(result){
						      	                		  $scope.find();
						  	        	                  layer.close(count);
						  	        	                  $scope.subCapitalAccountEntitys.splice(index, 1, result);
						  	        	                  $scope.$apply();
						  	        	              },"0",entity.traderID);
			      	                		  }
		  	                           }, entity.traderID);
			        	          }
				        	 },{
				               	accountID: entity.traderID
				             });
				        }	
			        },{
			          	accountID: entity.traderID
			        });	
		        });
			}
		},{
			innerAccountID: entity.traderID
		});
    	
    };

    // 恢复
    $scope.rebuild = function (index, entity) {
//    	findTrader(function(result){
//    		if(result.length > 0){
//    			if(result[0].traderID == entity.traderID
//    					&&result[0].isActive == 1){
    				layer.confirm('确定重新启用该账户？', {icon: 3}, function (count) {
//    		            entity.isActive = '1';
                        $scope.initUpdateParam(index,entity);
                        layer.close(count);
    		        });
//    			}else{
//    				layer.msg("对应资产单元已销户，无法重新启用该资产单元", {icon: 2, time: 3000});
//    				return false;
//    			}
//    		}
//    	},{traderID: entity.traderID});
    };


    // 初始化模态
    $scope.initParameter = function () {
        $scope.modalEntity = {};
        
//        $scope.radio = {};
        $scope.modalEntity.positionType = $scope.positionTypes[1].key;
        $scope.modalEntity.currency=  $scope.currencys[0].key;
//        $scope.tmpSubCapitalAccount={};
//        $scope.tmpSubCapitalAccount.innerAccountID = $scope.capitalAccountEntitys[0].innerAccountID;
        $scope.traderInfo={};
        $scope.trader={};
//        $scope.radio.selected="1";
//        $scope.isChecked1=true;
//        $scope.isChecked2=false;
//        $scope.isSelected1=false;
//		$scope.isSelected2=true;
        $scope.isUpdate = false;
        formValidateReset();
        // $("#subbusinessGroup").val([]).select2({minimumResultsForSearch: -1});
        // 当前机构有效资金帐号
    	findActiveCapitalAccount(function (result) {
            $scope.lCapEntitys = angular.copy(result);
            $scope.activeAccEntitys = angular.copy(result);

            $scope.rCapEntitys = [];
            $scope.$apply();
        });
    	findFundProduct(function (result) {
        	$scope.fundProductTems=result;
        	$scope.$apply();
        },{linkAccountType:$scope.linkAccountTypes[1].key});
    	$scope.trader.traderName = "";
    	// 重绘模态框位置
    	$('#subCapitalAccountModal').on('show.bs.modal', function (e) {
            /*$(this).find('.modal-dialog').css({
                'margin-top': function () {
                    var modalHeight = $('#subCapitalAccountModal').find('.modal-content').height();
                    return ($(window).height() / 2 - modalHeight / 2);
                }
            });*/
            
            $(this).find('.modal-dialog').css({
                'margin-left': function () {
                    var modalWidth = $('#subCapitalAccountModal').find('.modal-content').width();
                    return ($(window).width() / 2 - modalWidth / 2);
                }
            });
        });
    };

    $scope.subCapitalAccountProcessService.queryInstClientID(function(result) {
        $scope.instClientID = result;

        // 获取资金账户组信息
        $scope.accountGroupIDs = [];
        getActiveAccountGroupsByInstClientId(function(result){
            $scope.accountGroupIDs = result;
            $scope.$apply();
        },$scope.instClientID);
    });

    $scope.getCapitalAccountByAccountGroup = function (accountGroupID) {
        $scope.arrayGroupMapsTem=[];
        if(accountGroupID != "" && accountGroupID != null){
            $scope.CapitalAccountService.getCapitalAccountByAccountGroup(function (result) {
                $scope.rCapEntitys = result;
                $scope.$apply();
            },$scope.instClientID,accountGroupID);
        }else{
            $scope.rCapEntitys = [];
            $scope.$apply();
        }
    };

    // 修改初始化信息
    $scope.initUpdateParam = function (index, entity) {
    	if(entity.isActive == 0 && $scope.isReBuild == false){
    		$scope.subCapitalAccountTarget = "";
    		layer.msg("此资产单元已销户，不允许修改",{icon: 2, time: 2000});
    	}else{
    		//$scope.subCapitalAccountTarget = "#subCapitalAccountModal";
    		$("#subCapitalAccountModal").modal("show");
    		$scope.trader = {};
    		$scope.traderInfo = {};
    		$scope.trader.traderID = entity.traderID;
    		$scope.trader.traderName = entity.traderName;
    		$scope.traderInfo.telephone = entity.telephone;
    		$scope.traderInfo.address = entity.address;
//    		$scope.radio = {};
            $scope.tempEntity = angular.copy(entity);
            $scope.tempEntity.recordIndex = index;
            $scope.modalEntity = angular.copy($scope.tempEntity);
            findFundProduct(function (result) {
            	$scope.fundProductTems=result;
            	$scope.$apply();
            },{instClientID:$scope.modalEntity.instClientID,linkAccountType:$scope.linkAccountTypes[1].key});
            
            deleteSelect();
            $scope.lCapEntitys = [];
            $scope.rCapEntitys = [];
            //初始化业务组
            // $("#subbusinessGroup").val(entity.subAccountGroupID.split(",")).select2({minimumResultsForSearch: -1});
            // 当前机构有效资金帐号
        	findActiveCapitalAccount(function (result) {
                $scope.activeAccEntitys=angular.copy(result);

        		if(entity.innerAccountID == undefined || entity.innerAccountID.trim() == ''){
        			$scope.lCapEntitys = angular.copy(result);
                }else{
                	var accounts = entity.innerAccountID.split(',');
                	var followAccounts = entity.followAccount.split(',');
                    for(var i = 0;i < result.length;i++){
                    	for(var j = 0;j < accounts.length;j++){
                    		if(result[i].innerAccountID == accounts[j]){
                    			if(followAccounts[j] == "1"){
                    				result[i].followAccount= true;
                    			}else{
                    				result[i].followAccount= false;
                    			}
                    			$scope.rCapEntitys.push(result[i]);
                    			break;
                    		}
                    		if(j == accounts.length - 1){
                    			$scope.lCapEntitys.push(result[i]);
                    		}
                    	}
                    }
                }
                $scope.$apply();
            });
            
            
//            if($scope.modalEntity.innerAccountID!=null){
//            	$scope.tmpSubCapitalAccount.innerAccountID = $scope.modalEntity.innerAccountID;
//            	$scope.radio.selected="1";
//            	$scope.isChecked1=true;
//            	$scope.isChecked2=false;
//            	$scope.isSelected1=false;
//    			$scope.isSelected2=true;
//            }
//            if($scope.modalEntity.SubCapitalAccountID!=null){
//            	$scope.tmpSubCapitalAccount.SubCapitalAccountID = $scope.modalEntity.SubCapitalAccountID;
//            	$scope.radio.selected="2";
//            	$scope.isChecked1=false;
//            	$scope.isChecked2=true;
//            	$scope.isSelected1=true;
//    			$scope.isSelected2=false;
//            }
            $scope.isUpdate = true;
    	}
    };

    $scope.save = function (trader,traderInfo,entity) {
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        entity.subAccountID = trader.traderID;
        
        if($scope.rCapEntitys == undefined || $scope.rCapEntitys.length < 1){
        	layer.msg("不可绑定资金账户为空的账户组！",{icon: 2});
        	return false;
        }
        
        entity.innerAccountID = "";
        for(var i=0;i<$scope.rCapEntitys.length-1;i++){
        	entity.innerAccountID = entity.innerAccountID + $scope.rCapEntitys[i].brokerageFirmID + $scope.rCapEntitys[i].accountID + ",";
        }
        entity.innerAccountID = entity.innerAccountID + $scope.rCapEntitys[i].brokerageFirmID + $scope.rCapEntitys[i].accountID;
        
        //获得业务组
        /*var businessGroup = $("#subbusinessGroup").val();
        var subAccountGroupID = "";
        if(businessGroup != undefined && businessGroup != null && businessGroup != "" && businessGroup.length>0){
        	for(var k=0;k<businessGroup.length;k++){
        		subAccountGroupID = subAccountGroupID=="" ? businessGroup[k]:subAccountGroupID+","+businessGroup[k];
        	}
        }
        entity.subAccountGroupID = subAccountGroupID;*/
//        // 选择对应资金帐号
//    	if($scope.radio.selected=="1"){
//    		entity.innerAccountID = $scope.tmpSubCapitalAccount.innerAccountID;
//    		entity.SubCapitalAccountID = null;
//    	}
//    	// 选择对应资金帐号组
//    	else if($scope.radio.selected=="2"){
//		entity.SubCapitalAccountID = $scope.tmpSubCapitalAccount.SubCapitalAccountID;
//		entity.innerAccountID =null;
//    	}
        // 新增
        if (index == undefined) {
        	// 判断信息是否重复
        	findSubCapitalEntity(function (result) {
        		if (result.length > 0) {
                    layer.msg("此资产单元已存在", {icon: 2, time: 3000});
                    return false;
                }else{
                	 entity.isActive = "1";
					 saveSubCapitalAcc(function (res) {
						 res.traderName = res.subAccountName;
						 $scope.queryEntitys.unshift(res);
						 $scope.find();
						 // 关闭窗口
	                     layer.msg("新增成功",{icon: 1});
	                     
						 $("#subCapitalAccountModal").modal("hide");
					 },trader,traderInfo, entity, $scope.rCapEntitys);
                }
        	}, {
        		subAccountID: entity.subAccountID
            });
        // 修改
        } else {
        	var tmpEntity = {};
        	tmpEntity.traderID = trader.traderID;
        	tmpEntity.traderName = trader.traderName;
        	tmpEntity.telephone = traderInfo.telephone;
        	tmpEntity.address = traderInfo.address;
        	tmpEntity.currency = entity.currency;
        	tmpEntity.positionType = entity.positionType;
        	tmpEntity.fundProductID = entity.fundProductID;
        	tmpEntity.innerAccountID = entity.innerAccountID;
            tmpEntity.accountGroupID = entity.accountGroupID;
        	//获得业务组
            /*var businessGroup = $("#subbusinessGroup").val();
            var subAccountGroupID = "";
            if(businessGroup != undefined && businessGroup != null && businessGroup != "" && businessGroup.length>0){
            	for(var k=0;k<businessGroup.length;k++){
            		subAccountGroupID = subAccountGroupID=="" ? businessGroup[k]:subAccountGroupID+","+businessGroup[k];
            	}
            }*/
            tmpEntity.subAccountGroupID = entity.subAccountGroupID;
//        	tmpEntity.SubCapitalAccountID = entity.SubCapitalAccountID;
        	findFundProduct(function (result) {
            	$scope.fundProductTems=result;
            	$scope.$apply();
            },{linkAccountType:$scope.linkAccountTypes[1].key});
            updateTraderDetail(function(result){
            	if(result != null){
            		if($scope.isReBuild == true){
                        updateTraderIsActive(function(result){
                            layer.msg("启用成功",{icon: 1});
                            $scope.find();
                            $scope.subCapitalAccountEntitys.splice(index, 1, result);
                            $scope.$apply();
                        },"1",entity.traderID);
					}else{
                        //$scope.subCapitalAccountEntitys.splice(index, 1, result);
                        result.index = tableIndex;
                        $scope.listEntitys.splice(tableIndex-1, 1, result);
                        $scope.queryEntitys.splice(tableIndex-1, 1, result);
                        //$scope.queryEntitys = angular.copy($scope.subCapitalAccountEntitys);

                        $scope.SubCapitalAccountTable.cells().every( function () {
                            if((tableIndex-1) == this[0][0].row){
                                if(this[0][0].column == 2){
                                    this.data(result.traderName);
                                    $scope.$apply();
                                }
                                if(this[0][0].column == 3){
                                    this.data(result.telephone);
                                    $scope.$apply();
                                }
                                if(this[0][0].column == 4){
                                    this.data($scope.transFundProducts(result.instClientID,result.fundProductID));
                                    $scope.$apply();
                                }
                                if(this[0][0].column == 5){
                                    this.data($scope.transCurrencys(result.currency));
                                    $scope.$apply();
                                }
                                if(this[0][0].column == 6){
                                    this.data($scope.transPositionType(result.positionType));
                                    $scope.$apply();
                                }
                                if(this[0][0].column == 9){
                                    this.data(result.innerAccountID);
                                    $scope.$apply();
                                }
                                if(this[0][0].column == 11){
                                    this.data(result.address);
                                    $scope.$apply();
                                }
                            }

                        });
                        //$scope.find();
                        layer.msg("修改成功",{icon: 1});
					}
            	}
/*            	else{
            		layer.msg("修改失败",{icon: 2});
            	}*/
                // 关闭窗口
                $("#subCapitalAccountModal").modal("hide");
            },tmpEntity, $scope.rCapEntitys);
        }
    };
    
    // 清除所有选中状态及临时选中列表
    function deleteSelect(){
		angular.forEach($scope.lCapEntitys, function (entity, index, list) {
			entity.isSelectActive=false;
		});
		$scope.tmpLChooses = [];
		  
		angular.forEach($scope.rCapEntitys, function (entity, index, list) {
			entity.isSelectActive=false;
		});
		$scope.tmpRChooses=[];
	}
    
    // 双击加入右侧列表
	$scope.addAccount = function(index,listEntity){
		deleteSelect();
		$scope.rCapEntitys.push(listEntity);
		$scope.lCapEntitys.splice(index, 1);
	}
	
	// 双击移回左侧列表
	$scope.devedAccount = function(index,listEntity){
		deleteSelect();
		$scope.lCapEntitys.push(listEntity);
		$scope.rCapEntitys.splice(index, 1);
	}
    
	// 单击左侧单条数据,临时列表加入/移除
	$scope.tmpLChooses = [];	
	$scope.addAccountSelect = function(index,entity){
		if(entity.isSelectActive == false || entity.isSelectActive == undefined){
			$scope.tmpLChooses.push(entity);
			entity.isSelectActive = true;
		}else{
			var i = $scope.tmpLChooses.indexOf(entity);
			$scope.tmpLChooses.splice(i, 1);	
			entity.isSelectActive = false;
		}
	}
	
	// 单击右侧单条数据,临时列表加入/移除
	$scope.tmpRChooses = [];	
	$scope.devedAccountSelect = function(index,entity){
		if(entity.isSelectActive == false || entity.isSelectActive == undefined){
			$scope.tmpRChooses.push(entity);
			entity.isSelectActive=true;
		}else{
			var i = $scope.tmpRChooses.indexOf(entity);
			$scope.tmpRChooses.splice(i, 1);	
			entity.isSelectActive=false;
		}
	}
    
	// > 按钮事件
	$scope.addSelectAccounts = function(){
        angular.forEach($scope.tmpLChooses, function (entity, index, list) {
        	var i = $scope.lCapEntitys.indexOf(entity);
        	$scope.lCapEntitys[i].isSelectActive = false;
			$scope.lCapEntitys.splice(i, 1);
            $scope.rCapEntitys.push(entity);
        });
        $scope.tmpLChooses = [];    
    }
	
	// < 按钮事件
	$scope.deleteSelectAccounts = function(){
        angular.forEach($scope.tmpRChooses, function (entity, index, list) {
        	var i = $scope.rCapEntitys.indexOf(entity);
        	$scope.rCapEntitys[i].isSelectActive = false;
            $scope.rCapEntitys[i].followAccount = false;

			$scope.rCapEntitys.splice(i, 1);
            $scope.lCapEntitys.push(entity);

        });
        $scope.tmpRChooses=[]; 
    }
	
	// >> 按钮事件
	$scope.addAllAccounts = function(){
    	deleteSelect();
        angular.forEach($scope.lCapEntitys, function (entity, index, list) {
            $scope.rCapEntitys.push(entity);
        });
        $scope.lCapEntitys = [];
	}
	
	// << 按钮事件
	$scope.deleteAllAccounts = function(){
    	deleteSelect();
        angular.forEach($scope.rCapEntitys, function (entity, index, list) {
            entity.followAccount = false;
        	$scope.lCapEntitys.push(entity);
        });
        $scope.rCapEntitys = [];
	}
	
	/*//初始化
    $(document).ready(function() {
		    	//会话列表初始化
		    	$scope.SubCapitalAccountTable = $('#SubCapitalAccount_dynamic_table').DataTable( {
			    		data : $scope.SubCapitalAccountDataset,
			        	columns :$scope.SubCapitalAccount_columns,
			            dom: 'rt<"bottom"iplB>',
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: []
		        } );
      });*/
    //交易通道复选框事件
    $scope.changeStates = function(rCapEntitys,rEntity){
    	//是去除还是添加    	
    	if(rEntity.followAccount){
    		//是否是第一个账号的
        	if(rCapEntitys.length>1){
        		var accountList =[];
        		for(var j = 0;j < rCapEntitys.length;j++){
            		if(rCapEntitys[j].followAccount == true){
            			accountList.push(rCapEntitys[j].innerAccountID);
            		}	
            	}
        		
        /*		for(var i = 0;i < rCapEntitys.length;i++){
            		if(rEntity.innerAccountID == rCapEntitys[i].innerAccountID){
            			var num = i;
            		}
            	}*/
        		//如果accountList >1 需要判断市场
        		if(accountList.length > 1){
        			//如果同一个市场，不允许勾选，同时提示
        			//rEntity.innerAccountID 属于哪个市场
        			var market ="";
        			for(var i = 0;i < $scope.activeAccEntitys.length;i++){
                		if(rEntity.innerAccountID == $scope.activeAccEntitys[i].innerAccountID){
                			market = $scope.activeAccEntitys[i].market;
                		}
                	}
        			//再次遍历accountList
        			for(var i = 0;i <accountList.length;i++){
        				var innerAccountID = accountList[i];
                		if(rEntity.innerAccountID != innerAccountID){
                			for(var ii = 0;ii < $scope.activeAccEntitys.length;ii++){
                        		if(innerAccountID == $scope.activeAccEntitys[ii].innerAccountID){
                        			var marketTwo = $scope.activeAccEntitys[ii].market;
                        			if(marketTwo == market){
                        				rEntity.followAccount = false;
                                		layer.msg("同一个市场不允许勾选多个！",{icon: 2});
                                		//$($(".checkbox_followAccount")[num]).removeAttr("checked");
                        			}
                        		}
                        	}
                		}
                	}
        		}
        	}
    	}
    }
});

