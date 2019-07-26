myapp.controller('DailyProfitlossController', function ($scope, $rootScope,$timeout) {
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});	
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$scope.dailyProfitlossService = new com.quantdo.orgClear.service.dailyProfitlossService();
	
	$scope.sumDailyFee = 0;
	$scope.sumDailyProfitless = 0;
	
	$scope.searchTypes = clearConstant.dailyProfitloss_searchType;	//查询方式下拉框内容
	//2、定义页面数据模型
    $scope.queryEntity = {};    //实际查询对象
    $scope.queryEntity.searchType = $scope.searchTypes[0].key;
    
    $scope.isShow = 1;//根据查询方式决定显示什么表格
    $scope.queryEntity.tradeDate = clearConstant.formatDate(new Date());
    
    // 按钮权限
    $scope.dailyProfitloss_query = isShow("dailyProfitloss_query");
    $scope.dailyProfitloss_export = isShow("dailyProfitloss_export");
    
    // 初始化机构
    $scope.instClientList = null;
    getInstClientQueryConditionList(function(result){
    	$scope.instClientList = angular.copy(result);
    	if($scope.instClientList.length > 1){
    		$scope.queryEntity.instClientID = "";
    	}else{
    		$scope.queryEntity.instClientID = $scope.instClientList[0].instClientID;
    	}
    });
    
    queryInstClientID(function(result){
    	if(result != undefined){
    		$scope.noInst = true;
    	}else{
    		$scope.noInst = false;
    	}
    });  

    //定义系统用户管理表的固定列头
    $scope.dailyProfitloss_columnsOne = [
        {title: "序号"},
        {title: "资产单元"},
        {title: "当日手续费"},
        {title: "当日总盈亏"},
        {title: "所属机构"}
    ]; 
    $scope.dailyProfitloss_columnsTwo = [
	    {title: "序号"},
        {title: "策略代码"},
        {title: "当日手续费"},
        {title: "当日总盈亏"},
        {title: "所属机构"}
	]; 
    $scope.dailyProfitloss_columnsThree = [
    	{title: "序号"},
        {title: "策略批次"},
        {title: "当日手续费"},
        {title: "当日总盈亏"},
        {title: "所属机构"}
    ]; 
    
    $scope.tmpQuery = {};
    $scope.find = function (queryEntity)  {
    	if(queryEntity.tradeDate == ""){
    		layer.msg('日期不可为空！', {
				icon : 2
			});
    		return false;
    	}
    	$scope.isQuery = true;    
    	$scope.isShow = queryEntity.searchType;
    	if(queryEntity.searchType == "1"){	                            // 资产单元
    		$scope.dailyProfitlossService.findBySub(function(result){
    			$scope.sumDailyFee = 0;//当日手续费
    		    $scope.sumDailyProfitloss = 0;//当日盈亏
    		    if(result != null && result.length > 0){
    	    		for(i = 0;i < result.length;i++){
    	    			$scope.sumDailyFee += result[i].dailyFee;
    	    			$scope.sumDailyProfitloss += result[i].dailyProfitloss;
    	        	}
    	    	}
    			$scope.findTem(result);
    			
    			$scope.$apply();
    		},queryEntity);
    	}else if(queryEntity.searchType == "2"){					// 策略代码
    		$scope.dailyProfitlossService.findByStrategyID(function(result){
    			$scope.sumDailyFee = 0;//当日手续费
    		    $scope.sumDailyProfitloss = 0;//当日盈亏
    		    if(result != null && result.length > 0){
    	    		for(i = 0;i < result.length;i++){
    	    			$scope.sumDailyFee += result[i].dailyFee;
    	    			$scope.sumDailyProfitloss += result[i].dailyProfitloss;
    	        	}
    	    	}
    			$scope.findTem(result);
    			
    			$scope.$apply();
    		},queryEntity);
    	}else if(queryEntity.searchType == "3"){					// 策略批次
    		$scope.dailyProfitlossService.findByStrategyBatch(function(result){
    			$scope.sumDailyFee = 0;//当日手续费
    		    $scope.sumDailyProfitloss = 0;//当日盈亏
    		    if(result != null && result.length > 0){
    	    		for(i = 0;i < result.length;i++){
    	    			$scope.sumDailyFee += result[i].dailyFee;
    	    			$scope.sumDailyProfitloss += result[i].dailyProfitloss;
    	        	}
    	    	}
    			$scope.findTem(result);
    			
    			$scope.$apply();
    		},queryEntity);
    	}
    	$timeout(function() {
            $scope.isQuery = false;
        }, 1000);
    };
    
    $timeout(function() {
    	$scope.find($scope.queryEntity);
    }, 1000);
    
	// 查询(前台分页)
    $scope.findTem = function(result){
    	//将数据集赋值为空
    	$scope.dailyProfitlossDataset = [];
    	//更新表格对应的数据集
    	var con = result;
    	var tempArray = new Array();
    	if(con != undefined){
    		for(var i = 0; i<con.length;i++){
    			if($scope.isShow==1){
    				var tempArr = [(i+1),con[i].subAccountId,con[i].dailyFee.toFixed(2),con[i].dailyProfitloss.toFixed(2),$scope.transInstClient(con[i].instClientID)];
    			    $scope.dailyProfitlossDataset.push(tempArr);      
    			}else if($scope.isShow==2){
    				var tempArr = [(i+1),con[i].strategyID,con[i].dailyFee.toFixed(2),con[i].dailyProfitloss.toFixed(2),$scope.transInstClient(con[i].instClientID)];
    		        $scope.dailyProfitlossDataset.push(tempArr);       
    			}else if($scope.isShow==3){
    				var tempArr = [(i+1),con[i].strategyBatch,con[i].dailyFee.toFixed(2),con[i].dailyProfitloss.toFixed(2),$scope.transInstClient(con[i].instClientID)];
    			    $scope.dailyProfitlossDataset.push(tempArr);       
    			}  
            }
    	}
    	
        //重新绘表
        if($scope.isShow==1){
        	$scope.dailyProfitlossTableOne.clear().draw();
	        $scope.dailyProfitlossTableOne.rows.add($scope.dailyProfitlossDataset).draw();
        }else if($scope.isShow==2){
	        $scope.dailyProfitlossTableTwo.clear().draw();
	        $scope.dailyProfitlossTableTwo.rows.add($scope.dailyProfitlossDataset).draw();
        }else if($scope.isShow==3){
	        $scope.dailyProfitlossTableThree.clear().draw();
	        $scope.dailyProfitlossTableThree.rows.add($scope.dailyProfitlossDataset).draw();
        }        
    }
    
    $scope.transInstClient = function (instClientID) {
    	for(var i = 0;i < $scope.instClientList.length; i++){
    		if($scope.instClientList[i].instClientID == instClientID){
    			return $scope.instClientList[i].instClientAbbrName;
    		}
    	}
    }
    
    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	
    	$scope.dailyProfitlossTableOne = $('#dailyProfitloss_dynamic_tableOne').DataTable( {
    		data : $scope.dailyProfitlossDataset,
        	columns :$scope.dailyProfitloss_columnsOne,
            dom: 'rt<"bottom"iplB>',
            footerCallback: function () {
                var api = this.api();
				$( api.column( 2 ).footer() ).html(parseFloat($scope.sumDailyFee).toFixed(2));
				$( api.column( 3 ).footer() ).html(parseFloat($scope.sumDailyProfitloss).toFixed(2));
        	},
            buttons: []
        });
   
        $scope.dailyProfitlossTableTwo = $('#dailyProfitloss_dynamic_tableTwo').DataTable( {
    		data : $scope.dailyProfitlossDataset,
        	columns :$scope.dailyProfitloss_columnsTwo,
            dom: 'rt<"bottom"iplB>',
            footerCallback: function () {
                var api = this.api();
				$( api.column( 2 ).footer() ).html(parseFloat($scope.sumDailyFee).toFixed(2));
				$( api.column( 3 ).footer() ).html(parseFloat($scope.sumDailyProfitloss).toFixed(2));
        	},
			buttons: []
        });
        
        $scope.dailyProfitlossTableThree = $('#dailyProfitloss_dynamic_tableThree').DataTable( {
    		data : $scope.dailyProfitlossDataset,
        	columns :$scope.dailyProfitloss_columnsThree,
            dom: 'rt<"bottom"iplB>',
            footerCallback: function () {
                var api = this.api();
				$( api.column( 2 ).footer() ).html(parseFloat($scope.sumDailyFee).toFixed(2));
				$( api.column( 3 ).footer() ).html(parseFloat($scope.sumDailyProfitloss).toFixed(2));
        	},
			buttons: []
        });

    });

    //导出excel
	$scope.exportExcelDailyProfitloss = function (queryEntity) {
        if(queryEntity.searchType == "1"){	
			framework.file.export("日盈亏报表.xls",'excel',{
				entityKey:['subAccountId','dailyFee','dailyProfitloss','instClientName'],         
				headerKey:['资产单元','当日手续费','当日盈亏','所属机构'],
	            styles:['plainText','plainText','plainText','plainText'],
				title:"日盈亏报表",
				dicMap:{}
			},"dailyProfitlossService","exportExcelBySub",queryEntity);
        }else if(queryEntity.searchType == "2"){
        	framework.file.export("日盈亏报表.xls",'excel',{
        		entityKey:['strategyID','dailyFee','dailyProfitloss','instClientName'],         
				headerKey:['策略代码','当日手续费','当日盈亏','所属机构'],
	            styles:['plainText','plainText','plainText','plainText'],
				title:"日盈亏报表",
				dicMap:{}
			},"dailyProfitlossService","exportExcelByStrategyID",queryEntity);
        }else if(queryEntity.searchType == "3"){
        	framework.file.export("日盈亏报表.xls",'excel',{
        		entityKey:['strategyBatch','dailyFee','dailyProfitloss','instClientName'],         
				headerKey:['策略批次','当日手续费','当日盈亏','所属机构'],
	            styles:['plainText','plainText','plainText','plainText'],
				title:"日盈亏报表",
				dicMap:{}
			},"dailyProfitlossService","exportExcelByStrategyBatch",queryEntity);
        }
	};
});

