myapp.controller('OperExerciseOrderController', function ($scope, $timeout,$rootScope) {

    $scope.operExerciseOrderService = new com.quantdo.orgClear.service.operExerciseOrderService();

    // 按钮权限
    $scope.operExerciseOrder_query = isShow("operExerciseOrder_query");
    $scope.operExerciseOrder_export = isShow("operExerciseOrder_export");
    
    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;

    $scope.queryEntity = {};
    $scope.listEntitys = [];
    $scope.actionTypes = clearConstant.actionType;// 执行类型
    $scope.closeFlags = clearConstant.closeFlag;// 对冲类型
    $scope.execResultTypes = clearConstant.execResultType;// 执行结果
    $scope.traderTypes = clearConstant.tradeTypes;// 交易类型

    // 查询机构
    $scope.instClientList = [];
    getInstClientQueryConditionList(function(result){
    	$scope.instClientList = angular.copy(result);
    	if($scope.instClientList.length > 1){
    		$scope.queryEntity.brokerageFirmID = "";
    	}else{
    		$scope.queryEntity.brokerageFirmID = $scope.instClientList[0].instClientID;
    	}
        $scope.changeInstClient();
    	$scope.$apply();
    });
    
    queryInstClientID(function(result){
    	if(result != undefined){
    		$scope.noInst = true;
    	}else{
    		$scope.noInst = false;
    	}
    });

    $scope.queryAccountEntitys = [];
    $scope.changeInstClient = function(){
        //查询资金账号
        findCapitalAccountByQuery({"brokerageFirmID":$scope.queryEntity.brokerid}, function(result){
            $scope.queryAccountEntitys = result;
            $scope.$apply();
        });
    }

    $scope.exchangeDatas = {};
    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
        $scope.$apply();
    });

    $scope.isQuery = false;
    $scope.operExerciseOrderDataset = [];
    // 查询(前台分页)
    $scope.find = function(queryEntity){
        $scope.isQuery = true;
        //更新表格对应的数据集
        $scope.operExerciseOrderService.findByQuery(function (result) {
            //将数据集赋值为空
            $scope.operExerciseOrderDataset = [];
            var con = result;
            for(var i = 0; i<con.length;i++){
                var tempArr = [(i+1),con[i].id,$scope.transInstClient(con[i].brokerageFirmID),con[i].investorID,con[i].exchID,con[i].instrumentID,$scope.transActionType(con[i].actionType),con[i].volume,
					$scope.transTradeType(con[i].hedgeFlag),$scope.transCloseFlag(con[i].closeFlag),$scope.transExecResultType(con[i].execResultType)];
                $scope.operExerciseOrderDataset.push(tempArr);
                con[i].index = i+1;
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.operExerciseOrderTable.clear().draw();
            $scope.operExerciseOrderTable.rows.add($scope.operExerciseOrderDataset).draw();
            $scope.isQuery = false;
            $scope.$apply();
        }, queryEntity);
    }

    $timeout(function() {
        $scope.find($scope.queryEntity);
    }, 500);

    //机构名称转换
    $scope.transInstClient = function (instClientID) {
        for(var i = 0;i < $scope.instClientList.length; i++){
            if($scope.instClientList[i].instClientID == instClientID){
                return $scope.instClientList[i].instClientAbbrName;
            }
        }
        return "";
    }

    //执行类型
    $scope.transActionType = function (flag){
        for(var i = 0;i < $scope.actionTypes.length;i++){
            if($scope.actionTypes[i].key == flag){
                return $scope.actionTypes[i].text;
            }
        }
        return "";
    }

    //交易类型
    $scope.transTradeType = function (tradeType){
        for(var i = 0;i < $scope.traderTypes.length;i++){
            if($scope.traderTypes[i].key == tradeType){
                return $scope.traderTypes[i].text;
            }
        }
        return "";
    }

    //执行后自动对冲期货持仓
    $scope.transCloseFlag = function (flag){
        for(var i = 0;i < $scope.closeFlags.length;i++){
            if($scope.closeFlags[i].key == flag){
                return $scope.closeFlags[i].text;
            }
        }
        return "";
    }

    //执行结果
    $scope.transExecResultType = function (flag){
        for(var i = 0;i < $scope.execResultTypes.length;i++){
            if($scope.execResultTypes[i].key == flag){
                return $scope.execResultTypes[i].text;
            }
        }
        return "";
    }

	//定义实时行权申请查询的固定列头
    $scope.operExerciseOrder_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "所属机构"},
        {title: "资金账号"},
        {title: "交易所代码"},
        {title: "合约代码"},
        {title: "执行类型"},
        {title: "申请手数"},
        {title: "投保标志"},
        {title: "执行后自动对冲期货持仓"},
        {title: "执行结果"}
    ];

    //初始化
	$(document).ready(function() {
        $scope.operExerciseOrderTable = $('#operExerciseOrder_dynamic_table').DataTable( {
            data : $scope.operExerciseOrderDataset,
            columns :$scope.operExerciseOrder_columns,
            dom: 'rt<"bottom"iplB>',
            buttons: [
            ]
        });
	});

	 //导出excel
    $scope.exportExcelOperExerciseOrder = function (queryEntity) {

		framework.file.export("实时行权申请查询.xls",'excel',{
			entityKey:['instClientAbbrName','investorID','exchID','instrumentID','actionType','volume','hedgeFlag','closeFlag','execResultType'],
			headerKey:['所属机构','资金账号','交易所代码','合约代码','执行类型','申请手数','投保标志','执行后自动对冲期货持仓','执行结果'],
			styles:['plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText'],
			title:"实时行权申请查询",
			dicMap:{actionType:{'1':'执行','2':'放弃'},hedgeFlag:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"},closeFlag:{'0':'自动平仓','1':'免于自动平仓'},execResultType:{'n':'没有执行','c':'已经取消','0':'执行成功','1':'期权持仓不够',
                '2':'资金不够','3':'会员不存在','4':'客户不存在','6':'合约不存在','7':'没有执行权限','8':'不合理的数量','9':'没有足够的历史成交','a':'未知'}}
		},"operExerciseOrderService","exportExcelOperExerciseOrder",queryEntity);

    };
    
});

