Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.tradeUserIPCheckService = function(){	
	this.find = function(callback,entity){
	    framework.service.request('tradeUserIPCheckService', 'findByCondition',entity, function (errCode, errMsg, result) {        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.update = function(callback,entity){
	    framework.service.request('tradeUserIPCheckService', 'update',entity, function (errCode, errMsg, result) {        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.delitem = function(entity){
	    framework.service.request('tradeUserIPCheckService', 'delete',entity, function (errCode, errMsg, result) {        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}
	    });		
	}
	
	this.add = function(callback,entity){
	    framework.service.request('tradeUserIPCheckService', 'add',entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.check = function(callback,entity){
	    framework.service.request('tradeUserIPCheckService', 'check',entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
}

