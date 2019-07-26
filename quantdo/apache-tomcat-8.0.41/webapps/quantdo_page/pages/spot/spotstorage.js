myapp.controller('spotStorageController', function ($scope, $timeout,$rootScope) {
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});	
    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	//1、实例化服务接口
	//1.1、 实例化客户实时持仓服务接口
	//1.2、公用查询服务接口
	$scope.spotStorageService = new com.quantdo.orgClear.service.SpotStorageService();
	$scope.tradeUserService = new com.quantdo.orgClear.service.TradeUserService();
	$scope.productService = new com.quantdo.orgClear.service.ProductService();
	
    $scope.spotstorage_query = isShow("spotstorage_query");
    $scope.spotstorage_uploadExcel = isShow("spotstorage_uploadExcel");
    $scope.spotstorage_delete = isShow("spotstorage_delete");
    
	//2、定义页面数据模型
    $scope.queryEntity = {};
    
    $scope.queryEntity.beginDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());
    
    $scope.spotStorageStatus = clearConstant.spotStorageStatus;		// 状态
    $scope.spotValidateStatus = clearConstant.spotValidateStatus;	// 现货 货、票、点、保、资状态
    
    $scope.listEntitys = [];
    $scope.listEntity = {};
    $scope.sumOrderAmount = 0;
    $scope.sumFactoryNetAmount = 0;
    $scope.spotStorageDataset = [];
	
	
	//定义固定列头
    $scope.spotStorage_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "品种"},
        {title: "品牌"},
        {title: "规格"},
        {title: "品级"},
        {title: "仓库名称"},
        {title: "状态"},
        {title: "项目名称"},
        {title: "订单号"},
        {title: "件数"},
        {title: "出厂净量"},
        {title: "入库日期"},
        {title: "供应商"},
        {title: "交易员"},
        {title: "公司"},
        {title: "票"},
        {title: "操作人"},
        {title: "操作日期"},
        {title: "操作时间"},
        {title: "操作"}
	]
    
    /*// 初始化查询
    $scope.spotStorageService.findByQuery(function(result){
    	$scope.sumOrderAmount = 0;
    	$scope.sumFactoryNetAmount = 0;
    	$scope.listEntitys = result;
    	angular.forEach(result,function(entity,index,list){
    		$scope.sumFactoryNetAmount += entity.factoryNetAmount;
    		$scope.sumOrderAmount += entity.orderAmount;
    	});
    	$scope.$apply();
    },{},'','');*/
    
    // 有效交易员
    $scope.tradeUserService.findActiveTradeUserByRole(function(result){
    	$scope.traders = result;
    	$scope.$apply();
    },'9');
    
    // 所有品种
    $scope.productService.getAllProductEntity(function(result){
    	$scope.products = result;
    	$scope.$apply();
    });
    
    $scope.transSpotStorageStatus = function (key){
    	for(var i = 0;i < $scope.spotStorageStatus.length;i++){
			if($scope.spotStorageStatus[i].key == key){
				return $scope.spotStorageStatus[i].text;
			}
		}
    }
    
    $scope.transSpotValidateStatus = function (key){
    	for(var i = 0;i < $scope.spotValidateStatus.length;i++){
			if($scope.spotValidateStatus[i].key == key){
				return $scope.spotValidateStatus[i].text;
			}
		}
    }
    
    // 查询
   /* $scope.tmpQuery = {};
    $scope.find = function (queryEntity)  {
    	$scope.sumOrderAmount = 0;
        $scope.sumFactoryNetAmount = 0;
    	$scope.listEntitys = [];
    	$scope.tmpQuery = angular.copy(queryEntity);
    	
        if(queryEntity.beginDate > queryEntity.endDate){
    		layer.msg('开始日期不能大于结束日期！！', {
				icon : 2
			});
			return false;
    	}
        
        $scope.spotStorageService.findByQuery(function(result){
        	$scope.listEntitys = result;
        	angular.forEach(result,function(entity,index,list){
        		$scope.sumFactoryNetAmount += entity.factoryNetAmount;
        		$scope.sumOrderAmount += entity.orderAmount;
        	});
        	$scope.$apply();
        },$scope.tmpQuery,$scope.tmpQuery.beginDate,$scope.tmpQuery.endDate);
        
    };*/
    $("body").undelegate("#spotStorage_dynamic_table_wrapper td .delete-row","click");
  //表格删除事件
    $("body").delegate("#spotStorage_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.spotStorageTable.row(mytr).data();
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
        if($scope.queryEntity.beginDate > $scope.queryEntity.endDate && $scope.queryEntity.endDate != ''){
    		layer.msg('开始日期不能大于结束日期！！', {
				icon : 2
			});
			return false;
    	}   	
    	$scope.isQuery = true;
		$scope.spotStorageDataset = [];
		$scope.listEntitys = [];
		$scope.sumOrderAmount = 0;
		$scope.sumFactoryNetAmount = 0;
		$scope.spotStorageService.findByQuery(function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator = $scope.getDeletePermision($scope.spotstorage_delete);
		    	var tempArr = [(i+1),con[i].id,con[i].productName,con[i].brand,con[i].specification,con[i].grade,con[i].warehouseName
		    	               ,$scope.transSpotStorageStatus(con[i].status),con[i].projectName,con[i].orderNumber,
		    	               con[i].orderAmount,con[i].factoryNetAmount,con[i].storageDate,con[i].supplyName,con[i].trader,
		    	               con[i].companyTitle,$scope.transSpotValidateStatus(con[i].ticketStatus),con[i].operatorID,
		    	               con[i].operateDate,con[i].operateTime,operator]
		    	$scope.spotStorageDataset.push(tempArr);
				$scope.sumOrderAmount += con[i].orderAmount;
        		$scope.sumFactoryNetAmount += con[i].factoryNetAmount;
			}
			//重新绘表
	        $scope.spotStorageTable.clear().draw();
	        $scope.spotStorageTable.rows.add($scope.spotStorageDataset).draw();
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
			
		},$scope.queryEntity,$scope.queryEntity.beginDate,$scope.queryEntity.endDate);
    };
    $timeout(function() {
        $scope.find();
    }, 1000); 
    
    //获取删除权限
    $scope.getDeletePermision = function(flag){
     	  var result = "";
     	  if(flag){
     		  result = "<a class='delete-row' >删除</a>";
     	  }
     	  return result;
    }
    
    //删除
    $scope.remove = function (entity, index) {
		//使用内置Index
    	layer.confirm('确定删除该条记录？', {icon: 3}, function (count) {
    		$scope.spotStorageService.remove(function (){
    			layer.msg("删除成功",{icon: 1});
    			$scope.listEntitys.splice(index, 1);
    			$scope.sumFactoryNetAmount -= entity.factoryNetAmount;
    			$scope.sumOrderAmount -= entity.orderAmount;
	            $timeout(function() {
	                $scope.find();
	            }, 500); 
    			$scope.$apply();
    		}, entity.id);
            layer.close(count);
        });
    };
    
  //导入
    $("#spotstorageUploader").uploadFile({
    	  dragdropWidth: 125,
          uploadStr:"Excel导入",
          dragDropStr: "",
          showAbort: false,
          dragDropContainerClass:"",
        url: framework.file.uploadUrl("spotStorageService", "uploadExcel", [null]),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
                if(errCode != 0) {
                    layer.msg(errMsg,{icon: 2});
                } else {
                	if(result != null){
                		if(result.code == '1'){
                			layer.msg("成功导入"+result.info+"条记录！", {icon: 1, time: 1500});
                		    $scope.spotStorageService.findByQuery(function(result){
                	            $scope.listEntitys = result;
                	            $scope.sumFactoryNetAmount = 0;
                	            $scope.sumOrderAmount = 0;
                	        	angular.forEach(result,function(entity,index,list){
                	        		$scope.sumFactoryNetAmount += entity.factoryNetAmount;
                	        		$scope.sumOrderAmount += entity.orderAmount;
                	        	});
                	            $timeout(function() {
                	                $scope.find();
                	            }, 500); 
                	            $scope.$apply();
                	            $("#spotstorageUploadModal").modal("hide");
                		    },{},'','');
                		}else if(result.code == '0'){
                			layer.msg(result.info, {icon: 2, time: 3000});
                		}
    				}else{
    					//导入失败
    					layer.msg(result.errorMes, {icon: 2, time: 1500});
    				}
                }
                $("div .ajax-file-upload-container").empty();
            });
        },
        onSelect: function (files) {
            var file = files[0];
            var fileName = file.name;
            var suffix = fileName.substring(fileName.lastIndexOf('.') + 1);
            if(suffix != "xls" ){
                layer.msg('上传文件必须为.xls文件格式', {icon: 2}, 3000);
                return false;
            }
            return true;
        }
    });
    
	//初始化
    $(document).ready(function() {
		    	//会话列表初始化
		    	$scope.spotStorageTable = $('#spotStorage_dynamic_table').DataTable( {
		    		
		    		data : $scope.spotStorageDataset,
		        	columns :$scope.spotStorage_columns,
		            dom: 'rt<"bottom"iplB>',
		            fixedColumns:   {
		                leftColumns: 0,
		                rightColumns: 1
		            },
					buttons: [
					],
						"footerCallback": function () {
						     var api = this.api();
						     $( api.column( 10 ).footer() ).html(parseFloat($scope.sumOrderAmount).toFixed(2));
							 $( api.column( 11).footer() ).html(parseFloat($scope.sumFactoryNetAmount).toFixed(4));
							 
							/*  				$scope.sumOrderAmount += con[i].orderAmount;
        		$scope.sumFactoryNetAmount += con[i].factoryNetAmount;
						     totalComOperClientPos($scope.tmpQuery, function(retrunData){
									if(retrunData != null && retrunData != undefined){
										$( api.column( 14 ).footer() ).html(parseFloat(retrunData.sumBatchAmount).toFixed(3));
										$( api.column( 15 ).footer() ).html(parseFloat(retrunData.sumDelivAmount).toFixed(3));
									}else{
										$( api.column( 14 ).footer() ).html(0.000);
										$( api.column( 15 ).footer() ).html(0.000);	
									}
								});*/

							}
		        } );
      });
    
});

