Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.hisPositionQueryService = function(){
	this.findByCondition = function(entity, requestParams, orderType, orderWay, callback){
		framework.service.request('hisPositionService', 'findAllHisPositionByQueryInMapper', entity, requestParams, orderType, orderWay, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
	
	/*this.findComByCondition = function(entity, requestParams, orderType, orderWay, callback){
		framework.service.request('hisPositionService', 'findComByCondition', entity, requestParams, orderType, orderWay, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}*/

	
	this.totalHisClientPos = function(operClient,callback){
		framework.service.request('hisPositionService', 'totalHisClientPos', operClient, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
	

	
	this.totalComHisClientPos = function(operClient,callback){
		framework.service.request('hisPositionService', 'totalComHisClientPos', operClient, function (errCode, errMsg, result) {
			if (errCode != 0) {
				layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
			}else if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}	
}


function findComByCondition(operClient,requestParams,orderType,orderWay,callback){
	framework.service.request('hisPositionService', 'findComByCondition',operClient,requestParams,orderType,orderWay, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function totalComHisClientPos(operClient,callback){
	framework.service.request('hisPositionService', 'totalComHisClientPos',operClient, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

