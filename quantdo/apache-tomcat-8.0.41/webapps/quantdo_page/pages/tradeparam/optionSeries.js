myapp.controller('optionSeriesController', function ($scope, $timeout) {

    //定义查询对象
    $scope.queryEntity = {
        exchID: "",
        productID: "",
        optionSeriesID: ""
    };

    //初始化页面信息
    getAllOptionSeriesEntity(function (result) {
        $scope.listEntitys = result;
    });
    $scope.exchangeDatas = {};
    $scope.productDatas = {};

    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
        $scope.queryEntity.exchID = $scope.exchangeDatas[0].exchID;
    });

    //初始化产品信息
    getAllProductEntity(function (result) {
        var tempArray = new Array();
        angular.forEach(result, function (data, index, array) {
            if (data.productType == "2" && data.productStatus == '1') {
                tempArray.push(data);
            }
        });
        $scope.productDatas = tempArray;
        $scope.queryEntity.productID = $scope.productDatas[0].productID;
    });


    //查询
    $scope.find = function (queryEntity) {
        $scope.listEntitys = {};
        $scope.isQuery = true;
        findOptionSeriesEntity(function (result) {
            $scope.listEntitys = result;
            $timeout(function() {
            	$scope.isQuery = false;
            	$scope.$apply();
              }, 1500);
        }, queryEntity);
    };

    //删除
    $scope.remove = function (index, entity) {
        layer.confirm('确定删除该条记录吗？', {icon: 3}, function (count) {
            deleteOptionSeriesEntity(entity.id);
            $scope.listEntitys.splice(index, 1);
            $scope.$digest();
            layer.close(count);
        });
    };

    function formValidateReset() {
        $scope.myForm.optionSeriesID.$setPristine();
        $scope.myForm.optionSeriesName.$setPristine();
    }

    //初始化模态窗
    $scope.initParameter = function () {
        $scope.ModalEntity = {};
        //设置资产单元
        $scope.ModalEntity.exchID = $scope.exchangeDatas[0].exchID;
        $scope.ModalEntity.productID = $scope.productDatas[0].productID;

        formValidateReset();
    };

    //修改
    $scope.initUpdateParam = function (index, entity) {
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);

        formValidateReset();
    };

    // 保存操作记录
    $scope.save = function (entity) {
        var index = entity.recordIndex;
        //增加
        if (index == undefined) {
            saveOptionSeriesEntity(function (result) {
                $scope.listEntitys.push(result);
                $scope.$digest();
            }, entity);
            //修改
        } else {
            updateOptionSeriesEntity(function (result) {
                $scope.listEntitys.splice(index, 1, result);
                $scope.$digest();
            }, entity);
        }
        //关闭窗口
        $("#myModal").modal("hide");
    };
});

