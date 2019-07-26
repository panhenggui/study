function getAllInstrumentFeeSetEntity(callback,type) {
    framework.service.request('instrumentFeeSetService', 'queryByProductType',type, function (errCode, errMsg, result) {
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
function updateInstrumentFeeSetEntity(callback,entity) {
    framework.service.request('instrumentFeeSetService', 'update', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//根据ID删除操作员信息
function deleteInstrumentFeeSetEntity(id) {
    framework.service.request('instrumentFeeSetService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}

function findInstrumentFeeSetEntity(callback, entity,type) {
    framework.service.request('instrumentFeeSetService', 'queryByCondition',entity,type, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function saveInstrumentFeeSetEntity(callback,entity,type) {
    framework.service.request('instrumentFeeSetService', 'add', entity, type,function (errCode, errMsg, result) {
        if (errCode > 0) {
            jqueryConst.showMsg(1007);
            return false;
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
