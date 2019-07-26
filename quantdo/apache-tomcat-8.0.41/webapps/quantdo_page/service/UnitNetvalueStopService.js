Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.UnitNetvalueStopService = function(){	
	this.findConditionByBrokerIDAndFundID = function(callback,fundID,brokerID){
	    framework.service.request('unitNetvalueStopService', 'findConditionByBrokerIDAndFundID',fundID, brokerID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.updateUnitNetvalueStop = function(callback,entity,brokerID){
	    framework.service.request('unitNetvalueStopService', 'updateUnitNetvalueStop',entity,brokerID, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg);
	            layer.closeAll('loading');
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.saveUnitNetvalueStop = function(callback,unitNetvalue,actionCode,fundID,brokerID,valueType,tagType,isSave){
		framework.service.request('unitNetvalueStopService', 'saveUnitNetvalueStop',unitNetvalue,actionCode,fundID,brokerID,valueType,tagType,isSave,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg);
	            layer.closeAll('loading');
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	
	this.deleteUnitNetvalueStop = function(callback,id,fundID,brokerID,isDelete){
		framework.service.request('unitNetvalueStopService', 'deleteUnitNetvalueStop',id,fundID,brokerID,isDelete,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	} 
	
	this.getStopLossAndWarnlevel = function(brokerID,fundID,callback){
		framework.service.request('unitNetvalueStopService', 'getStopLossAndWarnlevel',brokerID,fundID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	} 
	this.saveStopLossOrWarnLevel = function(entity,callback){
		framework.service.request('unitNetvalueStopService', 'saveStopLossOrWarnLevel',entity,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	} 
}
