myapp.controller('leverageController', function ($scope,$rootScope, $timeout) {
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$scope.leverageService = new com.quantdo.orgClear.service.LeverageService();
	$scope.listEntitys = [];
    $scope.queryEntity = {};
    $scope.modalEntity = {};
    $scope.leverageTypes = clearConstant.leverageTypes;
    $scope.dimensions = [
        { value: '品种', key: '1' },
        { value: '合约', key: '2' }
    ];
	$scope.leverageDataset = [];
	
	// 按钮权限
	 $scope.leverage_query = isShow("leverage_query");
	 $scope.leverage_import = isShow("leverage_import");
	 $scope.leverage_update = isShow("leverage_update");
	 $scope.leverage_delete = isShow("leverage_delete");
	 
	//定义固定列头
    $scope.leverage_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "资金账号/组"},
        {title: "内外盘"},
        {title: "品种"},
        {title: "合约"},
        {title: "杠杆基数"},
		{title: "操作"}
	]
    
    $scope.transLeverageTypes = function(key){
    	for(var i =0;i < $scope.leverageTypes.length;i++){
    		if($scope.leverageTypes[i].key == key){
    			return $scope.leverageTypes[i].text;
    		}
    	}
    }
    
    $scope.leverageService.findLeverageByCondition(function(result){
    	$scope.listEntitys = angular.copy(result);
    	$scope.$apply();
    },{});
    
    $scope.find = function (queryEntity) {
        $scope.listEntitys = [];
        $scope.isQuery = true;
        $scope.leverageService.searchLeverageByCondition(function (result) {
            $scope.listEntitys = angular.copy(result);
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        },queryEntity);
    }; 
    $("body").undelegate("#leverage_dynamic_table_wrapper td .update-row","click");
  //表格修改事件
    $("body").delegate("#leverage_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.leverageTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $timeout(function() {
        	$scope.initUpdateParam($scope.modalEntity,id);
         }, 500);
    });
    $("body").undelegate("#leverage_dynamic_table_wrapper td .delete-row","click");
    //表格删除事件
    $("body").delegate("#leverage_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.leverageTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
       $scope.remove($scope.modalEntity,id);
    });

    // 根据页面条件查询
    $scope.find = function () {  	
    	$scope.isQuery = true;
		$scope.leverageDataset = [];
		$scope.leverageService.searchLeverageByCondition(function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator = "";
				if($scope.leverage_update){
					operator = operator.concat("<a class='update-row' data-toggle='modal' data-target='#leverageModal'>修改</a>");
				}if($scope.leverage_delete){
					operator = operator.concat("<a class='delete-row'>删除</a>");
				}
//				var operator = "<a class='update-row' data-toggle='modal' data-target='#leverageModal'>修改</a><a class='delete-row'>删除</a>";
		    	var tempArr = [(i+1),con[i].id,con[i].accountID ,$scope.transLeverageTypes(con[i].leverageType) ,con[i].productID ,con[i].instrumentID 
		    			    	        ,con[i].leverageBase,operator]
		    	$scope.leverageDataset.push(tempArr); 
			}
			//重新绘表
	        $scope.leverageTable.clear().draw();
	        $scope.leverageTable.rows.add($scope.leverageDataset).draw();
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		},$scope.queryEntity);
    };
    $timeout(function() {
    	$scope.find(); 
     }, 1000);

    
    $scope.dimensionChange = function(dimension){
    	if(dimension == '1'){
    		$scope.isSetInstrument = false;
    		$scope.modalEntity.instrumentID = '';
    	}else{
    		$scope.isSetInstrument = true;
    	}
    };
    
    $scope.save = function (entity) {    	
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        if(entity.leverageBase == 0){
        	layer.msg("杠杆基数必须大于0",{icon: 2});
        	return false;
        }
        //增加
        if (index == undefined) {
        	if(entity.dimension == '2'){
        		$scope.leverageService.findLeverageByCondition(function(record){
            		if(record != null && record.length > 0){
            			layer.msg("记录已存在",{icon: 2});
            		}else{
            			$scope.leverageService.add(function (result) {
                    		if(result != null){
                    			$scope.listEntitys.unshift(result);
                		    	$scope.$apply(); 
                        		layer.msg("新增成功",{icon: 1});
                        		$scope.find();
                                $("#leverageModal").modal("hide");
                    		}else{
                    			layer.msg("新增失败",{icon: 2});
                    		}
                    	},entity);   
            		}
            	},entity);
        	}else{
        		$scope.leverageService.findLeverageByProductID(function(record){
            		if(record != null && record.length > 0){
            			layer.msg("记录已存在",{icon: 2});
            		}else{
            			$scope.leverageService.add(function (result) {
                    		if(result != null){
                    			$scope.listEntitys.unshift(result);
                		    	$scope.$apply(); 
                        		layer.msg("新增成功",{icon: 1});
                        		//$scope.find();
                                $("#leverageModal").modal("hide");
                    		}else{
                    			layer.msg("新增失败",{icon: 2});
                    		}
                    	},entity);   
            		}
            	},entity);
        	}
            //修改
        } else {
        	$scope.leverageService.update(function (result) {
        		if(result != null){
        			result.index = tableIndex;
            		$scope.listEntitys.splice(tableIndex-1, 1, result); 
            		
        			$scope.MemberTable.cells().every( function () {
	                    if((tableIndex-1) == this[0][0].row){
	                        if(this[0][0].column == 2){
	                            this.data(entity.brokerageFirmID);
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 3){
	                            this.data(entity.exchID);
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 4){
	                            this.data(entity.memberID);
	                            $scope.$apply();
	                        }
	                    }

        			});
            		layer.msg("修改成功",{icon: 1});
            		$scope.find();
                    $("#leverageModal").modal("hide");
        		}else{
        			layer.msg("修改失败",{icon: 2});
        		}
        	},entity);  
        }
    };
    
    $scope.remove = function (entity,index) {
        //使用内置Index        
    	layer.confirm('确定删除？', {icon: 3}, function (count) {
	    	$scope.leverageService.remove(function (result) {
	        	$scope.listEntitys.splice(index, 1);
		    	$scope.$apply();
		    	layer.close(count);
		    	$scope.find();
        		layer.msg("删除成功",{icon: 1});
	    	},entity.id);
    	});
    };
    
    $scope.initAddParam = function () {
        $scope.modalEntity = {};
        $scope.isUpdate = false;
        $scope.leverageForm.$setPristine();
     };    
     
     $scope.initUpdateParam = function (entity,index) {         
         $scope.tempEntity = angular.copy(entity);
         $scope.tempEntity.recordIndex = index;
         $scope.modalEntity = angular.copy($scope.tempEntity);
         $scope.leverageForm.$setPristine();
         $scope.isUpdate = true;
         if($scope.modalEntity.instrumentID == '' || $scope.modalEntity.instrumentID == undefined){
        	 $scope.modalEntity.dimension = '1';
         }else{
        	 $scope.modalEntity.dimension = '2';
         }
         $scope.dimensionChange($scope.modalEntity.dimension);
     };
     
   //导入
     $("#leverageFileuploader").uploadFile({
     	  dragdropWidth: 125,
           uploadStr:"Excel导入",
           dragDropStr: "",
           dragDropContainerClass:"",
         url: framework.file.uploadUrl("leverageService", "uploadExcel",[null]),
         fileName: "file",// 名字不能改
         onSuccess: function (files, response, xhr, pd) {
             framework.file.uploadCallback(response,function(errCode,errMsg,result) {
                 if(errCode != 0) {
                     layer.msg(errMsg,{icon: 2});
                 } else {
                 	if(result != null){
                 		if(result.code == '1'){
                   			layer.msg("成功导入"+result.info+"条记录！", {icon: 1, time: 1500});
                   			$scope.leverageService.findLeverageByCondition(function(result){
                   		    	$scope.listEntitys = angular.copy(result);
                   		    	$scope.$apply();
                   		    	$("#leverageUploadModal").modal("hide");
                   		    },{});
                 		}else if(result.code == '0'){
                   			layer.msg(result.info, {icon: 2, time: 2500});
                   		}
     				}else{
     					//导入失败
     					layer.msg(result.errorMes, {icon: 2, time: 2500});
     				}
                 }
                 $("div .ajax-file-upload-container").empty();
             });
         },
         onSelect: function (files) {
             var file = files[0];
             var fileName = file.name;
             var suffix = fileName.substring(fileName.lastIndexOf('.') + 1);
             if(suffix != "xlsx" ){
                 layer.msg('上传文件必须为.xlsx文件格式', {icon: 2}, 2500);
                 return false;
             }
             return true;
         }
     });
     
 	//初始化
     $(document).ready(function() {
	     	//会话列表初始化
	     	$scope.leverageTable = $('#leverage_dynamic_table').DataTable( {
		     		 data : $scope.leverageDataset,
		         	 columns :$scope.leverage_columns,
		             dom: 'rt<"bottom"iplB>',
		             fixedColumns:   {
		                 leftColumns: 0,
		                 rightColumns: 1
		             },
		 			 buttons: []
	         } );
      });
});

