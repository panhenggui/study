Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.SubCapitalAccountTradingLimitService = function(){

    this.findAll = function(callback){
        framework.service.request('subCapitalAccountTradingLimitService', 'findAll', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });

    }

    this.findBysubAccountID = function(callback,subAccountID){
        framework.service.request('subCapitalAccountTradingLimitService', 'findBySubAccountID',subAccountID, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });

    }
    
    this.findLimitBySubAccountID = function(callback,subAccountID){
        framework.service.request('subCapitalAccountTradingLimitService', 'findLimitBySubAccountID',subAccountID, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });

    }
    
    this.savePinzhong = function(callback,subAccount,checkValues,isInsert) {
        framework.service.request('subCapitalAccountTradingLimitService', 'savePinzhong',subAccount,checkValues,isInsert, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg + '\n', {icon: 2});
            } else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.save = function(callback,entity) {
        framework.service.request('subCapitalAccountTradingLimitService', 'save',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg + '\n', {icon: 2});
            } else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.delete = function(callback,subAccountID) {
        framework.service.request('subCapitalAccountTradingLimitService', 'delete',subAccountID, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result), {icon: 2});
            } else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.copy = function (callback,sourceSubAccount,targetSubAccount) {
        framework.service.request('subCapitalAccountTradingLimitService', 'copy',sourceSubAccount,targetSubAccount, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg + '\n', {icon: 2});
            } else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.deletes = function(callback,entitys){
    	 framework.service.request('subCapitalAccountTradingLimitService', 'deletes',entitys, function (errCode, errMsg, result) {
             if (errCode != 0) {
                 layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result), {icon: 2});
             } else if (callback !== undefined || callback != null) {
                 callback(result);
             }
         });
    }
    
    this.findAllSubCapitalAccountTradingLimit = function(callback){
   	 framework.service.request('subCapitalAccountTradingLimitService', 'findAllSubCapitalAccountTradingLimit', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result), {icon: 2});
            } else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
   }
    this.findAllCapitalAccountTradingLimit = function(callback){
      	 framework.service.request('subCapitalAccountTradingLimitService', 'findAllCapitalAccountTradingLimit', function (errCode, errMsg, result) {
               if (errCode != 0) {
                   layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result), {icon: 2});
               } else if (callback !== undefined || callback != null) {
                   callback(result);
               }
           });
      }
    
    
    
    
    
    this.findAllLimit = function(callback){
    	framework.service.request('subCapitalAccountTradingLimitService', 'findAllLimit', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result), {icon: 2});
            } else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findfofAllLimit = function(callback){
    	framework.service.request('subCapitalAccountTradingLimitService', 'findfofAllLimit', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result), {icon: 2});
            } else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.deleteByCondition = function(callback,entity){
    	framework.service.request('subCapitalAccountTradingLimitService', 'deleteBySubAccountIDAndExchIDAndProductIDAndInstrumentID',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result), {icon: 2});
            } else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.deleteById = function(callback,id){
    	framework.service.request('subCapitalAccountTradingLimitService', 'deleteById',id, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result), {icon: 2});
            } else{
                callback();
            }
        });
    }
    
    this.deleteBySubCapitalAccountTradingLimits = function(callback,entitys){
    	framework.service.request('subCapitalAccountTradingLimitService', 'deleteBySubCapitalAccountTradingLimits',entitys, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result), {icon: 2});
            } else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findAllLimitBySubAccountID = function(callback,subAccountID){
    	framework.service.request('subCapitalAccountTradingLimitService', 'findAllLimitBySubAccountID',subAccountID, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result), {icon: 2});
            } else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    this.findfofAllLimitBySubAccountID = function(callback,subAccountID){
    	framework.service.request('subCapitalAccountTradingLimitService', 'findfofAllLimitBySubAccountID',subAccountID, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result), {icon: 2});
            } else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findAllTradingLimit = function(callback){
    	framework.service.request('subCapitalAccountTradingLimitService', 'findAllTradingLimit', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result), {icon: 2});
            } else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findCapRiskParamByCondition = function(callback,entity,type){
    	framework.service.request('subCapitalAccountTradingLimitService', 'findCapRiskParamByCondition',entity,type, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result), {icon: 2});
            } else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findSubCapRiskParamByCondition = function(callback,entity,type){
    	framework.service.request('subCapitalAccountTradingLimitService', 'findSubCapRiskParamByCondition',entity,type, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result), {icon: 2});
            } else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.addBwEntity = function(callback,entity){
    	framework.service.request('subCapitalAccountTradingLimitService', 'add',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            } else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.addCapBwEntitys = function(callback,entitys){
    	framework.service.request('subCapitalAccountTradingLimitService', 'addCapBWEntitys',entitys, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            } else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.addSubCapBwEntitys = function(callback,entitys){
    	framework.service.request('subCapitalAccountTradingLimitService', 'addSubCapBWEntitys',entitys, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            } else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.updateCapBwEntitys = function(callback,list,entity){
    	framework.service.request('subCapitalAccountTradingLimitService', 'updateCapBWEntitys', list, entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            } else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.updateSubCapBwEntitys = function(callback,list,entity){
    	framework.service.request('subCapitalAccountTradingLimitService', 'updateSubCapBWEntitys', list, entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg, {icon: 2});
            } else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
}
