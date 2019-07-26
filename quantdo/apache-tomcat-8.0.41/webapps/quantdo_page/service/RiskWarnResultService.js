function findFundNetValueByProId(callback,entity) {
    framework.service.request('riskWarnResultService', 'findFundNetValueByProId',entity.fundProductID,entity.instClientID,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function findAllRiskWarnEntity(callback,entity) {
    framework.service.request('riskWarnResultService', 'findRiskWarnByProId',entity.fundProductID,entity.instClientID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function dealRisk(callback,riskEntity) {
    framework.service.request('riskWarnResultService', 'update',riskEntity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}



