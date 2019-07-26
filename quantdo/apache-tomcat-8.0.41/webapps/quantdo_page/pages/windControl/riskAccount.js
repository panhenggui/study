/**
 * Created by Quantdo on 2016/7/14.
 */
myapp.controller('riskAccountController',function($scope,$rootScope) {
    //存储表格中的数据
    $scope.riskAccount_dataset = [];

    //存储表格ID
    $scope.myID="#riskAccount_table";

    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    $scope.judegeIsNum = function(index){
    	if(index == null){
    		return "";
    	}
    	if(!isNaN(index)){
    		return parseFloat(index).toFixed(2) + "%";
    	}else{
    		return "";
    	}
    }
    $scope.judegeIsNum2 = function(index){
    	if(index == null){
    		return "";
    	}
    	if(!isNaN(index)){
    		return parseFloat(index).toFixed(2);
    	}else{
    		return "";
    	}
    }
    //从数据库中获取资产单元的信息
    getRiskAccount("")
        .then(function(result){
            var con = result;
            for(var i=0;i<con.length;i++){
                var tempArr = [con[i].brokerID,con[i].brokerName,con[i].subAccountID,con[i].subAccountName,parseFloat(con[i].dynamicRights).toFixed(2),parseFloat(con[i].margin).toFixed(2),
                    parseFloat(con[i].available).toFixed(2),parseFloat(con[i].preBalance).toFixed(2),parseFloat(con[i].deposit).toFixed(2),
                    parseFloat(con[i].withdraw).toFixed(2),parseFloat(con[i].closeProfit).toFixed(2),parseFloat(con[i].positionProfit).toFixed(2),
                    parseFloat(con[i].fee).toFixed(2),parseFloat(con[i].longFrozenMargin).toFixed(2)+parseFloat(con[i].shortFrozenMargin).toFixed(2),
                    parseFloat(con[i].frozenFee).toFixed(2),
                    $scope.judegeIsNum(con[i].riskNet),parseFloat(con[i].mortgage).toFixed(2),
                    $scope.judegeIsNum2(con[i].initialCapital),con[i].currency];
                $scope.riskAccount_dataset.push(tempArr);
            }
            //var table = initDataTables("riskAccount_table",$rootScope.riskAccount,$scope.riskAccount_dataset,180);
            $("#riskAccount_table").DataTable({
                data : $scope.riskAccount_dataset,
                columns :$rootScope.riskAccount,
                scrollY: 180,
                paging: false,
                fixedColumns:   {
                    leftColumns: 4
                },
                scrollX: true,
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
        });

    //资产单元表格点击行所触发的事件
    $("body").delegate("#riskAccount_table tbody tr", "click", function () {
        //为选中的行设置选中色
        if($(this).hasClass("selected")){
            $(this).removeClass("selected");
            $($("#riskAccount_table_wrapper .DTFC_Cloned tbody tr")[$(this).context.rowIndex-1]).removeClass('selected');
        }
        else{
            $("tr.selected").removeClass("selected");
            $(this).addClass("selected");
            $($("#riskAccount_table_wrapper .DTFC_Cloned tbody tr")[$(this).context.rowIndex-1]).addClass('selected');
        }
        $rootScope.riskAndCapitalFlag = "1";

        var table = $("#riskAccount_table").DataTable();
        //var mytr = $(this).parents("tr");
        var tempArr = table.row($(this)).data();
        $rootScope.capitalQueryID = tempArr[2];
        $rootScope.myBrokerID = tempArr[0];
        $rootScope.queryGroupID = "";
        $rootScope.trData = "[" + $rootScope.myBrokerID+"-"+$rootScope.capitalQueryID + "]";
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

                //销毁原始表格
                destroyDatatable("currentPosition_table");

                //重绘新表格
                var table = $scope.currentPositioninitDataTables("currentPosition_table",$rootScope.currentPosition_columns_array,$scope.currentPosition_dataset,180);

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

                //销毁所有报单表格
                destroyDatatable("allOrders_table");

                //初始化所有报单表格
                var table = $scope.allOrderinitDataTables("allOrders_table",$rootScope.allOrders_columns_array,$scope.allOrders_dataset,180);

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

                /*//销毁成交明细表格
                destroyDatatable("traderDetail_table");

                //初始化成交明细表格
                var table = $scope.tradeDetailinitDataTables("traderDetail_table",$rootScope.traderDetail_columns_array,$scope.traderDetail_dataset,180);*/
                $rootScope.isShowTraderDetail = true;
                $scope.$apply();
                var traderTable = $("#traderDetail_table").DataTable();
                traderTable.destroy();
                var table = $rootScope.tradeDetailinitDataTables("traderDetail_table",$rootScope.traderDetail_columns_array,$scope.traderDetail_dataset,180);
            });

        $scope.$apply();
    });

    $("body").delegate("#riskAccount_table_wrapper .DTFC_Cloned tbody tr", "click", function () {
        //为选中的行设置选中色
        if($(this).hasClass("selected")){
            $(this).removeClass("selected");
            $($("#riskAccount_table tbody tr")[$(this).context.rowIndex-1]).removeClass('selected');
        }
        else{
            $("tr.selected").removeClass("selected");
            $(this).addClass("selected");
            $($("#riskAccount_table tbody tr")[$(this).context.rowIndex-1]).addClass('selected');
        }
        $rootScope.riskAndCapitalFlag = "1";

        var table = $("#riskAccount_table").DataTable();
        //var mytr = $(this).parents("tr");
        var tempArr = table.row($(this)).data();
        $rootScope.capitalQueryID = tempArr[2];
        $rootScope.myBrokerID = tempArr[0];
        $rootScope.queryGroupID = "";
        $rootScope.trData = "[" + $rootScope.myBrokerID+"-"+$rootScope.capitalQueryID + "]";
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

                //销毁原始表格
                destroyDatatable("currentPosition_table");

                //重绘新表格
                var table = $scope.currentPositioninitDataTables("currentPosition_table",$rootScope.currentPosition_columns_array,$scope.currentPosition_dataset,180);

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

                //销毁所有报单表格
                destroyDatatable("allOrders_table");

                //初始化所有报单表格
                var table = $scope.allOrderinitDataTables("allOrders_table",$rootScope.allOrders_columns_array,$scope.allOrders_dataset,180);

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

               /* //销毁成交明细表格
                destroyDatatable("traderDetail_table");

                //初始化成交明细表格
                var table = $scope.tradeDetailinitDataTables("traderDetail_table",$rootScope.traderDetail_columns_array,$scope.traderDetail_dataset,180);*/
                $rootScope.isShowTraderDetail = true;
                $scope.$apply();
                var traderTable = $("#traderDetail_table").DataTable();
                traderTable.destroy();
                var table = $rootScope.tradeDetailinitDataTables("traderDetail_table",$rootScope.traderDetail_columns_array,$scope.traderDetail_dataset,180);
            });

        $scope.$apply();
    });
  //init datatable
    $scope.currentPositioninitDataTables = function(table_id, table_columns, table_data,height,orderFlag){
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
    
    //init datatable
    $scope.tradeDetailinitDataTables = function(table_id, table_columns, table_data,height,orderFlag){
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
    
  //init datatable
    $scope.allOrderinitDataTables = function(table_id, table_columns, table_data,height,orderFlag){
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
                    $("td", row).eq(3).addClass("myblack");
                }
            }
        });
    }
})