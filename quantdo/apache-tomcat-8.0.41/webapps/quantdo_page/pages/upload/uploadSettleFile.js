myapp.controller('uploadSettleFileController', ['$scope', 'Upload','$rootScope', function ($scope, Upload,$rootScope) {
	$scope.queryEntity = {};//查询条件
	$scope.queryEntity.tradeDate = clearConstant.formatDate(new Date());
	$scope.isQuery = true;
	$scope.isDoAudit = false;
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();

	$scope.uploadService = new com.quantdo.orgClear.service.UploadSettleFileService();
    $("[forType='date']").datepicker({
        language: 'zh-CN',
        weekStart: 1,
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        format: 'yyyymmdd'
    });
    
    $scope.uploadSettle_query = isShow("uploadSettle_query");
    $scope.uploadSettle_audit = isShow("uploadSettle_audit");

    $scope.uploadService =  new com.quantdo.orgClear.service.UploadSettleFileService();
    
    //初始化机构信息
    $scope.instClientList = [];
    getInstClientQueryConditionList(function(result){
    	$scope.instClientList = angular.copy(result);
    	$scope.$apply();
    });
    
    $scope.queryModels = [
    	{text: '期货成交明细', key: '1'},
        {text: '期权成交明细', key: '4'},
        {text: '持仓汇总', key: '2'},
        {text: '资金汇总', key: '3'}
    ];
    $scope.queryEntity.type = $scope.queryModels[0].key;
    
    $scope.isAudit = false;
    
    $scope.isTrade = true;
    $scope.changeType = function(type){
    	if(type == 1 || type == 4){
    		$scope.isTrade = true;
    	}else{
    		$scope.isTrade = false;
    	}
    }
    
    //资金账户稽核表头
    $scope.tradeCapAudit_columns = [
    	{title:"id",visible:false}, 
    	{title:"交易日期"},
    	{title:"成交单号"},
    	{title:"所属机构"},
    	{title:"资金账号"},
    	{title:"交易所代码"},
    	{title:"合约代码"},
    	{title:"买卖方向"},
    	{title:"交易类型"},
    	{title:"开平标志"},
    	{title:"成交额"},
    	{title:"成交数量"}
    ];
    
    //资产单元稽核表头
    $scope.tradeSubAudit_columns = [
    	{title:"id",visible:false}, 
    	{title:"交易日期"},
    	{title:"成交单号"},
    	{title:"所属机构"},
    	{title:"资金账号"},
    	{title:"资产单元"},
    	{title:"交易所代码"},
    	{title:"合约代码"},
    	{title:"买卖方向"},
    	{title:"交易类型"},
    	{title:"开平标志"},
    	{title:"成交额"},
    	{title:"成交数量"}
    ];
    
    $scope.audit = function(){
    	$scope.isAudit = true;
    	$scope.isDoAudit = true;
    	$scope.isImportTrade = false;
		$scope.isImportFuturesHold = false;
		$scope.isImportInvestoraccount = false;
    	$scope.tradeCapAuditDataset = [];
    	$scope.tradeSubAuditDataset = []; 
    	$scope.uploadService.checkTrade(function(result) {
    		if(result == ""){
    			layer.msg("成交稽核通过!",{icon: 1});
    		}else if(result == undefined || result == null){
    			layer.msg("未导入成交记录!",{icon: 2});
    			$scope.isDoAudit = false;
    			$scope.$apply();
    			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    			return false;
    		}
    		$scope.isDoAudit = false;
    		var con = result;
    		var capIndex = 1;
    		var subIndex = 1;
    		for(var i=0;i<con.length;i++){
    			if(con[i].cap != undefined){
    				var tempArr = [(i+1),con[i].cap.tradeDate,con[i].cap.tradeID,$scope.transInstClientID(con[i].cap.instClientID),con[i].cap.innerAccountID,
    				    con[i].cap.exchangeId,con[i].cap.instrumentId,$scope.transDirection(con[i].cap.direction),$scope.transOffsetFlag(con[i].cap.offsetFlag),
    				    $scope.transHedgeFlag(con[i].cap.hedgeFlag),con[i].cap.tradePrice.toFixed(3),con[i].cap.volume]
    				con[i].cap.index = capIndex;
    				capIndex += 1;
    		    	$scope.tradeCapAuditDataset.push(tempArr);
        		}
    			if(con[i].sub != undefined){
        			var tempArr = [(i+1),con[i].sub.tradeDate,con[i].sub.tradeID,$scope.transInstClientID(con[i].sub.instClientID),con[i].sub.innerAccountID,con[i].sub.subAccountID,
        			    con[i].sub.exchangeId,con[i].sub.instrumentId,$scope.transDirection(con[i].sub.direction),$scope.transOffsetFlag(con[i].sub.offsetFlag),
        			    $scope.transHedgeFlag(con[i].sub.hedgeFlag),con[i].sub.tradePrice.toFixed(3),con[i].sub.volume]
        			con[i].index = capIndex;
        			capIndex += 1;
        		    $scope.tradeSubAuditDataset.push(tempArr);
        		}
    		}
    		
    		$scope.tradeCapAuditTable.clear().draw();
			$scope.tradeCapAuditTable.rows.add($scope.tradeCapAuditDataset).draw();
			$scope.tradeSubAuditTable.clear().draw();
			$scope.tradeSubAuditTable.rows.add($scope.tradeSubAuditDataset).draw();
			$scope.$apply();
			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    	}); 
    };
    
    $scope.transInstClientID = function(instClientID){
    	for(var i=0;i<$scope.instClientList.length;i++){
			if($scope.instClientList[i].instClientID == instClientID){
				return $scope.instClientList[i].instClientAbbrName;
			}
		}
    	return "";
    }
    
    //成交列头
    $scope.ImportTrade_columns = [
          {title: "序号"},
          {title:"id",visible:false},
          {title: "交易日期"},
          {title: "成交流水号"},
          {title: "资金账号"},
          {title: "交易所代码"},
          {title: "合约代码"},
          {title: "交易类型"},
          {title: "买卖方向"},
          {title: "开平标志"},
          {title: "投机套保标志"},
          {title: "成交价格"},
          {title: "成交数量"},
          {title: "成交额"},
          {title: "成交时间"},
          {title: "交易手续费"},
          {title: "币种"},
          {title: "备兑标志"}
    ]; 
    
    //持仓列头
    $scope.ImportFuturesHold_columns = [
           {title: "序号"},
           {title:"id",visible:false},
           {title: "交易日期"},
           {title: "资金账号"},
           {title: "交易所代码"},
           {title: "合约代码"},
           {title: "交易类型"},
           {title: "买卖方向"},
           {title: "投机套保标志"},
           {title: "持仓量"},
           {title: "交易保证金"},
           {title: "币种"},
           {title: "备兑标志"}
    ]
    
    // 资金列头
    $scope.ImportInvestoraccount_columns = [
           {title: "序号"},
           {title:"id",visible:false},
           {title: "交易日期"},
           {title: "资金账号"},
           {title: "资金权益总额"},
           {title: "可用资金"},
           {title: "需追加保证金"},
           {title: "风险度"},
           {title: "当日盈亏(逐日)"},
           {title: "当日盈亏(逐笔)"},
           {title: "浮动盈亏"},
           {title: "币种"},
           {title: "当日总权利金"}
     ]
    
    // 查询(前台分页)
    $scope.find = function(){
    	$scope.isQuery = true;
    	$scope.isAudit = false;
    	$scope.Dataset = [];
    	//更新表格对应的数据集
    	$scope.uploadService.findByQuery($scope.queryEntity,function(result) {
    		var con = result;
    		var tempArray = new Array();
    		if($scope.queryEntity.type == '1' || $scope.queryEntity.type == '4'){
    			if($scope.queryEntity.type == '1'){
    				$($("#importTrade_dynamic_table_wrapper thead th")[10]).html("成交价格");
    				$($("#importTrade_dynamic_table_wrapper thead th")[12]).html("成交额");
    			}else{
    				$($("#importTrade_dynamic_table_wrapper thead th")[10]).html("权利金单价");
    				$($("#importTrade_dynamic_table_wrapper thead th")[12]).html("权利金");
    			}
    			$scope.isImportTrade = true;
    			$scope.isImportFuturesHold = false;
    			$scope.isImportInvestoraccount = false;
    			for(var i = 0; i<con.length;i++){
    		    	var tempArr = [(i+1),con[i].id,con[i].tradeDate,con[i].tradeID,con[i].innerAccountID,con[i].exchangeId,con[i].instrumentId
    		    		,$scope.transTradeType(con[i].tradeType),$scope.transDirection(con[i].direction),$scope.transOffsetFlag(con[i].offsetFlag)
    		    	    ,$scope.transHedgeFlag(con[i].hedgeFlag),con[i].tradePrice.toFixed(3),con[i].volume,con[i].tradeMoney.toFixed(3),con[i].tradeingTime
    		    	    ,con[i].tradeFee,$scope.transCurrency(con[i].currency),$scope.transCoveredFlag(con[i].coveredFlag)]
    		    	$scope.Dataset.push(tempArr);
    		    	con[i].index = i+1;
    			}
    			 //重新绘表
    			$scope.importTradeTable.clear().draw();
    			$scope.importTradeTable.rows.add($scope.Dataset).draw();
    			$scope.isQuery = false;
    			$scope.$apply();
    			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    		}else if($scope.queryEntity.type == "2"){
    			$scope.isImportTrade = false;
    			$scope.isImportFuturesHold = true;
    			$scope.isImportInvestoraccount = false;
    			for(var i = 0; i<con.length;i++){
	   		    	var tempArr = [(i+1),con[i].id,con[i].tradeDate,con[i].innerAccountID,con[i].exchangeId,con[i].instrumentId,
	   		    		$scope.transTradeType(con[i].tradeType),$scope.transDirection(con[i].direction),$scope.transHedgeFlag(con[i].hedgeFlag),con[i].position
	    		    	,con[i].margin.toFixed(2),$scope.transCurrency(con[i].currency),$scope.transCoveredFlag(con[i].coveredFlag)]
	   		    	$scope.Dataset.push(tempArr);
	   		    	con[i].index = i+1;
    			}
    			$scope.ImportFuturesHoldTable.clear().draw();
    			$scope.ImportFuturesHoldTable.rows.add($scope.Dataset).draw();
    			$scope.isQuery = false;
    			$scope.$apply();
    			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    		}else if($scope.queryEntity.type == "3"){
    			$scope.isImportTrade = false;
    			$scope.isImportFuturesHold = false;
    			$scope.isImportInvestoraccount = true;
    			for(var i = 0; i<con.length;i++){
    			   	var tempArr = [(i+1),con[i].id,con[i].tradeDate,con[i].innerAccountID,con[i].dynamicrights.toFixed(2),con[i].available.toFixed(2)
    			   	    ,con[i].needAddMargin.toFixed(2),con[i].risk.toFixed(2),con[i].dailyCloseProfit.toFixed(2),con[i].numberCloseProfit.toFixed(2)
    			   	    ,con[i].floatNumberCloseProfit.toFixed(2),$scope.transCurrency(con[i].currency),con[i].premium.toFixed(2)]
    			   	$scope.Dataset.push(tempArr);
    			   	con[i].index = i+1;
    			}
    		    $scope.ImportInvestoraccountTable.clear().draw();
    		    $scope.ImportInvestoraccountTable.rows.add($scope.Dataset).draw();
    		    $scope.isQuery = false;
    		    $scope.$apply();
    		    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    		}    
        }); 
    }
    
    // 初始化查询
    setTimeout(function(){
		$scope.find($scope.queryEntity);
 	},1000)
 	
    $scope.transDirection = function(key){
		if(key=="0"){
			return "买";
		}else if(key=="1"){
			return "卖";
		}else{
			return "";
		}
	};
	
	$scope.transOffsetFlag = function(key){
		if(key=="0"){
			return "开仓";
		}else if(key=="1"){
			return "平仓";
		}else{
			return "";
		}
	};
	
	$scope.transHedgeFlag = function(key){
		if(key=="1"){
			return "投机";
		}else if(key=="2"){
			return "套利";
		}else if(key=="3"){
			return "套保";
		}else{
			return "";
		}
	};
	
	$scope.transCurrency = function(key){
		if(key=="CNY"){
			return "人民币";
		}else if(key=="USD"){
			return "美元";
		}else{
			return "";
		}
	};
	
	$scope.transCoveredFlag = function(key){
		if(key=="1"){
			return "备兑";
		}else if(key=="2"){
			return "非备兑";
		}else{
			return "";
		}
	};
	
	$scope.transTradeType = function(key){
		if(key=="1"){
			return "期货";
		}else if(key=="2"){
			return "期权";
		}else{
			return "";
		}
	};
	
    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.importTradeTable = $('#importTrade_dynamic_table').DataTable( {
    		data : $scope.Dataset,
        	columns :$scope.ImportTrade_columns,
            dom: 'rt<"bottom"iplB>',
			buttons: [
			   
			]
        });
    	
    	$scope.ImportFuturesHoldTable = $('#importFuturesHold_dynamic_table').DataTable( {
    		data : $scope.Dataset,
        	columns :$scope.ImportFuturesHold_columns,
            dom: 'rt<"bottom"iplB>',
			buttons: [
			   
			]
        });
    	
    	$scope.ImportInvestoraccountTable = $('#importInvestoraccount_dynamic_table').DataTable( {
    		data : $scope.Dataset,
        	columns :$scope.ImportInvestoraccount_columns,
            dom: 'rt<"bottom"iplB>',
			buttons: [
			   
			]
        });
    	
    	$scope.tradeCapAuditTable = $('#tradeCapAudit_dynamic_table').DataTable( {
    		data : $scope.tradeCapAuditDataset,
        	columns :$scope.tradeCapAudit_columns,
            dom: 'rt<"bottom"iplB>',
			buttons: [
			   
			]
        });
    	
    	$scope.tradeSubAuditTable = $('#tradeSubAudit_dynamic_table').DataTable( {
    		data : $scope.tradeSubAuditDataset,
        	columns :$scope.tradeSubAudit_columns,
            dom: 'rt<"bottom"iplB>',
			buttons: [
			   
			]
        });
    });
    
    // jquery upload
    $("#uploadDaySettleFileloader").uploadFile({
        url: framework.file.uploadUrl("uploadSettleFileService", "importFile"),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
                if(result.errorFlg != "succ") {                	
                    layer.msg(result.errorMessages,{icon: 2});
                } else {
                	layer.msg("成功导入"+result.succCon+"条记录！", {icon: 1, time: 1500});
                }
            });        	
        },
        onSelect: function (files) {
            var fileName = files[0].name;
            var suffix = fileName.substring(fileName.lastIndexOf('.') + 1);
            if(suffix != "zip" && suffix != "txt"){
          	  layer.msg('上传文件必须为zip或者文件格式，例如：**.zip', {icon: 2}, 3000);
                return false;
            }
            return true;
        }
    });
    
    /*$("#excelImport").uploadFile({
	  dragdropWidth: 125,
      uploadStr:"Excel导入",
      dragDropStr: "",
      dragDropContainerClass:"",
    url: framework.file.uploadUrl("uploadFundService", "readExcelFile"),
    fileName: "file",// 名字不能改
    onSuccess: function (files, response, xhr, pd) {
    	framework.file.uploadCallback(response,function(errCode,errMsg,result) {
            if(errCode != 0) {
                console.log(errCode);
                layer.msg(errCode + ': ' + errMsg,{icon: 2});
            } else {
            	if(result.totNum){
					layer.msg("成功导入"+result.totNum+"条记录！", {icon: 1, time: 3000});
					queryFunds(function (result) {
		                $scope.tradeEntitys = result;
		                $scope.$apply();
		            });
				}else{
					//导入失败
					layer.msg(result.errorMes, {icon: 2, time: 10000});
				}
            }

        });
    },
    onSelect: function (files) {
        var file = files[0];
        var fileName = file.name;
        var suffix = fileName.substring(fileName.lastIndexOf('.') + 1);
        if(suffix == "xlsx" || suffix == "xls" ){
        	if($scope.exchStatus.exchStatus == '1'){
    			layer.msg('当前系统状态为交易准备状态，不允许导入！', {icon: 2}, 3000);
    			return false;;
    		}else if($scope.exchStatus.exchStatus == '3'){
    			layer.msg('当前系统状态为结算状态，不允许导入！', {icon: 2}, 3000);
    			return false;
    		}
        } else {
            layer.msg('上传文件必须为Excel文件格式，例如：xlsx、xls', {icon: 2}, 3000);
            return false;
        }
    }
  });*/
}]);