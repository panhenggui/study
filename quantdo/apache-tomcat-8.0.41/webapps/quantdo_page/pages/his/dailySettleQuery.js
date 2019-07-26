myapp.controller('DailySettleQueryServiceController', function ($scope, $timeout,$rootScope) {
	
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});	

	$scope.dailySettleQuery_query = isShow("dailySettleQuery_query");
	$scope.dailySettleQuery_export = isShow("dailySettleQuery_export");
	
	//2、定义页面数据模型
    $scope.queryEntity = {};    //实际查询对象
    $scope.queryEntity.settleDate = clearConstant.formatDate(new Date());
	$scope.capitalAccountEntitys = [];			//所有资金帐号
    $scope.queryAccountEntitys = [];			//查询帐号下拉框内容
    $scope.ModalEntity = {};                    //查询结果对象
    
    //判定登录用户是否为单一机构
    queryInstClientID(function(result){
    	if(result != undefined){
    		$scope.noInst = true;
    	}else{
    		$scope.noInst = false;
    	}
    });
    
    //获取机构列表
    $scope.instClientList = null;
    getInstClientQueryConditionList(function(result){
    	$scope.instClientList = angular.copy(result);
    	if($scope.instClientList.length > 1){
    		$scope.queryEntity.instClientID = "";
    	}else{
    		$scope.queryEntity.instClientID = $scope.instClientList[0].instClientID;
    	}
    });
    
    //获取所有资金帐号
    getAllCapitalAccountEntity(function (result) {
    	$scope.capitalAccountEntitys = [];
    	if(result == null || result == undefined || result ==""){
    		$scope.isQuery = true;
    	}else{
    		$scope.isQuery = false;
    	} 
        for(var i = 0 ;i < result.length ; i++){
        	$scope.capitalAccountEntitys.push(result[i]);
        }
        $scope.queryAccountEntitys = $scope.capitalAccountEntitys;
        $scope.queryEntity.innerAccountID =  $scope.queryAccountEntitys[0];
        $scope.find($scope.queryEntity);
        $scope.$apply();
    });
    
    //机构和资金账号的联动
    $scope.changeInstClient = function(){
    	$scope.queryAccountEntitys = [];
		//查询资金账号
		findCapitalAccountByQuery({"brokerageFirmID":$scope.queryEntity.instClientID}, function(result){
			if(result == null || result == undefined || result ==""){
	    		$scope.isQuery = true;
	    	}else{
	    		$scope.isQuery = false;
	    	}
			angular.forEach(result, function (value, index, arrays) {
				$scope.queryAccountEntitys.push(value);
			});
			$scope.queryEntity.innerAccountID =  $scope.queryAccountEntitys[0];
			$scope.$apply();
		});
	}
    
    // 根据页面条件查询
    $scope.find = function (queryEntity) {  
    	$scope.isQuery = true;
    	$scope.ModalEntity = {};
        findDailySettleQuery(function(result){
        	if(result == null || result == undefined){
        		layer.msg("未能找到该日结单，请修改查询条件", {icon: 2, time: 3000});
        		$scope.isQuery = false;
        		$scope.$apply();
        	}else{
        		var queryStr = "";
        		for(var i=0;i<result.length;i++){
        			result[i] += "\r";
        			queryStr += result[i];	
        		}
        		$scope.ModalEntity.queryResult = queryStr;
        		$scope.isQuery = false;
        		$scope.$apply();
        	}
        },queryEntity.settleDate,queryEntity.innerAccountID.innerAccountID);
    };
    
    // 根据页面条件下载
    $scope.exportDailySettleExcel = function (queryEntity) {
    	findDailySettleQuery(function(result){
        	if(result == null || result == undefined){ // 先判定是否有所需要的文件
        		layer.msg("未能找到该日结单，请修改查询条件,下载失败！", {icon: 2, time: 3000});
        	}else{
        		framework.file.download('dailySettleQueryService','exportDailySettleExcel', "", //下载所需要的文件
            			queryEntity.settleDate, queryEntity.innerAccountID.innerAccountID, function(errCode, errMsg) {
        			if (errCode != 0) {
        				alert(errCode + ': ' + errMsg);
        			}
        		});
        	}
        },queryEntity.settleDate,queryEntity.innerAccountID.innerAccountID); 	
    };
});

