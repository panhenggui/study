myapp.controller('SubAccountTemplateController', function($scope, $timeout,$rootScope) {
	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
	
	$scope.templateEntitys={};
	$scope.SubCapitalEntitys = [];// 客户资金账号
	$scope.MarginTemplateEntitys={};//保证金模板
	$scope.FeeTemplateEntitys={};//手续费模板 
	$scope.ModalEntity={};
	$scope.tempEntity = {};
	$scope.listEntitys = [];
	$scope.tempEntity.recordIndex = -1;
	$scope.isUpdate = false;
	
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$scope.queryEntity ={};
	$scope.distinctSubAccountList = [];
	$scope.feeTemplateList = [];
	$scope.marginTemplateList = [];
	$scope.combinedResult = [];
	$scope.tmpResult = {};
	$scope.SubAccountTemplateDataset = [];
	
	$scope.subAccountTemplate_query = isShow("subAccountTemplate_query");
	$scope.subAccountTemplate_add = isShow("subAccountTemplate_add");
	$scope.subAccountTemplate_update = isShow("subAccountTemplate_update");
	$scope.subAccountTemplate_delete = isShow("subAccountTemplate_delete");
    
	  //定义固定列头
	    $scope.SubAccountTemplate_column = [
	           {title:"序号"},
	           {title: "账号"},
	           {title: "名称"},
	           {title: "保证金率模板代码"},
	           {title: "保证金率模板名称"},
	           {title: "手续费率模板代码"},
	           {title: "手续费率模板名称"},
	 	  	   {title: "操作"}
	     ]
	    
	// 查询对应费用模板信息
	getAllInfoSubAccountTemplateID(function(result){
		$scope.templateEntitys=result;
	},null,null,null);
	
	    $("body").undelegate("#SubAccountTemplate_dynamic_table_wrapper td .update-row","click");
	  //表格修改事件
	    $("body").delegate("#SubAccountTemplate_dynamic_table_wrapper td .update-row","click",function(){
	    	var mytr = $(this).parents("tr");
	        var tempArr = $scope.SubAccountTemplateTable.row(mytr).data();
	        var id = tempArr[0]
	        var subAccountID = tempArr[1];
	        var marginTemplateID = tempArr[3];
	        var feeTemplateID = tempArr[5];
	        for(var i = 0;i<$scope.listEntitys.length;i++){
	        	if(subAccountID==$scope.listEntitys[i].subAccountID && marginTemplateID==$scope.transFormat($scope.listEntitys[i].marginTemplateID)
	        		&&	feeTemplateID==$scope.transFormat($scope.listEntitys[i].feeTemplateID)){
	        		    $scope.modalEntity = $scope.listEntitys[i];
	        	}
	        }
	       $scope.initUpdateParam(id,$scope.modalEntity);
	    });
	    $("body").undelegate("#SubAccountTemplate_dynamic_table_wrapper td .delete-row","click");
	     //表格删除事件
	    $("body").delegate("#SubAccountTemplate_dynamic_table_wrapper td .delete-row","click",function(){
	    	var mytr = $(this).parents("tr");
	        var tempArr = $scope.SubAccountTemplateTable.row(mytr).data();
	        var id = tempArr[0]
	        var subAccountID = tempArr[1];
	        var marginTemplateID = tempArr[3];
	        var feeTemplateID = tempArr[5];
	        for(var i = 0;i<$scope.listEntitys.length;i++){
	        	if(subAccountID==$scope.listEntitys[i].subAccountID && marginTemplateID==$scope.transFormat($scope.listEntitys[i].marginTemplateID)
	        		&&	feeTemplateID==$scope.transFormat($scope.listEntitys[i].feeTemplateID)){
	        		    $scope.modalEntity = $scope.listEntitys[i];
	        	}
	        }
	       $scope.remove(id,$scope.modalEntity);
	    });
	    
	    
//	-------------------------------------------
	$scope.initPage = function (queryEntity){
		//debugger;
		//获取数据
		//查询所有资产单元记录
		getDistinctSubAccountID(function(result){
			$scope.distinctSubAccountList = result;
			
			//查询手续费数据
			findSubAccountTemplateByCondition(function(result){
				$scope.feeTemplateList =result;
				
				//查询保证金数据
				findSubAccountTemplateByCondition(function(result){
					$scope.marginTemplateList =result;
					$scope.queryResult=[];//清空数据
					
					//组装所有数据
					if($scope.marginTemplateList.length > 0 && $scope.feeTemplateList.length > 0){
						angular.forEach($scope.distinctSubAccountList,function(value,index,list){
							$scope.tmpResult = new Object();
							$scope.tmpResult.subAccountID = value;
							var flag1 = true;
							var flag2 = true;
							var flag3 = true;
							var flag4 = true;
							angular.forEach($scope.marginTemplateList,function(ivalue,iindex,ilist){
								if(flag1 && flag3){
								
									if(ivalue.subAccountID == value ){
										if( queryEntity.feeTemplateID!="" && queryEntity.feeTemplateID!=undefined){
											angular.forEach($scope.feeTemplateList,function(fvalue,iindex,ilist){
												if(flag3){
													if(ivalue.subAccountID ==fvalue.subAccountID){
														$scope.tmpResult.marginTemplateID = ivalue.templateID;
														flag3= false;
													}else{
														$scope.tmpResult.marginTemplateID = undefined;
													}
												}
											});
										}else {
											$scope.tmpResult.marginTemplateID = ivalue.templateID;
											flag1 = false;
										}
									
									}else{
										$scope.tmpResult.marginTemplateID =undefined;
									}
								}
							});
							angular.forEach($scope.feeTemplateList,function(ivalue,iindex,ilist){
								if(flag2 && flag4){
									if(ivalue.subAccountID == value){
										if( queryEntity.marginTemplateID!="" && queryEntity.marginTemplateID!=undefined){
											angular.forEach($scope.marginTemplateList,function(fvalue,iindex,ilist){
												if(flag4){
													if(ivalue.subAccountID ==fvalue.subAccountID){
														$scope.tmpResult.feeTemplateID = ivalue.templateID;
														flag4= false;
													}else{
														$scope.tmpResult.feeTemplateID = undefined;
													}
												}
											});
										}else {
										
											$scope.tmpResult.feeTemplateID = ivalue.templateID;
											flag2 = false;
										}
									}else{
										$scope.tmpResult.feeTemplateID =undefined;
									}
								}
							});
							if($scope.tmpResult.marginTemplateID!=undefined || 
									$scope.tmpResult.feeTemplateID!=undefined){
								$scope.queryResult.push($scope.tmpResult);
							}
							if(index == list.length-1){
								$scope.$apply();
							}
						});
						//	//查询保证金数据   wu手续费数据
					}else if($scope.marginTemplateList.length > 0 && $scope.feeTemplateList.length == 0){
						angular.forEach($scope.distinctSubAccountList,function(value,index,list){
							$scope.tmpResult = new Object();
							$scope.tmpResult.subAccountID = value;
							var flag1 = true;
							var flag3 = true;
							angular.forEach($scope.marginTemplateList,function(ivalue,iindex,ilist){
								if(flag1 && flag3){
								
									if(ivalue.subAccountID == value ){
										if( queryEntity.feeTemplateID!="" && queryEntity.feeTemplateID!=undefined){
											angular.forEach($scope.feeTemplateList,function(fvalue,iindex,ilist){
												if(flag3){
													if(ivalue.subAccountID ==fvalue.subAccountID){
														$scope.tmpResult.marginTemplateID = ivalue.templateID;
														flag3= false;
													}else{
														$scope.tmpResult.marginTemplateID =undefined;
													}
												}
											});
										}else {
											$scope.tmpResult.marginTemplateID = ivalue.templateID;
											flag1 = false;
										}
									
									}else{
										$scope.tmpResult.marginTemplateID = undefined;
									}
								}
							});
							if($scope.tmpResult.marginTemplateID!=undefined || 
									$scope.tmpResult.feeTemplateID!=undefined){
								$scope.queryResult.push($scope.tmpResult);
							}
							if(index == list.length-1){
								$scope.$apply();
							}
						});
						//wu保证金数据   you手续费数据
					}else if($scope.marginTemplateList.length == 0 && $scope.feeTemplateList.length > 0) {
						angular.forEach($scope.distinctSubAccountList,function(value,index,list){
							$scope.tmpResult = new Object();
							$scope.tmpResult.subAccountID = value;
							var flag2 = true;
							var flag4 = true;
	
							angular.forEach($scope.feeTemplateList,function(ivalue,iindex,ilist){
								if(flag2 && flag4){
									if(ivalue.subAccountID == value){
										if( queryEntity.marginTemplateID!="" && queryEntity.marginTemplateID!=undefined){
											angular.forEach($scope.marginTemplateList,function(fvalue,iindex,ilist){
												if(flag4){
													if(ivalue.subAccountID ==fvalue.subAccountID){
														$scope.tmpResult.feeTemplateID = ivalue.templateID;
														flag4= false;
													}else{
														$scope.tmpResult.feeTemplateID = undefined;
													}
												}
											});
										}else {
										
											$scope.tmpResult.feeTemplateID = ivalue.templateID;
											flag2 = false;
										}
									}else{
										$scope.tmpResult.feeTemplateID =undefined;
									}
								}
							});
							if($scope.tmpResult.marginTemplateID!=undefined || 
									$scope.tmpResult.feeTemplateID!=undefined){
								$scope.queryResult.push($scope.tmpResult);
							}
							if(index == list.length-1){
								$scope.$apply();
							}
						});
					}
				
			        //准备数据
					$scope.listEntitys = [];
					$scope.SubAccountTemplateDataset=[];
					$scope.isQuery = true;
					var con = $scope.queryResult;
					$scope.listEntitys = $scope.queryResult;
					for(var i = 0; i<con.length;i++){
						var operator1 = $scope.getUpdate($scope.subAccountTemplate_update);
						var operator2 = $scope.getDelete($scope.subAccountTemplate_delete);
				    	var tempArr = [(i+1),con[i].subAccountID,$scope.transFundSubCapital(con[i].subAccountID),$scope.transFormat(con[i].marginTemplateID),$scope.transFundMarginTemplate(con[i].marginTemplateID)
				    	           	,$scope.transFormat(con[i].feeTemplateID),$scope.transFundFeeTemplate(con[i].feeTemplateID),operator1+operator2]
				    	$scope.SubAccountTemplateDataset.push(tempArr); 
				    	con[i].index = i+1;
					}
					$scope.listEntitys = con;
					$scope.templateEntitys = con;
					//重新绘表
			        $scope.SubAccountTemplateTable.clear().draw();
			        $scope.SubAccountTemplateTable.rows.add($scope.SubAccountTemplateDataset).draw();
					$scope.$apply();
					$timeout(function() {
		                $scope.isQuery = false;
		            }, 1000);			
					
				},{
					templateType:"1",
					templateID: queryEntity.marginTemplateID
				});
				
			},{
				templateType:"2",
				templateID: queryEntity.feeTemplateID
			});
		},queryEntity.subAccountID);		
	}
	
	$timeout(function(){
		$scope.initPage($scope.queryEntity);
	},1000);
	
	$scope.getUpdate = function(flag){
		var result = "";
		if(flag){
			result = "<a class='update-row' data-toggle='modal' data-target='#subAccountTemplateModal'>修改</a>"; 
		}
		return result;
	}

	$scope.getDelete = function(flag){
		var result = "";
		if(flag){
			result = "<a class='delete-row'>删除</a>";
		}
		return result;
	}
	
	
//-----------------------------------------------
	//查询是否属于机构
    queryInstClientID(function (result) {
        if(result != undefined ){
        	$scope.typeName = "资产单元";
            // 初始化资产单元下拉列表
            getAllSubCapitalEntity(function (result){
            	$scope.SubCapitalEntitys = result;
            	$scope.$apply();
            });
        }else{
        	$scope.typeName = "资金账号";
        	findCapitalByBrokId(function (result) {
        		pushEntitys(result);
        		$scope.$apply();
            });
        }
    });
    
    
    function pushEntitys(s){
		$scope.SubCapitalEntitys = [];
		angular.forEach(s, function (value, index, arrays) {
			$scope.tmpEntitys = {};
			$scope.tmpEntitys.subAccountID = value.innerAccountID;
			$scope.tmpEntitys.subAccountName = value.accountName;
			 $scope.SubCapitalEntitys.push($scope.tmpEntitys);
		});
		$scope.$apply();
	}
	
/*	
	// 初始化内部账户下拉列表
    getAllSubCapitalEntitys(function (result) {
        $scope.SubCapitalEntitys = result;
    });*/
	//保证金模板下拉列表
    getAllMarginTemplate(function (result){
    	$scope.MarginTemplateEntitys = result;
    });
    //手续费模板
    getAllFeeTemplateEntity(function(result){
    	$scope.FeeTemplateEntitys=result;
    });
    //资金账户+保证金模板+手续费模板
    $scope.find=function(entity){
    	getAllInfoSubAccountTemplateID(function(result){
    		$scope.templateEntitys=result;
    	},entity.subAccountID,entity.marginTemplateID,entity.feeTemplateID);
    };
    //初始化
    $scope.initParameter = function() {
		$scope.isUpdate = false;
		$scope.ModalEntity={};
//		$scope.tempEntity = angular.copy(entity);
//		$scope.ModalEntity = angular.copy($scope.tempEntity);
		$scope.ModalEntity.subAccountID = $scope.SubCapitalEntitys[0].subAccountID;
//		$timeout(function() {
//			document.getElementById("subAccountID").focus();
//		}, 500);
	};
	
	// 修改初始化信息
	$scope.initUpdateParam = function(index, entity) {
		$scope.isUpdate = true;
		$scope.tempEntity = angular.copy(entity);
		if ($scope.tempEntity.marginTemplateID == undefined ){
			$scope.tempEntity.marginTemplateID = "";
		}
		if ($scope.tempEntity.feeTemplateID == undefined ){
			$scope.tempEntity.feeTemplateID = "";
		}
		$scope.tempEntity.recordIndex = index;
		$scope.ModalEntity = angular.copy($scope.tempEntity);
		$scope.$apply();
	};
	
	// 保存操作记录
	$scope.save = function(entity) {
		var index = entity.recordIndex;
		var tableIndex = entity.index;
		
		// 分组代码是否存在
		if (index != undefined) {
			findSubAccountTemplateByCondition(function(resultes) {
				 if(entity.marginTemplateID == "" && entity.feeTemplateID != ""){
						/*//删除
						deleteSubAccountTemplateSubAccountID(entity.subAccountID);
						//修改
*/						saveAndDelSubAccountTemplate(function(result){
							result.index = tableIndex;
							$scope.templateEntitys.unshift(result);
							
			        		$scope.listEntitys.splice(tableIndex-1, 1, entity);  
							$scope.SubAccountTemplateTable.cells().every( function () {
			                    if((tableIndex-1) == this[0][0].row){
			                        if(this[0][0].column == 2){
			                            this.data($scope.transFundSubCapital(entity.subAccountID));
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 3){
			                            this.data($scope.transFormat(entity.marginTemplateID));
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 4){
			                            this.data($scope.transFundMarginTemplate(entity.marginTemplateID));
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 5){
			                            this.data($scope.transFormat(entity.feeTemplateID));
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 6){
			                            this.data($scope.transFundFeeTemplate(entity.feeTemplateID));
			                            $scope.$apply();
			                        }
			                    }

							});
							
							layer.msg('修改成功', {icon : 1});
							//$scope.initPage($scope.queryEntity);
							$("#subAccountTemplateModal").modal("hide");
						},{subAccountID:entity.subAccountID,templateID:entity.feeTemplateID,templateType:"2"},entity.subAccountID,null);
						return true;
					}else if(entity.feeTemplateID == "" && entity.marginTemplateID != ""){
						/*//删除
						deleteSubAccountTemplateSubAccountID(entity.subAccountID);
						//修改
*/						saveAndDelSubAccountTemplate(function(result){
							result.index = tableIndex;
							$scope.templateEntitys.unshift(result);
							
							
			        		$scope.listEntitys.splice(tableIndex-1, 1, entity); 
							$scope.SubAccountTemplateTable.cells().every( function () {
								if((tableIndex-1) == this[0][0].row){
			                        if(this[0][0].column == 2){
			                            this.data($scope.transFundSubCapital(entity.subAccountID));
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 3){
			                            this.data($scope.transFormat(entity.marginTemplateID));
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 4){
			                            this.data($scope.transFundMarginTemplate(entity.marginTemplateID));
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 5){
			                            this.data($scope.transFormat(entity.feeTemplateID));
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 6){
			                            this.data($scope.transFundFeeTemplate(entity.feeTemplateID));
			                            $scope.$apply();
			                        }
			                    }
			                    
							});

							layer.msg('修改成功', {icon : 1});
							//$scope.initPage($scope.queryEntity);
							$("#subAccountTemplateModal").modal("hide");
						},{subAccountID:entity.subAccountID,templateID:entity.marginTemplateID,templateType:"1"},entity.subAccountID,null);
						return true;
					}else if(entity.marginTemplateID != "" && entity.feeTemplateID != ""){
						/*//修改
						deleteSubAccountTemplateSubAccountID(entity.subAccountID);*/
						saveAndDelSubAccountTemplate(function(result){
							result.index = tableIndex;
							$scope.templateEntitys.unshift(result);
							
			        		$scope.listEntitys.splice(tableIndex-1, 1, entity); 
							$scope.SubAccountTemplateTable.cells().every( function () {
								if((tableIndex-1) == this[0][0].row){
			                        if(this[0][0].column == 2){
			                            this.data($scope.transFundSubCapital(entity.subAccountID));
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 3){
			                            this.data($scope.transFormat(entity.marginTemplateID));
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 4){
			                            this.data($scope.transFundMarginTemplate(entity.marginTemplateID));
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 5){
			                            this.data($scope.transFormat(entity.feeTemplateID));
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 6){
			                            this.data($scope.transFundFeeTemplate(entity.feeTemplateID));
			                            $scope.$apply();
			                        }
			                    }
							});
							layer.msg('修改成功', {icon : 1});
							//$scope.initPage($scope.queryEntity);
							$("#subAccountTemplateModal").modal("hide");
						},{subAccountID:entity.subAccountID,templateID:entity.feeTemplateID,templateType:"2"},entity.subAccountID,
						{subAccountID:entity.subAccountID,templateID:entity.marginTemplateID,templateType:"1"});
						/*//修改
						saveSubAccountTemplate(function(result){
							$scope.templateEntitys.unshift(result);
							//刷新
							$scope.initPage($scope.queryEntity);
						},{subAccountID:entity.subAccountID,templateID:entity.marginTemplateID,templateType:"1"});*/
						return true;
					}else if(entity.marginTemplateID == "" && entity.feeTemplateID == ""){
						layer.msg('保证金模板和手续费模板，必须有一项必填!', {
							icon : 2
						});
						return false;
					}
					/*$scope.initPage($scope.queryEntity);*/
			},entity);
		} else {
			if (entity.marginTemplateID ==""){
				delete  entity.marginTemplateID ;
			}
			if (entity.feeTemplateID ==""){
				delete entity.feeTemplateID ;
			}
			//刷新
			/*$scope.initPage($scope.queryEntity);*/
			findSubAccountTemplateByCondition(function(result) {
				if (result.length < 1) {
					// 新增
					if(entity.marginTemplateID == undefined && entity.feeTemplateID != undefined){
						saveSubAccountTemplate(function(result){
							$scope.templateEntitys.unshift(result);
							//刷新
							$scope.initPage($scope.queryEntity);
							$("#subAccountTemplateModal").modal("hide");
						},{subAccountID:entity.subAccountID,templateID:entity.feeTemplateID,templateType:"2"});
						return true;
					}else if(entity.feeTemplateID == undefined && entity.marginTemplateID != undefined){
						saveSubAccountTemplate(function(result){
							$scope.templateEntitys.unshift(result);
							//刷新
							$scope.initPage($scope.queryEntity);
							$("#subAccountTemplateModal").modal("hide");
						},{subAccountID:entity.subAccountID,templateID:entity.marginTemplateID,templateType:"1"});
						return true;
					//同时添加保证金模板+手续费模板
					}else if(entity.marginTemplateID != undefined && entity.feeTemplateID != undefined){
						/*saveSubAccountTemplate(function(result){
							$scope.templateEntitys.unshift(result);
							//刷新
							$scope.initPage($scope.queryEntity);
						},{subAccountID:entity.subAccountID,templateID:entity.feeTemplateID,templateType:"2"});
						saveSubAccountTemplate(function(result){
							$scope.templateEntitys.unshift(result);
							//刷新
							$scope.initPage($scope.queryEntity);
						},{subAccountID:entity.subAccountID,templateID:entity.marginTemplateID,templateType:"1"});*/
						saveTwoDelSubAccountTemplate(function(result){
							$scope.templateEntitys.unshift(result);
							$scope.initPage($scope.queryEntity);
							$("#subAccountTemplateModal").modal("hide");
						},{subAccountID:entity.subAccountID,templateID:entity.feeTemplateID,templateType:"2"},
						{subAccountID:entity.subAccountID,templateID:entity.marginTemplateID,templateType:"1"});
						return true;
					}else if(entity.marginTemplateID == undefined && entity.feeTemplateID == undefined){
						layer.msg('保证金模板和手续费模板，必须有一项必填!', {
							icon : 2
						});
						return false;
					}
				} else {
					layer.msg('该账户已对应模板代码_模板名称，无法重复添加', {
						icon : 2
					});
					return false;
				}
			},entity);
			//刷新
			/*$scope.initPage($scope.queryEntity);*/
			
		}
	};
	
	
	// 删除
	$scope.remove = function(index, entity) {
		layer.confirm('确定要删除对应模板信息吗？', {
			icon : 3
		}, function(count) {
			deleteSubAccountTemplateSubAccountID(entity.subAccountID);
			$scope.templateEntitys.splice(index, 1);
			//刷新
		    $scope.queryResult.splice(index, 1);
		    $timeout(function() {
		    	$scope.initPage($scope.queryEntity);
		    }, 500);
			$scope.$apply();
			layer.close(count);
		
		});
	};
	

	//将undefined或空值转换为空字符串
	$scope.transFormat = function(text){
		var result = "";
		if(text != null && text != undefined){
			result = text;
		}
		return result;
	}

	
	 // 页面账号转换账号名称
    $scope.transFundSubCapital = function (text) {
    	var result = "";
    	if(text !=null && text!=undefined){
    		var count = $scope.SubCapitalEntitys.length;
            for (var i = 0; i < count; i++) {
                if ($scope.SubCapitalEntitys[i].subAccountID == text) {
                	result = $scope.SubCapitalEntitys[i].subAccountName;
                }
            }	
    	}
    	return result;
    };
    
 // 页面保证金模板ID转换保证金模板名称
    $scope.transFundMarginTemplate = function (text) {
    	var result = "";
    	if(text !=null && text!=undefined){
            var count = $scope.MarginTemplateEntitys.length;
	        for (var i = 0; i < count; i++) {
	            if ($scope.MarginTemplateEntitys[i].templateID == text) {
	            	result = $scope.MarginTemplateEntitys[i].templateName;
	            }
	        }
    	} 
    	return result;
    };
    

    
 // 页面手续费模板ID转换手续费模板名称
    $scope.transFundFeeTemplate = function (text) {
    	var result = "";
    	if(text !=null && text!=undefined){
	        var count = $scope.FeeTemplateEntitys.length;
	        for (var i = 0; i < count; i++) {
	            if ($scope.FeeTemplateEntitys[i].templateID == text) {
	            	result = $scope.FeeTemplateEntitys[i].templateName;
	            }
	        }
    	}
    	return result;
    };
    
    
    //初始化
    $(document).ready(function() {
		    	//会话列表初始化
		    	$scope.SubAccountTemplateTable = $('#SubAccountTemplate_dynamic_table').DataTable( {
			    		data : $scope.SubAccountTemplateDataset,
			        	columns :$scope.SubAccountTemplate_column,
			            dom: 'rt<"bottom"iplB>',
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: []
		        } );		    	
      });
	
	
});
