myapp.controller('OptionInstrumentMarginSetController', function ($scope, $timeout) {
    //初始化页面信息
    getAllInstrumentMarginSetEntity(function (result) {
        $scope.listEntitys = result;
    }, clearConstant.productTypes[1].key);

    $scope.queryEntity = {};
    $scope.ModalEntity = {};
    $scope.instruments = {};
    $scope.productDatas = {};
    $scope.products = {};
    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
    });

    findProductEntity(function (result) {
        $scope.productDatas = result;
    }, {productType: clearConstant.productTypes[1].key});

    //交易类型
    $scope.tradeTypes = clearConstant.tradeTypes;

    //初始化合约信息
    $scope.Instruments = {};
    //初始化合约信息
    getInstrumentByProductID(function (result) {
        $scope.Instruments = result;
    }, {'productID': ''});


    //内部资金账号
    $scope.Accounts = {};
    //初始化内部账户下拉列表
    getAllAccounts(function (result) {
        $scope.Accounts = result;
    });

    //根据交易所查询所有产品
    $scope.changeExchang = function (exchId) {
        //根据选择的交易所查询对应的产品
        getAllProductByConditionEntity(function (result) {
            $scope.productDatas = result;
            $scope.queryEntity.productID = $scope.productDatas[0].productID;
        }, {exchID: exchId, productID: '', productType: clearConstant.productTypes[1].key, productStatus: ''});
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
        findInstrumentMarginSetEntity(function (result) {
            $scope.listEntitys = result;
            $scope.$apply();
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        }, tempEntity);
    };
    function formValidateReset(){
    	$scope.myForm.longMarginRate.$setPristine();
    	$scope.myForm.longMarginAmt.$setPristine();
    	$scope.myForm.shortMarginRate.$setPristine();
    	$scope.myForm.shortMarginAmt.$setPristine();
    	$scope.myForm.maintMarginRate.$setPristine();  
    }
    $scope.initParameter = function () {
        $scope.ModalEntity = {};
        $scope.ModalEntity.exchID = $scope.exchangeDatas[0].exchID;
        $scope.ModalEntity.productID = $scope.products[0].productID;
        $scope.ModalEntity.tradeType = $scope.tradeTypes[0].key;
        $scope.ModalEntity.innerAccountID = $scope.Accounts[0].innerAccountID;
        $scope.ModalEntity.instrumentID = $scope.Instruments[0].instrumentID;

        formValidateReset();
    };

    //修改
    $scope.initUpdateParam = function (index, entity) {
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        formValidateReset();
    };

    $scope.save = function (entity) {
        var index = entity.recordIndex;
        $scope.tempEntity = angular.copy(entity);
        //增加
        if (index == undefined) {
            saveInstrumentMarginSetEntity($scope.tempEntity);
            $scope.listEntitys.push($scope.tempEntity);
            //修改
        } else {
            updateInstrumentMarginSetEntity($scope.tempEntity);
            $scope.listEntitys.splice(index, 1, $scope.tempEntity);
        }
        //关闭窗口
        $("#myModal").modal("hide");
    };

    //删除
    $scope.remove = function (index, entity) {
        deleteInstrumentMarginSetEntity(entity.id);
        $scope.listEntitys.splice(index, 1);
    };

//-----------------------------------------------------------------
    //绑定事件 - 根据交易所代码查询产品
     $scope.exchangeSelect = function (exchId) {
        //根据交易所ID查询产品信息
        $scope.ModalEntity.productID = "";
        getProductByExchID(function (result) {
            $scope.productDatas = result;
            $scope.ModalEntity.productID = $scope.productDatas[0].productID;
            $scope.$apply();
        }, {'exchID': exchId, 'productID': '', 'productType': '', 'productStatus': ''});
    };

    //根据产品代码查询产品对应的合约信息
    $scope.productSelect = function (productID) {
        //根据产品代码查询产品对应的合约信息
        $scope.ModalEntity.instrumentID = "";
        getInstrumentByProductID(function (result) {
//            $scope.Instruments={};
            if (result.length > 0) {
                $scope.Instruments = result;
                $scope.ModalEntity.instrumentID = $scope.Instruments[0].instrumentID;
                $scope.$apply();
            }
        }, {'productID': productID});
    };

});

