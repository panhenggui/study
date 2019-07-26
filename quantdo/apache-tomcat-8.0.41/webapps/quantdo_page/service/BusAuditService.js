Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.BusAuditService = function(){	
	this.auditBefore = function(callback){
	    framework.service.request('busAuditService', 'auditBeforeOpen', function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.auditIntra = function(callback){
	    framework.service.request('busAuditService', 'auditIntraDay', function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
}

