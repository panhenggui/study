Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.UploadSettleFileService = function(){
	//查询方法
	this.findByQuery = function(queryEntity,callback) {
		framework.service.request('uploadSettleFileService', 'findByQuery', queryEntity, function (errCode, errMsg, result) {
	    	if (errCode > 0) {
	        	layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	    	}
	    	if (callback !== undefined || callback != null) {
	    		callback(result);
	    	}
		});
	}
	
	this.checkTrade = function(callback) {
		framework.service.request('uploadSettleFileService', 'checkTrade', function (errCode, errMsg, result) {
	    	if (errCode > 0) {
	        	layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	    	}
	    	if (callback !== undefined || callback != null) {
	    		callback(result);
	    	}
		});
	}
}
