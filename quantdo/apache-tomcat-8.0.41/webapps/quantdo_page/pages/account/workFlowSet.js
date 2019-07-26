myapp.controller('workFlowSetController', function ($scope, $timeout) {
	
	$scope.fundProducts = [];
	$scope.tradeUsers = [];
	$scope.funds = [];
	$scope.queryEntity = {};
    $scope.tempFundProduct = {};
    $scope.tempFundProduct.updateIndex = -1;
    $scope.listEntitys = [];
	$scope.workFlowSetService = new com.quantdo.orgClear.service.WorkFlowService();
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
	
    //初始化页面记录
	$scope.workFlowSetService.findByQuery(function(result){
		$scope.listEntitys = angular.copy(result);
		$scope.$apply();
	},{});
	
    getAllFundProductEntity(function (result) {
        $scope.fundProducts = angular.copy(result);
        $scope.$apply();
    });
    
    $scope.instLists =[];
    $scope.instClientService.findInstClientByQuery(function(result){
    	$scope.instLists = angular.copy(result);
    	$scope.$apply();
    },{});
    
    $scope.instClientID = '';
    queryInstClientID(function (result) {
        $scope.instClientID = result;
        $scope.queryEntity={};
        if($scope.instClientID != undefined ){
        	$scope.isInstClient = true;
        	$scope.queryEntity.instClientID=$scope.instClientID;
        	 $scope.isInstClientSelect($scope.queryEntity.instClientID);
        }else{
        	$scope.isInstClient = false;
        }
        
        $scope.$apply();
    });
    
    //机构名称转换
    $scope.transInstClient = function (instClientID) {
    	for(var i = 0;i < $scope.instLists.length; i++){
    		if($scope.instLists[i].instClientID == instClientID){
    			return $scope.instLists[i].instClientAbbrName;
    		}
    	}
    }
    
    //重置表单验证信息
    function formValidateReset() {
        $scope.workFlowSetForm.fundProductID.$setPristine();
        $scope.workFlowSetForm.investAdviser.$setPristine();
        $scope.workFlowSetForm.investManager.$setPristine();
        $scope.workFlowSetForm.tradeUser.$setPristine();
        $scope.workFlowSetForm.instClientID.$setPristine();
    }

    //初始化模态框页面参数
    $scope.initParameter = function () {
        $scope.ModalEntity = {};
        
        //设置默认选中
        formValidateReset();
        
        queryInstClientID(function (result) {
        	$scope.funds = [];
        	$scope.tradeUsers = [];
            if(result != undefined ){
            	$scope.notAdmin = true;
            	 $scope.ModalEntity.instClientID = result;
            	 $scope.getInfoByInstID(result);
            }else{
            	$scope.notAdmin = false;
            	$scope.ModalEntity.instClientID = "";
            }
            $scope.$apply();
        });
    };

	  $scope.fundProductTems=[];
	    $scope.isInstClientSelect = function (instClientId) {
	    	$scope.fundProductTems=[];
	    	findFundProduct(function (result) {
	        	$scope.fundProductTems=result;
	        	$scope.$apply();
	        },{instClientID:instClientId});
	    };
    
    //根据机构号查询对应机构下的基金列表和交易员列表
    $scope.getInfoByInstID = function(instClientID){
    	$scope.funds = [];
    	$scope.tradeUsers = [];
    	$scope.workFlowSetService.findFundByInstID(function(result){
    		if(result != null && result.length > 0){
    			$scope.funds = result;
    			$scope.ModalEntity.fundProductID = $scope.funds[0].fundProductID;
    		}
    		$scope.workFlowSetService.findTradeUserByInstID(function(result){
    			if(result != null && result.length > 0){
    				$scope.tradeUsers = result;
    				$scope.ModalEntity.investAdviser = $scope.tradeUsers[0].userID;
    		        $scope.ModalEntity.tradeUser = $scope.tradeUsers[0].userID;
    			}
    			$scope.$apply();
    		},instClientID);
    	},instClientID);
    }
    
    //基金产品查询
//    $scope.find = function (object) {
//        $scope.isQuery = true;
//        $scope.listEntitys = [];
//        $scope.workFlowSetService.findByQuery(function (result) {
//            $scope.listEntitys = angular.copy(result);
//            $timeout(function() {
//                $scope.isQuery = false;
//            }, 1000);
//        }, object);
//    };

    //新增
    $scope.save = function (entity) {
        var index = entity.updateIndex;
        //修改
        if (index != undefined) {
        	
            //新增
        } else {
        	$scope.workFlowSetService.findByQuery(function (result) {
                if (result != null && result.length > 0) {
                    layer.msg("记录已存在", {icon: 2});
                    return false;
                } else {
                	$scope.workFlowSetService.add(function (result) {
                		if(result != null){
                			layer.msg("新增成功",{icon: 1});
                			$scope.listEntitys.unshift(result);
                            $scope.$apply();
                            $("#workFlowSetModal").modal("hide");
                		}else{
                			layer.msg("新增失败",{icon: 2});
                		}
                    }, entity);
                }
            }, {fundProductID: entity.fundProductID,
            	investAdviser: entity.investAdviser,
            	instClientID: entity.instClientID});
        }
    }
    
 // 转换产品类型
	$scope.transFundProductType = function(key){
		for(var i = 0;i < $scope.fundProductTypes.length;i++){
			if($scope.fundProductTypes[i].key == key){
				return $scope.fundProductTypes[i].text;
			}
		}
	};
	 //定义产品基础信息的固定列头
    $scope.product_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "所属机构"},
        {title: "产品"},
        {title: "投资助理"},
        {title: "投资经理"},
        {title: "交易员 "}
    ]; 
    
 // 查询(前台分页)
    $scope.find = function(object){
    	//将数据集赋值为空
    	$scope.productDataset = [];
    	//更新表格对应的数据集
    	$scope.workFlowSetService.findByQuery(function (result) {
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
                var tempArr = [(i+1),con[i].id,$scope.transInstClient(con[i].instClientID), con[i].shortProductName,con[i].investAdviser,con[i].investManager
                               ,con[i].tradeUser];
	            $scope.productDataset.push(tempArr);
            }
            //重新绘表
            $scope.productTable.clear().draw();
            $scope.productTable.rows.add($scope.productDataset).draw();
        }, object);  	
    }
    
    $timeout(function() {
    	$scope.find({});
 }, 500);
    
 
    
  //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.productTable = $('#workFlowSet_dynamic_table').DataTable( {
    		data : $scope.productDataset,
        	columns :$scope.product_columns,
//        	scrollY: 300,
//          scrollX: true,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
			   
			]
        } );
    });

});
