Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.SubAccountRiskParamService = function(){

    this.save = function(callback,ModalEntity,isInsert){
        framework.service.request('subAccountRiskParamService', 'save',ModalEntity,isInsert, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg + '\n',{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.findOne = function(callback,subAccountID){
        framework.service.request('subAccountRiskParamService', 'findOne',subAccountID, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.update = function(callback,entity){
        framework.service.request('subAccountRiskParamService', 'update',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.delete = function(callback,subAccountID,brokerID){
        framework.service.request('subAccountRiskParamService', 'delete',subAccountID,brokerID, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findAll = function(callback){
        framework.service.request('subAccountRiskParamService', 'findAll', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.deletes = function(callback,entitys){
        framework.service.request('subAccountRiskParamService', 'deletes',entitys, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findAllIsActive = function(callback){
        framework.service.request('subAccountRiskParamService', 'findAllIsActive', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
}