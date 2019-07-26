myapp.controller('TradeUserIPCheckController', function ($scope, $timeout,$rootScope) {
	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService;
	$scope.tradeUserIPCheckService = new com.quantdo.orgClear.service.tradeUserIPCheckService;
	$scope.tradeUserService = new com.quantdo.orgClear.service.TradeUserService;
	$scope.fundWorkFlowService = new com.quantdo.orgClear.service.FundWorkFlowService();
	
    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	// 按钮权限
	$scope.tradeUserIPCheck_add = isShow("tradeUserIPCheck_add");
	$scope.tradeUserIPCheck_update = isShow("tradeUserIPCheck_update");
	$scope.tradeUserIPCheck_delete = isShow("tradeUserIPCheck_delete");

	$scope.queryEntity = {};
	$scope.ModalEntity = {};
	$scope.listEntitys = [];
	//$scope.instClient = null;
	$scope.roleListEntitys = [];
	$scope.instClientListEntitys = [];
	$scope.tradeUserListEntitys = [];
	$scope.querytradeUserListEntitys = [];
	$scope.isUpdate = false;
	$scope.ipaddr = null;

	$scope.instClient=null
	getInstClient(function(result){
		$scope.instClient = result;
		if($scope.instClient!=null){
			$scope.isInstClient= true;
			$scope.queryEntity.instClientID = $scope.instClient.instClientID;
			$scope.ModalEntity.instClientID =  $scope.instClient.instClientID;
		}else{
			$scope.isInstClient= false;
		}
		//初始化
		$scope.tradeUserIPCheckService.find(function(result){
			$scope.listEntitys = result;
			$scope.$apply();
		},$scope.queryEntity);
		
	});
	
	$scope.instClientService.findByQuery(function (result) {
        $scope.instClientListEntitys = result;
        $scope.$apply();
    },{});
	
	//获取所有角色
	getAllRole(function (result) {
		$scope.roleListEntitys =result;
		$scope.$apply();
	});
	
	//机构查询
	$scope.instClientService.findByQuery(function (result) {
        $scope.instClientListEntitys = result;
        $scope.$apply();
    },{});
	
	$scope.selectExchange = function(instClientID){
		$scope.tradeUserListEntitys = [];
		$scope.tradeUserService.findAllByFkadmin(function (result) {
			if(instClientID != null){
				$scope.tradeUserListEntitys = result;
				$scope.$apply();
			}
		},instClientID);
	}
	
	$scope.queryselectExchange = function(instClientID){
		$scope.querytradeUserListEntitys = [];
		$scope.tradeUserService.findAllByFkadmin(function (result) {
			if(instClientID != null){
				$scope.querytradeUserListEntitys = result;
				$scope.$apply();
			}
		},instClientID);
	}
	
    //角色名称转换
    $scope.transRole = function (id) {
    	var result = "";
    	for(var i = 0;i < $scope.roleListEntitys.length; i++){
    		if($scope.roleListEntitys[i].id == id){
    			result = $scope.roleListEntitys[i].roleName;
    		}
    	}
    	return result;
    }
    
    //机构名称转换
    $scope.transInstClient = function (instClientID) {
    	for(var i = 0;i < $scope.instClientListEntitys.length; i++){
    		if($scope.instClientListEntitys[i].instClientID == instClientID){
    			return $scope.instClientListEntitys[i].instClientAbbrName;
    		}
    	}
    }
	
//	$scope.find = function(tradeUserIp){
//		$scope.tradeUserIPCheckService.find(function(result){
//			$scope.listEntitys = result;
//			$scope.$apply();
//		},tradeUserIp);
//	};
	
	$scope.initUser = function(){
		$scope.isUpdate = false;
		$scope.ModalEntity = {};
		$scope.tradeUserListEntitys = [];
		if($scope.instClient!=null){
			$scope.isInstClient= true;
			$scope.ModalEntity.instClientID =  $scope.instClient.instClientID;
			$scope.tradeUserService.findAllByFkadmin(function (result) {
				if(result != null){
					$scope.tradeUserListEntitys = result;
					$scope.ModalEntity.userID=$scope.tradeUserListEntitys[0].userID;
					$scope.$apply();
				}
			},$scope.ModalEntity.instClientID);
		}else{
			$scope.isInstClient= false;
		}
		formValidateReset();
	};

	//新增和修改
	$scope.save = function (entity) {
		 var index = entity.recordIndex;
		//修改
		if($scope.isUpdate){
			if($scope.ipaddr != null && $scope.ipaddr == entity.ipAddress){
				$scope.tradeUserIPCheckService.update(function (result) {
					findByCondition($scope.queryEntity);
					$("#tradeUserIPCheckModal").modal("hide");
					$timeout(function() {
				    	  $scope.find({});
				    }, 500);
					$scope.isUpdate = false ;
				}, entity);
			}
			else{
				$scope.tradeUserIPCheckService.check(function(result){
					if(result != null && result.length > 0){
						layer.msg("交易用户IP,Mac地址已存在",{icon : 2});
						return false;
					}
					else{
						$scope.tradeUserIPCheckService.update(function (result) {
							findByCondition($scope.queryEntity);
							$("#tradeUserIPCheckModal").modal("hide");
							$scope.isUpdate = false ;
						}, entity);
					}
				},entity);
			}
		}else {
			if(entity.instClientID == null || entity.userID == null){
				layer.msg("机构与用户不能为空！", {icon : 2,time : 2000});
				return false;
			}
			if(!checkMac(entity.macAddress)){
				layer.msg("不合法的Mac地址："+entity.macAddress, {icon : 2,time : 2000});
				return false;
			}
			/*if(!checkIPMask(entity.ipMask)){
				layer.msg("不合法的IP掩码："+entity.ipMask, {icon : 2,time : 2000});
				return false;
			}*/
			
//			var ips = entity.ipAddress.split(",");
//			var count = 0;
			var tmpentity = angular.copy(entity);
//			for(var ip = 0;ip < ips.length;ip++){
				if(!checkIP(tmpentity.ipAddress)){
					layer.msg("不合法的IP地址：" + tmpentity.ipAddress, {icon : 2,time : 2000});
					return false;
				}else {
//					tmpentity.ipAddress = entity.ipAddress;
					$scope.tradeUserIPCheckService.check(function(result){
						if(result.length > 0){
							layer.msg("机构:"+result[0].instClientID+",交易用户:"+result[0].userID+",IP地址:"+result[0].ipAddress+",Mac地址:"+result[0].macAddress+"已存在",{icon : 2});
							return false;
						} else{
//							count++;
//							if(count == ips.length){
								$scope.tradeUserIPCheckService.add(function (result){
									if(result != null || result != undefined){
										findByCondition($scope.queryEntity);
										$("#tradeUserIPCheckModal").modal("hide");
									    $timeout(function() {
									    	  $scope.find({});
									    }, 500);
										$scope.ModalEntity = {};
									}
								}, tmpentity);
//							}
						}
					},tmpentity);
				}
		
//			}
		}
	}
	
	//删除
	$scope.remove = function (entity,index) {
		layer.confirm('确认删除该记录吗？', {
			icon : 3
		}, function(count) {
			$scope.tradeUserIPCheckService.delitem(entity);
			layer.close(count);
			$timeout(function() {
		    	  $scope.find({});
		    }, 500);
			$scope.listEntitys.splice(index, 1);
			$scope.$apply();
		});
		
	}
	
	//修改
	$scope.updateInit = function(entity,indexRes){
		$scope.ipaddr = entity.ipAddress;
		$scope.ModalEntity = {};
		$scope.temModalEntity = angular.copy(entity);
		$scope.temModalEntity.recordIndex = indexRes;
		$scope.ModalEntity=angular.copy($scope.temModalEntity);
		
		$scope.tradeUserService.findAllByFkadmin(function (result) {
			$scope.tradeUserListEntitys = [];
			$scope.tradeUserListEntitys = result;
			$scope.$apply();
		},entity.instClientID);
		$scope.isUpdate = true;
		formValidateReset();
		$("#tradeUserIPCheckModal").modal("show");
	};
	
	function findByCondition(tradeUserIp){
		$scope.tradeUserIPCheckService.find(function(result){
			$scope.listEntitys = result;
			$scope.$apply();
		},tradeUserIp);
	}
	
    function formValidateReset() {
    	$scope.myFormUserIPCheck.$setPristine();
    }
    
    function checkMac(macAddress){
    	var reg_name=/[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}/;
    	if(reg_name.test(macAddress)){
    		return true;
    	}
    	return false;
    }
    
    function checkIP(ipAddress){
    	var reg_name=/^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/; 
    	if(reg_name.test(ipAddress)){
    		return true;
    	}
    	return false;
    }
    
    function checkIPMask(ipMaskAddress){
    	var reg_name=/^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(255|254|252|248|240|224|192|128|0)$/;
    	if(reg_name.test(ipMaskAddress)){
    		return true;
    	}
    	return false;
    }
    
  //定义产品基础信息的固定列头
    $scope.product_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "所属机构"},
        {title: "用户代码"},
        {title: "用户名称"},
        {title: "角色"},
        {title: "IP地址"},
        {title: "IP地址掩码"},
        {title: "Mac地址"},
        {title: "创建人"},
        {title: "创建时间"},
        {title: "操作"}
    ]; 
    $("body").undelegate("#tradeUserIPCheck_dynamic_table_wrapper td .update-row","click");
    $("body").delegate("#tradeUserIPCheck_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.updateInit($scope.modalEntity,id);
    });
    $("body").undelegate("#tradeUserIPCheck_dynamic_table_wrapper td .delete-row","click");
     $("body").delegate("#tradeUserIPCheck_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.remove($scope.modalEntity,id);
    })
 // 查询(前台分页)
    $scope.find = function(object){
    	//将数据集赋值为空
    	$scope.productDataset = [];
    	//更新表格对应的数据集
    	$scope.tradeUserIPCheckService.find(function (result) {
    		var con = result;
    		$scope.productDataset = [];
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	var operate = "";
            	if($scope.tradeUserIPCheck_update){
//                	operate = operate.concat("<a class='update-row' data-toggle='modal'>[修改]</a>");
            	}if($scope.tradeUserIPCheck_delete){
                	operate = operate.concat("<a class='delete-row' data-toggle='modal'>删除</a>");
            	}
        	
                var tempArr = [(i+1),con[i].id,$scope.transInstClient(con[i].instClientID), con[i].userID,con[i].userName,$scope.transRole(con[i].role),con[i].ipAddress
                               ,con[i].ipMask,con[i].macAddress,con[i].operatorID,con[i].operateDate.concat("").concat(con[i].operateTime),operate];
	            $scope.productDataset.push(tempArr);
            }
            //重新绘表
            $scope.productTable.clear().draw();
            $scope.productTable.rows.add($scope.productDataset).draw();
        }, object);  	
    }

 // 初始化
    $timeout(function() {
    	  $scope.find($scope.queryEntity);
    }, 1000);
 
    
  //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.productTable = $('#tradeUserIPCheck_dynamic_table').DataTable( {
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
