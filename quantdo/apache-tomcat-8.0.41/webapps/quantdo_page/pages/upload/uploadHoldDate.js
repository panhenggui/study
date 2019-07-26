myapp.controller('uploadHoldDateController', ['$scope', '$timeout','Upload','$rootScope', function ($scope, $timeout, Upload,$rootScope) {
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
//    queryHoldDates(function (result) {
//        $scope.hoadDataEntitys = result;
//        $scope.$apply();
//    });
    $scope.startDate = clearConstant.formatDate(new Date());
    $scope.instClientService = new com.quantdo.orgClear.service.instClientService();
    
    $scope.uploadHoldDate_import = isShow("uploadHoldDate_import");
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
	
    // jquery upload
    $("#uploadHoldDateloader").uploadFile({
        url: framework.file.uploadUrl("uploadFundService", "importHoldDate"),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
            	 if(result.errorFlg != "succ") {                	
                     layer.msg(result.errorMessages,{icon: 2});
                 } else {
                 	 layer.msg("成功导入" + result.succCon +"条数据",{icon: 1});
                 	$scope.find();
                 }
    			 $("#exchangeRateUploadModal").modal("hide");
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
    
    
    
    
 // jquery upload
    $("#uploadOptionHoldDateloader").uploadFile({
        url: framework.file.uploadUrl("uploadFundService", "uploadOptionHoldDateloader"),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
            	 if(result.errorFlg != "succ") {                	
                     layer.msg(result.errorMessages,{icon: 2});
                 } else {
                 	 layer.msg("成功导入" + result.succCon +"条数据",{icon: 1});
                 	$scope.find();
                 }
    			 $("#exchangeRateUploadModal").modal("hide");
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
        {title: "交易所"},
        {title: "所属机构"},
        {title: "资金账号"},
        {title: "客户代码"},
        {title: "合约代码"},
        {title: "买卖方向"},
        {title: "投机套保标志"},
        {title: "占用保证金"},
        {title: "今持仓量"},
        {title: "今日持仓成本"}
    ]; 
    
    // 查询(前台分页)
    $scope.find = function(){
    	$scope.productDataset = [];
    	//更新表格对应的数据集
    	queryHoldDates(function (result) {
    		var con = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	var tempArr = [(i+1),con[i].id,$scope.transExchID(con[i].exchID),$scope.transInstClient(con[i].brokerageFirmID),con[i].accountid, con[i].clientID, con[i].instrumentID,$scope.transDirection(con[i].direction),$scope.transHedgeFlag(con[i].hedgeFlag), con[i].usedMargin,con[i].position
                               ,con[i].positionCost];
	            $scope.productDataset.push(tempArr);
            }
            //重新绘表
            $scope.productTable.clear().draw();
            $scope.productTable.rows.add($scope.productDataset).draw();
        });  	
    }
    
    // 初始化
    $timeout(function() {
    	  $scope.find({});
    }, 500);
 
    // 转换
	$scope.transExchID = function(key){
		if(key=="SHFE"){
			return "上期所";
		}else if(key=="CZCE"){
			return "郑商所";
		}else if(key=="DCE"){
			return "大商所";
		}else if(key=="CFFEX"){
			return "中金所";
		}else if(key=="N"){
			return "上海能源交易中心";
		}else{
			return "";
		}
	};
	
	$scope.transDirection = function(key){
		if(key=="0"){
			return "买";
		}else if(key=="1"){
			return "卖";
		}else{
			return "";
		}
	};
	
	$scope.transHedgeFlag = function(key){
		if(key=="1"){
			return "投机";
		}else if(key=="3"){
			return "套保";
		}else if(key=="2"){
			return "套利";
		}else{
			return "";
		}
	};
    
  //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.productTable = $('#uploadHoldDate_dynamic_table').DataTable( {
    		data : $scope.productDataset,
        	columns :$scope.product_columns,
            dom: 'rt<"bottom"iplB>',
            
			buttons: [
			   
			]
        } );
    });


}]);

