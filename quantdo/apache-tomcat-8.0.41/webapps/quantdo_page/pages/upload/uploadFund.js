myapp.controller('uploadFundController', ['$scope', 'Upload','$rootScope', function ($scope, Upload,$rootScope) {
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
    $("[forType='date']").datepicker({
        language: 'zh-CN',
        weekStart: 1,
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        format: 'yyyymmdd'
    });
  $scope.instClientService = new com.quantdo.orgClear.service.instClientService();
  
  $scope.uploadFund_import = isShow("uploadFund_import");
	//初始化机构信息
	$scope.instClientService.findByQuery(function (result) {
	    $scope.instClientlistEntitys = result;
	    $scope.$apply();
	},{});
 
    //机构名称转换
	$scope.transInstClient = function (instClientID) {
	    for(var i = 0;i < $scope.instClientlistEntitys.length; i++){
	        if($scope.instClientlistEntitys[i].instClientID == instClientID){
	  	        return $scope.instClientlistEntitys[i].instClientAbbrName;
	 	    }
	    }
	}
	
//    queryFunds(function (result) {
//        $scope.tradeEntitys = result;
//        $scope.$apply();
//    });
    $scope.startDate = clearConstant.formatDate(new Date());

    // jquery upload
    $("#uploadFundloader").uploadFile({
        url: framework.file.uploadUrl("uploadFundService", "importFund"),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
                if(result.errorFlg != "succ") {                	
                    layer.msg(result.errorMessages,{icon: 2});
                } else {
                	layer.msg("成功导入" + result.succCon +"条数据",{icon: 1});
                	  $scope.find();
//                    queryFunds(function (result) {
//                        $scope.tradeEntitys = result;
//                        $scope.$apply();
//                    });
                }
            });        	

        },
        onSelect: function (files) {
            var settleDate = $("#settleDate").val();
            var fileName = files[0].name;
            if (!fileName.endWith("txt")) {
                jqueryConst.showMsg(2001);
                return false;
            }
            framework.service.request('uploadFundService', 'getDate', settleDate, function (errCode, errMsg, result) {
                if (errCode > 0) {
                    console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                }
            });
            return true;
        }
    });

    //列头
    $scope.product_columns = [
        {title: ""},
        {title: "id",visible:false},
        {title: "所属机构"},
        {title: "资金账号"},
        {title: "上日结算准备金"},
        {title: "上日可用资金"}
    ]; 
    
    // 查询(前台分页)
    $scope.find = function(){
    	$scope.productDataset = [];
    	//更新表格对应的数据集
    	queryFunds(function (result) {
    		var con = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	var tempArr = [(i+1),con[i].id,con[i].brokerageFirmID, con[i].accountID, con[i].preBalance,con[i].preAvailable
                               ];
	            $scope.productDataset.push(tempArr);
            }
            //重新绘表
            $scope.productTable.clear().draw();
            $scope.productTable.rows.add($scope.productDataset).draw();
        });  	
    }
    
   // 初始化
    $scope.find();
 
    
  //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.productTable = $('#uploadFund_dynamic_table').DataTable( {
    		data : $scope.productDataset,
        	columns :$scope.product_columns,
            dom: 'rt<"bottom"iplB>',
            
			buttons: [
			   
			]
        } );
    });
}]);

