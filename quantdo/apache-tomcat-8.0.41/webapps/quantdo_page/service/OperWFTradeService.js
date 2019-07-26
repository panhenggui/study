Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.OperTradeService = function(){
    this.findOperWFTradeByQuery =function  (entity,requestParams,orderType,orderWay,callback){
        framework.service.request('operWFTradeService', 'findByCapital',entity,requestParams,orderType,orderWay, function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
            }
            if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    this.totalTradeClientPos = function (entity,callback){
        framework.service.request('operWFTradeService', 'totleTrade', entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }




    this.findOperWFTradeBySubQuery = function(entity,requestParams,orderType,orderWay,callback){
        framework.service.request('operWFTradeService', 'findBySubAccount',entity,requestParams,orderType,orderWay, function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
            }
            if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    function exportExcelOWFTCap(callback,operClient){
        framework.service.request('operWFTradeService', 'exportExcelOWFTCap',operClient, function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
            }
            if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    function exportExcelOWFTSubCap(callback,operClient){
        framework.service.request('operWFTradeService', 'exportExcelOWFTSubCap',operClient, function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
            }
            if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    function  totalTradeClientPos (entity,callback){
        framework.service.request('operWFTradeService', 'totleTrade', entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }




}