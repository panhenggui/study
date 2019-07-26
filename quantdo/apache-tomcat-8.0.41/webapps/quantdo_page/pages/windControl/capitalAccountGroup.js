/**
 * Created by Quantdo on 2016/6/2.
 */
myapp.controller('capitalAccountGroupController',function($scope,$rootScope) {
    $scope.operOrderService = new com.quantdo.orgClear.service.OperOrderService();
    //存储表格ID
    $scope.myID="#capitalAccountGroup_table";

    $rootScope.queryGroupID = "";
    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;

    $scope.dataset = [];

    //获取所有资金账户分组信息
    getOperInvestorAccountGroup()
        .then(function(result){
            var con = result;
            for(var i=0;i<con.length;i++){
                var tempArr = [con[i].brokerageFirmID,con[i].instClientName,con[i].accountID,con[i].accountName,parseFloat(con[i].dynamicRights).toFixed(2),
                    parseFloat(con[i].margin).toFixed(2),parseFloat(con[i].available).toFixed(2),parseFloat(con[i].preBalance).toFixed(2),
                    parseFloat(con[i].deposit).toFixed(2),parseFloat(con[i].withdraw).toFixed(2),parseFloat(con[i].closeProfit).toFixed(2),
                    parseFloat(con[i].positionProfit).toFixed(2),parseFloat(con[i].fee).toFixed(2),parseFloat(con[i].frozenMargin).toFixed(2),
                    parseFloat(con[i].frozenFee).toFixed(2)];
                $scope.dataset.push(tempArr);
            }
            $("#capitalAccountGroup_table").DataTable({
                data : $scope.dataset,
                columns :$rootScope.capitalAccountGroup_columns_array,
                scrollY: 180,
                paging: false,
                fixedColumns:   {
                    leftColumns: 4
                },
                scrollX: true,
                retrieve: true,
                dom : 'rt<"bottom"ipl>',
                language: {
                    emptyTable: "没有符合条件的记录",
                    info: "显示 _START_ 条到 _END_ 条 共 _TOTAL_ 条记录",
                    infoEmpty: "显示 0 条到 0 条 共 0 条记录",
                    lengthMenu: "显示 _MENU_ 条 记录"
                },
                createdRow: function ( row, data, index ) {
                    if (data[10] > 0) {
                        $("td", row).eq(10).addClass("myred");
                    }
                    else if (data[10] < 0) {
                        $("td", row).eq(10).addClass("mygreen");
                    }
                    else{
                        $("td", row).eq(10).addClass("myblack");
                    }
                    if(data[11]>0){
                        $("td", row).eq(11).addClass("myred");
                    }
                    else if(data[11] < 0){
                        $("td", row).eq(11).addClass("mygreen");
                    }
                    else{
                        $("td", row).eq(11).addClass("myblack");
                    }
                }
            });
            $rootScope.compLoad.push($scope.myID);
        //$scope.getTable();
    });

    //资金账户分组表格点击行所触发的事件
    $("body").delegate("#capitalAccountGroup_table tbody tr", "click", function () {
        //为选中的行设置选中色
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $($("#capitalAccountGroup_table_wrapper .DTFC_Cloned tbody tr")[$(this).context.rowIndex-1]).removeClass('selected');
        }
        else {
            $("tr.selected").removeClass("selected");
            $(this).addClass("selected");
            $($("#capitalAccountGroup_table_wrapper .DTFC_Cloned tbody tr")[$(this).context.rowIndex-1]).addClass('selected');
        }
        //$(this).toggleClass('selected');

        //获得点击行所对应的资金账号
        var a = $(this)[0].innerText.toString();
        $scope.myData = a.split(/\s+/)[2];
        $rootScope.queryGroupID = $scope.myData;
        $rootScope.myBrokerID = a.split(/\s+/)[0];
        $rootScope.trData = "[" + $rootScope.myBrokerID+"-"+$scope.myData + "]";
        $rootScope.capitalQueryID = "";
        //当前持仓菜单栏根据所获得的资金账号进行更新
        findAllAccountByAccountIdOrGroupId($rootScope.capitalQueryID,$rootScope.queryGroupID,$rootScope.myBrokerID)
            .then(function(result){
                $scope.currentPosition_dataset = [];
                $scope.priceTick = result
                var con = result;
                for(var i=0;i<con.length;i++){
                    var tempArr = [con[i].brokerageFirmID,con[i].instClientAbbrName,con[i].traderID,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),
                        $rootScope.getShowValue($rootScope.tradeTypes,con[i].hedgeFlag),con[i].position,
                        parseFloat(con[i].positionCost).toFixed(2),con[i].ydPosition,parseFloat(con[i].ydPositionCost).toFixed(2)];
                    $scope.currentPosition_dataset.push(tempArr);
                }

                var positionTable = $("#currentPosition_table").DataTable();
                positionTable.clear().draw();
                positionTable.rows.add($scope.currentPosition_dataset).draw();

                return findAllOrderByAccountIdOrGroupId($rootScope.capitalQueryID,$rootScope.queryGroupID,$rootScope.riskAndCapitalFlag,$rootScope.myBrokerID);
            })
            .then(function(result){
                $scope.allOrders_dataset = [];
                var con = result;
                for(var i=0;i<con.length;i++){
                    var tempArr = [con[i].brokerageFirmID,con[i].instClientName,con[i].investorID,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),
                        $rootScope.getShowValue($rootScope.offsetFlag,con[i].offsetFlag),
                        $rootScope.getShowValue($rootScope.tradeTypes,con[i].hedgeFlag),
                        $rootScope.getShowValue($rootScope.orderStatus,con[i].orderStatus),parseFloat(con[i].limitPrice).toFixed($rootScope.getFixedNumberByTick(con[i].priceTick)),con[i].volumeTraded,con[i].volume,con[i].volumeRemain,con[i].insertTime,""];
                    $scope.allOrders_dataset.push(tempArr);
                }

                var orderTable = $("#allOrders_table").DataTable();
                orderTable.clear().draw();
                orderTable.rows.add($scope.allOrders_dataset).draw();

                return findAllCapitalByQueryByAccountIdOrGroupId($rootScope.capitalQueryID,$rootScope.queryGroupID,$rootScope.riskAndCapitalFlag,$rootScope.myBrokerID);
            })
            .then(function(result){
                $scope.traderDetail_dataset = [];
                var con = result;
                for(var i=0;i<con.length;i++){
                    var tempArry = [con[i].brokerid,con[i].instClientName,con[i].investorID,con[i].subAccountID,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),
                        $rootScope.getShowValue($rootScope.offsetFlag,con[i].offsetFlag),parseFloat(con[i].tradePrice).toFixed($rootScope.getFixedNumberByTick(con[i].priceTick)),con[i].tradeVolume,
                        $rootScope.getShowValue($rootScope.tradeTypes,con[i].hedgeFlag),con[i].orderSysID,con[i].tradeID,con[i].tradingDay,con[i].tradeTime," "];
                    $scope.traderDetail_dataset.push(tempArry);
                }

               /* var traderTable = $("#traderDetail_table").DataTable();
                traderTable.clear().draw();
                traderTable.rows.add($scope.traderDetail_dataset).draw();*/
                $rootScope.isShowTraderDetail = false;
                $scope.$apply();
                var traderTable = $("#traderDetail_table").DataTable();
                traderTable.destroy();
                var table = $rootScope.tradeDetailinitDataTables("traderDetail_table",$rootScope.traderDetail_columns_array,$scope.traderDetail_dataset,180);
            });

        $scope.$apply();

    });

    $("body").delegate("#capitalAccountGroup_table_wrapper .DTFC_Cloned tbody tr", "click", function () {
        //为选中的行设置选中色
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $($("#capitalAccountGroup_table tbody tr")[$(this).context.rowIndex-1]).removeClass('selected');
        }
        else {
            $("tr.selected").removeClass("selected");
            $(this).addClass("selected");
            $($("#capitalAccountGroup_table tbody tr")[$(this).context.rowIndex-1]).addClass('selected');
        }
        //$(this).toggleClass('selected');

        //获得点击行所对应的资金账号
        var a = $(this)[0].innerText.toString();
        $scope.myData = a.split(/\s+/)[2];
        $rootScope.queryGroupID = $scope.myData;
        $rootScope.myBrokerID = a.split(/\s+/)[0];
        $rootScope.trData = "[" + $rootScope.myBrokerID+"-"+$scope.myData + "]";
        $rootScope.capitalQueryID = "";
        //当前持仓菜单栏根据所获得的资金账号进行更新
        findAllAccountByAccountIdOrGroupId($rootScope.capitalQueryID,$rootScope.queryGroupID,$rootScope.myBrokerID)
            .then(function(result){
                $scope.currentPosition_dataset = [];
                $scope.priceTick = result
                var con = result;
                for(var i=0;i<con.length;i++){
                    var tempArr = [con[i].brokerageFirmID,con[i].instClientAbbrName,con[i].traderID,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),
                        $rootScope.getShowValue($rootScope.tradeTypes,con[i].hedgeFlag),con[i].position,
                        parseFloat(con[i].positionCost).toFixed(2),con[i].ydPosition,parseFloat(con[i].ydPositionCost).toFixed(2)];
                    $scope.currentPosition_dataset.push(tempArr);
                }

                var positionTable = $("#currentPosition_table").DataTable();
                positionTable.clear().draw();
                positionTable.rows.add($scope.currentPosition_dataset).draw();

                return findAllOrderByAccountIdOrGroupId($rootScope.capitalQueryID,$rootScope.queryGroupID,$rootScope.riskAndCapitalFlag,$rootScope.myBrokerID);
            })
            .then(function(result){
                $scope.allOrders_dataset = [];
                var con = result;
                for(var i=0;i<con.length;i++){
                    var tempArr = [con[i].brokerageFirmID,con[i].instClientName,con[i].investorID,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),
                        $rootScope.getShowValue($rootScope.offsetFlag,con[i].offsetFlag),
                        $rootScope.getShowValue($rootScope.tradeTypes,con[i].hedgeFlag),
                        $rootScope.getShowValue($rootScope.orderStatus,con[i].orderStatus),parseFloat(con[i].limitPrice).toFixed($rootScope.getFixedNumberByTick(con[i].priceTick)),con[i].volumeTraded,con[i].volume,con[i].volumeRemain,con[i].insertTime,""];
                    $scope.allOrders_dataset.push(tempArr);
                }

                var orderTable = $("#allOrders_table").DataTable();
                orderTable.clear().draw();
                orderTable.rows.add($scope.allOrders_dataset).draw();

                return findAllCapitalByQueryByAccountIdOrGroupId($rootScope.capitalQueryID,$rootScope.queryGroupID,$rootScope.riskAndCapitalFlag,$rootScope.myBrokerID);
            })
            .then(function(result){
                $scope.traderDetail_dataset = [];
                var con = result;
                for(var i=0;i<con.length;i++){
                    var tempArry = [con[i].brokerid,con[i].instClientName,con[i].investorID,con[i].subAccountID,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),
                        $rootScope.getShowValue($rootScope.offsetFlag,con[i].offsetFlag),parseFloat(con[i].tradePrice).toFixed($rootScope.getFixedNumberByTick(con[i].priceTick)),con[i].tradeVolume,
                        $rootScope.getShowValue($rootScope.tradeTypes,con[i].hedgeFlag),con[i].orderSysID,con[i].tradeID,con[i].tradingDay,con[i].tradeTime," "];
                    $scope.traderDetail_dataset.push(tempArry);
                }

                /*var traderTable = $("#traderDetail_table").DataTable();
                traderTable.clear().draw();
                traderTable.rows.add($scope.traderDetail_dataset).draw();*/
                $rootScope.isShowTraderDetail = false;
                $scope.$apply();
                var traderTable = $("#traderDetail_table").DataTable();
                traderTable.destroy();
                var table = $rootScope.tradeDetailinitDataTables("traderDetail_table",$rootScope.traderDetail_columns_array,$scope.traderDetail_dataset,180);
            });

        $scope.$apply();

    });
});