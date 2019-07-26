Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.FeeTemplateService = function(){	
	this.findAll = function(callback){
	    framework.service.request('feeTemplateService', 'findAll', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}		
}
function getAllFeeTemplateEntity(callback) {
    framework.service.request('feeTemplateService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findFeeTemplate(callback,feeTemplate)
{
    framework.service.request('feeTemplateService', 'findByCondition', feeTemplate, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function checkFeeTemplate(callback,feeTemplate)
{
    framework.service.request('feeTemplateService', 'checkFeeTemplate', feeTemplate, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}



function saveFeeTemplate(callback,feeTemplate)
{
    framework.service.request('feeTemplateService', 'add', feeTemplate, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function updateFeeTemplate(callback,feeTemplate)
{
    framework.service.request('feeTemplateService', 'update', feeTemplate, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function deleteFeeTemplate(callback,feeTemplate)
{
    framework.service.request('feeTemplateService', 'delItem', feeTemplate, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getMaxFeeTemplateID(callback)
{
    framework.service.request('feeTemplateService', 'getMaxFeeTemplateID', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
