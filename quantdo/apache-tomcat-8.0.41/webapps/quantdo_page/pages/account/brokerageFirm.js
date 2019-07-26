myapp.controller('BrokerageFirmController', function ($scope, $rootScope,$timeout) {
	//调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
    $scope.tempEntity = {};
    $scope.tempEntity.recordIndex = -1;
    $scope.isUpdate = false;
    $scope.tmpName="";
    $scope.tmpId="";
	$scope.codeTypes = [];
    
    $scope.queryBrIds = new Array();
	$scope.seatSystems=clearConstant.seatSystems;
	$scope.apiLinkTypes=clearConstant.apiLinkTypess;
	$scope.linkManagerTypes  =clearConstant.linkManagerTypes

	$scope.brokerageEntitys = {};// 经理公司代码
	$scope.BrokerageFirmDataset = [];
	$scope.seatDataset = [];
	$scope.brokerageFirm_query=isShow("brokerageFirm_query");
	$scope.brokerageFirm_add=isShow("brokerageFirm_add");
	$scope.brokerageFirm_update=isShow("brokerageFirm_update");
	$scope.brokerageFirm_delete=isShow("brokerageFirm_delete");
	$scope.brokerageFirm_set=isShow("brokerageFirm_set");
	$scope.brokerageFirm_channel_add=isShow("brokerageFirm_channel_add");
	$scope.brokerageFirm_channel_update=isShow("brokerageFirm_channel_update");
	$scope.brokerageFirm_channel_delete=isShow("brokerageFirm_channel_delete");

	
    //定义设置经纪公司的固定列头
    $scope.BrokerageFirm_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "经纪公司代码"},
        {title: "经纪公司名称"},
        {title: "创建人"},
        {title: "创建日期"},
        {title: "交易通道"},
        {title: "操作"}
    ]; 
    
  //定义设置固定列头
    $scope.seat_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "通道编码"},
        {title: "通道名称"},
        {title: "通道系统"},
        {title: "经纪公司名称"},
        {title: "会员代码"},
        {title: "appID"},
        {title: "certlInfo"},
        {title: "本地连接地址配置"},
        {title: "上联连接地址配置"},
        {title: "操作"}
    ]; 


 
    //初始化页面信息
    $scope.findAllBrokerageFirms = function(result){
    	getAllBrokerageFirmEntity(function (result) {
    		$scope.listEntitys = result;
            $scope.queryBrIds = angular.copy($scope.listEntitys);
            $scope.brokerageEntitys = result;
            $scope.$apply();
        });
      }
    $scope.findAllBrokerageFirmsWithoutEntity = function(result){
    	getAllBrokerageFirmEntity(function (result) {
    		//$scope.listEntitys = result;
            $scope.queryBrIds = angular.copy(result);
            $scope.brokerageEntitys = result;
            $scope.$apply();
        });
      }

     $scope.findAllBrokerageFirms(); 

/*    //查询
    $scope.find = function (queryEntity) {
        $scope.isQuery = true;
        //clear
        $scope.listEntitys = {};
        findBrokerageFirmEntity(function (result) {
            $scope.listEntitys = result;
            $scope.$apply();
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        }, queryEntity);
    };*/
    
     $("body").undelegate("#brokerage_dynamic_table_wrapper td .my-set","click");
    //表格机构管理员的修改单击事件
    $("body").delegate("#brokerage_dynamic_table_wrapper td .my-set","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.BrokerageFirmTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.initSeatParam($scope.modalEntity.brokerageFirmID,$scope.modalEntity.brokerageFirmName);

    });
    $("body").undelegate("#brokerage_dynamic_table_wrapper td .update-row","click");
        //表格机构管理员的设置单击事件
    $("body").delegate("#brokerage_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.BrokerageFirmTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.initUpdateParam(id,$scope.modalEntity);
    });
    
    $("body").undelegate("#brokerage_dynamic_table_wrapper td .delete-row","click");
    //表格机构管理员的删除事件
    $("body").delegate("#brokerage_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.BrokerageFirmTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.remove(id,$scope.modalEntity);
    });
    
	// 查询(前台分页)
    $scope.find = function(){
    	//将数据集赋值为空
    	$scope.BrokerageFirmDataset = [];
    	//更新表格对应的数据集
    	findBrokerageFirmEntity(function (result) {
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
                operate1 = $scope.getUpdatePermision($scope.brokerageFirm_update,con[i].isMainBroker); 
                operate2 = $scope.getDeletePermision($scope.brokerageFirm_delete,con[i].isMainBroker);
                var tempArr = [(i+1),con[i].id,con[i].brokerageFirmID, con[i].brokerageFirmName,con[i].creator,con[i].createDate
                               ,$scope.getBrokerSetOper($scope.brokerageFirm_set,con[i].isMainBroker),operate1+operate2];
	            $scope.BrokerageFirmDataset.push(tempArr);
	            con[i].index = i+1;
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.BrokerageFirmTable.clear().draw();
            $scope.BrokerageFirmTable.rows.add($scope.BrokerageFirmDataset).draw();
            $scope.$apply();
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        }, $scope.queryEntity);
    };
    $scope.find();
    
    
    findCodetypeApilinktypeRelation(function (result) {
    	$scope.codeTypes = result;
    }, {});
    
    
    

    //获取修改权限
    $scope.getUpdatePermision = function(flag,mainBrokerFlag){
    	  var result = "";
    	  if(flag&&mainBrokerFlag != 1){
    		  result = "<a class='update-row' data-toggle='modal' data-target='#brokerageFirmModal'>修改</a>";
    	  }
    	  return result;
    };
    //获取删除权限
    $scope.getDeletePermision = function(flag,mainBrokerFlag){
    	  var result = "";
    	  if(flag&&mainBrokerFlag != 1){
    		  result = "<a class='delete-row' >删除</a>";
    	  }
    	  return result;
    }
    //获取设置权限   
    $scope.getBrokerSetOper = function(flag,mainBrokerFlag){
    	var result = "";
    	if(flag&&mainBrokerFlag != 1){
    		result = "<a class='my-set'  data-toggle='modal' data-target='#seatFirmModal'>设置</a>" ;
    	}
    	return result;
    }
    
    $("body").undelegate("#seat_dynamic_table_wrapper td .in-update-row","click");
    //表格机构管理员的修改单击事件
    $("body").delegate("#seat_dynamic_table_wrapper td .in-update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.seatTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.seatListEntitys.length;i++){
        	if(id==$scope.seatListEntitys[i].id){
        		$scope.modalEntity = $scope.seatListEntitys[i];
        	}
        }
        $scope.initSeatUpdateParam(id,$scope.modalEntity);
    });
    $("body").undelegate("#seat_dynamic_table_wrapper td .in-delete-row","click");
    //表格机构管理员的删除单击事件
    $("body").delegate("#seat_dynamic_table_wrapper td .in-delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.seatTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.seatListEntitys.length;i++){
        	if(id==$scope.seatListEntitys[i].id){
        		$scope.modalEntity = $scope.seatListEntitys[i];
        	}
        }
        $scope.removeSeat(id,$scope.modalEntity);
    });
    $scope.initSeatParam = function (brokerageFirmID,brokerageFirmName) {
	   	 //初始化通道页面信息
	   	$scope.tmpName="";
	   	$scope.tmpId="";
	   	$scope.tmpName=brokerageFirmName;
	   	$scope.tmpId=brokerageFirmID;
	   	$scope.findSet({brokerageFirmID:brokerageFirmID});
    }
   
    
    $scope.findSet = function(brokerageFirmID){
    		$scope.seatDataset = [];
	    	findSeatEntity(function (result) {
	    		$scope.seatListEntitys = result;
	    	    var con = result;
		   		if(con!=undefined){
		   			for(var i = 0; i<con.length;i++){
		   				
		   				
		   				   var operate1 = $scope.getChannelUpdatePer($scope.brokerageFirm_channel_update);
		   				   var operate2 = $scope.getChannelDeletePer($scope.brokerageFirm_channel_delete);
			           	   operate = "<a class='in-update-row' data-toggle='modal' data-target='#brokSeatModal'>修改</a><a class='in-delete-row'>删除</a>";
			               var tempArr = [(i+1),con[i].id,con[i].seatID, con[i].seatName,$scope.transSeatSystems(con[i].seatSystem),$scope.transBrokerage(con[i].brokerageFirmID)
			                              ,con[i].memberID,con[i].appID,con[i].certlInfo,con[i].ipAddress,con[i].fatherIpAddress, operate1+operate2];
				           con[i].index = i+1; 
			               $scope.seatDataset.push(tempArr);
		             }
		   		}else{
		   		}
		   		$scope.seatListEntitys = con;
		        //重新绘表
				$scope.seatTable.clear().draw();
				$scope.seatTable.rows.add($scope.seatDataset).draw();
	            $scope.$apply();
	     },brokerageFirmID);
    };
	$('#seatFirmModal').on('shown.bs.modal', function () {
		$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
	});
    
    //获取修改权限
    $scope.getChannelUpdatePer = function(flag){
    	  var result = "";
    	  if(flag){
    		  result = "<a class='in-update-row' data-toggle='modal' data-target='#brokSeatModal'>修改</a>";
    	  }
    	  return result;
    }
    //获取删除权限
    $scope.getChannelDeletePer = function(flag){
    	  var result = "";
    	  if(flag){
    		  result = "<a class='in-delete-row' >删除</a>";
    	  }
    	  return result;
    }


    //删除
    $scope.remove = function (index, entity) {
        layer.confirm('确定删除？', {icon: 3}, function (count) {
        	//查询经纪公司关联资金账号
        	var id =entity.brokerageFirmID;
        	findCapAccByBrokerId(function (result) {
        	
                if (result !=null && result.length > 0) {
                	  layer.msg("该经纪公司关联资金账号，不允许删除", {icon: 2, time: 3000});
                      return false;
                } else {
                	 deleteBrokerageFirmEntity(entity.id);
                	 deleteSeatEntity(entity.brokerageFirmID);
                     $scope.listEntitys.splice(index, 1);
                     layer.close(count);
                     $scope.queryBrIds = angular.copy($scope.listEntitys);
                     $timeout(function() {
                    	 $scope.find();
                    	 $scope.findAllBrokerageFirms(); 
                     }, 500);
                     $scope.$apply();
                }
            }, id);
        });
    };

    function formValidateReset() {
        $scope.myForm.brokerageFirmID.$setPristine();
        $scope.myForm.brokerageFirmName.$setPristine();
    }

    //初始化模态窗
    $scope.initParameter = function () {
        //设置资产单元
        $scope.ModalEntity = {};
        formValidateReset();
        $scope.isUpdate = false;
        $timeout(function() {
        	document.getElementById("brokerageFirmID").focus();
          }, 500);
    };

    //修改
    $scope.initUpdateParam = function (index, entity) {
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        formValidateReset();
        $scope.isUpdate = true;
        $timeout(function() {
        	document.getElementById("brokerageFirmName").focus();
          }, 500);
    };

    // 保存操作记录
    $scope.saveBroker = function (entity) {
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        //增加
        if (index == undefined) {
        	findBrokerageFirmEntity(function (result) {
                if (result.length == 0) {
                    saveBrokerageFirmEntity(function (result) {
                        $scope.listEntitys.push(result);
                        $scope.queryBrIds = angular.copy($scope.listEntitys);
                        
                        $scope.find();
                        $scope.findAllBrokerageFirms(); 
                        $scope.$apply();
                      //关闭窗口
                        $("#brokerageFirmModal").modal("hide");
                    }, entity);
                } else {
                    layer.msg("新增经纪公司已存在", {icon: 2, time: 3000});
                    return false;
                }
            }, {brokerageFirmID: entity.brokerageFirmID});
            //修改
        } else {
            updateBrokerageFirmEntity(function (result) {
            	result.index = tableIndex;
                $scope.listEntitys.splice(tableIndex-1, 1, result);
                $scope.brokerageEntitys.splice(tableIndex-1, 1, result);
                $scope.BrokerageFirmTable.cells().every( function () {
                    if((tableIndex-1) == this[0][0].row){
                        if(this[0][0].column == 3){
                            this.data(entity.brokerageFirmName);
                            $scope.$apply();
                        }
                    }

                } );
                $scope.queryBrIds = angular.copy($scope.listEntitys);
                /*$scope.find();*/
                $scope.findAllBrokerageFirmsWithoutEntity(); 
              //关闭窗口
                $("#brokerageFirmModal").modal("hide");
            }, entity);
        }
    };
   
	getAllSeatEntity(function(result) {
		$scope.seatListAllEntitys = result;
		$scope.$apply();
	});
    
    	// 初始化通道模态窗
		$scope.initSeatParameter = function() {
			document.getElementById('show').style.display='none'
			$scope.isUpdate = false;
			$scope.isyisheng = false;
			$scope.isctp = false;
			$scope.SeatModalEntity={};
//			$scope.tempEntity = angular.copy(entity);
//			$scope.ModalEntity = angular.copy($scope.tempEntity);
//			$scope.seatSystem = angular.copy($scope.listEntitys);
//			console.log($scope.tempEntity);
			$scope.SeatModalEntity.apiLinkType = $scope.apiLinkTypes[0].key;
			$scope.SeatModalEntity.seatSystem = $scope.seatSystems[0].key;
			$scope.SeatModalEntity.linkManagerType=$scope.linkManagerTypes[0].key;
			$scope.SeatModalEntity.brokerageFirmID ="";
			$scope.SeatModalEntity.brokerageFirmID =$scope.tmpId;
			$scope.SeatModalEntity.exchID = "";
			$scope.seatSystemSelect($scope.SeatModalEntity.seatSystem);
			seatFormValidateReset();
			$timeout(function() {
				document.getElementById("brokerageFirmID").focus();
			}, 500);
			  $scope.showApiLinkType=false;
			
		};
		function seatFormValidateReset() {
			$scope.mySeatForm.seatSystem.$setPristine();
			$scope.mySeatForm.seatName.$setPristine();
			$scope.mySeatForm.ipAddress.$setPristine();
			$scope.mySeatForm.brokerageFirmID.$setPristine();
			$scope.mySeatForm.memberID.$setPristine();
			
		}
		$scope.isctp = false;
		$scope.isyisheng = false;
		$scope.seatSystemSelect = function (seatSystem) {
	       if(seatSystem == 4 || seatSystem == 1 ){
	    	   if(seatSystem == 4){
	    		   $scope.isyisheng =true;
                   $scope.isctp =false;
	    	   }
	    	   if(seatSystem == 1){
                   $scope.isyisheng =false;
	    		   $scope.isctp =true;
	    	   }
	       }else {
	    	   $scope.isyisheng = false; 
	    	   $scope.isctp = false;
	    	   $scope.SeatModalEntity.appID="";
	    	   $scope.SeatModalEntity.certlInfo="";
	       }
	       if(seatSystem == 5){
	    	   $scope.showApiLinkType=true;
	    	   $scope.SeatModalEntity.apiLinkType= $scope.apiLinkTypes[0].key;
	       }else {
	    	   $scope.showApiLinkType=false;
	    	   $scope.SeatModalEntity.apiLinkType="2";
	       }
	       findCodetypeApilinktypeRelation(function (result) {
		       	$scope.codeTypes = result;
		       	$scope.SeatModalEntity.codeType="";
		        if ($scope.codeTypes != null &&	$scope.codeTypes.length > 0){
		        	$scope.SeatModalEntity.codeType = $scope.codeTypes[0].codeType ;
		        }
		        $scope.$apply();
		   }, {seatSystem : seatSystem});
	    };

		
		//  初始化修改通道模态窗
		$scope.initSeatUpdateParam = function(index, entity) {
			document.getElementById('show').style.display='block';
			//$secop.isOK=true;
			$scope.isUpdate = true;
			$scope.SeatModalEntity ={};
			$scope.tempEntity = angular.copy(entity);
			$scope.tempEntity.recordIndex = index;
			$scope.SeatModalEntity = angular.copy($scope.tempEntity);
			$scope.SeatModalEntity.reSeatPassword=entity.seatPassword;
			//为查重校验  seatSystem   seatName   ipAddress
			$scope.temSeatSystem= $scope.SeatModalEntity.seatSystem;
			$scope.temSeatName= $scope.SeatModalEntity.seatName;
			$scope.temIpAddress= $scope.SeatModalEntity.ipAddress;
			$scope.temFatherIpAddress= $scope.SeatModalEntity.fatherIpAddress;
			 findCodetypeApilinktypeRelation(function (result) {
			       	$scope.codeTypes = result;
					$scope.$apply();
			       }, {seatSystem : $scope.temSeatSystem});
			/*//当交易系统为CTP时，会员代码不能为空
			if(entity.seatSystem==1){
				$scope.isShow=false;
			}else{
				$scope.isShow=true;
			}
			//通道类型
			if(entity.apiLinkType == 1){
				$scope.isOK=false;
			}else{
				$scope.isOK=true;
			}*/
			if(entity.seatSystem==4){
				$scope.isyisheng = true;
			}else{
				$scope.isyisheng = false;
			}
			if(entity.seatSystem==1){
				$scope.isctp = true;
			}else{
				$scope.isctp = false;
			}
			if($scope.temSeatSystem==5 ){
				$scope.showApiLinkType = true;
			}else{
				$scope.showApiLinkType = false;
			}
			
			
			seatFormValidateReset();
			$timeout(function() {
				document.getElementById("seatName").focus();
			}, 500);
		};
		
		
		// 转换通道系统
		$scope.transSeatSystems = function(key){
			for(var i = 0;i < $scope.seatSystems.length;i++){
				if($scope.seatSystems[i].key == key){
					return $scope.seatSystems[i].text;
				}
			}
		};
		// 页面经纪公司代码转换经纪公司名称
	    $scope.transBrokerage = function (text) {
	        var count = $scope.brokerageEntitys.length;
	        for (var i = 0; i < count; i++) {
	            if ($scope.brokerageEntitys[i].brokerageFirmID == text) {
	                return $scope.brokerageEntitys[i].brokerageFirmName;
	            }
	        }
	    };
	    
	    
	 // 页面经纪公司代码转换经纪公司名称
	    $scope.transLinkManagerTypes = function (text) {
	        var count = $scope.linkManagerTypes.length;
	        var result ="";
	        for (var i = 0; i < count; i++) {
	            if ($scope.linkManagerTypes[i].key == text) {
	            	result =  $scope.linkManagerTypes[i].text;
	            }
	        }
	        return result;
	    };
	    
	 // 保存操作记录
		$scope.saveSeat = function(entity) {
			var index = entity.recordIndex;
			var tableIndex = entity.index;
			//当交易系统为CTP时，会员代码不能为空
			if(entity.seatSystem==1 && entity.memberID==undefined){
				layer.msg("当交易系统为CTP时，会员代码不能为空！", {
					icon : 2,
					time : 2000
				});
				return false;
			}
			//当交易系统为QDIAM时，会员代码不能为空
			if(entity.seatSystem==15 && entity.memberID==undefined){
				layer.msg("当交易系统为QDIAM时，会员代码不能为空！", {
					icon : 2,
					time : 2000
				});
				return false;
			}
			
			//当交易系统为QDP时，会员代码不能为空
			if((entity.seatSystem==0 || entity.seatSystem==18) && entity.memberID==undefined){
				layer.msg("当交易系统为QDP以及QDP外盘时，会员代码不能为空！", {
					icon : 2,
					time : 2000
				});
				return false;
			}
			/*//当交易系统为QDP时，是否从上层获取合约 必须是默认
			if(entity.seatSystem==0 && entity.linkManagerType==2){
				layer.msg("当交易系统为QDP时，报盘接入方式必须是默认！", {
					icon : 2,
					time : 2000
				});
				return false;
			}*/
			/*if(entity.seatSystem == 0 || entity.seatSystem==18){
				entity.linkManagerType = 1;
			}else{
				entity.linkManagerType = 2;
			}*/
			
			entity.linkManagerType = 2;
			//当交易系统为易盛外盘时，会员代码不能为空
			if(entity.seatSystem==4){
				if(entity.certlInfo==undefined || entity.certlInfo.length==0 ){
					layer.msg("当交易系统为易盛外盘时，certlInfo不能为空！", {
						icon : 2,
						time : 2000
					});
					return false;
				}
				if(entity.appID==undefined || entity.appID.length==0 ){
					layer.msg("当交易系统为易盛外盘时，appID不能为空！", {
						icon : 2,
						time : 2000
					});
					return false;
				}
			}
			if(entity.seatSystem==4 || entity.seatSystem==6 ||  entity.seatSystem==8 || entity.seatSystem== 11 || entity.seatSystem== 17  ){
				if(entity.codeType ==undefined || entity.codeType==""){
					layer.msg("当交易系统为易盛、PATS、CQG、直达、Rithmic 时，合约转换类型不能为空！", {
						icon : 2,
						time : 2000
					});
					return false;
				}
				
			}
			
/*			if(entity.ipAddress==undefined   && entity.fatherIpAddress == undefined ){
				layer.msg("本地连接地址,上联连接地址 必须至少配置一条！", {
					icon : 2,
					time : 2000
				});
				return false;
			}*/
			
			var ipAdd= "";
		    if(entity.ipAddress !=undefined  &&  entity.ipAddress.length!=0 ){
				var ips  =entity.ipAddress.split(",");
				  for (i = 0; i < ips.length; i++) {
					  ipAdd =ipAdd+"l=tcp://"+ips[i]+",";
				   }
				  //去除，号
				  if(ips.length >0){
					  ipAdd = ipAdd.substring(0,ipAdd.length-1);
				  }

			}
			
			
			var fathIpAdd= "";
			if(entity.fatherIpAddress !=undefined  ){
				var ips  =entity.fatherIpAddress.split(",");
				  for (i = 0; i < ips.length; i++) {
					  fathIpAdd =fathIpAdd+"f=tcp://"+ips[i]+",";
				   }
				  //去除，号
				  if(ips.length >0){
					  fathIpAdd = fathIpAdd.substring(0,fathIpAdd.length-1);
				  }

			}
			entity.ipAddString="";
			if(ipAdd.length>1 ){
				entity.ipAddString=ipAdd;
			}
			if(fathIpAdd.length>1 ){
				 if(entity.ipAddString.length>1){
					 entity.ipAddString =entity.ipAddString +"," +fathIpAdd;
				 }else{
					 entity.ipAddString =fathIpAdd;	 
				 }
			}
		    

			
			// 增加
			if (index == undefined) {
				findSameSeatEntity(function(resultEntity) {
				    if (resultEntity != null && resultEntity.length > 0) {
	                    layer.msg("相同交易线路信息已存在，请重新输入", {icon: 2});
	                    return false;
	                }else{
	        			entity.isActive = '1';
	    				//判断是否有数据
	    				if ($scope.seatListAllEntitys.length == 0) {
	    					entity.seatID = "1";
	    				}else{
	    					for (var i = 0; i < $scope.seatListAllEntitys.length; i++) {
	    							$scope.seatID = $scope.seatListAllEntitys[$scope.seatListAllEntitys.length-1].seatID;
	    							seatID = parseInt($scope.seatID);
	    							entity.seatID = seatID + 1;
	    					}
	    				}
	    				
	    				saveSeatEntity(function(result) {
	    					$scope.seatListEntitys.unshift(result);
	    					$scope.seatListAllEntitys.push(result);
	    					$scope.queryBrIds = angular.copy($scope.seatListEntitys);
	    					checkIP(function(res){
	    						if(res == true){
	    							layer.alert('交易线路信息保存成功,IP地址连接成功!', {icon: 1});
	    						}else{
	    							layer.alert('交易线路信息保存成功,但IP地址有误无法连接。', {icon: 2});
	    						}
	    					},entity.ipAddString);
	    					$scope.findSet({brokerageFirmID :entity.brokerageFirmID });
	    				}, entity);
	    				// 关闭窗口
	    				$("#brokSeatModal").modal("hide");
	    				
	                }
				}, entity);
			} else {
				var temBool=false;
				if($scope.temSeatSystem != entity.seatSystem){
					temBool=true;
				} else if($scope.temSeatName != entity.seatName){
					temBool=true;
				} else if ($scope.temIpAddress!= entity.ipAddress){
					temBool=true;
				} else if($scope.temFatherIpAddress != entity.fatherIpAddress){
					temBool=true;
				} 
				if(temBool){
					findSameSeatEntity(function(resultEntity) {
						
					    if (resultEntity != null && resultEntity.length > 0) {
		                    layer.msg("相同交易线路信息已存在，请重新输入", {icon: 2});
		                    return false;
		                }else{
		                	$scope.isUpdate = true;
							updateSeatEntity(function(result) {
								result.index = tableIndex;
								$scope.seatListEntitys.splice(tableIndex-1, 1, result);
								$scope.seatTable.cells().every( function () {
				                    if((tableIndex-1) == this[0][0].row){
				                        if(this[0][0].column == 3){
				                            this.data(entity.seatName);
				                            $scope.$apply();
				                        }
				                        if(this[0][0].column == 4){
				                            this.data($scope.transSeatSystems(entity.seatSystem));
				                            $scope.$apply();
				                        }
				                        if(this[0][0].column == 5){
				                            this.data($scope.transBrokerage(entity.brokerageFirmID));
				                            $scope.$apply();
				                        }
				                        if(this[0][0].column == 6){
				                            this.data(entity.memberID);
				                            $scope.$apply();
				                        }
				                        if(this[0][0].column == 7){
				                            this.data(entity.appID);
				                            $scope.$apply();
				                        }
				                        if(this[0][0].column == 8){
				                            this.data(entity.certlInfo);
				                            $scope.$apply();
				                        }
				                        if(this[0][0].column == 9){
				                            this.data(entity.ipAddress);
				                            $scope.$apply();
				                        }
				                        if(this[0][0].column == 10){
				                            this.data(entity.fatherIpAddress);
				                            $scope.$apply();
				                        }
				                        if(this[0][0].column == 11){
				                            this.data($scope.transLinkManagerTypes(entity.linkManagerType));
				                            $scope.$apply();
				                        }
				                    }
				                    
								} );
								$scope.queryBrIds = angular.copy($scope.seatListEntitys);
								//$scope.findSet({brokerageFirmID :entity.brokerageFirmID });
								checkIP(function(res){
									if(res == true){
		    							layer.alert('交易线路信息保存成功,IP地址连接成功!', {icon: 1});
		    						}else{
		    							layer.alert('交易线路信息保存成功,但IP地址有误无法连接。', {icon: 2});
		    						}
		    					},entity.ipAddString);
							}, entity);
							// 关闭窗口
							$("#brokSeatModal").modal("hide");
		                }
					}, entity);
				}else {
					
					$scope.isUpdate = true;
					updateSeatEntity(function(result) {
						result.index = tableIndex;
						$scope.seatListEntitys.splice(tableIndex-1, 1, result);
						$scope.queryBrIds = angular.copy($scope.seatListEntitys);
						$scope.seatTable.cells().every( function () {
		                    if((tableIndex-1) == this[0][0].row){
		                        if(this[0][0].column == 3){
		                            this.data(entity.seatName);
		                            $scope.$apply();
		                        }
		                        if(this[0][0].column == 4){
		                            this.data($scope.transSeatSystems(entity.seatSystem));
		                            $scope.$apply();
		                        }
		                        if(this[0][0].column == 5){
		                            this.data($scope.transBrokerage(entity.brokerageFirmID));
		                            $scope.$apply();
		                        }
		                        if(this[0][0].column == 6){
		                            this.data(entity.memberID);
		                            $scope.$apply();
		                        }
		                        if(this[0][0].column == 7){
		                            this.data(entity.appID);
		                            $scope.$apply();
		                        }
		                        if(this[0][0].column == 8){
		                            this.data(entity.certlInfo);
		                            $scope.$apply();
		                        }
		                        if(this[0][0].column == 9){
		                            this.data(entity.ipAddress);
		                            $scope.$apply();
		                        }
		                        if(this[0][0].column == 10){
		                            this.data(entity.fatherIpAddress);
		                            $scope.$apply();
		                        }
		                        if(this[0][0].column == 11){
		                            this.data($scope.transLinkManagerTypes(entity.linkManagerType));
		                            $scope.$apply();
		                        }
		                    }

						} );
						//$scope.findSet({brokerageFirmID :entity.brokerageFirmID });
					}, entity);
					// 关闭窗口
					$("#brokSeatModal").modal("hide");
				}

			}
			
		};

		// 删除
		$scope.removeSeat = function(index, entity) {
			layer.confirm('删除交易通道会影响该用户的交易委托以及关联的席位用户，确认删除吗？', {
				icon : 3
			}, function(count) {
				deleteSeat(entity.id);
				$scope.seatListEntitys.splice(index, 1);
				layer.close(count);
				$scope.queryBrIds = angular
						.copy($scope.seatListEntitys);
				$timeout(function() {
					$scope.findSet({brokerageFirmID:entity.brokerageFirmID});
				}, 500);
				$scope.$apply();
			});
		};
		
		 //修改密码
	    $scope.updateResetPwd = function (entity) {
	        if(entity.seatPassword != entity.reSeatPassword){
	            layer.msg("2次输入的密码不一致。",{icon:2});
	            return ;
	        }
	        $scope.ModalTemPwdEntity.seatPassword=entity.seatPassword;
	        entity=$scope.ModalTemPwdEntity;
	        updateSeatEntity(function(result) {
                layer.msg("修改成功",{icon:1});
                $scope.ModalPwdEntity = {}; 
                $("#broSeatPwdReset").modal("hide");
            }, entity);
	    };
	    //密码重置
	    $scope.pwdReset = function(entity){
	        $scope.ModalTemPwdEntity= entity; 
	        $scope.ModalPwdEntity =  $scope.ModalTemPwdEntity;
	        $scope.ModalPwdEntity.seatPassword = undefined;
	        $scope.ModalPwdEntity.reSeatPassword = undefined;
	    };
	    
	    $scope.quit = function(){
	    	 $("#brokSeatModal").modal("hide");
	    }
	    
	    //初始化
	    $(document).ready(function() {
	    	//会话列表初始化
	    	$scope.BrokerageFirmTable = $('#brokerage_dynamic_table').DataTable( {
	    		data : $scope.BrokerageFirmDataset,
	        	columns :$scope.BrokerageFirm_columns,
//	        	scrollY: 300,
//	          scrollX: true,
	            dom: 'rt<"bottom"iplB>',
	            fixedColumns:   {
	                leftColumns: 0,
	                rightColumns: 1
	            },
				buttons: [
/*				    {
				        text: '导出',
				    }*/
				]
	        } );
			$scope.seatTable = $('#seat_dynamic_table').DataTable( {
				data : $scope.seatDataset,
				columns :$scope.seat_columns,
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

