myapp.controller('ProductFeeSetController', function ($scope, $timeout) {
    //初始化页面信息
    getAllProductFeeSetEntity(function (result) {
        $scope.listEntitys = result;
        $scope.$apply();
    });

    $scope.queryEntity = {};
    $scope.ModalEntity = {};
    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
    });

    //初始化所有产品信息并默人选中第一项
    getAllProductEntity(function (result) {
        $scope.productDatas = result;
    });
    //交易类型
    $scope.tradeTypes = clearConstant.tradeTypes;

    //转换交易类型
    $scope.transTradeTypes = function(key){
    	for(var i = 0;i < $scope.tradeTypes.length;i++){
    		if($scope.tradeTypes[i].key == key){
    			return $scope.tradeTypes[i].text;
    		}
    	}
    }
    
    //内部资金账号
    $scope.Accounts = [];
    //初始化内部账户下拉列表
    getAllAccounts(function (result) {
        $scope.Accounts = result;
    });


    //查询
    $scope.findFeeSet = function (queryEntity) {
        $scope.listEntitys = {};
        $scope.isQuery = true;
        var tempEntity = {
            exchID: '',
            productID: '',
            tradeType: '',
            innerAccountID: ''
        };
        tempEntity = angular.copy(queryEntity);
        findProductFeeSetEntity(function (result) {
            $scope.listEntitys = result;
//            $scope.$apply();
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
        $scope.ModalEntity.exchID = $scope.exchangeDatas[0].exchID;
        $scope.ModalEntity.productID = $scope.productDatas[0].productID;
        $scope.ModalEntity.innerAccountID = $scope.Accounts[0].innerAccountID;
        $scope.isUpdate = false;
        $scope.selectExchange($scope.ModalEntity.exchID);
        formValidateReset();
        setDefaultValue();
    };

    function setDefaultValue() {
        $scope.ModalEntity.settleFeeRate=0;
        $scope.ModalEntity.settleFeeAmt=0;
        $scope.ModalEntity.delivFeeRate=0;
        $scope.ModalEntity.delivFeeAmt=0;
    }

    //修改
    $scope.initUpdateParam = function (index, entity) {
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        $scope.isUpdate = true;
        $scope.products = new Array();
        angular.forEach($scope.productDatas, function (data, index, array) {
            if (data.exchID == entity.exchID) {
                $scope.products.push(array[index]);
            }
        });
        formValidateReset();
    };

    $scope.save = function (entity) {
        var index = entity.recordIndex;
        //增加
        if (index == undefined) {
            //校验是否已存在同一资金账号、统一产品类型、同一交易类型
            findProductFeeSetEntity(function (result) {
                if (result.length > 0) {
                    layer.msg("同一品种对应同一账户只能设置唯一一条手续费", {icon: 2, time: 3000});
                    return false;
                } else {
                    saveProductFeeSetEntity(function (result) {
                        $scope.listEntitys.unshift(result);
                        $scope.$apply();
                    }, entity);
                }
            }, {innerAccountID: entity.innerAccountID,exchID: entity.exchID, productID: entity.productID, tradeType: entity.tradeType});
            //修改
        } else {
            updateProductFeeSetEntity(function(result){
                $scope.listEntitys.splice(index, 1, result);
                $scope.$apply();
            },entity);
        }
        //关闭窗口
        $("#productFeeSetModal").modal("hide");
    };

    //删除
    $scope.remove = function (index, entity) {
        layer.confirm('确定删除该条记录吗？', {icon: 3}, function (count) {
            deleteProductFeeSetEntity(entity.id);
            $scope.listEntitys.splice(index, 1);
            $scope.$digest();
            layer.close(count);
        });
    };

    $scope.products = new Array();
    $scope.selectExchange = function (exchID) {
        $scope.products = new Array();
        $scope.ModalEntity.productID = "";
        getAllProductByConditionEntity(function (result) {
            if (result.length > 0) {
                $scope.products = result;
                $scope.ModalEntity.productID = $scope.products[0].productID;
                $scope.$apply();
            }
        }, {exchID: exchID, productID: '', productType: clearConstant.productTypes[0].key, productStatus: ''});
    };

});

