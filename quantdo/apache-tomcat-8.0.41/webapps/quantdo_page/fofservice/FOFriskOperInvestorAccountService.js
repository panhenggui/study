function findoperInvestorAccount(callback,productgroupName,instclientName,instrumentID){
	framework.service.request('fOFRiskOperInvestorAccountService', 'findOperInvestorAccountBycondition', productgroupName,instclientName,instrumentID,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}