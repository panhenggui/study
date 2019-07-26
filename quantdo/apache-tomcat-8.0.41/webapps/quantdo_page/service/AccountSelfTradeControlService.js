Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.AccountSelfTradeControlService = function(){
    this.add = function(callback,entity){
        framework.service.request('accountSelfTradeControlService', 'add',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    this.update = function(callback,entity){
        framework.service.request('accountSelfTradeControlService', 'update',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    this.remove = function(callback,entity){
        framework.service.request('accountSelfTradeControlService', 'delete',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback();
            }
        });
    };
    
    this.findByQuery = function(callback,entity){
        framework.service.request('accountSelfTradeControlService', 'findByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    this.savePrewarnCount = function(callback,entity){
        framework.service.request('accountSelfTradeControlService', 'save',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    this.getPreWarnCount = function(callback){
        framework.service.request('accountSelfTradeControlService', 'getPreWarnCount', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    
    this.queryCanInsert = function(callback,entity){
        framework.service.request('accountSelfTradeControlService', 'queryCanInsert',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    
    this.queryCanUpdate = function(callback,entity){
        framework.service.request('accountSelfTradeControlService', 'queryCanUpdate',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
}
