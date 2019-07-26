Namespace.register("com.quantdo.orgClear.service");
//得到数据库中已有的日内最大回撤止损信息
function getAllRiskDayStopLossData(fundID,brokerID, callback) {
    framework.service.request('riskDayStopLossService', 'getAllRiskDayStopLossData',fundID,brokerID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//新增或修改数据
function addTmpRiskDayStopLossEntity(entity,brokerID, callback) {
	//console.log(entity);
    framework.service.request('riskDayStopLossService', 'addTmpRiskDayStopLossEntity',entity, brokerID,function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
        	callback(errCode,errMsg); 
        }
    });
}

//删除
function deleteRiskDayStopLossData(entity,brokerID,isDelete, callback) {
	//console.log(entity);
    framework.service.request('riskDayStopLossService', 'deleteRiskDayStopLossData',entity, brokerID,isDelete,function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
        	callback(errCode,errMsg); 
        }
    });
}