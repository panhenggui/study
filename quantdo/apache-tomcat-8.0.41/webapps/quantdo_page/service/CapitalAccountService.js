Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.CapitalAccountService = function(){	
	this.findAll = function(callback){
	    framework.service.request('capitalAccountService', 'findAll', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findPageInfoByQuery = function(callback,entity){
	    framework.service.request('capitalAccountService', 'findPageInfoByQuery', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}

    this.findByAccountGroupIDIsNull = function(callback,entity){
        framework.service.request('capitalAccountService', 'findByAccountGroupIDIsNull',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.checkSeat = function(callback,entitys){
        framework.service.request('capitalAccountService', 'checkSeat', entitys, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.findExch = function(callback,entity){
        framework.service.request('capitalAccountService', 'findExch', entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.getCapitalAccountByAccountGroup = function(callback,instClientID,accountGroupID){
        framework.service.request('capitalAccountService', 'getCapitalAccountByAccountGroup', instClientID, accountGroupID, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
}


function getAllCapitalAccountEntity(callback) {
    framework.service.request('capitalAccountService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg);
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//修改账户信息
function updateCapitalAccount(callback,capital) {
    framework.service.request('capitalAccountService', 'update', capital, function (errCode, errMsg, result) {
        if (errCode > 0) {
        	  layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//修改账户信息
function updatePwd(callback,capital,validcode) {
    framework.service.request('capitalAccountService', 'updatePwd', capital, validcode, function (errCode, errMsg, result) {
    	if (errCode == 6){
        	layer.msg(errMsg,{icon: 2});
        	callback(1);
        }else if (errCode != 0) {            
            layer.msg(errMsg,{icon: 2});
            callback(1);
    	}else if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//查找营业部信息
function getAllBranchs(callback) {
    framework.service.request('branchService', 'getAllBranchs', function (errCode, errMsg, result) {
        if (errCode != 0) {            
            layer.msg(errMsg,{icon: 2});
    	}else if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}



//根据ID删除操作员信息
function deleteCapital(id) {
    framework.service.request('capitalAccountService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
        	  layer.msg(errMsg,{icon: 2});
        }
    });
}

function findCapitalAccount(capital) {
    var dtd = $.Deferred();
    var mytables = sessionStorage.mytables.split(",");
    if(sessionStorage.initFlag){
        framework.service.request('capitalAccountService', 'findByQuery', capital, function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errMsg);
                dtd.reject(errCode,errMsg);
            }
            dtd.resolve(result);
            //if (callback !== undefined || callback != null) {
            //    callback(result);
            //}
        });
        return dtd;

    }

    for(var i=0;i<mytables.length;i++){
        if("#capitalAccount_table" == mytables[i]){
            framework.service.request('capitalAccountService', 'findByQuery', capital, function (errCode, errMsg, result) {
                if (errCode > 0) {
                    layer.msg(errMsg);
                    dtd.reject(errCode,errMsg);
                }
                dtd.resolve(result);
                //if (callback !== undefined || callback != null) {
                //    callback(result);
                //}
            });
            return dtd;
        }
    }


}


function findCapitalAccountByProductId(callback, capital) {
    framework.service.request('capitalAccountService', 'findCapitalAccountByProductId', capital, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg);
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function findCapitalByBrokId(callback) {
    framework.service.request('capitalAccountService', 'findCapitalByBrokId', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg);
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findActiveCapitalByBrokId(callback) {
    framework.service.request('capitalAccountService', 'findActiveCapitalByBrokId', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg);
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findCapAccByInnerAccountID(callback, innerAccountID,validcode) {
    framework.service.request('capitalAccountService', 'findCapAccByInnerAccountID', innerAccountID, validcode, function (errCode, errMsg, result) {
        if (errCode > 0) {
        	layer.msg(errMsg,{icon: 2});
            callback(1);
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}



function checkCapAccByPrKey(callback, entity) {
    framework.service.request('capitalAccountService', 'checkCapAccByPrKey', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg);
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}



function findCapAccIdByProductIdAndInstId(callback, fundProductID,instClientID) {
    framework.service.request('capitalAccountService', 'findCapAccIdByProductIdAndInstId', fundProductID,instClientID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg);
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findByAccountID(callback, capital) {
    framework.service.request('capitalAccountService', 'findByAccountID', capital, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg);
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function saveCapitalAccount(callback,capitalAccount) {
    framework.service.request('capitalAccountService', 'add', capitalAccount, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg);
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findActiveCapitalAccount(callback) {
    framework.service.request('capitalAccountService', 'findActiveCapitalAccount', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg);
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findActiveCapByInstClientID(callback,instClientID) {
    framework.service.request('capitalAccountService', 'findActiveCapByInstClientID',instClientID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg);
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function deleUserAccByInnAccId(callback,capitalAccount) {
    framework.service.request('capitalAccountService', 'deleUserAccByInnAccId', capitalAccount, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg);
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getSystemConfig(configType, callback) {
	framework.service.request('systemConfigService', 'getSystemConfig', configType, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg);
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findCapitalAccountByQuery(entity, callback){
	framework.service.request('capitalAccountService', 'findCapitalByInfo', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg);
            dtd.reject(errCode,errMsg);
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findMainBroCapsByInst(entity, callback){
	framework.service.request('capitalAccountService', 'findMainBroCapsByInst', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2});
            dtd.reject(errCode,errMsg);
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


//席位用户新增信息
function insertSeatUser(callback,capital,seatId,insertSeatUser,validcode) {
    framework.service.request('capitalAccountService', 'insertSeatUser', capital,seatId,insertSeatUser, validcode, function (errCode, errMsg, result) {
    	if (errCode == 6){
        	layer.msg(errMsg,{icon: 2});
        	callback(1);
        }else if (errCode != 0) {            
            layer.msg(errMsg,{icon: 2});
            callback(1);
    	}else if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


//席位用户查找信息
function findSeatUser(callback,capital,seatId,flag) {
  framework.service.request('capitalAccountService', 'findSeatUser', capital,seatId,flag, function (errCode, errMsg, result) {
  	if (errCode == 6){
      	layer.msg(errMsg,{icon: 2});
      	callback(1);
      }else if (errCode != 0) {            
          layer.msg(errMsg,{icon: 2});
          callback(1);
  	}else if (callback !== undefined || callback != null) {
          callback(result);
      }
  });
}


function isHideFundProduct(callback){
	framework.service.request('capitalAccountService', 'isHideFundProduct', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {icon: 2});
            dtd.reject(errCode,errMsg);
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}







