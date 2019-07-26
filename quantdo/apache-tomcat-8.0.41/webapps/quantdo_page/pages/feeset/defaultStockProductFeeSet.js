myapp.controller('DefaultStockProductFeeSetController', function ($scope, $timeout,$rootScope) {
	
	$scope.defaultStockProductFeeSet = new com.quantdo.orgClear.service.DefaultStockProductFeeSetService();
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	//初始化
	$scope.queryEntity = {};//查询用的实体
	$scope.ModalEntity = {};//初始化modal所用的实体
	$scope.canClick=false;//用来控制modal确定按钮
	$scope.defaultStockProductFeeSetDataset = [];
	
	//初始化页面信息（进入页面的时候，调用查询，获得所有的数据表格）
	$scope.defaultStockProductFeeSet.getAllDefaultStockProductFeeSetData(function (result) {
        $scope.listEntitys = result;
    	$scope.$apply();
    });
	
	$scope.defaultStockProductFeeSet_query = isShow("defaultStockProductFeeSet_query");
	$scope.defaultStockProductFeeSet_add = isShow("defaultStockProductFeeSet_add");
	$scope.defaultStockProductFeeSet_update = isShow("defaultStockProductFeeSet_update");
	$scope.defaultStockProductFeeSet_delete = isShow("defaultStockProductFeeSet_delete");
	
	//定义固定列头
    $scope.defaultStockProductFeeSet_columns = [
        {title: "序号"},
        {title: "id",visible:false},
		{title: "交易所"},
		{title: "市场"},
		{title: "证券类别"},
		{title: "买方佣金比例"},
		{title: "卖方佣金比例"},
		{title: "最低佣金"},
		{title: "买方印花税率"},
		{title: "卖方印花税率"},
		{title: "最低印花税"},
		{title: "卖方过户费率"},
		{title: "卖方过户费率"},
		{title: "最低过户费"},
		{title: "操作"}
	]

    //进入页面，根据数据库的数据信息，初始化页面的下拉框
    $scope.defaultStockProductFeeSet.getPullDownDatas(function(result){
    	$scope.exchangeDatas = result.exchList;
    	$scope.marketDatas = result.marketList;
    	$scope.stockTypeDatas = result.stockTypeList;
    	$scope.$apply();
    });
    
   //进入MODAL时，初始化Modal页面下拉框
    $scope.defaultStockProductFeeSet.getModalPullDownDatas(function(result){
    	$scope.modalExchangeDatas = result.exchList;
    	$scope.modalMarketDatas = result.marketList;
    	$scope.modalStockTypeDatas = result.stockTypeList;
    	$scope.$apply();
    });
    
/*    //查询
    $scope.find = function (queryEntity) {
        $scope.listEntitys = {};
        $scope.isQuery = true;
        var tempEntity = {
        	exchID: '',
        	marketID: '',
            stockTypeID: ''
        };
        tempEntity = angular.copy(queryEntity);
        $scope.defaultStockProductFeeSet.findDefaultStockProductFeeSetEntity(function (result) {
            $scope.listEntitys = result;
            $scope.$apply();
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        }, tempEntity);
    };*/
    $("body").undelegate("#defaultStockProductFeeSet_dynamic_table_wrapper td .update-row","click");
    //表格修改事件
    $("body").delegate("#defaultStockProductFeeSet_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.defaultStockProductFeeSetTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
       $scope.initUpdateParam(id,$scope.modalEntity);
    });
    
    $("body").undelegate("#defaultStockProductFeeSet_dynamic_table_wrapper td .delete-row","click");
  //表格删除事件
    $("body").delegate("#defaultStockProductFeeSet_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.defaultStockProductFeeSetTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
       $scope.remove(id,$scope.modalEntity);
    });
    
    //查询
    $scope.find = function (queryEntity) {
        $scope.listEntitys = {};
        $scope.isQuery = true;
        var tempEntity = {
        	exchID: '',
        	marketID: '',
            stockTypeID: ''
        };
        tempEntity = angular.copy(queryEntity);
        $scope.defaultStockProductFeeSetDataset = [];
        $scope.defaultStockProductFeeSet.findDefaultStockProductFeeSetEntity(function (result) {
            $scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator1 = $scope.getUpdate($scope.defaultStockProductFeeSet_update);
				var operator2 = $scope.getDelete($scope.defaultStockProductFeeSet_delete);
		    	var tempArr = [(i+1),con[i].id,con[i].exchID,con[i].marketName,con[i].stockTypeName,con[i].bFee,con[i].sFee
								,con[i].minFee,con[i].bTax,con[i].sTax,con[i].minTax,con[i].bTransferFee,con[i].sTransferFee,con[i].minTransferFee
								,operator1+operator2]
		    	$scope.defaultStockProductFeeSetDataset.push(tempArr); 
			}
			//重新绘表
	        $scope.defaultStockProductFeeSetTable.clear().draw();
	        $scope.defaultStockProductFeeSetTable.rows.add($scope.defaultStockProductFeeSetDataset).draw();
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
            $scope.$apply();
        }, tempEntity);
    }
    $scope.find({});
        
        
    	$scope.getUpdate = function(flag){
    		var result = "";
    		if(flag){
    			result = "<a class='update-row' data-toggle='modal' data-target='#defaultStockProductFeeSetModal'>修改</a>"; 
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
    

    //删除
    $scope.remove = function (id, entity) {
    	layer.confirm('确定删除？', {icon: 3}, function (count) {
    		 $scope.defaultStockProductFeeSet.deleteDefaultStockProductFeeSetEntity(function (result){
    			 $scope.defaultStockProductFeeSet.getPullDownDatas(function(result){
    						$scope.exchangeDatas = result.exchList;
    	    		    	$scope.marketDatas = result.marketList;
    	    		    	$scope.stockTypeDatas = result.stockTypeList;
    	    		    	$scope.$apply();
    	    		    });
    		},id);
	       // $scope.listEntitys.splice(index, 1);
         	$timeout(function() {
        		$scope.find({});
        	}, 500);
	        layer.close(count);	        
            $scope.$apply();
    	});
    	
    	
    };
    
   /* //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
    	$scope.$apply();
       //$scope.queryEntity.exchID = $scope.exchangeDatas[0].exchID;
    });

    //初始化所有产品信息并默人选中第一项
    getAllProductEntity(function (result) {
        $scope.productDatas = result;
    	$scope.$apply();
//        $scope.queryEntity.productID = $scope.productDatas[0].productID;
    });
    //交易类型
//    $scope.tradeTypes = clearConstant.tradeTypes;
//    $scope.queryEntity.tradeType = $scope.tradeTypes[0].key;
*/
   
   /* $scope.ModalTypes = [
        {text: '交易类型1', key: '1'},
        {text: '交易类型2', key: '2'}
    ];*/
    function formValidateReset(){
    	$scope.myForm.exchID.$setPristine();
    	$scope.myForm.marketID.$setPristine();
    	$scope.myForm.stockTypeID.$setPristine();
    	
    	$scope.myForm.bFee.$setPristine();
    	$scope.myForm.sFee.$setPristine();
    	$scope.myForm.minFee.$setPristine();
    	
    	$scope.myForm.bTax.$setPristine();
    	$scope.myForm.sTax.$setPristine();
    	$scope.myForm.minTax.$setPristine();
    	
    	$scope.myForm.bTransferFee.$setPristine();
    	$scope.myForm.sTransferFee.$setPristine();
    	$scope.myForm.minTransferFee.$setPristine();
    }
    
    //新增的时候弹出modal框，进行的初始化
    $scope.initParameter = function () {
    	$scope.isUpdate = false;//设置，交易所，市场，证券类型 下拉框可以使用
        $scope.ModalEntity = {};
        setDefaultValue();
        formValidateReset();
    };

  //显示默认值
    function setDefaultValue() {
        $scope.ModalEntity.bFee=0;
        $scope.ModalEntity.sFee=0;
        $scope.ModalEntity.minFee=0;
        
        $scope.ModalEntity.bTax=0;
        $scope.ModalEntity.sTax=0;
        $scope.ModalEntity.minTax=0;
        
        $scope.ModalEntity.bTransferFee=0;
        $scope.ModalEntity.sTransferFee=0;
        $scope.ModalEntity.minTransferFee=0;
    }
    //修改的时候弹出Modal框进行的初始化（交易所、市场、证券类型不允许改变）
    $scope.initUpdateParam = function (index, entity) {
    	$scope.isUpdate = true;//交易所、市场、证券类型的下拉框不能改变
    	$scope.products = [];
/*    	angular.forEach($scope.productDatas, function(data, index, array) {
			if (data.exchID == entity.exchID) {
				$scope.products.push(array[index]);
			}
		});*/
        $scope.tempEntity = angular.copy(entity);
        
		/*$scope.tempEntity.bFee=entity.bFee.toFixed(8);
		$scope.tempEntity.sFee=entity.sFee.toFixed(8);
		$scope.tempEntity.minFee=entity.minFee.toFixed(2);
		
		$scope.tempEntity.bTax=entity.bTax.toFixed(8);
		$scope.tempEntity.sTax=entity.sTax.toFixed(8);
		$scope.tempEntity.minTax=entity.minTax.toFixed(2);
		
		$scope.tempEntity.bTransferFee=entity.bTransferFee.toFixed(8);
		$scope.tempEntity.sTransferFee=entity.sTransferFee.toFixed(8);
		$scope.tempEntity.minTransferFee=entity.minTransferFee.toFixed(2);*/
		
		
		
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        $scope.$apply();
        formValidateReset();
    };

    $scope.save = function (entity) {
    	$scope.canClick=true;
        var index = entity.recordIndex;
        $scope.tempEntity = angular.copy(entity);
        //增加
        if (index == undefined) {
        	 $scope.defaultStockProductFeeSet.findDefaultStockProductFeeSetEntity(function (result){
        		if(result.length > 0){
        			$scope.canClick=false;
        			layer.msg("新增失败，不可重复", {
						icon : 2,
						time : 3000
					});
        		}else{//如果没有重复，就保存数据，同时，初始化modal菜单
        			
        			 $scope.defaultStockProductFeeSet.saveDefaultStockProductFeeSetEntity(function (addResult){
        				$scope.listEntitys.unshift(addResult);
        				 $scope.defaultStockProductFeeSet.getPullDownDatas(function(result){
    						$scope.exchangeDatas = result.exchList;
    	    		    	$scope.marketDatas = result.marketList;
    	    		    	$scope.stockTypeDatas = result.stockTypeList;
    	    		    	$scope.$apply();
    	    		    });
        				$scope.$apply();
        				$scope.find({});
        				//关闭窗口
        		        $("#defaultStockProductFeeSetModal").modal("hide");
        			},$scope.tempEntity);
        			
            	}
        	},entity);
            //修改
        } else {
        	 $scope.defaultStockProductFeeSet.updateDefaultStockProductFeeSetEntity(function(updateResult){
            	var b = false;
            	if(updateResult!=null&&updateResult!=undefined){ 
            		$scope.listEntitys.splice(index, 1, $scope.tempEntity);
            	    b=true;
            	}
            	if(b){
            		 $scope.$apply();
            	}
                 
            },$scope.tempEntity);
        	 $scope.find({});
          //关闭窗口
            $("#defaultStockProductFeeSetModal").modal("hide");
        }
        $timeout(function() {
            $scope.canClick = false;
        }, 2000); 
    };
    
    //初始化
    $(document).ready(function() {
		    	//会话列表初始化
		    	$scope.defaultStockProductFeeSetTable = $('#defaultStockProductFeeSet_dynamic_table').DataTable( {
			    		data : $scope.defaultStockProductFeeSetDataset,
			        	columns :$scope.defaultStockProductFeeSet_columns,
			            dom: 'rt<"bottom"iplB>',
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: []
		        } );
      });

   
    
  /*//---------------------
    //设置事件方法(当选择的交易所发生改变时，根据交易所获得对应的productID,暂时用不到该方法)
    $scope.products = new Array();
    $scope.selectExchange = function (exchID) {
        $scope.products = new Array();
        $scope.ModalEntity.productID = "";
        getAllProductByConditionEntity(
            function (result) {
                if (result.length > 0) {
                    $scope.products = result;
                    $scope.ModalEntity.productID = $scope.products[0].productID;
                    $scope.$apply();
                }
            }, {
                exchID: exchID,
                productID: '',
                productType: clearConstant.productTypes[0].key,
                productStatus: ''
            });
    };
    //------------------------
*/
});
