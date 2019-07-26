myapp.controller('CapitalAccountLimitController', function ($scope, $timeout,$rootScope) {
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
	
	$scope.capitalAccountLimitService = new com.quantdo.orgClear.service.capitalAccountLimitService();
	
	// 按钮权限
    $scope.capitalAccountLimit_query = isShow("capitalAccountLimit_query");
    $scope.capitalAccountLimit_add = isShow("capitalAccountLimit_add");
    $scope.capitalAccountLimit_delete = isShow("capitalAccountLimit_delete");
    $scope.capitalAccountLimit_update = isShow("capitalAccountLimit_update");
	
	$scope.ModalEntity = {};
    $scope.queryEntity = {};
    $scope.listEntitys = [];
    
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
    
    $scope.changeInstClient = function(){
    	if("" == $scope.queryEntity.instClientID){
    		$scope.queryEntity.instClientID = null;
    	}
		//查询资金账号
		findCapitalAccountByQuery({"brokerageFirmID":$scope.queryEntity.instClientID}, function(result){
			$scope.queryAccountEntitys = angular.copy(result);
			$scope.$apply();
		});
	}

    $scope.allAccountEntitys = [];
    $scope.queryAccountEntitys = [];
    $scope.modalAccountEntitys = [];
    //所有资金帐号
    getAllCapitalAccountEntity(function (result) {
    	$scope.allAccountEntitys = result;
        $scope.queryAccountEntitys = result;
        $scope.modalAccountEntitys = result;
        $scope.$apply();
    });
    
    // 查询(前台分页)
    $scope.find = function(entity){
    	//更新表格对应的数据集
    	$scope.capitalAccountLimitService.findByQuery(function (result) {
    		//将数据集赋值为空
	    	$scope.capitalAccountLimitDataset = [];
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	var operate = "";
            	if($scope.capitalAccountLimit_update){
            		operate = operate.concat("<a class='update-row' data-toggle='modal' data-target='#capitalAccountLimitModal'>修改</a>");
            	}if($scope.capitalAccountLimit_delete){
            		operate = operate.concat("<a class='delete-row' data-toggle='modal'>删除</a>");
            	}
            	if(con[i].minFinalInterestStr == null){
            		var minFinalInterest = "";
            	}else{
            		var minFinalInterest = parseFloat($scope.transNull(con[i].minFinalInterestStr)).toFixed(2);
            	}
            	if(con[i].maxAccountRisk == null){
            		var maxAccountRisk = "";
            	}else{
            		var maxAccountRisk = parseFloat($scope.transNull(con[i].maxAccountRisk*100)).toFixed(2)+"%";
            	}
                var tempArr = [(i+1),con[i].id,$scope.transInstClientID(con[i].instClientID),con[i].innerAccountID,minFinalInterest,
                    maxAccountRisk,con[i].operatorID,con[i].operateDate,operate];
	            $scope.capitalAccountLimitDataset.push(tempArr);
	            con[i].index = i+1;
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.capitalAccountLimitTable.clear().draw();
            $scope.capitalAccountLimitTable.rows.add($scope.capitalAccountLimitDataset).draw();
            $scope.$apply();
        }, entity);  	
    }
    
    $scope.transNull = function(key){
    	if(key == null){
    		key = "";
    	}
    	return key;
    }
    
    $scope.transInstClientID = function(instClientID){
    	for(var i=0;i<$scope.instClientList.length;i++){
			if($scope.instClientList[i].instClientID == instClientID){
				return $scope.instClientList[i].instClientAbbrName;
			}
		}
    };

  //重置表单验证信息
    function formValidateReset() {
        $scope.myForm.minFinalInterest.$setPristine();
        $scope.myForm.maxAccountRisk.$setPristine();
    }
    
    //初始化模态窗
    $scope.initParameter = function () {
    	$scope.isUpdate = false;
        $scope.ModalEntity={};
        $scope.ModalEntity.instClientID = $scope.instClientList[0].instClientID;
        $scope.changeModalInstClient($scope.ModalEntity.instClientID);
        formValidateReset();
    };
    
    $scope.changeModalInstClient = function(instClientID){
		//查询资金账号
		findCapitalAccountByQuery({"brokerageFirmID":instClientID}, function(result){
			$scope.modalAccountEntitys = angular.copy(result);
			if(result.length > 0){
				$scope.ModalEntity.innerAccountID = $scope.modalAccountEntitys[0].innerAccountID;
			}
			$scope.$apply();
		});
	}
    
    $("body").undelegate("#capitalAccountLimit_dynamic_table_wrapper td .update-row","click");
    $("body").delegate("#capitalAccountLimit_dynamic_table_wrapper td .update-row","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.capitalAccountLimitTable.row(mytr).data();
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
    	$scope.modalAccountEntitys = $scope.allAccountEntitys;
    	$scope.isUpdate = true;
    	$scope.ModalEntity = {};
        $scope.ModalEntity = angular.copy(entity);
        $scope.ModalEntity.recordIndex = index;
        if($scope.ModalEntity.minFinalInterest == null){
        	$scope.ModalEntity.minFinalInterest = "";
    	}else{
    		$scope.ModalEntity.minFinalInterest = parseFloat($scope.transNull($scope.ModalEntity.minFinalInterest)).toFixed(2);
    	}
        if($scope.ModalEntity.maxAccountRisk == null){
        	$scope.ModalEntity.maxAccountRisk = "";
    	}else{
    		$scope.ModalEntity.maxAccountRisk = parseFloat($scope.transNull($scope.ModalEntity.maxAccountRisk*100)).toFixed(2);
    	}
        formValidateReset();  
        $scope.$apply();
    };
    
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
        if((entity.minFinalInterest == undefined || entity.minFinalInterest == "") &&　
        	(entity.maxAccountRisk == undefined || entity.maxAccountRisk == "")){
        	layer.msg("最低限额以及最高风险度不能同时为空",{icon: 2});
        	return false;
        }
        entity.minFinalInterest = $scope.transBlank(entity.minFinalInterest);
        entity.maxAccountRisk = $scope.transBlank(entity.maxAccountRisk);
        var tmpEntity = angular.copy(entity);
        if(tmpEntity.maxAccountRisk != null){
        	tmpEntity.maxAccountRisk = (tmpEntity.maxAccountRisk/100).toFixed(4);
        }
        tmpEntity.minFinalInterestStr = tmpEntity.minFinalInterest;
        entity.minFinalInterestStr = tmpEntity.minFinalInterestStr;
        //增加
        if (index == undefined) {

            //校验唯一性
        	$scope.capitalAccountLimitService.findByQuery(function (result) {
                if (result.length > 0) {
                    layer.msg("该机构下该资金账号已有限额设置", {icon: 2, time: 3000});
                    return false;
                } else {
                	$scope.capitalAccountLimitService.add(function (result) {  
                		if(result == null){
                			layer.msg("最低限额不可大于可用资金!", {icon: 2, time: 3000});
                		}else{
                			$scope.listEntitys.push(result);
                            $scope.$apply();
                            $scope.find($scope.queryEntity);
                            //关闭窗口
                            $("#capitalAccountLimitModal").modal("hide");
                            layer.msg("新增成功", {icon: 1, time: 3000});
                		}
                    }, tmpEntity);
                }
            }, tmpEntity);
            //修改
        } else {
        	$scope.capitalAccountLimitService.update(function (result) {
        		if(result == null){
        			layer.msg("最低限额不可大于可用资金!", {icon: 2, time: 3000});
        		}else{
        			result.index = tableIndex;
                    $scope.listEntitys.splice(tableIndex-1, 1, result);
                    $scope.capitalAccountLimitTable.cells().every( function () {
                        if((tableIndex-1) == this[0][0].row){
                            if(this[0][0].column == 4){
                            	if(result.minFinalInterest == null){
                            		var minFinalInterest = "";
                            	}else{
                            		var minFinalInterest = parseFloat($scope.transNull(entity.minFinalInterestStr)).toFixed(2);
                            	}
                                this.data(minFinalInterest);
                            }
                            if(this[0][0].column == 5){
                            	if(result.maxAccountRisk == null){
                            		var maxAccountRisk = "";
                            	}else{
                            		var maxAccountRisk = parseFloat($scope.transNull(result.maxAccountRisk*100)).toFixed(2)+"%";
                            	}
                                this.data(maxAccountRisk);
                                $scope.$apply();
                            }
                        }
                 	});
                    $("#capitalAccountLimitModal").modal("hide");
                    layer.msg("修改成功", {icon: 1, time: 3000});
        		}
            }, tmpEntity);
        }
    };
    
    $("body").undelegate("#capitalAccountLimit_dynamic_table_wrapper td .delete-row","click");
    $("body").delegate("#capitalAccountLimit_dynamic_table_wrapper td .delete-row","click",function(){
   	$scope.modalEntity = {};
   	var mytr = $(this).parents("tr");
       var tempArr = $scope.capitalAccountLimitTable.row(mytr).data();
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
    	layer.confirm('确定删除该限额设置？', {icon: 3}, function (count) {
    		$scope.capitalAccountLimitService.remove(function(result){
    			layer.close(count);
    	        $scope.find($scope.queryEntity);
    	        $scope.$apply();		
    		},entity.id);
    	});
    };
    
    //定义产品基础信息的固定列头
    $scope.capitalAccountLimit_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "所属机构"},
        {title: "资金账号"},
        {title: "最低限额"},
        {title: "最高风险度"},
        {title: "操作员"},
        {title: "操作日期"},
        {title: "操作"}
    ]; 
    
    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.capitalAccountLimitTable = $('#capitalAccountLimit_dynamic_table').DataTable( {
    		data : $scope.capitalAccountLimitDataset,
        	columns :$scope.capitalAccountLimit_columns,
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

