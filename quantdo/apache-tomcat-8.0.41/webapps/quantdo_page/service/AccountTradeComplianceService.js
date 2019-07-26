Namespace.register("com.quantdo.orgClear.service");
//修改账户信息
function updateAccountTradeCompliance(callback,accountTradeCompliance) {
    framework.service.request('accountTradeComplianceService', 'update', accountTradeCompliance, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function deleteAccountTradeCompliance(id) {
    framework.service.request('accountTradeComplianceService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}

function findAccountTradeCompliance(callback, accountTradeCompliance) {
    framework.service.request('accountTradeComplianceService', 'findByQuery', accountTradeCompliance, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function saveAccountTradeCompliance(callback,accountTradeCompliance) {
    framework.service.request('accountTradeComplianceService', 'add', accountTradeCompliance, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findAccountTradeComplianceByAccountID(callback,accountID) {
    framework.service.request('accountTradeComplianceService', 'findByAccountID', accountID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
