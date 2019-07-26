function findfofriskoperOrder(callback,productgroupID,instclientID,instrumentId){
	framework.service.request('fOFRiskOperOrderService', 'findAllOperOrderBycondition', productgroupID,instclientID,instrumentId,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}