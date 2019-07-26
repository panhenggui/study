myapp.controller('SeatUserController', function ($scope,$rootScope, $timeout) {
	//调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
	$scope.seatUserService = new com.quantdo.orgClear.service.SeatUserService();
    $scope.listEntitys = [];
    $scope.queryEntity = {};
    $scope.modalEntity = {};
    $scope.seatUserDataset=[];
    $scope.seatUser_add = isShow("seatUser_add");
    $scope.seatUser_query = isShow("seatUser_query");
    $scope.seatUser_password = isShow("seatUser_password");
    $scope.seatUser_delete = isShow("seatUser_delete");
    $scope.seatUser_connect = isShow("seatUser_connect");
    $scope.isNotDatas = clearConstant.isNotDatas;
    //新增账号密码
    var id = document.getElementById('seatUser_passStrength');
    var div = document.createElement('div');
    var strong = document.createElement('strong');
    $scope.oStrengthca = id.appendChild(div);
    $scope.oStrengthTxtca = id.parentNode.appendChild(strong);
    
    var idag = document.getElementById('seatUser_passStrengthag');
    var divag = document.createElement('div');
    var strongag = document.createElement('strong');
    $scope.oStrengthcaag = idag.appendChild(divag);
    $scope.oStrengthTxtcaag = idag.parentNode.appendChild(strongag);
    
    //修改密码
    var idtwo = document.getElementById('seatUser_passStrengthtwo');
    var divtwo = document.createElement('div');
    var strongtwo = document.createElement('strong');
    $scope.oStrengthcatwo = idtwo.appendChild(divtwo);
    $scope.oStrengthTxtcatwo = idtwo.parentNode.appendChild(strongtwo);
    
    var idtwoag = document.getElementById('seatUser_passStrengthtwoag');
    var divtwoag = document.createElement('div');
    var strongtwoag = document.createElement('strong');
    $scope.oStrengthcatwoag = idtwoag.appendChild(divtwoag);
    $scope.oStrengthTxtcatwoag = idtwoag.parentNode.appendChild(strongtwoag);
    
    $scope.showLow =function(password){
   	 var aLvTxt = ['','弱','中','强'];
   	 var lv = matchLatt(password);
        $scope.oStrengthca.className = 'strengthLv' + lv;
        $scope.oStrengthTxtca.innerHTML = aLvTxt[lv];
   };
   $scope.showLowag =function(rePassword){
   	 var lv = matchLatt(rePassword);
   	 var aLvTxt = ['','弱','中','强'];
        $scope.oStrengthcaag.className = 'strengthLv' + lv;
        $scope.oStrengthTxtcaag.innerHTML = aLvTxt[lv];
   };
   $scope.showLowtwo =function(password){
   	 var aLvTxt = ['','弱','中','强'];
   	 var lv = matchLatt(password);
        $scope.oStrengthcatwo.className = 'strengthLv' + lv;
        $scope.oStrengthTxtcatwo.innerHTML = aLvTxt[lv];
   };
   $scope.showLowtwoag =function(passwordag){
   	 var aLvTxt = ['','弱','中','强'];
   	 var lv = matchLatt(passwordag);
        $scope.oStrengthcatwoag.className = 'strengthLv' + lv;
        $scope.oStrengthTxtcatwoag.innerHTML = aLvTxt[lv];
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
   
   $('#seatUserValidImg').on('click', function(e) {
       validCodeLoad();
   });
   $('#seatUserPwdResetValidImg').on('click', function(e) {
       validCodeLoad();
   });
   //加载验证码
   function validCodeLoad() {
     	var o = framework.internal.getFullUrl('/captcha?d='+new Date().getTime());
     	if(document.getElementById("seatUserValidImg") != null){
     		document.getElementById("seatUserValidImg").src = o;
     	}
     	if(document.getElementById("seatUserPwdResetValidImg") != null){
     		document.getElementById("seatUserPwdResetValidImg").src = o;
     	}

   }
    
    //初始化机构信息
    $scope.queryinstClientlists =[];
    $scope.instClientService.findByQuery(function (result) {
        $scope.queryinstClientlists = result;
        $scope.$apply();
    },{});
    
    $scope.instClientID = '';
    //判定登录用户的机构权限
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
    
    // 初始化交易通道
    $scope.selectSeatEntitys = []
    findManySeatEntity(function(result){
    	$scope.selectSeatEntitys = result;
        $scope.$apply();
    });
    
    
    // 初始化交易通道
    $scope.selectSeatUserEntitys = []
	$scope.seatUserService.findSeatUserByquery(function (result) {
		$scope.selectSeatUserEntitys = result;
        $scope.$apply();
    }, $scope.queryEntity,"1");
    
    $scope.isInstClientSelect = function (instClientId) {
        $scope.selectSeatUserEntitys = []
    	$scope.seatUserService.findSeatUserByquery(function (result) {
    		$scope.selectSeatUserEntitys = result;
            $scope.$apply();
        }, {instClientID :instClientId },"1");
    };
    
    
    
    $scope.seatIDSelect = function (instClientId,seatID) {
        $scope.selectSeatUserEntitys = []
    	$scope.seatUserService.findSeatUserByquery(function (result) {
    		$scope.selectSeatUserEntitys = result;
            $scope.$apply();
        }, {instClientID :instClientId , seatID : seatID},"1");
    };
    
    
    
	
    //定义系统用户管理表的固定列头
    $scope.seatUser_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "所属机构"},
        {title: "交易通道"},
        {title: "席位用户"},
        {title: "席位连接状态"},
        {title: "操作人"},
        {title: "操作日期"}, 
        {title: "操作时间"},        
        {title: "操作"}
    ];    
    
    // 重置表单验证信息
    function formValidateReset() {
		if($scope.seatUserForm != undefined){
			$scope.seatUserForm.instClientID.$setPristine();
			$scope.seatUserForm.seatID.$setPristine();
			$scope.seatUserForm.seatUserID.$setPristine();
			$scope.seatUserForm.password.$setPristine();
			$scope.seatUserForm.rePassword.$setPristine();
			$scope.seatUserForm.validcode.$setPristine();
		}
    }

    // 初始化页面参数
    $scope.initParameter = function () {
        // 设置默认选中
    	$scope.modalEntity = {};
        formValidateReset();
        $scope.isUpdate = false;
        if($scope.instClientID != undefined ){
        	$scope.isInstClient = true;
        	$scope.modalEntity.instClientID=$scope.instClientID;
        }else{
        	$scope.isInstClient = false;
        	$scope.modalEntity.instClientID=$scope.queryinstClientlists[0].instClientID;
        }
        validCodeLoad();
        $scope.oStrengthca.className = 'strengthLv0';
        $scope.oStrengthTxtca.innerHTML ='';
    	$scope.oStrengthcaag.className = 'strengthLv0';
        $scope.oStrengthTxtcaag.innerHTML ='';
        $scope.modalEntity.seatID = $scope.selectSeatEntitys[0].seatID;
    };

    // 修改
    $scope.initUpdateParam = function (entity,index) {
    	$scope.modalEntity = {};
		$scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.modalEntity = angular.copy($scope.tempEntity);
        formValidateReset();
        $scope.isUpdate = true;
    };

    // 新增账户信息
    $scope.save = function (entity) {
    	var validcode = document.getElementById("seatUserValidcode").value;
    
        if(entity.password.trim() != entity.rePassword.trim()){
            layer.msg("2次输入的密码不一致。",{icon:2});
            validCodeLoad();
		    document.getElementById("seatUserValidcode").value="";
            return ;
        }
        if(entity.password.trim().length==0 || entity.rePassword.trim().length==0){
			layer.msg("密码不能为空，请重新输入", {
				icon : 2,
				time : 2000
			});
			validCodeLoad();
		    document.getElementById("seatUserValidcode").value="";
			return false;
		}
		var lv = matchLatt(entity.password.trim());
        // 增加
		if(lv == 1) {
			layer.confirm('密码强度较弱，是否保存该密码？', {icon: 3}, function (count) {
				   	layer.close(count);
        	$scope.seatUserService.findSeatUserByquery(function (result) {
                if (result != null && result.length > 0) {
                    layer.msg("该席位用户记录已存在，新增失败", {icon: 2});
                    validCodeLoad();
                    document.getElementById("seatUserValidcode").value="";
                    return false;
                }else{
                	$scope.seatUserService.saveSeatUser(function (result) {
                		if(result != null && result != 1){
                        	if(result.instClientID == null){
                        		layer.msg(result.remark,{icon: 2});
                        	}else{
                        		layer.msg("新增成功",{icon: 1});
                    			$scope.listEntitys.unshift(result);
                                $scope.$apply();
                                $scope.find();
                                // 关闭窗口
                                $("#seatUserModal").modal("hide");
                        	}                			
                		}
                    }, entity,validcode);
                }
            },entity,"2");
			});
        } else {
        	$scope.seatUserService.findSeatUserByquery(function (result) {
                if (result != null && result.length > 0) {
                	  layer.msg("该席位用户记录已存在，新增失败", {icon: 2});
                    validCodeLoad();
                    return false;
                }else{
                	$scope.seatUserService.saveSeatUser(function (result) {
                		if(result != null && result != 1){
                        	if(result.instClientID == null){
                        		layer.msg(result.remark,{icon: 2});
                        	}else{
                        		layer.msg("新增成功",{icon: 1});
                    			$scope.listEntitys.unshift(result);
                                $scope.$apply();
                                $scope.find();
                                // 关闭窗口
                                $("#seatUserModal").modal("hide");
                        	}                			
                		}else{
                			layer.msg("新增失败",{icon: 2});
                		}
                    }, entity,validcode);
                }
            },entity,"2");
        } 
    };
    
    $scope.isQuery = false;
	// 查询(前台分页)
    $scope.find = function(){
    	//将数据集赋值为空
    	$scope.isQuery = true;
    	$scope.seatUserDataset = [];
    	//更新表格对应的数据集
    	$scope.seatUserService.findSeatUserByquery(function (result) {
    		var con = result;
    		$scope.listEntitys = result;
    	    $timeout(function() {
	    		var tempArray = new Array();
	            for(var i = 0; i<con.length;i++){
	            	var operate1 = $scope.getUpdatePermision($scope.seatUser_password); 
	            	var operate2 = $scope.getDeletePermision($scope.seatUser_delete);
                    var operate3 = $scope.getConnectPermision($scope.seatUser_connect,con[i].seatIsConnect);
	                var tempArr = [(i+1),con[i].id,$scope.transInst(con[i].instClientID), $scope.transSeat(con[i].seatID),con[i].seatUserID,$scope.transSeatIsConnect(con[i].seatIsConnect)
	                               ,con[i].operatorID,con[i].operateDate,con[i].operateTime,operate1+operate2+operate3];
		            $scope.seatUserDataset.push(tempArr);
		            con[i].index = tempArr[0];
	            }
	            $scope.listEntitys = con;
	            //重新绘表
	            $scope.seatUserTable.clear().draw();
	            $scope.seatUserTable.rows.add($scope.seatUserDataset).draw();
	            $scope.isQuery = false;
            }, 800);
        }, $scope.queryEntity,"1");
    }
    
    $timeout(function() {
    	$scope.find();
    },1000);

    // 页面通道名称转换
    $scope.transSeat = function (text) {
        var count = $scope.selectSeatEntitys.length;
        for (var i = 0; i < count; i++) {
            if ($scope.selectSeatEntitys[i].seatID == text) {
                return $scope.selectSeatEntitys[i].seatName;
            }
        }
        return "";
    };
    
    // 机构转换
    $scope.transInst = function (instClientID) {
        var count = $scope.queryinstClientlists.length;
        for (var i = 0; i < count; i++) {
            if ($scope.queryinstClientlists[i].instClientID == instClientID) {
                return $scope.queryinstClientlists[i].instClientAbbrName;
            }
           
        }
        return "";
    };

    $scope.seatIsConnects = clearConstant.seatIsConnect;
    // 席位连接状态
    $scope.transSeatIsConnect = function (key) {
        var count = $scope.seatIsConnects.length;
        for (var i = 0; i < count; i++) {
            if ($scope.seatIsConnects[i].key == key) {
                return $scope.seatIsConnects[i].text;
            }
        }
        return "";
    };

    //获取连接权限
    $scope.getConnectPermision = function(flag,seatIsConnect){
        var result = "";
        if(flag){
            if(seatIsConnect == 0){
                result = "<a class='seatUser-update-row2'>连接</a>";
            }else{
                result = "<a class='seatUser-update-row2'>断开</a>";
            }

        }
        return result;
    }

    $("body").undelegate("#seatUser_dynamic_table_wrapper td .seatUser-update-row2","click");
    //表格断开，连接事件
    $("body").delegate("#seatUser_dynamic_table_wrapper td .seatUser-update-row2","click",function(){
        var mytr = $(this).parents("tr");
        var tempArr = $scope.seatUserTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
            if(id==$scope.listEntitys[i].id){
                $scope.modalEntity = $scope.listEntitys[i];
            }
        }
        $scope.changeSeatIsConnect($scope.modalEntity,this.innerHTML);
    });

    $scope.changeSeatIsConnect = function(entity,text){
        if(text == "断开"){
            var flag = "1";
        }else{
            var flag = "0";
        }
        layer.load(2, {
            shade: [0.5,'#fff'] //0.1透明度的白色背景
        });
        $scope.seatUserService.changeSeatIsConnect(function (result) {
            if(result == 0){
                layer.closeAll('loading');
                if(text == "断开"){
                    layer.msg("席位断开成功",{icon:1});
                }else{
                    layer.msg("席位连接成功",{icon:1});
                }
            }else if(result == 2){
                layer.closeAll('loading');
                layer.msg("席位不存在",{icon:2});
            }else{
                layer.closeAll('loading');
                layer.msg("席位用户未上场或者未绑定资金账号",{icon:2});
            }
        },entity,flag);
    }

    $("body").undelegate("#seatUser_dynamic_table_wrapper td .update-row","click");
    //表格重置密码事件
    $("body").delegate("#seatUser_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.seatUserTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.pwdReset($scope.modalEntity);
    });
    
   
    //获取删除权限
    $scope.getDeletePermision = function(flag){
    	  var result = "";
    	  if(flag){
    		  result = "<a class='delete-row'>删除</a>";
    	  }
    	  return result;
    }

    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.seatUserTable = $('#seatUser_dynamic_table').DataTable( {
    		data : $scope.seatUserDataset,
        	columns :$scope.seatUser_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: []
        } );
    });
    
    //密码重置
    $scope.pwdReset = function(entity){
	    $scope.ModalTemPwdEntity= angular.copy(entity); 
        $scope.ModalPwdEntity = $scope.ModalTemPwdEntity;
        $scope.ModalPwdEntity.password = "";
        $scope.ModalPwdEntity.reSeatPassword = "";
        $scope.ModalPwdEntity.isTrade =$scope.isNotDatas[1].key; 
        $scope.oStrengthcatwo.className = 'strengthLv0';
        $scope.oStrengthTxtcatwo.innerHTML ='';
    	$scope.oStrengthcatwoag.className = 'strengthLv0';
        $scope.oStrengthTxtcatwoag.innerHTML ='';
        formValidatePasswordReset();
		//$scope.capitalAccountUpdateTarget = "#capAccPwdReset";
		validCodeLoad();
	    document.getElementById("seatUserPwdResetValidcode").value=""; 
        $("#seatUSerPwdReset").modal("show");
        $scope.$apply();
    };
    
    function formValidatePasswordReset(){
    	$scope.seatUserFormPwdReset.validcode.$setPristine();
    	$scope.seatUserFormPwdReset.isTrade.$setPristine();
    	$scope.seatUserFormPwdReset.password.$setPristine();
        $scope.seatUserFormPwdReset.reSeatPassword.$setPristine();
    }
    
	 //修改密码
    $scope.updateResetPwd = function (entity) {
    	var validcode = document.getElementById("seatUserPwdResetValidcode").value;
        if(entity.password.trim() != entity.reSeatPassword.trim()){
            layer.msg("2次输入的密码不一致。",{icon:2});
            validCodeLoad();
		    document.getElementById("capitalAccountPwdResetValidcode").value="";
            return ;
        }
        if(entity.password.trim().length==0 || entity.reSeatPassword.trim().length==0){
			layer.msg("密码不能为空，请重新输入", {
				icon : 2,
				time : 2000
			});
			validCodeLoad();
		    document.getElementById("capitalAccountPwdResetValidcode").value="";
			return false;
		}
/*        if(entity.password.trim() == accountID.trim()){
			layer.msg("密码不能跟资金账号相同，请重新输入", {
				icon : 2,
				time : 2000
			});
			validCodeLoad();
		    document.getElementById("capitalAccountPwdResetValidcode").value="";
			return false;
		}*/
		var lv = matchLatt(entity.password.trim());
		if(lv == 1) {
		   layer.confirm('密码强度较弱，是否保存该密码？', {icon: 3}, function (count) {
			   	layer.close(count);
			    $scope.seatUserService.updatePassword(function (result) {
					if(result == 1){
						validCodeLoad();
					    document.getElementById("capitalAccountPwdResetValidcode").value=""; 
					}else{
					    $scope.ModalPwdEntity = {}; 
					    $scope.find();
					    $("#seatUSerPwdReset").modal("hide");
					    
					    $scope.seatUserService.checkSeat(function (resu) {
					    	var resultCode = resu.resultCode;
					    	if(resultCode == "0"){
					    		var message = "密码修改成功，该席位用户关联的资金账号有效";
					    	}else if(resultCode == "1"){
					    		var message = "密码修改成功，该席位用户关联的资金账号交易通道地址错误";
					    	}else if(resultCode == "2"){
					    		var message = "密码修改成功，该席位用户关联的资金账号账户或账户密码有误";
					    	}else if(resultCode == "3"){
					    		var message = "密码修改成功，该席位用户关联的资金账号授权码错误";
					    	}else if(resultCode == "9"){
					    		var message = "密码修改成功，该席位用户上连的交易所系统错误";
					    	}else if(resultCode == "100"){
					    		var message = "密码修改成功，该席位用户关联的资金账号有效性校验超时";
					    	}else{
					    		var message = "密码修改成功，该席位用户关联的资金账号有效性校验发生系统错误";
					    	}
					    	//layer.msg(message,{icon:1});
					    	layer.confirm(message, {icon: 3}, function (count) {layer.close(count);})
					    },result)
					}
				}, entity,validcode);
		    });
		}else {
			 $scope.seatUserService.updatePassword(function (result) {
				if(result == 1){
					validCodeLoad();
				    document.getElementById("capitalAccountPwdResetValidcode").value=""; 
				}else{
			        $scope.ModalPwdEntity = {}; 
			        $scope.find();
			        $("#seatUSerPwdReset").modal("hide");
			        
			        $scope.seatUserService.checkSeat(function (resu) {
				    	var resultCode = resu.resultCode;
				    	if(resultCode == "0"){
				    		var message = "密码修改成功，该席位用户关联的资金账号有效";
				    	}else if(resultCode == "1"){
				    		var message = "密码修改成功，该席位用户关联的资金账号交易通道地址错误";
				    	}else if(resultCode == "2"){
				    		var message = "密码修改成功，该席位用户关联的资金账号账户或账户密码有误";
				    	}else if(resultCode == "3"){
				    		var message = "密码修改成功，该席位用户关联的资金账号授权码错误";
				    	}else if(resultCode == "9"){
				    		var message = "密码修改成功，该席位用户上连的交易所系统错误";
				    	}else if(resultCode == "100"){
				    		var message = "密码修改成功，该席位用户关联的资金账号有效性校验超时";
				    	}else{
				    		var message = "密码修改成功，该席位用户关联的资金账号有效性校验发生系统错误";
				    	}
				    	//layer.msg(message,{icon:1});
				    	layer.confirm(message, {icon: 3}, function (count) {layer.close(count);})
				    },result)
				}
		    }, entity,validcode);
		}
    };
    
    $("body").undelegate("#seatUser_dynamic_table_wrapper td .delete-row","click");
    //表格中删除的单击事件
    $("body").delegate("#seatUser_dynamic_table_wrapper td .delete-row","click",function(){
	var mytr = $(this).parents("tr");
	    var tempArr = $scope.seatUserTable.row(mytr).data();
	    var id = tempArr[1];
	    $scope.modalSeatUserEntity ={};
	    for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalSeatUserEntity = $scope.listEntitys[i];
        	}
        }
	    
	    $scope.seatUserService.validateAccountSeatUserInfo(function (result) {
	    	if(result != null && result.length > 0){
				layer.msg("该席位用户有对应账号绑定，无法删除",{icon : 2});
				return false;
			}else{
				 layer.confirm('确定删除该席位用户信息？', {icon: 3}, function (count) {
				    	$scope.seatUserService.deleteSeatUser(function (result) {
				    		layer.msg("该席位用户信息删除成功!", {icon : 1,time : 2000});
				            $scope.find();
				        }, id);  
				    });
			}

        }, $scope.modalSeatUserEntity); 
	   
	});
    
    //获取修改权限
    $scope.getUpdatePermision = function(flag){
    	  var result = "";
	  	  if(flag){
	  		  result = "<a class='update-row seatUser_update_row' data-toggle='modal' data-target=' '>重置密码</a>";
	  	  }
	  	  return result;
    }
    
});

