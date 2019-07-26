;(function(root, factory) {
	if(typeof define === 'function') {
        // AMD. Register as an anonymous module.
        define('framework/framework', [], function(framework) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root.framework = factory(framework));
        });
    } else if(typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('framework'));
    } else {
        // Browser globals (root is window)
        root.framework = factory(root.framework);
    }
}(this, function() {
	
	var framework = {};
	
	framework.frameworkHome = '';

	// framework支持的模块
	framework.modules = {
		jquery: 'jquery',
		isjs: 'isjs',
		RepositoryRequest: 'RepositoryRequest',
		ServiceRequest: 'ServiceRequest',
		FileRequest: 'FileRequest'
	};

	/**
	 * 载入framework模块(非模块化时使用)
	 * @param {array} modules 模块列表。如：['RepositoryRequest', 'ServiceRequest', 'FileRequest']
	 * @param {function} callback 载入完成后回调
	 * */
	framework.load = function(modules, callback) {
		if(!seajs || !seajs.use) {
			throw new error('seajs not found.');
		}
		var errorHandlers = {};
		if(Config && Config.errorHandlers) {
			errorHandlers = Config.errorHandlers;
		}
		seajs.config({
			alias: {
				'jquery': framework.frameworkHome + 'libraries/jquery/jquery.js',
				'isjs': framework.frameworkHome + 'libraries/isjs/is.js',
				'RepositoryRequest': framework.frameworkHome + 'libraries/framework/RepositoryRequest.js',
				'ServiceRequest': framework.frameworkHome + 'libraries/framework/ServiceRequest.js',
				'FileRequest': framework.frameworkHome + 'libraries/framework/FileRequest.js'
			},
			vars: errorHandlers,
			charset: 'utf-8'
		});
		seajs.use(modules, callback);
	};

	/**
	* 启动线程
	* */
	framework.startThread = function(code) {
		setTimeout(code, 1);
	};

	return framework;
}));