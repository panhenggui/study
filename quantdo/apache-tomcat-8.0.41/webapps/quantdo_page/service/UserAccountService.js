Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.UserAccountService = function(){	
	this.findAll = function(callback){
	    framework.service.request('userAccountService', 'findAll', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findByUserID = function(callback,userID,accType){
	    framework.service.request('userAccountService', 'findByUserID',userID,accType, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findUserAccAndTraderUserByRole = function(callback,userAccount,role, innerQueryList){
	    framework.service.request('userAccountService', 'findUserAccAndTraderUserByRole',userAccount,role,innerQueryList,function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
}
