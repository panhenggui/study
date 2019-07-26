Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.FeeTemplateProductService = function(){	
	this.findAll = function(callback){
	    framework.service.request('feeTemplateProductService', 'findAll', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}		
}
function getAllFeeTemplateProductEntity(callback) {
    framework.service.request('feeTemplateProductService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findFeeTemplateProduct(callback,feeTemplateProduct)
{
    framework.service.request('feeTemplateProductService', 'findByCondition', feeTemplateProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function CheckTemplateFeeByProductId(callback,feeTemplateProduct)
{
    framework.service.request('feeTemplateProductService', 'CheckTemplateFeeByProductId', feeTemplateProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg ,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function saveFeeTemplateProduct(callback,feeTemplateProduct)
{
    framework.service.request('feeTemplateProductService', 'add', feeTemplateProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg ,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function updateFeeTemplateProduct(callback,feeTemplateProduct)
{
    framework.service.request('feeTemplateProductService', 'update', feeTemplateProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function deleteFeeTemplateProductList(callback,feeTemplateProduct)
{
    framework.service.request('feeTemplateProductService', 'delList', feeTemplateProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function deleteFeeTemplateProductListByTID(templateID)
{
    framework.service.request('feeTemplateProductService', 'delByTemplateID', templateID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}

function copyFeeTemplateProduct(callback,srcTemplateID,desTemplateID)
{
    framework.service.request('feeTemplateProductService', 'copyFeeTemplateProduct', srcTemplateID, desTemplateID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}