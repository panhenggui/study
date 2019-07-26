myapp.controller('PartitionPositionConfigController', function ($scope,$rootScope, $timeout) {
	//调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
	$scope.partitionPositionConfigService = new com.quantdo.orgClear.service.partitionPositionConfigService();
	
    $scope.listEntitys = [];
    $scope.queryEntity = {};
    $scope.status = clearConstant.status;
    $scope.limitOptions = clearConstant.limitOptions;
    $scope.partitionPositionConfigDataset=[];
    $scope.partitionPositionConfig_query = isShow("partitionPositionConfig_query");
    $scope.partitionPositionConfig_start = isShow("partitionPositionConfig_start");
   
    $scope.instClientList = [];
    getInstClientQueryConditionList(function(result){
    	$scope.instClientList = angular.copy(result);
    	if($scope.instClientList.length > 1){
    		$scope.queryEntity.instClientID = "";
    	}else{
    		$scope.queryEntity.instClientID = $scope.instClientList[0].instClientID;
    	}
    	$scope.$apply();
    	$timeout(function() {
        	$scope.find($scope.queryEntity);
        }, 500);
    });
    
    queryInstClientID(function(result){
    	if(result != undefined){
    		$scope.noInst = true;
    	}else{
    		$scope.noInst = false;
    	}
    });
    
    //定义系统用户管理表的固定列头
    $scope.partitionPositionConfig_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "所属机构"},  
        {title: "风控参数设置"},
        {title: "状态"},      
        {title: "操作"}
    ];    


	// 查询(前台分页)
    $scope.find = function(){
    	//将数据集赋值为空
    	$scope.partitionPositionConfigDataset = [];
    	//更新表格对应的数据集
    	$scope.partitionPositionConfigService.findByQuery(function (result) {
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	var operate = $scope.getStartPermision(con[i].status,$scope.partitionPositionConfig_start);
                var tempArr = [(i+1),con[i].id,$scope.transInstClientID(con[i].instClientID),con[i].limitOptions,$scope.transStatus(con[i].status),operate];
	            $scope.partitionPositionConfigDataset.push(tempArr);
	            con[i].index = tempArr[0];
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.partitionPositionConfigTable.clear().draw();
            $scope.partitionPositionConfigTable.rows.add($scope.partitionPositionConfigDataset).draw();
        }, $scope.queryEntity);
    };
    
    $scope.transInstClientID = function(instClientID){
    	for(var i=0;i<$scope.instClientList.length;i++){
			if($scope.instClientList[i].instClientID == instClientID){
				return $scope.instClientList[i].instClientAbbrName;
			}
		}
    }
    
    $scope.transStatus = function(status){
    	for(var i=0;i<$scope.status.length;i++){
			if($scope.status[i].key == status){
				return $scope.status[i].text;
			}
		}
    }
    
    $("body").undelegate("#partitionPositionConfig_dynamic_table_wrapper td .fobid-operation","click");
    //表格停用事件
    $("body").delegate("#partitionPositionConfig_dynamic_table_wrapper td .fobid-operation","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.partitionPositionConfigTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
	    layer.confirm('确定停用该配置？', {icon: 3}, function (count) {
	    	$scope.partitionPositionConfigService.stop(function (result) {
	    		layer.msg("该配置停用成功!", {icon : 1,time : 2000});
	            $scope.find();
	        }, $scope.modalEntity);  
	    });
    });
    
    $("body").undelegate("#partitionPositionConfig_dynamic_table_wrapper td .starts-row","click");
     //表格启用事件
    $("body").delegate("#partitionPositionConfig_dynamic_table_wrapper td .starts-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.partitionPositionConfigTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
	    layer.confirm('确定启用该配置？', {icon: 3}, function (count) {
	    	$scope.partitionPositionConfigService.start(function (result) {
	    		layer.msg("该配置启用成功!", {icon : 1,time : 2000});
	            $scope.find();
	        }, $scope.modalEntity);  
	    });
    });
    
    //获取启用停用权限
    $scope.getStartPermision = function(status,flag){
    	var result = '';
    	if(flag){
    		if(status==1){
    			result = "<a class='row-operation-distance fobid-operation'>停用</a>";
    		}else if(status==0){
    			result = "<a class='row-operation-distance reset-operation starts-row'>启用</a>";
    		}
    	}
    	return result;
    }

    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.partitionPositionConfigTable = $('#partitionPositionConfig_dynamic_table').DataTable( {
    		data : $scope.partitionPositionConfigDataset,
        	columns :$scope.partitionPositionConfig_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: []
        } );
    });
    
});

