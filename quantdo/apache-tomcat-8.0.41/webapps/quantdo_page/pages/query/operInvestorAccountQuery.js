myapp.controller('OperInvestorAccountQueryController', function ($scope, $timeout) {
	//1、实例化服务接口
	//1.1、 实例化客户实时账户资金服务接口
	$scope.service = new com.quantdo.orgClear.service.OperInvestorAccountService();
	//1.2、公用查询服务接口
	$scope.commonQueryservice = new com.quantdo.orgClear.service.CommonQueryService();
	
	
	//2、定义页面数据模型
    $scope.queryEntity = {};       
    
    //3、定义方法
    //3.1、查询客户实时账户资金
    $scope.find = function (queryEntity) {
        $scope.listEntitys = {};
        $scope.isQuery = true;
        $scope.service.findByCondition(queryEntity,function (result) {
            $scope.listEntitys = result;
            $scope.$apply();
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        });
    };     
    
     
    
    //4、数据初始化        
    //4.1、进入页面时调用查询方法
    $scope.find($scope.queryEntity);    
    //4.2 初始化交易所信息
    $scope.commonQueryservice.getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
    });
});

