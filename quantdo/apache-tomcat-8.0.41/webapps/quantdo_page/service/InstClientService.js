Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.instClientService = function(){	
	this.add = function(callback,entity){
	    framework.service.request('instClientService', 'add', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.update = function(callback,entity){
	    framework.service.request('instClientService', 'update', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.remove = function(callback,id){
	    framework.service.request('instClientService', 'delete', id, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback();
	        }
	    });		
	}

    this.findByQuery = function(callback,entity){
        framework.service.request('instClientService', 'findByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findInstClientByQuery = function(callback,entity){
        framework.service.request('instClientService', 'findInstClientByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findAvaliableInstClientID = function(callback){
        framework.service.request('instClientService', 'findAvaliableInstClientID', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findEntityByInstClientID = function(callback,instClientID){
        framework.service.request('instClientService', 'findEntityByInstClientID', instClientID, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findMainBrokerInst = function(callback){
        framework.service.request('instClientService', 'findMainBorkerInstClient', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    
    
    
    
    
    
    this.checkAccByQuery = function(callback,instClientID){
        framework.service.request('instClientService', 'checkAccByQuery',instClientID, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.checkProdByQuery = function(callback,instClientID){
        framework.service.request('instClientService', 'checkProdByQuery', instClientID, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.checkInstManagerByQuery = function(callback,instClientID){
	        framework.service.request('instClientService', 'checkInstManagerByQuery', instClientID, function (errCode, errMsg, result) {
	            if (errCode != 0) {
	                layer.msg(errMsg ,{icon: 2});
	            }else if (callback !== undefined || callback != null) {
	                callback(result);
	            }
	        });
    }
    
    this.removeByInstId = function(callback,instClientID){
        framework.service.request('instClientService', 'removeByInstId',instClientID, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    
    
    
    
    
    
    
}

function getInstClientQueryConditionList(callback){
	framework.service.request('instClientService', 'getQueryConditionList', function (errCode, errMsg, result) {
        if (errCode != 0) {
            layer.msg(errMsg ,{icon: 2});
        }else if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
