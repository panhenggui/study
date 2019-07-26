function getAllUnderlyingPriceEntity(callback) {
    framework.service.request('underlyingPriceService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//修改账户信息
function updateUnderlyingPriceEntity(entity) {
    framework.service.request('underlyingPriceService', 'update', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}
//根据ID删除操作员信息
function deleteUnderlyingPriceEntity(id) {
    framework.service.request('underlyingPriceService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}

function findUnderlyingPriceEntity(callback, entity) {
    framework.service.request('underlyingPriceService', 'findByQuery',entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function saveUnderlyingPriceEntity(entity) {
    framework.service.request('underlyingPriceService', 'add', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}
