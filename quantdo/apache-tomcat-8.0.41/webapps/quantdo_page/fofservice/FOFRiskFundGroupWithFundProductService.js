Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.fOFRiskFundGroupWithFundProductService = function(){	
	this.add = function(callback,entitys){
	    framework.service.request('fOFRiskFundGroupWithFundProductService', 'add', entitys, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.remove = function(callback,id,fundID,instID,fundGroupType,fofInstClientID){
	    framework.service.request('fOFRiskFundGroupWithFundProductService', 'delete', id, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback();
	        }
	    });		
	}
	
	this.queryAssigned = function(callback,entity){
	    framework.service.request('fOFRiskFundGroupWithFundProductService', 'queryAssigned', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.queryUnAssigned = function(callback,entity){
	    framework.service.request('fOFRiskFundGroupWithFundProductService', 'queryUnAssigned', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
}
