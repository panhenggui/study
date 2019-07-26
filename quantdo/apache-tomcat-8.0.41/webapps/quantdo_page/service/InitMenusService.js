Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.InitMenusService = function(){	
	this.getMenus = function (callback) {
		framework.service.request('initMenusService', 'getMenus', function(errCode,errMsg, result) {
			if (errCode > 0) {
				console.error(errCode + ': ' + errMsg + '\n'
						+ JSON.stringify(result));
			}
			if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
}