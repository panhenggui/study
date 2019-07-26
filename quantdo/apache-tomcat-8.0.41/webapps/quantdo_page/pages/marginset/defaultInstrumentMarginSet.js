myapp.controller('DefaultInstrumentMarginSetController', function($scope,
		$timeout,$rootScope) {
	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
	$scope.listEntitys = {};// 默认合约保证金信息
	$scope.exchangeDatas = {};// 交易所信息
	$scope.queryEntity = {};
	//以后兼容其他时候下拉筛选 不可写死
	//$scope.productType ="1";
	$scope.ModalEntity = {};
	$scope.isUpdate = false;
	$scope.isChecked = false;
	$scope.entitys = [];
	$scope.queryInstruments = [];
	$scope.modalInstruments = [];
	$scope.DefaultInstrumentMarginSetDataset = [];
	
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$scope.defaultInstrumentMarginSet_query = isShow("defaultInstrumentMarginSet_query");
	$scope.defaultInstrumentMarginSet_outexcel = isShow("defaultInstrumentMarginSet_outexcel");
	$scope.defaultInstrumentMarginSet_add = isShow("defaultInstrumentMarginSet_add");
	$scope.defaultInstrumentMarginSet_in = isShow("defaultInstrumentMarginSet_in");
	$scope.defaultInstrumentMarginSet_update = isShow("defaultInstrumentMarginSet_update");
	$scope.defaultInstrumentMarginSet_delete = isShow("defaultInstrumentMarginSet_delete");
	$scope.defaultInstrumentMarginSet_batchdelete = isShow("defaultInstrumentMarginSet_batchdelete");

	
	
	
	//定义固定列头
    $scope.DefaultInstrumentMarginSet_columns = [
        {title:"<a class='click-choice-all'></a>"},
        {title:"id",visible:false},
        {title: "交易所代码"},
        {title: "品种代码"},
        {title: "合约代码"},
        {title: "投保标志"}, 
        {title: "多头按金额"},
        {title: "多头按手数"},
        {title: "空头按金额"},
        {title: "空头按手数"},
		{title: "操作"}
	]
	
	// 初始化页面信息
	getAllDefaultInstrumentMarginSet(function(result) {
		$scope.listEntitys = result;
		$scope.$apply();
	})
	// 初始化交易所信息
	getAllExchanges(function(result) {
		$scope.exchangeDatas = result;
		$scope.$apply();
	});

	// 交易类型
	$scope.tradeTypes = clearConstant.tradeTypes;

	// 按照产品类型获取产品信息
	findProductEntity(function(result) {
		$scope.productDatas = result;
		$scope.queryProductDatas= result;
	}, {productType: $scope.productType});


	// 初始化合约信息
	getInstrumentByProductID(function(result) {
		$scope.Insts = result;
		$scope.queryInstruments = result;
		$scope.Instruments = result;
//		$scope.modalInstruments = result;
	}, {
		productID : '',productType:$scope.productType
	});
	
    //设置事件方法
    $scope.queryProductDatas = new Array();
    $scope.selectQueryExchange = function (exchID) {
        $scope.queryInstruments ==[];
        $scope.queryEntity.instrumentID = "";
        getAllProductByConditionEntity(
            function (result) {
            	$scope.queryProductDatas = new Array();
                if (result.length > 0) {
                    $scope.queryProductDatas = result;
                    findInstrumentEntity(function (result){
        				if(result.length > 0){
        					$scope.queryInstruments = result;
        				}
        			},{productID: $scope.queryEntity.productID,exchID:exchID,productType:$scope.productType});
                }
                $scope.queryEntity.productID = "";
                $scope.queryEntity.instrumentID = "";
				$scope.$apply();
            }, {
                exchID: exchID,
                productID: '',
                productType:$scope.productType,
                productStatus: ''
            });
    };

	//下拉框联动
	$scope.setQueryInstruments = function (){
		$scope.queryInstruments = [];
			findInstrumentEntity(function (result){
				if(result.length > 0){
					$scope.queryInstruments = result;
				}
				$scope.queryEntity.instrumentID = "";
				$scope.$apply();
			},{productID: $scope.queryEntity.productID,exchID:$scope.queryEntity.exchID,productType:$scope.productType});
	};
	
	$scope.setModalInstruments = function (entity){
		$scope.modalInstruments = [];
		if(entity.productID == undefined || entity.productID == ""){
			$scope.modalInstruments = [];
			$scope.ModalEntity.instrumentID = "";
		}else{
			findInstrumentEntity(function (result){
				if(result.length > 0){
					$scope.modalInstruments = result;
					$scope.ModalEntity.instrumentID = $scope.modalInstruments[0].instrumentID;
					$scope.$apply();
				}
			},{productID:entity.productID, exchID: $scope.ModalEntity.exchID,productType:$scope.productType});
		}
	};
	
	// 表单验证
	function formValidateReset() {
		$scope.myForm.exchID.$setPristine();
		$scope.myForm.productID.$setPristine();
		$scope.myForm.instrumentID.$setPristine();
		$scope.myForm.longMarginRate.$setPristine();
		$scope.myForm.longMarginAmt.$setPristine();
		$scope.myForm.shortMarginRate.$setPristine();
		$scope.myForm.shortMarginAmt.$setPristine();
	}
/*	// 查询
	$scope.find = function(queryEntity) {
		$scope.listEntitys = {};
		$scope.isQuery = true;
		var tempEntity = {
			exchID : '',
			productID : '',
			tradeType : ''
		};
		tempEntity = angular.copy(queryEntity);
		$scope.$apply();
		findByDefaultInstrumentMarginSet(function(result) {
			$scope.listEntitys = result;
			$timeout(function() {
				$scope.isQuery = false;
			}, 1000);
		}, tempEntity);
	};*/
	$("body").undelegate("#DefaultInstrumentMarginSet_dynamic_table_wrapper td .update-row","click");
	//表格修改事件
    $("body").delegate("#DefaultInstrumentMarginSet_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.DefaultInstrumentMarginSetTable.row(mytr).data();
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
    $("body").undelegate("#DefaultInstrumentMarginSet_dynamic_table_wrapper td .delete-row","click");
    //表格删除事件
    $("body").delegate("#DefaultInstrumentMarginSet_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.DefaultInstrumentMarginSetTable.row(mytr).data();
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
		$scope.DefaultInstrumentMarginSetDataset = [];
		$scope.listEntitys = [];
		findByDefaultInstrumentMarginSet(function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator1 = $scope.getUpdate($scope.defaultInstrumentMarginSet_update);
				var operator2 = $scope.getDelete($scope.defaultInstrumentMarginSet_delete);
		    	var tempArr = ["<a class='click-choice-one'></a>",con[i].id,con[i].exchID,con[i].productID,con[i].instrumentID,$scope.transTradeType(con[i].tradeType),con[i].longMarginRateStr,con[i].longMarginAmt,con[i].shortMarginRateStr
		    	           	            ,con[i].shortMarginAmt,operator1+operator2]
		    	$scope.DefaultInstrumentMarginSetDataset.push(tempArr); 
		    	con[i].index = i+1;
			}
			$scope.listEntitys = con;
			//重新绘表
	        $scope.DefaultInstrumentMarginSetTable.clear().draw();
	        $scope.DefaultInstrumentMarginSetTable.rows.add($scope.DefaultInstrumentMarginSetDataset).draw();
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		},$scope.queryEntity);
    };
    $scope.find();
    
    $scope.getUpdate = function(flag){
    	var result = "";
    	if(flag){
    		result = "<a class='update-row' data-toggle='modal' data-target='#defaultInstrumentMarginSetModal'>修改</a>"; 
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
	

	$scope.initParameter = function() {
		$scope.ModalEntity = {};
		$scope.isUpdate = false;
		$scope.products = [];
		$scope.modalInstruments = [];
//		$scope.ModalEntity.exchID = $scope.exchangeDatas[0].exchID;
//		$scope.ModalEntity.productID = $scope.productDatas[0].productID;
		$scope.ModalEntity.tradeType = $scope.tradeTypes[0].key;
//		$scope.ModalEntity.instrumentID = $scope.Insts[0].instrumentID;
//		$scope.selectExchange($scope.ModalEntity.exchID);
//		$scope.setModalInstruments($scope.ModalEntity);
		setDefaultValue();
		formValidateReset();
	};
	
	//默认显示值
	 function setDefaultValue() {
	        $scope.ModalEntity.longMarginRate=0;
	        $scope.ModalEntity.longMarginAmt=0;
	        $scope.ModalEntity.shortMarginRate=0;
	        $scope.ModalEntity.shortMarginAmt=0;
	}
	
	// 修改
	$scope.initUpdateParam = function(index, entity) {
		$scope.isUpdate = true;
		$scope.products = new Array();
		$scope.modalInstruments = new Array();
		angular.forEach($scope.productDatas, function(data, index, array) {
			if (data.exchID == entity.exchID) {
				$scope.products.push(array[index]);
			}
		});
		angular.forEach($scope.Instruments, function(data, index, array) {
			if (data.productID == entity.productID) {
				$scope.modalInstruments.push(array[index]);
			}
		});
		$scope.tempEntity = angular.copy(entity);
		
        //修改时，精度处理
        $scope.tempEntity.longMarginRate=accMul($scope.tempEntity.longMarginRate,100).toFixed(6);
        $scope.tempEntity.shortMarginRate=accMul($scope.tempEntity.shortMarginRate,100).toFixed(6);
        
		$scope.tempEntity.recordIndex = index;
		$scope.ModalEntity = angular.copy($scope.tempEntity);
		formValidateReset();
	};
	
	$scope.transTradeType = function (text) {
        var count = $scope.tradeTypes.length;
        for (var i = 0; i < count; i++) {
            if ($scope.tradeTypes[i].key == text) {
                return $scope.tradeTypes[i].text;
            }
        }
    };

	$scope.save = function(entity) {
		$scope.canClick = true;
		var index = entity.id;
		var tableIndex = entity.index;
		
        $scope.tmpSaveEntity = {};
        $scope.tmpSaveEntity = angular.copy(entity);
        
        //精度处理
        $scope.tmpSaveEntity.longMarginRate = accDiv($scope.tmpSaveEntity.longMarginRate,100).toString();
        $scope.tmpSaveEntity.shortMarginRate = accDiv($scope.tmpSaveEntity.shortMarginRate,100).toString();

        // 增加
		new $.SystemParams().getOperatorInfo(function(Id) {
			clearConstant.setOperator($scope.tmpSaveEntity, Id);
			if (index == undefined) {
				findByDefaultInstrumentMarginSet(function(result) {
					if (result == "") {
						$scope.tmpSaveEntity.isLockMargin = "0";
						$scope.isUpdate = false;
						savedefaultInstrumentMarginSet(function(addResult) {
							$scope.listEntitys.unshift(addResult);
							$scope.find();
							$scope.$apply();
							// 关闭窗口
							$("#defaultInstrumentMarginSetModal").modal("hide");
						}, $scope.tmpSaveEntity);
					} else {
						$scope.canClick = false;
						layer.msg("记录已存在，不可添加!", {
							icon : 2,
							time : 1000
						});
					}
				}, {
					exchID : $scope.tmpSaveEntity.exchID,
					productID : $scope.tmpSaveEntity.productID,
					tradeType : $scope.tmpSaveEntity.tradeType,
					instrumentID : $scope.tmpSaveEntity.instrumentID
				});
			} else {
				// 修改
				$scope.isUpdate = true;
				updateDefaultInstrumentMarginSet(function() {
					entity.longMarginRateStr=entity.longMarginRate;
					entity.shortMarginRateStr=entity.shortMarginRate;
					$scope.tmpSaveEntity.index = tableIndex;
            		$scope.listEntitys.splice(tableIndex-1, 1, $scope.tmpSaveEntity); 
            		
					$scope.DefaultInstrumentMarginSetTable.cells().every( function () {
	                    if((tableIndex-1) == this[0][0].row){
	                        if(this[0][0].column == 6){
	                            this.data(scientificToNumber($scope.tmpSaveEntity.longMarginRate));
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 7){
	                            this.data(entity.longMarginAmt);
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 8){
	                            this.data(scientificToNumber($scope.tmpSaveEntity.shortMarginRate));
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 9){
	                            this.data(entity.shortMarginAmt);
	                            $scope.$apply();
	                        }
	                    }

                    });
					//$scope.find();
					// 关闭窗口
					$("#defaultInstrumentMarginSetModal").modal("hide");
				}, $scope.tmpSaveEntity);
			}
		});
		  $timeout(function() {
              $scope.canClick = false;
          }, 2000); 
	};

	// 删除单个
	$scope.remove = function(index, entity) {
		layer.confirm('删除默认合约保证金，确认删除吗？', {
			icon : 3
		}, function(count) {
			deletedefaultInstrumentMarginSet(entity.id);
			$scope.listEntitys.splice(index, 1);
			$timeout(function() {
           	 	$scope.find();
			},200); 
			layer.close(count);
			$scope.queryBrIds = angular.copy($scope.listEntitys);
			$scope.$apply();
		});
	};

	// 批量删除
	$scope.removeLists = function() {		
		$scope.entitys = [];
		$scope.entitys = $scope.getRemoveEntitys();
		
		if ($scope.entitys.length > 0) {
			layer.confirm('批量删除默认合约保证金信息，确认删除吗？', {
				icon : 3
			}, function(count) {
				deleteListsdefaultInstrumentMarginSet(function (){
					$scope.find();
				},$scope.entitys);
				layer.close(count);
				$scope.entitys = [];
				layer.msg("删除默认合约保证金信息成功", {
					icon : 1
				});
                $scope.isChecked = false;
			});
		} else {
			layer.msg('请选择要删除的默认合约保证金信息', {
				icon : 2
			});
		}
	};
	
	//获取需要删除的集合
	$scope.getRemoveEntitys = function(){
			var tmpEntitys = [];
			//复选框选中列ID
	  	  	$scope.ids = new Array();
	  	  	$("#DefaultInstrumentMarginSet_dynamic_table a").each(function(){
	  	  		var flag = $(this).hasClass("clicked-choice-one");
			  	  		if(flag){
				  	  		var mytr = $(this).parents("tr");
					        var tempArr = $scope.DefaultInstrumentMarginSetTable.row(mytr).data();
					        var id = tempArr[1];//获取该行对应的id
					  	  	$scope.ids.push(id);
			  	  	    }
	          });
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
	$scope.isChecked = false
	$scope.addChecked = function() {
		if ($scope.isChecked == false) {
			$scope.entitys =  angular.copy($scope.listEntitys)
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
        $scope.modalInstruments = [];
        $scope.ModalEntity.productID = "";
        getAllProductByConditionEntity(
            function (result) {
                if (result.length > 0) {
                    $scope.products = result;
                    $scope.ModalEntity.productID = $scope.products[0].productID;
                    findInstrumentEntity(function (result){
        				if(result.length > 0){
        					$scope.modalInstruments = result;
        					$scope.ModalEntity.instrumentID = $scope.modalInstruments[0].instrumentID;
        					$scope.$apply();
        				}
        			},{productID: $scope.ModalEntity.productID,exchID:exchID,productType:$scope.productType});
                    $scope.$apply();
                }
            }, {
                exchID: exchID,
                productID: '',
                productStatus: ''
            });
    };
    //------------------------
    
    //导出excel
    $scope.exportExcel = function (queryEntity) {
    	$scope.tmpExportQuery = angular.copy(queryEntity);
    	framework.file.export("默认合约保证金率查询.xls",'excel',{
			entityKey:['exchID','productID','instrumentID','tradeType',  'longMarginRateStr','longMarginAmt','shortMarginRateStr','shortMarginAmt'],
			headerKey:['交易所代码','品种代码','合约代码','投保标志','多头按金额','多头按手数','空头按金额','空头按手数',	],
			styles:['plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText'],
			title:"默认合约保证金率导出数据",
			dicMap:{tradeType:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}}
		},"defaultInstrumentMarginSetService", "findByQuery", $scope.tmpExportQuery);
    };
    
    //导入
    $("#defaultInstrumentMarginSetUploader").uploadFile({
    	  dragdropWidth: 125,
          uploadStr:"Excel导入",
          dragDropStr: "",
          showAbort: false,
          dragDropContainerClass:"",
        url: framework.file.uploadUrl("defaultInstrumentMarginSetService", "uploadExcel", [null]),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
                if(errCode != 0) {
                    layer.msg(errMsg,{icon: 2});
                } else {
                	if(result != null){
                		if(result.code == '1'){
                			layer.msg("成功导入"+result.info+"条记录！", {icon: 1, time: 1500});
                			getAllDefaultInstrumentMarginSet(function (result) {
                	            $scope.listEntitys = result;
                	            $scope.find();
                	            $scope.$apply();
                	            $("#defaultInstrumentMarginSetUploadModal").modal("hide");
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
    $("body").undelegate("#DefaultInstrumentMarginSet_dynamic_table td a","click");
    $("body").delegate("#DefaultInstrumentMarginSet_dynamic_table td a","click",function(){
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
		    	$scope.DefaultInstrumentMarginSetTable = $('#DefaultInstrumentMarginSet_dynamic_table').DataTable( {
			    		data : $scope.DefaultInstrumentMarginSetDataset,
			        	columns :$scope.DefaultInstrumentMarginSet_columns,
			            dom: 'rt<"bottom"iplB>',
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: []
		        } );
      });

});
