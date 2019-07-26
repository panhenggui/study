Namespace.register("com.quantdo.orgClear.service");

com.quantdo.orgClear.service.HisWFOrderService = function() {

    this.findHisWFOrderByCapital =function  (entity,requestParams,orderType,orderWay,callback){
        framework.service.request('hisWFOrderService', 'findByCapital',entity,requestParams,orderType,orderWay, function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
            }
            if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.totleHisOrder= function(hisTrade,callback){
        framework.service.request('hisWFOrderService', 'totleHisOrder',hisTrade, function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
            }
            if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    this.findHisWFOrderBySubAccount = function(entity,requestParams,orderType,orderWay,callback){
        framework.service.request('hisWFOrderService', 'findBySubAccount',entity,requestParams,orderType,orderWay, function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
            }
            if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

}
	function findHisWFOrderByCapital(callback,hisOrder,beginTime,endTime){
		framework.service.request('hisWFOrderService', 'findByCapital',hisOrder,beginTime,endTime, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	function findHisWFOrderBySubAccount(callback,hisOrder,beginTime,endTime){
		framework.service.request('hisWFOrderService', 'findBySubAccount',hisOrder,beginTime,endTime, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	function exportExcelHWFOCap(callback,hisOrder){
		framework.service.request('hisWFOrderService', 'exportExcelHWFOCap',hisOrder,hisOrder.beginDate,hisOrder.endDate, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	function exportExcelHWFOSubCap(callback,hisOrder){
		framework.service.request('hisWFOrderService', 'exportExcelHWFOSubCap',hisOrder,hisOrder.beginDate,hisOrder.endDate, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
