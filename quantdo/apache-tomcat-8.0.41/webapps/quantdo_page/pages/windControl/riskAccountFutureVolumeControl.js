/**
 * @author dell
 *期货数量控制
 */
myapp.controller('riskAccountFutureVolumeControlController',function($scope,$rootScope) {
	$scope.riskAccountFutureVolumeControlService = new com.quantdo.orgClear.service.RiskAccountFutureVolumeControlService();
	$scope.riskAccountFutureVarietySetService = new com.quantdo.orgClear.service.RiskAccountFutureVarietySetService();
	//调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"riskAccountFutureVolumeControl_tabCallBackFunc");
    $scope.riskAccountFutureVolumeControl_tabCallBackFunc = tabCallBackFunc;
	//设置按钮的名称
	var constant_temp = new com.quantdo.orgClear.constant.ClearConstants();
	$scope.riskAccountFutureVolumeControl_save = constant_temp.buttonName.saveData;//保存
	$scope.riskAccountFutureVolumeControl_update = constant_temp.buttonName.updateData;//修改
	$scope.riskAccountFutureVolumeControl_setPara = constant_temp.buttonName.setPara;//重置
	$scope.riskAccountFutureVolumeControl_resetPara = constant_temp.buttonName.resetPara;//取消修改
	$scope.riskAccountFutureVolumeControlEdit = true;//切换保存和修改按钮
	$scope.riskAccountFutureVolumeControlShow = false;//显示设置栏
	$scope.riskAccountSelectIsCanUse = false;//下拉框可以使用
	$scope.riskAccountFutureVolumeControlEntity = {};
	$scope.exchangeAndProducts = {};
	$scope.subAccountList = {};
	$scope.saveEntity = {brokerID:"",subAccountID:"",exchangID:"",productID:"",maxPositionVolumeInstrument:"",maxKillOrderVolumeInstrument:"",maxOpenVolumeProduct:""};
	$scope.updateEntity = {brokerID:"",subAccountID:"",exchangID:"",productID:"",maxPositionVolumeInstrument:"",maxKillOrderVolumeInstrument:"",maxOpenVolumeProduct:""};
	//初始化表格数据
    $scope.riskAccountFutureVolumControl_table_datas = [];
    
    //点击新增
    $scope.showRiskAccountFutureVolumeControlDetail = function(){
    	$scope.initText();
    	$scope.riskAccountFutureVolumeControlEdit = true;//切换保存和修改按钮
		$scope.riskAccountFutureVolumeControlShow = true;//显示设置栏
		$scope.riskAccountSelectIsCanUse = false;//下拉框可以使用
    }
    
    //点击重置
    $scope.riskAccountRepeatData = function(){
    	$scope.initText();
    	$scope.riskAccountFutureVolumeControlEdit = true;//切换保存和修改按钮
		$scope.riskAccountFutureVolumeControlShow = true;//显示设置栏
		$scope.riskAccountSelectIsCanUse = false;//下拉框可以使用
    }
    
    //点击取消修改
    $scope.riskAccountGveUpUpdate = function(){
		$scope.riskAccountFutureVolumeControlShow = false;//显示设置栏
    }
	//主页面表格表头
    $scope.riskAccountFutureVolumControl_table_columns = [
				        { title: "序号"},
				        { title: "机构代码",visible:false},
				        { title: "机构"},
				        { title: "资产单元ID",visible:false},
				        { title: "资产单元"},
				        { title: "交易所"},
				        { title: "品种"},
				        { title: "合约最大持仓量"},
				        { title: "合约最大撤单次数"},
				        { title: "品种最大开仓量"},
				        { title: "操作"}
		        								];
	//初始化数据表
    $scope.initDataTables = function(table_id,table_columns,table_data) {
    	return $("#" + table_id).DataTable({
            columns: table_columns,
            data: table_data,
            scrollX: true,
           /* "aoColumnDefs": [
                             { "sWidth": "36%", "aTargets": [ 1 ] }
            ],*/
            dom: 'rt<"bottom"ipl>',
            ordering: true,
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
    
    //获得品种下拉框数据
    $scope.riskAccountFutureVolumeControlService.getProductList("",function(result){
    	$scope.exchangeAndProducts = {};
    	if(result != null && result.length>0){
    		$scope.exchangeAndProducts = result;
    		$scope.riskAccountFutureVolumeControlEntity.exhangeid_productid = result[0].groupID;
    		$scope.$apply();
    	}
    });
    
    //获得资产单元下拉框数据
    $scope.riskAccountFutureVarietySetService.querySubAccount(function(result){
    	$scope.subAccountList = {};
    	if(result != null && result.length>0){
    		$scope.subAccountList = result;
    		$scope.riskAccountFutureVolumeControlEntity.riskAccount = result[0].subAccountID;
    		$scope.$apply();
    	}
    });
    
    //对输入框中的内容进行校验
    $scope.riskAccountFutureVolumeControlnumberControl = function(index){
    	if(index.length == 1 && index[0] == 0){
    		return true;
    	}
    	 var re = /^[1-9]+[0-9]*]*$/; 
    	 if(index[0]&& !re.test(index)){
    		 layer.alert("取值必须是[0,10000]之间的整数");
    		 return false;
    	 }
    	 if(re.test(index)){
    		 if(index-10000>0){
    			 layer.alert("取值必须是[0,10000]之间的整数");
        		 return false; 
    		 }
    		 if(index-0<0){
    			 layer.alert("取值必须是[0,10000]之间的整数");
        		 return false;  
    		 }
    	 }
    }
    
    //效验公共方法
    $scope.judgeNum = function(index){
    	if(index.length == 1 && index[0] == 0){
    		return true;
    	}
    	if(index.length >1 && index[0] == 0){
    		return false;
    	}
	   	 var re = /^[1-9]+[0-9]*]*$/ ; 
	   	 if(!re.test(index)){
	   		 return false;
	   	 }
	   	 if(re.test(index)){
	   		 if(index-10000>0){
	       		 return false; 
	   		 }
	   		 if(index-0<0){
	       		 return false;  
	   		 }else{
	   			 return true;
	   		 }
	   		 if(index.length>1 && index[0] == 0){
	   			 return false;
	   		 }
	   	 }
    }
    
    //初始化输入框
    $scope.initText = function(){
    	$scope.riskAccountFutureVolumeControlEntity.maxPositionVolumeInstrument = "0";
    	$scope.riskAccountFutureVolumeControlEntity.maxKillOrderVolumeInstrument = "0";
    	$scope.riskAccountFutureVolumeControlEntity.maxOpenVolumeProduct = "0";
    }
    $scope.initText();
    
    //进入页面初始化
    $scope.riskAccountFutureVolumeAddButtonIsShow = false;
    $scope.showTableInit = function(isControl){
    $scope.riskAccountFutureVolumeControlService.findData("",function(result){
    	$scope.riskAccountFutureVolumControl_table_datas = [];
    	if(result != null){
    		for(var i=0;i<result.length;i++){
				var temp = [i+1,result[i].brokerID,result[i].brokerName,result[i].subAccountID,result[i].subAccountName,result[i].exchangeID,result[i].productID,
				            result[i].maxPositionVolumeInstrument,result[i].maxKillOrderVolumeInstrument,result[i].maxOpenVolumeProduct,
				            "<a style='cursor:pointer;' name = 'RiskAccountFutureVolumeControlService.saveData' class='riskAccountFutureVolumeUpdateIndex backFilter'>[修改]</a>"+ 
				            "<a style='cursor:pointer;' name = 'RiskAccountFutureVolumeControlService.saveData' class='riskAccountFutureVolumeDeleteIndex backFilter'>[删除]</a>"
				            ];
				$scope.riskAccountFutureVolumControl_table_datas.push(temp);
			}
			$scope.initDataTables("riskAccountFutureVolumeControl_table",$scope.riskAccountFutureVolumControl_table_columns,$scope.riskAccountFutureVolumControl_table_datas);
    	}
    	if(isControl){
			var myfilter = document.getElementsByClassName("backFilter");
 	        hideAfterFilter($rootScope.filterEntity,myfilter);
 	        $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
		}
		$scope.riskAccountFutureVolumeAddButtonIsShow = true;
	    $scope.$apply();
    });
    }
    $scope.showTableInit(true);
    
    $('#riskAccountFutureVolumeControl_table').on( 'page.dt', function () {
    	setTimeout(function(){
    		var myfilter = document.getElementsByClassName("backFilter");
        	hideAfterFilter($rootScope.filterEntity,myfilter);
    	})
    }); 
   
   $("body").delegate('#riskAccountFutureVolumeControl_table_length div').on('change', 'select[name="riskAccountFutureVolumeControl_table_length"]', function () {
   	setTimeout(function(){
   		var myfilter = document.getElementsByClassName("backFilter");
       	hideAfterFilter($rootScope.filterEntity,myfilter);
   	})
   });	
    /*$(document).ready(function(){
    	//$scope.showTableInit();
 	   setTimeout(function(){
 		   var myfilter = document.getElementsByClassName("backFilter");
 	       hideAfterFilter($rootScope.filterEntity,myfilter);
 	   },"100")
 	   setTimeout(function(){
 		   $scope.riskAccountFutureVolumeAddShow = true;
 		   $scope.$apply();
 	   },"100")
    }); */
	//保存
	$scope.riskAccountSaveData = function(entity){
		layer.load(2, {
	 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
	 	});
		if(!$scope.judgeNum(entity.maxPositionVolumeInstrument)){
			 layer.alert("合约最大持仓量取值必须是[0,10000]之间的整数");
			 layer.closeAll('loading');
	   		 return false;
		}
		if(!$scope.judgeNum(entity.maxKillOrderVolumeInstrument)){
		 layer.alert("合约最大撤单次数取值必须是[0,10000]之间的整数");
		 layer.closeAll('loading');
  		 return false;
		}
		if(!$scope.judgeNum(entity.maxOpenVolumeProduct)){
		 layer.alert("品种最大开仓量取值必须是[0,10000]之间的整数");
		 layer.closeAll('loading');
  		 return false;
		}
		if(entity.riskAccount==null||entity.riskAccount==undefined||entity.riskAccount==""){
			 layer.alert("资产单元不能为空");
			 layer.closeAll('loading');
	  		 return false;
		}
		if(entity.exhangeid_productid==null||entity.exhangeid_productid==undefined||entity.exhangeid_productid==""){
			 layer.alert("品种不能为空");
			 layer.closeAll('loading');
	  		 return false;
		}
		$scope.saveEntity.brokerID = entity.riskAccount.split(":")[0];
		$scope.saveEntity.subAccountID = entity.riskAccount.split(":")[1];
		$scope.saveEntity.exchangeID = entity.exhangeid_productid.split("_")[0];
		$scope.saveEntity.productID = entity.exhangeid_productid.split("_")[1];
		$scope.saveEntity.maxPositionVolumeInstrument = entity.maxPositionVolumeInstrument;
		$scope.saveEntity.maxKillOrderVolumeInstrument = entity.maxKillOrderVolumeInstrument;
		$scope.saveEntity.maxOpenVolumeProduct = entity.maxOpenVolumeProduct;
		$scope.riskAccountFutureVolumeControlService.saveData($scope.saveEntity,function(errCode,errMsg,result){
			if(errCode != 0){
				 layer.alert(errMsg);
				 layer.closeAll('loading');
				 return false;
			}
			$scope.riskAccountFutureVolumControl_table_datas = [];
			if(result != null){
				for(var i=0;i<result.length;i++){
					var temp = [i+1,result[i].brokerID,result[i].brokerName,result[i].subAccountID,result[i].subAccountName,result[i].exchangeID,result[i].productID,
					            result[i].maxPositionVolumeInstrument,result[i].maxKillOrderVolumeInstrument,result[i].maxOpenVolumeProduct,
					            "<a style='cursor:pointer;' class='backFilter riskAccountFutureVolumeUpdateIndex'>[修改]</a>"+ 
					            "<a style='cursor:pointer;' class='backFilter riskAccountFutureVolumeDeleteIndex'>[删除]</a>"
					            ];
					$scope.riskAccountFutureVolumControl_table_datas.push(temp);
				}
				//重绘表格
				destroyDatatable("riskAccountFutureVolumeControl_table");
				$scope.initDataTables("riskAccountFutureVolumeControl_table",$scope.riskAccountFutureVolumControl_table_columns,$scope.riskAccountFutureVolumControl_table_datas);
				layer.alert("保存成功");
				$scope.initText();
				$scope.riskAccountFutureVolumeControlShow = false;//显示设置栏
				$scope.$apply();
		    	layer.closeAll('loading');
			}
		});
	}
	 
	 //点击删除
	 $("body").delegate("#riskAccountFutureVolumeControl_table td .riskAccountFutureVolumeDeleteIndex","click",function(){
	        var table = $("#riskAccountFutureVolumeControl_table").DataTable();
	        var mytr = $(this).parents('tr');
	        var tempArr = table.row(mytr).data();
	        //获得被删除行的信息
	        $scope.delEntity = {};
	        $scope.delEntity.brokerID = tempArr[1];
	        $scope.delEntity.subAccountID = tempArr[3];
	        $scope.delEntity.exchangeID = tempArr[5];
	        $scope.delEntity.productID = tempArr[6];
	        layer.confirm("确定删除该条信息？", {icon: 3}, function (count) {
	        	 layer.load(2, {
			 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
			 	});
	        $scope.riskAccountFutureVolumeControlService.deleteData($scope.delEntity,function(errCode,errMsg,result){
	        	if(errCode !=0){
	        		 layer.alert(errMsg);
					 layer.closeAll('loading');
					 return false;
	        	}
	        	destroyDatatable("riskAccountFutureVolumeControl_table");
	        	$scope.showTableInit(false);
	        	layer.alert("删除成功");
				$scope.initText();
				$scope.riskAccountFutureVolumeControlShow = false;//显示设置栏
				$scope.$apply();
		    	layer.closeAll('loading');
	        });
	 });
	 });
	 
	 //点击修改
	 $("body").delegate("#riskAccountFutureVolumeControl_table td .riskAccountFutureVolumeUpdateIndex","click",function(){
		   $scope.riskAccountFutureVolumeControlEdit = false;//切换保存和修改按钮
		   $scope.riskAccountFutureVolumeControlShow = true;//显示设置栏
		   $scope.riskAccountSelectIsCanUse = true;//下拉框bu可以使用
		   //为选中的行设置选中色
	       if($(this).closest('tr').hasClass("selected")){
	           $(this).closest('tr').removeClass("selected");
	       }
	       else{
	           $("tr.selected").removeClass("selected");
	           $(this).closest('tr').addClass("selected");
	       }
	       //先获得选中的表格，然后获得选中的表格里的被选中的那一列
	       var table = $("#riskAccountFutureVolumeControl_table").DataTable();
	       var tr = $(this).closest('tr');
	       var tempArr = table.row(tr).data();
	       $scope.riskAccountFutureVolumeControlEntity.brokerID = tempArr[1];
	       $scope.riskAccountFutureVolumeControlEntity.riskAccount = tempArr[1]+":"+tempArr[3];
	       $scope.riskAccountFutureVolumeControlEntity.exhangeid_productid = tempArr[5]+"_"+tempArr[6];
	       $scope.riskAccountFutureVolumeControlEntity.maxPositionVolumeInstrument = tempArr[7];
	       $scope.riskAccountFutureVolumeControlEntity.maxKillOrderVolumeInstrument = tempArr[8];
	       $scope.riskAccountFutureVolumeControlEntity.maxOpenVolumeProduct = tempArr[9];
	       $scope.$apply();
	 });
	 
	 //保存修改
	 $scope.riskAccountUpdateData = function(entity){
			layer.load(2, {
		 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
		 	});
			if(!$scope.judgeNum(entity.maxPositionVolumeInstrument)){
				 layer.alert("合约最大持仓量取值必须是[0,10000]之间的整数");
				 layer.closeAll('loading');
		   		 return false;
			}
			if(!$scope.judgeNum(entity.maxKillOrderVolumeInstrument)){
			 layer.alert("合约最大撤单次数取值必须是[0,10000]之间的整数");
			 layer.closeAll('loading');
	  		 return false;
			}
			if(!$scope.judgeNum(entity.maxOpenVolumeProduct)){
			 layer.alert("品种最大开仓量取值必须是[0,10000]之间的整数");
			 layer.closeAll('loading');
	  		 return false;
			}
			
			$scope.updateEntity.brokerID = entity.riskAccount.split(":")[0];
			$scope.updateEntity.subAccountID = entity.riskAccount.split(":")[1];
			$scope.updateEntity.exchangeID = entity.exhangeid_productid.split("_")[0];
			$scope.updateEntity.productID = entity.exhangeid_productid.split("_")[1];
			$scope.updateEntity.maxPositionVolumeInstrument = entity.maxPositionVolumeInstrument;
			$scope.updateEntity.maxKillOrderVolumeInstrument = entity.maxKillOrderVolumeInstrument;
			$scope.updateEntity.maxOpenVolumeProduct = entity.maxOpenVolumeProduct;
			$scope.riskAccountFutureVolumeControlService.updateData($scope.updateEntity,function(errCode,errMsg,result){
				if(errCode != 0){
					 layer.alert(errMsg);
					 layer.closeAll('loading');
					 return false;
				}
				$scope.riskAccountFutureVolumControl_table_datas = [];
				if(result != null){
					for(var i=0;i<result.length;i++){
						var temp = [i+1,result[i].brokerID,result[i].brokerName,result[i].subAccountID,result[i].subAccountName,result[i].exchangeID,result[i].productID,
						            result[i].maxPositionVolumeInstrument,result[i].maxKillOrderVolumeInstrument,result[i].maxOpenVolumeProduct,
						            "<a style='cursor:pointer;' class='backFilter riskAccountFutureVolumeUpdateIndex'>[修改]</a>"+ 
						            "<a style='cursor:pointer;' class='backFilter riskAccountFutureVolumeDeleteIndex'>[删除]</a>"
						            ];
						$scope.riskAccountFutureVolumControl_table_datas.push(temp);
					}
					//重绘表格
					destroyDatatable("riskAccountFutureVolumeControl_table");
					$scope.initDataTables("riskAccountFutureVolumeControl_table",$scope.riskAccountFutureVolumControl_table_columns,$scope.riskAccountFutureVolumControl_table_datas);
					layer.alert("修改成功");
					$scope.initText();
					$scope.riskAccountFutureVolumeControlShow = false;//显示设置栏
					$scope.$apply();
			    	layer.closeAll('loading');
				}
			});
		}
})