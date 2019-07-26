myapp.controller('AfterHourTradeController', function($scope,
		$timeout,$rootScope) {
	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
	
	$scope.afterHourTradeService = new com.quantdo.orgClear.service.afterHourTradeService();
	
	$scope.listEntitys = {};
	$scope.exchangeDatas = {};// 交易所信息
	$scope.queryEntity = {};
	//以后兼容其他时候下拉筛选 不可写死
	$scope.ModalEntity = {};
	$scope.isUpdate = false;
	$scope.isChecked = false;
	$scope.isQuery = false;
	$scope.beforeSettle = false;
	$scope.entitys = [];
	$scope.afterHourTradeDataset = [];
	
	$scope.tradeTypes = clearConstant.tradeTypes;		//投保标志
    $scope.offsetFlags = clearConstant.offsetFlag;		//开平
	
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$scope.afterHourTrade_query = isShow("afterHourTrade_query");
	$scope.afterHourTrade_update = isShow("afterHourTrade_update");
	
	//判断是否已结算
	$scope.afterHourTradeService.isSettled(function(result){
		if(result){
			$scope.beforeSettle = false;
		}else{
			$scope.beforeSettle = true;
			layer.msg('当前交易日未结算，请结算后重新打开该页面', {
				icon : 2
			});
		}
	});
	
	queryInstClientID(function(result){
    	if(result != undefined){
    		$scope.noInst = true;
    	}else{
    		$scope.noInst = false;
    	}
    });
	
	//初始化所属机构
	$scope.instClientList = null;
    getInstClientQueryConditionList(function(result){
    	$scope.instClientList = angular.copy(result);
    	if($scope.instClientList.length > 1){
    		$scope.queryEntity.instClientID = "";
    	}else{
    		$scope.queryEntity.instClientID = $scope.instClientList[0].instClientID;
    	}
    });
    	
    //资金账号
    $scope.querySubCapitalAccounts = [];
    $scope.changeInstClient = function(){
		//查询资产单元
    	 $scope.strategys = [];
		findBySubCapitalAccountInfo({"instClientID":$scope.queryEntity.instClientID}, function(result){
			$scope.querySubCapitalAccounts = angular.copy(result);
			$scope.queryEntity.subAccountId = "";
			$scope.strategyService.findByQuery(function (result) {
		        $scope.strategys = result;
		        $scope.$apply();
		    }, {  instClientID : $scope.queryEntity.instClientID});
			$scope.$apply();
		});
		
	}
    
    $scope.changeInstClient();
    
    //初始化策略信息
    $scope.strategyService = new com.quantdo.orgClear.service.strategyService();
    $scope.strategys = [];
    $scope.strategyService.findByQuery(function (result) {
        $scope.strategys = result;
        $scope.$apply();
    }, {});
    
	//定义固定列头
    $scope.afterHourTrade_columns = [
        {title:"<a class='click-choice-all'></a>"},
        {title:"id",visible:false},
        {title: "结算日期"},
		{title: "成交编号"},
		{title: "资产单元"},
		{title: "交易所代码"},
		{title: "所属机构"},
		{title: "策略代码"},
		{title: "策略批次"},
		{title: "合约代码"},
		{title: "买卖方向"},
		{title: "开平标志"},
		{title: "投保标志"}
	];

    // 根据页面条件查询
    $scope.find = function () {  	
    	$scope.isQuery = true;
		$scope.afterHourTradeDataset = [];
		$scope.listEntitys = [];
		$scope.afterHourTradeService.findByQuery(function(result){			
			$scope.listEntitys = result;
	    	//更新表格对应的数据集
	    	var con = result;
	    	var tempArray = new Array();
	        for(var i = 0; i<con.length;i++){
	        	var tempArr = ["<a class='click-choice-one'></a>",con[i].id,con[i].tradeDate, con[i].tradeId, con[i].subAccountId,con[i].exchangeId,
	        	               $scope.transInstClient(con[i].instClientID),con[i].strategyID,con[i].strategyBatch, 
	        	               con[i].instrumentId,$scope.transDirection(con[i].direction),$scope.transOffsetFlag(con[i].offsetFlag)
                               ,$scope.transTradeType(con[i].hedgeFlag)];
				    $scope.afterHourTradeDataset.push(tempArr);
	            }
	   
		    $scope.afterHourTradeTable.clear().draw();
		    $scope.afterHourTradeTable.rows.add($scope.afterHourTradeDataset).draw();

			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		},$scope.queryEntity);
    };
    
	$timeout(function() {
		$scope.find();
    }, 1000);
    
    $scope.transInstClient = function (instClientID) {
    	for(var i = 0;i < $scope.instClientList.length; i++){
    		if($scope.instClientList[i].instClientID == instClientID){
    			return $scope.instClientList[i].instClientAbbrName;
    		}
    	}
    }
    
    $scope.transTradeType = function(key){
    	for(var i = 0;i < $scope.tradeTypes.length;i++){
    		if($scope.tradeTypes[i].key == key){
    			return $scope.tradeTypes[i].text;
    		}
    	}
    }
    
    $scope.transOffsetFlag = function (offsetFlag){
    	for(var i = 0;i < $scope.offsetFlags.length;i++){
			if($scope.offsetFlags[i].key == offsetFlag){
				return $scope.offsetFlags[i].text;
			}
		}
    }
    
    $scope.transDirection = function(key){
    	if(key=='0'){
    		return "买";
    	}else if(key=='1'){
    		return "卖";
    	}else{
    		return "";
    	}
    }
    
    // 表单验证
	function formValidateReset() {
		//$scope.myForm.subAccountId.$setPristine();
		$scope.myForm.strategyID.$setPristine();
		$scope.myForm.strategyBatch.$setPristine();
	}
    
    // 批量维护
	$scope.initUpdateParam = function() {		
		$scope.entitys = [];
		$scope.entitys = $scope.getEntitys();
		var flag = true;
		if ($scope.entitys.length > 0) {
			for(var i=1;i<$scope.entitys.length;i++){
				if($scope.entitys[0].instClientID != $scope.entitys[i].instClientID){
					flag = false;
					break;
				}
				
			}
			if(flag){
				$scope.ModalEntity.strategyBatch ="";	 
				$scope.ModalEntity.strategyID
				$scope.strategysForModal =[];
				$scope.strategyService.findByQuery(function (result) {
					if(result !=null && result !=undefined && result.length > 0){
						$scope.strategysForModal = result;
				        $scope.ModalEntity.strategyID =result[0].strategyID;
				        //$scope.ModalEntity.subAccountId = $scope.entitys[0].subAccountId;
				        $scope.isUpdate = true;
				        $scope.isChecked = false;
				        $scope.$apply();
				        formValidateReset();   
				        $("#afterHourTradeModal").modal("show");
					} else {
						layer.msg('该机构下没有可用的策略信息，请先维护策略信息！', {
							icon : 2
						});
					}
			        
			    }, { isActive :"1", instClientID: $scope.entitys[0].instClientID});
			}else{
				layer.msg('已选择的成交单的机构必须一致！', {
					icon : 2
				});
			}
		} else {
			layer.msg('请选择要维护的成交单！', {
				icon : 2
			});
		}
	};

	// 保存批量维护信息
    $scope.save = function (entity) {

    	
    	
		if(entity.strategyID != ""){
			for(var i=0;i<$scope.entitys.length;i++){
				$scope.entitys[i].strategyID = entity.strategyID;
			}
		}
		if(entity.strategyBatch != ""){
			
			
			  if(!/^[0-9]*$/.test(entity.strategyBatch)){
				  layer.msg('策略批次必须为数字！', {
						icon : 2
					});
					return false;
			    }
			
			for(var i=0;i<$scope.entitys.length;i++){
				$scope.entitys[i].strategyBatch = entity.strategyBatch;
			}
		}
		$scope.afterHourTradeService.update(function (result) {
        	if(result != null){
        		layer.msg("批量修改成功",{icon: 1});
		       	$scope.find();
		       	// 关闭窗口
		        $("#afterHourTradeModal").modal("hide");
        	}else{
        		layer.msg("批量修改失败",{icon: 2});
        	}
	    }, $scope.entitys);
    	
    };
	
	//获取需要批量维护的集合
	$scope.getEntitys = function(){
		var tmpEntitys = [];
		//复选框选中列ID
	  	$scope.ids = new Array();
	  	$("#afterHourTrade_dynamic_table a").each(function(){
	  		var flag = $(this).hasClass("clicked-choice-one");
	  		if(flag){
				var mytr = $(this).parents("tr");
				var tempArr = $scope.afterHourTradeTable.row(mytr).data();
				var id = tempArr[1];//获取该行对应的id
				$scope.ids.push(id);
			}
	    });
	  	for(var i=0;i<$scope.listEntitys.length;i++){
			for(var j=0;j<$scope.ids.length;j++){
				if($scope.listEntitys[i].id==$scope.ids[j]){
					tmpEntitys.push($scope.listEntitys[i]);
				}
			}
		}		
		return tmpEntitys;
	}
    
    $("body").undelegate("#afterHourTrade_dynamic_table td a","click");
    $("body").delegate("#afterHourTrade_dynamic_table td a","click",function(){
        if($(this).hasClass("click-choice-one")){
            $(this).removeClass("click-choice-one");
            $(this).addClass("clicked-choice-one");
        }
        else{
            $(this).addClass("click-choice-one");
            $(this).removeClass("clicked-choice-one");
        }

    });
    $("body").undelegate(".dataTables_scrollHeadInner th a","click");
    $("body").delegate(".dataTables_scrollHeadInner th a","click",function(){
        if($(this).hasClass("click-choice-all")){
            $(this).removeClass("click-choice-all");
            $(this).addClass("clicked-choice-all");
            for(var i=0;i<$(".dataTables_scrollBody td a").length;i++){
                if($($(".dataTables_scrollBody td a")[i]).hasClass("click-choice-one")){
                    $($(".dataTables_scrollBody td a")[i]).removeClass("click-choice-one");
                    $($(".dataTables_scrollBody td a")[i]).addClass("clicked-choice-one");
                }
            }
        }
        else{
            $(this).addClass("click-choice-all");
            $(this).removeClass("clicked-choice-all");
            for(var i=0;i<$(".dataTables_scrollBody td a").length;i++){
                if($($(".dataTables_scrollBody td a")[i]).hasClass("clicked-choice-one")){
                    $($(".dataTables_scrollBody td a")[i]).removeClass("clicked-choice-one");
                    $($(".dataTables_scrollBody td a")[i]).addClass("click-choice-one");
                }
            }
        }

    });
    
    //初始化
    $(document).ready(function() {
    	//会话列表初始化
		$scope.afterHourTradeTable = $('#afterHourTrade_dynamic_table').DataTable( {
			data : $scope.afterHourTradeDataset,
			columns :$scope.afterHourTrade_columns,
			dom: 'rt<"bottom"iplB>',
			buttons: []
		});
    });
    
});

//回车事件
function tradeKeyup(e, o) {
	var appElement = document.querySelector('[ng-controller=afterHourTradeController]');
    var $scope = angular.element(appElement).scope();
    if (e.keyCode == 13) {
    	var tabNum = o.getAttribute("tab");
    	var tag =false;
    	tag = getTradeTagByTab(parseInt(tabNum) + 1);
    	if (tag) {
    		tag.focus();
	        if (tag.tagName == "INPUT") {
	            tag.select();
	        }
	        return false;
    	}
    }
}