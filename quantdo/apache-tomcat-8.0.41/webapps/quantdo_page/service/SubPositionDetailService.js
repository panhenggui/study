Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.SubPositionDetailService = function(){	
	this.findByQuery = function(callback,map){
	    framework.service.request('subPositionDetailService', 'findByQuery',map, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
}

function findSubPostionDetailByQuery(callback,subPositionDetail,searchType) {
    framework.service.request('subPositionDetailService', 'findSubPostionDetailByQuery', subPositionDetail, searchType, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}