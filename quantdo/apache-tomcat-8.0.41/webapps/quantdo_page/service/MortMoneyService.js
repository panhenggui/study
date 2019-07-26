function getAllMortMoneyEntity(callback) {
    framework.service.request('mortMoneyService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//修改账户信息
function updateMortMoneyEntity(entity) {
    framework.service.request('mortMoneyService', 'update', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}
//根据ID删除操作员信息
function deleteMortMoneyEntity(id) {
    framework.service.request('mortMoneyService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }

    });
}

function findMortMoney(callback, capital) {
    framework.service.request('mortMoneyService', 'queryByCondition', capital, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function saveMortMoneyEntity(callback,Entity) {
    framework.service.request('mortMoneyService', 'add', Entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.log(errCode + ': ' + errMsg + '\n' + JSON.stringify(result))
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
