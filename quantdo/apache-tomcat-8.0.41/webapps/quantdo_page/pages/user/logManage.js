myapp.controller('LogManageController', function ($scope, $timeout,$rootScope) {

	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});	
    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	// 按钮权限
	$scope.logManage_query = isShow("logManage_query");
	
	$scope.logManageService = new com.quantdo.orgClear.service.LogManageService;
	//2、定义页面数据模型
    $scope.queryEntity = {};    //实际查询对象
    $scope.queryMenuEntitys = [];			//查询功能菜单下拉框内容
    $scope.queryEntity.beginDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());      
    $scope.operTypes = clearConstant.operTypes;	//
    
    
    $scope.transOperType = function (operType){
    	for(var i = 0;i < $scope.operTypes.length;i++){
			if($scope.operTypes[i].key == operType){
				return $scope.operTypes[i].text;
			}
		}
    }
	$scope.listEntitys = [];
	$scope.menu = [];

	 //经济公司类型
    $scope.brokerType = '';
    queryAmType(function (result) {
        $scope.brokerType = result;
        $scope.$apply();
    });

	
	getAllMenuList(function (result) {
		var tem=[];
		$scope.tmp=[];
		$scope.tmp =result;
		if($scope.brokerType=="2"){
			angular.forEach($scope.tmp, function (data, index, array) {
				if(data.rightName.indexOf("一级") >0){
					//排除一级菜单
					tem.push(index);
				}
				else if(data.rightName.indexOf("二级") >0){
					//排除二级菜单
					tem.push(index);
				}else {
					if ("大边产品组管理" == data.rightName) {
			        	tem.push(index);
			        }
			        if ("不参与大边合约管理" == data.rightName) {
			        	tem.push(index);
			        }
			        if ("客户持仓导入" == data.rightName) {
			        	tem.push(index);
			        }
			        if ("产品级风控" == data.rightName) {
			        	tem.push(index);
			        }
			        if ("资金账户级风控" == data.rightName) {
			        	tem.push(index);
			        }
			        if ("产品级风控界面" == data.rightName) {
			        	tem.push(index);
			        }
				}
		        
		    });
			
		}else{
			angular.forEach($scope.tmp, function (data, index, array) {
				if(data.rightName.indexOf("一级") > 0){
					//排除一级
					tem.push(index);
				}
				else if(data.rightName.indexOf("二级") >0){
					//排除二级菜单
					tem.push(index);
				}else {
					if ("客户流量实时监控" == data.rightName) {
						tem.push(index);
			        }
			        if ("产品级风控" == data.rightName) {
			        	tem.push(index);
			        }
			        if ("资金账户级风控" == data.rightName) {
			        	tem.push(index);
			        }
			        if ("产品级风控界面" == data.rightName) {
			        	tem.push(index);
			        }
				}
		        
		    });
		}
		//tem 排序 从小到大
        tem.sort();
        //tem 从尾 删除
        for (var j=1;tem.length>=j;j++) {
        	$scope.tmp.splice(tem[tem.length-j], 1);
		}
		$scope.queryMenuEntitys = $scope.tmp;
		$scope.$apply();
	},"");

//	$scope.find = function(entity){
//		// 限制只查业务后台的操作日志
//		entity.operClass = "0";
//		
//		$scope.logManageService.findByContent(function (result) {
//			var tem=[];
//			$scope.tmp=[];
//			$scope.tmp =result;
//			if($scope.brokerType=="2"){
//				angular.forEach($scope.tmp, function (data, index, array) {
//			        if ("大边产品组管理" == data.operFuncDesc) {
//			        	tem.push(index);
//			        }
//			        if ("不参与大边合约管理" == data.operFuncDesc) {
//			        	tem.push(index);
//			        }
//			        if ("客户持仓导入" == data.operFuncDesc) {
//			        	tem.push(index);
//			        }
//			        if ("产品级风控" == data.rightName) {
//			        	tem.push(index);
//			        }
//			        if ("资金账户级风控" == data.rightName) {
//			        	tem.push(index);
//			        }
//			        if ("产品级风控界面" == data.rightName) {
//			        	tem.push(index);
//			        }
//			    });
//				//tem 排序 从小到大
//		        tem.sort();
//		        //tem 从尾 删除
//		        for (var j=1;tem.length>=j;j++) {
//		        	$scope.tmp.splice(tem[tem.length-j], 1);
//				}
//				$scope.listEntitys = $scope.tmp;
//			}else{
//				angular.forEach($scope.tmp, function (data, index, array) {
//			        if ("客户流量实时监控" == data.operFuncDesc) {
//			        	$scope.tmp.splice(index,1);
//			        }
//			        if ("产品级风控" == data.rightName) {
//			        	tem.push(index);
//			        }
//			        if ("资金账户级风控" == data.rightName) {
//			        	tem.push(index);
//			        }
//			        if ("产品级风控界面" == data.rightName) {
//			        	tem.push(index);
//			        }
//			    });
//				$scope.listEntitys = $scope.tmp;
//			}
//			$scope.$apply();
//		}, entity);
//	};

	 //定义产品基础信息的固定列头
    $scope.product_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "机构代码"},
        {title: "操作人"},
        {title: "操作人IP"},
        {title: "操作时间"},
        {title: "操作功能"},
        {title: "操作动作"},
        {title: "操作内容"}
    ]; 
   
    
 // 查询(前台分页)
    $scope.find = function(entity){
    	// 限制只查业务后台的操作日志
		entity.operClass = "0";
    	//更新表格对应的数据集
    	$scope.logManageService.findByContent(function (result) {
    		$scope.productDataset = [];
    		var tem = [];
    		$scope.tmp =result;
    		if($scope.brokerType=="2"){
				angular.forEach($scope.tmp, function (data, index, array) {
			        if ("大边产品组管理" == data.operFuncDesc) {
			        	tem.push(index);
			        }
			        if ("不参与大边合约管理" == data.operFuncDesc) {
			        	tem.push(index);
			        }
			        if ("客户持仓导入" == data.operFuncDesc) {
			        	tem.push(index);
			        }
			        if ("产品级风控" == data.rightName) {
			        	tem.push(index);
			        }
			        if ("资金账户级风控" == data.rightName) {
			        	tem.push(index);
			        }
			        if ("产品级风控界面" == data.rightName) {
			        	tem.push(index);
			        }
			    });
				//tem 排序 从小到大
		        tem.sort();
		        //tem 从尾 删除
		        for (var j=1;tem.length>=j;j++) {
		        	$scope.tmp.splice(tem[tem.length-j], 1);
				}
				$scope.listEntitys = $scope.tmp;
			}else{
				angular.forEach($scope.tmp, function (data, index, array) {
			        if ("客户流量实时监控" == data.operFuncDesc) {
			        	$scope.tmp.splice(index,1);
			        }
			        if ("产品级风控" == data.rightName) {
			        	tem.push(index);
			        }
			        if ("资金账户级风控" == data.rightName) {
			        	tem.push(index);
			        }
			        if ("产品级风控界面" == data.rightName) {
			        	tem.push(index);
			        }
			    });
				$scope.listEntitys = $scope.tmp;
			}
    		var tempArray = new Array();
    		var con = $scope.tmp;
            for(var i = 0; i<con.length;i++){
                var tempArr = [(i+1),con[i].id,con[i].instClientID, con[i].operatorID,con[i].operatorIP,con[i].operateDate.concat(" ").concat(con[i].operateTime)
                               ,con[i].operFuncDesc,$scope.transOperType(con[i].operType),con[i].operContentDesc.replace(/机构【null】/,"机构【全部】")];
	            $scope.productDataset.push(tempArr);
            }
    		
            //重新绘表
            $scope.productTable.clear().draw();
            $scope.productTable.rows.add($scope.productDataset).draw();
        }, entity);  	
    }
    
 // 初始化
    $timeout(function() {
    	  $scope.find($scope.queryEntity);
    }, 500);
 
    
  //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.productTable = $('#logManage_dynamic_table').DataTable( {
    		data : $scope.productDataset,
        	columns :$scope.product_columns,
//        	scrollY: 300,
//          scrollX: true,
            dom: 'rt<"bottom"iplB>',
            
			buttons: [
			   
			]
        } );
    });
    
});
