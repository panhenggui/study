	function findByQueryHisOrder(callback,hisOrder,beginTime,endTime){
		framework.service.request('hisOrderService', 'findQuery',hisOrder,beginTime,endTime, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	//资金账号 查询全部
	function findHisOrderAllCapitalByQuery(callback,hisOrder,beginTime,endTime){
		framework.service.request('hisOrderService', 'findCapitalInfosByQuery',hisOrder,beginTime,endTime, function (errCode, errMsg, result) {
			if (errCode > 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
			}
			if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
	//投顾账号 查询全部
	function findHisOrderAllTraderByQuery(callback,hisOrder,beginTime,endTime){
		framework.service.request('hisOrderService', 'findAllTraderByQuery',hisOrder,beginTime,endTime, function (errCode, errMsg, result) {
			if (errCode > 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
			}
			if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
	
	
	function findAllHisOrderQueryInMapper(hisOrde,requestParams,orderType,orderWay,callback){
		framework.service.request('hisOrderService', 'findAllHisOrderQueryInMapper',hisOrde,requestParams,orderType,orderWay, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	

	function exportExcelHO(callback,operClient){
		framework.service.request('hisOrderService', 'exportExcelHO',operClient, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	
	
