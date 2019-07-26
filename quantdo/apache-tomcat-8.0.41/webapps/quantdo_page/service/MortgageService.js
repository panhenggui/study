Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.MortgageService = function(){
	
	this.findByQuery = function(callback,entity,startDate,endDate){
	    framework.service.request('mortgageService', 'findByQuery', entity, startDate, endDate, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}

    this.findByAddInfo = function(callback,entity){
        framework.service.request('mortgageService', 'findByAddInfo', entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.add = function(callback,entity){
        framework.service.request('mortgageService', 'add', entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.update = function(callback,entity){
        framework.service.request('mortgageService', 'update', entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.remove = function(callback,id){
        framework.service.request('mortgageService', 'delete', id, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback();
            }
        });
    }
    
    this.findDistinctMortgageID = function(callback){
        framework.service.request('mortgageService', 'findDistinctMortgageID', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
    
    this.getCurrentTradingDate = function(callback){
        framework.service.request('mortgageService', 'getCurrentTradingDate', function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }
}
