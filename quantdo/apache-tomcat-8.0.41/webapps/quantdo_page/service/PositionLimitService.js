Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.PositionLimitService = function(){	
	//获得机构下拉框数据
	this.findInstClient = function(callback){
	    framework.service.request('positionLimitService', 'findInstClient', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	
	this.query = function(entity,callback){
	    framework.service.request('positionLimitService', 'findByQuery', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.check = function(entity,callback){
	    framework.service.request('positionLimitService', 'checkByQuery', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.add = function(entity,callback){
	    framework.service.request('positionLimitService', 'add', entity, function (errCode, errMsg, result) {	        
	    	if (errCode < 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(errCode, errMsg, result);
	        }
	    });		
	}
	this.update = function(entity,callback){
	    framework.service.request('positionLimitService', 'update', entity,function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.del = function(callback,id){
	    framework.service.request('positionLimitService', 'delete', id, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback();
	        }
	    });		
	}
	this.checkInstrumentID = function(callback,entity){
        framework.service.request('positionLimitService', 'checkInstrumentID',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
}
