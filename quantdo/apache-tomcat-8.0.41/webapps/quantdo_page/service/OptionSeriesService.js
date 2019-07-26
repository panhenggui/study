function getAllOptionSeriesEntity(callback) {
    framework.service.request('optionSeriesService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//修改账户信息
function updateOptionSeriesEntity(callback,entity) {
    framework.service.request('optionSeriesService', 'update', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//根据ID删除操作员信息
function deleteOptionSeriesEntity(id) {
    framework.service.request('optionSeriesService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}

function findOptionSeriesEntity(callback, entity) {
    framework.service.request('optionSeriesService', 'findByQuery',entity.exchID,entity.productID,entity.optionSeriesID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function saveOptionSeriesEntity(callback,entity) {
    framework.service.request('optionSeriesService', 'add', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
