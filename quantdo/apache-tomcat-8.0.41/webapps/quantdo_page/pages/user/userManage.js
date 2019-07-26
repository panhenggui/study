myapp.controller('UserManageController', function ($scope,$rootScope, $timeout) {
	//调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService;
	$scope.userManageService = new com.quantdo.orgClear.service.UserManageService;
	$scope.fundWorkFlowService = new com.quantdo.orgClear.service.FundWorkFlowService();
	
	
	$scope.ModalEntity = {};
	$scope.pwdEntity = {};
	$scope.listEntitys = [];
	$scope.userEntitys = [];
	$scope.menu = [];
	$scope.ntmpResultforType=[];
	$scope.instClient = null;
	$scope.isActive=['注销','正常','冻结'];
	$scope.instClientListEntitys = [];
	$scope.roleListEntitys = [];
	$scope.listRoles = [];
	$scope.ntmpResult=[];
	$scope.userTypeListEntitys = clearConstant.userType;
	$scope.isUpdate = false;
	$scope.isQuery = false;
	$scope.isChecks = clearConstant.isCheck;//是否检查
	$scope.userManageDataset = [];
	$scope.userId = null;
	$scope.queryEntity = {};
	$scope.isInstClient = true;
	
	$scope.checkPwd ="";
    
	checkPassword(function(result){
		$scope.checkPwd = result;
		$scope.$apply();
	});
	
    $scope.instClientID = '';
    queryInstClientID(function (result) {
        $scope.instClientID = result;
        $scope.queryEntity={};
        if($scope.instClientID != undefined ){
        	$scope.isInstClient = true;
        	 $scope.queryEntity.instClientID=$scope.instClientID;
        }else{
        	$scope.isInstClient = false;
        }
        $scope.$apply();
    });
	
	// 按钮权限
	$scope.userManage_query = isShow("userManage_query");
	$scope.userManage_add = isShow("userManage_add");
	$scope.userManage_set = isShow("userManage_set");
	$scope.userManage_update = isShow("userManage_update");
	$scope.userManage_cancel = isShow("userManage_cancel");
	$scope.userManage_pwdReset = isShow("userManage_pwdReset");
	
	//定义用户设置表的固定列头
    $scope.userManage_columns = [
        {title: "序号"},
        {title: "id",visible:false},
		{title: "所属机构"},
		{title: "用户代码"},
		{title: "用户名称"},
		{title: "用户类型"},
		{title: "角色"},
		{title: "状态"},
		{title: "创建人"},
		{title: "创建时间"},
		
		{title: "手机号码"},
		{title: "电子邮箱"},
		{title: "操作"}
	]
	
	var id = document.getElementById('passStrength');
    var div = document.createElement('div');
    var strong = document.createElement('strong');
    $scope.oStrength = id.appendChild(div);
    $scope.oStrengthTxt = id.parentNode.appendChild(strong);
    
    var idag = document.getElementById('passStrengthag');
    var divag = document.createElement('div');
    var strongag = document.createElement('strong');
    $scope.oStrengthag = idag.appendChild(divag);
    $scope.oStrengthTxtag = idag.parentNode.appendChild(strongag);
    
    
    var idtwo = document.getElementById('passStrengthtwo');
    var divtwo = document.createElement('div');
    var strongtwo = document.createElement('strong');
    $scope.oStrengthtwo = idtwo.appendChild(divtwo);
    $scope.oStrengthTxttwo = idtwo.parentNode.appendChild(strongtwo);
    
    var idtwoag = document.getElementById('passStrengthtwoag');
    var divtwoag = document.createElement('div');
    var strongtwoag = document.createElement('strong');
    $scope.oStrengthtwoag = idtwoag.appendChild(divtwoag);
    $scope.oStrengthTxttwoag = idtwoag.parentNode.appendChild(strongtwoag);

	//初始化
	getUser(function(result){
		$scope.listEntitys = result;
		$scope.$apply();
	});
	
	getInstClient(function(result){
		$scope.instClient = result;
		if($scope.instClient!=null){
			$scope.isInstClient= true;
		}else{
			$scope.isInstClient= false;
		}
	});
	
	 $scope.isAllowControl = true;
	    // 获取账户设置系统设置
	    getSystemConfig("userManage", function (result) {
	    	
	    	if (result != undefined ){
	    		
	    		$scope.isAllowControl = false;
	    	}else{
	    		
	    		$scope.isAllowControl = true;
	    	}
	    	
	    	$scope.$apply();
	    })
	    
	
	//获取所有角色
	getAllRole(function (result) {
	    $scope.ntmpResult =angular.copy(result);
		//去掉机构管理员
		var tem =[];
		for(var i = 0;i < result.length; i++){
			//超级管理员 需要机构管理员
			/*if(result[i].roleName == "FOF机构管理员" || result[i].roleName == "MOM机构管理员"){
				tem.push(i);
			}else */
			if(result[i].roleName == "操作员" && $scope.instClient!=null){
					tem.push(i);
			} else if (result[i].roleName == "运维岗" && $scope.instClient!=null){		
				tem.push(i);
			} else if (result[i].roleName == "结算岗" && $scope.instClient!=null){
				tem.push(i);
			}else if (result[i].roleName == "超级风控员" && $scope.instClient!=null){
					tem.push(i);
			} else if (result[i].roleName == "开户岗" && $scope.instClient!=null){
				tem.push(i);
			} else if (result[i].roleName == "参数维护岗" && $scope.instClient!=null){
				tem.push(i);
			} else if (result[i].roleName == "监控岗" && $scope.instClient!=null){
				tem.push(i);
			}
		}
		for (var j=1;tem.length>=j;j++) {
			$scope.ntmpResult.splice(tem[tem.length-j], 1);
		}
		$scope.roleListEntitys =$scope.ntmpResult;
		$scope.listRoles = $scope.ntmpResult;
		$scope.$apply();
	});
	
	$scope.findByQuery = function(){
		$scope.instClientService.findByQuery(function (result) {
			$scope.instClientListEntitys = result;
	        $scope.$apply();
	    },{});
	}
	$scope.findByQuery();

	
    //用户类型转换
    $scope.transUserType = function (key) {
    	for(var i = 0;i < $scope.userTypeListEntitys.length; i++){
    		if($scope.userTypeListEntitys[i].key == key){
    			return $scope.userTypeListEntitys[i].text;
    		}
    	}
    }
    
    //角色名称转换
    $scope.transRole = function (id) {
    	var roleName = '';
    	for(var i = 0;i < $scope.ntmpResult.length; i++){
    		if($scope.ntmpResult[i].id == id){
    			var roleName = $scope.ntmpResult[i].roleName;
    			return roleName;
    		}
    	}
    	return roleName;
    }
    
    //机构名称转换
    $scope.transInstClient = function (instClientID) {
    	if(instClientID!=null&&instClientID!=undefined&&instClientID!=''){
    		for(var i = 0;i < $scope.instClientListEntitys.length; i++){
        		if($scope.instClientListEntitys[i].instClientID == instClientID){
        			return $scope.instClientListEntitys[i].instClientAbbrName;
        		}
        	}
    	}{
    		return "";
    	}
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
    $("body").undelegate("#userManage_dynamic_table_wrapper td .my-set-row","click");
    //表格设置用户权限事件
    $("body").delegate("#userManage_dynamic_table_wrapper td .my-set-row","click",function(){  	
        var mytr = $(this).parents("tr");
        var tempArr = $scope.userManageTable.row(mytr).data();
        var loginId = tempArr[3];
        getUserByLoginId(function (result) {
        	if(result != undefined && result != null){
        		//显示窗口
				$("#userSetting_setModal").modal("show");
        		$scope.drawTree(result.id);
        	}
        	else{
        		layer.msg("SSO没有该用户！", {
					icon : 2,
					time : 2000
				});
        	}
        		
       }, loginId);
    });
    $("body").undelegate("#userManage_dynamic_table_wrapper  td  .userManage-update-row","click");
    $("body").delegate("#userManage_dynamic_table_wrapper  td  .userManage-update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.userManageTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.userEntitys.length;i++){
        	if(id==$scope.userEntitys[i].id){
        		$scope.modalEntity = $scope.userEntitys[i];
        	}
        }
        $scope.updateInit($scope.modalEntity,id);
    });
    $("body").undelegate("#userManage_dynamic_table_wrapper  td  .userManage-delete-row","click");
    $("body").delegate("#userManage_dynamic_table_wrapper  td  .userManage-delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.userManageTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.userEntitys.length;i++){
        	if(id==$scope.userEntitys[i].id){
        		$scope.modalEntity = $scope.userEntitys[i];
        	}
        }
        $scope.remove($scope.modalEntity,id);
    });
    $("body").undelegate("#userManage_dynamic_table_wrapper  td  .capitalAccount-update-row2","click");
     $("body").delegate("#userManage_dynamic_table_wrapper  td  .capitalAccount-update-row2","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.userManageTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.userEntitys.length;i++){
        	if(id==$scope.userEntitys[i].id){
        		$scope.modalEntity = $scope.userEntitys[i];
        	}
        }
        $scope.pwdReset($scope.modalEntity);
    });
    
	$scope.find = function(tradeUser){
		$scope.isQuery = true;
		$scope.userManageDataset = [];
		$scope.userEntitys = [];
		$scope.findByQuery();
		$scope.userManageService.find(function(result){			
			$scope.userEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator = $scope.transOper((con[i].isActive==1 || con[i].isActive==2) && (con[i].role != "6" && con[i].role != "8" && con[i].role != "13"));
				var operator1 = $scope.transOper1((con[i].isActive==1 || con[i].isActive==2) && (!$scope.isInstClient  || ($scope.isInstClient && $scope.isAllowControl ) ) );
				var operator2 = $scope.transOper2(con[i].isActive==1 || con[i].isActive==2 );
				var operator3 = $scope.transOper3(con[i].isActive==1 || con[i].isActive==2 );
			    var roleName = $scope.transRole(con[i].role);
		    	var tempArr = [(i+1),con[i].id,$scope.transInstClient(con[i].instClientID),con[i].userID,con[i].userName,$scope.transUserType(con[i].userType),roleName
		    					 ,$scope.isActive[con[i].isActive],con[i].creator,con[i].createDate,con[i].telephone,con[i].email,operator+operator1+operator2+operator3]
		    	$scope.userManageDataset.push(tempArr);
		    	con[i].index = i+1;
	        }
			//重新绘表
			$scope.userEntitys = con;
	        $scope.userManageTable.clear().draw();
	        $scope.userManageTable.rows.add($scope.userManageDataset).draw();
			$scope.$apply();
			$timeout(function(){
				$scope.isQuery = false;
			},500);
		},tradeUser);
	};	
	$scope.transOper = function(flag){
		var result = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
		if(flag && $scope.userManage_set){
			result = "<a class='row-operation-distance right-row my-set-row' data-toggle='modal'>设置</a>";
		}else{
            result = "<a class='row-operation-distance right-row my-set-row' data-toggle='modal' style='visibility:hidden;'>设置</a>";
		}
		return result;
	}
	$scope.transOper1 = function(flag){
		var result = '';

		if(flag && $scope.userManage_update){
			result = "<a class='row-operation-distance reset-operation userManage-update-row' >修改</a>";
		}else{
            result = "<a class='row-operation-distance reset-operation userManage-update-row' style='visibility:hidden;'>修改</a>";
		}
		return result;
	}
	$scope.transOper2 = function(flag){
		var result = '';
		if(flag && $scope.userManage_cancel){
			result = "<a class='row-operation-distance fobid-operation userManage-delete-row' data-toggle='modal'>注销</a>";
		}else{
            result = "<a class='row-operation-distance fobid-operation userManage-delete-row' data-toggle='modal' style='visibility:hidden;'>注销</a>";
		}
		return result;
	}
	$scope.transOper3 = function(flag){
		var result = '';
		if(flag && $scope.userManage_pwdReset){
			result = "<a class='reset-row capitalAccount-update-row2' data-toggle='modal'>密码重置</a>";
		}else{
            result = "<a class='reset-row capitalAccount-update-row2' data-toggle='modal' style='visibility:hidden;'>密码重置</a>";
		}
		return result;
	}
	$timeout(function() {
		$scope.find($scope.queryEntity);//对应方法
     }, 1200);
	
	
    function formValidateReset() {
    	$scope.myFormUserManage.$setPristine();
    }
	
	
	$scope.initUser = function(){
		$scope.isUpdate = false;
		$scope.ModalEntity = {};
		$scope.oStrength.className = 'strengthLv0';
        $scope.oStrengthTxt.innerHTML ='';
    	$scope.oStrengthag.className = 'strengthLv0';
        $scope.oStrengthTxtag.innerHTML ='';
        validCodeLoad();
	    document.getElementById("addUserValidcode").value="";
	    
		$scope.ModalEntity.checkIPMacAddr = $scope.isChecks[0].key;
		$scope.ModalEntity.checkProductInfo = $scope.isChecks[0].key;
		$scope.ModalEntity.loginErrorLimit = 0;
		$scope.ModalEntity.maxOnline=0;
		if($scope.instClient!=null){
			$scope.ModalEntity.instClientID = $scope.instClient.instClientID;
			$scope.isInstClient= true;
		}else{
			$scope.isInstClient= false;
		}
		formValidateReset();
		$timeout(function() {
			document.getElementById("userID").focus();
		},800);
	};

	$scope.submitted = false;
	$scope.signupForm = function(ModalEntity) {
		if ($scope.myFormUserManage.userID.$valid && $scope.myFormUserManage.userName.$valid && $scope.myFormUserManage.userType.$valid && $scope.myFormUserManage.role.$valid) {
			$scope.save(ModalEntity);
			$scope.myFormUserManage.submitted = false;
		} else {
			$scope.myFormUserManage.submitted = true;
		}
	};

	//新增和修改
	$scope.save = function (entity) {
		if(entity.email != undefined || entity.email != null ){
			if(entity.email.length>0){
				 var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				 if (filter.test(entity.email)){
					 
				 }  else {
				 layer.msg("您的电子邮件格式不正确！", {
						icon : 2,
						time : 2000
					});
				 
					return false;
				 }
			}
		}
		if(entity.telephone != undefined || entity.telephone != null){
			if(entity.telephone.length>0){
				 var filter  =/^(1)\d{10}$/;
				 if (filter.test(entity.telephone)){
					 
				 }  else {
				 layer.msg("您的手机号码格式不正确！", {
						icon : 2,
						time : 2000
					});
					return false;
				 }
			}
		}
		
		if(entity.userType!=0 && entity.instClientID ==undefined ) {
			if(entity.userType==2 && entity.role !=11){
				layer.msg("机构代码在风控员的时候为必输项！", {
					icon : 2,
					time : 5000
				});
				return false;
			}else if(entity.userType==1){
				layer.msg("机构代码在交易用户类型的时候为必输项！", {
					icon : 2,
					time : 5000
				});
				return false;
			}
			
		}
		
		if(entity.maxOnline < 0){
			 layer.msg("最大在线数必须为非0自然数！", {
					icon : 2,
					time : 2000
				});
				return false;
		}
		
		if(entity.userID == '00000000'){
			layer.msg("00000000为系统保留账号，无法使用", {
				icon : 2,
				time : 2000
			});
			return false;
		}
		var tableIndex = entity.index;
		var index = entity.recordIndex;
		//修改
		if($scope.isUpdate){
			$scope.userManageService.update(function (result) {
				// 关闭窗口
				result.index = tableIndex;
				//$scope.find($scope.queryEntity);
				$scope.listEntitys.splice(index, 1, result);
				$scope.userEntitys.splice(tableIndex-1, 1, result);
				$scope.userManageTable.cells().every( function () {
                    if((tableIndex-1) == this[0][0].row){
                        if(this[0][0].column == 4){
                            this.data(entity.userName);
                            $scope.$apply();
                        }
                        if(this[0][0].column == 6){
                            this.data($scope.transRole(entity.role));
                            $scope.$apply();
                        }
                        
                        if(this[0][0].column == 10){
                            this.data(entity.telephone);
                            $scope.$apply();
                        }
                        if(this[0][0].column == 11){
                            this.data(entity.email);
                            $scope.$apply();
                        }
                    }

				} );
				$scope.isUpdate = false ;
				$("#userModal").modal("hide");
			}, entity);
		}else {
			//密码验证
			var pwd1 = entity.password;
			var pwd2 = entity.rePassword;
			if(pwd1 != pwd2){
				layer.msg("两次密码输入不一致，请重新输入", {
					icon : 2,
					time : 2000
				});
				validCodeLoad();
				document.getElementById("addUserValidcode").value="";
				return false;
			}
			
			if(pwd1==undefined || pwd2==undefined){
				layer.msg("密码不能为空，请重新输入", {
					icon : 2,
					time : 2000
				});
				validCodeLoad();
				document.getElementById("addUserValidcode").value="";
				return false;
			}
			var userID= entity.userID;
		    if(pwd1.trim() == userID.trim()){
				layer.msg("密码不能跟用户代码相同，请重新输入", {
					icon : 2,
					time : 2000
				});
				validCodeLoad();
				document.getElementById("addUserValidcode").value="";
				return false;
			}

			if(pwd1.trim().length==0 || pwd2.trim().length==0){
				layer.msg("密码不能为空，请重新输入", {
					icon : 2,
					time : 2000
				});
				validCodeLoad();
				document.getElementById("addUserValidcode").value="";
				return false;
			}
			var lv = matchLatt(pwd1);
	    	if(lv == 1) {
	    		var validcode = document.getElementById("addUserValidcode").value;
		        layer.confirm('密码强度较弱，是否保存该密码？', {icon: 3}, function (count) {
		    	   	layer.close(count);
		        	$scope.userManageService.add(function (result) {
		        		if(result == 2){
		        			document.getElementById("addUserValidcode").value="";
		        			validCodeLoad();
		        		}else if(result.result == "2"){
							layer.msg(result.info, {icon : 2,time : 2000});
							document.getElementById("addUserValidcode").value="";
		        			validCodeLoad();
						}else if(result.result == "0"){
							layer.msg("验证码错误请重新输入！", {icon : 2,time : 2000});
		        			document.getElementById("addUserValidcode").value="";
		        			validCodeLoad();
						}else if(result.result == "1"){
							$scope.listEntitys.unshift(result.info);
							$scope.$apply();
							$scope.find($scope.queryEntity);
							// 关闭窗口
							$("#userModal").modal("hide");
							layer.msg("操作完成！", {icon : 1,time : 2000});
							$scope.ModalEntity = {};
						}
						
					}, entity,validcode);
		        });
	    	}else {
	    		var validcode = document.getElementById("addUserValidcode").value;
				$scope.userManageService.add(function (result) {
					if(result == 2){
	        			document.getElementById("addUserValidcode").value="";
	        			validCodeLoad();
	        		}else if(result.result == "2"){
						layer.msg(result.info, {icon : 2,time : 2000});
						document.getElementById("addUserValidcode").value="";
	        			validCodeLoad();
					}else if(result.result == "0"){
						layer.msg("验证码错误请重新输入！", {icon : 2,time : 2000});
	        			document.getElementById("addUserValidcode").value="";
	        			validCodeLoad();
					}else if(result.result == "1"){
						$scope.listEntitys.unshift(result.info);
						$scope.$apply();
						$scope.find($scope.queryEntity);
						// 关闭窗口
						$("#userModal").modal("hide");
						layer.msg("操作完成！", {icon : 1,time : 2000});
						$scope.ModalEntity = {};
					}
					
				}, entity,validcode);
	    	}
		}
	}
	
	//注销
	$scope.remove = function (entity,index) {
		if(entity.role == '6'){		// 投资顾问
			$scope.fundWorkFlowService.validateLinkAccount(function(result){
				if(result != null && result.length > 0){
					layer.msg("该投资顾问有对应工作流配置，无法注销",{icon : 2});
					return false;
				}else{
					layer.confirm('确认注销该用户吗？', {
						icon : 3
					}, function(count) {
						$scope.userManageService.removeUserAccAndGrup(entity,function(result){
							$scope.userManageService.remove(entity,function(result){
									$scope.find($scope.queryEntity);
									entity.isActive = "0";
									layer.close(count);
									$scope.$apply();
							});
						});
					});
				}
			},{
				instClientID: entity.instClientID,
				investAdviser: entity.userID
			});
		}else if(entity.role == '8'){	// 投资经理
			$scope.fundWorkFlowService.validateLinkAccount(function(result){
				if(result != null && result.length > 0){
					layer.msg("该投资经理有对应工作流配置，无法注销",{icon : 2});
					return false;
				}else{
					layer.confirm('确认注销该用户吗？', {
						icon : 3
					}, function(count) {
						$scope.userManageService.removeUserAccAndGrup(entity,function(result){
							$scope.userManageService.remove(entity,function(result){
									$scope.find($scope.queryEntity);
									entity.isActive = "0";
									layer.close(count);
									$scope.$apply();
							});
						});
					});
				}
			},{
				instClientID: entity.instClientID,
				investManager: entity.userID
			});
		}else if(entity.role == '13'){	// 投资交易员
			$scope.fundWorkFlowService.validateLinkAccount(function(result){
				if(result != null && result.length > 0){
					layer.msg("该投资交易员有对应工作流配置，无法注销",{icon : 2});
					return false;
				}else{
					layer.confirm('确认注销该用户吗？', {
						icon : 3
					}, function(count) {
						$scope.userManageService.removeUserAccAndGrup(entity,function(result){
							$scope.userManageService.remove(entity,function(result){
									$scope.find($scope.queryEntity);
									entity.isActive = "0";
									layer.close(count);
									$scope.$apply();
							});
						});
					});
				}
			},{
				instClientID: entity.instClientID,
				tradeUser: entity.userID
			});
		}else{
			layer.confirm('确认注销该用户吗？', {
				icon : 3
			}, function(count) {
				$scope.userManageService.removeUserAccAndGrup(entity,function(result){
					$scope.userManageService.remove(entity,function(result){
							$scope.find($scope.queryEntity);
							entity.isActive = "0";
							layer.close(count);
							$scope.$apply();
					});
				});
			});
		}
		
	}
	
	//密码重置
	$scope.pwdReset = function(entity){
		$scope.pwdEntity = {};
		$scope.pwdEntity = angular.copy(entity); 
		$scope.oStrengthtwo.className = 'strengthLv0';
        $scope.oStrengthTxttwo.innerHTML ='';
    	$scope.oStrengthtwoag.className = 'strengthLv0';
        $scope.oStrengthTxttwoag.innerHTML ='';
		$scope.pwdEntity.password = "";
		$scope.pwdEntity.rePassword = "";
		$scope.myFormUserPwdReset.password.$setPristine();
		$scope.myFormUserPwdReset.rePassword.$setPristine();
		validCodeLoad();
	    document.getElementById("userMangeValidcode").value="";
		$timeout(function() {
			$("#myModalUserPwdReset").modal("show");
		},800);
		
	};
	
	$scope.updatePwd = function(entity){
		//密码验证
		var pwd1 = entity.password;
		var pwd2 = entity.rePassword;
		var validcode = document.getElementById("userMangeValidcode").value;
		if(pwd1 != pwd2){
			layer.msg("两次密码输入不一致，请重新输入", {
				icon : 2,
				time : 2000
			});
			validCodeLoad();
			document.getElementById("userMangeValidcode").value="";
			return false;
		}
		if(pwd1.trim().length==0 || pwd2.trim().length==0){
			layer.msg("密码不能为空，请重新输入", {
				icon : 2,
				time : 2000
			});
			validCodeLoad();
			document.getElementById("userMangeValidcode").value="";
			return false;
		}
		var userID= entity.userID;
	    if(pwd1.trim() == userID.trim()){
			layer.msg("密码不能跟用户代码相同，请重新输入", {
				icon : 2,
				time : 2000
			});
			validCodeLoad();
			document.getElementById("userMangeValidcode").value="";
			return false;
		}
		var lv = matchLatt(pwd1);
		if(lv == 1) {
	       layer.confirm('密码强度较弱，是否保存该密码？', {icon: 3}, function (count) {
	        	  layer.close(count);
	        	  $scope.userManageService.updatePwd(entity,validcode,function (result){
	        		  if(result != null && result!= undefined && result > 0){
	        			    layer.msg("操作完成！", {icon : 1,time : 2000});
				    		$("#myModalUserPwdReset").modal("hide");
				    		$scope.ModalEntity = {};
	        		  } else if (result != null && result!= undefined && result == 0) {
	        			   layer.msg("验证码错误请重新输入！", {icon : 2,time : 2000});
	        			   document.getElementById("userMangeValidcode").value="";
	        			   validCodeLoad();
	        		  }	 else if (result != null && result!= undefined && result == -1) {
	        			   document.getElementById("userMangeValidcode").value="";
	        			   validCodeLoad();
	        		  }	
	        	  });
	        });
    	}else {
    		$scope.userManageService.updatePwd(entity,validcode,function (result){
      		  if(result != null && result!= undefined && result > 0){
      			    layer.msg("操作完成！", {icon : 1,time : 2000});
			    	$("#myModalUserPwdReset").modal("hide");
			    	$scope.ModalEntity = {};
      		  } else if (result != null && result!= undefined && result == 0) {
      			   layer.msg("验证码错误请重新输入！", {icon : 2,time : 2000});
      			   document.getElementById("userMangeValidcode").value="";
      			   validCodeLoad();
      		  }	else if (result != null && result!= undefined && result == -1) {
	   			   document.getElementById("userMangeValidcode").value="";
				   validCodeLoad();
			  }	
      	  });
    	/*	$scope.userManageService.updatePwd(entity);
    		layer.msg("操作完成！", {icon : 1,time : 2000});
    		$scope.find($scope.queryEntity);
    		$("#myModalUserPwdReset").modal("hide");
    		$scope.ModalEntity = {};*/
    	}
		
		
	}
	
	//修改
	$scope.updateInit = function(entity,indexRes){
		$scope.ModalEntity = {};
		$scope.temModalEntity =angular.copy(entity);
		$scope.temModalEntity.recordIndex = indexRes;
		if($scope.temModalEntity.checkIPMacAddr == 0){
			$scope.temModalEntity.checkIPMacAddr = "0";
		}
		else{
			$scope.temModalEntity.checkIPMacAddr = "1";
		}
		if($scope.temModalEntity.checkProductInfo == 0){
			$scope.temModalEntity.checkProductInfo = "0";
		}
		else{
			$scope.temModalEntity.checkProductInfo = "1";
		}
		$scope.ModalEntity=angular.copy($scope.temModalEntity);
		$scope.changUserType($scope.temModalEntity.userType);
		var role =$scope.temModalEntity.role;
		$scope.ModalEntity.role=parseInt(role);
		
		$scope.isUpdate = true;
		$scope.$apply();
		
		$timeout(function() {
			$("#userModal").modal("show");
		}, 1500);
		
	};
	  $scope.changInstClientId = function () {
		  $scope.ModalEntity.userType ="";
		  $scope.ModalEntity.role ="";
	  };
	 
	 $scope.changRoleName = function(){
		 var userType = $scope.queryEntity.userType;
		 $scope.listRoles = [];
		 $scope.ntmpResultforType = [];
		//去掉机构管理员
	    	//管理
	    	if(userType=="0"){
	    		var instClientID = $scope.queryEntity.instClientID;
	    		var amtType =$scope.transAmtType(instClientID);
	    		for(var i = 0;i < $scope.ntmpResult.length; i++){
	    			if($scope.ntmpResult[i].id == "1" && instClientID==null){//操作员
	   				 	$scope.ntmpResultforType.push($scope.ntmpResult[i]);
	    			}else if($scope.ntmpResult[i].id == "2" && (amtType=="2"||amtType=="1"||amtType=="")){//MOM机构管理员
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
	    			} else if($scope.ntmpResult[i].id == "14" && (amtType=="1"||amtType=="")){
	    				//FOF机构管理员
	   				 	$scope.ntmpResultforType.push($scope.ntmpResult[i]);
	    			} else if($scope.ntmpResult[i].id == "17" && (amtType=="1"||amtType=="")){
	    				//参数维护岗
		   				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
		    		} else if($scope.ntmpResult[i].id == "18" && (amtType=="1"||amtType=="")){
	    				//监控岗
		   				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
		    		}
	    		}
	    	//风控	
	    	} else if(userType=="2"){
	    		
	    		var instClientID = $scope.queryEntity.instClientID;
	    		var amtType =$scope.transAmtType(instClientID);
	    		for(var i = 0;i < $scope.ntmpResult.length; i++){
	    			
	    			//风控员
	    			if($scope.ntmpResult[i].id == "5" && (amtType=="2"||amtType=="1"||amtType=="")){
	    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
	    			}if($scope.ntmpResult[i].id == "12" && (amtType=="2"||amtType=="1"||amtType=="")){
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
	    	}else if(userType==null){//加载全部角色
	    		$scope.ntmpResultforType = $scope.ntmpResult;
	    	}
	    	$scope.listRoles =$scope.ntmpResultforType;
	 }
	  
	
	//改变用户类型
    $scope.changUserType = function (userType) {
    	  $scope.ntmpResultforType=[];
  		//去掉机构管理员
    	//管理
    	if(userType=="0"){
    		var instClientID = $scope.ModalEntity.instClientID;
    		var amtType =$scope.transAmtType(instClientID);
    		for(var i = 0;i < $scope.ntmpResult.length; i++){

    			if($scope.ntmpResult[i].id == "1" && instClientID==null){//操作员
   				 	$scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			}else if($scope.ntmpResult[i].id == "2" && (amtType=="1"||amtType=="2")){//MOM机构管理员
    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			}else if($scope.ntmpResult[i].id == "3" && instClientID==null){
    				//运维岗
    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			} else if($scope.ntmpResult[i].id == "4" && instClientID==null){
    				//结算
    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			} else if($scope.ntmpResult[i].id == "11" && instClientID==null){
    				//超级风控员
    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			} else if($scope.ntmpResult[i].id == "10"&& instClientID==null){
    				//超级风控员
    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			} else if($scope.ntmpResult[i].id == "14" && amtType=="1"){
    				//FOF机构管理员
   				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			}else if($scope.ntmpResult[i].id == "17" && (amtType=="1"||amtType=="") && instClientID==null){
    				//参数维护岗
	   				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
	    		} else if($scope.ntmpResult[i].id == "18" && (amtType=="1"||amtType=="")&& instClientID==null){
	    			//监控岗
	   				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
	    		}
    		}
    	//风控	
    	} else if(userType=="2"){
    		
    		var instClientID = $scope.ModalEntity.instClientID;
    		var amtType =$scope.transAmtType(instClientID);
    		for(var i = 0;i < $scope.ntmpResult.length; i++){
    			
    			//风控员
    			if($scope.ntmpResult[i].id == "5" && (amtType=="1"||amtType=="2")){
    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			}if($scope.ntmpResult[i].id == "12" && (amtType=="1"||amtType=="2")){
    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			}if($scope.ntmpResult[i].id == "15"&& amtType=="1"){
    				 $scope.ntmpResultforType.push($scope.ntmpResult[i]);
    			}if($scope.ntmpResult[i].id == "16"&& amtType=="1"){
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
    };
    
    $scope.showLow =function(password){
    	 var aLvTxt = ['','弱','中','强'];
         var lv = matchLatt(password);
         $scope.oStrength.className = 'strengthLv' + lv;
         $scope.oStrengthTxt.innerHTML = aLvTxt[lv];
    };
    $scope.showLowag =function(rePassword){
    	 var aLvTxt = ['','弱','中','强'];
         var lv = matchLatt(rePassword);
         $scope.oStrengthag.className = 'strengthLv' + lv;
         $scope.oStrengthTxtag.innerHTML = aLvTxt[lv];
    };
    $scope.showLowtwo =function(password){
    	 var aLvTxt = ['','弱','中','强'];
         var lv = matchLatt(password);
         $scope.oStrengthtwo.className = 'strengthLv' + lv;
         $scope.oStrengthTxttwo.innerHTML = aLvTxt[lv];
    };
    $scope.showLowtwoag =function(passwordag){
    	 var aLvTxt = ['','弱','中','强'];
         var lv = matchLatt(passwordag);
         $scope.oStrengthtwoag.className = 'strengthLv' + lv;
         $scope.oStrengthTxttwoag.innerHTML = aLvTxt[lv];
    };
    
    function matchLatt(val){
    	if(val != undefined && val.trim() != '' && val.length > 0){
         var lv = 0;
         if(val.match(/[a-z]/g)){lv++;}
         if(val.match(/[0-9]/g)){lv++;}
         if(val.match(/(.[^a-z0-9])/g)){lv++;}
         if(val.length < 6){lv=1;}
         if(lv > 3){lv=3;}
         return lv;
	    } else {
	       return 0;	
	    }
    }
    
    
    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.userManageTable = $('#userManage_dynamic_table').DataTable( {
    		data : $scope.userManageDataset,
        	columns :$scope.userManage_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
			]
        } );
    	
    });
    
  //============================================================权限树生成============================================================
    $scope.drawTree = function (id) {
        var setting = {
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true,
                    chkStyle: "checkbox",
                    chkboxType: { "Y": "ps", "N": "ps" },
                    autoCheckTrigger: true
                }
            }
        };
        
        $scope.userId = id;
        var treeObj =null;
        findUserMenuList(function (result) {
            if (result.length > 0) {
            	$.fn.zTree.init($("#userRightTree"), setting, result);
            	treeObj = $.fn.zTree.getZTreeObj("userRightTree");
            	var nodes = treeObj.getNodes();              
                for(var i=0;i<nodes[0].children.length;i++){
                	for(var j=0;j<nodes[0].children[i].children.length;j++){
                			treeObj.expandNode(nodes[0].children[i].children[j], false, null, null);  
                	}
                }
            }
        }, id);
    };


    /**
     * 保存权限设置
     */
    $scope.saveUserMenuList = function () {
        var Entitys = new Array();
        var treeObj = $.fn.zTree.getZTreeObj("userRightTree");
        var userId =  $scope.userId;

        var nodes = treeObj.getCheckedNodes(true);
        angular.forEach(nodes, function (node, index, array) {
            var Entity = new Object();
            Entity.id = node.id;
            Entity.pId = node.pId == null ? 0 : node.pId;
            Entity.name = node.name;
            Entity.url = node.url;
            Entity.open = node.open;
            Entitys.push(Entity);
        });

        //保存用户权限
        saveUserMenuList(function (result) {
	        },userId, Entitys);
	        layer.msg(" 用户权限保存完成！", {icon: 1, time: 2000});
	        $("#userSetting_setModal").modal("hide");
	    }
    
    $('#userMangeValidImg').on('click', function(e) {
        validCodeLoad();
    });
    $('#addUserValidImg').on('click', function(e) {
        validCodeLoad();
    });
  //加载验证码
  function validCodeLoad() {
  	var o = framework.internal.getFullUrl('/captcha?d='+new Date().getTime());
  	if(document.getElementById("userMangeValidImg") != null){
  		document.getElementById("userMangeValidImg").src = o;
  	}
  	if(document.getElementById("addUserValidImg") != null){
  		document.getElementById("addUserValidImg").src = o;
  	}
  }
});
