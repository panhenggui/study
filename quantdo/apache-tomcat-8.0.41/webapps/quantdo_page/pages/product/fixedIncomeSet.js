myapp.controller('FixedIncomeSetController', function($scope, $timeout,$rootScope) {
	//调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
	$scope.tempFundProduct = {};
	$scope.tempStateEntity = [];
	$scope.instClientlistEntitys=[];
	$scope.fundProducts=[];
	$scope.tempFundProduct.updateIndex = -1;
	$scope.listEntitys = new Array();
	$scope.detailListEntitys = new Array();
	$scope.temvar="";
	$scope.productDataset = [];
	$scope.queryEntity = {};
	$scope.linkAccountTypes=clearConstant.linkAccountType;

	// 按钮权限
	$scope.fixedIncomeSet_add = isShow("fixedIncomeSet_add");
	$scope.fixedIncomeSet_update = isShow("fixedIncomeSet_update");
	$scope.fixedIncomeSet_info = isShow("fixedIncomeSet_info");
	$scope.fixedIncomeSet_delete = isShow("fixedIncomeSet_delete");
	$scope.fixedIncomeSet_status = isShow("fixedIncomeSet_status");
	$scope.detail_query = isShow("detail_query");
	
	$scope.fixedIncomeStates = clearConstant.fixedIncomeStates;
	var date = clearConstant.formatDate(new Date());
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
    	var result = "";
    	if(instClientID!=null&&instClientID!=undefined){
        	for(var i = 0;i < $scope.instClientlistEntitys.length; i++){
        		if($scope.instClientlistEntitys[i].instClientID == instClientID){
        			result = $scope.instClientlistEntitys[i].instClientAbbrName;
        		}
        	}
    	}
    	return result;
    }
	
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
		format : 'yyyymmdd'
	});
	// 初始化产品记录
	getAllFundProductEntity(function(result) {
		$scope.fundProducts = result;
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

	// 重置表单验证信息
	function formValidateReset() {
		$scope.myForm.fundProductID.$setPristine();
		$scope.myForm.instClientID.$setPristine();
		$scope.myForm.fixedIncomeName.$setPristine();
		$scope.myForm.investMoney.$setPristine();
		$scope.myForm.incomeRate.$setPristine();
		$scope.myForm.startDate.$setPristine();

	}

	// 初始化模态框页面参数
	$scope.initParameter = function() {
		// 初始化产品记录
		getAllFundProductEntity(function(result) {
			$scope.fundProducts = result;
			$scope.$apply();
		});
		
		$scope.ModalEntity = {};
		// 设置默认选中
		formValidateReset();
		$scope.ModalEntity.startDate=date;
		if($scope.instClientID != undefined ){
	         $scope.isInstClient = true;
	         $scope.ModalEntity.instClientID=$scope.instClientID;
	         $scope.isInstClientSelect($scope.ModalEntity.instClientID);
	     }
    	$scope.investMoneyText = null;
		$scope.isUpdate = false;
		$timeout(function() {
			document.getElementById("fundProductID").focus();
		}, 500);
		// 设置窗口显示位置
		$('#fixedIncomeSetModal').on(
				'show.bs.modal',
				function(e) {
					$(this).find('.modal-dialog').css(
							{
								'margin-top' : function() {
									var modalHeight = $('#fixedIncomeSetModal')
											.find('.modal-dialog').height();
									return ($(window).height() / 2 - 300);
								}
							});
				});
	};

	// 修改初始化页面参数
	$scope.initUpdate = function(index, obj) {
		$scope.temvar="";
    	$scope.investMoneyText = null;
		$scope.tempFundProduct = angular.copy(obj);
		$scope.tempFundProduct.updateIndex = index;
		$scope.ModalEntity = angular.copy($scope.tempFundProduct);
		findFundProductByConts(function (result) {
        	$scope.fundProductTems=result;
        	$scope.$apply();
        },{instClientID:$scope.ModalEntity.instClientID});
		
		formValidateReset();
		$scope.temvar=obj.fixedIncomeName;
		$scope.isUpdate = true;
		$scope.$apply();
		$timeout(function() {
			document.getElementById("fixedIncomeName").focus();
		}, 500);
	};

	// 修改状态初始化页面参数
	$scope.initUpdateState = function(index, obj) {
		$scope.tempStateEntity = [];
		$scope.tempStateEntity = angular.copy(obj);
		$scope.updateStateIndex = index;
		$scope.fixedIncomeState = $scope.fixedIncomeStates[0].key;
		// 使用内置Index
		layer.confirm('确定修改该固收产品状态信息吗？', {
			icon : 3
		}, function(count) {	
			$("#setModalState").modal("show");
			layer.close(count);
		});
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
		   $scope.queryDetailEntity.searchFundProductID=obj.fundProductID;
		   $scope.queryDetailEntity.searchStartDate=$scope.tradingDate;
		   $scope.queryDetailEntity.searchEndDate=$scope.tradingDate;
		   $scope.queryDetailEntity.id=obj.id;
		   
		findFixedIncomeEntity(function(result) {
			transEntity(result);
			$scope.findTem(result);
			$timeout(function() {
				 $("#searchDetail").modal("show");
			}, 500);
		}, {
			fundProductID : obj.fundProductID,
			fixedIncomeID : obj.id
		});
	};

	// 更改状态
	$scope.updateState = function(fixedIncomeState, updateStateIndex) {
		//状态变3特殊处理（2-停息保留余额，3-了结清除余额）
		$scope.tempStateEntity.status = fixedIncomeState;
		if(fixedIncomeState==3){
			insertFixedIncome(function(result) {
				if(result !=undefined){
					updateFixedIncomeSet(function(result) {
						$scope.listEntitys.splice(updateStateIndex, 1, result);
						$scope.$apply();
					}, $scope.tempStateEntity);
				}
				$("#setModalState").modal("hide");
				// 查询
				$scope.find();
				$scope.$apply();
			}, $scope.tempStateEntity);
		}else {
			updateFixedIncomeSet(function(result) {
				$scope.listEntitys.splice(updateStateIndex, 1, result);
				$("#setModalState").modal("hide");
				// 查询
				$scope.find();
				$scope.$apply();
			}, $scope.tempStateEntity);	
		}
	};
	// 删除
	$scope.remove = function(fundProduct, index) {
		// 使用内置Index
		layer.confirm('确定注销此基金产品信息吗？', {
			icon : 3
		}, function(count) {
			removeFixedIncomeSet(function(result) {
//				$scope.listEntitys.splice(index, 1);
//				$scope.$apply();
			}, fundProduct);
			layer.close(count);
			// 重新查询
			$scope.find();
			$scope.$apply();
		});
	};

	// 查询
//	$scope.find = function(object) {
//		$scope.isQuery = true;
//		$scope.listEntitys = {};
//		findByFixedIncomeSetEntity(function(result) {
//			$scope.listEntitys = result;
//			$timeout(function() {
//				$scope.isQuery = false;
//			}, 1000);
//		}, object);
//	};
	// 初始化页面记录
//	getAllFixedIncomeSetEntity(function(result) {
//		$scope.listEntitys = result;
//		$scope.$apply();
//	});

	// 新增
	$scope.save = function(entity) {
		var index = entity.updateIndex;
		var tableIndex = entity.index;
		
		var incomeRate = entity.incomeRate;
      	if(incomeRate >100){
      		layer.msg("产品年收益率不可大于100", {icon: 2, time: 3000});
  			return false;
      	}
      	var investMoney = entity.investMoney;
      	if(investMoney == 0){
      		layer.msg("固投金额不可为零！", {icon: 2, time: 3000});
  			return false;
      	}
	  
		// 修改
		if (index != undefined) {
			//固收项目名称未更改
			if ($scope.temvar == entity.fixedIncomeName) {
				delete entity.updateIndex;
				updateFixedIncomeSet(function(result) {
					result.index = tableIndex;
	        		$scope.listEntitys.splice(tableIndex-1, 1, result);  
	        		      		
					$scope.productTable.cells().every( function () {
	                    if((tableIndex-1) == this[0][0].row){
	                        if(this[0][0].column == 4){
	                            this.data(entity.fixedIncomeName);
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 6){
	                            this.data(entity.incomeRate);
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 9){
	                            this.data(entity.remark);
	                            $scope.$apply();
	                        }
	                    }

					});
					layer.msg("修改成功", {icon : 1});
					$("#fixedIncomeSetModal").modal("hide");
					// 重新查询
					//$scope.find();
				}, entity);
			}else{
				findByFixedIncomeSetEntityQuer(function(result) {
				if (result.length > 0) {
						layer.msg("该产品所对应的固收项目名称已存在，请重新输入", {
							icon : 2,
							time : 3000
						});
						return false;
					} else {
						delete entity.updateIndex;
						updateFixedIncomeSet(function(result) {
							result.index = tableIndex;
			        		$scope.listEntitys.splice(tableIndex-1, 1, result);  
			        		      		
							$scope.productTable.cells().every( function () {
			                    if((tableIndex-1) == this[0][0].row){
			                        if(this[0][0].column == 4){
			                            this.data(entity.fixedIncomeName);
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 6){
			                            this.data(entity.incomeRate);
			                            $scope.$apply();
			                        }
			                        if(this[0][0].column == 9){
			                            this.data(entity.remark);
			                            $scope.$apply();
			                        }
			                    }

							});
							layer.msg("修改成功", {icon : 1});
							$("#fixedIncomeSetModal").modal("hide");
							// 重新查询
							//$scope.find();
						}, entity);
					}
				}, {
					instClientID :entity.instClientID,
					fundProductID : entity.fundProductID,
					fixedIncomeName : entity.fixedIncomeName
				});
				
			}
			// 新增
		} else {
			  // 查重复
			findByFixedIncomeSetEntityQuer(function(result) {
				if (result.length > 0) {
					layer.msg("该产品所对应的固收项目名称已存在，请重新输入", {
						icon : 2,
						time : 3000
					});
					return false;
				} else {
					entity.isActive = '1';
					// 查 生效日期 应在产品有效期内
					findProduceByStartDate(function(ProduceResult) {
						if (ProduceResult == undefined) {
							layer.msg("该产品所对应的生效日期 不在产品有效期内，请选择其他产品", {
								icon : 2,
								time : 3000
							});
							return false;
						} else {
							saveFixedIncomeSet(function(result) {
								$scope.listEntitys.push(result);
								$scope.$apply();
								$("#fixedIncomeSetModal").modal("hide");
								// 重新查询
								$scope.find();
							}, entity);
					    }
					},{instClientID :entity.instClientID,
						fundProductID : entity.fundProductID,
					   startDate : entity.startDate });
				}
			}, {
				instClientID :entity.instClientID,
				fundProductID : entity.fundProductID,
				fixedIncomeName : entity.fixedIncomeName
			});
	    }
			
	}

	// 明细查询
	$scope.findDetailList = function(object) {
		$scope.isQueryDetail = true;
		findFixedIncomeEntity(function(result) {
			// 前台分页
			$scope.findTem(result);
			$scope.$apply();
			$timeout(function() {
				$scope.isQueryDetail = false;
			}, 2000);
		}, {
			fixedIncomeID : object.id,
			fundProductID : object.searchFundProductID,
			startDate : object.searchStartDate,
			endDate : object.searchEndDate
		});
	};
	
	 // 阿拉伯数字转换成中文
    $scope.toChinaNum = function(number,i){
      	if(undefined == number || "" == number){
    		$scope.investMoney = null;
    		$scope.investMoneyText = null;
        	return ;
    	}
      	var text = changeMoneyToChinese(number);
      	if(text != "error"){
      		$scope.investMoneyText = text;
      	}
    }
    
  //转换产品简称
	 $scope.transProduct = function (fundProductID,instClientID){
			 var result = "";
			 if(fundProductID!=null&&fundProductID!=undefined&&instClientID!=null&&instClientID!=undefined){
				 var count = $scope.fundProducts.length;
			        for (var i = 0; i < count; i++) {
			        	 if ($scope.fundProducts[i].fundProductID == fundProductID && $scope.fundProducts[i].instClientID==instClientID) {
			        		 result = $scope.fundProducts[i].shortProductName;
			             }
			        }
			 }
		     return result;	
	    }
	 
		function transEntity(entity){
			$scope.detailListEntitys=[];
			angular.forEach(entity, function(value, index, arrays) {
				value.initInterest=value.initInterest.toFixed(2);
				value.finalInterest=value.finalInterest.toFixed(2);
				value.currInterest=value.currInterest.toFixed(2);
				$scope.detailListEntitys.push(value);
			});
			
		}
		
		
		 //定义产品基础信息的固定列头
	    $scope.product_columns = [
	        {title: "序号"},
	        {title: "id",visible:false},
	        {title: "所属机构"},
	        {title: "产品简称"},
	        {title: "固收项目名称"},
	        {title: "固投金额"},
	        {title: "年化收益率 %"},
	        {title: "生效日期"},
	        {title: "状态"},
	        {title: "备注"},
	        {title: "操作"}
	    ]; 
	    $("body").undelegate("#fixedIncomeSet_dynamic_table_wrapper td .update-row1","click");
	    $("body").delegate("#fixedIncomeSet_dynamic_table_wrapper td .update-row1","click",function(){
	    	var mytr = $(this).parents("tr");
	        var tempArr = $scope.productTable.row(mytr).data();
	        var id = tempArr[1];
	        for(var i = 0;i<$scope.listEntitys.length;i++){
	        	if(id==$scope.listEntitys[i].id){
	        		$scope.modalEntity = $scope.listEntitys[i];
	        	}
	        }
	        // 状态修改的权限
	        if($scope.fixedIncomeSet_status){
	        	$scope.initUpdateState(id,$scope.modalEntity);
	        } 
	    });
	    $("body").undelegate("#fixedIncomeSet_dynamic_table_wrapper td .update-row2","click");
	     $("body").delegate("#fixedIncomeSet_dynamic_table_wrapper td .update-row2","click",function(){
	    	var mytr = $(this).parents("tr");
	        var tempArr = $scope.productTable.row(mytr).data();
	        var id = tempArr[1];
	        for(var i = 0;i<$scope.listEntitys.length;i++){
	        	if(id==$scope.listEntitys[i].id){
	        		$scope.modalEntity = $scope.listEntitys[i];
	        	}
	        }
	        // 状态修改的权限
	        if($scope.fixedIncomeSet_status){
	        	 $scope.initUpdateState(id,$scope.modalEntity);
	        } 	       
	    });
	     $("body").undelegate("#fixedIncomeSet_dynamic_table_wrapper td .fixedIncomeSet-update-row","click");
	     $("body").delegate("#fixedIncomeSet_dynamic_table_wrapper td .fixedIncomeSet-update-row","click",function(){
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
	     $("body").undelegate("#fixedIncomeSet_dynamic_table_wrapper td .fixedIncomeSet-detail-row","click");
	     $("body").delegate("#fixedIncomeSet_dynamic_table_wrapper td .fixedIncomeSet-detail-row","click",function(){
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
	     $("body").undelegate("#fixedIncomeSet_dynamic_table_wrapper td .delete-row1","click");
	    $("body").delegate("#fixedIncomeSet_dynamic_table_wrapper td .delete-row1","click",function(){
	    	var mytr = $(this).parents("tr");
	        var tempArr = $scope.productTable.row(mytr).data();
	        var id = tempArr[1];
	        for(var i = 0;i<$scope.listEntitys.length;i++){
	        	if(id==$scope.listEntitys[i].id){
	        		$scope.modalEntity = $scope.listEntitys[i];
	        	}
	        }
	        $scope.remove($scope.modalEntity,id);
	    });
	    
	 // 查询(前台分页)
	    $scope.find = function(){
	    	//更新表格对应的数据集
	    	findByFixedIncomeSetEntity(function (result) {
	    		//将数据集赋值为空
	    		$scope.productDataset = [];
	    		var con = result;
	    		$scope.listEntitys = result;
	    		var tempArray = new Array();
	            for(var i = 0; i<con.length;i++){
	            	var statuOperate = "";
	            	if(1==con[i].status){
	            		statuOperate = "<a class='row-operation-distance update-row1' data-toggle='modal' data-target='#initUpdateState'>正常</a>";
		
	            	}else if(2==con[i].status){
	            		statuOperate = "<a class='row-operation-distance update-row2' data-toggle='modal' data-target='#initUpdateState'>停息保留余额</a>";
		
	            	}else if(3==con[i].status){
	            		statuOperate = "了结清除余额";
		
	            	}
	            	
//	            	var operate = "<a class='update-row3' data-toggle='modal' data-target='#fixedIncomeSetModal'>[修改]</a>" +
//        			"<a class='update-row4' data-toggle='modal'>[查询明细]</a>" +
//        			"<a class='delete-row1'>[删除]</a>";
	            	var operate = "";
	            	if($scope.fixedIncomeSet_update){
	            		operate = operate.concat("<a class='row-operation-distance reset-operation fixedIncomeSet-update-row' data-toggle='modal' data-target='#fixedIncomeSetModal'>修改</a>");
	            	}if($scope.fixedIncomeSet_info){
	            		operate = operate.concat("<a class='row-operation-distance reset-operation fixedIncomeSet-detail-row' data-toggle='modal'>查询明细</a>");
	            	}
	                var tempArr = [(i+1),con[i].id,$scope.transInstClient(con[i].instClientID), $scope.transProduct(con[i].fundProductID,con[i].instClientID),con[i].fixedIncomeName,con[i].investMoney
	                               ,con[i].incomeRate,con[i].startDate,statuOperate,con[i].remark,operate];
		            $scope.productDataset.push(tempArr);
		            con[i].index = i+1;
	            }
	            $scope.listEntitys = con;
	            //重新绘表
	            $scope.productTable.clear().draw();
	            $scope.productTable.rows.add($scope.productDataset).draw();
	        }, $scope.queryEntity);  	
	    }
	    
	    // 初始化
	    $timeout(function() {
	    	  $scope.find({});
	    }, 500);
	 
	    
	  //初始化
	    $(document).ready(function() {
	    	//会话列表初始化
	    	$scope.productTable = $('#fixedIncomeSet_dynamic_table').DataTable( {
	    		data : $scope.productDataset,
	        	columns :$scope.product_columns,
//	        	scrollY: 300,
//	          scrollX: true,
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
	    	
	    	return $scope.otherTable = $('#'+id).DataTable( {
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
	    
	    // 固收资产明细信息
	    $scope.other_columns = [
			{title: "序号"},
			{title: "日期"},
			{title: "所属机构"},
			{title: "产品简称"},
			{title: "固收项目名称"},
			{title: "期初固收权益"},
			{title: "期末固收权益"},
			{title: "当日收益"}
		 ]; 
	    
	    $scope.otherDataset = [];
	 // 查询(前台分页)
	    $scope.findTem = function(result){
	    	//将数据集赋值为空
	    	$scope.otherDataset = [];
	    	//更新表格对应的数据集
	    		var con = result;
	    		var tempArray = new Array();
	            for(var i = 0; i<con.length;i++){
				 
	            	var tempArr = [(i+1),con[i].incomeDate,$scope.transInstClient(con[i].instClientID), $scope.transProduct(con[i].fundProductID,con[i].instClientID),con[i].fixedIncomeName,
	                               parseFloat(con[i].initInterest).toFixed(2),parseFloat(con[i].finalInterest).toFixed(2),parseFloat(con[i].currInterest).toFixed(2)
	                               ];
		            $scope.otherDataset.push(tempArr);
		            
	            }
	            $scope.otherTable = $scope.tableInit("fixedIncomeSet_detail_dynamic_table",$scope.otherDataset,$scope.other_columns);
	            $timeout(function() {
	    			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
	    		}, 800);
	    }
	    
});
