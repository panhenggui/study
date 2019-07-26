Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.PositionMarketProportionSetService = function(){	
	//初始化下拉框
	this.queryRiskGropAndDic = function(entity,brokerID,callback){
		framework.service.request('positionMarketProportionSetService', 'queryRiskGropAndDic',entity,brokerID, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
//	保存
	this.save = function(entity,brokerID,callback){
		framework.service.request('positionMarketProportionSetService', 'save',entity, brokerID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
//	查询
	this.findAllRiskFundProduct = function(entity,callback){
		framework.service.request('positionMarketProportionSetService', 'findAllRiskFundProduct',entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
//	查询通过产品ID
	this.findRiskFundProductByProductID = function(tipID,fundID,brokerID,callback){
		framework.service.request('positionMarketProportionSetService', 'findRiskFundProductByProductID',tipID,fundID, brokerID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
//	删除
	this.deletePostionOrMarket = function(entity,callback){
		framework.service.request('positionMarketProportionSetService', 'delete',entity, function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
//	修改
	this.updatePostionOrMarket = function(entity,brokerID,callback){
		framework.service.request('positionMarketProportionSetService', 'update',entity, brokerID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
}
