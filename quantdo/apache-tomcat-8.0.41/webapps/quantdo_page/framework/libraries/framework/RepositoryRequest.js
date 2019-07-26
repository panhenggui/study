
define(function(require, exports, module) {
	
	var is = require('../isjs/is.js');
	var BaseRequest = require('./BaseRequest.js');
	
	/**
	 * 创建RepositoryRequest实例，用于向远程添加数据
	 * @param {string} entityName 远程entity名
	 * */
	function RepositoryRequest(entityName) {
		this.entityName = entityName;
		this.pageSize = 0;
		this.sortParams = '';
	}

	module.exports = RepositoryRequest;
	
	// 继承自BaseRequest
	RepositoryRequest.prototype = new BaseRequest();
	
	/**
	 * 创建数据
	 * @param {Object} data 要创建的数据
	 * */
	RepositoryRequest.prototype.create = function(data) {
		var url = '/repository/' + this.entityName;
		var params = JSON.stringify(data);
		return this.sendPut(url, params);
	};

	/**
	 * 删除数据
	 * @param {number} id 要删除的id
	 * */
	RepositoryRequest.prototype.delete = function(id) {
		var url = '/repository/' + this.entityName + '/' + id;
		return this.sendDelete(url, null);
	};
	
	/**
	 * 更新数据
	 * @param {number} id 要更新的id
	 * @param {Object} data 要更新的数据
	 * @param {boolean} isPartial 是否仅更新部分(默认：是)
	 * */
	RepositoryRequest.prototype.update = function(id, data, isPartial) {
		if(!is.boolean(isPartial)) {
			isPartial = true;
		}
		var url = '';
		if(isPartial) {
			url = '/repository/partUpdate/' + this.entityName + '/' + id;
		} else {
			url = '/repository/' + this.entityName + '/' + id;
		}
		return request.sendPost(url, data);
	};


	/**
	 * 排序规则：升序
	 */
	RepositoryRequest.SORT_TYPE_ASC = 1;
	/**
	 * 排序规则：降序
	 */
	RepositoryRequest.SORT_TYPE_DESC = 2;

	/**
	 * 设置分页大小 小于等于0表示不分页
	 * @param {int} pageSize 分页大小
	 * */
	RepositoryRequest.prototype.setPageSize = function(pageSize) {
		if(is.nan(pageSize)) {
			throw new error('parameter error: pageSize should be an integer.');
		}
		if(pageSize >= 0) {
			this.pageSize = pageSize;
		} else {
			this.pageSize = 0;
		}
	};
	
	/**
	 * 添加排序字段
	 * @param {string} sortField 分页索引
	 * @param {int} sortType SORT_TYPE_ASC/SORT_TYPE_DESC
	 * */
	RepositoryRequest.prototype.addSortFiled = function(sortField, sortType) {
		if(this.sortParams != '') {
			this.sortParams += '&';
		}
		this.sortParams += 'sort=';
		this.sortParams += sortField;
		if(sortType == RepositoryRequest.SORT_TYPE_ASC) {
			this.sortParams += ',ASC';
		} else if(sortType == RepositoryRequest.SORT_TYPE_DESC) {
			this.sortParams += ',DESC';
		}
	};
	
	/**
	 * 清除排序字段
	 * */
	RepositoryRequest.prototype.clearSortFileds = function() {
		this.sortParams = '';
	};
	
	
	/**
	 * 根据属性查询
	 * @param {string} funcName 远程服务方法名
	 * @param {int} pageIndex 分页索引，pageSize为0时无效
	 * */
	RepositoryRequest.prototype.query = function(funcName, pageIndex) {
		var argsCount = arguments.length;
		if(argsCount < 1) {
			throw new error('call query with wrong params.');
		}
		if(is.nan(pageIndex) || pageIndex < 0) {
			pageIndex = 0;
		}
		
		var url = '/repository/' + this.entityName + '/' + funcName;
		if(this.pageSize > 0) {
			url += '/' + pageIndex + '/' + this.pageSize;
		}
		
		var funcParams = new Array();
		for(var i = 2; i < argsCount - 1; i++) {
			funcParams.push(arguments[i]);
		}
		var params = 'params=' + JSON.stringify(funcParams);
		if(this.sortParams != '') {
			params += '&' + this.sortParams;
		}
		
		this.sendGet(url, params);
	};

	/**
	 * 根据属性查询
	 * @param {string} funcName 远程服务方法名
	 * @param {int} pageIndex 分页索引，pageSize为0时无效
	 * @param {json} funcParams 远程服务方法Map形式参数
	 * */
	RepositoryRequest.prototype.query2 = function(funcName, pageIndex, funcParams) {
		var argsCount = arguments.length;
		if(argsCount < 1) {
			throw new error('call query with wrong params.');
		}
		if(is.nan(pageIndex) || pageIndex < 0) {
			pageIndex = 0;
		}
		
		var url = '/repository/' + this.entityName + '/' + funcName;
		if(this.pageSize > 0) {
			url += '/' + pageIndex + '/' + this.pageSize;
		}
		
		var params = '';
		for (var key in funcParams) {
			params += '&' + key + '=' + JSON.stringify(funcParams[key]);
		};
		if(params.length > 0) {
			params = params.substring(1);
		}
		if(this.sortParams != '') {
			params += '&' + this.sortParams;
		}
		
		this.sendGet(url, params);
	};

});