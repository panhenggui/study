//风控预警情况统计
myapp.controller('riskWarnResultCountController',function($scope,$rootScope) {
	$scope.riskWarnResultCountService = new com.quantdo.orgClear.service.RiskWarnResultCountService();
	//日期控件
	 $("[forType='date']").datepicker({
	        language:  "zh-CN",
	        weekStart: 1,
	        autoclose: true,
	        clearBtn: true,
	        todayHighlight: true,
	        format: "yyyymmdd"
	    });
	 $scope.riskWarnResultCountEntity = {};
	 var paddNum = function(num){
         num += "";
         return num.replace(/^(\d)$/,"0$1");
       }
	 $scope.riskOperLogQueryEntity = {};
	 var d = new Date();
	 var month = paddNum(d.getMonth()+1);
	 var day = paddNum(d.getDate());
     var str = d.getFullYear()+""+month+""+day;
    $scope.riskWarnResultCountEntity.begindate = str;
    $scope.riskWarnResultCountEntity.enddate = str;
    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"riskWarnResultCount_tabCallBackFunc");
    $scope.riskWarnResultCount_tabCallBackFunc = tabCallBackFunc;	
	 //查询
	 $scope.findData = function(entity){
		 layer.load(2, {
	 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
	 	   	});
		 var startDate = entity.begindate;
		 var endDate = entity.enddate;
		 if(startDate!=null&&startDate!=undefined&&startDate!=""&&endDate!=null&&endDate!=undefined&&endDate!=""){
			 if(startDate-endDate>0){
				 layer.alert("开始日期不能大于结束日期");
		       	 layer.closeAll('loading');
		       	 return false;
			 }
		 }
	    	$scope.riskWarnResultCountService.getRiskWarnResultSum(entity,function(result){
	    		$scope.riskWarnResultCount_tableData = [];
	    		if(result!=null&&result.length>0){
	    			for(var i =0;i<result.length;i++){
	    				var temp = [i+1,result[i].warnDate,result[i].instClientID,result[i].instClientAbbrName,result[i].fundProductID,
	    						result[i].shortProductName,result[i].tplID,result[i].indexName,result[i].warncount];
	    				$scope.riskWarnResultCount_tableData.push(temp);
	    				}
	    			}
	    		destroyDatatable("riskWarnResultCount_table");
	    		$scope.initDataTablesRiskWarnResult("riskWarnResultCount_table", $scope.riskWarnResultCount_table_columns, $scope.riskWarnResultCount_tableData);
	    		 $scope.$apply();
			});
	    	layer.closeAll('loading');
	    }
	 
	 
	 //下拉框
	 $scope.brokerEntity = [];
	 $scope.typeEntity = [
	                      {accType:"12",accName:"基金产品"},
	                      {accType:"11",accName:"资产单元"},
	                      ];
	 $scope.riskWarnResultCountService.getAllInstClient(function(result){
		 $scope.brokerEntity=[];
		 if(result!=null){
			 if(result.cjfky!=null){
				 $scope.brokerEntity = result.cjfky;
				 $scope.riskWarnResultCountIsCanUser = false;
				 $scope.$apply();
			 }else{
				 $scope.brokerEntity = result.fky;
				 $scope.riskWarnResultCountEntity.brokerageFirmID = $scope.brokerEntity[0].instClientID;
				 $scope.riskWarnResultCountIsCanUser = true;
				 $scope.$apply();
			 }
		 }
		 $scope.riskWarnResultCountService.getFundProductOrSubAccount($scope.riskWarnResultCountEntity.brokerageFirmID,$scope.riskWarnResultCountEntity.accType,function(result){
			 $scope.productEntity= [];
			 if(result!=null&&result.length>0) $scope.productEntity = result;
			 $scope.$apply();
		 });
		 $scope.findData($scope.riskWarnResultCountEntity);
	 });
	
	 //风控指标
	 $scope.riskWarnResultCountService.getAllTpl("",function(result){
		 $scope.tplEntity=[];
		 if(result!=null&&result.length>0) $scope.tplEntity = result;
		 $scope.$apply();
	 });
	 $scope.brokerChange = function(){
		 $scope.productEntity = [];
		 $scope.riskWarnResultCountService.getFundProductOrSubAccount($scope.riskWarnResultCountEntity.brokerageFirmID,$scope.riskWarnResultCountEntity.accType,function(result){
			 if(result!=null&&result.length>0) $scope.productEntity = result;
			 $scope.$apply();
		 }); 
	 }
	 $scope.typeChange = function(){
		 $scope.productEntity=[];
		 $scope.riskWarnResultCountService.getFundProductOrSubAccount($scope.riskWarnResultCountEntity.brokerageFirmID,$scope.riskWarnResultCountEntity.accType,function(result){
			 if(result!=null&&result.length>0) $scope.productEntity = result;
			 $scope.$apply();
		 }); 
		 $scope.tplEntity=[];
		 $scope.riskWarnResultCountService.getAllTpl($scope.riskWarnResultCountEntity.accType,function(result){
			 if(result!=null&&result.length>0) $scope.tplEntity = result;
			 $scope.$apply();
		 });
	 }
	 
	 //主页面表格表头
     $scope.riskWarnResultCount_table_columns = [
				        { title: "序号"},
				        { title: "日期"},
				        { title: "机构代码",visible:false},
				        { title: "机构"},
				        { title: "产品名称/资产单元ID",visible:false},
				        { title: "产品名称/资产单元"},
				        { title: "风控指标id",visible:false},
				        { title: "风控指标"},
				        { title: "触发次数"}
		        								];
	//初始化数据表
    $scope.initDataTablesRiskWarnResult = function(table_id,table_columns,table_data) {
    	return $("#" + table_id).DataTable({
            columns: table_columns,
            data: table_data,
            scrollX: true,
            retrieve: true,
            destroy:true,
            dom: 'rt<"bottom"ipl>',
            /*"aoColumnDefs": [
                             { "sWidth": "50%", "aTargets": [ 9 ] }
            ],*/
            ordering: true,
            order: [ 0, "asc" ],
            language: {
            	 emptyTable: "没有符合条件的记录",
                 info: " _START_ 到 _END_  共 _TOTAL_ 条",
                 infoEmpty: " 0 到 0  共 0 条",
                 lengthMenu: "显示 _MENU_ 条",
                 paginate: {
                     first: "首页",
                     last: "末页",
                     next: "下一页",
                     previous: "上一页"
                 }
            }
        })
    };
    
    $scope.riskWarnResultCount_tableData = [];
    $scope.initDataTablesRiskWarnResult("riskWarnResultCount_table", $scope.riskWarnResultCount_table_columns, $scope.riskWarnResultCount_tableData);
    
    
})