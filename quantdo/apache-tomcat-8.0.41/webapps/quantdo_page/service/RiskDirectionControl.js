/**
 * 交易所报单频率控制
 */
Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.RiskDirectionControl = function(){	
	//查询
	this.findDirectionControlData = function(brokerID,fundID,callback){
		framework.service.request('riskDirectionControlService', 'findDirectionControlData',brokerID,fundID, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.alert(errCode + ': ' + errMsg);
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	
	//保存
	this.saveDirectionData = function(listBrokerID,entityList,callback){
		framework.service.request('riskDirectionControlService', 'saveDirectionData',listBrokerID,entityList, function (errCode, errMsg, result) {
	    	if (callback !== undefined || callback != null) {
	            callback(errCode, errMsg, result);
	        }
	    });	
	}
}