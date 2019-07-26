myapp.controller('AccountGroupController', function($scope,$rootScope, $timeout) {
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
    $scope.accountGroupService = new com.quantdo.orgClear.service.AccountGroupService();
	$scope.listEntitys = {};// 资金账号分组信息
	$scope.isUpdate = false;
	$scope.canClick=false;
	$scope.tempEntity = {};
	$scope.tempEntity.recordIndex = -1;
	$scope.traders = {};
    $scope.queryEntity = {};
	$scope.ModalEntity = {};
	$scope.accountGroups={};
    $scope.instClientlistEntitys=[];    
	$scope.AccountGroupDataset = [];

	$scope.changeInstClient = function (instClientID) {
        findByAccountGroup(function(result){
            $scope.accountGroups = result;
            $scope.$apply();
        },{instClientID:instClientID});
    }

	
	//定义固定列头
    $scope.AccountGroup_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "所属机构"},
        {title: "分组代码"},
        {title: "分组名称"},
        {title: "管理员"},
        {title: "操作日期"},
        {title: "操作时间"},
		{title: "操作"}
	];
    
    // 按钮权限
    $scope.accountGroup_query = isShow("accountGroup_query");
    $scope.accountGroup_add = isShow("accountGroup_add");
    $scope.accountGroup_update = isShow("accountGroup_update");
    $scope.accountGroup_delete = isShow("accountGroup_delete");

    $scope.instClientList = [];
    getInstClientQueryConditionList(function(result){
        $scope.instClientList = angular.copy(result);
        if($scope.instClientList.length > 1){
            $scope.queryEntity.instClientID = "";
        }else{
            $scope.queryEntity.instClientID = $scope.instClientList[0].instClientID;
        }
        $scope.$apply();
        findByAccountGroup(function(result){
            $scope.accountGroups = result;
            $scope.$apply();
        },{instClientID:$scope.queryEntity.instClientID});
    });

    queryInstClientID(function(result){
        if(result != undefined){
            $scope.noInst = true;
        }else{
            $scope.noInst = false;
        }
    });

	//验证表达信息
	function formValidateReset() {
		$scope.myForm.instClientID.$setPristine();
		$scope.myForm.accountGroupID.$setPristine();
		$scope.myForm.accountGroupName.$setPristine();
	}
	
	
	$("body").undelegate("#AccountGroup_dynamic_table_wrapper td .update-row","click");
    //表格修改事件
    $("body").delegate("#AccountGroup_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.AccountGroupTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $timeout(function() {
        	$scope.initUpdateParam(id,$scope.modalEntity);
         }, 500);
    });
    
    $("body").undelegate("#AccountGroup_dynamic_table_wrapper td .delete-row","click");
    //表格删除事件
    $("body").delegate("#AccountGroup_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.AccountGroupTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
                $scope.modalEntity = $scope.listEntitys[i];
        	}
        }
       $scope.remove($scope.modalEntity.index,$scope.modalEntity);
    });

    // 修改初始化信息
    $scope.initUpdateParam = function(index, entity) {
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        formValidateReset();
        $scope.isUpdate = true;
    };

    $scope.initParameter = function() {
        $scope.ModalEntity={};
        $scope.isUpdate = false;
        formValidateReset();
        $scope.ModalEntity.instClientID = $scope.instClientList[0].instClientID;

        $scope.accountGroupService.getMaxAccountGroupID(function (result) {
            $scope.ModalEntity.accountGroupID = result;
            $("#accountGroupModal").modal("show");
            $scope.$apply();
        });
    };

    // 保存操作记录
    $scope.save = function(entity) {
        $scope.canClick=true;
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        // 分组代码是否存在
        if (index != undefined) {
            // 修改
            updateAccountGroupEntity(function(result) {
                result.index = tableIndex;
                $scope.listEntitys.splice(tableIndex-1, 1, result);
                $scope.accountGroups.splice(tableIndex-1, 1, result);
                $scope.$apply();
                //$scope.find();
                $scope.AccountGroupTable.cells().every( function () {
                    if ((tableIndex - 1) == this[0][0].row) {
                        if (this[0][0].column == 4) {
                            this.data(entity.accountGroupName);
                            $scope.$apply();
                        }
                    }
                    if ((tableIndex - 1) == this[0][0].row) {
                        if (this[0][0].column == 5) {
                            this.data(result.operatorID);
                            $scope.$apply();
                        }
                    }
                    if ((tableIndex - 1) == this[0][0].row) {
                        if (this[0][0].column == 6) {
                            this.data(result.operateDate);
                            $scope.$apply();
                        }
                    }
                    if ((tableIndex - 1) == this[0][0].row) {
                        if (this[0][0].column == 7) {
                            this.data(result.operateTime);
                            $scope.$apply();
                        }
                    }
                });
                $("#accountGroupModal").modal("hide");
            }, entity);
        } else {
			saveAccountGroup(function(result) {
                $scope.accountGroups.push(result);
				$scope.$apply();
				$scope.find();
				$("#accountGroupModal").modal("hide");
			}, entity);
        }
        $timeout(function() {
            $scope.canClick = false;
        }, 2000);
    };

    // 删除
    $scope.remove = function(index, entity) {
		//校验与之对应的资产单元状态不为销户
		checkSubAccountByGroupId(function (result) {
			if (result) {
				layer.msg("分组代码与资产单元建立了对应关系，不允许删除", {icon: 2});
				return false;
			} else {
				layer.confirm('确定删除？', {icon : 3}, function(count) {
					deleteAccountGroup(entity.id);
                    $scope.accountGroups.splice(index-1, 1);
					layer.close(count);
					$scope.$apply();
					$timeout(function() {
						$scope.find();
					}, 500);
				});
			}
		}, {
			accountGroupID: entity.accountGroupID,instClientID:null
		});
    }

    // 根据页面条件查询
    $scope.find = function () {  	
    	$scope.isQuery = true;
		$scope.AccountGroupDataset = [];
		findByAccountGroup(function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator = "";
				if($scope.accountGroup_update){
					operator = operator.concat("<a class='update-row' data-toggle='modal' data-target='#accountGroupModal'>修改</a>");
				}if($scope.accountGroup_delete){
					operator = operator.concat("<a class='delete-row'>删除</a>");
				}
//				var operator = "<a class='update-row' data-toggle='modal' data-target='#accountGroupModal'>修改</a><a class='delete-row'>删除</a>";
		    	var tempArr = [(i+1),con[i].id,$scope.transInstClient(con[i].instClientID), con[i].accountGroupID ,con[i].accountGroupName, con[i].operatorID ,
		    	               con[i].operateDate ,con[i].operateTime,operator]
		    	$scope.AccountGroupDataset.push(tempArr);
				con[i].index = i+1;
			}
			//重新绘表
            $scope.listEntitys = con;
	        $scope.AccountGroupTable.clear().draw();
	        $scope.AccountGroupTable.rows.add($scope.AccountGroupDataset).draw();
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		},$scope.queryEntity);
    };
    $timeout(function() {
    	$scope.find(); 
     }, 1000);

    //机构名称转换
    $scope.transInstClient = function (instClientID) {
        for(var i = 0;i < $scope.instClientList.length; i++){
            if($scope.instClientList[i].instClientID == instClientID){
                return $scope.instClientList[i].instClientAbbrName;
            }
        }
    }



    //定义固定列头
    $scope.AccountGroup_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "所属机构"},
        {title: "分组代码"},
        {title: "分组名称"},
        {title: "操作员"},
        {title: "操作日期"},
        {title: "操作时间"},
        {title: "操作"}
    ];
	
	//初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.AccountGroupTable = $('#AccountGroup_dynamic_table').DataTable( {
    		data : $scope.AccountGroupDataset,
        	columns :$scope.AccountGroup_columns,
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
