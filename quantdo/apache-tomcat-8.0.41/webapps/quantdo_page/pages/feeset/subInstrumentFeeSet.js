myapp.controller('SubInstrumentFeeSetController', function ($scope, $timeout) {
    //初始化页面信息
    getAllSubInstrumentFeeSetEntity(function (result) {
        $scope.listEntitys = result;
    });

    $scope.queryEntity = {};
    $scope.ModalEntity = {};
    $scope.Instruments = {};
    $scope.products = new Array();
    $scope.Insts = new Array();

    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
    });

    //初始化所有产品信息
    getAllProductEntity(function (result) {
        $scope.productDatas = result;
        $scope.products = result;
    });
    //交易类型
    $scope.tradeTypes = clearConstant.tradeTypes;

    //内部资金账号
    $scope.SubAccounts = {};
    //初始化资产单元下拉列表
    getAllSubAccounts(function (result) {
        $scope.SubAccounts = result;
    });
    //初始化合约信息
    getInstrumentByProductID(function (result) {
        $scope.Instruments = result;
        $scope.Insts = result;
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
            subAccountID: '',
            instrumentID: ''
        };
        tempEntity = angular.copy(queryEntity);
        findSubInstrumentFeeSetEntity(function (result) {
            $scope.listEntitys = result;
            $scope.$apply();
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        }, tempEntity);
    };

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

    $scope.initParameter = function () {
        $scope.ModalEntity = {};
        $scope.ModalEntity.tradeType = $scope.tradeTypes[0].key
        $scope.ModalEntity.subAccountID = $scope.SubAccounts[0].subAccountID;
        formValidateReset();
    };


    <!--新增 修改页面事件绑定 -->
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
        getInstrumentByProductID(function (result) {
            if (result.length > 0) {
                $scope.Insts = result;
                $scope.ModalEntity.instrumentID = $scope.Insts[0].instrumentID;
                $scope.$apply();
            }
        }, {productID: productID});
    };
    <!-- /.新增 修改页面事件绑定 -->


    //修改
    $scope.initUpdateParam = function (index, entity) {
//        $scope.Insts = new Array();
//        angular.forEach($scope.productDatas, function (data, index, array) {
//            if (data.exchID == entity.exchID) {
//                $scope.products.push(array[index]);
//            }
//        });
//        angular.forEach($scope.Instruments, function (data, index, array) {
//            if (data.instrumentID == entity.instrumentID) {
//                $scope.Insts.push(array[index]);
//            }
//        });

        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        formValidateReset();
    };

    $scope.save = function (entity) {
        var index = entity.recordIndex;
        //增加
        if (index == undefined) {
            saveSubInstrumentFeeSetEntity(function (result) {
                $scope.listEntitys.push(result);
                $scope.$digest();
            }, entity);

            //修改
        } else {
            updateSubInstrumentFeeSetEntity(function (result) {
                $scope.listEntitys.splice(index, 1, result);
                $scope.$digest();
            }, entity);
        }
        //关闭窗口
        $("#myModal").modal("hide");
    };

    //删除
    $scope.remove = function (index, entity) {
        deleteSubInstrumentFeeSetEntity(entity.id);
        $scope.listEntitys.splice(index, 1);
    };

});

