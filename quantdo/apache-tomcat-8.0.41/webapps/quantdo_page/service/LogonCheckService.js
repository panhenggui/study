;(function(root) {
    framework.service.request('productService', 'findById', 1, function (errCode, errMsg, result) {	        
    	if (errCode != 0) {            
//            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
    	}
    });		
})(window);