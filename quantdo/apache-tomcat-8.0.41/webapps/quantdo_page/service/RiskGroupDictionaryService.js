Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.RiskGroupDictionaryService = function(){	
//	获取所有riskGroup
	this.findRiskGroup = function(callback){
		framework.service.request('riskGroupDictionaryService', 'findRiskGroup',function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
//	 获取持仓分母
	this.findDictionary = function(callback){
		framework.service.request('riskGroupDictionaryService', 'findDictionary',function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	
	//获得资产组合风控设置 资产范围为产品时的资产指标
	this.findDictionary4Product = function(callback){
		framework.service.request('riskGroupDictionaryService', 'findDictionary4Product',function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	
	//获得资产组合风控设置 --指标生效条件下拉框
	this.findDictionary4index = function(callback){
		framework.service.request('riskGroupDictionaryService', 'findDictionary4index',function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}

	//风控方式
	this.findDictionary4riskWay = function(callback){
		framework.service.request('riskGroupDictionaryService', 'findDictionary4riskWay',function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	
	//获得产品类型
	this.findDictionary4contractType = function(callback){
		framework.service.request('riskGroupDictionaryService', 'findDictionary4contractType',function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	
	//获得tpl
	this.getTpl = function(callback){
		framework.service.request('riskGroupDictionaryService', 'getTpl',function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	
	this.getTitlesByTableID = function(tableID,callback){
		framework.service.request('riskGroupDictionaryService', 'getTitlesByTableID',tableID,function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	
	//获得可以看到的基金产品
	this.getBrokerIDAndFundProductID = function(callback){
		framework.service.request('riskGroupDictionaryService', 'getBrokerIDAndFundProductID',function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	
	//获得产品风控设置树结构
	this.getFundProductZtree = function(callback){
		framework.service.request('riskGroupDictionaryService', 'getFundProductZtree',function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	
	//获得风控所有的菜单
	this.getRiskControlMenu = function(callback){
		framework.service.request('riskGroupDictionaryService', 'getRiskControlMenu',function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	
	//获得系统信息
	this.getSystemMessage = function(callback){
		framework.service.request('riskGroupDictionaryService', 'getSystemMessage',function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
}
