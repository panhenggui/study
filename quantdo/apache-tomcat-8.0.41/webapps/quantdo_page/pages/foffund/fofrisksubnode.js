myapp.controller('fofRiskSubNodeController', function ($scope,$timeout) {
	$scope.service = new com.quantdo.orgClear.service.fofRiskSubNodeService();
	$scope.fundInstService = new com.quantdo.orgClear.service.fofInstClientService();
	$scope.refreshTypes = clearConstant.refreshTypes;	//方式
    $scope.tempEntity = {};
    $scope.tempEntity.recordIndex = -1;
    $scope.isUpdate = false;
    $scope.listEntitys = [];
    $scope.queryEntity = {};
    $scope.queryFofInstClientList = [];
    $scope.fofInstClientList = [];
    $scope.fundProductList = [];
    
    $scope.fundInstService.findByQuery(function(result){
    	$scope.queryFofInstClientList = angular.copy(result);
    	$scope.$apply();
    },{});

    // 转换方式
    $scope.transRefreshType = function(key){
    	for(var i = 0;i < $scope.refreshTypes.length;i++){
    		if($scope.refreshTypes[i].key == key){
    			return $scope.refreshTypes[i].text;
    		}
    	}
    }
    
    //初始化页面信息
    $scope.service.findByQuery(function (result) {
        $scope.listEntitys = result;
        $scope.$apply();
    },{});
    
    //删除
    $scope.remove = function (index, entity) {
        layer.confirm('确定删除？', {icon: 3}, function (count) {
		 	$scope.service.remove(function(){
		 		$scope.find($scope.queryEntity);
		 		layer.msg("删除成功",{icon: 1});
		        layer.close(count);
		 	 },entity.id);
        });
    };
    
    //更改方式，为目录则显示地址
    $scope.changeRefreshType = function(refreshType){
    	if(refreshType == 0){		//DB
    		$scope.notDBType = false;
    	}else{
    		$scope.notDBType = true;
    	}
    }
    
    //初始化模态窗
    $scope.initParameter = function () {
    	$scope.fofInstClientList=[];
    	$scope.fundProductList =[];
    	$scope.ModalEntity = {};
    	 //初始化机构下拉框数据
        $scope.fundInstService.findByQuery(function(result){
        	$scope.fofInstClientList = result;
        	 if($scope.fofInstClientList.length > 0){
             	$scope.ModalEntity.fofInstClientID = $scope.fofInstClientList[0].fofInstClientID;
             }
        	 $scope.$apply();
        },{});
        $scope.ModalEntity.refreshType = $scope.refreshTypes[0].key;
        $scope.myForm.$setPristine();
        $scope.isUpdate = false;
        $scope.notDBType = false;
    };

    //修改
    $scope.initUpdateParam = function (index, entity) {
    	$scope.fofInstClientList=[];
    	 //初始化机构下拉框数据
        $scope.fundInstService.findByQuery(function(result){
        	$scope.fofInstClientList = angular.copy(result);
        	$scope.tempEntity = angular.copy(entity);
            $scope.tempEntity.recordIndex = index;
            $scope.ModalEntity = angular.copy($scope.tempEntity);
            $scope.ModalEntity.fundProductID = $scope.ModalEntity.fundProductID.substring(1,$scope.ModalEntity.fundProductID.length);
            $scope.ModalEntity.password = '1';
            $scope.myForm.$setPristine();
            $scope.isUpdate = true;
            $scope.changeRefreshType(entity.refreshType);
        	$scope.$apply();
        },{});
    	
    }

    // 保存操作记录
    $scope.save = function (entity) {
        var index = entity.recordIndex;
        
        if(entity.refreshType == '1' && (entity.address == undefined || entity.address.trim() == '')){
        	layer.msg("目录地址不能为空",{icon: 2});
        	return false;
        }
        if(entity.refreshType == '0'){
        	entity.address = null;
        }
        
        //增加
        if (index == undefined) {
        	if(entity.password.trim() == ""){
            	layer.msg("密码不能为空格",{icon: 2});
            	return false;
            }
        	entity.password = entity.password.trim();
        	
        	$scope.service.findByQuery(function (result) {	//校验机构号和产品编号是否重复
                if (result.length == 0) {
                	$scope.service.findByQuery(function (result) {	//校验用户名是否重复
                		if(result.length == 0){
                			 $scope.service.add(function (result) {
     	                    	if(result != null){
     	                    		$scope.find($scope.queryEntity);
     	                            layer.msg("新增成功",{icon: 1});
     	                            //关闭窗口
     	                            $("#riskSubNodeModal").modal("hide");
     	                    	}else{
     	                    		layer.msg("新增失败",{icon: 2});
     	                    	}
     	                    }, entity);
                		}else{
                			layer.msg("该用户名已存在,请重新输入", {icon: 2, time: 2000});
                            return false;
                		}
                	}, {
                    	userID: entity.userID,
                    	instClientID: ""
                    	});
                } else {
                    layer.msg("该产品数据已存在,请重新输入", {icon: 2, time: 2000});
                    return false;
                }
            }, {
            	fundProductID: '#' + entity.fundProductID,
            	instClientID: ""
            	});
            //修改
        } else {
            $scope.service.update(function (result) {
            	if(result != null){
            		$scope.find($scope.queryEntity);
                    layer.msg("修改成功",{icon: 1});
                    //关闭窗口
                    $("#riskSubNodeModal").modal("hide");
            	}else{
            		layer.msg("修改失败",{icon: 2});
            	}
            }, entity);
        }
    };
    
    // 初始化密码重置模态框
    $scope.pwdChange = function(entity){
    	var tempEntity = angular.copy(entity);
        $scope.pwdEntity = angular.copy(tempEntity);
        $scope.myForm1.$setPristine();
        $scope.$apply();
    }
    
    // 密码重置
    $scope.resetPwd = function(entity){
    	if(entity.password.trim() == ""){
        	layer.msg("密码不能为空格",{icon: 2});
        	return false;
        }
    	entity.password = entity.password.trim();
    	
    	$scope.service.resetPwd(function(result){
    		if(result == 1){
    			layer.msg("密码重置成功",{icon: 1});
    			//关闭窗口
                $("#pwdChangeModal").modal("hide");
    		}else{
    			layer.msg("密码重置失败",{icon: 2});
            	return false;
    		}
    	},entity);
    }
    
    //定义固定列头
    $scope.fofRiskSubNode_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "子产品机构代码"},
        {title: "子产品机构名称"},
        {title: "子产品代码"},
        {title: "子产品名称"},
        {title: "用户"},
        {title: "方式"},
        {title: "地址"},
        {title: "操作"}
	]
    
    $("body").undelegate("#fofRiskSubNode_dynamic_table_wrapper td .updateInfo","click");
    $("body").undelegate("#fofRiskSubNode_dynamic_table_wrapper td .deleteInfo","click");
    $("body").undelegate("#fofRiskSubNode_dynamic_table_wrapper td .pwdreset","click");
    
    $("body").delegate("#fofRiskSubNode_dynamic_table_wrapper td .updateInfo","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.fofRiskSubNodeTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.initUpdateParam(id,$scope.modalEntity);
    });
    
    $("body").delegate("#fofRiskSubNode_dynamic_table_wrapper td .deleteInfo","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.fofRiskSubNodeTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.remove(id,$scope.modalEntity);
    });
    
    $("body").delegate("#fofRiskSubNode_dynamic_table_wrapper td .pwdreset","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.fofRiskSubNodeTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.PwdEntity = $scope.listEntitys[i];
        	}
        }
        $scope.pwdChange($scope.PwdEntity);
    });
    
    // 查询
    $scope.find = function(object){
        $scope.isQuery = true;
        $scope.service.findByFofInstIDAndFundName(function (result) {
    		//将数据集赋值为空
    		var con = result;
    		$scope.fofRiskSubNodeDataset = [];
    		$scope.listEntitys = angular.copy(result);
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){            	
            	var operate = "";
        		operate = operate.concat("<a class='updateInfo update-row' data-toggle='modal' data-target='#riskSubNodeModal'>修改</a>");
        		operate = operate.concat("<a class='deleteInfo delete-row' data-toggle='modal'>删除</a>");
        		operate = operate.concat("<a class='pwdreset update-row' style='width:80px;margin-left:5px' data-toggle='modal' data-target='#pwdChangeModal'>密码重置</a>");
                var tempArr = [(i+1),con[i].id,con[i].fofInstClientID,con[i].fofInstClientName,con[i].fundProductID,con[i].fundProductName,con[i].userID,
                               $scope.transRefreshType(con[i].refreshType),con[i].address,operate];
	            $scope.fofRiskSubNodeDataset.push(tempArr);
            }
            //重新绘表
            $scope.fofRiskSubNodeTable.clear().draw();
            $scope.fofRiskSubNodeTable.rows.add($scope.fofRiskSubNodeDataset).draw();
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
    	$scope.fofRiskSubNodeTable = $('#fofRiskSubNode_dynamic_table').DataTable( {
    		data : $scope.fofRiskSubNodeDataset,
        	columns :$scope.fofRiskSubNode_columns,
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

