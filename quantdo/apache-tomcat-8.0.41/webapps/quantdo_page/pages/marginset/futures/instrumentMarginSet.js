myapp.controller('FuturesInstrumentMarginSetController', function ($scope, $timeout) {
	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
	//初始化页面信息
    getAllInstrumentMarginSetEntity(function (result) {
        $scope.listEntitys = result;
    }, clearConstant.productTypes[0].key);

    $scope.queryEntity = {};
    $scope.ModalEntity = {};
    $scope.instruments = {};
    $scope.productDatas = {};
    $scope.products = {};
    $scope.Insts = {};

    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
    });

    //按照产品类型获取产品信息
    findProductEntity(function (result) {
        $scope.productDatas = result;
    }, {productType: clearConstant.productTypes[0].key});

    //交易类型
    $scope.tradeTypes = clearConstant.tradeTypes;

    //初始化合约信息
    $scope.Instruments = new Array();
    //初始化合约信息
    getInstrumentByProductID(function (result) {
        $scope.Instruments = result;
        $scope.Insts = result;
    }, {'productID': ''});

    //内部资金账号
    $scope.Accounts = {};
    //初始化内部账户下拉列表
    getAllAccounts(function (result) {
        $scope.Accounts = result;
    });

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
        $scope.ModalEntity.innerAccountID = $scope.Accounts[0].innerAccountID;
        $scope.ModalEntity.productID = $scope.productDatas[0].productID;
        $scope.changeExchangs($scope.ModalEntity.exchID);
        formValidateReset();

//      $scope.ModalEntity.tradeType = $scope.tradeTypes[0].key;
//      $scope.ModalEntity.instrumentID = $scope.Insts[0].instrumentID;
    };

    //修改
    $scope.initUpdateParam = function (index, entity) {
        $scope.products = new Array();
        angular.forEach($scope.productDatas, function (data, index, array) {
            if (data.exchID == entity.exchID) {
                $scope.products.push(array[index]);
            }
        });
        $scope.Insts = new Array();
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
        new $.SystemParams().getOperatorInfo(function (Id) {
            clearConstant.setOperator(entity, Id);
            //增加
            if (index == undefined) {
                saveInstrumentMarginSetEntity(function () {
                    $scope.listEntitys.push(entity);
                    $scope.$apply();
                }, entity);

                //重新渲染listEntitys
                $scope.$watchCollection($scope.listEntitys, function () {
                    getAllInstrumentMarginSetEntity(function (result) {
                        $scope.listEntitys = result;
                    }, clearConstant.productTypes[0].key);
                });
                //修改
            } else {
                updateInstrumentMarginSetEntity(function () {
                    $scope.listEntitys.splice(index, 1, entity);
                    $scope.$apply();
                }, entity);
            }
        });
        //关闭窗口
        $("#myModal").modal("hide");
    };

    //删除
    $scope.remove = function (index, entity) {
        deleteInstrumentMarginSetEntity(entity.id);
        $scope.listEntitys.splice(index, 1);
    };

//-----------------------------------------------------------------
    //根据交易所查询所有产品
    $scope.changeExchangs = function (exchId) {
        $scope.ModalEntity.productID = "";
        $scope.ModalEntity.instrumentID = "";
        $scope.products = {};
        $scope.Insts={};
        //根据选择的交易所查询对应的产品
        getAllProductByConditionEntity(function (result) {
            if (result.length > 0) {
                $scope.productDatas = result;
                $scope.ModalEntity.productID = $scope.productDatas[0].productID;
                $scope.products = angular.copy($scope.productDatas);
                $scope.$apply();
                $scope.productSelect($scope.ModalEntity);
            }
        }, {exchID: exchId, productID: '', productType: clearConstant.productTypes[0].key, productStatus: ''});
    };

    //根据产品代码查询产品对应的合约信息
    $scope.productSelect = function (entity) {
        //根据产品代码查询产品对应的合约信息
        $scope.ModalEntity.instrumentID = "";
        $scope.Insts={};
        getInstrumentByProductIDAndExchID(function (result) {
//            $scope.Instruments = {};
            if (result.length > 0) {
                $scope.Insts = result;
                $scope.ModalEntity.instrumentID = $scope.Insts[0].instrumentID;
                $scope.$apply();
            }
        }, entity);
    };

});

