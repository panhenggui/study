function getAllSettlePriceEntity(callback) {
    framework.service.request('settlePriceService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//修改账户信息
function updateSettlePriceEntity(callback,entity) {
    framework.service.request('settlePriceService', 'update', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//根据ID删除操作员信息
function deleteSettlePriceEntity(callback,id) {
    framework.service.request('settlePriceService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(errCode);
        }
    });
}

function findSettlePriceEntity(callback, entity) {
    framework.service.request('settlePriceService', 'findByCondition',entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function saveSettlePriceEntity(callback,entity) {
    framework.service.request('settlePriceService', 'add', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function getLastSettlePrice(callback,exchID,productID,instrumentID) {
    framework.service.request('settlePriceService', 'getLastPrice', exchID,productID,instrumentID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
// 获取当前结算价
function setCurrSettlePrice(settlePriceFlag,callback) {
	framework.service.request('settlePriceService', 'setCurrSettlePrice', settlePriceFlag , function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg + "\n" + JSON.stringify(result), {icon:2});
        }
        if (errCode == 0) {
        	layer.msg("获取当前结算价成功");
        }
        if (callback !== undefined || callback != null) {
            callback(errCode, errMsg, result);
        }
		
	})
}


function getAddItems(callback,settleDate) {
    framework.service.request('settlePriceService', 'getAddItems', settleDate, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
