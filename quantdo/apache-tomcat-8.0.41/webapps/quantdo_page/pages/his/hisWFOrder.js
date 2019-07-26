
myapp.controller('HisWFOrderServiceController', function ($scope, $rootScope,$timeout) {
    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;

    $scope.searchTypes = clearConstant.operClientPositon_searchType;	//查询方式下拉框内容
    $scope.orderStatus = clearConstant.orderStatus;//报单状态
    $scope.directions = clearConstant.tradeDirection;//买卖
    $scope.offsetFlags = clearConstant.offsetFlag;//开平
    $scope.traderTypes = clearConstant.tradeTypes;//交易所类型
    $scope.investorTypes = clearConstant.investorType;//投资者类型
    $scope.productTypes = clearConstant.productTypes;
    //2、定义页面数据模型
    $scope.queryEntity = {};    //实际查询对象
    $scope.capitalAccountEntitys = [];			//所有资金帐号
    $scope.TraderEntitys = [];					//所有资产单元
    $scope.queryAccountEntitys = [];			//查询帐号下拉框内容
    $scope.queryEntity.searchType = $scope.searchTypes[0].key;
    $scope.queryEntity.beginDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());
    $scope.tmpEntity = {};
    $scope.listEntitys = [];
    $scope.showID = $scope.searchTypes[0].text;
    $scope.showID1 = $scope.searchTypes[0].text;
    $scope.isRisk = false;
    $scope.sumVolumeTraded = 0;//申请量
    $scope.sumVolume = 0;//申请量
    $scope.count = 0;
    $scope.isShow = {};//资产单元 隐藏自报单编号 和下单席位号

    // 按钮权限
    $scope.hisWFOrder_query = isShow("hisWFOrder_query");
    $scope.hisWFOrder_export = isShow("hisWFOrder_export");

    var sumVolumeTraded = 0;//申请量
    var sumVolume = 0;//申请量
    var total = 0;


    $scope.instClientList = null;
    getInstClientQueryConditionList(function(result){
        $scope.instClientList = angular.copy(result);
        if($scope.instClientList.length > 1){
            $scope.queryEntity.brokerageFirmID = "";
        }else{
            $scope.queryEntity.brokerageFirmID = $scope.instClientList[0].instClientID;
        }
        $scope.$apply();
    });

    //用于营业部信息拼接（营业部代码+营业部名称）
    $scope.formatStr = function (text1,text2){
        var result="";
        if(text1  != null && text2 != null){
            result =  text1+"-"+text2;
        }
        return result;
    }

    queryInstClientID(function(result){
        if(result != undefined){
            $scope.noInst = true;
        }else{
            $scope.noInst = false;
        }
    });



    //获取所属投资机构
    queryAmType(function (result) {
        $scope.amType = result;
        if(result != null && result == '1'){
            $scope.isMom = false;
        }else{
            $scope.isMom = true;
        }
        $scope.$apply();
    });

    //所有资金帐号
    getAllCapitalAccountEntity(function (result) {
        $scope.capitalAccountEntitys = [];
        for(var i = 0 ;i < result.length ; i++){
            $scope.tmpEntity = {};
            $scope.tmpEntity.accountID = result[i].innerAccountID;
            $scope.tmpEntity.accountName = result[i].accountName;
            $scope.tmpEntity.instClientID = result[i].instClientID;
            $scope.capitalAccountEntitys.push($scope.tmpEntity);
        }
        $scope.queryAccountEntitys = $scope.capitalAccountEntitys;
        $scope.queryEntity.accountID = "";
        $scope.$apply();
    });

    //所有资产单元
    getAllTraderEntity(function (result) {
        $scope.TraderEntitys = [];
        for(var i = 0 ;i < result.length ; i++){
            $scope.tmpEntity = {};
            $scope.tmpEntity.accountID = result[i].traderID;
            $scope.tmpEntity.accountName = result[i].traderName;
            $scope.tmpEntity.instClientID = result[i].instClientID;
            $scope.TraderEntitys.push($scope.tmpEntity);
        }
    },null);

    $scope.changeInstClient = function(){
        //资金账号
        if($scope.queryEntity.searchType == 1){
            $scope.showID = "资金账号";
            //查询资金账号
            findCapitalAccountByQuery({"brokerageFirmID":$scope.queryEntity.brokerageFirmID}, function(result){
                pushEntitys(result, 1);
                $scope.$apply();
            });
        } else if($scope.queryEntity.searchType == 2){ //资产单元
            $scope.showID = "资产单元";
            //查询资产单元
            findBySubCapitalAccountInfo({"instClientID":$scope.queryEntity.brokerageFirmID}, function(result){
                pushEntitys(result, 2);
                $scope.$apply();
            });
        }
    }

    function pushEntitys(s, type){
        $scope.tEntitys = [];
        $scope.queryAccountEntitys = new Array();
        if(type == 1){
            angular.forEach(s, function (value, index, arrays) {
                $scope.tmpEntitys = {"accountID":"", "accountName":"", "instClientID":""};
                $scope.tmpEntitys.accountID = value.innerAccountID;
                $scope.tmpEntitys.accountName = value.accountName;
                $scope.tmpEntitys.instClientID = value.instClientID;
                $scope.queryAccountEntitys.push($scope.tmpEntitys);
            });
        }else if(type == 2){
            angular.forEach(s, function (value, index, arrays) {
                $scope.tmpEntitys = {"accountID":"", "accountName":"", "instClientID":""};
                $scope.tmpEntitys.accountID = value.subAccountID;
                $scope.tmpEntitys.accountName = value.subAccountName;
                $scope.tmpEntitys.instClientID = value.instClientID;
                $scope.queryAccountEntitys.push($scope.tmpEntitys);
            });
        }

        $scope.$apply();
    }

    $scope.operOrderService = new com.quantdo.orgClear.service.OperWFOrderService();
    $scope.hisOrderService = new com.quantdo.orgClear.service.HisWFOrderService();

    function initPage(){
        //会话列表初始化
        var table = $('#HisWFOrderFxService_dynamic_table').DataTable( {
            columns :[
                {title: "序号"},
                {title: "结算日期"},
                {title: "报单日期"},
                {title: "报单编号"},
                {title: "申报时间"},
                {title: "资金账号"},
                {title: "资金账号名称"},
                {title: "所属机构"},
                {title: "营业部"},
                {title: "合约代码"},
                {title: "买卖"},
                {title: "开平"},
                {title: "委托价格"},
                {title: "申报量"},
                {title: "成交量"},
                {title: "报单状态"},
                {title: "交易所代码"},
                {title: "交易类型"},
                {title: "冻结手续费", visible :false},
                {title: "冻结保证金", visible :false},
                {title: "子报单编号"},
                {title: "撤单用户"},
                {title: "撤单时间"},
                {title: "下单席位号"},
                {title: "交易员"},
                {title: "交易员名称"},
                {title: "交易员IP地址"},
                {title: "交易员MAC地址"},
                {title: "投资顾问"},
                {title: "投资顾问名称"},
                {title: "投顾IP地址"},
                {title: "投顾MAC地址"},
                {title: "投资经理"},
                {title: "投资经理名称"},
                {title: "投资经理IP地址"},
                {title: "投资经理MAC地址"},
                {title: "备注"}

            ],
            "processing": true,
            "serverSide": true,
            dom: 'rt<"bottom"iplB>',
            buttons: [],
            "bFilter": false,
            "aaSorting" : [], // 默认的排序方式，按日期降序
            // "aaSorting" : [[2, "asc"]], // 默认的排序方式，按日期降序
            "aoColumnDefs": [
                { "bSortable": false, "aTargets": [] },
                {
                    "aTargets": [1],
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {

                    }
                },
                /*		      {
                              "targets": [ 17 ],
                              "visible": false
                            } */
            ],
            "ajax": $scope.find($scope.queryEntity),
            //"scrollY": 360,
            //"scrollCollapse":true,
            "scrollX": true,
            "footerCallback": function () {

                var api = this.api();

                $scope.hisOrderService.totleHisOrder($scope.tmpQuery, function(retrunData){
                    if(retrunData != null && retrunData != undefined){
                        $( api.column( 13 ).footer() ).html(parseFloat(retrunData.volumeStr).toFixed(0));
                        $( api.column( 14 ).footer() ).html(parseFloat(retrunData.volumeTradedStr).toFixed(2));
                    }else{
                        $( api.column( 13 ).footer() ).html(0);
                        $( api.column( 14 ).footer() ).html(0.00);

                    }
                });
            }
        } );

        //会话列表初始化
        var comtable = $('#HisWFOrderZjService_dynamic_table').DataTable( {
            columns :[
                {title: "序号"},
                {title: "结算日期"},
                {title: "报单日期"},
                {title: "报单编号"},
                {title: "申报时间"},
                {title: "资产单元"},
                {title: "资产单元名称"},
                {title: "资金账号", visible :false},
                {title: "资金账号名称", visible :false},
                {title: "所属机构"},
                {title: "营业部"},
                {title: "合约代码"},
                {title: "买卖"},
                {title: "开平"},
                {title: "委托价格"},
                {title: "申报量"},
                {title: "成交量"},
                {title: "报单状态"},
                {title: "交易所代码"},
                {title: "交易类型"},
                {title: "冻结手续费", visible :false},
                {title: "冻结保证金", visible :false},
                {title: "撤单用户"},
                {title: "撤单时间"},
                {title: "交易员"},
                {title: "交易员名称"},
                {title: "交易员IP地址"},
                {title: "交易员MAC地址"},
                {title: "投资顾问"},
                {title: "投资顾问名称"},
                {title: "投顾IP地址"},
                {title: "投顾MAC地址"},
                {title: "投资经理"},
                {title: "投资经理名称"},
                {title: "投资经理IP地址"},
                {title: "投资经理MAC地址"},
                {title: "备注"}

            ],
            "processing": true,
            "serverSide": true,
            "bFilter": false,
            dom: 'rt<"bottom"iplB>',
            buttons: [],
            "aaSorting" : [],
            "aoColumnDefs": [
                { "bSortable": false, "aTargets": [] },
                {
                    "aTargets": [1],
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {

                    }
                },
                /*		      {
                          "targets": [ 17 ],
                          "visible": false
                        } */
            ],
            "ajax": $scope.find($scope.queryEntity),
            //"scrollY": 360,
            //"scrollCollapse":true,
            "scrollX": true,
            "footerCallback": function () {
                var api = this.api();

                $scope.hisOrderService.totleHisOrder($scope.tmpQuery, function(retrunData){
                    if(retrunData != null && retrunData != undefined){

                        $( api.column( 13 ).footer() ).html(parseFloat(retrunData.volumeStr).toFixed(2));
                        $( api.column( 14 ).footer() ).html(parseFloat(retrunData.volumeTradedStr).toFixed(2));

                    }else{
                        $( api.column( 13 ).footer() ).html(0.00);
                        $( api.column( 14 ).footer() ).html(0.00);


                    }
                });

            }
        } );
    }


    $scope.find = function(queryEntity) {

        return function (request, drawCallback, settings){
            var ajax          = false;
            var requestStart  = request.start;
            var drawStart     = request.start;
            var requestLength = request.length;
            var requestEnd    = requestStart + requestLength;
            var page = drawStart/requestLength + 1;
            // 获取settings中默认排序内容
            if( settings.aaSorting.length == 0 ){

                $scope.orderType =null;
                $scope.orderWay = 2;
            }else {
                $scope.orderType = settings.aaSorting[0][0];
                var orderT = settings.aaSorting[0][1];

                if(orderT == "asc"){
                    $scope.orderWay = 1;
                }else{
                    $scope.orderWay = 2;
                }
            }

            request.start = requestStart;
            var requestParams = {
                "pageNo":page,
                "pageSize":requestLength
            }

            //将数据集赋值为空
            var tempArray =[];
            //更新表格对应的数据集
            $scope.isQuery = false;
            $scope.HisWFTradeServiceDataset = [];
            $scope.listEntitys = [];
            $scope.isShow = queryEntity.searchType;
            $scope.tmpQuery = angular.copy(queryEntity);

            if ($scope.tmpQuery.accountID != null) {
                var accountEntity = angular.copy($scope.tmpQuery.accountID);
                delete $scope.tmpQuery.accountID;
                $scope.tmpQuery.accountID = accountEntity.accountID;
                //            $scope.tmpQuery.instClientID = accountEntity.instClientID;
            }

            if ($scope.tmpQuery.beginDate > $scope.tmpQuery.endDate) {
                layer.msg('开始日期不能大于结束日期！！', {
                    icon: 2
                });
                $timeout(function () {
                }, 1000);
                return false;
            }

            $scope.sumTradeVolume = 0;//申请量
            $scope.sumUsedFee = 0;//申请量
            $scope.count = 0;//一共多少笔


            if ($scope.isShow == 1) {
                $scope.hisOrderService.findHisWFOrderByCapital($scope.tmpQuery, requestParams, $scope.orderType, $scope.orderWay, function (result) {
                    var con = result.content;
                    $scope.result = con;
                    for (var i = 0; i < con.length; i++) {
                        if (con[i].branchID == "null" || con[i].branchID == null) {
                            con[i].branchID = "";
                        }
                        if (con[i].branchName == "null" || con[i].branchName == null) {
                            con[i].branchName = "";
                        }
                        var tempArr = [(i+1),con[i].settleDate,con[i].tradingDay,con[i].orderSysID,con[i].insertTime,con[i].investorID
                            ,con[i].accountName,con[i].instClientName,$scope.formatStr(con[i].branchID,con[i].branchName),con[i].instrumentID,$scope.transDirection(con[i].direction)
                            ,$scope.transOffsetFlag(con[i].offsetFlag),con[i].limitPrice.toFixed(3),con[i].volume,con[i].volumeTraded
                            ,$scope.transOrderStatus(con[i].orderStatus),con[i].exchID,$scope.transTradeType(con[i].hedgeFlag)
                            ,(con[i].eachFee*con[i].volumeRemain).toFixed(2),(con[i].eachMargin*con[i].volumeRemain).toFixed(2)
                            ,con[i].subOrderSysID,con[i].cancelUserID,con[i].cancelTime,con[i].seatID,con[i].userTrader,con[i].userTraderName
                            ,con[i].ipAddress,con[i].macAddress,con[i].investorAdvisor,con[i].investorAdvisorName,con[i].advIpAddr,con[i].advMacAddr
                            ,con[i].investorManager,con[i].investorManagerName,con[i].mngIpAddr,con[i].mngMacAddr,con[i].errorMsg];
                        tempArray.push(tempArr);

                    }
                    var json = {
                        "draw":request.draw,
                        "recordsTotal":result.totalRecord,
                        "recordsFiltered":result.totalRecord,
                        "data":tempArray,
                        "column":[12]
                    }
                    drawCallback( json );
                });
            } else {
                $scope.hisOrderService.findHisWFOrderBySubAccount($scope.tmpQuery, requestParams, $scope.orderType, $scope.orderWay, function (result) {
                    var con = result.content;
                    $scope.result = con;
                    for (var i = 0; i < con.length; i++) {
                        if (con[i].branchID == "null" || con[i].branchID == null) {
                            con[i].branchID = "";
                        }
                        if (con[i].branchName == "null" || con[i].branchName == null) {
                            con[i].branchName = "";
                        }
                            var tempArr = [(i+1),con[i].settleDate,con[i].tradingDay,con[i].orderSysID,con[i].insertTime,con[i].investorID
                                ,con[i].accountName,con[i].inneraccountID,con[i].inneraccountName,con[i].instClientName,$scope.formatStr(con[i].branchID,con[i].branchName)
                                ,con[i].instrumentID,$scope.transDirection(con[i].direction),$scope.transOffsetFlag(con[i].offsetFlag)
                                ,con[i].limitPrice.toFixed(3),con[i].volume,con[i].volumeTraded,$scope.transOrderStatus(con[i].orderStatus)
                                ,con[i].exchID,$scope.transTradeType(con[i].hedgeFlag),(con[i].eachFee*con[i].volumeRemain).toFixed(2)
                                ,(con[i].eachMargin*con[i].volumeRemain).toFixed(2),con[i].cancelUserID,con[i].cancelTime
                                ,con[i].userTrader,con[i].userTraderName,con[i].ipAddress,con[i].macAddress,con[i].investorAdvisor
                                ,con[i].investorAdvisorName,con[i].advIpAddr,con[i].advMacAddr,con[i].investorManager
                                ,con[i].investorManagerName,con[i].mngIpAddr,con[i].mngMacAddr,con[i].errorMsg];
                        tempArray.push(tempArr);

                    }

                    var json = {
                        "draw": request.draw,
                        "recordsTotal": result.totalRecord,
                        "recordsFiltered": result.totalRecord,
                        "data": tempArray,
                        "column": [12]
                    }
                    drawCallback(json);

                });
            }
        }
    }
    //初始化
    $(document).ready(function() {
        initPage();
    });



    // 查询(后台分页)
    $scope.find = function(queryEntity){
        $scope.isQuery = false;
        $scope.tmpQuery=angular.copy(queryEntity);
        if($scope.tmpQuery.accountID != null){
            var accountEntity = angular.copy($scope.tmpQuery.accountID);
            delete $scope.tmpQuery.accountID;
            $scope.tmpQuery.accountID = accountEntity.accountID;
//            $scope.tmpQuery.instClientID = accountEntity.instClientID;
        }
        if(queryEntity.searchType==1){
            var table = $('#HisWFOrderFxService_dynamic_table').DataTable();
            $scope.isCom=false;
            table.draw();
        }else {
            var table = $('#HisWFOrderZjService_dynamic_table').DataTable();
            $scope.isCom=true;
            table.draw();
        }
        $timeout(function() {
            $scope.isQuery = false;
        }, 500);
    }




    //买卖
    $scope.transDirection = function (direction){
        for(var i = 0;i < $scope.directions.length;i++){
            if($scope.directions[i].key == direction){
                return $scope.directions[i].text;
            }
        }
    }
    //开平
    $scope.transOffsetFlag = function (offsetFlag){
        for(var i = 0;i < $scope.offsetFlags.length;i++){
            if($scope.offsetFlags[i].key == offsetFlag){
                return $scope.offsetFlags[i].text;
            }
        }
    }
    //报单状态
    $scope.transOrderStatus = function (orderStatusl){
        for(var i = 0;i < $scope.orderStatus.length;i++){
            if($scope.orderStatus[i].key == orderStatusl){
                return $scope.orderStatus[i].text;
            }
        }
    }
    //交易类型
    $scope.transTradeType = function (tradeType){
        for(var i = 0;i < $scope.traderTypes.length;i++){
            if($scope.traderTypes[i].key == tradeType){
                return $scope.traderTypes[i].text;
            }
        }
    }
    //投资者类型
    $scope.transInvestorType = function (investorType){
        for(var i = 0;i < $scope.investorTypes.length;i++){
            if($scope.investorTypes[i].key == investorType){
                return $scope.investorTypes[i].text;
            }
        }
    }

    //导出excel
    $scope.exportExcelHWFO = function (queryEntity) {
        $scope.tmpQuery = angular.copy(queryEntity);
        if($scope.tmpQuery.accountID != null){
            var accountEntity = angular.copy($scope.tmpQuery.accountID);
            delete $scope.tmpQuery.accountID;
            $scope.tmpQuery.accountID = accountEntity.accountID;
//            $scope.tmpQuery.brokerageFirmID = accountEntity.instClientID;
        }

        if($scope.tmpQuery.beginDate > $scope.tmpQuery.endDate){
            layer.msg('开始日期不能大于结束日期！！', {
                icon : 2
            });
            return false;
        }
        if($scope.tmpQuery.searchType == "1"){
            framework.file.export("历史委托查询.xls",'excel',{
                entityKey:['settleDate','tradingDay',
                    'orderSysID','insertTime','accountID','accountName','instClientName','branchID',
                    'instrumentID','direction','offsetFlag','limitPriceStr','volumeStr',
                    'volumeTradedStr','orderStatus','exchID','hedgeFlag','eachFeeStr',
                    'eachMarginStr','subOrderSysID',
                    'cancelUserID','cancelTime','seatID','userID','userTraderName','ipAddress','macAddress','investorAdvisor','investorAdvisorName', 'advIpAddr','advMacAddr','investorManager','investorManagerName','mngIpAddr','mngMacAddr', 'errorMsg'],

                headerKey:['结算日期','报单日期',
                    '报单编号','申报时间','资金账号','资金账号名称','所属机构','营业部',
                    '合约代码','买卖','开平','委托价格','申报量',
                    '成交量','报单状态', '交易所代码','交易类型','冻结手续费',
                    '冻结保证金','子报单编号',
                    '撤单用户','撤单时间', '下单席位号','交易员','交易员名称','交易员IP地址','交易员MAC地址','投资顾问','投资顾问名称','投顾IP地址','投顾MAC地址', '投资经理','投资经理名称','投资经理IP地址','投资经理MAC地址','备注'],
                styles:['plainText','plainText',
                    'plainText','plainText','plainText','plainText','plainText','plainText',
                    'plainText','plainText','plainText','plainText','plainText',
                    'plainText','plainText','plainText','plainText','plainText',
                    'plainText','plainText','plainText','plainText','plainText',
                    'plainText','plainText','plainText','plainText','plainText',
                    'plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText'],
                title:"历史委托查询",

                dicMap:{direction:{'0':"买",'1':"卖"},hedgeFlag:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}
                    ,offsetFlag:{'0':"开仓",'1':"平仓",'2':"强平",'3':"平今",'4':"平昨"}
                    ,orderStatus:{'0':"全部成交",'1':"部分成交还在队列中",'2':"部分成交不在队列中",'3':"未成交还在队列中",'4':"未成交不在队列中",'5':"撤单",'6':"订单已报入交易所未应答",'7':"部分撤单"}}
            },"hisWFOrderService","exportExcelHWFOCap",$scope.tmpQuery,$scope.tmpQuery.beginDate ,$scope.tmpQuery.endDate);
        }else{
            framework.file.export("历史委托查询.xls",'excel',{
                entityKey:['settleDate','tradingDay',
                    'orderSysID','insertTime','accountID','accountName','inneraccountID','inneraccountName','instClientName','branchID',
                    'instrumentID','direction','offsetFlag','limitPriceStr','volumeStr',
                    'volumeTradedStr','orderStatus','exchID','hedgeFlag','eachFeeStr',
                    'eachMarginStr',
                    'cancelUserID','cancelTime','userID','userTraderName','ipAddress','macAddress','investorAdvisor','investorAdvisorName', 'advIpAddr','advMacAddr','investorManager','investorManagerName','mngIpAddr','mngMacAddr', 'errorMsg'],

                headerKey:['结算日期','报单日期',
                    '报单编号','申报时间','资产单元','资产单元名称','资金账号','资金账号名称','所属机构','营业部',
                    '合约代码','买卖','开平','委托价格','申报量',
                    '成交量','报单状态', '交易所代码','交易类型','冻结手续费',
                    '冻结保证金','撤单用户','撤单用户','交易员','交易员名称','交易员IP地址','交易员MAC地址','投资顾问','投资顾问名称','投顾IP地址','投顾MAC地址','投资经理','投资经理名称',
                    '投资经理IP地址','投资经理MAC地址','备注'],
                styles:['plainText','plainText',
                    'plainText','plainText','plainText','plainText','plainText','plainText','plainText',
                    'plainText','plainText','plainText','plainText','plainText','plainText',
                    'plainText','plainText','plainText','plainText','plainText',
                    'plainText','plainText','plainText','plainText','plainText',
                    'plainText','plainText','plainText','plainText',
                    'plainText','plainText','plainText','plainText','plainText','plainText','plainText'],
                title:"历史委托查询",

                dicMap:{direction:{'0':"买",'1':"卖"},hedgeFlag:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}
                    ,offsetFlag:{'0':"开仓",'1':"平仓",'2':"强平",'3':"平今",'4':"平昨"}
                    ,orderStatus:{'0':"全部成交",'1':"部分成交还在队列中",'2':"部分成交不在队列中",'3':"未成交还在队列中",'4':"未成交不在队列中",'5':"撤单",'6':"订单已报入交易所未应答",'7':"部分撤单"}}
            },"hisWFOrderService","exportExcelHWFOSubCap",$scope.tmpQuery,$scope.tmpQuery.beginDate ,$scope.tmpQuery.endDate);
        }
    };

});

