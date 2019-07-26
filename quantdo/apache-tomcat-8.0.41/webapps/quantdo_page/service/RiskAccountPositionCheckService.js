//资产单元持仓核对(MOM)
Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.RiskAccountPositionCheckService = function(){
	//获得持仓
	this.getSysPosition = function(callback){
		framework.service.request('riskAccountPositionCheckService', 'getSysPosition',function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg);
	            layer.closeAll('loading');
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });	
	}
	
}