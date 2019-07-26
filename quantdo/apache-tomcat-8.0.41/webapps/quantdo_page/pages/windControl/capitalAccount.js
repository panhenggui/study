/**
 * Created by Quantdo on 2016/6/1.
 */
myapp.controller('capitalAccountController',function($scope,$rootScope) {
    console.log("first");
    //1、实例化服务接口
    //1.1、 实例化资金账户服务接口
    $scope.operInvestorAccountService = new com.quantdo.orgClear.service.OperInvestorAccountService();
    $scope.capitalAccountService = new com.quantdo.orgClear.service.CapitalAccountService();
    $scope.operOrderService = new com.quantdo.orgClear.service.OperOrderService();
    $rootScope.capitalAccount_dataset = [];
    $rootScope.tEntitys = [];
    $rootScope.capitalQueryID = "";

    //获取账号名称
    $rootScope.fundName =function(id){
        for(var i = 0; i < $rootScope.tEntitys.length; i++){
            if($rootScope.tEntitys[i].accountID == id){
                return $rootScope.tEntitys[i].accountName;
            }
        }
    };

    findCapitalAccount({})
        .then(function(cresult) {
            //console.log("second");
            $rootScope.tEntitys = cresult;
        });
    //存储表格ID
    $scope.myID="#capitalAccount_table";

    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;

    //查询所有资金账户
    $scope.condition = {queryType:'1'};//按照资金账号查询
    //$.when(
    //    findCapitalAccount({})
    //        .then(function(cresult){
    //            console.log("second");
    //            $rootScope.tEntitys = cresult;
    //            return findBySubAccountIdAndAccountIdOfRiskByFundId({fundProductID:$rootScope.myData,brokerID:$rootScope.myBrokerID});
    //         })
    //        .then(function(result){
    //            console.log(result);
    //            console.log("three");
    //            var con = result;
    //            for(var i=0;i<con.length;i++){
    //                var tempArry = [con[i].brokerageFirmID,con[i].instClientName,con[i].accountID,con[i].traderID, $rootScope.fundName(con[i].accountID), parseFloat(con[i].dynamicRights).toFixed(2),
    //                    parseFloat(con[i].margin).toFixed(2),parseFloat(con[i].available).toFixed(2),(parseFloat(con[i].risk).toFixed(4)*100).toFixed(2) + "%",
    //                    parseFloat(con[i].preBalance).toFixed(2),parseFloat(con[i].deposit).toFixed(2),parseFloat(con[i].withdraw).toFixed(2),
    //                    parseFloat(con[i].closeProfit).toFixed(2), parseFloat(con[i].positionProfit).toFixed(2),
    //                    parseFloat(con[i].fee).toFixed(2),parseFloat(con[i].frozenMargin).toFixed(2),
    //                    parseFloat(con[i].frozenFee).toFixed(2)];
    //                $rootScope.capitalAccount_dataset.push(tempArry);
    //            }
    //            $("#capitalAccount_table").DataTable({
    //                data : $rootScope.capitalAccount_dataset,
    //                columns :$rootScope.capitalAccount_columns_array,
    //                scrollY: 180,
    //                paging: false,
    //                fixedColumns:   {
    //                    leftColumns: 5
    //                },
    //                retrieve: true,
    //                destroy:true,
    //                scrollX: true,
    //                dom : 'rt<"bottom"ipl>',
    //                language: {
    //                    emptyTable: "没有符合条件的记录",
    //                    info: "显示 _START_ 条到 _END_ 条 共 _TOTAL_ 条记录",
    //                    infoEmpty: "显示 0 条到 0 条 共 0 条记录",
    //                    lengthMenu: "显示 _MENU_ 条 记录"
    //                },
    //                createdRow: function ( row, data, index ) {
    //                    if (data[12] > 0) {
    //                        $("td", row).eq(12).addClass("myred");
    //                    }
    //                    else if (data[12] < 0) {
    //                        $("td", row).eq(12).addClass("mygreen");
    //                    }
    //                    else{
    //                        $("td", row).eq(12).addClass("myblack");
    //                    }
    //
    //                    if(data[13]>0){
    //                        $("td", row).eq(13).addClass("myred");
    //                    }
    //                    else if(data[13] < 0){
    //                        $("td", row).eq(13).addClass("mygreen");
    //                    }
    //                    else{
    //                        $("td", row).eq(13).addClass("myblack");
    //                    }
    //                }
    //            });
    //
    //            $rootScope.compLoad.push($scope.myID);
    //        });

    $scope.capitalAccount_dataset = [];
    $scope.getAccountTable = function(table_id, table_columns, table_data,height){
        return $(table_id).DataTable({
            data : table_data,
            columns :table_columns,
            scrollY: height,
            paging: false,
            fixedColumns:   {
                leftColumns: 5
            },
            retrieve: true,
            destroy:true,
            scrollX: true,
            dom : 'rt<"bottom"ipl>',
            language: {
                emptyTable: "没有符合条件的记录",
                info: "显示 _START_ 条到 _END_ 条 共 _TOTAL_ 条记录",
                infoEmpty: "显示 0 条到 0 条 共 0 条记录",
                lengthMenu: "显示 _MENU_ 条 记录"
            },
            createdRow: function ( row, data, index ) {
                if (data[12] > 0) {
                    $("td", row).eq(12).addClass("myred");
                }
                else if (data[12] < 0) {
                    $("td", row).eq(12).addClass("mygreen");
                }
                else{
                    $("td", row).eq(12).addClass("myblack");
                }

                if(data[13]>0){
                    $("td", row).eq(13).addClass("myred");
                }
                else if(data[13] < 0){
                    $("td", row).eq(13).addClass("mygreen");
                }
                else{
                    $("td", row).eq(13).addClass("myblack");
                }
            }
        });
    };
    $scope.getAccountTable("#capitalAccount_table",$rootScope.capitalAccount_columns_array,$scope.capitalAccount_dataset,180);
    //资金账户表格点击行所触发的事件
    $("body").delegate("#capitalAccount_table tbody tr", "click", function () {
        //为选中的行设置选中色
        if($(this).hasClass("selected")){
            $(this).removeClass("selected");
            $($("#capitalAccount_table_wrapper .DTFC_Cloned tbody tr")[$(this).context.rowIndex-1]).removeClass('selected');
        }
        else{
            $("tr.selected").removeClass("selected");
            $(this).addClass("selected");
            $($("#capitalAccount_table_wrapper .DTFC_Cloned tbody tr")[$(this).context.rowIndex-1]).addClass('selected');
        }
        $rootScope.riskAndCapitalFlag = "2";

        var table = $("#capitalAccount_table").DataTable();
        //var mytr = $(this).parents("tr");
        var tempArr = table.row($(this)).data();
        $rootScope.capitalQueryID = tempArr[3];
        $rootScope.myBrokerID = tempArr[0];
        $rootScope.queryGroupID = "";
        $rootScope.trData = "[" +$rootScope.myBrokerID+"-"+tempArr[3] + "]";
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

    $("body").delegate("#capitalAccount_table_wrapper .DTFC_Cloned tbody tr", "click", function () {
        //为选中的行设置选中色
        if($(this).hasClass("selected")){
            $(this).removeClass("selected");
            $($("#capitalAccount_table tbody tr")[$(this).context.rowIndex-1]).removeClass('selected');
        }
        else{
            $("tr.selected").removeClass("selected");
            $(this).addClass("selected");
            $($("#capitalAccount_table tbody tr")[$(this).context.rowIndex-1]).addClass('selected');
        }
        $rootScope.riskAndCapitalFlag = "2";

        var table = $("#capitalAccount_table").DataTable();
        //var mytr = $(this).parents("tr");
        var tempArr = table.row($(this)).data();
        $rootScope.capitalQueryID = tempArr[3];
        $rootScope.myBrokerID = tempArr[0];
        $rootScope.queryGroupID = "";
        $rootScope.trData = "[" +$rootScope.myBrokerID+"-"+tempArr[3] + "]";
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

});