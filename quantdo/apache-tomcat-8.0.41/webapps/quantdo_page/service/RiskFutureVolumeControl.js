Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.RiskFutureVolumeControlService = function(){
	//获得下拉框数据
	 this.getProductList = function(brokerID,fundID,callback){
	        framework.service.request('riskFutureVolumeControlService','getProductList',brokerID,fundID,function (errCode, errMsg, result) {
	            if (errCode != 0) {
	                layer.msg(errCode + ': ' + errMsg);
	            }else if (callback !== undefined || callback != null) {
	                callback(result);
	            }
	        });
	    }
	 //保存
	 this.saveData = function(entity,callback){
	        framework.service.request('riskFutureVolumeControlService','saveData',entity,function (errCode, errMsg, result) {
	           if (callback !== undefined || callback != null) {
	                callback(errCode, errMsg, result);
	            }
	        });
	    }
	 
	 //查找
	 this.findData = function(brokerID,fundID,callback){
	        framework.service.request('riskFutureVolumeControlService','findData',brokerID,fundID,function (errCode, errMsg, result) {
	        	 if (errCode != 0) {
		                layer.msg(errCode + ': ' + errMsg);
		            }else if (callback !== undefined || callback != null) {
		                callback(result);
		            }
	        });
	    }
	 
	 //删除
	 this.deleteData = function(brokerID,entity,callback){
	        framework.service.request('riskFutureVolumeControlService','deleteData',brokerID,entity,function (errCode, errMsg, result) {
	        	 if (callback !== undefined || callback != null) {
		                callback(errCode, errMsg, result);
		            }
	        });
	    }
	 
	 //修改
	 this.updateData = function(listBrokerID,entity,callback){
	        framework.service.request('riskFutureVolumeControlService','updateData',listBrokerID,entity,function (errCode, errMsg, result) {
	           if (callback !== undefined || callback != null) {
	                callback(errCode, errMsg, result);
	            }
	        });
	    }
}