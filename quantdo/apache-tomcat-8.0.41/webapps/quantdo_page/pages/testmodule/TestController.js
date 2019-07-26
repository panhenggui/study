
define(function(require, exports, module) {

	var TestService = require('TestService');

	var testService = new TestService();

	module.exports = {
		login: function() {
			var userName = 'test';
			var password = 'test';
			remotePermission.logon(userName, password, function(errCode, errMsg, data) {
				alert('errCode:' + errCode + ' errMsg:' + errMsg);
				if(is.json(data) || is.array(data)) {
					alert(JSON.stringify(data));
				}
				alert(document.cookie);
			});
		},
		logout: function() {
			remotePermission.logout(function(errCode, errMsg) {
				alert('errCode:' + errCode + ' errMsg:' + errMsg);
			});
		},
		requestService: function() {
			testService.requestUser(function(result) {
				alert('result: ' + JSON.stringify(result));
			});
		}
	};
	
});
