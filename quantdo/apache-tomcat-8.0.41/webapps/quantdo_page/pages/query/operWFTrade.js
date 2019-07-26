myapp.controller('OperWFTradeController', function ($scope, $rootScope,$timeout) {
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
    $scope.tmpEntity = {};
    $scope.listEntitys = [];
    $scope.showID = $scope.searchTypes[1].text;
    $scope.showID1 = $scope.searchTypes[1].text;
    $scope.isRisk = false;
    $scope.sumVolumeTraded = 0;//申请量
    $scope.sumVolume = 0;//申请量
    $scope.count = 0;
    $scope.isShow = {};//资产单元 隐藏自报单编号 和下单席位号

    // 按钮权限
    $scope.operWFTrade_query = isShow("operWFTrade_query");
    $scope.operWFTrade_export = isShow("operWFTrade_export");

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

    /*$scope.instClientService = new com.quantdo.orgClear.service.instClientService();

	//初始化机构信息
	$scope.instClientService.findByQuery(function (result) {
	    $scope.instClientlistEntitys = result;
	    $scope.$apply();
	},{});*/

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
    $scope.operTradeService = new com.quantdo.orgClear.service.OperTradeService;


    function initPage(){
        //会话列表初始化
        var table = $('#operWFTrade_dynamic_tableOne').DataTable( {
            columns :[
                {title: "序号"},
                {title: "成交时间"},
                {title: "成交号"},
                {title: "资金账号"},
                {title: "资金账号名称"},
                {title: "所属机构"},
                {title: "交易所代码"},
                {title: "营业部"},
                {title: "合约代码"},
                {title: "买卖"},
                {title: "开平"},
                {title: "交易类型"},
                {title: "成交量"},
                {title: "成交价"},
                {title: "报单编号"},
                {title: "手续费"},
                {title: "交易员"},
                {title: "交易员名称"},
                {title: "交易员IP"},
                {title: "交易员MAC"},
                {title: "投资经理"},
                {title: "投资经理名称"},
                {title: "投资经理IP"},
                {title: "投资经理MAC"},
                {title: "投资顾问"},
                {title: "投资顾问名称"},
                {title: "投资顾问IP"},
                {title: "投资顾问MAC"}

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
            "ajax": $scope.findcapital($scope.queryEntity),
            //"scrollY": 360,
            //"scrollCollapse":true,
            "scrollX": true,
            "footerCallback": function () {

                var api = this.api();

                $scope.operTradeService.totalTradeClientPos($scope.tmpQuery, function(retrunData){
                    if(retrunData != null && retrunData != undefined){

                        $( api.column( 13 ).footer() ).html(parseFloat(retrunData.tradeVolume).toFixed(2));
                        $( api.column( 15 ).footer() ).html(parseFloat(retrunData.usedFee).toFixed(2));

                    }else{
                        $( api.column( 13 ).footer() ).html(0.00);
                        $( api.column( 15 ).footer() ).html(0.00);


                    }
                });
            }
        } );

        //会话列表初始化
        var comtable = $('#operWFTrade_dynamic_tableTwo').DataTable( {
            columns :[
                {title: "序号"},
                {title: "成交时间"},
                {title: "成交号"},
                {title: "资产单元"},
                {title: "资产单元名称"},
                {title: "资金账号",visible :false},
                {title: "资金账号名称",visible :false},
                {title: "所属机构"},
                {title: "交易所代码"},
                {title: "营业部"},
                {title: "合约代码"},
                {title: "买卖"},
                {title: "开平"},
                {title: "交易类型"},
                {title: "成交量"},
                {title: "成交价"},
                {title: "报单编号"},
                {title: "手续费"},
                {title: "交易员"},
                {title: "交易员名称"},
                {title: "交易员IP"},
                {title: "交易员MAC"},
                {title: "投资经理"},
                {title: "投资经理名称"},
                {title: "投资经理IP"},
                {title: "投资经理MAC"},
                {title: "投资顾问"},
                {title: "投资顾问名称"},
                {title: "投资顾问IP"},
                {title: "投资顾问MAC"}

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
            "ajax": $scope.findSub($scope.queryEntity),
            //"scrollY": 360,
            //"scrollCollapse":true,
            "scrollX": true,
            "footerCallback": function () {
                var api = this.api();

                $scope.operTradeService.totalTradeClientPos($scope.tmpQuery, function(retrunData){
                    if(retrunData != null && retrunData != undefined){

                        $( api.column( 14 ).footer() ).html(parseFloat(retrunData.tradeVolume).toFixed(2));
                        $( api.column( 17 ).footer() ).html(parseFloat(retrunData.usedFee).toFixed(2));

                    }else{
                        $( api.column( 14 ).footer() ).html(0.00);
                        $( api.column( 17 ).footer() ).html(0.00);


                    }
                });

            }
        } );
    }


    $scope.findcapital = function(queryEntity) {

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

            if ($scope.isShow == 1) {
                $scope.operTradeService.findOperWFTradeByQuery($scope.tmpQuery, requestParams, $scope.orderType, $scope.orderWay, function (result) {
                    var con = result.content;
                    $scope.result = con;
                    for (var i = 0; i < con.length; i++) {
                        if (con[i].branchID == "null" || con[i].branchID == null) {
                            con[i].branchID = "";
                        }
                        if (con[i].branchName == "null" || con[i].branchName == null) {
                            con[i].branchName = "";
                        }
                        var tempArr = [(i+1),con[i].tradeTime,con[i].tradeID, con[i].investorID,con[i].accountName,
                            con[i].instClientName,con[i].exchID , $scope.formatStr(con[i].branchID,con[i].branchName),con[i].instrumentID,
                            $scope.transDirection(con[i].direction) , con[i].offsetFlag, $scope.transTradeType(con[i].hedgeFlag), con[i].tradeVolume,
                            parseFloat(con[i].tradePrice).toFixed(3) , con[i].orderSysID , parseFloat(con[i].usedFee).toFixed(2), con[i].tradeUser,
                            con[i].tradeUserName , con[i].ipAddress,con[i].macAddress , con[i].investManager , con[i].investManagerName ,
                            con[i].mngIpAddr , con[i].mngMacAddr , con[i].investAdviser , con[i].investAdviserName ,
                            con[i].advIpAddr , con[i].advMacAddr
                        ];
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
            }
        }
    }

    $scope.findSub= function(queryEntity) {

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

            if ($scope.isShow == 2) {
                $scope.operTradeService.findOperWFTradeBySubQuery($scope.tmpQuery, requestParams, $scope.orderType, $scope.orderWay, function (result) {
                    var con = result.content;
                    $scope.result = con;
                    for (var i = 0; i < con.length; i++) {
                          if (con[i].branchID == "null" || con[i].branchID == null) {
                              con[i].branchID = "";
                          }
                          if (con[i].branchName == "null" || con[i].branchName == null) {
                              con[i].branchName = "";
                          }
                        var tempArr = [(i+1) , con[i].tradeTime , con[i].tradeID , con[i].investorID , con[i].accountName,
                            con[i].inneraccountID , con[i].inneraccountName , con[i].instClientName , con[i].exchID,
                            $scope.formatStr(con[i].branchID,con[i].branchName) , con[i].instrumentID,
                            $scope.transDirection(con[i].direction) , con[i].offsetFlag,
                            $scope.transTradeType(con[i].hedgeFlag) , con[i].tradeVolume,

                            parseFloat(con[i].tradePrice).toFixed(3) , con[i].orderSysID , parseFloat(con[i].usedFee).toFixed(2),

                            con[i].tradeUser , con[i].tradeUserName , con[i].ipAddress , con[i].macAddress,
                            con[i].investManager , con[i].investManagerName , con[i].mngIpAddr,con[i].mngMacAddr,
                            con[i].investAdviser , con[i].investAdviserName , con[i].advIpAddr,con[i].advMacAddr
                        ];
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
            var table = $('#operWFTrade_dynamic_tableOne').DataTable();
            $scope.isCom=false;
            table.draw();
        }else {
            var table = $('#operWFTrade_dynamic_tableTwo').DataTable();
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
    $scope.exportExcelOWFT = function (queryEntity) {
        $scope.tmpQuery=angular.copy(queryEntity);
        if($scope.queryEntity.accountID != null){
            var accountEntity = angular.copy($scope.queryEntity.accountID);
            delete $scope.tmpQuery.accountID;
            $scope.tmpQuery.investorID = $scope.queryEntity.accountID;
//            $scope.tmpQuery.brokerageFirmID = accountEntity.instClientID;
        }

        if($scope.tmpQuery.searchType == "1"){
            framework.file.export("实时成交查询.xls",'excel',{
                entityKey:['tradeTime','tradeID','investorID','accountName','instClientName',
                    'exchID', 'branchID','instrumentID','direction','offsetFlag','hedgeFlag',
                    'tradeVolumeStr', 'tradePriceStr','orderSysID','usedFeeStr','tradeUser','tradeUserName','ipAddress','macAddress',
                    'investManager','investManagerName','mngIpAddr','mngMacAddr','investAdviser','investAdviserName','advIpAddr','advMacAddr'],

                headerKey:['成交时间','成交号','资金账号','资金账号名称','所属机构',
                    '交易所代码','营业部','合约代码','买卖','开平','交易类型',
                    '成交量','成交价','报单编号','手续费', '交易员', '交易员名称','交易员IP','交易员MAC',
                    '投资经理', '投资经理名称','投资经理IP','投资经理MAC','投资顾问', '投资顾问名称','投资顾问IP','投资顾问MAC'],
                styles:['plainText','plainText','plainText','plainText','plainText','plainText',
                    'plainText','plainText','plainText','plainText','plainText',
                    'plainText','plainText','plainText','plainText','plainText',
                    'plainText','plainText','plainText','plainText','plainText',
                    'plainText','plainText','plainText','plainText','plainText','plainText'],
                title:"实时成交查询",
                dicMap:{direction:{'0':"买",'1':"卖"},hedgeFlag:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}
                    ,offsetFlag:{'0':"开仓",'1':"平仓",'2':"强平",'3':"平今",'4':"平昨"}}
            },"operWFTradeService","exportExcelOWFTCap",$scope.tmpQuery);
        } else {
            framework.file.export("实时成交查询.xls",'excel',{
                entityKey:['tradeTime','tradeID','investorID','accountName','inneraccountID','inneraccountName','instClientName',
                    'exchID','branchID', 'instrumentID','direction','offsetFlag','hedgeFlag',
                    'tradeVolumeStr', 'tradePriceStr','orderSysID','usedFeeStr','tradeUser','tradeUserName','ipAddress','macAddress',
                    'investManager','investManagerName','mngIpAddr','mngMacAddr','investAdviser','investAdviserName','advIpAddr','advMacAddr'],

                headerKey:['成交时间','成交号','资产单元','资产单元名称','资金账号','资金账号名称','所属机构',
                    '交易所代码','营业部','合约代码','买卖','开平','交易类型',
                    '成交量','成交价','报单编号','手续费', '交易员', '交易员名称','交易员IP','交易员MAC',
                    '投资经理', '投资经理名称','投资经理IP','投资经理MAC','投资顾问', '投资顾问名称','投资顾问IP','投资顾问MAC'],
                styles:['plainText','plainText','plainText','plainText','plainText','plainText',
                    'plainText','plainText','plainText','plainText','plainText',
                    'plainText','plainText','plainText','plainText','plainText',
                    'plainText','plainText','plainText','plainText','plainText',
                    'plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText'],
                title:"实时成交查询",
                dicMap:{direction:{'0':"买",'1':"卖"},hedgeFlag:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}
                    ,offsetFlag:{'0':"开仓",'1':"平仓",'2':"强平",'3':"平今",'4':"平昨"}}
            },"operWFTradeService","exportExcelOWFTSubCap",$scope.tmpQuery);
        }
    }

});

