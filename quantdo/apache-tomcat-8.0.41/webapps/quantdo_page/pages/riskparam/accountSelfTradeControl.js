myapp.controller('AccountSelfTradeControlController', function ($scope, $timeout, $route) {
	
	$scope.accountSelfTradeControlService = new com.quantdo.orgClear.service.AccountSelfTradeControlService();
	
    // 初始化页面参数
    $scope.queryEntity = {};
    $scope.queryInsts = [];
    $scope.tempEntity = {};
    $scope.tempEntity.recordIndex = -1;
    $scope.modalEntity = {};
    $scope.listEntitys = [];
    $scope.currentInst = "";
    $scope.isQuery = false;
	
	//定义固定列头
    $scope.accountSelfTradeControl_column = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "机构代码"},
        {title: "资金账号组"},
		{title: "操作"}
	];
    
    // 机构信息
    getInstClientQueryConditionList(function(result){
    	$scope.queryInsts = angular.copy(result);
    	if($scope.queryInsts.length > 1){
    		$scope.queryEntity.instClientID = "";
    		$scope.hasInst = false;
    		$scope.currentInst = "";
    	}else{
    		$scope.queryEntity.instClientID = $scope.queryInsts[0].instClientID;
    		$scope.hasInst = true;
    		$scope.currentInst = $scope.queryInsts[0].instClientID;
    	}
    });
    
    // 预警阈值
    $scope.accountSelfTradeControlService.getPreWarnCount(function(result){
    	if(result == null){
    		$scope.prewarnCount = 0;
    	}else{
    		$scope.prewarnCount = result.prewarnCount;
    	}
    	$scope.$apply();
    });
    
    $("body").undelegate("#riskAccountGroup_dynamic_table1_wrapper td .update-row","click");
    //表格修改事件
    $("body").delegate("#riskAccountGroup_dynamic_table1_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.riskSelfTradeTbl.row(mytr).data();
        var id = tempArr[1];
        
        for(var i = 0;i < $scope.listEntitys.length;i++){
        	if(id == $scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
       $scope.initUpdateParam(id,$scope.modalEntity);
    });
    $("body").undelegate("#riskAccountGroup_dynamic_table1_wrapper td .delete-row","click");
    //表格删除事件
    $("body").delegate("#riskAccountGroup_dynamic_table1_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.riskSelfTradeTbl.row(mytr).data();
        var id = tempArr[1];
        
        for(var i = 0;i < $scope.listEntitys.length;i++){
        	if(id == $scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.remove(id,$scope.modalEntity);
    });
    
    // 根据机构号筛选资金账号
    $scope.getCapsByInst = function(instClientID){
    	deleteSelect();
    	$scope.rCapEntitys = [];
    	if(instClientID == undefined || instClientID.trim() == ''){
    		$scope.lCapEntitys = [];
    	}else{
    		// 当前机构有效资金帐号
            findCapAccIdByProductIdAndInstId(function (result) {
                $scope.lCapEntitys = angular.copy(result);
                $scope.$apply();
            },"",instClientID);
    	}
    }
    
    // 初始化模态
    $scope.initParameter = function () {
        $scope.modalEntity = {};
        if(!$scope.hasInst){
        	$scope.modalEntity.instClientID = "";
    	}else{
    		$scope.modalEntity.instClientID = $scope.currentInst;
    	}
        $scope.getCapsByInst($scope.modalEntity.instClientID);
        $scope.isUpdate = false;
        $scope.myForm.$setPristine();
        deleteSelect();
    };
    
    // 修改初始化信息
    $scope.initUpdateParam = function (index, entity) {
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.modalEntity = angular.copy($scope.tempEntity);
        $scope.myForm.$setPristine();
        
        deleteSelect();
        $scope.lCapEntitys = [];
        $scope.rCapEntitys = [];
        
        // 当前机构有效资金帐号
        findCapAccIdByProductIdAndInstId(function (result) {
    		if(entity.innerAccountID == undefined || entity.innerAccountID.trim() == ''){
    			$scope.lCapEntitys = angular.copy(result);
            }else{
            	var accounts = entity.innerAccountID.split(',');
                for(var i = 0;i < result.length;i++){
                	for(var j = 0;j < accounts.length;j++){
                		if(result[i].innerAccountID == accounts[j]){
                			$scope.rCapEntitys.push(result[i]);
                			break;
                		}
                		if(j == accounts.length - 1){
                			$scope.lCapEntitys.push(result[i]);
                		}
                	}
                }
            }
            $scope.$apply();
        },"",entity.instClientID);
        
        $scope.isUpdate = true;
    };
    
    // 根据页面条件查询
    $scope.find = function (queryEntity) {  	
    	$scope.isQuery = true;
		$scope.accountSelfTradeControlDataset = [];
		$scope.listEntitys = [];
		$scope.accountSelfTradeControlService.findByQuery(function(result){
			$scope.listEntitys = angular.copy(result);
			var con = angular.copy(result);
			for(var i = 0; i<con.length;i++){
				var operator1 = "<a class='backFilter update-row' style='cursor:pointer' data-toggle='modal' " +
						"data-target='#riskAccountGroupModal' name='AccountSelfTradeControlService.update'>修改</a>";
				var operator2 = "<a class='backFilter delete-row' style='cursor:pointer' data-toggle='modal' " +
						"name='AccountSelfTradeControlService.delete'>删除</a>";  
		    	var tempArr = [(i+1),con[i].id,con[i].instClientID,con[i].groupName,operator1 + operator2];
		    	$scope.accountSelfTradeControlDataset.push(tempArr); 
			}
			//重新绘表
			$scope.riskSelfTradeTbl.clear().draw();
			$scope.riskSelfTradeTbl.rows.add($scope.accountSelfTradeControlDataset).draw();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		},queryEntity);
    };
    
    // 删除
    $scope.remove = function (index, entity) {
        layer.confirm('确定删除此信息？', {icon: 3}, function (count) {
        	$scope.accountSelfTradeControlService.remove(function (result) {
    			layer.close(count);
    			$scope.find({});
        	}, entity.id);
       });
    };
    
    $scope.save = function (entity) {
        var index = entity.recordIndex;
        
        if(entity.instClientID == undefined || entity.instClientID.trim() == ''){
        	layer.msg("机构代码不能为空",{icon: 2});
        	return false;
        }
        
        if(entity.groupName == undefined || entity.groupName.trim() == ''){
        	layer.msg("资金账号组名称不能为空",{icon: 2});
        	return false;
        }
        
        if($scope.rCapEntitys == undefined || $scope.rCapEntitys.length < 1){
        	layer.msg("账号组对应的资金账号必须选择一项",{icon: 2});
        	return false;
        }
        
        entity.innerAccountID = "";
        
        // 拼接选中的资金账号
        for(var i = 0;i < $scope.rCapEntitys.length;i++){
        	entity.innerAccountID += $scope.rCapEntitys[i].innerAccountID + ',';
        }
        
        entity.innerAccountID = entity.innerAccountID.substring(0,entity.innerAccountID.length - 1);
        
        // 新增
        if (index == undefined) {
        	// 判断信息是否重复
        	$scope.accountSelfTradeControlService.queryCanInsert(function (result) {
        		if (result == 1) {
                	$scope.accountSelfTradeControlService.add(function (result) {
                		if(result != null){
                			$scope.find({});
   						 	layer.msg("新增成功",{icon: 1});
                		}else{
                			layer.msg("新增失败",{icon: 2});
                		}
					 },entity);
					 // 关闭窗口
				     $("#riskAccountGroupModal").modal("hide");
                }
        	}, {
        		instClientID: entity.instClientID,
        		groupName: entity.groupName,
        		innerAccountID: entity.innerAccountID
        	});
        // 修改
        } else {
        	$scope.accountSelfTradeControlService.queryCanUpdate(function (result) {
        		if (result == 1) {
                	$scope.accountSelfTradeControlService.update(function (result) {
                		if(result != null){
                			$scope.find({});
   						 	layer.msg("修改成功",{icon: 1});
                		}else{
                			layer.msg("修改失败",{icon: 2});
                		}
					 },entity);
					 // 关闭窗口
				     $("#riskAccountGroupModal").modal("hide");
                }
        	}, {
        		instClientID: entity.instClientID,
        		groupName: entity.groupName,
        		id: entity.id,
        		innerAccountID: entity.innerAccountID
        	});
        }
    };
    
    // 设置阈值
    $scope.initPreWarnParameter = function(count){
    	$scope.myForm1.$setPristine();
    	$scope.preWarnEntity = {};
    	$scope.preWarnEntity.prewarnCount = count;
    }
    
    // 预警次数阈值保存
    $scope.savePreWarnCount = function(entity){
    	
    	if(entity.prewarnCount == undefined || entity.prewarnCount.trim() == ''){
    		layer.msg("预警次数阈值不能为空,且必须为0或者正整数",{icon: 2});
    		return false;
    	}
    	
    	$scope.accountSelfTradeControlService.savePrewarnCount(function(result){
    		if(result == null){
    			layer.msg("阈值设置失败",{icon: 2});
    		}else{
    			layer.msg("阈值设置成功",{icon: 1});
    			$scope.prewarnCount = result.prewarnCount;
    			$scope.$apply();
    			// 关闭窗口
			     $("#preWarnCountModal").modal("hide");
    		}
    	},entity);
    }
    
    // 清除所有选中状态及临时选中列表
    function deleteSelect(){
		angular.forEach($scope.lCapEntitys, function (entity, index, list) {
			entity.isSelectActive=false;
		});
		$scope.tmpLChooses = [];
		  
		angular.forEach($scope.rCapEntitys, function (entity, index, list) {
			entity.isSelectActive=false;
		});
		$scope.tmpRChooses=[];
	}
    
    // 双击加入右侧列表
	$scope.addAccount = function(index,listEntity){
		deleteSelect();
		$scope.rCapEntitys.push(listEntity);
		$scope.lCapEntitys.splice(index, 1);
	}
	
	// 双击移回左侧列表
	$scope.devedAccount = function(index,listEntity){
		deleteSelect();
		$scope.lCapEntitys.push(listEntity);
		$scope.rCapEntitys.splice(index, 1);
	}
    
	// 单击左侧单条数据,临时列表加入/移除
	$scope.tmpLChooses = [];	
	$scope.addAccountSelect = function(index,entity){
		if(entity.isSelectActive == false || entity.isSelectActive == undefined){
			$scope.tmpLChooses.push(entity);
			entity.isSelectActive = true;
		}else{
			var i = $scope.tmpLChooses.indexOf(entity);
			$scope.tmpLChooses.splice(i, 1);	
			entity.isSelectActive = false;
		}
	}
	
	// 单击右侧单条数据,临时列表加入/移除
	$scope.tmpRChooses = [];	
	$scope.devedAccountSelect = function(index,entity){
		if(entity.isSelectActive == false || entity.isSelectActive == undefined){
			$scope.tmpRChooses.push(entity);
			entity.isSelectActive=true;
		}else{
			var i = $scope.tmpRChooses.indexOf(entity);
			$scope.tmpRChooses.splice(i, 1);	
			entity.isSelectActive=false;
		}
	}
    
	// > 按钮事件
	$scope.addSelectAccounts = function(){
        angular.forEach($scope.tmpLChooses, function (entity, index, list) {
        	var i = $scope.lCapEntitys.indexOf(entity);
        	$scope.lCapEntitys[i].isSelectActive = false;
			$scope.lCapEntitys.splice(i, 1);
            $scope.rCapEntitys.push(entity);
        });
        $scope.tmpLChooses = [];    
    }
	
	// < 按钮事件
	$scope.deleteSelectAccounts = function(){
        angular.forEach($scope.tmpRChooses, function (entity, index, list) {
        	var i = $scope.rCapEntitys.indexOf(entity);
        	$scope.rCapEntitys[i].isSelectActive = false;
			$scope.rCapEntitys.splice(i, 1);
            $scope.lCapEntitys.push(entity);

        });
        $scope.tmpRChooses=[]; 
    }
	
	// >> 按钮事件
	$scope.addAllAccounts = function(){
    	deleteSelect();
        angular.forEach($scope.lCapEntitys, function (entity, index, list) {
            $scope.rCapEntitys.push(entity);
        });
        $scope.lCapEntitys = [];
	}
	
	// << 按钮事件
	$scope.deleteAllAccounts = function(){
    	deleteSelect();
        angular.forEach($scope.rCapEntitys, function (entity, index, list) {
            $scope.lCapEntitys.push(entity);
        });
        $scope.rCapEntitys = [];
	}
	
    $timeout(function() {
	  $scope.find({});
    }, 500);
	
	//初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.riskSelfTradeTbl = $('#riskAccountGroup_dynamic_table1').DataTable( {
	    		data : $scope.accountSelfTradeControlDataset,
	        	columns :$scope.accountSelfTradeControl_column,
	            dom: 'rt<"bottom"iplB>',
	            fixedColumns:   {
	                leftColumns: 0,
	                rightColumns: 1
	            },
				buttons: []
        } );
    });
    
});

