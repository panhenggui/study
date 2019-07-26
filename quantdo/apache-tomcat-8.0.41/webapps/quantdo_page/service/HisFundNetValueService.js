	function findByQueryHisFund(callback,fundID,beginTime,endTime){
		framework.service.request('hisFundNetValueService', 'findQuery',fundID,beginTime,endTime, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	function saveHisFund(callback,entity){
		framework.service.request('hisFundNetValueService', 'update',entity, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	
	function queryAllHisFundNet(entity,requestParams,orderType,orderWay,callback){
		framework.service.request('hisFundNetValueService', 'queryAllHisFundNet',entity,requestParams,orderType,orderWay, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	function exportExcelHFN(callback,operClient){
		framework.service.request('hisFundNetValueService', 'exportExcelHFN',operClient, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	