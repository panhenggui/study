Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.DefaultStockProductFeeSetService = function(){
	//初始化页面信息（进入页面的时候，获得下拉框信息）
	this.getPullDownDatas = function(callback) {
	    framework.service.request('defaultStockProductFeeSetService', 'getPullDownDatas', function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	//初始化页面信息（进入页面的时候，调用查询，获得所有的数据表格）
	this.getAllDefaultStockProductFeeSetData = function(callback) {
	    framework.service.request('defaultStockProductFeeSetService', 'findAllDefaultStockProductFeeSet', function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}


	/*//初始化页面信息（进入页面的时候，获得下拉框信息）
	this.getPullDownDatas = function(callback) {
	    framework.service.request('defaultStockProductFeeSetService', 'getPullDownDatas', function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}*/

	//进入MODAL时，初始化Modal页面下拉框
	this.getModalPullDownDatas = function(callback) {
	    framework.service.request('defaultStockProductFeeSetService', 'getModalPullDownDatas', function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}

	//查询功能
	this.findDefaultStockProductFeeSetEntity = function(callback, entity) {
	    framework.service.request('defaultStockProductFeeSetService', 'findDefaultStockProductFeeSetEntity', entity, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}

	//根据ID删除操作员信息
	this.deleteDefaultStockProductFeeSetEntity = function(callback,id) {
	    framework.service.request('defaultStockProductFeeSetService', 'deleteDefaultStockProductFeeSetEntity', id, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}


	//添加功能
	this.saveDefaultStockProductFeeSetEntity = function(callback, entity) {
		//console.log(entity);
	    framework.service.request('defaultStockProductFeeSetService', 'saveDefaultStockProductFeeSetEntity', entity, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}

	//修改功能
	this.updateDefaultStockProductFeeSetEntity = function(callback,entity) {
	    framework.service.request('defaultStockProductFeeSetService', 'updateDefaultStockProductFeeSetEntity', entity, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
}
