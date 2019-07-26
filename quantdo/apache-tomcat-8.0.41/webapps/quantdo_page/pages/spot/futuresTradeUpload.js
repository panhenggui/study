myapp.controller('futuresTradeUploadController', function ($scope, $timeout,$rootScope) {
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
	$scope.futuresTradeUploadService = new com.quantdo.orgClear.service.FuturesTradeUploadService();
	
	//2、定义页面数据模型
    $scope.queryEntity = {};
    
    $scope.futuresTradeUpload_query = isShow("futuresTradeUpload_query");
    $scope.futuresTradeUpload_delete = isShow("futuresTradeUpload_delete");
    $scope.futuresTradeUpload_uploadExcel = isShow("futuresTradeUpload_uploadExcel");
    
    $scope.queryEntity.beginDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());
    
    $scope.directions = clearConstant.tradeDirection;	//买卖
    $scope.currencys = clearConstant.currencys;	//币种
    
	//定义固定列头
    $scope.futuresTradeUpload_columns = [
        {title: "序号"},
        {title: "id",visible:false},
		{title: "资产单元"},
		{title: "交易日期"},
		{title: "成交单号"},
		{title: "交易所代码"},
		{title: "品种代码"},
		{title: "买卖方向"},
		{title: "交易数量"},
		{title: "交易单位"},
		{title: "交易价格"},
		{title: "币种"},
		{title: "到期日"},
		{title: "操作"}
	];
    $scope.listEntitys = [];
   
    $scope.exchangeDatas = {};
    $scope.accountDatas = {};
    
    //初始化资产单元信息
    getInstClientQueryConditionList(function(result){
    	var instClientID = result[0].instClientID;
    	getAllTraderEntity(function (res) {
        	$scope.accountDatas = res;
    		$scope.$apply();
        },{instClientID:instClientID});
    });
    
    
    //初始化交易所信息
	getAllExchanges(function (result) {
	    $scope.exchangeDatas = result;
	    $scope.$apply();
	});
	
	//初始化品种信息
	getAllProductEntity(function (result) {
        $scope.queryProducts = result;
        $scope.$apply();
    });
    
    //交易所,品种类别级联查询品种代码
    $scope.changeProductID = function(){
    	var entity = $scope.queryEntity;
        //根据交易所ID和品种类别查询产品信息
        getProductByExchID(function (result) {
        	$scope.queryProducts = [];
            if(result !=undefined && result.length>0){
                $scope.queryProducts = result;
                $scope.$apply();
            }
        }, {'exchID': entity.exchID, 'productID': '',  'productStatus': ''});
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
		$scope.futuresTradeUploadDataset = [];
		$scope.listEntitys = [];
		$scope.futuresTradeUploadService.findByCondition(function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				operate = $scope.getDeletePermision($scope.futuresTradeUpload_delete);
		    	var tempArr = [(i+1),con[i].id,con[i].accountID,con[i].tradeDate,con[i].dealID,con[i].exchID,con[i].productID,$scope.transDirection(con[i].direction),con[i].volume,
		    	              con[i].unit,con[i].price.toFixed(2),$scope.transCurrencys(con[i].currency),con[i].prompt,operate]
		    	$scope.futuresTradeUploadDataset.push(tempArr);
			}
			//重新绘表
	        $scope.futuresTradeUploadTable.clear().draw();
	        $scope.futuresTradeUploadTable.rows.add($scope.futuresTradeUploadDataset).draw();
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
			
		},$scope.queryEntity);
    };
    
    $timeout(function() {
    	$scope.find();
    }, 1000);
    
    //转换买卖方向
    $scope.transDirection = function (direction){
    	for(var i = 0;i < $scope.directions.length;i++){
			if($scope.directions[i].key == direction){
				return $scope.directions[i].text;
			}
		}
    }
    
    //转换买卖方向
    $scope.transCurrencys = function (currency){
    	for(var i = 0;i < $scope.currencys.length;i++){
			if($scope.currencys[i].key == currency){
				return $scope.currencys[i].text;
			}
		}
    }
    
    //获取删除权限
    $scope.getDeletePermision = function(flag){
     	  var result = "";
     	  if(flag){
     		  result = "<a class='delete-row'>删除</a>";
     	  }
     	  return result;
    }
    
    $("body").undelegate("#futuresTradeUpload_dynamic_table td .delete-row","click");
    //表格中删除的单击事件
    $("body").delegate("#futuresTradeUpload_dynamic_table td .delete-row","click",function(){
		var mytr = $(this).parents("tr");
	    var tempArr = $scope.futuresTradeUploadTable.row(mytr).data();
	    var tradeDate = tempArr[3];
	    var dealID = tempArr[4];
	    layer.confirm('确定删除该成交信息？', {icon: 3}, function (count) {
	    	$scope.futuresTradeUploadService.remove(function (result) {
	    		if(result == 1){
	    			layer.msg("该成交信息删除成功!", {icon : 1,time : 2000});
		        	$scope.find();
	    		}else{
	    			layer.msg("不可删除10天前的成交信息", {icon : 2,time : 2000});
	    		}
	        	
	    	}, tradeDate, dealID);  
    	});
    });
    
    //导入
    $("#futuresTradeUploadUploader").uploadFile({
        url: framework.file.uploadUrl("futuresTradeUploadService", "uploadFile"),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
            	if(result.errorFlg != "succ") {                	
                    layer.msg(result.errorMessages,{icon: 2});
                } else {
                	layer.msg("成功导入" + result.succCon +"条数据",{icon: 1});
                	$scope.find();
                }
            	$("#futuresTradeUploadUploadModal").modal("hide");
            });                 
        },
        onSelect: function (files) {
            var fileName = files[0].name;
            return true;
        }
    });
    
    
	//初始化
    $(document).ready(function() {
    	//会话列表初始化
		$scope.futuresTradeUploadTable = $('#futuresTradeUpload_dynamic_table').DataTable( {
			data : $scope.futuresTradeUploadDataset,
			columns :$scope.futuresTradeUpload_columns,
			dom: 'rt<"bottom"iplB>',
			buttons: [],
		});
     });
});

