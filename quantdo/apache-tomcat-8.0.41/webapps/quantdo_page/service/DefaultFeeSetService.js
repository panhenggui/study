function getAllDefaultFeeSetEntity(callback) {
    framework.service.request('defaultFeeSetService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getAllAccounts(callback) {
    framework.service.request('capitalAccountService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


//修改账户信息
function updateDefaultFeeSetEntity(entity) {
    framework.service.request('defaultFeeSetService', 'update', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}
//根据ID删除操作员信息
function deleteDefaultFeeSetEntity(id) {
    framework.service.request('defaultFeeSetService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}

function findDefaultFeeSetEntity(callback, entity) {
    framework.service.request('defaultFeeSetService', 'queryByConOnProTyp', entity.exchID,entity.productType,entity.productID,entity.tradeType,entity.grading, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function CheckDefaultFeeByProductId(callback, entity) {
    framework.service.request('defaultFeeSetService', 'CheckDefaultFeeByProductId', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg , {icon: 2, time: 3000});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function saveDefaultFeeSetEntity(callback, entity) {
    framework.service.request('defaultFeeSetService', 'add', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg , {icon: 2, time: 3000});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
