//期权保证金设置
myapp.controller('OptionProductMarginSetController', function ($scope, $timeout) {
    //初始化页面信息
    getAllProductMarginSetEntity(function (result) {
        $scope.listEntitys = result;
    }, clearConstant.productTypes[1].key);

    $scope.queryEntity = {};
    $scope.ModalEntity = {};
    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
    });

    findProductEntity(function (result) {
        $scope.productDatas = result;
    }, {productType: clearConstant.productTypes[1].key});
    //交易类型
    $scope.tradeTypes = clearConstant.tradeTypes;
    $scope.queryEntity.tradeType = $scope.tradeTypes[0].key;

    //内部资金账号
    $scope.Accounts = {};
    //初始化内部账户下拉列表
    getAllAccounts(function (result) {
        $scope.Accounts = result;
    });


    //---------------------
    //设置事件方法
    $scope.products = new Array();
    $scope.selectExchange = function(exchID){
        $scope.products = new Array();
        $scope.ModalEntity.productID ="";
        getAllProductByConditionEntity(function (result) {
            if (result.length > 0) {
                $scope.products = result;
                $scope.ModalEntity.productID = $scope.products[0].productID;
                $scope.$apply();
            }
        }, {exchID: exchID, productID: '', productType: clearConstant.productTypes[1].key, productStatus: ''});
    };
    //------------------------


    //查询
    $scope.find = function (queryEntity) {
        $scope.listEntitys = {};
        $scope.isQuery = true;
        var tempEntity = {
            exchID: '',
            productID: '',
            tradeType: '',
            innerAccountID: ''
        };
        tempEntity = angular.copy(queryEntity);
        findProductMarginSetEntity(function (result) {
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
        $scope.ModalEntity.productID = $scope.productDatas[0].productID;
        $scope.ModalEntity.tradeType = $scope.tradeTypes[0].key
        $scope.ModalEntity.innerAccountID = $scope.Accounts[0].innerAccountID;
        $scope.selectExchange($scope.ModalEntity.exchID);
        formValidateReset();
    };

    //修改
    $scope.initUpdateParam = function (index, entity) {
        $scope.products = new Array();
        angular.forEach($scope.productDatas, function (data, index, array) {
            if (data.exchID == entity.exchID) {
                $scope.products.push(array[index]);
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
        new $.SystemParams().getOperatorInfo(function (Id) {
            clearConstant.setOperator(entity, Id);
            if (index == undefined) {
                checkProduct(function (result) {
                    if (result!=undefined) {
                        layer.msg("同一品种对应同一账户只能设置唯一一条保证金", {icon: 2, time: 3000});
                        return false;
                    } else {
                        saveProductMarginSetEntity(function () {
                            $scope.listEntitys.push(entity);
                            $scope.$apply();
                        }, entity);

                        getAllProductMarginSetEntity(function (result) {
                            $scope.listEntitys = result;
                        }, clearConstant.productTypes[1].key);
                    }
                }, entity);
                //修改
            } else {
                updateProductMarginSetEntity(entity);
                $scope.listEntitys.splice(index, 1, entity);
            }
        });
        //关闭窗口
        $("#myModal").modal("hide");
    };

    //删除
    $scope.remove = function (index, entity) {
        deleteProductMarginSetEntity(entity.id);
        $scope.listEntitys.splice(index, 1);
    };


});

