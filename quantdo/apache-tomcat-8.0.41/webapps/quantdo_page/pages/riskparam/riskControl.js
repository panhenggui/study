myapp.controller('RiskWarnResultController', function($scope, $timeout, $rootScope) {

	$scope.riskTypes = clearConstant.riskTypes;
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
    $scope.status = "刷新中.....";
    $scope.tabFlag = "riskControl";
	// 添加定时器
	$scope.isStart =true ;
	$scope.isStop = false;
	$scope.queryEntity = {
		instClientID :"",
		fundProductID : ""
	};
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
    //初始化机构信息
    $scope.instClientService.findByQuery(function (result) {
        $scope.instClientlistEntitys = result;
        $scope.$apply();
    },{});
    
    $scope.instClientID = '';
    queryInstClientID(function (result) {
        $scope.instClientID = result;
        $scope.queryEntity={};
        if($scope.instClientID != undefined ){
        	$scope.isInstClient = true;
        	$scope.queryEntity.instClientID=$scope.instClientID;
    		$scope.isInstClientSelect($scope.queryEntity.instClientID);
        }else{
        	$scope.isInstClient = false;

        }

    });
    
    $scope.fundProductTems=[];
    $scope.isInstClientSelect = function (instClientId) {
    	$scope.fundProductTems=[];
    	$scope.queryEntity={};
    	$scope.queryEntity.instClientID=instClientId;
    	findFundProduct(function (result) {
        	$scope.fundProductTems=result;
        	$scope.$apply();
        },{instClientID:instClientId});
    };
	
    //机构名称转换
    $scope.transInstClient = function (instClientID) {
    	for(var i = 0;i < $scope.instClientlistEntitys.length; i++){
    		if($scope.instClientlistEntitys[i].instClientID == instClientID){
    			return $scope.instClientlistEntitys[i].instClientAbbrName;
    		}
    	}
    }
    
	// 初始化页面产品下拉
	getAllFundProductEntity(function(result) {
		$scope.fundProducts = angular.copy(result);
		$scope.$apply();
	});

	// 产品选择事件
	$scope.findFundNetValueByProId = function(queryEntity) {
		findFundNetValueByProId(function(result) {
			 transEntity(result);
			// 初始化页面预警结果信息
				findAllRiskWarnEntity(function(resultRiskWarn) {
					$scope.resultListEntitys = angular.copy(resultRiskWarn);
					$scope.$apply();
				},queryEntity);
			$scope.$apply();
		}, queryEntity);
	};

	findFundNetValueByProId(function(result) {
		 transEntity(result);
		// 初始化页面预警结果信息
		findAllRiskWarnEntity(function(resultRiskWarn) {
			$scope.resultListEntitys = angular.copy(resultRiskWarn);
			$scope.$apply();
		},$scope.queryEntity);
	}, $scope.queryEntity);
	
    $scope.timer = setInterval(function (){
    	findFundNetValueByProId(function(result) {
			 transEntity(result);
			// 初始化页面预警结果信息
			findAllRiskWarnEntity(function(resultRiskWarn) {
				$scope.resultListEntitys = angular.copy(resultRiskWarn);
				$scope.$apply();
			},$scope.queryEntity);
		}, $scope.queryEntity);
    },"2000");

	// 定时器开始
	$scope.start = function() {
		$scope.timeSet = 5;
		$scope.resultListEntitys = [];
		$scope.isStart = true;
		$scope.isStop = false;
	    $scope.status = "刷新中.....";
		clearInterval($scope.timer);
		var st = 2 * 1000;
		findFundNetValueByProId(function(result) {
			 transEntity(result);
			// 初始化页面预警结果信息
			findAllRiskWarnEntity(function(resultRiskWarn) {
				$scope.resultListEntitys = angular.copy(resultRiskWarn);
				$scope.$apply();
			},$scope.queryEntity);
		}, $scope.queryEntity);
		$scope.timer = setInterval(function() {
			findFundNetValueByProId(function(result) {
				 transEntity(result);
				// 初始化页面预警结果信息
				findAllRiskWarnEntity(function(resultRiskWarn) {
					$scope.resultListEntitys = angular.copy(resultRiskWarn);
					$scope.$apply();
				},$scope.queryEntity);
			}, $scope.queryEntity);
		}, st.toString());
	};

	// 定时器结束
	$scope.stop = function() {
		clearInterval($scope.timer);
		$scope.isStart = false;
		$scope.isStop = true;
    	$scope.status = "刷新停止 ！";
	}

	// 处理
	$scope.dealRisk = function(index, entity) {
		dealRisk(function(result) {
			$scope.resultListEntitys.splice(index, 1, result);
			$scope.$apply();
		}, entity);
	};

	// 转换风控类型
	$scope.transRiskType = function(text) {
		var count = $scope.riskTypes.length;
		for (var i = 0; i < count; i++) {
			if ($scope.riskTypes[i].key == text) {
				return $scope.riskTypes[i].text;
			}
		}
	}
	
	function transEntity(entity){
		$scope.listEntitys=[];
		angular.forEach(entity, function(value, index, arrays) {
			if(value.marginRatio != null && value.marginRatioThreshold != null){
				if(eval(value.marginRatio) >= eval(value.marginRatioThreshold)){
					value.marginRatioFlag = true;
				}else{
					value.marginRatioFlag = false;
				}
			}
			value.marginRatioThreshold=	transFormShow(value.marginRatioThreshold);
			value.marginRatio=transFormShow(value.marginRatio);
			if(value.netMarginRatio != null && value.netMarginRatioThreshold != null){
				if(eval(value.netMarginRatio) >= eval(value.netMarginRatioThreshold)){
					value.netMarginRatioFlag = true;
				}else{
					value.netMarginRatioFlag = false;
				}
			}
			value.netMarginRatioThreshold=transFormShow(value.netMarginRatioThreshold);
			value.netMarginRatio=transFormShow(value.netMarginRatio);
			if(value.singleMarginRatio != null && value.singleMarginRatioThreshold != null){
				if(eval(value.singleMarginRatio) >= eval(value.singleMarginRatioThreshold)){
					value.singleMarginRatioFlag = true;
				}else{
					value.singleMarginRatioFlag = false;
				}
			}
			value.singleMarginRatioThreshold=transFormShow(value.singleMarginRatioThreshold);
			value.singleMarginRatio=transFormShow(value.singleMarginRatio);
			if(value.productGroupMarginRatio != null && value.productGroupMarginRatioThreshold != null){
				if(eval(value.productGroupMarginRatio) >= eval(value.productGroupMarginRatioThreshold)){
					value.productGroupMarginRatioFlag = true;
				}else{
					value.productGroupMarginRatioFlag = false;
				}
			}
			value.productGroupMarginRatioThreshold=transFormShow(value.productGroupMarginRatioThreshold);
			value.productGroupMarginRatio=transFormShow(value.productGroupMarginRatio);
			if(value.positionCostRatio != null && value.positionCostRatioThreshold != null){
				if(eval(value.positionCostRatio >= value.positionCostRatioThreshold)){
					value.positionCostRatioFlag = true;
				}else{
					value.positionCostRatioFlag = false;
				}
			}
			value.positionCostRatioThreshold=transFormShow(value.positionCostRatioThreshold);
			value.positionCostRatio=transFormShow(value.positionCostRatio);
			if(value.netPosCostRatio != null && value.netPosCostRatioThreshold != null){
				if(eval(value.netPosCostRatio) >= eval(value.netPosCostRatioThreshold)){
					value.netPosCostRatioFlag = true;
				}else{
					value.netPosCostRatioFlag = false;
				}
			}
			value.netPosCostRatioThreshold=transFormShow(value.netPosCostRatioThreshold);
			value.netPosCostRatio=transFormShow(value.netPosCostRatio);
			$scope.listEntitys.push(value);
		});
		
	}
	
	function transFormShow(value){
		if(value == null){
			return null;
		}else{
			value=value*100;
			value=value.toFixed(2);
			value=value+"%";
			return value;
		}
	}
	
    //导出excel
    $scope.exportExcel = function (queryEntity) {
    	var date = clearConstant.formatDate(new Date());
    	framework.file.export(date+"预警结果.xls",'excel',{
			entityKey:['warnDate','warnTime','instClientAbbrName','shortProductName','riskType','warnInfo','isHandled'],
			headerKey:['预警日期','预警时间','所属机构','产品简称','风控指标','预警信息','状态'],
			styles:['plainText','plainText','plainText','plainText','plainText','plainText','plainText'],
			title:date+"预警结果导出数据",
			dicMap:{riskType:{'1':"产品净值",'2':"交割期交易权限"},isHandled:{'0':"未处理",'1':"已处理"}}
		},"riskWarnResultService","findRiskWarnByProId",queryEntity.fundProductID, queryEntity.instClientID);
    };

});
