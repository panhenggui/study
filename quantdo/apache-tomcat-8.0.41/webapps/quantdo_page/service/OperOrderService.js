Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.OperOrderService = function(){
	this.findAllOperOrder = function(callback,traderID){
		framework.service.request('operOrderService', 'findAllByAccountId',traderID, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	};
	this.findAllOperOrderByAccountGroupId = function(callback,groupId){
		//console.log(groupId);
		framework.service.request('operOrderService', 'findAllByAccountGroupId',groupId, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	};
}
	/**
	 * 查询方式=投顾账号，则 投顾账号、合约代码、报单状态可输入,	查询方式=投顾账号，只输出‘投资者类型'为2的报单记录
	 * 查询方式=资金账号，则 资金账号、合约代码、报单状态可输入,	查询方式=资金账号，只输出‘投资者类型'为1的报单记录
	 */
	function findByQueryOperOrderAccount(callback,operOrder){
		framework.service.request('operOrderService', 'findByQueryAccount',operOrder, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}

//根据资金账号或组号
function findAllOrderByAccountIdOrGroupId(investorId,groupId,myflag,brokerID){
	var dtd = $.Deferred();
	var mytables = sessionStorage.mytables.split(",");
	if(sessionStorage.initFlag){
		framework.service.request('operOrderService', 'findAllByAccountIdOrGroupId',investorId,groupId,myflag,brokerID, function (errCode, errMsg, result) {
			if (errCode > 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
				dtd.reject(errCode,errMsg);
			}
			dtd.resolve(result);
			//if (callback !== undefined || callback != null) {
			//	callback(result);
			//}
		});
		return dtd;
	}

	for(var i=0;i<mytables.length;i++) {
		if ("#allOrders_table" == mytables[i]) {
			framework.service.request('operOrderService', 'findAllByAccountIdOrGroupId',investorId,groupId,myflag, function (errCode, errMsg, result) {
				if (errCode > 0) {
					layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
					dtd.reject(errCode,errMsg);
				}
				dtd.resolve(result);
				//if (callback !== undefined || callback != null) {
				//	callback(result);
				//}
			});
			return dtd;
		}
	}

}

	/**
	 * 查询方式=关联查询，则 报单编号 必填
	 * 查询方式=关联查询，输出 报单编号=输入报单编号 or子报单编号=输入报单编号 的所有记录
	 * 投顾查系统编号，资金账号查子报单号
	 */
	function findByQueryOperOrderSysID(callback,operOrder){
		framework.service.request('operOrderService', 'findByQuerySysID',operOrder, function (errCode, errMsg, result) {
			if (errCode > 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
			}
			if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
	//资金账号 查询全部
	function findOperOrderAllCapitalByQuery(callback,operOrder){
		framework.service.request('operOrderService', 'findCapitalInfosByQuery',operOrder, function (errCode, errMsg, result) {
			if (errCode > 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
			}
			if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
	//投顾账号 查询全部
	function findOperOrderAllTraderByQuery(callback,operOrder){
		framework.service.request('operOrderService', 'findAllTraderByQuery',operOrder, function (errCode, errMsg, result) {
			if (errCode > 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
			}
			if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
	

	function findAllOperOrderQueryInMapper(operOrderInsertFailed,requestParams,orderType,orderWay,callback){
		framework.service.request('operOrderService', 'findAllOperOrderQueryInMapper',operOrderInsertFailed,requestParams,orderType,orderWay, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	

	function exportExcelOO(callback,operClient){
		framework.service.request('operOrderService', 'exportExcelOO',operClient, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}


	
