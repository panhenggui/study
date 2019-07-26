Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.afterHourTradeService = function(){
	this.update = function(callback,entitys){
	    framework.service.request('afterHourTradeService', 'update', entitys, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findByQuery = function(callback,entity){
	    framework.service.request('afterHourTradeService', 'findByQuery', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.isSettled = function(callback){
	    framework.service.request('afterHourTradeService', 'isSettled', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
}

