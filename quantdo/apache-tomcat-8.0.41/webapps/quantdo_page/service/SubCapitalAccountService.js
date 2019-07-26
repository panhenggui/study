Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.SubCapitalAccountService = function(){

    this.findAll = function(callback){
        framework.service.request('subCapitalAccountService', 'findAll', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findAllActive = function(callback){
        framework.service.request('subCapitalAccountService', 'findAllActive', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findAllActiveRisParam = function(callback){
        framework.service.request('subCapitalAccountService', 'findAllActiveRisParam', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findAllActiveAccParam = function(callback){
        framework.service.request('subCapitalAccountService', 'findAllActiveAccParam', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    

    this.findById = function(callback,id){
        framework.service.request('subCapitalAccountService', 'searchById',id, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.find = function(callback,id){
        framework.service.request('subCapitalAccountService', 'findById',id, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findSubById = function(callback,id,brokerID){
        framework.service.request('subCapitalAccountService', 'findSubById',id, brokerID,function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    
    this.findByUserId = function(callback,userId,userType){
        framework.service.request('subCapitalAccountService', 'findByUserId',userId,userType, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    this.findCapByUserId = function(callback,userId,userType){
        framework.service.request('subCapitalAccountService', 'findCapByUserId',userId,userType, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    
    
    this.findGroupSubByUserId = function(callback,userId,userType){
        framework.service.request('subCapitalAccountService', 'findGroupSubByUserId',userId,userType, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findAllSubCapitalAccount = function(callback,entity){
        framework.service.request('subCapitalAccountService', 'findAllSubCapitalAccount',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findBysubAccountID = function(callback,subAccountID){
        framework.service.request('subCapitalAccountService', 'findBysubAccountID',subAccountID, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findAllByIsActive = function(callback,subAccount){
        framework.service.request('subCapitalAccountService', 'findAllByIsActive',subAccount, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
}


function getAllSubCapitalEntity(callback) {
    framework.service.request('subCapitalAccountService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getAllAccounts(callback) {
    framework.service.request('capitalAccountService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


//修改账户信息
function updateSubCapitalEntity(callback,entity) {
    framework.service.request('subCapitalAccountService', 'update', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findSubCapitalEntity(callback, capital) {
    framework.service.request('subCapitalAccountService', 'findByCondition', capital, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function findEntityByTradIdAndInstClitId(callback, capital) {
    framework.service.request('subCapitalAccountService', 'findEntityByTradIdAndInstClitId', capital, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function saveSubCapitalEntity(callback, entity) {
    framework.service.request('subCapitalAccountService', 'add', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function saveSubCapitalAcc(callback,trader,traderInfo,entity,innerAccounts) {
    framework.service.request('subCapitalAccountService', 'saveSubCapitalAcc',trader,traderInfo, entity, innerAccounts, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2});
        }
        else if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function checkSubAccount(callback,capitalAccount) {
    framework.service.request('subCapitalAccountService', 'checkAccount', capitalAccount.innerAccountID,capitalAccount.traderID,
    		capitalAccount.isActive, capitalAccount.instClientID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function checkSubAccountByGroupId(callback,capitalAccount) {
    framework.service.request('subCapitalAccountService', 'checkSubAccountByGroupId', capitalAccount, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getTraderDetailList(callback,trader) {
    framework.service.request('subCapitalAccountService', 'getTraderDetailList', trader, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function updateTraderDetail(callback,trader,innerAccounts) {
    framework.service.request('subCapitalAccountService', 'updateTraderDetail', trader, innerAccounts, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2});
        }
        else if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function updateTraderIsActive(callback, isActive, traderID) {
    framework.service.request('subCapitalAccountService', 'updateTraderIsActive', isActive, traderID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function deleUserAccBySubInnAccId(callback, traderID) {
    framework.service.request('subCapitalAccountService', 'deleUserAccBySubInnAccId', traderID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(errCode);
        }
    });
}

function findBySubCapitalAccountInfo(entity, callback){
	framework.service.request('subCapitalAccountService', 'findByCapitalInfo', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function checkAccountRelation(callback,accountRelation) {
    framework.service.request('accountRelationService', 'findByQuery', accountRelation, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
