
function getAllSubInstrumentMarginSet(callback) {
    framework.service.request('subInstrumentMarginSetService', 'getfindAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


//修改账户信息
function updateSubInstrumentMarginSet(callback,entity) {
    framework.service.request('subInstrumentMarginSetService', 'update', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//根据ID删除操作员信息
function deleteSubInstrumentMarginSet(id) {
    framework.service.request('subInstrumentMarginSetService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}
//根据条件查询
function findBySubInstrumentMarginSet(callback, entity) {
    framework.service.request('subInstrumentMarginSetService', 'findByQuery', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function findSubInstrumentMarginSetByPk(callback, entity) {
    framework.service.request('subInstrumentMarginSetService', 'findSubInstrumentMarginSetByPk', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//添加信息
function saveSubInstrumentMarginSet(callback,entity) {
    framework.service.request('subInstrumentMarginSetService', 'add', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//批量删除
function deleteSubInstrumentMarginSetLists(callback,entitys) {
    framework.service.request('subInstrumentMarginSetService', 'deleteLists',
			entitys, function(errCode, errMsg, result) {
				if (errCode > 0) {
					console.error(errMsg);
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
function copyBySubInstrumentMarginSet(callback,entity,subAccountID) {
    framework.service.request('subInstrumentMarginSetService', 'copyBySubInstrumentMarginSet', entity,subAccountID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//根据id查询信息
function findSubInstrumentMarginSetBysubAccountID(callback,subAccountID) {
    framework.service.request('subInstrumentMarginSetService', 'findBySubAccountID', subAccountID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findBySubAccountIDList(callback,entity) {
    framework.service.request('subInstrumentMarginSetService', 'findbyEntity',entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function findBySubInstrumentAccountID(callback) {
	framework.service.request('subInstrumentMarginSetService', 'findBySubInstrumentAccountID', function (errCode, errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}




