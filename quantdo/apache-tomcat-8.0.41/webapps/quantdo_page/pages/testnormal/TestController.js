
// window.onload = function() {
// 	alert('...');
// };

function logon() {
	framework.permission.logon('test1', 'test1', function(errCode, errMsg) {
		alert(errCode + ': ' + errMsg);
	});
}

function logout() {
	framework.permission.logout(function(errCode, errMsg) {
		alert(errCode + ': ' + errMsg);
	});
}

function getPermissions() {
	framework.permission.getPermissions('test', function(errCode, errMsg, result) {
		alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	});
}

function requestService() {
	framework.service.request('myService', 'myFunc', 'a', 2, true, {id:1, content:'comment'}, function(errCode, errMsg, result) {
		alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	});
}

function requestService2() {
	framework.service.request2('myService', 'myFunc', {a:'a', b:2, bo:true, c:{id:1, content:'comment'}}, function(errCode, errMsg, result) {
		alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	});
}

function create() {
	framework.repository.create('todoRepository', {title:'测试标题___', content:'测试内容', status:'0'}, function(errCode, errMsg) {
		alert(errCode + ': ' + errMsg);
	});
}

function delete_() {
	framework.repository.delete('todoRepository', 15, function(errCode, errMsg) {
		alert(errCode + ': ' + errMsg);
	});
}

function update() {
	framework.repository.update('todoRepository', 13, {title:'测_试_'}, true, function(errCode, errMsg) {
		alert(errCode + ': ' + errMsg);
	});
}

function query() {
	var options = {pageSize:0, pageIndex:0};
	options.sortFields = [{field:'id', type:framework.repository.SORT_TYPE_ASC}];
	framework.repository.query('todoRepository', 'findBystatus', options, '0', function(errCode, errMsg, resultData, totalCount, pageCount) {
		alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(resultData));
	});
}

function query2() {
	var options = {pageSize:0, pageIndex:0};
	options.sortFields = [{field:'id', type:framework.repository.SORT_TYPE_DESC}];
	framework.repository.query2('todoRepository', 'findBystatus', options, {status:'0'}, function(errCode, errMsg, resultData, totalCount, pageCount) {
		alert(errCode + ': ' + errMsg + '\n' + JSON.stringify(resultData));
	});
}

function download() {
	framework.file.download('user', 'downFunc', 'param1', 'param2', function(errCode, errMsg) {
		alert(errCode + ': ' + errMsg);
	});
}

function download2() {
	framework.file.download2('user', 'downFunc', {param1:'param1', param2:'param2'}, function(errCode, errMsg) {
		alert(errCode + ': ' + errMsg);
	});
}

function upload() {
	framework.file.upload('user', 'uploadFunc', ['file1'], function(errCode, errMsg) {
		alert(errCode + ': ' + errMsg);
	});
}
