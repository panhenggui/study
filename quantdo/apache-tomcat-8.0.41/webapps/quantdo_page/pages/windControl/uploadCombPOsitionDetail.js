/**
 * Created by Quantdo on 2016/6/6.
 */
myapp.controller('uploadCombPositionDetailController',function($scope,$rootScope) {
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$scope.uploadCombPositionDetailService = new com.quantdo.orgClear.service.UploadCombPositionDetailService();
	
	/*//刚进入页面的时候，清除临时表中的数据
	$scope.uploadCombPositionDetailService.deleteAllUploadCombPositionDetailSubForm();
	//点击确认导入
    $scope.confirmUploadCombPositionDetail2 = function(){
    	if($scope.uploadCombPositionDetail_table_dataset != null && $scope.uploadCombPositionDetail_table_dataset.length>0){
    		var tempArr = $scope.uploadCombPositionDetail_table_dataset[0];
        	$scope.uploadCombPositionDetailService.confirmUploadCombPositionDetail(tempArr.tradingDay,tempArr.exchID,tempArr.brokerID,function(errCode,errMsg,result){
        		if(errCode == 0){
        			 layer.msg("导入成功",{icon: 1});
        		}else{
        			 layer.msg("导入失败",{icon: 2});
        			 return false;
        		}
        		
        		//清除临时表格中的数据
        		$scope.uploadCombPositionDetailService.deleteAllUploadCombPositionDetailSubForm();
        		$scope.uploadCombPositionDetail_table_dataset = [];
        		 $("#uploadCombPositionDetail_table").DataTable().clear().draw();
                 $("#uploadCombPositionDetail_table").DataTable().rows.add($scope.uploadCombPositionDetail_table_dataset).draw();
        	});
    	}
    };*/
    
	/*//表格头
    $scope.uploadCombPositionDetail_table_columns = [
            { title: "序号"},
            { title: "投资者编号"},
            { title: "交易所代码"},
            { title: "投机套保标志"},
            { title: "组合合约代码"},
            { title: "第一腿合约代码"},
            { title: "第一腿买卖方向"},
            { title: "第一腿持仓价"},
            { title: "第一腿保证金",visible:false},
            { title: "第二腿合约代码"},
            { title: "第二腿买卖方向"},
            { title: "第二腿保证金",visible:false},
            { title: "总持仓量"},
            { title: "总保证金",visible:false},
            { title: "所属机构"},
            { title: "交易日"}
    ];*/
	// 按钮权限
	$scope.uploadCombPOsitionDetail_query = isShow("uploadCombPOsitionDetail_query");
	$scope.uploadCombPOsitionDetail_upload = isShow("uploadCombPOsitionDetail_upload");

	//日期控件
	$("[forType='date']").datepicker({
        language:  "zh-CN",
        weekStart: 1,
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        format: "yyyymmdd"
    });
	$scope.queryEntity = {};
	//进入页面获得下拉框数据
	$scope.exchEntity = [{exchID:'all',exchName:'全部'},
	                     {exchID:'CZCE',exchName:'郑商所'},
	                     {exchID:'DCE',exchName:'大商所'}];
	$scope.queryEntity.exchID = "all";
   //存储表格中的数据  
    $scope.uploadCombPositionDetail_table_dataset = [];
    $scope.initUploadCombPositionDetailTable = function(table_id,table_data) {
    	$("#" + table_id).DataTable({
	    	"data":table_data,
	        "columns": [
	            {
	            	"data": "index", 
		            "class":"center"
	            },
	            
	            {
		              "data": "innerAccountID", 
		              "class":"center"
	            },
	            
	            {
		              "data": "exchID", 
		              "class":"center"
	            },
	            
	            {
		              "data": "hedgeFlag", 
		              "class":"center"
	            },
	            
	            {
		              "data": "combInstrumentID", 
		              "class":"center"
	            },
	            
	            {
		              "data": "instrumentID1", 
		              "class":"center"
	            },
	            
	            {
		              "data": "direction1", 
		              "class":"center"
	            },
	            
	            {
		              "data": "positionPrice1", 
		              "class":"center"
	            },
	            
	           /* {
		              "data": "margin1", 
		              "class":"center"
	            },*/
	            
	            {
		              "data": "instrumentID2", 
		              "class":"center"
	            },
	            
	            {
		              "data": "direction2", 
		              "class":"center"
	            },
	            
	            {
		              "data": "positionPrice2", 
		              "class":"center"
	            },
	            
	           /* {
		              "data": "margin2", 
		              "class":"center"
	            },*/
	            
	            {
		              "data": "position", 
		              "class":"center"
	            },
	            
	            /*{
		              "data": "margin", 
		              "class":"center"
	            },*/
	            
	            {
		              "data": "brokerID", 
		              "class":"center"
	            },
	            
	            {
		              "data": "tradingDay", 
		              "class":"center"
	            }
	        ],
	        dom: 'rt<"bottom"iplB>',
			buttons: [],
	        "order": [[0, 'asc']]
 });
    }
     
    //初始化数据
    var table = $scope.initUploadCombPositionDetailTable("uploadCombPositionDetail_table",$scope.uploadCombPositionDetail_table_dataset);  
    
    //进入页面，初始化显示所有数据
    $scope.showData = function(exchID,tradingDay){
	    $scope.uploadCombPositionDetailService.getAllUploadCombPositionDetail(function(result){
			$scope.uploadCombPositionDetail_table_dataset = [];
			if(result != null){
				for(var i=0;i<result.length;i++){
					var conArr = {
	    						"index":i+1,
	    						"innerAccountID":result[i].innerAccountID,
	    						"exchID":$scope.key2Text($scope.exchange,result[i].exchID),
	    						"hedgeFlag":$scope.key2Text($scope.TouJi,result[i].hedgeFlag),
	    						"combInstrumentID":result[i].combInstrumentID,
	    						"instrumentID1":result[i].instrumentID1,
	    						"direction1":$scope.key2Text($scope.diction,result[i].direction1),
	    						"positionPrice1":result[i].positionPrice1,
	    						//"margin1":result[i].margin1,
	    						"instrumentID2":result[i].instrumentID2,
	    						"direction2":$scope.key2Text($scope.diction,result[i].direction2),
	    						"positionPrice2":result[i].positionPrice2,
	    						//"margin2":result[i].margin2,
	    						"position":result[i].position,
	    						//"margin":result[i].margin,
	    						"brokerID":result[i].brokerID,
	    						"tradingDay":result[i].tradingDay
							};
					$scope.uploadCombPositionDetail_table_dataset.push(conArr);
				}
				 $("#uploadCombPositionDetail_table").DataTable().clear().draw();
	             $("#uploadCombPositionDetail_table").DataTable().rows.add($scope.uploadCombPositionDetail_table_dataset).draw();
			}
		},exchID,tradingDay);
    }
    $scope.showData(null,null);
    //选择导入文件
    $("#uploadCombPositionDetail").uploadFile({
    	/*dragdropWidth: 250,
    	 uploadStr:"选择文件分类",
         dragDropStr: "",
         dragDropContainerClass:"",*/
        url: framework.file.uploadUrl("uploadCombPositionDetailService", "holdCombPositionDetailImport"),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
        	$(".ajax-file-upload-container").empty();
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
                if(result != null && result.sucess == "false") {                	
                    layer.msg(result.errCode,{icon: 2});
                    /*//清除临时表格中的数据
            		$scope.uploadCombPositionDetailService.deleteAllUploadCombPositionDetailSubForm();*/
            		layer.closeAll('loading');
                    return false;
                } else {
                	layer.msg("成功上传"+result.count+"条数据",{icon: 1});
                   $scope.queryEntity.exchID = result.exchID;
                   $scope.queryEntity.tradingDay = result.tradingDay;
                   $scope.$apply();
            	   $scope.showData($scope.queryEntity.exchID,$scope.queryEntity.tradingDay);
                   //调用函数，获得
            	   /* $scope.uploadCombPositionDetailService.getAllUploadCombPositionDetailSubForm(function(result){
                		$scope.uploadCombPositionDetail_table_dataset = [];
                		if(result != null){
                			for(var i=0;i<result.length;i++){
                				var conArr = {
	                						"index":i+1,
	                						"innerAccountID":result[i].innerAccountID,
	                						"exchID":result[i].exchID,
	                						"hedgeFlag":$scope.getDiction($scope.TouJi,result[i].hedgeFlag),
	                						"combInstrumentID":result[i].combInstrumentID,
	                						"instrumentID1":result[i].instrumentID1,
	                						"direction1":$scope.getDiction($scope.diction,result[i].direction1),
	                						"positionPrice1":result[i].positionPrice1,
	                						//"margin1":result[i].margin1,
	                						"instrumentID2":result[i].instrumentID2,
	                						"direction2":$scope.getDiction($scope.diction,result[i].direction2),
	                						"positionPrice2":result[i].positionPrice2,
	                						//"margin2":result[i].margin2,
	                						"position":result[i].position,
	                						//"margin":result[i].margin,
	                						"brokerID":result[i].brokerID,
	                						"tradingDay":result[i].tradingDay
                						};
                				$scope.uploadCombPositionDetail_table_dataset.push(conArr);
                			}
                			 $("#uploadCombPositionDetail_table").DataTable().clear().draw();
                             $("#uploadCombPositionDetail_table").DataTable().rows.add($scope.uploadCombPositionDetail_table_dataset).draw();
                		}
                	});*/
                }
            }); 
            layer.closeAll('loading');
        },
        onSelect: function (files) {
        	 layer.load(2, {
          	    shade: [0.5,'#fff'] //0.1透明度的白色背景
          	});
            var file = files[0];
            var fileName = file.name;
            var suffix = fileName.substring(fileName.lastIndexOf('.') + 1);
            if(suffix == "txt"){
            } else {
                layer.msg('请上传TXT文件', {icon: 2}, 3000);
                layer.closeAll('loading');
                return false;
            }
        }
    });
    
    $scope.diction = [
                       {text: '买', key: '0'},
                       {text: '卖', key: '1'}
                   ];   
    $scope.TouJi = [
                      {text: '投机', key: '1'}
                  ];  
    $scope.exchange = [
                    {text: '郑商所', key: 'CZCE'},
                    {text: '大商所', key: 'DCE'}
                ];  
    
    //key转换成text
    $scope.key2Text = function (tempArr,key){
    	if(key!=null&&key!=undefined&&key!=""){
    	    for(var i=0;i<tempArr.length;i++){
                if(key == tempArr[i].key){
                    return tempArr[i].text;
                }
            }
    	}else{
    		return key+"：信息异常";
    	}
    };
})