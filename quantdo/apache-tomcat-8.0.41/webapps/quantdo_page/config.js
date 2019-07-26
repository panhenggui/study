var frameworkConfig = {
	domain: '',
//	domain: window.require('electron').remote.getGlobal('frameworkConfig').domain,
	wsdomain: '',
//	wsdomain: window.require('electron').remote.getGlobal('frameworkConfig').wsdomain,
	project: 'quantdo',
//	project: window.require('electron').remote.getGlobal('frameworkConfig').projectName,
	timeout: 1800000,
	domain1: '',
	project1: '',
	domain2: '',
	project2: '',
	serviceCallProtocol: "http", // 前端调用service选用的协议, "" 系统会自动选择(优先选择ws,如果不支持再选择http), "http" http调用, "ws" websocket调用
	errorHandlers: {
		// 自定义错误处理文件路径, 从app根目录开始
		notLogonHandler: function(){
            //读取cookie
            //获取指定名称的cookie的值
            var a = true;
          var objName = window.localStorage.getItem("encryption")
          if( typeof( window.localStorage.getItem("encryption")) == "undefined"){
                  a = false;
          }else if ("longonV8" == window.localStorage.getItem("encryption")){
                  a = true;
          }else{
              a = false;
          }

            if(a){

            window.location.href= "login/loginv8.html"

            }
           else if (window.localStorage.getItem("ipadress")){
              // const electron = window.require('electron');
              // const {ipcRenderer} = electron;
              // ipcRenderer.send("closeMainWindow");
        }else{

                window.location.href="login/login.html"

			}
		},
		// permissionDeniedHandler: 'service/errorHandlers/permissionDeniedHandler.js',
		// versionNotSupportHandler: 'service/errorHandlers/versionNotSupportHandler.js',
		// sessionInvalidHandler: 'service/errorHandlers/sessionInvalidHandler.js',
		// noServiceHandler: 'service/errorHandlers/noServiceHandler.js',
		// noInterfaceHandler: 'service/errorHandlers/noInterfaceHandler.js',
		// jsonConvertErrorHandler: 'service/errorHandlers/jsonConvertErrorHandler.js',
		// parameterCountErrorHandler: 'service/errorHandlers/parameterCountErrorHandler.js',
		// parameterTypeErrorHandler: 'service/errorHandlers/parameterTypeErrorHandler.js',
		// jsonToJavaErrorHandler: 'service/errorHandlers/jsonToJavaErrorHandler.js',
		// businessProcessErrorHandler: 'service/errorHandlers/businessProcessErrorHandler.js',
		// entityWithoutIdHandler: 'service/errorHandlers/entityWithoutIdHandler.js',
		// dbConnectErrorHandler: 'service/errorHandlers/dbConnectErrorHandler.js',
		// fieldValidateErrorHandler: function(msg){alert('字段校验异常：' + msg)},
		// callServiceOverFrequencyErrorHandler: function(){alert('服务访问过频');},
		timeoutHandler: function(){alert('自定义错误处理：超时');},
		unhandledErrorHandler: function(msg){alert('自定义未处理错误处理：' + msg);}
	},




	changeDomain: function() { // 如果有多个服务端要访问，这种写法用于切换服务端地址，由于使用的是全局变量，要注意异步的问题
		this.domain = this.domain1;
		this.project = this.project1;
	},
	changeDomain1:function() { // 如果有多个服务端要访问，这种写法用于切换服务端地址，由于使用的是全局变量，要注意异步的问题
		this.domain = this.domain2;
		this.project = this.project2;
	}
};
;(function(root) {
	//domain为空时默认取当前host
	if(!frameworkConfig.domain || frameworkConfig.domain=="") {
		frameworkConfig.domain = window.location.protocol+"//"+ window.location.host;
	}
	if(frameworkConfig.domain=="file://"){
		if(window.localStorage.getItem("ipadress")){
            frameworkConfig.domain = window.localStorage.getItem("ipadress");
		}else{
            frameworkConfig.domain = "http://127.0.0.1:8080";
		}

	}				
	if(!frameworkConfig.wsdomain || frameworkConfig.wsdomain=="") {
		if(window.location.protocol=="https:"){
			frameworkConfig.wsdomain = "wss://"+ window.location.host;
		}else{
			frameworkConfig.wsdomain = "ws://"+ window.location.host;
		}			
	}	
	if(frameworkConfig.wsdomain=="ws://"){
		frameworkConfig.wsdomain = "ws://127.0.0.1:8080";
	}				
})(window);