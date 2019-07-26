Namespace.register("com.quantdo.orgClear.servicesyspecial");
com.quantdo.orgClear.servicesyspecial.leverageCalculatorPositionService = function() {
    this.add = function(callback,entity){
        framework.service.request('leverageCalculatorPositionService', 'add', entity, function (errCode, errMsg, result) {     //这里是框架封装的调用的后台service.java中定义的类
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.update = function(callback,entity){
        framework.service.request('leverageCalculatorPositionService', 'update', entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.remove = function(callback,entity){
        framework.service.request('leverageCalculatorPositionService', 'delete', entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback();
            }
        });
    }

    this.findByQuery = function(callback,entity){
        framework.service.request('leverageCalculatorPositionService', 'findByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    this.findCurExchangeRate = function(callback,entity){
        framework.service.request('leverageCalculatorPositionService', 'findCurExchangeRate',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg ,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
}