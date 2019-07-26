/**
 * Created by Quantdo on 2016/6/21.
 */
myapp.controller('getRiskFundNetResultController',function($scope,$rootScope) {
    $scope.operOrderService = new com.quantdo.orgClear.service.OperOrderService();

    //存储表格ID
    $scope.myID = "#getRiskFundNetResult_table";

    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope, "tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;

    $scope.dataset = [];

    $rootScope.needHighlight = [];

    $rootScope.changeWarnLevelAndStopLossLevel = function(index){
    	if(isNaN(parseFloat(index))){
    		return "";
    	}else{
    		return parseFloat(index).toFixed(4);
    	}
    }
    $rootScope.changeUpDownRatio = function(index){
    	var back = "";
    	if(isNaN(parseFloat(index))){
    		return "";
    	}else{
    		back = parseFloat(index*100).toFixed(2);
    	}
    	return back+"%";
    }
    //获取所有基金净值结果
    getRiskFundNetResult()
        .then(function(result){
            $scope.columns_array = [
                { title: "机构代码"},
                { title: "机构简称"},
                { title: "产品代码"},
                { title: "产品简称"},
                { title: "单位净值"},
                { title: "产品净值"},
                { title: "当日涨跌幅"},
                { title: "预警线"},
                { title: "止损线"},
                { title: "单位净值档位"},
                { title: "净值日期"},
                { title: "净值时间"}
            ];
            if(result.length>0){
                var dtlidxlist = result[0].dtlidxlist;
                for(var i=0;i<dtlidxlist.length;i++){
                    var tplName = {title:dtlidxlist[i].tplName};
                    var tplNameVaue = {title:dtlidxlist[i].tplNameVaue};
                    $scope.columns_array.push(tplNameVaue);
                    $scope.columns_array.push(tplName);
                }
            }
            var con = result;

            for(var i=0;i<con.length;i++){
                var tempArr = [con[i].brokerID,con[i].instClientAbbrName,con[i].fundProductID,con[i].fundProductName,parseFloat(con[i].unitNetValue).toFixed(4),parseFloat(con[i].fundNetValue).toFixed(2),
                               $rootScope.changeUpDownRatio(con[i].upDownRatio),$rootScope.changeWarnLevelAndStopLossLevel(con[i].warnLevel),$rootScope.changeWarnLevelAndStopLossLevel(con[i].stopLossLevel),
                               con[i].netValueLevel,con[i].netDate,con[i].netTime];
                for(var j=0;j<con[i].dtlidxlist.length;j++){
                    var threshold = con[i].dtlidxlist[j].threshold;
                    var riskvalue = con[i].dtlidxlist[j].riskvalue;
                    if(riskvalue>=threshold){
                        var myrowAndTd = {};
                        myrowAndTd.myrow = i;
                        myrowAndTd.mytd = j;
                        $rootScope.needHighlight.push(myrowAndTd);
                    }
                    if(threshold != null){
                        threshold = parseFloat(threshold).toFixed(2) + "%";
                    }
                    if(riskvalue != null){
                        riskvalue = parseFloat(riskvalue).toFixed(2) + "%";
                    }
                    tempArr.push(threshold);
                    tempArr.push(riskvalue);
                }
                $scope.dataset.push(tempArr);
            }
            $scope.$apply();
            $("#getRiskFundNetResult_table").DataTable({
                data : $scope.dataset,
                columns :$scope.columns_array,
                scrollY: true,
                paging: false,
                fixedColumns:   {
                    leftColumns: 10
                },
                retrieve: true,
                destroy:true,
                scrollX: true,
                order: [ 4, "asc" ],
                dom : 'rt<"bottom"ipl>',
                language: {
                    emptyTable: "没有符合条件的记录",
                    info: "显示 _START_ 条到 _END_ 条 共 _TOTAL_ 条记录",
                    infoEmpty: "显示 0 条到 0 条 共 0 条记录",
                    lengthMenu: "显示 _MENU_ 条 记录"
                },
                createdRow: function ( row, data, index ) {
                	var unitNetValueIndex = 4;  //单位净值
                	var upDownRatioIndex = 6;   //涨跌幅
                	var warnLevelIndex = 7;     //预警线
                	var stopLossLevelIndex = 8; //止损线
                	if(data[unitNetValueIndex]!=null&&data[unitNetValueIndex]!=""&&data[stopLossLevelIndex]!=null&&data[stopLossLevelIndex]!=""&&data[warnLevelIndex]!=null&&data[warnLevelIndex]!=""){
                		if(parseFloat(data[unitNetValueIndex]).toFixed(4)-parseFloat(data[stopLossLevelIndex]).toFixed(4)<=0){
                			 $("td", row).eq(unitNetValueIndex).addClass("mybackRed");
                		}else if(parseFloat(data[unitNetValueIndex]).toFixed(4)-parseFloat(data[warnLevelIndex]).toFixed(4)<=0){
                			 $("td", row).eq(unitNetValueIndex).addClass("myyellow");
                		}else{
                			$("td", row).addClass("mywhite");
                		}
                	}else if(data[unitNetValueIndex]!=null&&data[unitNetValueIndex]!=""&&data[warnLevelIndex]!=null&&data[warnLevelIndex]!=""&&(data[stopLossLevelIndex]==null||data[stopLossLevelIndex]=="")){
                		if(parseFloat(data[unitNetValueIndex]).toFixed(4)-parseFloat(data[warnLevelIndex]).toFixed(4)<=0){
                			 $("td", row).eq(unitNetValueIndex).addClass("myyellow");
                		}else{
                			$("td", row).addClass("mywhite");
                		}
                	}else if(data[unitNetValueIndex]!=null&&data[unitNetValueIndex]!=""&&data[stopLossLevelIndex]!=null&&data[stopLossLevelIndex]!=""&&(data[warnLevelIndex]==null||data[warnLevelIndex]=="")){
                		if(parseFloat(data[unitNetValueIndex]).toFixed(4)-parseFloat(data[stopLossLevelIndex]).toFixed(4)<=0){
                			 $("td", row).eq(unitNetValueIndex).addClass("mybackRed");
                		}else{
                			$("td", row).addClass("mywhite");
                		}
                	}else{
                		$("td", row).addClass("mywhite");
                	}
                	//涨跌幅字体颜色
                	if(data[upDownRatioIndex]!=null&&data[upDownRatioIndex]!=""&&data[upDownRatioIndex].substring(0,data[upDownRatioIndex].length-1)>0){
                		 $("td", row).eq(upDownRatioIndex).addClass("myred");
                	}else if(data[upDownRatioIndex]!=null&&data[upDownRatioIndex]!=""&&data[upDownRatioIndex].substring(0,data[upDownRatioIndex].length-1)<0){
                		$("td", row).eq(upDownRatioIndex).addClass("mygreen");
                	}else{
                		$("td", row).eq(upDownRatioIndex).addClass("myblack");
                	}
                	//占比，阈值字体颜色
                    for(var i=13;i<data.length;){
                        if(data[i] != null && parseFloat(data[i].substring(0,data[i].length-1))>=parseFloat(data[i-1].substring(0,data[i-1].length-1))){
                            $("td", row).eq(i).addClass("myred");
                        }
                        else{
                            $("td", row).eq(i).removeClass("myred");
                        }
                        i = i+2;
                    }
                    //angular.forEach($rootScope.needHighlight,function(mydata,myindex){
                    //    if(index == mydata.myrow){
                    //        $("td", row).eq(6+mydata.mytd*2+2).addClass("myred");
                    //    }
                    //    //if(index != mydata.myrow){
                    //    //    $("td", row).eq(6+mydata.mytd*2+2).removeClass("myred");
                    //    //}
                    //});
                }
            });
            /*setTimeout(function(){
                $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
            },"");*/
            $rootScope.compLoad.push($scope.myID);
            //var table = initDataTables("getRiskFundNetResult_table", $scope.columns_array, $scope.dataset,180);
    });

    $("body").delegate("#getRiskFundNetResult_table_wrapper .DTFC_Cloned tbody tr", "click", function(){
        //为选中的行设置选中色
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $($("#getRiskFundNetResult_table tbody tr")[$(this).context.rowIndex-1]).removeClass('selected');
        }
        else {
            $("tr.selected").removeClass("selected");
            $(this).addClass("selected");
            $($("#getRiskFundNetResult_table tbody tr")[$(this).context.rowIndex-1]).addClass('selected');
        }

        //获得点击行所对应的资金账号
        var mytrData = $(this)[0].innerText.toString();
        $rootScope.myBrokerID = mytrData.split(/\s+/)[0];
        $rootScope.myData = mytrData.split(/\s+/)[2];
        $rootScope.valueFlag = "[" + $rootScope.myBrokerID+"-"+$rootScope.myData + "]";
        $rootScope.riskAndCapitalFlag = "2";

        //资金账户更新
        findBySubAccountIdAndAccountIdOfRiskByFundId({fundProductID:$rootScope.myData,brokerID:$rootScope.myBrokerID})
            .then(function(result){
                var con = result;
                $scope.account_data = [];
                for(var i=0;i<con.length;i++){
                    var tempArry = [con[i].brokerageFirmID,con[i].instClientName,con[i].accountID, con[i].traderID, $rootScope.fundName(con[i].accountID), parseFloat(con[i].dynamicRights).toFixed(2),
                                    parseFloat(con[i].margin).toFixed(2),parseFloat(con[i].available).toFixed(2),(parseFloat(con[i].risk).toFixed(4)*100).toFixed(2) + "%",
                                    parseFloat(con[i].preBalance).toFixed(2),parseFloat(con[i].deposit).toFixed(2),parseFloat(con[i].withdraw).toFixed(2),
                                    parseFloat(con[i].closeProfit).toFixed(2), parseFloat(con[i].positionProfit).toFixed(2),
                                    parseFloat(con[i].fee).toFixed(2),parseFloat(con[i].frozenMargin).toFixed(2),
                                    parseFloat(con[i].frozenFee).toFixed(2)];
                    $scope.account_data.push(tempArry);
                }
                var table = $("#capitalAccount_table").DataTable();
                table.clear().draw();
                table.rows.add($scope.account_data).draw();
                if(table.context.length>0){
                    var trDatas =  table.context[0].aoData;
                    if(trDatas.length>0){
                        var trData = trDatas[0]._aData;
                        var mytr = trDatas[0].nTr;
                        $(mytr).addClass("selected");
                        $($("#capitalAccount_table_wrapper .DTFC_Cloned tbody tr")[$(mytr).context.rowIndex-1]).addClass('selected');
                        $rootScope.capitalQueryID = trData[3];
                        $rootScope.myBrokerID = trData[0];
                        $rootScope.trData = "[" + $rootScope.myBrokerID+"-"+trData[3] + "]";
                    }
                    else{
                        $rootScope.trData = "";
                        $rootScope.capitalQueryID = "";
                    }
                }
                $scope.$apply();
                //当前持仓菜单栏根据所获得的资金账号进行更新
                return findAllAccountByAccountIdOrGroupId($rootScope.capitalQueryID,$rootScope.queryGroupID,$rootScope.myBrokerID);
            })
            .then(function(result){
                //当前持仓
                $scope.currentPosition_dataset = [];
                $scope.priceTick = result
                if(result != undefined){
                    var con = result;
                    for(var i=0;i<con.length;i++){
                        var tempArr = [con[i].brokerageFirmID,con[i].instClientAbbrName,con[i].traderID,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),
                            $rootScope.getShowValue($rootScope.tradeTypes,con[i].hedgeFlag),con[i].position,
                            parseFloat(con[i].positionCost).toFixed(2),con[i].ydPosition,parseFloat(con[i].ydPositionCost).toFixed(2)];
                        $scope.currentPosition_dataset.push(tempArr);
                    }
                }
                var positionTable = $("#currentPosition_table").DataTable();
                positionTable.clear().draw();
                positionTable.rows.add($scope.currentPosition_dataset).draw();

                return findAllOrderByAccountIdOrGroupId($rootScope.capitalQueryID,$rootScope.queryGroupID,$rootScope.riskAndCapitalFlag,$rootScope.myBrokerID);
            })
            .then(function(result){
                //所有报单联动
                $scope.allOrders_dataset = [];
                if(result != undefined){
                    var con = result;
                    for(var i=0;i<con.length;i++){
                        var tempArr = [con[i].brokerageFirmID,con[i].instClientName,con[i].investorID,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),
                            $rootScope.getShowValue($rootScope.offsetFlag,con[i].offsetFlag),
                            $rootScope.getShowValue($rootScope.tradeTypes,con[i].hedgeFlag),
                            $rootScope.getShowValue($rootScope.orderStatus,con[i].orderStatus),parseFloat(con[i].limitPrice).toFixed($rootScope.getFixedNumberByTick(con[i].priceTick)),con[i].volumeTraded,con[i].volume,con[i].volumeRemain,con[i].insertTime,""];
                        $scope.allOrders_dataset.push(tempArr);
                    }
                }
                var orderTable = $("#allOrders_table").DataTable();
                orderTable.clear().draw();
                orderTable.rows.add($scope.allOrders_dataset).draw();

                return findAllCapitalByQueryByAccountIdOrGroupId($rootScope.capitalQueryID,$rootScope.queryGroupID,$rootScope.riskAndCapitalFlag,$rootScope.myBrokerID);
            })
            .then(function(result){
                //成交明细联动
                $scope.traderDetail_dataset = [];
                if(result != undefined){
                    var con = result;
                    for(var i=0;i<con.length;i++){
                        var tempArry = [con[i].brokerid,con[i].instClientName,con[i].investorID,con[i].subAccountID,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),
                            $rootScope.getShowValue($rootScope.offsetFlag,con[i].offsetFlag),parseFloat(con[i].tradePrice).toFixed($rootScope.getFixedNumberByTick(con[i].priceTick)),con[i].tradeVolume,
                            $rootScope.getShowValue($rootScope.tradeTypes,con[i].hedgeFlag),con[i].orderSysID,con[i].tradeID,con[i].tradingDay,con[i].tradeTime," "];
                        $scope.traderDetail_dataset.push(tempArry);
                    }
                }
              /*  var traderTable = $("#traderDetail_table").DataTable();
                traderTable.clear().draw();
                traderTable.rows.add($scope.traderDetail_dataset).draw();*/
                $rootScope.isShowTraderDetail = false;
                $scope.$apply();
                var traderTable = $("#traderDetail_table").DataTable();
                traderTable.destroy();
                var table = $rootScope.tradeDetailinitDataTables("traderDetail_table",$rootScope.traderDetail_columns_array,$scope.traderDetail_dataset,180);
                
                return getOperClientPositionSumByFundId($rootScope.myData,$rootScope.myBrokerID);
            })
            .then(function(result){
                //资金账户总持仓更新
                $scope.dataset_sum = [];
                var con = result;
                for(var i=0;i<con.length;i++){
                    var tempArr = [con[i].brokerageFirmID,con[i].instClientAbbrName,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),con[i].position];
                    $scope.dataset_sum.push(tempArr);
                }

                var capitalAccountSumTable = $("#capitalAccountSum_table").DataTable();
                capitalAccountSumTable.clear().draw();
                capitalAccountSumTable.rows.add($scope.dataset_sum).draw();
            });

        $scope.$apply();
    });
    $("body").delegate("#getRiskFundNetResult_table tbody tr", "click", function(){
        //为选中的行设置选中色
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $($("#getRiskFundNetResult_table_wrapper .DTFC_Cloned tbody tr")[$(this).context.rowIndex-1]).removeClass('selected');
        }
        else {
            $("tr.selected").removeClass("selected");
            $(this).addClass("selected");
            $($("#getRiskFundNetResult_table_wrapper .DTFC_Cloned tbody tr")[$(this).context.rowIndex-1]).addClass('selected');
        }
        //$(this).toggleClass('selected');

        //获得点击行所对应的资金账号
        var mytrData = $(this)[0].innerText.toString();
        $rootScope.myBrokerID = mytrData.split(/\s+/)[0];
        $rootScope.myData = mytrData.split(/\s+/)[2];
        $rootScope.valueFlag = "[" + $rootScope.myBrokerID+"-"+$rootScope.myData + "]";
        $rootScope.riskAndCapitalFlag = "2";

        findBySubAccountIdAndAccountIdOfRiskByFundId({fundProductID:$rootScope.myData,brokerID:$rootScope.myBrokerID})
            .then(function(result){
                var con = result;
                $scope.account_data = [];
                for(var i=0;i<con.length;i++){
                    var tempArry = [con[i].brokerageFirmID,con[i].instClientName,con[i].accountID, con[i].traderID, $rootScope.fundName(con[i].accountID), parseFloat(con[i].dynamicRights).toFixed(2),
                        parseFloat(con[i].margin).toFixed(2),parseFloat(con[i].available).toFixed(2),(parseFloat(con[i].risk).toFixed(4)*100).toFixed(2) + "%",
                        parseFloat(con[i].preBalance).toFixed(2),parseFloat(con[i].deposit).toFixed(2),parseFloat(con[i].withdraw).toFixed(2),
                        parseFloat(con[i].closeProfit).toFixed(2), parseFloat(con[i].positionProfit).toFixed(2),
                        parseFloat(con[i].fee).toFixed(2),parseFloat(con[i].frozenMargin).toFixed(2),
                        parseFloat(con[i].frozenFee).toFixed(2)];
                    $scope.account_data.push(tempArry);
                }
                //destroyDatatable("capitalAccount_table");
                var table = $("#capitalAccount_table").DataTable();
                table.clear().draw();
                table.rows.add($scope.account_data).draw();
                if(table.context.length>0){
                    var trDatas = table.context[0].aoData;
                    if(trDatas.length>0){
                        var trData = trDatas[0]._aData;
                        var mytr = trDatas[0].nTr;
                        $(mytr).addClass("selected");
                        $($("#capitalAccount_table_wrapper .DTFC_Cloned tbody tr")[$(mytr).context.rowIndex-1]).addClass('selected');
                        $rootScope.capitalQueryID = trData[3];
                        $rootScope.myBrokerID = trData[0];
                        $rootScope.trData = "[" + $rootScope.myBrokerID+"-"+trData[3] + "]";
                    }
                    else{
                        $rootScope.trData = "";
                        $rootScope.capitalQueryID = "";
                    }
                }
                $scope.$apply();
                //当前持仓菜单栏根据所获得的资金账号进行更新
                return findAllAccountByAccountIdOrGroupId($rootScope.capitalQueryID,$rootScope.queryGroupID,$rootScope.myBrokerID);
            })
            .then(function(result){
                //当前持仓
                $scope.currentPosition_dataset = [];
                $scope.priceTick = result
                if(result != undefined){
                    var con = result;
                    for(var i=0;i<con.length;i++){
                        var tempArr = [con[i].brokerageFirmID,con[i].instClientAbbrName,con[i].traderID,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),
                            $rootScope.getShowValue($rootScope.tradeTypes,con[i].hedgeFlag),con[i].position,
                            parseFloat(con[i].positionCost).toFixed(2),con[i].ydPosition,parseFloat(con[i].ydPositionCost).toFixed(2)];
                        $scope.currentPosition_dataset.push(tempArr);
                    }
                }
                var positionTable = $("#currentPosition_table").DataTable();
                positionTable.clear().draw();
                positionTable.rows.add($scope.currentPosition_dataset).draw();

                return findAllOrderByAccountIdOrGroupId($rootScope.capitalQueryID,$rootScope.queryGroupID,$rootScope.riskAndCapitalFlag,$rootScope.myBrokerID);
            })
            .then(function(result){
                //所有报单联动
                $scope.allOrders_dataset = [];
                if(result != undefined){
                    var con = result;
                    for(var i=0;i<con.length;i++){
                        var tempArr = [con[i].brokerageFirmID,con[i].instClientName,con[i].investorID,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),
                            $rootScope.getShowValue($rootScope.offsetFlag,con[i].offsetFlag),
                            $rootScope.getShowValue($rootScope.tradeTypes,con[i].hedgeFlag),
                            $rootScope.getShowValue($rootScope.orderStatus,con[i].orderStatus),parseFloat(con[i].limitPrice).toFixed($rootScope.getFixedNumberByTick(con[i].priceTick)),con[i].volumeTraded,con[i].volume,con[i].volumeRemain,con[i].insertTime,""];
                        $scope.allOrders_dataset.push(tempArr);
                    }
                }
                var orderTable = $("#allOrders_table").DataTable();
                orderTable.clear().draw();
                orderTable.rows.add($scope.allOrders_dataset).draw();

                return findAllCapitalByQueryByAccountIdOrGroupId($rootScope.capitalQueryID,$rootScope.queryGroupID,$rootScope.riskAndCapitalFlag,$rootScope.myBrokerID);
            })
            .then(function(result){
                $scope.traderDetail_dataset = [];
                //成交明细联动
                if(result != undefined){
                    var con = result;
                    for(var i=0;i<con.length;i++){
                        var tempArry = [con[i].brokerid,con[i].instClientName,con[i].investorID,con[i].subAccountID,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),
                            $rootScope.getShowValue($rootScope.offsetFlag,con[i].offsetFlag),parseFloat(con[i].tradePrice).toFixed($rootScope.getFixedNumberByTick(con[i].priceTick)),con[i].tradeVolume,
                            $rootScope.getShowValue($rootScope.tradeTypes,con[i].hedgeFlag),con[i].orderSysID,con[i].tradeID,con[i].tradingDay,con[i].tradeTime," "];
                        $scope.traderDetail_dataset.push(tempArry);
                    }
                }
                $rootScope.isShowTraderDetail = false;
                $scope.$apply();
                var traderTable = $("#traderDetail_table").DataTable();
                traderTable.destroy();
                var table = $rootScope.tradeDetailinitDataTables("traderDetail_table",$rootScope.traderDetail_columns_array,$scope.traderDetail_dataset,180);
               /* traderTable.clear().draw();
                traderTable.rows.add($scope.traderDetail_dataset).draw();*/
                
                return getOperClientPositionSumByFundId($rootScope.myData,$rootScope.myBrokerID);
            })
            .then(function(result){
                //资金账户总持仓更新
                $scope.dataset_sum = [];
                var con = result;
                for(var i=0;i<con.length;i++){
                    var tempArr = [con[i].brokerageFirmID,con[i].instClientAbbrName,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),con[i].position];
                    $scope.dataset_sum.push(tempArr);
                }
                var capitalAccountSumTable = $("#capitalAccountSum_table").DataTable();
                capitalAccountSumTable.clear().draw();
                capitalAccountSumTable.rows.add($scope.dataset_sum).draw();
            });

       /* //资产单元更新
        getRiskAccount(function(result){
            var con = result;
            $scope.riskAccount_dataset = [];
            for(var i=0;i<con.length;i++){
                var tempArr = [con[i].subAccountID,con[i].subAccountName,parseFloat(con[i].dynamicRights).toFixed(2),parseFloat(con[i].positionProfit).toFixed(2),"",
                                parseFloat(con[i].risk).toFixed(2),parseFloat(con[i].longMargin).toFixed(2),parseFloat(con[i].longFrozenMargin).toFixed(2),
                                parseFloat(con[i].shortMargin).toFixed(2),parseFloat(con[i].shortFrozenMargin).toFixed(2),parseFloat(con[i].available).toFixed(2),
                                parseFloat(con[i].fee).toFixed(2),parseFloat(con[i].closeProfit).toFixed(2),parseFloat(con[i].deposit).toFixed(2),
                                parseFloat(con[i].withdraw).toFixed(2),parseFloat(con[i].margin).toFixed(2),parseFloat(con[i].premium).toFixed(2),
                                parseFloat(con[i].frozenPremium).toFixed(2),parseFloat(con[i].frozenFee).toFixed(2),parseFloat(con[i].balance).toFixed(2),
                                parseFloat(con[i].otherFee).toFixed(2),parseFloat(con[i].mortgage).toFixed(2),parseFloat(con[i].preAvailable).toFixed(2),
                                parseFloat(con[i].preBalance).toFixed(2),con[i].initialCapital,con[i].currency];
                $scope.riskAccount_dataset.push(tempArr);
            }
            var table = $("#riskAccount_table").DataTable();
            table.clear().draw();
            table.rows.add($scope.riskAccount_dataset).draw();
            //var table = initDataTables("riskAccount_table",$rootScope.riskAccount,$scope.riskAccount_dataset,180);
        },$rootScope.myData);

        //资产单元总持仓更新
        getRiskAccountSum(function(result){
            var con = result;
            $scope.riskAccountSum_dataset = [];
            for(var i=0;i<con.length;i++){
                var tempArr = [con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),con[i].position,con[i].exchID];
                $scope.riskAccountSum_dataset.push(tempArr);
            }
            var table = $("#riskAccountSum_table").DataTable();
            table.clear().draw();
            table.rows.add($scope.riskAccountSum_dataset).draw();
            //var table = initDataTables("riskAccountSum_table",$rootScope.riskAccountSum,$scope.riskAccount_dataset,180);
        },$rootScope.myData);*/
        $scope.$apply();
    });
})
