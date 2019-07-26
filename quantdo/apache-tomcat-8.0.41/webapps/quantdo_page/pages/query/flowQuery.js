myapp.controller('FlowQueryController', function ($scope, $timeout,$rootScope) {
    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
    $scope.flowQueryService = new com.quantdo.orgClear.service.FlowQueryService();
    
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	$scope.tabFlag = "flowQuery";
	
    $scope.queryEntity = {};
    $scope.instClientList = null;
    
    $scope.isStart = false;
    $scope.isStop = true;
    $scope.status = "轮询停止";
    
    $scope.flowQuery_start = isShow("flowQuery_start");
    $scope.flowQuery_stop = isShow("flowQuery_stop");

    
    queryInstClientID(function(result){
    	if(result != undefined){
    		$scope.noInst = true;
    	}else{
    		$scope.noInst = false;
    	}
    });
    
    getInstClientQueryConditionList(function(result){
    	$scope.instClientList = angular.copy(result);
    	if($scope.instClientList.length > 1){
    		$scope.queryEntity.instClientID = "";
    	}else{
    		$scope.queryEntity.instClientID = $scope.instClientList[0].instClientID;
    	}
    	$scope.$apply();
    });
    
    //所有资金帐号
    getAllCapitalAccountEntity(function (result) {
    	$scope.queryAccountEntitys = [];
        $scope.queryAccountEntitys = result;
        $scope.$apply();
    });
    
    $scope.changeInstClient = function(){
    	if("" == $scope.queryEntity.instClientID){
    		$scope.queryEntity.instClientID = null;
    	}
		//资金账号
		findCapitalAccountByQuery({"brokerageFirmID":$scope.queryEntity.instClientID}, function(result){
			$scope.queryAccountEntitys = result;
			$scope.$apply();
		});
	}
    
    $scope.listEntitys = [];

	 //定义系统用户管理表的固定列头
    $scope.instClient_columns = [
        {title: "经纪公司"},
        {title: "所属机构"},
        {title: "资金账号"},
        {title: "合约代码"},
        {title: "委托笔数"},
        {title: "撤单笔数"},
        {title: "报撤单比例"}
    ]; 
 
    
/*    
    $scope.find = function (entity) {
//    	$scope.isQuery = true;
        $scope.listEntitys = [];
        $scope.status = "轮询中.....";
        $scope.isStart = true;
        $scope.isStop = false;
        
        $scope.tmpQuery = angular.copy(entity);
        
        clearInterval($scope.timer);
        
        $scope.flowQueryService.flowQuery(function (result) {
            $scope.listEntitys = angular.copy(result);
            $scope.$apply();
//            $timeout(function() {
//                $scope.isQuery = false;
//            }, 1000);
        }, $scope.tmpQuery);
        
        $scope.timer = setInterval(function(){
        	$scope.flowQueryService.flowQuery(function(result){
            	$scope.listEntitys = angular.copy(result);
            	$scope.$apply();
            },$scope.tmpQuery);
        },5000);
        
    }
    */
   
	// 查询(前台分页)
    $scope.find = function (entity){
    	  $scope.listEntitys = [];
          $scope.status = "轮询中.....";
          $scope.isStart = true;
          $scope.isStop = false;
          
          $scope.tmpQuery = angular.copy(entity);
          
          clearInterval($scope.timer);
          
    	//更新表格对应的数据集
      	$scope.flowQueryDataset = [];
      	$scope.flowQueryService.flowQuery(function(result){
      		var con = result;
      	//将数据集赋值为空
        	$scope.flowQueryDataset = [];
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	var failNum =con[i].failNum;
				var num =0;
				if(failNum  == null || failNum  == 0 ){
					num="0.00%";
				}else{
					num= (failNum*100/con[i].orderNum).toFixed(2);
					num =num+"%";
				}
                var tempArr = [con[i].brokerageName,con[i].instName, con[i].investorid,con[i].instrumentid,
                               con[i].orderNum,con[i].failNum,num];
	            $scope.flowQueryDataset.push(tempArr);
            }
            //重新绘表
            $scope.flowQueryTable.clear().draw();
            $scope.flowQueryTable.rows.add($scope.flowQueryDataset).draw();
        	$scope.$apply();
        },$scope.tmpQuery);
    	/*$scope.flowQueryService.findByQuery(function (result) {
    		var con = result;
    		//将数据集赋值为空
        	$scope.flowQueryDataset = [];
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
				var failNum =con[i].failNum;
				var num =0;
				if(failNum  == null || failNum  == 0 ){
					num="0.00%";
				}else{
					num= parseFloat(failNum*100/con[i].orderNum).toFixed(2);
					num =num+"%";
				}
                var tempArr = [con[i].brokerageName,con[i].instName, con[i].investorid,con[i].instrumentid,
                               con[i].orderNum,con[i].failNum,num];
	            $scope.flowQueryDataset.push(tempArr);
            }
            //重新绘表
            $scope.flowQueryTable.clear().draw();
            $scope.flowQueryTable.rows.add($scope.flowQueryDataset).draw();
        }, $scope.tmpQuery);*/
    	
    	 $scope.timer = setInterval(function(){
         	$scope.flowQueryService.flowQuery(function(result){
         		var con = result;
              	//将数据集赋值为空
                	$scope.flowQueryDataset = [];
            		var tempArray = new Array();
                    for(var i = 0; i<con.length;i++){
                    	var failNum =con[i].failNum;
        				var num =0;
        				if(failNum  == null || failNum  == 0 ){
        					num="0.00%";
        				}else{
        					num= (failNum*100/con[i].orderNum).toFixed(2);
        					num =num+"%";
        				}
                        var tempArr = [con[i].brokerageName,con[i].instName, con[i].investorid,con[i].instrumentid,
                                       con[i].orderNum,con[i].failNum,num];
        	            $scope.flowQueryDataset.push(tempArr);
                    }
                    //重新绘表
                    $scope.flowQueryTable.clear().draw();
                    $scope.flowQueryTable.rows.add($scope.flowQueryDataset).draw();
             },$scope.tmpQuery);
         },5000);
    }

    
    $scope.find($scope.queryEntity);
    
    $scope.stop = function (){
    	clearInterval($scope.timer);
    	$scope.isStart = false;
    	$scope.isStop = true;
    	$scope.status = "轮询停止";
    }
    
    
    
    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.flowQueryTable = $('#flowQuery_dynamic_table').DataTable( {
    		data : $scope.flowQueryDataset,
        	columns :$scope.instClient_columns,
//        	scrollY: 300,
//          scrollX: true,
            dom: 'rt<"bottom"iplB>',
            
			buttons: [
			   
			]
        } );
    });
});
