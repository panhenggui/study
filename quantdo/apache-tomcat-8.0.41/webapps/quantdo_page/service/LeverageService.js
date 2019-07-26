Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.LeverageService = function(){
    this.add = function(callback,entity){
        framework.service.request('leverageService', 'add',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    this.update = function(callback,entity){
        framework.service.request('leverageService', 'update',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    this.remove = function(callback,id){
        framework.service.request('leverageService', 'delete',id, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback();
            }
        });
    };
    
    this.findLeverageByCondition = function(callback,entity){
        framework.service.request('leverageService', 'findLeverageByCondition',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    this.findLeverageByProductID = function(callback,entity){
        framework.service.request('leverageService', 'findLeverageByProductID',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    this.searchLeverageByCondition = function(callback,entity){
        framework.service.request('leverageService', 'searchLeverageByCondition',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
}
