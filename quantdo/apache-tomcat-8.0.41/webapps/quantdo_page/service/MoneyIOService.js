Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.MoneyIOService = function(){	
	this.findByCondition = function(entity,callback){
	    framework.service.request('moneyIOService', 'findByCondition',entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
}
