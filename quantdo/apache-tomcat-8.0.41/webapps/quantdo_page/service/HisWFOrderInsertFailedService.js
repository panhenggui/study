	function findHisWFOrderInsertFailedByCapital(callback,hisOrderInsertFailed,beginTime,endTime){
		framework.service.request('hisWFOrderInsertFailedService', 'findByCapital',hisOrderInsertFailed, beginTime, endTime, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}

	function findHisWFOrderInsertFailedBySubAccount(callback,hisOrderInsertFailed,beginTime,endTime){
		framework.service.request('hisWFOrderInsertFailedService', 'findBySubAccount',hisOrderInsertFailed, beginTime, endTime, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	function exportExcelFWFOIFCap(callback,hisClient,beginTime,endTime){
		framework.service.request('hisWFOrderInsertFailedService', 'exportExcelFWFOIFCap',hisClient, beginTime, endTime, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	function exportExcelFWFOIFSubCap(callback,hisClient,beginTime,endTime){
		framework.service.request('hisWFOrderInsertFailedService', 'exportExcelFWFOIFSubCap',hisClient, beginTime, endTime, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}