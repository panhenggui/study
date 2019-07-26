myapp.controller('RevokeTradeLimitController', function ($scope, $timeout,$rootScope) {
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
	
	$scope.revokeTradeLimitService = new com.quantdo.orgClear.service.revokeTradeLimitService();
	
	// 按钮权限
    $scope.revokeTradeLimit_query = isShow("revokeTradeLimit_query");
    $scope.revokeTradeLimit_add = isShow("revokeTradeLimit_add");
    $scope.revokeTradeLimit_delete = isShow("revokeTradeLimit_delete");
    $scope.revokeTradeLimit_update = isShow("revokeTradeLimit_update");
	
	$scope.ModalEntity = {};
    $scope.listEntitys = {};
    $scope.queryEntity = {};
    $scope.productTypes =[
        {text: '全部类别', key: '0'},
        {text: '期货', key: '1'},
        {text: '期权', key: '2'}
    ];
    
    $scope.instClientList = [];
    getInstClientQueryConditionList(function(result){
    	$scope.instClientList = angular.copy(result);
    	if($scope.instClientList.length > 1){
    		$scope.queryEntity.instClientID = "";
    	}else{
    		$scope.queryEntity.instClientID = $scope.instClientList[0].instClientID;
    	}
    	$scope.$apply();
    	$timeout(function() {
      	    $scope.find($scope.queryEntity);
        }, 500);
    });
    
    queryInstClientID(function(result){
    	if(result != undefined){
    		$scope.noInst = true;
    	}else{
    		$scope.noInst = false;
    	}
    });
    
    $scope.exchangeDatas = {};
    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
        $scope.$apply();
    });
    
    $scope.products = [];
    $scope.productDatas = [];
    //初始化页面信息
    getAllProductEntity(function (result) {
        $scope.products = result;
        $scope.productDatas = result;
        $scope.$apply();
    });
    
    //交易所,品种类别级联查询品种代码
    $scope.changeProductID = function(){
    	var entity = $scope.queryEntity;
        //根据交易所ID和品种类别查询产品信息
        getProductByExchID(function (result) {
        	$scope.productDatas = [];
            if(result !=undefined && result.length>0){
                $scope.productDatas = result;
                $scope.$apply();
            }
        }, {'exchID': entity.exchID, 'productID': '',  'productStatus': ''});
    }
    
    // 查询(前台分页)
    $scope.find = function(entity){
    	//更新表格对应的数据集
    	$scope.revokeTradeLimitService.findByQuery(function (result) {
    		//将数据集赋值为空
	    	$scope.revokeTradeLimitDataset = [];
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	var operate = "";
            	if($scope.revokeTradeLimit_update){
            		operate = operate.concat("<a class='update-row' data-toggle='modal' data-target='#revokeTradeLimitModal'>修改</a>");
            	}if($scope.revokeTradeLimit_delete){
            		operate = operate.concat("<a class='delete-row' data-toggle='modal'>删除</a>");
            	}
            	if(con[i].maxTradeRevoke == null){
            		var maxTradeRevoke = "";
            	}else{
            		var maxTradeRevoke = parseFloat($scope.transNull(con[i].maxTradeRevoke*100)).toFixed(2)+"%";
            	}
                var tempArr = [(i+1),con[i].id,$scope.transInstClientID(con[i].instClientID),con[i].exchID,$scope.transNull(con[i].productID),
                    $scope.transProductType(con[i].productType),$scope.transNull(con[i].maxTradeLimit),$scope.transNull(con[i].maxRevokeLimit),
                    con[i].operatorID,con[i].operateDate,operate];
	            $scope.revokeTradeLimitDataset.push(tempArr);
	            con[i].index = i+1;
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.revokeTradeLimitTable.clear().draw();
            $scope.revokeTradeLimitTable.rows.add($scope.revokeTradeLimitDataset).draw();
            $scope.$apply();
        }, entity);  	
    };
    
    $scope.transNull = function(key){
    	if(key == null){
    		key = "";
    	}
    	return key;
    };
    
    $scope.transProductType = function(productType){
    	for(var i=0;i<$scope.productTypes.length;i++){
    		if($scope.productTypes[i].key == productType){
    			return $scope.productTypes[i].text;
    		}
    	}
    };
    
    $scope.transInstClientID = function(instClientID){
    	for(var i=0;i<$scope.instClientList.length;i++){
			if($scope.instClientList[i].instClientID == instClientID){
				return $scope.instClientList[i].instClientAbbrName;
			}
		}
    };

    //重置表单验证信息
    function formValidateReset() {
        $scope.myForm.maxTradeLimit.$setPristine();
        $scope.myForm.maxRevokeLimit.$setPristine();
        //$scope.myForm.maxTradeRevoke.$setPristine();
    }
    
    $scope.isFour = true;
    //交易所,品种类别级联查询新增时的品种代码
    $scope.changeModalProductID = function(exchID){
    	if(exchID != "CFFEX" && exchID != "SHFE" && exchID != "DCE" && exchID != "CZCE"){
    		$scope.isFour = false;
    		$scope.ModalEntity.productType = $scope.productTypes[0].key;
    	}else{
    		$scope.isFour = true;
    	}
    	
        //根据交易所ID和品种类别查询产品信息
        getProductByExchID(function (result) {
        	$scope.products= [];
            if(result !=undefined && result.length>0){
                $scope.products = result;
            }
            $scope.$apply();
        }, {'exchID': exchID, 'productID': '',  'productStatus': ''});
    }

    //初始化模态窗
    $scope.initParameter = function () {
    	$scope.isUpdate = false;
    	$scope.isFour = true;
        $scope.ModalEntity={};
        $scope.ModalEntity.productType = $scope.productTypes[0].key;
        $scope.ModalEntity.exchID = $scope.exchangeDatas[0].exchID;
        if($scope.ModalEntity.exchID != "CFFEX" && $scope.ModalEntity.exchID != "SHFE" && 
        	$scope.ModalEntity.exchID != "DCE" && $scope.ModalEntity.exchID != "CZCE"){
    		$scope.isFour = false;
    		$scope.ModalEntity.productType = $scope.productTypes[0].key;
    	}else{
    		$scope.isFour = true;
    	}
        $scope.changeModalProductID($scope.ModalEntity.exchID);
        $scope.ModalEntity.instClientID = $scope.instClientList[0].instClientID;
        formValidateReset();
        $timeout(function() {
        	$("#revokeTradeLimitModal").modal("show");
        }, 500);
    };
    
    $("body").undelegate("#revokeTradeLimit_dynamic_table_wrapper td .update-row","click");
    $("body").delegate("#revokeTradeLimit_dynamic_table_wrapper td .update-row","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.revokeTradeLimitTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.initUpdateParam(id,$scope.modalEntity);
    });

    //修改
    $scope.initUpdateParam = function (index, entity) {
    	$scope.isUpdate = true;
    	$scope.ModalEntity = {};
        $scope.ModalEntity = angular.copy(entity);
        $scope.ModalEntity.recordIndex = index;
        if($scope.ModalEntity.maxTradeRevoke == null){
        	$scope.ModalEntity.maxTradeRevoke = "";
    	}else{
    		$scope.ModalEntity.maxTradeRevoke = parseFloat($scope.transNull($scope.ModalEntity.maxTradeRevoke*100)).toFixed(2);
    	}
        formValidateReset();  
        $scope.$apply();
    }
    
    $scope.transBlank = function(key){
    	if(key == "" || key == undefined){
    		key = null;
    	}
    	return key;
    }

    // 保存操作记录
    $scope.save = function (entity) {
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        if((entity.maxTradeLimit == undefined || entity.maxTradeLimit == "") &&　
        	(entity.maxRevokeLimit == undefined || entity.maxRevokeLimit == "") ){
        	layer.msg("合约报单手数上限，合约撤单笔数上限不能同时为空",{icon: 2});
        	return false;
        }
        entity.productID = $scope.transBlank(entity.productID);
        entity.maxTradeLimit = $scope.transBlank(entity.maxTradeLimit);
        entity.maxRevokeLimit = $scope.transBlank(entity.maxRevokeLimit);
        entity.maxTradeRevoke = $scope.transBlank(entity.maxTradeRevoke);
        var tmpEntity = angular.copy(entity);
        if(tmpEntity.maxTradeRevoke != null){
        	tmpEntity.maxTradeRevoke = (tmpEntity.maxTradeRevoke/100).toFixed(4);
        }
        //增加
        if (index == undefined) {

            //校验唯一性
        	$scope.revokeTradeLimitService.checkByQuery(function (result) {
                if (result.length > 0) {
                    layer.msg("该机构下已有该交易所的该品种的该合约类别报撤单比例设置", {icon: 2, time: 3000});
                    return false;
                } else {
                	$scope.revokeTradeLimitService.add(function (result) {                
                        $scope.listEntitys.push(result);
                        $scope.$apply();
                        $scope.find($scope.queryEntity);
                        //关闭窗口
                        $("#revokeTradeLimitModal").modal("hide");
                        layer.msg("新增成功", {icon: 1, time: 3000});
                    }, tmpEntity);
                }
            }, tmpEntity);
            //修改
        } else {
        	$scope.revokeTradeLimitService.update(function (result) {
            	result.index = tableIndex;
                $scope.listEntitys.splice(tableIndex-1, 1, result);
                $scope.revokeTradeLimitTable.cells().every( function () {
                    if((tableIndex-1) == this[0][0].row){
                        if(this[0][0].column == 6){
                            this.data($scope.transNull(result.maxTradeLimit));
                            $scope.$apply();
                        }
                        if(this[0][0].column == 7){
                            this.data($scope.transNull(result.maxRevokeLimit));
                            $scope.$apply();
                        }
                        /*if(this[0][0].column == 8){
                        	if(result.maxTradeRevoke == null){
                        		var maxTradeRevoke = "";
                        	}else{
                        		var maxTradeRevoke = parseFloat($scope.transNull(result.maxTradeRevoke*100)).toFixed(2)+"%";
                        	}
                            this.data(maxTradeRevoke);
                            $scope.$apply();
                        }*/
                    }
             	});
                $("#revokeTradeLimitModal").modal("hide");
                layer.msg("修改成功", {icon: 1, time: 3000});
            }, tmpEntity);
        }
    }
    
    $("body").undelegate("#revokeTradeLimit_dynamic_table_wrapper td .delete-row","click");
    $("body").delegate("#revokeTradeLimit_dynamic_table_wrapper td .delete-row","click",function(){
   	$scope.modalEntity = {};
   	var mytr = $(this).parents("tr");
       var tempArr = $scope.revokeTradeLimitTable.row(mytr).data();
       var id = tempArr[1];
       for(var i = 0;i<$scope.listEntitys.length;i++){
       	if(id==$scope.listEntitys[i].id){
       		$scope.modalEntity = $scope.listEntitys[i];
       	}
       }
       $scope.remove(id,$scope.modalEntity);
    });
    
    //删除
    $scope.remove = function (index, entity) {
    	layer.confirm('确定删除该报撤单比例设置？', {icon: 3}, function (count) {
    		$scope.revokeTradeLimitService.remove(function(result){
    			layer.close(count);
    	        $scope.find($scope.queryEntity);
    	        $scope.$apply();		
    		},entity.id);
    	});
    }
    
    //定义产品基础信息的固定列头
    $scope.revokeTradeLimit_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "所属机构"},
        {title: "交易所代码"},
        {title: "品种代码"},
        {title: "合约类别"},
        {title: "合约报单手数上限（每笔）"},
        {title: "合约撤单笔数上限（每天）"},
        //{title: "报撤单比例上限"},
        {title: "操作员"},
        {title: "操作日期"},
        {title: "操作"}
    ]; 
    
    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.revokeTradeLimitTable = $('#revokeTradeLimit_dynamic_table').DataTable( {
    		data : $scope.revokeTradeLimitDataset,
        	columns :$scope.revokeTradeLimit_columns,
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

