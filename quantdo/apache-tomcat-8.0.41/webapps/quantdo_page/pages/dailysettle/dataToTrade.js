myapp.controller('DataToTradeController', function ($scope, $rootScope,$timeout) {	
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});
	$scope.currDate = "";
    $scope.settleDate = "";
    $scope.listEntitys = [];
	//1、实例化服务接口
	//1.1、上场数据生成服务接口
	$scope.service = new com.quantdo.orgClear.service.dataToTradeService();
	
    $scope.progress = false;
    
    $scope.isEven = false;
	$scope.isOdd = true;

    // 按钮权限
    $scope.dataToTrade_generate = isShow("dataToTrade_generate");
    $scope.dataToTrade_audit = isShow("dataToTrade_audit");
    $scope.dataToTrade_upload = isShow("dataToTrade_upload");

    //上场数据生成
    $scope.generateTradeData = function (object) {
    	var settleDate =$scope.settleDate;
    	if (settleDate ==""){
    		layer.msg("下一交易日日期不能为空!", {icon: 2, time: 3000});
        	return false;
    	}
    	
    	$scope.service.checkUploadUniInstrument($scope.settleDate,function (result) {
    		if(result == 0){
    			var string = "";
    		}else if(result == 1){
    			var string = "未导入合约，";
    		}else if(result == 2){
    			var string = "未导入关联关系，";
    		}else if(result == 3){
    			var string = "未导入合约及关联关系，";
    		}
    		
    		layer.confirm(string + '确定进行交易上场数据生成？', {icon:3}, function(count){
        		
        		layer.close(count);
        		$scope.progress = true;
        		$scope.$apply();
        		
        		//$scope.service.generatemarginAndFeeData($scope.settleDate,function () {
                  	$scope.service.generateTradeData($scope.settleDate,function (errCode) {
                  		if(errCode == 0){
                  			layer.msg("上场数据生成成功!", {icon: 1, time: 3000});
                			$scope.$apply();
                			
                			getDate();
                  		}
                		$scope.progress = false;        	    		
                	});
        			         	    		
            	//});

        	});
    	});
    	

    }
    
    $scope.audit = function(){
    	$scope.service.audit(function(result){
    		$scope.listEntitys = result;
    		var count = 0;
			angular.forEach($scope.listEntitys,function(data,index,array){
				if(data.spanNum !== undefined){
					count += 1;
				}
				if(count %2 == 0){
					data.isOdd = true;
					data.isEven = false;
				}
				else{
					data.isOdd = false;
					data.isEven = true;
				}
				$scope.$apply();
			});
    		$scope.$apply();
    	});
    }
    
    //获取当前交易日
    function getDate() {
    	
    	$scope.service.getCurrDate(function(result) {
    		
    		$scope.currDate = result;
    		//$scope.$apply();
    		
        	if ($scope.currDate == "") {
        		
        		$scope.settleDate = clearConstant.formatDate(new Date());
        		$scope.$apply();
        	} else {
        		$scope.$apply();
            	getNextTradeDate($scope.currDate, function (errCode, errMsg, result) {
            		
            		if (errCode != 0) {
            			
            			layer.msg(errMsg, {icon: 2, time: 10000});
            		}
            		else {
            			
            			$scope.settleDate = result;
            			$scope.$apply();
            		}
            		
            	});
        	}
    	});
    	
    	

    }
    
    //获取当前交易日
    getDate();
    
  //导入
    $("#uploadUniInstrument").uploadFile({
        url: framework.file.uploadUrl("dataToTradeService", "uploadUniInstrument"),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
            	if(result.errorFlg != "succ") {                	
                    layer.alert(result.errorMessages,{icon: 2});
                } else {
                	layer.alert("成功导入"+result.type+"文件",{icon: 1});
                }
            	$("#uploadUniInstrumentModal").modal("hide");
            });                 
        },
        onSelect: function (files) {
            var file = files[0];
            var fileName = file.name;
            var suffix = fileName.substring(fileName.lastIndexOf('.') + 1);
            if(suffix != "csv" && suffix != "CSV" ){
                layer.confirm('上传文件必须为.csv文件格式', {icon: 2,btn:['关闭']});
                return false;
            }
            return true;
        }
    });
    
});
