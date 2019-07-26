Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.UserManageService = function(){	
	this.add = function(callback,entity,validcode){
	    framework.service.request('userManageService', 'add',entity,validcode, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg ,{icon: 2});
	            callback(2);
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.remove = function(entity,callback){
	    framework.service.request('userManageService', 'delete',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.removeUserAccAndGrup = function(entity,callback){
	    framework.service.request('userManageService', 'removeUserAccAndGrup',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	this.update = function(callback,entity){
	    framework.service.request('userManageService', 'update',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.find = function(callback,entity){
		var tmpEntity = {};
		tmpEntity.userName = entity.userName;
		tmpEntity.role = entity.roleName;
	    tmpEntity.isActive = entity.isActive;
		tmpEntity.userType =  entity.userType;
		tmpEntity.userID = entity.userID;
		tmpEntity.instClientID = entity.instClientID;
	    framework.service.request('userManageService', 'findByCondition',tmpEntity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	
	this.updatePwd = function(entity,validcode,callback){
	    framework.service.request('userManageService', 'updatePwd',entity, validcode, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg ,{icon: 2});
	            result = -1;
	            callback(result);
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.getUserByUserID = function(callback,userID) {
	    framework.service.request('userManageService', 'findByUserID', userID,function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
}

function getInstClient(callback) {
    framework.service.request('userManageService', 'getInstAdmin', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getUserByLoginId(callback,loginId) {
    framework.service.request('userManageService', 'getUserByLoginId',loginId, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getUser(callback) {
    framework.service.request('userManageService', 'findByCondition', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findUserMenuList(callback,id) {
    framework.service.request('userManageService', 'findUserMenuList',id,function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function saveUserMenuList(callback,userId, nodes) {
    framework.service.request('userManageService', 'saveUserMenuList', userId,nodes, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
