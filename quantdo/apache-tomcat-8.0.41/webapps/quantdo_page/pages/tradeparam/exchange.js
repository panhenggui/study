myapp.controller('exchangeController', function ($scope, $timeout,$rootScope) {
	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;

	$scope.isDomestic = clearConstant.isDomestic;
	$scope.marketTypes = clearConstant.marketType;
	$scope.productService = new com.quantdo.orgClear.service.ProductService();
	$scope.canClick=false;
	
	// 按钮权限
	$scope.exchange_query=isShow("exchange_query");
	$scope.exchange_add=isShow("exchange_add");
	$scope.exchange_delete=isShow("exchange_delete");
	$scope.exchange_update=isShow("exchange_update");
	
    //定义查询对象
    $scope.queryEntity = {
        exchID: "",
        productID: "",
        optionSeriesID: ""
    };
    $scope.queryExchanges = new Array();
    //初始化页面信息
    getAllExchanges(function (result) {
       $scope.listEntitys = result;
      $scope.queryExchanges = angular.copy($scope.listEntitys);
      $scope.$apply();
    });

    // 转换国内/外交易所
    $scope.transIsDomestic = function(key){
    	for(var i = 0;i < $scope.isDomestic.length;i++){
    		if($scope.isDomestic[i].key == key){
    			return $scope.isDomestic[i].text;
    		}
    	}
    }
    
    // 转换允许交易市场类型
    $scope.transMarketTypes = function (text){
    	var count = $scope.marketTypes.length;
        for (var i = 0; i < count; i++) {
            if ($scope.marketTypes[i].key == text) {
                return $scope.marketTypes[i].text;
            }
        }
    }
    
    //查询
//    $scope.find = function (queryEntity) {
//        $scope.listEntitys = {};
//        $scope.isQuery = true;
//        findExchanges(function (result) {
//            $scope.listEntitys = result;
//            $timeout(function() {
//            	$scope.isQuery = false;
//            	$scope.$apply();
//              }, 1500);
//        }, queryEntity);
//    };

    //删除
    $scope.remove = function (index, entity) {
        layer.confirm('确定删除该条交易所信息？', {icon: 3}, function (count) {
        	$scope.productService.findByExchID(function(result){
        		if(result != null && result.length > 0){
        			layer.msg("该交易所存在关联品种，无法删除",{icon: 2});
        			return false;
        		}else{
        			deleteExchangeEntity(entity.id);
                    //$scope.listEntitys.splice(index, 1);
                    //$scope.queryExchanges.splice(index, 1);
                    layer.msg("删除成功",{icon: 1});
                    $scope.$apply();
                    // 查询
                    $timeout(function() {
                    	$scope.find($scope.queryEntity);
                        getAllExchanges(function (result) {
	                            $scope.listEntitys = result;
	                            $scope.queryExchanges = angular.copy($scope.listEntitys);
	                            $scope.$apply();
                         });
                    }, 500);
        		}
                layer.close(count);
        	},entity.exchID);
        });
    };

    function formValidateReset() {
        $scope.myForm.exchID.$setPristine();
        $scope.myForm.exchName.$setPristine();
    }

    //初始化模态窗
    $scope.initParameter = function () {
        $scope.ModalEntity = {};
        $scope.ModalEntity.isDomestic = $scope.isDomestic[0].key;
        $scope.ModalEntity.market = $scope.marketTypes[0].key;
        $scope.isUpdate = false;
        formValidateReset();
        $timeout(function() {
        	document.getElementById("exchID").focus();
          }, 500);
    };

    //修改
    $scope.initUpdateParam = function (index, entity) {
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        $scope.isUpdate = true;
        formValidateReset();
        $timeout(function() {
        	document.getElementById("exchName").focus();
          }, 500);
    };

    // 保存操作记录
    $scope.save = function (entity) {
    	$scope.canClick=true;
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        //增加
        if (index == undefined) {
        	findExchanges(function (result) {
                if (result.length > 0) {
                    layer.msg("交易所信息已存在，不能重复新增", {icon: 2, time: 3000});
                    return false;
                } else {
                    saveExchangeEntity(function (result) {
                    	if(result != null){
                    		layer.msg("新增成功",{icon: 1});
                    		//$scope.listEntitys.unshift(result);
                            //$scope.queryExchanges.unshift(result);
                            $scope.$apply();
                          //关闭窗口
                            $("#exchangeModal").modal("hide");
                            // 查询
                            $scope.find($scope.queryEntity);
                            getAllExchanges(function (result) {
	                            $scope.listEntitys = result;
	                            $scope.queryExchanges = angular.copy($scope.listEntitys);
	                            $scope.$apply();
                         });
                    	}else{
                    		layer.msg("新增失败",{icon: 2});
                    	}
                    }, entity);
                }
            }, {exchID: entity.exchID});
            //修改
        } else {
            updateExchangeEntity(function (result) {
            	if(result != null){
            		result.index = tableIndex;
            		$scope.listEntitys.splice(tableIndex-1, 1, result);  
            		      		
            		$scope.productTable.cells().every( function () {
    	                    if((tableIndex-1) == this[0][0].row){
    	                        if(this[0][0].column == 3){
    	                            this.data(entity.exchName);
    	                            $scope.$apply();
    	                        }
    	                        if(this[0][0].column == 4){
    	                            this.data($scope.transMarketTypes(entity.market));
    	                            $scope.$apply();
    	                        }
    	                        if(this[0][0].column == 5){
    	                            this.data($scope.transIsDomestic(entity.isDomestic));
    	                            $scope.$apply();
    	                        }
    	                    }

    	             } );
            		layer.msg("修改成功",{icon: 1});
            		//$scope.listEntitys.unshift(result);
                    //$scope.queryExchanges.unshift(result);
                    
                  //关闭窗口
                    $("#exchangeModal").modal("hide");
                    // 查询
                    //$scope.find($scope.queryEntity);
                    getAllExchanges(function (result) {
                        //$scope.listEntitys = result;
                        $scope.queryExchanges = angular.copy($scope.listEntitys);
                        $scope.$apply();
                    });
            	}else{
            		layer.msg("修改失败",{icon: 2});
            	}
            }, entity);
        }
        $timeout(function() {
            $scope.canClick = false;
        }, 2000); 
    };
    
    //定义产品基础信息的固定列头
    $scope.product_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "交易所代码"},
        {title: "交易所名称"},
        {title: "市场"},
        {title: "国内/国外"},
        {title: "操作员"},
        {title: "操作日期"},
        {title: "操作时间"},
        {title: "操作"}
    ];
    $("body").undelegate("#exchange_dynamic_table_wrapper td .update-row","click");
    $("body").undelegate("#exchange_dynamic_table_wrapper td .delete-row","click");

    $("body").delegate("#exchange_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.initUpdateParam(id,$scope.modalEntity);
    });
    
    $("body").delegate("#exchange_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
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
    	findExchanges(function (result) {
    		//将数据集赋值为空
	    	$scope.productDataset = [];
    		var con = result;
    		$scope.listEntitys = result;
    		//$scope.queryExchanges = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){            	
//            	var operate = "<a class='update_row' data-toggle='modal' data-target='#exchangeModal'>[修改]</a>" +
//    			"<a class='blue' data-toggle='modal'>[删除]</a>";
            	var operate = "";
            	if($scope.exchange_update){
            		operate = operate.concat("<a class='update-row' data-toggle='modal' data-target='#exchangeModal'>修改</a>");
            	}if($scope.exchange_delete){
            		operate = operate.concat("<a class='delete-row' data-toggle='modal'>删除</a>");
            	}
                var tempArr = [(i+1),con[i].id,con[i].exchID,con[i].exchName,$scope.transMarketTypes(con[i].market),$scope.transIsDomestic(con[i].isDomestic),con[i].operatorID
                               ,con[i].operateDate,con[i].operateTime,operate];
	            $scope.productDataset.push(tempArr);
	            con[i].index = i+1;
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.productTable.clear().draw();
            $scope.productTable.rows.add($scope.productDataset).draw();
            $scope.$apply();
        }, object);  	
    }
    
    $timeout(function() {
  	  $scope.find($scope.queryEntity);
  }, 500);
    
  //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.productTable = $('#exchange_dynamic_table').DataTable( {
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

});

