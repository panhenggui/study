myapp.controller('MarginTemplateController', function($scope, $timeout,$rootScope) {
	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
	$scope.templateEntitys = {};// 模板集合
	$scope.tempEntity = {};
	$scope.tempEntity.recordIndex = -1;
	$scope.TemplateEntity = {};// 模板对象
	$scope.isUpdate = false;
	$scope.exchangeDatas = {};// 交易所信息
	$scope.productDatas = {};// 品种信息
	$scope.queryFeeTemplateEntity = {};
	// ------------------
	$scope.receiveTypes = clearConstant.receiveTypes;
	$scope.ProductEntitys = {};// 品种模板集合
	$scope.productEntity = {};// 品种对象
	$scope.queryExchanges = {};
	$scope.queryProducts = {};
	$scope.modalExchanges = {};
	//以后兼容其他时候下拉筛选 不可写死
	$scope.productType ="1";
	$scope.modalProducts = {};
	$scope.templateID = -1;// 品种模板ID
	$scope.templateName = "";
	$scope.entitys = [];// 批量删除

	$scope.isOK = true;
	$scope.selectedTemplateName = null;
	
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$scope.marginTemplate_temp_query = isShow("marginTemplate_temp_query");
	$scope.marginTemplate_temp_add = isShow("marginTemplate_temp_add");
	$scope.marginTemplate_temp_outExcel = isShow("marginTemplate_temp_outExcel");
	$scope.marginTemplate_temp_copy = isShow("marginTemplate_temp_copy");
	$scope.marginTemplate_temp_in = isShow("marginTemplate_temp_in");
	$scope.marginTemplate_temp_update = isShow("marginTemplate_temp_update");
	$scope.marginTemplate_temp_delete = isShow("marginTemplate_temp_delete");
	$scope.marginTemplate_fee_query = isShow("marginTemplate_fee_query");
	$scope.marginTemplate_fee_add = isShow("marginTemplate_fee_add");
	$scope.marginTemplate_fee_batchdelete = isShow("marginTemplate_fee_batchdelete");
	$scope.marginTemplate_fee_update = isShow("marginTemplate_fee_update");
	$scope.marginTemplate_fee_delete = isShow("marginTemplate_fee_delete");
	
	
	 //定义固定列头
    $scope.marginTemplate_columns = [
		{title: "序号"},
		{title: "id",visible:false},
		{title:"templateID",visible:false},
		{title: "模板名称"},
		{title: "操作"}                              
    ]
    
    $scope.marginTemplateProduct_columns = [
            {title:"<a class='click-choice-all'></a>"},
            {title: "id",visible:false},
            {title: "模板代码"},
        	{title: "模板名称"},
        	{title: "交易所"},
        	{title: "品种"},
            {title: "投保标志"},
        	{title: "收取方式"},
        	{title: "多头按金额"},
        	{title: "多头按手数"},
        	{title: "空头按金额"},
        	{title: "空头按手数"},
        	{title: "操作"}                       
	]
	
    


	// 查询模板所有信息
	getAllMarginTemplate(function(result) {
		$scope.templateEntitys = result;
		for(var i=0;i<$scope.templateEntitys.length;i++){
			$scope.templateEntitys[i].index = i+1;
		}
		$scope.$apply();
	});
	// 初始化交易所信息
	getAllExchanges(function(result) {
		$scope.exchangeDatas = result;
		$scope.queryExchanges = result;
	});
	// 交易类型
	$scope.tradeTypes = clearConstant.tradeTypes;
	//获取产品信息
	findProductEntity(function(result) {
		$scope.productDatas = result;
		$scope.queryProducts = result;
	}, { productType: $scope.productType});

	//选中模板高亮展示
	$scope.selectedThis =function(flag){
		$scope.selectedTemplateName = flag.templateName;
		angular.forEach($scope.templateEntitys, function(trad) {
			trad.flag = 0;
		});
		angular.forEach($scope.templateEntitys, function(trad1) {
			if(trad1.templateID == flag.templateID){
				trad1.flag = 1;
			}
		});
	};
	
	// 根据所选交易所代码配置品种下拉列表
	$scope.setProductList = function() {
		$scope.queryProducts = {};
		if ($scope.productEntity.exchID == ""
				|| $scope.productEntity.exchID == undefined) {	//未选或者选所有
			$scope.queryExchanges = angular.copy($scope.exchangeDatas);
			$scope.queryProducts = angular.copy($scope.productDatas);
			$scope.productEntity.productID ="";
		}else{
			var t=0;
			for(var i = 0; i < $scope.productDatas.length; i++){	//根据所选项获取品种列表数据
				if($scope.productEntity.exchID == $scope.productDatas[i].exchID){
					$scope.queryProducts[t] = angular.copy($scope.productDatas[i]);
					t=t+1;
				}
			}
			if(t==0){
				$scope.productEntity.productID = "";
			}
		}
	};

	// modal根据所选交易所代码配置品种下拉列表
	$scope.setModalProductList = function() {
		$scope.modalProducts = [];
			var t=0;
			for(var i = 0; i < $scope.productDatas.length; i++){	//根据所选项获取品种列表数据
				if($scope.ProductEntity.exchID == $scope.productDatas[i].exchID){
					$scope.modalProducts[t] = angular.copy($scope.productDatas[i]);
					t=t+1;
				}
			}
			if(t > 0){
				$scope.ProductEntity.productID = $scope.modalProducts[0].productID;
			}else{
                $scope.ProductEntity.productID = "";
				/*$scope.tmpEntity = {};
                $scope.tmpEntity.productName = "无对应数据";
                $scope.tmpEntity.productID = "";
                $scope.modalProducts.push($scope.tmpEntity);
                $scope.ProductEntity.productID = $scope.modalProducts[0].productID;*/
			}
	};
	
	
	// 表单验证
	function formValidateReset() {
		$scope.myForms.longMarginRate.$setPristine();
		$scope.myForms.longMarginAmt.$setPristine();
		$scope.myForms.shortMarginRate.$setPristine();
		$scope.myForms.shortMarginAmt.$setPristine();
		$scope.myForms.exchID.$setPristine();
		$scope.myForms.productID.$setPristine();
	}
	// 点击模板 联动 品种模板信息
	$scope.templateClick = function(templateID) {
		$scope.templateID = templateID;
		findByMarginTemplateProduct(function(result) {
			$scope.ProductEntitys = result;
			$scope.$apply();
		}, {
			templateID : $scope.templateID
		});

		$scope.isOK = false;
	};
/*	// 模板代码，模板名称，品种代码 查询出品种保证金模板
	$scope.findProduct = function(productEntity) {
		productEntity.templateID= $scope.templateID;
		findByMarginTemplateProduct(function(result) {
			$scope.isOK = true;
			$scope.ProductEntitys = result;
			$timeout(function() {
				$scope.isOK = false;
			}, 1000);
		}, productEntity);
	}*/
	$("body").undelegate("#marginTemplateProduct-table td .my-update","click");
    //表格中修改的单击事件
    $("body").delegate("#marginTemplateProduct-table td .my-update","click",function(){
    	var mytr = $(this).parents("tr");
    	$scope.modalEntity = {};
        var tempArr = $scope.marginTemplateProductTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.ProductEntitys.length;i++){
        	if(id==$scope.ProductEntitys[i].id){
        		$scope.modalEntity = $scope.ProductEntitys[i];
        	}
        }
        $scope.initUpdateProduct(id,$scope.modalEntity);
        $scope.$apply();
    });
    $("body").undelegate("#marginTemplateProduct-table td .my-set","click");
    //表格中删除的单击事件
    $("body").delegate("#marginTemplateProduct-table td .my-set","click",function(){
    	var mytr = $(this).parents("tr");
    	$scope.modalEntity = {};
        var tempArr = $scope.marginTemplateProductTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.ProductEntitys.length;i++){
        	if(id==$scope.ProductEntitys[i].id){
        		$scope.modalEntity = $scope.ProductEntitys[i];
        	}
        }
        $scope.isUpdate = true;
        $scope.templateID = $scope.modalEntity.templateID;
        $scope.removeProduct(id,$scope.modalEntity);
    });
    
/*    //  全选与反选  angularjs table 
    $scope.selectAll = function(){
 	   if($("#memberBroker_SelectAll").is(':checked')){
 		   $("#marginTemplateProduct-table input[type='checkbox']").each( function() {
 			   $(this).prop('checked', true);
 			  }); 
 	   }else{
           $("#marginTemplateProduct-table input[type='checkbox']").each( function() {
               $(this).prop('checked', false);
           });
       }
    };*/
    $("body").undelegate("#marginTemplateProduct-table .sorting_1 a","click");
    $("body").delegate("#marginTemplateProduct-table .sorting_1 a","click",function(){
        debugger
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
        debugger
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
    
    //获取需要删除的集合
	$scope.getRemoveEntitys = function(){
			var tmpEntitys = [];
			//复选框选中列ID
	  	  	$scope.ids = new Array();
	  	  	$("#marginTemplateProduct-table a").each(function(){
	  	  		var flag = $(this).hasClass("clicked-choice-one");
			  	  		if(flag){
				  	  		var mytr = $(this).parents("tr");
					        var tempArr = $scope.marginTemplateProductTable.row(mytr).data();
					        var id = tempArr[1];//获取该行对应的id
					  	  	$scope.ids.push(id);
			  	  	    }
	          });
	  	      for(var i=0;i<$scope.ProductEntitys.length;i++){
					for(var j=0;j<$scope.ids.length;j++){
						if($scope.ProductEntitys[i].id==$scope.ids[j]){
							tmpEntitys.push($scope.ProductEntitys[i]);
						}
					}
			  }		
			  return tmpEntitys;
	}
    
    $scope.findProduct = function(result){
    	$scope.isQuery = true;
		$scope.ProductEntitys = [];
		$scope.productEntity.templateID = $scope.templateID;
    	//更新表格对应的数据集
		findByMarginTemplateProduct(function (result) {
    		//将数据集赋值为空
	    	$scope.marginTemplateProductDataset = [];
    		var con = result;
    		$scope.ProductEntitys = result;
            for(var i = 0; i<con.length;i++){
            	var value = "";
            	if(con[i].incomeType != 0){
            		value =con[i].setValue;
            	}
            	var operate1 = $scope.getFeeUpdate($scope.marginTemplate_fee_update);
            	var operate2 = $scope.getFeeDelete($scope.marginTemplate_fee_delete);
            	var tempArr = ["<a class='click-choice-one'>",con[i].id,con[i].templateID,con[i].templateName,con[i].exchID,con[i].productID,$scope.transTradeType(con[i].tradeType),
            	               $scope.getReceiveType(con[i].receiveType),con[i].longMarginRateStr,con[i].longMarginAmt.toFixed(2)
            	               ,con[i].shortMarginRateStr,con[i].shortMarginAmt.toFixed(2),operate1+operate2];
	            $scope.marginTemplateProductDataset.push(tempArr);
	            con[i].index = i+1;
            }
            $scope.ProductEntitys = con;
        	//重新绘表
            $scope.marginTemplateProductTable.clear().draw();
            $scope.marginTemplateProductTable.rows.add($scope.marginTemplateProductDataset).draw();
            $timeout(function() {
				$scope.isQuery = false;
			}, 1000);
		}, $scope.productEntity);  	
    }
    $scope.getFeeUpdate = function(flag){
    	var result = "";
    	if(flag){
    		result = "<a class='my-update' data-toggle='modal' data-target='#marginTemplateProductModal'>修改</a>";
    	}
    	return result;
    }
    
    $scope.getFeeDelete = function(flag){
    	var result = "";
    	if(flag){
    		result = "<a class='my-set'>删除</a>";
    	}
    	return result;
    }
    
    $scope.getReceiveType = function(con){
    	var result = "";
    	if(con == 1){
    		result = "相对默认收取";
    	}else if(con == 2){
    		result = "绝对收取";
    	}
    	return result;
    }
    
	
	// 批量删除
	$scope.removeProducts = function() {
		$scope.entitys = $scope.getRemoveEntitys();
		if ($scope.entitys.length > 0) {
			layer.confirm('确定批量删除？', {
				icon : 3
			}, function(count) {
				deleteMarginTemplateProductLists(function() {
					$timeout(function() {
						$scope.findProduct({});
				    }, 300);
				}, $scope.entitys);
				layer.close(count);
				$scope.entitys=[];
				layer.msg("删除信息成功", {
					icon : 1
				});
			 });
		} else {
			layer.msg('请选择要删除的保证金模板品种信息', {
				icon : 2
			});
		}
	};

	// 保存保证金费率信息
	$scope.saveProduct = function(ProductEntity) {
		var index = ProductEntity.recordIndex;
		var tableIndex = ProductEntity.index;
		
		ProductEntity.templateID = $scope.templateID;
		ProductEntity.isLockMargin = "0";
		
        $scope.tmpSaveEntity = {};
        $scope.tmpSaveEntity = angular.copy(ProductEntity);
        
        //精度处理
        $scope.tmpSaveEntity.longMarginRate = accDiv($scope.tmpSaveEntity.longMarginRate,100).toString();
        $scope.tmpSaveEntity.shortMarginRate = accDiv($scope.tmpSaveEntity.shortMarginRate,100).toString();
		
		// 模板代码是否存在
		if (index != undefined) {
			// 修改
			updateMarginTemplateProduct(function(result) {
				if(result != null){
					
					result.index = tableIndex;
	        		$scope.ProductEntitys.splice(tableIndex-1, 1, result); 
	        		
	        		$scope.marginTemplateProductTable.cells().every( function () {
	                    if((tableIndex-1) == this[0][0].row){
	                    	if(this[0][0].column == 3){
	                            this.data(ProductEntity.templateName);
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 8){
	                            this.data(scientificToNumber($scope.tmpSaveEntity.longMarginRate));
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 9){
	                            this.data((+ProductEntity.longMarginAmt).toFixed(2));
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 10){
	                            this.data(scientificToNumber($scope.tmpSaveEntity.shortMarginRate));
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 11){
	                            this.data((+ProductEntity.shortMarginAmt).toFixed(2));
	                            $scope.$apply();
	                        }
	                    }

	        		});
					
					$("#marginTemplateProductModal").modal("hide");
					/*$timeout(function() {
						$scope.findProduct({});
				    }, 500);*/
/*					findByMarginTemplateProduct(function(results) {
						$scope.ProductEntitys = results;
						$scope.$apply();
						$("#marginTemplateProductModal").modal("hide");
					}, {
						templateID : $scope.templateID
					});*/
					layer.msg("修改成功",{icon: 1});
				}else{
					layer.msg("修改失败",{icon: 2});
				}
			}, $scope.tmpSaveEntity);
		} else {
			// 根据交易所+品种+交易类型 查询记录是否重复
			findByMarginTemplateProduct(function(result) {
				if (result.length > 0) {
					layer.msg("该交易所代码与品种代码对应投保标志的信息已存在，请重新选择", {
						icon : 2,
						time : 3000
					});
					return false;
				} else {
					// 新增
					saveMarginTemplateProduct(function(resultes) {
						if(resultes != null){
							layer.msg("新增成功",{icon: 1});
							$scope.ProductEntitys.unshift(resultes);
							$("#marginTemplateProductModal").modal("hide");
							$timeout(function() {
								$scope.findProduct({});
						    }, 500);
							/*findByMarginTemplateProduct(function(results) {
								$scope.ProductEntitys = results;
								$scope.$apply();
								$("#marginTemplateProductModal").modal("hide");
							}, {
								templateID : $scope.templateID
							});*/
						}else{
							layer.msg("新增失败",{icon: 2});
						}
					}, $scope.tmpSaveEntity);
				}
			}, {
				exchID : $scope.tmpSaveEntity.exchID,
				tradeType : $scope.tmpSaveEntity.tradeType,
				productID : $scope.tmpSaveEntity.productID,
				templateID : $scope.tmpSaveEntity.templateID
			});
		}
		
	};

/*	// 按照模板名称查询
	$scope.find = function(templateName) {
		findByMarginTemplate(function(result) {
			$scope.templateEntitys = result;
			$scope.$apply();
		}, templateName); 
	}*/
	$("body").undelegate("#marginTemplate-table_wrapper tr","click");
    $("body").delegate("#marginTemplate-table_wrapper tr","click",function(){
    	var mytr = $(this);
        var td = mytr.find("td");//找到td元素
        $scope.selectedTemplateName = td[1].innerHTML; //alert(td[0].innerHTML);//指定下标即可
        $scope.isOK = false;
        $scope.templateID = $scope.getTemplateID($scope.selectedTemplateName);
        $scope.findProduct({"templateID":$scope.templateID});
        $scope.$apply();
    })
    
    //获取templateID
    $scope.getTemplateID = function(templateName){
    	var result = "";
        for(var i = 0;i<$scope.templateEntitys.length;i++){
        	if(templateName==$scope.templateEntitys[i].templateName){
        		result = $scope.templateEntitys[i].templateID;
        	}
        }
        return result;
    }
    $("body").undelegate("#marginTemplate-table td .update-row","click");
    //表格中修改的单击事件
    $("body").delegate("#marginTemplate-table td .update-row","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.marginTemplateTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.templateEntitys.length;i++){
        	if(id==$scope.templateEntitys[i].id){
        		$scope.modalEntity = $scope.templateEntitys[i];
        	}
        }
        $scope.initUpdateTemplate(id,$scope.modalEntity);
        $scope.$apply();
    });
    $("body").undelegate("#marginTemplate-table td .delete-row","click");
    //表格中删除的单击事件
    $("body").delegate("#marginTemplate-table td .delete-row","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.marginTemplateTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.templateEntitys.length;i++){
        	if(id==$scope.templateEntitys[i].id){
        		$scope.modalEntity = $scope.templateEntitys[i];
        	}
        }
        $scope.remove(id,$scope.modalEntity);
    })
    
	    
	    
	// 查询(前台分页)
    $scope.find = function(result){
    	$scope.isQuery = true;
		$scope.findByMarginTemplate = {};
    	//更新表格对应的数据集
		findByMarginTemplate(function (result) {
    		//将数据集赋值为空
	    	$scope.marginTemplateDataset = [];
    		$scope.templateEntitys = result;
    		var con = result;
            for(var i = 0; i<con.length;i++){
            	var operate1 = $scope.getTempUpdate($scope.marginTemplate_temp_update);
            	var operate2 = $scope.getTempDelete($scope.marginTemplate_temp_delete);
                var tempArr = [(i+1),con[i].id,con[i].templateID,con[i].templateName,operate1+operate2];
	            $scope.marginTemplateDataset.push(tempArr);
	            con[i].index = i+1;
            }
            $scope.templateEntitys = con;
        	//重新绘表
            $scope.marginTemplateTable.clear().draw();
            $scope.marginTemplateTable.rows.add($scope.marginTemplateDataset).draw();
            $timeout(function() {
				$scope.isQuery = false;
			}, 1000);
        }, result);  	
    } 
    $scope.find();
    
    $scope.getTempUpdate = function(flag){
    	var result = "";
    	if(flag){
    		result = "<a class='update-row' data-toggle='modal' data-target='#marginTemplateModal'>修改</a>";
    	}
    	return result;
    }
    
    $scope.getTempDelete = function(flag){
    	var result = "";
    	if(flag){
    		result = "<a class='delete-row'>删除</a>";
    	}
    	return result;
    }

	// 初始化模板信息
	$scope.initParameter = function() {
		$scope.isUpdate = false;
		$scope.TemplateEntity = {};
		$scope.myForm.templateName.$setPristine();
		getMaxMarginTemplateID(function(result){
			$scope.TemplateEntity.templateID = result + 1;
		});
	};

	// 初始化品种模板信息
	$scope.initProductParameter = function() {
		$scope.isUpdate = false;
		$scope.modalExchanges = $scope.exchangeDatas;
		$scope.modalProducts = $scope.productDatas;
		$scope.ProductEntity = {};
		$scope.ProductEntity.tradeType = $scope.tradeTypes[0].key;
		$scope.ProductEntity.receiveType = $scope.receiveTypes[0].key;
		setDefaultValue();
		formValidateReset();
	}
	$scope.transTradeType = function (text) {
        var count = $scope.tradeTypes.length;
        for (var i = 0; i < count; i++) {
            if ($scope.tradeTypes[i].key == text) {
                return $scope.tradeTypes[i].text;
            }
        }
    };
	
	// 修改保证金模板
	$scope.initUpdateProduct = function(index, ProductEntity) {
		$scope.isUpdate = true;
		$scope.modalExchanges = $scope.exchangeDatas;
		$scope.modalProducts = [];
		angular.forEach($scope.productDatas, function(data, index, array) {
			if (data.exchID == ProductEntity.exchID) {
				$scope.modalProducts.push(array[index]);
			}
		});
		$scope.tempEntity = angular.copy(ProductEntity);
		
        //修改时，精度处理
        $scope.tempEntity.longMarginRate=accMul($scope.tempEntity.longMarginRate,100).toFixed(6);
        $scope.tempEntity.shortMarginRate=accMul($scope.tempEntity.shortMarginRate,100).toFixed(6);
        
		$scope.tempEntity.recordIndex = index;
		$scope.ProductEntity = angular.copy($scope.tempEntity);
	};

	// 修改初始化
	$scope.initUpdateTemplate = function(index, templateEntity) {
		$scope.isUpdate = true;
		$scope.tempEntity = angular.copy(templateEntity);
		$scope.tempEntity.recordIndex = index;
		$scope.TemplateEntity = angular.copy($scope.tempEntity);
		formValidateReset1();
	};
	
	// 重置表单验证信息
	function formValidateReset1() {
		$scope.myForm.templateName.$setPristine();
	}
	
	//显示默认值
    function setDefaultValue() {
        $scope.ProductEntity.longMarginRate=0;
        $scope.ProductEntity.longMarginAmt=0;
        $scope.ProductEntity.shortMarginRate=0;
        $scope.ProductEntity.shortMarginAmt=0;
    }

	// 保存模板信息
	$scope.save = function(entity) {
		$scope.ProductEntity = {};
		var index = entity.recordIndex;
		var tableIndex = entity.index;
		if (index != undefined) {
			// 修改
			findByTemplateName(function (fresult){
				if(fresult != null && fresult.templateName != $scope.templateEntitys[tableIndex-1].templateName){
					layer.msg('模板名称已存在，请重新输入', {
						icon : 2
					});
					return false;
				}else{
					updateMarginTemplate(function(result) {
						if(result != null){
							
							result.index = tableIndex;
			        		$scope.templateEntitys.splice(tableIndex-1, 1, result); 
			        		
			        		$scope.marginTemplateTable.cells().every( function () {
			                    if((tableIndex-1) == this[0][0].row){
			                        if(this[0][0].column == 3){
			                            this.data(entity.templateName);
			                            $scope.$apply();
			                        }
			                    }

			        		});
							$("#marginTemplateModal").modal("hide");
							layer.msg("修改成功",{icon: 1});
							/*$timeout(function() {
								$scope.find();
						    }, 500);*/
						}else{
							layer.msg("修改失败",{icon: 2});
						}
					}, entity);
				}
			},entity.templateName);
		} else {
			// 新增
			findByTemplateName(function(fresult) {
				if (fresult != null) {
					layer.msg('模板名称已存在，请重新输入', {
						icon : 2
					});
					return false;
				} else {
					saveMarginTemplate(function(result) {
						if(result != null){
							layer.msg("新增成功",{icon: 1});
							$scope.templateEntitys.unshift(result);
							$scope.$apply();
							$("#marginTemplateModal").modal("hide");
							$timeout(function() {
								$scope.find();
						    }, 500);
						}else{
							layer.msg("新增失败",{icon: 2});
						}
					}, entity);
				}
			}, entity.templateName);
		}
	};

	// 删除模板
	$scope.remove = function(index, entity) {
		//存在资产单元对应此模板
		findSubAccountTemplateByCondition(function(satResult) {
			if (satResult.length > 0) {
				layer.confirm('存在账号与该模板的绑定，是否确定删除？', {
					icon : 3
				}, function(count) {
					deleteMarginTemplate(function(){
						findSubAccTemByTemplateID(function(product) {
							delByTemplateProductIDs(product);
							deleteSubAccountTemplateItem(satResult);
							layer.close(count);
							$scope.isOK = true;
							$scope.ProductEntitys = [];
							$timeout(function() {
								$scope.find();
								$scope.findProduct({templateID : entity.templateID});
						    }, 500);
							layer.msg("删除成功",{icon: 1});
/*							getAllMarginTemplate(function(templates){
								$scope.templateEntitys = angular.copy(templates);
								$scope.ProductEntitys = [];
								$scope.isOK = true;
								$scope.$apply();
								$timeout(function() {
									$scope.find();
									$scope.findProduct({templateID : entity.templateID});
							    }, 500);
								layer.msg("删除成功",{icon: 1});
							});*/
						},{
							templateID : entity.templateID
						});
					},entity.id);
				});
			} else {
				layer.confirm('确定删除？', {
					icon : 3
				}, function(count) {
					deleteMarginTemplate(function(){
						findSubAccTemByTemplateID(function(product) {
							delByTemplateProductIDs(product);
							layer.close(count);
							$scope.ProductEntitys = [];
							$scope.isOK = true;
							$timeout(function() {
								$scope.find();
								$scope.findProduct({templateID : entity.templateID});
						    }, 500);
							layer.msg("删除成功",{icon: 1});
/*							getAllMarginTemplate(function(templates){
								$scope.templateEntitys = angular.copy(templates);
								$scope.ProductEntitys = [];
								$scope.isOK = true;
								$scope.$apply();
								$timeout(function() {
									$scope.find();
									$scope.findProduct({templateID : entity.templateID});
							    }, 500);
								layer.msg("删除成功",{icon: 1});
							});*/
						}, {
							templateID : entity.templateID
						});
					},entity.id);
				});
			}
		}, {
			templateID : entity.templateID,
			templateType : "1"
		});

	};

	// 单条删除模板保证金率
	$scope.removeProduct = function(index, ProductEntity) {
		layer.confirm('确定删除？', {
			icon : 3
		}, function(count) {
			deleteMarginTemplateProduct(function() {
				findByMarginTemplateProduct(function(results) {
					$scope.ProductEntitys = results;
					layer.close(count);
					$scope.$apply();
					$timeout(function() {
						$scope.findProduct({});
				    }, 500);
					layer.msg("删除成功",{icon: 1});
				}, {
					templateID : $scope.templateID
				});
			}, ProductEntity);
		});
	};

	// 单个选择
	$scope.recordChecked = function(x, ProductEntity) {
		if (x) {
			$scope.entitys.push(ProductEntity);
		} else {
			var index = $scope.entitys.indexOf(ProductEntity);
			$scope.entitys.splice(index, 1);
		}
	}
	
	// 全选
	$scope.isChecked = false;
	$scope.chooseAll = function() {
		if ($scope.isChecked == false) {
			$scope.entitys =  angular.copy($scope.ProductEntitys);
			$scope.isChecked = true;
		} else {
			$scope.entitys = [];
			$scope.isChecked = false;
		}
	}
	
	//---------------------复制模板---------------------------------------
	$scope.newCopyTemplateName = "";	//复制的新模板名称
	// 初始化复制模态框
	$scope.initCopyMarginTemplate = function(){
		$scope.copyForm.newCopyTemplateName.$setPristine();
		$scope.newCopyTemplateName = "";
	}
	
	$scope.copy = function(newTemplateName){
		findByTemplateName(function(result){
			if(result != null){
				layer.msg("不允许复制到已有模板",{icon: 2});
				return false;
			}else{
				// 新增模板
				getMaxMarginTemplateID(function(tempID){
					
					saveMarginTemplate(function(result) {
						if(result != null){
							$scope.templateEntitys.unshift(result);
							$scope.$apply();
							copyMarginTemplateProduct(function(msg){
								if(msg == 1){
									layer.msg("复制成功",{icon: 1});
									// 关闭窗口
									$("#marginTemplateCopyModal").modal("hide");
									$scope.find($scope.queryFeeTemplateEntity.templateName);
								}else{
									layer.msg("复制数据失败",{icon: 2});
								}
							},$scope.templateID,result.templateID);
							
						}else{
							layer.msg("建立新模板失败",{icon: 2});
							return false;
						}
					}, {
						templateID: tempID + 1,
						templateName: $scope.newCopyTemplateName
					});
				});
				
			}
		},$scope.newCopyTemplateName);
	}
	
	$scope.tmpExportQuery = {};
    //导出excel
    $scope.exportExcel = function () {
    	$scope.tmpExportQuery.templateID = angular.copy($scope.templateID);
    	framework.file.export("保证金模板费率查询.xls",'excel',{
			entityKey:['templateName','exchID','productID','tradeType','receiveType','longMarginRateStr','longMarginAmt','shortMarginRateStr','shortMarginAmt'],
			headerKey:['模板名称','交易所代码','品种代码','投保标志','收取方式','多头按金额','多头按手数','空头按金额','空头按手数'],
			styles:['plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText'],
			title:"保证金模板费率导出数据",
			
			dicMap:{receiveType:{'1':"相对默认收取",'2':"绝对收取"},tradeType:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}}
		},"marginTemplateProductService", "exportByCondition", $scope.tmpExportQuery);
    };
	
    //导入
    $("#marginTemplateUploader").uploadFile({
    	  dragdropWidth: 125,
          uploadStr:"Excel导入",
          dragDropStr: "",
          showAbort: false,
          dragDropContainerClass:"",
        url: framework.file.uploadUrl("marginTemplateProductService", "uploadExcel", [null]),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
                if(errCode != 0) {
                    layer.msg(errMsg,{icon: 2});
                } else {
                	if(result != null){
                		if(result.code == '1'){
                			layer.msg("成功导入"+result.info+"条记录！", {icon: 1, time: 1500});
                			findByMarginTemplateProduct(function (result) {
                	            $scope.ProductEntitys = result;
                	            $scope.findProduct($scope.productEntity);
                	            $scope.$apply();
                	            $("#marginTemplateUploadModal").modal("hide");
                	        }, {
            					templateID: $scope.templateID
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
            this.url = framework.file.uploadUrl("marginTemplateProductService", "uploadExcel", [$scope.templateID, $scope.selectedTemplateName, null])
            return true;
        }
    });
    
    
    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.marginTemplateTable = $('#marginTemplate-table').DataTable( {
    		data : $scope.marginTemplateDataset,
        	columns :$scope.marginTemplate_columns,
            dom: 'rt<"bottom"iplB>',
            /*fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },*/
    		buttons: []
            } );
   
        $scope.marginTemplateProductTable = $('#marginTemplateProduct-table').DataTable( {
    		data : $scope.marginTemplateProductDataset,
        	columns :$scope.marginTemplateProduct_columns,
            dom: 'rt<"bottom"iplB>',
           /* fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },*/
			buttons: [
			    
			]
        } );
    });
    
});
