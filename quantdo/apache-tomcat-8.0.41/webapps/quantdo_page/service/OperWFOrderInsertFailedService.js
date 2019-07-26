	function findOperWFOrderInsertFailedByCapital(callback,operOrderInsertFailed){
		framework.service.request('operWFOrderInsertFailedService', 'findByCapital',operOrderInsertFailed, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}

	function findOperWFOrderInsertFailedBySubAccount(callback,operOrderInsertFailed){
		framework.service.request('operWFOrderInsertFailedService', 'findBySubAccount',operOrderInsertFailed, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	function exportExcelOWFOIFCap(callback,operClient){
		framework.service.request('operWFOrderInsertFailedService', 'exportExcelOWFOIFCap',operClient, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	function exportExcelOWFOIFSubCap(callback,operClient){
		framework.service.request('operWFOrderInsertFailedService', 'exportExcelOWFOIFSubCap',operClient, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}