myapp.controller('UserTraderController', function ($scope, $timeout) {
	//1、实例化服务接口
	//1.1、会员服务接口
	$scope.service = new com.quantdo.orgClear.service.UserTraderService();
	//1.2、交易用户服务接口
	$scope.tradeUserService = new com.quantdo.orgClear.service.TradeUserService();
	//1.3、交易员服务接口
	$scope.traderService = new com.quantdo.orgClear.service.TraderService();	
	
	//2、定义页面数据模型
    $scope.queryEntity = {};
    $scope.tempEntity={};
    $scope.modalEntity = {};

    
    //3、定义方法
    //3.1、查询会员
    $scope.find = function (queryEntity) {
        $scope.listEntitys = {};               
        $scope.service.findByCondition(queryEntity,function (result) {
            $scope.listEntitys = result;
        });
    };     
    //3.2、保存会员
    $scope.save = function (entity) {    	
        var index = entity.recordIndex;        
        //增加
        if (index == undefined) {
        	$scope.service.add(entity,function (result) {
        		$scope.listEntitys.push(result);  
        		$scope.$apply();        		
        		$scope.resultFlag = true;
                $scope.resultInfo = "用户交易员关系信息保存成功!";
                $timeout(function () {
                    $scope.resultFlag = false;
                    $scope.resultInfo = "";
                }, 3000);
        	});          	    		
            //修改
        } else {
        	$scope.service.update(entity,function (result) {
        		$scope.listEntitys.splice(index, 1, entity);  
        		$scope.$apply();        		
        		$scope.resultFlag = true;
                $scope.resultInfo = "用户交易员关系信息保存成功!";
                $timeout(function () {
                    $scope.resultFlag = false;
                    $scope.resultInfo = "";
                }, 3000);
        	});  
            
        }
        //关闭窗口
        $("#myModal").modal("hide");
    };    
    //3.3、删除会员
    $scope.remove = function (entity,index) {
        //使用内置Index        
    	$scope.service.remove(entity.id,function (result) {
        	$scope.listEntitys.splice(index, 1);
    		$scope.$apply();    		
    		$scope.resultFlag = true;
            $scope.resultInfo = "用户交易员关系信息记录删除成功!";
            $timeout(function () {
                $scope.resultFlag = false;
                $scope.resultInfo = "";
            }, 3000);
    	});       
    };    
    //3.4、初始化新增页面的参数
    $scope.initAddParam = function () {
        $scope.modalEntity = {};             
        if($scope.tradeUserDatas.length>0){
        	$scope.modalEntity.userID = $scope.tradeUserDatas[0].userID;	
        }
        if($scope.traderDatas.length>0){
        	$scope.modalEntity.traderID = $scope.traderDatas[0].traderID;	
        }        
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
     	$scope.myForm.brokerageFirmID.$setPristine();
     	$scope.myForm.userID.$setPristine();
     	$scope.myForm.traderID.$setPristine();
     }     
    
    //4、数据初始化        
    //4.1、进入页面时调用查询方法
    $scope.find($scope.queryEntity);
    //4.2 初始化交易用户所信息
    $scope.tradeUserService.findAll(function (result) {
        $scope.tradeUserDatas = result;
    });
    //4.3 初始化交易员信息
    $scope.traderService.findAll(function (result) {
        $scope.traderDatas = result;
    });    
    
      
});

