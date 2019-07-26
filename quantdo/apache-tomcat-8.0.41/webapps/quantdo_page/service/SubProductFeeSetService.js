function getAllSubProductFeeSetEntity(callback) {
    framework.service.request('subProductFeeSetService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getAllSubAccounts(callback) {
    framework.service.request('subCapitalAccountService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


//修改账户信息
function updateSubProductFeeSetEntity(callback,entity) {
    framework.service.request('subProductFeeSetService', 'update', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//根据ID删除操作员信息
function deleteSubProductFeeSetEntity(id) {
    framework.service.request('subProductFeeSetService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}

//批量删除
function deleteSubProductFeeSetLists(callback,entitys) {
    framework.service.request('subProductFeeSetService', 'deleteLists',
		entitys, function(errCode, errMsg, result) {
			if (errCode > 0) {
				console.error(errMsg);
			}
			if (callback !== undefined || callback != null) {
	            callback(result);
	        }
		});
}

function findSubProductFeeSetEntity(callback, entity) {
    framework.service.request('subProductFeeSetService', 'findByQuery',entity.subAccountID, entity.exchID,entity.productType, entity.productID, entity.tradeType, entity.grading, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function saveSubProductFeeSetEntity(callback,entity) {
    framework.service.request('subProductFeeSetService', 'add', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg ,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function CheckSubProductFeeByProductId(callback,entity) {
    framework.service.request('subProductFeeSetService', 'CheckSubProductFeeByProductId', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg ,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findBySubProductFeeAccountID(callback) {
	framework.service.request('subProductFeeSetService', 'findBySubProductFeeAccountID', function (errCode, errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}

function copySubProductFeeSetEntity(callback,srcAccountID,desAccountID) {
    framework.service.request('subProductFeeSetService', 'copy', srcAccountID, desAccountID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
