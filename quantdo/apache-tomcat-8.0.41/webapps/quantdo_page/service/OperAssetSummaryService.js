function exportAllOperAssetFOFSummary(callback,entity,searchType) {
    framework.service.request('operAssetSummaryService', 'getExportData',entity,searchType, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function exportAllOperAssetMOMSummary(callback,entity) {
    framework.service.request('operAssetSummaryService', 'getMOMExportData',entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}