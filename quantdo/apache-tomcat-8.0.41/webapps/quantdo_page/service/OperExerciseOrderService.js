Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.operExerciseOrderService = function(){

    this.findByQuery = function(callback,entity){
        framework.service.request('operExerciseOrderService', 'findByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

}

