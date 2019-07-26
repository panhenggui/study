Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.LogManageService = function(){	
	this.findByContent = function(callback,entity){
		framework.service.request('logManageService', 'findByCondition',entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
}

