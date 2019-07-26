Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.dataToTradeService = function(){
	
	this.generateTradeData = function(settleDate, callback){
	    framework.service.request('dataToTradeService', 'generateTradeData', settleDate, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) { 
	    		 //layer.msg (errCode + ': ' + errMsg + '\n',{icon: 2});
	    		 layer.confirm(errCode + ': ' + errMsg + '\n',{icon:2,btn:['关闭']});
	    		 callback(errCode);
	    	}else if (callback != undefined || callback != null) {
	             callback(errCode);
	        }
	    });		
	}
	
	this.checkUploadUniInstrument = function(settleDate, callback){
	    framework.service.request('dataToTradeService', 'checkUploadUniInstrument', settleDate,function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback != undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.getCurrDate = function(callback){
	    framework.service.request('sysCalendarService', 'getCurrDate', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback != undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}

	
	this.audit = function(callback){
	    framework.service.request('busAuditService', 'auditAfterToTrade', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback != undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
}