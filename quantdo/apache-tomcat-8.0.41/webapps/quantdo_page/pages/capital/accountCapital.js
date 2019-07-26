myapp.controller('AccountCapitalController', function ($scope, $timeout) {
	//1、实例化账户资金服务接口
	$scope.accountCapitalService = new com.quantdo.orgClear.service.AccountCapitalService();
	
	//2、定义页面数据模型
    $scope.queryEntity = {};
    $scope.tempEntity={};
    $scope.modalEntity = {};
    //2.1、内部资金账户
    $scope.accounts = {};
    
    //3、定义方法
    //3.1、查询账户资金
    $scope.find = function (queryEntity) {
        $scope.listEntitys = {};
        $scope.isQuery = true;
        $scope.accountCapitalService.findByCondition(queryEntity,function (result) {
            $scope.listEntitys = result;
            $scope.$apply();
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        });
    };     
    //3.2、保存账户资金
    $scope.save = function (entity) {    	
        var index = entity.recordIndex;
        entity.tradeSrc = clearConstant.trade_src_2;
        //增加
        if (index == undefined) {
        	$scope.accountCapitalService.add(entity,function (result) {
        		$scope.listEntitys.push(result);  
        		$scope.$apply();        		
        		$scope.resultFlag = true;
                $scope.resultInfo = "账户资金信息保存成功!";
                $timeout(function () {
                    $scope.resultFlag = false;
                    $scope.resultInfo = "";
                }, 3000);
        	});          	    		
            //修改
        } else {
        	$scope.accountCapitalService.update(entity,function (result) {
        		$scope.listEntitys.splice(index, 1, entity);  
        		$scope.$apply();        		
        		$scope.resultFlag = true;
                $scope.resultInfo = "账户资金信息保存成功!";
                $timeout(function () {
                    $scope.resultFlag = false;
                    $scope.resultInfo = "";
                }, 3000);
        	});  
            
        }
        //关闭窗口
        $("#myModal").modal("hide");
    };    
    //3.3、删除账户资金
    $scope.remove = function (entity,index) {
        //使用内置Index        
    	$scope.accountCapitalService.remove(entity.id,function (result) {
        	$scope.listEntitys.splice(index, 1);
    		$scope.$apply();    		
    		$scope.resultFlag = true;
            $scope.resultInfo = "账户资金信息记录删除成功!";
            $timeout(function () {
                $scope.resultFlag = false;
                $scope.resultInfo = "";
            }, 3000);
    	});       
    };    
    //3.4、初始化新增页面的参数
    $scope.initAddParam = function () {
        $scope.modalEntity = {};
        $scope.isUpdate = false;
        $scope.formValidateReset();
     };    
    //3.5、初始化个性页面的参数
     $scope.initUpdateParam = function (entity,index) {         
         $scope.tempEntity = angular.copy(entity);
         $scope.tempEntity.recordIndex = index;
         $scope.modalEntity = angular.copy($scope.tempEntity);
         $scope.isUpdate = true;
         $scope.formValidateReset();
         //$("[forType='date']").datepicker('remove');
     };
     //3.6、表单校验信息重置
     $scope.formValidateReset = function (){
     	$scope.myForm.settleDate.$setPristine();
     	$scope.myForm.innerAccountID.$setPristine();
     	$scope.myForm.totalMargin.$setPristine();
     	$scope.myForm.tradeMargin.$setPristine();
     	$scope.myForm.delivMargin.$setPristine();
     	$scope.myForm.profitloss.$setPristine();
     	$scope.myForm.tradeFee.$setPristine();
     	$scope.myForm.settleFee.$setPristine();
     	$scope.myForm.delivFee.$setPristine();
     	$scope.myForm.remainFee.$setPristine();
     	$scope.myForm.premiumIn.$setPristine();
     	$scope.myForm.premiumOut.$setPristine();
     	$scope.myForm.mortAvailMoney.$setPristine();
     	$scope.myForm.mortMargin.$setPristine();
     	$scope.myForm.withFunding.$setPristine();
     	$scope.myForm.moneyOut.$setPristine();
     	$scope.myForm.moneyIn.$setPristine();
     	$scope.myForm.totalOwnMoney.$setPristine();
     	$scope.myForm.reserve.$setPristine();
     	$scope.myForm.lastTotalOwnMoney.$setPristine();
     }     
    
    //4、数据初始化
    //4.1、初始化日期控件
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});      
    //4.2、初始化内部账户下拉列表
    getAllAccounts(function (result) {
        $scope.accounts = result;
    });
    //4.3、进入页面时调用查询方法
    $scope.find({startDate:"",endDate:"",innerAccountID:""});
    
    
      
});

