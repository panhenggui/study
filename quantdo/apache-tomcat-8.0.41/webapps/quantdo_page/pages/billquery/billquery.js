myapp.controller('BillQuery', function ($scope, $timeout,$rootScope) {
	
	$scope.tradeTypes = clearConstant.tradeTypes;//交易类型
	$scope.offsetFlags = clearConstant.offsetFlag;	//开平
	$scope.tradeDirections = clearConstant.tradeDirection;	//买卖方向
	$scope.currenys = clearConstant.currenys;	//币种
	$scope.subAccount = {}; 
	var d = new Date();
	var currentDate = d.getFullYear() + "" + (d.getMonth() + 1) + "" + (d.getDate() + 1);

	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,
	    autoclose: true,
	    clearBtn: true,
	    todayHighlight: true,
	    format: 'yyyymmdd',
		endDate:currentDate
	});
    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$scope.settleDate = clearConstant.formatDate(new Date());
//	$scope.endDate = clearConstant.formatDate(new Date());
	$scope.subCapitalAccountService = new com.quantdo.orgClear.service.SubCapitalAccountService();
	$scope.subAccountCapitalService = new com.quantdo.orgClear.service.SubAccountCapitalService();
	$scope.subMoneyIOService = new com.quantdo.orgClear.service.SubMoneyIOService();
	$scope.tradeService = new com.quantdo.orgClear.service.TradeService();
	$scope.subPositionDetailService = new com.quantdo.orgClear.service.SubPositionDetailService();
	$scope.jsTypes = clearConstant.jsTypes;
 
	
	$scope.map = {};
	$scope.entity = [];
	$scope.subOffsetEntitys = [];
	$scope.tradeEntitys = [];
	$scope.tradeSum = {};
	$scope.subPositionSum = {};
	$scope.BillQueryCapitalDataset = [];
	$scope.BillQueryInoutDataset = [];
	$scope.BillQueryDealDataset = [];
	$scope.BillQuerySellingDataset = [];
	$scope.BillQueryPositionDataset = [];
	
    $scope.billquery_query =  isShow("billquery_query");
    $scope.billquery_export = isShow("billquery_export");

    $scope.subAccount.type = $scope.jsTypes[0].key;  //默认选中
	$scope.tradeSum = {
			volume:0,
			tradeMoney:0,
			tradeFee:0
	};
	$scope.openPositions = {
			volume:0,
			closingProfitAndLoss:0
	};
	$scope.subPositionSum = {
			inPosition:0,
			outPosition:0,
			margin:0
	};
	
	//定义资金固定列头
    $scope.BillQueryCapital_columns = [
        {title: "序号"},
        {title: "上日结存"},
		{title: "当日出入金"},
		{title: "当日权利金收支"},
		{title: "当日手续费"},
		{title: "当日总盈亏"},
		{title: "期末权益"},
		{title: "总保证金"},
		{title: "可用资金"},
		{title: "风险度"},
		{title: "币种"}
	]
	//定义出入金固定列头
    $scope.BillQueryInout_columns = [
        {title: "序号"},
        {title: "发生日期"},
		{title: "方向"},
		{title: "金额"},
		{title: "币种"},
		{title: "备注"}
	]
	
	//定义成交固定列头
    $scope.BillQueryDeal_columns = [
        {title: "序号"},
        {title: "合约号"},
		{title: "买卖"},
		{title: "开平"},
		{title: "投保标志"},
		{title: "成交均价"},
		{title: "手数"},
		{title: "成交额"},
		{title: "手续费"}
	]
	
	//定义平仓固定列头
    $scope.BillQuerySelling_columns = [
        {title: "序号"},
		{title: "合约号"},
		{title: "买卖"},
		{title: "成交均价"},
		{title: "开仓均价"},
		{title: "手数"},
		{title: "昨结算价"},
		{title: "平仓盈亏"},
		{title: "投保标志"},
		{title: "币种"}
	]
	
	//定义持仓固定列头
    $scope.BillQueryPosition_columns = [
        {title: "序号"},
        {title: "合约号"},
		{title: "买均价"},
		{title: "买持仓"},
		{title: "卖均价"},
		{title: "卖持仓"},
		{title: "昨结算价"},
		{title: "今结算价"},
		{title: "持仓盈亏"},
		{title: "保证金"},
		{title: "投保标志"}
	]
	
	
    $scope.reSubAccounts = function(){
    	if($scope.subAccount.instClientID == ""){
    		$scope.subAccount.instClientID = null;
    	}
    	var instClientID = $scope.subAccount.instClientID;
		//查询资产单元
		findBySubCapitalAccountInfo({"instClientID":instClientID}, function(result){
			if(result.length>0){
				$scope.SubAccounts = result;
			}else {
				$scope.SubAccounts = [];
				$scope.subAccount.subAccountID = "";
			}
			$scope.$apply();
		});
    }
	
	
	//查询资产单元
//	$scope.subAccount = {};
	findBySubCapitalAccountInfo({"instClientID":null}, function(result){
		$scope.SubAccounts = result;
		$scope.subAccount.subAccountID =$scope.SubAccounts[0].subAccountID;
		//$scope.subAccount = result[0];
		$scope.$apply();
	});
	
	
	//转换id
	$scope.transTradeType = function(key){
		for(var i = 0;i < $scope.tradeTypes.length;i++){
			if($scope.tradeTypes[i].key == key){
				return $scope.tradeTypes[i].text;
			}
		}
	};
	
	$scope.transOffsetFlag = function(key){
		for(var i = 0;i < $scope.offsetFlags.length;i++){
			if($scope.offsetFlags[i].key == key){
				return $scope.offsetFlags[i].text;
			}
		}
	};
	
	$scope.transTradeDirection = function(key){
		for(var i = 0;i < $scope.tradeDirections.length;i++){
			if($scope.tradeDirections[i].key == key){
				return $scope.tradeDirections[i].text;
			}
		}
	};
	
	$scope.transCurreny = function(key){
		for(var i = 0;i < $scope.currenys.length;i++){
			if($scope.currenys[i].key == key){
				return $scope.currenys[i].text;
			}
		}
	};
	
	$scope.instClientList = [];
    getInstClientQueryConditionList(function(result){
        for (var i = 0 ; i< result.length ; i++) {
            if(result[i].amType == "2"){
                $scope.instClientList.push(result[i]);
            }
        }
    	//$scope.instClientList = angular.copy(result);
    	if($scope.instClientList.length > 0){
    		$scope.subAccount.instClientID = $scope.instClientList[0].instClientID;
    		$scope.changeInstClient();
    	}
    });
    
    queryInstClientID(function(result){
    	if(result != undefined){
    		$scope.noInst = true;
    	}else{
    		$scope.noInst = false;
    	}
    });
    
	
    $scope.changeInstClient = function(){
    	if($scope.subAccount.instClientID == ""){
    		$scope.subAccount.instClientID = null;
    	}
    	var instClientID = $scope.subAccount.instClientID;
		//查询资产单元
        findBySubCapitalAccountByUserType({"instClientID":instClientID}, function(result){
			if(result.length>0){
				$scope.SubAccounts = result;
				$scope.subAccount.subAccountID = result[0].subAccountID ;
			}else {
				$scope.SubAccounts = [];
				$scope.subAccount.subAccountID = "";
			}
			$scope.$apply();
		});
	}
    
	

 // 根据页面条件查询
    $scope.search = function (settleDate,subAccount) {
    	$scope.BillQueryCapitalDataset = [];
    	$scope.BillQueryInoutDataset = [];
    	$scope.BillQueryDealDataset = [];
    	$scope.BillQuerySellingDataset = [];
    	$scope.BillQueryPositionDataset = [];
		$scope.isQuery = true;
		if(undefined == settleDate){
			return;
		}
		if(subAccount.subAccountID == null){
			subAccount.subAccountID = "";
		}
		$scope.map.subAccountID = subAccount.subAccountID;
		$scope.map.settleDate = settleDate;


		if(subAccount.instClientID == null){
			subAccount.instClientID = "";
		}
		$scope.map.instClientID = subAccount.instClientID;
		$scope.map.type = subAccount.type ;
		
		//资金情况
		getSumSubAccountCapital(function(result){
			$scope.listEntitys = result;
			var con = result;
			if(result != null && result.length>0){
					for(var i = 0; i<con.length;i++){
				    	var tempArr = [(i+1),parseFloat(con[i].lastInterest).toFixed(2),parseFloat(con[i].subMoney).toFixed(2),parseFloat(con[i].totalPremium).toFixed(2),
				    		parseFloat(con[i].tradeFee).toFixed(2),parseFloat(con[i].profitloss).toFixed(2),parseFloat(con[i].finalInterest).toFixed(2),
				    		parseFloat(con[i].totalMargin).toFixed(3),parseFloat(con[i].available).toFixed(2),con[i].riskValue,$scope.transCurreny(con[i].currency)]
				    	$scope.BillQueryCapitalDataset.push(tempArr); 
					}
			}else{
				$scope.BillQueryCapitalDataset = [];
			}
			//重新绘表
	        $scope.BillQueryCapitalTable.clear().draw();
	        $scope.BillQueryCapitalTable.rows.add($scope.BillQueryCapitalDataset).draw();
			$scope.$apply();			
		},$scope.map);
		
		//出入金
		$scope.subMoneyIOService.find(function(result){
			$scope.subMoneyIoEntitys = [];
			$scope.subMoneyIoEntitys = result;
			$scope.moneyOut = 0;//出金
			$scope.moneyIn = 0;//入金			
			var con = result;
			if(result != null && result.length>0){
					for(var i = 0; i<con.length;i++){
				    	var tempArr = [(i+1),con[i].settleDate,con[i].direction,parseFloat(con[i].subMoney).toFixed(2)
				    	               ,$scope.transCurreny(con[i].currency),con[i].remark]
				    	$scope.BillQueryInoutDataset.push(tempArr); 
				    	$scope.moneyOut += con[i].moneyOut;//出金
						$scope.moneyIn += con[i].moneyIn;//入金
					}
			}else{
				$scope.BillQueryInoutDataset = [];
			}
			//重新绘表
	        $scope.BillQueryInoutTable.clear().draw();
	        $scope.BillQueryInoutTable.rows.add($scope.BillQueryInoutDataset).draw();		
			$scope.subMoneySum = $scope.moneyIn - $scope.moneyOut;
			$scope.drcrj = $scope.subMoneySum;//当日出入金
			$scope.$apply();
			
		},$scope.map);
		
		
		//成交汇总
		$scope.tradeService.dealCount(function(result){
			$scope.tradeEntitys = [];
			$scope.tradeSum = {
					volume:0,
					tradeMoney:0,
					tradeFee:0
			};
			var con = result;
			$scope.tradeEntitys = result;
			if(result != null && result.length>0){
				for(var i = 0; i<con.length;i++){
					if(i<con.length-1){
						var tempArr = [(i+1),con[i].instrumentId,$scope.transTradeDirection(con[i].direction),$scope.transOffsetFlag(con[i].offsetFlag),$scope.transTradeType(con[i].hedgeFlag)
				    	               ,parseFloat(con[i].tradePrice).toFixed(3),con[i].volume,parseFloat(con[i].tradeMoney).toFixed(2),$scope.tranTradeFee(con[i].tradeFee)];
				    	$scope.BillQueryDealDataset.push(tempArr); 
					}else{
						$scope.tradeSum = con[i];
					}		    	
				}
			}else{
				$scope.BillQueryDealDataset = [];
			}
			//重新绘表
	        $scope.BillQueryDealTable.clear().draw();
	        $scope.BillQueryDealTable.rows.add($scope.BillQueryDealDataset).draw();		
			$scope.$apply();
		},$scope.map);
		
		$scope.tranTradeFee = function(tradeFee){
	    	if(tradeFee === '' || tradeFee === undefined || tradeFee === null){
	    		return "待结算";
	    	}else{
	    		return parseFloat(tradeFee).toFixed(2);
	    	}
	    }
		
		// 平仓汇总
		billQuerySubOffset(function(result){
			$scope.subOffsetEntitys = [];
			$scope.subOffsetEntitys = result; 
			var con = result;
			$scope.openPositions = {
					volume:0,
					closingProfitAndLoss:0
			};
			if(result != null && result.length>0){
				for(var i = 0; i<con.length;i++){
						var tempArr = [(i+1),con[i].instrumentID,con[i].direction,parseFloat(con[i].tradePrice).toFixed(3),parseFloat(con[i].openPrice).toFixed(3)
						               ,con[i].volume,parseFloat(con[i].lastSettlePrice).toFixed(3),parseFloat(con[i].profitlossByDate).toFixed(2),$scope.transTradeType(con[i].tradeType),$scope.transCurreny(con[i].currency)]
				    	$scope.BillQuerySellingDataset.push(tempArr); 	  
						$scope.openPositions.volume += con[i].volume;
						$scope.openPositions.closingProfitAndLoss += con[i].profitlossByDate;
				}
			}else{
				$scope.BillQuerySellingDataset = [];
			}
			//重新绘表
	        $scope.BillQuerySellingTable.clear().draw();
	        $scope.BillQuerySellingTable.rows.add($scope.BillQuerySellingDataset).draw();		
			$scope.$apply();
		},$scope.map);
		
		
		//持仓汇总
		$scope.subPositionDetailService.findByQuery(function(result){
			$scope.subPositionDetailEntitys = [];
			$scope.subPositionSum = {
					inPosition:0,
					outPosition:0,
					margin:0
			};
			var con = result;
			$scope.subPositionDetailEntitys = result;
			if(result != null && result.length>0){
					for(var i = 0; i<con.length;i++){
						if(i<con.length-1){
							var tempArr = [(i+1),con[i].instrumentID,$scope.formatPrecisionStr(con[i].inPositionPrice),$scope.formatStr(con[i].inPosition),$scope.formatPrecisionStr(con[i].outPositionPrice)
							               ,$scope.formatStr(con[i].outPosition),parseFloat(con[i].lastSettlePrice).toFixed(3),parseFloat(con[i].settlePrice).toFixed(3)
							               ,parseFloat(con[i].profitlossByDate).toFixed(2),parseFloat(con[i].margin).toFixed(3),$scope.transTradeType(con[i].tradeType)]
					    	$scope.BillQueryPositionDataset.push(tempArr);
							var margin = parseFloat(con[i].margin);
							$scope.subPositionSum.margin = parseFloat($scope.subPositionSum.margin);
							var inPosition = con[i].inPosition;
							var outPosition = con[i].outPosition;
							
							if(inPosition == undefined ){
								inPosition =0;
							}
							if(outPosition == undefined ){
								outPosition =0;
							}
							$scope.subPositionSum.inPosition += inPosition;
							$scope.subPositionSum.outPosition +=outPosition;
							$scope.subPositionSum.margin += margin;
						}		    	
					}
			}else{
				$scope.BillQueryPositionDataset = [];
			}
			//重新绘表
	        $scope.BillQueryPositionTable.clear().draw();
	        $scope.BillQueryPositionTable.rows.add($scope.BillQueryPositionDataset).draw();		
			$scope.$apply();
			
		},$scope.map);
		
		$timeout(function() {
            $scope.isQuery = false;
        }, 1000);
    };

    $timeout(function() {
        $scope.search($scope.settleDate,{instClientID:$scope.subAccount.instClientID,subAccountID:$scope.subAccount.subAccountID});
    }, 1000);
    
    $scope.formatStr = function(str){
    	var result = "";
    	if(str==0||str== undefined){
    		result = "--";
    	}else{
    		result = str ;
    	}
    	return result;
    }
    
    $scope.formatPrecisionStr = function(str){
    	var result = "";
    	if(str==0||str== undefined){
    		result = "--";
    	}else{
    		result = parseFloat(str).toFixed(3);
    	}
    	return result;
    }

	
	$scope.exportExcel = function(settleDate,subAccount){
		$scope.isQuery = true;
		if(undefined == settleDate){
			return;
		}
		if(subAccount.subAccountID == null){
			subAccount.subAccountID = "";
		}
		$scope.map.subAccountID = subAccount.subAccountID;
		$scope.map.settleDate = settleDate;
		if(subAccount.instClientID == null){
			subAccount.instClientID = "";
		}
		$scope.map.instClientID = subAccount.instClientID;
		$scope.map.type =subAccount.type;
		
		$timeout(function() {
            $scope.isQuery = false;
        }, 1000);
		
		framework.file.export(subAccount.subAccountID+"-"+settleDate+".xls",'excel_f',{
			title:subAccount.subAccountID+"-"+settleDate,
			ftlFile:"templates/dailyTable",
			dicMap:{title:{'0':"资金情况",'1':"出入金",'2':"成交汇总",'3':"持仓汇总",'4':"平仓汇总",'5':"合计",
							'6':"资产单元",'7':"资产单元名称",'8':"日期",'9':"机构代码"},
					direction:{'0':"买",'1':"卖"},
					tradeType:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商",'blank':"-"},
					currency:{'CNY':"人民币",'USD':"美元",'JPY':"日元",'AUD':"澳元",'GBP':"英镑",'HKD':"港币",
							'KRW':"韩元",'EUR':"欧元",'SGD':"新加坡元",'MYR':"林吉特",'CAD':"加元",'CENT':"美分"},
					offsetFlag:{'0':'开仓','1':'平仓','2':'强平','3':'平今','4':'平昨','blank':"-"},
					subAccountCapital:{'0':"上日结存",'1':"当日出入金",'2':"当日手续费",
							'3':"当日总盈亏",'4':"期末权益",'5':"总保证金",'6':"可用资金",'7':"风险度",'8':"币种: ",'9':"权利金收支"},
					subMoneyIO:{'0':"发生日期",'1':"方向",'2':"金额",'3':"币种",'4':"备注"},
					tradeQuery:{'0':"合约号",'1':"买卖",'2':"开平",'3':"投保标志",'4':"成交均价",'5':"手数",'6':"成交额",'7':"手续费"},
					subPosition:{'0':"合约号",'1':"买均价",'2':"买持仓",'3':"卖均价",'4':"卖持仓",'5':"昨结算价",
							'6':"今结算价",'7':"持仓盈亏",'8':"保证金",'9':"投保标志"},
					subOffSet:{'0':"合约号",'1':"买卖",'2':"成交均价",'3':"开仓均价",'4':"手数",'5':"昨结算价",'6':"平仓盈亏",'7':"投保标志",'8':"币种"}}
		},"subAccountCapitalService","getDailyExportList",$scope.map);
	};
	
	//初始化
    $(document).ready(function() {
		    	//会话列表初始化 持仓 billquery_position_table
		    	$scope.BillQueryPositionTable = $('#billquery_position_table').DataTable( {
			    		data : $scope.BillQueryPositionDataset,
			        	columns :$scope.BillQueryPosition_columns,
			            dom: 'rt<"bottom"iplB>',
			            bPaginate:false,
			            bInfo:false,
			            bFilter:false,
						buttons: []
		    			, "footerCallback": function () {
				    	     var api = this.api();
				    	    $( api.column( 3).footer() ).html($scope.subPositionSum.inPosition);
		    				$( api.column( 5 ).footer() ).html($scope.subPositionSum.outPosition);
		    				$( api.column( 9 ).footer() ).html(parseFloat($scope.subPositionSum.margin).toFixed(3));
						}
		        } );
		    	
		    	//会话列表初始化 平仓 billquery_selling_table
		    	$scope.BillQuerySellingTable = $('#billquery_selling_table').DataTable( {
		    		data : $scope.BillQuerySellingDataset,
		        	columns :$scope.BillQuerySelling_columns,
		            dom: 'rt<"bottom"iplB>',
		            bPaginate:false,
		            bInfo:false,
		            bFilter:false,
					buttons: [],
					"footerCallback": function () {
			    	     var api = this.api();
			    	    $( api.column( 5 ).footer() ).html($scope.openPositions.volume);
	    				$( api.column( 7 ).footer() ).html(parseFloat($scope.openPositions.closingProfitAndLoss).toFixed(2));
					}
	        } );
		    	//会话列表初始化 成交 billquery_deal_table
		    	$scope.BillQueryDealTable = $('#billquery_deal_table').DataTable( {
		    		data : $scope.BillQueryDealDataset,
		        	columns :$scope.BillQueryDeal_columns,
		            dom: 'rt<"bottom"iplB>',
		            bPaginate:false,
		            bInfo:false,
		            bFilter:false,
					buttons: []
		    	   , "footerCallback": function () {
			    	     var api = this.api();
			    	    $( api.column( 6 ).footer() ).html($scope.tradeSum.volume);
	    				$( api.column( 7 ).footer() ).html(parseFloat($scope.tradeSum.tradeMoney).toFixed(2));
	    				$( api.column( 8 ).footer() ).html(parseFloat($scope.tradeSum.tradeFee).toFixed(2));
					}
	        } );
		    	//会话列表初始化 出入金 billquery_inout_table
		    	$scope.BillQueryInoutTable = $('#billquery_inout_table').DataTable( {
		    		data : $scope.BillQueryInoutDataset,
		        	columns :$scope.BillQueryInout_columns,
		            dom: 'rt<"bottom"iplB>',
		            bPaginate:false,
		            bInfo:false,
		            bFilter:false,
					buttons: []
	        } );
		    	//会话列表初始化 资金 billquery_capital_table
		    	$scope.BillQueryCapitalTable = $('#billquery_capital_table').DataTable( {
		    		data : $scope.BillQueryCapitalDataset,
		        	columns :$scope.BillQueryCapital_columns,
		            dom: 'rt<"bottom"iplB>',
		            bPaginate:false,
		            bInfo:false,
		            bFilter:false,
					buttons: []
	        } );
      });
	
	
});
