Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.StockAddInformationImportService = function(){
	/*//获得导入的数据
	 this.getAllStockAddInformationImport_TmpEntity = function(callback) {
	  framework.service.request('stockAddInformationImportService', 'getAllStockAddInformationImport_TmpEntity',function (errCode, errMsg, result) {
	      if (errCode > 0) {
	          layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	      }
	      if (callback !== undefined || callback != null) {
	          callback(result);
	      }
	  });
	}
	//加载页面，退出页面（点击退出）、上传成功时，清空临时表中的数据
	 this.deleteAllStockAddInformationImport_TmpEntity = function(callback) {
	    framework.service.request('stockAddInformationImportService', 'deleteAllStockAddInformationImport_TmpEntity',function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}

	//点击确认上传，根据资产类型，将数据写入对应的数据库 
	 this.getFundRiskIndexList = function(callback,capitalTypeID,brokerID) {
	    framework.service.request('stockAddInformationImportService', 'saveRealUpLoadExcelData',capitalTypeID,brokerID, function (errCode, errMsg, result) {
	        if (callback !== undefined || callback != null) {
	            callback(errCode, errMsg, result);
	        }
	    });
	}
*/
	/*//返回上传文件的类型 
	 this.getStockUploadData = function(callback) {
	    framework.service.request('stockAddInformationImportService', 'getStockUploadData',function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}*/
	
	//获得所属机构列表
	 this.getBrokerIDDatas =function(callback) {
	    framework.service.request('stockAddInformationImportService', 'getBrokerIDDatas',function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	 
	//返回主页面给的brokerID和CapitalType
	 this.giveBrokerIDAndCapitalType =function(capitalTypeID,callback) {
	    framework.service.request('stockAddInformationImportService', 'giveBrokerIDAndCapitalType',capitalTypeID,function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	} 
	 
	//查询股票
	 this.findStock = function(entity,callback) {
	  framework.service.request('stockAddInformationImportService', 'findStock',entity.capitalTypeID,function (errCode, errMsg, result) {
	      if (errCode > 0) {
	          layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	      }
	      if (callback !== undefined || callback != null) {
	          callback(result);
	      }
	  });
	}
	//查询基金
	 this.findfund = function(entity,callback) {
	  framework.service.request('stockAddInformationImportService', 'findfund',entity.capitalTypeID,function (errCode, errMsg, result) {
	      if (errCode > 0) {
	          layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	      }
	      if (callback !== undefined || callback != null) {
	          callback(result);
	      }
	  });
	}
	//查询债券
	 this.findBond = function(entity,callback) {
	  framework.service.request('stockAddInformationImportService', 'findBond',entity.capitalTypeID,function (errCode, errMsg, result) {
	      if (errCode > 0) {
	          layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	      }
	      if (callback !== undefined || callback != null) {
	          callback(result);
	      }
	  });
	}
}
