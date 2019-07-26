myapp.controller('fofInstClientController', function ($scope, $timeout) {
	$scope.service = new com.quantdo.orgClear.service.fofInstClientService();
	$scope.riskSubNodeService = new com.quantdo.orgClear.service.fofRiskSubNodeService();
    $scope.tempEntity = {};
    $scope.tempEntity.recordIndex = -1;
    $scope.isUpdate = false;
    $scope.listEntitys = [];
    $scope.queryEntity = {};
    $scope.queryInstClients = [];

    //初始化页面信息
    $scope.service.findByQuery(function (result) {
        $scope.listEntitys = result;
        $scope.queryInstClients = angular.copy($scope.listEntitys);
        $scope.$apply();
    },{});

    //删除
    $scope.remove = function (index, entity) {
        layer.confirm('确定删除？', {icon: 3}, function (count) {
        	//查询产品管理员关联风控子节点
        	$scope.riskSubNodeService.findByQuery(function (result) {
                if (result != null && result.length > 0) {
                	  layer.msg("该机构关联风控子节点，不允许删除", {icon: 2, time: 2000});
                      return false;
                } else {
            	 	 $scope.service.remove(function(){
            	 		$scope.queryInstClients.splice(index, 1);
            	 		$scope.find($scope.queryEntity);
            	 		layer.msg("删除成功",{icon: 1});
                        layer.close(count);
            	 	 },entity.id);
                }
            }, {
            	fofInstClientID: entity.fofInstClientID
            });
        });
    };

    function formValidateReset() {
        $scope.myForm.fofInstClientID.$setPristine();
        $scope.myForm.fofInstClientName.$setPristine();
    }

    //初始化模态窗
    $scope.initParameter = function () {
        $scope.ModalEntity = {};
        formValidateReset();
        $scope.isUpdate = false;
    };

    //修改
    $scope.initUpdateParam = function (index, entity) {
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        formValidateReset();
        $scope.isUpdate = true;
        $scope.$apply();
    };

    // 保存操作记录
    $scope.save = function (entity) {
        var index = entity.recordIndex;
        entity.isActive = '1';
        //增加
        if (index == undefined) {
        	$scope.service.findByQuery(function (result) {
                if (result.length == 0) {
                    $scope.service.add(function (result) {
                    	if(result != null){
                    		$scope.queryInstClients.unshift(result);
                    		$scope.find($scope.queryEntity);
                            layer.msg("新增成功",{icon: 1});
                            //关闭窗口
                            $("#fofInstClientModal").modal("hide");
                    	}else{
                    		layer.msg("新增失败",{icon: 2});
                    	}
                    }, entity);
                } else {
                    layer.msg("该机构已存在,请重新输入", {icon: 2, time: 3000});
                    return false;
                }
            }, {fofInstClientID: entity.fofInstClientID});
            //修改
        } else {
            $scope.service.update(function (result) {
            	if(result != null){
                    $scope.queryInstClients.splice(index, 1, result);
                    $scope.find($scope.queryEntity);
                    layer.msg("修改成功",{icon: 1});
                    //关闭窗口
                    $("#fofInstClientModal").modal("hide");
            	}else{
            		layer.msg("修改失败",{icon: 2});
            	}
            }, entity);
        }
    };
    
    //定义固定列头
    $scope.fofInstClient_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "子产品机构代码"},
        {title: "子产品机构名称"},
        {title: "操作员"},
        {title: "操作日期"},
        {title: "操作时间"},
        {title: "操作"}
	]
    
    $("body").undelegate("#fofInstClient_dynamic_table_wrapper td .updateInfo","click");
    $("body").undelegate("#fofInstClient_dynamic_table_wrapper td .deleteInfo","click");
    
    $("body").delegate("#fofInstClient_dynamic_table_wrapper td .updateInfo","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.fofInstClientTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.initUpdateParam(id,$scope.modalEntity);
    });
    
    $("body").delegate("#fofInstClient_dynamic_table_wrapper td .deleteInfo","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.fofInstClientTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.remove(id,$scope.modalEntity);
    });
    
    // 查询
    $scope.find = function(object){
        $scope.isQuery = true;
        $scope.service.queryByQuery(function (result) {
    		//将数据集赋值为空
    		var con = result;
    		$scope.fofInstClientDataset = [];
    		$scope.listEntitys = angular.copy(result);
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){            	
            	var operate = "";
        		operate = operate.concat("<a class='updateInfo update-row' data-toggle='modal' data-target='#fofInstClientModal'>修改</a>");
        		operate = operate.concat("<a class='deleteInfo delete-row' data-toggle='modal'>删除</a>");
                var tempArr = [(i+1),con[i].id,con[i].fofInstClientID,con[i].fofInstClientName,con[i].operatorID,con[i].operateDate,con[i].operateTime,operate];
	            $scope.fofInstClientDataset.push(tempArr);
            }
            //重新绘表
            $scope.fofInstClientTable.clear().draw();
            $scope.fofInstClientTable.rows.add($scope.fofInstClientDataset).draw();
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
    	$scope.fofInstClientTable = $('#fofInstClient_dynamic_table').DataTable( {
    		data : $scope.fofInstClientDataset,
        	columns :$scope.fofInstClient_columns,
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

