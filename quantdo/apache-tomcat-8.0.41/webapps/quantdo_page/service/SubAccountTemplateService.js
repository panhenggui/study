Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.SubAccountTemplateService = function(){	
	this.findAll = function(callback){
	    framework.service.request('subAccountTemplateService', 'findAll', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
}


function getAllSubAccountTemplateEntity(callback) {
    framework.service.request('subAccountTemplateService', 'findAll', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function updateSubAccountTemplate(callback,subAccountTemplate) {
    framework.service.request('subAccountTemplateService', 'update', subAccountTemplate, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function deleteSubAccountTemplate(id) {
    framework.service.request('subAccountTemplateService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}
//根据账号删除对应模板
function deleteSubAccountTemplateSubAccountID(subAccountID) {
	framework.service.request('subAccountTemplateService', 'deleteSubAccountTemplate', subAccountID, function (errCode, errMsg, result) {
		if (errCode > 0) {
			console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
	});
}

function findSubAccountTemplateByCondition(callback, subAccountTemplate) {
    framework.service.request('subAccountTemplateService', 'findByQuery', subAccountTemplate, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function saveSubAccountTemplate(callback,subAccountTemplate) {
    framework.service.request('subAccountTemplateService', 'add', subAccountTemplate, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function deleteSubAccountTemplateItem(subAccountTemplates) {
    framework.service.request('subAccountTemplateService', 'deleteItem', subAccountTemplates, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
    });
}
// 资金账户+保证金模板+手续费模板=查询对应费用模板信息
function getAllInfoSubAccountTemplateID(callback,subAccountID,marginTemplateID,feeTemplateID) {
    framework.service.request('subAccountTemplateService', 'getAllInfo',subAccountID,marginTemplateID,feeTemplateID,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

	function getDistinctSubAccountID(callback,subAccountID) {
		framework.service.request('subAccountTemplateService', 'getDistinctSubAccountID',subAccountID, function (errCode, errMsg, result) {
			if (errCode > 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
			}
			if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}

	function saveAndDelSubAccountTemplate(callback,subAccountTemplate,subAccountID,subAccountTemplates) {
	    framework.service.request('subAccountTemplateService', 'addAndDelete', subAccountTemplate,subAccountID,subAccountTemplates, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	function saveTwoDelSubAccountTemplate(callback,subAccountTemplate,subAccountTemplates) {
		framework.service.request('subAccountTemplateService', 'addTwo', subAccountTemplate,subAccountTemplates, function (errCode, errMsg, result) {
			if (errCode > 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
			}
			if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
	
	
