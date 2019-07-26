Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.StockTradingVarietiesRestrictionService = function(){	
	this.saveStockTradingVarietiesRestriction = function(callback,entity,listBrokerID){
	    framework.service.request('stockTradingVarietiesRestrictionService', 'saveStockTradingVarietiesRestriction',entity,listBrokerID, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.updateStockTradingVarietiesRestriction = function(callback,entity,listBrokerID){
	    framework.service.request('stockTradingVarietiesRestrictionService', 'updateStockTradingVarietiesRestriction',entity,listBrokerID, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
		
	this.queryStockTradingVarietiesRestriction = function(callback,fundID,brokerID){
		framework.service.request('stockTradingVarietiesRestrictionService', 'findStockByBrokerIDAndFundID',fundID,brokerID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg);
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	this.deleteStockTradingVarietiesRestrictionByID = function(callback,id){
		framework.service.request('stockTradingVarietiesRestrictionService', 'deleteStockTradingVarietiesRestrictionByID',id,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}

}

