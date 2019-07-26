Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.partitionPositionConfigService = function(){	
	this.stop = function(callback,entity){
	    framework.service.request('partitionPositionConfigService', 'stop', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback();
	        }
	    });		
	}
	
	this.start = function(callback,entity){
	    framework.service.request('partitionPositionConfigService', 'start', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback();
	        }
	    });		
	}

    this.findByQuery = function(callback,entity){
        framework.service.request('partitionPositionConfigService', 'findByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
   
}

