Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.OtherIncomeSetService = function(){	
	this.findAll = function(callback){
	    framework.service.request('otherIncomeSetService', 'findAll', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}

}

function getAllOtherIncomeSetEntity(callback) {
    framework.service.request('otherIncomeSetService', 'getAllOtherIncomeSetEntity',function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getOtherIncomeSetTotEntity(callback,fundProductId) {
    framework.service.request('otherIncomeSetService', 'getOtherIncomeSetTotEntity',fundProductId,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}



function findByOtherIncomeSetEntity(callback,fundProduct) {
    framework.service.request('otherIncomeSetService', 'findByOtherIncomeSetEntity',fundProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function findByPorId(callback,fundProduct) {
    framework.service.request('otherIncomeSetService', 'findByPorId',fundProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function removeotherIncomeSet(callback,fundProduct)
{
    framework.service.request('otherIncomeSetService', 'delete', fundProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function updateOtherIncomeSet(callback,fundProduct)
{
    framework.service.request('otherIncomeSetService', 'update', fundProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function saveOtherIncomeSet(callback,fundProduct)
{
    framework.service.request('otherIncomeSetService', 'add', fundProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function findOtherIncomeEntity(callback,otherIncomeEntity)
{
    framework.service.request('otherIncomeSetService', 'findOtherIncomeEntity', otherIncomeEntity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findOtherIncomeSetEntity(callback,otherIncomeEntity)
{
    framework.service.request('otherIncomeSetService', 'findOtherIncomeSetEntity', otherIncomeEntity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}









