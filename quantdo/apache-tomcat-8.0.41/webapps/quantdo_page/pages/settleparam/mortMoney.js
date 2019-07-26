myapp.controller('mortMoneyController', function ($scope, $timeout) {
    $("[forType='date']").datepicker({
        language: 'zh-CN',
        weekStart: 1,
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        format: 'yyyymmdd'
    });
    $scope.mortMoneyEntity = {};
    $scope.tempEntity = {};
    $scope.ModalEntity = {};
    $scope.mortMoneyEntity.recordIndex = -1;

    //初始化页面记录
    getAllMortMoneyEntity(function (result) {
        $scope.mortMoneyEntitys = result;
    });

    //页面查询
    $scope.find = function (object) {
        $scope.mortMoneyEntitys = {};
        $scope.isQuery = true;
        findMortMoney(function (result) {
            $scope.mortMoneyEntitys = result;
            $timeout(function() {
            	$scope.isQuery = false;
            	$scope.$apply();
              }, 1500);
        }, object);
    }
    //重置表单验证信息
    function formValidateReset() {
        $scope.myForm.settleDate.$setPristine();
        $scope.myForm.mortEffectMoney.$setPristine();
        $scope.myForm.innerAccountId.$setPristine();
    }

    $scope.Accounts = {};
    //初始化内部账户下拉列表
    getAllAccounts(function (result) {
        $scope.Accounts = result;
        //设置默认选中
    });

    //开启模态窗口初始化参数
    $scope.initParameter = function () {
        $scope.tempEntity = {};
        $scope.ModalEntity = {};
        $scope.ModalEntity.innerAccountID = $scope.Accounts[0].innerAccountID;
        formValidateReset();
    };

    $scope.initUpdateParam = function (index, entity) {
        //复制临时操作对象
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        angular.merge($scope.ModalEntity, $scope.tempEntity);
        formValidateReset();
    };

    //保存操作结果
    $scope.save = function (entity) {
        var index = entity.recordIndex;
        new $.SystemParams().getOperatorInfo(function (Id) {
            clearConstant.setOperator(entity, Id);
            //增加
            if (index == undefined) {
                saveMortMoneyEntity(function () {
                    $scope.mortMoneyEntitys.push(angular.copy(entity));
                    $scope.$apply();
                }, entity);
                //重新渲染mortMoneyEntitys
                $scope.$watchCollection($scope.mortMoneyEntitys, function () {
                    getAllMortMoneyEntity(function (result) {
                        $scope.mortMoneyEntitys = result;
                    });
                    $scope.$apply();
                });
                //修改
            } else {
                updateMortMoneyEntity(entity);
                $scope.mortMoneyEntitys.splice(index, 1, angular.copy(entity));
                $scope.$apply();
            }

        });
        $("#myModal").modal("hide");
    };

    //删除选择对象
    $scope.remove = function (index, entity) {
        //删除后台记录
        deleteMortMoneyEntity(entity.id);
        $scope.mortMoneyEntitys.splice(index, 1);
    }
});
