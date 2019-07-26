Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.OperAdviceOrderService = function(){
	this.findOperAdviceOrderByQuery = function(entity,requestParams,orderType,orderWay,callback){
		framework.service.request('operAdviceOrderService', 'findOperAdviceOrderByQuery',entity,requestParams,orderType,orderWay, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
}
