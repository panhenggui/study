Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.instAdminService = function(){	
	this.add = function(callback,instAdmin, validcode,tradeUser){
	    framework.service.request('instAdminService', 'add', instAdmin, validcode, tradeUser, function (errCode, errMsg, result) {	        
	    	if (errCode == 6) {            
	            layer.msg(errMsg,{icon: 2});
	            callback(1);
	    	}else if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	            callback(1);
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.update = function(callback,instAdmin,validcode,tradeUser){
	    framework.service.request('instAdminService', 'update', instAdmin, validcode, tradeUser, function (errCode, errMsg, result) {	        
	    	if (errCode == 6) {            
	            layer.msg(errMsg,{icon: 2});
	            callback(1);
	    	}else if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	            callback(1);
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}

    this.findEntityByInstClientID = function(callback,entity){
        framework.service.request('instAdminService', 'findEntityByInstClientID',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
}
