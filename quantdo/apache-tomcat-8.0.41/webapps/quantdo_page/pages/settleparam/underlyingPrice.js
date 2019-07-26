myapp.controller('UnderlyingPriceController', function ($scope, $timeout) {
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});		
    $scope.queryEntity = {};
    $scope.tempEntity = {};
    $scope.tempEntity.recordIndex = -1;
    $scope.ModalEntity ={};

    //初始化页面信息
    getAllUnderlyingPriceEntity(function (result) {
        $scope.listEntitys = result;        
    });

    $scope.queryObject = [{'settleDate':'','underlyingID':''}];
    //查询
    $scope.find = function (entity) {
        $scope.queryObject = angular.copy(entity);
        $scope.listEntitys = {};        
        $scope.isQuery = true;
        findUnderlyingPriceEntity(function (result) {
            $scope.listEntitys = result;
            $timeout(function() {
            	$scope.isQuery = false;
            	$scope.$apply();
              }, 1500);
        }, $scope.queryObject);
    };

    //删除
    $scope.remove = function (index, entity) {
        deleteUnderlyingPriceEntity(entity.id);
        $scope.listEntitys.splice(index, 1);
    };

    function formValidateReset(){
    	$scope.myForm.settleDate.$setPristine();
    	$scope.myForm.underlyingID.$setPristine();
    	$scope.myForm.closePrice.$setPristine();
    }
    
    //初始化模态窗
    $scope.initParameter = function () {  
    	$scope.ModalEntity = {};
        formValidateReset();
    };

    //修改
    $scope.initUpdateParam = function (index, entity) {
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = {};
        
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        formValidateReset();
    };

    // 保存操作记录
    $scope.save = function (entity) {
        var index = entity.recordIndex;
        $scope.tempEntity = angular.copy(entity);        
        //增加
        if (index == undefined) {
            saveUnderlyingPriceEntity($scope.tempEntity);
            $scope.listEntitys.push($scope.tempEntity);
            //修改
        } else {
            updateUnderlyingPriceEntity($scope.tempEntity);
            $scope.listEntitys.splice(index, 1, $scope.tempEntity);
        }
        //关闭窗口
        $("#myModal").modal("hide");
    };
});

