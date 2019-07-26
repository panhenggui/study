Namespace.register("com.quantdo.orgClear.service");
	function findOperOrderInsertFailedByQuery(callback,operOrderInsertFailed){
		framework.service.request('operOrderInsertFailedService', 'findByQuery',operOrderInsertFailed, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}

	function findOperOrderInsertFailedAllCapitalByQuery(callback,operOrderInsertFailed){
		framework.service.request('operOrderInsertFailedService', 'findCapitalInfosByQuery',operOrderInsertFailed, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	function findOperOrderInsertFailedAllTraderByQuery(callback,operOrderInsertFailed){
		framework.service.request('operOrderInsertFailedService', 'findAllTraderByQuery',operOrderInsertFailed, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	

	function findAllOrderFailedQueryInMapper(operOrderInsertFailed,requestParams,orderType,orderWay,callback){
		framework.service.request('operOrderInsertFailedService', 'findAllOrderFailedQueryInMapper',operOrderInsertFailed,requestParams,orderType,orderWay, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	function exportExcelOOF(callback,operClient){
		framework.service.request('operOrderInsertFailedService', 'exportExcelOOF',operClient, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
