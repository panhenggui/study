myapp.controller('HisWFOrderInsertFailedController', function ($scope,$rootScope, $timeout) {
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	//1、实例化服务接口
	
	//2、定义页面数据模型
    $scope.queryEntity = {};    //实际查询对象
    $scope.queryEntity.beginDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());
    $scope.searchTypes = clearConstant.operClientPositon_searchType;	//查询方式下拉框内容
    $scope.queryEntity.searchType = $scope.searchTypes[0].key;
    $scope.showID = $scope.searchTypes[0].text;
    $scope.showID1 = $scope.searchTypes[0].text;
    $scope.capitalAccountEntitys = [];			//所有资金帐号
    $scope.TraderEntitys = [];					//所有资产单元
    $scope.queryAccountEntitys = [];			//查询帐号下拉框内容
    $scope.traderTypes = clearConstant.tradeTypes;		//交易类型
    $scope.directions = clearConstant.tradeDirection;	//买卖
    $scope.offsetFlags = clearConstant.offsetFlag;	//开平
    $scope.productTypes = clearConstant.productTypes;
    $scope.listEntitys = [];
    $scope.listEntity = {};
    $scope.tmpEntity = {};
    $scope.instClientService = new com.quantdo.orgClear.service.instClientService();
    $scope.isShow = {};//资产单元 隐藏自报单编号 和下单席位号
    
    $scope.hisWFOrderInsertFailed_query = isShow("hisWFOrderInsertFailed_query");
    $scope.hisWFOrderInsertFailed_export = isShow("hisWFOrderInsertFailed_export");
   
    $scope.instClientList = null;
    getInstClientQueryConditionList(function(result){
    	$scope.instClientList = angular.copy(result);
    	if($scope.instClientList.length > 1){
    		$scope.queryEntity.brokerageFirmID = "";
    	}else{
    		$scope.queryEntity.brokerageFirmID = $scope.instClientList[0].instClientID;
    	}
    	$scope.$apply();
    });
    
    queryInstClientID(function(result){
    	if(result != undefined){
    		$scope.noInst = true;
    	}else{
    		$scope.noInst = false;
    	}
    });
    
    $scope.changeInstClient = function(){
		//资金账号
		if($scope.queryEntity.searchType == 1){
			$scope.showID = "资金账号";
			//查询资金账号
			findCapitalAccountByQuery({"brokerageFirmID":$scope.queryEntity.brokerageFirmID}, function(result){
				pushEntitys(result, 1);
				$scope.$apply();
			});
		} else if($scope.queryEntity.searchType == 2){ //资产单元
			$scope.showID = "资产单元";
			//查询资产单元
			findBySubCapitalAccountInfo({"instClientID":$scope.queryEntity.brokerageFirmID}, function(result){
				pushEntitys(result, 2);
				$scope.$apply();
			});
		}
	}
    
    function pushEntitys(s, type){
		$scope.tEntitys = [];
		$scope.queryAccountEntitys = new Array();
		if(type == 1){
			angular.forEach(s, function (value, index, arrays) {
				$scope.tmpEntitys = {"accountID":"", "accountName":"", "instClientID":""};
				$scope.tmpEntitys.accountID = value.innerAccountID;
				$scope.tmpEntitys.accountName = value.accountName;
				$scope.tmpEntitys.instClientID = value.instClientID;
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
    
	//初始化机构信息
//	$scope.instClientService.findByQuery(function (result) {
//	    $scope.instClientlistEntitys = result;
//	    $scope.$apply();
//	},{});
 
    //获取所属投资机构
    queryAmType(function (result) {
        $scope.amType = result;
        if(result != null && result == '1'){
        	$scope.isMom = false;
        }else{
        	$scope.isMom = true;
        }
        $scope.$apply();
    });
    
    //所有资金帐号
    getAllCapitalAccountEntity(function (result) {
    	$scope.capitalAccountEntitys = [];
        for(var i = 0 ;i < result.length ; i++){
        	$scope.tmpEntity = {};
        	$scope.tmpEntity.accountID = result[i].innerAccountID;
        	$scope.tmpEntity.accountName = result[i].accountName;
        	$scope.tmpEntity.instClientID = result[i].instClientID;
        	$scope.capitalAccountEntitys.push($scope.tmpEntity);
        }
        $scope.queryAccountEntitys = $scope.capitalAccountEntitys;
        $scope.queryEntity.accountID = "";
        $scope.$apply();
    });
    
    //所有资产单元
    getAllTraderEntity(function (result) {
    	$scope.TraderEntitys = [];
        for(var i = 0 ;i < result.length ; i++){
        	$scope.tmpEntity = {};
        	$scope.tmpEntity.accountID = result[i].traderID;
        	$scope.tmpEntity.accountName = result[i].traderName;
        	$scope.tmpEntity.instClientID = result[i].instClientID;
        	$scope.TraderEntitys.push($scope.tmpEntity);
        }
    },null);
    
    
    //3、定义方法
    /*$scope.changeName = function (){
    	if($scope.queryEntity.searchType ==$scope.searchTypes[0].key){
    		$scope.showID = $scope.searchTypes[0].text;
    		$scope.queryAccountEntitys = $scope.capitalAccountEntitys;
    		$scope.queryEntity.accountID = "";
    	}else if($scope.queryEntity.searchType ==$scope.searchTypes[1].key){
    		$scope.showID = $scope.searchTypes[1].text;
    		$scope.queryAccountEntitys = $scope.TraderEntitys;
    		$scope.queryEntity.accountID = "";
    	}
    };*/
     
    $scope.transTradeType = function (tradeType){
    	for(var i = 0;i < $scope.traderTypes.length;i++){
			if($scope.traderTypes[i].key == tradeType){
				return $scope.traderTypes[i].text;
			}
		}
    }
    
    $scope.transDirection = function (direction){
    	for(var i = 0;i < $scope.directions.length;i++){
			if($scope.directions[i].key == direction){
				return $scope.directions[i].text;
			}
		}
    }
    
    $scope.transOffsetFlag = function (offsetFlag){
    	for(var i = 0;i < $scope.offsetFlags.length;i++){
			if($scope.offsetFlags[i].key == offsetFlag){
				return $scope.offsetFlags[i].text;
			}
		}
    }
    
    $scope.tmpQuery = {};
    //4、数据初始化        
    //4.1、进入页面时调用查询方法
    $scope.find = function (queryEntity)  {
    	$scope.listEntitys = [];
    	$scope.isQuery = true;
    	$scope.tmpQuery = angular.copy(queryEntity);
        if($scope.tmpQuery.accountID != null){
        	var accountEntity = angular.copy($scope.tmpQuery.accountID);
            delete $scope.tmpQuery.accountID;
            $scope.tmpQuery.accountID = accountEntity.accountID;
//            $scope.tmpQuery.instClientID = accountEntity.instClientID;
        }
        if($scope.tmpQuery.beginDate > $scope.tmpQuery.endDate){
    		layer.msg('开始日期不能大于结束日期！！', {
				icon : 2
			});
    		$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
			return false;
    	}
    	if($scope.tmpQuery.searchType == "1"){			//资金账号
    		$scope.showID1 = $scope.searchTypes[0].text;
    		findHisWFOrderInsertFailedByCapital(function (result){
    			 $scope.findTem(result);
    		},{
    			investorID: $scope.tmpQuery.accountID,
    			instrumentID: $scope.tmpQuery.instrumentID,
    			productType:$scope.tmpQuery.productType,
    			brokerageFirmID: $scope.tmpQuery.brokerageFirmID
    		},$scope.tmpQuery.beginDate,$scope.tmpQuery.endDate);
    	}else if ($scope.tmpQuery.searchType == "2"){			//投顾账号
    		$scope.showID1 = $scope.searchTypes[1].text;
    		findHisWFOrderInsertFailedBySubAccount(function (result){
    			 $scope.findTem(result);
    		},{
    			investorID: $scope.tmpQuery.accountID,
    			instrumentID: $scope.tmpQuery.instrumentID,
    			productType:$scope.tmpQuery.productType,
    			brokerageFirmID: $scope.tmpQuery.brokerageFirmID
    		},$scope.tmpQuery.beginDate,$scope.tmpQuery.endDate);
    	}
    	$timeout(function() {
            $scope.isQuery = false;
        }, 1000);
    };
    

  //导出excel
  $scope.exportExcelHWFOIF = function (queryEntity) {
	  $scope.tmpQuery = angular.copy(queryEntity);
      if($scope.tmpQuery.accountID != null){
      	var accountEntity = angular.copy($scope.tmpQuery.accountID);
          delete $scope.tmpQuery.accountID;
          $scope.tmpQuery.investorID = accountEntity.accountID;
//          $scope.tmpQuery.brokerageFirmID = accountEntity.instClientID;
      }
      if($scope.tmpQuery.beginDate > $scope.tmpQuery.endDate){
  		layer.msg('开始日期不能大于结束日期！！', {
				icon : 2
			});
			return false;
  	  }
  	if($scope.tmpQuery.searchType == "1"){
	  	framework.file.export("历史错单查询.xls",'excel',{
	  		entityKey:['settleDate','orderSysID','insertTime','investorID','accountName','instClientName',
	  		           'instrumentID','direction','offsetFlag','volume','hedgeFlag',
	  		           'errorMsg','userTrader','userTraderName','ipAddress','macAddress','investorManager','investorManagerName','mngIpAddr','mngMacAddr','investorAdvisor','investorAdvisorName','advIpAddr','advMacAddr'],   
	  		headerKey:['结算日期','报单编号','申报时间','资金账号','资金账号名称','所属机构',
	  		           '合约代码','买卖','开平','申报量','交易类型',
	  		         '错误信息','交易员','交易员名称','交易员IP地址','交易员MAC地址','投资经理','投资经理名称','投资经理IP地址','投资经理MAC地址','投资顾问','投资顾问名称','投顾IP地址','投顾MAC地址'],
	         styles:['plainText','plainText','plainText','plainText','plainText','plainText',
	  		        'plainText','plainText','plainText','plainText','plainText',
	  		        'plainText','plainText','plainText','plainText','plainText','plainText','plainText',
	  		      'plainText','plainText','plainText','plainText','plainText','plainText'],
	  		title:"历史错单查询",
	  		
	  		dicMap:{direction:{'0':"买",'1':"卖"},hedgeFlag:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}
	          ,offsetFlag:{'0':"开仓",'1':"平仓",'2':"强平",'3':"平今",'4':"平昨"}}
	  	},"hisWFOrderInsertFailedService","exportExcelFWFOIFCap",$scope.tmpQuery,$scope.tmpQuery.beginDate ,$scope.tmpQuery.endDate);
  	}else {
  		framework.file.export("历史错单查询.xls",'excel',{
  			entityKey:['settleDate','orderSysID','insertTime','investorID','accountName','instClientName',
	  		           'instrumentID','direction','offsetFlag','volume','hedgeFlag',
	  		         'errorMsg','userTrader','userTraderName','ipAddress','macAddress','investorManager','investorManagerName','mngIpAddr','mngMacAddr','investorAdvisor','investorAdvisorName','advIpAddr','advMacAddr'], 
	  		headerKey:['结算日期','报单编号','申报时间','资产单元','资产单元名称','所属机构',
	  		           '合约代码','买卖','开平','申报量','交易类型',
	  		           '错误信息','交易员','交易员名称','交易员IP地址','交易员MAC地址','投资经理','投资经理名称','投资经理IP地址','投资经理MAC地址','投资顾问','投资顾问名称','投顾IP地址','投顾MAC地址'],
	         styles:['plainText','plainText','plainText','plainText','plainText','plainText',
	  		        'plainText','plainText','plainText','plainText','plainText',
	  		        'plainText','plainText','plainText','plainText','plainText','plainText','plainText',
	  		      'plainText','plainText','plainText','plainText','plainText','plainText'],
	  		title:"历史错单查询",
	  		
	  		dicMap:{direction:{'0':"买",'1':"卖"},hedgeFlag:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}
	          ,offsetFlag:{'0':"开仓",'1':"平仓",'2':"强平",'3':"平今",'4':"平昨"}}
	  	},"hisWFOrderInsertFailedService","exportExcelFWFOIFSubCap",$scope.tmpQuery,$scope.tmpQuery.beginDate ,$scope.tmpQuery.endDate);
  	}
  };
   
//定义系统用户管理表的固定列头
  $scope.hisWFFailed_columnsOne = [
      {title: "序号"},
      {title: "结算日期"},
      {title: "报单编号"},
      {title: "申报时间"},
      {title: "资金账号"},
      {title: "资金账号名称"},
      {title: "所属机构"},
      {title: "合约代码"},
      {title: "买卖"},
      {title: "开平"},
      {title: "申报量"},
      {title: "交易类型"},
      {title: "错误信息"},
      {title: "交易员"},
      {title: "交易员名称"},
      {title: "交易员IP地址"},
      {title: "交易员MAC地址"},
      {title: "投资经理"},
      {title: "投资经理名称"},
      {title: "投资经理IP地址"},
      {title: "投资经理MAC地址"},
      {title: "投资顾问"},
      {title: "投资顾问名称"},
      {title: "投顾IP地址"},
      {title: "投顾MAC地址"}
  ]; 
  $scope.hisWFFailed_columnsTwo = [
	  {title: "序号"},
	  {title: "结算日期"},
      {title: "报单编号"},
      {title: "申报时间"},
      {title: "资产单元"},
      {title: "资产单元名称"},
      {title: "所属机构"},
      {title: "合约代码"},
      {title: "买卖"},
      {title: "开平"},
      {title: "申报量"},
      {title: "交易类型"},
      {title: "错误信息"},
      {title: "交易员"},
      {title: "交易员名称"},
      {title: "交易员IP地址"},
      {title: "交易员MAC地址"},
      {title: "投资经理"},
      {title: "投资经理名称"},
      {title: "投资经理IP地址"},
      {title: "投资经理MAC地址"},
      {title: "投资顾问"},
      {title: "投资顾问名称"},
      {title: "投顾IP地址"},
      {title: "投顾MAC地址"}
	 ]; 
  

	// 查询(前台分页)
  $scope.findTem = function(result){
  	//将数据集赋值为空
  	$scope.hisWFFailedDataset = [];
  	//更新表格对应的数据集
  		var con = result;
  		var tempArray = new Array();
          for(var i = 0; i<con.length;i++){
        	  var tempArr = [(i+1),con[i].settleDate,con[i].orderSysID,con[i].insertTime, con[i].investorID,con[i].accountName,
                             con[i].instClientName,con[i].instrumentID,
                             $scope.transDirection(con[i].direction),$scope.transOffsetFlag(con[i].offsetFlag),
                             con[i].volume,$scope.transTradeType(con[i].hedgeFlag),
                             con[i].errorMsg,
                             con[i].userTrader,con[i].userTraderName,  con[i].ipAddress,con[i].macAddress,
                             con[i].investorManager,con[i].investorManagerName, con[i].mngIpAddr,con[i].mngMacAddr,
                             con[i].investorAdvisor,con[i].investorAdvisorName,con[i].advIpAddr,con[i].advMacAddr
                             ];
        	  
	            $scope.hisWFFailedDataset.push(tempArr);
          }
 
        //重新绘表
          if($scope.tmpQuery.searchType == 1){
          		$scope.hisWFOrderTableOne.clear().draw();
	            $scope.hisWFOrderTableOne.rows.add($scope.hisWFFailedDataset).draw();
          }else {
	            $scope.hisWFOrderTableTwo.clear().draw();
	            $scope.hisWFOrderTableTwo.rows.add($scope.hisWFFailedDataset).draw();
          }      
  }

  
  
  //初始化
  $(document).ready(function() {
  	//资金账号
  	$scope.hisWFOrderTableOne = $('#hisWFFailed_dynamic_tableOne').DataTable( {
  		data : $scope.hisWFFailedDataset,
      	columns :$scope.hisWFFailed_columnsOne,
      	dom: 'rt<"bottom"iplB>',
        buttons: [
  			    
  			]
          } );
  		//资产单元
      	$scope.hisWFOrderTableTwo = $('#hisWFFailed_dynamic_tableTwo').DataTable( {
  		data : $scope.hisWFFailedDataset,
      	columns :$scope.hisWFFailed_columnsTwo,
        dom: 'rt<"bottom"iplB>',
		buttons: [
			    
			]
      } );

  });
    
    
});

