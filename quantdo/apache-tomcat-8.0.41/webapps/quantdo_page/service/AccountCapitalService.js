Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.AccountCapitalService = function(){	
	this.add = function(entity,callback){
	    framework.service.request('accountCapitalService', 'add',entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.remove = function(id,callback){
	    framework.service.request('accountCapitalService', 'delete',id, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.update = function(entity,callback){
	    framework.service.request('accountCapitalService', 'update',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.findByCondition = function(entity,callback){
	    framework.service.request('accountCapitalService', 'findByCondition',entity.startDate, entity.endDate, entity.innerAccountID, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
}

function getAccountCapitalByInnerAccountIDEntity(innerAccountID, callback) {
    framework.service.request('accountCapitalService', 'findByCondition',"", "", innerAccountID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}