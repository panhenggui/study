myapp.controller('WithFundingController', function ($scope, $timeout) {
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});		
    //初始化页面信息
    getAllWithFundingEntity(function (result) {
        $scope.listEntitys = result;
    });

    $scope.Accounts = {};
    $scope.tempEntity = {};
    $scope.tempEntity.recordIndex = -1;
    //初始化内部账户下拉列表
    getAllAccounts(function (result) {
        $scope.Accounts = result;
    });
    //查询
    $scope.find = function (queryEntity) {
        //clear
        $scope.listEntitys = {};
        $scope.isQuery = true;
        findWithFundingEntity(function (result) {
            $scope.listEntitys = result;
            $timeout(function() {
            	$scope.isQuery = false;
            	$scope.$apply();
              }, 1500);
        }, queryEntity);
    };

    //删除
    $scope.remove = function (index, entity) {
        deleteWithFundingEntity(entity.id);
        $scope.listEntitys.splice(index, 1);
    };

    //重置表单验证信息
    function formValidateReset(){
    	$scope.myForm.settleDate.$setPristine(); 
        $scope.myForm.withFunding.$setPristine();  
    }
    
    //初始化模态窗
    $scope.initParameter = function () {
        //设置资产单元
        $scope.ModalEntity = {'innerAccountID': $scope.Accounts[0].innerAccountID};
        formValidateReset();

    };

    //修改
    $scope.initUpdateParam = function(index,entity){
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        formValidateReset();
    };

    // 保存操作记录
    $scope.save = function(entity)
    {
        var index = entity.recordIndex;
        //增加
        if(index==undefined){
            saveWithFundingEntity(function (result) {
            	$scope.listEntitys.push(result);
            	$scope.$apply();
            }, entity);
            //修改
        }else{
            updateWithFundingEntity(function (result) {
            	$scope.listEntitys.splice(index,1,result);
            	$scope.$apply();
            }, entity);
        }
        //关闭窗口
        $("#myModal").modal("hide");
    };
});

