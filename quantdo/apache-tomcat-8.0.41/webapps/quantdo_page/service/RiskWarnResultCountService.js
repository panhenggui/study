//风控参数变更流水查询
Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.RiskWarnResultCountService = function(){
	//机构
	this.getAllInstClient = function(callback){
		framework.service.request('riskOperLogService', 'getAllInstClient', function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg);
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	//产品名称/资产单元
	this.getFundProductOrSubAccount = function(accInstClientID,accType,callback){
		framework.service.request('riskOperLogService', 'getFundProductOrSubAccount',accInstClientID,accType, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg);
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	//查询数据
	this.getRiskWarnResultSum = function(entity,callback){
		framework.service.request('riskStromDataService', 'getRiskWarnResultSum',entity.brokerageFirmID,entity.accType,entity.accId,entity.tplID,entity.begindate,entity.enddate, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg);
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	//tlp
	this.getAllTpl = function(accType,callback){
		framework.service.request('riskOperLogService', 'getAllTpl', accType,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg);
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
}