myapp.controller('UserOnlineManageController', function($scope, $timeout, $rootScope){
	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
	$scope.onlineActive = clearConstant.onlineActives;//用户状态
	$scope.listEntitys = [];
	$scope.queryEntity = {};
	$scope.UserOnlineManageDataset = [];	
	
	//定义在线交易用户的固定列头
    $scope.UserOnlineManage_columns = [
		{title: "所属机构"},
		{title: "用户代码"},
		{title: "状态"},
		{title: "IP"},
		{title: "MAC"},
		{title: "最近上线时间"},
		{title: "操作"}
	]
    // 按钮权限
    $scope.userOnlineManage_query = isShow("userOnlineManage_query");
    $scope.userOnlineManage_update = isShow("userOnlineManage_update");

	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	$scope.userID="";
	$scope.instClientID="";
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService;
	
	$("body").undelegate("#UserOnlineManage_dynamic_table_wrapper td .delete-row","click");
    //冻结
    $("body").delegate("#UserOnlineManage_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.UserOnlineManageTable.row(mytr).data();
        var instClientID = $scope.revTransInstClient(tempArr[0]);
        var userID = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(instClientID==$scope.listEntitys[i].instClientID&&userID==$scope.listEntitys[i].userID){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.changActive($scope.modalEntity);
    });
    $("body").undelegate("#UserOnlineManage_dynamic_table_wrapper td .update-row","click");
    //解冻
    $("body").delegate("#UserOnlineManage_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.UserOnlineManageTable.row(mytr).data();
        var instClientID = $scope.revTransInstClient(tempArr[0]);
        var userID = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(instClientID==$scope.listEntitys[i].instClientID&&userID==$scope.listEntitys[i].userID){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.changNoActive($scope.modalEntity);
    });
    
	$scope.find = function(entity){
    	if(entity!=undefined){
    		var instClientID = entity.instClientID;
        	var userId = entity.userID;
    		$scope.UserOnlineManageDataset = [];
    		getOnlineUser(function(result){			
    			$scope.listEntitys = result;
    			var con = result;
    			for(var i = 0; i<con.length;i++){
    				var operator = $scope.transFrozen(con[i].isActive);
    		    	var tempArr = [$scope.transInstClient(con[i].instClientID),con[i].userID,$scope.transActive(con[i].isActive)
    		    	           	,con[i].ipAddress,con[i].macAddress,con[i].loginTime,operator]
    		    	$scope.UserOnlineManageDataset.push(tempArr);     		    	
    	        }
    			//重新绘表
    	        $scope.UserOnlineManageTable.clear().draw();
    	        $scope.UserOnlineManageTable.rows.add($scope.UserOnlineManageDataset).draw();
    			$scope.$apply();
    		},instClientID,userId);
    	}else{
    		$scope.UserOnlineManageDataset = [];
    		getOnlineUser(function(result){			
    			$scope.listEntitys = result;
    			var con = result;
    			for(var i = 0; i<con.length;i++){
    				var operator = $scope.transFrozen(con[i].isActive);
    		    	var tempArr = [$scope.transInstClient(con[i].instClientID),con[i].userID,$scope.transActive(con[i].isActive)
    		    	           	,con[i].ipAddress,con[i].macAddress,con[i].loginTime,operator]
    		    	$scope.UserOnlineManageDataset.push(tempArr);     		    	
    	        }
    			//重新绘表
    	        $scope.UserOnlineManageTable.clear().draw();
    	        $scope.UserOnlineManageTable.rows.add($scope.UserOnlineManageDataset).draw();
    			$scope.$apply();
    		},$scope.instClientID,"");
    	}
    	
	};
	
	$timeout(function() {
		$scope.find({"instClientID":$scope.instClientID,"userID":$scope.userID});
      }, 500);
	
	$scope.transFrozen = function(isActive){
		var result = '';
		if(isActive !=0 && $scope.userOnlineManage_update){
			result = "<a class='delete-row'>冻结</a>";
		}else{
			if($scope.userOnlineManage_update){
				result = "<a class='update-row'>解冻</a>";
			}
		}
		return result;
	}
	
	//获取所属投资机构
    queryAmType(function (result) {
        if(result != null){
        	$scope.notAdmin = true;
        }else{
        	$scope.notAdmin = false	;
        }
        $scope.$apply();
    });
	
//	 $scope.timer = setInterval(function (){
//		 $scope.find($scope.instClientID,$scope.userID);
//	 },"5000");

	 //用户状态
    $scope.transActive = function (tradeType){
    	for(var i = 0;i < $scope.onlineActive.length;i++){
			if($scope.onlineActive[i].key == tradeType){
				return $scope.onlineActive[i].text;
			}
		}
    }
    //冻结
	$scope.changActive = function (entity) {
		layer.confirm('确定冻结该交易用户吗？', {
			icon : 3
		}, function(count) {
			changActive(function (result) {
				layer.close(count);
				$timeout(function(){
					$scope.find($scope.queryEntity);
					$scope.$apply();
				},1000);
			},entity);
		});
		
	}
	
	$scope.instClientListEntitys=[];
	getInstClientQueryConditionList(function (result) {
        $scope.instClientListEntitys = result;
        if($scope.instClientListEntitys.length > 1){
    		$scope.instClientID = "";
    		$scope.isInstClient = false;
    	}else{
    		$scope.isInstClient = true;
    		$scope.instClientID = $scope.instClientListEntitys[0].instClientID;
    		$scope.queryEntity.instClientID = $scope.instClientID;
    	}
        $scope.$apply();
    },{});
	
	 //机构名称转换
    $scope.transInstClient = function (instClientID) {
    		var result = "";
    		for(var i = 0;i < $scope.instClientListEntitys.length; i++){
        		if($scope.instClientListEntitys[i].instClientID == instClientID){
        			result = $scope.instClientListEntitys[i].instClientAbbrName;
        			break;
        		}
        	}
    		return result;
    }
    
	 //机构名称逆转换
    $scope.revTransInstClient = function (instClientAbbrName) {
    	var result = "";
    	for(var i = 0;i < $scope.instClientListEntitys.length; i++){
    		if($scope.instClientListEntitys[i].instClientAbbrName == instClientAbbrName){
    			result = $scope.instClientListEntitys[i].instClientID;
    		}
    	}
    	return result;
    }
	//解冻
	$scope.changNoActive = function (entity) {
		layer.confirm('确定解冻该交易用户吗？', {
			icon : 3
		}, function(count) {
			changNoActive(function (result) {
				layer.close(count);
				$timeout(function(){
					$scope.find($scope.queryEntity);
					$scope.$apply();
				},1000);
			},entity);
		});
	}
	
	  //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.UserOnlineManageTable = $('#UserOnlineManage_dynamic_table').DataTable( {
    		data : $scope.UserOnlineManageDataset,
        	columns :$scope.UserOnlineManage_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
			]
        } );
    	
    });
});
