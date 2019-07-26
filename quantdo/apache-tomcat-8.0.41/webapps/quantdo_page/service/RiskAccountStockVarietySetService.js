Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.RiskAccountStockVarietySetService = function(){	
	this.saveRiskAccountStockVarietySet = function(callback,entity){
	    framework.service.request('riskAccountStockVarietySetService', 'saveRiskAccountStockVarietySet',entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.querySubAccount = function(callback){
		framework.service.request('riskAccountStockVarietySetService', 'findAllSubAccount',function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	this.updateRiskAccountStockVarietySet = function(callback,entity){
	    framework.service.request('riskAccountStockVarietySetService', 'updateRiskAccountStockVarietySet',entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.query = function(callback,riskAccount,brokerID){
		framework.service.request('riskAccountStockVarietySetService', 'findRiskAccountSetByBrokerIDAndRiskAccount',riskAccount,brokerID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	this.deleteRiskAccountStockSet = function(callback,id){
		framework.service.request('riskAccountStockVarietySetService', 'deleteRiskAccountStockeSet',id,function (errCode, errMsg, result) {
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