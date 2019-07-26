myapp.controller('InstrumentFeeSetController', function ($scope, $timeout) {
    //初始化页面信息
    getAllInstrumentFeeSetEntity(function (result) {
        $scope.listEntitys = result;
    });

    $scope.queryEntity = {};
    $scope.ModalEntity = {};
    $scope.products = new Array();
    $scope.Insts = new Array();


    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
//        $scope.queryEntity.exchID = $scope.exchangeDatas[0].exchID;
    });

    //初始化所有产品信息并默人选中第一项
    getAllProductEntity(function (result) {
        $scope.productDatas = result;
//        $scope.queryEntity.productID = $scope.productDatas[0].productID;
    });
    //交易类型
    $scope.tradeTypes = clearConstant.tradeTypes;

    //资金账号
    $scope.Accounts = {};
    //初始化内部账户下拉列表
    getAllAccounts(function (result) {
        $scope.Accounts = result;
        //设置默认选中
//        $scope.queryEntity.innerAccountID = $scope.Accounts[0].innerAccountID;
    });

    $scope.Instruments = {};
    //初始化合约信息
    getInstrumentByProductID(function (result) {
        $scope.Instruments = result;
        $scope.$apply();
    }, {'productID': ''});


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
        }, tempEntity);
    };

    $scope.initParameter = function () {
        $scope.ModalEntity = {};
        $scope.ModalEntity.innerAccountID = $scope.Accounts[0].innerAccountID;
        $scope.ModalEntity.tradeType = $scope.tradeTypes[0].key;
    };

    //-------------------------------------
    //定义事件方法
    $scope.exchangeSelect = function (exchID) {
        $scope.products = new Array();
        $scope.Insts = new Array();
        $scope.ModalEntity.productID = "";
        getAllProductByConditionEntity(function (result) {
            if (result.length > 0) {
                $scope.products = result;
                $scope.ModalEntity.productID = $scope.products[0].productID;
                $scope.$apply();
                //根据默认选中合约信息
                $scope.productSelect($scope.ModalEntity.productID);
            }
        }, {exchID: exchID, productID: '', productType: '', productStatus: ''});
    };

    //根据产品查询合约信息
    $scope.productSelect = function (productID) {
        //根据产品代码查询产品对应的合约信息
        $scope.ModalEntity.instrumentID = "";
        $scope.Insts = new Array();
        getInstrumentByProductID(function (result) {
            if (result.length > 0) {
                $scope.Insts = result;
                $scope.ModalEntity.instrumentID = $scope.Insts[0].instrumentID;
                $scope.$apply();
            }
        }, {'productID': productID});
    };


    //---------------------------------------

    //修改
    $scope.initUpdateParam = function (index, entity) {
        $scope.products = new Array();
        $scope.Insts = new Array();
        angular.forEach($scope.productDatas, function (data, index, array) {
            if (data.exchID == entity.exchID) {
                $scope.products.push(array[index]);
            }
        });
        angular.forEach($scope.Instruments, function (data, index, array) {
            if (data.instrumentID == entity.instrumentID) {
                $scope.Insts.push(array[index]);
            }
        });
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
    };

    $scope.save = function (entity) {
        var index = entity.recordIndex;
        $scope.tempEntity = angular.copy(entity);
        //增加
        if (index == undefined) {
            saveInstrumentFeeSetEntity($scope.tempEntity);
            $scope.listEntitys.push($scope.tempEntity);
            //修改
        } else {
            updateInstrumentFeeSetEntity($scope.tempEntity);
            $scope.listEntitys.splice(index, 1, $scope.tempEntity);
        }
        //关闭窗口
        $("#myModal").modal("hide");
    };

    //删除
    $scope.remove = function (index, entity) {
        deleteInstrumentFeeSetEntity(entity.id);
        $scope.listEntitys.splice(index, 1);
    };
});

