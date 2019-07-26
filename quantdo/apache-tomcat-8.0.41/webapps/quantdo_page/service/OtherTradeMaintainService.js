Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.OtherTradeMaintainService = function(){

    this.add = function(entity, callback){
        framework.service.request('otherTradeMaintainService', 'addTradeInfo', entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.query = function(entity, callback){
        framework.service.request('otherTradeMaintainService', 'queryByCondition', entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.updateTradeInfo = function(entity, callback){
        framework.service.request('otherTradeMaintainService', 'updateTradeInfo', entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.deleteTradeInfo = function(capitalType, tradeID, callback){
        framework.service.request('otherTradeMaintainService', 'deleteTradeInfo', capitalType, tradeID, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
}

function getSubAccountByAccount(instClientID, innerAccountID, callback){
    framework.service.request('subCapitalAccountService', 'getSubInfoByAccount', instClientID, innerAccountID, function (errCode, errMsg, result) {
        if (errCode != 0) {
            layer.closeAll('loading');
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
        }else if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getTraderBySubAccount(entity, role, innerAccountID, callback){
    framework.service.request('userAccountService', 'getUserAccAndTraderUserByRole', entity, role, innerAccountID, function (errCode, errMsg, result) {
        if (errCode != 0) {
            layer.closeAll('loading');
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
        }else if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}