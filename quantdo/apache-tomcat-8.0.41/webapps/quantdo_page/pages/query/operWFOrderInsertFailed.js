myapp.controller('OperWFOrderInsertFailedController', function ($scope,$rootScope, $timeout) {
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	//1、实例化服务接口
	
	//2、定义页面数据模型
    $scope.queryEntity = {};    //实际查询对象
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
    
    $scope.operWFOrderInsertFailed_query = isShow("operWFOrderInsertFailed_query");
    $scope.operWFOrderInsertFailed_export = isShow("operWFOrderInsertFailed_export");
   
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
        
    	if($scope.tmpQuery.searchType == "1"){			//资金账号
    		$scope.showID1 = $scope.searchTypes[0].text;
    		findOperWFOrderInsertFailedByCapital(function (result){
    			 $scope.findTem(result);
    		},{
    			investorID: $scope.tmpQuery.accountID,
    			instrumentID: $scope.tmpQuery.instrumentID,
    			productType:$scope.tmpQuery.productType,
    			brokerageFirmID: $scope.tmpQuery.brokerageFirmID
    		});
    	}else if ($scope.tmpQuery.searchType == "2"){			//投顾账号
    		$scope.showID1 = $scope.searchTypes[1].text;
    		findOperWFOrderInsertFailedBySubAccount(function (result){
    			 $scope.findTem(result);
    		},{
    			investorID: $scope.tmpQuery.accountID,
    			instrumentID: $scope.tmpQuery.instrumentID,
    			productType:$scope.tmpQuery.productType,
    			brokerageFirmID: $scope.tmpQuery.brokerageFirmID
    		});
    	}
    	$timeout(function() {
            $scope.isQuery = false;
        }, 1000);
    };
    

  //导出excel
  $scope.exportExcelOWFOIF = function (queryEntity) {
	  $scope.tmpQuery = angular.copy(queryEntity);
      if($scope.tmpQuery.accountID != null){
      	var accountEntity = angular.copy($scope.tmpQuery.accountID);
          delete $scope.tmpQuery.accountID;
          $scope.tmpQuery.investorID = accountEntity.accountID;
//          $scope.tmpQuery.brokerageFirmID = accountEntity.instClientID;
      }
  	
  	if($scope.tmpQuery.searchType == "1"){
	  	framework.file.export("实时错单查询.xls",'excel',{
	  		entityKey:['orderSysID','insertTime','investorID','accountName','instClientName',
	  		           'instrumentID','direction','offsetFlag','volume','hedgeFlag',
	  		           'errorMsg','userTrader','userTraderName','ipAddress','macAddress','investorManager','investorManagerName','mngIpAddr','mngMacAddr','investorAdvisor','investorAdvisorName','advIpAddr','advMacAddr'],   
	  		headerKey:['报单编号','申报时间','资金账号','资金账号名称','所属机构',
	  		           '合约代码','买卖','开平','申报量','交易类型',
	  		         '错误信息','交易员','交易员名称','交易员IP地址','交易员MAC地址','投资经理','投资经理名称','投资经理IP地址','投资经理MAC地址','投资顾问','投资顾问名称','投顾IP地址','投顾MAC地址'],
	         styles:['plainText','plainText','plainText','plainText','plainText',
	  		        'plainText','plainText','plainText','plainText','plainText',
	  		        'plainText','plainText','plainText','plainText','plainText','plainText','plainText',
	  		      'plainText','plainText','plainText','plainText','plainText','plainText'],
	  		title:"实时错单查询",
	  		
	  		dicMap:{direction:{'0':"买",'1':"卖"},hedgeFlag:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}
	          ,offsetFlag:{'0':"开仓",'1':"平仓",'2':"强平",'3':"平今",'4':"平昨"}}
	  	},"operWFOrderInsertFailedService","exportExcelOWFOIFCap",$scope.tmpQuery);
  	}else {
  		framework.file.export("实时错单查询.xls",'excel',{
  			entityKey:['orderSysID','insertTime','investorID','accountName','instClientName',
	  		           'instrumentID','direction','offsetFlag','volume','hedgeFlag',
	  		         'errorMsg','userTrader','userTraderName','ipAddress','macAddress','investorManager','investorManagerName','mngIpAddr','mngMacAddr','investorAdvisor','investorAdvisorName','advIpAddr','advMacAddr'], 
	  		headerKey:['报单编号','申报时间','资产单元','资产单元名称','所属机构',
	  		           '合约代码','买卖','开平','申报量','交易类型',
	  		           '错误信息','交易员','交易员名称','交易员IP地址','交易员MAC地址','投资经理','投资经理名称','投资经理IP地址','投资经理MAC地址','投资顾问','投资顾问名称','投顾IP地址','投顾MAC地址'],
	         styles:['plainText','plainText','plainText','plainText','plainText',
	  		        'plainText','plainText','plainText','plainText','plainText',
	  		        'plainText','plainText','plainText','plainText','plainText','plainText','plainText',
	  		      'plainText','plainText','plainText','plainText','plainText','plainText'],
	  		title:"实时错单查询",
	  		
	  		dicMap:{direction:{'0':"买",'1':"卖"},hedgeFlag:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}
	          ,offsetFlag:{'0':"开仓",'1':"平仓",'2':"强平",'3':"平今",'4':"平昨"}}
	  	},"operWFOrderInsertFailedService","exportExcelOWFOIFSubCap",$scope.tmpQuery);
  	}
  };
   
//定义系统用户管理表的固定列头
  $scope.operWFFailed_columnsOne = [
      {title: "序号"},
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
  $scope.operWFFailed_columnsTwo = [
	  {title: "序号"},
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
  	$scope.operWFFailedDataset = [];
  	//更新表格对应的数据集
  		var con = result;
  		var tempArray = new Array();
          for(var i = 0; i<con.length;i++){
        	  var tempArr = [(i+1),con[i].orderSysID,con[i].insertTime, con[i].investorID,con[i].accountName,
                             con[i].instClientName,con[i].instrumentID,
                             $scope.transDirection(con[i].direction),$scope.transOffsetFlag(con[i].offsetFlag),
                             con[i].volume,$scope.transTradeType(con[i].hedgeFlag),
                             con[i].errorMsg,
                             con[i].userTrader,con[i].userTraderName,  con[i].ipAddress,con[i].macAddress,
                             con[i].investorManager,con[i].investorManagerName, con[i].mngIpAddr,con[i].mngMacAddr,
                             con[i].investorAdvisor,con[i].investorAdvisorName,con[i].advIpAddr,con[i].advMacAddr
                             ];
        	  
	            $scope.operWFFailedDataset.push(tempArr);
          }
 
        //重新绘表
          if($scope.tmpQuery.searchType == 1){
          		$scope.operWFOrderTableOne.clear().draw();
	            $scope.operWFOrderTableOne.rows.add($scope.operWFFailedDataset).draw();
          }else {
	            $scope.operWFOrderTableTwo.clear().draw();
	            $scope.operWFOrderTableTwo.rows.add($scope.operWFFailedDataset).draw();
          }      
  }

  
  
  //初始化
  $(document).ready(function() {
  	//资金账号
  	$scope.operWFOrderTableOne = $('#operWFFailed_dynamic_tableOne').DataTable( {
  		data : $scope.operWFFailedDataset,
      	columns :$scope.operWFFailed_columnsOne,
      	dom: 'rt<"bottom"iplB>',
        buttons: [
  			    
  			]
          } );
  		//资产单元
      	$scope.operWFOrderTableTwo = $('#operWFFailed_dynamic_tableTwo').DataTable( {
  		data : $scope.operWFFailedDataset,
      	columns :$scope.operWFFailed_columnsTwo,
        dom: 'rt<"bottom"iplB>',
		buttons: [
			    
			]
      } );

  });
    
    
});

