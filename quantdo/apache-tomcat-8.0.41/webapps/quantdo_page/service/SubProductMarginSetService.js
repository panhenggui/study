
function getAllSubProductMarginSet(callback) {
    framework.service.request('subProductMarginSetService', 'getfindAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//根据ID查询信息
function updateSubProductMarginSetID(callback,id) {
    framework.service.request('subProductMarginSetService', 'findById', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//修改账户信息
function updateSubProductMarginSet(callback,entity) {
    framework.service.request('subProductMarginSetService', 'update', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//根据ID删除操作员信息
function deleteSubProductMarginSet(id) {
    framework.service.request('subProductMarginSetService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}
//根据条件查询
function findBySubProductMarginSet(callback, entity) {
    framework.service.request('subProductMarginSetService', 'findByQuery', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//添加信息
function saveSubProductMarginSet(callback,entity) {
    framework.service.request('subProductMarginSetService', 'add', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//批量删除
function deleteSubProductMarginSetLists(callback,entitys) {
    framework.service.request('subProductMarginSetService', 'deleteLists',
			entitys, function(errCode, errMsg, result) {
				if (errCode > 0) {
					layer.msg(errCode + ': ' + errMsg + '\n'
							+ JSON.stringify(result));
				}
				if (callback !== undefined || callback != null) {
		            callback(result);
		        }
			});
    
}

function getAllSubCapitalEntitys(callback) {
    framework.service.request('subCapitalAccountService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//原客户资金账号 复制 2.	目的客户资金账号
function copyBySubProductMarginSet(callback,entity,subAccountID) {
    framework.service.request('subProductMarginSetService', 'copyBySubProductMarginSet', entity,subAccountID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//根据id查询信息
function findSubProductMarginSetBysubAccountID(callback,subAccountID) {
    framework.service.request('subProductMarginSetService', 'findBySubAccountID', subAccountID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findBySubProductAccountID(callback) {
	framework.service.request('subProductMarginSetService', 'findBySubProductAccountID', function (errCode, errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}
function findBySubProductAccountIDList(callback,entity) {
	framework.service.request('subProductMarginSetService', 'findBySubProductAccountIDList',entity, function (errCode, errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}
