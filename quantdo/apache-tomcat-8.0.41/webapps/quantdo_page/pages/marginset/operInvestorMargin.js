myapp.controller('operInvestorMarginController', function ($scope, $timeout,$rootScope) {
	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    $scope.queryEntity = {};
    $scope.ModalEntity = {};
    $scope.notClick=false;
    $scope.isMainBroker = false;
    $scope.hedgeFlags = clearConstant.tradeTypes;
    
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
    
    $scope.instClientService = new com.quantdo.orgClear.service.instClientService();
    $scope.marginService = new com.quantdo.orgClear.service.OperInvestorMarginService();
    $scope.subAccountService = new com.quantdo.orgClear.service.SubCapitalAccountService();
    
    $scope.exchangeDatas = [];
    $scope.operInvestorMarginDataset = [];
    
    $scope.operInvestorMargin_add = isShow("operInvestorMargin_add");
    $scope.operInvestorMargin_query = isShow("operInvestorMargin_query");
    $scope.operInvestorMargin_update = isShow("operInvestorMargin_update");
    
    //定义固定列头
      $scope.operInvestorFxMargin_column = [
             {title: "序号"},
             {title: "所属机构"},
             {title: "资产单元"},
             {title: "资产单元名称"},
             {title: "交易所代码"},
             {title: "品种/合约代码"},
             {title: "投保标志"},
             {title: "多头按金额"},
             {title: "多头按手数"},
             {title: "空头按金额"},
             {title: "空头按手数"},
   	  	     {title: "操作"}
       ]
      
      //定义固定列头
      $scope.operInvestorZjMargin_column = [
             {title:"序号"},
             {title: "所属机构"},
             {title: "资金账号"},
             {title: "资金账号名称"},
             {title: "交易所代码"},
             {title: "品种/合约代码"},
             {title: "投保标志"},
             {title: "多头按金额"},
             {title: "多头按手数"},
             {title: "空头按金额"},
             {title: "空头按手数"},
   	  	     {title: "操作"}
       ]
    
    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
    	$scope.$apply();
    });
    
    //初始化页面信息
    $scope.marginService.getfindAll(function (result) {
        $scope.listEntitys = result;
    	$scope.$apply();
    });
    
    $scope.transHedgeFlag = function(key){
    	for(var i = 0;i < $scope.hedgeFlags.length;i++){
    		if($scope.hedgeFlags[i].key == key){
    			return $scope.hedgeFlags[i].text;
    		}
    	}
    }
    $scope.revTransHedgeFlag = function(text){
    	for(var i = 0;i < $scope.hedgeFlags.length;i++){
    		if($scope.hedgeFlags[i].text == text){
    			return $scope.hedgeFlags[i].key;
    		}
    	}
    }
    
    //查询是否属于机构
    queryInstClientID(function (result) {
        if(result != undefined ){
        	$scope.isMainBroker = false;
        	$scope.accountType = "资产单元";
        	$scope.isFx = true;
            // 初始化资产单元下拉列表
        	$scope.subAccountService.findAllByIsActive(function (result) {
        		$scope.accountDatas = angular.copy(pushEntitys(result,2));
        		$scope.accounts = angular.copy($scope.accountDatas);
                $scope.$apply();
            },{});
        }else{
        	$scope.isMainBroker = true;
        	$scope.accountType = "资金账号";
        	$scope.isFx = false;
        	findMainBroCapsByInst({},function (result) {
        		$scope.accountDatas = angular.copy(pushEntitys(result,1));
        		$scope.accounts = angular.copy($scope.accountDatas);
        		$scope.instClientService.findMainBrokerInst(function(result){
        	    	$scope.instDatas = result;
        	    	$scope.$apply();
        	    });
            });
        }
        $scope.$apply();
    });
    
    // 根据机构号查询主经纪商对应资金账号
    $scope.getQueryAccounts = function(instClientID){
    	if($scope.isMainBroker){
    		findMainBroCapsByInst({
        		instClientID: instClientID
        	},function(result){
    			$scope.accountDatas = [];
    			angular.forEach(result, function (value, index, arrays) {
    				var tmpEntity = {};
					tmpEntity.investorID = value.innerAccountID;
					tmpEntity.accountName = value.accountName;
    				$scope.accountDatas.push(tmpEntity);
    			});
    			$scope.$apply();
        	});
    	}
    }
    
    function pushEntitys(accountList,accountType){
    	var desList = [];
		angular.forEach(accountList, function (value, index, arrays) {
			$scope.tmpEntitys = {};
			if(accountType == 1){		//资金账号
				$scope.tmpEntitys.investorID = value.innerAccountID;
				$scope.tmpEntitys.accountName = value.accountName;
			}else if(accountType == 2){	//资产单元
				$scope.tmpEntitys.investorID = value.subAccountID;
				$scope.tmpEntitys.accountName = value.subAccountName;
			}
			desList.push($scope.tmpEntitys);
		});
		return desList;
	}
    
/*    //查询
    $scope.find = function (queryEntity) {
        $scope.listEntitys = [];
        $scope.isQuery = true;
        var tempEntity = {};
        tempEntity = angular.copy(queryEntity);
        $scope.marginService.findByQuery(function (result) {
            $scope.listEntitys = result;
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        }, tempEntity);
    };*/
    $("body").undelegate("#operInvestorFxMargin_dynamic_table_wrapper td .update-row","click");
    //表格修改事件
    $("body").delegate("#operInvestorFxMargin_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.operInvestorFxMarginTable.row(mytr).data();
        var id = tempArr[0];
        var brokerID = tempArr[1];
        var investorID = tempArr[2];
        var exchID = tempArr[4];
        var instrumentID = tempArr[5];
        var hedgeFlag = $scope.revTransHedgeFlag(tempArr[6]);
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(brokerID==$scope.listEntitys[i].brokerID && investorID==$scope.listEntitys[i].investorID
        			&& exchID==$scope.listEntitys[i].exchID && instrumentID==$scope.listEntitys[i].instrumentID
        			&& hedgeFlag==$scope.listEntitys[i].hedgeFlag){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $timeout(function() {
        	$scope.initUpdateParam(id,$scope.modalEntity);
        }, 500);
    });
    $("body").undelegate("#operInvestorZjMargin_dynamic_table_wrapper td .update-row","click");
    $("body").delegate("#operInvestorZjMargin_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.operInvestorZjMarginTable.row(mytr).data();
        var id = tempArr[0];
        var brokerID = tempArr[1];
        var investorID = tempArr[2];
        var exchID = tempArr[4];
        var instrumentID = tempArr[5];
        var hedgeFlag = $scope.revTransHedgeFlag(tempArr[6]);
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(     brokerID==$scope.listEntitys[i].brokerID && investorID==$scope.listEntitys[i].investorID
        			&& exchID==$scope.listEntitys[i].exchID && instrumentID==$scope.listEntitys[i].instrumentID
        			&& hedgeFlag==$scope.listEntitys[i].hedgeFlag){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $timeout(function() {
        	$scope.initUpdateParam(id,$scope.modalEntity);
        }, 500);
    });
    
    // 根据页面条件查询
    $scope.find = function () {  	
    	$scope.isQuery = true;
		$scope.operInvestorMarginDataset = [];
		$scope.listEntitys = [];
		$scope.marginService.findByQuery(function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator = $scope.getUpdate($scope.operInvestorMargin_update);
		    	var tempArr = [(i+1),con[i].brokerID,con[i].investorID,con[i].accountName,con[i].exchID,con[i].instrumentID,$scope.transHedgeFlag(con[i].hedgeFlag),con[i].longMarginRateStr
		    	                        ,con[i].longMarginAmt,con[i].shortMarginRateStr,con[i].shortMarginAmt,operator]
		    	$scope.operInvestorMarginDataset.push(tempArr);
		    	con[i].index = i+1;
			}
			$scope.listEntitys = con;
			//重新绘表
		    if($scope.isFx){
			    $scope.operInvestorFxMarginTable.clear().draw();
		        $scope.operInvestorFxMarginTable.rows.add($scope.operInvestorMarginDataset).draw();
			}else{
			    $scope.operInvestorZjMarginTable.clear().draw();
		        $scope.operInvestorZjMarginTable.rows.add($scope.operInvestorMarginDataset).draw();
			}
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		},$scope.queryEntity);
    };
    $timeout(function() {
    	  $scope.find();
    }, 1000);
    
    
    $scope.getUpdate = function(flag){
    	var result = "";
    	if(flag){
    		result = "<a class='update-row' data-toggle='modal' data-target='#operInvestorMarginModal'>修改</a>";
    	}
    	return result;
    }
    
	

    

    function formValidateReset(){
    	$scope.myForm.$setPristine();
    }
    
    $scope.initParameter = function () {
    	$scope.isUpdate = false;
        $scope.ModalEntity = {};
        if($scope.isMainBroker){
        	findMainBroCapsByInst({isActive: '1'},function (result) {
        		$scope.accounts = angular.copy(pushEntitys(result,1));
        		$scope.ModalEntity.investorID = $scope.accounts[0].investorID;
    	    	$scope.$apply();
            });
        }else{
        	$scope.subAccountService.findAllByIsActive(function (result) {
        		$scope.accounts = angular.copy(pushEntitys(result,2));
        		$scope.ModalEntity.investorID = $scope.accounts[0].investorID;
                $scope.$apply();
            },{isActive: '1'});
        }
        $scope.ModalEntity.exchID = $scope.exchangeDatas[0].exchID;
        $scope.ModalEntity.hedgeFlag = $scope.hedgeFlags[0].key;
        $scope.ModalEntity.longMarginRate = 0;
        $scope.ModalEntity.longMarginAmt = 0;
        $scope.ModalEntity.shortMarginRate = 0;
        $scope.ModalEntity.shortMarginAmt = 0;
        formValidateReset();
        $timeout(function(){
        	$("#operInvestorMarginModal").modal("show");
        },1000);
    };

    //修改
    $scope.initUpdateParam = function (index, entity) {
    	$scope.isUpdate = true;
        $scope.tempEntity = angular.copy(entity);
        
        //修改时，精度处理
        $scope.tempEntity.longMarginRate = accMul($scope.tempEntity.longMarginRate,100).toFixed(6);
        $scope.tempEntity.shortMarginRate = accMul($scope.tempEntity.shortMarginRate,100).toFixed(6);
        
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
       // formValidateReset();
    };

    $scope.save = function (entity) {
    	$scope.notClick=true;
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        $scope.tmpSaveEntity = {};
        $scope.tmpSaveEntity = angular.copy(entity);
        
        //精度处理
        $scope.tmpSaveEntity.longMarginRate = accDiv($scope.tmpSaveEntity.longMarginRate,100).toString();
        $scope.tmpSaveEntity.shortMarginRate = accDiv($scope.tmpSaveEntity.shortMarginRate,100).toString();
        
        //增加
        if (index == undefined) {
        	$scope.marginService.findByAddInfo(function (result){
        		if(result.length > 0){
        			$scope.notClick=false;
        			layer.msg("新增失败，不可重复", {
						icon : 2,
						time : 2000
					});
        		}else{
        			$scope.notClick = false;
        			$scope.marginService.addToTrade(function (addResult){
        				if(addResult != undefined){
	        				//关闭窗口
	        				layer.msg("新增成功", {
	    						icon : 1,
	    						time : 1500
	    					});
	        		        $("#operInvestorMarginModal").modal("hide");
	        		        $timeout(function(){
	        		        	$scope.listEntitys = result;
	    		            	$scope.$apply();
	    		            	$scope.find();
	        		        },2000);
        				}
        			},$scope.tmpSaveEntity);
            	}
        	},$scope.tmpSaveEntity);
            //修改
        } else {
        	$scope.marginService.updateToTrade(function (addResult){
				//关闭窗口
		        $scope.notClick = false;
		        $timeout(function(){
		        		$scope.marginService.getfindAll(function (result) {
		        			for(var i = 0; i<result.length;i++){
		        				result[i].index = i+1;
		        			}
		        			$scope.listEntitys = result;
		        			for(var i=0;i<result.length;i++){
	    			    		if(result[i].brokerID == entity.brokerID && result[i].investorID == entity.investorID && 
	    			    			result[i].exchID == entity.exchID && result[i].instrumentID == entity.instrumentID)
	    			    			break;
	    			    	}
		        			/*result[tableIndex-1].index = tableIndex;
			                $scope.listEntitys[tableIndex-1] = result[tableIndex-1];*/
    		                if($scope.isFx){
    		    			    $scope.operInvestorFxMarginTable.cells().every( function () {
    			                    if((tableIndex-1) == this[0][0].row){
    			                    	if(this[0][0].column == 3){
    			                            this.data(result[i].accountName);
    			                            $scope.$apply();
    			                        }
    			                        if(this[0][0].column == 4){
    			                            this.data(result[i].exchID);
    			                            $scope.$apply();
    			                        }
    			                        if(this[0][0].column == 5){
    			                            this.data(result[i].instrumentID);
    			                            $scope.$apply();
    			                        }
    			                        if(this[0][0].column == 6){
    			                            this.data($scope.transHedgeFlag(result[i].hedgeFlag));
    			                            $scope.$apply();
    			                        }
    			                        if(this[0][0].column == 7){
    			                            this.data(scientificToNumber(parseFloat(result[i].longMarginRate).toFixed(8)));
    			                            $scope.$apply();
    			                        }
    			                        if(this[0][0].column == 8){
    			                            this.data(result[i].longMarginAmt);
    			                            $scope.$apply();
    			                        }
    			                        if(this[0][0].column == 9){
    			                            this.data(scientificToNumber(parseFloat(result[i].shortMarginRate).toFixed(8)));
    			                            $scope.$apply();
    			                        }
    			                        if(this[0][0].column == 10){
    			                            this.data(result[i].shortMarginAmt);
    			                            $scope.$apply();
    			                        }
    			                    }

    			              });
    		    			}else{
    		    			    $scope.operInvestorZjMarginTable.cells().every( function () {
    			                    if((tableIndex-1) == this[0][0].row){
    			                        if(this[0][0].column == 4){
    			                            this.data(result[i].exchID);
    			                            $scope.$apply();
    			                        }
    			                        if(this[0][0].column == 5){
    			                            this.data(result[i].instrumentID);
    			                            $scope.$apply();
    			                        }
    			                        if(this[0][0].column == 6){
    			                            this.data($scope.transHedgeFlag(result[i].hedgeFlag));
    			                            $scope.$apply();
    			                        }
    			                        if(this[0][0].column == 7){
    			                            this.data(scientificToNumber(parseFloat(result[i].longMarginRate).toFixed(8)));
    			                            $scope.$apply();
    			                        }
    			                        if(this[0][0].column == 8){
    			                            this.data(result[i].longMarginAmt);
    			                            $scope.$apply();
    			                        }
    			                        if(this[0][0].column == 9){
    			                            this.data(scientificToNumber(parseFloat(result[i].shortMarginRate).toFixed(8)));
    			                            $scope.$apply();
    			                        }
    			                        if(this[0][0].column == 10){
    			                            this.data(result[i].shortMarginAmt);
    			                            $scope.$apply();
    			                        }
    			                    }

    			              });
    		    			}   
    		                
    		                layer.msg("修改成功", {
    							icon : 1,
    							time : 1500
    						});
    				        $("#operInvestorMarginModal").modal("hide");
    		        		
    		            });
		                
		        		
		        },2000);
			},$scope.tmpSaveEntity);
        }
    };
    
    //初始化
    $(document).ready(function() {
		    	//会话列表初始化
		    	$scope.operInvestorFxMarginTable = $('#operInvestorFxMargin_dynamic_table').DataTable( {
			    		data : $scope.operInvestorMarginDataset,
			        	columns :$scope.operInvestorFxMargin_column,
			            dom: 'rt<"bottom"iplB>',
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: []
		        } );
		    	
		    	//会话列表初始化
		    	$scope.operInvestorZjMarginTable = $('#operInvestorZjMargin_dynamic_table').DataTable( {
			    		data : $scope.operInvestorMarginDataset,
			        	columns :$scope.operInvestorZjMargin_column,
			            dom: 'rt<"bottom"iplB>',
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: []
		        } );
        });
});

