myapp.controller('futuresTradeController', function ($scope, $timeout,$rootScope) {
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
	$scope.futuresTradeService = new com.quantdo.orgClear.service.FuturesTradeService();
	$scope.tradeUserService = new com.quantdo.orgClear.service.TradeUserService();
	$scope.productService = new com.quantdo.orgClear.service.ProductService();
	
	//2、定义页面数据模型
    $scope.queryEntity = {};
    
    $scope.futuresTrade_query = isShow("futuresTrade_query");
    $scope.futuresTrade_uploadExcel = isShow("futuresTrade_uploadExcel");
    $scope.futuresTrade_delete = isShow("futuresTrade_delete");
    
    $scope.queryEntity.beginDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());
    
    $scope.spotContractTypes = clearConstant.spotContractTypes;		// 现货合同类型
    $scope.spotValidateStatus = clearConstant.spotValidateStatus;	// 现货 货、票、点、保、资状态
    $scope.futuresTradeDataset = [];
	$scope.sumBatchAmount = 0;
	$scope.sumDelivAmount = 0;
	
    $scope.tradeDirection = clearConstant.tradeDirection;		// 买卖方向
    $scope.offsetFlag = clearConstant.offsetFlag;               // 开平
	//定义固定列头
    $scope.futuresTrade_columns = [
        {title: "序号"},
        {title: "id",visible:false},
		{title: "交易日期"},
		{title: "合约"},
		{title: "买卖"},
		{title: "开平"},
		{title: "数量"},
		{title: "价格"},
		{title: "交易员"},
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
    
    $("body").undelegate("#futuresTrade_dynamic_table_wrapper td .delete-row","click");
    //表格删除事件
    $("body").delegate("#futuresTrade_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.futuresTradeTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
       $scope.remove($scope.modalEntity,id);
    });

    // 转换
    $scope.transferDirection = function(key){
    	var result = "";
    	for(var x in $scope.tradeDirection){
    		if(key == $scope.tradeDirection[x].key){
    			result = $scope.tradeDirection[x].text; 
    			break;
    		}
    	}
    	return result;
    }
    
    $scope.transferOffsetFlag = function(key){
    	var result = "";
    	for(var x in $scope.offsetFlag){
    		if(key == $scope.offsetFlag[x].key){
    			result = $scope.offsetFlag[x].text; 
    			break;
    		}
    	}
    	return result;
    }
    // 根据页面条件查询
    $scope.find = function () {  
        if($scope.queryEntity.beginDate > $scope.queryEntity.endDate && $scope.queryEntity.endDate != ''){
    		layer.msg('开始日期不能大于结束日期！！', {
				icon : 2
			});
			return false;
    	}   	
    	$scope.isQuery = true;
		$scope.futuresTradeDataset = [];
		$scope.listEntitys = [];
		$scope.sumBatchAmount = 0;
		$scope.sumDelivAmount = 0;
		$scope.futuresTradeService.findByCondition(function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator = $scope.getDeletePermision($scope.futuresTrade_delete);
		    	var tempArr = [(i+1),con[i].id,con[i].tradeDate,con[i].instrumentID,$scope.transferDirection(con[i].direction),$scope.transferOffsetFlag(con[i].offsetFlag),
		    	               parseFloat(con[i].volume).toFixed(2),parseFloat(con[i].price).toFixed(2),con[i].traderID,con[i].operatorID,con[i].operateDate,con[i].operateTime,operator]
		    	$scope.futuresTradeDataset.push(tempArr);
//				$scope.sumBatchAmount += con[i].batchAmount;
//        		$scope.sumDelivAmount += con[i].deliverAmount;
			}
			//重新绘表
	        $scope.futuresTradeTable.clear().draw();
	        $scope.futuresTradeTable.rows.add($scope.futuresTradeDataset).draw();
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
			
		},$scope.queryEntity.instrumentID,$scope.queryEntity.beginDate,$scope.queryEntity.endDate);
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
    		$scope.futuresTradeService.remove(function (){
    			layer.msg("删除成功",{icon: 1});
    			$scope.listEntitys.splice(index, 1);
	    		$scope.sumBatchAmount -= entity.batchAmount;
	    		$scope.sumDelivAmount -= entity.deliverAmount;
	            $timeout(function() {
	                $scope.find();
	            }, 500); 
    			$scope.$apply();
    		}, entity.id);
            layer.close(count);
        });
    };
    
  //导入
    $("#futuresTradeUploader").uploadFile({
    	  dragdropWidth: 125,
          uploadStr:"Excel导入",
          dragDropStr: "",
          showAbort: false,
          dragDropContainerClass:"",
        url: framework.file.uploadUrl("futuresTradeService", "uploadFile", [null]),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
                if(errCode != 0) {
                    layer.msg(errMsg,{icon: 2});
                } else {
                	if(result != null){
                		if(result.errorCode == '0'){
                			layer.msg("成功导入"+result.totalRecord+"条记录！", {icon: 1, time: 1500});
                			 $("#futuresTradeUploadModal").modal("hide");
             	             $timeout(function() {
             	                $scope.find();
             	             }, 1000);
                		}else if(result.errorCode == '1'){
                			layer.msg(result.errorMsg, {icon: 2, time: 3000});
                		}
    				}else{
    					//导入失败
    					layer.msg(result.errorMsg, {icon: 2, time: 1500});
    				}
                }
                $("div .ajax-file-upload-container").empty();
            });
        },
        onSelect: function (files) {
            var file = files[0];
            var fileName = file.name;
            var suffix = fileName.substring(fileName.lastIndexOf('.') + 1);
//            if(suffix != "xls" ){
//                layer.msg('上传文件必须为.xls文件格式', {icon: 2}, 3000);
//                return false;
//            }
            return true;
        }
    });
    
	//初始化
    $(document).ready(function() {
		    	//会话列表初始化
		    	$scope.futuresTradeTable = $('#futuresTrade_dynamic_table').DataTable( {
			    		data : $scope.futuresTradeDataset,
			        	columns :$scope.futuresTrade_columns,
			            dom: 'rt<"bottom"iplB>',
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: [],
						"footerCallback": function () {
						     var api = this.api();
						     $( api.column( 1 ).footer() ).html(parseFloat($scope.sumBatchAmount).toFixed(3));
							 $( api.column( 2 ).footer() ).html(parseFloat($scope.sumDelivAmount).toFixed(3));
							}
		        } );
      });
    
});

