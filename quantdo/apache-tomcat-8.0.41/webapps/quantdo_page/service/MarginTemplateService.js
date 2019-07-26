function getAllMarginTemplate(callback) {
	framework.service.request('marginTemplateService', 'findAll', function(errCode, errMsg,
			result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}

// 修改保证金模板
function updateMarginTemplate(callback, entity) {
	framework.service.request('marginTemplateService', 'update', entity, function(errCode,
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
//模板名称修改保证金模板信息
function findByMarginTemplate(callback, templateName) {
	framework.service.request('marginTemplateService', 'findByMarginTemplate', templateName, function(
			errCode, errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}
// 添加保证金模板
function saveMarginTemplate(callback, entity) {
	framework.service.request('marginTemplateService', 'add', entity, function(errCode,
			errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}

// 根据ID删除保证金模板
function deleteMarginTemplate(callback,id) {
	framework.service.request('marginTemplateService', 'delete', id, function(errCode,errMsg, result) {
		if (errCode > 0) {
			console.error(errCode + ': ' + errMsg + '\n'
					+ JSON.stringify(result));
		}
		callback();
	});
}

//根据模板id 删除品种模板保证金率设置记录
function deleteTemplateProductByTemplateID(templateID) {
	framework.service.request('marginTemplateProductService', 'deleteTemplateProductByTemplateID', templateID, function(errCode,
			errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
	});
}

//根据模板代码查询模板信息
function findByTemplateName(callback, templateName) {
	framework.service.request('marginTemplateService', 'findByTemplateName', templateName, function(errCode,
			errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}

function getMaxMarginTemplateID(callback) {
	framework.service.request('marginTemplateService', 'findMaxMarginTemplateID', function(errCode,
			errMsg, result) {
		if (errCode > 0) {
			layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		}
		if (callback !== undefined || callback != null) {
			callback(result);
		}
	});
}
