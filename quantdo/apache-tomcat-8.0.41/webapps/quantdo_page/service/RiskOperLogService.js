//风控参数变更流水查询
Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.RiskOperLogService = function(){
	//查询数据
	this.getRiskOperLogList = function(entity,callback){
		framework.service.request('riskOperLogService', 'getRiskOperLogList',entity.accInstClientID,entity.menuId,entity.accType,entity.accId,entity.operUserId,entity.begindate,entity.enddate, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg);
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
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
	this.getFundProductOrSubAccount2 = function(accInstClientID,accType,userID,callback){
		framework.service.request('riskOperLogService', 'getFundProductOrSubAccount2',accInstClientID,accType,userID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg);
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	//产品名称/资产单元
	this.getFundProductOrSubAccount2 = function(accInstClientID,accType,callback){
		framework.service.request('riskOperLogService', 'getFundProductOrSubAccount2',accInstClientID,accType,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg);
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	//风控参数
	this.getRiskIndexTplDict = function(accType,callback){
		framework.service.request('riskOperLogService', 'getRiskIndexTplDict', accType,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg);
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	//变更人员
	this.getAllUser = function(brokerID,callback){
		framework.service.request('riskOperLogService', 'getAllUser',brokerID, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg);
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
}