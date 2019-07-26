Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.FOFRiskProductProvisionParamService = function(){	
	this.update = function(callback, entity){
	    framework.service.request('fOFRiskProductProvisionParamService', 'update', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findByCondition = function(callback,entity){
	    framework.service.request('fOFRiskProductProvisionParamService', 'findByCondition', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.remove = function(callback,id){
	    framework.service.request('fOFRiskProductProvisionParamService', 'delete', id, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback();
	        }
	    });		
	}
}
