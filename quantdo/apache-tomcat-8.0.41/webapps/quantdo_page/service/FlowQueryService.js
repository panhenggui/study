Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.FlowQueryService = function(){

	  this.flowQuery = function(callback,entity){
		  framework.service.request('flowQueryService', 'flowQuery',entity, function (errCode, errMsg, result) {
	            if (errCode != 0) {
	                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result), {icon: 2});
	            } else if (callback !== undefined || callback != null) {
	                callback(result);
	            }
	        });
	    }
	
	
}
