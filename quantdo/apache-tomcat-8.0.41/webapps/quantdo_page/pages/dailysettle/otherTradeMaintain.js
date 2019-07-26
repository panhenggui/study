myapp.controller('OtherTradeMaintainController', ['$scope','$timeout','Upload','$rootScope' ,function ($scope,$timeout,Upload,$rootScope) {
    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;

    $scope.queryEntity = {"capitalType":'7', instClientID:"", "tradeingDate":clearConstant.formatDate(new Date()),
        "accountID":"", "subAccountID":"", "traderID":"", "exchID":"", "direction":"", "instrumentId":"", "originTradeID":""};

    $scope.showStock = true;
    $scope.showForward = false;

    $scope.otherTradeMaintain_add = isShow("otherTradeMaintain_add");
    $scope.otherTradeMaintain_update = isShow("otherTradeMaintain_update");
    $scope.otherTradeMaintain_query = isShow("otherTradeMaintain_query");
    $scope.otherTradeMaintain_delete = isShow("otherTradeMaintain_delete");

    $scope.otherTradeMaintainStockData = [];
    $scope.otherTradeMaintainForwardData = [];
    $scope.otherTradeMaintainService = new com.quantdo.orgClear.service.OtherTradeMaintainService();

    $("[forType='date']").datepicker({
        language: 'zh-CN',
        weekStart: 1,
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        format: 'yyyymmdd'
    });







    $scope.changeTradeType = function(){
        if($scope.queryEntity.capitalType == '7'){
            $scope.showStock = true;
            $scope.showForward = false;
            //重新绘表
            // $scope.otherTradeMaintainStockTable.clear().draw();
            // $scope.otherTradeMaintainStockTable.rows.add($scope.otherTradeMaintainStockData).draw();
        }else{
            $scope.showStock = false;
            $scope.showForward = true;
            //重新绘表
            // $scope.otherTradeMaintainForwardTable.clear().draw();
            // $scope.otherTradeMaintainForwardTable.rows.add($scope.otherTradeMaintainForwardData).draw();
        }
        $scope.find($scope.queryEntity);
        //调用表格重绘函数
        // $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
        // $scope.tabCallBackFunc = tabCallBackFunc;
    }


    //买卖方向
    $scope.tradeDirections = clearConstant.tradeDirection;
    //成交维护类型
    $scope.tradeMaintainType = clearConstant.tradeMaintainType;
    //币种
    $scope.currencys = clearConstant.currenys;


    // 初始化机构记录
    $scope.instClientService = new com.quantdo.orgClear.service.instClientService();
    $scope.instClientlists=[];
    $scope.instClientService.findByQuery(function (result) {
        $scope.instClientlists = result;
        $scope.$apply();
    },{amType:"2"});



    //当前交易日
    generateHisData(function(result) {
        $scope.settleDate = result;
    });


    $scope.instClient=null
    getInstClient(function(result){
        $scope.instClient = result;
        if($scope.instClient!=null){
            $scope.isInstClient= true;
            $scope.queryEntity.instClientID =  $scope.instClient.instClientID;
        }else{
            $scope.isInstClient= false;
        }

        $scope.find($scope.queryEntity);
    });

/*************************查询条件联动开始*********************************/


    //初始化资金账号
    $scope.Accounts = [];
    $scope.changeInstClientID = function(entity){
        $scope.queryEntity.accountID = "";
        $scope.Accounts = [];
        findByAccountID(function (result) {
            $scope.Accounts = result;
            $scope.$apply();
            $scope.changeAccountID($scope.queryEntity.instClientID, $scope.queryEntity.accountID);
        }, entity);
    }

    $scope.changeInstClientID({"instClientID":null});



    //资金账号改变获取资产单元信息
    $scope.subCapitalAccounts = [];
    $scope.changeAccountID = function(instClientID, accountID){
        $scope.queryEntity.subAccountID = "";
        $scope.subCapitalAccounts = [];
        if(accountID == ""){
            accountID = null;
        }
        getSubAccountByAccount(instClientID, accountID, function(result){
            $scope.subCapitalAccounts = result;
            $scope.$apply();
            $scope.changeSubAccount($scope.queryEntity.instClientID, $scope.queryEntity.subAccountID);
        })
    }

    $scope.activeTraders = [];
    $scope.changeSubAccount = function(instClientID, subAccountID){
        $scope.queryEntity.userID = "";
        $scope.activeTraders = [];
        instClientID = instClientID == null ? "" : instClientID;
        subAccountID = subAccountID == null ? "" : subAccountID;
        var roleArray = new Array();
        roleArray.push("9");
        roleArray.push("13");
        getTraderBySubAccount({"instClientID":instClientID, "accountType":'2'}, roleArray, subAccountID, function(result){
            $scope.activeTraders = result;
            $scope.$apply();
        });
    }
    /*************************查询条件联动结束*********************************/

    /*************************编辑Model联动开始*********************************/
    //初始化资金账号a
    $scope.modalAccounts = [];
    $scope.changeModelInstClientID = function(entity, callback){
        $scope.modalAccounts = [];
        findByAccountID(function (result) {
            $scope.modalAccounts = result;
            $scope.$apply();
            callback();
        }, entity);
    }

    //资金账号改变获取资产单元信息
    $scope.modalSubCapitalAccounts = [];
    $scope.changeModalAccountID = function(instClientID, accountID, callbakc){
        $scope.modalSubCapitalAccounts = [];
        if(accountID == ""){
            return $scope.modalSubCapitalAccounts = [];
        }
        getSubAccountByAccount(instClientID, accountID, function(result){
            $scope.modalSubCapitalAccounts = result;
            $scope.$apply();
            callbakc();
        })
        /*var innerAccountID = "";
        for(var i=0; i < $scope.modalAccounts.length; i++){
            var account = $scope.modalAccounts[i];
            if(instClientID == account.instClientID && accountID == account.accountID){
                innerAccountID = account.innerAccountID;
                getSubAccountByAccount(instClientID, innerAccountID, function(result){
                    $scope.modalSubCapitalAccounts = result;
                    $scope.$apply();
                    callbakc();
                })
            }
        }*/
    }

    $scope.modalActiveTraders = [];
    $scope.changeModalSubAccount = function(instClientID, subAccountID, callback){
        $scope.modalActiveTraders = [];
        /*for(var i=0; i < $scope.modalSubCapitalAccounts.length; i++){
            var subAccount = $scope.modalSubCapitalAccounts[i];
            if(instClientID == subAccount.instClientID && subAccountID == subAccount.subAccountID){

            }
        }*/
        var roleArray = new Array();
        roleArray.push("9");
        roleArray.push("13");
        getTraderBySubAccount({"instClientID":instClientID, "accountType":'2'}, roleArray, subAccountID, function(result){
            $scope.modalActiveTraders = result;
            $scope.$apply();
            callback();
        });
    }
    /*************************Model页面联动结束*********************************/


    //初始化交易所信息并默人选中第一个
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
        $scope.$apply();
    });


    //定义产品基础信息的固定列头
    $scope.otherTradeMaintain_Stock_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "成交编号"},
        {title: "资产类型"},
        {title: "机构"},
        {title: "成交日期"},
        {title: "资金账户"},
        {title: "资产单元"},
        {title: "交易所代码"},
        {title: "买卖方向"},
        {title: "股票代码"},
        {title: "成交价格"},
        {title: "成交数量"},
        {title: "佣金"},
        {title: "操作"}
    ];


    //定义产品基础信息的固定列头
    $scope.otherTradeMaintain_forward_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "成交编号"},
        {title: "资产类型"},
        {title: "机构"},
        {title: "成交日期"},
        {title: "资金账户"},
        {title: "资产单元"},
        {title: "交易所代码"},
        {title: "买卖方向"},
        {title: "合约代码"},
        {title: "到期日"},
        {title: "交易币种"},
        {title: "成交数量"},
        {title: "远期价格"},
        {title: "操作"}
    ];


    $(document).ready(function() {
        //会话列表初始化
        $scope.otherTradeMaintainStockTable = $('#otherTradeMaintainStock_dynamic_table').DataTable( {
            data : $scope.otherTradeMaintainStockData,
            columns :$scope.otherTradeMaintain_Stock_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
            buttons: []
        } );

        //会话列表初始化
        $scope.otherTradeMaintainForwardTable = $('#otherTradeMaintainForward_dynamic_table').DataTable( {
            data : $scope.otherTradeMaintainForwardData,
            columns :$scope.otherTradeMaintain_forward_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
            buttons: []
        } );
    });

    $scope.find = function(queryEntity){
        $scope.tradeInfoDatas = [];
        $scope.otherTradeMaintainService.query(queryEntity, function(result){
            var con = result;
            $scope.listEntitys = result;
            var tempArray = new Array();
            if( $scope.queryEntity.capitalType == '7'){
                for(var i = 0; i<con.length;i++){
                    var operate = "";
                    if($scope.otherTradeMaintain_update){
                        operate = operate.concat("<a class='update-row' data-toggle='modal'>修改</a>");
                    }if($scope.otherTradeMaintain_delete){
                        operate = operate.concat( "<a class='delete-row' data-toggle='modal'>删除</a>");
                    }
                    var tempArr = [(i+1),con[i].id,con[i].tradeID, formatterValue(con[i].capitalType, $scope.tradeMaintainType), $scope.fomatterInstClientValue(con[i].instClientID, $scope.instClientlists), con[i].tradeingDate, con[i].accountID,
                        con[i].subAccountID, con[i].exchID, formatterValue(con[i].direction, $scope.tradeDirections), con[i].instrumentID, con[i].tradePrice,
                        parseFloat(con[i].volume).toFixed(0), con[i].commission, operate];
                    $scope.tradeInfoDatas.push(tempArr);
                    con[i].index = i+1;
                }
                $scope.listEntitys = con;
                //重新绘表
                $scope.otherTradeMaintainStockTable.clear().draw();
                $scope.otherTradeMaintainStockTable.rows.add($scope.tradeInfoDatas).draw();
            }else{
                for(var i = 0; i<con.length;i++){
                    var operate = "";
                    if($scope.otherTradeMaintain_update){
                        operate = operate.concat("<a class='update-row' data-toggle='modal'>修改</a>");
                    }if($scope.otherTradeMaintain_delete){
                        operate = operate.concat( "<a class='delete-row' data-toggle='modal'>删除</a>");
                    }
                    var tempArr = [(i+1),con[i].id,con[i].tradeID, formatterValue(con[i].capitalType, $scope.tradeMaintainType), $scope.fomatterInstClientValue(con[i].instClientID, $scope.instClientlists), con[i].tradeingDate, con[i].accountID,
                        con[i].subAccountID, con[i].exchID, formatterValue(con[i].direction, $scope.tradeDirections), con[i].instrumentID, con[i].expirationDate,
                        formatterValue(con[i].currency, $scope.currencys), parseFloat(con[i].volume).toFixed(0), con[i].forwardPrice, operate];
                    $scope.tradeInfoDatas.push(tempArr);
                    con[i].index = i+1;
                }
                $scope.listEntitys = con;
                //重新绘表
                $scope.otherTradeMaintainForwardTable.clear().draw();
                $scope.otherTradeMaintainForwardTable.rows.add($scope.tradeInfoDatas).draw();
            }
        });
    }


    $scope.fomatterInstClientValue = function(key, instList){
        for(var i = 0; i<instList.length; i++){
            if(key == instList[i].instClientID){
                return instList[i].instClientName;
            }
        }
        return "";
    }



    $scope.initParameter = function(){
        $scope.ModalEntity = {capitalType:'7', tradeingDate:clearConstant.formatDate(new Date()),
            tradeingTime:clearConstant.currentTime(), instClientID: instClientID, volume:"", tradePrice:"", forwardPrice:"",commission:""};
        if($scope.instClient!=null){
            $scope.isInstClient= true;
            $scope.ModalEntity.instClientID =  $scope.instClient.instClientID;
        }else{
            $scope.isInstClient= false;
        }
        var instClientID = "";
        if(null != $scope.instClient && undefined != $scope.instClient){
            instClientID = $scope.instClient.instClientID;
            $scope.changeModelInstClientID({"instClientID":instClientID}, function(){});
        }
        $scope.editParams = true;
        $scope.editStockParams = true;
        $scope.editForwardParams = false;
        $scope.isUpdate = false;
        $("#otherTradeMaintainModal").modal("show");
        formValidateReset();
    }

    //股票成交信息修改
    $("body").undelegate("#otherTradeMaintainStock_dynamic_table_wrapper td .update-row","click");
    $("body").delegate("#otherTradeMaintainStock_dynamic_table_wrapper td .update-row","click",function(){
        $scope.ModalEntity = {};
        var mytr = $(this).parents("tr");
        var tempArr = $scope.otherTradeMaintainStockTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
            if(id==$scope.listEntitys[i].id){
                $scope.ModalEntity = angular.copy($scope.listEntitys[i]);
            }
        }
        $scope.initUpdateParam($scope.ModalEntity,id);
    })

    //股票成交信息删除
    $("body").undelegate("#otherTradeMaintainStock_dynamic_table_wrapper td .delete-row","click");
    $("body").delegate("#otherTradeMaintainStock_dynamic_table_wrapper td .delete-row","click",function(){
        var mytr = $(this).parents("tr");
        var tempArr = $scope.otherTradeMaintainStockTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
            if(id==$scope.listEntitys[i].id){
                $scope.ModalEntity = angular.copy($scope.listEntitys[i]);
            }
        }
        $scope.remove($scope.ModalEntity,id);
    })


    //汇率远期成交信息修改
    $("body").undelegate("#otherTradeMaintainForward_dynamic_table_wrapper td .update-row","click");
    $("body").delegate("#otherTradeMaintainForward_dynamic_table_wrapper td .update-row","click",function(){
        $scope.ModalEntity = {};
        var mytr = $(this).parents("tr");
        var tempArr = $scope.otherTradeMaintainForwardTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
            if(id==$scope.listEntitys[i].id){
                $scope.ModalEntity = angular.copy($scope.listEntitys[i]);
            }
        }
        $scope.initUpdateParam($scope.ModalEntity,id);
    })

    //远期汇率信息删除
    $("body").undelegate("#otherTradeMaintainForward_dynamic_table_wrapper td .delete-row","click");
    $("body").delegate("#otherTradeMaintainForward_dynamic_table_wrapper td .delete-row","click",function(){
        var mytr = $(this).parents("tr");
        var tempArr = $scope.otherTradeMaintainForwardTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
            if(id==$scope.listEntitys[i].id){
                $scope.ModalEntity = angular.copy($scope.listEntitys[i]);
            }
        }
        $scope.remove($scope.ModalEntity,id);
    })



    $scope.initUpdateParam = function(entity, id){
        layer.load(2, {
            shade: [0.5,'#fff'] //0.1透明度的白色背景
        });
        $scope.editParams = true;
        if($scope.ModalEntity.capitalType == '7'){
            $scope.editStockParams = true;
            $scope.editForwardParams = false;
        }else{
            $scope.editStockParams = false;
            $scope.editForwardParams = true;
        }
        $scope.changeModelInstClientID({"instClientID":$scope.ModalEntity.instClientID}, function(){
            $scope.changeModalAccountID($scope.ModalEntity.instClientID, null, function(){
                $scope.changeModalSubAccount($scope.ModalEntity.instClientID, null, function(){
                    $scope.isUpdate = true;
                    layer.closeAll('loading');
                    $("#otherTradeMaintainModal").modal("show");
                    $scope.$apply();
                });
            });
        });
    }





    function formValidateReset() {
        $scope.myForm.capitalType.$setPristine();
        $scope.myForm.tradeID.$setPristine();
        $scope.myForm.instClientID.$setPristine();
        $scope.myForm.tradeingDate.$setPristine();
        $scope.myForm.tradeingTime.$setPristine();
        $scope.myForm.accountID.$setPristine();
        $scope.myForm.subAccountID.$setPristine();
        $scope.myForm.userID.$setPristine();
        $scope.myForm.exchID.$setPristine();
        $scope.myForm.instrumentID.$setPristine();
        $scope.myForm.direction.$setPristine();
        $scope.myForm.volume.$setPristine();
        $scope.myForm.tradePrice.$setPristine();
        $scope.myForm.commission.$setPristine();
        $scope.myForm.currency.$setPristine();
        $scope.myForm.expirationDate.$setPristine();
        $scope.myForm.forwardPrice.$setPristine();
    }


    $scope.changeCapitalType = function(){
        $scope.editParams = true;
        if($scope.ModalEntity.capitalType == '7'){
            $scope.editStockParams = true;
            $scope.editForwardParams = false;
        }else{
            $scope.editStockParams = false;
            $scope.editForwardParams = true;
        }
    }



    $scope.save = function(modalEntity){
        //结算日期要>= 成交日期
        if($scope.settleDate < modalEntity.tradeingDate){
            layer.msg("成交日期不能大于当前交易日【"+$scope.settleDate+"】", {icon: 2, time: 3000});
            return false;
        }
        if(null == modalEntity.tradeID || "" == modalEntity.tradeID || undefined == modalEntity.tradeID){
            //新增
            $scope.otherTradeMaintainService.add(modalEntity, function(result){
                layer.msg("新增成功!", {icon: 1, time: 1500});
                $("#otherTradeMaintainModal").modal("hide");
                $scope.find($scope.queryEntity);
                $scope.$apply();
            });
        }else{
            //修改
            $scope.otherTradeMaintainService.updateTradeInfo(modalEntity, function(result){
                layer.msg("修改成功!", {icon: 1, time: 1500});
                $("#otherTradeMaintainModal").modal("hide");
                $scope.find($scope.queryEntity);
                $scope.$apply();
            });
        }
    }


    $scope.remove = function(entity, index){
        layer.confirm('确定删除该成交记录吗？', {icon: 3}, function (count) {
            $scope.otherTradeMaintainService.deleteTradeInfo(entity.capitalType, entity.tradeID, function (result) {
                $scope.find($scope.queryEntity);
                $scope.$apply();
                layer.msg("删除成功！", {icon : 1,time : 2000});
                layer.close(count);
            });
        });
    }

    $scope.continueSaveTrade = function(modalEntity){
        //新增
        $scope.otherTradeMaintainService.add(modalEntity, function(result){
            layer.msg("新增成功!", {icon: 1, time: 1500});
            $scope.find($scope.queryEntity);
            $scope.initParameter();
        });
    }


    $scope.callback1 = function(){

    }

}]);

