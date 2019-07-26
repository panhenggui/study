	function findOperTradeByQuery(callback,operTrade){
		framework.service.request('operTradeService', 'findByQuery',operTrade, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	function findOperTradeBySubQuery(callback,operTrade){
		framework.service.request('operTradeService', 'findOperTradeBySubQuery',operTrade, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}

	function findOperTradeAllCapitalByQuery(callback,operTrade){
		framework.service.request('operTradeService', 'findAllCapitalByQuery',operTrade, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}

	//�����ʽ��˺Ż����
	function findAllCapitalByQueryByAccountIdOrGroupId(investorId,groupId,myflag,brokerID){
		var dtd = $.Deferred();
		var mytables = sessionStorage.mytables.split(",");
		if(sessionStorage.initFlag){
			framework.service.request('operTradeService', 'findAllCapitalByQueryByAccountIdOrGroupId',investorId,groupId,myflag,brokerID, function (errCode, errMsg, result) {
				if (errCode > 0) {
					layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
					dtd.reject(errCode,errMsg);
				}
				//if (callback !== undefined || callback != null) {
				//	callback(result);
				//}
				dtd.resolve(result);
			});
			return dtd;
		}
		for(var i=0;i<mytables.length;i++){
			if("#traderDetail_table" == mytables[i]){
				framework.service.request('operTradeService', 'findAllCapitalByQueryByAccountIdOrGroupId',investorId,groupId,myflag,brokerID, function (errCode, errMsg, result) {
					if (errCode > 0) {
						layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
						dtd.reject(errCode,errMsg);
					}
					//if (callback !== undefined || callback != null) {
					//	callback(result);
					//}
					dtd.resolve(result);
				});
				return dtd;
			}
		}

	}

	//�����ʽ��˺ŷ����������
	function findOperTradeAllCapitalByAccountGroupId(callback,operTrade){
		framework.service.request('operTradeService', 'findAllCapitalByQueryByAccountGroupId',operTrade, function (errCode, errMsg, result) {
			if (errCode > 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
			}
			if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
	
	function findOperTradeAllTraderByQuery(callback,operTrade){
		framework.service.request('operTradeService', 'findAllTraderByQuery',operTrade, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	function findAllByQueryInMapper(operTrade,requestParams,orderType,orderWay,callback){
		framework.service.request('operTradeService', 'findAllByQueryInMapper',operTrade,requestParams,orderType,orderWay, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	function exportExcelOT(callback,operClient){
		framework.service.request('operTradeService', 'exportExcelOT',operClient, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	