
function getTest() {
	framework.service.request('riskStromDataService', 'transferOldRiskParamToNewParamById',"","", function (errCode, errMsg, result) {
        if (errCode > 0) {
            alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}