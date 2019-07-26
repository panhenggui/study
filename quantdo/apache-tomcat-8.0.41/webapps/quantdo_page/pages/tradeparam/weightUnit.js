myapp.controller('WeightUnitController', function ($scope, $timeout,$rootScope) {
    $scope.ModalEntity = {};
    
    // 按钮权限
    $scope.weightUnit_query = isShow("weightUnit_query");
    $scope.weightUnit_add = isShow("weightUnit_add");
    $scope.weightUnit_delete = isShow("weightUnit_delete");
    $scope.weightUnit_update = isShow("weightUnit_update");
    
    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
    
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,
	    autoclose: true,
	    clearBtn: true,
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});
    //定义查询对象
    $scope.queryEntity = {
        exchID: "",
        productID: "",
    };

    $scope.positionTypes = clearConstant.positionTypes;
    $scope.delivModes = clearConstant.delivModes;
    
    //转换币种
    $scope.transCurrencys = function(key){
    	for(var i = 0;i < $scope.currenys.length;i++){
    		if($scope.currenys[i].key == key){
    			return $scope.currenys[i].text;
    		}
    	}
    }
    
    $scope.exchangeDatas = {};
//    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
        defaultExchange = {};
        defaultExchange.exchID = "OTC";
        defaultExchange.exchName = "场外";
        $scope.exchangeDatas.unshift(defaultExchange);
        $scope.$apply();
    });

    //删除
    $scope.remove = function (index, entity) {
    	layer.confirm('确定删除该品种敞口信息？', {icon: 3}, function (count) {
    		deleteWeightUnitEntity(function (result) {
    			  $scope.listEntitys.splice(index, 1);
    	            $scope.$digest();
    	            layer.close(count);
    	        	layer.msg("该品种敞口信息删除成功!", {icon : 1,time : 2000});
    	            // 在查询一遍
    	            $scope.find($scope.queryEntity);
    	            $scope.$apply();
    		},entity.id);
          
    	});
    };
    
    //重置表单验证信息
    function formValidateReset() {
        $scope.myForm.productID.$setPristine();
        $scope.myForm.standardUnit.$setPristine();
        $scope.myForm.unit.$setPristine();
        $scope.myForm.converCoef.$setPristine();

    }

    //初始化模态窗
    $scope.initParameter = function () {
    	$scope.isUpdate = false;
        $scope.ModalEntity={};
        $scope.ModalEntity.exchID = $scope.exchangeDatas[0].exchID;
       
        formValidateReset();
    };

    //修改
    $scope.initUpdateParam = function (index, entity) {
    	$scope.isUpdate = true;
    	$scope.ModalEntity = {};
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        if(entity.converCoefStr == undefined ){
        	 $scope.ModalEntity.converCoef=entity.converCoef;
        }else{
        	  $scope.ModalEntity.converCoef=entity.converCoefStr;
        }
      
        formValidateReset();  
        $scope.$apply();
    };

    // 保存操作记录
    $scope.save = function (entity) {
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        //增加
        if (index == undefined) {

            //检查交易所下对应的产品信息是否存在
        	findWeightUnitEntity(function (result) {
                if (result.length > 0) {
                    layer.msg("该市场下该品种的敞口单位信息已经存在 ，新增失败！", {icon: 2, time: 3000});
                    return false;
                } else {
                	saveWeightUnitEntity(function (result) {
                        $scope.listEntitys.unshift(result);
                      
                        $scope.$apply();
                      //关闭窗口
                        $("#weightunitModal").modal("hide");
                        layer.msg("该品种敞口信息新增成功!", {icon : 1,time : 2000});
                        // 在查询一遍
                        $scope.find($scope.queryEntity);
                    }, entity);
                }
            }, {
            	exchID: entity.exchID,
            	productID: entity.productID
            });
            //修改
        } else {
        	updateWeightUnitEntity(function (result) {
            	result.index = tableIndex;
                $scope.listEntitys.splice(tableIndex-1, 1, result);
                $scope.weightunitTable.cells().every( function () {
                    if((tableIndex-1) == this[0][0].row){
                        if(this[0][0].column == 3){
                            this.data(entity.standardUnit);
                            $scope.$apply();
                        }
                        if(this[0][0].column == 5){
                            this.data(entity.unit);
                            $scope.$apply();
                        }
                        if(this[0][0].column == 6){
                            this.data(entity.converCoef);
                            $scope.$apply();
                        }
                    }

             } );
              //关闭窗口
                layer.msg("该品种敞口信息修改成功!", {icon : 1,time : 2000});
                $("#weightunitModal").modal("hide");
                // 在查询一遍
                //$scope.find($scope.queryEntity);
            }, entity);
        }
    };
    
  //定义产品基础信息的固定列头
    $scope.weightUnit_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "品种"},
        {title: "标准敞口单位"},
        {title: "市场"},
        {title: "市场敞口单位"},
        {title: "倍率"},
        {title: "操作"}
    ]; 
    $("body").undelegate("#weightUnit_dynamic_table_wrapper td .update-row","click");
    $("body").delegate("#weightUnit_dynamic_table_wrapper td .update-row","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.weightunitTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.initUpdateParam(id,$scope.modalEntity);
    });
    $("body").undelegate("#weightUnit_dynamic_table_wrapper td .delete-row","click");
     $("body").delegate("#weightUnit_dynamic_table_wrapper td .delete-row","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.weightunitTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.remove(id,$scope.modalEntity);
    });
    
 // 查询(前台分页)
    $scope.find = function(object){
    	//更新表格对应的数据集
    	findWeightUnitEntity(function (result) {
    		//将数据集赋值为空
	    	$scope.weightunitDataset = [];
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){

            	var operate = "";
            	if($scope.weightUnit_update){
            		operate = operate.concat("<a class='update-row' data-toggle='modal' data-target='#weightunitModal'>修改</a>");
            	}if($scope.weightUnit_delete){
            		operate = operate.concat("<a class='delete-row' data-toggle='modal'>删除</a>");
            	}
                var tempArr = [(i+1),con[i].id,con[i].productID,con[i].standardUnit,con[i].exchID,con[i].unit,con[i].converCoefStr,operate];
	            $scope.weightunitDataset.push(tempArr);
	            con[i].index = i+1;
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.weightunitTable.clear().draw();
            $scope.weightunitTable.rows.add($scope.weightunitDataset).draw();
            $scope.$apply();
        }, object);  	
    }
    
    $timeout(function() {
  	  $scope.find({});
  }, 500);
 
    
  //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.weightunitTable = $('#weightUnit_dynamic_table').DataTable( {
    		data : $scope.weightunitDataset,
        	columns :$scope.weightUnit_columns,
//        	scrollY: 300,
//          scrollX: true,
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

