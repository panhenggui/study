/**
 * 查询表中所有的数据
 */
/*
function getUserName(callback)
{
    framework.service.request('sysMonitorService', 'getSysAllStatus', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}*/
function getSysAllStatus(callback)
{
    framework.service.request('sysStatusService', 'getSysAllStatus', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });



}

 function getBusinessStatus(callback)
    {
        framework.service.request('sysStatusService', 'getBusinessStatus', function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errMsg,{icon: 2});
            }
            if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
}

 function getServerStatus(callback)
    {
        framework.service.request('sysStatusService', 'getServerStatus', function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errMsg,{icon: 2});
            }
            if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
}
