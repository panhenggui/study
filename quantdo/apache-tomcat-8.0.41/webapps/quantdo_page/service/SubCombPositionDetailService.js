Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.SubCombPositionDetailService = function(){
	//查询机构
	this.findInstClient = function(callback){
	    framework.service.request('subCombPositionDetailService', 'findInstClients', function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	//初始化资金账号
	this.getAllExchanges = function(callback) {
	    framework.service.request('subCombPositionDetailService', 'findAll', function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	//初始化资金账号
	this.findInnerAccount = function(entity,callback){
	    framework.service.request('subCombPositionDetailService', 'findInnerAccount',entity,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	//查询
	this.findByQuery = function(entity,callback){
	    framework.service.request('subCombPositionDetailService', 'findByQuery',entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
}
