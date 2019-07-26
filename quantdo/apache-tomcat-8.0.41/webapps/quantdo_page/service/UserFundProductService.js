Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.UserFundProductService = function(){	
	this.add = function(callback,entity,maplists){
	    framework.service.request('userFundProductService', 'add',entity,maplists, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.findAllUserFundProduct = function(callback,entity){
	    framework.service.request('userFundProductService', 'findAllUserFundProduct',entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}


}
