myapp.controller('SubAccountCapitalController', function ($scope, $timeout,$rootScope) {

	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});	

	$scope.lastInterest = 0;
	$scope.finalInterest = 0;
	$scope.balance = 0;
	$scope.moneyIn = 0;
	$scope.moneyOut = 0;
	$scope.premiumIn = 0;
	$scope.premiumOut = 0;
	$scope.offsetProfitloss = 0;
	$scope.offsetProfitlossByTrade = 0;
	$scope.positionProfitloss = 0;
	$scope.positionProfitlossByTrade = 0;
	$scope.dueProfitloss = 0;
	$scope.undueProfitloss = 0;
	$scope.longMargin = 0;
	$scope.shortMargin = 0;
	$scope.totalMargin = 0;
	$scope.tradeFee = 0;
	$scope.exerciseFee = 0;
	$scope.otherFee = 0;
	$scope.deferredFee = 0;
	$scope.buyMoney = 0;
	$scope.sellMoney = 0;

    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
    //初始化页面信息
    $scope.queryEntity = {};
    $scope.queryEntity.settleDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());
    $scope.currencys = clearConstant.currenys;
    $scope.searchTypes = clearConstant.searchTypes;
    $scope.instClientService = new com.quantdo.orgClear.service.instClientService();
    $scope.SubAccountCapitalService = new com.quantdo.orgClear.service.SubAccountCapitalService();
	$scope.SubAccountCapitalDataset = [];
	
    $scope.subAccountCapitalQuery_query = isShow("subAccountCapitalQuery_query");
    $scope.subAccountCapitalQuery_export = isShow("subAccountCapitalQuery_export");

	
	//定义固定列头
    $scope.SubAccountCapital_columns = [
        {title: "序号"},
        {title: "结算日"},
		{title: "资产单元"},
		{title: "所属机构"},
		{title: "上日权益"},
		{title: "期末权益"},
		{title: "可用资金"},
		{title: "入金"},
		{title: "出金"},
		{title: "权利金收取"},
		{title: "权利金支出"},
		{title: "平仓盈亏（逐日）"},
		{title: "平仓盈亏（逐笔）"},
		{title: "持仓盈亏（逐日）"},
		{title: "持仓盈亏（逐笔）"},
		{title: "到期盈亏"},
		{title: "未到期盈亏"},
		{title: "多头保证金"},
		{title: "空头保证金"},
		{title: "总保证金"},
		{title: "手续费"},
		{title: "行权手续费"},
		{title: "其他费用"},
		{title: "递延费"},
		{title: "买入货款"},
		{title: "卖出货款"},
		{title: "币种"}
	]
    var userType ;
    $scope.findUser = function() {
        findUserType(function(result){
            userType = result;
            if(userType.isActive=="1"){
                $scope.queryEntity.searchType = "2";
                $scope.isTrader = true;
                //  $scope.isUser = true;
                // $scope.queryEntity.subAccountID = userType.userID;
                $scope.$apply();
            }else{
                $scope.queryEntity.searchType = "2";
            }
        });
    }
    $scope.findUser ();


    
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

    $scope.queryCapitalAccounts = new Array();
    $scope.businessGroups = new Array();
    $scope.tradeUsers = new Array();
    $scope.changeInstClient = function(){
		//查询资产单元
    	if($scope.queryEntity.searchType == "2"){
            findBySubCapitalAccountByUserType({"instClientID":$scope.queryEntity.instClientID}, function(result){
    			$scope.queryCapitalAccounts = angular.copy(result);
    			$scope.queryEntity.subAccountID = "";
    			$scope.isBusinessGroup = false;
    		    $scope.isTraderUser = false;
    		    $scope.isSubAccountID = true;
    			$scope.$apply();
    		});
    	}else if($scope.queryEntity.searchType == "1"){
    		$scope.SubAccountCapitalService.findTradeUser(function(result){
    			$scope.tradeUsers = angular.copy(result);
    		//	$scope.queryEntity.subAccountID = "";
              //  if(userType.isActive=="1"){
               // }else{
                    $scope.queryEntity.subAccountId = "";
               // }
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
		$scope.queryCapitalAccounts = angular.copy(result);
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
	
    //转换币种
    $scope.transCurrencys = function(key){
    	for(var i = 0;i < $scope.currencys.length;i++){
    		if($scope.currencys[i].key == key){
    			return $scope.currencys[i].text;
    		}
    	}
    }
    
    
    //初始化页面记录
//    getAllSubCapitalEntity(function (result) {
//        $scope.subCapitalAccountEntitys = result;
//        $scope.queryCapitalAccounts = angular.copy($scope.subCapitalAccountEntitys);
//        $scope.$apply();
//    });

    // 转换资产单元名称
    $scope.transName = function (text,instClientID){
    	for(var i = 0;i < $scope.subCapitalAccountEntitys.length;i++){
    		if($scope.subCapitalAccountEntitys[i].subAccountID == text && $scope.subCapitalAccountEntitys[i].instClientID == instClientID){
    			return $scope.subCapitalAccountEntitys[i].subAccountName;
    		}
    	}
    };
    
    $scope.tmpQuery = {};
    //查询
/*    $scope.find = function (queryEntity) {
        //clear
        $scope.listEntitys = [];
        $scope.isQuery = true;
        $scope.tmpQuery = angular.copy(queryEntity);
        if($scope.tmpQuery.subAccountID != null){
        	var subAccountEntity = angular.copy($scope.tmpQuery.subAccountID);
            delete $scope.tmpQuery.subAccountID;
            $scope.tmpQuery.subAccountID = subAccountEntity.subAccountID;
//            $scope.tmpQuery.instClientID = subAccountEntity.instClientID;
        }
        
        $scope.tempEntity = angular.copy(queryEntity);        
        querySubAccountCapital(function (result) {
            $scope.listEntitys = result;
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        }, $scope.tmpQuery);
    };*/
    
    // 根据页面条件查询
    $scope.find = function (queryEntity) {
    	$scope.isQuery = true;
		$scope.SubAccountCapitalDataset = [];
		$scope.listEntitys = [];
		
        //clear
        $scope.tmpQuery = angular.copy(queryEntity);
        /*if($scope.tmpQuery.subAccountID != null){
        	var subAccountEntity = angular.copy($scope.tmpQuery.subAccountID);
            delete $scope.tmpQuery.subAccountID;
            $scope.tmpQuery.subAccountID = subAccountEntity.subAccountID;
            $scope.tmpQuery.instClientID = subAccountEntity.instClientID;
            $scope.tmpQuery.traderID = "";
        }*/
		
        querySubAccountCapital(function(result){		
        	$scope.lastInterest = 0;
        	$scope.finalInterest = 0;
        	$scope.balance = 0;
        	$scope.moneyIn = 0;
        	$scope.moneyOut = 0;
        	$scope.premiumIn = 0;
        	$scope.premiumOut = 0;
        	$scope.offsetProfitloss = 0;
        	$scope.offsetProfitlossByTrade = 0;
        	$scope.positionProfitloss = 0;
        	$scope.positionProfitlossByTrade = 0;
        	$scope.dueProfitloss = 0;
        	$scope.undueProfitloss = 0;
        	$scope.longMargin = 0;
        	$scope.shortMargin = 0;
        	$scope.totalMargin = 0;
        	$scope.tradeFee = 0;
        	$scope.exerciseFee = 0;
        	$scope.otherFee = 0;
        	$scope.deferredFee = 0;
        	$scope.buyMoney = 0;
        	$scope.sellMoney = 0;
        	
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
		    	var tempArr = [(i+1),con[i].settleDate,con[i].accountID,$scope.transInstClient(con[i].instClientID),parseFloat(con[i].lastInterest).toFixed(2)
		    	               ,parseFloat(con[i].finalInterest).toFixed(2),parseFloat(con[i].balance).toFixed(2)
		    	               ,parseFloat(con[i].moneyIn).toFixed(2),parseFloat(con[i].moneyOut).toFixed(2)
		    	               ,parseFloat(con[i].premiumIn).toFixed(2),parseFloat(con[i].premiumOut).toFixed(2),parseFloat(con[i].offsetProfitloss).toFixed(2),parseFloat(con[i].offsetProfitlossByTrade).toFixed(2)
		    	               ,parseFloat(con[i].positionProfitloss).toFixed(2),parseFloat(con[i].positionProfitlossByTrade).toFixed(2),parseFloat(con[i].dueProfitloss).toFixed(2)
		    	               ,parseFloat(con[i].undueProfitloss).toFixed(2),parseFloat(con[i].longMargin).toFixed(2)
		    	               ,parseFloat(con[i].shortMargin).toFixed(2),parseFloat(con[i].totalMargin).toFixed(2)
		    	               ,parseFloat(con[i].tradeFee).toFixed(2),parseFloat(con[i].exerciseFee).toFixed(2),parseFloat(con[i].otherFee).toFixed(2),parseFloat(con[i].deferredFee).toFixed(2)
		    	               ,parseFloat(con[i].buyMoney).toFixed(2),parseFloat(con[i].sellMoney).toFixed(2),$scope.transCurrencys(con[i].currency)]
		    	$scope.SubAccountCapitalDataset.push(tempArr); 
		    	/*if((con[i].settleDate == "小计:")){
		    		continue;
		    	}
		    	$scope.lastInterest += con[i].lastInterest;
		    	$scope.finalInterest += con[i].finalInterest;
		    	$scope.balance += con[i].balance;
		    	$scope.moneyIn += con[i].moneyIn;
		    	$scope.moneyOut += con[i].moneyOut;
		    	$scope.premiumIn += con[i].premiumIn;
		    	$scope.premiumOut += con[i].premiumOut;
		    	$scope.offsetProfitloss += con[i].offsetProfitloss;
		    	$scope.offsetProfitlossByTrade += con[i].offsetProfitlossByTrade;
		    	$scope.positionProfitloss += con[i].positionProfitloss;
		    	$scope.positionProfitlossByTrade += con[i].positionProfitlossByTrade;
		    	$scope.dueProfitloss += con[i].dueProfitloss;
		    	$scope.undueProfitloss += con[i].undueProfitloss;
		    	$scope.longMargin += con[i].longMargin;
		    	$scope.shortMargin += con[i].shortMargin;
		    	$scope.totalMargin += con[i].totalMargin;
		    	$scope.tradeFee += con[i].tradeFee;
		    	$scope.exerciseFee += con[i].exerciseFee;
		    	$scope.otherFee += con[i].otherFee;
		    	$scope.deferredFee += con[i].deferredFee;
		    	$scope.buyMoney += con[i].buyMoney;
		    	$scope.sellMoney += con[i].sellMoney;*/
			}
			//重新绘表
	        $scope.SubAccountCapitalTable.clear().draw();
	        $scope.SubAccountCapitalTable.rows.add($scope.SubAccountCapitalDataset).draw();
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		},$scope.tmpQuery);
    };
    
    
    
    
    $scope.tmpExportQuery = {};
    //导出excel
    $scope.exportExcel = function (queryEntity) {
    	$scope.tmpExportQuery = angular.copy(queryEntity);
    	/*if($scope.tmpExportQuery.subAccountID != null){
		    var subAccountEntity = angular.copy($scope.tmpExportQuery.subAccountID);
		    delete $scope.tmpExportQuery.subAccountID;
		    $scope.tmpExportQuery.subAccountID = subAccountEntity.subAccountID;
//		    $scope.tmpExportQuery.instClientID = subAccountEntity.instClientID;
    	}*/
    	framework.file.export("资产单元资金对账.xls",'excel',{
    		entityKey:['settleDate','accountID','instClientName','lastInterest','finalInterest','balance',
			           'moneyIn','moneyOut','premiumIn','premiumOut','offsetProfitloss','offsetProfitlossByTrade','positionProfitloss','positionProfitlossByTrade','dueProfitloss','undueProfitloss',
			           'longMargin','shortMargin','totalMargin','tradeFee','exerciseFee','otherFee',
			           'deferredFee','buyMoney','sellMoney','currency'],
			headerKey:['结算日','资产单元','所属机构','上日权益','期末权益','可用资金','入金','出金','权利金收取','权利金支出','平仓盈亏（逐日）','平仓盈亏（逐笔）','持仓盈亏（逐日）','持仓盈亏（逐笔）','到期盈亏',
			           '未到期盈亏','多头保证金','空头保证金','总保证金','手续费','行权手续费','其他费用','递延费','买入货款','卖出货款','币种'],
			styles:['plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText',
			        'plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText',
			        'plainText','plainText','plainText'],
			title:"资产单元资金对账",
			dicMap:{currency:{'CNY':"人民币",'USD':"美元",'JPY':"日元",'AUD':"澳元",'GBP':"英镑",'HKD':"港币",
				'KRW':"韩元",'EUR':"欧元",'SGD':"新加坡元",'MYR':"林吉特",'CAD':"加元",'CENT':"美分"}}
		},"subAccountCapitalService","findBySubAccountQuery", $scope.tmpExportQuery.settleDate,$scope.tmpExportQuery.endDate, $scope.tmpExportQuery.traderID,
		$scope.tmpExportQuery.subAccountID, $scope.tmpExportQuery.currency, $scope.tmpExportQuery.instClientID, $scope.tmpExportQuery.searchType);
    };
    
	//初始化
    $(document).ready(function() {
		    	//会话列表初始化
		    	$scope.SubAccountCapitalTable = $('#SubAccountCapital_dynamic_table').DataTable( {
			    		data : $scope.SubAccountCapitalDataset,
			        	columns :$scope.SubAccountCapital_columns,
			            dom: 'rt<"bottom"iplB>',
			            buttons: []
						/*buttons: [],
						"footerCallback": function () {
				    	     var api = this.api();
				    	     	$( api.column( 4 ).footer() ).html(parseFloat($scope.lastInterest).toFixed(2));
				    			$( api.column( 5 ).footer() ).html(parseFloat($scope.finalInterest).toFixed(2));
				    			$( api.column( 6 ).footer() ).html(parseFloat($scope.balance).toFixed(2));
				    			$( api.column( 7 ).footer() ).html(parseFloat($scope.moneyIn).toFixed(2));
				    			$( api.column( 8 ).footer() ).html(parseFloat($scope.moneyOut).toFixed(2));
				    			$( api.column( 9 ).footer() ).html(parseFloat($scope.premiumIn).toFixed(2));
				    			$( api.column( 10 ).footer() ).html(parseFloat($scope.premiumOut).toFixed(2));
				    			$( api.column( 11 ).footer() ).html(parseFloat($scope.offsetProfitloss).toFixed(2));
				    			$( api.column( 12 ).footer() ).html(parseFloat($scope.offsetProfitlossByTrade).toFixed(2));
				    			$( api.column( 13 ).footer() ).html(parseFloat($scope.positionProfitloss).toFixed(2));
				    			$( api.column( 14 ).footer() ).html(parseFloat($scope.positionProfitlossByTrade).toFixed(2));
				    			$( api.column( 15 ).footer() ).html(parseFloat($scope.dueProfitloss).toFixed(2));
				    			$( api.column( 16 ).footer() ).html(parseFloat($scope.undueProfitloss).toFixed(2));
				    			$( api.column( 17 ).footer() ).html(parseFloat($scope.longMargin).toFixed(2));
				    			$( api.column( 18 ).footer() ).html(parseFloat($scope.shortMargin).toFixed(2));
				    			$( api.column( 19 ).footer() ).html(parseFloat($scope.totalMargin).toFixed(2));
				    			$( api.column( 20 ).footer() ).html(parseFloat($scope.tradeFee).toFixed(2));
				    			$( api.column( 21 ).footer() ).html(parseFloat($scope.exerciseFee).toFixed(2));
				    			$( api.column( 22 ).footer() ).html(parseFloat($scope.otherFee).toFixed(2));
				    			$( api.column( 23 ).footer() ).html(parseFloat($scope.deferredFee).toFixed(2));
				    			$( api.column( 24 ).footer() ).html(parseFloat($scope.buyMoney).toFixed(2));
				    			$( api.column( 25 ).footer() ).html(parseFloat($scope.sellMoney).toFixed(2));
				    		}*/
		        } );
      });
    
});

