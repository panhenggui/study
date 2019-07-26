//Namespace.register("com.quantdo.orgClear.service");
//查询所有
function getAllAccountGroupEntity(callback) {
    framework.service.request('subAccountGroupService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//修改账户信息
function updateAllAccountGroupEntity(callback, entity) {
    framework.service.request('subAccountGroupService', 'update',entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//根据分组号 和 分组名称查询信息
function findAccountGroupByQuery(callback,entity) {
    framework.service.request('subAccountGroupService', 'findAccountGroupByQuery',entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//添加分组信息
function saveAccountGroupEntity(callback, entity) {
    framework.service.request('subAccountGroupService', 'add', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//根据ID删除分组信息
function deleteGroupEntity(id) {
    framework.service.request('subAccountGroupService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}