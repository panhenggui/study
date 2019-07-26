	function findDailySettleQuery(callback,settleDate,innerAccountID){
		framework.service.request('dailySettleQueryService', 'findDailySettleQuery',settleDate,innerAccountID, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	