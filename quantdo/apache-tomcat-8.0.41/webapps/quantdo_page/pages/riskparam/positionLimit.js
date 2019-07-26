myapp.controller('PositionLimitController', function ($scope,$timeout,$rootScope) {
	//调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
	$scope.positionLimitService = new com.quantdo.orgClear.service.PositionLimitService();
	$scope.queryEntity = {};//查询条件
	$scope.isInstClient = true;//无论是查询条件，还是modal框，机构都是默认为当前机构，不可修改
	$scope.instClients = [];//机构下拉框数据
	$scope.exchangeDatas = {};//交易所
	$scope.ModalEntity = {};//modal数据
	$scope.positionLimit_query  = isShow("positionLimit_query");
	$scope.positionLimit_add  = isShow("positionLimit_add");
	
	$scope.productTypes = [
		{text: '全部类别', key: '0'},
	    {text: '期货', key: '1'},
	    {text: '期权', key: '2'}
	];
	
	//初始化交易所信息并默人选中第一个
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
        $scope.$apply();
    });
    $scope.transProductTypes = function(productType){
    	for(var i=0;i<$scope.productTypes.length;i++){
    		if($scope.productTypes[i].key == productType){
    			return $scope.productTypes[i].text;
    		}
    	}
    };
    $scope.transNull = function(key){
    	if(key == null){
    		key = "";
    	}
    	return key;
    };
    
    $scope.isFour = true;
    $scope.changeExchID = function(exchID){
    	if(exchID != "CFFEX" && exchID != "SHFE" && exchID != "DCE" && exchID != "CZCE"){
    		$scope.isFour = false;
    		$scope.ModalEntity.productType = $scope.productTypes[0].key;
    	}else{
    		$scope.isFour = true;
    	}
    }

    // 限仓表列头
   	$scope.positionLimitTable_column = [
   		{title:"序号"},
   	    {title:"id",visible:false},
   	    {"title":"所属机构"},
   	   	{"title":"交易所"},
   	    {"title":"品种/合约"},
   	   	{"title":"合约类别"},
   	   	{"title":"合约最大买持仓量"},
   	   	{"title":"合约最大卖持仓量"},
   	   	{"title":"操作员"},
   	   	{"title":"操作日期"},
   	   	{"title":"操作"}
   	];
	
	/*******************生成表格，数据查询************************/
   	$(document).ready(function() {
	    //会话列表初始化
	    $scope.positionLimitTable = $('#positionLimit_dynamic_table').DataTable( {
	    	data : $scope.positionLimitDataset,
	       	columns :$scope.positionLimitTable_column,
	        dom: 'rt<"bottom"iplB>',
	        fixedColumns:   {
	            leftColumns: 0,
	            rightColumns: 1
	        },
			buttons: []
	    });
	});

	//根据页面条件查询
	$scope.find = function (queryEntity) {  	
		$scope.isQuery = true;
		$scope.positionLimitDataset = [];
		$scope.listEntitys = [];
		//根据指定主键查询
		$scope.positionLimitService.query(queryEntity,function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operate1 = $scope.getUpdate(isShow("positionLimit_update"));
				var operate2 = $scope.getDelete(isShow("positionLimit_delete")); 
				var index = i+1;
				var tempArr = [index,con[i].id,$scope.transInstClientID(con[i].instClientID),con[i].exchID,con[i].instrumentID,$scope.transProductTypes(con[i].productType),con[i].maxLongPosition,con[i].maxShortPosition,con[i].operatorID,con[i].operateDate,operate1+operate2]
				$scope.positionLimitDataset .push(tempArr);
				con[i].index = index;
	    	
			}
		$scope.listEntitys = con;
		//重新绘表
	    $scope.positionLimitTable.clear().draw();
        $scope.positionLimitTable.rows.add($scope.positionLimitDataset).draw();
		$scope.$apply();
		$timeout(function() {
           $scope.isQuery = false;
        }, 1000);
		});
	};
	
	$scope.transInstClientID = function(instClientID){
		for(var i=0;i<$scope.instClients.length;i++){
			if($scope.instClients[i].instClientID == instClientID){
				return $scope.instClients[i].instClientAbbrName;
			}
		}
	};
	/***************下拉框数据初始化*****************/
	/*//机构（默认是当前机构，而且此页面只有机构用户可以使用（ps:项目一般不靠谱，估计以后要改成支持多机构））
	$scope.positionLimitService.findInstClient(function(result){
		$scope.instClients = [];
		$scope.isInstClient = false;
		if(result && result.length>0){
			$scope.instClients = result;
			if(result.length==1){
				$scope.queryEntity.instClientID = $scope.instClients[0].instClientID;
				$scope.isInstClient = true;
			}
			$scope.$apply();
		}
		});*/
	
	  $scope.instClients = [];
	  getInstClientQueryConditionList(function(result){
	    	$scope.instClients = angular.copy(result);
	    	if($scope.instClients.length > 1){
	    		$scope.queryEntity.instClientID = "";
	    	}else{
	    		$scope.queryEntity.instClientID = $scope.instClients[0].instClientID;
	    	}
	    	$scope.$apply();
	    	$timeout(function() {
	    		$scope.find($scope.queryEntity);
	    	}, 500);
	  });
	    
	  queryInstClientID(function(result){
	    	if(result != undefined){
	    		$scope.isInstClient = true;
	    	}else{
	    		$scope.isInstClient = false;
	    	}
	  });
	
	/*******************新增功能初始化数据**************************/
	//点击新增
	$scope.newAdd = function(){
		$scope.isUpdate = false;
		$scope.isFour = true;
		$scope.ModalEntity = {};
		$scope.ModalEntity.instClientID = $scope.instClients[0].instClientID;
     	$scope.ModalEntity.exchID = $scope.exchangeDatas[0].exchID;
     	if($scope.ModalEntity.exchID != "CFFEX" && $scope.ModalEntity.exchID != "SHFE" && 
        	$scope.ModalEntity.exchID != "DCE" && $scope.ModalEntity.exchID != "CZCE"){
    		$scope.isFour = false;
    		$scope.ModalEntity.productType = $scope.productTypes[0].key;
    	}else{
    		$scope.isFour = true;
    	}
     	$scope.ModalEntity.instrumentID = "";
     	$scope.ModalEntity.productType = $scope.productTypes[0].key;
     	$scope.ModalEntity.maxLongPosition = "";
     	$scope.ModalEntity.maxShortPosition = "";
     	$scope.ModalEntity.id = null;
        formValidateReset();
	}
	
	//点击修改
	 $scope.getUpdate = function(flag){
	    	var result = "";
	    	if(flag){
	    		result = "<a class='update-row' data-toggle='modal' >修改</a>"; 
	    	}
	    	return result;
	    }

	//表格修改事件
	    $("body").undelegate("#positionLimit_dynamic_table_wrapper td .update-row","click");
	    $("body").delegate("#positionLimit_dynamic_table_wrapper td .update-row","click",function(){
	    	$scope.ModalEntity = {};
	    	var mytr = $(this).parents("tr");
	        var tempArr = $scope.positionLimitTable.row(mytr).data();
	        var id = tempArr[1];
	        for(var i = 0;i<$scope.listEntitys.length;i++){
	        	if(id==$scope.listEntitys[i].id){
	        		$scope.ModalEntity = $scope.listEntitys[i];
	        	}
	        }
	        $scope.initUpdateParam(id,$scope.ModalEntity);
	        });


	    //修改
	    $scope.initUpdateParam = function (index, entity) {
	    	$scope.isUpdate = true;
	    	$scope.ModalEntity = {};
	        $scope.ModalEntity = angular.copy(entity);
	        $scope.ModalEntity.recordIndex = index;
	        formValidateReset();
	        //隐藏不需要显示的字段
	    	$timeout(function() {
    			$("#positionLimitModal").modal("show");
    		},800);
            $timeout(function() {
            	document.getElementById("maxLongPosition").focus();
              }, 500);
	        $scope.$apply();
	    };

	  //重置表单验证信息
	    function formValidateReset() {
	    	$scope.myForm.instrumentID.$setPristine();
	        $scope.myForm.maxLongPosition.$setPristine();
	        $scope.myForm.maxShortPosition.$setPristine();
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
	        if((entity.maxLongPosition == undefined || entity.maxLongPosition == "") &&　
	        	(entity.maxShortPosition == undefined || entity.maxShortPosition == "")){
	        	layer.msg("买卖最大持仓不能同时为空",{icon: 2});
	        	return false;
	        }
	        entity.maxLongPosition = $scope.transBlank(entity.maxLongPosition);
	        entity.maxShortPosition = $scope.transBlank(entity.maxShortPosition);
	        var tmpEntity = angular.copy(entity);
	        tmpEntity.maxLongPosition = entity.maxLongPosition;
	        tmpEntity.maxShortPosition = entity.maxShortPosition;
	        //增加
	        if (index == undefined) {
	        	$scope.positionLimitService.checkInstrumentID(function(result) {
	        		if(result == "NO"){
	        			layer.msg("该交易所下无该品种/合约代码", {icon: 2, time: 3000});
	        			return false;
	        		}else if(result == "YES"){
	        				//校验唯一性
		        			$scope.positionLimitService.check(tmpEntity,function (result) {
		        				if (result.length > 0) {
		        					layer.msg("该交易所下该品种的该合约类别已有限仓设置", {icon: 2, time: 3000});
		        					return false;
		        				} else {
		        					$scope.positionLimitService.add(tmpEntity,function (result) {                
		        					$scope.listEntitys.push(result);
		        					$scope.$apply();
		        					$scope.find($scope.queryEntity);
		        					//关闭窗口
		        					$("#positionLimitModal").modal("hide");
		        					layer.msg("新增成功", {icon: 1, time: 3000});
		        					});
		        				}
		        			});
    				}else{
    					if(result == tmpEntity.productType){
	        				//校验唯一性
		        			$scope.positionLimitService.check(tmpEntity,function (result) {
		        				if (result.length > 0) {
		        					layer.msg("该交易所下该品种的该合约类别已有限仓设置", {icon: 2, time: 3000});
		        					return false;
		        				} else {
		        					$scope.positionLimitService.add(tmpEntity,function (result) {                
		        					$scope.listEntitys.push(result);
		        					$scope.$apply();
		        					$scope.find($scope.queryEntity);
		        					//关闭窗口
		        					$("#positionLimitModal").modal("hide");
		        					layer.msg("新增成功", {icon: 1, time: 3000});
		        					});
		        				}
		        			});
	        			}else{
	        				layer.msg("该合约类型不匹配", {icon: 2, time: 3000});
		        			return false;
	        			}
    				}
	        	},tmpEntity);
	            //修改
	        } else {
	        	$scope.positionLimitService.update(tmpEntity,function (result) {
	            	result.index = tableIndex;
	                $scope.listEntitys.splice(tableIndex-1, 1, result);
	                $scope.positionLimitTable.cells().every( function () {
	                    if((tableIndex-1) == this[0][0].row){
	                        if(this[0][0].column == 6){
	                        	if(result.maxLongPosition == null){
	                        		var maxLongPosition = "";
	                        	}else{
	                        		var maxLongPosition = $scope.transNull(result.maxLongPosition);
	                        	}
	                            this.data(maxLongPosition);
	                        }
	                        if(this[0][0].column == 7){
	                        	if(result.maxShortPosition == null){
	                        		var maxShortPosition = "";
	                        	}else{
	                        		var maxShortPosition = $scope.transNull(result.maxShortPosition);
	                        	}
	                            this.data(maxShortPosition);
	                            $scope.$apply();
	                        }
	                    }
	             	});
	                $("#positionLimitModal").modal("hide");
	                layer.msg("修改成功", {icon: 1, time: 3000});
	            });
	        }
	    };
	    
    
   //点击删除
   $scope.getDelete = function(flag){
    	var result = "";
    	if(flag){
    		result = "<a class='delete-row'>删除</a>";
    	}
    	return result;
    }


   //表格删除事件
        $("body").undelegate("#positionLimit_dynamic_table_wrapper td .delete-row","click");
        $("body").delegate("#positionLimit_dynamic_table_wrapper td .delete-row","click",function(){
        	var mytr = $(this).parents("tr");
            var tempArr = $scope.positionLimitTable.row(mytr).data();
            var id = tempArr[1];
            for(var i = 0;i<$scope.listEntitys.length;i++){
            	if(id==$scope.listEntitys[i].id){
            		$scope.ModalEntity = $scope.listEntitys[i];
            	}
            }
           $scope.remove(id,$scope.ModalEntity);
        });



        //删除
       $scope.remove = function (index, entity) {
        	layer.confirm('确定删除该限仓设置？', {icon: 3}, function (count) {
        		$scope.positionLimitService.del(function(result){
        			layer.close(count);
        	        $scope.find($scope.queryEntity);
        	        $scope.$apply();		
        		},entity);
        	});
        }
        
});

