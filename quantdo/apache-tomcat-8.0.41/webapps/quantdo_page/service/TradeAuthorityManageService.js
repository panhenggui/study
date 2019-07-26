Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.TradeAuthorityManageService = function(){	
	this.findTradeAuthorityNow = function(entity,callback){
		framework.service.request('tradeAuthorityManageService', 'findTradeAuthorityNow',entity.brokerID,entity.exchID,entity.traderID,entity.instrumentID, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	this.queryTradeAuthorityChangeOnStream = function(entity,callback){
		framework.service.request('tradeAuthorityManageService', 'queryTradeAuthorityChangeOnStream',entity.brokerID,entity.exchID,entity.traderID,entity.instrumentID, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	this.changeAuthority = function(entity,callback){
		framework.service.request('tradeAuthorityManageService', 'changeAuthority',entity.operateType,entity.operInvestorTradingRightRisk, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
}