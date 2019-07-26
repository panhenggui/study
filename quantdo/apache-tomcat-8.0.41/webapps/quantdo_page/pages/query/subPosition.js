myapp.controller('SubPositionController', function ($scope, $timeout,$rootScope) {
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});		
    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
    //初始化页面信息
    $scope.queryEntity = {};
    $scope.queryEntity.settleDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());
    $scope.listEntitys = [];
    $scope.offsetFlags = clearConstant.offsetFlag;
    $scope.tradeTypes = clearConstant.tradeTypes;
    $scope.currencys = clearConstant.currenys;
    $scope.searchTypes = clearConstant.searchTypes;
    $scope.instClientService = new com.quantdo.orgClear.service.instClientService();
    $scope.SubAccountCapitalService = new com.quantdo.orgClear.service.SubAccountCapitalService();
	
    $scope.subPositionQuery_query = isShow("subPositionQuery_query");
    $scope.subPositionQuery_export = isShow("subPositionQuery_export");

    
    $scope.instClientList = [];
    getInstClientQueryConditionList(function(result){

    	for (var i = 0 ; i< result.length ; i++) {
    		if(result[i].amType == "2"){
                $scope.instClientList.push(result[i]);
			}
		}
    	//$scope.instClientList = angular.copy(result);
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
    
    
    $scope.isBusinessGroup = false;
    $scope.isTraderUser = false;
    $scope.isSubAccountID = true;

    $scope.queryEntity.searchType = "2";
	findUserType(function(result){
		var userType = result;
		if(userType.isActive=="1"){
			$scope.isTrader = true;
			$scope.queryEntity.subAccountID = userType.userID;
			$scope.$apply();

		}
        $scope.changeInstClient();

    });
    findUserType();

    $scope.querySubCapitalAccounts = new Array();
    $scope.businessGroups = new Array();
    $scope.tradeUsers = new Array();
	//资金账号
    //$scope.querySubCapitalAccounts = [];
    $scope.changeInstClient = function(){
    	if($scope.queryEntity.searchType == "2"){
            findBySubCapitalAccountByUserType({"instClientID":$scope.queryEntity.instClientID}, function(result){
    			$scope.querySubCapitalAccounts = angular.copy(result);
    			$scope.queryEntity.subAccountID = "";
    			$scope.isBusinessGroup = false;
    		    $scope.isTraderUser = false;
    		    $scope.isSubAccountID = true;
    			$scope.$apply();
    		});
    	}else if($scope.queryEntity.searchType == "1"){
    		$scope.SubAccountCapitalService.findTradeUser(function(result){
    			$scope.tradeUsers = angular.copy(result);
    			//$scope.queryEntity.subAccountID = "";
             //   if(userType.isActive=="1"){
            //    }else{
                    $scope.queryEntity.subAccountId = "";
             //   }
    			$scope.isBusinessGroup = false;
    		    $scope.isTraderUser = true;
    		    $scope.isSubAccountID = false;
    			$scope.$apply();
    		},$scope.queryEntity.instClientID);
    	}else{
    		$scope.SubAccountCapitalService.findBuisnessGroup(function(result){
    			$scope.businessGroups = angular.copy(result);
    			$scope.queryEntity.subAccountID = "";
    			$scope.isBusinessGroup = true;
    		    $scope.isTraderUser = false;
    		    $scope.isSubAccountID = false;
    			$scope.$apply();
    		},$scope.queryEntity.instClientID);
    	}
		/*//查询资产单元
		findBySubCapitalAccountInfo({"instClientID":$scope.queryEntity.instClientID}, function(result){
			$scope.querySubCapitalAccounts = angular.copy(result);
			$scope.$apply();
		});*/
	}
    
	var time1;
	$timeout(function(){
        if(userType.isActive=="1"){
          $scope.changeInstClient();
          time1 = 0 ;
        }else{
              $scope.changeInstClient();

            $timeout(function() {
                $scope.find($scope.queryEntity);
            }, 500);
            time1= 1000 ;
        }

    },time1)

    
    /*//查询资产单元
	findBySubCapitalAccountInfo({"instClientID":$scope.queryEntity.instClientID}, function(result){
		$scope.querySubCapitalAccounts = angular.copy(result);
		$scope.$apply();
	});*/
    
	//初始化机构信息
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
	}
	
    //交易员
    $scope.traders = [];
    //初始化所有交易员信息
    getAllTraderEntity(function(result){
        $scope.traders = result;
        $scope.$apply();
    });
    //初始化交易所信息
    $scope.ExchangeDatas = [];
    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.ExchangeDatas = result;
        $scope.$apply();
    });
                   

//    //初始化页面记录
//    getAllSubCapitalEntity(function (result) {
//        $scope.subCapitalAccountEntitys = result;
//        $scope.querySubCapitalAccounts = angular.copy($scope.subCapitalAccountEntitys);
//        $scope.$apply();
//    });

	//转换币种
	$scope.transCurrencys = function (key){
		for(var i = 0;i < $scope.currencys.length;i++){
			if($scope.currencys[i].key == key){
				return $scope.currencys[i].text;
			}
		}
	};

	$scope.transDirection = function (key){
		if(key=="0"){
			return "买";
		}else if(key=="1"){
			return "卖";
		}else{
			return "";
		}
	};
	//转换开平
	$scope.transOffsetFlag = function (flagID){
		for(var i = 0;i < $scope.offsetFlags.length;i++){
			if($scope.offsetFlags[i].key == flagID){
				return $scope.offsetFlags[i].text;
			}
		}
	};
	
	//转换投保标志
	$scope.transTradeTypes = function (typeID){
		for(var i = 0;i < $scope.tradeTypes.length;i++){
			if($scope.tradeTypes[i].key == typeID){
				return $scope.tradeTypes[i].text;
			}
		}
	};
	
    //查询
    $scope.tmpQuery = {};
//    $scope.find = function (queryEntity) {
//        //clear
//        $scope.listEntitys = [];
//        $scope.isQuery = true;
//        $scope.tmpQuery = angular.copy(queryEntity);
//        if($scope.tmpQuery.subAccountID != null){
//        	var subAccountEntity = angular.copy($scope.tmpQuery.subAccountID);
//            delete $scope.tmpQuery.subAccountID;
//            $scope.tmpQuery.subAccountID = subAccountEntity.subAccountID;
////            $scope.tmpQuery.instClientID = subAccountEntity.instClientID;
//        }
//        
//        findSubPostionDetailByQuery(function (result) {
//        	$scope.listEntitys = result;
//            $timeout(function() {
//                $scope.isQuery = false;
//            }, 1000);
//        }, $scope.tmpQuery);
//    };
    
    $scope.tmpExportQuery = {};
    // 导出excel
    $scope.exportExcel = function (queryEntity) {
    	$scope.tmpExportQuery = angular.copy(queryEntity);
    	/*if($scope.tmpExportQuery.subAccountID != null){
		    var subAccountEntity = angular.copy($scope.tmpExportQuery.subAccountID);
		    delete $scope.tmpExportQuery.subAccountID;
		    $scope.tmpExportQuery.subAccountID = subAccountEntity.subAccountID;
//		    $scope.tmpExportQuery.instClientID = subAccountEntity.instClientID;
    	}*/
    	framework.file.export("资产单元持仓查询.xls",'excel',{
			entityKey:['settleDate','subAccountID','instClientID','exchID','productID',
			           'instrumentID','position','direction','tradeType','profitlossByDateStr','marginStr','currency'],
			headerKey:['结算日期','资产单元','所属机构','交易所代码','品种代码','合约代码','持仓量','买卖方向','投保标志','持仓盈亏','保证金',
			           '币种'],
			styles:['plainText','plainText','plainText','plainText','plainText','plainText',
			        'plainText','plainText','plainText','plainText','plainText','plainText'],
			title:"资产单元持仓查询",
			dicMap:{direction:{'0':"买",'1':"卖"},tradeType:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"},
					currency:{'CNY':"人民币",'USD':"美元",'JPY':"日元",'AUD':"澳元",'GBP':"英镑",'HKD':"港币",
					'KRW':"韩元",'EUR':"欧元",'SGD':"新加坡元",'MYR':"林吉特",'CAD':"加元",'CENT':"美分"}}
		},"subPositionDetailService", "exportSubPostionDetailByQuery", $scope.tmpExportQuery,$scope.tmpExportQuery.searchType);
    };
    
  //定义产品基础信息的固定列头
    $scope.product_columns = [
        {title: "序号"},
        {title: "结算日期"},
        {title: "资产单元"},
        {title: "所属机构"},
        {title: "交易所代码"},
        {title: "品种代码"},
        {title: "合约代码"},
        {title: "持仓量"},
        {title: "买卖方向"},
        {title: "投保标志"},
        {title: "持仓盈亏"},
        {title: "保证金"},
        {title: "币种"}
    ]; 
    // 查询(前台分页)
    $scope.find = function(queryEntity){
    	$scope.listEntitys = [];
        $scope.tmpQuery = angular.copy(queryEntity);
        /*if($scope.tmpQuery.subAccountID != null){
        	var subAccountEntity = angular.copy($scope.tmpQuery.subAccountID);
            delete $scope.tmpQuery.subAccountID;
            $scope.tmpQuery.subAccountID = subAccountEntity.subAccountID;
//          $scope.tmpQuery.instClientID = subAccountEntity.instClientID;
        }*/
    	//将数据集赋值为空
    	$scope.productDataset = [];
    	//更新表格对应的数据集
    	findSubPostionDetailByQuery(function (result) {
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
                var tempArr = [(i+1),con[i].settleDate,con[i].subAccountID, $scope.transInstClient(con[i].instClientID),con[i].exchID,con[i].productID,con[i].instrumentID,con[i].position,$scope.transDirection(con[i].direction)
                               ,$scope.transTradeTypes(con[i].tradeType),parseFloat(con[i].profitlossByDate).toFixed(2),parseFloat(con[i].margin).toFixed(2),$scope.transCurrencys(con[i].currency)];
	            $scope.productDataset.push(tempArr);
            }
            //重新绘表
            $scope.productTable.clear().draw();
            $scope.productTable.rows.add($scope.productDataset).draw();
        }, $scope.tmpQuery,$scope.tmpQuery.searchType);  	
    }
    
    // 初始化
    $timeout(function() {
    	$scope.find($scope.queryEntity);
    }, 500);
 
    
  //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.productTable = $('#subPosition_dynamic_table').DataTable( {
    		data : $scope.productDataset,
        	columns :$scope.product_columns,
            dom: 'rt<"bottom"iplB>',
            
			buttons: [
			   
			]
        } );
    });
    
});

