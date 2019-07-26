//风控参数变更流水查询
myapp.controller('riskOperLogQueryController',function($scope,$rootScope) {
	$scope.riskOperLogService = new com.quantdo.orgClear.service.RiskOperLogService();
	//日期控件
	 $("[forType='date']").datepicker({
	        language:  "zh-CN",
	        weekStart: 1,
	        autoclose: true,
	        clearBtn: true,
	        todayHighlight: true,
	        format: "yyyymmdd",
	        pickerAlign:'bl-tl?'
	    });
	 
	 var paddNum = function(num){
         num += "";
         return num.replace(/^(\d)$/,"0$1");
       }
	 $scope.riskOperLogQueryEntity = {};
	 var d = new Date();
	 var month = paddNum(d.getMonth()+1);
	 var day = paddNum(d.getDate());
     var str = d.getFullYear()+""+month+""+day;
     $scope.riskOperLogQueryEntity.begindate = str;
     $scope.riskOperLogQueryEntity.enddate = str;
     //调用表格重绘函数
     $rootScope.setTabPaneScope($scope,"riskOperLog_tabCallBackFunc");
     $scope.riskOperLog_tabCallBackFunc = tabCallBackFunc;
	 //下拉框
	 $scope.brokerEntity = [];
	 $scope.typeEntity = [
	                      {accType:"1",accName:"基金产品"},
	                      {accType:"2",accName:"资产单元"},
	                      ];
	 $scope.productEntity = [];
	 $scope.userEntity = [];
	 
	 $scope.riskOperLogService.getAllInstClient(function(result){
		 $scope.brokerEntity=[];
		 if(result!=null){
			 if(result.cjfky!=null){
				 $scope.brokerEntity = result.cjfky;
				 $scope.riskAccountSelectIsCanUse = false;
				 $scope.$apply();
			 }else{
				 $scope.brokerEntity = result.fky;
				 $scope.riskOperLogQueryEntity.accInstClientID = $scope.brokerEntity[0].instClientID;
				 $scope.riskAccountSelectIsCanUse = true;
				 $scope.$apply();
			 }
		 }
		 //关联变更人员
		 $scope.userEntity = [];
		 $scope.riskOperLogService.getAllUser($scope.riskOperLogQueryEntity.accInstClientID,function(result){
			 if(result!=null&&result.length>0) $scope.userEntity = result;
			 $scope.$apply();
		 });
		 //关联产品
		 $scope.productEntity = [];
		 $scope.riskOperLogService.getFundProductOrSubAccount2($scope.riskOperLogQueryEntity.accInstClientID,$scope.riskOperLogQueryEntity.accType,function(result){
			 if(result!=null&&result.length>0) $scope.productEntity = result;
			 $scope.$apply();
		 });
		 $scope.find($scope.riskOperLogQueryEntity);
	 });
	
	 //风控参数
	 $scope.menuEntity = [];
	 $scope.riskOperLogService.getRiskIndexTplDict("",function(result){
		 if(result!=null&&result.length>0) $scope.menuEntity = result;
		 $scope.$apply();
	 });
	 $scope.brokerIDChange = function(){
		//关联变更人员
		 $scope.userEntity = [];
		 $scope.riskOperLogService.getAllUser($scope.riskOperLogQueryEntity.accInstClientID,function(result){
			 if(result!=null&&result.length>0) $scope.userEntity = result;
			 $scope.$apply();
		 });
		 //关联产品
		 $scope.productEntity = [];
		 $scope.riskOperLogService.getFundProductOrSubAccount2($scope.riskOperLogQueryEntity.accInstClientID,$scope.riskOperLogQueryEntity.accType,function(result){
			 if(result!=null&&result.length>0) $scope.productEntity = result;
			 $scope.$apply();
		 }); 
	 }
	 $scope.typeChange = function(){
		 //关联产品
		 $scope.productEntity = [];
		 $scope.riskOperLogService.getFundProductOrSubAccount2($scope.riskOperLogQueryEntity.accInstClientID,$scope.riskOperLogQueryEntity.accType,function(result){
			 if(result!=null&&result.length>0) $scope.productEntity = result;
			 $scope.$apply();
		 });  
		 //风控参数
		 $scope.menuEntity = [];
		 $scope.riskOperLogService.getRiskIndexTplDict($scope.riskOperLogQueryEntity.accType,function(result){
			 if(result!=null&&result.length>0) $scope.menuEntity = result;
			 $scope.$apply();
		 });
	 }
	/* $scope.userIDChange = function(){
		 //关联产品
		 $scope.productEntity = [];
		 $scope.riskOperLogService.getFundProductOrSubAccount2($scope.riskOperLogQueryEntity.accInstClientID,$scope.riskOperLogQueryEntity.accType,$scope.riskOperLogQueryEntity.operUserId,function(result){
			 if(result!=null&&result.length>0) $scope.productEntity = result;
			 $scope.$apply();
		 });   
	 }*/
	 //主页面表格表头
     $scope.riskOperLogQuery_table_columns = [
				        { title: "序号"},
				        { title: "机构代码",visible:false},
				        { title: "机构"},
				        { title: "变更人员代码"},
				        { title: "变更人员名称"},
				        { title: "登录IP"},
				        { title: "变更时间"},
				        { title: "产品名称/资产单元ID",visible:false},
				        { title: "产品名称/资产单元"},
				        { title: "风控参数ID",visible:false},
				        { title: "风控参数"},
				        { title: "变更类型"},
				        { title: "变更内容"}
		        								];
	//初始化数据表
    $scope.initDataTablesRiskOperLog = function(table_id,table_columns,table_data) {
    	return $("#" + table_id).DataTable({
            columns: table_columns,
            data: table_data,
            scrollX: true,
            retrieve: true,
            destroy:true,
            dom: 'rt<"bottom"ipl>',
            "aoColumnDefs": [
                             { "sWidth": "10%", "aTargets": [ 6 ] },
                             { "sWidth": "8%", "aTargets": [ 10 ] },
                             { "sWidth": "60%", "aTargets": [ 12 ] }
            ],
            ordering: true,
            order: [[0, 'asc']],
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
    
    $scope.riskOperLogQuery_tableData = [];
    $scope.initDataTablesRiskOperLog("riskOperLogQuery_table", $scope.riskOperLogQuery_table_columns, $scope.riskOperLogQuery_tableData);
    
    $scope.find = function(entity){
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
    	$scope.riskOperLogService.getRiskOperLogList(entity,function(result){
    		$scope.riskOperLogQuery_tableData = [];
    		if(result!=null&&result.length>0){
    			for(var i =0;i<result.length;i++){
    				if(result[i].operContentDesc.indexOf("[修改后]")!=-1){
    					var aaa = result[i].operContentDesc.split("[修改后");
    					var bbb = "[修改后" + aaa[1];
    					var temp = [i+1,result[i].instClientID,result[i].instClientIDName,result[i].operatorID,result[i].operatorName,
    	    						result[i].operatorIP,result[i].operateDate+" "+result[i].operateTime,result[i].accId,result[i].accName,
    	    						result[i].menuId,result[i].menuName,$scope.changeOperType(result[i].operType,$scope.operTypeAndName),aaa[0].replace(/</g, "&lt") + "<pre> "+bbb.replace(/</g, "&lt")+"</pre>"];
    					$scope.riskOperLogQuery_tableData.push(temp);
    				}else{
    					var temp = [i+1,result[i].instClientID,result[i].instClientIDName,result[i].operatorID,result[i].operatorName,
    	    						result[i].operatorIP,result[i].operateDate+" "+result[i].operateTime,result[i].accId,result[i].accName,
    	    						result[i].menuId,result[i].menuName,$scope.changeOperType(result[i].operType,$scope.operTypeAndName),result[i].operContentDesc.replace(/</g, "&lt")];
    					$scope.riskOperLogQuery_tableData.push(temp);
    				}
    					
    				
    				
    				
    				
    				}
    			}
    		destroyDatatable("riskOperLogQuery_table");
    		$scope.initDataTablesRiskOperLog("riskOperLogQuery_table", $scope.riskOperLogQuery_table_columns, $scope.riskOperLogQuery_tableData);
		});
    	layer.closeAll('loading');
    }
    
    $scope.operTypeAndName=[
    		{key:"1",Value:"增加"},
    		{key:"2",Value:"修改"},
    		{key:"3",Value:"删除"}];
    
    $scope.changeOperType=function(key,temp){
    	for(var i=0;i<temp.length;i++){
    		if(key == temp[i].key) return temp[i].Value;
    	}
    }
})