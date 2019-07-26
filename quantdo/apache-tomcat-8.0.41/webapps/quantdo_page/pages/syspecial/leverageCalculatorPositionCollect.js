myapp.controller('LeverageCalculatorPositionCollectController', function ($scope,$rootScope, $timeout) {
    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;

    $scope.leverageCalculatorPositionCollectService = new com.quantdo.orgClear.servicesyspecial.leverageCalculatorPositionCollectService();
    $scope.instClientService = new com.quantdo.orgClear.service.instClientService();

    $scope.listEntitys = [];
    $scope.queryEntity = {};
    $scope.leverageCalculatorPositionCollectDataset = [];
    $scope.allAccountEntitys = [];
    $scope.tradeDirection = clearConstant.tradeDirection;

    $scope.leverageCalculatorPositionCollect_query = isShow("leverageCalculatorPositionCollect_query");
    //初始化机构信息
    $scope.queryinstClientlists =[];
    $scope.instClientService.findByQuery(function (result) {
        $scope.queryinstClientlists = result;
        $scope.$apply();
    },{amType:""});

    $scope.instClientID = '';
    //判定登录用户的机构权限
    queryInstClientID(function (result) {
        $scope.instClientID = result;
        $scope.queryEntity={};
        if($scope.instClientID != undefined ){
            $scope.isInstClient = true;
            $scope.queryEntity.instClientID=$scope.instClientID;
        }else{
            $scope.isInstClient = false;
        }

        $scope.$apply();
    });

    //查询资产单元
    $scope.leverageCalculatorPositionCollectService.findInnnerAccount({"instClientID":""}, function(result){
        $scope.queryAccountEntitys = result;
        $scope.allAccountEntitys = result;
        $scope.$apply();
    });

    $scope.exchangeData = [];
    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeData = result;
        $scope.$apply();
    });
    //定义机构改变查询资产单元的事件
    $scope.changeInstClient = function(){
        if("" == $scope.queryEntity.instClientID){
            $scope.queryEntity.instClientID = null;
        }
        //查询资产单元
        $scope.leverageCalculatorPositionCollectService.findInnnerAccount({"instClientID":$scope.queryEntity.instClientID}, function(result){
            $scope.queryAccountEntitys = result;
            $scope.$apply();
        });
    }

    $scope.find = function(){
        //将数据集赋值为空
        $scope.leverageCalculatorPositionCollectDataset = [];
        //更新表格对应的数据集
        $scope.leverageCalculatorPositionCollectService.findAll(function (result) {    //后面在后端需要对这个函数返回的result重新构建
            //con[i][2]为机构名称
            var con = result;
            $scope.listEntitys = result;
            var tempArray = new Array();
            if(con ==null) {
            }else{
                for (var i = 0; i < con.length; i++) {

                    var tempArr = [con[i][0], con[i][2], con[i][3], con[i][4],
                        con[i][6], con[i][7],$scope.transDirection(con[i][5]),$scope.transaddorsub(con[i][8]),con[i][8],con[i][9]];
                    $scope.leverageCalculatorPositionCollectDataset.push(tempArr);
                    con[i].index = tempArr[0];
                }
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.leverageCalculatorPositionCollectTable.clear().draw();
            $scope.leverageCalculatorPositionCollectTable.rows.add($scope.leverageCalculatorPositionCollectDataset).draw();
        }, $scope.queryEntity);
    }
    /*$scope.trans = function(m){
        if(m < 0){
            return -m;
        }else {
            return m;
        }
    }*/

    $scope.transDirection = function(direction){
        for(var i=0;i<$scope.tradeDirection.length;i++){
            if($scope.tradeDirection[i].key == direction){
                return $scope.tradeDirection[i].text;
            }
        }
    };
    $scope.transaddorsub = function(m){
        if(m >=0){
            return "加仓";
        }else{
            return "减仓";
        }
    };

    $scope.leverageCalculatorPositionCollect_columns = [
        //{title: "id",visible:false},
        {title: "日期",visible:false},
        {title: "所属机构"},
        {title: "资产单元"},
        {title: "交易所"},
        {title: "品种"},
        {title: "合约"},
        {title: "买卖方向"},
        {title: "加仓/减仓",visible:false},
        {title: "成交量"},
        {title: "倍数"},
    ];
//初始化
    $(document).ready(function() {
        //会话列表初始化
        $scope.leverageCalculatorPositionCollectTable = $('#leverageCalculatorPositionCollect_dynamic_table').DataTable( {
            data : $scope.leverageCalculatorPositionCollectDataset,
            columns :$scope.leverageCalculatorPositionCollect_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
            buttons: []
        } );
    });
    setTimeout(1500,$scope.find());
});
