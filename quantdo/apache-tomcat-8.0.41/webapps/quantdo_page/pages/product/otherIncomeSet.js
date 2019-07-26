myapp.controller('OtherIncomeSetController', function($scope, $timeout,$rootScope) {

	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$scope.tempFundProduct = {};
	$scope.tempStateEntity = [];
	$scope.fundProductAll=[];
	$scope.fundProducts=[];
	$scope.instClientlistEntitys=[];
	$scope.tempFundProduct.updateIndex = -1;
	$scope.listEntitys = new Array();
	$scope.detailListEntitys = new Array();
	$scope.otherDetailListEntitys = new Array();
	$scope.queryEntity={};
	$scope.linkAccountTypes=clearConstant.linkAccountType;
	
	// 按钮权限
	$scope.otherIncomeSet_query = isShow("otherIncomeSet_query");
	$scope.otherIncomeSet_add = isShow("otherIncomeSet_add");
	$scope.otherIncomeSet_set = isShow("otherIncomeSet_set");
	$scope.otherIncomeSet_set_add = isShow("otherIncomeSet_set_add");
	$scope.otherIncomeSet_set_delete = isShow("otherIncomeSet_set_delete");
	$scope.otherIncomeSet_info = isShow("otherIncomeSet_info");
	$scope.otherIncomeSet_info_query = isShow("otherIncomeSet_info_query");

	$scope.fixedIncomeStates = clearConstant.fixedIncomeStates;
	$scope.incomeTypes = clearConstant.incomeTypes;
	var date = clearConstant.formatDate(new Date());
	$scope.canClick=false;
	$scope.canFirstClick=false;
	//当前交易日
	generateHisData(function(result) {
		$scope.tradingDate = result;
	});
	
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
	
	$scope.ModalEntity={};
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
    //初始化机构信息
    $scope.instClientService.findByQuery(function (result) {
        $scope.instClientlistEntitys = result;
        $scope.$apply();
    },{});
    
    $scope.instClientID = '';
    queryInstClientID(function (result) {
        $scope.instClientID = result;
        $scope.queryEntity={};
        if($scope.instClientID != undefined ){
        	$scope.isInstClient = true;
        	$scope.queryEntity.instClientID=$scope.instClientID;
        	 $scope.isInstClientSelect($scope.queryEntity.instClientID);
        }else{
        	$scope.isInstClient = false;
        }
        
        $scope.$apply();
    });
	
    //机构名称转换
    $scope.transInstClient = function (instClientID) {
    	for(var i = 0;i < $scope.instClientlistEntitys.length; i++){
    		if($scope.instClientlistEntitys[i].instClientID == instClientID){
    			return $scope.instClientlistEntitys[i].instClientAbbrName;
    		}
    	}
    }
	
/*	// 初始化新增列表页面记录
	getOtherIncomeSetTotEntity(function(result) {
		$scope.listTotEntitys = result;
		$scope.$apply();
	},null);*/
	
	
//	// 初始化页面记录
//	getAllOtherIncomeSetEntity(function(result) {
//		transListEntitys(result);
//		$scope.$apply();
//	});
	
	// 删除
	$scope.remove = function(index,fundProduct) {
		// 使用内置Index
		layer.confirm('确定删除该产品的权益信息吗？', {
			icon : 3
		}, function(count) {
			removeotherIncomeSet(function(result) {
				$scope.listTotEntitys.splice(index, 1);
				findByPorId(function(result) {
					transListEntitys(result);
					/*if($scope.isUpdate){
						$("#otherIncomeSetModal").modal("hide");
					}*/
					
				}, $scope.queryEntity);
				$timeout(function() {
					$scope.findOtherIncomeSetTotEntity(fundProduct);
					$scope.find();
	            }, 500);
				$scope.$apply();
			}, fundProduct);
			layer.close(count);
			$scope.$apply();
		});
	};
	
	
	// 初始化产品记录
	getAllFundProductEntity(function(result) {
		$scope.fundProductAll = result;
		$scope.$apply();
	});
	$scope.fundProductTems=[];
    $scope.isInstClientSelect = function (instClientId) {
    	$scope.fundProductTems=[];
    	findFundProduct(function (result) {
        	$scope.fundProductTems=result;
        	$scope.$apply();
        },{instClientID:instClientId,linkAccountType:$scope.linkAccountTypes[0].key});
    };
    $scope.isInstClientSelect("");

	// 重置表单验证信息
	function formValidateReset() {
		$scope.myForm.instClientID.$setPristine();
		$scope.myForm.fundProductID.$setPristine();
		$scope.myForm.incomeType.$setPristine();
		$scope.myForm.setValue1.$setPristine();
		$scope.myForm.setValue2.$setPristine();
		$scope.myForm.incomeName.$setPristine();

	}

	// 初始化模态框页面参数
	$scope.initParameter = function() {
		// 初始化产品记录
		getAllFundProductEntity(function(result) {
			$scope.fundProductAll = result;
			$scope.$apply();
		});
		
		getOtherIncomeSetTotEntity(function(result) {
			$scope.listTotEntitys=[];
			$scope.listTotEntitys = result;
			$scope.$apply();
		},null);
		$scope.ModalEntity = {};
		if($scope.instClientID != undefined ){
	         $scope.isInstClient = true;
	         $scope.ModalEntity.instClientID=$scope.instClientID;
	         $scope.isInstClientSelect($scope.ModalEntity.instClientID);
	     }
		$scope.isIncomeType = false;
		$scope.ModalEntity.incomeType = $scope.incomeTypes[1].key;
		// 设置默认选中
		formValidateReset();
		$scope.isUpdate = false;
		$timeout(function() {
			document.getElementById("fundProductID").focus();
		}, 500);
		// 设置窗口显示位置
		$('#otherIncomeSetModal').on(
				'show.bs.modal',
				function(e) {
					$(this).find('.modal-dialog').css(
							{
								'margin-top' : function() {
									var modalHeight = $('otherIncomeSetModal')
											.find('.modal-dialog').height();
									return ($(window).height() / 2 - 300);
								}
							});
				});
	};

	// 修改初始化页面参数
	$scope.initUpdate = function(index, obj) {
		$scope.canFirstClick=false;
/*		getOtherIncomeSetTotEntity(function(result) {
			$scope.listTotEntitys=[];
			$scope.listTotEntitys = result;
			$scope.$apply();
		},obj.fundProductID);*/
		$scope.tempFundProduct = angular.copy(obj);
		$scope.tempFundProduct.updateIndex = index;
		$scope.ModalEntity = angular.copy($scope.tempFundProduct);
		findFundProductByConts(function (result) {
        	$scope.fundProducts=result;
        	$scope.fundProductTems=result;
        	$scope.$apply();
        },{instClientID:$scope.ModalEntity.instClientID});
		
		if($scope.ModalEntity.incomeType != 0){
			$scope.ModalEntity.setValue1 =obj.setValue;	
			$scope.isIncomeType = false;
		}else {
			
			$scope.ModalEntity.setValue2 =obj.setValue;	
			$scope.isIncomeType = true;
		}
		formValidateReset();
		$scope.isUpdate = true;
		$("#otherIncomeSetModal").modal("show");
		$timeout(function() {
			$scope.findOtherIncomeSetTotEntity(obj);
		}, 500);
		$scope.$apply();
	};

	// 初始化详细信息页面参数
	
	$scope.initSearchDetail = function(obj) {
		$scope.selectfundProducts = new Array();
		$scope.queryDetailEntity=[];
		angular.forEach($scope.fundProducts, function(value, index, arrays) {
			if (value.fundProductID == obj.fundProductID) {
				$scope.selectfundProducts.push(value);
			}
		});
		findFundProductByConts(function (result) {
        	$scope.fundProducts=result;
        },{instClientID:obj.instClientID});
	   $scope.queryDetailEntity.instClientID=obj.instClientID;
	   $scope.queryDetailEntity.searchFundProductID=obj.fundProductID;
	   $scope.queryDetailEntity.incomeType=obj.incomeType;
	   $scope.queryDetailEntity.searchEndDate=$scope.tradingDate;
	   $scope.queryDetailEntity.searchStartDate=$scope.tradingDate;
		var  incomeType =obj.incomeType;
		if(incomeType == 0){
			//查询incomeSet表
			findOtherIncomeSetEntity(function(result) {
				transOtherDetailListEntitys(result);
				$timeout(function() {
					// 表格
					$scope.findTem(incomeType,result);
					 $("#searchOtherDetail").modal("show");
				}, 800);
			}, { instClientID : obj.instClientID,
				fundProductID : obj.fundProductID,
				incomeType :obj.incomeType
			});
		} else {
			findOtherIncomeEntity(function(result) {
				transDetailListEntitys(result);
				$timeout(function() {
					 // 表格
					 $scope.findTem(incomeType,result);
					 $("#searchOtherDetail").modal("show");
				}, 800);
			}, {
				instClientID : obj.instClientID,
				fundProductID : obj.fundProductID,
				incomeType :obj.incomeType
			});
		}
	};

//	// 查询
//	$scope.find = function(object) {
//		$scope.isQuery = true;
//		findByPorId(function(result) {
//			transListEntitys(result);
//			$timeout(function() {
//				$scope.isQuery = false;
//			}, 1000);
//		}, object);
//	};

	// 新增
	$scope.save = function(entity) {
		var tableIndex = entity.index;
		$scope.canFirstClick=true;
		if(entity.incomeType==0){
			entity.setValue =entity.setValue2;	
		}else{
			entity.setValue =entity.setValue1;
			if(entity.setValue > 100 ){
				$scope.canFirstClick=false;
				layer.msg("设置值不可大于100，请重新输入", {
					icon : 2,
					time : 3000
				});
				return false;
			}
			
		}
		if(entity.setValue=== undefined ){
			$scope.canFirstClick=false;
			layer.msg("设置值不能为空，请重新输入", {
				icon : 2,
				time : 3000
			});
			return false;
		}
		var index = entity.updateIndex;
		// 修改
		if (index != undefined) {
			delete entity.updateIndex;
			updateOtherIncomeSet(function(result) {
				//$scope.find($scope.queryEntity);
/*				findByPorId(function(result) {
					transListEntitys(result);
					$scope.$apply();
				}, $scope.queryEntity);*/
				result.index = tableIndex;
        		$scope.listEntitys.splice(tableIndex-1, 1, result); 
				
				$scope.productTable.cells().every( function () {
                    if((tableIndex-1) == this[0][0].row){
                        if(this[0][0].column == 5){
                            this.data(entity.setValue);
                            $scope.$apply();
                        }
                        if(this[0][0].column == 6){
                            this.data(entity.totalInterest.toFixed(2));
                            $scope.$apply();
                        }
                    }

				});
				layer.msg("修改成功", {icon : 1});
				$("#otherIncomeSetModal").modal("hide");
				$scope.$apply();
			}, entity);
			// 新增
		} else {
			if($scope.tradingDate==undefined || $scope.tradingDate==""){
				$scope.canFirstClick=false;
				layer.msg("找不到交易日期，请先做上场操作!", {
					icon : 2,
					time : 3000
				});
			} else {
				findByOtherIncomeSetEntity(function(result) {
					if (result != undefined && result.length > 0) {
						$scope.canFirstClick=false;
						layer.msg("该产品所对应的权益类型信息已存在，请重新输入", {
							icon : 2,
							time : 3000
						});
						return false;
					} else {
						
						// 查 生效日期 应在产品有效期内
						findProduceByProductId(function(ProduceResult) {
							if (ProduceResult == undefined) {
								$scope.canFirstClick=false;
								layer.msg("该产品所对应的生效日期 不在产品有效期内，请选择其他产品", {
									icon : 2,
									time : 3000
								});
								return false;
							} else {
								entity.isActive = '1';
								if(ProduceResult.startDate>$scope.tradingDate){
									entity.startDate =ProduceResult.startDate;
								}else{
									entity.startDate =$scope.tradingDate;
								}
								saveOtherIncomeSet(function(result) {
									/*	findByPorId(function(result) {
										transListEntitys(result);
										$scope.$apply();
									}, $scope.queryEntity);*/
									 $timeout(function() {
								            $scope.canFirstClick = false;
								        }, 1000); 
									$("#otherIncomeSetModal").modal("hide");
									$timeout(function() {
								         $scope.find($scope.queryEntity);//对应方法
								      }, 500);
								}, entity);
						    }
						},{instClientID : entity.instClientID,
							fundProductID : entity.fundProductID,
						   startDate : $scope.tradingDate });
					}
				}, {
					instClientID : entity.instClientID,
					fundProductID : entity.fundProductID,
					incomeType : entity.incomeType
				});
			}
		}
		
	}

	// 明细查询
	$scope.findDetailList = function(object) {
		$scope.isQueryDetail = true;
		
		//按照incomeType类型查询不同的表格；返回显示
		var incomeType =object.incomeType;
		if(incomeType == 0){
			//查询incomeSet表
			findOtherIncomeSetEntity(function(result) {
				transOtherDetailListEntitys(result);
				$scope.findTem(incomeType,result);
				$scope.$apply();
				$timeout(function() {
					$scope.isQueryDetail = false;
				}, 1000);
			}, {
				instClientID : object.instClientID,
				fundProductID : object.searchFundProductID,
				incomeType :object.incomeType,
				startDate : object.searchStartDate,
				endDate : object.searchEndDate
			});
		}else{
			//查询income表
			findOtherIncomeEntity(function(result) {
				transDetailListEntitys(result);
				$scope.findTem(incomeType,result);
				$scope.$apply();
				$timeout(function() {
					$scope.isQueryDetail = false;
				}, 1000);
			}, {
				instClientID : object.instClientID,
				fundProductID : object.searchFundProductID,
				incomeType :object.incomeType,
				startDate : object.searchStartDate,
				endDate : object.searchEndDate
			});
		}
	};
	
	
	//根据权益类型显示信息
	$scope.incomeTypeChange = function (incomeType){
		if(incomeType!=0){
			$scope.isIncomeType = false;
		}else if(incomeType==0){
			$scope.isIncomeType = true;
		}
	}
	//转换权益类型
	 $scope.transIncType = function (text){
	    	var count = $scope.incomeTypes.length;
	        for (var i = 0; i < count; i++) {
	        	 if ($scope.incomeTypes[i].key == text) {
	        		 $scope.$apply();
	                 return $scope.incomeTypes[i].text;
	             }
	        }
	    }
	//全量转换产品简称
	 $scope.transProductAll = function (instClientID,fundProductID){
	    	var count = $scope.fundProductAll.length;
	        for (var i = 0; i < count; i++) {
	        	 if ($scope.fundProductAll[i].fundProductID == fundProductID&&$scope.fundProductAll[i].instClientID==instClientID) {
	                 	return $scope.fundProductAll[i].shortProductName;
	             }
	        }
	    }
	 
	//模态框转换产品简称
	 $scope.transProduct = function (instClientID,fundProductID){
	    	var count = $scope.fundProducts.length;
	        for (var i = 0; i < count; i++) {
	        	 if ($scope.fundProducts[i].fundProductID == fundProductID&&$scope.fundProducts[i].instClientID==instClientID) {
	                 	return $scope.fundProducts[i].shortProductName;
	             }
	        }
	    }
	 
	 
		// 重置表单验证信息
		function modalFormValidateReset() {
			$scope.myModalForm.setValue.$setPristine();
			$scope.myModalForm.incomeName.$setPristine();
		}
	//模态框新增
	 $scope.initModelParameter = function(obj) {
		$scope.InsertModalEntity = {};
		$scope.isModalInsert = true;
		$scope.myModalForm.setValue.$setPristine();
		$scope.myModalForm.incomeName.$setPristine();
		$scope.InsertModalEntity.fundProductID =obj.fundProductID;
		$scope.InsertModalEntity.incomeType =obj.incomeType;
		$scope.InsertModalEntity.instClientID =obj.instClientID;
		$scope.$apply();
		// 设置默认选中
		//modalFormValidateReset();
		$("#otherIncomeSetModal").modal("hide");
	 }
	 
	//模态框添加新增
		$scope.saveModal = function(entity) {
			$scope.canClick=true;
			entity.isActive = '1';
			if($scope.tradingDate==undefined || $scope.tradingDate==""){
				$scope.canFirstClick=false;
				layer.msg("找不到交易日期，请先做上场操作!", {
					icon : 2,
					time : 3000
				});
			} else {
				// 查 生效日期 应在产品有效期内
				findProduceByProductId(function(ProduceResult) {
					if (ProduceResult == undefined) {
						$scope.canClick = false;
						layer.msg("该产品所对应的生效日期 不在产品有效期内，请选择其他产品", {
							icon : 2,
							time : 3000
						});
						return false;
					} else {
						entity.isActive = '1';
						if(ProduceResult.startDate>$scope.tradingDate){
							entity.startDate =ProduceResult.startDate;
						}else{
							entity.startDate =$scope.tradingDate;
						}
						saveOtherIncomeSet(function(result) {
							findByPorId(function(result) {
								transListEntitys(result);
							}, $scope.queryEntity);
							$("#modalInsertModal").modal("hide");
							$("#otherIncomeSetModal").modal("show");
							$timeout(function() {
					            $scope.canClick = false;
					            $scope.findOtherIncomeSetTotEntity(entity);
					            $scope.find();
					        }, 1000);
							$scope.$apply();
						}, entity);
				    }
				},{ instClientID : entity.instClientID,
					fundProductID : entity.fundProductID,
				    startDate : $scope.tradingDate });
			}
			 
		}
		
	    //设置页面表头
	    $scope.otherSet_columns = [
			{title: "序号"},
			{title: "id",visible:false},
			{title: "所属机构"},
			{title: "产品简称"},
			{title: "权益名称"},
			{title: "设置值"},
			{title: "发生日期"},
			{title: "操作"}
		 ]; 
	    
    	//会话列表初始化
    	$scope.otherSetTable = $('#otherIncomeSet_insert_dynamic_table').DataTable( {
    		data : $scope.otherSetDataset,
        	columns :$scope.otherSet_columns,
            dom: 'rt<"bottom"iplB>',
			buttons: []
        } );
    	$("body").undelegate("#otherIncomeSet_insert_dynamic_table_wrapper td .delete-row","click");
	    $("body").delegate("#otherIncomeSet_insert_dynamic_table_wrapper td .delete-row","click",function(){
	    	var mytr = $(this).parents("tr");
	        var tempArr = $scope.otherSetTable.row(mytr).data();
	        var id = tempArr[1];
	        for(var i = 0;i<$scope.listTotEntitys.length;i++){
	        	if(id==$scope.listTotEntitys[i].id){
	        		$scope.modalEntity = $scope.listTotEntitys[i];
	        	}
	        }
	        $scope.remove(id,$scope.modalEntity);
	    });
    	
    	$scope.findOtherIncomeSetTotEntity = function(entity){
    		$scope.listTotEntitys = [];
    		$scope.otherSetDataset = [];
    		getOtherIncomeSetTotEntity(function(result) {
        		$scope.listTotEntitys = result;
        		var con = result;
        		for(var i=0;i<con.length;i++){
        			if(entity.instClientID==con[i].instClientID){
        				var operate = "";
    	            	if($scope.otherIncomeSet_set_delete){
    	            		operate = "<a class ='delete-row'>删除</a>";
    	            	}
    	                var tempArr = [(i+1),con[i].id,$scope.transInstClient(con[i].instClientID), $scope.transProduct(con[i].instClientID,con[i].fundProductID),con[i].incomeName,con[i].setValue
    	                               ,con[i].startDate,operate];
    		            $scope.otherSetDataset.push(tempArr);
        			}
        		}
        		//重新绘表
	            $scope.otherSetTable.clear().draw();
	            $scope.otherSetTable.rows.add($scope.otherSetDataset).draw();
        	},entity.fundProductID);
    	}
    	
    	/*	// 初始化新增列表页面记录
    	getOtherIncomeSetTotEntity(function(result) {
    		$scope.listTotEntitys = result;
    		$scope.$apply();
    	},null);*/
		

		function transDetailListEntitys(entity){
			$scope.detailListEntitys =[];
			angular.forEach(entity, function(value, index, arrays) {
				value.currInterest=value.currInterest.toFixed(2);
				$scope.detailListEntitys.push(value);
			});
		}

		function transOtherDetailListEntitys(entity){
			$scope.otherDetailListEntitys=[];
			angular.forEach(entity, function(value, index, arrays) {
				value.setValue=value.setValue.toFixed(2);
				$scope.otherDetailListEntitys.push(value);
			});
		}
		
		function transListEntitys(entity){
			$scope.listEntitys=[];
			angular.forEach(entity, function(value, index, arrays) {
				value.totalInterest=value.totalInterest.toFixed(2);
				$scope.listEntitys.push(value);
			});
		}
		 //定义产品基础信息的固定列头
	    $scope.product_columns = [
	        {title: "序号"},
	        {title: "id",visible:false},
	        {title: "所属机构"},
	        {title: "产品简称"},
	        {title: "权益类型"},
	        {title: "设置值%"},
	        {title: "权益合计"},
	        {title: "操作"}
	    ]; 
	    $("body").undelegate("#otherIncomeSet_dynamic_table_wrapper td .otherIncomeSet-update-row","click");
	    $("body").delegate("#otherIncomeSet_dynamic_table_wrapper td .otherIncomeSet-update-row","click",function(){
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
	    $("body").undelegate("#otherIncomeSet_dynamic_table_wrapper td .otherIncomeSet-detail-row","click");
	     $("body").delegate("#otherIncomeSet_dynamic_table_wrapper td .otherIncomeSet-detail-row","click",function(){
	    	var mytr = $(this).parents("tr");
	        var tempArr = $scope.productTable.row(mytr).data();
	        var id = tempArr[1];
	        for(var i = 0;i<$scope.listEntitys.length;i++){
	        	if(id==$scope.listEntitys[i].id){
	        		$scope.modalEntity = $scope.listEntitys[i];
	        	}
	        }
	        $scope.initSearchDetail($scope.modalEntity);
	    });
	    
	 // 查询(前台分页)
	    $scope.find = function(){
	    	//更新表格对应的数据集
	    	findByPorId(function (result) {
	    		//将数据集赋值为空
		    	$scope.productDataset = [];
	    		var con = result;
	    		$scope.listEntitys = result;
	    		var tempArray = new Array();
	            for(var i = 0; i<con.length;i++){
	            	var value = "";
	            	if(con[i].incomeType != 0){
	            		value =con[i].setValue;
	            	}
//	            	var operate = "<a class='updaterow' data-toggle='modal'>[设置]</a>" +
//        			"<a class='blue' data-toggle='modal'>[查询明细]</a>";
	            	var operate = "";
	            	if($scope.otherIncomeSet_set){
	            		operate = operate.concat("<a class='row-operation-distance right-row otherIncomeSet-update-row' data-toggle='modal'>设置</a>");
	            	}
	            	if($scope.otherIncomeSet_info){
	            		operate = operate.concat("<a class='row-operation-distance reset-operation otherIncomeSet-detail-row' data-toggle='modal'>明细</a>");
	            	}
	                var tempArr = [(i+1),con[i].id,$scope.transInstClient(con[i].instClientID), $scope.transProductAll(con[i].instClientID,con[i].fundProductID),$scope.transIncType(con[i].incomeType),value
	                               ,con[i].totalInterest.toFixed(2),operate];
		            $scope.productDataset.push(tempArr);
		            con[i].index = i+1;
	            }
	            $scope.listEntitys = con;
            	//重新绘表
	            $timeout(function() { 
	            	$scope.productTable.clear().draw();
		            $scope.productTable.rows.add($scope.productDataset).draw();
	            }, 500);
	            
	        }, $scope.queryEntity);  	
	    }
	    
	    // 初始化
	    $timeout(function() {
	    	  $scope.find({});
	    }, 500);
	  
	 
	    
	  //初始化
	    $(document).ready(function() {
    		//会话列表初始化
	    	$scope.productTable = $('#otherIncomeSet_dynamic_table').DataTable( {
	    		data : $scope.productDataset,
	        	columns :$scope.product_columns,
//		        	scrollY: 300,
//		          scrollX: true,
	            dom: 'rt<"bottom"iplB>',
	            fixedColumns:   {
	                leftColumns: 0,
	                rightColumns: 1
	            },
				buttons: [
				]
	        } );
	    });

	    // 表格初始化方法
	    $scope.tableInit = function(id,dataset,columns){
	    	$scope.otherTable = $('#'+id).DataTable( {
	     		data : dataset,
	         	columns : columns,
	             dom: 'rt<"bottom"iplB>',
	             destroy: true,
	             adjust:true,
	             fixedColumns:   {
	                 leftColumns: 0,
	                 rightColumns: 1
	             },
	     		buttons: [
	     		   
	     		]
	         } );
	     }
	    
	    // 其它权益
	    $scope.other_columnsOne = [
			{title: "序号"},
			{title: "日期"},
			{title: "所属机构"},
			{title: "产品简称"},
			{title: "权益类型"},
			{title: "权益名称"},
			{title: "费用值"}
		 ]; 
	    
	    // 其它权益
	    $scope.other_columnsTwo = [
			{title: "序号"},
			{title: "日期"},
			{title: "所属机构"},
			{title: "产品简称"},
			{title: "权益类型"},
			{title: "权益名称"},
			{title: "设置值"}
		 ]; 
	    
	    $scope.otherDataset = [];
	 // 查询(前台分页)
	    $scope.findTem = function(incomeType,result){
	    	//将数据集赋值为空
	    	$scope.otherDataset = [];
	    	//更新表格对应的数据集
	    		var con = result;
	    		var tempArray = new Array();
	    		// 非其他权益列表
	    		if(incomeType != 0){
	    			for(var i = 0; i<con.length;i++){
	  			      var tempArr = [(i+1),con[i].incomeDate,$scope.transInstClient(con[i].instClientID), $scope.transProduct(con[i].instClientID,con[i].fundProductID),
	  			                     $scope.transIncType(con[i].incomeType),con[i].incomeName,
	  	                               parseFloat(con[i].currInterest).toFixed(2)
	  	                               ];
	  		            $scope.otherDataset.push(tempArr);
	  	            }
	  	            $scope.tableInit("otherIncomeSet_other_detail_dynamic_table",$scope.otherDataset,$scope.other_columnsOne);
	  	            
	    		}else{
	    			// 其他权益列表
	    			for(var i = 0; i<con.length;i++){
	  	               var tempArr = [(i+1),con[i].startDate,$scope.transInstClient(con[i].instClientID), $scope.transProduct(con[i].instClientID,con[i].fundProductID),
	  			                     $scope.transIncType(con[i].incomeType),con[i].incomeName,
	  	                               parseFloat(con[i].setValue).toFixed(2)
	  	                               ];
	  		            $scope.otherDataset.push(tempArr);
	  	            }
	  	            $scope.tableInit("otherIncomeSet_detail_dynamic_table",$scope.otherDataset,$scope.other_columnsTwo);
	    		}
	    		$timeout(function() {
	    			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
	    		}, 800);
	    }
});
