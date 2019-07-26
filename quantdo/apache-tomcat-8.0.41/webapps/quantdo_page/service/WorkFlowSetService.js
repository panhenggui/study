Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.WorkFlowService = function(){	
	this.findByQuery = function(callback,entity){
	    framework.service.request('workFlowSetService', 'findByCondition', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.add = function(callback,entity){
	    framework.service.request('workFlowSetService', 'add', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findFundByInstID = function(callback,instClientID){
	    framework.service.request('workFlowSetService', 'findFundByInstID', instClientID, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findTradeUserByInstID = function(callback,instClientID){
	    framework.service.request('workFlowSetService', 'findTradeUserByInstID', instClientID, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
}
