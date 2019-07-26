myapp.controller('DeferredFeeSetController', function ($scope, $timeout,$rootScope) {
    
	$scope.queryEntity={};
	$scope.directions = clearConstant.deferredDirection;
    $scope.queryEntity.startDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());
    $scope.DeferredFeeSetDataset = [];
    
	$scope.deferredFeeSet_query = isShow("deferredFeeSet_query");
	$scope.deferredFeeSet_add = isShow("deferredFeeSet_add");
	$scope.deferredFeeSet_update = isShow("deferredFeeSet_update");
	$scope.deferredFeeSet_delete = isShow("deferredFeeSet_delete");
	
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	
	//定义固定列头
    $scope.DeferredFeeSet_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "日期"},
        {title: "合约代码"},
        {title: "支付方向"},
        {title: "递延费率"},
        {title: "操作"}
	]
    
    
	//初始化页面信息
    getAllDeferredFeeSetEntity(function (result) {
    	angular.forEach(result, function (value, index, arrays) {
			if(value.settleDate==clearConstant.formatDate(new Date())){
				result[index].canOper=true;
			}else{
				result[index].canOper=false;
			}
		});
    	$scope.listEntitys = result;
           
    	$scope.$apply();
    });
    $scope.ModalEntity = {};
    $scope.canClick=false;

  //转换收取方式
	$scope.transDeferredDir= function (key){
		var count = $scope.directions.length;
		for (var i = 0; i < count; i++) {
			if ($scope.directions[i].key == key) {
				return $scope.directions[i].text;
			}
		}
	};
    //初始化所有产品信息并默人选中第一项
    getProductByCont(function (result) {
        $scope.productDatas = result;
        /*if($scope.productDatas.length>0){
            $scope.queryEntity.productID = $scope.productDatas[0].productID;
        }*/
    	$scope.$apply();
    });

    //查询
/*    $scope.find = function (queryEntity) {
        $scope.listEntitys = {};
        $scope.isQuery = true;
        findDeferredFeeSetEntity(function (result) {
        	angular.forEach(result, function (value, index, arrays) {
    			if(value.settleDate==clearConstant.formatDate(new Date())){
    				result[index].canOper=true;
    			}else{
    				result[index].canOper=false;
    			}
    		});
            $scope.listEntitys = result;
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        }, queryEntity);
    };*/
    $("body").undelegate("#DeferredFeeSet_dynamic_table_wrapper td .update-row","click");
    //表格修改事件
    $("body").delegate("#DeferredFeeSet_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.DeferredFeeSetTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $timeout(function() {
        	$scope.initUpdateParam(id,$scope.modalEntity);
        },500);
    });
    
    $("body").undelegate("#DeferredFeeSet_dynamic_table_wrapper td .delete-row","click");
  //表格删除事件
    $("body").delegate("#DeferredFeeSet_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.DeferredFeeSetTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
       $scope.remove(id,$scope.modalEntity);
    });

    // 根据页面条件查询
    $scope.find = function () {  	
    	$scope.isQuery = true;
		$scope.DeferredFeeSetDataset = [];
		$scope.listEntitys = [];
		findDeferredFeeSetEntity(function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator1 = $scope.getUpdate($scope.deferredFeeSet_update);
				var operator2 = $scope.getDelete($scope.deferredFeeSet_delete);
		    	var tempArr = [(i+1),con[i].id,con[i].settleDate,con[i].productID,$scope.transDeferredDir(con[i].direction)
		    	               ,con[i].deferredFeeRate+"%",operator1+operator2]
		    	$scope.DeferredFeeSetDataset.push(tempArr); 
		    	con[i].index = i+1;
			}
			$scope.listEntitys = con;
			//重新绘表
	        $scope.DeferredFeeSetTable.clear().draw();
	        $scope.DeferredFeeSetTable.rows.add($scope.DeferredFeeSetDataset).draw();
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		},$scope.queryEntity);
    };
    $timeout(function() {
    	$scope.find(); 
     }, 500);
    
	$scope.getUpdate = function(flag){
		var result = "";
		if(flag){
			result = "<a class='update-row' data-toggle='modal' data-target='#deferredFeeSetModal'>修改</a>"; 
		}
		return result;
	}

	$scope.getDelete = function(flag){
		var result = "";
		if(flag){
			result = "<a class='delete-row'>删除</a>";
		}
		return result;
	}

    function formValidateReset(){
    	$scope.myForm.settleDate.$setPristine();
    	$scope.myForm.productID.$setPristine();
    	$scope.myForm.direction.$setPristine();
    	$scope.myForm.deferredFeeRate.$setPristine();
    }
    $scope.initParameter = function () {
    	$scope.isUpdate = false;
        $scope.ModalEntity = {};
        $scope.ModalEntity.settleDate = clearConstant.formatDate(new Date());
        $scope.ModalEntity.productID = $scope.productDatas[0].productID;
        $scope.ModalEntity.direction = $scope.directions[0].key;
        formValidateReset();
    };

    //修改
    $scope.initUpdateParam = function (index, entity) {
    	$scope.isUpdate = true;
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        formValidateReset();
    };

    $scope.save = function (entity) {
    	$scope.canClick=true;
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        $scope.tempEntity = angular.copy(entity);
        //增加
        if (index == undefined) {
        	checkDeferredFeeSetEntity(function (result){
        		if(result.length > 0){
        			$scope.canClick=false;
        			layer.msg("记录已存在，新增失败", {
						icon : 2,
						time : 3000
					});
        		}else{
        			saveDeferredFeeSetEntity(function (addResult){
        				if(addResult.settleDate==clearConstant.formatDate(new Date())){
        					addResult.canOper=true;
            			}else{
            				addResult.canOper=false;
            			}
        				$timeout(function() {
        	                $scope.find();//对应方法
        	            }, 500);
        				$scope.listEntitys.unshift(addResult);
        				$scope.$apply();
        				//关闭窗口
        		        $("#deferredFeeSetModal").modal("hide");
        			},$scope.tempEntity);
            	}
        	},entity);
            //修改
        } else {
            updateDeferredFeeSetEntity($scope.tempEntity);
            $scope.tempEntity.canOper=true;
            /*$timeout(function() {
                $scope.find();//对应方法
            }, 500);*/
            $scope.tempEntity.index = tableIndex; 
            $scope.listEntitys.splice(tableIndex-1, 1, $scope.tempEntity);
            
    		$scope.DeferredFeeSetTable.cells().every( function () {
                if((tableIndex-1) == this[0][0].row){
                    if(this[0][0].column == 4){
                        this.data($scope.transDeferredDir($scope.tempEntity.direction));
                        $scope.$apply();
                    }
                    if(this[0][0].column == 5){
                        this.data($scope.tempEntity.deferredFeeRate+"%");
                        $scope.$apply();
                    }

                }

        });

          //关闭窗口
            $("#deferredFeeSetModal").modal("hide");
        }
        $timeout(function() {
            $scope.canClick = false;
        }, 2000); 
    };

    //删除
    $scope.remove = function (index, entity) {
    	layer.confirm('确定删除？', {icon: 3}, function (count) {
	        deleteDeferredFeeSetEntity(entity.id);
	        $scope.listEntitys.splice(index, 1);
	        $timeout(function() {
                $scope.find();//对应方法
            }, 500);
	        layer.close(count);
            $scope.$apply();
    	});
    };
    
  //初始化
    $(document).ready(function() {
		    	//会话列表初始化
		    	$scope.DeferredFeeSetTable = $('#DeferredFeeSet_dynamic_table').DataTable( {
			    		data : $scope.DeferredFeeSetDataset,
			        	columns :$scope.DeferredFeeSet_columns,
			            dom: 'rt<"bottom"iplB>',
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: []
		        } );
      });

});

