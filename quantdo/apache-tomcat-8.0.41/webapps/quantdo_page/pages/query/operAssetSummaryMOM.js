myapp.controller('OperAssetSummaryMOMController', function ($scope,DTOptionsBuilder, $timeout, $rootScope) {
	
	$scope.dtOptions = DTOptionsBuilder.newOptions()
		.withOption('scrollY', '500')
		//.withOption('scrollX', '110%')
		//.withDOM("ft")
		//.withOption('scrollCollapse', true)
		//.withOption('paging', false)
		.withFixedColumns({
			topColumns: 1
			//rightColumns: 1
		});
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	$scope.flag = 'MOM';
	
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
	
	 //初始化机构信息
   $scope.instClientService.findByQuery(function (result) {
       $scope.instClientlistEntitys = result;
       $scope.$apply();
   },{});
   
   //机构名称转换
   $scope.transInstClient = function (instClientID) {
   	for(var i = 0;i < $scope.instClientlistEntitys.length; i++){
   		if($scope.instClientlistEntitys[i].instClientID == instClientID){
   			return $scope.instClientlistEntitys[i].instClientAbbrName;
   		}
   	}
   }
	
    //初始化页面信息
    $scope.queryEntity = {
    	sleepTime:5
    };
    $scope.timeSet = 5;
    $scope.listEntitys = [];
    $scope.listEntity = [];
    $scope.entityItem = {};
    $scope.direction = clearConstant.tradeDirection;
    $scope.rowSpan = [];
    $scope.isStart = true;
    $scope.isStop = false;
    $scope.status = "轮询中.....";
    
    $scope.transDirections = function (direction){
    	for(var i = 0;i < $scope.direction.length; i++){
    		if($scope.direction[i].key == direction){
    			return $scope.direction[i].text;
    		}
    	}
    }
    
    //初始化页面记录
    exportAllOperAssetSummary(function (result) {
        $scope.listEntitys = result;
        $scope.timeSet = $scope.queryEntity.sleepTime;
		$scope.flag2 = "0";
		$scope.flag3 = "0";
		angular.forEach($scope.listEntitys,function(data,index){
			$scope.flag1 = data.spanNum;
			if(data.spanNum == undefined){
				data.flagBot = $scope.flag2;
			}else{
				if($scope.flag1 != $scope.flag3){
					data.flagBot = Number($scope.flag2)+Number($scope.flag1);
					$scope.flag3 = $scope.flag1;
					$scope.flag2 = Number($scope.flag2)+Number($scope.flag1);

				}
			}
		})
        $scope.$apply();
    });
    
    $scope.timer = setInterval(function (){
	   exportAllOperAssetSummary(function (result) {
           $scope.listEntitys = result;
           $scope.timeSet = $scope.queryEntity.sleepTime;
		   $scope.flag2 = "0";
		   $scope.flag3 = "0";
		   angular.forEach($scope.listEntitys,function(data,index){
			   $scope.flag1 = data.spanNum;
			   if(data.spanNum == undefined){
				   data.flagBot = $scope.flag2;
			   }else{
				   if($scope.flag1 != $scope.flag3){
					   data.flagBot = Number($scope.flag2)+Number($scope.flag1);
					   $scope.flag3 = $scope.flag1;
					   $scope.flag2 = Number($scope.flag2)+Number($scope.flag1);

				   }
			   }
		   })
           $scope.$apply();
       });
   },"5000");
    	
    //查询
    $scope.find = function (queryEntity) {
    	if(queryEntity.sleepTime < 5){
    		layer.msg("轮询间隔必须大于5秒",{icon:2, time:1000});
    		return false;
    	}else{
    		$scope.timeSet = queryEntity.sleepTime;
	        $scope.listEntitys = [];
	        $scope.status = "轮询中.....";
	        $scope.isStart = true;
	        $scope.isStop = false;
	        clearInterval($scope.timer);
	        var st = queryEntity.sleepTime *1000;
	        exportAllOperAssetSummary(function (result) {
	            $scope.listEntitys = result;
	            $scope.$apply();
	        });
	        $scope.timer = setInterval(function (){
	        	exportAllOperAssetSummary(function (result) {
	                $scope.listEntitys = result;
	                $scope.$apply();
	            });
	        },st.toString());
        }
    };
    
    $scope.stop = function (){
    	clearInterval($scope.timer);
    	 $("#sleepTime").focus();
    	$scope.isStart = false;
    	$scope.isStop = true;
    	$scope.status = "轮询停止";
    }
    
    $scope.exportExcel = function(){
    	framework.file.export("实时资产汇总.xls",'excel_f',{
			title:"实时资产汇总",
			ftlFile:"templates/table",
			extendParams:{a:'账号',b:'持仓品种',c:'方向',d:'持仓量',e:'结算权益',f:'结算价',
				g:'市价',h:'持仓浮动损益',i:'持仓保证金',j:'即时权益',k:'平仓盈亏',l:'浮盈',m:'机构代码'}
		},"operAssetSummaryMOMService","getExportData");
    }
});

