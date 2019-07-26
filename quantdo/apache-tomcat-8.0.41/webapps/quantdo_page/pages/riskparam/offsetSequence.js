myapp.controller('OffsetSequenceController', function ($scope, $timeout,$rootScope) {
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
	
	$scope.queryEntity = {};
	$scope.productTypes = [
		{text: '全部类别', key: '0'},
	    {text: '期货', key: '1'},
	    {text: '期权', key: '2'}
	];

	$scope.offsetSequenceService = new com.quantdo.orgClear.service.offsetSequenceService();
	
	// 按钮权限
    $scope.offsetSequence_query = isShow("offsetSequence_query");
    $scope.offsetSequence_add = isShow("offsetSequence_add");
    $scope.offsetSequence_delete = isShow("offsetSequence_delete");
    $scope.offsetSequence_update = isShow("offsetSequence_update");
	
	$scope.ModalEntity = {};
    $scope.listEntitys = {};
    
    $scope.sequenceTypes = clearConstant.sequenceTypes;
    
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
    
    $scope.isFour = true;
    $scope.changeExchID = function(exchID){
    	if(exchID != "CFFEX" && exchID != "SHFE" && exchID != "DCE" && exchID != "CZCE"){
    		$scope.isFour = false;
    		$scope.ModalEntity.productType = $scope.productTypes[0].key;
    	}else{
    		$scope.isFour = true;
    	}
    }
    
    // 查询(前台分页)
    $scope.find = function(entity){
    	//更新表格对应的数据集
    	$scope.offsetSequenceService.findByQuery(function (result) {
    		//将数据集赋值为空
	    	$scope.offsetSequenceDataset = [];
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	var operate = "";
            	if($scope.offsetSequence_update){
            		operate = operate.concat("<a class='update-row' data-toggle='modal' data-target='#offsetSequenceModal'>修改</a>");
            	}if($scope.offsetSequence_delete){
            		operate = operate.concat("<a class='delete-row' data-toggle='modal'>删除</a>");
            	}
                var tempArr = [(i+1),con[i].id,$scope.transInstClientID(con[i].instClientID),con[i].exchID,$scope.transNull(con[i].instrumentID),$scope.transProductTypes(con[i].productType),
                    $scope.transSequenceTypes(con[i].sequenceType),con[i].operatorID,con[i].operateDate,operate];
	            $scope.offsetSequenceDataset.push(tempArr);
	            con[i].index = i+1;
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.offsetSequenceTable.clear().draw();
            $scope.offsetSequenceTable.rows.add($scope.offsetSequenceDataset).draw();
            $scope.$apply();
        }, entity);  	
    };
    
    $scope.transNull = function(key){
    	if(key == null){
    		key = "";
    	}
    	return key;
    };
    
    $scope.transSequenceTypes = function(sequenceType){
    	for(var i=0;i<$scope.sequenceTypes.length;i++){
    		if($scope.sequenceTypes[i].key == sequenceType){
    			return $scope.sequenceTypes[i].text;
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
    
    $scope.transProductTypes = function(productType){
    	for(var i=0;i<$scope.productTypes.length;i++){
    		if($scope.productTypes[i].key == productType){
    			return $scope.productTypes[i].text;
    		}
    	}
    };

    //重置表单验证信息
    function formValidateReset() {
        $scope.myForm.instrumentID.$setPristine();
        $scope.myForm.sequenceType.$setPristine();
    }
    
    //初始化模态窗
    $scope.initParameter = function () {
    	$scope.isUpdate = false;
    	$scope.isFour = true;
        $scope.ModalEntity={};
        $scope.ModalEntity.exchID = $scope.exchangeDatas[0].exchID;
        if($scope.ModalEntity.exchID != "CFFEX" && $scope.ModalEntity.exchID != "SHFE" && 
        	$scope.ModalEntity.exchID != "DCE" && $scope.ModalEntity.exchID != "CZCE"){
    		$scope.isFour = false;
    		$scope.ModalEntity.productType = $scope.productTypes[0].key;
    	}else{
    		$scope.isFour = true;
    	}
        $scope.ModalEntity.instClientID = $scope.instClientList[0].instClientID;
        $scope.ModalEntity.productType = $scope.productTypes[0].key;
        formValidateReset();
    };
    
    $("body").undelegate("#offsetSequence_dynamic_table_wrapper td .update-row","click");
    $("body").delegate("#offsetSequence_dynamic_table_wrapper td .update-row","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.offsetSequenceTable.row(mytr).data();
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
        entity.instrumentID = $scope.transBlank(entity.instrumentID);
        var tmpEntity = angular.copy(entity);
        //增加
        if (index == undefined) {
        	$scope.offsetSequenceService.checkInstrumentID(function(result) {
        		if(result == 0){
        			layer.msg("该交易所下无该品种/合约代码", {icon: 2, time: 3000});
                    return false;
        		}if(result == -1){
        			layer.msg("合约类别不匹配", {icon: 2, time: 3000});
                    return false;
        		}else{
        			//校验唯一性
                	$scope.offsetSequenceService.checkByQuery(function (result) {
                        if (result.length > 0) {
                            layer.msg("该机构下已有该交易所的该品种的该开平仓顺序设置", {icon: 2, time: 3000});
                            return false;
                        } else {
                        	$scope.offsetSequenceService.add(function (result) {                
                                $scope.listEntitys.push(result);
                                $scope.$apply();
                                $scope.find($scope.queryEntity);
                                //关闭窗口
                                $("#offsetSequenceModal").modal("hide");
                                layer.msg("新增成功", {icon: 1, time: 3000});
                            }, tmpEntity);
                        }
                    }, tmpEntity);
        		}
        	},tmpEntity);
            //修改
        } else {
        	$scope.offsetSequenceService.update(function (result) {
            	result.index = tableIndex;
                $scope.listEntitys.splice(tableIndex-1, 1, result);
                $scope.offsetSequenceTable.cells().every( function () {
                    if((tableIndex-1) == this[0][0].row){
                        if(this[0][0].column == 6){
                            this.data($scope.transSequenceTypes(result.sequenceType));
                            $scope.$apply();
                        }
                    }
             	});
                $("#offsetSequenceModal").modal("hide");
                layer.msg("修改成功", {icon: 1, time: 3000});
            }, tmpEntity);
        }
    }
    
    $("body").undelegate("#offsetSequence_dynamic_table_wrapper td .delete-row","click");
    $("body").delegate("#offsetSequence_dynamic_table_wrapper td .delete-row","click",function(){
   	$scope.modalEntity = {};
   	var mytr = $(this).parents("tr");
       var tempArr = $scope.offsetSequenceTable.row(mytr).data();
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
    	layer.confirm('确定删除该开平仓顺序设置？', {icon: 3}, function (count) {
    		$scope.offsetSequenceService.remove(function(result){
    			layer.close(count);
    	        $scope.find($scope.queryEntity);
    	        $scope.$apply();		
    		},entity.id);
    	});
    }
    
    //定义产品基础信息的固定列头
    $scope.offsetSequence_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "所属机构"},
        {title: "交易所代码"},
        {title: "品种/合约代码"},
        {title: "合约类别"},
        {title: "开平仓优先顺序"},
        {title: "操作员"},
        {title: "操作日期"},
        {title: "操作"}
    ]; 
    
    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.offsetSequenceTable = $('#offsetSequence_dynamic_table').DataTable( {
    		data : $scope.offsetSequenceDataset,
        	columns :$scope.offsetSequence_columns,
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

