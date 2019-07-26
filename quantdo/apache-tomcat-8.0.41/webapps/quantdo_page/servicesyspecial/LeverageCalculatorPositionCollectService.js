Namespace.register("com.quantdo.orgClear.servicesyspecial");
com.quantdo.orgClear.servicesyspecial.leverageCalculatorPositionCollectService = function() {

    this.findAll = function(callback,entity){
        framework.service.request('leverageCalculatorPositionCollectService', 'findAll',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    this.findInnnerAccount = function(entity,callback){
        framework.service.request('leverageCalculatorPositionCollectService', 'findInnerAccountID',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    this.findInnerAccountIdWithRealprin = function(entity,callback){
        framework.service.request('leverageCalculatorPositionCollectService', 'findInnerAccountIdWithRealprincipal',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
}