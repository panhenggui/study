
define(function(require, exports, module) {
	
	var $ = require('../jquery/1.10.1/jquery.js');
	var is = require('../isjs/is.js');
	
	var DefaultErrorHandler = require('./DefaultErrorHandler.js');
	
	/**
	 * 默认错误处理
	 * */
	var _defaultErrorHandler = undefined;

	var _notLogonHandler = undefined;
	var _permissionDeniedHandler = undefined;
	var _versionNotSupportHandler = undefined;
	var _sessionInvalidHandler = undefined;
	var _noServiceHandler = undefined;
	var _noInterfaceHandler = undefined;
	var _jsonConvertErrorHandler = undefined;
	var _parameterCountErrorHandler = undefined;
	var _parameterTypeErrorHandler = undefined;
	var _jsonToJavaErrorHandler = undefined;
	var _businessProcessErrorHandler = undefined;
	var _entityWithoutIdHandler = undefined;
	var _dbConnectErrorHandler = undefined;
	var _fieldValidateErrorHandler = undefined;
	var _timeoutHandler = undefined;
	var _unhandledErrorHandler = undefined;
	
	/**
	 * 创建BaseRequest实例
	 * @param {string} url 远程地址
	 * @param {boolean} isAsync 是否异步调用
	 * @param {Object} requestErrorCallback 全局错误处理对象
	 * */
	function BaseRequest() {
		_defaultErrorHandler = new DefaultErrorHandler();

		if(seajs && seajs.data && seajs.data.vars) {
			if(seajs.data.vars.notLogonHandler) {
				//_notLogonHandler = require('../../../{notLogonHandler}');
				require.async('../../../{notLogonHandler}', function(m) { _notLogonHandler = m; });
			}
			if(seajs.data.vars.permissionDeniedHandler) {
				//_permissionDeniedHandler = require('../../../{permissionDeniedHandler}');
				require.async('../../../{permissionDeniedHandler}', function(m) { _permissionDeniedHandler = m; });
			}
			if(seajs.data.vars.versionNotSupportHandler) {
				// _versionNotSupportHandler = require('../../../{versionNotSupportHandler}');
				require.async('../../../{versionNotSupportHandler}', function(m) { _versionNotSupportHandler = m; });
			}
			if(seajs.data.vars.sessionInvalidHandler) {
				// _sessionInvalidHandler = require('../../../{sessionInvalidHandler}');
				require.async('../../../{sessionInvalidHandler}', function(m) { _sessionInvalidHandler = m; });
			}
			if(seajs.data.vars.noServiceHandler) {
				// _noServiceHandler = require('../../../{noServiceHandler}');
				require.async('../../../{noServiceHandler}', function(m) { _noServiceHandler = m; });
			}
			if(seajs.data.vars.noInterfaceHandler) {
				// _noInterfaceHandler = require('../../../{noInterfaceHandler}');
				require.async('../../../{noInterfaceHandler}', function(m) { _noInterfaceHandler = m; });
			}
			if(seajs.data.vars.jsonConvertErrorHandler) {
				// _jsonConvertErrorHandler = require('../../../{jsonConvertErrorHandler}');
				require.async('../../../{jsonConvertErrorHandler}', function(m) { _jsonConvertErrorHandler = m; });
			}
			if(seajs.data.vars.parameterCountErrorHandler) {
				// _parameterCountErrorHandler = require('../../../{parameterCountErrorHandler}');
				require.async('../../../{parameterCountErrorHandler}', function(m) { _parameterCountErrorHandler = m; });
			}
			if(seajs.data.vars.parameterTypeErrorHandler) {
				// _parameterTypeErrorHandler = require('../../../{parameterTypeErrorHandler}');
				require.async('../../../{parameterTypeErrorHandler}', function(m) { _parameterTypeErrorHandler = m; });
			}
			if(seajs.data.vars.jsonToJavaErrorHandler) {
				// _jsonToJavaErrorHandler = require('../../../{jsonToJavaErrorHandler}');
				require.async('../../../{jsonToJavaErrorHandler}', function(m) { _jsonToJavaErrorHandler = m; });
			}
			if(seajs.data.vars.businessProcessErrorHandler) {
				// _businessProcessErrorHandler = require('../../../{businessProcessErrorHandler}');
				require.async('../../../{businessProcessErrorHandler}', function(m) { _businessProcessErrorHandler = m; });
			}
			if(seajs.data.vars.entityWithoutIdHandler) {
				// _entityWithoutIdHandler = require('../../../{entityWithoutIdHandler}');
				require.async('../../../{entityWithoutIdHandler}', function(m) { _entityWithoutIdHandler = m; });
			}
			if(seajs.data.vars.dbConnectErrorHandler) {
				// _dbConnectErrorHandler = require('../../../{dbConnectErrorHandler}');
				require.async('../../../{dbConnectErrorHandler}', function(m) { _dbConnectErrorHandler = m; });
			}
			if(seajs.data.vars.fieldValidateErrorHandler) {
				// _fieldValidateErrorHandler = require('../../../{fieldValidateErrorHandler}');
				require.async('../../../{fieldValidateErrorHandler}', function(m) { _fieldValidateErrorHandler = m; });
			}
			if(seajs.data.vars.timeoutHandler) {
				// _timeoutHandler = require('../../../{timeoutHandler}');
				require.async('../../../{timeoutHandler}', function(m) { _timeoutHandler = m; });
			}
			if(seajs.data.vars.unhandledErrorHandler) {
				// _unhandledErrorHandler = require('../../../{unhandledErrorHandler}');
				require.async('../../../{unhandledErrorHandler}', function(m) { _unhandledErrorHandler = m; });
			}
		}
	}
	
	module.exports = BaseRequest;
	
	/**
	 * 自定义未登录异常处理
	 */
	BaseRequest.prototype.setNotLogonHandler = function(handler) {
		_notLogonHandler = handler;
	};
	/**
	 * 自定义无权限访问异常处理
	 */
	BaseRequest.prototype.setPermissionDeniedHandler = function(handler) {
		_permissionDeniedHandler = handler;
	};
	/**
	 * 自定义版本不支持异常处理
	 */
	BaseRequest.prototype.setVersionNotSupportHandler = function(handler) {
		_versionNotSupportHandler = handler;
	};
	/**
	 * 自定义会话失效异常处理
	 */
	BaseRequest.prototype.setSessionInvalidHandler = function(handler) {
		_sessionInvalidHandler = handler;
	};
	/**
	 * 自定义无对应服务异常处理
	 */
	BaseRequest.prototype.setNoServiceHandler = function(handler) {
		_noServiceHandler = handler;
	};
	/**
	 * 自定义接口错误异常处理
	 */
	BaseRequest.prototype.setNoInterfaceHandler = function(handler) {
		_noInterfaceHandler = handler;
	};
	/**
	 * 自定义JSON无法作对象转换异常处理
	 */
	BaseRequest.prototype.setJsonConvertErrorHandler = function(handler) {
		_jsonConvertErrorHandler = handler;
	};
	/**
	 * 自定义参数个数错误异常处理
	 */
	BaseRequest.prototype.setParameterCountErrorHandler = function(handler) {
		_parameterCountErrorHandler = handler;
	};
	/**
	 * 自定义参数类型错误异常处理
	 */
	BaseRequest.prototype.setParameterTypeErrorHandler = function(handler) {
		_parameterTypeErrorHandler = handler;
	};
	/**
	 * 自定义JSON转Java对象异常处理
	 */
	BaseRequest.prototype.setJsonToJavaErrorHandler = function(handler) {
		_jsonToJavaErrorHandler = handler;
	};
	/**
	 * 自定义业务处理错误异常处理
	 */
	BaseRequest.prototype.setBusinessProcessErrorHandler = function(handler) {
		_businessProcessErrorHandler = handler;
	};
	/**
	 * 自定义Entity无ID异常处理
	 */
	BaseRequest.prototype.setEntityWithoutIdHandler = function(handler) {
		_entityWithoutIdHandler = handler;
	};
	/**
	 * 自定义数据库连接异常处理
	 */
	BaseRequest.prototype.setDBConnectErrorHandler = function(handler) {
		_dbConnectErrorHandler = handler;
	};
	/**
	 * 自定义字段验证异常处理
	 */
	BaseRequest.prototype.setFieldValidateHandler = function(handler) {
		_fieldValidateErrorHandler = handler;
	};
	/**
	 * 自定义请求超时异常处理
	 */
	BaseRequest.prototype.setTimeoutHandler = function(handler) {
		_timeoutHandler = handler;
	};
	/**
	 * 自定义未处理异常处理
	 */
	BaseRequest.prototype.setUnhandledErrorHandler = function(handler) {
		_unhandledErrorHandler = handler;
	};
	
	/**
	 * 发起GET请求
	 * @param {string} params 查询参数
	 * */
	BaseRequest.prototype.sendGet = function(url, params) {
		var fullUrl = Config.domain + '/' + Config.project + url;
		return _request(fullUrl, 'GET', params, true);
	};
	
	/**
	 * 发起POST请求
	 * @param {string} data 要post的数据
	 * */
	BaseRequest.prototype.sendPost = function(url, data) {
		var fullUrl = Config.domain + '/' + Config.project + url;
		return _request(fullUrl, 'POST', data, false);
	};
	
	/**
	 * 发起PUT请求
	 * @param {string} data 要put的数据
	 * */
	BaseRequest.prototype.sendPut = function(url, params) {
		var fullUrl = Config.domain + '/' + Config.project + url;
		return _request(fullUrl, 'PUT', params, false);
	};
	
	/**
	 * 发起DELETE请求
	 * @param {string} params 查询参数
	 * */
	BaseRequest.prototype.sendDelete = function(url, params) {
		var fullUrl = Config.domain + '/' + Config.project + url;
		return _request(fullUrl, 'DELETE', params, true);
	};
	
	function _request(url, method, data, processData) {
		$.ajax({
			url: url,
			type: method,
			data: data,
			processData: processData,
			cache: false,
			async: false,
			dataType: 'text',
			timeout: Config.timeout || 30000,
			beforeSend: function(xhr) {},
			success: function(rawData, status, xhr) {
				var errorCode = parseInt(xhr.getResponseHeader('error_code'));
				if(errorCode === 200) {
					// success
					if(!is.empty(rawData)) {
						rawData = JSON.parse(rawData);
					}
					var errCode = 0;
					if(rawData && rawData.errorCode != null && rawData.errorCode != undefined) {
						errCode = rawData.errorCode;
					}
					var errMsg = 'succeed';
					if(rawData && rawData.errorMsg != null && rawData.errorMsg != undefined) {
						errMsg = rawData.errorMsg;
					}
					
					var totalCount = undefined;
					if(rawData && is.integer(rawData.totalCount)) {
						totalCount = rawData.totalCount;
					}
					var pageCount = undefined;
					if(rawData && is.integer(rawData.pageCount)) {
						pageCount = rawData.pageCount;
					}
					
					var resultData = undefined;
					if(rawData && rawData.data) {
						resultData = JSON.parse(rawData.data);
					}
					
					return {errorCode:errCode, errorMsg:errMsg, data:resultData, totalCount:totalCount, pageCount:pageCount};
				} else {
					if(errorCode === 100) {
						if(_notLogonHandler && _notLogonHandler.onError) {
							_notLogonHandler.onError();
						} else {
							_defaultErrorHandler.onNotLogonError();
						}
					} else if(errorCode === 101) {
						if(_permissionDeniedHandler && _permissionDeniedHandler.onError) {
							_permissionDeniedHandler.onError();
						} else {
							_defaultErrorHandler.onPermissionDeniedError();
						}
					} else if(errorCode === 102) {
						if(_versionNotSupportHandler && _versionNotSupportHandler.onError) {
							_versionNotSupportHandler.onError();
						} else {
							_defaultErrorHandler.onVersionNotSupportError();
						}
					} else if(errorCode === 103) {
						if(_sessionInvalidHandler && _sessionInvalidHandler.onError) {
							_sessionInvalidHandler.onError();
						} else {
							_defaultErrorHandler.onSessionInvalidError();
						}
					} else if(errorCode === 104) {
						if(_noServiceHandler && _noServiceHandler.onError) {
							_noServiceHandler.onError();
						} else {
							_defaultErrorHandler.onNoServiceError();
						}
					} else if(errorCode === 105) {
						if(_noInterfaceHandler && _noInterfaceHandler.onError) {
							_noInterfaceHandler.onError();
						} else {
							_defaultErrorHandler.onNoInterfaceError();
						}
					} else if(errorCode === 106) {
						if(_jsonConvertErrorHandler && _jsonConvertErrorHandler.onError) {
							_jsonConvertErrorHandler.onError();
						} else {
							_defaultErrorHandler.onJsonConvertError();
						}
					} else if(errorCode === 107) {
						if(_parameterCountErrorHandler && _parameterCountErrorHandler.onError) {
							_parameterCountErrorHandler.onError();
						} else {
							_defaultErrorHandler.onParameterCountError();
						}
					} else if(errorCode === 108) {
						if(_parameterTypeErrorHandler && _parameterTypeErrorHandler.onError) {
							_parameterTypeErrorHandler.onError();
						} else {
							_defaultErrorHandler.onParameterTypeError();
						}
					} else if(errorCode === 109) {
						if(_jsonToJavaErrorHandler && _jsonToJavaErrorHandler.onError) {
							_jsonToJavaErrorHandler.onError();
						} else {
							_defaultErrorHandler.onJsonToJavaError();
						}
					} else if(errorCode === 110) {
						if(this.businessProcessErrorHandler && this.businessProcessErrorHandler.onError) {
							this.businessProcessErrorHandler.onError();
						} else {
							_defaultErrorHandler.onBusinessProcessError();
						}
					} else if(errorCode === 111) {
						if(_entityWithoutIdHandler && _entityWithoutIdHandler.onError) {
							_entityWithoutIdHandler.onError();
						} else {
							_defaultErrorHandler.onEntityWithoutIdError();
						}
					} else if(errorCode === 112) {
						if(_dbConnectErrorHandler && _dbConnectErrorHandler.onError) {
							_dbConnectErrorHandler.onError();
						} else {
							_defaultErrorHandler.onDBConnectError();
						}
					} else if(errorCode == 113) {
						if(_fieldValidateErrorHandler && _fieldValidateErrorHandler.onError) {
							_fieldValidateErrorHandler.onError();
						} else {
							_defaultErrorHandler.onFieldValidateError();
						}
					} else {
						if(_unhandledErrorHandler && _unhandledErrorHandler.onError) {
							_unhandledErrorHandler.onError('other error');
						} else {
							_defaultErrorHandler.onUnhandledError('other error');
						}
					}

					return {errorCode:-1, errorMsg:'server error'};
				}
			},
			error: function(xhr, status, exception) {
				if(status == 'timeout') {
					if(_timeoutHandler && _timeoutHandler.onError) {
						_timeoutHandler.onError();
					} else {
						_defaultErrorHandler.onTimeoutError();
					}
				} else {
					if(_unhandledErrorHandler && _unhandledErrorHandler.onError) {
						_unhandledErrorHandler.onError(exception.name + ': ' + exception.message);
					} else {
						_defaultErrorHandler.onUnhandledError(exception.name + ': ' + exception.message);
					}
				}

				return {errorCode:-1, errorMsg:'network error'};
			}
		});
		return {errorCode:-1, errorMsg:'internal error'};
	}
	
});
