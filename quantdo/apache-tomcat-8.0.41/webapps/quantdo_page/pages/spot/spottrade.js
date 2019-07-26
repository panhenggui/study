myapp.controller('spotTradeController', function ($scope, $timeout,$rootScope) {
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
	//1、实例化服务接口
	//1.1、 实例化客户实时持仓服务接口
	//1.2、公用查询服务接口
	$scope.spotTradeService = new com.quantdo.orgClear.service.SpotTradeService();
	$scope.tradeUserService = new com.quantdo.orgClear.service.TradeUserService();
	$scope.productService = new com.quantdo.orgClear.service.ProductService();
	
	//2、定义页面数据模型
    $scope.queryEntity = {};
    
    $scope.spottrade_query = isShow("spottrade_query");
    $scope.spottrade_uploadExcel = isShow("spottrade_uploadExcel");
    $scope.spottrade_delete = isShow("spottrade_delete");
    
    $scope.queryEntity.beginDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());
    
    $scope.spotContractTypes = clearConstant.spotContractTypes;		// 现货合同类型
    $scope.spotValidateStatus = clearConstant.spotValidateStatus;	// 现货 货、票、点、保、资状态
    $scope.spotTradeDataset = [];
	$scope.sumBatchAmount = 0;
	$scope.sumDelivAmount = 0;
	
	
	//定义固定列头
    $scope.spotTrade_columns = [
        {title: "序号"},
        {title: "id",visible:false},
		{title: "成交日期"},
		{title: "品种"},
		{title: "品牌"},
		{title: "合同类型"},
		{title: "公司"},
		{title: "资产单元"},
		{title: "货"},
		{title: "票"},
		{title: "点"},
		{title: "保"},
		{title: "资"},
		{title: "批次号"},
		{title: "客户名称"},
		{title: "批次数量"},
		{title: "交付数量"},
		{title: "已点价数量"},
		{title: "已保值"},
		{title: "点价价格"},
		{title: "升贴水"},
		{title: "最终价"},
		{title: "批次金额"},
		{title: "到账金额"},
		{title: "操作人"},
		{title: "操作日期"},
		{title: "操作时间"},
		{title: "操作"}
	]
    
    $scope.listEntitys = [];
    $scope.listEntity = {};
    $scope.tmpEntity = {};
    $scope.ModalEntity = {};
    
    $scope.sumBatchAmount = 0;
    $scope.sumDelivAmount = 0;
    
    /*// 初始化查询
    $scope.spotTradeService.findByQuery(function(result){
    	$scope.listEntitys = result;
    	$scope.sumBatchAmount = 0;
        $scope.sumDelivAmount = 0;
    	angular.forEach(result,function(entity,index,list){
    		$scope.sumBatchAmount += entity.batchAmount;
    		$scope.sumDelivAmount += entity.deliverAmount;
    	});
    	$scope.$apply();
    },{},'','');*/
    $scope.instClientID =null;
    queryInstClientID(function(result){
    	if(result != undefined){
    		$scope.instClientID = result;
    		  //查询资产单元
    		findBySubCapitalAccountInfo({"instClientID":$scope.instClientID}, function(result){
    			$scope.queryCapitalAccounts = angular.copy(result);
    			$scope.$apply();
    		});
    	}else {
    		findBySubCapitalAccountInfo({}, function(result){
    			$scope.queryCapitalAccounts = angular.copy(result);
    			$scope.$apply();
    		});
    	}
    });
  
    
    // 所有品种
    $scope.productService.getAllProductEntity(function(result){
    	$scope.products = result;
    	$scope.$apply();
    });
    
    $scope.transSpotContractType = function (key){
    	for(var i = 0;i < $scope.spotContractTypes.length;i++){
			if($scope.spotContractTypes[i].key == key){
				return $scope.spotContractTypes[i].text;
			}
		}
    }
    
    $scope.transSpotValidateStatus = function (key){
    	var result = "";
    	if(key!=null&&key!=undefined&&key!=""){
    		for(var i = 0;i < $scope.spotValidateStatus.length;i++){
    			if($scope.spotValidateStatus[i].key == key){
    				result = $scope.spotValidateStatus[i].text;
    			}
    		}
    	}
    	return result;
    }
    
    // 查询
/*    $scope.tmpQuery = {};
    $scope.find = function (queryEntity)  {
    	$scope.listEntitys = [];
    	$scope.sumBatchAmount = 0;
        $scope.sumDelivAmount = 0;
    	$scope.tmpQuery = angular.copy(queryEntity);
    	
        if(queryEntity.beginDate > queryEntity.endDate && queryEntity.endDate != ''){
    		layer.msg('开始日期不能大于结束日期！！', {
				icon : 2
			});
			return false;
    	}
        
        $scope.spotTradeService.findByQuery(function(result){
        	$scope.listEntitys = result;
        	angular.forEach(result,function(entity,index,list){
        		$scope.sumBatchAmount += entity.batchAmount;
        		$scope.sumDelivAmount += entity.deliverAmount;
        	});
        	$scope.$apply();
        },$scope.tmpQuery,$scope.tmpQuery.beginDate,$scope.tmpQuery.endDate);
        
    };*/
    $("body").undelegate("#spotTrade_dynamic_table_wrapper td .delete-row","click");
    //表格删除事件
    $("body").delegate("#spotTrade_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.spotTradeTable.row(mytr).data();
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
		$scope.spotTradeDataset = [];
		$scope.listEntitys = [];
		$scope.sumBatchAmount = 0;
		$scope.sumDelivAmount = 0;
		$scope.spotTradeService.findByQuery(function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator = $scope.getDeletePermision($scope.spottrade_delete);
		    	var tempArr = [(i+1),con[i].id,con[i].tradeDate,con[i].productName,con[i].brand,$scope.transSpotContractType(con[i].contractType),con[i].companyTitle
		    	               ,con[i].trader,$scope.transSpotValidateStatus(con[i].goodsStatus),$scope.transSpotValidateStatus(con[i].ticketStatus)
		    	               ,$scope.transSpotValidateStatus(con[i].tallyStatus),$scope.transSpotValidateStatus(con[i].hedgeStatus),$scope.transSpotValidateStatus(con[i].capitalStatus)
		    	               ,con[i].batchNumber,con[i].customerName,con[i].batchAmount,con[i].deliverAmount,con[i].pricingAmount,con[i].alreadyHedge
		    	               ,con[i].pricingPrice,con[i].premiumDiscount,con[i].finalPrice,con[i].batchPrice,con[i].arrivalPrice
		    	               ,con[i].operatorID,con[i].operateDate,con[i].operateTime,operator]
		    	$scope.spotTradeDataset.push(tempArr);
				$scope.sumBatchAmount += con[i].batchAmount;
        		$scope.sumDelivAmount += con[i].deliverAmount;
			}
			//重新绘表
	        $scope.spotTradeTable.clear().draw();
	        $scope.spotTradeTable.rows.add($scope.spotTradeDataset).draw();
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
    		$scope.spotTradeService.remove(function (result){
    			if(result == 1){
    				layer.msg("删除成功",{icon: 1});
        			$scope.listEntitys.splice(index, 1);
    	    		$scope.sumBatchAmount -= entity.batchAmount;
    	    		$scope.sumDelivAmount -= entity.deliverAmount;
    	            $timeout(function() {
    	                $scope.find();
    	            }, 500); 
        			$scope.$apply();
    			}else{
    				layer.msg("不可删除10天前的记录",{icon: 2});
    			}
    			
    		}, entity.id);
            layer.close(count);
        });
    };
    
  //导入
    $("#spottradeUploader").uploadFile({
    	  dragdropWidth: 125,
          uploadStr:"Excel导入",
          dragDropStr: "",
          showAbort: false,
          dragDropContainerClass:"",
        url: framework.file.uploadUrl("spotTradeService", "uploadExcel", [null]),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
                if(errCode != 0) {
                    layer.msg(errMsg,{icon: 2});
                } else {
                	if(result != null){
                		if(result.code == '1'){
                			layer.msg("成功导入"+result.info+"条记录！", {icon: 1, time: 1500});
                		    $scope.spotTradeService.findByQuery(function(result){
                	            $scope.listEntitys = result;
                	            $scope.sumBatchAmount = 0;
                	            $scope.sumDelivAmount = 0;
                	        	angular.forEach(result,function(entity,index,list){
                	        		$scope.sumBatchAmount += entity.batchAmount;
                	        		$scope.sumDelivAmount += entity.deliverAmount;
                	        	});
                	            $scope.$apply();
                	            $("#spottradeUploadModal").modal("hide");
                	            $timeout(function() {
                	                $scope.find();
                	            }, 1000);
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
		    	$scope.spotTradeTable = $('#spotTrade_dynamic_table').DataTable( {
			    		data : $scope.spotTradeDataset,
			        	columns :$scope.spotTrade_columns,
			            dom: 'rt<"bottom"iplB>',
			       /*     fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },*/
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: [],
						"footerCallback": function () {
						     var api = this.api();
						     $( api.column( 15 ).footer() ).html(parseFloat($scope.sumBatchAmount).toFixed(3));
							 $( api.column( 16 ).footer() ).html(parseFloat($scope.sumDelivAmount).toFixed(3));
							/* 
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

