

define(function(require, exports, module) {
	
	var is = require('../isjs/is.js');
	var BaseRequest = require('./BaseRequest.js');
	
	/**
	 * 创建ServiceRequest实例，用于访问远程服务
	 * @param {string} serviceName 远程服务名
	 * @param {Object} requestErrorCallback 全局错误处理对象
	 * */
	function ServiceRequest(serviceName) {
		this.serviceName = serviceName;
	}
	
	module.exports = ServiceRequest;
	
	// 继承自BaseRequest
	ServiceRequest.prototype = new BaseRequest();
	
	/**
	 * 发起请求
	 * serviceRequest.request1('myFunc', param1, param2, param3, ...);
	 * @param {string} funcName 方法名
	 * */
	ServiceRequest.prototype.request = function(funcName) {
		var argsCount = arguments.length;
		if(argsCount == 0) {
			throw new error('call request with wrong params.');
		}
		var url = '/service/' + this.serviceName + '/' + funcName;
		var params = new Array();
		for (var i = 1; i < argsCount - 1; i++) {
			params.push(arguments[i]);
		};
		var data = 'params=' + JSON.stringify(params);
		this.sendPost(url, data);
	};

	/**
	 * 发起请求
	 * serviceRequest.request2('myFunc', {param1:value1, param2:value2, param3:value3, ...});
	 * @param {string} funcName 方法名
	 * @param {json} funcParams 远程服务方法Map形式参数
	 * */
	ServiceRequest.prototype.request2 = function(funcName, funcParams) {
		var argsCount = arguments.length;
		if(argsCount != 2) {
			throw new error('call request with wrong params.');
		}
		var url = '/service/' + this.serviceName + '/' + funcName;
		var params = '';
		for (var key in funcParams) {
			params += '&' + key + '=' + JSON.stringify(funcParams[key]);
		};
		if(params.length > 0) {
			params = params.substring(1);
		}
		this.sendPost(url, params);
	};
	
});
