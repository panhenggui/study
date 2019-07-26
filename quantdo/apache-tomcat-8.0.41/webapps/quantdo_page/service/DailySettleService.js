//开始日终结算
function dailySettle(settleDate, nextSettleDate, callback) {
	
	framework.service.request('dailySettleService', 'dailySettle', settleDate, nextSettleDate, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
            //layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
        }
        if (callback !== undefined || callback != null) {        	
            callback(errCode, errMsg);
        }

    });
}

//二次资金结算
function moneySettle(settleDate, callback) {
	
	framework.service.request('dailySettleService', 'moneySettle', settleDate, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
            //layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
        }
        if (callback !== undefined || callback != null) {        	
            callback(errCode, errMsg);
        }

    });
}

//结算回退
function settleRollback(settleDate, callback) {
	
	framework.service.request('dailySettleService', 'settleRollback', settleDate, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
            //layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
        }
        if (callback !== undefined || callback != null) {        	
            callback(errCode, errMsg);
        }

    });
}

//获取当前结算状态
function findCurrStatus(callback, settleDate) {
	
    framework.service.request('settleStatusService', 'findCurrStatus', settleDate, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function auditAfterDailySettle(flag, callback) {
	
    framework.service.request('busAuditService', 'auditAfterDailySettle', flag, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function capitalAuditAfterDailySettle(callback) {
	
    framework.service.request('busAuditService', 'capitalAuditAfterDailySettle', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function getDailyStepDetail(settleDate, callback){
    framework.service.request('settleStepDetailService', 'getSettleDeatil', settleDate, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function executeSettle(settleStep, settleDate, reExecuteFlag, nextSettleDate, callback){
    framework.service.request('settleStepDetailService', 'dailySettle', settleStep, settleDate, reExecuteFlag, nextSettleDate, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getMajorLog(entity, callback){
    framework.service.request('majorLogService', 'findByCondition', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function autoSettle(settleDate, nextSettleDate, isContinue, callback){
    framework.service.request('settleStepDetailService', 'autoDailySettle', settleDate, nextSettleDate, isContinue, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.alert(errMsg, {icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
