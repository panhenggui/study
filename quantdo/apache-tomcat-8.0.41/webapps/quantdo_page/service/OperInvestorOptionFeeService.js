Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.OperInvestorOptionFeeService = function(){
	
	this.addToTrade = function(callback,operInvestorFee){
		framework.service.request('operInvestorOptionFeeService', 'addToTrade',operInvestorFee, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errMsg,{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	};
	
	this.getfindAll = function(callback){
		framework.service.request('operInvestorOptionFeeService', 'getfindAll', function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errMsg,{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	};
	
	this.findByQuery = function(callback,operInvestorFee){
		framework.service.request('operInvestorOptionFeeService', 'findByQuery', operInvestorFee, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errMsg,{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	};
	
	this.findByAddInfo = function(callback,operInvestorFee){
		framework.service.request('operInvestorOptionFeeService', 'findByAddInfo', operInvestorFee, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errMsg,{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	};
	
	this.updateToTrade = function(callback,operInvestorFee){
		framework.service.request('operInvestorOptionFeeService', 'updateToTrade', operInvestorFee, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errMsg,{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	};
}

