myapp.controller('OptionInstrumentFeeSetController', function ($scope, $timeout) {
    //初始化页面信息
    getAllInstrumentFeeSetEntity(function (result) {
        $scope.listEntitys = result;
    }, clearConstant.productTypes[1].key);

    //初始化资金账号信息
    $scope.Accounts = {};
    $scope.queryEntity = {};
    //初始化内部账户下拉列表
    getAllAccounts(function (result) {
        $scope.Accounts = result;
    });
    $scope.OptionS =new Array();
    $scope.products=new Array();
        //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
    });

    //初始化产品代码——期权类型
    findProductEntity(function (result) {
        $scope.productDatas = result;
        $scope.products = result;
    }, {productType: '2'});

    $scope.OptionSeriesQuery = {
        exchID: "",
        productID: "",
        optionSeriesID: ""
    };
    //期权系列代码
    getAllOptionSeries(function (result) {
        $scope.OptionServes = result;
        $scope.OptionS =result;
    }, $scope.OptionSeriesQuery);


    //交易类型
    $scope.tradeTypes = clearConstant.tradeTypes;

    function formValidateReset() {
        $scope.myForm.tradeFeeRate.$setPristine();
        $scope.myForm.tradeFeeAmt.$setPristine();
        $scope.myForm.otFeeRate.$setPristine();
        $scope.myForm.otFeeAmt.$setPristine();
        $scope.myForm.settleFeeRate.$setPristine();
        $scope.myForm.settleFeeAmt.$setPristine();
        $scope.myForm.delivFeeRate.$setPristine();
        $scope.myForm.delivFeeAmt.$setPristine();
    }

    //删除
    $scope.remove = function (index, entity) {
        deleteInstrumentFeeSetEntity(entity.id);
        $scope.listEntitys.splice(index, 1);
    };


    //查询
    $scope.find = function (queryEntity) {
        $scope.listEntitys = {};
        $scope.isQuery = true;
        var tempEntity = {
            exchID: '',
            productID: '',
            tradeType: '',
            innerAccountID: '',
            instrumentID: ''
        };
        tempEntity = angular.copy(queryEntity);
        findInstrumentFeeSetEntity(function (result) {
            $scope.listEntitys = result;
            $scope.$apply();
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        }, tempEntity,clearConstant.productTypes[1].key);
    };

    $scope.initParameter = function () {
        $scope.ModalEntity = {};
        $scope.ModalEntity.innerAccountID = $scope.Accounts[0].innerAccountID;
        $scope.ModalEntity.tradeType = $scope.tradeTypes[0].key;
        formValidateReset();
    };


    //修改
    $scope.initUpdateParam = function (index, entity) {
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        formValidateReset();
    };


    //交易所下拉事件
    $scope.exchangeSelect = function(exchID){
        $scope.products=new Array();
        $scope.OptionS=new Array();
        $scope.ModalEntity.productID="";
        getAllProductByConditionEntity(function (result) {
            if (result.length > 0) {
                $scope.products = result;
                $scope.ModalEntity.productID = $scope.products[0].productID;
                $scope.productSelect($scope.ModalEntity.productID);
                $scope.$apply();
            }
        }, {exchID: exchID, productID: '', productType: '2', productStatus: ''});
    };

    //产品下拉事件
    $scope.productSelect = function(productID){
        $scope.OptionS=new Array();
        $scope.ModalEntity.instrumentID="";
        //根据产品代码查询期权系类
        findOptionSeriesEntity(function(result){
            $scope.OptionS = result;
            $scope.ModalEntity.instrumentID = $scope.OptionS[0].optionSeriesID;
            $scope.$apply();
        },{exchID: '', productID: productID,optionSeriesID: ''});
    };


    $scope.save = function (entity) {
        var index = entity.recordIndex;
        //增加
        if (index == undefined) {
            saveInstrumentFeeSetEntity(function(addResponse){
                $scope.listEntitys.push(addResponse);
                $scope.$apply();
            },entity,clearConstant.productTypes[1].key);
            //修改
        } else {
            updateInstrumentFeeSetEntity(function(updateEntity){
                $scope.listEntitys.splice(index, 1, updateEntity);
                $scope.$apply();
            },entity);
        }
        //关闭窗口
        $("#myModal").modal("hide");
    };



});

