/**
 * 交易所报单频率控制
 */
myapp.controller('riskAccountExchOrderControlController',function($scope,$rootScope) {
    $scope.riskAccountExchangeOrderControlService = new com.quantdo.orgClear.service.RiskAccountExchangeOrderControlService();
    $scope.riskAccountFutureVarietySetService = new com.quantdo.orgClear.service.RiskAccountFutureVarietySetService();
    //保存table中的数据
    $scope.riskAccountExchOrderControl_table = [];
    //保存每次查询到的数据的全局变量
    $scope.riskAccountExchOrderControlRepertData = [];
    $scope.riskAccountExchOrderControlEntity = {};
    $scope.subAccountList = {};
    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"riskAccountExchOrderControl_tabCallBackFunc");
    $scope.riskAccountExchOrderControl_tabCallBackFunc = tabCallBackFunc;
    //设置按钮的名称
	var constant_temp = new com.quantdo.orgClear.constant.ClearConstants();
	$scope.riskAccountExchOrderControl_buttonName_save = constant_temp.buttonName.saveData;
	$scope.riskAccountExchOrderControl_buttonName_reset = constant_temp.buttonName.setPara;
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
    $scope.riskAccountExchOrderControl_table_columns = [
				        { title: "序号"},
				        { title: "机构代码",visible:false},
				        { title: "资产单元ID",visible:false},
				        { title: "机构"},
				        { title: "资产单元"},
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
            scrollY: 600,
            scrollCollapse:true,
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
    $scope.initDataTables("riskAccountExchOrderControl_table",$scope.riskAccountExchOrderControl_table_columns,$scope.riskAccountExchOrderControl_table);
    //获取下拉框数据,并初始化数据
    $scope.riskAccountFutureVarietySetService.querySubAccount(function(result){
    	if(result != null && result.length>0){
    		$scope.subAccountList = result;
    		$scope.riskAccountExchOrderControlEntity.riskAccount = result[0].subAccountID;
    		$scope.$apply();
    		$scope.riskAccountExchangeOrderControlService.getAllRiskAccountExchangeOrderControl(result[0].subAccountID.split(":")[0],result[0].subAccountID.split(":")[1],function(result2){
    			   var myfilter = document.getElementsByClassName("backFilter");
    		       hideAfterFilter($rootScope.filterEntity,myfilter);
    			 $scope.riskAccountExchOrderControl_table = [];
    			 $scope.riskAccountExchOrderControlRepertData = [];
    			if(result2 != null){
    				$scope.riskAccountisCanUser = true;
    				$scope.riskAccountExchOrderControlRepertData = result2;
    				$scope.$apply();
    				for(var i=0;i<result2.length;i++){
    					 var tempArr = [i+1,result2[i].brokerID,result2[i].subAccountID,result2[i].brokerName,result2[i].subAccountName,result2[i].exchangeID,
    					                   "<input style='cursor:pointer;' id='riskAccountExhangeOrderControlcheckbox1"+i+"' type='checkbox' "+$scope.changeState(result2[i].useLimit)+" />",
    					                   "<input id='riskAccountExhangeOrderControlinput"+i+"' type='text' value = "+result2[i].maxOrderNum+" />",
    					                   "<input style='cursor:pointer;' id='riskAccountExhangeOrderControlcheckbox2"+i+"' type='checkbox' "+$scope.changeState(result2[i].useKillOrder)+" />",
    					                   ];
    	    				 $scope.riskAccountExchOrderControl_table.push(tempArr);
    				}
    			}else{
    				$scope.riskAccountisCanUser = false;
    			}
    			destroyDatatable("riskAccountExchOrderControl_table");
    			$scope.initDataTables("riskAccountExchOrderControl_table",$scope.riskAccountExchOrderControl_table_columns,$scope.riskAccountExchOrderControl_table);
    		});
    	}
    });
    
  /*  $(document).ready(function(){
	   setTimeout(function(){
		   var myfilter = document.getElementsByClassName("backFilter");
	       hideAfterFilter($rootScope.filterEntity,myfilter);
	   },"100")
	   setTimeout(function(){
		   $scope.riskAccountisCanUser = true;
		   $scope.$apply();
	   },"100")
   }); */
    
    //当下拉框内容改变时，改变表格数据
    $scope.riskAccountExchOrderControlChangSelect = function(entity){
    	$scope.riskAccountExchangeOrderControlService.getAllRiskAccountExchangeOrderControl(entity.riskAccount.split(":")[0],entity.riskAccount.split(":")[1],function(result){
    		 var myfilter = document.getElementsByClassName("backFilter");
		       hideAfterFilter($rootScope.filterEntity,myfilter);
			 $scope.riskAccountExchOrderControl_table = [];
			 $scope.riskAccountExchOrderControlRepertData = [];
			if(result != null){
				$scope.riskAccountisCanUser = true;
				$scope.riskAccountExchOrderControlRepertData = result;
				$scope.$apply();
				for(var i=0;i<result.length;i++){
					 var tempArr = [i+1,result[i].brokerID,result[i].subAccountID,result[i].brokerName,result[i].subAccountName,result[i].exchangeID,
					                   "<input style='cursor:pointer;' id='riskAccountExhangeOrderControlcheckbox1"+i+"' type='checkbox' "+$scope.changeState(result[i].useLimit)+" />",
					                   "<input id='riskAccountExhangeOrderControlinput"+i+"' type='text' value = "+result[i].maxOrderNum+" />",
					                   "<input style='cursor:pointer;' id='riskAccountExhangeOrderControlcheckbox2"+i+"' type='checkbox' "+$scope.changeState(result[i].useKillOrder)+" />",
					                   ];
	    				 $scope.riskAccountExchOrderControl_table.push(tempArr);
				}
			}else{
				$scope.riskAccountisCanUser = false;
			}
			destroyDatatable("riskAccountExchOrderControl_table");
			$scope.initDataTables("riskAccountExchOrderControl_table",$scope.riskAccountExchOrderControl_table_columns,$scope.riskAccountExchOrderControl_table);
    	});
    }
    
    //重置
    $scope.resetRiskAccountExchOrderControl = function(){
    	var con = $scope.riskAccountExchOrderControlRepertData;
    	$scope.riskAccountExchOrderControl_table = [];
    	if(con != null){
    		$scope.riskAccountisCanUser = true;
			for(var i=0;i<con.length;i++){
				var tempArr = [i+1,con[i].brokerID,con[i].subAccountID,con[i].brokerName,con[i].subAccountName,con[i].exchangeID,
			                   "<input style='cursor:pointer;' id='riskAccountExhangeOrderControlcheckbox1"+i+"' type='checkbox' "+$scope.changeState(con[i].useLimit)+" />",
			                   "<input id='riskAccountExhangeOrderControlinput"+i+"' type='text' value = "+con[i].maxOrderNum+" />",
			                   "<input style='cursor:pointer;' id='riskAccountExhangeOrderControlcheckbox2"+i+"' type='checkbox' "+$scope.changeState(con[i].useKillOrder)+" />",
			                   ];
				 $scope.riskAccountExchOrderControl_table.push(tempArr);
    		}
		}else{
			$scope.riskAccountisCanUser = false;
		}
    	destroyDatatable("riskAccountExchOrderControl_table");
		$scope.initDataTables("riskAccountExchOrderControl_table",$scope.riskAccountExchOrderControl_table_columns,$scope.riskAccountExchOrderControl_table);
    }
    
    //保存
    $scope.saveRiskAccountExchOrderControl = function(){
    	layer.load(2, {
	 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
	 	   	});
    	$scope.riskAccountExchOrderControl_table = [];
    	var table = $("#riskAccountExchOrderControl_table").DataTable();
    	var tableData = table.context[0].aoData;
    	if($scope.riskAccountExchOrderControlEntity.riskAccount==null||$scope.riskAccountExchOrderControlEntity.riskAccount==undefined||$scope.riskAccountExchOrderControlEntity.riskAccount==""){
       	 layer.alert("资产单元不能为空");
       	 layer.closeAll('loading');
       	 return false;
        }
    	if(tableData != null&&tableData.length>0){
    	   	 for(var i=0;i<tableData.length;i++){
                 var saveData = {};
                 saveData.brokerID = tableData[i]._aData[1];
                 saveData.subAccountID = tableData[i]._aData[2];
                 if(saveData.subAccountID != $scope.riskAccountExchOrderControlEntity.riskAccount.split(":")[1]){
                	 layer.alert("获取的资产单元不正确");
                	 layer.closeAll('loading');
                	 return false;
                 }
                 saveData.exchangeID = tableData[i]._aData[5];
                 if(document.getElementById("riskAccountExhangeOrderControlcheckbox1"+i).checked){
                	 saveData.useLimit = "true";
                 }else{
                	 saveData.useLimit = "false";
                 }
                 saveData.maxOrderNum = document.getElementById("riskAccountExhangeOrderControlinput"+i).value
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
                 if(document.getElementById("riskAccountExhangeOrderControlcheckbox2"+i).checked){
                	 saveData.useKillOrder = "true";
                 }else{
                	 saveData.useKillOrder = "false";
                 }
                 $scope.riskAccountExchOrderControl_table.push(saveData);
             }
    	$scope.riskAccountExchangeOrderControlService.saveRiskAccountExchangeOrderControl($scope.riskAccountExchOrderControl_table,function(errCode,errMsg,result){
    		if(errCode != 0){
    			layer.alert(errMsg);
    			layer.closeAll('loading');
       		    return false;
    		}else{
    			$scope.riskAccountExchOrderControlRepertData = result;
        		$scope.riskAccountExchOrderControl_table = [];
        		$scope.$apply();
        		if(result != null){
        			$scope.riskAccountisCanUser = true;
        			for(var i=0;i<result.length;i++){
        				 var tempArr = [i+1,result[i].brokerID,result[i].subAccountID,result[i].brokerName,result[i].subAccountName,result[i].exchangeID,
 					                   "<input style='cursor:pointer;' id='riskAccountExhangeOrderControlcheckbox1"+i+"' type='checkbox' "+$scope.changeState(result[i].useLimit)+" />",
 					                   "<input id='riskAccountExhangeOrderControlinput"+i+"' type='text' value = "+result[i].maxOrderNum+" />",
 					                   "<input style='cursor:pointer;' id='riskAccountExhangeOrderControlcheckbox2"+i+"' type='checkbox' "+$scope.changeState(result[i].useKillOrder)+" />",
 					                   ];
        				 $scope.riskAccountExchOrderControl_table.push(tempArr);
            		}
        		}else{
        			$scope.riskAccountisCanUser = false;
        		}
        		destroyDatatable("riskAccountExchOrderControl_table");
        		$scope.initDataTables("riskAccountExchOrderControl_table",$scope.riskAccountExchOrderControl_table_columns,$scope.riskAccountExchOrderControl_table);
        		layer.alert("保存成功");
    		}
    	});
    	}
    	layer.closeAll('loading');
    }
});