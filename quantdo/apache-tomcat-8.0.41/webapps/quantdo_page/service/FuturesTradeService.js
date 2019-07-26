Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.FuturesTradeService = function() {
// 根据ID删除
this.remove = function(callback,id) {
	framework.service.request('futuresTradeService', 'delete', id, function(errCode,
			errMsg, result) {
		if (errCode > 0) {
			layer.msg(errMsg,{icon: 2});
		}else if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}
//条件查询
this.findByCondition = function(callback,instrumentID,beginDate,endDate) {
	framework.service.request('futuresTradeService', 'findByCondition',instrumentID,beginDate,endDate, function(
			errCode, errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}

// jtable后台分页方法
this.backPageHisPositionReport = function(entity, requestParams, orderType, orderway, callback){
	 framework.service.request('futuresTradeService', 'backPagingHisPositionReport', entity, requestParams, orderType, orderway, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
}
// 导出
this.exportHisPositionReport = function(entity){
	framework.file.export("HisPositionReport.xlsx",'excel',{
		entityKey:['结算日期','经纪公司代码','交易所代码','交易员代码','合约代码','买卖方向','投机套保标志','占用保证金','总持仓量','加密持仓量','总持仓成本','昨日持仓量','昨日持仓成本','冻结的保证金','开仓冻结持仓','平仓冻结持仓','持仓盈亏','冻结的权利金','最后一笔成交编号','最后一笔本地报单编号','总持仓可平仓数量','昨持仓可平仓数量','昨平仓冻结持仓','今日开仓数量','今日平仓数量','平仓盈亏','资金账号','会员代码','客户代码','计算浮动盈亏最新价','品种代码'],
		headerKey:['settleDate','brokerageFirmID','exchID','traderID','instrumentID','direction','hedgeFlag','usedMargin','position','encryptPosition','positionCost','ydPosition','ydPositionCost','frozenMargin','frozenPosition','frozenClosing','positionProfit','frozenPremium','lastTradeID','lastOrderLocalID','positionClose','ydPositionClose','ydFrozenClosing','openVolume','closeVolume','closeProfit','accountID','participantID','clientID','lastPrice','productID'],
		styles:['plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText'],
		title:"HisPositionReport",
		dicMap:{},// 转换状态
		extendParams:{a:'1'}
	},"hisPositionReportService","exportHisPositionReport",entity);
}
//其他

}
