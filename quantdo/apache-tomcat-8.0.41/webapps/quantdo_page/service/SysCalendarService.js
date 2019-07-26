
function getNextTradeDate(tradeDate, callback) {
	
	framework.service.request('sysCalendarService', 'getNextTradeDate', tradeDate, function (errCode, errMsg, result) {
        if (errCode > 0) {
            console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
            //layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
        }
        
        if (callback !== undefined || callback != null) {        	
            callback(errCode, errMsg, result);
        }

    });
}