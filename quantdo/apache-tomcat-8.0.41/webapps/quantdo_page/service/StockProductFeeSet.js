Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.StockProductFeeSetService = function(){

	//初始化页面信息（进入页面的时候，调用查询，获得所有的数据表格）
	this.getAllStockProductFeeSetData = function(callback) {
	    framework.service.request('stockProductFeeSetService', 'getAllStockProductFeeSetData', function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}


	//初始化页面信息（进入页面的时候，获得下拉框信息）
	this.getPullDownDatas = function(callback) {
	    framework.service.request('stockProductFeeSetService', 'getPullDownDatas', function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}

	//进入MODAL时，初始化Modal页面下拉框
	this.getModalPullDownDatas = function(callback) {
	    framework.service.request('stockProductFeeSetService', 'getModalPullDownDatas', function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}

	//查询功能
	this.findStockProductFeeSetEntity = function(callback, entity) {
	    framework.service.request('stockProductFeeSetService', 'findStockProductFeeSetEntity', entity, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}

	//根据ID删除操作员信息
	this.deleteStockProductFeeSetEntity = function(callback,id) {
	    framework.service.request('stockProductFeeSetService', 'deleteStockProductFeeSetEntity', id, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}


	//添加功能
	this.saveStockProductFeeSetEntity = function(callback, entity) {
	    framework.service.request('stockProductFeeSetService', 'saveStockProductFeeSetEntity', entity, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}

	//修改功能
	this.updateStockProductFeeSetEntity = function(callback,entity) {
	    framework.service.request('stockProductFeeSetService', 'updateStockProductFeeSetEntity', entity, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
}
