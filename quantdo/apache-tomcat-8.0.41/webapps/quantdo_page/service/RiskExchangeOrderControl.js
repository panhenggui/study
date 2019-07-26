/**
 * 交易所报单频率控制
 */
Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.RiskExchangeOrderControl = function(){	
	//查询
	this.getAllRiskExchangeOrderControl = function(brokerID,fundID,callback){
		framework.service.request('riskExchangeOrderControlService', 'getAllRiskExchangeOrderControl',brokerID,fundID, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.alert(errCode + ': ' + errMsg);
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	
	//保存
	this.saveRiskExchangeOrderControl = function(brokerID,entityList,callback){
		framework.service.request('riskExchangeOrderControlService', 'saveRiskExchangeOrderControl',brokerID,entityList, function (errCode, errMsg, result) {
	    	if (callback !== undefined || callback != null) {
	            callback(errCode, errMsg, result);
	        }
	    });	
	}
}