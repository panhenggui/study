myapp.controller('CapitalAccountPrincipalController', function ($scope,$rootScope, $timeout) {
	//调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
	$scope.capitalAccountPrincipalService = new com.quantdo.orgClear.servicesyspecial.capitalAccountPrincipalService();
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
	
    $scope.listEntitys = [];
    $scope.queryEntity = {};
    $scope.modalEntity = {};
    $scope.capitalAccountPrincipalDataset = [];
    $scope.allAccountEntitys = [];
    
    $scope.capitalAccountPrincipal_add = isShow("capitalAccountPrincipal_add");
    $scope.capitalAccountPrincipal_query = isShow("capitalAccountPrincipal_query");
    $scope.capitalAccountPrincipal_update = isShow("capitalAccountPrincipal_update");
    $scope.capitalAccountPrincipal_delete = isShow("capitalAccountPrincipal_delete");
	
    //初始化机构信息
    $scope.queryinstClientlists =[];
    $scope.instClientService.findByQuery(function (result) {
        $scope.queryinstClientlists = result;
        $scope.$apply();
        $scope.find();
    },{amType:""});
    
    $scope.instClientID = '';
    //判定登录用户的机构权限
    queryInstClientID(function (result) {
        $scope.instClientID = result;
        $scope.queryEntity={};
        if($scope.instClientID != undefined ){
        	$scope.isInstClient = true;
        	$scope.queryEntity.instClientID=$scope.instClientID;
        }else{
        	$scope.isInstClient = false;
        }
        
        $scope.$apply();
    });
    
    /*//所有资金帐号
    getAllCapitalAccountEntity(function (result) {
        $scope.queryAccountEntitys = result;
        $scope.allAccountEntitys = result;
        $scope.$apply();
    });*/
    
    //查询资产单元
	findBySubCapitalAccountInfo({"instClientID":""}, function(result){
		$scope.queryAccountEntitys = result;
		$scope.allAccountEntitys = result;
		/*for(var i=0;i<$scope.queryAccountEntitys.length;i++){
			$scope.queryAccountEntitys[i].innerAccountID = $scope.queryAccountEntitys[i].subAccountID;
		}*/
		$scope.$apply();
	});
    
    //查询的机构改变的事件
    $scope.changeInstClient = function(){
    	if("" == $scope.queryEntity.instClientID){
    		$scope.queryEntity.instClientID = null;
    	}
		//查询资产单元
    	findBySubCapitalAccountInfo({"instClientID":$scope.queryEntity.instClientID}, function(result){
			$scope.queryAccountEntitys = result;
			/*for(var i=0;i<$scope.queryAccountEntitys.length;i++){
				$scope.queryAccountEntitys[i].innerAccountID = $scope.queryAccountEntitys[i].subAccountID;
			}*/
			$scope.$apply();
		});
	}
	
    // 重置表单验证信息
    function formValidateReset() {
		if($scope.capitalAccountPrincipalForm != undefined){
			$scope.capitalAccountPrincipalForm.instClientID.$setPristine();
			$scope.capitalAccountPrincipalForm.innerAccountID.$setPristine();
			$scope.capitalAccountPrincipalForm.realPrincipal.$setPristine();
		}
    }

    // 初始化页面参数
    $scope.initParameter = function () {
        // 设置默认选中
    	$scope.modalEntity = {};
        formValidateReset();
        $scope.isUpdate = false;
        if($scope.instClientID != undefined ){
        	$scope.isInstClient = true;
        	$scope.modalEntity.instClientID=$scope.instClientID;
        }else{
        	$scope.isInstClient = false;
        	$scope.modalEntity.instClientID=$scope.queryinstClientlists[0].instClientID;
        }
        
        if("" == $scope.modalEntity.instClientID){
    		$scope.modalEntity.instClientID = null;
    	}
		//查询资金账号
		/*findCapitalAccountByQuery({"brokerageFirmID":$scope.modalEntity.instClientID}, function(result){
			$scope.modalAccountEntitys = result;
			$scope.modalEntity.innerAccountID=$scope.modalAccountEntitys[0].innerAccountID;
			$scope.$apply();
			$("#capitalAccountPrincipalModal").modal("show");
		});*/
        //查询资产单元
    	findBySubCapitalAccountInfo({"instClientID":$scope.modalEntity.instClientID}, function(result){
			$scope.modalAccountEntitys = result;
			if(result.length > 0){
				$scope.modalEntity.innerAccountID=$scope.modalAccountEntitys[0].subAccountID;
			}else{
				$scope.modalEntity.innerAccountID=null;
			}
			$scope.$apply();
			$("#capitalAccountPrincipalModal").modal("show");
		});
    };
    
    //修改的机构改变的事件
    $scope.changeInstClientModal = function(){
    	if("" == $scope.modalEntity.instClientID){
    		$scope.modalEntity.instClientID = null;
    	}
		/*//查询资金账号
		findCapitalAccountByQuery({"brokerageFirmID":$scope.modalEntity.instClientID}, function(result){
			$scope.modalAccountEntitys = result;
			$scope.modalEntity.innerAccountID=$scope.modalAccountEntitys[0].innerAccountID;
			$scope.$apply();
		});*/
    	//查询资产单元
    	findBySubCapitalAccountInfo({"instClientID":$scope.modalEntity.instClientID}, function(result){
			$scope.modalAccountEntitys = result;
			if(result.length > 0){
				$scope.modalEntity.innerAccountID=$scope.modalAccountEntitys[0].subAccountID;
			}else{
				$scope.modalEntity.innerAccountID=null;
			}
			$scope.$apply();
		});
	}

    // 修改
    $scope.initUpdateParam = function (entity,index) {
    	$scope.modalEntity = {};
		$scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.modalEntity = angular.copy($scope.tempEntity);
        findBySubCapitalAccountInfo({"instClientID":$scope.modalEntity.instClientID}, function(result){
			$scope.modalAccountEntitys = result;
			$scope.$apply();
		});
		//$scope.modalEntity.remark = htmlDecodeJQ($scope.modalEntity.remark);
        formValidateReset();
        $scope.isUpdate = true;
        $scope.$apply();
    };

    // 新增账户信息
    $scope.save = function (entity) {
        var index = entity.id;
        var tableIndex = entity.index;
		//entity.remark = htmlEncodeJQ(entity.remark);
        // 增加
        if (index == undefined) {
        	$scope.capitalAccountPrincipalService.findByQuery(function (result) {
                if (result != null && result.length > 0) {
                    layer.msg("该机构下资产单元的名义本金已存在，新增失败", {icon: 2});
                    return false;
                }else{
                	$scope.capitalAccountPrincipalService.add(function (result) {
                		if(result != null){
                        	layer.msg("新增成功",{icon: 1});
                    		$scope.listEntitys.unshift(result);
                            $scope.$apply();
                            $scope.find();
                            // 关闭窗口
                            $("#capitalAccountPrincipalModal").modal("hide");                                       			
                		}else{
                			layer.msg("新增失败",{icon: 2});
                		}
                    }, entity);
                }
            }, {
            	instClientID: entity.instClientID,
            	innerAccountID: entity.innerAccountID
            });
            // 修改
        } else {
        	$scope.capitalAccountPrincipalService.update(function (result) {
        		if(result != null){
	    			result.index = tableIndex;
	    			layer.msg("修改成功",{icon: 1});
	    			$scope.listEntitys.splice(tableIndex-1, 1, result);
	    			$scope.capitalAccountPrincipalTable.cells().every( function () {
	                    if((tableIndex-1) == this[0][0].row){
	                        if(this[0][0].column == 4){
	                            this.data(parseFloat(entity.realPrincipal).toFixed(3));
	                            $scope.$apply();
	                        }
	                    }
	    			});
	        		//$scope.find();
	        		// 关闭窗口
	                $("#capitalAccountPrincipalModal").modal("hide");
        		}else{
        			layer.msg("修改失败",{icon: 2});
        		}
	        }, entity);
        }
    };

	// 查询(前台分页)
    $scope.find = function(){
    	//将数据集赋值为空
    	$scope.capitalAccountPrincipalDataset = [];
    	//更新表格对应的数据集
    	$scope.capitalAccountPrincipalService.findByQuery(function (result) {
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	var operate1 = $scope.getUpdatePermision($scope.capitalAccountPrincipal_update); 
            	var operate2 = $scope.getDeletePermision($scope.capitalAccountPrincipal_delete);
                var tempArr = [(i+1),con[i].id,$scope.transInstClientID(con[i].instClientID),con[i].innerAccountID,parseFloat(con[i].realPrincipal).toFixed(3),
                    con[i].operatorID,con[i].operateDate,con[i].operateTime,operate1+operate2];
	            $scope.capitalAccountPrincipalDataset.push(tempArr);
	            con[i].index = tempArr[0];
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.capitalAccountPrincipalTable.clear().draw();
            $scope.capitalAccountPrincipalTable.rows.add($scope.capitalAccountPrincipalDataset).draw();
        }, $scope.queryEntity);
    }
    
    $scope.transInstClientID = function(instClientID){
    	for(var i=0;i<$scope.queryinstClientlists.length;i++){
			if($scope.queryinstClientlists[i].instClientID == instClientID){
				return $scope.queryinstClientlists[i].instClientName;
			}
		}
    }
    
    $("body").undelegate("#capitalAccountPrincipal_dynamic_table_wrapper td .update-row","click");
    //表格中修改的单击事件
    $("body").delegate("#capitalAccountPrincipal_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.capitalAccountPrincipalTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        formValidateReset();
        $scope.isUpdate = true;
        $scope.initUpdateParam($scope.modalEntity,id);
        $scope.$apply();
    });
    
    $("body").undelegate("#capitalAccountPrincipal_dynamic_table_wrapper td .delete-row","click");
    //表格中删除的单击事件
    $("body").delegate("#capitalAccountPrincipal_dynamic_table_wrapper td .delete-row","click",function(){
	var mytr = $(this).parents("tr");
	    var tempArr = $scope.capitalAccountPrincipalTable.row(mytr).data();
	    var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        
	    layer.confirm('确定删除该资产单元的名义本金？', {icon: 3}, function (count) {
	    	$scope.capitalAccountPrincipalService.remove(function (result) {
	    		layer.msg("该资产单元的名义本金删除成功!", {icon : 1,time : 2000});
	            $scope.find();
	        }, $scope.modalEntity);  
	    });
       
	});
    
    //获取修改权限
    $scope.getUpdatePermision = function(flag){
    	  var result = "";
	  	  if(flag){
	  		  result = "<a class='update-row' data-toggle='modal' data-target='#capitalAccountPrincipalModal' >修改</a>";
	  	  }
	  	  return result;
    }
    //获取删除权限
    $scope.getDeletePermision = function(flag){
    	  var result = "";
    	  if(flag){
    		  result = "<a class='delete-row'>删除</a>";
    	  }
    	  return result;
    }

    //定义系统用户管理表的固定列头
    $scope.capitalAccountPrincipal_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "所属机构"},
        {title: "资产单元"},
        {title: "名义本金"},
        {title: "操作人"},
        {title: "操作日期"},
        {title: "操作时间"},        
        {title: "操作"}
    ];   

    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.capitalAccountPrincipalTable = $('#capitalAccountPrincipal_dynamic_table').DataTable( {
    		data : $scope.capitalAccountPrincipalDataset,
        	columns :$scope.capitalAccountPrincipal_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: []
        } );
    });
    
});

