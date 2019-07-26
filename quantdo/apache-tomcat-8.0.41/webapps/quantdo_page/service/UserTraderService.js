Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.UserTraderService = function(){	
	this.add = function(entity,callback){
	    framework.service.request('userTraderService', 'add',entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.remove = function(id,callback){
	    framework.service.request('userTraderService', 'delete',id, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.update = function(entity,callback){
	    framework.service.request('userTraderService', 'update',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.findAll = function(entity,callback){
	    framework.service.request('userTraderService', 'findAll',entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.findByCondition = function(entity,callback){
	    framework.service.request('userTraderService', 'findByCondition',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	};

    this.query = function(entity,callback){
        framework.service.request('userTraderService', 'query',entity.traderID,entity.userID, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };

    this.deleteByCondition = function(entity,callback){
        framework.service.request('userTraderService', 'deleteByCondition',entity.traderID,entity.userID, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };

	this.saveUserTrade = function(callback,entity,arrayMap){
		framework.service.request('userTraderService', 'saveUserTrade',entity,arrayMap, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errMsg + '\n',{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
	
	this.saveSetting = function(callback,entity,groupArrayMaps,accountIdArrayMaps,clientArrayMaps){
		framework.service.request('userTraderService', 'saveSetting',entity,groupArrayMaps,accountIdArrayMaps,clientArrayMaps, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
	
	this.findByUserID = function(callback,entity){
		framework.service.request('userTraderService', 'findByUserID',entity, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errMsg + '\n',{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
};