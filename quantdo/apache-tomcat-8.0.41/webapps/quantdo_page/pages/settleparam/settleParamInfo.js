myapp.controller('SettleParamController', function ($scope, $timeout) {
    //初始化页面信息
    getAllEntity(function (result) {
        $scope.listEntitys = result;
    });

    $scope.exchangeDatas = {};
    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
        $scope.queryEntity = {'exchID':$scope.exchangeDatas[0].exchID};
    });

    //查询
    $scope.find = function (queryEntity) {
        //clear
        $scope.listEntitys = {};
        $scope.isQuery = true;
        findEntity(function (result) {
            $scope.listEntitys = result;
            $timeout(function() {
            	$scope.isQuery = false;
            	$scope.$apply();
              }, 1500);
        }, queryEntity);
    };

    //删除
    $scope.remove = function (index, entity) {
        deleteEntity(entity.id);
        $scope.listEntitys.splice(index, 1);
    };

    //初始化模态窗
    $scope.initParameter = function () {
        //设置资产单元
        $scope.ModalEntity = {'productType': $scope.productTypes[0].key,'productStatus': $scope.productStatus[0].key,'exchID':$scope.exchangeDatas[0].exchID,'tradeCurrency': $scope.currenys[0].key};

    };

    //修改
    $scope.initUpdateParam = function (index, entity) {
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
    };

    // 保存操作记录
    $scope.save = function (entity) {
        var index = entity.recordIndex;
        //增加
        if (index == undefined) {
            saveEntity(entity);
            $scope.listEntitys.push(entity);
            //修改
        } else {
            updateEntity(entity);
            $scope.listEntitys.splice(index, 1, entity);
        }
        //关闭窗口
        $("#myModal").modal("hide");
    };
});

