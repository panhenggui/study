Namespace.register("com.quantdo.orgClear.servicesyspecial");
com.quantdo.orgClear.servicesyspecial.leverageCalculatorService = function(){
	this.findCapitalAccount = function(callback,instClientID,fundProductID){
	    framework.service.request('leverageCalculatorService', 'findCapitalAccount', instClientID, fundProductID, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findBatch = function(callback){
	    framework.service.request('leverageCalculatorService', 'findBatch', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.resetPrincipal = function(callback){
	    framework.service.request('leverageCalculatorService', 'resetPrincipal', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.getAddPrincipal = function(callback,entity){
	    framework.service.request('leverageCalculatorService', 'getAddPrincipal', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.getAddInstrument = function(callback,entity){
	    framework.service.request('leverageCalculatorService', 'getAddInstrument', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.changeAddInstrument = function(callback,entity){
	    framework.service.request('leverageCalculatorService', 'changeAddInstrument', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.generateSubRule = function(callback,entity){
	    framework.service.request('leverageCalculatorService', 'generateSubRule', entity, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}

	this.addCalculator = function(callback,entitys,multiple,batch){
	    framework.service.request('leverageCalculatorService', 'addCalculator', entitys, multiple, batch, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.subCalculator = function(callback,entitys,multiple,batch){
	    framework.service.request('leverageCalculatorService', 'subCalculator', entitys, multiple, batch, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findAddResult = function(callback,batch,tradeDate,innerAccountID){
	    framework.service.request('leverageCalculatorService', 'findAddResult', batch, tradeDate, innerAccountID, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.findSubResult = function(callback,batch,tradeDate,innerAccountID){
	    framework.service.request('leverageCalculatorService', 'findSubResult', batch, tradeDate, innerAccountID, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.changeAddResultSendFlag = function(callback,entitys){
	    framework.service.request('leverageCalculatorService', 'changeAddResultSendFlag', entitys, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.changeSubResultSendFlag = function(callback,entitys){
	    framework.service.request('leverageCalculatorService', 'changeSubResultSendFlag', entitys, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg ,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}

	this.getCurrDate = function(callback){
	    framework.service.request('sysCalendarService','getCurrDate',function(errCode , errMsg , result){
	        if(errCode != 0 ){
	            layer.msg(errMsg , {icon: 2})
	        }else(callback != undefined || callback != null )
                callback(result);
	    })
	}
	
}

