Namespace.register("com.quantdo.orgClear.service");
	function findHisTradeByQuery(callback,hisTrade, startDate, endDate){
		framework.service.request('hisTradeService', 'findByQuery',hisTrade, startDate, endDate, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	function findHisTradeBySubQuery(callback,hisTrade, startDate, endDate){
		framework.service.request('hisTradeService', 'findHisTradeBySubQuery',hisTrade, startDate, endDate, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}

	function findHisTradeAllCapitalByQuery(callback,hisTrade, startDate, endDate){
		framework.service.request('hisTradeService', 'findAllCapitalByQuery',hisTrade, startDate, endDate, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	function findHisTradeAllTraderByQuery(callback,hisTrade, startDate, endDate){
		framework.service.request('hisTradeService', 'findAllTraderByQuery',hisTrade, startDate, endDate, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	function findAllHisByQueryInMapper(hisTrade,requestParams,orderType,orderWay,callback){
		framework.service.request('hisTradeService', 'findAllHisByQueryInMapper',hisTrade,requestParams,orderType,orderWay, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	
	