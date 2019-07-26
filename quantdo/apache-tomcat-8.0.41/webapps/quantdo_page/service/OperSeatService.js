Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.OperSeatService = function() {
	// 查询所有
	this.getAll = function(callback) {
		framework.service.request('operSeatService', 'findAll', function(
				errCode, errMsg, result) {
			if (errCode > 0) {
				layer.msg(errCode + ': ' + errMsg + '\n'
						+ JSON.stringify(result), {
					icon : 2
				});
			}
			if (callback !== undefined || callback != null) {
				callback(result);
			}
		});
	}
}
