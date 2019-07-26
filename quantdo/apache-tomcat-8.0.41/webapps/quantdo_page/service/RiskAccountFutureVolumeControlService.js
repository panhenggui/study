Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.RiskAccountFutureVolumeControlService = function(){
	//获得品种下拉框数据
	 this.getProductList = function(brokerID,callback){
	        framework.service.request('riskAccountFutureVolumeControlService','getProductList',brokerID,function (errCode, errMsg, result) {
	            if (errCode != 0) {
	                layer.msg(errCode + ': ' + errMsg);
	            }else if (callback !== undefined || callback != null) {
	                callback(result);
	            }
	        });
	    }
	/* //获得资产单元下拉框数据
	 this.findAllSubAccount = function(brokerID,callback){
	        framework.service.request('riskAccountFutureVolumeControlService','findAllSubAccount',brokerID,function (errCode, errMsg, result) {
	            if (errCode != 0) {
	                layer.msg(errCode + ': ' + errMsg);
	            }else if (callback !== undefined || callback != null) {
	                callback(result);
	            }
	        });
	    }*/
	 //查找
	 this.findData = function(brokerID,callback){
	        framework.service.request('riskAccountFutureVolumeControlService','findData',brokerID,function (errCode, errMsg, result) {
	        	 if (errCode != 0) {
		                layer.msg(errCode + ': ' + errMsg);
		            }else if (callback !== undefined || callback != null) {
		                callback(result);
		            }
	        });
	    }
	 //保存
	 this.saveData = function(entity,callback){
	        framework.service.request('riskAccountFutureVolumeControlService','saveData',entity,function (errCode, errMsg, result) {
	           if (callback !== undefined || callback != null) {
	                callback(errCode, errMsg, result);
	            }
	        });
	    }
	 
	  //删除
	 this.deleteData = function(entity,callback){
	        framework.service.request('riskAccountFutureVolumeControlService','deleteData',entity,function (errCode, errMsg, result) {
	        	 if (callback !== undefined || callback != null) {
		                callback(errCode, errMsg, result);
		            }
	        });
	    }
	 
	 //修改
	 this.updateData = function(entity,callback){
	        framework.service.request('riskAccountFutureVolumeControlService','updateData',entity,function (errCode, errMsg, result) {
	           if (callback !== undefined || callback != null) {
	                callback(errCode, errMsg, result);
	            }
	        });
	    }
	 
	 //获得机构
	 this.getClientEntity = function(callback){
	        framework.service.request('riskAccountFutureVolumeControlService','getClientEntity',function (errCode, errMsg, result) {
	        	 if (errCode != 0) {
		                layer.msg(errCode + ': ' + errMsg);
		            }else if (callback !== undefined || callback != null) {
		                callback(result);
		            }
	        });
	    }
	//获得资产单元
	 this.getAllSubAccount = function(callback){
	        framework.service.request('riskAccountFutureVolumeControlService','getAllSubAccount',function (errCode, errMsg, result) {
	        	 if (errCode != 0) {
		                layer.msg(errCode + ': ' + errMsg);
		            }else if (callback !== undefined || callback != null) {
		                callback(result);
		            }
	        });
	    }
}