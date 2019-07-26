
myapp.controller('fundProductController', function ($scope,$rootScope, $timeout) {

    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;

	$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
   
    $scope.tempFundProduct = {};
    $scope.tempFundProduct.updateIndex = -1;
    $scope.listEntitys = new Array();
    $scope.instClientlistEntitys=[];
    $scope.canClick =false;
    $scope.queryEntity = {};
    $scope.fundProductTypes=clearConstant.fundProductType;
    $scope.linkAccountTypes=clearConstant.linkAccountType;
    
    $scope.productDataset = [];
    
    $scope.isInstClient = true;
    var nowDate = clearConstant.formatDate(new Date());
    
    // 按钮权限
    $scope.fundProduct_add = isShow("fundProduct_add");
    $scope.fundProduct_update = isShow("fundProduct_update");
    $scope.fundProduct_detail = isShow("fundProduct_detail");
    $scope.workflow_set = isShow("workflow_set");   
    $scope.workflow_add = isShow("workflow_add");
    $scope.workflow_update = isShow("workflow_update");
    $scope.workflow_delete = isShow("workflow_delete");
    $scope.risknode_set = isShow("risknode_set");
    $scope.risknode_add = isShow("risknode_add");
    $scope.risknode_update = isShow("risknode_update");
    $scope.risknode_rightset = isShow("risknode_rightset");
    $scope.risknode_delete = isShow("risknode_delete");

    
    //初始化页面记录
    getAllFundProductEntity(function (result) {
        $scope.fundProducts = result;
//        $scope.listEntitys = angular.copy($scope.fundProducts);
        $scope.$apply();
    });
    //初始化机构信息
    $scope.instClientService.findByQuery(function (result) {
        $scope.instClientlistEntitys = result;
        $scope.$apply();
    },{});
    
    //机构名称转换
    $scope.transInstClient = function (instClientID) {
    	for(var i = 0;i < $scope.instClientlistEntitys.length; i++){
    		if($scope.instClientlistEntitys[i].instClientID == instClientID){
    			return $scope.instClientlistEntitys[i].instClientAbbrName;
    		}
    	}
    }
    
    $scope.amType = '';
    queryAmType(function (result) {
        $scope.amType = result;
        $scope.$apply();
    });
    
    $scope.instClientID = '';
    queryInstClientID(function (result) {
        $scope.instClientID = result;
        $scope.queryEntity={};
        if($scope.instClientID != undefined ){
        	$scope.isInstClient = true;
        	 $scope.queryEntity.instClientID=$scope.instClientID;
        	 $scope.querySelect($scope.queryEntity.instClientID);
        }else{
            $scope.querySelect(null);
        	$scope.isInstClient = false;
        }
        
        $scope.$apply();
    });
    
    //初始化查询选项
    $scope.datas = [
        {text: '全部', key: ''},
        {text: '否', key: '0'},
        {text: '是', key: '1'}
    ];
   // var d = new Date();
	//var currentDate = d.getFullYear() + "" + (d.getMonth() + 1) + "" + (d.getDate() + 1);

	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,
	    autoclose: true,
	    clearBtn: true,
	    todayHighlight: true,
	    format: 'yyyymmdd',
		//startDate:currentDate
		date :new Date()
	}); 
	
	 var d = new Date();
	var currentDate = d.getFullYear() + "" + (d.getMonth() + 1) + "" + (d.getDate() + 1);

	$("[forType='endDate']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,
	    autoclose: true,
	    clearBtn: true,
	    todayHighlight: true,
	    format: 'yyyymmdd',
		startDate:currentDate
	});   
/*    //设置默认选中
    $scope.queryEntity = {'isActive': $scope.datas[0].key};*/

    //重置表单验证信息
    function formValidateReset() {
        $scope.myForm.fundProductID.$setPristine();
        $scope.myForm.shortProductName.$setPristine();
        $scope.myForm.fundProductName.$setPristine();
        $scope.myForm.fundProductType.$setPristine();
        $scope.myForm.productManage.$setPristine();
        $scope.myForm.productAdmin.$setPristine();
        $scope.myForm.productDeposit.$setPristine();
        $scope.myForm.productAdminFee.$setPristine();
        $scope.myForm.productDepositFee.$setPristine();
        $scope.myForm.instClientID.$setPristine();
        $scope.myForm.startDate.$setPristine();
        $scope.myForm.fundProductQuota.$setPristine();
        $scope.myForm.endDate.$setPristine();
        
    }

    //初始化模态框页面参数
    $scope.initParameter = function () {
        $scope.ModalEntity = {};
        $scope.showEndDate= false;
        $scope.ModalEntity.fundProductType = $scope.fundProductTypes[0].key;
//        $scope.ModalEntity.defaultMode = $scope.defaultModes[1].key;
        $scope.ModalEntity.productAdminFee = 0;
        $scope.ModalEntity.productDepositFee = 0;
        $scope.ModalEntity.linkAccountType = $scope.linkAccountTypes[0].key;
        //设置默认选中
        formValidateReset();
        $scope.isUpdate = false;
        $scope.isDetail = false;
       
        if($scope.instClientID != undefined ){
        	$scope.isInstClient = true;
        	 $scope.ModalEntity.instClientID =$scope.instClientID;
        }else{
        	$scope.isInstClient = false;
        }
        findAvaliableFundProductID(function (result) {
        	$scope.ModalEntity.fundProductID=result;
        });
        
        
        
        $timeout(function() {
        	document.getElementById("fundProductID").focus();
          }, 500);
        //设置窗口显示位置
        $('#fundProductModal').on('show.bs.modal', function (e) {
            $(this).find('.modal-dialog').css({
                'margin-top': function () {
                    var modalHeight = $('#fundProductModal').find('.modal-dialog').height();
                    return ($(window).height() / 2 - 300);
                }
            });
        });
    };

    //修改初始化页面参数
    $scope.initUpdate = function (index, obj) {
    	$scope.tempFundProduct = angular.copy(obj);
        $scope.tempFundProduct.updateIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempFundProduct);
        formValidateReset();
        $scope.isUpdate = true;
        $scope.isDetail = false;
        //到期产品不可修改到期日

        var endDate = obj.endDate;
		if(endDate != undefined && endDate.length>0 && endDate <= nowDate){
			 $scope.showEndDate= true;
		}else {
		    $scope.showEndDate= false;
		}

        $timeout(function() {
        	document.getElementById("shortProductName").focus();
          }, 500);
    };
    //详情初始化页面参数
    $scope.initDetial = function (obj) {
    	$scope.tempFundProduct = angular.copy(obj);
        $scope.ModalEntity = angular.copy($scope.tempFundProduct);
        formValidateReset();
        $scope.isDetail = true;
        $scope.isUpdate = true;
        
        $timeout(function() {
        	document.getElementById("shortProductName").focus();
          }, 500);
    };

    //删除
    $scope.remove = function (fundProduct, index) {
        //使用内置Index
    	layer.confirm('确定注销此产品信息吗？', {icon: 3}, function (count) {
    		isConnectedwithCapitalAccount(function (result){
    			if(result.length>0){
    				layer.msg("产品与资金帐号有对应，不能注销", {icon: 2, time: 3000});
    				return false;
    			}else{
    				fundProduct.isActive = '0';
    	            updateFundProduct(function (result) {
    	                $scope.listEntitys.splice(index, 1, result);
    	                $scope.$apply();
    	            }, fundProduct);
    			}
    		}, fundProduct);
            layer.close(count);
        });
    };

    $scope.rebuild = function (fundProduct, index) {
        layer.confirm('确定重新启用此产品信息吗？', {icon: 3}, function (count) {
        	fundProduct.isActive = '1';
        	updateFundProduct(function (result) {
                $scope.listEntitys.splice(index, 1, result);
                $scope.$apply();
            }, fundProduct);
            layer.close(count);
        });
    };

    //产品查询
//    $scope.find = function (object) {
//        $scope.isQuery = true;
//        $scope.listEntitys = {};
//        findFundProduct(function (result) {
//            $scope.listEntitys = result;
//            $timeout(function() {
//                $scope.isQuery = false;
//            }, 1000);
//        }, object);
//    };

    //新增
    $scope.save = function (entity) {
    	$scope.canClick=true;
        var productAdminFee = entity.productAdminFee;
        var productDepositFee = entity.productDepositFee;
        var fundProductQuota = entity.fundProductQuota;
        /*if(entity.startDate != undefined || entity.startDate != null){
        	$scope.canClick=false;
			layer.msg("开始日期不可为空！", {
				icon : 2,
				time : 2000
			});
			return false;
        }*/
        
        if(productAdminFee != undefined || productAdminFee != null){
			 var filter  =/^\d{1,2}(\.\d{0,6})?$/;
			 if (filter.test(productAdminFee)){
				 
			 }  else {
				 $scope.canClick=false;
				 layer.msg("产品管理费为0到100有效数字且最多六位小数！", {
					icon : 2,
					time : 2000
				});
				return false;
			 }
		}else{
			entity.productAdminFee="0";
		}
        if(productDepositFee != undefined || productDepositFee != null){
			 var filter  =/^\d{1,2}(\.\d{0,6})?$/;
			 if (filter.test(productDepositFee)){
				 
			 }  else {
			 $scope.canClick=false;
			 layer.msg("产品托管费为0到100有效数字且最多六位小数！", {
					icon : 2,
					time : 2000
				});
				return false;
			 }
		}else{
			entity.productDepositFee="0";
		}
    	if(fundProductQuota==0){
    		 $scope.canClick=false;
    		layer.msg("产品份额不能为零", {icon: 2, time: 3000});
			return false;
			
    	}
    	if(entity.endDate !=undefined && entity.endDate !="" ){
	    	if(entity.startDate > entity.endDate){
	    		$scope.canClick=false;
	    		layer.msg('开始日期不能大于到期日期！', {
					icon : 2
				});
				return false;
	    	}
    	}
    	
    	if(entity.notOpenDate !=undefined && entity.notOpenDate !="" ){
    		if(entity.startDate > entity.notOpenDate){
    			$scope.canClick=false;
        		layer.msg('暂停开仓日期不能小于开始日期！', {
    				icon : 2
    			});
    			return false;
        	}
    		if(entity.endDate !=undefined && entity.endDate !="" ){
    			if(entity.notOpenDate > entity.endDate){
    				$scope.canClick=false;
            		layer.msg('暂停开仓日期不能大于到期日期！', {
        				icon : 2
        			});
        			return false;
            	}
        	}
    		
    	}

        var index = entity.updateIndex;
        var tableIndex = entity.index;
        // 固定工作流方式为2 手动,无实际意义，产品默认方式无用
        entity.defaultMode = '2';
        
        //修改
        if (index != undefined) {
            delete entity.updateIndex;
            
            updateFundProduct(function (result) {
            	result.index = tableIndex;
            	$scope.listEntitys.splice(tableIndex-1, 1, result);  
	      		
            	var states ="正常";
        		var endDate = entity.endDate;
    			if(endDate != undefined && endDate.length>0 && endDate <= nowDate){
    				states="到期";
    			}
    			
        		$scope.productTable.cells().every( function () {
                    if((tableIndex-1) == this[0][0].row){
                        if(this[0][0].column == 4){
                            this.data(entity.shortProductName);
                            $scope.$apply();
                        }
                    }
                    
                    if((tableIndex-1) == this[0][0].row){
                        if(this[0][0].column == 8){
                            this.data(states);
                            $scope.$apply();
                        } 
                    }

	            });
            	//$scope.find($scope.queryEntity);
                $("#fundProductModal").modal("hide");
                
            }, entity);
            //新增
        } else {
        	findFundProduct(function (result) {
                if (result.length > 0) {
               	    $scope.canClick=false;
                    layer.msg("产品编号已使用，请重新输入", {icon: 2, time: 3000});
                    return false;
                } else {
                	entity.isActive='1';
                    saveFundProduct(function (result) {
                    	$scope.find($scope.queryEntity);
                        $scope.$apply();
                        $("#fundProductModal").modal("hide");
                    }, entity);
                }
            }, {fundProductID: entity.fundProductID,instClientID: entity.instClientID});
        }
        $timeout(function() {
            $scope.canClick = false;
        }, 2000); 
    }
    
    // 转换产品类型
	$scope.transFundProductType = function(key){
		for(var i = 0;i < $scope.fundProductTypes.length;i++){
			if($scope.fundProductTypes[i].key == key){
				return $scope.fundProductTypes[i].text;
			}
		}
	};
	
    $scope.isInstClientSelect = function (instClientId) {
    	isInstClientSelect(function (result) {
        	$scope.ModalEntity.fundProductID=result;
        	$scope.$apply();
        },instClientId);
    };
    
    $scope.fundProductTems=[];

    $scope.querySelect = function (instClientId) {
    	$scope.fundProductTems=[];
    	findFundProduct(function (result) {
        	$scope.fundProductTems=result;
        	$scope.$apply();
        },{instClientID:instClientId});
    };

    
    //------------------风控节点-------------------------------------------
    $scope.certainFundProduct={};//用于保存某一产品对象，以在其上添加节点时与该产品id进行关联
    $scope.certainRiskNode={};
    $scope.risknodeupdateStyle=clearConstant.risknodeupdateStyle;
    $scope.risknodestatusTypes=clearConstant.risknodestatusTypes;
    $scope.selectFlag=true;
    $scope.updateRisknode=false;
    $scope.risknodeEntity={};
    
    $scope.risknodedatarightTypes=clearConstant.risknodedatarightTypes;
    
    $("[forType='date']").datepicker({
    	 language:  'zh-CN',
 	    weekStart: 1,
 	    autoclose: true,
 	    clearBtn: true,
 	    todayHighlight: true,
 	    format: 'yyyymmdd'
	});
    
    //初始化风控节点模态框
    $scope.initUpdateRisknode= function (index,obj){
//    	$timeout(function() {
//    		// 初始化表格
//        	$scope.tableInit("riskNode_dynamic_table",$scope.otherDataset,$scope.risknode_columns);
//        }, 500);
    	$scope.risknodeEntitys=new Array();
    	//$scope.updateRisknode=true;
    	$scope.certainFundProduct=obj;//添加风控节点时记录相对应的基金产品
    	// 初始化节点数据
    	$scope.initRiskNodeList(obj);

    };
    //初始化添加风控节点模态框
    $scope.initRisknodeParameter=function(){
    	$scope.ModalrisknodeEntity={};
    	$scope.ModalrisknodeEntity.updateStyle='1';//更新方式默认为实时
    	$scope.updateRisknode=false;
    	//document.getElementById("sendTime").value=null;
    	$scope.myForm1.$setPristine();
    }
    //初始化修改风控节点模态框
    $scope.initUpdaterisknodeParam=function(index,obj){
    	$scope.recordIndex=index;
    	$scope.updateRisknode=true;
    	$scope.ModalrisknodeEntity=angular.copy(obj);
    	if($scope.ModalrisknodeEntity.updateStyle=='0'){
    		//document.getElementById("sendTime").value=$scope.ModalrisknodeEntity.sendTime;
    		var str=$scope.ModalrisknodeEntity.sendTime;
    		var arr=str.split(":");
    		$scope.ModalrisknodeEntity.sendTimeHour=arr[0];
    		$scope.ModalrisknodeEntity.sendTimeMinu=arr[1];
    	}
    	$scope.$apply();
    	$scope.myForm1.$setPristine();
    	
    }
    
    // 风控节点信息更新类型转换
    $scope.transRisknodeupdateStyle = function (key) {
    	for(var i = 0;i < $scope.risknodeupdateStyle.length; i++){
    		if($scope.risknodeupdateStyle[i].key == key){
    			return $scope.risknodeupdateStyle[i].text;
    		}
    	}
    }
 
    // 风控节点状态类型转换
    $scope.transRisknodestatusTypes = function (key) {
    	for(var i = 0;i < $scope.risknodestatusTypes.length; i++){
    		if($scope.risknodestatusTypes[i].key == key){
    			return $scope.risknodestatusTypes[i].text;
    		}
    	}
    }
    //风控节点数据权限类型转换
    $scope.transrisknodedatarightTypes=function(key){
    	for(var i = 0;i < $scope.risknodedatarightTypes.length; i++){
    		if($scope.risknodedatarightTypes[i].key == key){
    			return $scope.risknodedatarightTypes[i].text;
    		}
    	}
    }
    //添加风控节点
    $scope.saveRisknode=function(ModalrisknodeEntity){
    	 $scope.canClick=true;
    	 
    	 if(ModalrisknodeEntity.maxTransferRecord == undefined || ModalrisknodeEntity.maxTransferRecord.trim() == ""){
    		 delete ModalrisknodeEntity.maxTransferRecord;
    	 }
    	 
    	//新增
    	if(!$scope.updateRisknode){
    		ModalrisknodeEntity.fundProductID=$scope.certainFundProduct.fundProductID;
    		ModalrisknodeEntity.instClientID=$scope.certainFundProduct.instClientID;
    		//ModalrisknodeEntity.sendTime=document.getElementById("sendTime").value;
    		//如果更新方式是每日
    		if(ModalrisknodeEntity.updateStyle=='0'){
    			//如果分钟是个位数要补零
        		var minute=ModalrisknodeEntity.sendTimeMinu;
        		if(ModalrisknodeEntity.sendTimeMinu.length<=1){
        			minute='0'+ModalrisknodeEntity.sendTimeMinu;
        		}
        		ModalrisknodeEntity.sendTime=ModalrisknodeEntity.sendTimeHour+':'+minute;
    		}
    		
    		ModalrisknodeEntity.risknodeStatus='0';//为新增节点的状态赋默认值
    		//核对是否重复
    		findRiskNodeBynodeName(function(result){
    			if (result.length > 0) {
                    layer.msg("风控节点已存在，请重新输入", {icon: 2, time: 3000});
                    return false;
                 }else{
    				saveRiskNode(function(result) {
    	    			if(result==null ){
    	    				layer.msg("添加节点失败！", {icon: 2, time: 3000});
    	                    return false;
    	    			}
    	    			else{
    	    				layer.msg("添加节点成功！", {icon: 1, time: 3000});
    	    				$scope.risknodeEntitys.unshift(result);
        	    			$scope.$apply();
        	    			$("#addFofNodeModal").modal("hide");	
        	    			
        	    			// 初始化风控节点数据
        	    			$scope.initRiskNodeList(ModalrisknodeEntity);
        	    			
    	    			}
    	    		}, ModalrisknodeEntity);
    			}
    		},ModalrisknodeEntity);

    		
    	}
    	else{
    		// 修改
    		if(ModalrisknodeEntity.updateStyle=='1'){
    			//$scope.selectFlag=true;
    			ModalrisknodeEntity.sendTime=undefined;
    		}
    		else if(ModalrisknodeEntity.updateStyle=='0'){
    			//$scope.selectFlag=false;
    			ModalrisknodeEntity.updateFreq=undefined;
    			//ModalrisknodeEntity.sendTime=document.getElementById("sendTime").value;
    			//如果分钟是个位数要补0
    			var minute=ModalrisknodeEntity.sendTimeMinu;
        		if(ModalrisknodeEntity.sendTimeMinu.length<=1){
        			minute='0'+ModalrisknodeEntity.sendTimeMinu;
        		}
    			ModalrisknodeEntity.sendTime=ModalrisknodeEntity.sendTimeHour+':'+minute;
    		}
    		findRiskNodeBynodeName(function(result){
    			if (result.length > 0) {
                    layer.msg("风控节点已存在，请重新输入", {icon: 2, time: 3000});
                    return false;
                 }else{
		    		updateRiskNode(function(result) {
						if(result==null ){
		    				layer.msg("修改节点失败！", {icon: 2, time: 3000});
		                    return false;
		    			}
		    			else{
		    				layer.msg("修改节点成功！", {icon: 1, time: 3000});
		    				$scope.risknodeEntitys.splice($scope.recordIndex, 1, result);
		    				$scope.$apply();
		    				$("#addFofNodeModal").modal("hide");
		    				
        	    			// 初始化风控节点数据
        	    			$scope.initRiskNodeList(ModalrisknodeEntity);
		    			}
					}, ModalrisknodeEntity);
                 }
    		},ModalrisknodeEntity);
    	}
    	$timeout(function() {
        	$scope.canClick=false;
          }, 3000);
    	
    }
    //删除风控节点
    $scope.removeRisknode=function(index,risknodeEntity){
    	layer.confirm('确定删除？', {
				icon : 3
			}, function(count) {
				removeRiskNode(function(result){
					//删除成功与否
					if(result==null){
						layer.msg("删除失败！", {icon: 2, time: 3000});
	                    return false;
					}
					else{
						//删除数据权限
						//判断是否有权限
						findselectedRights(function(result){
							if(result==null ||result.length==0){
								layer.msg("删除成功！", {icon: 1, time: 3000});
							}
							else{
								deleteselectedRights(function(result){
//									if(result==null ||result.length==0){
//			    	    				layer.msg("删除失败！", {icon: 2, time: 3000});
//			    	                    return false;
//			    	    			}
//			    	    			else{
//			    	    				layer.msg("删除成功！", {icon: 1, time: 3000});
//			    	    				
//			    	    			}
					        	},risknodeEntity.id);
								layer.msg("删除成功！", {icon: 1, time: 3000});
							}
						},risknodeEntity.id);
						$scope.risknodeEntitys.splice(index, 1);
						$scope.$apply();

    	    			// 初始化风控节点数据
    	    			$scope.initRiskNodeList(risknodeEntity);
					}
				
				},risknodeEntity.id);
				
				layer.close(count);
				
			});
    }
    //更新方式下拉框改变事件
    $scope.changeStyle=function(){
    	
    	
    		if("1"==$scope.ModalrisknodeEntity.updateStyle){
    			//document.getElementById("sendTime").value=null;
    			$scope.ModalrisknodeEntity.sendTimeHour=null;
    			$scope.ModalrisknodeEntity.sendTimeMinu=null;
    			
    		}
    		else{
    			$scope.ModalrisknodeEntity.updateFreq=null;
    			//为发送时间赋上当前时间
//    			var date = new Date();
//    			var strMinutes=date.getMinutes();
//    			if (strMinutes >= 0 && strMinutes <= 9) {
//    		        strMinutes = "0" + strMinutes;
//    		    }
//    		    var currenttime =date.getHours() + ':' + strMinutes;
//    			document.getElementById("sendTime").value=currenttime;
    			
    		}
    	
    }
 
  
    //初始化权限设置
    $scope.initDatarightModal=function(index,risknodeEntity){
    	$scope.certainRiskNode=risknodeEntity;
    	$scope.canClick=false;
    	$scope.preselectRightMap=[];
    	$scope.preunselectRightMap=[];
    	$scope.unselectedRightGroup=[];
    	$scope.selectedRightGroup=[];
    	var risknodeId=risknodeEntity.id;
    	//alert(11234);
    	//查询该风控节点是否有权限
    	findselectedRights(function(result){
    		
    		if(result==null||result.length==0){
    			
    			for(var i=0;i<$scope.risknodedatarightTypes.length;i++){
    				var tem={};
       			    tem.risknodeId=risknodeId;
        			tem.rightId=$scope.risknodedatarightTypes[i].key;
        			$scope.unselectedRightGroup.push(tem);	
    			}
    			
    		}
    		else if(result.length > 0){
    			$scope.selectedRightGroup=result;
    			var temRightTypes=angular.copy($scope.risknodedatarightTypes);
    			var flag;
    			angular.forEach(temRightTypes, function (temRightType, ii, map) {
    				flag=0;//去除已选权限的标志
    				for(var i=0;i<result.length;i++){
    					if(temRightType.key==result[i].rightId){
    						flag=1;
    					}
    				}
    				if(flag==0){
    					var tem={};
            			tem.risknodeId=risknodeId;
            			tem.rightId=temRightType.key;
            			$scope.unselectedRightGroup.push(tem);	
    				}
    			});
    		}
    		$scope.$apply();
    		
    	},risknodeEntity.id);
   	
    }
    //单击未设置权限列表 事件
    $scope.addGroupSelect=function(index,unselectedRight){
    	 if(	unselectedRight.isSelectActive==false || unselectedRight.isSelectActive == undefined){
    			$scope.preselectRightMap.push(unselectedRight);
    			unselectedRight.isSelectActive=true;
    		}

    }
    //双击未设置权限列表 事件
 $scope.addGroup=function(index,selectedRight){
	 if(selectedRight.isSelectActive){
		 var index1=$scope.preselectRightMap.indexOf(selectedRight)
		 $scope.preselectRightMap.splice(index1, 1);
		
	 }
	 selectedRight.isSelectActive=false;
	 $scope.unselectedRightGroup.splice(index, 1);
	 
     $scope.selectedRightGroup.push(selectedRight);
    }
    //单击 > 事件
    $scope.addSelectRightEntity=function(){
    	angular.forEach($scope.preselectRightMap, function (rightEntity, ii, map) {
    		var index = $scope.unselectedRightGroup.indexOf(rightEntity)
			$scope.unselectedRightGroup.splice(index, 1);
    		rightEntity.isSelectActive=false;
            $scope.selectedRightGroup.push(rightEntity);
            
            })
            
         $scope.preselectRightMap=[];//清空预选数组
    }
    //单击  >> 事件
    $scope.addAllRightEntity=function(){
    	angular.forEach($scope.unselectedRightGroup, function (rightEntity, ii, map) {
    		
    		rightEntity.isSelectActive=false;
            $scope.selectedRightGroup.push(rightEntity);
            
            })
            
         $scope.unselectedRightGroup=[];//清空未设置权限数组
    	 $scope.preselectRightMap=[];//清空预选数组
    }
    
    //单击已设置权限列表 事件
    $scope.deleteGroupSelect=function(index,selectedRight){
    	if(	selectedRight.isSelectActive==false || selectedRight.isSelectActive == undefined){
			$scope.preunselectRightMap.push(selectedRight);
			selectedRight.isSelectActive=true;
		}
    }
    //双击已设置权限列表 事件
   $scope.deleteGroup=function(index,selectedRight){
	   if(selectedRight.isSelectActive){
		   var index1=$scope.preunselectRightMap.indexOf(selectedRight);
		   $scope.preunselectRightMap.splice(index1, 1);
	   }
	   
	   selectedRight.isSelectActive=false;
	   $scope.selectedRightGroup.splice(index, 1);
	   
       $scope.unselectedRightGroup.push(selectedRight);
   }
    //单击  < 事件
    $scope.deleteSelectRightEntity=function(){
    	angular.forEach($scope.preunselectRightMap, function (rightEntity, ii, map) {
    		var index = $scope.selectedRightGroup.indexOf(rightEntity)
			$scope.selectedRightGroup.splice(index, 1);
    		rightEntity.isSelectActive=false;
            $scope.unselectedRightGroup.push(rightEntity);
            
            })
            
         $scope.preunselectRightMap=[];//清空预选数组
    }
   //单击  << 事件
    $scope.deleteAllRightEntity=function(){
       angular.forEach($scope.selectedRightGroup, function (rightEntity, ii, map) {
    		
    		rightEntity.isSelectActive=false;
            $scope.unselectedRightGroup.push(rightEntity);
            
            })
            
         $scope.selectedRightGroup=[];//清空未设置权限数组
    	 $scope.preunselectRightMap=[];//清空预选数组
    }
    //保存已选择的权限
    $scope.saveSelectedRight=function(){
    	$scope.canClick=true;
    	if($scope.selectedRightGroup.length>0){
    		//判断是否已选“产品基本信息”权限
    		var flag=false;
    		 angular.forEach($scope.selectedRightGroup, function (rightEntity, ii, map) {
    	    		if(rightEntity.rightId=='6'){
    	    		   flag= true;
    	    		    
    	    		}
    	      });
    		if(flag==false){
    			layer.msg("\"产品基本信息\"权限为必选项！", {icon: 2, time: 2000});
        		$scope.canClick=false;
                return false;
    		}
    		saveselectedRights(function(result){
    			if(result==null ||result.length==0){
    				layer.msg("权限保存失败！", {icon: 2, time: 3000});
    				$scope.canClick=false;
    				return false;
    			}
    			else{
    				layer.msg("权限保存成功！", {icon: 1, time: 3000});
    				$("#datarightSetModal").modal("hide");
    			}
        		
        	},$scope.selectedRightGroup);
    	}
    	//如果已选权限组为空，即为清空权限
    	else if($scope.selectedRightGroup==null ||$scope.selectedRightGroup.length==0){
    		//进行删除操作
			deleteselectedRights(function(result){
				
        	},$scope.certainRiskNode.id);
			layer.msg("权限保存成功！", {icon: 1, time: 3000});
			    $("#datarightSetModal").modal("hide");
    	}
    	$timeout(function() {
        	$scope.canClick=false;
          }, 3000);
    	
    }
    
//  ----------工作流-----------
    $scope.modelTypes = clearConstant.modelTypes;	//工作流类型
    $scope.procedures = clearConstant.workFlowProcedures;	//流程节点
    $scope.defaultModes = clearConstant.defaultModes;	//默认方式
    $scope.workFlowEntitys = [];
    $scope.investAdvisers = [];	//投资顾问列表
    $scope.investManagers = [];	//投资经理
    $scope.tradeUsers = [];		//交易员
    $scope.defaultTradeUsers = [];	//默认交易员
    $scope.currentAccountType = '1';	//当前账号类型 1 资金 2 风险
    $scope.tmpFundEntity = {};
    $scope.workFlowParam = {};
    $scope.queryInnerAccountListStr = '';
    multiselect("#100");
    multiselect("#102");
    multiselect("#104");
    $scope.fundWorkFlowService = new com.quantdo.orgClear.service.FundWorkFlowService();
    $scope.userAccountService = new com.quantdo.orgClear.service.UserAccountService();
    $scope.tradeUserService = new com.quantdo.orgClear.service.TradeUserService();
    
    // 转换模板类型
    $scope.transModelTypes = function(key){
    	for(var i = 0;i < $scope.modelTypes.length;i++){
    		if($scope.modelTypes[i].key == key){
    			return $scope.modelTypes[i].text;
    		}
    	}
    }
    
    // 转换工作流流程节点
    $scope.transProcedures = function(key){
    	for(var i = 0;i < $scope.procedures.length;i++){
    		if($scope.procedures[i].key == key){
    			return $scope.procedures[i].text;
    		}
    	}
    }
    
    // 转换默认方式
    $scope.transDefaultModes = function(key){
    	for(var i = 0;i < $scope.defaultModes.length;i++){
    		if($scope.defaultModes[i].key == key){
    			return $scope.defaultModes[i].text;
    		}
    	}
    }
    
    // 是否三工作流 ，界面投资顾问是否隐藏
    $scope.isTriple = true;
    // 更改模板类型
    $scope.changeModelType = function(type){
    	if(type == 1){	//三工作流
    		$scope.isTriple = true;
    	}else{
    		$scope.isTriple = false;
    		$scope.workFlowParam.investAdviser = null;
    		$scope.investAdviserStr = '';
    		var tmp = [];
    		$("#100").val(tmp);
    		$("#100").multiselect("refresh");
    	}
    }
    
    // 初始化工作流显示列表
    $scope.showWorkFlowList = function(entity){
    	$timeout(function() {
    		// 初始化表格
    		$scope.workFlowTable = $scope.tableInit("workFlow_dynamic_table",$scope.otherDataset,$scope.workFlow_columns);
        }, 500);
    	
    	
    	if(entity.isActive == 0){	//注销
    		$scope.workFlowTarget = "";
    		layer.msg("此基金产品已失效,不允许修改工作流",{icon: 2});
    	}else if(entity.isActive == 1){	//有效
    		$scope.tmpFundEntity = angular.copy(entity);
    		$scope.workFlowTarget = "#capWorkFlowMsg";
    		$scope.workFlowEntitys = [];
    		
    		// 区分显示fof账号还是mom账号
    		$scope.instClientService.findEntityByInstClientID(function(result){
    			if(result != null && result.amType == '1'){	//fof
    				$scope.currentAccountType = '1';
    			}else{		//mom
    				$scope.currentAccountType = '2';
    			}
    			
    			// 初始化数据显示
    			$scope.initWorkFlowList(entity);
    			
    		},entity.instClientID);
    		
    	}
    }
    
    // 添加工作流
    $scope.initWorkFlow = function(){
    	$scope.workFlowParam = {};
    	$scope.workFlowParamForm.$setPristine();
    	
    	// 根据产品查询对应账号
    	if($scope.currentAccountType == '1'){		//fof
    		isConnectedwithCapitalAccount(function(result){
        		$scope.capitalAccountEntitys = [];
    			if(result != null && result.length > 0){
    				$scope.capitalAccountEntitys = result;
    			}
    			$scope.$apply();
    		},{
    			fundProductID: $scope.tmpFundEntity.fundProductID,
    			instClientID: $scope.tmpFundEntity.instClientID
    		});
    	}else{		//mom
    		$scope.fundWorkFlowService.findSubAccountsByFund(function(result){
    			$scope.capitalAccountEntitys = [];
    			if(result != null && result.length > 0){
    				for(var i = 0;i < result.length;i++){
    					var tmpEntity = {};
    					tmpEntity.innerAccountID = result[i].subAccountID;
    					tmpEntity.accountName = result[i].subAccountName;
    					$scope.capitalAccountEntitys.push(tmpEntity);
    				}
    			}
    			$scope.$apply();
    		},{
    			fundProductID: $scope.tmpFundEntity.fundProductID,
    			instClientID: $scope.tmpFundEntity.instClientID
    		});
    	}
    	
    	
    	$scope.workFlowParam.instClientID = $scope.tmpFundEntity.instClientID;
    	$scope.workFlowParam.fundProductID = $scope.tmpFundEntity.fundProductID;
    	$scope.workFlowParam.defaultMode = $scope.defaultModes[1].key;		//初始默认方式为手动
    	$scope.workFlowParam.modelType = $scope.modelTypes[0].key;		//初始模板为三工作流
    	$scope.investAdviserStr = '';
    	$scope.investManagerStr = '';
    	$scope.tradeUserStr = '';
    	$scope.defaultTradeUserStr = '';
    	$scope.isTriple = true;
    	$scope.isUpdate = false;
    	// 多选下拉框清空
    	var tmp = [];
		$("#100").val(tmp);
		$("#100").html("");
		$("#100").multiselect("refresh");
		$("#102").val(tmp);
		$("#102").html("");
		$("#102").multiselect("refresh");
		// 模态框重绘
    	$('#workFlowParams').on('show.bs.modal', function (e) {
			$(this).find('.modal-dialog').css({
                'margin-left': function () {
                    var modalHeight = $('#workFlowParams').find('.modal-dialog').width();
                    return ($(window).width() / 2 - 500);
                }
            });
        });
    	// 普通下拉框清空
    	$scope.investManagers = [];
    	$scope.defaultTradeUsers = [];
    }
    
    // 根据账号筛选下拉框数据
    $scope.queryUserByInnerAccountIDList = function(innerAccountList){
    	$scope.queryInnerAccountListStr = '';
    	// 交易流程内多选下拉框清空
    	var tmp = [];
		$("#100").val(tmp);
		$("#100").html("");
		$("#100").multiselect("refresh");
		$("#102").val(tmp);
		$("#102").html("");
		$("#102").multiselect("refresh");
		$scope.investManagers = [];
    	$scope.defaultTradeUsers = [];
    	$scope.investAdviserStr = '';
    	$scope.investManagerStr = '';
    	$scope.tradeUserStr = '';
    	$scope.defaultTradeUserStr = '';
    	
    	// 投资顾问列表
    	$scope.userAccountService.findUserAccAndTraderUserByRole(function(result){
    		$scope.investAdvisers = [];
    		$("#100").html("");
    		if(result != null && result.length > 0){
    			$scope.investAdvisers = result;
    			for(var i = 0;i < $scope.investAdvisers.length;i++){
    				$("#100").append("<option value='"+$scope.investAdvisers[i].userID+"'>"+
    						$scope.investAdvisers[i].userID+'_'+$scope.investAdvisers[i].userName+"</option>");
    			}
    		}
    		var tmp = [];
    		$("#100").val(tmp);
    		$("#100").multiselect("refresh");
    	},{
    		instClientID: $scope.workFlowParam.instClientID,
    		accountType: $scope.currentAccountType
    	},'6',innerAccountList);
    	
    	// 投资经理列表
    	$scope.userAccountService.findUserAccAndTraderUserByRole(function(result){
    		$scope.investManagers = [];
    		if(result != null && result.length > 0){
    			$scope.investManagers = result;
    			$scope.$apply();
    		}
    	},{
    		instClientID: $scope.workFlowParam.instClientID,
    		accountType: $scope.currentAccountType
    	},'8',innerAccountList);
    	
    	// 交易员列表
    	$scope.userAccountService.findUserAccAndTraderUserByRole(function(result){
    		$scope.tradeUser = [];
    		$("#102").html("");
    		if(result != null && result.length > 0){
    			$scope.tradeUser = result;
    			for(var i = 0;i < $scope.tradeUser.length;i++){
    				$("#102").append("<option value='"+$scope.tradeUser[i].userID+"'>"+$scope.tradeUser[i].userID+
    						'_'+$scope.tradeUser[i].userName+"</option>");
    			}
    		}
    		var tmp = [];
    		$("#102").val(tmp);
    		$("#102").multiselect("refresh");
    	},{
    		instClientID: $scope.workFlowParam.instClientID,
    		accountType: $scope.currentAccountType
    	},'13',innerAccountList);
    }
    
    // 根据下拉框选择，显示已选用户
    $scope.showChoose = function(entity,role){
    	debugger;
    	switch(role){
    	case '1':
    		$scope.investAdviserStr = '';
    		if(entity.investAdviser.length > 0){
    			for(var i = 0;i < entity.investAdviser.length;i++){
    				if(i > 0){
    					$scope.investAdviserStr += ',';
    				}
        			$scope.investAdviserStr += entity.investAdviser[i];
        		}
    		}
    		break;
    	case '2':
    		$scope.investManagerStr = '';
    		if(entity.investManager != undefined){
    			$scope.investManagerStr = entity.investManager;
    		}
    		break;
    	case '3':
    		$scope.tradeUserStr = '';
    		$scope.defaultTradeUsers = [];
    		if(entity.tradeUser.length > 0){
    			for(var i = 0;i < entity.tradeUser.length;i++){
    				if(i > 0){
    					$scope.tradeUserStr += ',';
    				}
        			$scope.tradeUserStr += entity.tradeUser[i];
        		}
    		}
    		$scope.tradeUserService.findByUserIDListAndInstID(function(result){
    			if(result != null && result.length > 0){
    				$scope.defaultTradeUsers = result;
    			}
    			$scope.$apply();
    		},{
    			instClientID: entity.instClientID,
    			role: '13'
    		},entity.tradeUser);
    		break;
    	case '4':
    		$scope.defaultTradeUserStr = '';
    		if(entity.defaultTradeUser != undefined){
    			$scope.defaultTradeUserStr = entity.defaultTradeUser;
    		}
    		break;
    	}
    		
    }
    
    // 修改工作流
    $scope.updateWorkFlowParam = function(index,entity){
    	$scope.workFlowParam = {};
    	$scope.workFlowParamForm.$setPristine();
    	$scope.tmpEntity = angular.copy(entity);
    	
    	// 投资顾问将括号转换回逗号
    	if(entity.investAdviser != null){
    		$scope.tmpEntity.investAdviser = convertToListStr($scope.tmpEntity.investAdviser);
    	}
    	// 交易员将括号转换回逗号
    	$scope.tmpEntity.tradeUser = convertToListStr($scope.tmpEntity.tradeUser);
    	
    	$scope.workFlowParam = angular.copy($scope.tmpEntity);
    	$scope.workFlowParam.recordIndex = index;
    	$scope.changeModelType($scope.workFlowParam.modelType);
    	$scope.isUpdate = true;
    	$scope.investAdviserStr = '';
    	$scope.investManagerStr = '';
    	$scope.tradeUserStr = '';
    	$scope.defaultTradeUserStr = '';
    	$scope.queryInnerAccountListStr = entity.innerAccountID;

    	$('#workFlowParams').on('show.bs.modal', function (e) {
			$(this).find('.modal-dialog').css({
                'margin-left': function () {
                    var modalHeight = $('#workFlowParams').find('.modal-dialog').width();
                    return ($(window).width() / 2 - 500);
                }
            });
        });
    	
    	// 根据产品查询对应账号
    	if($scope.currentAccountType == '1'){		//fof
    		isConnectedwithCapitalAccount(function(result){
        		$scope.capitalAccountEntitys = [];
    			if(result != null && result.length > 0){
    				$scope.capitalAccountEntitys = result;
    			}
    			$scope.$apply();
    		},{
    			fundProductID: entity.fundProductID,
    			instClientID: entity.instClientID
    		});
    	}else{		//mom
    		$scope.fundWorkFlowService.findSubAccountsByFund(function(result){
    			$scope.capitalAccountEntitys = [];
    			if(result != null && result.length > 0){
    				for(var i = 0;i < result.length;i++){
    					var tmpEntity = {};
    					tmpEntity.innerAccountID = result[i].subAccountID;
    					tmpEntity.accountName = result[i].subAccountName;
    					$scope.capitalAccountEntitys.push(tmpEntity);
    				}
    			}
    			$scope.$apply();
    		},{
    			fundProductID: entity.fundProductID,
    			instClientID: entity.instClientID
    		});
    	}
    	
    	// 投资顾问列表
    	$scope.userAccountService.findUserAccAndTraderUserByRole(function(result){
    		$scope.investAdvisers = [];
    		$("#100").html("");
    		if(result != null && result.length > 0){
    			$scope.investAdvisers = result;
    			for(var i = 0;i < $scope.investAdvisers.length;i++){
    				$("#100").append("<option value='"+$scope.investAdvisers[i].userID+"'>"+$scope.investAdvisers[i].userID+
    						'_'+$scope.investAdvisers[i].userName+"</option>");
    			}
    		}
    		if($scope.tmpEntity.investAdviser != undefined){
    			var tmp = $scope.tmpEntity.investAdviser.split(",");
        		$("#100").val(tmp);
        		$scope.showChoose({investAdviser: $scope.tmpEntity.investAdviser.split(",")},'1');
        		$scope.$apply();
    		}
    		$("#100").multiselect("refresh");
    	},{
    		instClientID: entity.instClientID,
    		accountType: $scope.currentAccountType
    	},'6',entity.innerAccountID);
    	
    	// 投资经理列表
    	$scope.userAccountService.findUserAccAndTraderUserByRole(function(result){
    		$scope.investManagers = [];
    		if(result != null && result.length > 0){
    			$scope.investManagers = result;
    			$scope.showChoose($scope.tmpEntity,'2');
    			$scope.$apply();
    		}
    	},{
    		instClientID: entity.instClientID,
    		accountType: $scope.currentAccountType
    	},'8',entity.innerAccountID);
    	
    	// 交易员列表
    	$scope.userAccountService.findUserAccAndTraderUserByRole(function(result){
    		$scope.tradeUser = [];
    		$("#102").html("");
    		if(result != null && result.length > 0){
    			$scope.tradeUser = result;
    			for(var i = 0;i < $scope.tradeUser.length;i++){
    				$("#102").append("<option value='"+$scope.tradeUser[i].userID+"'>"+$scope.tradeUser[i].userID+
    						'_'+$scope.tradeUser[i].userName+"</option>");
    			}
    		}
    		
    		var tmp = $scope.tmpEntity.tradeUser.split(",");
    		$("#102").val(tmp);
    		$("#102").multiselect("refresh");
    		$scope.showChoose({tradeUser: $scope.tmpEntity.tradeUser.split(",")},'3');
    		// 默认交易员
    		$scope.defaultTradeUsers = [];
    		$scope.tradeUserService.findByUserIDListAndInstID(function(result){
    			$scope.workFlowParam.defaultTradeUser = entity.defaultTradeUser;
    			$scope.showChoose(entity,'4');
    			if(result != null && result.length > 0){
    				$scope.defaultTradeUsers = result;
    				$scope.$apply();
    			}
    		},{
    			instClientID: entity.instClientID,
    			role: '13'
    		},tmp);
    	},{
    		instClientID: entity.instClientID,
    		accountType: $scope.currentAccountType
    	},'13',entity.innerAccountID);
    }
    
    // 提交工作流信息
    $scope.saveWorkFlow = function(entity){
    	if(entity.modelType == '1' && ($scope.investAdviserStr == undefined || $scope.investAdviserStr.trim() == '')){
    		layer.msg("投资顾问不能为空",{icon: 2});
    		return false;
    	}
    	if($scope.investManagerStr == undefined || $scope.investManagerStr.trim() == ''){
    		layer.msg("投资经理不能为空",{icon: 2});
    		return false;
    	}
    	if($scope.tradeUserStr == undefined || $scope.tradeUserStr.trim() == ''){
    		layer.msg("交易员不能为空",{icon: 2});
    		return false;
    	}
    	if($scope.defaultTradeUserStr == undefined || $scope.defaultTradeUserStr.trim() == ''){
    		layer.msg("默认交易员不能为空",{icon: 2});
    		return false;
    	}
    	
    	// 校验同一个产品同一个账号同一个投资经理，默认交易员是否一致，不一致提示错误
    	$scope.fundWorkFlowService.validateDefaultTradeUser(function(result){
    		if(result != null && result.length > 0){
    			//由于存入数据库的同产品同账号的默认交易员一定一致，所以取第一条记录判断即可
    			if(result[0].defaultTradeUser != entity.defaultTradeUser){
    				layer.msg("同一账号对应的默认投资交易员必须一致",{icon: 2});
    				return false;
    			}else if(result[0].defaultMode != entity.defaultMode){
    				if(entity.recordIndex == undefined){	// 新增
    					layer.msg("同一账号对应的默认方式必须一致",{icon: 2});
        				return false;
    				}else{			// 修改
    					layer.confirm("修改后,该账号对应的默认方式不一致,是否关联同步修改", {icon: 3}, function (count) {
    						
    						
    						layer.close(count);
    						processSavingData(entity,true);
    					});
    				}
    			}else{
    				processSavingData(entity,false);
    			}
    		}else{
				processSavingData(entity,false);
    		}
    	},{
    		instClientID: entity.instClientID,
			innerAccountID: entity.innerAccountID,
			id: entity.id
    	});
    	$timeout(function() {
			$scope.initWorkFlowList(entity);
	     }, 500);	
    }
    
    // 删除工作流
    $scope.removeWorkFlow = function(index,entity){
    	layer.confirm('确认删除该工作流', {
			icon : 3
		}, function(count) {
			$scope.fundWorkFlowService.remove(function(){
				layer.msg("删除成功",{icon: 1});
				$scope.workFlowEntitys.splice(index, 1);
				layer.close(count);
				$scope.$apply();
				// 初始化数据显示
    	    	$timeout(function() {
    				$scope.initWorkFlowList(entity);
    		     }, 500);	
			},entity.id);
		});
    }
    
    // 校验重复,存储数据,根据校验结果判断是否同步修改默认方式
    function processSavingData(entity, isUpdateDefaultMode){
    	if(entity.recordIndex == undefined){	//新增
    		
    		if(entity.modelType == '1'){	//三工作流
    			entity.investAdviser = convertToSavingStr($scope.investAdviserStr);
    		}else{			//二工作流
    			entity.investAdviser = undefined;
    		}
    		
			entity.investManager = $scope.investManagerStr;
			entity.tradeUser = convertToSavingStr($scope.tradeUserStr);
			entity.defaultTradeUser = $scope.defaultTradeUserStr;
			
			$scope.fundWorkFlowService.findByQuery(function(result){
				if(result != null && result.length > 0){		//校验不同工作流模式下账号是否重复
					layer.msg("账号"+ entity.innerAccountID + "对应工作流类型的记录已存在",{icon: 2});
					return false;
				}else{
					$scope.fundWorkFlowService.findByQuery(function(result){
						if(result != null && result.length > 0){
	    					layer.msg("该产品下,此工作流名称已存在",{icon: 2});
	    					return false;
						}else{
							$scope.fundWorkFlowService.add(function(result){
	    						if(result != null){
	    							layer.msg("新增成功",{icon: 1});
	    							$scope.workFlowEntitys.unshift(result);
	    							$scope.$apply();
	    							$("#workFlowParams").modal("hide");
	    							// 工作流初始化
	    							$scope.initWorkFlowList(entity);
	    						}else{
	    							layer.msg("新增失败",{icon: 2});
	    						}
	    					},entity);
						}
					},{
						instClientID: entity.instClientID,
						fundProductID: entity.fundProductID,
						workFlowName: entity.workFlowName
					});
				}
			},{
				instClientID: entity.instClientID,
				innerAccountID: entity.innerAccountID,
				modelType: entity.modelType
			});
    	}else{				//修改
    		var index = entity.recordIndex;
    		if(entity.modelType == '1'){	//三工作流
    			entity.investAdviser = convertToSavingStr($scope.investAdviserStr);
    		}else{			//二工作流
    			entity.investAdviser = undefined;
    		}
			entity.investManager = $scope.investManagerStr;
			entity.tradeUser = convertToSavingStr($scope.tradeUserStr);
			entity.defaultTradeUser = $scope.defaultTradeUserStr;
    			
			$scope.fundWorkFlowService.findNotSelf(function(result){	//校验不同工作流模式下账号是否重复
				if(result != null && result.length > 0){
					layer.msg("账号" + entity.innerAccountID + "对应工作流类型的记录已存在",{icon: 2});
					return false;
				}else{
					$scope.fundWorkFlowService.findNotSelf(function(result){
						if(result != null && result.length > 0){
	    					layer.msg("该产品下,此工作流名称已存在",{icon: 2});
	    					return false;
						}else{
							$scope.fundWorkFlowService.update(function(result){
								if(result != null){
	    							layer.msg("修改成功",{icon: 1});
	    							$timeout(function() {
	    			    				$scope.initWorkFlowList(entity);
	    			    		     }, 500);
	    							$("#workFlowParams").modal("hide");
	    						}else{
	    							layer.msg("修改失败",{icon: 2});
	    						}
	    					},entity,isUpdateDefaultMode);
						}
					},{
						instClientID: entity.instClientID,
						fundProductID: entity.fundProductID,
						workFlowName: entity.workFlowName
					});
				}
			},{
				instClientID: entity.instClientID,
				innerAccountID: entity.innerAccountID,
				modelType: entity.modelType,
				id: entity.id
			});
    	}
    }
    
    // 将多选字符串转换成带括号的多选数据字符串
    function convertToSavingStr(listStr){
    	var list = listStr.split(",");
    	var result = '';
    	for(var i = 0;i < list.length;i++){
    		result = result + '(' + list[i] + ')';
    	}
    	return result;
    }
    
    // 将带括号的多选数据字符串转换成多选字符串
    function convertToListStr(savingStr){
    	var result = '';
    	result = savingStr.replace(/\)/g,",");	// ) -> ,
    	result = result.replace(/\(/g,"");		// ( -> 
    	result = result.substring(0,result.length - 1);	//去掉末尾，
    	return result;
    }
    
    //定义产品基础信息的固定列头
    $scope.product_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "所属机构"},
        {title: "产品编号"},
        {title: "产品简称"},        
        {title: "产品类型"},
        //{title: "工作流默认方式"},
        {title: "创建人"},
        {title: "创建时间"},
        {title: "产品状态"},
        {title: "操作"}
    ]; 
    $("body").undelegate("#fundProduct_dynamic_table_wrapper td .update-row1","click");
    $("body").delegate("#fundProduct_dynamic_table_wrapper td .update-row1","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.initUpdate(id,$scope.modalEntity);
    });
    $("body").undelegate("#fundProduct_dynamic_table_wrapper td .update-row2","click");
     $("body").delegate("#fundProduct_dynamic_table_wrapper td .update-row2","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.initDetial($scope.modalEntity);
    });
     $("body").undelegate("#fundProduct_dynamic_table_wrapper td .update-row3","click");
     $("body").delegate("#fundProduct_dynamic_table_wrapper td .update-row3","click",function(){
    	 debugger;
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.showWorkFlowList($scope.modalEntity);
    });
     $("body").undelegate("#fundProduct_dynamic_table_wrapper td .update-row4","click");
     $("body").delegate("#fundProduct_dynamic_table_wrapper td .update-row4","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.initUpdateRisknode(id,$scope.modalEntity);
    });
     $("body").undelegate("#riskNode_dynamic_table_wrapper td .update-row5","click");
    $("body").delegate("#riskNode_dynamic_table_wrapper td .update-row5","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.riskNodeTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.risknodeEntitys.length;i++){
        	if(id==$scope.risknodeEntitys[i].id){
        		$scope.modalEntity = $scope.risknodeEntitys[i];
        	}
        }
        $scope.initUpdaterisknodeParam(id,$scope.modalEntity);
    });
    $("body").undelegate("#riskNode_dynamic_table_wrapper td .update-row6","click");
    $("body").delegate("#riskNode_dynamic_table_wrapper td .update-row6","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.riskNodeTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.risknodeEntitys.length;i++){
        	if(id==$scope.risknodeEntitys[i].id){
        		$scope.modalEntity = $scope.risknodeEntitys[i];
        	}
        }
        $scope.initDatarightModal(id,$scope.modalEntity);
    });
    $("body").undelegate("#riskNode_dynamic_table_wrapper td .update-row7","click");
    $("body").delegate("#riskNode_dynamic_table_wrapper td .update-row7","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.riskNodeTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.risknodeEntitys.length;i++){
        	if(id==$scope.risknodeEntitys[i].id){
        		$scope.modalEntity = $scope.risknodeEntitys[i];
        	}
        }
        $scope.removeRisknode(id,$scope.modalEntity);
    });
    $("body").undelegate("#workFlow_dynamic_table_wrapper td .update-row8","click");
    $("body").delegate("#workFlow_dynamic_table_wrapper td .update-row8","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.workFlowTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.workFlowEntitys.length;i++){
        	if(id==$scope.workFlowEntitys[i].id){
        		$scope.modalEntity = $scope.workFlowEntitys[i];
        	}
        }
        $scope.updateWorkFlowParam(id,$scope.modalEntity);
    });
    $("body").undelegate("#workFlow_dynamic_table_wrapper td .update-row9","click");
    $("body").delegate("#workFlow_dynamic_table_wrapper td .update-row9","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.workFlowTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.workFlowEntitys.length;i++){
        	if(id==$scope.workFlowEntitys[i].id){
        		$scope.modalEntity = $scope.workFlowEntitys[i];
        	}
        }
        $scope.removeWorkFlow(id,$scope.modalEntity);
    })
 // 查询(前台分页)
    $scope.find = function(object){
    	//将数据集赋值为空
    	$scope.productDataset = [];
    	//更新表格对应的数据集
    	findFundProductByConts(function (result) {
    		var con = result;
    		$scope.listEntitys = result;
    		//$scope.fundProductTems=result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	
        		var states ="正常";
        		var endDate = con[i].endDate;
    			if(endDate != undefined && endDate.length>0 && endDate <= nowDate){
    				states="到期";
    			}
            	var operate = "";
            	if( $scope.fundProduct_update){
                	operate = operate.concat("<a class='row-operation-distance reset-operation update-row1' data-toggle='modal' data-target='#fundProductModal'>修改</a>");
            	}if(  $scope.fundProduct_detail && !$scope.fundProduct_update){
                	operate = operate.concat( "<a class='row-operation-distance update-row2' data-toggle='modal' data-target='#fundProductModal'>详情</a>");
            	}if($scope.workflow_set){
            		operate = operate.concat( "<a class='row-operation-distance fobid-operation update-row3' data-toggle='modal' data-target='#workFlowMsg'>工作流设置</a>");
            	}/*if($scope.risknode_set){
            		operate =  operate.concat("<a class='row-operation-distance reset-operation update-row4' data-toggle='modal' data-target='#riskNoteListModal'>风控节点</a>");
            	}*/
                var tempArr = [(i+1),con[i].id,$scope.transInstClient(con[i].instClientID),con[i].fundProductID, con[i].shortProductName,$scope.transFundProductType(con[i].fundProductType)
                              // ,$scope.transDefaultModes(con[i].defaultMode)
                               ,con[i].creator,con[i].createDate,states,operate];
	            $scope.productDataset.push(tempArr);
	            con[i].index = i+1;
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.productTable.clear().draw();
            $scope.productTable.rows.add($scope.productDataset).draw();
            $scope.$apply();
        }, object);  	
    }
    
 // 初始化
    $timeout(function() {
    	  $scope.find($scope.queryEntity);
    }, 1000);
 
    
  //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.productTable = $('#fundProduct_dynamic_table').DataTable( {
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
    
    // 工作流设置列头
    $scope.workFlow_columns = [
        {title: ""},
        {title: "id",visible:false},
        {title: "工作流名称"},
        {title: "机构代码"},
        {title: "账号"},
        {title: "工作流类型"},
        {title: "流程节点"},
        {title: "默认方式"},
        {title: "操作"}
    ]; 
    // 风控节点列头
    $scope.risknode_columns = [
		{title: "序号"},
		{title: "id",visible:false},
		{title: "风控节点名称"},
		{title: "IP"},
		{title: "端口"},
		{title: "频率设置"},
		{title: "用户"},
		{title: "操作"},
		{title: "状态"}
	 ]; 
    $scope.otherDataset = [];
    
	// 查询(前台分页)
    $scope.findTem = function(key,result){
    	//将数据集赋值为空
    	$scope.otherDataset = [];
    	//更新表格对应的数据集
    		var con = result;
    		var tempArray = new Array();
    		if(key != "risk"){
    			for(var i = 0; i<con.length;i++){
    				  
    	              var operate = "";
    	              if($scope.workflow_update){
        	              operate = operate.concat("<a class='row-operation-distance  reset-operation update-row8' data-toggle='modal' data-target='#workFlowParams'>修改</a>");
    	              }if($scope.workflow_delete){
        	              operate = operate.concat( "<a class='row-operation-distance fobid-operation update-row9' data-toggle='modal'>删除</a>");
    	              }
    			      var tempArr = [(i+1),con[i].id,con[i].workFlowName,con[i].instClientID, con[i].innerAccountID,$scope.transModelTypes(con[i].modelType),
    	                               $scope.transProcedures(con[i].modelType),$scope.transDefaultModes(con[i].defaultMode),
    	                               operate
    	                               ];
    		            $scope.otherDataset.push(tempArr);
    	            }
    	   
    			$scope.workFlowTable = $scope.tableInit("workFlow_dynamic_table",$scope.otherDataset,$scope.workFlow_columns);
    		}else{
    			for(var i = 0; i<con.length;i++){
    				  // 操作列
    	              var operate = "";
    	              if($scope.risknode_update){
        	              operate = operate.concat("<a class='row-operation-distance reset-operation update-row5' data-toggle='modal' data-target='#addFofNodeModal'>修改</a>");  
    	              }if($scope.risknode_rightset){
        	              operate = operate.concat( "<a class='row-operation-distance right-row update-row6' data-toggle='modal' data-target='#datarightSetModal'>权限设置</a>");
    	              }if($scope.risknode_delete){
        	              operate = operate.concat( "<a class='row-operation-distance fobid-operation update-row7' data-toggle='modal' >删除</a>");
    	              }
            	
    	              var rateSet = "";
    	              if(con[i].updateStyle == "1"){
    	            	  rateSet = (con[i].updateFreq).concat("s");
    	              }else if(con[i].updateStyle == "0"){
    	            	  rateSet = con[i].sendTime;
    	              }
    			      var tempArr = [(i+1),con[i].id,con[i].risknodeName,con[i].userIp, con[i].userPort,rateSet,con[i].userName,
    	                               operate,$scope.transRisknodestatusTypes(con[i].risknodeStatus)
    	                               ];
    		            $scope.otherDataset.push(tempArr);
    		            con[i].index = i+1;
    	            }
    			$scope.modalEntity = con;
    			$scope.$apply();
    			$scope.riskNodeTable = $scope.tableInit("riskNode_dynamic_table",$scope.otherDataset,$scope.risknode_columns);
    		}
            
    }
    
    $scope.tableInit = function(id,dataset,columns){
    	
   	return $('#'+id).DataTable( {
   		data : dataset,
       	columns : columns,
           dom: 'rt<"bottom"iplB>',
           destroy: true,
           fixedColumns:   {
               leftColumns: 0,
               rightColumns: 1
           },
   		buttons: [
   		   
   		]
       } );
   }
    
 // 初始化工作流数据显示
    $scope.initWorkFlowList = function(entity){
    	$timeout(function() {
    		$scope.fundWorkFlowService.findByQuery(function(result){
    			$scope.findTem("workFlow",result);
    			$scope.workFlowEntitys = result;
    			$scope.$apply();
    		
    		
    		// 模态框重绘
    		$('#workFlowMsg').on('show.bs.modal', function (e) {
    			$(this).find('.modal-dialog').css({
                    'margin-left': function () {
                        var modalHeight = $('#workFlowMsg').find('.modal-dialog').width();
                        return ($(window).width() / 2 - 500);
                    }
                });
            });
    		
    	},{
    		fundProductID: entity.fundProductID,
    		instClientID: entity.instClientID
    	});
        }, 500);
    	
    }
    
    // 初始化风控节点数据显示
    $scope.initRiskNodeList = function(entity){
    	$timeout(function() {
    		findByfundproduct(function(result){
        		$scope.findTem("risk",result);
        		$scope.risknodeEntitys=result;
        		$scope.$apply();
        	},entity);
    	},500);
    }
    
});
