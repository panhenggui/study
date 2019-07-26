Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.dailyProfitlossService = function(){	
	this.findBySub = function(callback,entity){
	    framework.service.request('dailyProfitlossService', 'findBySub', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findByStrategyID = function(callback,entity){
	    framework.service.request('dailyProfitlossService', 'findByStrategyID', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findByStrategyBatch = function(callback,entity){
	    framework.service.request('dailyProfitlossService', 'findByStrategyBatch', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
}

