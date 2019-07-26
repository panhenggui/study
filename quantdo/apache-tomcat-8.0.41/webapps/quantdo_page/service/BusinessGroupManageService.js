Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.BusinessGroupManageService = function(){	
	this.findInsts = function(callback){
	    framework.service.request('businessGroupService', 'findInsts', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.findGroups = function(entity,callback){
	    framework.service.request('businessGroupService', 'findGroups',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.getMaxGroupID = function(entity,callback){
	    framework.service.request('businessGroupService', 'getMaxGroupID',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.query = function(entity,callback){
	    framework.service.request('businessGroupService', 'query',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.save = function(entity,query,callback){
	    framework.service.request('businessGroupService', 'save',entity, query,function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.update = function(entity,query,callback){
	    framework.service.request('businessGroupService', 'update',entity, query,function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.del = function(entity,query,callback){
	    framework.service.request('businessGroupService', 'del',entity, query,function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.getBusinessGroup = function(callback){
	    framework.service.request('businessGroupService', 'getBusinessGroup',function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
}

