myapp.controller('InstrumentFeeSetController', function ($scope, $timeout) {
    //初始化页面信息
    getAllInstrumentFeeSetEntity(function (result) {
        $scope.listEntitys = result;
    },clearConstant.productTypes[0].key);

    $scope.queryEntity = {};
    $scope.ModalEntity = {};
    $scope.products = new Array();
    $scope.Insts = new Array();

    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
    });

    //按照产品类型获取产品信息
    findProductEntity(function (result) {
        $scope.productDatas = result;
    }, {productType: '1'});
    //交易类型
    $scope.tradeTypes = clearConstant.tradeTypes;

    //资金账号
    $scope.Accounts = {};
    //初始化内部账户下拉列表
    getAllAccounts(function (result) {
        $scope.Accounts = result;
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
        }, tempEntity,clearConstant.productTypes[0].key);
    };
    function formValidateReset(){
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
        $scope.ModalEntity.innerAccountID = $scope.Accounts[0].innerAccountID;
        $scope.ModalEntity.tradeType = $scope.tradeTypes[0].key;
        formValidateReset();
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
        }, {exchID: exchID, productID: '', productType: '1', productStatus: ''});
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
        formValidateReset();
    };

    $scope.save = function (entity) {
        var index = entity.recordIndex;
        //增加
        if (index == undefined) {
            saveInstrumentFeeSetEntity(function(addResponse){
                $scope.listEntitys.push(addResponse);
                $scope.$apply();
            },entity,clearConstant.productTypes[0].key);
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

    //删除
    $scope.remove = function (index, entity) {
        deleteInstrumentFeeSetEntity(entity.id);
        $scope.listEntitys.splice(index, 1);
    };
});

