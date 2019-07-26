Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.FuturesTradeUploadService = function() {
	//条件查询
	this.findByCondition = function(callback,entity) {
		framework.service.request('futuresTradeUploadService', 'findByCondition',entity.beginDate,entity.endDate,entity.accountID,entity.exchID,
				entity.productID, function(errCode, errMsg, result) {
			if (errCode > 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
			}
			if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
	
	this.remove = function(callback,tradeDate,dealID) {
		framework.service.request('futuresTradeUploadService', 'remove', tradeDate, dealID, function(errCode, errMsg, result) {
			if (errCode > 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
			}
			if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
}
