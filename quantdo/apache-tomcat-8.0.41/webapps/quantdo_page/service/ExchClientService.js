Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.ExchClientService = function(){	
	this.add = function(entity,callback){
	    framework.service.request('exchClientService', 'add',entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.remove = function(id,callback){
	    framework.service.request('exchClientService', 'delete',id, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.update = function(entity,callback){
	    framework.service.request('exchClientService', 'update',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.findAll = function(callback){
	    framework.service.request('exchClientService', 'findAll', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}	
	this.findByCondition = function(entity,callback){
	    framework.service.request('exchClientService', 'findByCondition',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.findByPk = function(entity,callback){
		framework.service.request('exchClientService', 'findByPk',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.findByExchAndClient = function(entity,callback){
		framework.service.request('exchClientService', 'findByExchAndClient',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}	
	this.findByExchAndTradeType = function(entity,callback){
		framework.service.request('exchClientService', 'findByExchAndTradeType',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}	
}
function getAllMemberByExchId(callback,exchId,inntAccId) {
	framework.service.request('exchClientService', 'getAllMemberByExchId', exchId,inntAccId, function (errCode, errMsg, result) {
    	 if (errCode > 0) {
    		  layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
         }
         if (callback !== undefined || callback != null) {
             callback(result);
         }
    });
}