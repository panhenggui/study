Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.tradeUserProductCheckService = function(){	
	this.find = function(callback,entity){
	    framework.service.request('tradeUserProductCheckService', 'findByCondition',entity, function (errCode, errMsg, result) {        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.update = function(callback,entity){
	    framework.service.request('tradeUserProductCheckService', 'update',entity, function (errCode, errMsg, result) {        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.delitem = function(entity){
	    framework.service.request('tradeUserProductCheckService', 'delete',entity, function (errCode, errMsg, result) {        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}
	    });		
	}
	
	this.add = function(callback,entity){
	    framework.service.request('tradeUserProductCheckService', 'add',entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.check = function(callback,entity){
	    framework.service.request('tradeUserProductCheckService', 'check',entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
}

