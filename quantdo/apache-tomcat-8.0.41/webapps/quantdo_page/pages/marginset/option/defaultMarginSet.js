myapp.controller('OptionDefaultMarginSetController', function ($scope, $timeout) {
    //初始化页面信息
    getAllDefaultMarginSetEntity(function(result) {
        $scope.listEntitys = result;
    },clearConstant.productTypes[1].key);
    $scope.queryEntity={};
    $scope.ModalEntity={};
    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
    });

    //初始化所有产品信息并默人选中第一项
    //按照产品类型获取产品信息
    findProductEntity(function (result) {
        $scope.productDatas = result;
    }, {productType: clearConstant.productTypes[1].key});
    //交易类型
    $scope.tradeTypes =  clearConstant.tradeTypes;

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
            tradeType: ''
        };
        tempEntity = angular.copy(queryEntity);
        findDefaultMarginSetEntity(function (result) {
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
        $scope.ModalEntity={};
        $scope.ModalEntity.exchID = $scope.exchangeDatas[0].exchID;
        $scope.ModalEntity.productID = $scope.productDatas[0].productID;
        $scope.ModalEntity.tradeType = $scope.tradeTypes[0].key
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
        $scope.tempEntity = angular.copy(entity);
        //增加
        if (index == undefined) {
            saveDefaultMarginSetEntity($scope.tempEntity);
            $scope.listEntitys.push($scope.tempEntity);
            //修改
        } else {
            updateDefaultMarginSetEntity($scope.tempEntity);
            $scope.listEntitys.splice(index, 1, $scope.tempEntity);
        }
        //关闭窗口
        $("#myModal").modal("hide");
    };

    //删除
    $scope.remove = function(index,entity){
        deleteDefaultMarginSetEntity(entity.id);
        $scope.listEntitys.splice(index, 1);
    };


});

