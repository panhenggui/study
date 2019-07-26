Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.PortfolioRiskControlSetService = function(){	
//	获取所有riskGroup
	this.findRiskGroup = function(brokerID,fundID,callback){
		framework.service.request('portfolioRiskControlSetService', 'findRiskGroup',brokerID,fundID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	};
	this.savePortfolioRiskControlSet = function(entity,brokerID,callback){
		framework.service.request('portfolioRiskControlSetService', 'savePortfolioRiskControlSet',entity,brokerID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	};
	this.findRiskIndexSet = function(fundID,brokerID,callback){
		framework.service.request('portfolioRiskControlSetService', 'findRiskIndexSet',fundID,brokerID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	};
//	删除操作
	this.delRiskIndexSet = function(entity,callback){
		framework.service.request('portfolioRiskControlSetService', 'deleteRiskIndexSet',entity,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	};
	this.updateRiskIndexSet = function(entity,brokerID,callback){
		framework.service.request('portfolioRiskControlSetService', 'updateRiskIndexSet',entity,brokerID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	};
}
