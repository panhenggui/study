myapp.controller('InstParameterController', function ($scope,$rootScope, $timeout) {
	//调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
	$scope.instParameterService = new com.quantdo.orgClear.service.instParameterService();
    $scope.listEntitys = [];
    $scope.queryEntity = {};
    $scope.modalEntity = {};
    $scope.instParameterDataset=[];
    $scope.instParameter_add = isShow("instParameter_add");
    $scope.instParameter_query = isShow("instParameter_query");
    $scope.instParameter_update = isShow("instParameter_update");
    $scope.instParameter_delete = isShow("instParameter_delete");;
    
    //初始化机构信息
    $scope.queryinstClientlists =[];
    $scope.instClientService.findByQuery(function (result) {
        $scope.queryinstClientlists = result;
        $scope.$apply();
    },{});
    
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
        $scope.find();
        $scope.$apply();
    });
	
    //根据机构代码显示机构简称
	$scope.changeInstClientAbbrName = function(instClientID){
		for(var i=0;i<$scope.queryinstClientlists.length;i++){
			if($scope.queryinstClientlists[i].instClientID == instClientID){
				$scope.modalEntity.instClientAbbrName = $scope.queryinstClientlists[i].instClientAbbrName;
				if($scope.queryinstClientlists[i].amType == "1"){
					 $scope.isMom = false;
				 }else {
					 $scope.isMom = true;
				 }
			}
			
		}
	}
	
	$scope.getIsMom = function(instClientID){
		for(var i=0;i<$scope.queryinstClientlists.length;i++){
			if($scope.queryinstClientlists[i].instClientID == instClientID){
				 if($scope.queryinstClientlists[i].amType == "1"){
					 $scope.isMom = false;
				 }else {
					 $scope.isMom = true;
				 }
			}
		}
	}
	
    //定义系统用户管理表的固定列头
    $scope.instParameter_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "机构代码"},
        {title: "机构简称"},
        {title: "资金账户最大数量限制"},
        {title: "资产单元最大数量限制" },
        {title: "交易员最大数量限制"},
        {title: "备注"},
        {title: "创建人"},
        {title: "创建时间"},        
        {title: "操作"}
    ];    
    
    // 重置表单验证信息
    function formValidateReset() {
		if($scope.instParameterForm != undefined){
			$scope.instParameterForm.instClientID.$setPristine();
			$scope.instParameterForm.instClientAbbrName.$setPristine();
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
        $scope.changeInstClientAbbrName($scope.modalEntity.instClientID);
        $scope.modalEntity.accountNumber = 0;
        $scope.modalEntity.subAccountNumber = 0;
        $scope.modalEntity.traderNumber = 0;
    };

    // 修改
    $scope.initUpdateParam = function (entity,index) {
    	$scope.modalEntity = {};
		$scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.modalEntity = angular.copy($scope.tempEntity);
        $scope.getIsMom(entity.instClientID);
		//$scope.modalEntity.remark = htmlDecodeJQ($scope.modalEntity.remark);
        formValidateReset();
        $scope.isUpdate = true;
    };

    // 新增账户信息
    $scope.save = function (entity) {
    	if(! $scope.isMom){
    		entity.subAccountNumber="0";
    	}
        var index = entity.id;
        var tableIndex = entity.index;
		//entity.remark = htmlEncodeJQ(entity.remark);
        // 增加
        if (index == undefined) {
        	$scope.instParameterService.findByQuery(function (result) {
                if (result != null && result.length > 0) {
                    layer.msg("该机构参数记录已存在，新增失败", {icon: 2});
                    return false;
                }else{
                	$scope.instParameterService.add(function (result) {
                		if(result != null){
                        	if(result.instClientID == null){
                        		layer.msg(result.remark,{icon: 2});
                        	}else{
                        		layer.msg("新增成功",{icon: 1});
                    			$scope.listEntitys.unshift(result);
                                $scope.$apply();
                                $scope.find();
                                // 关闭窗口
                                $("#instParameterModal").modal("hide");
                        	}                			
                		}else{
                			layer.msg("新增失败",{icon: 2});
                		}
                    }, entity);
                }
            }, {
            	instClientID: entity.instClientID
            });
            // 修改
        } else {
        	$scope.instParameterService.update(function (result) {
        		if(result != null){
        			if(result.instClientID == null){
                		layer.msg(result.remark,{icon: 2});
                	}else{
	        			result.index = tableIndex;
	        			result.instClientAbbrName = entity.instClientAbbrName;
	        			layer.msg("修改成功",{icon: 1});
	        			$scope.listEntitys.splice(tableIndex-1, 1, result);
	        			$scope.instParameterTable.cells().every( function () {
		                    if((tableIndex-1) == this[0][0].row){
		                        if(this[0][0].column == 4){
		                            this.data(entity.accountNumber);
		                            $scope.$apply();
		                        }
		                        if(this[0][0].column == 5){
		                            this.data(entity.subAccountNumber);
		                            $scope.$apply();
		                        }
		                        if(this[0][0].column == 6){
		                            this.data(entity.traderNumber);
		                            $scope.$apply();
		                        }
		                        if(this[0][0].column == 7){
		                            this.data(entity.remark);
		                            $scope.$apply();
		                        }
		                    }
	        			});
		        		//$scope.find();
		        		// 关闭窗口
		                $("#instParameterModal").modal("hide");
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
    	$scope.instParameterDataset = [];
    	//更新表格对应的数据集
    	$scope.instParameterService.findByQuery(function (result) {
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	var operate1 = $scope.getUpdatePermision($scope.instParameter_update); 
            	var operate2 = $scope.getDeletePermision($scope.instParameter_delete);
                var tempArr = [(i+1),con[i].id,con[i].instClientID, con[i].instClientAbbrName,con[i].accountNumber,con[i].subAccountNumber
                               ,con[i].traderNumber,con[i].remark,con[i].creator,con[i].createDate,operate1+operate2];
	            $scope.instParameterDataset.push(tempArr);
	            con[i].index = tempArr[0];
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.instParameterTable.clear().draw();
            $scope.instParameterTable.rows.add($scope.instParameterDataset).draw();
        }, $scope.queryEntity);
    }
    
    
    $("body").undelegate("#instParameter_dynamic_table_wrapper td .update-row","click");
    //表格中修改的单击事件
    $("body").delegate("#instParameter_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.instParameterTable.row(mytr).data();
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
    
    $("body").undelegate("#instParameter_dynamic_table_wrapper td .delete-row","click");
    //表格中删除的单击事件
    $("body").delegate("#instParameter_dynamic_table_wrapper td .delete-row","click",function(){
	var mytr = $(this).parents("tr");
	    var tempArr = $scope.instParameterTable.row(mytr).data();
	    var instClientId = tempArr[2];
	    layer.confirm('确定删除该机构参数信息？', {icon: 3}, function (count) {
	    	$scope.instParameterService.remove(function (result) {
	    		layer.msg("该机构参数信息删除成功!", {icon : 1,time : 2000});
	            $scope.find();
	        }, instClientId);  
	    });
	});
    
    //获取修改权限
    $scope.getUpdatePermision = function(flag){
    	  var result = "";
	  	  if(flag){
	  		  result = "<a class='update-row' data-toggle='modal' data-target='#instParameterModal'>修改</a>";
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

    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.instParameterTable = $('#instParameter_dynamic_table').DataTable( {
    		data : $scope.instParameterDataset,
        	columns :$scope.instParameter_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: []
        } );
    });
    
});

