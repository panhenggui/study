/**
 * @author dell
 *期货数量控制
 */
myapp.controller('futureVolumeControlController',function($scope,$rootScope) {
	$scope.riskFutureVolumeControlService = new com.quantdo.orgClear.service.RiskFutureVolumeControlService();
	//设置按钮的名称
	var constant_temp = new com.quantdo.orgClear.constant.ClearConstants();
	$scope.futureVolumeControl_save = constant_temp.buttonName.saveData;//保存
	$scope.futureVolumeControl_update = constant_temp.buttonName.updateData;//修改
	$scope.futureVolumeControl_setPara = constant_temp.buttonName.setPara;//重置
	$scope.futureVolumeControl_resetPara = constant_temp.buttonName.resetPara;//取消修改
	$scope.futureVolumeControlEdit = true;//切换保存和修改按钮
	$scope.futureVolumeControlShow = false;//显示设置栏
	$scope.selectIsCanUse = false;//下拉框可以使用
	$scope.futureVolumeControlEntity = {};
	$scope.exchangeAndProducts = {};
	$scope.saveEntity = {brokerID:"",fundID:"",exchangID:"",productID:"",maxPositionVolumeInstrument:"",maxKillOrderVolumeInstrument:"",maxOpenVolumeProduct:""};
	$scope.updateEntity = {brokerID:"",fundID:"",exchangID:"",productID:"",maxPositionVolumeInstrument:"",maxKillOrderVolumeInstrument:"",maxOpenVolumeProduct:""};
	//初始化表格数据
    $scope.futureVolumControl_table_datas = [];
    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"futureVolumeControl_tabCallBackFunc");
    $scope.futureVolumeControl_tabCallBackFunc = tabCallBackFunc;
	//主页面表格表头
    $scope.futureVolumControl_table_columns = [
				        { title: "序号"},
				        { title: "机构代码",visible:false},
				        { title: "基金产品",visible:false},
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
            "aoColumnDefs": [
                             { "sWidth": "36%", "aTargets": [ 1 ] }
            ],
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
    $scope.futureVolumControl_table_datas = [];
    $scope.initDataTables("futureVolumeControl_table",$scope.futureVolumControl_table_columns,$scope.futureVolumControl_table_datas);
    //获得下拉框数据
    $scope.riskFutureVolumeControlService.getProductList(sessionStorage.listBrokerID,sessionStorage.listFundID,function(result){
    	$scope.exchangeAndProducts = {};
    	if(result != null && result.length>0){
    		$scope.exchangeAndProducts = result;
    		$scope.futureVolumeControlEntity.exhangeid_productid = result[0].groupID;
    		$scope.$apply();
    	}
    });
    
    //对输入框中的内容进行校验
    $scope.futureVolumeControlnumberControl = function(index){
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
    	/*if(index.length >1 && index[0] == 0){
    		return false;
    	}*/
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
    	$scope.futureVolumeControlEntity.maxPositionVolumeInstrument = "0";
    	$scope.futureVolumeControlEntity.maxKillOrderVolumeInstrument = "0";
    	$scope.futureVolumeControlEntity.maxOpenVolumeProduct = "0";
    }
    $scope.initText();
    
    //点击新增
    $scope.showFutureVolumeControlDetail = function(){
    	$scope.initText();
    	$scope.futureVolumeControlEdit = true;//切换保存和修改按钮
		$scope.futureVolumeControlShow = true;//显示设置栏
		$scope.selectIsCanUse = false;//下拉框可以使用
    }
    
    //点击重置
    $scope.repeatData = function(){
    	$scope.initText();
    	$scope.futureVolumeControlEdit = true;//切换保存和修改按钮
		$scope.futureVolumeControlShow = true;//显示设置栏
		$scope.selectIsCanUse = false;//下拉框可以使用
    }
    
    //点击取消修改
    $scope.giveUpUpdate = function(){
		$scope.futureVolumeControlShow = false;//显示设置栏
    }
    //进入页面初始化
    $scope.futureVolumeAddButtonIsShow = false;
    $scope.showTableInit = function(isControl){
    $scope.riskFutureVolumeControlService.findData(sessionStorage.listBrokerID,sessionStorage.listFundID,function(result){
    	$scope.futureVolumControl_table_datas = [];
    	if(result != null){
    		for(var i=0;i<result.length;i++){
				var temp = [i+1,result[i].brokerID,result[i].fundID,result[i].exchangeID,result[i].productID,
				            result[i].maxPositionVolumeInstrument,result[i].maxKillOrderVolumeInstrument,result[i].maxOpenVolumeProduct,
				            "<a style='cursor:pointer;' name='RiskFutureVolumeControlService.updateData' class='futureVolumeUpdateIndex backFilter'>[修改]</a>"+ 
				            "<a style='cursor:pointer;' name='RiskFutureVolumeControlService.deleteData' class='futureVolumeDeleteIndex backFilter'>[删除]</a>"
				            ];
				$scope.futureVolumControl_table_datas.push(temp);
			}
    		destroyDatatable("futureVolumeControl_table");
			$scope.initDataTables("futureVolumeControl_table",$scope.futureVolumControl_table_columns,$scope.futureVolumControl_table_datas);
    	}
    	if(isControl){
		  var myfilter = document.getElementsByClassName("backFilter");
          hideAfterFilter($rootScope.filterEntity,myfilter);
          $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    	}
    	 $scope.futureVolumeAddButtonIsShow = true;
         $scope.$apply();
    });
    }
    
    $scope.showTableInit(true);
    
    $('#futureVolumeControl_table').on( 'page.dt', function () {
    	setTimeout(function(){
    		var myfilter = document.getElementsByClassName("backFilter");
        	hideAfterFilter($rootScope.filterEntity,myfilter);
    	})
    }); 
    
    $("body").delegate('#futureVolumeControl_table_length div').on('change', 'select[name="futureVolumeControl_table_length"]', function () {
    	setTimeout(function(){
    		var myfilter = document.getElementsByClassName("backFilter");
        	hideAfterFilter($rootScope.filterEntity,myfilter);
    	})
    });
	/*//控制按钮权限
    $(document).ready(function(){
		$scope.showTableInit();
		setTimeout(function(){
            var myfilter = document.getElementsByClassName("backFilter");
            hideAfterFilter($rootScope.filterEntity,myfilter);
            $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
            $scope.futureVolumeAddShow = true;
            $scope.$apply();
		 },"100")
        setTimeout(function(){
            $scope.futureVolumeAddShow = true;
            $scope.$apply();
        },"100")
    });*/
	//保存
	$scope.saveData = function(entity){
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
		if(entity.exhangeid_productid==null||entity.exhangeid_productid==undefined||entity.exhangeid_productid==""){
			 layer.alert("品种不能为空");
			 layer.closeAll('loading');
	  		 return false;
		}
		$scope.saveEntity.brokerID = sessionStorage.listBrokerID;
		$scope.saveEntity.fundID = sessionStorage.listFundID;
		$scope.saveEntity.exchangeID = entity.exhangeid_productid.split("_")[0];
		$scope.saveEntity.productID = entity.exhangeid_productid.split("_")[1];
		$scope.saveEntity.maxPositionVolumeInstrument = entity.maxPositionVolumeInstrument;
		$scope.saveEntity.maxKillOrderVolumeInstrument = entity.maxKillOrderVolumeInstrument;
		$scope.saveEntity.maxOpenVolumeProduct = entity.maxOpenVolumeProduct;
		$scope.riskFutureVolumeControlService.saveData($scope.saveEntity,function(errCode,errMsg,result){
			if(errCode != 0){
				 layer.alert(errMsg);
				 layer.closeAll('loading');
				 return false;
			}
			$scope.futureVolumControl_table_datas = [];
			if(result != null){
				for(var i=0;i<result.length;i++){
					var temp = [i+1,result[i].brokerID,result[i].fundID,result[i].exchangeID,result[i].productID,
					            result[i].maxPositionVolumeInstrument,result[i].maxKillOrderVolumeInstrument,result[i].maxOpenVolumeProduct,
					            "<a style='cursor:pointer;' class='backFilter futureVolumeUpdateIndex' name='RiskFutureVolumeControlService.updateData'>[修改]</a>"+ 
					            "<a style='cursor:pointer;' class='backFilter futureVolumeDeleteIndex' name='RiskFutureVolumeControlService.deleteData'>[删除]</a>"
					            ];
					$scope.futureVolumControl_table_datas.push(temp);
				}
				//重绘表格
				destroyDatatable("futureVolumeControl_table");
				$scope.initDataTables("futureVolumeControl_table",$scope.futureVolumControl_table_columns,$scope.futureVolumControl_table_datas);
				layer.alert("保存成功");
				$scope.initText();
				$scope.futureVolumeControlShow = false;//显示设置栏
				$scope.$apply();
		    	layer.closeAll('loading');
			}
		});
	}
    
	//点击删除
	 $("body").delegate("#futureVolumeControl_table td .futureVolumeDeleteIndex","click",function(){
	        var table = $("#futureVolumeControl_table").DataTable();
	        var mytr = $(this).parents('tr');
	        var tempArr = table.row(mytr).data();
	        //获得被删除行的数据
	        //获得被删除行的信息
	        $scope.delEntity = {};
	        $scope.delEntity.brokerID = tempArr[1];
	        $scope.delEntity.fundID = tempArr[2];
	        $scope.delEntity.exchangeID = tempArr[3];
	        $scope.delEntity.productID = tempArr[4];
	        layer.confirm("确定删除该条信息？", {icon: 3}, function (count) {
	        	 layer.load(2, {
			 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
			 	});
	        $scope.riskFutureVolumeControlService.deleteData(sessionStorage.listBrokerID,$scope.delEntity,function(errCode,errMsg,result){
	        	if(errCode !=0){
	        		 layer.alert(errMsg);
					 layer.closeAll('loading');
					 return false;
	        	}
	        	destroyDatatable("futureVolumeControl_table");
	        	$scope.showTableInit(false);
	        	layer.alert("删除成功");
				$scope.initText();
				$scope.futureVolumeControlShow = false;//显示设置栏
				$scope.$apply();
		    	layer.closeAll('loading');
	        });
	 });
	 });
	 //点击修改
	 $("body").delegate("#futureVolumeControl_table td .futureVolumeUpdateIndex","click",function(){
		   $scope.futureVolumeControlEdit = false;//切换保存和修改按钮
		   $scope.futureVolumeControlShow = true;//显示设置栏
		   $scope.selectIsCanUse = true;//下拉框可以使用
		   //为选中的行设置选中色
	       if($(this).closest('tr').hasClass("selected")){
	           $(this).closest('tr').removeClass("selected");
	       }
	       else{
	           $("tr.selected").removeClass("selected");
	           $(this).closest('tr').addClass("selected");
	       }
	       //先获得选中的表格，然后获得选中的表格里的被选中的那一列
	       var table = $("#futureVolumeControl_table").DataTable();
	       var tr = $(this).closest('tr');
	       var tempArr = table.row(tr).data();
	       $scope.futureVolumeControlEntity.brokerID = tempArr[1]
	       $scope.futureVolumeControlEntity.exhangeid_productid = tempArr[3]+"_"+tempArr[4];
	       $scope.futureVolumeControlEntity.maxPositionVolumeInstrument = tempArr[5];
	       $scope.futureVolumeControlEntity.maxKillOrderVolumeInstrument = tempArr[6];
	       $scope.futureVolumeControlEntity.maxOpenVolumeProduct = tempArr[7];
	       $scope.$apply();
	 });
	 
	 //保存修改
	 $scope.updateData = function(entity){
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
			
			$scope.updateEntity.brokerID = entity.brokerID;
			$scope.updateEntity.fundID = sessionStorage.listFundID;
			$scope.updateEntity.exchangeID = entity.exhangeid_productid.split("_")[0];
			$scope.updateEntity.productID = entity.exhangeid_productid.split("_")[1];
			$scope.updateEntity.maxPositionVolumeInstrument = entity.maxPositionVolumeInstrument;
			$scope.updateEntity.maxKillOrderVolumeInstrument = entity.maxKillOrderVolumeInstrument;
			$scope.updateEntity.maxOpenVolumeProduct = entity.maxOpenVolumeProduct;
			$scope.riskFutureVolumeControlService.updateData(sessionStorage.listBrokerID,$scope.updateEntity,function(errCode,errMsg,result){
				if(errCode != 0){
					 layer.alert(errMsg);
					 layer.closeAll('loading');
					 return false;
				}
				$scope.futureVolumControl_table_datas = [];
				if(result != null){
					for(var i=0;i<result.length;i++){
						var temp = [i+1,result[i].brokerID,result[i].fundID,result[i].exchangeID,result[i].productID,
						            result[i].maxPositionVolumeInstrument,result[i].maxKillOrderVolumeInstrument,result[i].maxOpenVolumeProduct,
						            "<a style='cursor:pointer;' class='backFilter futureVolumeUpdateIndex' name='RiskFutureVolumeControlService.updateData'>[修改]</a>"+ 
						            "<a style='cursor:pointer;' class='backFilter futureVolumeDeleteIndex' name='RiskFutureVolumeControlService.deleteData'>[删除]</a>"
						            ];
						$scope.futureVolumControl_table_datas.push(temp);
					}
					//重绘表格
					destroyDatatable("futureVolumeControl_table");
					$scope.initDataTables("futureVolumeControl_table",$scope.futureVolumControl_table_columns,$scope.futureVolumControl_table_datas);
					layer.alert("修改成功");
					$scope.initText();
					$scope.futureVolumeControlShow = false;//显示设置栏
					$scope.$apply();
			    	layer.closeAll('loading');
				}
			});
		}
   
})