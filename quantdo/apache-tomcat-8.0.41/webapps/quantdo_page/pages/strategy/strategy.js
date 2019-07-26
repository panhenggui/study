myapp.controller('StrategyController', function ($scope,$rootScope, $timeout) {
	//调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
	$scope.strategyService = new com.quantdo.orgClear.service.strategyService();
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
	
    $scope.listEntitys = [];
    $scope.queryEntity = {};
    $scope.modalEntity = {};
    $scope.strategyDataset=[];
    $scope.strategy_add = isShow("strategy_add");
    $scope.strategy_query = isShow("strategy_query");
    $scope.strategy_update = isShow("strategy_update");
    $scope.strategy_delete = isShow("strategy_delete");
    $scope.strategy_start = isShow("strategy_start");
	
    //初始化机构信息
    $scope.queryinstClientlists =[];
    $scope.instClientService.findByQuery(function (result) {
        $scope.queryinstClientlists = result;
        $scope.$apply();
        $scope.find();
    },{amType:"2"});
    
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
	
    //定义系统用户管理表的固定列头
    $scope.strategy_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "策略代码"},
        {title: "策略简称"},
        {title: "所属机构"},
        {title: "创建人"},
        {title: "创建时间"},        
        {title: "操作"}
    ];    
    
    // 重置表单验证信息
    function formValidateReset() {
		if($scope.strategyForm != undefined){
			$scope.strategyForm.instClientID.$setPristine();
			$scope.strategyForm.strategyID.$setPristine();
			$scope.strategyForm.strategyAbbrName.$setPristine();
			$scope.strategyForm.strategyName.$setPristine();
			$scope.strategyForm.strategyInfo.$setPristine();
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
    };

    // 修改
    $scope.initUpdateParam = function (entity,index) {
    	$scope.modalEntity = {};
		$scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.modalEntity = angular.copy($scope.tempEntity);
		//$scope.modalEntity.remark = htmlDecodeJQ($scope.modalEntity.remark);
        formValidateReset();
        $scope.isUpdate = true;
    };

    // 新增账户信息
    $scope.save = function (entity) {
        var index = entity.id;
        var tableIndex = entity.index;
		//entity.remark = htmlEncodeJQ(entity.remark);
        // 增加
        if (index == undefined) {
        	$scope.strategyService.checkByQuery(function (result) {
                if (result != null && result.length > 0) {
                    layer.msg("该机构下策略记录已存在，新增失败", {icon: 2});
                    return false;
                }else{
                	$scope.strategyService.add(function (result) {
                		if(result != null){
                        	layer.msg("新增成功",{icon: 1});
                    		$scope.listEntitys.unshift(result);
                            $scope.$apply();
                            $scope.find();
                            // 关闭窗口
                            $("#strategyModal").modal("hide");                                       			
                		}else{
                			layer.msg("新增失败",{icon: 2});
                		}
                    }, entity);
                }
            }, {
            	instClientID: entity.instClientID,
            	strategyID: entity.strategyID
            });
            // 修改
        } else {
        	$scope.strategyService.update(function (result) {
        		if(result != null){
        			if(result.instClientID == null){
                		layer.msg(result.remark,{icon: 2});
                	}else{
	        			result.index = tableIndex;
	        			layer.msg("修改成功",{icon: 1});
	        			$scope.listEntitys.splice(tableIndex-1, 1, result);
	        			$scope.strategyTable.cells().every( function () {
		                    if((tableIndex-1) == this[0][0].row){
		                        if(this[0][0].column == 3){
		                            this.data(entity.strategyAbbrName);
		                            $scope.$apply();
		                        }
		                    }
	        			});
		        		//$scope.find();
		        		// 关闭窗口
		                $("#strategyModal").modal("hide");
                	}
        		}else{
        			layer.msg("新增失败",{icon: 2});
        		}
	        }, entity);
        }
    };

	// 查询(前台分页)
    $scope.find = function(){
    	//将数据集赋值为空
    	$scope.strategyDataset = [];
    	//更新表格对应的数据集
    	$scope.strategyService.findByQuery(function (result) {
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	var operate1 = $scope.getUpdatePermision($scope.strategy_update); 
            	var operate2 = $scope.getStartPermision(con[i].isActive,$scope.strategy_start);
            	var operate3 = $scope.getDeletePermision($scope.strategy_delete);
                var tempArr = [(i+1),con[i].id,con[i].strategyID, con[i].strategyAbbrName,$scope.transInstClientID(con[i].instClientID)
                               ,con[i].creator,con[i].createDate,operate1+operate2+operate3];
	            $scope.strategyDataset.push(tempArr);
	            con[i].index = tempArr[0];
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.strategyTable.clear().draw();
            $scope.strategyTable.rows.add($scope.strategyDataset).draw();
        }, $scope.queryEntity);
    }
    
    $scope.transInstClientID = function(instClientID){
    	for(var i=0;i<$scope.queryinstClientlists.length;i++){
			if($scope.queryinstClientlists[i].instClientID == instClientID){
				return $scope.queryinstClientlists[i].instClientName;
			}
		}
    }
    
    $("body").undelegate("#strategy_dynamic_table_wrapper td .update-row","click");
    //表格中修改的单击事件
    $("body").delegate("#strategy_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.strategyTable.row(mytr).data();
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
    
    $("body").undelegate("#strategy_dynamic_table_wrapper td .delete-row","click");
    //表格中删除的单击事件
    $("body").delegate("#strategy_dynamic_table_wrapper td .delete-row","click",function(){
	var mytr = $(this).parents("tr");
	    var tempArr = $scope.strategyTable.row(mytr).data();
	    var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        
        
        $scope.strategyService.checkStrategyUsed(function (result) {
    		 if(result){
    				layer.msg("该策略信息已经被使用不允许删除！ ",{icon: 2});
    		 }else {
    			    layer.confirm('确定删除该策略信息？', {icon: 3}, function (count) {
    			    	$scope.strategyService.remove(function (result) {
    			    		layer.msg("该策略信息删除成功!", {icon : 1,time : 2000});
    			            $scope.find();
    			        }, $scope.modalEntity);  
    			    });
    		 }
        }, $scope.modalEntity);  
        
        
        

	});
    
    $("body").undelegate("#strategy_dynamic_table_wrapper td .fobid-operation","click");
    //表格停用事件
    $("body").delegate("#strategy_dynamic_table_wrapper td .fobid-operation","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.strategyTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
	    layer.confirm('确定停用该策略？', {icon: 3}, function (count) {
	    	$scope.strategyService.stop(function (result) {
	    		layer.msg("该策略停用成功!", {icon : 1,time : 2000});
	            $scope.find();
	        }, $scope.modalEntity);  
	    });
    });
    $("body").undelegate("#strategy_dynamic_table_wrapper td .starts-row","click");
     //表格启用事件
    $("body").delegate("#strategy_dynamic_table_wrapper td .starts-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.strategyTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
	    layer.confirm('确定启用该策略？', {icon: 3}, function (count) {
	    	$scope.strategyService.start(function (result) {
	    		layer.msg("该策略启用成功!", {icon : 1,time : 2000});
	            $scope.find();
	        }, $scope.modalEntity);  
	    });
    });
    
    //获取修改权限
    $scope.getUpdatePermision = function(flag){
    	  var result = "";
	  	  if(flag){
	  		  result = "<a class='update-row' data-toggle='modal' data-target='#strategyModal'>修改</a>";
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
    //获取启用停用权限
    $scope.getStartPermision = function(isActive,flag){
    	var result = '';
    	if(flag){
    		if(isActive==1){
    			result = "<a class='row-operation-distance fobid-operation'>停用</a>";
    		}else if(isActive==0){
    			result = "<a class='row-operation-distance reset-operation starts-row'>启用</a>";
    		}
    	}
    	return result;
    }

    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.strategyTable = $('#strategy_dynamic_table').DataTable( {
    		data : $scope.strategyDataset,
        	columns :$scope.strategy_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: []
        } );
    });
    
});

