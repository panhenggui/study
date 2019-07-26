Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.HisInvestorAccountService = function(){	
	this.findBySubAccountIdAndAccountId = function(callback,map){
	    framework.service.request('hisInvestorAccountService', 'findBySubAccountIdAndAccountId',map, function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}

}

function findAllHisAccountByQueryInMapper(entity,requestParams,orderType,orderWay,callback){
	framework.service.request('hisInvestorAccountService', 'findAllHisAccountByQueryInMapper',entity,requestParams,orderType,orderWay, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function exportExcelHIA(callback,operClient){
	framework.service.request('hisInvestorAccountService', 'exportExcelHIA',operClient, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function totalHisCapitalReport(operClient,callback){
	framework.service.request('hisInvestorAccountService', 'totalHisCapitalReport',operClient, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

