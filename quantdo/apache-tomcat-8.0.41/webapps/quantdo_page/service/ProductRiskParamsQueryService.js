Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.ProductRiskParamsQueryService = function(){
	
    this.findRiskExchangeOrderControlByQuery = function(callback,entity){
        framework.service.request('productRiskParamsQueryService', 'findRiskExchangeOrderControlByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    this.findRiskFutureVolumeControlByQuery = function(callback,entity){
        framework.service.request('productRiskParamsQueryService', 'findRiskFutureVolumeControlByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    this.findRiskDirectionControlByQuery = function(callback,entity){
        framework.service.request('productRiskParamsQueryService', 'findRiskDirectionControlByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    this.findStockTradingVarietiesRestrictionIndexByQuery = function(callback,entity){
        framework.service.request('productRiskParamsQueryService', 'findStockTradingVarietiesRestrictionIndexByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    this.findFutureVarietiesRestrictionIndexByQuery = function(callback,entity){
        framework.service.request('productRiskParamsQueryService', 'findFutureVarietiesRestrictionIndexByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    this.findRiskIndexSetByQuery = function(callback,entity){
        framework.service.request('productRiskParamsQueryService', 'findRiskIndexSetByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    this.findIndicatorThresholdByQuery = function(callback,entity){
        framework.service.request('productRiskParamsQueryService', 'findIndicatorThresholdByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    this.findRiskFundProductIdxByQuery = function(callback,entity){
        framework.service.request('productRiskParamsQueryService', 'findRiskFundProductIdxByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    this.findUnitNetValueStopByQuery = function(callback,entity){
        framework.service.request('productRiskParamsQueryService', 'findUnitNetValueStopByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    this.findDayMaxRetraceByQuery = function(callback,entity){
        framework.service.request('productRiskParamsQueryService', 'findDayMaxRetraceByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
    this.findNetValueRatiosByQuery = function(callback,entity){
        framework.service.request('productRiskParamsQueryService', 'findNetValueRatiosByQuery',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };
    
}
