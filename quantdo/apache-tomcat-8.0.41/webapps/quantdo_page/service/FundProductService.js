Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.FundProductService = function(){	
	this.findAll = function(callback){
	    framework.service.request('fundProductService', 'findAll', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}		
}
function getAllFundProductEntity(callback) {
    framework.service.request('fundProductService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getFundProductByCondition(entity, callback) {
    framework.service.request('fundProductService', 'getByCondition', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findFundProduct(callback,fundProduct)
{
    framework.service.request('fundProductService', 'findFundProduct', fundProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findFundProductByConts(callback,fundProduct)
{
	framework.service.request('fundProductService', 'findFundProductByConts', fundProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findByFundProductPM(callback,fundProduct)
{
    framework.service.request('fundProductService', 'findByFundProductPM', fundProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function isConnectedwithCapitalAccount(callback,fundProduct)
{
	framework.service.request('fundProductService', 'isConnectedwithCapitalAccount', fundProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function saveFundProduct(callback,fundProduct)
{
    framework.service.request('fundProductService', 'add', fundProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function updateFundProduct(callback,fundProduct)
{
    framework.service.request('fundProductService', 'update', fundProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findAvaliableFundProductID(callback)
{
    framework.service.request('fundProductService', 'findAvaliableFundProductID', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function isInstClientSelect(callback,instClientId)
{
    framework.service.request('fundProductService', 'isInstClientSelect',instClientId, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}



