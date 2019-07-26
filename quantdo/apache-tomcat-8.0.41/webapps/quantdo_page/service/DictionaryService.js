//Namespace.register("com.quantdo.orgClear.service");
Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.dictionaryService = function(){
    this.findByQuery = function(callback,entity){
        framework.service.request('dictionaryService', 'findByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };

}
