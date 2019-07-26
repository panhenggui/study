Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.capitalAccountSequenceService = function(){	
	this.add = function(callback,entity,entitys){
	    framework.service.request('capitalAccountSequenceService', 'add', entity, entitys, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.update = function(callback,entity,entitys){
	    framework.service.request('capitalAccountSequenceService', 'update', entity, entitys, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.remove = function(callback,id){
	    framework.service.request('capitalAccountSequenceService', 'delete', id, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback();
	        }
	    });		
	}

    this.findByQuery = function(callback,entity){
        framework.service.request('capitalAccountSequenceService', 'findByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findSequence = function(callback,entity){
        framework.service.request('capitalAccountSequenceService', 'findSequence',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findQDArithmeticInstClient = function(callback){
        framework.service.request('instClientService', 'findQDArithmeticInstClient', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
  /*this.checkParentInvestorOrder = function(callback,entity){
	    framework.service.request('capitalAccountSequenceService', 'checkParentInvestorOrder',entity, function (errCode, errMsg, result) {
	        if (errCode != 0) {
	            layer.msg(errMsg ,{icon: 2});
	        }else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}*/
    
}


