/**
 * Created by Quantdo on 2016/6/6.
 */
myapp.controller('positionQueryController',function($scope,$rootScope) {
    //初始化接口
    $scope.operClientPositionService = new com.quantdo.orgClear.service.OperClientPositionService();

    //存储表格ID
    $scope.myID = "#positionQuery_table";

    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope, "tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;

    //存储表格中的数据
    $scope.dataset = [];

    //存储前台查询信息
    $scope.currentPositionEntity = {};
    $scope.invesBrokerEntitys = {};
    //保存表格中的数据，用于select框
    $scope.currentPositionEntitys = {};
    $scope.instruments = {};

    //存储交易所相关信息，用于select框
    $scope.exchangeEntitys = {};
    $scope.exchanges = {};

    //保存所有投资者信息
    $scope.investmentEntitys = {};

    
	getAllInstClient(function(result){
		if(result.cjfky!=null||result.cjfky!=undefined){
			$scope.invesBrokerEntitys = result.cjfky;
			$scope.positionQueryIsCanUser = false;
			$scope.$apply();
		}else{
			$scope.invesBrokerEntitys = result.fky;
			$scope.currentPositionEntity.brokerageFirmID =$scope.invesBrokerEntitys[0].instClientID; 
			$scope.positionQueryIsCanUser = true;
			$scope.$apply();
		}
	    //调取后台获取投资者数据的接口
	    riskFindAllInvestorID($scope.currentPositionEntity.brokerageFirmID,function(result){
	        $scope.investmentEntitys = result;
	        $scope.$apply();
	    })
	})
	$scope.brokerIDChange = function(){
		 //调取后台获取投资者数据的接口
		$scope.investmentEntitys = {};
	    riskFindAllInvestorID($scope.currentPositionEntity.brokerageFirmID,function(result){
	        $scope.investmentEntitys = result;
	        $scope.$apply();
	    })
	}
    //调取后台获取当前持仓数据的接口
    findOperClientPositionAllCapitalByQuery(function(result){
        $scope.currentPositionEntitys = result;
        $scope.instruments = $scope.currentPositionEntitys;
        $scope.$apply();
    },{accountID:'',instrumentID:''})

    //调取获得交易所信息的接口
    getAllExchanges(function (result) {
        $scope.exchangeEntitys = result;
        $scope.$apply();
    });
    //init datatable
    $scope.positionQueryinitDataTables = function(table_id, table_columns, table_data,height,orderFlag){
        return $("#" + table_id).DataTable({
            data : table_data,
            columns :table_columns,
            scrollY: height,
            paging: false,
            retrieve: true,
            destroy:true,
            autoWidth: false,
            //fixedColumns:   {
            //    leftColumns: fixedColumns
            //},
            scrollX: true,
            dom : 'rt<"bottom"ipl>',
            ordering: !orderFlag,
            //paging:   false,
            //pagingType: "full_numbers",
            language: {
                emptyTable: "没有符合条件的记录",
                info: "显示 _START_ 条到 _END_ 条 共 _TOTAL_ 条记录",
                infoEmpty: "显示 0 条到 0 条 共 0 条记录",
                lengthMenu: "显示 _MENU_ 条 记录"
                //paginate: {
                //    first: "首页",
                //    last: "末页",
                //    next: "下一页",
                //    previous: "上一页"
                //}
            },
            createdRow: function ( row, data, index ) {
                if (data[5] == "买") {
                    $("td", row).eq(5).addClass("myred");
                }
                else if (data[5] == "卖") {
                    $("td", row).eq(5).addClass("mygreen");
                }
                else{
                    $("td", row).eq(5).addClass("myblack");
                }
            }
        });
    }
    //初始化持仓查询表格
    $scope.getTable = function() {
        var columns_array = [
            { title: "机构代码"},
            { title: "机构简称"},
            {title: "投资者编号"},
            {title: "交易所代码"},
            {title: "合约代码"},
            {title: "买卖"},
            {title: "投保"},
            {title: "总持仓量"},
            {title: "总持仓成本"},
            {title: "昨持仓量"},
            {title: "昨日持仓成本"}
        ];
        var table = $scope.positionQueryinitDataTables("positionQuery_table", columns_array, $scope.dataset,140);
    }

    //初始化页面
    $(document).ready(function(){
        $scope.getTable();
    })
    //复位方法
    $scope.resetQryForm = function(){
        $scope.currentPositionEntity = {};
        getAllInstClient(function(result){
    		if(result.cjfky!=null||result.cjfky!=undefined){
    			$scope.invesBrokerEntitys = result.cjfky;
    			$scope.positionQueryIsCanUser = false;
    			$scope.$apply();
    		}else{
    			$scope.invesBrokerEntitys = result.fky;
    			$scope.currentPositionEntity.brokerageFirmID =$scope.invesBrokerEntitys[0].instClientID; 
    			$scope.positionQueryIsCanUser = true;
    			$scope.$apply();
    		}
    	    //调取后台获取投资者数据的接口
    	    riskFindAllInvestorID($scope.currentPositionEntity.brokerageFirmID,function(result){
    	        $scope.investmentEntitys = result;
    	        $scope.$apply();
    	    })
    	})
    }
    //持仓查询方法实现
    $scope.find = function(currentPositionEntity){
        findOperClientPositionAllTraderByQueryCondition(function(result){
            $scope.dataset = [];
            destroyDatatable("positionQuery_table");
            var con = result;
            for(var i=0;i<con.length;i++){
                var tempArr = [con[i].brokerid,con[i].brokerName,con[i].accountID,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),
                    $rootScope.getShowValue($rootScope.tradeTypes,con[i].hedgeFlag),con[i].position,
                    parseFloat(con[i].positionCost).toFixed(2),con[i].ydposition,parseFloat(con[i].ydpositionCost).toFixed(2)];
                $scope.dataset.push(tempArr);
            }
            $scope.getTable();
        },currentPositionEntity)
    }
})