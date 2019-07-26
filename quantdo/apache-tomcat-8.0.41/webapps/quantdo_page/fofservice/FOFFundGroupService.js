Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.fofFundGroupService = function(){	
	this.add = function(callback,entity){
	    framework.service.request('fOFFundGroupService', 'add', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.update = function(callback,entity){
	    framework.service.request('fOFFundGroupService', 'update', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.remove = function(callback,id){
	    framework.service.request('fOFFundGroupService', 'delete', id, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback();
	        }
	    });		
	}
	
	this.findByQuery = function(callback,entity){
	    framework.service.request('fOFFundGroupService', 'findByQuery', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findInfoByQuery = function(callback,entity){
	    framework.service.request('fOFFundGroupService', 'findInfoByQuery', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
}
