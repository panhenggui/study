myapp.controller('PositionController', function ($scope, $timeout) {
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});		
    //初始化页面信息
    $scope.queryEntity = {};  
    
    $scope.currencys = clearConstant.currenys;
                   
	//资金账号
    $scope.queryCapitalAccounts = new Array();
    //初始化页面记录
    getAllCapitalAccountEntity(function (result) {
        $scope.capitalAccountEntitys = result;
        $scope.queryCapitalAccounts = angular.copy($scope.capitalAccountEntitys);
    });

	//内部资金账号
	$scope.Accounts = {};
	//初始化内部账户下拉列表
	getAllAccounts(function (result) {
		$scope.Accounts = result;
		//设置默认选中
		$scope.queryEntity.innerAccountID = $scope.Accounts[0].innerAccountID;
	});

    //查询
    $scope.tempEntity = {};
    $scope.find = function (queryEntity) {
        //clear
        $scope.listEntitys = {};
        $scope.isQuery = true;
        $scope.tempEntity = angular.copy(queryEntity);        
        getPosition(function (result) {
            $scope.listEntitys = result;
            $scope.$apply();
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        }, $scope.tempEntity);
    };
});

