function getAllBrokerageFirmEntity(callback) {
    framework.service.request('brokerageFirmService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function queryBkIdByBrkType(callback) {
    framework.service.request('brokerageFirmService', 'queryBkIdByBrkType', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}



function findCodetypeApilinktypeRelation(callback, entity) {
    framework.service.request('codeTypeApilinkTypeRelationService', 'findCodetypeApilinktypeRelation', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


//修改账户信息
function updateBrokerageFirmEntity(callback,entity) {
    framework.service.request('brokerageFirmService', 'update', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//根据ID删除操作员信息
function deleteBrokerageFirmEntity(id) {
    framework.service.request('brokerageFirmService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}

//根据brokerageFirmID删除通道信息
function deleteSeatEntity(brokerageFirmID) {
    framework.service.request('brokerageFirmService', 'deleteBrokerageFirmEntity', brokerageFirmID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}

function findBrokerageFirmEntity(callback, entity) {
    framework.service.request('brokerageFirmService', 'findByCondition', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findCapAccByBrokerId(callback, brokerId) {
    framework.service.request('brokerageFirmService', 'findCapAccByBrokerId', brokerId, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function saveBrokerageFirmEntity(callback,entity) {
    framework.service.request('brokerageFirmService', 'add', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            jqueryConst.showMsg(errCode);
            return false;
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
