myapp.controller('OperAssetSummaryController', function ($scope, $timeout, $rootScope) {
	
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	$scope.isBySubAccount = true;
	$scope.tabFlag = "operAssetSummary";
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
	
    $scope.operAssetSummary_start = isShow("operAssetSummary_start");
    $scope.operAssetSummary_stop = isShow("operAssetSummary_stop");
    $scope.operAssetSummary_export = isShow("operAssetSummary_export");

	$scope.instClientList = null;
    getInstClientQueryConditionList(function(result){
    	$scope.instClientList = angular.copy(result);
    	if($scope.instClientList.length > 1){
    		$scope.queryEntity.instClientID = "";
    	}else{
    		$scope.queryEntity.instClientID = $scope.instClientList[0].instClientID;
    	}
    });
    
    queryInstClientID(function(result){
    	if(result != undefined){
    		$scope.noInst = true;
    	}else{
    		$scope.noInst = false;
    	}
    });
    
	/* //初始化机构信息
    $scope.instClientService.findByQuery(function (result) {
        $scope.instClientlistEntitys = result;
        $scope.$apply();
    },{});
    
    //机构名称转换
    $scope.transInstClient = function (instClientID) {
    	for(var i = 0;i < $scope.instClientlistEntitys.length; i++){
    		if($scope.instClientlistEntitys[i].instClientID == instClientID){
    			return $scope.instClientlistEntitys[i].instClientAbbrName;
    		}
    	}
    }*/
    
    //初始化页面信息
    $scope.queryEntity = {
    	sleepTime:5
    };
    $scope.FOFsearchTypes = [
         {text: '资金账号', key: '0'},
         {text: '资金账号组', key: '1'}
    ];
    $scope.MOMsearchTypes = [
	      {text: '资金账号', key: '0'},
	      {text: '资金账号组', key: '1'},
	      {text: '资产单元', key: '2'}
	];
    
    $scope.searchTypes = $scope.FOFsearchTypes;		//查询方式下拉框(默认fof模式)
    //获取所属投资机构
    queryAmType(function (result) {
        $scope.amType = result;
        if(result != null && result == '1'){
        	$scope.searchTypes = $scope.FOFsearchTypes;
        }else{
        	$scope.searchTypes = $scope.MOMsearchTypes;
        }
        $scope.$apply();
    });
    
    $scope.timeSet = 5;
    $scope.listEntitys = [];
    $scope.listEntity = [];
    $scope.entityItem = {};
    $scope.direction = clearConstant.tradeDirection;
    $scope.rowSpan = [];
    $scope.isStart = false;
    $scope.isStop = true;
    $scope.status = "轮询停止";
    $scope.queryEntity.searchType = '0';
    $scope.accountGroupEntitys = [];
    $scope.capitalAccountEntitys = [];
    $scope.showID = '资金账号';
    $scope.showName = '资金账号名称';
    $scope.showTableName = '资金账号';
    $scope.searchID = '';
    $scope.instClientID = '';
    $scope.searchType = '0';		//当前查询方式（默认资金账号）
    
    $scope.transDirections = function (direction){
    	for(var i = 0;i < $scope.direction.length; i++){
    		if($scope.direction[i].key == direction){
    			return $scope.direction[i].text;
    		}
    	}
    }
    
    // 查询所有账号分组信息
    getAllAccountGroupsEntity(function (result){
    	$scope.accountGroupEntitys = result;
    	angular.forEach($scope.accountGroupEntitys,function(item,index,list){
    		item.accountID = item.accountGroupID;
    		item.accountName = item.accountGroupName;
    	});
    	$scope.$apply();
    });
    
    // 查询所有资金账号
    getAllCapitalAccountEntity(function (result) {
        $scope.capitalAccountEntitys = result;
        angular.forEach($scope.capitalAccountEntitys,function(item,index,list){
    		item.accountID = item.innerAccountID;
    	});
        $scope.queryAccountEntitys = angular.copy($scope.capitalAccountEntitys);
        $scope.queryEntity.accountID = '';
        $scope.$apply();
    });
    
    $scope.changeSearchType = function(type){
    	if(type == '0'){		//资金账号
    		$scope.showID = '资金账号';
    		$scope.isBySubAccount = true;
    		$scope.queryAccountEntitys = $scope.capitalAccountEntitys;
    		$scope.queryEntity.accountID = '';
    	}else if(type == '1'){					//账号组
    		$scope.showID = '资金账号组';
    		$scope.isBySubAccount = true;
    		$scope.queryAccountEntitys = $scope.accountGroupEntitys;
    		$scope.queryEntity.accountID = '';
    	}else if(type == '2'){			//资产单元
    		$scope.showID = '';
    		$scope.isBySubAccount = false;
    		$scope.queryAccountEntitys = [];
    		$scope.queryEntity.accountID = '';
    	}
    }
    
    $scope.changeInstClient = function(){
    	if("" == $scope.queryEntity.instClientID){
    		$scope.queryEntity.instClientID = null;
    	}
		//资金账号
		if($scope.queryEntity.searchType == '0'){
			$scope.showID = "资金账号";
			$scope.isBySubAccount = true;
			//查询资金账号
			findCapitalAccountByQuery({"brokerageFirmID":$scope.queryEntity.instClientID}, function(result){
				pushEntitys(result, 0);
				$scope.$apply();
			});
		} else if($scope.queryEntity.searchType == '1'){
			$scope.showID = '资金账号组';
    		$scope.isBySubAccount = true;
    		findByAccountGroup(function (result){
    			pushEntitys(result, 1);
    	    	$scope.$apply();
    	    }, {"instClientID": $scope.queryEntity.instClientID});
		}else if($scope.queryEntity.searchType == '2'){ //资产单元
			$scope.showID = '资产单元';
    		$scope.isBySubAccount = false;
    		$scope.queryAccountEntitys = [];
    		$scope.queryEntity.accountID = '';
    		findBySubCapitalAccountInfo({"instClientID":$scope.queryEntity.instClientID}, function(result){
				pushEntitys(result, 2);
				$scope.$apply();
			});
		}
	}
    
    function pushEntitys(s, type){
		$scope.tEntitys = [];
		$scope.queryAccountEntitys = new Array();
		if(type == 0){
			angular.forEach(s, function (value, index, arrays) {
				$scope.tmpEntitys = {"accountID":"", "accountName":"", "instClientID":""};
				$scope.tmpEntitys.accountID = value.innerAccountID;
				$scope.tmpEntitys.accountName = value.accountName;
				$scope.tmpEntitys.instClientID = value.instClientID;
				$scope.queryAccountEntitys.push($scope.tmpEntitys);
			});
		}else if(type == 1){
			angular.forEach(s,function(item,index,list){
				$scope.tmpEntitys = {"accountID":"", "accountName":"", "instClientID":""};
				$scope.tmpEntitys.accountID = item.accountGroupID;
				$scope.tmpEntitys.accountName = item.accountGroupName;
				$scope.tmpEntitys.instClientID = item.instClientID;
				$scope.queryAccountEntitys.push($scope.tmpEntitys);
	    	});
		}else if(type == 2){
			angular.forEach(s, function (value, index, arrays) {
				$scope.tmpEntitys = {"accountID":"", "accountName":"", "instClientID":""};
				$scope.tmpEntitys.accountID = value.subAccountID;
				$scope.tmpEntitys.accountName = value.subAccountName;
				$scope.tmpEntitys.instClientID = value.instClientID;
				$scope.queryAccountEntitys.push($scope.tmpEntitys);
			});
		}
		
		$scope.$apply();
	}
    
    //查询
    $scope.find = function (queryEntity) {
    	$scope.searchID = '';
    	$scope.instClientID = queryEntity.instClientID;
    	$scope.searchType = queryEntity.searchType;
    	var tmpQuery = angular.copy(queryEntity);
        if(tmpQuery.accountID != null && tmpQuery.accountID != ""){
        	var accountEntity = angular.copy(tmpQuery.accountID);
            $scope.searchID = accountEntity.accountID;
            $scope.instClientID = accountEntity.instClientID;
        }
    	if(queryEntity.searchType == '0'){
    		$scope.showName = '资金账号名称';
    		$scope.showTableName = '资金账号';
    	}else if(queryEntity.searchType == '1'){
    		$scope.showName = '资金账号组名称';
    		$scope.showTableName = '资金账号组';
    	}else if(queryEntity.searchType == '2'){
    		$scope.showName = '资产单元名称';
    		$scope.showTableName = '资产单元';
    	}
    	if(queryEntity.sleepTime < 5){
    		layer.msg("轮询间隔必须大于5秒",{icon:2, time:1000});
    		return false;
    	}else{
    		$scope.timeSet = queryEntity.sleepTime;
	        $scope.listEntitys = [];
	        $scope.status = "轮询中.....";
	        $scope.isStart = true;
	        $scope.isStop = false;
	        clearInterval($scope.timer);
	        var st = queryEntity.sleepTime *1000;
	        
	        if(queryEntity.searchType == '0' || queryEntity.searchType == '1'){		//fof
	        	exportAllOperAssetFOFSummary(function (result) {
		            $scope.listEntitys = result;
					var count = 0;
					angular.forEach($scope.listEntitys,function(data,index,array){
						if(data.spanNum !== undefined){
							count += 1;
						}
						if(count %2 == 0){
							data.isOdd = true;
							data.isEven = false;
						}
						else{
							data.isOdd = false;
							data.isEven = true;
						}
					});
		            $scope.$apply();
		        },{
		        	accountID: $scope.searchID,
		        	instClientID: $scope.instClientID
		        },$scope.searchType);
		        $scope.timer = setInterval(function (){
		        	exportAllOperAssetFOFSummary(function (result) {
		                $scope.listEntitys = result;
						var count = 0;
						angular.forEach($scope.listEntitys,function(data,index,array){
							if(data.spanNum !== undefined){
								count += 1;
							}
							if(count %2 == 0){
								data.isOdd = true;
								data.isEven = false;
							}
							else{
								data.isOdd = false;
								data.isEven = true;
							}
						});
		                $scope.$apply();
		            },{
			        	accountID: $scope.searchID,
			        	instClientID: $scope.instClientID
			        },$scope.searchType);
		        },st.toString());
	        }else if(queryEntity.searchType == '2'){				//mom
	        	exportAllOperAssetMOMSummary(function (result) {
		            $scope.listEntitys = result;
					var count = 0;
					angular.forEach($scope.listEntitys,function(data,index,array){
						if(data.spanNum !== undefined){
							count += 1;
						}
						if(count %2 == 0){
							data.isOdd = true;
							data.isEven = false;
						}
						else{
							data.isOdd = false;
							data.isEven = true;
						}
					});
		            $scope.$apply();
		        },{
		        	accountID: $scope.searchID,
		        	instClientID: $scope.instClientID
		        });
		        $scope.timer = setInterval(function (){
		        	exportAllOperAssetMOMSummary(function (result) {
		                $scope.listEntitys = result;
						var count = 0;
						angular.forEach($scope.listEntitys,function(data,index,array){
							if(data.spanNum !== undefined){
								count += 1;
							}
							if(count %2 == 0){
								data.isOdd = true;
								data.isEven = false;
							}
							else{
								data.isOdd = false;
								data.isEven = true;
							}
						});
		                $scope.$apply();
		            },{
			        	accountID: $scope.searchID,
			        	instClientID: $scope.instClientID
			        });
		        },st.toString());
	        }
	        
        }
    };
    
    $scope.stop = function (){
    	clearInterval($scope.timer);
    	 $("#sleepTime").focus();
    	$scope.isStart = false;
    	$scope.isStop = true;
    	$scope.status = "轮询停止";
    }
    var tmpQuery = angular.copy($scope.queryEntity);
    if(tmpQuery.accountID != null && tmpQuery.accountID != ""){
    	var accountEntity = angular.copy(tmpQuery.accountID);
        $scope.searchID = accountEntity.accountID;
        $scope.instClientID = accountEntity.instClientID;
    }
    
    $scope.exportExcel = function(){
    	var type = '资金账号名称';
    	var typeID = '资金账号';
    	if($scope.queryEntity.searchType == '0'){
    		type = '资金账号名称';
    		typeID = '资金账号';
    	}else if($scope.queryEntity.searchType == '1'){
    		type = '资金账号组名称';
    		typeID = '资金账号组';
    	}else if($scope.queryEntity.searchType == '2'){
    		type = '资产单元名称';
    		typeID = '资产单元';
    	}
    	if($scope.queryEntity.searchType == '0' || ($scope.queryEntity.searchType == '1')){
    		$scope.esearchID = '';
        	$scope.einstClientID = $scope.queryEntity.instClientID;
        	var etmpQuery = angular.copy($scope.queryEntity);
            if(etmpQuery.accountID != null){
            	var accountEntity = angular.copy(etmpQuery.accountID);
                $scope.esearchID = accountEntity.accountID;
                $scope.einstClientID = accountEntity.instClientID;
            }
    		framework.file.export("实时资产汇总.xls",'excel_f',{
    			title:"实时资产汇总",
    			ftlFile:"templates/table2",
    			extendParams:{a:type,b:'持仓品种',c:'方向',d:'持仓量',e:'结算权益',f:'结算价',
    				g:'市价',h:'持仓浮动损益',i:'持仓保证金',j:'即时权益',k:'平仓盈亏',l:'浮盈',m:'杠杆',n:'所属机构',o:typeID}
    		},"operAssetSummaryService","getExportData",{
    			accountID: $scope.esearchID,
    			instClientID: $scope.einstClientID
    			},$scope.queryEntity.searchType);
    	}else if($scope.queryEntity.searchType == '2'){
    		framework.file.export("实时资产汇总.xls",'excel_f',{
    			title:"实时资产汇总",
    			ftlFile:"templates/table",
    			extendParams:{a:type,b:'持仓品种',c:'方向',d:'持仓量',e:'结算权益',f:'结算价',
    				g:'市价',h:'持仓浮动损益',i:'持仓保证金',j:'即时权益',k:'平仓盈亏',l:'浮盈',m:'所属机构',o:typeID}
    		},"operAssetSummaryService","getMOMExportData",{
    			accountID: $scope.esearchID,
    			instClientID: $scope.einstClientID
    			});
    	}
    	
    }
});

