
/**
 * 查询操作员
 */
function getUserName(callback)
{
    framework.service.request('queryIndexMenuPermissionService', 'getUserName', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
/**
 * 查询操作员
 */
function findSystemResponse(serverId,callback)
{
    framework.service.request('monitorService', 'findSystemResponse',serverId.toString() , function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
/**
 * 查询服务器图表信息
 * @param serverId
 * @param type
 * @param callback
 */
function findServerPicInfo(serverId,type,callback)
{
    framework.service.request('monitorService', 'findServerPicInfo',serverId.toString(),type.toString(), function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
/**
 * 获取服务器配置信息
 * @param serverId
 * @param type
 * @param callback
 */
function getServerInfo(callback)
{
    framework.service.request('monitorService', 'getServerInfo', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
/**
 * 获取进程CPU使用率
 * @param serverId
 * @param type
 * @param callback
 */
function findproCpuPicInfo(serverId,processID,callback)
{
    framework.service.request('monitorService', 'findproCpuPicInfo',serverId,processID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
/**
 * 获取进程内存占用
 * @param serverId
 * @param type
 * @param callback
 */
function findproMemoryPicInfo(serverId,processID,callback)
{
    framework.service.request('monitorService', 'findproMemoryPicInfo',serverId,processID,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
/**
 * 获取服务器详细信息
 * @param callback
 */
function getAllInfo(callback)
{
    framework.service.request('monitorService', 'getAllInfo', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
/**
 * 获取磁盘使用率详情
 * @param serverId
 * @param filePath
 * @param callback
 */
function findDiscPicInfo(serverId,filePath,callback)
{
    framework.service.request('monitorService', 'findDiscPicInfo',serverId,filePath, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function updateServerValue(cpuValue,memoryValue,speedValue,serverID,callback)
{
    framework.service.request('monitorService', 'updateServerValue',cpuValue,memoryValue,speedValue,serverID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function updateDiscValue(discValue,serverID,filePath,callback)
{
    framework.service.request('monitorService', 'updateDiscValue',discValue,serverID,filePath, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
/**
 * 获取进程开始运行时间
 * @param serverId
 * @param processID
 * @param callback
 */
function findProcessStartTime(serverId,processID,callback)
{
    framework.service.request('monitorService', 'findProcessStartTime',serverId,processID, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
/**
 * 查询全部席位信息
 * @param callback
 */
function getAllSeatInfo(callback)
{
    framework.service.request('monitorService', 'getAllSeatInfo', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function searchSyncApiId(serverIP,userName,password,logPath,callback)
{
    framework.service.request('sysMonitorService', 'searchSyncApiId',serverIP,userName,password,logPath, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

