Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.UploadCombPositionDetailService = function(){
	/*//加载页面，退出页面（点击退出）、上传成功时，清空临时表中的数据
	 this.deleteAllUploadCombPositionDetailSubForm = function(callback) {
	    framework.service.request('uploadCombPositionDetailService', 'deleteAllUploadCombPositionDetailSubForm',function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	 
	//获得导入的数据（临时表）
	 this.getAllUploadCombPositionDetailSubForm = function(callback) {
	  framework.service.request('uploadCombPositionDetailService', 'getAllUploadCombPositionDetailSubForm',function (errCode, errMsg, result) {
	      if (errCode > 0) {
	          layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	      }
	      if (callback !== undefined || callback != null) {
	          callback(result);
	      }
	  });
	}
	

	 //点击确认上传，根据资产类型，将数据写入对应的数据库 
	 this.confirmUploadCombPositionDetail = function(tradingDay,exchangeID,brokerID,callback) {
	    framework.service.request('uploadCombPositionDetailService', 'confirmUploadCombPositionDetail', tradingDay,exchangeID,brokerID,function (errCode, errMsg, result) {
	        if (callback !== undefined || callback != null) {
	            callback(errCode, errMsg, result);
	        }
	    });
	}*/
	 
	//获得导入的数据
	 this.getAllUploadCombPositionDetail = function(callback,exchID,tradingDay) {
	  framework.service.request('uploadCombPositionDetailService', 'getAllUploadCombPositionDetail',exchID,tradingDay,function (errCode, errMsg, result) {
	      if (errCode > 0) {
	          layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	      }
	      if (callback !== undefined || callback != null) {
	          callback(result);
	      }
	  });
	}
}
