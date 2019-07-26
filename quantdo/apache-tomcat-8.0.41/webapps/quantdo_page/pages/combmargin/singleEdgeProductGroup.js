myapp.controller('SingleEdgeProductGroupController', function ($scope, $timeout,$rootScope) {
	//1、实例化服务接口
	//1.1、会员服务接口
	$scope.service = new com.quantdo.orgClear.service.SingleEdgeProductGroupService();
	//1.2、公用查询服务接口
	$scope.commonQueryservice = new com.quantdo.orgClear.service.CommonQueryService();
	//1.2、产品服务接口
	$scope.productservice = new com.quantdo.orgClear.service.ProductService();	
	
    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	// 按钮权限
	$scope.singleEdgeProductGroup_add = isShow("singleEdgeProductGroup_add");
	$scope.singleEdgeProductGroup_delete = isShow("singleEdgeProductGroup_delete");
	$scope.singleEdgeProductGroup_update = isShow("singleEdgeProductGroup_update");
	$scope.singleEdgeProductGroup_query = isShow("singleEdgeProductGroup_query");
	
	//2、定义页面数据模型
    $scope.queryEntity = {};
    $scope.tempEntity={};
    $scope.modalEntity = {};
    $scope.isOK=false;
    $scope.entitys={};
    $scope.products = [];
    $scope.marginCombTypes = clearConstant.marginCombTypes;
    //3、定义方法
    //3.1、查询会员
//    $scope.find =function(queryEntity){
//    	$scope.service.findByCondition(queryEntity,function(result){
//    		$scope.isQuery = true;
//    		$scope.listEntitys = result;
//    		$scope.$apply();
//    		$timeout(function() {
//                $scope.isQuery = false;
//            }, 1000);
//    	});
//    };     
    //3.2、保存会员
    $scope.save = function (entity) {    	
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        //增加
        $scope.entitys.exchID=entity.exchID;
        $scope.entitys.productID=entity.productID;
        $scope.entitys.productGroupID=null;
        if (index == undefined) {
        	 $scope.service.findByCondition($scope.entitys,function (result) {
        		 if (result == "") {
		        	$scope.service.add(entity,function (result) {
		        		$scope.listEntitys.unshift(result);  
		        		$scope.$apply(); 
		        		//关闭窗口
		                $("#singleEdgeProductGroupModal").modal("hide");
		                // 查询
		                $scope.find($scope.queryEntity);
		        	});
        		 }else {
					layer.msg('组合保证金品种组信息已存在！', {
						icon : 2
					});
					return false;
				}
        	 });
            //修改
        } else {
        	$scope.isOK=true;
        	$scope.service.update(entity,function (result) {
        		result.index = tableIndex;
        		$scope.listEntitys.splice(tableIndex-1, 1, result);   
        		$scope.productTable.cells().every( function () {
                    if((tableIndex-1) == this[0][0].row){
                        if(this[0][0].column == 4){
                            this.data(entity.productGroupID);
                            $scope.$apply();
                        }
                        if(this[0][0].column == 5){
                            this.data(entity.productGroupName);
                            $scope.$apply();
                        }
                        if(this[0][0].column == 6){
                            this.data($scope.transMarginCombType(entity.marginCombType));
                            $scope.$apply();
                        }
                    }

        		});
        		//关闭窗口
                $("#singleEdgeProductGroupModal").modal("hide");
                
                // 查询 
                $scope.find($scope.queryEntity);
        	});  
        }
    };    
    //3.3、删除会员
    $scope.remove = function (entity,index) {
        //使用内置Index
    	 layer.confirm('确定删除该条记录？', {icon: 3}, function (count) {
	    	$scope.service.remove(entity.id,function (result) {
	    		// 查询
	            $scope.find($scope.queryEntity);
	        	$scope.listEntitys.splice(index, 1);
	    		$scope.$apply();    		
	    	}); 
	    	layer.close(count);
    	 });
    };    
    //3.4、初始化新增页面的参数
    $scope.initAddParam = function () {
    	$scope.isOK=false;
    	$scope.products = [];
        $scope.modalEntity = {};
        $scope.modalEntity.exchID = "";
        $scope.formValidateReset();
     };    
    //3.5、初始化个性页面的参数
     $scope.initUpdateParam = function (entity,index) {
    	 $scope.isOK=true;
    	 $scope.products = $scope.productDatas;
    	 var productId = entity.productID; 
    	 if(productId == "default"){
    		 entity.productID="所有";
    	 }
         $scope.tempEntity = angular.copy(entity);
         $scope.tempEntity.recordIndex = index;        
         $scope.modalEntity = angular.copy($scope.tempEntity);
         $scope.$apply();
         $scope.formValidateReset();
     };
     //3.6、表单校验信息重置
     $scope.formValidateReset = function (){
     	$scope.myForm.exchID.$setPristine();
     	$scope.myForm.productID.$setPristine();
     	$scope.myForm.productGroupID.$setPristine();
     	$scope.myForm.productGroupName.$setPristine();
    	$scope.myForm.marginCombType.$setPristine();
     }     
    
    //4、数据初始化        
    //4.1、进入页面时调用查询方法
//    	$scope.service.findAll(function(result){
//    		$scope.listEntitys = result;
//    		$scope.$apply();
//    	});
    	
    //4.2 初始化交易所信息
    $scope.commonQueryservice.getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
        $scope.$apply();
    });
    //4.3 初始化产品信息
    $scope.productservice.getAllProductEntity(function (result) {
        $scope.productDatas = result;
        defaultproduct = {};
        //defaultproduct.productID = "default";
        defaultproduct.productID = "所有";
        defaultproduct.productName = "所有";
        $scope.productDatas.unshift(defaultproduct);
        //$scope.queryEntity.productID = $scope.productDatas[0].productID;
        //$scope.productDatas = $scope.productDatas.concat(defaultproduct);
        //$scope.queryEntity.productID = defaultproduct.productID;
    });        
    
    //根据交易所下拉列表初始化产品信息
    $scope.changeExch = function (exchId) {
        //根据交易所ID查询产品信息
        $scope.modalEntity.productID = "";
        $scope.products = [];
        defaultproduct = {};
        //defaultproduct.productID = "default";
        defaultproduct.productID = "所有";
        defaultproduct.productName = "所有";
        $scope.products[0] = defaultproduct;
        getProductByExchID(function (result) {
            $scope.products = $scope.products.concat(result);
            $scope.modalEntity.productID = $scope.products[0].productID;
            $scope.$apply();
        }, {'exchID': exchId, 'productID': '', 'productType': '', 'productStatus': ''});
    };
    
    //根据交易所下拉列表初始化产品信息
    $scope.changeQueryExch = function (exchId) {
        //根据交易所ID查询产品信息
        $scope.queryEntity.productID = "";
        $scope.productDatas = [];
        defaultproduct = {};
      //defaultproduct.productID = "default";
        defaultproduct.productID = "所有";
        defaultproduct.productName = "所有";
        getProductByExchID(function (result) {
        	var len = result.length;
            // $scope.productDatas = $scope.productDatas.concat(result);
            // $scope.productDatas[len] = defaultproduct;
            //$scope.queryEntity.productID = "";
        	$scope.productDatas.unshift(defaultproduct);
        	$scope.productDatas = $scope.productDatas.concat(result);
        	//$scope.queryEntity.productID = $scope.productDatas[0].productID;
            $scope.$apply();
        }, {'exchID': exchId, 'productID': '', 'productType': '', 'productStatus': ''});
    };  
    
  //定义产品基础信息的固定列头
    $scope.product_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "交易所代码"},
        {title: "品种代码"},
        {title: "品种组代码"},
        {title: "品种组名称"},
        {title: "组合保证金类型"},
        {title: "操作员"},
        {title: "操作日期"},
        {title: "操作时间"},
        {title: "操作"}
    ]; 
   
    $("body").undelegate("#singleEdge_dynamic_table_wrapper td .update-row","click");
    $("body").delegate("#singleEdge_dynamic_table_wrapper td .update-row","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.initUpdateParam($scope.modalEntity,id);
    });
    $("body").undelegate("#singleEdge_dynamic_table_wrapper td .delete-row","click");
     $("body").delegate("#singleEdge_dynamic_table_wrapper td .delete-row","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.remove($scope.modalEntity,id);
    });
    
 // 查询(前台分页)
    $scope.find = function(){
    	//更新表格对应的数据集
    	$scope.service.findByCondition($scope.queryEntity,function (result) {
    		//将数据集赋值为空
	    	$scope.productDataset = [];
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	var productId = "所有";
            	if(con[i].productID != 'default'){
            		productId = con[i].productID;
            	}
//            	var operate = "<a class='update_row' data-toggle='modal' data-target='#singleEdgeProductGroupModal'>[修改]</a>" +
//    			"<a class='blue' data-toggle='modal'>[删除]</a>";
            	var operate = "";
            	if($scope.singleEdgeProductGroup_update){
            		operate = operate.concat("<a class='update-row' data-toggle='modal' data-target='#singleEdgeProductGroupModal'>修改</a>");
            	}if($scope.singleEdgeProductGroup_delete){
            		operate = operate.concat("<a class='delete-row' data-toggle='modal'>删除</a>");
            	}
                var tempArr = [(i+1),con[i].id,con[i].exchID,productId,con[i].productGroupID,con[i].productGroupName,$scope.transMarginCombType(con[i].marginCombType),con[i].operatorID,con[i].operateDate,con[i].operateTime,operate];
	            $scope.productDataset.push(tempArr);
	            con[i].index = i+1;
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.productTable.clear().draw();
            $scope.productTable.rows.add($scope.productDataset).draw();
        });  	
    }
    
    $timeout(function() {
    	 $scope.find($scope.queryEntity);
  }, 500);
   
 
    
  //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.productTable = $('#singleEdge_dynamic_table').DataTable( {
    		data : $scope.productDataset,
        	columns :$scope.product_columns,
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
    	
    	//转换类型
        $scope.transMarginCombType = function(key){
        	if(key == 1){
        		return "大边保证金";
        	}else if(key == 4){
        		return "先套利再对锁";
        	}else if(key == 5){
        		return "先套利再双边";
        	}else{
        		return "";
        	}
        } 
         
});

