myapp.controller('BankAccountController', function ($scope, $timeout) {
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});
	$scope.listEntitys = new Array();
	$scope.Accounts = {};
    //初始化内部账户下拉列表
    getAllAccounts(function (result) {
        $scope.Accounts = result;
    });
    $scope.bankIDDatas = clearConstant.bankIDDatas;

    //初始化查询选项
    $scope.datas = [
        {text: '全部', key: ''},
        {text: '否', key: '0'},
        {text: '是', key: '1'}
    ];
    //设置默认选中
    $scope.queryEntity = {'isActive': $scope.datas[0].key};
    
    //初始化列表
    getAllBackAccountEntity(function (result) {
    	$scope.listEntitys = result;
    });
    
    //查询
    $scope.find = function (queryEntity) {
        //clear
        $scope.listEntitys = {};
        $scope.isQuery = true;
        findBankAccountEntity(function (result) {
            $scope.listEntitys = result;
            $timeout(function() {
            	$scope.isQuery = false;
            	$scope.$apply();
              }, 1500);
        }, queryEntity);
    };

    //删除
    $scope.remove = function (entity, index) {
    	layer.confirm('确定注销此银行账户信息吗？', {icon: 3}, function (count) {
    		entity.isActive = '0';
            updateBankAccountEntity(function (result) {
                $scope.listEntitys.splice(index, 1, result);
                $scope.$apply();
            }, entity);
            layer.close(count);
        });
    };

    $scope.rebuild = function (entity, index) {
        layer.confirm('确定重新启用此银行账户信息吗？', {icon: 3}, function (count) {
        	entity.isActive = '1';
            updateBankAccountEntity(function (result) {
                $scope.listEntitys.splice(index, 1, result);
                $scope.$apply();
            }, entity);
            layer.close(count);
        });
    };
    //重置表单验证信息
    function formValidateReset(){
    	$scope.myForm.bankAccountID.$setPristine();   
    }
    
    //初始化模态窗
    $scope.initParameter = function () {
    	$scope.ModalEntity = {};
    	$scope.isUpdate = false;
    	document.getElementById("bankID").disabled = false;
        //设置资产单元
        $scope.ModalEntity.innerAccountID = $scope.Accounts[0].innerAccountID;
        $scope.ModalEntity.bankID = $scope.bankIDDatas[0].key;
        formValidateReset();

    };

    //修改
    $scope.initUpdateParam = function(index,entity){
    	$scope.isUpdate = true;
    	document.getElementById("bankID").disabled = true;
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        formValidateReset();
    };

    // 保存操作记录
    $scope.save = function(entity)
    {
        var index = entity.recordIndex;
        //修改
        if (index != undefined) {
            delete entity.recordIndex;
            findBankAccountEntity(function (result) {
                if (result.length > 0) {
                    layer.msg("银行账户信息已存在，不能修改", {icon: 2, time: 3000});
                    return false;
                } else {
                	updateBankAccountEntity(function (result) {
                		$scope.listEntitys.splice(index, 1, result);
                		$scope.$apply();
                	}, entity);
                }
            }, {innerAccountID: entity.innerAccountID, bankID: entity.bankID, bankAccountID: entity.bankAccountID});
            //新增
        } else {
        	findBankAccountEntity(function (result) {
                if (result.length > 0) {
                    layer.msg("银行账户信息已存在，不能重复新增", {icon: 2, time: 3000});
                    return false;
                } else {
                	entity.isActive='1';
                	saveBankAccountEntity(function (result) {
                        $scope.listEntitys.push(result);
                        $scope.$apply();
                    }, entity);
                }
            }, {innerAccountID: entity.innerAccountID, bankID: entity.bankID, bankAccountID: entity.bankAccountID});
        }
        $("#myModal").modal("hide");
    };
    
    //页面银行名称转换
    $scope.transBankName = function (key) {
        var count = $scope.bankIDDatas.length;
        for (var i = 0; i < count; i++) {
            if ($scope.bankIDDatas[i].key == key) {
                return $scope.bankIDDatas[i].text;
            }
        }
    }
});

