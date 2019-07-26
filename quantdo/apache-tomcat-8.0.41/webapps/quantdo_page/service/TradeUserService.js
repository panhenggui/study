Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.TradeUserService = function(){	
	this.add = function(entity,callback){
	    framework.service.request('tradeUserService', 'add',entity.traderID,entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	};
	this.remove = function(id,callback){
	    framework.service.request('tradeUserService', 'delete',id, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	};
	
	this.findActiveTradeUserByRole = function(callback,role){
		framework.service.request('tradeUserService', 'findActiveTradeUserByRole',role, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errMsg, {icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
	
	this.update = function(entity,callback){
	    framework.service.request('tradeUserService', 'update',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	};
	this.findAll = function(callback){
	    framework.service.request('tradeUserService', 'findAll', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	};
	this.findByCondition = function(callback,entity){
	    framework.service.request('tradeUserService', 'findByCondition',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.findActiveUserByCondition = function(callback,entity){
	    framework.service.request('tradeUserService', 'findActiveUserByCondition',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.findActiveUserByInstClientID = function(callback,entity){
	    framework.service.request('tradeUserService', 'findActiveUserByInstClientID',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findRiskActiveUserByInstClientID = function(callback,entity){
	    framework.service.request('tradeUserService', 'findRiskActiveUserByInstClientID',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	
	
	
	this.findByKey = function(entity,callback){
	    framework.service.request('tradeUserService', 'findByUserID',entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}

	this.findTradeUserByUserId = function(callback,entity){
		framework.service.request('tradeUserService', 'findTradeUserByUserId',entity, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}

	this.findAllTradeUser = function(callback){
		framework.service.request('tradeUserService', 'findAllTradeUser', function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
	
	this.findAllByFkadmin = function(callback,instClientID){
		framework.service.request('tradeUserService', 'findAllByFkadmin',instClientID, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
	
	this.findAllOrSuperTrade = function(callback,instClientID){
		framework.service.request('tradeUserService', 'findAllOrSuperTrade',instClientID, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}

	this.save = function(callback,entity){
		framework.service.request('tradeUserService', 'save',entity, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errMsg + '\n',{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}

	this.updateByEntity = function(callback,entity){
		framework.service.request('tradeUserService', 'updateByEntity',entity, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errMsg + '\n',{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}

	this.cancel = function(callback,entity){
		framework.service.request('tradeUserService', 'cancel',entity, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}

	this.cancelRestore = function(callback,entity){
		framework.service.request('tradeUserService', 'cancelRestore',entity, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
	
	this.findByUserType = function(callback,userType){
		framework.service.request('tradeUserService', 'findByUserType',userType, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}

	this.findByUserIDListAndInstID = function(callback,tradeUser,userIDList){
		framework.service.request('tradeUserService', 'findByUserIDListAndInstID',tradeUser,userIDList, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errMsg ,{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
};