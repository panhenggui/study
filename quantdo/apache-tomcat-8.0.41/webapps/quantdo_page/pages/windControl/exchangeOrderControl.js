/**
 * 交易所报单频率控制
 */
myapp.controller('exchangeOrderControlController',function($scope,$rootScope) {
    $scope.riskExchangeOrderControl = new com.quantdo.orgClear.service.RiskExchangeOrderControl();
    //保存table中的数据
    $scope.riskExchOrderControl_table = [];
    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"exchOrderControl_tabCallBackFunc");
    $scope.exchOrderControl_tabCallBackFunc = tabCallBackFunc;
    //保存每次查询到的数据的全局变量
    $scope.riskExchOrderControlRepertData = [];
    //设置按钮的名称
	var constant_temp = new com.quantdo.orgClear.constant.ClearConstants();
	$scope.riskExchOrderControl_buttonName_save = constant_temp.buttonName.saveData;
	$scope.riskExchOrderControl_buttonName_reset = constant_temp.buttonName.setPara;
	//多选框。选中转换
	$scope.changeState = function(status){
        var lstatus = "";
        if("true"==status){
        	lstatus = "checked= 'checked'";
        }
        else if("false" == status){
        	lstatus = "";
        }else{
        	layer.alert("数据异常");
        }
        return lstatus;
    }
    //判断是否为正整数
	$scope.isPositiveNum = function(s){
	    var re = /^[1-9]+[0-9]*]*$/;  
	    return re.test(s)  
	} 
	//主页面表格表头
    $scope.riskExchOrderControl_table_columns = [
				        { title: "序号"},
				        { title: "机构代码",visible:false},
				        { title: "基金产品",visible:false},
				        { title: "交易所"},
				        { title: "启用限制"},
				        { title: "每秒最大报单数"},
				        { title: "撤单计入统计"}
		        								];
    
	//初始化数据表
    $scope.initDataTables = function(table_id,table_columns,table_data) {
    	return $("#" + table_id).DataTable({
            columns: table_columns,
            data: table_data,
            scrollX: true,
            scrollY: 660,
            scrollCollapse:true,
            "aoColumnDefs": [
                             { "sWidth": "36%", "aTargets": [ 1 ] }
            ],
            dom: 'rt<"bottom"ipl>',
            ordering: true,
            paging:   false,
            info:false,
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
    
    //进入页面首次查询(同时控制新增，修改，删除 按钮权限)
    $scope.isCanUser = false;
    $scope.findAllData = function(){
    	$scope.riskExchangeOrderControl.getAllRiskExchangeOrderControl(sessionStorage.listBrokerID,sessionStorage.listFundID,function(result){
    		//控制新增，修改，删除 按钮权限
            var myfilter = document.getElementsByClassName("backFilter");
            hideAfterFilter($rootScope.filterEntity,myfilter);
    		$scope.riskExchOrderControlRepertData = result;
    		$scope.riskExchOrderControl_table = [];
    		$scope.$apply();
    		if(result != null){
    			$scope.isCanUser = true;
    			$scope.$apply();
    			for(var i=0;i<result.length;i++){
    				 var tempArr = [i+1,result[i].brokerID,result[i].fundID,result[i].exchangeID,
				                   "<input style='cursor:pointer;' id='riskExhangeOrderControlcheckbox1"+i+"' type='checkbox' "+$scope.changeState(result[i].useLimit)+" />",
				                   "<input id='riskExhangeOrderControlinput"+i+"' type='text' value = "+result[i].maxOrderNum+" />",
				                   "<input style='cursor:pointer;' id='riskExhangeOrderControlcheckbox2"+i+"' type='checkbox' "+$scope.changeState(result[i].useKillOrder)+" />",
				                   ];
    				 $scope.riskExchOrderControl_table.push(tempArr);
        		}
    		}else{
    			$scope.isCanUser = false;
    			$scope.$apply();
    		}
    		$scope.initDataTables("riskExchOrderControl_table",$scope.riskExchOrderControl_table_columns,$scope.riskExchOrderControl_table);
    	});
    }
    $scope.findAllData();
	/*//控制按钮权限
    $(document).ready(function(){
	    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
        var myfilter = document.getElementsByClassName("backFilter");
        hideAfterFilter($rootScope.filterEntity,myfilter);
        setTimeout(function(){
        	$scope.findAllData();
        },"100")
    });*/
    //重置
    $scope.resetRiskExchOrderControl = function(){
    	var con = $scope.riskExchOrderControlRepertData;
    	$scope.riskExchOrderControl_table = [];
    	if(con != null){
    		$scope.isCanUser = true;
			for(var i=0;i<con.length;i++){
				 var tempArr = [i+1,con[i].brokerID,con[i].fundID,con[i].exchangeID,
				               "<input style='cursor:pointer;' id='riskExhangeOrderControlcheckbox1"+i+"' type='checkbox' "+$scope.changeState(con[i].useLimit)+" />",
				               "<input id='riskExhangeOrderControlinput"+i+"' type='text' value = "+con[i].maxOrderNum+" />",
				               "<input style='cursor:pointer;' id='riskExhangeOrderControlcheckbox2"+i+"' type='checkbox' "+$scope.changeState(con[i].useKillOrder)+" />",
				               ];
				 $scope.riskExchOrderControl_table.push(tempArr);
    		}
		}else{
			$scope.isCanUser = false;
		}
    	destroyDatatable("riskExchOrderControl_table");
		$scope.initDataTables("riskExchOrderControl_table",$scope.riskExchOrderControl_table_columns,$scope.riskExchOrderControl_table);
    }
    
    //保存
    $scope.saveRiskExchOrderControl = function(){
    	layer.load(2, {
	 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
	 	   	});
    	$scope.riskExchOrderControl_table = [];
    	var table = $("#riskExchOrderControl_table").DataTable();
    	var tableData = table.context[0].aoData;
    	if(tableData != null){
    	   	 for(var i=0;i<tableData.length;i++){
                 var saveData = {};
                 saveData.brokerID = tableData[i]._aData[1];
                 saveData.fundID = tableData[i]._aData[2];
                 if(saveData.fundID != sessionStorage.listFundID){
                	 layer.alert("获取的基金产品账号不正确");
                 }
                 saveData.exchangeID = tableData[i]._aData[3];
                 if(document.getElementById("riskExhangeOrderControlcheckbox1"+i).checked){
                	 saveData.useLimit = "true";
                 }else{
                	 saveData.useLimit = "false";
                 }
                 saveData.maxOrderNum = document.getElementById("riskExhangeOrderControlinput"+i).value
                 if(!$scope.isPositiveNum(saveData.maxOrderNum)){
                	 layer.alert("每秒最大撤单量的取值范围是：[1,100]之间的整数");
                	 layer.closeAll('loading');
                	 return false;
                 }
                 if($scope.isPositiveNum(saveData.maxOrderNum)){
                	 if(saveData.maxOrderNum - 100 > 0){
                		 layer.alert("每秒最大撤单量的取值范围是：[1,100]之间的整数");
                		 layer.closeAll('loading');
                		 return false;
                	 }
                	 if(saveData.maxOrderNum - 1 < 0){
                		 layer.alert("每秒最大撤单量的取值范围是：[1,100]之间的整数");
                		 layer.closeAll('loading');
                		 return false;
                	 }
                	 
                 }
                 if(document.getElementById("riskExhangeOrderControlcheckbox2"+i).checked){
                	 saveData.useKillOrder = "true";
                 }else{
                	 saveData.useKillOrder = "false";
                 }
                 $scope.riskExchOrderControl_table.push(saveData);
             }
    	}
    	$scope.riskExchangeOrderControl.saveRiskExchangeOrderControl(sessionStorage.listBrokerID,$scope.riskExchOrderControl_table,function(errCode,errMsg,result){
    		if(errCode != 0){
    			layer.alert(errMsg);
    			layer.closeAll('loading');
       		    return false;
    		}else{
    			$scope.riskExchOrderControlRepertData = result;
        		$scope.riskExchOrderControl_table = [];
        		$scope.$apply();
        		if(result != null){
        			$scope.isCanUser = true;
        			for(var i=0;i<result.length;i++){
        				 var tempArr = [i+1,result[i].brokerID,result[i].fundID,result[i].exchangeID,
    				                   "<input style='cursor:pointer;' id='riskExhangeOrderControlcheckbox1"+i+"' type='checkbox' "+$scope.changeState(result[i].useLimit)+" />",
    				                   "<input id='riskExhangeOrderControlinput"+i+"' type='text' value = "+result[i].maxOrderNum+" />",
    				                   "<input style='cursor:pointer;' id='riskExhangeOrderControlcheckbox2"+i+"' type='checkbox' "+$scope.changeState(result[i].useKillOrder)+" />",
    				                   ];
        				 $scope.riskExchOrderControl_table.push(tempArr);
            		}
        		}else{
        			$scope.isCanUser = false;
        		}
        		destroyDatatable("riskExchOrderControl_table");
        		$scope.initDataTables("riskExchOrderControl_table",$scope.riskExchOrderControl_table_columns,$scope.riskExchOrderControl_table);
        		layer.alert("保存成功");
    		}
    	});
    	layer.closeAll('loading');
    }
});