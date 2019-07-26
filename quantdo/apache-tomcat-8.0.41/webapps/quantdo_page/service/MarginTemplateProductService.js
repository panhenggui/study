function getAllMarginTemplateProduct(callback,templateID) {
    framework.service.request('marginTemplateProductService', 'getFindAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//修改模板品种保证金率
function updateMarginTemplateProduct(callback,entity) {
    framework.service.request('marginTemplateProductService', 'update', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//添加模板品种保证金率
function saveMarginTemplateProduct(callback,entity) {
    framework.service.request('marginTemplateProductService', 'add', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


//根据ID模板品种保证金率
function deleteMarginTemplateProduct(callback,templateProduct) {
    framework.service.request('marginTemplateProductService', 'delete', templateProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//根据条件查询
function findByMarginTemplateProduct(callback, entity) {
    framework.service.request('marginTemplateProductService', 'findByQuery', entity,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//根据模板Id查询
function findSubAccTemByTemplateID(callback, entity) {
    framework.service.request('marginTemplateProductService', 'findSubAccTemByTemplateID', entity,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}




//批量删除
function deleteMarginTemplateProductLists(callback,entitys) {
    framework.service.request('marginTemplateProductService', 'deleteList',
			entitys, function(errCode, errMsg, result) {
				if (errCode > 0) {
					console.error(errCode + ': ' + errMsg + '\n'
							+ JSON.stringify(result));
				}
				if (callback !== undefined || callback != null) {
		            callback();
		        }
			});
 }
//
function delByTemplateProductIDs(templateID)
{
    framework.service.request('marginTemplateProductService', 'delByTemplateProductID', templateID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}

function copyMarginTemplateProduct(callback,srcTemplateID,desTemplateID)
{
    framework.service.request('marginTemplateProductService', 'copyMarginTemplateProduct', srcTemplateID, desTemplateID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
