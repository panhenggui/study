myapp.controller('TradeUserProductCheckController', function ($scope, $rootScope,$timeout) {
	//调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService;
	$scope.tradeUserProductCheckService = new com.quantdo.orgClear.service.tradeUserProductCheckService;
	$scope.tradeUserService = new com.quantdo.orgClear.service.TradeUserService;
	$scope.fundWorkFlowService = new com.quantdo.orgClear.service.FundWorkFlowService();
	
	$scope.queryEntity = {};
	$scope.ModalEntity = {};
	$scope.listEntitys = [];
	$scope.instClientListEntitys = [];
	$scope.tradeUserListEntitys = [];
	$scope.roleListEntitys = [];
	$scope.querytradeUserListEntitys = [];
	$scope.isUpdate = false;
	$scope.TradeUserProductCheckDataset = [];
	
	// 按钮权限
	$scope.tradeUserProductCheck_query = isShow("tradeUserProductCheck_query");
	$scope.tradeUserProductCheck_add = isShow("tradeUserProductCheck_add");
	$scope.tradeUserProductCheck_delete = isShow("tradeUserProductCheck_delete");

	//定义用户设置表的固定列头
    $scope.TradeUserProductCheck_columns = [
        {title: "序号"},
        {title: "id",visible:false},
		{title: "所属机构"},
		{title: "用户代码"},
		{title: "用户名称"},
		{title: "角色"},
		{title: "交易端标识符"},
		{title: "授权编码"},
		{title: "创建人"},
		{title: "创建时间"},
		{title: "操作"}
	]

	
	//获取所有角色
	getAllRole(function (result) {
		$scope.roleListEntitys =result;
		$scope.$apply();
	});
	
    //角色名称转换
    $scope.transRole = function (id) {
    	if(id == ""){
    		return "";
    	}
    	for(var i = 0;i < $scope.roleListEntitys.length; i++){
    		if($scope.roleListEntitys[i].id == id){
    			return $scope.roleListEntitys[i].roleName;
    		}
    	}
    }
	
	//机构查询
	$scope.instClientService.findByQuery(function (result) {
        $scope.instClientListEntitys = result;
        $scope.$apply();
    },{});
	
	
	$scope.instClient=null
	getInstClient(function(result){
		$scope.instClient = result;
		if($scope.instClient!=null){
			$scope.isInstClient= true;
			$scope.ModalEntity.instClientID=  $scope.instClient.instClientID;
		}else{
			$scope.isInstClient= false;
		}
	});
	

	$scope.selectExchange = function(instClientID){
		$scope.tradeUserListEntitys = [];
		$scope.tradeUserService.findAllOrSuperTrade(function (result) {
			if(instClientID != null){
				$scope.tradeUserListEntitys = result;
				$scope.$apply();
			}
		},instClientID);
	}
	
	$scope.queryselectExchange = function(instClientID){
		$scope.querytradeUserListEntitys = [];
		$scope.tradeUserService.findAllByFkadmin(function (result) {
			if(instClientID != null){
				$scope.querytradeUserListEntitys = result;
				$scope.$apply();
			}
		},instClientID);
	}
	
    //机构名称转换
    $scope.transInstClient = function (instClientID) {
    	for(var i = 0;i < $scope.instClientListEntitys.length; i++){
    		if($scope.instClientListEntitys[i].instClientID == instClientID){
    			return $scope.instClientListEntitys[i].instClientAbbrName;
    		}
    	}
    }
    $("body").undelegate("#tradeUserProductCheck_dynamic_table_wrapper td .delete-row","click");
    //表格机构管理员的设置单击事件
    $("body").delegate("#tradeUserProductCheck_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.TradeUserProductCheckTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.remove($scope.modalEntity,id);
    });

	$scope.find = function(tradeUserProduct){
		$scope.isQuery = true;
		$scope.TradeUserProductCheckDataset = [];
		$scope.tradeUserProductCheckService.find(function(result){			
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator = "";
				if($scope.tradeUserProductCheck_delete){
					operator = operator.concat("<a class='delete-row'>删除</a>");
				}
		    	var tempArr = [(i+1),con[i].id,$scope.transInstClient(con[i].instClientID),$scope.transUserID(con[i].userID),$scope.transUserName(con[i].userName)
		    	               				    ,$scope.transRole(con[i].role),con[i].productInfo,con[i].authCode,con[i].operatorID,con[i].operateDate+" "+con[i].operateTime,operator]
		    	$scope.TradeUserProductCheckDataset.push(tempArr);     		    	
	        }
			//重新绘表
	        $scope.TradeUserProductCheckTable.clear().draw();
	        $scope.TradeUserProductCheckTable.rows.add($scope.TradeUserProductCheckDataset).draw();
			$scope.$apply();
		},tradeUserProduct);
	};
	$timeout(function() {
		$scope.find($scope.queryEntity);//对应方法
     }, 1000);
	

	$scope.transUserID = function(userID){
		var result = '';
		if(userID == '00000000'){
			result = '全部';
		}else{
			result = userID;
		}
		return result;
	}
	$scope.transUserName = function(userName){
		var result = '';
		if(userName == '00000000'){
			result = '全部';
		}else{
			result = userName;
		}
		return result;
	}
	
	$scope.init = function(){
		$scope.isUpdate = false;
		$scope.ModalEntity = {};
		$scope.tradeUserListEntitys = [];
		if($scope.instClientListEntitys.length > 0){
			$scope.ModalEntity.instClientID = $scope.instClientListEntitys[0].instClientID;
		}
		if($scope.instClient!=null){
			$scope.isInstClient= true;
			$scope.ModalEntity.instClientID =  $scope.instClient.instClientID;
			
		}else{
			$scope.isInstClient= false;
		}
		$scope.tradeUserService.findAllByFkadmin(function (result) {
			if(result != null){
				$scope.tradeUserListEntitys = result;
				$scope.ModalEntity.userID = "";
				$scope.$apply();
			}
		},$scope.ModalEntity.instClientID);
		
		formValidateReset();
		$("#tradeUserProductCheckModal").modal("show");
	};

	//新增和修改
	$scope.save = function (entity) {
		 var index = entity.recordIndex;
		 
		 if((entity.productInfo == undefined || entity.productInfo.toString().trim() == "") && 
				 (entity.authCode == undefined || entity.authCode.toString().trim() == "")){
			 layer.msg("交易端标识符、授权编码必须填写其中一项",{icon: 2});
			 return false;
		 }
		 
		 if(entity.productInfo == undefined){
			 entity.productInfo = "";
		 }
		 
		 if(entity.authCode == undefined){
			 entity.authCode = "";
		 }
		 
		 // 用户代码为全部
		 if(entity.userID == null || entity.userID == undefined || entity.userID.toString().trim() == ""){
			 entity.userID = "00000000";
		 }
		 
		//修改
		if($scope.isUpdate){
			$scope.tradeUserProductCheckService.update(function (result) {
				$scope.find($scope.queryEntity);
				$("#tradeUserProductCheckModal").modal("hide");
				$scope.isUpdate = false ;
			}, entity);
		}else {
			$scope.tradeUserProductCheckService.check(function(result){
				if(result != null && result.length > 0){
					layer.msg("交易用户产品授权已存在",{icon : 2});
					return false;
				}
				else{
					$scope.tradeUserProductCheckService.add(function (result){
						if(result == null || result == undefined){
							layer.msg(result.info, {icon : 2,time : 2000});
						}else{
							$scope.find($scope.queryEntity);
							$("#tradeUserProductCheckModal").modal("hide");
							$scope.ModalEntity = {};
						}
					}, entity);
				}
			},entity);
		}
	}
	
	//删除
	$scope.remove = function (entity,index) {
		layer.confirm('确认删除该记录吗？', {
			icon : 3
		}, function(count) {
			$scope.tradeUserProductCheckService.delitem(entity);
			layer.close(count);
			$timeout(function() {
				$scope.find($scope.queryEntity);//对应方法
		     }, 500);
		});		
	}
	
	//修改
	$scope.updateInit = function(entity,indexRes){
		$scope.ModalEntity = {};
		$scope.temModalEntity =angular.copy(entity);
		$scope.temModalEntity.recordIndex = indexRes;
		$scope.ModalEntity=angular.copy($scope.temModalEntity);
		if(entity.userID == "00000000"){
			entity.userID = "";
		}
		
		$scope.tradeUserService.findAllOrSuperTrade(function (result) {
			$scope.tradeUserListEntitys = [];
			$scope.tradeUserListEntitys = result;
			$scope.$apply();
		},entity.instClientID);
		$scope.isUpdate = true;
		formValidateReset();
		$("#tradeUserProductCheckModal").modal("show");
	};
	
    function formValidateReset() {
    	$scope.myFormUserProductCheck.$setPristine();
    }
    
  //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.TradeUserProductCheckTable = $('#tradeUserProductCheck_dynamic_table').DataTable( {
    		data : $scope.TradeUserProductCheckDataset,
        	columns :$scope.TradeUserProductCheck_columns,
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
