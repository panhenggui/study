function getAllDeferredFeeSetEntity(callback) {
    framework.service.request('deferredFeeSetService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}



//修改账户信息
function updateDeferredFeeSetEntity(entity) {
    framework.service.request('deferredFeeSetService', 'update', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}
//根据ID删除操作员信息
function deleteDeferredFeeSetEntity(id) {
    framework.service.request('deferredFeeSetService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}

function findDeferredFeeSetEntity(callback, entity) {
    framework.service.request('deferredFeeSetService', 'queryByCondition', entity.startDate,entity.endDate,entity.productID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function saveDeferredFeeSetEntity(callback, entity) {
    framework.service.request('deferredFeeSetService', 'add', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function checkDeferredFeeSetEntity(callback, entity) {
    framework.service.request('deferredFeeSetService', 'checkDeferredFeeSetEntity', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
