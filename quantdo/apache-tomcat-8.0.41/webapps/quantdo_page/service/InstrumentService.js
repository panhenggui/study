Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.InstrumentService = function(){
	this.getInstrument = function(callback,entity,map){
        framework.service.request('instrumentService', 'getInstrument',entity,map, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });

    }
	
	this.findByExchIDAndProductID = function(callback,productID,exchID){
        framework.service.request('instrumentService', 'findByProductIDAndExchID',productID,exchID, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });

    }
	
	this.findAllByProductIDAndExchID = function(callback,productID,exchID){
        framework.service.request('instrumentService', 'findAllByProductIDAndExchID',productID,exchID, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });

    }
	
	this.queryAllInstrument = function(instrument,requestParams,orderType,orderWay, callback) {
	    framework.service.request('instrumentService', 'queryAllInstrument',instrument, requestParams,orderType,orderWay, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
}

function getAllInstrumentEntity(callback) {
    framework.service.request('instrumentService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//初始化所有期权系列
function getAllOptionSeries(callback,entity)
{
    framework.service.request('optionSeriesService', 'findByQuery',entity.exchID,entity.productID,entity.optionSeriesID ,function(errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


//修改账户信息
function updateInstrumentEntity(callback,entity) {
    framework.service.request('instrumentService', 'update', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//根据ID删除操作员信息
function deleteInstrumentEntity(callback,id) {
    framework.service.request('instrumentService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findInstrumentEntity(callback, entity) {
    framework.service.request('instrumentService', 'findByCondition',entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findByInstrumentID(callback, entity) {
    framework.service.request('instrumentService', 'findByInstrumentID',entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function saveInstrumentEntity(callback,entity) {
    framework.service.request('instrumentService', 'add', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


