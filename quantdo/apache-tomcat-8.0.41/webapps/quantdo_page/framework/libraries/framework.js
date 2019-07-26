;(function (root, factory) {
    if (typeof define === 'function') {
        // AMD. Register as an anonymous module.
        define('framework', [], function (framework) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root.framework = factory(framework));
        });
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('framework'));
    } else {
        // Browser globals (root is window)
        root.framework = factory(root.framework);
    }
}(this, function () {

    var framework = {};

    /**
     * 设置依赖的jQuery(用于客户端使用模块化时)
     * */
    framework.setJQuery = function (jquery) {
        framework.internal.jquery = jquery;
    };

    /**
     * 远程权限访问对象
     * */
    framework.permission = {};

    /**
     * 登入
     * @param {string} userName 用户名
     * @param {string} password 密码
     * @param {function} callback 回调函数
     * */
    framework.permission.logon = function (userName, password, callback, verificationCode, extendsParams) {
        var url = '/tmpLogon';

        var paramsIn = {
            userName: userName,
            password: password
        }

        if (verificationCode !== undefined) {
            paramsIn.verification_code = verificationCode;
        }

        if (extendsParams !== undefined) {
            paramsIn.extends = JSON.stringify(extendsParams);
        }

        var params = {params: JSON.stringify(paramsIn)};

        framework.internal.sendPost(url, params, callback);

        // 登录后,清理ws连接
        framework.internal.resetConn();
    };

    /**
     * 登出
     * @param {function} callback 回调函数
     * */
    framework.permission.logout = function (callback) {
        var url = '/logout';
        framework.internal.sendDelete(url, {}, callback);

        // 退出登录后,清理ws连接
        framework.internal.resetConn();
    };

    /**
     * 获取用户权限
     * @param {string} type 类型
     * @param {function} callback 回调函数
     * */
    framework.permission.getPermissions = function (type, callback) {
        var url = '/user/profile';
        var params = {type: type};
        framework.internal.sendGet(url, params, callback);
    };

    /**
     * 远程service访问对象
     * */
    framework.service = {};

    /**
     * 发起请求
     * serviceRequest.request1('myService', 'myFunc', param1, param2, param3, ...);
     * @param {string} serviceName 服务名
     * @param {string} funcName 方法名
     * @param {any...} 远程服务方法参数
     * @param {function} callback 回调函数
     * */
    framework.service.request = function (serviceName, funcName) {
        var argsCount = arguments.length;
        if (argsCount < 2) {
            throw new error('call request with wrong params.');
        }
        var callback = undefined;
        var url = '/service/' + serviceName + '/' + funcName;
        var params = new Array();
        for (var i = 2; i < argsCount; i++) {
            var arg = arguments[i];
            if (i == argsCount - 1 && typeof(arg) == 'function') {
                callback = arg;
            } else {
                params.push(arg);
            }
        }

        var data = {'params': JSON.stringify(params)};
        //framework.internal.sendPost(url, data, callback);

        framework.internal.callService(url, serviceName, funcName, data, callback);
    };

    /**
     * 发起请求
     * serviceRequest.request2('myService', 'myFunc', {param1:value1, param2:value2, param3:value3, ...});
     * @param {string} serviceName 服务名
     * @param {string} funcName 方法名
     * @param {json} funcParams 远程服务方法Map形式参数
     * @param {function} callback 回调函数
     * */
    framework.service.request2 = function (serviceName, funcName, funcParams, callback) {
        var argsCount = arguments.length;
        if (argsCount < 2) {
            throw new error('call request with wrong params.');
        }
        var url = '/service/' + serviceName + '/' + funcName;
        var params = '';
        if (typeof(funcParams) == 'object') {
            for (var key in funcParams) {
                if (params != '') {
                    params += '&';
                }
                params += key + '=' + JSON.stringify(funcParams[key]);
            }
        }
        framework.internal.sendPost(url, params, callback);
    };

    /**
     * 远程restfulservice访问对象
     * */
    framework.restfulservice = {};

    /**
     * 发起请求
     * restfulservice.get('myService', 'myFunc', {param1:value1, param2:value2, param3:value3, ...});
     * @param {string} serviceName 服务名
     * @param {string} funcName 方法名
     * @param {json} funcParams 远程服务方法Map形式参数
     * @param {function} callback 回调函数
     * */
    framework.restfulservice.requestGet = function (serviceName, funcName, funcParams, callback) {
        var argsCount = arguments.length;
        if (argsCount < 2) {
            throw new error('call request with wrong params.');
        }
        var url = '/restfulservice/' + serviceName + '/' + funcName;
        framework.internal.sendGet(url, funcParams, callback);
    };

    /**
     * 发起请求
     * restfulservice.get('myService', 'myFunc', {param1:value1, param2:value2, param3:value3, ...});
     * @param {string} serviceName 服务名
     * @param {string} funcName 方法名
     * @param {json} funcParams 远程服务方法Map形式参数
     * @param {function} callback 回调函数
     * */
    framework.restfulservice.requestPost = function (serviceName, funcName, funcParams, callback) {
        var argsCount = arguments.length;
        if (argsCount < 2) {
            throw new error('call request with wrong params.');
        }
        var url = '/restfulservice/' + serviceName + '/' + funcName;
        framework.internal.sendPost(url, funcParams, callback);
    };

    /**
     * 发起请求
     * restfulservice.get('myService', 'myFunc', {param1:value1, param2:value2, param3:value3, ...});
     * @param {string} serviceName 服务名
     * @param {string} funcName 方法名
     * @param {json} funcParams 远程服务方法Map形式参数
     * @param {function} callback 回调函数
     * */
    framework.restfulservice.requestPut = function (serviceName, funcName, funcParams, callback) {
        var argsCount = arguments.length;
        if (argsCount < 2) {
            throw new error('call request with wrong params.');
        }
        var url = '/restfulservice/' + serviceName + '/' + funcName;
        framework.internal.sendPut(url, funcParams, callback);
    };

    /**
     * 发起请求
     * restfulservice.get('myService', 'myFunc', {param1:value1, param2:value2, param3:value3, ...});
     * @param {string} serviceName 服务名
     * @param {string} funcName 方法名
     * @param {json} funcParams 远程服务方法Map形式参数
     * @param {function} callback 回调函数
     * */
    framework.restfulservice.requestDelete = function (serviceName, funcName, funcParams, callback) {
        var argsCount = arguments.length;
        if (argsCount < 2) {
            throw new error('call request with wrong params.');
        }
        var url = '/restfulservice/' + serviceName + '/' + funcName;
        var params = '';
        if (typeof(funcParams) == 'object') {
            for (var key in funcParams) {
                if (params != '') {
                    params += '&';
                }
                params += key + '=' + funcParams[key];
            }
            ;
        }
        if (params != '') {
            url = url + "?" + params;
        }
        framework.internal.sendDelete(url, {}, callback);
    };

    /**
     * 远程repository访问对象
     * */
    framework.repository = {};

    /**
     * 排序规则：升序
     */
    framework.repository.SORT_TYPE_ASC = 1;
    /**
     * 排序规则：降序
     */
    framework.repository.SORT_TYPE_DESC = 2;

    /**
     * 创建数据
     * @param {string} entityName 远程服务entity名
     * @param {Object} data 要创建的数据
     * @param {function} callback 回调函数
     * */
    framework.repository.create = function (entityName, data, callback) {
        var url = '/repository/' + entityName;
        var params = JSON.stringify(data);
        framework.internal.sendPut(url, params, callback);
    };

    /**
     * 删除数据
     * @param {string} entityName 远程服务entity名
     * @param {number} id 要删除的id
     * @param {function} callback 回调函数
     * */
    framework.repository.delete = function (entityName, id, callback) {
        var url = '/repository/' + entityName + '/' + id;
        framework.internal.sendDelete(url, null, callback);
    };

    /**
     * 更新数据
     * @param {string} entityName 远程服务entity名
     * @param {number} id 要更新的id
     * @param {Object} data 要更新的数据
     * @param {boolean} isPartial 是否仅更新部分(默认：是)
     * @param {function} callback 回调函数
     * */
    framework.repository.update = function (entityName, id, data, isPartial, callback) {
        if (typeof(isPartial) == 'function') {
            callback = isPartial;
            isPartial = true;
        }
        var url = '';
        if (isPartial) {
            url = '/repository/partUpdate/' + entityName + '/' + id;
        } else {
            url = '/repository/' + entityName + '/' + id;
        }
        var params = {'params': JSON.stringify(data)};
        framework.internal.sendPost(url, params, callback);
    };

    /**
     * 根据属性查询
     * @param {string} entityName 远程服务entity名
     * @param {string} funcName 远程服务方法名
     * @param {json object} options 查询选项参数 {pageSize:10, pageIndex:0, sortFields:[{field:'field1', type:framework.repository.SORT_TYPE_ASC},{...},...]}
     * @param {any...} 远程服务方法参数
     * @param {function} callback 回调函数
     * */
    framework.repository.query = function (entityName, funcName, options) {
        var argsCount = arguments.length;
        if (argsCount < 2) {
            throw new error('call query with wrong params.');
        }

        var url = '/repository/' + entityName + '/' + funcName;

        if (options && !isNaN(options.pageSize) && options.pageSize > 0) {
            var pageIndex = 0;
            if (!isNaN(options.pageIndex) && options.pageIndex > 0) {
                pageIndex = options.pageIndex;
            }
            url += '/' + pageIndex + '/' + options.pageSize;
        }

        var callback = undefined;
        var funcParams = new Array();
        for (var i = 3; i < argsCount; i++) {
            var arg = arguments[i];
            if (i == argsCount - 1 && typeof(arg) == 'function') {
                callback = arg;
            } else {
                funcParams.push(arg);
            }
        }
        var params = 'params=' + JSON.stringify(funcParams);

        if (options && options.sortFields && options.sortFields instanceof Array) {
            for (var i = 0; i < options.sortFields.length; i++) {
                var sortField = options.sortFields[i];
                if (sortField.field) {
                    params += '&sort=' + sortField.field;
                    if (sortField.type == framework.repository.SORT_TYPE_DESC) {
                        params += ',DESC';
                    } else {
                        params += ',ASC';
                    }
                }
            }
            ;
        }

        framework.internal.sendGet(url, params, callback);
    };

    /**
     * 根据属性查询
     * @param {string} entityName 远程服务entity名
     * @param {string} funcName 远程服务方法名
     * @param {json object} options 查询选项参数 {pageSize:10, pageIndex:0, sortFields:[{field:'field1', type:framework.repository.SORT_TYPE_ASC},{...},...]}
     * @param {json object} funcParams 远程方法Map形式参数
     * @param {function} callback 回调函数
     * */
    framework.repository.query2 = function (entityName, funcName, options, funcParams, callback) {
        var argsCount = arguments.length;
        if (argsCount < 2) {
            throw new error('call query with wrong params.');
        }

        var url = '/repository/' + entityName + '/' + funcName;

        if (options && !isNaN(options.pageSize) && options.pageSize > 0) {
            var pageIndex = 0;
            if (!isNaN(options.pageIndex) && options.pageIndex > 0) {
                pageIndex = options.pageIndex;
            }
            url += '/' + pageIndex + '/' + options.pageSize;
        }

        var params = '';
        if (typeof(funcParams) == 'object') {
            for (var key in funcParams) {
                if (params != '') {
                    params += '&';
                }
                params += key + '=' + JSON.stringify(funcParams[key]);
            }
            ;
        }

        if (options && options.sortFields && options.sortFields instanceof Array) {
            for (var i = 0; i < options.sortFields.length; i++) {
                var sortField = options.sortFields[i];
                if (sortField.field) {
                    if (params != '') {
                        params += '&';
                    }
                    params += 'sort=' + sortField.field;
                    if (sortField.type == framework.repository.SORT_TYPE_DESC) {
                        params += ',DESC';
                    } else {
                        params += ',ASC';
                    }
                }
            }
            ;
        }

        framework.internal.sendGet(url, params, callback);
    };

    /**
     * 文件处理对象
     * */
    framework.file = {};

    /**
     * 从远程下载文件
     * @param {string} serviceName 远程服务名
     * @param {string} funcName 远程服务方法名
     * @param {any...} funcParams 远程方法参数
     * @param {function} callback 回调函数
     * */
    framework.file.download = function (serviceName, funcName, fileName) {
        var argsCount = arguments.length;
        if (argsCount < 3) {
            throw 'call download with wrong params.';
        }
        var callback = undefined;
        var url = framework.internal.getFullUrl('/download/' + serviceName + '/' + funcName);
        var params = new Array();
        for (var i = 3; i < argsCount; i++) {
            var arg = arguments[i];
            if (i == argsCount - 1 && typeof(arg) == 'function') {
                callback = arg;
            } else {
                params.push(arg);
            }
        }
        ;
        url += '?params=' + JSON.stringify(params) + '&fileName=' + fileName;

        var iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.style.display = "none";
        document.body.appendChild(iframe);

        //window.open(url, '', 'location=no');
        if (typeof(callback) == 'function') {
            callback(0, 'download start succeed');
        }
    };


    /**
     * 获取download的地址
     * @param {string} serviceName 远程服务名
     * @param {string} funcName 远程服务方法名
     * @param {any...} funcParams 远程方法参数
     * */
    framework.file.downloadUrl = function (serviceName, funcName, fileName) {
        var argsCount = arguments.length;
        if (argsCount < 3) {
            throw 'call download with wrong params.';
        }
        var callback = undefined;
        var url = framework.internal.getFullUrl('/download/' + serviceName + '/' + funcName);
        var params = new Array();
        for (var i = 3; i < argsCount; i++) {
            var arg = arguments[i];
            if (i == argsCount - 1 && typeof(arg) == 'function') {
                callback = arg;
            } else {
                params.push(arg);
            }
        }
        url += '?params=' + JSON.stringify(params) + '&fileName=' + fileName + '&_=' + new Date().getTime();
        return encodeURI(url);
    };


    /**
     * 从远程下载文件
     * @param {string} serviceName 远程服务名
     * @param {string} funcName 远程服务方法名
     * @param {json object} funcParams 远程方法Map形式参数
     * @param {function} callback 回调函数
     * */
    framework.file.download2 = function (serviceName, funcName, funcParams, callback) {
        var argsCount = arguments.length;
        if (argsCount < 2) {
            throw new error('call download with wrong params.');
        }
        var url = framework.internal.getFullUrl('/download/' + serviceName + '/' + funcName);
        var params = '';
        if (typeof(funcParams) == 'object') {
            for (var key in funcParams) {
                if (params != '') {
                    params += '&';
                }
                params += key + '=' + JSON.stringify(funcParams[key]);
            }
            ;
        }
        if (params != '') {
            url += '?' + params;
        }
        window.open(url, '', 'location=no');
        if (typeof(callback) == 'function') {
            callback(0, 'download start succeed');
        }
    };


    /**
     * 从远程导出文件
     * @param {string} serviceName 远程服务名
     * @param {string} funcName 远程服务方法名
     * @param {any...} funcParams 远程方法参数
     * @param {function} callback 回调函数
     * */
    framework.file.export = function (fileName, type, entity, serviceName, funcName) {
        var argsCount = arguments.length;
        if (argsCount < 5) {
            throw new error('call export with wrong params.');
        }
        var url = framework.internal.getFullUrl('/export/' + serviceName + '/' + funcName);
        var params = new Array();
        for (var i = 5; i < argsCount; i++) {
            var arg = arguments[i];
            params.push(arg);
        }

        var requestParams = {
            args: JSON.stringify(params),
            fileName: fileName,
            type: type,
            entity: JSON.stringify(entity)
        }

        var frameName = "downloadFrame_" + Math.floor(Math.random() * 1000);
        var iframe = document.createElement("iframe");
        iframe.name = frameName;
        iframe.style.display = "none";

        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "params";
        input.value = JSON.stringify(requestParams);

        var form = document.createElement("form");
        form.target = frameName;
        form.method = "POST";
        form.action = url;
        form.style.display = "none";

        form.appendChild(input);
        iframe.appendChild(form);

        document.body.appendChild(iframe);
        form.submit();

        //window.open(url, '', 'location=no');
    };


    /**
     * 从远程导出文件
     * @param {string} serviceName 远程服务名
     * @param {string} funcName 远程服务方法名
     * @param {any...} funcParams 远程方法参数
     * @param {function} callback 回调函数
     * */
    framework.file.exportInPage = function (fileName, content) {
        var argsCount = arguments.length;
        if (argsCount < 2) {
            throw new error('call export in page with wrong params.');
        }
        var url = framework.internal.getFullUrl('/export_in_page');
        var params = new Array();
        for (var i = 2; i < argsCount; i++) {
            var arg = arguments[i];
            params.push(arg);
        }

        var requestParams = {
            args: JSON.stringify(params),
            fileName: fileName,
            content: content
        }

        var frameName = "downloadFrame_" + Math.floor(Math.random() * 1000);
        var iframe = document.createElement("iframe");
        iframe.name = frameName;
        iframe.style.display = "none";

        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "params";
        input.value = JSON.stringify(requestParams);

        var form = document.createElement("form");
        form.target = frameName;
        form.method = "POST";
        form.action = url;
        form.style.display = "none";

        form.appendChild(input);
        iframe.appendChild(form);

        document.body.appendChild(iframe);
        form.submit();

        //window.open(url, '', 'location=no');
    };

    /**
     * 获取文件上传的路径
     * @param serviceName
     * @param funcName
     */
    framework.file.uploadUrl = function (serviceName, funcName, args) {

        var url = framework.internal.getFullUrl('/upload/' + serviceName + '/' + funcName);
        if (args == null || args === undefined || !(args instanceof Array)) {
            return url;
        }

        //args.unshift(null); 取消此操此，改成由客户端添加点位符
        var argStr = JSON.stringify(args);

        if (argStr.indexOf('%') > 0) {
            throw "参数不能包含非法字符";
        }

        return url + "?params=" + JSON.stringify(args);


    };

    /**
     * 文件上传的回调
     * @param serviceName
     * @param funcName
     */
    framework.file.uploadCallback = function (data, callback) {

        if (data === undefined || data == null || data == "") {
            if (typeof callback == 'function') {
                callback(-1, 'server error');
            }
            return;
        }

        if (typeof callback != 'function') {
            return;
        }

        if (data && typeof(data) == 'string') {
            data = JSON.parse(data);
        }

        var errCode = 0;
        if (data && data.errorCode != null && data.errorCode != undefined) {
            errCode = data.errorCode;
        }

        var errMsg = '';
        if (data && data.errorMsg != null && data.errorMsg != undefined) {
            errMsg = data.errorMsg;
        }

        var resultData = '';
        if (data !== undefined && data.data !== undefined) {
            try {
                resultData = JSON.parse(data.data);
            } catch (e) {
                resultData = data.data;
            }

        }

        callback(errCode, errMsg, resultData);

    };

    /**
     * 内部对象，仅供内部调用
     * */
    framework.internal = {};

    framework.internal.jquery = null;

    // 默认错误处理
    framework.internal.defaultErrorHandler = {
        networkErrorHandler: function () {
            console.error('网络连接异常');
        },
        onBusinessProcessError: function () {
            console.error('后台业务处理遇到未知错误');
        },
        onDBConnectError: function () {
            console.error('数据库无法获得连接');
        },
        onEntityWithoutIdError: function () {
            console.error('entity定义错误，没有主键Id');
        },
        onFieldValidateError: function () {
            console.error('字段验证发生异常');
        },
        onJsonConvertError: function () {
            console.error('返回对象无法做json对象转换');
        },
        onJsonToJavaError: function () {
            console.error('请求参数无法转换java对象');
        },
        onNoInterfaceError: function () {
            console.error('请求接口错误');
        },
        onNoServiceError: function () {
            console.error('请求无对应服务');
        },
        onNotLogonError: function () {
            console.error('未登录');
        },
        onParameterCountError: function () {
            console.error('请求参数个数错误');
        },
        onParameterTypeError: function () {
            console.error('请求参数类型错误');
        },
        onPermissionDeniedError: function () {
            console.error('无权限访问');
        },
        onSessionInvalidError: function () {
            console.error('会话失效');
        },
        onTimeoutError: function () {
            console.error('请求超时, 请检查网络设置。');
        },
        onVersionNotSupportError: function () {
            console.error('访问版本不支持');
        },
        onCallServiceOverFrequencyError: function () {
            console.error('服务访问过频');
        },
        onUnhandledError: function (msg) {
            console.error('未处理错误: ' + msg);
        }
    };

    framework.internal.request = function (url, method, data, processData, callback) {
        var jquery = framework.internal.jquery || $;
        if (!jquery) {
            throw new error('framework depends on jQuery, please import jQuery library or call framework.setJQuery($).');
        }
        jquery.ajax({
            url: url,
            type: method,
            data: data,
            processData: processData,
            cache: false,
            async: true,
            dataType: 'text',
            timeout: frameworkConfig.timeout || 30000,
            beforeSend: function (xhr) {
            },
            success: function (rawData, status, xhr) {
                var errorCode = parseInt(xhr.getResponseHeader('error_code'));
                if (errorCode === 200) {
                    // success
                    if (rawData && rawData != '') {
                        rawData = JSON.parse(rawData);
                    }
                    var errCode = 0;
                    if (rawData && rawData.errorCode != null && rawData.errorCode != undefined) {
                        errCode = rawData.errorCode;
                    }
                    var errMsg = 'succeed';
                    if (rawData && rawData.errorMsg != null && rawData.errorMsg != undefined) {
                        errMsg = rawData.errorMsg;
                    }

                    var totalCount = undefined;
                    if (rawData && typeof(rawData.totalCount) == 'number') {
                        totalCount = rawData.totalCount;
                    }
                    var pageCount = undefined;
                    if (rawData && typeof(rawData.pageCount) == 'number') {
                        pageCount = rawData.pageCount;
                    }

                    var resultData = undefined;
                    if (rawData && rawData.data) {
                        resultData = JSON.parse(rawData.data);
                    }
                    if (typeof callback == 'function') {
                        callback(errCode, errMsg, resultData, totalCount, pageCount);
                    }
                } else {
                    framework.internal.errorHandler(errorCode, callback);
                }
            },
            error: function (xhr, status, exception) {
                if (status == 'timeout') {
                    if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.timeoutHandler) {
                        frameworkConfig.errorHandlers.timeoutHandler();
                    } else {
                        framework.internal.defaultErrorHandler.onTimeoutError();
                    }
                } else {
                    if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.unhandledErrorHandler) {
                        frameworkConfig.errorHandlers.unhandledErrorHandler(exception.message || status);
                    } else {
                        framework.internal.defaultErrorHandler.onUnhandledError(exception.message || status);
                    }
                }
                if (typeof callback == 'function') {
                    callback(-1, 'network error');
                }
            }
        });
    };

    framework.internal.getFullUrl = function (url) {

        if (frameworkConfig == null || frameworkConfig.domain == null || frameworkConfig.project == null) {
            throw 'no frameworkConfig found.';
        }
        return frameworkConfig.domain + '/' + frameworkConfig.project + url;
    }

// ws 请求service调用
    framework.internal.ws = null;

// ws service
    framework.internal.wsServiceCallback = function (headerErrorCode, errCode, errMsg, result) {
        var errorCode = headerErrorCode;
        if (errorCode == 200) {
            if (typeof this.callback == 'function') {

                var rawData = result;
                if (rawData != '') {
                    rawData = JSON.parse(rawData);
                }
                this.callback(errCode, errMsg, rawData);
            }
        }
        else {
            framework.internal.errorHandler(errorCode, this.callback);
        }
    };

// 重置service请求的连接
    framework.internal.resetConn = function () {
        if (framework.internal.ws != null) {
            framework.internal.ws.disconnect();
            framework.internal.ws = null;
        }
    };

// 处理全局的错误处理异常
    framework.internal.errorHandler = function (errorCode, callback) {

        if (errorCode == WebsocketClient.prototype.SERVICE_CALL_ERROR_CODE_CLOSE) { // 如果是主动ws主动关闭连接,则不算是错误

        } else if (errorCode == WebsocketClient.prototype.SERVICE_CALL_ERROR_CODE_NETWORK) { // 如果是连接异常
            framework.internal.resetConn();
            if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.networkErrorHandler) {
                frameworkConfig.errorHandlers.networkErrorHandler();
            } else {
                framework.internal.defaultErrorHandler.networkErrorHandler();
            }
        } else if (errorCode == WebsocketClient.prototype.SERVICE_CALL_ERROR_CODE_TIMEOUT) { // 如果是超时

            if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.timeoutHandler) {
                frameworkConfig.errorHandlers.timeoutHandler();
            } else {
                framework.internal.defaultErrorHandler.onTimeoutError();
            }
        }
        else if (errorCode === 100) {
            framework.internal.resetConn();
            if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.notLogonHandler) {
                frameworkConfig.errorHandlers.notLogonHandler();
            } else {
                framework.internal.defaultErrorHandler.onNotLogonError();
            }
        } else if (errorCode === 101) {
            if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.permissionDeniedHandler) {
                frameworkConfig.errorHandlers.permissionDeniedHandler();
            } else {
                framework.internal.defaultErrorHandler.onPermissionDeniedError();
            }
        } else if (errorCode === 102) {
            if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.versionNotSupportHandler) {
                frameworkConfig.errorHandlers.versionNotSupportHandler();
            } else {
                framework.internal.defaultErrorHandler.onVersionNotSupportError();
            }
        } else if (errorCode === 103) {
            framework.internal.resetConn();
            if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.sessionInvalidHandler) {
                frameworkConfig.errorHandlers.sessionInvalidHandler();
            } else {
                framework.internal.defaultErrorHandler.onSessionInvalidError();
            }
        } else if (errorCode === 104) {
            if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.noServiceHandler) {
                frameworkConfig.errorHandlers.noServiceHandler();
            } else {
                framework.internal.defaultErrorHandler.onNoServiceError();
            }
        } else if (errorCode === 105) {
            if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.noInterfaceHandler) {
                frameworkConfig.errorHandlers.noInterfaceHandler();
            } else {
                framework.internal.defaultErrorHandler.onNoInterfaceError();
            }
        } else if (errorCode === 106) {
            if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.jsonConvertErrorHandler) {
                frameworkConfig.errorHandlers.jsonConvertErrorHandler();
            } else {
                framework.internal.defaultErrorHandler.onJsonConvertError();
            }
        } else if (errorCode === 107) {
            if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.parameterCountErrorHandler) {
                frameworkConfig.errorHandlers.parameterCountErrorHandler();
            } else {
                framework.internal.defaultErrorHandler.onParameterCountError();
            }
        } else if (errorCode === 108) {
            if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.parameterTypeErrorHandler) {
                frameworkConfig.errorHandlers.parameterTypeErrorHandler();
            } else {
                framework.internal.defaultErrorHandler.onParameterTypeError();
            }
        } else if (errorCode === 109) {
            if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.jsonToJavaErrorHandler) {
                frameworkConfig.errorHandlers.jsonToJavaErrorHandler();
            } else {
                framework.internal.defaultErrorHandler.onJsonToJavaError();
            }
        } else if (errorCode === 110) {
            if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.businessProcessErrorHandler) {
                frameworkConfig.errorHandlers.businessProcessErrorHandler();
            } else {
                framework.internal.defaultErrorHandler.onBusinessProcessError();
            }
        } else if (errorCode === 111) {
            if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.entityWithoutIdHandler) {
                frameworkConfig.errorHandlers.entityWithoutIdHandler();
            } else {
                framework.internal.defaultErrorHandler.onEntityWithoutIdError();
            }
        } else if (errorCode === 112) {
            if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.dbConnectErrorHandler) {
                frameworkConfig.errorHandlers.dbConnectErrorHandler();
            } else {
                framework.internal.defaultErrorHandler.onDBConnectError();
            }
        } else if (errorCode == 113) {
            if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.fieldValidateErrorHandler) {
                frameworkConfig.errorHandlers.fieldValidateErrorHandler();
            } else {
                framework.internal.defaultErrorHandler.onFieldValidateError();
            }
        }
        else if (errorCode == 114) {
            if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.callServiceOverFrequencyErrorHandler) {
                frameworkConfig.errorHandlers.callServiceOverFrequencyErrorHandler();
            } else {
                framework.internal.defaultErrorHandler.onCallServiceOverFrequencyError();
            }
        } else {
            framework.internal.resetConn();
            if (frameworkConfig && frameworkConfig.errorHandlers && frameworkConfig.errorHandlers.unhandledErrorHandler) {
                frameworkConfig.errorHandlers.unhandledErrorHandler('other error');
            } else {
                framework.internal.defaultErrorHandler.onUnhandledError('other error');
            }
        }
        if (typeof callback == 'function') {
            try {
                callback(errorCode, 'call service error');
            } catch (error) {
                console.error(error);
            }
        }
    }

// service 请求
    framework.internal.callService = function (url, service, func, data, callback) {

        // 判断当前的配置使用 什么协议来访问service
        // 如果使用http协议
        if (frameworkConfig.serviceCallProtocol == "http") {
            framework.internal.sendPost(url, data, callback);
            return;
        }

        // 如果是自动选择,则判断是否可以使用ws
        // 如果不可以使用ws,则默认都使用http
        if (frameworkConfig.serviceCallProtocol == "" || frameworkConfig.serviceCallProtocol == "ws") {
            var ws = framework.internal.ws;
            if (ws != null && ws.isConnected()) {
                framework.internal.ws.callService(service, func, data, framework.internal.wsServiceCallback.bind({callback: callback}), frameworkConfig.timeout);
                return;
            }

            ws = new WebsocketClient();

            ws.setOnclose(function () {
                console.warn("web socket close!");
                framework.internal.ws = null;
            });
            ws.setOnError(function () {
                console.error("web socket error!");
                framework.internal.ws = null;

                // 处理如果连接失败的情况
                framework.internal.wsServiceCallback.call({callback: callback}, WebsocketClient.prototype.SERVICE_CALL_ERROR_CODE_NETWORK);
            });
            ws.setOnConnect(function () {

                var call = function (headerErrorCode, errCode, errMsg, result) {
                    try {
                        callback(headerErrorCode, errCode, errMsg, result);
                    } catch(e) {
                    }
                    if(framework.internal.ws !== ws) {
                        setTimeout(function() {
                            ws.disconnect();
                        }, 3000);
                    }
                }
                this.callService(service, func, data, framework.internal.wsServiceCallback.bind({callback: call}), frameworkConfig.timeout);
            });

            if (!ws.connect("public")) {
                framework.internal.ws = null;
                frameworkConfig.serviceCallProtocol = "http"; // 当前客户端无法使用ws,切换到http模式
                framework.internal.sendPost(url, data, callback);
                return;
            }

            if(framework.internal.ws == null) {
                framework.internal.ws = ws;
            }
            frameworkConfig.serviceCallProtocol = "ws";
            return;

        }

        throw "service call protocol config error!";
    };

    /**
     * 发起GET请求
     * @param {string} params 查询参数
     * */
    framework.internal.sendGet = function (url, params, callback) {
        var fullUrl = framework.internal.getFullUrl(url);
        framework.internal.request(fullUrl, 'GET', params, true, callback);
    };

    /**
     * 发起POST请求
     * @param {string} data 要post的数据
     * */
    framework.internal.sendPost = function (url, data, callback) {
        var fullUrl = framework.internal.getFullUrl(url);
        framework.internal.request(fullUrl, 'POST', data, true, callback);
    };

    /**
     * 发起PUT请求
     * @param {string} data 要put的数据
     * */
    framework.internal.sendPut = function (url, params, callback) {
        var fullUrl = framework.internal.getFullUrl(url);
        framework.internal.request(fullUrl, 'PUT', params, true, callback);
    };

    /**
     * 发起DELETE请求
     * @param {string} params 查询参数
     * */
    framework.internal.sendDelete = function (url, params, callback) {
        var fullUrl = framework.internal.getFullUrl(url);
        framework.internal.request(fullUrl, 'DELETE', params, true, callback);
    };

    return framework;
}));
