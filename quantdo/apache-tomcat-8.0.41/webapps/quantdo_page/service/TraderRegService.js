Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.TraderRegService = function(){	
	this.findAll = function(callback){
	    framework.service.request('traderService', 'findAll', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}		
}

function saveTrader(callback,trader)
{
    framework.service.request('traderService', 'add', trader, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findTrader(callback,trader)
{
    framework.service.request('traderService', 'findByCondition', trader, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function saveTraderInfo(callback,traderInfo)
{
    framework.service.request('traderInfoService', 'add', traderInfo, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function saveTradeUser(callback,tradeUser)
{
    framework.service.request('tradeUserService', 'add', tradeUser.userID,tradeUser, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function saveTraderReg(callback, flag, trader,traderInfo,tradeUser,userTrader,subCapitalAccount,subAccountRiskParam,subAccountTemplateList)
{
    framework.service.request('traderService', 'traderReg', flag, trader, traderInfo, tradeUser, userTrader, subCapitalAccount, 
    		subAccountRiskParam, subAccountTemplateList,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2,time: 1500});
            return false;
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
