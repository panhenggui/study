function findByfundproduct(callback,obj){
	 framework.service.request('fundProductRisknodeService', 'findByfp',obj, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
}
function findRiskNodeBynodeName(callback,entity){
	 framework.service.request('fundProductRisknodeService', 'findByCondition', entity, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
}
function saveRiskNode(callback,entity){
	 framework.service.request('fundProductRisknodeService', 'save',entity, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
}

//根据ID删除分组信息
function removeRiskNode(callback,id) {
    framework.service.request('fundProductRisknodeService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
        	layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//更新风控节点信息
function updateRiskNode(callback,entity){
	 framework.service.request('fundProductRisknodeService', 'update',entity, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
}
//通过风控节点查询其已获数据权限
function  findselectedRights(callback,riskNodeId){
	framework.service.request('risknodeSelectRightService', 'find',riskNodeId, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//将已选择的数据权限存入数据库
function saveselectedRights(callback,selectedRights){
	framework.service.request('risknodeSelectRightService', 'update',selectedRights, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//清空权限
function deleteselectedRights(callback,risknodeId){
	framework.service.request('risknodeSelectRightService', 'deleteBynodeid',risknodeId, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}