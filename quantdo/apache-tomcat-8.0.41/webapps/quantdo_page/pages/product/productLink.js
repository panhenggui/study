myapp.controller('UserFundProductController', function ($scope, $rootScope,$timeout) {
	//调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
	$scope.tradeUserService = new com.quantdo.orgClear.service.TradeUserService();
	$scope.userManageService = new com.quantdo.orgClear.service.UserManageService();
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService;
	$scope.traderService = new com.quantdo.orgClear.service.TraderService();
	$scope.userFundProductService = new com.quantdo.orgClear.service.UserFundProductService();

	
	$scope.groupArrayMaps = []; //资金账号组
	
	$scope.accountGroupEntitys = {};//资金账户组tab
	$scope.roleListEntitys = [];
	$scope.instClientListEntitys = [];
	$scope.tradeUserEntity = {};
	$scope.listEntitys = {};
	$scope.productLink_add=isShow('productLink_add');
	
	$scope.OkShow=true;
	
	$scope.amTyp = false;
	
    $scope.instClientID = '';
    queryInstClientID(function (result) {
        $scope.instClientID = result;
        if($scope.instClientID != undefined ){
        	$scope.isInstClient = true;
        	$scope.tradeUserEntity.instClientID=$scope.instClientID;
        	  //初始化产品
        	findFundProduct(function (result) {
            	$scope.fundProductTems=result;
             	//初始化 yonhu
            	$scope.tradeUserService.findRiskActiveUserByInstClientID(function(result){
            		//下拉框的值
            		$scope.tradeUsers = result;
            		$scope.$apply();
            	},{instClientID : $scope.instClientID });
            },{ instClientID : $scope.instClientID});
        }else{
        	$scope.isInstClient = false;
        }
        $scope.$apply();
    });
  
	
    //机构级联产品
    $scope.fundProductTems=[];
    $scope.fundProductID="";
    $scope.changInstClient = function (instClientId) {
    	$scope.fundProductTems=[];
    	findFundProduct(function (result) {
        	$scope.fundProductTems=result;
        	//$scope.fundProductID=$scope.fundProductTems[0].fundProductID;
        	//初始化 yonhu
        	$scope.tradeUserService.findRiskActiveUserByInstClientID(function(result){
        		//下拉框的值
        		$scope.tradeUsers =[];
        		if(result.length>0){
        			$scope.tradeUsers = result;
        			$scope.tradeUserEntity.userID=$scope.tradeUsers[0].userID;
        			$scope.changUserCode($scope.tradeUserEntity.userID);
        			$scope.$apply();
        		}
        		$scope.$apply();
        	},{instClientID : instClientId });
        },{instClientID:instClientId});
    };

	//获取所有角色
	getAllRole(function (result) {
		$scope.temRoleListEntitys = result;
		$scope.$apply();
	},{});
	
	//改变用户类型
    $scope.changUserCode = function (userid) {
    	$scope.OkShow=false;
    	$scope.temTradeUser=[];
    	$scope.roleListEntitys=[];
    	angular.forEach($scope.tradeUsers, function (value, index, arrays) {
    		if(value.userID==userid){
    			$scope.temTradeUser.push(value);
    		}
		});
    	var roleID =$scope.temTradeUser[0].role;
    	angular.forEach($scope.temRoleListEntitys, function (value, index, arrays) {
    		if(value.id==roleID){
    			$scope.roleListEntitys.push(value);
    			$scope.tradeUserEntity.id = $scope.roleListEntitys[0].id;
    		}
		});
    	editTab(userid);
    }
	
	
	$scope.userManageService.getUserByUserID(function(result){
		$scope.tradeUserEntity = result;
		$scope.$apply();
	});
    $scope.amType = '';
    queryAmType(function (result) {
        $scope.amType = result;
         if($scope.amType==2 ){
        	 $scope.amTyp =true
         }
    });


	$scope.instClientService.findInstClientByQuery(function(results){
        $scope.instClientListEntitys= angular.copy(results);
        $scope.$apply();
	},{});
	
	//账户管理设置
	 function editTab(userId){
        $scope.arrayGroupMapsTem=[];
        $scope.subGroupEntitysTem=[];
		$scope.groupArrayMaps = []; //资金账号组
		$scope.tradeUserEntity.userID = userId;
		
		//资金账户组tab
		$scope.userFundProductService.findAllUserFundProduct(function (result) {
			$scope.accountGroupEntitys = [];
			angular.forEach(result, function (value, index, arrays) {
				if(value.isChecked == "0"){
					$scope.groupArrayMaps.push(value);
				}else{
					$scope.accountGroupEntitys.push(value);
				}
			});
			
			$scope.$apply();
		},$scope.tradeUserEntity);

	}

	//资金账号组添加选中
	$scope.addGroup = function(flag,listEntity){
		deleteSelect ();
		//资金账号组集合
		var groupEntitys = $scope.accountGroupEntitys;
		var tmpGroupEntitys =angular.copy(groupEntitys);
		$scope.groupArrayMaps.push(listEntity);
		//资金账号组集合
		angular.forEach(groupEntitys, function (value, index, arrays) {
			//判断资金账号组里是否存在资产单元
			if(value.fundProductID == listEntity.fundProductID){
				groupEntitys[index].isChecked = "0"; //设置选中状态
				tmpGroupEntitys.splice(index, 1);
			}
		});
		$scope.accountGroupEntitys = tmpGroupEntitys;
	}
	//资金账号组全添加
	$scope.addAllGroupEntity = function(listEntitys){
    	//删除选择
    	deleteSelect ();
        angular.forEach(listEntitys, function (groupEntity, index, x) {
            $scope.groupArrayMaps.push(groupEntity);
        });
        $scope.accountGroupEntitys = [];
        //$scope.$apply();
	}

	//资金账号组删除选中
    $scope.devedGroup = function(flag,listEntity){
    	deleteSelect ();
        //资金账号组集合
        var groupEntitys = $scope.groupArrayMaps;
        var index = $scope.groupArrayMaps.indexOf(listEntity);
        $scope.groupArrayMaps.splice(index, 1);
        $scope.accountGroupEntitys.push(listEntity);
       
       // $scope.$apply();
    }
    //资金账号组全删除
    $scope.deleteAllGroupEntity= function(listEntitys){
    	//删除选择
    	deleteSelect ();
        angular.forEach(listEntitys, function (groupEntity, index, x) {
            $scope.accountGroupEntitys.push(groupEntity);
        });
        $scope.groupArrayMaps=[];
    }
	
//添加单选按钮的事件集合
	
	//添加组选择
	$scope.arrayGroupMapsTem=[];	
	$scope.addGroupSelect = function(index,alistEntity){
		if(	alistEntity.isSelectActive==false || alistEntity.isSelectActive == undefined){
			$scope.arrayGroupMapsTem.push(alistEntity);
			alistEntity.isSelectActive=true;
		}else{
			var i = $scope.arrayGroupMapsTem.indexOf(alistEntity);
			$scope.arrayGroupMapsTem.splice(i, 1);	
			alistEntity.isSelectActive=false;
		}
		
	}
	
	//删除组选择
    $scope.subGroupEntitysTem=[];	
	$scope.devedGroupSelect = function(index,listEntity){
		if(listEntity.isSelectActive==false || listEntity.isSelectActive == undefined){
			$scope.subGroupEntitysTem.push(listEntity);
			listEntity.isSelectActive=true;
		}else{
			var i = $scope.subGroupEntitysTem.indexOf(listEntity);
			$scope.subGroupEntitysTem.splice(i, 1);	
			listEntity.isSelectActive=false;
		}
		
	}
	//添加组选择 移动  单个 > 按钮事件
	$scope.addSelectGroupEntity = function(){
        angular.forEach($scope.arrayGroupMapsTem, function (groupEntity, ii, xx) {
        	var index = $scope.accountGroupEntitys.indexOf(groupEntity);
        	$scope.accountGroupEntitys[index].isSelectActive=false;
			$scope.accountGroupEntitys.splice(index, 1);
            $scope.groupArrayMaps.push(groupEntity);
        });
        $scope.arrayGroupMapsTem=[];    
    }
	
	//删除组选择 移动  单个 < 按钮事件
	$scope.deleteSelectGroupEntity = function(){
        angular.forEach($scope.subGroupEntitysTem, function (groupEntity, ii, xx) {
        	var index = $scope.groupArrayMaps.indexOf(groupEntity);
        	$scope.groupArrayMaps[index].isSelectActive=false;
			$scope.groupArrayMaps.splice(index, 1);
            $scope.accountGroupEntitys.push(groupEntity);

        });
        $scope.subGroupEntitysTem=[]; 
    }
	function deleteSelect (){
		//zu
		
		  angular.forEach($scope.arrayGroupMapsTem, function (v, i, x) {
			   if(!$scope.accountGroupEntitys.length == 0){
	        	   var index = $scope.accountGroupEntitys.indexOf(v);
	        	   if(0<=index){
	        		   $scope.accountGroupEntitys[index].isSelectActive=false;
	        	   }
	        	 
		       }
	        });
		  $scope.arrayGroupMapsTem=[];
		  
		 angular.forEach($scope.subGroupEntitysTem, function (v, i, x) {
			    if(!$scope.groupArrayMaps.length == 0){
	        	    var index = $scope.groupArrayMaps.indexOf(v);
	        	    if(0<=index){
	        	    	 $scope.groupArrayMaps[index].isSelectActive=false;
	        	    }
	        	   
			    }
	        });
		 $scope.subGroupEntitysTem=[];
	}
	
	$scope.saveSetting = function (entity) {
		$scope.OkShow=true;
		$scope.userFundProductService.add(function (result) {
			if(result == 1){
				layer.msg("设置成功",{icon:1});
				$scope.OkShow = false;
			}else {
				layer.msg("设置失败！",{icon:1});
				$scope.OkShow = false;
			}
			$scope.$apply();
		},entity,$scope.groupArrayMaps);
	}
	
});
