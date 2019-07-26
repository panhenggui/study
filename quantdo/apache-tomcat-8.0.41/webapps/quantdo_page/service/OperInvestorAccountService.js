Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.OperInvestorAccountService = function(){	
	this.findByCondition = function(entity,callback){
	    framework.service.request('operInvestorAccountService', 'findByCondition',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findBySubAccountIdAndAccountId = function(callback,map){
	    framework.service.request('operInvestorAccountService', 'findBySubAccountIdAndAccountIdOfRisk',map, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}

	this.findAll = function(map,callback){
	    framework.service.request('operInvestorAccountService', 'findAll', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
}

function findInvestorAccountByBroAndAccountID (callback,entity){
	framework.service.request('operInvestorAccountService', 'findInvestorAccountByBroAndAccountID', entity, function (errCode, errMsg, result) {	        
    	if (errCode != 0) {            
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
    	}else if (callback !== undefined || callback != null) {
            callback(result);
        }
    });		
}



function getOperInvestorAccountAvailable(callback,entity){
	framework.service.request('operInvestorAccountService', 'findAvailableByCondition', entity, function (errCode, errMsg, result) {	        
    	if (errCode != 0) {            
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
    	}else if (callback !== undefined || callback != null) {
            callback(result);
        }
    });		
}


function findAllRealAccountByQueryInMapper(operClient,requestParams,orderType,orderWay,callback){
	framework.service.request('operInvestorAccountService', 'findAllRealAccountByQueryInMapper',operClient,requestParams,orderType,orderWay, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function exportExcelRTA (callback,entity){
	framework.service.request('operInvestorAccountService', 'exportExcelRTA', entity, function (errCode, errMsg, result) {	        
    	if (errCode != 0) {            
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
    	}else if (callback !== undefined || callback != null) {
            callback(result);
        }
    });		
}

