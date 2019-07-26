Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.HisPositionReportService = function() {
	this.backPagingHisPositionReport = function(entity, callback){
		 framework.service.request('hisPositionReportService', 'backPagingHisPositionReport', entity,function (errCode, errMsg, result) {	        
		    	if (errCode != 0) {            
		            layer.msg(errCode + ': ' + errMsg + '\n' ,{icon: 2});
		    	}else if (callback !== undefined || callback != null) {
		            callback(result);
		        }
		    });	
	}
	// 制图
	this.findHisPositionReportChart = function(callback,entity){
		framework.service.request('hisPositionReportService', 'findHisPositionReportChart', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	
	this.isSettled = function(settleDate,callback){
		framework.service.request('hisPositionReportService', 'isSettled', settleDate, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
}
