Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.FutureVarietiesRestrictionService = function(){	
	this.saveFutureVarietiesRestriction = function(callback,entity,brokerID){
	    framework.service.request('futureVarietiesRestrictionService', 'saveFutureVarietiesRestriction',entity, brokerID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
	
	this.updateFutureVarietiesRestriction = function(callback,entity,brokerID){
	    framework.service.request('futureVarietiesRestrictionService', 'updateFutureVarietiesRestriction',entity, brokerID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}
		
	this.queryFutureVarietiesRestriction = function(callback,fundID,listBrokerID){
		framework.service.request('futureVarietiesRestrictionService', 'findFutureVarietiesRestrictionIndexByBrokerIDAndFundID',fundID,listBrokerID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	this.getFutureControlCapitalType = function(capitalTypeID,brokerID,callback){
		framework.service.request('futureVarietiesRestrictionService', 'getFutureControlCapitalType',capitalTypeID,brokerID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	this.deleteVarietiesRestrictionService = function(callback,id){
		framework.service.request('futureVarietiesRestrictionService', 'deleteVarietiesRestrictionService',id,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
}

//删除指定行
function deleteRow(r) {
	var i=r.parentNode.parentNode.rowIndex;
	document.getElementById('futureVarietiesRestriction_down_left_table').deleteRow(i);
}