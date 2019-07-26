Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.RiskAccountFutureVarietySetService = function(){	
	this.saveRiskAccountFutureVarietySet = function(callback,entity){
	    framework.service.request('riskAccountFutureVarietySetService', 'saveRiskAccountFutureVarietySet',entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.querySubAccount = function(callback){
		framework.service.request('riskAccountFutureVarietySetService', 'findAllSubAccount',function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	this.updateRiskAccountFutureVarietySet = function(callback,entity){
	    framework.service.request('riskAccountFutureVarietySetService', 'updateRiskAccountFutureVarietySet',entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.query = function(callback,riskAccount,brokerID){
		framework.service.request('riskAccountFutureVarietySetService', 'findRiskAccountSetByBrokerIDAndRiskAccount',riskAccount,brokerID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	this.deleteRiskAccountFutureSet = function(callback,id){
		framework.service.request('riskAccountFutureVarietySetService', 'deleteRiskAccountFutureSet',id,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
}

//删除指定行
function deleteRow(r) {
	var i=r.parentNode.parentNode.rowIndex;
	document.getElementById('futureVarietiesRestriction_down_left_table').deleteRow(i);
}