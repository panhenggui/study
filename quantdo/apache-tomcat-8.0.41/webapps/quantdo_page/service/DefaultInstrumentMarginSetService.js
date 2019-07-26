function getAllDefaultInstrumentMarginSet(callback) {
	framework.service.request('defaultInstrumentMarginSetService', 'findAll',
			function(errCode, errMsg, result) {
				if (errCode > 0) {
					layer.msg(errCode + ': ' + errMsg + '\n'
							+ JSON.stringify(result));
				}
				if (callback !== undefined || callback != null) {
					callback(result);
				}
			});
}

// 修改默认合约保证金
function updateDefaultInstrumentMarginSet(callback, entity) {
	framework.service.request('defaultInstrumentMarginSetService', 'update',
			entity, function(errCode, errMsg, result) {
				if (errCode > 0) {
					console.error(errCode + ': ' + errMsg + '\n'
							+ JSON.stringify(result));
				}
				if (callback !== undefined || callback != null) {
					callback(result);
				}
			});
}
// 条件查询默认合约保证金
function findByDefaultInstrumentMarginSet(callback, entity) {
	framework.service.request('defaultInstrumentMarginSetService', 'findByQuery',
			entity, function(errCode, errMsg, result) {
				if (errCode > 0) {
					layer.msg(errCode + ': ' + errMsg + '\n'
							+ JSON.stringify(result));
				}
				if (callback !== undefined || callback != null) {
					callback(result);
				}
			});
}
// 添加默认合约保证金
function savedefaultInstrumentMarginSet(callback, entity) {
	framework.service.request('defaultInstrumentMarginSetService', 'add', entity,
			function(errCode, errMsg, result) {
				if (errCode > 0) {
					layer.msg(errCode + ': ' + errMsg + '\n'
							+ JSON.stringify(result));
				}
				if (callback !== undefined || callback != null) {
					callback(result);
				}
			});
}

// 根据ID删除默认合约保证金信息
function deletedefaultInstrumentMarginSet(id) {
	framework.service.request('defaultInstrumentMarginSetService', 'delete', id,
			function(errCode, errMsg, result) {
				if (errCode > 0) {
					console.error(errCode + ': ' + errMsg + '\n'
							+ JSON.stringify(result));
				}
			});
}
// 批量删除
function deleteListsdefaultInstrumentMarginSet(callback,entitys) {
	framework.service.request('defaultInstrumentMarginSetService', 'deleteLists',
			entitys, function(errCode, errMsg, result) {
				if (errCode > 0) {
					console.error(errCode + ': ' + errMsg + '\n'
							+ JSON.stringify(result));
				}
				if (callback !== undefined || callback != null) {
		            callback();
		        }
			});
}
