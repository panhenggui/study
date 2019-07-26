myapp.controller('instClientController', function ($scope,$rootScope, $timeout) {
	//调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
	$scope.instAdminService = new com.quantdo.orgClear.service.instAdminService();
	$scope.userManageService = new com.quantdo.orgClear.service.UserManageService;
    $scope.listEntitys = [];
    $scope.queryEntity = {};
    $scope.modalEntity = {};
    $scope.instClientDataset=[]
    $scope.modalAdminEntity = {};
    $scope.amTypes = clearConstant.amTypes;
    $scope.arithmetics = clearConstant.arithmetics;
    $scope.isMOM = true;
    $scope.tradeUserTypes = clearConstant.tradeUserTypes;
    $scope.pwdBlank = true;
    $scope.instClient_add = isShow("instClient_add");
    $scope.instClient_query = isShow("instClient_query");
    $scope.instClient_update = isShow("instClient_update");
    $scope.instClient_delete = isShow("instClient_delete");
    $scope.instClient_amType_update = isShow("instClient_amType_update");
    $scope.instClient_amType_set = isShow("instClient_amType_set");
    $scope.instClient_amType_permission = isShow("instClient_amType_permission");
    $scope.checkPwd ="";
    
	checkPassword(function(result){
		$scope.checkPwd = result;
		$scope.$apply();
	});
	
    //定义系统用户管理表的固定列头
    $scope.instClient_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "投资机构代码"},
        {title: "机构简称"},
        {title: "机构全称"},
        {title: "机构账号类型"},
        {title: "分仓算法"},
        {title: "地址"},
        {title: "联系人"},
        {title: "电话"},
        {title: "手机号码"},
        {title: "电子邮箱"},
/*        {title: "机构管理员"},*/
        {title: "创建人"},
        {title: "创建时间"},
        {title: "备注"},
        {title: "操作"}
    ]; 
 
	
    var id = document.getElementById('instClient_passStrength');
    var div = document.createElement('div');
    var strong = document.createElement('strong');
    $scope.oStrengthic = id.appendChild(div);
    $scope.oStrengthTxtic = id.parentNode.appendChild(strong);
    
    var idag = document.getElementById('instClient_passStrengthag');
    var divag = document.createElement('div');
    var strongag = document.createElement('strong');
    $scope.oStrengthicag = idag.appendChild(divag);
    $scope.oStrengthTxticag = idag.parentNode.appendChild(strongag);
    
    //判定登录用户的机构权限
    queryInstClientID(function (result) {
        $scope.queryEntity={};
        if(result != undefined ){
        	$scope.queryEntity.instClientID = result;
        }
        $scope.find();
        $scope.$apply();
    });
    
    // 初始化页面记录
    $scope.instClientService.findByQuery(function (result) {
        $scope.listEntitys = result;
        $scope.$apply();
    },{});
    
    // 分仓算法转换
    $scope.transArithmetics = function (key) {
    	for(var i = 0;i < $scope.arithmetics.length; i++){
    		if($scope.arithmetics[i].key == key){
    			return $scope.arithmetics[i].text;
    		}
    	}
    	return "";
    }
    
    // 机构账号类型转换
    $scope.transAmTypes = function (key) {
    	for(var i = 0;i < $scope.amTypes.length; i++){
    		if($scope.amTypes[i].key == key){
    			return $scope.amTypes[i].text;
    		}
    	}
    	return "";
    }
    
    //判断密码框是否为空或者空格
	$scope.isBlank = function (pwd,pwdag){
		if(pwd == undefined || pwd.trim() == "" || pwdag == undefined || pwdag.trim() == ""){
			$scope.pwdBlank = true;
		}else{
			$scope.pwdBlank = false;
		}
	}
    
    // 重置表单验证信息
    function formValidateReset() {
		if($scope.instClientForm != undefined){
			$scope.instClientForm.instClientID.$setPristine();
			$scope.instClientForm.instClientAbbrName.$setPristine();
			$scope.instClientForm.instClientName.$setPristine();
			$scope.instClientForm.amType.$setPristine();
		}
    }

    // 初始化页面参数
    $scope.initParameter = function () {
        // 设置默认选中
    	$scope.modalEntity = {};
    	$scope.modalEntity.amType =$scope.amTypes[1].key;
    	$scope.modalEntity.arithmetic = $scope.arithmetics[1].key; 
    	$scope.isMOM = true;
        formValidateReset();
        $scope.isUpdate = false;
    	$scope.instClientService.findAvaliableInstClientID(function(result){
    		$timeout(function() {
    			$scope.modalEntity.instClientID = result;
            }, 1000);
    	});
    };
    
    $scope.changeAmType = function(){
    	if($scope.modalEntity.amType == 1){
        	$scope.isMOM = false;
        	$scope.modalEntity.arithmetic = null; 
        }else{
        	$scope.isMOM = true;
        	$scope.modalEntity.arithmetic = $scope.arithmetics[1].key;
        }
    }

    // 修改
    $scope.initUpdateParam = function (entity,index) {
    	$scope.modalEntity = {};
		$scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.modalEntity = angular.copy($scope.tempEntity);
		$scope.modalEntity.remark = htmlDecodeJQ($scope.modalEntity.remark);
        formValidateReset();
        if($scope.modalEntity.amType == 1){
        	$scope.isMOM = false;
        }else{
        	$scope.isMOM = true;
        }
        $scope.isUpdate = true;
    };

    // 新增账户信息
    $scope.save = function (entity) {
        var index = entity.id;
        var tableIndex = entity.index;
		entity.remark = htmlEncodeJQ(entity.remark);
        // 增加
        if (index == undefined) {
        	$scope.instClientService.findByQuery(function (result) {
                if (result != null && result.length > 0) {
                    layer.msg("机构代码已使用，请重新输入", {icon: 2});
                    return false;
                }else{
                	$scope.instClientService.add(function (result) {
                		if(result != null){
                			layer.msg("新增成功",{icon: 1});
                			$scope.listEntitys.unshift(result);
                            $scope.$apply();
                            $scope.find();
                            // 关闭窗口
                            $("#instClientModal").modal("hide");
                		}else{
                			layer.msg("新增失败",{icon: 2});
                		}
                    }, entity);
                }
            }, {
            	instClientID: entity.instClientID
            });
            // 修改
        } else {
        	$scope.instClientService.update(function (result) {
        		if(result != null){
        			result.index = tableIndex;
        			layer.msg("修改成功",{icon: 1});
        			$scope.listEntitys.splice(tableIndex-1, 1, result);
        			$scope.instClientTable.cells().every( function () {
	                    if((tableIndex-1) == this[0][0].row){
	                        if(this[0][0].column == 3){
	                            this.data(entity.instClientAbbrName);
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 4){
	                            this.data(entity.instClientName);
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 7){
	                            this.data(entity.address);
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 8){
	                            this.data(entity.contactPerson);
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 9){
	                            this.data(entity.telephone);
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 10){
	                            this.data(entity.mobilePhone);
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 11){
	                            this.data(entity.email);
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 14){
	                            this.data(entity.remark);
	                            $scope.$apply();
	                        }
	                        
	                    }

        			} );
	        		//$scope.find();
	        		// 关闭窗口
	                $("#instClientModal").modal("hide");
        		}else{
        			layer.msg("新增失败",{icon: 2});
        		}
	        }, entity);
        }
    };
    
    // 重置表单验证信息
    function formValidateReset2() {
        $scope.instAdminForm.instClientID.$setPristine();
        $scope.instAdminForm.adminID.$setPristine();
        $scope.instAdminForm.adminName.$setPristine();
        $scope.instAdminForm.role.$setPristine();
        $scope.instAdminForm.password.$setPristine();
        $scope.instAdminForm.pwdag.$setPristine();
    }

    // 初始化管理员页面参数
    $scope.adminInitParam = function (entity, index) {
        // 设置默认选中
    	$scope.modalAdminEntity = {};
    	$scope.modalAdminEntity.hasAdmin = entity.hasAdmin;
    	$scope.modalAdminEntity.instClientID = entity.instClientID;
    	$scope.modalAdminEntity.listEntityIndex = index;
    	$scope.modalAdminEntity.role = '2';
        formValidateReset2();
        $scope.isAdminUpdate = false;
/*    	$scope.instClientService.findAvaliableInstClientID(function(result){
    		$timeout(function() {
    			$scope.modalEntity.instClientID = result;
            }, 1000);
    	});*/
    	$scope.oStrengthic.className = 'strengthLv0';
        $scope.oStrengthTxtic.innerHTML ='';
    	$scope.oStrengthicag.className = 'strengthLv0';
        $scope.oStrengthTxticag.innerHTML ='';
        validCodeLoad();
	    document.getElementById("instClientValidcode").value="";
    };

    // 管理员修改初始化
    $scope.adminUpdateParam = function (entity) {
    	formValidateReset2();
        $scope.isAdminUpdate = true;
    	$scope.instAdminService.findEntityByInstClientID(function(result){
    		$scope.modalAdminEntity = angular.copy(result);
    		$scope.modalAdminEntity.hasAdmin = entity.hasAdmin;
            $scope.modalAdminEntity.instClientID = entity.instClientID;
            $scope.modalAdminEntity.role = '2';
    		$scope.$apply();
    	},{
    		instClientID: entity.instClientID
    	});
    	$scope.oStrengthic.className = 'strengthLv0';
        $scope.oStrengthTxtic.innerHTML ='';
    	$scope.oStrengthicag.className = 'strengthLv0';
        $scope.oStrengthTxticag.innerHTML ='';
        validCodeLoad();
	    document.getElementById("instClientValidcode").value="";
        
    };
    
    // 保存管理员信息
    $scope.saveAdmin = function (entity){
    	if(entity.password==undefined || entity.pwdag==undefined){
			layer.msg("密码不能为空", {
				icon : 2,
				time : 2000
			});
			validCodeLoad();
		    document.getElementById("instClientValidcode").value="";
			return false;
		}
    	var pwd1 = entity.password.trim();
    	var adminId =entity.adminID.trim();
		var pwd2 = entity.pwdag.trim();
		if(entity.adminID.length < 2){
			layer.msg("用户代码必须2位以上，请重新输入", {
				icon : 2,
				time : 2000
			});
			validCodeLoad();
		    document.getElementById("instClientValidcode").value="";
			return false;
		}
		if (pwd1 == adminId) {
			layer.msg("密码不能与机构管理员代码相同，请重新输入", {
				icon : 2,
				time : 2000
			});
			validCodeLoad();
		    document.getElementById("instClientValidcode").value="";
			return false;
		}
		if (pwd1 != pwd2) {
			layer.msg("两次密码输入不一致，请重新输入", {
				icon : 2,
				time : 2000
			});
			validCodeLoad();
		    document.getElementById("instClientValidcode").value="";
			return false;
		}
		var lv = matchLatt(pwd1);
		var validcode = document.getElementById("instClientValidcode").value;
    	if(lv == 1) {
	       layer.confirm('密码强度较弱，是否保存该密码？', {icon: 3}, function (count) {
	    	   	layer.close(count);
    			if(entity.hasAdmin == false){		//新增管理员
    				$scope.instAdminService.add(function(result){
    					if(result == 1){
    						validCodeLoad();
    					    document.getElementById("instClientValidcode").value="";
    					}else if(result != null){
    						layer.msg("设置管理员成功",{icon: 1});
    						$scope.listEntitys[entity.listEntityIndex-1].hasAdmin = true;
    						$scope.$apply();
    						$scope.find();
    						$("#instAdminModal").modal("hide");
    					}else{
    						layer.msg("设置管理员失败",{icon: 2});
    					}
    				},entity,validcode,{
    					userID: entity.adminID,
    					userName: entity.adminName,
    					password: entity.password
    				});
    			}else{			//修改管理员
    				$scope.instAdminService.update(function(result){
    					if(result == 1){
    						validCodeLoad();
    					    document.getElementById("instClientValidcode").value="";
    					}else if(result != null){
    						layer.msg("修改管理员成功",{icon: 1});
    						$scope.find();
    						$("#instAdminModal").modal("hide");
    					}else{
    						layer.msg("修改管理员失败",{icon: 2});
    					}
    				},entity,validcode,{
    					userID: entity.adminID,
    					userName: entity.adminName,
    					password: entity.password
    				});
    			}
	        });
    	}else {
			if(entity.hasAdmin == false){		//新增管理员
				$scope.instAdminService.add(function(result){
					if(result == 1){
						validCodeLoad();
					    document.getElementById("instClientValidcode").value="";
					}else if(result != null){
						layer.msg("设置管理员成功",{icon: 1});
						$scope.listEntitys[entity.listEntityIndex-1].hasAdmin = true;
						$scope.$apply();
						$scope.find();
						$("#instAdminModal").modal("hide");
					}else{
						layer.msg("设置管理员失败",{icon: 2});
					}
				},entity,validcode,{
					userID: entity.adminID,
					userName: entity.adminName,
					password: entity.password
				});
			}else{			//修改管理员
				$scope.instAdminService.update(function(result){
					if(result == 1){
						validCodeLoad();
					    document.getElementById("instClientValidcode").value="";
					}else if(result != null){
						layer.msg("修改管理员成功",{icon: 1});
						$scope.find();
						$("#instAdminModal").modal("hide");
					}else{
						layer.msg("修改管理员失败",{icon: 2});
					}
				},entity,validcode,{
					userID: entity.adminID,
					userName: entity.adminName,
					password: entity.password
				});
			}
    	}
    }
    $("body").undelegate("#instClient_dynamic_table_wrapper td .permission-set","click");
    //表格设置用户权限事件
    $("body").delegate("#instClient_dynamic_table_wrapper td .permission-set","click",function(){  	
        var mytr = $(this).parents("tr");
        var tempArr = $scope.instClientTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		entity = $scope.listEntitys[i];
        	}
        }
        
        $scope.instAdminService.findEntityByInstClientID(function(result){
        	if(result!=null && result!=undefined){
        		getUserByLoginId(function (result2) {
                	$scope.drawTree(result2.id);
            	}, result.adminID);
        	}
	    },{
    		instClientID: entity.instClientID
    	});
        
        
    });
    $("body").undelegate("#instClient_dynamic_table_wrapper td .update-row","click");
    //表格中修改的单击事件
    $("body").delegate("#instClient_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.instClientTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        formValidateReset();
        $scope.isUpdate = true;
        $scope.initUpdateParam($scope.modalEntity,id);
        $scope.$apply();
    });
    $("body").undelegate("#instClient_dynamic_table_wrapper td .my-update","click");
    //表格机构管理员的修改单击事件
    $("body").delegate("#instClient_dynamic_table_wrapper td .my-update","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.instClientTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.adminUpdateParam($scope.modalEntity);
    });
    $("body").undelegate("#instClient_dynamic_table_wrapper td .my-set","click");
     //表格机构管理员的设置单击事件
    $("body").delegate("#instClient_dynamic_table_wrapper td .my-set","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.instClientTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        
        $scope.adminInitParam($scope.modalEntity,id);
        $scope.$apply();
    });
    
    
	// 查询(前台分页)
    $scope.find = function(){
    	//将数据集赋值为空
    	$scope.instClientDataset = [];
    	//更新表格对应的数据集
    	$scope.instClientService.findByQuery(function (result) {
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	operate1 = $scope.getUpdatePermision($scope.instClient_update); 
            	operate2 = $scope.getDeletePermision($scope.instClient_delete);
                var tempArr = [(i+1),con[i].id,con[i].instClientID, con[i].instClientAbbrName,con[i].instClientName,$scope.transAmTypes(con[i].amType),$scope.transArithmetics(con[i].arithmetic)
                               ,con[i].address,con[i].contactPerson,con[i].telephone,con[i].mobilePhone,con[i].email/*,$scope.getManagerOper(con[i].hasAdmin)*/
                               ,con[i].creator,con[i].createDate,con[i].remark,operate1+operate2];
	            $scope.instClientDataset.push(tempArr);
	            con[i].index = tempArr[0];
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.instClientTable.clear().draw();
            $scope.instClientTable.rows.add($scope.instClientDataset).draw();
        }, $scope.queryEntity);
    }
    
    //获取修改权限
    $scope.getUpdatePermision = function(flag){
    	  var result = "";
	  	  if(flag){
	  		  result = "<a class='update-row' data-toggle='modal' data-target='#instClientModal'>修改</a>";
	  	  }
	  	  return result;
    }
    //获取删除权限
   $scope.getDeletePermision = function(flag){
    	  var result = "";
    	  if(flag){
    		  result = "<a class='delete-row'>删除</a>";
    	  }
    	  return result;
    }
  
    $scope.getManagerOper = function(isAdmin){
    	var result1 = "";
    	var result2 = "";
    	var blank = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    	if(isAdmin){
    		if($scope.instClient_amType_permission){
    			result1 = "<a class='permission-set' data-toggle='modal' data-target='#instSetting_setModal'>权限设置</a>";
    		}  
    		if($scope.instClient_amType_update){
    			result1 += "<a class='my-update'  data-toggle='modal' data-target='#instAdminModal'>修改</a>" ;
    		}
    	}else if(!isAdmin && $scope.instClient_amType_set){
    		result2 = blank +"<a class='my-set'  data-toggle='modal' data-target='#instAdminModal'>设置</a>";
    	}
    	return result1+result2;
    }

/*    // 根据页面条件查询
    $scope.find = function (object) {
        $scope.isQuery = true;
        $scope.listEntitys = [];
        $scope.instClientService.findByQuery(function (result) {
            $scope.listEntitys = result;
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        }, object);
    };*/
    

    $("body").undelegate("#instClient_dynamic_table_wrapper td .delete-row","click");
    //表格中删除的单击事件
    $("body").delegate("#instClient_dynamic_table_wrapper td .delete-row","click",function(){
	var mytr = $(this).parents("tr");
    var tempArr = $scope.instClientTable.row(mytr).data();
    var instClientId = tempArr[2];
    // 校验机构下有存在产品、资金账号或机构管理员则不允许删除
    /*var hasAdmin =tempArr[12];
    //管理员校验
    if(hasAdmin.indexOf("instSetting_setModal") > 0){
    	layer.msg("该机构下存在管理员信息，不可删除！", {
			icon : 2,
			time : 2000
		});
		return false;
    }else { //资金账号校验*/
    $scope.instClientService.checkAccByQuery(function (result) {
        if (result) {
            layer.msg("该机构下存在账号信息，不可删除！", {icon: 2});
            return false;
        }else{
        	$scope.instClientService.checkProdByQuery(function (prodResult) {
                if (prodResult) {
                    layer.msg("该机构下存在产品信息，不可删除！", {icon: 2});
                    return false;
                }else{
                	$scope.instClientService.checkInstManagerByQuery(function(instResult){
                		if(instResult){
                			layer.msg("该机构下存在机构管理员，不可删除！", {icon: 2});
                            return false;
                		}else{
                			layer.confirm('确定删除该机构信息？', {icon: 3}, function (count) {
                    	    	$scope.instClientService.removeByInstId(function (result) {
                    	        	layer.msg("该机构信息删除成功!", {icon : 1,time : 2000});
                    	        	$scope.find();
                    	    	}, instClientId);  
                        	});
                		}
                	},instClientId);
                }
            }, instClientId);
        }
    }, instClientId);
    /*}*/
});
    

    $scope.showLow =function(){
        var lv = matchLatt($scope.modalAdminEntity.password);
    	var aLvTxt = ['','弱','中','强'];
        $scope.oStrengthic.className = 'strengthLv' + lv;
        $scope.oStrengthTxtic.innerHTML = aLvTxt[lv];
    };
    $scope.showLowag =function(){
    	 var aLvTxt = ['','弱','中','强'];
         var lv = matchLatt($scope.modalAdminEntity.pwdag);
         $scope.oStrengthicag.className = 'strengthLv' + lv;
         $scope.oStrengthTxticag.innerHTML = aLvTxt[lv];
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
    	$scope.instClientTable = $('#instClient_dynamic_table').DataTable( {
    		data : $scope.instClientDataset,
        	columns :$scope.instClient_columns,
//        	scrollY: 300,
//          scrollX: true,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: []
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
            	$.fn.zTree.init($("#instAdminRightTree"), setting, result);
            	treeObj = $.fn.zTree.getZTreeObj("instAdminRightTree");
            }
        }, id);
    };


    /**
     * 保存权限设置
     */
    $scope.saveUserMenuList = function () {
        var Entitys = new Array();
        var treeObj = $.fn.zTree.getZTreeObj("instAdminRightTree");
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
        $("#setModal").modal("hide");
    }
    
    $('#instClientValidImg').on('click', function(e) {
        validCodeLoad();
    });
    //加载验证码
    function validCodeLoad() {
      	var o = framework.internal.getFullUrl('/captcha?d='+new Date().getTime());
      	if(document.getElementById("instClientValidImg") != null){
      		document.getElementById("instClientValidImg").src = o;
      	}
    }
});

