
define(function(require, exports, module) {

	function DefaultErrorHandler() {

	}
	
	module.exports = DefaultErrorHandler;

	DefaultErrorHandler.prototype.onBusinessProcessError = function() {
		alert('后台业务处理遇到未知错误');
	};

	DefaultErrorHandler.prototype.onDBConnectError = function() {
		alert('数据库无法获得连接');
	};

	DefaultErrorHandler.prototype.onEntityWithoutIdError = function() {
		alert('entity定义错误，没有主键Id');
	};

	DefaultErrorHandler.prototype.onFieldValidateError = function() {
		alert('字段验证发生异常');
	};

	DefaultErrorHandler.prototype.onJsonConvertError = function() {
		alert('返回对象无法做json对象转换');
	};

	DefaultErrorHandler.prototype.onJsonToJavaError = function() {
		alert('请求参数无法转换java对象');
	};

	DefaultErrorHandler.prototype.onNoInterfaceError = function() {
		alert('请求接口错误');
	};

	DefaultErrorHandler.prototype.onNoServiceError = function() {
		alert('请求无对应服务');
	};

	DefaultErrorHandler.prototype.onNotLogonError = function() {
		alert('未登录');
	};

	DefaultErrorHandler.prototype.onParameterCountError = function() {
		alert('请求参数个数错误');
	};

	DefaultErrorHandler.prototype.onParameterTypeError = function() {
		alert('请求参数类型错误');
	};

	DefaultErrorHandler.prototype.onPermissionDeniedError = function() {
		alert('无权限访问');
	};

	DefaultErrorHandler.prototype.onSessionInvalidError = function() {
		alert('会话失效');
	};

	DefaultErrorHandler.prototype.onTimeoutError = function() {
		alert('请求超时, 请检查网络设置。');
	};

	DefaultErrorHandler.prototype.onVersionNotSupportError = function() {
		alert('访问版本不支持');
	};

	DefaultErrorHandler.prototype.onUnhandledError = function(msg) {
		alert('未处理错误: ' + msg);
	};

});