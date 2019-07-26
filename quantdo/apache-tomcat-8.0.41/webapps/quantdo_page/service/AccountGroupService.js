//Namespace.register("com.quantdo.orgClear.service");
Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.AccountGroupService = function(){
    this.findAllGroup = function(callback,entity){
        framework.service.request('accountGroupService', 'findAllGroup',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };

    this.getMaxAccountGroupID = function(callback){
        framework.service.request('accountGroupService', 'getMaxAccountGroupID', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
}
//查询所有
function getAllAccountGroupsEntity(callback) {
    framework.service.request('accountGroupService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//根据机构代码查询所属账号zu
function getAccountGroupsByInstClientId(callback,instClientId) {
    framework.service.request('accountGroupService', 'getAccountGroupsByInstClientId',instClientId, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//根据机构代码查询所属活跃账号组
function getActiveAccountGroupsByInstClientId(callback,instClientID) {
    framework.service.request('accountGroupService', 'getActiveAccountGroupsByInstClientId',instClientID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//修改账户信息
function updateAccountGroupEntity(callback, entity) {
    framework.service.request('accountGroupService', 'update',entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//根据分组号 和 分组名称查询信息
function findByAccountGroup(callback,entity) {
    framework.service.request('accountGroupService', 'findAccountGroupByQuery',entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//添加分组信息
function saveAccountGroup(callback, entity) {
    framework.service.request('accountGroupService', 'add', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//根据ID删除分组信息
function deleteAccountGroup(id) {
    framework.service.request('accountGroupService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}


//根据分组代码查询分组信息是否存在
function findByAccountGroupID(callback, accountGroupID,instClientId) {
    framework.service.request('accountGroupService', 'findByAccountGroupID', accountGroupID,instClientId, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//校验分组代码是否与资产单元或者资金账号有对应关系
function findByCapitalAccountGroupID(callback, accountGroupID,instClientID) {
	framework.service.request('accountGroupService', 'findByCapitalAccountGroupID', accountGroupID,instClientID, function (errCode, errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}