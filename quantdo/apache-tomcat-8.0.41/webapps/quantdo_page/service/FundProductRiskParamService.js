Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.FundProductRiskParamService = function(){	
	this.findMainRiskByCondition = function(callback, entity){
	    framework.service.request('fundProductRiskParamService', 'findMainRiskByCondition', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}		
	
	this.addDelivEntitys = function(callback, entity){
	    framework.service.request('fundProductRiskParamService', 'addDelivEntitys', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.deleteDelivEntity = function(callback, id){
	    framework.service.request('fundProductRiskParamService', 'deleteDeliv', id, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback();
	        }
	    });		
	}
	
	this.findDelivById = function(callback, id){
	    framework.service.request('fundProductRiskParamService', 'findDelivById', id, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findDelivByFundIDAndProductID = function(callback, entity){
	    framework.service.request('fundProductRiskParamService', 'findDelivByFundIDAndProductID', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}	
	
	this.updateDelivEntity = function(callback, entity){
	    framework.service.request('fundProductRiskParamService', 'updateDeliv', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.deleteFundNetRiskEntity = function(callback, id){
	    framework.service.request('fundProductRiskParamService', 'deleteFundNetRiskEntity', id, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback();
	        }
	    });		
	}
	
	this.findFundNetRiskByFundNetRiskID = function(callback, id){
	    framework.service.request('fundProductRiskParamService', 'findFundNetRiskByFundNetRiskID', id, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findUnitNetRisksByFundNetRiskID = function(callback, id){
	    framework.service.request('fundProductRiskParamService', 'findUnitNetRiskByFundNetRiskID', id, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.addFundNetRiskEntity = function(callback, entity, list){
	    framework.service.request('fundProductRiskParamService', 'addFundNetRiskEntity', entity, list, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.updateFundNetRiskEntity = function(callback, entity, list){
	    framework.service.request('fundProductRiskParamService', 'updateFundNetRiskEntity', entity, list, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.updateDelivEntitys = function(callback, list, entity){
	    framework.service.request('fundProductRiskParamService', 'updateDelivs', list, entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
}
