Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.OperWFOrderService = function(){
    this.findOperWFOrderByCapital =function  (entity,requestParams,orderType,orderWay,callback){
        framework.service.request('operWFOrderService', 'findByCapital',entity,requestParams,orderType,orderWay, function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
            }
            if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

    this.totleOperOrder= function(hisTrade,callback){
            framework.service.request('operWFOrderService', 'totleOperOrder',hisTrade, function (errCode, errMsg, result) {
                if (errCode > 0) {
                    layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                }
                if (callback !== undefined || callback != null) {
                    callback(result);
                }
            });
        }



}

	function findOperWFOrderBySubAccount(callback,operOrder){
		framework.service.request('operWFOrderService', 'findBySubAccount',operOrder, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	/**
	 * 查询方式=关联查询，则 报单编号 必填
	 * 查询方式=关联查询，输出 报单编号=输入报单编号 or子报单编号=输入报单编号 的所有记录
	 * 投顾查系统编号，资金账号查子报单号
	 */
	function findByQueryOperWFOrderSysID(callback,operOrder){
		framework.service.request('operWFOrderService', 'findByQuerySysID',operOrder, function (errCode, errMsg, result) {
			if (errCode > 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
			}
			if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
	
	
	function exportExcelOWFOCap(callback,operClient){
		framework.service.request('operWFOrderService', 'exportExcelOWFOCap',operClient, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	function exportExcelOWFOSubCap(callback,operClient){
		framework.service.request('operWFOrderService', 'exportExcelOWFOSubCap',operClient, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
