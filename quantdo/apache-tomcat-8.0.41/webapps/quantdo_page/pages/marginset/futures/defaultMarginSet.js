myapp.controller('FuturesDefaultMarginSetController',function ($scope, $timeout,$rootScope) {
		$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
        //初始化页面信息
        getAllDefaultMarginSetEntity(function (result) {
            $scope.listEntitys = result;
            $scope.$apply();
        });

        $scope.queryEntity = {};
        $scope.ModalEntity = {};
        $scope.canClick = false;
    	$scope.FuturesDefaultMarginSetDataset = [];
    	// 交易类型
    	$scope.tradeTypes = clearConstant.tradeTypes;
        //调用表格重绘函数
    	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    	$scope.tabCallBackFunc = tabCallBackFunc;
    	
    	$scope.defaultMarginSet_query = isShow("defaultMarginSet_query");
    	$scope.defaultMarginSet_outexcel = isShow("defaultMarginSet_outexcel");
    	$scope.defaultMarginSet_add = isShow("defaultMarginSet_add");
    	$scope.defaultMarginSet_in = isShow("defaultMarginSet_in");
    	$scope.defaultMarginSet_update = isShow("defaultMarginSet_update");
    	$scope.defaultMarginSet_delete = isShow("defaultMarginSet_delete");
    	
    	
    	//定义固定列头
        $scope.FuturesDefaultMarginSet_columns = [
            {title: "序号"},
            {title:"id",visible:false},
            {title: "交易所代码"},
            {title: "品种代码"},
            {title: "投保标志"},
            {title: "多头按金额"},
            {title: "多头按手数"},
            {title: "空头按金额"},
            {title: "空头按手数"},
    		{title: "操作"}
    	]
        
        //初始化交易所信息
        getAllExchanges(function (result) {
            $scope.exchangeDatas = result;
        	$scope.$apply();
        });
    	//以后兼容其他时候下拉筛选 不可写死
    	$scope.productType =clearConstant.productTypes[0].key;
        
        findProductEntity(function (result) {
            $scope.productDatas = result;
        	$scope.$apply();
        }, {productType:$scope.productType});

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
                        $scope.productDatas  = result;
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

/*        //查询
        $scope.find = function (queryEntity) {
            $scope.listEntitys = {};
            $scope.isQuery = true;
            var tempEntity = {
                exchID: '',
                productID: ''
            };
            tempEntity = angular.copy(queryEntity);
            findDefaultMarginSetEntity(function (result) {
                $scope.listEntitys = result;
                $timeout(function() {
                    $scope.isQuery = false;
                }, 1000);
            }, tempEntity);
        };*/
        
        $("body").undelegate("#FuturesDefaultMarginSet_dynamic_table_wrapper td .update-row","click");
        //表格修改事件
        $("body").delegate("#FuturesDefaultMarginSet_dynamic_table_wrapper td .update-row","click",function(){
        	var mytr = $(this).parents("tr");
            var tempArr = $scope.FuturesDefaultMarginSetTable.row(mytr).data();
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
        $("body").undelegate("#FuturesDefaultMarginSet_dynamic_table_wrapper td .delete-row","click");
        //表格删除事件
        $("body").delegate("#FuturesDefaultMarginSet_dynamic_table_wrapper td .delete-row","click",function(){
        	var mytr = $(this).parents("tr");
            var tempArr = $scope.FuturesDefaultMarginSetTable.row(mytr).data();
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
    		$scope.FuturesDefaultMarginSetDataset = [];
    		$scope.listEntitys = [];
    		findDefaultMarginSetEntity(function(result){			
    			$scope.isQuery = true;
    			$scope.listEntitys = result;
    			var con = result;
    			for(var i = 0; i<con.length;i++){
    				var operator1 = $scope.getUpdate($scope.defaultMarginSet_update);
    				var operator2 = $scope.getDelete($scope.defaultMarginSet_delete);
    		    	var tempArr = [(i+1),con[i].id,con[i].exchID,con[i].productID,$scope.transTradeType(con[i].tradeType),con[i].longMarginRateStr,
    		    		con[i].longMarginAmt,con[i].shortMarginRateStr,con[i].shortMarginAmt,operator1+operator2]
    		    	$scope.FuturesDefaultMarginSetDataset.push(tempArr);
    		    	con[i].index = i+1;
    			}
    			$scope.listEntitys = con;
    			//重新绘表
    	        $scope.FuturesDefaultMarginSetTable.clear().draw();
    	        $scope.FuturesDefaultMarginSetTable.rows.add($scope.FuturesDefaultMarginSetDataset).draw();
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
        		result = "<a class='update-row' data-toggle='modal' data-target='#defaultMarginSetModal'>修改</a>"; 
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
        	$scope.myForm.exchID.$setPristine();
        	$scope.myForm.productID.$setPristine();
            $scope.myForm.longMarginRate.$setPristine();
            $scope.myForm.longMarginAmt.$setPristine();
            $scope.myForm.shortMarginRate.$setPristine();
            $scope.myForm.shortMarginAmt.$setPristine();
        }

        $scope.initParameter = function () {
        	$scope.isUpdate = false;
            $scope.ModalEntity = {};
            setDefaultValue();
    		$scope.ModalEntity.tradeType = $scope.tradeTypes[0].key;
            formValidateReset();
        };

        //显示默认值
        function setDefaultValue() {
            $scope.ModalEntity.longMarginRate=0;
            $scope.ModalEntity.longMarginAmt=0;
            $scope.ModalEntity.shortMarginRate=0;
            $scope.ModalEntity.shortMarginAmt=0;
        }
        //投保标志转换
    	$scope.transTradeType = function (text) {
            var count = $scope.tradeTypes.length;
            for (var i = 0; i < count; i++) {
                if ($scope.tradeTypes[i].key == text) {
                    return $scope.tradeTypes[i].text;
                }
            }
        };
        
        //修改
        $scope.initUpdateParam = function (index, entity) {
        	$scope.isUpdate = true;
            $scope.products = new Array();
            angular.forEach($scope.productDatas, function (data, index, array) {
                if (data.exchID == entity.exchID) {
                    $scope.products.push(array[index]);
                }
            });
            $scope.tempEntity = angular.copy(entity);
            $scope.tempEntity.recordIndex = index;
            
            //修改时，精度处理
            $scope.tempEntity.longMarginRate=accMul($scope.tempEntity.longMarginRate,100).toFixed(6);
            $scope.tempEntity.shortMarginRate=accMul($scope.tempEntity.shortMarginRate,100).toFixed(6);
            
            $scope.ModalEntity = angular.copy($scope.tempEntity);
            formValidateReset();
        };

        $scope.save = function (entity) {
        	$scope.canClick = true;
            var index = entity.recordIndex;
            var tableIndex = entity.index;
            
            $scope.tmpSaveEntity = {};
            $scope.tmpSaveEntity = angular.copy(entity);
            
            //精度处理
            $scope.tmpSaveEntity.longMarginRate = accDiv($scope.tmpSaveEntity.longMarginRate,100).toString();
            $scope.tmpSaveEntity.shortMarginRate = accDiv($scope.tmpSaveEntity.shortMarginRate,100).toString();
            
            //增加
            new $.SystemParams().getOperatorInfo(function (Id) {
                clearConstant.setOperator($scope.tmpSaveEntity, Id);
                $scope.tmpSaveEntity.isLockMargin = "0";
                if (index == undefined) {
                	findDefaultMarginSetEntity(function (qResult){
                		if(qResult.length > 0){
                			  $scope.canClick = false;
                			  
                			layer.msg("新增失败，不可重复", {icon: 2, time: 3000});
                			return false;
                		}else{
                			saveDefaultMarginSetEntity(function (addResult) {
                                $scope.listEntitys.unshift(addResult);
                                $scope.$apply();
                                $scope.find();
                              //关闭窗口
                                $("#defaultMarginSetModal").modal("hide");
                            }, $scope.tmpSaveEntity);

                		}
                	},$scope.tmpSaveEntity);
                    //修改
                } else {
                    updateDefaultMarginSetEntity(function () {
                    	$scope.tmpSaveEntity.index = tableIndex;
                		$scope.listEntitys.splice(tableIndex-1, 1, $scope.tmpSaveEntity);  
                		entity.longMarginRate = +entity.longMarginRate;
                		entity.shortMarginRate = +entity.shortMarginRate;
                        $scope.FuturesDefaultMarginSetTable.cells().every( function () {
    	                    if((tableIndex-1) == this[0][0].row){
    	                        if(this[0][0].column == 5){
    	                            this.data(scientificToNumber($scope.tmpSaveEntity.longMarginRate));
    	                            $scope.$apply();
    	                        }
    	                        if(this[0][0].column == 6){
    	                            this.data(entity.longMarginAmt);
    	                            $scope.$apply();
    	                        }
    	                        if(this[0][0].column == 7){
    	                            this.data(scientificToNumber($scope.tmpSaveEntity.shortMarginRate));
    	                            $scope.$apply();
    	                        }
    	                        if(this[0][0].column == 8){
    	                            this.data(entity.shortMarginAmt);
    	                            $scope.$apply();
    	                        }
    	                    }

                        });
                        //$scope.find();
                      //关闭窗口
                        $("#defaultMarginSetModal").modal("hide");
                    }, $scope.tmpSaveEntity);
                }
            });
            $timeout(function() {
                $scope.canClick = false;
            }, 2000); 
        };

        //删除
        $scope.remove = function (index, entity) {
        	layer.confirm('确定删除？', {icon: 3}, function (count) {
	            deleteDefaultMarginSetEntity(entity.id);
	            $scope.listEntitys.splice(index, 1);
	            $timeout(function() {
	            	 $scope.find();
	            },200); 
	            layer.close(count);
                $scope.$apply();
        	});
        };
        
        //导出excel
        $scope.exportExcel = function (queryEntity) {
        	$scope.tmpExportQuery = angular.copy(queryEntity);
        	framework.file.export("默认品种保证金率查询.xls",'excel',{
    			entityKey:['exchID','productID','tradeType','longMarginRateStr','longMarginAmt','shortMarginRateStr','shortMarginAmt'],
    			headerKey:['交易所代码','品种代码','投保标志','多头按金额','多头按手数','空头按金额','空头按手数',	],
    			styles:['plainText','plainText','plainText','plainText','plainText','plainText','plainText'],
    			title:"默认品种保证金率导出数据",
    			dicMap:{tradeType:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}}
    		},"defaultMarginSetService", "findByQuery", $scope.tmpExportQuery.exchID, 
    		$scope.tmpExportQuery.productID, $scope.tmpExportQuery.tradeType);
        };
        
        //导入
        $("#defaultMarginSetUploader").uploadFile({
        	  dragdropWidth: 125,
              uploadStr:"Excel导入",
              dragDropStr: "",
              showAbort: false,
              dragDropContainerClass:"",
            url: framework.file.uploadUrl("defaultMarginSetService", "uploadExcel", [null]),
            fileName: "file",// 名字不能改
            onSuccess: function (files, response, xhr, pd) {
                framework.file.uploadCallback(response,function(errCode,errMsg,result) {
                    if(errCode != 0) {
                        layer.msg(errMsg,{icon: 2});
                    } else {
                    	if(result != null){
                    		if(result.code == '1'){
                    			layer.msg("成功导入"+result.info+"条记录！", {icon: 1, time: 1500});
                    			getAllDefaultMarginSetEntity(function (result) {
                    	            $scope.listEntitys = result;
                    	            $scope.find();
                    	            $scope.$apply();
                    	            $("#defaultMarginSetUploadModal").modal("hide");
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
        
        //初始化
        $(document).ready(function() {
    		    	//会话列表初始化
    		    	$scope.FuturesDefaultMarginSetTable = $('#FuturesDefaultMarginSet_dynamic_table').DataTable( {
    			    		data : $scope.FuturesDefaultMarginSetDataset,
    			        	columns :$scope.FuturesDefaultMarginSet_columns,
    			            dom: 'rt<"bottom"iplB>',
    			            fixedColumns:   {
    			                leftColumns: 0,
    			                rightColumns: 1
    			            },
    						buttons: []
    		        } );
          });
        
    });
