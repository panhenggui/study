Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.subCapitalAccountProcessService = function(){

    this.findByQuery = function(callback,entity){
        framework.service.request('subCapitalAccountProcessService', 'findByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.add = function(callback,entity,capitalAccountList){
        framework.service.request('subCapitalAccountProcessService', 'add', entity, capitalAccountList, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.update = function(callback,entity,capitalAccountList){
        framework.service.request('subCapitalAccountProcessService', 'update', entity, capitalAccountList, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.cancel = function(callback,entity){
        framework.service.request('subCapitalAccountProcessService', 'cancel', entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.rebuild = function(callback,entity,capitalAccountList){
        framework.service.request('subCapitalAccountProcessService', 'rebuild', entity, capitalAccountList, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.queryInstClientID = function(callback){
        framework.service.request('queryIndexMenuPermissionService', 'queryInstClientID', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.findMargin = function(callback,entity){
        framework.service.request('subCapitalAccountProcessService', 'findMargin',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.findFee = function(callback,entity){
        framework.service.request('subCapitalAccountProcessService', 'findFee',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
}

