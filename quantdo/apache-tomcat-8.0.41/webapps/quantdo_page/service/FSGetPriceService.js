Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.fSGetPriceService = function(){	
	this.update = function(callback,entity){
	    framework.service.request('fSGetPriceService', 'update', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.remove = function(callback,id) {
	    framework.service.request('fSGetPriceService', 'delete', id, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(errCode);
	        }
	    });
	}
	
	this.findByCondition = function(callback, entity) {
	    framework.service.request('fSGetPriceService', 'findByCondition',entity, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	this.add = function(callback,entity) {
	    framework.service.request('fSGetPriceService', 'add', entity, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	this.getAddItems = function(callback,settleDate) {
	    framework.service.request('fSGetPriceService', 'getAddItems', settleDate, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	this.getTime = function(callback) {
	    framework.service.request('fSGetPriceService', 'getTime', function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	this.setTime = function(callback,time) {
	    framework.service.request('fSGetPriceService', 'setTime', time, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
}




