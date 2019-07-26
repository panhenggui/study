/**
 * 交易所报单频率控制
 */
myapp.controller('directionControlController',function($scope,$rootScope) {
    $scope.riskDirectionControl = new com.quantdo.orgClear.service.RiskDirectionControl();
    //设置按钮的名称
	var constant_temp = new com.quantdo.orgClear.constant.ClearConstants();
	$scope.directionControl_buttonName_save = constant_temp.buttonName.saveData;
	$scope.directionControl_buttonName_reset = constant_temp.buttonName.setPara;
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
	//调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"directionControl_tabCallBackFunc");
    $scope.directionControl_tabCallBackFunc = tabCallBackFunc;
    $scope.directionControl_datas = [];
   //保存每次查询到的数据的全局变量
    $scope.directionControlRepertData = [];
	//主页面表格表头
    $scope.directionControl_table_columns = [
				        { title: "序号"},
				        { title: "机构代码",visible:false},
				        { title: "基金产品",visible:false},
				        { title: "交易所"},
				        { title: "启用同向反向控制"}
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
            paging: false,
            info: false,
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
    
    //进入页面查询(并控制新增，修改，删除，按钮权限)
    $scope.findAllData = function(){
	    $scope.riskDirectionControl.findDirectionControlData(sessionStorage.listBrokerID,sessionStorage.listFundID,function(result){
            var myfilter = document.getElementsByClassName("backFilter");
            hideAfterFilter($rootScope.filterEntity,myfilter);
	    	$scope.directionControlRepertData = result;
			$scope.directionControl_datas = [];
			$scope.$apply();
			if(result != null){
				$scope.directionIsCanUse = true;
				$scope.$apply();
				for(var i=0;i<result.length;i++){
					 var tempArr = [i+1,result[i].brokerID,result[i].fundID,result[i].exchangeID,
				                   "<input style='cursor:pointer;' id='directionControlcheckbox"+i+"' type='checkbox' "+$scope.changeState(result[i].useDirectionControl)+" />"
				                   ];
					 $scope.directionControl_datas.push(tempArr);
	    		}
			}else{
				$scope.directionIsCanUse = false;
				$scope.$apply();
			}
			$scope.initDataTables("directionControl_table",$scope.directionControl_table_columns,$scope.directionControl_datas);
		});
    }
    $scope.findAllData();
  /*//控制按钮权限
    $(document).ready(function(){
        setTimeout(function(){
            $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
            var myfilter = document.getElementsByClassName("backFilter");
            hideAfterFilter($rootScope.filterEntity,myfilter);
        },"100")
        setTimeout(function(){
        	$scope.findAllData();
        },"100")
    });*/
   //重置
    $scope.resetDirectionControl = function(){
    	var con = $scope.directionControlRepertData;
    	$scope.directionControl_datas = [];
    	if(con != null){
    		$scope.directionIsCanUse = true;
			for(var i=0;i<con.length;i++){
				for(var i=0;i<con.length;i++){
					 var tempArr = [i+1,con[i].brokerID,con[i].fundID,con[i].exchangeID,
				                   "<input style='cursor:pointer;' id='directionControlcheckbox"+i+"' type='checkbox' "+$scope.changeState(con[i].useDirectionControl)+" />"
				                   ];
				 $scope.directionControl_datas.push(tempArr);
    		}
		}
    	destroyDatatable("directionControl_table");
		$scope.initDataTables("directionControl_table",$scope.directionControl_table_columns,$scope.directionControl_datas);
      }else{
    	  $scope.directionIsCanUse = false;
      }
    }
    
    //保存
    $scope.saveDirectionControl = function(){
    	layer.load(2, {
	 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
	 	   	});
 	$scope.directionControl_datas = [];
 	var table = $("#directionControl_table").DataTable();
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
              if(document.getElementById("directionControlcheckbox"+i).checked){
             	 saveData.useDirectionControl = "true";
              }else{
             	 saveData.useDirectionControl = "false";
              }
              $scope.directionControl_datas.push(saveData);
          }
	 	}
	 	$scope.riskDirectionControl.saveDirectionData(sessionStorage.listBrokerID,$scope.directionControl_datas,function(errCode,errMsg,result){
	 		if(errCode != 0){
	 			layer.alert(errMsg);
	 			layer.closeAll('loading');
	    		return false;
	 		}else{
	 	 		$scope.directionControlRepertData = result;
		 		$scope.directionControl_datas = [];
		 		$scope.$apply();
		 		if(result != null){
		 			$scope.directionIsCanUse = true;
		 			for(var i=0;i<result.length;i++){
		 				var tempArr = [i+1,result[i].brokerID,result[i].fundID,result[i].exchangeID,
					                   "<input style='cursor:pointer;' id='directionControlcheckbox"+i+"' type='checkbox' "+$scope.changeState(result[i].useDirectionControl)+" />"
					                   ];
		 				 $scope.directionControl_datas.push(tempArr);
		     		}
		 		}else{
		 			$scope.directionIsCanUse = false;
		 		}
		 		destroyDatatable("directionControl_table");
				$scope.initDataTables("directionControl_table",$scope.directionControl_table_columns,$scope.directionControl_datas);
				layer.alert("保存成功");
	 		}
	 	});
	 	layer.closeAll('loading');
	 }
});