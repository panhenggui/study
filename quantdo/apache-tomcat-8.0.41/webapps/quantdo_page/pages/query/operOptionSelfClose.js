myapp.controller('OperOptionSelfCloseController', function ($scope, $timeout,$rootScope) {

    $scope.operOptionSelfCloseService = new com.quantdo.orgClear.service.operOptionSelfCloseService();

    // 按钮权限
    $scope.operOptionSelfClose_query = isShow("operOptionSelfClose_query");
    $scope.operOptionSelfClose_export = isShow("operOptionSelfClose_export");
    
    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;

    $scope.queryEntity = {};
    $scope.listEntitys = [];
    $scope.optSelfCloseFlags = clearConstant.optSelfCloseFlag;// 对冲类型
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
        findCapitalAccountByQuery({"brokerageFirmID":$scope.queryEntity.brokerageFirmID}, function(result){
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
    $scope.operOptionSelfCloseDataset = [];
    // 查询(前台分页)
    $scope.find = function(queryEntity){
        $scope.isQuery = true;
        //更新表格对应的数据集
        $scope.operOptionSelfCloseService.findByQuery(function (result) {
            //将数据集赋值为空
            $scope.operOptionSelfCloseDataset = [];
            var con = result;
            for(var i = 0; i<con.length;i++){
                var tempArr = [(i+1),con[i].id,$scope.transInstClient(con[i].brokerageFirmID),con[i].investorID,con[i].exchID,con[i].instrumentID,$scope.transOptSelfCloseFlag(con[i].optSelfCloseFlag),con[i].volume,
					$scope.transTradeType(con[i].hedgeFlag),""];
                $scope.operOptionSelfCloseDataset.push(tempArr);
                con[i].index = i+1;
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.operOptionSelfCloseTable.clear().draw();
            $scope.operOptionSelfCloseTable.rows.add($scope.operOptionSelfCloseDataset).draw();
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

    //交易类型
    $scope.transTradeType = function (tradeType){
        for(var i = 0;i < $scope.traderTypes.length;i++){
            if($scope.traderTypes[i].key == tradeType){
                return $scope.traderTypes[i].text;
            }
        }
        return "";
    }

    //对冲类型
    $scope.transOptSelfCloseFlag = function (flag){
        for(var i = 0;i < $scope.optSelfCloseFlags.length;i++){
            if($scope.optSelfCloseFlags[i].key == flag){
                return $scope.optSelfCloseFlags[i].text;
            }
        }
        return "";
    }

	//定义实时自动对冲申请查询的固定列头
    $scope.operOptionSelfClose_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "所属机构"},
        {title: "资金账号"},
        {title: "交易所代码"},
        {title: "合约代码"},
        {title: "对冲类型"},
        {title: "申请手数"},
        {title: "投保标志"},
        {title: "对冲结果"}
    ];

    //初始化
	$(document).ready(function() {
        $scope.operOptionSelfCloseTable = $('#operOptionSelfClose_dynamic_table').DataTable( {
            data : $scope.operOptionSelfCloseDataset,
            columns :$scope.operOptionSelfClose_columns,
            dom: 'rt<"bottom"iplB>',
            buttons: [
            ]
        });
	});

	 //导出excel
    $scope.exportExceloperOptionSelfClose = function (queryEntity) {

		framework.file.export("实时自动对冲申请查询.xls",'excel',{
			entityKey:['instClientAbbrName','investorID','exchID','instrumentID','optSelfCloseFlag','volume', 'hedgeFlag'],
			headerKey:['所属机构','资金账号','交易所代码','合约代码','对冲类型','申请手数','投保标志','对冲结果'],
			styles:['plainText','plainText','plainText','plainText','plainText','plainText','plainText'],
			title:"实时自动对冲申请查询",

			dicMap:{optSelfCloseFlag:{'1':'自对冲期权仓位','2':'保留期权仓位','3':'自对冲卖方履约后的期货仓位'},hedgeFlag:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}}
		},"operOptionSelfCloseService","exportExcelOperOptionSelfClose",queryEntity);

    };
    
});

