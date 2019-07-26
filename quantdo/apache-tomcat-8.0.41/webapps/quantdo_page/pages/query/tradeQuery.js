myapp.controller('TradeQueryController', function ($scope, $timeout,$rootScope) {
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
    $scope.queryEntity.tradeDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());
    $scope.offsetFlags = clearConstant.offsetFlag;	//开平
    $scope.tradeTypes = clearConstant.tradeTypes;	//投保
    $scope.searchTypes = clearConstant.searchTypes;
    $scope.instClientService = new com.quantdo.orgClear.service.instClientService();
    $scope.SubAccountCapitalService = new com.quantdo.orgClear.service.SubAccountCapitalService();
	$scope.TradeQueryDataset = [];
	
	$scope.tradeQuery_query = isShow("tradeQuery_query");
	$scope.tradeQuery_export = isShow("tradeQuery_export");
		
	//定义固定列头
    $scope.TradeQuery_columns = [
        {title: "序号"},
        {title: "id",visible:false},
		{title: "结算日期"},
		{title: "成交编号"},
		{title: "资产单元"},
		{title: "名称"},
		{title: "所属机构"},
		{title: "交易所代码"},
		{title: "品种代码"},
		{title: "合约代码"},
		{title: "买卖方向"},
		{title: "开平标志"},
		{title: "投保标志"},
		{title: "成交价格"},
		{title: "成交数量"},
		{title: "成交手续费"}
	]
    
    
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
    
	//初始化机构信息
	$scope.instClientService.findByQuery(function (result) {
	    $scope.instClientlistEntitys = result;
	    $scope.$apply();
	},{});
 
    //机构名称转换
	$scope.transInstClient = function (instClientID) {
		var result = "";
	    for(var i = 0;i < $scope.instClientlistEntitys.length; i++){
	        if($scope.instClientlistEntitys[i].instClientID == instClientID){
	        	result =  $scope.instClientlistEntitys[i].instClientAbbrName;
	 	    }
	    }
	    return result;
	}
	
	//子资金账号
    /*$scope.SubAccounts = [];
    getAllSubCapitalEntity(function(result){
    	$scope.SubAccounts = result;
    	$scope.$apply();
    });*/
    
    $scope.isBusinessGroup = false;
    $scope.isTraderUser = false;
    $scope.isSubAccountID = true;
    // $scope.queryEntity.searchType = "2";
	findUserType(function(result){
		var userType = result;
		if(userType.isActive=="1"){
			$scope.queryEntity.searchType = "2";
			$scope.isBusinessGroup = false;
			$scope.isTraderUser = false;
			$scope.isSubAccountID = true;
			$scope.isTrader = true;
			//$scope.queryEntity.subAccountId = userType.userID;
			$scope.$apply();
		}else{
			$scope.queryEntity.searchType = "2";
		}
		$scope.changeInstClient();

		$timeout(function() {
			$scope.find($scope.queryEntity);
		}, 500);
	});
    findUserType();

    $scope.SubAccounts = new Array();
    $scope.businessGroups = new Array();
    $scope.tradeUsers = new Array();
    
	$scope.changeInstClient = function(){
		//查询资产单元
    	if($scope.queryEntity.searchType == "2"){
            findBySubCapitalAccountByUserType({"instClientID":$scope.queryEntity.instClientID}, function(result){
    			$scope.SubAccounts = angular.copy(result);
    			$scope.queryEntity.subAccountId = "";
    			$scope.isBusinessGroup = false;
    		    $scope.isTraderUser = false;
    		    $scope.isSubAccountID = true;
    			$scope.$apply();
    		});
    	}else if($scope.queryEntity.searchType == "1"){
    		$scope.SubAccountCapitalService.findTradeUser(function(result){
    			$scope.tradeUsers = angular.copy(result);
    			//$scope.queryEntity.subAccountId = "";
    			$scope.queryEntity.subAccountId = "";
    			$scope.isBusinessGroup = false;
    		    $scope.isTraderUser = true;
    		    $scope.isSubAccountID = false;
    			$scope.$apply();
    		},$scope.queryEntity.instClientID);
    	}else{
    		$scope.SubAccountCapitalService.findBuisnessGroup(function(result){
    			$scope.businessGroups = angular.copy(result);
    			$scope.queryEntity.subAccountId = "";
    			$scope.isBusinessGroup = true;
    		    $scope.isTraderUser = false;
    		    $scope.isSubAccountID = false;
    			$scope.$apply();
    		},$scope.queryEntity.instClientID);
    	}

	}
	
	
    //交易所代码
    //初始化交易所信息
    $scope.ExchangeDatas = [];
    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.ExchangeDatas = result;
        $scope.$apply();
    });


    
  

    //买卖方向
    $scope.Directions = clearConstant.tradeDirection;

    $scope.transName = function (text,instClientID){
    	var result = "";
    	for(var i = 0;i < $scope.SubAccounts.length;i++){
    		if($scope.SubAccounts[i].subAccountID == text && $scope.SubAccounts[i].instClientID == instClientID){
    			result =  $scope.SubAccounts[i].subAccountName;
    		}
    	}
    	return result;
    };
    
    //开平
    $scope.transOffsetFlag = function (key){
    	var result = "";
    	for(var i = 0;i < $scope.offsetFlags.length;i++){
    		if($scope.offsetFlags[i].key == key){
    			result =  $scope.offsetFlags[i].text;
    		}
    	}
    	return result;
    };
    
    //投保
    $scope.transTradeTypes = function (key){
      	var result = "";
    	for(var i = 0;i < $scope.tradeTypes.length;i++){
    		if($scope.tradeTypes[i].key == key){
    			result =  $scope.tradeTypes[i].text;
    		}
    	}
    	return result;
    }; 
    
    $scope.tmpQuery = {};


    
    // 根据页面条件查询
    $scope.find = function (queryEntity) {  	
    	$scope.isQuery = true;
		$scope.TradeQueryDataset = [];
		$scope.listEntitys = [];
		
        $scope.tmpQuery = angular.copy(queryEntity);

		getTradeQueryEntity(function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			$scope.volume = 0;
			$scope.tradeFee = 0;
			for(var i = 0; i<con.length;i++){
				if(con[i].tradeDate != "小计"){
					var tradeFee = $scope.tranTradeFee(con[i].tradeFee);
					$scope.volume += con[i].volume;
			    	$scope.tradeFee += con[i].tradeFee;
				}else{
					var tradeFee = parseFloat(con[i].tradeFee).toFixed(2);
				}
		    	var tempArr = [(i+1),con[i].id,con[i].tradeDate,con[i].tradeId,con[i].subAccountId,$scope.transName(con[i].subAccountId,con[i].instClientID)
		    	               ,$scope.transInstClient(con[i].instClientID),con[i].exchangeId,con[i].productID,con[i].instrumentId
		    	               ,$scope.isDirection(con[i].direction),$scope.transOffsetFlag(con[i].offsetFlag),$scope.transTradeTypes(con[i].hedgeFlag)
		    	               ,$scope.fixTradePrice(con[i].tradePrice),con[i].volume,tradeFee]
		    	$scope.TradeQueryDataset.push(tempArr); 
			}
			//重新绘表
	        $scope.TradeQueryTable.clear().draw();
	        $scope.TradeQueryTable.rows.add($scope.TradeQueryDataset).draw();
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		},$scope.tmpQuery,$scope.tmpQuery.searchType);
    };
    
    $scope.tranTradeFee = function(tradeFee){
    	if(tradeFee === '' || tradeFee === undefined || tradeFee === null){
    		return "待结算";
    	}else{
    		return parseFloat(tradeFee).toFixed(2);
    	}
    }
    
    $scope.fixTradePrice = function(tradePrice){
    	if(tradePrice == '' || tradePrice == undefined || tradePrice == null){
    		return "";
    	}else{
    		return parseFloat(tradePrice).toFixed(3)
    	}
    }
    
    $scope.isDirection = function(direction){
    	var result = '';
    	if(direction==0){
    		result = '买';
    	}else if(direction==1){
    		result = '卖';
    	}
    	return result;
    }
    
    $scope.tmpExportQuery = {};
  //导出excel
    $scope.exportExcel = function (queryEntity) {
    	$scope.tmpExportQuery = angular.copy(queryEntity);
    	/*if($scope.tmpExportQuery.subAccountId != null){
		    var subAccountEntity = angular.copy($scope.tmpExportQuery.subAccountId);
		    delete $scope.tmpExportQuery.subAccountId;
		    $scope.tmpExportQuery.subAccountId = subAccountEntity.subAccountID;
//		    $scope.tmpExportQuery.instClientID = subAccountEntity.instClientID;
    	}*/
    	framework.file.export("资产单元成交查询.xls",'excel',{
			entityKey:['tradeDate','tradeIdStr','subAccountId','subAccountName','instClientID','exchangeId','productID',
			           'instrumentId','direction','offsetFlag','hedgeFlag','tradePriceStr','volume','tradeFeeStr'],
			headerKey:['交易日','成交编号','资产单元','名称','所属机构','交易所代码','品种代码','合约代码','买卖方向','开平标志','投保标志','成交价格',
			           '成交数量','成交手续费'],
			styles:['plainText','plainText','plainText','plainText','plainText','plainText','plainText',
			        'plainText','plainText','plainText','plainText','plainText','plainText','plainText'],
			title:"资产单元成交查询",
			dicMap:{direction:{'0':"买",'1':"卖"},offsetFlag:{'0':'开仓','1':'平仓','2':'强平',
				'3':'平今','4':'平昨'},hedgeFlag:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}}
		},"tradeService", "exportByConditions", $scope.tmpExportQuery,$scope.tmpExportQuery.searchType);
    };
    
    
	//初始化
    $(document).ready(function() {
		    	//会话列表初始化
		    	$scope.TradeQueryTable = $('#TradeQuery_dynamic_table').DataTable( {
			    		data : $scope.TradeQueryDataset,
			        	columns :$scope.TradeQuery_columns,
			            dom: 'rt<"bottom"iplB>',
			            
						buttons: [],
			    		"footerCallback": function () {
			    		 
				    		var api = this.api();
				    		$( api.column( 14 ).footer() ).html(parseFloat($scope.volume).toFixed(2));
	    					$( api.column( 15 ).footer() ).html(parseFloat($scope.tradeFee).toFixed(2));
				    		 


			    		}
		        } );
      });
    
});

