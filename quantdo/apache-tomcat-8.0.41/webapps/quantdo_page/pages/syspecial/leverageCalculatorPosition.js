myapp.controller('LeverageCalculatorPositionController', function ($scope,$rootScope, $timeout){
    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    //这里的service是js文件
    $scope.leverageCalculatorPositionService = new com.quantdo.orgClear.servicesyspecial.leverageCalculatorPositionService();
    $scope.leverageCalculatorPositionCollectService = new com.quantdo.orgClear.servicesyspecial.leverageCalculatorPositionCollectService();
    $scope.capitalAccountPrincipalService = new com.quantdo.orgClear.servicesyspecial.capitalAccountPrincipalService();
    $scope.instClientService = new com.quantdo.orgClear.service.instClientService();
    $scope.InstrumentService = new com.quantdo.orgClear.service.InstrumentService();

    $scope.listEntitys = [];
    $scope.queryEntity = {};
    $scope.modalEntity = {};
    $scope.leverageCalculatorPositionDataset = [];
    $scope.allAccountEntitys = [];
    $scope.addorsubs = clearConstant.addorsubs;
    $scope.tradeDirection = clearConstant.tradeDirection;

    //获取权限isshow返回的是boolean类型的数值，意思是前面html拥有这个权限
    $scope.leverageCalculatorPosition_add = isShow("leverageCalculatorPosition_add");
    $scope.leverageCalculatorPosition_query = isShow("leverageCalculatorPosition_query");
    $scope.leverageCalculatorPosition_update = isShow("leverageCalculatorPosition_update");
    $scope.leverageCalculatorPosition_delete = isShow("leverageCalculatorPosition_delete");

    $scope.allmodalAccountEntitys = [];                                       //存在调用非常慢的问题   获取资产单元全量，后面模态框中展示会用到
    $scope.leverageCalculatorPositionCollectService.findInnnerAccount({}, function(result){
        $scope.allmodalAccountEntitys = result;
        $scope.$apply();
    });

    //初始化机构信息
    $scope.queryinstClientlists =[];
    $scope.instClientService.findByQuery(function (result) {
        $scope.queryinstClientlists = result;
        $scope.$apply();
    },{amType:""});
    //初始化查询当前交易日
    $scope.leverageCalculatorPositionService.findcurrenttradeday(function (result){
        $scope.tradeDate =result;
        $scope.queryEntity.tradeDate = $scope.tradeDate;
        $scope.find();
        $scope.$apply();
    },{});

    $scope.exchangeData = [];
    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeData = result;
        $scope.$apply();
    });
    //获取商品全量，后面模态框中展示会用到
    $scope.allmodalProducts = [];
    findProductEntity(function (result) {
        $scope.allmodalProducts = result;
        $scope.$apply();
    }, {});
    //获取合约全量，后面模态框中展示会用到
    $scope.allmodalInstruments = [];
    getInstrument(function (result) {
        $scope.allmodalInstruments = result;
        $scope.$apply();
    },{});


    $scope.instClientID = '';
    //判定登录用户的机构权限
    queryInstClientID(function (result) {
        $scope.instClientID = result;
        if($scope.instClientID != undefined ){
            $scope.isInstClient = true;
            $scope.queryEntity.instClientID=$scope.instClientID;
        }else{
            $scope.isInstClient = false;
        }

        $scope.$apply();
    });
    $scope.queryEntity={};
    /*$scope.queryEntity.tradeDate = $scope.tradeDate;*/

    //查询资产单元
    $scope.leverageCalculatorPositionCollectService.findInnnerAccount({"instClientID":""}, function(result){
        $scope.queryAccountEntitys = result;
        $scope.allAccountEntitys = result;
        /*for(var i=0;i<$scope.queryAccountEntitys.length;i++){
            $scope.queryAccountEntitys[i].innerAccountID = $scope.queryAccountEntitys[i].subAccountID;
        }*/
        $scope.$apply();
    });

   //查询机构改变的事件        需要重新查找资产单元
    $scope.changeInstClient = function(){
        if("" == $scope.queryEntity.instClientID){
            $scope.queryEntity.instClientID = null;
        }
        //查询资产单元
        $scope.leverageCalculatorPositionCollectService.findInnnerAccount({"instClientID":$scope.queryEntity.instClientID}, function(result){
            $scope.queryAccountEntitys = result;
            /*for(var i=0;i<$scope.queryAccountEntitys.length;i++){
                $scope.queryAccountEntitys[i].innerAccountID = $scope.queryAccountEntitys[i].subAccountID;
            }*/
            $scope.$apply();
        });
    }

    // 重置表单验证信息
    function formValidateReset() {
        if($scope.leverageCalculatorPositionForm != undefined){
            $scope.leverageCalculatorPositionForm.tradeDate.$setPristine();
            $scope.leverageCalculatorPositionForm.instClientID.$setPristine();
            $scope.leverageCalculatorPositionForm.innerAccountID.$setPristine();
            $scope.leverageCalculatorPositionForm.exchID.$setPristine();
            $scope.leverageCalculatorPositionForm.direction.$setPristine();
            $scope.leverageCalculatorPositionForm.productID.$setPristine();
            $scope.leverageCalculatorPositionForm.instrumentID.$setPristine();
            $scope.leverageCalculatorPositionForm.addorSub.$setPristine();
            $scope.leverageCalculatorPositionForm.Multiple.$setPristine();
            $scope.leverageCalculatorPositionForm.calRealExchVolume.$setPristine();
            $scope.leverageCalculatorPositionForm.exchVolume.$setPristine();
            $scope.leverageCalculatorPositionForm.exchMultiple.$setPristine();
            $scope.leverageCalculatorPositionForm.exchPrice.$setPristine();


        }
    }
    // 初始化模态框的页面参数，对应的是html页面中的新增按钮可以调用的功能
    $scope.initParameter = function () {
        // 设置默认选中
        $scope.modalEntity = {};
        formValidateReset();
        $scope.isUpdate = false;
        if($scope.instClientID != undefined ){
            $scope.isInstClient = true;
            $scope.modalEntity.instClientID=$scope.instClientID;
        }else{
            $scope.isInstClient = false;
            $scope.modalEntity.instClientID=$scope.queryinstClientlists[0].instClientID;
        }

        if("" == $scope.modalEntity.instClientID){
            $scope.modalEntity.instClientID = null;
        }
        //查询资产单元    这里的方法需要重新定义 满足名义本金不为0的资产单元
        $scope.leverageCalculatorPositionCollectService.findInnerAccountIdWithRealprin({"instClientID":$scope.modalEntity.instClientID}, function(result){
            $scope.modalAccountEntitys = result;
           /* if(result.length > 0){
                $scope.modalEntity.innerAccountID=$scope.modalAccountEntitys[0].subAccountID;
            }else{
                $scope.modalEntity.innerAccountID=null;
            }*/
            $scope.$apply();
            $("#leverageCalculatorPositionModal").modal("show");
        });
        /*$scope.modalEntity.tradeDate = $scope.leverageCalculatorPositionService.findcurrenttradeday(); ///设置时期为常量*/
        /*$scope.modalEntity.tradeDate = clearConstant.formatDate(new Date()); */ //设置时期为常量
        $scope.modalEntity.tradeDate = $scope.tradeDate;
    };

//定义模态框中修改按钮的机构改变的事件，定义改变机构会查询资产单元
    $scope.changeInstClientModal = function(){
        if("" == $scope.modalEntity.instClientID){
            $scope.modalEntity.instClientID = null;
        }
        //查询资产单元    这里也要调用新的方法
        $scope.leverageCalculatorPositionCollectService.findInnerAccountIdWithRealprin({"instClientID":$scope.modalEntity.instClientID}, function(result){
            $scope.modalAccountEntitys = result;
            if(result.length > 0){
                $scope.modalEntity.innerAccountID=$scope.modalAccountEntitys[0].subAccountID;
            }else{
                $scope.modalEntity.innerAccountID=null;
            }
            $scope.$apply();
        });
    };

    //这里添加模态框中输入成交价格和成交数量自动生成成交倍数的功能
    //获取所有名义本金
    $scope.capitalAccountPrincipalService.findByQuery(function (result){
        $scope.modalcapitalAcconutPrincial = result;
    },{});

    //获取所有合约，合约中有合约层数和使用的币种
   findByInstrumentID(function (result){
       $scope.modalinstrumentID = result;
   },{});
    //获取所有汇率，把数据都放在前端
    $scope.leverageCalculatorPositionService.findCurExchangeRate(function (result){
        $scope.modalexchangeRate =result;
    },{});

    $("#leverageCalculatorPositionModal .settle").bind("blur",function() {         //绑定委托事件
        if($scope.modalcapitalAcconutPrincial.length > 0){
            for(var i=0;i<$scope.modalcapitalAcconutPrincial.length;i++){
                if($scope.modalcapitalAcconutPrincial[i].instClientID == $scope.modalEntity.instClientID &&
                    $scope.modalcapitalAcconutPrincial[i].innerAccountID == $scope.modalEntity.innerAccountID){
                    $scope.modalrealprincipal = $scope.modalcapitalAcconutPrincial[i];
                }
            }
        }
        if($scope.modalinstrumentID.length > 0){
            for(var i=0; i<$scope.modalinstrumentID.length;i++){
                if($scope.modalinstrumentID[i].instrumentID == $scope.modalEntity.instrumentID &&
                    $scope.modalinstrumentID[i].productID == $scope.modalEntity.productID &&
                    $scope.modalinstrumentID[i].exchID == $scope.modalEntity.exchID){
                    $scope.exchvolume = $scope.modalinstrumentID[i];
                }
            }
        }
        if($scope.modalexchangeRate.length > 0){
            for(var i =0;i<$scope.modalexchangeRate.length;i++){
                if($scope.modalexchangeRate[i].currency == $scope.exchvolume.currency && $scope.modalexchangeRate[i].exchangeCurrency == "CNY"){
                    $scope.exchangerate = $scope.modalexchangeRate[i].exchangeRate;
                }
            }
        }



        $scope.leverageCalculatorPositionService.findVolumeMultiple($scope.exchvolume,function (result){
            $scope.exchvolume =result;
            $scope.exchMultiple = parseFloat($scope.exchvolume.volumeMultiple * $scope.modalEntity.exchPrice*$scope.modalEntity.exchVolume*$scope.exchangerate/$scope.modalrealprincipal.realPrincipal).toFixed(4);

        },{});
        $scope.leverageCalculatorPositionForm.isOK = false;

        setTimeout(function () {
            if(isNaN($scope.exchMultiple)) {
            }else{
                var f = parseFloat($scope.exchMultiple);
                $scope.modalEntity.exchMultiple = f.toFixed(4);
                var r = /^(\d{1,2}(\.\d{1,4})?|100)$/;
                if (!r.test($scope.modalEntity.exchMultiple)) {
                     $scope.isOK = true;
                }
                $scope.$apply();
            }
        },100)

    });


    //模态框中交易所变动查询对应的产品品种
    $scope.selectModalProduct = function (exchID) {
        findProductEntity(function (result) {
            $scope.modalProducts = result;
            $scope.$apply();
        }, {exchID: exchID});
    };
    //交易所和品种改变执行搜索对应合约种类
    $scope.selectFindInstrument = function (exchID,productID) {
        getInstrument(function (result) {
            $scope.modalInstruments = result;
            $scope.$apply();
        },{exchID: exchID,productID: productID,instrumentID: ""});
    };

    // 修改的初始化                                这部分允许用户修改成交数量和成交价格，这部分只允许用户修改成交数量和成交价格成交倍数
    $scope.initUpdateParam = function (entity,index) {
        $scope.modalEntity = angular.copy(entity);
        if($scope.modalEntity.multiple == 0){
            $scope.modalEntity.multiple =null;
        }
        if($scope.modalEntity.calRealExchVolume == 0){
            $scope.modalEntity.calRealExchVolume=null;
        }
        $scope.modalEntity.recordIndex = index;
        formValidateReset();
        $scope.isUpdate = true;
        $scope.$apply();

        $scope.modalProducts = [];
        for(var i=0;i<$scope.allmodalProducts.length;i++){
            if($scope.allmodalProducts[i].exchID == $scope.modalEntity.exchID && $scope.allmodalProducts[i].productID == $scope.modalEntity.productID){
                $scope.modalProducts.push($scope.allmodalProducts[i]);
                $scope.$apply();
                break;
            }
        }
        $scope.modalInstruments = [];
        for(var i=0 ;i<$scope.allmodalInstruments.length;i++){
            if($scope.allmodalInstruments[i].exchID == $scope.modalEntity.exchID && $scope.allmodalInstruments[i].productID == $scope.modalEntity.productID
            && $scope.allmodalInstruments[i].instrumentID == $scope.modalEntity.instrumentID){
                $scope.modalInstruments.push($scope.allmodalInstruments[i]);
                $scope.$apply();
                break;
            }
        }
        $scope.modalAccountEntitys = [];
        for(var i=0;i<$scope.allAccountEntitys.length;i++){
            if($scope.allAccountEntitys[i].instClientID == $scope.modalEntity.instClientID && $scope.allAccountEntitys[i].subAccountID == $scope.modalEntity.innerAccountID){
                $scope.modalAccountEntitys.push($scope.allAccountEntitys[i]);
                $scope.$apply();
                break;
            }
        }

        $timeout(function () {
            $("#leverageCalculatorPositionModal").modal("show");
        },1000)
    };

    // 保存持仓变动表       保存新增和修改两部分的东西     这部分的校验需要设计
    $scope.save = function (entity) {
        var index = entity.id;
        var tableIndex = entity.index;
        //entity.remark = htmlEncodeJQ(entity.remark);
        // 增加
        if (index == undefined) {
            $scope.leverageCalculatorPositionService.findByQuery(function (result) {
                    $scope.leverageCalculatorPositionService.add(function (result) {
                        if(result != null){
                            layer.msg("新增成功",{icon: 1});
                            $scope.listEntitys.unshift(result);
                            $scope.$apply();
                            $scope.find();
                            // 关闭窗口
                            $("#leverageCalculatorPositionModal").modal("hide");
                        }else{
                            layer.msg("新增失败",{icon: 2});
                        }
                    }, entity);
            }, {
                instClientID: entity.instClientID,
                innerAccountID: entity.innerAccountID
            });
            // 修改
        } else {
            if(entity.batch == "") {
                entity.batch = -1;
            }
           /* if(entity.multiple == ""){
                entity.multiple = 0;
            }
            if(entity.calRealExchVolume == ""){
                entity.calRealExchVolume = 0;
            }*/
                $scope.leverageCalculatorPositionService.update(function (result) {
                    if (result != null) {
                        result.index = tableIndex;
                        layer.msg("修改成功", {icon: 1});
                        $scope.listEntitys.splice(tableIndex - 1, 2, result);
                        $scope.leverageCalculatorPositionTable.cells().every(function () {
                            if ((tableIndex - 1) == this[0][0].row) {
                                if (this[0][0].column == 12) {                                             //这里要改为修改的成交数量和成交价格，第11个为“成交数量”，第12个为“成交价格”，13为“成交倍数”
                                    this.data(parseFloat(entity.exchVolume).toFixed(3));
                                    $scope.$apply();
                                } else if (this[0][0].column == 13) {
                                    this.data(parseFloat(entity.exchPrice).toFixed(3));
                                    $scope.$apply();
                                } else {                                                       //这里要根据成交价格和成交数量计算出成交倍数，这部分放到后面再处理
                                    this.data();
                                }
                            }
                        });
                        $scope.find();
                        // 关闭窗口
                        $("#leverageCalculatorPositionModal").modal("hide");
                    } else {
                        layer.msg("修改失败", {icon: 2});
                    }
                }, entity);
            }
    };

    // 查询(前台分页)
    $scope.find = function(){
        //将数据集赋值为空
        $scope.leverageCalculatorPositionDataset = [];
        //更新表格对应的数据集
        //因为手动添加的批次号存在数据库是-1，但是对用户来说这个批次号是不存在的，假如用户在搜索栏填入-1，那么这里将这个值改为其他的值
       /* if($scope.queryEntity.batch = null){
            $scope.queryEntity.batch = "";
        }*/
      /* if($scope.queryEntity.batch == '-'){
           $scope.queryEntity.batch = -1;
       }*/
        $scope.leverageCalculatorPositionService.findByQuery(function (result) {
            var con = result;
            $scope.listEntitys = result;
            var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
                var operate1 = $scope.getUpdatePermission($scope.leverageCalculatorPosition_update);
                var operate2 = $scope.getDeletePermission($scope.leverageCalculatorPosition_delete);
                if(con[i].batch == -1){
                    con[i].batch ="";
                }
                var multiple = con[i].multiple;
                if(con[i].multiple == 0){
                    multiple ="";
                }
                var calRealExchVolume = con[i].calRealExchVolume;
                if(con[i].calRealExchVolume == 0){
                    calRealExchVolume = "";
                }
                    var tempArr = [con[i].batch,con[i].id,con[i].tradeDate, $scope.transInstClientID(con[i].instClientID), con[i].innerAccountID, con[i].exchID, $scope.transdirection(con[i].direction),con[i].productID, con[i].instrumentID,multiple, $scope.transaddorsubs(con[i].addorSub),
                        calRealExchVolume, con[i].exchVolume, con[i].exchPrice, con[i].exchMultiple, operate1 + operate2];
                $scope.leverageCalculatorPositionDataset.push(tempArr);
                con[i].index = tempArr[0];
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.leverageCalculatorPositionTable.clear().draw();
            $scope.leverageCalculatorPositionTable.rows.add($scope.leverageCalculatorPositionDataset).draw();
        }, $scope.queryEntity);
       /* if($scope.queryEntity.batch == '-1'){
            $scope.queryEntity.batch = '-';
        }*/
    }
    //这一部分将所属机构的id变成实际的名称
    $scope.transInstClientID = function(instClientID){
        for(var i=0;i<$scope.queryinstClientlists.length;i++){
            if($scope.queryinstClientlists[i].instClientID == instClientID){
                return $scope.queryinstClientlists[i].instClientName;
            }
        }
    }

    $scope.transdirection = function(direction){
        for(var i=0;i<$scope.tradeDirection.length;i++){
            if($scope.tradeDirection[i].key == direction){
                return $scope.tradeDirection[i].text;
            }
        }
    };
     //这一部分将加仓或减仓跟1或2两个数字互换
    $scope.transaddorsubs = function(addorsub){
        for(var i=0;i<$scope.addorsubs.length;i++){
            if($scope.addorsubs[i].key == addorsub){
                return $scope.addorsubs[i].text;
            }
        }
    };

    $("body").undelegate("#leverageCalculatorPosition_dynamic_table_wrapper td .update-row","click");
    //表格中修改的单击事件
    $("body").delegate("#leverageCalculatorPosition_dynamic_table_wrapper td .update-row","click",function(){
        var mytr = $(this).parents("tr");
        var tempArr = $scope.leverageCalculatorPositionTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
            if(id==$scope.listEntitys[i].id){
                $scope.modalEntity = $scope.listEntitys[i];
            }
        }
        formValidateReset();
        $scope.isUpdate = true;
        $scope.initUpdateParam($scope.modalEntity,id);
        $scope.$apply();
    });

    $("body").undelegate("#leverageCalculatorPosition_dynamic_table_wrapper td .delete-row","click");
    //表格中删除的单击事件
    $("body").delegate("#leverageCalculatorPosition_dynamic_table_wrapper td .delete-row","click",function(){
        var mytr = $(this).parents("tr");
        var tempArr = $scope.leverageCalculatorPositionTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
            if(id==$scope.listEntitys[i].id){
                $scope.modalEntity = $scope.listEntitys[i];
            }
        }

        layer.confirm('确定删除该条持仓变动明细？', {icon: 3}, function (count) {
            if($scope.modalEntity.batch == ""){
                $scope.modalEntity.batch = -1;
            }
            $scope.leverageCalculatorPositionService.remove(function (result) {
                layer.msg("该条持仓变动明细删除成功!", {icon : 1,time : 2000});
                $scope.find();
            }, $scope.modalEntity);
        });

    });
//获取修改权限            修改可以调用出html中定义的模态框
    $scope.getUpdatePermission = function(flag){
        var result = "";
        if(flag){
            result = "<a class='update-row' data-toggle='modal' >修改</a>";
        }
        return result;
    }
    //获取删除权限
    $scope.getDeletePermission = function(flag){
        var result = "";
        if(flag){
            result = "<a class='delete-row'>删除</a>";
        }
        return result;
    }
    //定义系统用户管理表的固定列头
    $scope.leverageCalculatorPosition_columns = [
        {title: "批次号"},
        {title: "id",visible:false},
        {title: "日期"},
        {title: "所属机构"},
        {title: "资产单元"},
        {title: "交易所"},
        {title: "买卖方向"},
        {title: "品种"},
        {title: "合约"},
        {title: "倍数"},
        {title: "加仓/减仓"},
        {title: "加减仓数量"},
        {title: "成交数量"},
        {title: "成交价格"},
        {title: "成交倍数"},
        {title: "操作"}
    ];
//初始化
    $(document).ready(function() {
        //会话列表初始化
        $scope.leverageCalculatorPositionTable = $('#leverageCalculatorPosition_dynamic_table').DataTable( {
            data : $scope.leverageCalculatorPositionDataset,
            columns :$scope.leverageCalculatorPosition_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
            buttons: []
        } );
    });



});