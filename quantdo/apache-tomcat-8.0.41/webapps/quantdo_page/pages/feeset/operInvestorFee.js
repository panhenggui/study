myapp.controller('operInvestorFeeController', function ($scope, $timeout,$rootScope) {
	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    $scope.queryEntity = {};
    $scope.ModalEntity = {};
    $scope.notClick = false;
    $scope.isMainBroker = false;
    $scope.accounts = [];
    $scope.accountDatas = [];
    $scope.operInvestorFeeDataset = [];
    $scope.isFx = false;
    
    $scope.operInvestorFee_add = isShow("operInvestorFee_add");
    $scope.operInvestorFee_query = isShow("operInvestorFee_query");
    $scope.operInvestorFee_update = isShow("operInvestorFee_update");
    
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
    
  //定义固定列头
    $scope.operInvestorFxFee_column = [
           {title:"序号"},
           {title: "所属机构"},
           {title: "资产单元"},
           {title: "资产单元名称"},
           {title: "交易所代码"},
           {title: "品种/合约代码"},
           {title: "开仓按金额"},
           {title: "开仓按手数"},
           {title: "平仓按金额"},
           {title: "平仓按手数"},
           {title: "平今按金额"},
           {title: "平今按手数"},
 	  	   {title: "操作"}
     ]
    
    //定义固定列头
    $scope.operInvestorZjFee_column = [
           {title:"序号"},
           {title: "所属机构"},
           {title: "资金账号"},
           {title: "资金账号名称"},
           {title: "交易所代码"},
           {title: "品种/合约代码"},
           {title: "开仓按金额"},
           {title: "开仓按手数"},
           {title: "平仓按金额"},
           {title: "平仓按手数"},
           {title: "平今按金额"},
           {title: "平今按手数"},
 	  	   {title: "操作"}
     ]
    
    $scope.instClientService = new com.quantdo.orgClear.service.instClientService();
    $scope.feeService = new com.quantdo.orgClear.service.OperInvestorFeeService();
    $scope.subAccountService = new com.quantdo.orgClear.service.SubCapitalAccountService();
    
    //初始化页面信息
    $scope.feeService.getfindAll(function (result) {
        $scope.listEntitys = result;
    	$scope.$apply();
    });
    
    $scope.exchangeDatas = [];
    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
    	$scope.$apply();
    });

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
    
    //查询
/*    $scope.find = function (queryEntity) {
        $scope.listEntitys = [];
        $scope.isQuery = true;
        var tempEntity = {};
        tempEntity = angular.copy(queryEntity);
        $scope.feeService.findByQuery(function (result) {
            $scope.listEntitys = result;
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        }, tempEntity);
    };*/
    $("body").undelegate("#operInvestorFxFee_dynamic_table_wrapper td .update-row","click");
     //表格修改事件
    $("body").delegate("#operInvestorFxFee_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.operInvestorFxFeeTable.row(mytr).data();
        var id = tempArr[0];
        var brokerID = tempArr[1];
        var investorID = tempArr[2];
        var exchID = tempArr[4];
        var instrumentID = tempArr[5];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(brokerID==$scope.listEntitys[i].brokerID&&investorID==$scope.listEntitys[i].investorID
        			&&exchID==$scope.listEntitys[i].exchID&&instrumentID==$scope.listEntitys[i].instrumentID){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $timeout(function() {
        	$scope.initUpdateParam(id,$scope.modalEntity);
        }, 500);
    });
    $("body").undelegate("#operInvestorZjFee_dynamic_table_wrapper td .update-row","click");
    $("body").delegate("#operInvestorZjFee_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.operInvestorZjFeeTable.row(mytr).data();
        var id = tempArr[0];
        var brokerID = tempArr[1];
        var investorID = tempArr[2];
        var exchID = tempArr[4];
        var instrumentID = tempArr[5];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(brokerID==$scope.listEntitys[i].brokerID&&investorID==$scope.listEntitys[i].investorID
        			&&exchID==$scope.listEntitys[i].exchID&&instrumentID==$scope.listEntitys[i].instrumentID){
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
		$scope.operInvestorFeeDataset = [];
		$scope.listEntitys = [];
		$scope.feeService.findByQuery(function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator = $scope.getUpdate($scope.operInvestorFee_update);
		    	var tempArr = [(i+1),con[i].brokerID,con[i].investorID,con[i].accountName,con[i].exchID,con[i].instrumentID,con[i].openFeeRateStr
		    	               ,con[i].openFeeAmt,con[i].offsetFeeRateStr,con[i].offsetFeeAmt,con[i].otFeeRateStr,con[i].otFeeAmt,operator]
		    	$scope.operInvestorFeeDataset.push(tempArr);
		    	con[i].index = i+1;
			}
			//重新绘表
			if($scope.isFx){
			    $scope.operInvestorFxFeeTable.clear().draw();
		        $scope.operInvestorFxFeeTable.rows.add($scope.operInvestorFeeDataset).draw();
			}else{
			    $scope.operInvestorZjFeeTable.clear().draw();
		        $scope.operInvestorZjFeeTable.rows.add($scope.operInvestorFeeDataset).draw();
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
    		result = "<a class='update-row' data-toggle='modal' data-target='#operInvestorFeeModal'>修改</a>";
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
        $scope.ModalEntity.openFeeRate = 0;
        $scope.ModalEntity.openFeeAmt = 0;
        $scope.ModalEntity.offsetFeeRate = 0;
        $scope.ModalEntity.offsetFeeAmt = 0;
        $scope.ModalEntity.otFeeRate = 0;
        $scope.ModalEntity.otFeeAmt = 0;
        formValidateReset();
        $timeout(function(){
        	$("#operInvestorFeeModal").modal("show");
        },1000);
    };

    //修改
    $scope.initUpdateParam = function (index, entity) {
    	$scope.isUpdate = true;
        $scope.tempEntity = angular.copy(entity);
        
        //修改时，精度处理
        $scope.tempEntity.openFeeRate = accMul($scope.tempEntity.openFeeRate,10000).toFixed(4);
        $scope.tempEntity.offsetFeeRate = accMul($scope.tempEntity.offsetFeeRate,10000).toFixed(4);
        $scope.tempEntity.otFeeRate = accMul($scope.tempEntity.otFeeRate,10000).toFixed(4);
        
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        formValidateReset();
    };

    $scope.save = function (entity) {
    	$scope.notClick = true;
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        
        $scope.tmpSaveEntity = {};
        $scope.tmpSaveEntity = angular.copy(entity);
        
        //精度处理
        $scope.tmpSaveEntity.openFeeRate = accDiv($scope.tmpSaveEntity.openFeeRate,10000).toString();
        $scope.tmpSaveEntity.offsetFeeRate = accDiv($scope.tmpSaveEntity.offsetFeeRate,10000).toString();
        $scope.tmpSaveEntity.otFeeRate = accDiv($scope.tmpSaveEntity.otFeeRate,10000).toString();
        
        //增加
        if (index == undefined) {
        	$scope.feeService.findByAddInfo(function (result){
        		if(result.length > 0){
        			$scope.notClick=false;
        			layer.msg("新增失败，不可重复", {
						icon : 2,
						time : 2000
					});
        		}else{
        			$scope.notClick = false;
        			$scope.feeService.addToTrade(function (addResult){
        				if(addResult != undefined){
	        				//关闭窗口
	        				layer.msg("新增成功", {
	    						icon : 1,
	    						time : 1500
	    					});
	        		        $("#operInvestorFeeModal").modal("hide");
	        		        $timeout(function(){
	        		        	$scope.feeService.getfindAll(function (result) {
	        		        		$scope.listEntitys = result;
	        		        		$scope.$apply();
	        		        		$scope.find();
	        		            });
	        		        },2000);
        		        }
        			},$scope.tmpSaveEntity);
            	}
        	},$scope.tmpSaveEntity);
            //修改
        } else {
        	$scope.feeService.updateToTrade(function (addResult){
				//关闭窗口
        		
		        $scope.notClick = false;
		        $timeout(function(){
		        	$scope.feeService.getfindAll(function (result) {
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
		    			    $scope.operInvestorFxFeeTable.cells().every( function () {
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
			                            this.data(scientificToNumber(parseFloat(result[i].openFeeRate).toFixed(8)));
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 7){
			                            this.data(result[i].openFeeAmt);
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 8){
			                            this.data(scientificToNumber(parseFloat(result[i].offsetFeeRate).toFixed(8)));
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 9){
			                            this.data(result[i].offsetFeeAmt);
			                        }
			                        if(this[0][0].column == 10){
			                            this.data(scientificToNumber(parseFloat(result[i].otFeeRate).toFixed(8)));
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 11){
			                            this.data(result[i].otFeeAmt);
			                            $scope.$apply();
			                        }
			                    }
	
			              });
		    			}else{
		    			    $scope.operInvestorZjFeeTable.cells().every( function () {
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
			                            this.data(scientificToNumber(parseFloat(result[i].openFeeRate).toFixed(8)));
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 7){
			                            this.data(result[i].openFeeAmt);
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 8){
			                            this.data(scientificToNumber(parseFloat(result[i].offsetFeeRate).toFixed(8)));
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 9){
			                            this.data(result[i].offsetFeeAmt);
			                        }
			                        if(this[0][0].column == 10){
			                            this.data(scientificToNumber(parseFloat(result[i].otFeeRate).toFixed(8)));
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 11){
			                            this.data(result[i].otFeeAmt);
			                            $scope.$apply();
			                        }
			                    }

		    			    });
		    			}
		                
		                layer.msg("修改成功", {
							icon : 1,
							time : 1500
						});
			        	$("#operInvestorFeeModal").modal("hide");
		        	});
		        	
		        },2000);
			},$scope.tmpSaveEntity);
        }
    };
    
    //初始化
    $(document).ready(function() {
		    	//会话列表初始化
		    	$scope.operInvestorFxFeeTable = $('#operInvestorFxFee_dynamic_table').DataTable( {
			    		data : $scope.operInvestorFeeDataset,
			        	columns :$scope.operInvestorFxFee_column,
			            dom: 'rt<"bottom"iplB>',
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: []
		        } );
		    	
		    	//会话列表初始化
		    	$scope.operInvestorZjFeeTable = $('#operInvestorZjFee_dynamic_table').DataTable( {
			    		data : $scope.operInvestorFeeDataset,
			        	columns :$scope.operInvestorZjFee_column,
			            dom: 'rt<"bottom"iplB>',
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: []
		        } );
      });

});

