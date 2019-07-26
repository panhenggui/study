Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.FOFRiskFundGroupNetRiskParamService = function(){	
	this.update = function(callback,fOFRiskFundGroupNetRiskParam, fOFRiskGroupUnitNetRiskParams){
	    framework.service.request('fOFRiskFundGroupNetRiskParamService', 'update', fOFRiskFundGroupNetRiskParam, fOFRiskGroupUnitNetRiskParams,
	    		function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findByCondition = function(callback,entity){
	    framework.service.request('fOFRiskFundGroupNetRiskParamService', 'findByCondition', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findRelatedUnitNetParams = function(callback,fundGroupNetRiskID){
	    framework.service.request('fOFRiskFundGroupNetRiskParamService', 'findRelatedUnitNetParams', fundGroupNetRiskID, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
}
