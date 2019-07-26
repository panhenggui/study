myapp.controller('fofFundGroupController', function ($scope, $timeout) {
	$scope.fundGroupService = new com.quantdo.orgClear.service.fofFundGroupService();
	$scope.fOFRiskFundGroupWithFundProductService = new com.quantdo.orgClear.service.fOFRiskFundGroupWithFundProductService();
	
    $scope.listEntitys = [];	//产品组查询结果
    $scope.queryEntity = {};	//产品组查询条件
    $scope.ModalEntity = {};	//产品组新增修改实体
    
    $scope.unAssignedEntitys = [];	//待分配查询结果
    $scope.assignedEntitys = [];	//已分配查询结果
    $scope.chooseStatus = false;	//待分配记录单选是否选中状态
    $scope.groupProductAddList = [];	//组关联产品待新增列表
    $scope.currentFundGroupEntity = {};		//当前产品组
    
    // 初始化产品组页面参数
    $scope.initParameter = function () {
        // 设置默认选中
    	$scope.ModalEntity = {};
    	$scope.fundGroupForm.$setPristine();
        $scope.isUpdate = false;
    };
    
    // 修改产品组信息
    $scope.initGroupUpdateParam = function (entity,index) {
		$scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        $scope.ModalEntity.fundGroupID = $scope.ModalEntity.fundGroupID.substring(1,$scope.ModalEntity.fundGroupID.length);
        $scope.fundGroupForm.$setPristine();
        $scope.isUpdate = true;
        $scope.$apply();
    };

    // 保存产品组信息
    $scope.saveFundGroup = function (entity) {
        var index = entity.recordIndex;
        // 增加
        if (index == undefined) {
        	$scope.fundGroupService.findByQuery(function (result) {
                if (result != null && result.length > 0) {
                    layer.msg("产品组代码已使用，请重新输入", {icon: 2});
                    return false;
                }else{
                	$scope.fundGroupService.add(function (result) {
                		if(result != null){
                			layer.msg("新增成功",{icon: 1});
                			$scope.find($scope.queryEntity);
                            // 关闭窗口
                            $("#fundGroupModal").modal("hide");
                		}else{
                			layer.msg("新增失败",{icon: 2});
                		}
                    }, entity);
                }
            }, {
            	fundGroupID: 'g' + entity.fundGroupID
            });
            // 修改
        } else {
        	$scope.fundGroupService.update(function (result) {
        		if(result != null){
        			layer.msg("修改成功",{icon: 1});
        			$scope.find($scope.queryEntity);
	        		// 关闭窗口
	                $("#fundGroupModal").modal("hide");
        		}else{
        			layer.msg("新增失败",{icon: 2});
        		}
	        }, entity);
        }
    };
    
    //定义固定列头
    $scope.fofFundGroup_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "产品组代码"},
        {title: "产品组名称"},
        {title: "产品"},
        {title: "产品组份额"},
        {title: "操作"}
	]
    
    $("body").undelegate("#fofFundGroup_dynamic_table_wrapper td .updateInfo","click");
    $("body").undelegate("#fofFundGroup_dynamic_table_wrapper td .productSet","click");
    
    $("body").delegate("#fofFundGroup_dynamic_table_wrapper td .updateInfo","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.fofFundGroupTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.initGroupUpdateParam($scope.modalEntity,id);
    });
    
    $("body").delegate("#fofFundGroup_dynamic_table_wrapper td .productSet","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.fofFundGroupTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.groupWithProductInit($scope.modalEntity);
    });
    
    // 查询
    $scope.find = function(object){
        $scope.isQuery = true;
        $scope.fundGroupService.findInfoByQuery(function (result) {
    		//将数据集赋值为空
    		var con = result;
    		$scope.fofFundGroupDataset = [];
    		$scope.listEntitys = angular.copy(result);
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){            	
            	var operate = "";
        		operate = operate.concat("<a class='updateInfo update-row' data-toggle='modal' data-target='#fundGroupModal'>修改</a>");
        		operate = operate.concat("<a class='productSet delete-row' style='width:80px;margin-left:5px' data-toggle='modal' data-target='#withFundProductModal'>产品设置</a>");
                var tempArr = [(i+1),con[i].id,con[i].fundGroupID,con[i].fundGroupName,con[i].products,con[i].groupQuota,operate];
	            $scope.fofFundGroupDataset.push(tempArr);
            }
            //重新绘表
            $scope.fofFundGroupTable.clear().draw();
            $scope.fofFundGroupTable.rows.add($scope.fofFundGroupDataset).draw();
            $timeout(function(){
    			$scope.isQuery = false;
    		},500);
            $scope.$apply();
        }, object);  	
    }
    
    $timeout(function() {
  	  $scope.find({});
  }, 500);
    
  //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.fofFundGroupTable = $('#fofFundGroup_dynamic_table').DataTable( {
    		data : $scope.fofFundGroupDataset,
        	columns :$scope.fofFundGroup_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
			]
        } );
    });
    
    //---------------产品设置------------------------------------------------------------------------
    
    // 进入产品设置界面，初始化待分配、已分配列表
    $scope.groupWithProductInit = function(entity){
    	$scope.currentFundGroupEntity = entity;
    	$scope.chooseStatus = false;
    	$scope.y = false;
    	$scope.groupProductAddList = [];
    	$scope.fOFRiskFundGroupWithFundProductService.queryUnAssigned(function(result){
    		$scope.unAssignedEntitys = [];
    		$scope.assignedEntitys = [];
    		if(result != null && result.length > 0){
    			$scope.unAssignedEntitys = result;
    		}
    		$scope.fOFRiskFundGroupWithFundProductService.queryAssigned(function(result){
        		if(result != null && result.length > 0){
        			$scope.assignedEntitys = result;
        		}
        		$scope.$apply();
        	},{
        		fundGroupID: entity.fundGroupID,
        		instClientID: entity.instClientID
        	});
    	},{
    		fundGroupID: entity.fundGroupID,
    		instClientID: entity.instClientID
    	});
    	
    }
    
    // 全选待分配数据到待新增列表
	$scope.chooseAllUnAssigned = function(){
		if($scope.chooseStatus == false){
			$scope.chooseStatus = true;
			$scope.groupProductAddList = angular.copy($scope.unAssignedEntitys);
		}else{
			$scope.chooseStatus = false;
			$scope.groupProductAddList = [];
		}
	};
	
	// 待分配数据个别选择事件
	$scope.changeCheckStatus = function(entity,status){
		if(status){
			$scope.groupProductAddList.push(entity);
		}else{
			var index = $scope.groupProductAddList.indexOf(entity);
			$scope.groupProductAddList.splice(index, 1);
		}
	};
    
	// 待新增数据存入数据库
	$scope.addGroupWithProduct = function(){
		if($scope.groupProductAddList.length > 0){
			layer.confirm('是否确定关联所选产品？', {
				icon : 3
			}, function(count) {
				var addList = [];
				// 组合待新增数据
				for(var i = 0;i < $scope.groupProductAddList.length;i++){
					var entity = {};
					entity.fundGroupID = $scope.currentFundGroupEntity.fundGroupID;
					entity.fundProductID = $scope.groupProductAddList[i].fundProductID;
					entity.instClientID = $scope.groupProductAddList[i].instClientID;
					entity.fofInstClientID = $scope.groupProductAddList[i].fofInstClientID;
					entity.fundProductType = $scope.groupProductAddList[i].productType;
					addList.push(entity);
				}
				// 入库
				$scope.fOFRiskFundGroupWithFundProductService.add(function(result){
					if(result == 1){
						layer.msg("关联产品成功",{icon: 1});
					}else{
						layer.msg("关联产品出错",{icon: 2});
					}
					// 更新列表数据
					$scope.fOFRiskFundGroupWithFundProductService.queryUnAssigned(function(result){
			    		$scope.unAssignedEntitys = [];
			    		$scope.assignedEntitys = [];
			    		if(result != null && result.length > 0){
			    			$scope.unAssignedEntitys = result;
			    		}
			    		$scope.fOFRiskFundGroupWithFundProductService.queryAssigned(function(result){
				    		if(result != null && result.length > 0){
				    			$scope.assignedEntitys = result;
				    		}
				    		$scope.find($scope.queryEntity);
				    	},{
				    		fundGroupID: $scope.currentFundGroupEntity.fundGroupID,
				    		instClientID: $scope.currentFundGroupEntity.instClientID
				    	});
						$scope.groupProductAddList = [];
						$scope.chooseStatus = false;
						$scope.y = false;
						layer.close(count);
			    	},{
			    		fundGroupID: $scope.currentFundGroupEntity.fundGroupID,
			    		instClientID: $scope.currentFundGroupEntity.instClientID
			    	});
			    	
				},addList);
			});
		}else{
			layer.msg("请选择要关联的产品",{icon: 2});
			return false;
		}
	}
	
	// 删除产品组、产品关联关系
	$scope.removeGroupWithProduct = function(entity){
		
		layer.confirm('是否确定删除？', {
			icon : 3
		}, function(count) {
			$scope.fOFRiskFundGroupWithFundProductService.remove(function(){
				layer.msg("删除成功",{icon: 1});
				// 更新列表数据
				$scope.fOFRiskFundGroupWithFundProductService.queryUnAssigned(function(result){
		    		$scope.unAssignedEntitys = [];
		    		$scope.assignedEntitys = [];
		    		if(result != null && result.length > 0){
		    			$scope.unAssignedEntitys = result;
		    		}
		    		$scope.fOFRiskFundGroupWithFundProductService.queryAssigned(function(result){
			    		if(result != null && result.length > 0){
			    			$scope.assignedEntitys = result;
			    		}
			    		$scope.find($scope.queryEntity);
			    	},{
			    		fundGroupID: $scope.currentFundGroupEntity.fundGroupID,
			    		instClientID: $scope.currentFundGroupEntity.instClientID
			    	});
			    	$scope.groupProductAddList = [];
					$scope.chooseStatus = false;
					layer.close(count);
		    	},{
		    		fundGroupID: $scope.currentFundGroupEntity.fundGroupID,
		    		instClientID: $scope.currentFundGroupEntity.instClientID
		    	});
			},entity.id);
		});
	}
	
});
