Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.FOFRiskParamsService = function(){	
	this.getAllSidesProduct = function(callback){
	    framework.service.request('foFRiskFundProductService', 'getAllSidesProduct', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findFutureRestrictionByCondition = function(callback, source, instClientID, fofInstClientID, fundProductID){
	    framework.service.request('fOFRiskFutureVarRestrictionDtlService', 'findFutureRestrictionByCondition', source, 
	    		instClientID, fofInstClientID, fundProductID, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}

	this.findFundProductIdxByCondition = function(callback, source, type, instClientID, fofInstClientID, fundProductID){
	    framework.service.request('fOFRiskFundProductIdxDtlService', 'findByCondition', source, type, 
	    		instClientID, fofInstClientID, fundProductID, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
}
