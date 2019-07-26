Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.SubAccountCapitalService = function(){	
	this.find = function(callback,map){
	    framework.service.request('subAccountCapitalService', 'findByQuery',map, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findBuisnessGroup = function(callback, instClientID){
	    framework.service.request('subAccountCapitalService', 'findBuisnessGroup', instClientID, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findTradeUser = function(callback,instClientID){
	    framework.service.request('subAccountCapitalService', 'findTradeUser', instClientID, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
}

//查询资产单元资金
function querySubAccountCapital(callback, entity) {
    framework.service.request('subAccountCapitalService', 'findBySubAccountQuery', entity.settleDate,entity.endDate, entity.traderID, entity.subAccountID,
    		entity.currency, entity.instClientID,entity.searchType, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findBySubAccountQuerySingle(callback, entity) {
    framework.service.request('subAccountCapitalService', 'findBySubAccountQuerySingle', entity.settleDate, entity.endDate, entity.traderID, entity.subAccountID,
    		entity.currency, entity.instClientID,entity.searchType, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getSumSubAccountCapital(callback, map) {
    framework.service.request('subAccountCapitalService', 'getSumSubAccountCapital', map, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function  findUserType(callback){
      framework.service.request('tradeService' , 'findUserType' ,function(errCode, errMsg, result){
         if (errCode > 0) {
                  layer.msg(errMsg, {icon: 2, time: 3000});
                  return false;
              }
              if (callback !== undefined || callback != null) {
                  callback(result);
         }
      });
}

function findBySubCapitalAccountByUserType(entity, callback){
    framework.service.request('subCapitalAccountService', 'findByCapitalByLogInUser', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}