Namespace.register("com.quantdo.orgClear.service");

com.quantdo.orgClear.service.HisWFTradeService = function() {
    this.findHisWFTradeByCapital = function (entity, requestParams, orderType, orderWay, callback) {
        framework.service.request('hisWFTradeService', 'findByCapital',entity, requestParams, orderType, orderWay, function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
            }
            if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }


    this.findHisWFTradeBySubAccount = function(entity, requestParams, orderType, orderWay, callback){
        framework.service.request('hisWFTradeService', 'findBySubAccount',entity, requestParams, orderType, orderWay, function(errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
            }
            if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.totleHisTrade= function(hisTrade,callback){
        framework.service.request('hisWFTradeService', 'totalHisTrade',hisTrade, function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
            }
            if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
}
function findHisWFTradeByCapital(entity, requestParams, orderType, orderWay, callback){
    framework.service.request('hisWFTradeService', 'findByCapital',entity, requestParams, orderType, orderWay, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findHisWFTradeBySubAccount(entity, requestParams, orderType, orderWay, callback){
    framework.service.request('hisWFTradeService', 'findBySubAccount',entity, requestParams, orderType, orderWay, function(errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function exportExcelHWFTCap(callback,hisTrade){
    framework.service.request('hisWFTradeService', 'exportExcelHWFTCap',hisTrade, hisTrade.beginDate, hisTrade.endDate, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function exportExcelHWFTSubCap(callback,hisTrade){
    framework.service.request('hisWFTradeService', 'exportExcelHWFTSubCap',entity,hisTrade.beginDate, hisTrade.endDate, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function totleHisTrade(hisTrade,callback){
    framework.service.request('hisWFTradeService', 'totalHisTrade',hisTrade, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

	
	
	