Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.operOptionSelfCloseService = function(){

    this.findByQuery = function(callback,entity){
        framework.service.request('operOptionSelfCloseService', 'findByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

}

