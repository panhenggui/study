Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.UserAccountGroupService = function(){	
	this.findAll = function(callback){
	    framework.service.request('userAccountGroupService', 'findAll', function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	};
	
	this.findByUserId = function(callback,entity){
	    framework.service.request('userAccountGroupService', 'findByUserId',entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	};

};