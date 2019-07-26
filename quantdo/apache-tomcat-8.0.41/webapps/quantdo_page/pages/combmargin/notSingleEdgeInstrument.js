myapp.controller('NotSingleEdgeInstrumentController', function ($scope, $timeout) {
	//1、实例化服务接口
	//1.1、不参与单边合约服务接口
	$scope.service = new com.quantdo.orgClear.service.NotSingleEdgeInstrumentService();
	//1.2、公用查询服务接口
	$scope.commonQueryservice = new com.quantdo.orgClear.service.CommonQueryService();
	//1.2、产品服务接口
	$scope.productservice = new com.quantdo.orgClear.service.ProductService();	
	
	//2、定义页面数据模型
    $scope.queryEntity = {};
    $scope.tempEntity={};
    $scope.modalEntity = {};

    
    //3、定义方法
    //3.1、查询不参与单边合约
    $scope.find = function (queryEntity) {
        $scope.listEntitys = {};               
        $scope.service.findByCondition(queryEntity,function (result) {
            $scope.listEntitys = result;
        });
    };     
    //3.2、保存不参与单边合约
    $scope.save = function (entity) {    	
        var index = entity.recordIndex;        
        //增加
        if (index == undefined) {
        	$scope.service.add(entity,function (result) {
        		$scope.listEntitys.push(result);  
        		$scope.$apply();        		
        		$scope.resultFlag = true;
                $scope.resultInfo = "不参与大边合约信息保存成功!";
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
                $scope.resultInfo = "不参与大边合约信息保存成功!";
                $timeout(function () {
                    $scope.resultFlag = false;
                    $scope.resultInfo = "";
                }, 3000);
        	});  
            
        }
        //关闭窗口
        $("#myModal").modal("hide");
    };    
    //3.3、删除不参与单边合约
    $scope.remove = function (entity,index) {
        //使用内置Index        
    	$scope.service.remove(entity.id,function (result) {
        	$scope.listEntitys.splice(index, 1);
    		$scope.$apply();    		
    		$scope.resultFlag = true;
            $scope.resultInfo = "不参与大边合约信息记录删除成功!";
            $timeout(function () {
                $scope.resultFlag = false;
                $scope.resultInfo = "";
            }, 3000);
    	});       
    };    
    //3.4、初始化新增页面的参数
    $scope.initAddParam = function () {
        $scope.modalEntity = {};             
        if($scope.exchangeDatas.length>0){
        	$scope.modalEntity.exchID = $scope.exchangeDatas[0].exchID;	
        }
        if($scope.productDatas.length>0){
        	$scope.modalEntity.productID = $scope.productDatas[0].productID;	
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
     	$scope.myForm.exchID.$setPristine();
     	$scope.myForm.productID.$setPristine();
     	$scope.myForm.instrumentID.$setPristine();
     }     
    
    //4、数据初始化        
    //4.1、进入页面时调用查询方法
    $scope.find($scope.queryEntity);
    //4.2 初始化交易所信息
    $scope.commonQueryservice.getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
    });
    //4.3 初始化产品信息
    $scope.productservice.getAllProductEntity(function (result) {
        $scope.productDatas = result;
    });   
    
      
});

