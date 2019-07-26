Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.hisExerciseOrderService = function(){

    this.findByQuery = function(entity,beginDate,endDate,requestParams,orderType,orderWay,callback){
        framework.service.request('hisExerciseOrderService', 'findByQuery',entity,beginDate,endDate,requestParams,orderType,orderWay, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

}

