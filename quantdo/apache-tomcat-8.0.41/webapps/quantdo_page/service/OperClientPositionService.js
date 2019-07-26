Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.OperClientPositionService = function(){
	this.findByCondition = function(entity,callback){
		framework.service.request('operClientPositionService', 'findByCondition',entity, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
}
function findOperClientPositionAll(callback){
	framework.service.request('operClientPositionService', 'findAll', function (errCode, errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}

function findOperClientPositionAllTwo(callback,operClientPosition){
	framework.service.request('operClientPositionService', 'findAllByAccountId',operClientPosition, function (errCode, errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}
function findAllAccountByAccountIdOrGroupId(investorId,groupId,brokerID){
	var dtd = $.Deferred();
	var mytables = sessionStorage.mytables.split(",");
	if(sessionStorage.initFlag){
		framework.service.request('operClientPositionService', 'findAllByAccountIdOrGroupId',investorId,groupId,brokerID, function (errCode, errMsg, result) {
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
		if ("#currentPosition_table" == mytables[i]) {
			framework.service.request('operClientPositionService', 'findAllByAccountIdOrGroupId',investorId,groupId, function (errCode, errMsg, result) {
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

function findOperClientPositionByAccountGroupId(callback,operClientPosition){
	framework.service.request('operClientPositionService', 'findAllByAccountGroupId',operClientPosition, function (errCode, errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}

function findByBroAndAccountID(callback,operClientPosition){
		framework.service.request('operClientPositionService', 'findByBroAndAccountID',operClientPosition, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	function findOperClientPositionAllCapitalByQuery(callback,operClientPosition,instClientID){
		framework.service.request('operClientPositionService', 'findAllCapitalByQuery',operClientPosition, instClientID, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	function findOperClientPositionAllTraderByQueryCondition(callback,operClientPosition){
		framework.service.request('operClientPositionService', 'findAllTraderByQueryOfRisk',operClientPosition, function (errCode, errMsg, result) {
			if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
		});
	}
	function findOperClientPositionAllTraderByQuery(callback,operClientPosition,instClientID){
		framework.service.request('operClientPositionService', 'findAllTraderByQuery',operClientPosition,instClientID, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}

//�ֲֲ�ѯͶ����������
function findAllUserAccountByUserId(callback){
	framework.service.request('operClientPositionService', 'findAllUserAccountByUserId', function (errCode, errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}

function riskFindAllInvestorID(brokerID,callback){
	framework.service.request('operClientPositionService', 'riskFindAllInvestorID',brokerID, function (errCode, errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}

function findAllOperClientPositionByQueryInMapper(operClient,requestParams,orderType,orderWay,callback){
	framework.service.request('operClientPositionService', 'findAllOperClientPositionByQueryInMapper',operClient,requestParams,orderType,orderWay, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findAllComOperClientPositionByQueryInMapper(operClient,requestParams,orderType,orderWay,callback){
	framework.service.request('operClientPositionService', 'findAllComOperClientPositionByQueryInMapper',operClient,requestParams,orderType,orderWay, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}



function exportExcelOCP(callback,operClient){
	framework.service.request('operClientPositionService', 'exportExcelOCP',operClient, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function exportExcelCOCP(callback,operClient){
	framework.service.request('operClientPositionService', 'exportExcelCOCP',operClient, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}



function totalOperClientPos(operClient,callback){
	framework.service.request('operClientPositionService', 'totalOperClientPos',operClient, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function totalComOperClientPos(operClient,callback){
	framework.service.request('operClientPositionService', 'totalComOperClientPos',operClient, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getAllInstClient(callback){
	framework.service.request('operClientPositionService', 'getAllInstClient', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
