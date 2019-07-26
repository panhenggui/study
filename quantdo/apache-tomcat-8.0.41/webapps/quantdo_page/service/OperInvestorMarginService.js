Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.OperInvestorMarginService = function(){
	
	this.addToTrade = function(callback,operInvestorMargin){
		framework.service.request('operInvestorMarginService', 'addToTrade',operInvestorMargin, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errMsg,{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	};
	
	this.getfindAll = function(callback){
		framework.service.request('operInvestorMarginService', 'getfindAll', function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errMsg,{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	};
	
	this.findByQuery = function(callback,operInvestorMargin){
		framework.service.request('operInvestorMarginService', 'findByQuery', operInvestorMargin, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errMsg,{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	};
	
	this.findByAddInfo = function(callback,operInvestorMargin){
		framework.service.request('operInvestorMarginService', 'findByAddInfo', operInvestorMargin, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errMsg,{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	};
	
	this.updateToTrade = function(callback,operInvestorMargin){
		framework.service.request('operInvestorMarginService', 'updateToTrade', operInvestorMargin, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errMsg,{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	};
}
