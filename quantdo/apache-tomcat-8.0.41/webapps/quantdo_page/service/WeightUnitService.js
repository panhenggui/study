Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.WeightUintService = function(){	
	this.getAllWeightUnitEntity = function(callback) {
	    framework.service.request('weightUnitService', 'findAll', function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
}

function findWeightUnitEntity(callback, entity) {
    framework.service.request('weightUnitService', 'findByCondition',entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function saveWeightUnitEntity(callback,entity) {
    framework.service.request('weightUnitService', 'add', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function updateWeightUnitEntity(callback,entity) {
    framework.service.request('weightUnitService', 'update', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}



function deleteWeightUnitEntity(callback,id) {
    framework.service.request('weightUnitService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


