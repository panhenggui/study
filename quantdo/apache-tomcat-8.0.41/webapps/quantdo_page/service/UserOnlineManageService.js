function getOnlineUser(callback,instClientID,userId){
	framework.service.request('userOnlineManageService', 'getOnlineUser', instClientID,userId, function (errCode, errMsg, result) {	        
    	if (errCode != 0) {            
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
    	}else if (callback !== undefined || callback != null) {
            callback(result);
        }
    });		
}

function changActive(callback,entiey){
	framework.service.request('userOnlineManageService', 'changActive', entiey, function (errCode, errMsg, result) {	        
    	if (errCode != 0) {            
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
    	}else if (callback !== undefined || callback != null) {
            callback(result);
        }
    });		
}
function changNoActive(callback,entiey){
	framework.service.request('userOnlineManageService', 'changNoActive', entiey, function (errCode, errMsg, result) {	        
    	if (errCode != 0) {            
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
    	}else if (callback !== undefined || callback != null) {
            callback(result);
        }
    });		
}