Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.RoleManageService = function(){	
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
}


function getAllMenu(callback,id){
    framework.service.request('roleManageService', 'getAllMenu', id, function (errCode, errMsg, result) {	        
    	if (errCode != 0) {            
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
    	}else if (callback !== undefined || callback != null) {
            callback(result);
        }
    });		
}

function getAllMenuList(callback,id){
    framework.service.request('roleManageService', 'getAllMenuList', id, function (errCode, errMsg, result) {	        
    	if (errCode != 0) {            
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
    	}else if (callback !== undefined || callback != null) {
            callback(result);
        }
    });		
}

function getAllRole(callback) {
    framework.service.request('roleManageService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findRoleList(callback,roleName) {
    framework.service.request('roleManageService', 'findRoleList',roleName, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function saveRoleMenuList(callback,isUpdateRelateUser,roleID, Entitys) {
    framework.service.request('roleManageService', 'saveRoleMenuList',isUpdateRelateUser,roleID, Entitys, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}