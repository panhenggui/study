Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.hisAdviceOrderService = function(){
	this.findByCondition = function (entity,requestParams,orderType,orderWay,callback){
		framework.service.request('hisAdviceOrderService', 'findHisAdviceOrderInMapper',entity,requestParams,orderType,orderWay, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	this.totalHisAdviceOrder = function (entity,callback){
		framework.service.request('hisAdviceOrderService', 'totalHisAdviceOrder',entity, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}	
}



