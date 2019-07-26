Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.TradeService = function(){
    this.dealCount = function(callback,map){
        framework.service.request('tradeService', 'dealCount',map, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });

    }
    
    this.findBulkTrade = function(entity,callback){
        framework.service.request('tradeService', 'findBulkTrade',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });

    }
    
    this.checkInnerAccountID = function(entity,callback){
        framework.service.request('tradeService', 'checkInnerAccountID', entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.saveUploadData = function(entitys,callback){
        framework.service.request('tradeService', 'saveUploadData', entitys, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findTradeByType = function(type,entity,callback){
        framework.service.request('tradeService', 'findTradeByType', type, entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findByInnerAccountID = function(instClientID,innerAccountID,callback){
        framework.service.request('subCapitalAccountService', 'findByInnerAccountID', instClientID, innerAccountID, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.addTradeAuto = function(callback){
        framework.service.request('tradeService', 'addTradeAuto', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.saveBulkUpdateData = function(entitys,callback){
        framework.service.request('tradeService', 'saveBulkUpdateData', entitys, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
}


function getAllTradeEntity(callback) {
    framework.service.request('tradeService', 'findAll', function (errCode, errMsg, result) {

        if (errCode > 0) {            
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getAllTradeEntityBySubCap(callback) {
    framework.service.request('tradeService', 'getAllTradeEntityBySubCap', function (errCode, errMsg, result) {

        if (errCode > 0) {            
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function getAllTradeEntityByCap(callback) {
    framework.service.request('tradeService', 'getAllTradeEntityByCap', function (errCode, errMsg, result) {

        if (errCode > 0) {            
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function addTrade(trade,feeList,callback) {
    framework.service.request('tradeService', 'add', trade,feeList,function (errCode, errMsg, result) {
        if (errCode > 0) {
        	layer.msg(errMsg,{icon: 2});
        	return false;
        }
        if (callback !== undefined || callback != null) {        	
            callback(result);
        }
    });
}

function addCapTrade(trade,feeList,callback) {
    framework.service.request('tradeService', 'addCapTrade', trade,feeList,function (errCode, errMsg, result) {
        if (errCode > 0) {
        	layer.msg(errMsg,{icon: 2});
        	return false;
        }
        if (callback !== undefined || callback != null) {        	
            callback(result);
        }
    });
}


function addOutCapTrade(trade,callback) {
    framework.service.request('tradeService', 'addOutCapTrade', trade,function (errCode, errMsg, result) {
        if (errCode > 0) {
        	layer.msg(errMsg,{icon: 2});
        	return false;
        }
        if (callback !== undefined || callback != null) {        	
            callback(result);
        }
    });
}


function addOutTrade(trade,callback) {
    framework.service.request('tradeService', 'addOutTrade', trade,function (errCode, errMsg, result) {
        if (errCode > 0) {
        	layer.msg(errMsg,{icon: 2});
        	return false;
        }
        if (callback !== undefined || callback != null) {        	
            callback(result);
        }
    });
}

function updateTrade(object,feeList,callback) {
    framework.service.request('tradeService', 'update', object,feeList, function (errCode, errMsg, result) {
        if (errCode > 0) {
        	layer.msg(errMsg,{icon: 2});
        	return false;
        }
        if (callback !== undefined || callback != null) {        	
            callback(result);
        }        
    });
    
}

function updateHisTrade(object,feeList,callback) {
    framework.service.request('tradeService', 'updateHisTrade', object,feeList, function (errCode, errMsg, result) {
        if (errCode > 0) {
        	layer.msg(errMsg,{icon: 2});
        	return false;
        }
        if (callback !== undefined || callback != null) {        	
            callback(result);
        }        
    });
    
}

function deleteTrade(id,callback) {
    framework.service.request('tradeService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
        	layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
        	return false;
        }
        if (callback !== undefined || callback != null) {        	
            callback(result);
        } 
    });
}

function deleteHisTrade(id,callback) {
    framework.service.request('tradeService', 'deleteHisTrade', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
        	layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
        	return false;
        }
        if (callback !== undefined || callback != null) {        	
            callback(result);
        } 
    });
}

function getTradeQueryEntity(callback, tradeQuery, searchType) {
    framework.service.request('tradeService', 'findTradeQuery', tradeQuery, searchType, function (errCode, errMsg, result) {
        if (errCode > 0) {
        	layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
        	return false;
        }
        if (callback !== undefined || callback != null) {        	
            callback(result);
        } 
    });
}

function findTradeEntityEntity(entity,callback) {
    framework.service.request('tradeService', 'findByCondition',entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
        	layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function findTradeBySubCap(entity,callback) {
    framework.service.request('tradeService', 'findTradeBySubCap',entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
        	layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findTradeByCap(entity,callback) {
    framework.service.request('tradeService', 'findTradeByCap',entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
        	layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getTradeFeeService(callback,entity){
    framework.service.request('tradeService', 'getTradeFee', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2, time: 3000});
            return false;
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getBrokerTradeFeeService(callback,entity){
    framework.service.request('tradeService', 'getBrokerFee', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2, time: 3000});
            return false;
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function billQuerySubOffset(callback,entity){
    framework.service.request('subOffsetDetailService', 'billQuerySubOffset', entity.subAccountID, 
    		entity.settleDate, entity.instClientID,entity.type, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2, time: 3000});
            return false;
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}



function checkCapTrade(callback,entity){
    framework.service.request('tradeService', 'checkCapTrade', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2, time: 3000});
            return false;
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function checkSubCapTrade(callback,entity){
    framework.service.request('tradeService', 'checkSubCapTrade', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2, time: 3000});
            return false;
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function totalTradeQuery(entity,callback){
    framework.service.request('tradeService', 'totalTradeQuery', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2, time: 3000});
            return false;
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function findAllActiveTradeUser(callback,instClientID,subAccountId){
    framework.service.request('tradeUserService', 'findAllActiveTradeUser', instClientID,subAccountId, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2, time: 3000});
            return false;
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function  findUserType(callback){
      framework.service.request('tradeService' , 'findUserType' ,function(errCode, errMsg, result){
        if (errCode > 0) {
                  layer.msg(errMsg, {icon: 2, time: 3000});
                  return false;
              }
              if (callback !== undefined || callback != null) {
                  callback(result);
              }
          });
}

function findBySubCapitalAccountByUserType(entity, callback){
    framework.service.request('subCapitalAccountService', 'findByCapitalByLogInUser', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}