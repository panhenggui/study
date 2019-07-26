function getAllSeatEntity(callback) {
	framework.service.request('seatService', 'findAll', function(errCode, errMsg,
			result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}

// 修改交易通道信息
function updateSeatEntity(callback, entity) {
	framework.service.request('seatService', 'update', entity, function(errCode,
			errMsg, result) {
		if (errCode > 0) {
			console.error(errCode + ': ' + errMsg + '\n'
					+ JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}
// 经纪公司代码 和 交易所代码 查询出交易通道信息
function findSeatEntity(callback, entity) {
	framework.service.request('seatService', 'findByQuery', entity, function(
			errCode, errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}
// 添加交易通道
function saveSeatEntity(callback, entity) {
	framework.service.request('seatService', 'add', entity, function(errCode,
			errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}
//添加或者更改交易通道时候校验重复
function findSameSeatEntity(callback, entity) {
	framework.service.request('seatService', 'findSameSeatEntity', entity, function(errCode,
			errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}

//经纪公司代码 和 交易所代码 查询出交易通道信息
function findManySeatEntity(callback) {
	framework.service.request('seatService', 'findManySeatEntity', function(
			errCode, errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}

//添加或者更改交易通道时候校验ip地址
function checkIP(callback, ipAddress) {
	framework.service.request('seatService', 'ping', ipAddress, function(errCode,
			errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}

// 根据ID删除交易通道信息
function deleteSeat(id) {
	framework.service.request('seatService', 'delete', id, function(errCode,
			errMsg, result) {
		if (errCode > 0) {
			console.error(errCode + ': ' + errMsg + '\n'
					+ JSON.stringify(result));
		}
	});
}
function findAllBrokerageFirm(callback) {
	framework.service.request('seatService', 'findAllBrokerageFirm', function(errCode, errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
			}
			if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
}
