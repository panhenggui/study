myapp.controller('ProductController', function ($scope, $timeout,$rootScope) {
    $scope.ModalEntity = {};
    
    // 按钮权限
    $scope.product_query = isShow("product_query");
    $scope.product_add = isShow("product_add");
    $scope.product_delete = isShow("product_delete");
    $scope.product_update = isShow("product_update");
    
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
        productStatus: ""
    };
    $scope.queryProducts = new Array();
    //初始化页面信息
    getAllProductEntity(function (result) {
        $scope.listEntitys = result;
        $scope.queryProducts = angular.copy($scope.listEntitys);
    });
    
    //交易所,品种类别级联查询品种代码
    $scope.changeProductID = function(){
    	  var entity = $scope.queryEntity;
          //根据交易所ID和品种类别查询产品信息
          getProductByExchID(function (result) {
        	  $scope.queryProducts = [];
              if(result !=undefined && result.length>0){
                  $scope.queryProducts = result;
                  $scope.$apply();
              }

          }, {'exchID': entity.exchID, 'productID': '',  'productStatus': ''});
    }

    $scope.productTypes =[
                          {text: '期货', key: '1'},                     
                          {text: '现货', key: '5'},
                          {text: '证券', key: '3'},
                          {text: '基金', key: '4'}       
                      ];;
    $scope.productStatus = clearConstant.productStatus;
    $scope.currenys = clearConstant.currenys;
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
        $scope.$apply();
    });
//
//    //查询
//    $scope.find = function (queryEntity) {
//        $scope.listEntitys = {};
//        $scope.isQuery = true;
//        findProductEntity(function (result) {
//            $scope.listEntitys = result;
//            $timeout(function() {
//            	$scope.isQuery = false;
//            	$scope.$apply();
//              }, 1500);
//        }, queryEntity);
//    };

    //删除
    $scope.remove = function (index, entity) {
    	layer.confirm('确定删除该品种？', {icon: 3}, function (count) {
            deleteProductEntity(entity.id);
            $scope.listEntitys.splice(index, 1);
            $scope.queryProducts = angular.copy($scope.listEntitys);
            $scope.$digest();
            layer.close(count);
            // 在查询一遍
            $scope.changeProductID();
            $scope.find($scope.queryEntity);
            $scope.$apply();
    	});
    };
    
    //重置表单验证信息
    function formValidateReset() {
        $scope.myForm.productID.$setPristine();
        $scope.myForm.productName.$setPristine();
        $scope.myForm.volumeMultiple.$setPristine();
        $scope.myForm.tick.$setPristine();
        $scope.myForm.delivRemindDate.$setPristine();

    }

    //初始化模态窗
    $scope.initParameter = function () {
    	$scope.isUpdate = false;
        $scope.ModalEntity={};
        $scope.ModalEntity.productStatus =$scope.productStatus[0].key;
        //$scope.ModalEntity.productType =$scope.productTypes[0].key;
        $scope.ModalEntity.exchID = $scope.exchangeDatas[0].exchID;
        $scope.ModalEntity.tradeCurrency = $scope.currenys[0].key;
        $scope.ModalEntity.delivMode = $scope.delivModes[0].key;
        $scope.ModalEntity.positionType = $scope.positionTypes[0].key;
        formValidateReset();
    };

    //修改
    $scope.initUpdateParam = function (index, entity) {
    	$scope.isUpdate = true;
    	$scope.ModalEntity = {};
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        $scope.ModalEntity.tick = $scope.ModalEntity.tickStr;
        formValidateReset();  
        $scope.$apply();
    };

    // 保存操作记录
    $scope.save = function (entity) {
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        if(entity.volumeMultiple == 0){
        	layer.msg("合约乘数必须大于0，请重新输入",{icon: 2});
        	return false;
        }
        //增加
        if (index == undefined) {

            //检查交易所下对应的产品信息是否存在
            findProductEntity(function (result) {
                if (result.length > 0) {
                    layer.msg("品种代码重复，同一交易所下品种代码必须唯一", {icon: 2, time: 3000});
                    return false;
                } else {
                    saveProductEntity(function (result) {
                        $scope.listEntitys.unshift(result);
                        $scope.queryProducts.unshift(result);
                        $scope.$apply();
                      //关闭窗口
                        $("#productModal").modal("hide");
                        
                        // 在查询一遍
                        $scope.find($scope.queryEntity);
                    }, entity);
                }
            }, {
            	exchID: entity.exchID,
            	productID: entity.productID,
            	//productType: entity.productType,
            	productStatus: ""
            });
            //修改
        } else {
            updateProductEntity(function (result) {
            	result.index = tableIndex;
                $scope.listEntitys.splice(tableIndex-1, 1, result);
                $scope.productTable.cells().every( function () {
                    if((tableIndex-1) == this[0][0].row){
                        if(this[0][0].column == 4){
                            this.data(entity.productName);
                            $scope.$apply();
                        }
                        if(this[0][0].column == 6){
                            this.data($scope.transStatus(entity.productStatus));
                            $scope.$apply();
                        }
                        if(this[0][0].column == 7){
                            this.data($scope.transCurrencys(entity.tradeCurrency));
                            $scope.$apply();
                        }
                        if(this[0][0].column == 8){
                            this.data(entity.volumeMultiple);
                            $scope.$apply();
                        }
                        if(this[0][0].column == 9){
                            this.data(entity.tickStr);
                            $scope.$apply();
                        }
                        if(this[0][0].column == 10){
                            this.data($scope.transPositionType(entity.positionType));
                            $scope.$apply();
                        }
                        if(this[0][0].column == 11){
                            this.data($scope.transDelivMode(entity.delivMode));
                            $scope.$apply();
                        }
                    }

             } );
              //关闭窗口
                $("#productModal").modal("hide");
                // 在查询一遍
                //$scope.find($scope.queryEntity);
            }, entity);
        }
    };
    
  //定义产品基础信息的固定列头
    $scope.product_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "交易所代码"},
        {title: "品种代码"},
        {title: "品种名称"},
        {title: "标的代码",visible:false},
        {title: "品种状态"},
        {title: "交易币种"},
        {title: "合约乘数"},
        {title: "最小变动价位"},
        {title: "持仓类型"},
        {title: "交割方式"},
        {title: "交割提醒日"},
        {title: "操作员"},
        {title: "操作日期"},
        {title: "操作时间"},
        {title: "操作"}
    ]; 
    $("body").undelegate("#product_dynamic_table_wrapper td .update-row","click");
    $("body").delegate("#product_dynamic_table_wrapper td .update-row","click",function(){
    	$scope.modalEntity = {};
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
     $("body").undelegate("#product_dynamic_table_wrapper td .delete-row","click");
     $("body").delegate("#product_dynamic_table_wrapper td .delete-row","click",function(){
    	$scope.modalEntity = {};
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
    	findProductEntity(function (result) {
    		//将数据集赋值为空
	    	$scope.productDataset = [];
    		var con = result;
    		$scope.listEntitys = result;
    		//$scope.queryProducts = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	
//            	var operate = "<a class='update_row' data-toggle='modal' data-target='#productModal'>[修改]</a>" +
//    			"<a class='blue' data-toggle='modal'>[删除]</a>";
            	var operate = "";
            	if($scope.product_update){
            		operate = operate.concat("<a class='update-row' data-toggle='modal' data-target='#productModal'>修改</a>");
            	}if($scope.product_delete){
            		operate = operate.concat("<a class='delete-row' data-toggle='modal'>删除</a>");
            	}
                var tempArr = [(i+1),con[i].id,con[i].exchID,con[i].productID,con[i].productName,con[i].underlyingID,$scope.transStatus(con[i].productStatus),$scope.transCurrencys(con[i].tradeCurrency),con[i].volumeMultiple
                               ,con[i].tickStr,$scope.transPositionType(con[i].positionType),$scope.transDelivMode(con[i].delivMode),con[i].delivRemindDate,con[i].operatorID,con[i].operateDate,con[i].operateTime,operate];
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
  	  $scope.find({});
  }, 500);
 
    
  //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.productTable = $('#product_dynamic_table').DataTable( {
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
    	
    	/*//转换品种
        $scope.transProductType = function(key){
        	if(key == 1){
        		return "期货";
        	}else if(key == 2){
        		return "期权";
        	}else if(key == 3){
        		return "证券";
        	}else if(key == 4){
        		return "基金";
        	}else if(key == 5){
        		return "现货";
        	}else{
        		return "";
        	}
        }*/
      //转换状态
        $scope.transStatus = function(key){
        	if(key == 1){
        		return "正常";
        	}else if(key == 0){
        		return "无效";
        	}else{
        		return "";
        	}
        }
        $scope.transDelivMode = function(key){
        	if(key == 1){
        		return "现金";
        	}else if(key == 2){
        		return "实物";
        	}else{
        		return "";
        	}
        }
        $scope.transPositionType = function(key){
        	if(key == 1){
        		return "净持仓";
        	}else if(key == 2){
        		return "混合持仓";
        	}else{
        		return "";
        	}
        }
});

