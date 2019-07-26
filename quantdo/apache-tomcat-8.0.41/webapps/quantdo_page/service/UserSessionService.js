Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.UserSessionService = function(){	
	this.find = function(callback,userSession){
	    framework.service.request('userSessionService', 'findByCondition',userSession, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
}