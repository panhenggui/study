myapp.controller('HisOptionSelfCloseController', function ($scope, $timeout,$rootScope) {

    $scope.hisOptionSelfCloseService = new com.quantdo.orgClear.service.hisOptionSelfCloseService();

    // 按钮权限
    $scope.hisOptionSelfClose_query = isShow("hisOptionSelfClose_query");
    $scope.hisOptionSelfClose_export = isShow("hisOptionSelfClose_export");
    
    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;

    $scope.queryEntity = {};
    $scope.queryEntity.beginDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());
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

    // 查询(前台分页)
    $scope.find = function(queryEntity){

        if(queryEntity.beginDate > queryEntity.endDate){
            layer.msg("开始日期不能大于结束日期!", {icon : 2 , time : 3000});
            return false;
        }
        var table = $('#hisOptionSelfClose_dynamic_table').DataTable();
        table.draw();

    }

    $scope.isQuery = false;
    $scope.hisOptionSelfCloseQuery = function ( opts ) {
        return function ( request, drawCallback, settings ) {
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

            var tempArray =[];
            $scope.hisOptionSelfCloseService.findByQuery($scope.queryEntity, $scope.queryEntity.beginDate, $scope.queryEntity.endDate, requestParams, $scope.orderType, $scope.orderWay, function(result){
                var con = result.content;

                for(var i = 0; i<con.length;i++){
                    var tempArr = [(i+1),con[i].id,con[i].settleDate,$scope.transInstClient(con[i].brokerageFirmID),con[i].investorID,con[i].exchID,con[i].instrumentID,$scope.transOptSelfCloseFlag(con[i].optSelfCloseFlag),con[i].volume,
                        $scope.transTradeType(con[i].hedgeFlag),""];
                    tempArray.push(tempArr);
                }
                $scope.listEntitys = con;
                var json = {
                    "draw":request.draw,
                    "recordsTotal":result.totalRecord,
                    "recordsFiltered":result.totalRecord,
                    "data":tempArray
                }

                drawCallback( json );

                $scope.$apply();
                $timeout(function() {
                    $scope.isQuery = false;
                }, 300);
            });
        }
    };

    //机构名称转换
    $scope.transInstClient = function (instClientID) {
        for(var i = 0;i < $scope.instClientList.length; i++){
            if($scope.instClientList[i].instClientID == instClientID){
                return $scope.instClientList[i].instClientAbbrName;
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

    //交易类型
    $scope.transTradeType = function (tradeType){
        for(var i = 0;i < $scope.traderTypes.length;i++){
            if($scope.traderTypes[i].key == tradeType){
                return $scope.traderTypes[i].text;
            }
        }
        return "";
    }


    //定义历史自动对冲申请查询的固定列头
    $scope.hisOptionSelfClose_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "交易日期"},
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
        initPage();
	});

    function initPage(){
        //会话列表初始化
        var table = $('#hisOptionSelfClose_dynamic_table').DataTable( {
            columns :$scope.hisOptionSelfClose_columns,
            "processing": true,
            "serverSide": true,
            dom: 'rt<"bottom"iplB>',
            buttons: [],
            "bFilter": false,
            "aaSorting" : [],
            "aoColumnDefs": [
                { "bSortable": false, "aTargets": [] },
                {
                    "aTargets": [1],
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {

                    }
                },
            ],
            "ajax": $scope.hisOptionSelfCloseQuery({}),
            //"scrollY": 360,
            //"scrollCollapse":true,
            "scrollX": true
        });
    }

	 //导出excel
    $scope.exportExcelHisOptionSelfClose = function (queryEntity) {

		framework.file.export("历史自动对冲申请查询.xls",'excel',{
			entityKey:['settleDate','instClientAbbrName','investorID','exchID','instrumentID','optSelfCloseFlag','volume', 'hedgeFlag'],
			headerKey:['交易日期','所属机构','资金账号','交易所代码','合约代码','对冲类型','申请手数','投保标志','对冲结果'],
			styles:['plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText'],
			title:"历史自动对冲申请查询",
            dicMap:{optSelfCloseFlag:{'1':'自对冲期权仓位','2':'保留期权仓位','3':'自对冲卖方履约后的期货仓位'},hedgeFlag:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}}

		},"hisOptionSelfCloseService","exportExcelHisOptionSelfClose",queryEntity,queryEntity.beginDate,queryEntity.endDate);

    };
    
});

