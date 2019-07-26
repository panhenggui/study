myapp.controller('SubProductMarginSetController', function ($scope, $timeout,$rootScope) {
	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
	$scope.listEntitys = [];// 客户产品保证金
	$scope.SubCapitalEntitys=[];// 客户资金信息
	$scope.exchangeDatas={};// 交易所信息
	$scope.queryEntity = {};
    $scope.ModalEntity = {};
    $scope.entitys = [];
    $scope.isUpdate = false;
	$scope.isChecked = false;
	//以后兼容其他时候下拉筛选 不可写死
	$scope.productType ="";
	$scope.subAccounts = [];
	$scope.yuanLists=new Array();
	$scope.mudiLists=new Array();
	$scope.tmpEntity = {};//临时变量
	$scope.yuanEntity={};//初始化 源资金账号
	$scope.mudiEntity={};//初始化 目的资金账号
	$scope.ModalEntity = {};
	$scope.ModalEntity.longMarginRate = 0;
	$scope.SubProductMarginSetDataset = [];

	// 交易类型
	$scope.tradeTypes = clearConstant.tradeTypes;
	
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$scope.subProductMarginSet_query = isShow("subProductMarginSet_query");
	$scope.subProductMarginSet_outexcel = isShow("subProductMarginSet_outexcel");
	$scope.subProductMarginSet_add = isShow("subProductMarginSet_add");
	$scope.subProductMarginSet_batchdelete = isShow("subProductMarginSet_batchdelete");
	$scope.subProductMarginSet_copy = isShow("subProductMarginSet_copy");
	$scope.subProductMarginSet_in = isShow("subProductMarginSet_in");
	$scope.subProductMarginSet_update = isShow("subProductMarginSet_update");
	$scope.subProductMarginSet_delete = isShow("subProductMarginSet_delete");

	// 初始化页面信息
	//查询是否属于机构
    queryInstClientID(function (result) {
        if(result != undefined ){
        	$scope.typeName = "资产单元";
            // 初始化资产单元下拉列表
            getAllSubCapitalEntitys(function (result) {
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
	
   //定义固定列头
   $scope.SubProductMarginFxSet_column = [
          {title:"<a class='click-choice-all'></a>"},
          {title:"id",visible:false},
          {title: "资产单元"},
          {title: "资产单元名称"},
          {title: "交易所代码"},
          {title: "品种代码"},
          {title: "投保标志"}, 
          {title: "多头按金额"},
          {title: "多头按手数"},
          {title: "空头按金额"},
          {title: "空头按手数"},
	  	  {title: "操作"}
    ]
   
   //定义固定列头
   $scope.SubProductMarginZjSet_column = [
          {title:"<a class='click-choice-all'></a>"},
          {title:"id",visible:false},
          {title: "资金账户"},
          {title: "资金账户名称"},
          {title: "交易所代码"},
          {title: "品种代码"},
          {title: "投保标志"}, 
          {title: "多头按金额"},
          {title: "多头按手数"},
          {title: "空头按金额"},
          {title: "空头按手数"},
	  	  {title: "操作"}
    ]

    
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
	
	    
    getAllSubProductMarginSet(function (result){
		 $scope.listEntitys = result;
		 $scope.$apply();
	});
    
	//品种和子资金账号关联
	findBySubProductAccountID(function(result){
		$scope.subAccounts = result;
		$scope.$apply();
	});
    
	$scope.transTmp = function (text){
    	var count = $scope.SubCapitalEntitys.length;
        for (var i = 0; i < count; i++) {
            if ($scope.SubCapitalEntitys[i].subAccountID == text) {
                return $scope.SubCapitalEntitys[i].subAccountName;
            }
        }
    }
	// 初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
    });
    
    // 按照产品类型获取产品信息
	findProductEntity(function(result) {
		$scope.productDatas = result;
	}, { productType: $scope.productType});
    
	$("body").undelegate("#SubProductMarginFxSet_dynamic_table_wrapper td .update-row","click");
	//表格修改事件
    $("body").delegate("#SubProductMarginFxSet_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.SubProductMarginFxSetTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $timeout(function() {
        	$scope.initUpdateParam(id,$scope.modalEntity);
        }, 500);
    });
    $("body").undelegate("#SubProductMarginZjSet_dynamic_table_wrapper td .update-row","click");
        $("body").delegate("#SubProductMarginZjSet_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.SubProductMarginZjSetTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $timeout(function() {
        	$scope.initUpdateParam(id,$scope.modalEntity);
        }, 500);
    });
        $("body").undelegate("#SubProductMarginFxSet_dynamic_table_wrapper td .delete-row","click");
    //表格删除事件
    $("body").delegate("#SubProductMarginFxSet_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.SubProductMarginFxSetTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
       $scope.remove(id,$scope.modalEntity);
    });
    $("body").undelegate("#SubProductMarginZjSet_dynamic_table_wrapper td .delete-row","click");
     $("body").delegate("#SubProductMarginZjSet_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.SubProductMarginZjSetTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
       $scope.remove(id,$scope.modalEntity);
    });

    // 根据页面条件查询
    $scope.find = function () {  	
    	$scope.isQuery = true;
		$scope.SubProductMarginSetDataset = [];
		$scope.listEntitys = [];
		findBySubProductMarginSet(function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator1 = $scope.getUpdate($scope.subProductMarginSet_update);
				var operator2 = $scope.getDelete($scope.subProductMarginSet_delete);
		    	var tempArr = ["<a class='click-choice-one'></a>",con[i].id,con[i].subAccountID,con[i].subAccountName,con[i].exchID,con[i].productID,$scope.transTradeType(con[i].tradeType),con[i].longMarginRateStr
		    					,con[i].longMarginAmt,con[i].shortMarginRateStr,con[i].shortMarginAmt,operator1+operator2]
		    	$scope.SubProductMarginSetDataset.push(tempArr);
		    	con[i].index = i+1;
			}
			$scope.listEntitys = con;
			//重新绘表
			if($scope.typeName=="资产单元"){
				$scope.isFx = true;
			    $scope.SubProductMarginFxSetTable.clear().draw();
		        $scope.SubProductMarginFxSetTable.rows.add($scope.SubProductMarginSetDataset).draw();
			}else{
				$scope.isFx = false;
			    $scope.SubProductMarginZjSetTable.clear().draw();
		        $scope.SubProductMarginZjSetTable.rows.add($scope.SubProductMarginSetDataset).draw();
			}
			$scope.$apply();
			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		},$scope.queryEntity);
    };
    $timeout(function() {
    	  $scope.find();
    }, 1000);
  

	$scope.getUpdate = function(flag){
    	var result = "";
    	if(flag){
    		result = "<a class='update-row' data-toggle='modal' data-target='#subProductMarginSetModal'>修改</a>"; 
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
    
    function formValidateReset() {
        $scope.myForm.longMarginRate.$setPristine();
        $scope.myForm.longMarginAmt.$setPristine();
        $scope.myForm.shortMarginRate.$setPristine();
        $scope.myForm.shortMarginAmt.$setPristine();
        $scope.myForm.exchID.$setPristine();
        $scope.myForm.productID.$setPristine();
    }
	// 初始化复制内容
	$scope.copyInitParameter= function(){
		$scope.subAccounts = [];
		$scope.yuanEntity.subAccountID ="";
		$scope.mudiEntity.subAccountID = "";
		if($scope.SubCapitalEntitys != null && $scope.SubCapitalEntitys.length > 0){
			$scope.mudiEntity.subAccountID = $scope.SubCapitalEntitys[0].subAccountID;
		}
		findBySubProductAccountID(function(result){
			if(result != null && result.length > 0){
				$scope.subAccounts=result;
				$scope.yuanEntity.subAccountID = $scope.subAccounts[0].subAccountID;
				$scope.$apply();
			}
			$timeout(function() {
				$("#subProductMarginSetCopyModal").modal("show");
			}, 500);
		
			$scope.$apply();
		});
	}
    // 复制
	$scope.copy= function (yuanEntity,mudiEntity){
		if(yuanEntity.subAccountID ==undefined  || yuanEntity.subAccountID.length==0){
			layer.msg("原账号不能为空!", {icon: 2, time: 3000});
            return false;
		}
		if(mudiEntity.subAccountID ==undefined  || mudiEntity.subAccountID.length==0 ){
			layer.msg("目的账号不能为空!", {icon: 2, time: 3000});
            return false;
		}
			//是否源信息ID和目的信息ID一样
			if(yuanEntity.subAccountID != mudiEntity.subAccountID){
				layer.confirm('复制将清除目的账号'+mudiEntity.subAccountID+'的原设置信息，是否继续？', {
					icon : 3
				}, function(count) {
					//源资金账号
					findBySubProductAccountIDList(function(results){
						$scope.yuanLists=results;
						//目的资金账号
						findBySubProductAccountIDList(function(val){
							$scope.mudiLists=val;
							deleteSubProductMarginSetLists(function (tresult){
								$scope.listEntitys = tresult;
								for(var i = 0;i < $scope.yuanLists.length;i++){
									$scope.tmpEntity = {};
									$scope.tmpEntity.exchID = $scope.yuanLists[i].exchID;
									$scope.tmpEntity.productID = $scope.yuanLists[i].productID;
									$scope.tmpEntity.tradeType = $scope.yuanLists[i].tradeType;
									$scope.tmpEntity.longMarginRate = $scope.yuanLists[i].longMarginRateStr;
									$scope.tmpEntity.longMarginAmt = $scope.yuanLists[i].longMarginAmt;
									$scope.tmpEntity.shortMarginRate = $scope.yuanLists[i].shortMarginRateStr;
									$scope.tmpEntity.shortMarginAmt = $scope.yuanLists[i].shortMarginAmt;
									$scope.tmpEntity.subAccountID = mudiEntity.subAccountID;
									var count = 0;
									saveSubProductMarginSet(function (result) {
										result.subAccountName = $scope.transTmp(result.subAccountID);
										$scope.listEntitys.push(result);
										$scope.find();
										$scope.$apply();
					                 }, $scope.tmpEntity);
								}
								layer.msg("复制成功", {
									icon : 1,
										time: 500
								});
								layer.close(count);
							},val);
						},{subAccountID:mudiEntity.subAccountID});
						
					},{subAccountID:yuanEntity.subAccountID});
				});
				// 关闭窗口
				$("#subProductMarginSetCopyModal").modal("hide");
			}else{
				if($scope.typeName == "资产单元"){
					layer.msg("源资产单元与目的资产单元不能相同!", {icon: 2, time: 3000});
				}else {
					layer.msg("源资金账号与目的资金账号不能相同!", {icon: 2, time: 3000});
				}
			}
	}
    // 初始化添加
    $scope.initParameter = function () {
    	$scope.ModalEntity = {};
    	$scope.isUpdate = false;
		$scope.ModalEntity.tradeType = $scope.tradeTypes[0].key;
    	if($scope.SubCapitalEntitys != null && $scope.SubCapitalEntitys.length > 0){
        	$scope.ModalEntity.subAccountID = $scope.SubCapitalEntitys[0].subAccountID;
		}
        setDefaultValue();
        formValidateReset();
    };
    //显示默认值
    function setDefaultValue() {
        $scope.ModalEntity.longMarginRate=0;
        $scope.ModalEntity.longMarginAmt=0;
        $scope.ModalEntity.shortMarginRate=0;
        $scope.ModalEntity.shortMarginAmt=0;
    }
    
    $scope.transTradeType = function (text) {
        var count = $scope.tradeTypes.length;
        for (var i = 0; i < count; i++) {
            if ($scope.tradeTypes[i].key == text) {
                return $scope.tradeTypes[i].text;
            }
        }
    };

  // 修改
    $scope.initUpdateParam = function (index, entity) {
    	$scope.isUpdate = true;
        $scope.products = new Array();
        angular.forEach($scope.productDatas, function (data, index, array) {
            if (data.exchID == entity.exchID) {
                $scope.products.push(array[index]);
            }
        });
        entity.recordIndex = index;
        $scope.ModalEntity = angular.copy(entity);
        
        //修改时，精度处理
        $scope.ModalEntity.longMarginRate=accMul($scope.ModalEntity.longMarginRate,100).toFixed(6);
        $scope.ModalEntity.shortMarginRate=accMul($scope.ModalEntity.shortMarginRate,100).toFixed(6);
        
        if (entity.isLockMargin == 1) {
            $scope.ModalEntity.isLockMargin = 1;
        } else {
            $scope.ModalEntity.isLockMargin = 0;
        }
        oldRate = $scope.ModalEntity.lockMarginRate;
        oldAmt = $scope.ModalEntity.lockMarginAmt;
        formValidateReset();
    };
    
    $scope.save = function (entity) {
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        
        $scope.tmpSaveEntity = {};
        $scope.tmpSaveEntity = angular.copy(entity);
        
        //精度处理
        $scope.tmpSaveEntity.longMarginRate = accDiv($scope.tmpSaveEntity.longMarginRate,100).toString();
        $scope.tmpSaveEntity.shortMarginRate = accDiv($scope.tmpSaveEntity.shortMarginRate,100).toString();
        
        // 增加
        if (index == undefined) {
        	findBySubProductMarginSet(function (result) {
                if (result.length > 0) {
                    layer.msg("记录已存在!", {icon: 2, time: 3000});
                    return false;
                } else {
                	$scope.tmpSaveEntity.isLockMargin = "0";
                	saveSubProductMarginSet(function (addResult) {
                		addResult.subAccountName = $scope.transTmp(addResult.subAccountID);
                		$scope.listEntitys.unshift(addResult);
                		$scope.$apply();
                		 $scope.find();
                		// 关闭窗口
                		$("#subProductMarginSetModal").modal("hide");
	               }, $scope.tmpSaveEntity);
                }
            }, {subAccountID:$scope.tmpSaveEntity.subAccountID,
            	exchID:$scope.tmpSaveEntity.exchID,
            	tradeType:$scope.tmpSaveEntity.tradeType,
            	productID:$scope.tmpSaveEntity.productID});
            // 修改
        } else {
        	$scope.isUpdate = true;
        	updateSubProductMarginSet(function (result) {
        		result.subAccountName = $scope.transTmp(result.subAccountID);
        		result.index = tableIndex;
        		$scope.listEntitys.splice(tableIndex-1, 1, result);  
        		if($scope.typeName=="资产单元"){
    		        $scope.SubProductMarginFxSetTable.cells().every( function () {
                        if((tableIndex-1) == this[0][0].row){
                        	if(this[0][0].column == 3){
                                this.data(entity.subAccountName);
                                $scope.$apply();
                            }
                            if(this[0][0].column == 7){
                                this.data(scientificToNumber($scope.tmpSaveEntity.longMarginRate));
                                $scope.$apply();
                            }
                            if(this[0][0].column == 8){
                                this.data(entity.longMarginAmt);
                                $scope.$apply();
                            }
                            if(this[0][0].column == 9){
                                this.data(scientificToNumber($scope.tmpSaveEntity.shortMarginRate));
                                $scope.$apply();
                            }
                            if(this[0][0].column == 10){
                                this.data(entity.shortMarginAmt);
                                $scope.$apply();
                            }
                        }

                    });
    			}else{
    		        $scope.SubProductMarginZjSetTable.cells().every( function () {
                        if((tableIndex-1) == this[0][0].row){
                        	if(this[0][0].column == 3){
                                this.data(entity.subAccountName);
                                $scope.$apply();
                            }
                            if(this[0][0].column == 7){
                                this.data(scientificToNumber($scope.tmpSaveEntity.longMarginRate));
                                $scope.$apply();
                            }
                            if(this[0][0].column == 8){
                                this.data(entity.longMarginAmt);
                                $scope.$apply();
                            }
                            if(this[0][0].column == 9){
                                this.data(scientificToNumber($scope.tmpSaveEntity.shortMarginRate));
                                $scope.$apply();
                            }
                            if(this[0][0].column == 10){
                                this.data(entity.shortMarginAmt);
                                $scope.$apply();
                            }
                        }

                    });
    			}
                
				//$scope.find();
				// 关闭窗口
				$("#subProductMarginSetModal").modal("hide");
            }, $scope.tmpSaveEntity);
        }
    };
    
  // 删除
    $scope.remove = function (index, entity) {
        layer.confirm('确定删除该条记录？', {icon: 3}, function (count) {
        	deleteSubProductMarginSet(entity.id);
            $scope.listEntitys.splice(index, 1);
            $timeout(function() {
            	$scope.find();//对应方法
            }, 500);
            $scope.$apply();
            layer.close(count);
        });
    };
    // 批量删除
	$scope.removeLists = function() {
		$scope.entitys = [];
		$scope.entitys = $scope.getRemoveEntitys();
		if ($scope.entitys.length > 0) {
			layer.confirm('确认批量删除该账号品种保证金率？', {
				icon : 3
			}, function(count) {
				deleteSubProductMarginSetLists(function (){
					// 初始化页面信息
				    $scope.isChecked = false;
				    $scope.entitys=[];
				    $timeout(function() {
		            	$scope.find();//对应方法
		            }, 500);
				},$scope.entitys);
				layer.close(count);
				layer.msg("删除该账号品种保证金信息成功", {
					icon : 1
				});
			});
		} else {
			layer.msg('请选择要删除的账号品种保证金信息', {
				icon : 2
			});
		}
		
	};
	
    //获取需要删除的集合
	$scope.getRemoveEntitys = function(){
			  var tmpEntitys = [];
			  //复选框选中列ID
	  	  	  $scope.ids = new Array();
		  	  if($scope.typeName=="资产单元"){
			  	  	$("#SubProductMarginFxSet_dynamic_table a").each(function(){
			  	  		var flag = $(this).hasClass("clicked-choice-one");
					  	  		if(flag){
						  	  		var mytr = $(this).parents("tr");
							        var tempArr = $scope.SubProductMarginFxSetTable.row(mytr).data();
							        var id = tempArr[1];//获取该行对应的id
							  	  	$scope.ids.push(id);
					  	  	    }
			         });
		  	  }else{
			  	  	$("#SubProductMarginZjSet_dynamic_table a").each(function(){
				  		var flag = $(this).hasClass("clicked-choice-one");
					  	  		if(flag){
						  	  		var mytr = $(this).parents("tr");
							        var tempArr = $scope.SubProductMarginZjSetTable.row(mytr).data();
							        var id = tempArr[1];//获取该行对应的id
							  	  	$scope.ids.push(id);
					  	  	    }
			        });
		  	  }
	  	      for(var i=0;i<$scope.listEntitys.length;i++){
					for(var j=0;j<$scope.ids.length;j++){
						if($scope.listEntitys[i].id==$scope.ids[j]){
							tmpEntitys.push($scope.listEntitys[i]);
						}
					}
			  }		
			  return tmpEntitys;
	}

	// 单个选择
	$scope.recordChecked = function(x, listEntity) {
		if (x) {
			$scope.entitys.push(listEntity);
		} else {
			var index = $scope.entitys.indexOf(listEntity);
			$scope.entitys.splice(index, 1);
		}
	}

	// 全选
	$scope.isChecked == false
	$scope.addChecked = function() {
		if ($scope.isChecked == false) {
			$scope.entitys = angular.copy($scope.listEntitys) ;
			$scope.isChecked = true;
		} else {
			$scope.entitys = [];
			$scope.isChecked = false;
		}
	}
    
	
	//---------------------
    //设置事件方法
    $scope.products = new Array();
    $scope.selectExchange = function (exchID) {
        $scope.products = new Array();
        $scope.ModalEntity.productID = "";
        getAllProductByConditionEntity(
            function (result) {
                if (result.length > 0) {
                    $scope.products = result;
                    $scope.ModalEntity.productID = $scope.products[0].productID;
                    $scope.$apply();
                }
            }, {
                exchID: exchID,
                productID: '',
                productType:$scope.productType,
                productStatus: ''
            });
    };
    //------------------------
    
    //导出excel
    $scope.exportExcel = function (queryEntity) {
    	$scope.tmpExportQuery = angular.copy(queryEntity);
    	framework.file.export("账号品种保证金率查询.xls",'excel',{
			entityKey:['subAccountID','subAccountName','exchID','productID','tradeType','longMarginRateStr','longMarginAmt','shortMarginRateStr','shortMarginAmt'],
			headerKey:['账号ID','账号名称','交易所代码','品种代码','投保标志','多头按金额','多头按手数','空头按金额','空头按手数',	],
			styles:['plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText'],
			title:"账号品种保证金率导出数据",
			dicMap:{tradeType:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}}
		},"subProductMarginSetService", "findByQuery", $scope.tmpExportQuery);
    };
    
    //导入
    $("#subProductMarginSetUploader").uploadFile({
    	  dragdropWidth: 125,
          uploadStr:"Excel导入",
          dragDropStr: "",
          showAbort: false,
          dragDropContainerClass:"",
        url: framework.file.uploadUrl("subProductMarginSetService", "uploadExcel", [null]),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
                if(errCode != 0) {
                    layer.msg(errMsg,{icon: 2});
                } else {
                	if(result != null){
                		if(result.code == '1'){
                			layer.msg("成功导入"+result.info+"条记录！", {icon: 1, time: 1500});
                			getAllSubProductMarginSet(function (result) {
                	            $scope.listEntitys = result;
                	            $scope.find();
                	            $scope.$apply();
                	            $("#subProductMarginSetUploadModal").modal("hide");
                	        });
                		}else if(result.code == '0'){
                			layer.msg(result.info, {icon: 2, time: 3000});
                		}
    				}else{
    					//导入失败
    					layer.msg(result.errorMes, {icon: 2, time: 1500});
    				}
                }
                $("div .ajax-file-upload-container").empty();
            });
        },
        onSelect: function (files) {
            var file = files[0];
            var fileName = file.name;
            var suffix = fileName.substring(fileName.lastIndexOf('.') + 1);
            if(suffix != "xls" ){
                layer.msg('上传文件必须为.xls文件格式', {icon: 2}, 3000);
                return false;
            }
            return true;
        }
    });
    $("body").undelegate("#SubProductMarginZjSet_dynamic_table td a","click");
    $("body").delegate("#SubProductMarginZjSet_dynamic_table td a","click",function(){
    	debugger;
        if($(this).hasClass("click-choice-one")){
            $(this).removeClass("click-choice-one");
            $(this).addClass("clicked-choice-one");
        }
        else{
            $(this).addClass("click-choice-one");
            $(this).removeClass("clicked-choice-one");
        }

    });
    $("body").undelegate("#SubProductMarginFxSet_dynamic_table td a","click");
    $("body").delegate("#SubProductMarginFxSet_dynamic_table td a","click",function(){
    	debugger;
        if($(this).hasClass("click-choice-one")){
            $(this).removeClass("click-choice-one");
            $(this).addClass("clicked-choice-one");
        }
        else{
            $(this).addClass("click-choice-one");
            $(this).removeClass("clicked-choice-one");
        }

    });
    $("body").undelegate(".dataTables_scrollHeadInner th a","click");
    $("body").delegate(".dataTables_scrollHeadInner th a","click",function(){
    	debugger;
        if($(this).hasClass("click-choice-all")){
            $(this).removeClass("click-choice-all");
            $(this).addClass("clicked-choice-all");
            for(var i=0;i<$(".dataTables_scrollBody td a").length;i++){
                if($($(".dataTables_scrollBody td a")[i]).hasClass("click-choice-one")){
                    $($(".dataTables_scrollBody td a")[i]).removeClass("click-choice-one");
                    $($(".dataTables_scrollBody td a")[i]).addClass("clicked-choice-one");
                }
            }
        }
        else{
            $(this).addClass("click-choice-all");
            $(this).removeClass("clicked-choice-all");
            for(var i=0;i<$(".dataTables_scrollBody td a").length;i++){
                if($($(".dataTables_scrollBody td a")[i]).hasClass("clicked-choice-one")){
                    $($(".dataTables_scrollBody td a")[i]).removeClass("clicked-choice-one");
                    $($(".dataTables_scrollBody td a")[i]).addClass("click-choice-one");
                }
            }
        }

    });
    
    
    //初始化
    $(document).ready(function() {
		    	//会话列表初始化
		    	$scope.SubProductMarginFxSetTable = $('#SubProductMarginFxSet_dynamic_table').DataTable( {
			    		data : $scope.SubProductMarginSetDataset,
			        	columns :$scope.SubProductMarginFxSet_column,
			            dom: 'rt<"bottom"iplB>',
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: []
		        } );
		    	
		    	//会话列表初始化
		    	$scope.SubProductMarginZjSetTable = $('#SubProductMarginZjSet_dynamic_table').DataTable( {
			    		data : $scope.SubProductMarginSetDataset,
			        	columns :$scope.SubProductMarginZjSet_column,
			            dom: 'rt<"bottom"iplB>',
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: []
		        } );
      });
    
});

