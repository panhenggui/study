myapp.controller('CapitalAccountSequenceController', function ($scope, $timeout,$rootScope) {
    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$scope.capitalAccountSequenceService = new com.quantdo.orgClear.service.capitalAccountSequenceService();
	
	// 按钮权限
    $scope.capitalAccountSequence_query = isShow("capitalAccountSequence_query");
    $scope.capitalAccountSequence_add = isShow("capitalAccountSequence_add");
    $scope.capitalAccountSequence_delete = isShow("capitalAccountSequence_delete");
    $scope.capitalAccountSequence_update = isShow("capitalAccountSequence_update");
    
    $scope.parentInvestorOrders = clearConstant.parentInvestorOrders;
    $scope.arithmetics = clearConstant.arithmetics;
	
	$scope.ModalEntity = {};
    $scope.queryEntity = {};
    $scope.listEntitys = [];
    
    $scope.instClientList = [];
    $scope.capitalAccountSequenceService.findQDArithmeticInstClient(function(result){
    	$scope.instClientList = angular.copy(result);
    	$scope.instClientListModal = angular.copy(result);
    	/*if($scope.instClientList.length > 0){
    		$scope.queryEntity.instClientID = "";
    	}else{
    		$scope.queryEntity.instClientID = "";
    	}
    	$scope.$apply();
    	$timeout(function() {
      	    $scope.find($scope.queryEntity);
        }, 500);*/
    	
    	getInstClientQueryConditionList(function(result){
        	//$scope.instClientList = angular.copy(result);
        	if(result.length != 1){
        		$scope.queryEntity.instClientID = "";
        	}else{
        		var flag =false;
        		for(var i=0;i<$scope.instClientList.length;i++){
        			if($scope.instClientList[i].instClientID = result[0].instClientID){
        				flag = true;
        				break;
        			}
        		}
        		if(!flag){
        			$scope.instClientList.push(result[0]);
        		}
        		$scope.queryEntity.instClientID = result[0].instClientID;
        	}
        	$scope.$apply();
        	$timeout(function() {
          	    $scope.find($scope.queryEntity);
            }, 500);
        });
    })
    
    
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
		findBySubCapitalAccountInfo({"instClientID":$scope.queryEntity.instClientID}, function(result){
			$scope.querySubAccountEntitys = angular.copy(result);
			$scope.$apply();
		});
	}

    $scope.querySubAccountEntitys = [];
    $scope.modalSubAccountEntitys = [];
    $scope.allSubAccountEntitys = [];
    //所有资金帐号
    getAllSubCapitalEntity(function (result) {
    	$scope.allSubAccountEntitys = result;
        $scope.querySubAccountEntitys = result;
        $scope.modalSubAccountEntitys = result;
        $scope.$apply();
    });
    
    // 查询(前台分页)
    $scope.find = function(entity){
    	//更新表格对应的数据集
    	$scope.capitalAccountSequenceService.findByQuery(function (result) {
    		//将数据集赋值为空
	    	$scope.capitalAccountSequenceDataset = [];
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	var operate = "";
            	if($scope.capitalAccountSequence_update){
            		operate = operate.concat("<a class='update-row' data-toggle='modal'>修改</a>");
            	}if($scope.capitalAccountSequence_delete){
            		operate = operate.concat("<a class='delete-row' data-toggle='modal'>删除</a>");
            	}
            	for(var j=0;j<$scope.instClientList.length;j++){
            		if($scope.instClientList[j].instClientID == con[i].instClientID){
            			var arithmetic = $scope.instClientList[j].arithmetic;
            		}
            	}
                var tempArr = [(i+1),con[i].id,$scope.transInstClientID(con[i].instClientID),con[i].subAccountID,
                    $scope.transParentInvestorOrder(con[i].parentInvestorOrder),$scope.transArithmetics(arithmetic),con[i].operatorID,con[i].operateDate,operate];
	            $scope.capitalAccountSequenceDataset.push(tempArr);
	            con[i].index = i+1;
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.capitalAccountSequenceTable.clear().draw();
            $scope.capitalAccountSequenceTable.rows.add($scope.capitalAccountSequenceDataset).draw();
            $scope.$apply();
        }, entity);  	
    }
    
    // 分仓算法转换
    $scope.transArithmetics = function (key) {
    	for(var i = 0;i < $scope.arithmetics.length; i++){
    		if($scope.arithmetics[i].key == key){
    			return $scope.arithmetics[i].text;
    		}
    	}
    	return "";
    }

    $scope.transParentInvestorOrder = function(parentInvestorOrder){
    	for(var i=0;i<$scope.parentInvestorOrders.length;i++){
    		if($scope.parentInvestorOrders[i].key == parentInvestorOrder){
    			return $scope.parentInvestorOrders[i].text;
    		}
    	}
    	return "";
    }
    
    $scope.transInstClientID = function(instClientID){
    	for(var i=0;i<$scope.instClientList.length;i++){
			if($scope.instClientList[i].instClientID == instClientID){
				return $scope.instClientList[i].instClientAbbrName;
			}
		}
    	return "";
    };
    
   //重置表单验证信息
    function formValidateReset() {
    	$scope.myForm.instClientID.$setPristine();
    	$scope.myForm.subAccountID.$setPristine();
        $scope.myForm.parentInvestorOrder.$setPristine();
    }
    
    //添加组选择
	$scope.arrayGroupMapsTem=[];	
	$scope.addGroupSelect = function(index,alistEntity){
		if(	alistEntity.isSelectActive==false || alistEntity.isSelectActive == undefined){
			$scope.arrayGroupMapsTem.push(alistEntity.sequenceNumber);
			alistEntity.isSelectActive=true;
		}else{
			var i = $scope.arrayGroupMapsTem.indexOf(alistEntity.sequenceNumber);
			$scope.arrayGroupMapsTem.splice(i, 1);	
			alistEntity.isSelectActive=false;
		}
	}
	
	$scope.upSelectGroupEntity = function(){
		$scope.arrayGroupMapsTem.sort();
		if($scope.arrayGroupMapsTem[0] == 1){
			layer.msg("顺序第一的资金账号不可再提升顺序！", {icon: 2, time: 3000});
            return false;
		}
		for(var i=0;i<$scope.arrayGroupMapsTem.length;i++){
			upAlistEntity($scope.arrayGroupMapsTem[i]);
			$scope.arrayGroupMapsTem[i] = +$scope.arrayGroupMapsTem[i] - 1;
		}
	}
	
	function upAlistEntity(index){
		var tmpAccountGroupEntity = {};
		$scope.accountGroupEntitys[index-1].sequenceNumber = +$scope.accountGroupEntitys[index-1].sequenceNumber - 1;
		$scope.accountGroupEntitys[index-2].sequenceNumber = +$scope.accountGroupEntitys[index-2].sequenceNumber + 1;
		tmpAccountGroupEntity = $scope.accountGroupEntitys[index-2];
		$scope.accountGroupEntitys[index-2] = $scope.accountGroupEntitys[index-1];
		$scope.accountGroupEntitys[index-1] = tmpAccountGroupEntity;
	}
	
	$scope.downSelectGroupEntity = function(){
		$scope.arrayGroupMapsTem.sort();
		$scope.arrayGroupMapsTem.reverse();
		if($scope.arrayGroupMapsTem[0] == $scope.accountGroupEntitys.length){
			layer.msg("顺序最后的资金账号不可再降低顺序！", {icon: 2, time: 3000});
            return false;
		}
		for(var i=0;i<$scope.arrayGroupMapsTem.length;i++){
			downAlistEntity($scope.arrayGroupMapsTem[i]);
			$scope.arrayGroupMapsTem[i] = +$scope.arrayGroupMapsTem[i] + 1;
		}
	}
	
	function downAlistEntity(index){
		var tmpAccountGroupEntity = {};
		$scope.accountGroupEntitys[index].sequenceNumber = +$scope.accountGroupEntitys[index].sequenceNumber - 1;
		$scope.accountGroupEntitys[index-1].sequenceNumber = +$scope.accountGroupEntitys[index-1].sequenceNumber + 1;
		tmpAccountGroupEntity = $scope.accountGroupEntitys[index];
		$scope.accountGroupEntitys[index] = $scope.accountGroupEntitys[index-1];
		$scope.accountGroupEntitys[index-1] = tmpAccountGroupEntity;
	}
	
	$scope.accountGroupEntitys = [];
    //初始化模态窗
    $scope.initParameter = function () {
    	$scope.showTable = false;
    	$scope.arrayGroupMapsTem=[];
    	$scope.isUpdate = false;
        $scope.ModalEntity={};
        if($scope.instClientListModal.length > 0){
        	$scope.ModalEntity.instClientID = $scope.instClientListModal[0].instClientID;
            for(var j=0;j<$scope.instClientListModal.length;j++){
        		if($scope.instClientListModal[j].instClientID == $scope.ModalEntity.instClientID){
        			$scope.ModalEntity.arithmetic = $scope.instClientListModal[j].arithmetic;
        		}
        	}
            $scope.changeModalInstClient($scope.ModalEntity.instClientID);
        }else{
        	$scope.modalSubAccountEntitys = [];
        }
        
        $scope.ModalEntity.parentInvestorOrder = "1";
        formValidateReset();
        $scope.capitalAccountSequenceService.findSequence(function(result){
        	$scope.accountGroupEntitys = result;
        	$scope.$apply();
        	$timeout(function() {
        		$("#capitalAccountSequenceModal").modal("show");
        	},500);
        },$scope.ModalEntity);
    };
    
    $scope.changeModalInstClient = function(instClientID){
    	for(var j=0;j<$scope.instClientListModal.length;j++){
    		if($scope.instClientListModal[j].instClientID == instClientID){
    			$scope.ModalEntity.arithmetic = $scope.instClientListModal[j].arithmetic;
    		}
    	}
		//查询资产单元
		findBySubCapitalAccountInfo({"instClientID":instClientID}, function(result){
			if(result.length>0){
				$scope.modalSubAccountEntitys = angular.copy(result);
				$scope.ModalEntity.subAccountID = $scope.modalSubAccountEntitys[0].subAccountID;
				$scope.$apply();
				$scope.changeModalSubAccountID({"instClientID":instClientID,"subAccountID":$scope.ModalEntity.subAccountID});
			}else{
				$scope.modalSubAccountEntitys = [];
				$scope.$apply();
			}
		});
	}
    
    $scope.changeModalSubAccountID = function(entity){
    	$scope.capitalAccountSequenceService.findSequence(function(result){
        	$scope.accountGroupEntitys = result;
        	$scope.$apply();
        },entity);
	}
    
    $scope.showTable = false;
    $scope.changeParentInvestorOrder = function(parentInvestorOrder){
    	if(parentInvestorOrder == 1){
    		$scope.showTable = false;
    	}else{
    		$scope.showTable = true;
    	}
    }
    
    $("body").undelegate("#capitalAccountSequence_dynamic_table_wrapper td .update-row","click");
    $("body").delegate("#capitalAccountSequence_dynamic_table_wrapper td .update-row","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.capitalAccountSequenceTable.row(mytr).data();
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
    	$scope.arrayGroupMapsTem=[];
    	$scope.isUpdate = true;
    	$scope.ModalEntity = {};
        $scope.ModalEntity = angular.copy(entity);
        $scope.ModalEntity.recordIndex = index;
        formValidateReset();  
        $scope.$apply();
        for(var j=0;j<$scope.instClientListModal.length;j++){
    		if($scope.instClientListModal[j].instClientID == $scope.ModalEntity.instClientID){
    			$scope.ModalEntity.arithmetic = $scope.instClientListModal[j].arithmetic;
    		}
    	}
        findBySubCapitalAccountInfo({"instClientID":$scope.ModalEntity.instClientID}, function(result){
			if(result.length>0){
				$scope.modalSubAccountEntitys = angular.copy(result);
				$scope.$apply();
			}else{
				$scope.modalSubAccountEntitys = [];
				$scope.$apply();
			}
		});
        //$scope.modalSubAccountEntitys = $scope.allSubAccountEntitys;
        $scope.changeParentInvestorOrder($scope.ModalEntity.parentInvestorOrder);
        $scope.capitalAccountSequenceService.findSequence(function(result){
        	$scope.accountGroupEntitys = result;
        	$scope.$apply();
        	$timeout(function() {
        		$("#capitalAccountSequenceModal").modal("show");
        	},500);
        },entity);
    };
    
    // 保存操作记录
    $scope.save = function (entity) {
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        //增加
        if (index == undefined) {

            //校验唯一性
        	$scope.capitalAccountSequenceService.findByQuery(function (result) {
                if (result.length > 0) {
                    layer.msg("该机构的该资产单元已设置资金账号顺序", {icon: 2, time: 3000});
                    return false;
                } else {
                	$scope.capitalAccountSequenceService.add(function (result) {                
                        $scope.listEntitys.push(result);
                        $scope.$apply();
                        $scope.find($scope.queryEntity);
                        //关闭窗口
                        $("#capitalAccountSequenceModal").modal("hide");
                        layer.msg("新增成功", {icon: 1, time: 3000});
                    }, entity,$scope.accountGroupEntitys);
                }
            }, entity);
            //修改
        } else {
        	$scope.capitalAccountSequenceService.update(function (result) {
            	result.index = tableIndex;
                $scope.listEntitys.splice(tableIndex-1, 1, result);
                $scope.capitalAccountSequenceTable.cells().every( function () {
                	if((tableIndex-1) == this[0][0].row){
                        if(this[0][0].column == 1){
                            this.data(result.id);
                        }
                    }
                	
                    if((tableIndex-1) == this[0][0].row){
                        if(this[0][0].column == 4){
                            this.data($scope.transParentInvestorOrder(result.parentInvestorOrder));
                        }
                    }
             	});
                $("#capitalAccountSequenceModal").modal("hide");
                layer.msg("修改成功", {icon: 1, time: 3000});
            }, entity,$scope.accountGroupEntitys);
        }
    };
    
    $("body").undelegate("#capitalAccountSequence_dynamic_table_wrapper td .delete-row","click");
    $("body").delegate("#capitalAccountSequence_dynamic_table_wrapper td .delete-row","click",function(){
   	$scope.modalEntity = {};
   	var mytr = $(this).parents("tr");
       var tempArr = $scope.capitalAccountSequenceTable.row(mytr).data();
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
    	layer.confirm('确定删除该资金账号顺序？', {icon: 3}, function (count) {
    		$scope.capitalAccountSequenceService.remove(function(result){
    			layer.close(count);
    	        $scope.find($scope.queryEntity);
    	        $scope.$apply();		
    		},entity.id);
    	});
    };
    
    //定义产品基础信息的固定列头
    $scope.capitalAccountSequence_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "所属机构"},
        {title: "资产单元"}, 
        {title: "资金账号顺序"},
        {title: "分仓算法"},
        {title: "操作员"},
        {title: "操作日期"},
        {title: "操作"}
    ]; 
    
    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.capitalAccountSequenceTable = $('#capitalAccountSequence_dynamic_table').DataTable( {
    		data : $scope.capitalAccountSequenceDataset,
        	columns :$scope.capitalAccountSequence_columns,
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

