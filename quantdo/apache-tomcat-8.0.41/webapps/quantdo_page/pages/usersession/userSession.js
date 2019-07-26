myapp.controller('UserSessionController', function ($scope, $timeout) {
	// 初始化日期控件
	$("[forType='date']").datepicker({
		language : 'zh-CN',
		weekStart : 1,
		autoclose : true,
		clearBtn : true,
		todayHighlight : true,
		format : 'yyyymmdd',
		date :new Date()
	});
	
	// 按钮权限
	$scope.userSession_query = isShow("userSession_query");
	//1、实例化账户资金服务接口
	$scope.userSessionService = new com.quantdo.orgClear.service.UserSessionService();
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService;
	$scope.tradeUserService = new com.quantdo.orgClear.service.TradeUserService;
	
	$scope.queryEntity = {};
	$scope.ModalEntity = {};
	$scope.listEntitys = [];
	//$scope.instClient = null;
	$scope.instClientListEntitys = [];
	$scope.tradeUserListEntitys = [];
	$scope.roleListEntitys = [];
	$scope.ntmpResult = [];
	$scope.roleResult = [];
	$scope.userTypeListEntitys = [];
	$scope.isUpdate = false;
    $scope.queryEntity.startTime = clearConstant.formatDate(new Date());
    $scope.queryEntity.endTime = clearConstant.formatDate(new Date());

	$scope.isEven = false;
	$scope.isOdd = true;
	//获取所有角色
	getAllRole(function (result) {
	    $scope.ntmpResult =angular.copy(result);
	    $scope.roleResult =angular.copy(result);
	    $scope.ntmpResult = result;
	    
	    var con = clearConstant.userType;
	    for(var i=0;i<con.length;i++){
	    	if(i>0){
	    		$scope.userTypeListEntitys.push(con[i]);
	    	}
	    }
	    
/*		//去掉机构管理员
		var tem =[];
		for(var i = 0;i < result.length; i++){
			//超级管理员 需要机构管理员
			if(result[i].roleName == "机构管理员"){
				tem.push(i);
			} else if(result[i].roleName == "超级管理员"){
				tem.push(i);
			} else if (result[i].roleName == "运维岗" && $scope.instClient!=null){
				tem.push(i);
			} else if (result[i].roleName == "结算岗" && $scope.instClient!=null){
				tem.push(i);
			} else if (result[i].roleName == "超级风控员" && $scope.instClient!=null){
					tem.push(i);
			} else if (result[i].roleName == "开户岗" && $scope.instClient!=null){
				tem.push(i);
			} else if(result[i].roleName.indexOf("子母基金") >= 0){
				tem.push(i);
			} 
		}
		for (var j=1;tem.length>=j;j++) {
			$scope.ntmpResult.splice(tem[tem.length-j], 1);
		}*/
		$scope.roleListEntitys = $scope.getAllRoles();
		$scope.$apply();
	});
	
	$scope.changRoleName = function(){
		 var userType = $scope.queryEntity.userType;
		 $scope.listRoles = [];
		 $scope.ntmpResultforType = [];
	 	 
	    	if(userType=="2"){
	    		//风控员
	    		var instClientID = $scope.ModalEntity.instClientID;
	    		var amtType =$scope.transAmtType(instClientID);
	    		for(var i = 0;i < $scope.ntmpResult.length; i++){
	    			
	    			if($scope.ntmpResult[i].id == "5" && (amtType=="2"||amtType=="")){
	    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
	    			}if($scope.ntmpResult[i].id == "12" && (amtType=="2"||amtType=="")){
	    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
	    			}if($scope.ntmpResult[i].id == "15"&& (amtType=="1"||amtType=="")){
	    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
	    			}if($scope.ntmpResult[i].id == "16"&& (amtType=="1"||amtType=="")){
	    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
	    			}
	    		}
	    		
	    	//交易	
	    	} else if (userType=="1"){
	    		for(var i = 0;i < $scope.ntmpResult.length; i++){
	    			//投资顾问
	    			if($scope.ntmpResult[i].id == "6"){
	    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
	    			}else if($scope.ntmpResult[i].id == "7"){
	    				//投资助理
	    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
	    			} else if($scope.ntmpResult[i].id == "8"){
	    				//投资经理
	    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
	    			} else if($scope.ntmpResult[i].id == "9"){
	    				//交易员
	   				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
	    			} else if($scope.ntmpResult[i].id == "13"){
	    				//投资交易员
	   				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
	   			    }
	    		}
	    	}else if(userType==null){//加载风控及交易员的全部角色   		
	    		$scope.ntmpResultforType = $scope.getAllRoles();
		    }
	    	$scope.roleListEntitys =$scope.ntmpResultforType;
	 }
	
	//获取交易员及风控对应的全部角色
	$scope.getAllRoles = function(){
		var  tmpNtmpResult = [];
		var instClientID = $scope.ModalEntity.instClientID;
		var amtType =$scope.transAmtType(instClientID);
		for(var i = 0;i < $scope.ntmpResult.length; i++){	
			//风控员
			if($scope.ntmpResult[i].id == "5" && (amtType=="2"||amtType=="")){
				tmpNtmpResult.push($scope.ntmpResult[i]);
			}
			if($scope.ntmpResult[i].id == "12" && (amtType=="2"||amtType=="")){
				tmpNtmpResult.push($scope.ntmpResult[i]);
			}
			if($scope.ntmpResult[i].id == "15"&& (amtType=="1"||amtType=="")){
				tmpNtmpResult.push($scope.ntmpResult[i]);
			}
			if($scope.ntmpResult[i].id == "16"&& (amtType=="1"||amtType=="")){
				tmpNtmpResult.push($scope.ntmpResult[i]);
			}
			
			//交易员
			if($scope.ntmpResult[i].id == "6"){
				//投资顾问
				tmpNtmpResult.push($scope.ntmpResult[i]);
			}else if($scope.ntmpResult[i].id == "7"){
				//投资助理
				tmpNtmpResult.push($scope.ntmpResult[i]);
			} else if($scope.ntmpResult[i].id == "8"){
				//投资经理
				tmpNtmpResult.push($scope.ntmpResult[i]);
			} else if($scope.ntmpResult[i].id == "9"){
				//交易员
				tmpNtmpResult.push($scope.ntmpResult[i]);
			} else if($scope.ntmpResult[i].id == "13"){
				//投资交易员
				tmpNtmpResult.push($scope.ntmpResult[i]);
		    }
		}
		return  tmpNtmpResult;	
	}
	
    //机构名称转换
    $scope.transAmtType = function (instClientID) {
    	if(instClientID!=null&&instClientID!=undefined&&instClientID!=''){
    		for(var i = 0;i < $scope.instClientListEntitys.length; i++){
        		if($scope.instClientListEntitys[i].instClientID == instClientID){
        			return $scope.instClientListEntitys[i].amType;
        		}
        	}
    	}{
    		return "";
    	}
    }
    
	/*//机构查询
	$scope.instClientService.findByQuery(function (result) {
        $scope.instClientListEntitys = result;
        $scope.$apply();
    },{});*/
	
    //机构名称转换
    $scope.transInstClient = function (instClientID) {
    	for(var i = 0;i < $scope.instClientListEntitys.length; i++){
    		if($scope.instClientListEntitys[i].instClientID == instClientID){
    			return $scope.instClientListEntitys[i].instClientAbbrName;
    		}
    	}
    }
	
    //角色名称转换
    $scope.transRole = function (id) {
    	for(var i = 0;i < $scope.roleResult.length; i++){
    		if($scope.roleResult[i].id == id){
    			return $scope.roleResult[i].roleName;
    		}
    	}
    }
    
    getInstClientQueryConditionList(function(result){
    	$scope.instClientListEntitys = angular.copy(result);
    	if($scope.instClientListEntitys.length > 1){
    		$scope.queryEntity.brokerageFirmID = "";
    	}else{
    		$scope.queryEntity.brokerageFirmID = $scope.instClientListEntitys[0].instClientID;
    	}
    	$scope.$apply();
    });
    
    queryInstClientID(function(result){
    	if(result != undefined){
    		$scope.noInst = true;
    	}else{
    		$scope.noInst = false;
    	}
    });
    
    //用户类型转换
    $scope.transUserType = function (key) {
    	for(var i = 0;i < $scope.userTypeListEntitys.length; i++){
    		if($scope.userTypeListEntitys[i].key == key){
    			return $scope.userTypeListEntitys[i].text;
    		}
    	}
    }
    
	$scope.selectExchange = function(instClientID){
		$scope.tradeUserListEntitys = [];
		$scope.tradeUserService.findAllByFkadmin(function (result) {
			if(instClientID != null){
				$scope.tradeUserListEntitys = result;
				$scope.$apply();
			}
		},instClientID);
	}
	
	//改变用户类型
    $scope.changUserType = function (userType) {
    	$scope.ModalEntity.role="";
    	$scope.ntmpResultforType=[];
  		//去掉机构管理员
    	//管理
    	if(userType=="0"){
    		for(var i = 0;i < $scope.ntmpResult.length; i++){
    			//机构管理员
    			if($scope.ntmpResult[i].id == "2"){
    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			}else if($scope.ntmpResult[i].id == "3"){
    				//运维岗
    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			} else if($scope.ntmpResult[i].id == "4"){
    				//结算
    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			} else if($scope.ntmpResult[i].id == "11"){
    				//超级风控员
    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			} else if($scope.ntmpResult[i].id == "10"){
    				//超级风控员
    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			}
    		}
    	//风控	
    	} else if(userType=="2"){
    		for(var i = 0;i < $scope.ntmpResult.length; i++){
    			//风控员
    			if($scope.ntmpResult[i].id == "5"){
    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			}if($scope.ntmpResult[i].id == "12"){
    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			}
    		}
    		
    	//交易	
    	} else if (userType=="1"){
    		for(var i = 0;i < $scope.ntmpResult.length; i++){
    			//投资顾问
    			if($scope.ntmpResult[i].id == "6"){
    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			}else if($scope.ntmpResult[i].id == "7"){
    				//投资助理
    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			} else if($scope.ntmpResult[i].id == "8"){
    				//投资经理
    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			} else if($scope.ntmpResult[i].id == "9"){
    				//交易员
   				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			} else if($scope.ntmpResult[i].id == "13"){
    				//投资交易员
   				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
   			    }
    		}
    	}
    	$scope.roleListEntitys =$scope.ntmpResultforType;
    	$scope.$apply();
    };
    
	$scope.find = function(userSession){
		if(userSession.startTime>userSession.endTime){
			layer.msg("开始日期大于结束日期，请重新确认！", {icon: 2});
		}else{
			findByCondition(userSession);
		}
	};
	
	function findByCondition(userSession){
		$scope.userSessionService.find(function(result){
			$scope.listEntitys = result;
			var count = 0;
			angular.forEach($scope.listEntitys,function(data,index,array){
				if(data.spanNum !== undefined){
					count += 1;
				}
				if(count %2 == 0){
					data.isOdd = true;
					data.isEven = false;
				}
				else{
					data.isOdd = false;
					data.isEven = true;
				}
				$scope.$apply();
			});

		},userSession);
	}
	
});

