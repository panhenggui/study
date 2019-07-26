Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.FofriskPositionDistributionService = function(){
	//持仓分布--获得所有产品组名称
	this.getProductGroupByBrokerID = function(brokerID,callback){
		framework.service.request('fofriskPositionDistributionService', 'getProductGroupByBrokerID',brokerID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(errCode, errMsg, result);
	        }
	    });	
	};
	
	//持仓分布--获得初始化数据
	this.getAllData = function(brokerID,callback){
		framework.service.request('fofriskPositionDistributionService', 'getAllData',brokerID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(errCode, errMsg, result);
	        }
	    });	
	};
	
	//持仓分布--获得初始化数据
	this.getDataByQuery = function(brokerID,fundGroupID,instrumentID_productID,updateTime,callback){
		framework.service.request('fofriskPositionDistributionService', 'getDataByQuery',brokerID,fundGroupID,instrumentID_productID,updateTime,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(errCode, errMsg, result);
	        }
	    });	
	};
	
}