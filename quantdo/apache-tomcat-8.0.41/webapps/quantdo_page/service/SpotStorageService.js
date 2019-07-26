Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.SpotStorageService = function(){
	
	this.findByQuery = function(callback,entity,startDate,endDate){
	    framework.service.request('spotStorageService', 'findByQuery', entity, startDate, endDate, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errMsg,{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}

    this.remove = function(callback,id){
        framework.service.request('spotStorageService', 'delete', id, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errMsg,{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback();
            }
        });
    }
    
}
