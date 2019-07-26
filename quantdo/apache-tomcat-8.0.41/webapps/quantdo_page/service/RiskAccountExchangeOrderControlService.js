/**
 * 交易所报单频率控制
 */
Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.RiskAccountExchangeOrderControlService = function(){
	/*//获得下拉框数据
	this.findAllSubAccount = function(brokerID,callback){
		framework.service.request('riskAccountExchangeOrderControlService', 'findAllSubAccount',brokerID, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg);
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}*/
	//查询
	this.getAllRiskAccountExchangeOrderControl = function(brokerID,subAccountID,callback){
		framework.service.request('riskAccountExchangeOrderControlService', 'getAllRiskAccountExchangeOrderControl',brokerID,subAccountID, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg);
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	
	//保存
	this.saveRiskAccountExchangeOrderControl = function(entityList,callback){
		framework.service.request('riskAccountExchangeOrderControlService', 'saveRiskAccountExchangeOrderControl',entityList, function (errCode, errMsg, result) {
	    	if (callback !== undefined || callback != null) {
	            callback(errCode, errMsg, result);
	        }
	    });	
	}
}