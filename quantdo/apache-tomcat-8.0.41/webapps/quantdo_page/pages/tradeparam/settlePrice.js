myapp.controller('SettlePriceController', ['$scope', '$timeout', 'Upload','$rootScope', function ($scope, $timeout, Upload,$rootScope) {
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
    $("[forType='date']").datepicker({
        language: 'zh-CN',
        weekStart: 1,
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        format: 'yyyymmdd'
    });
    $scope.queryEntity = {};
    $scope.queryEntity.settleDate = clearConstant.formatDate(new Date());
    $scope.Instruments={};
    $scope.listEntitys = [];
    
    // 按钮呢权限
    $scope.settlePrice_query = isShow("settlePrice_query");
    $scope.settlePrice_add = isShow("settlePrice_add");
    $scope.settlePrice_get = isShow("settlePrice_get");
    $scope.settlePrice_ready = isShow("settlePrice_ready");
    $scope.settlePrice_update = isShow("settlePrice_update");
    $scope.settlePrice_delete = isShow("settlePrice_delete");

    //初始化页面信息
//    getAllSettlePriceEntity(function (result) {
//        $scope.listEntitys = result;
//        $scope.$apply();
//    });

    //初始化所有产品信息并默人选中第一项
    getAllProductEntity(function (result) {
        $scope.products = result;
        $scope.productsAll = result;
        $scope.modalProducts = result;
    });
    //初始化所有合约信息并默认选中第一项
    getAllInstrumentEntity(function (result) {
        $scope.instruments = result;
        $scope.$apply();
    });

    //根据交易所初始化产品信息
    $scope.selectFindProduct = function (exchID) {
        findProductEntity(function (result) {
            $scope.products = result;
            $scope.selectFindInstrument(exchID,"");
            //$scope.ModalEntity.productID = {};
            //$scope.ModalEntity.productID = $scope.productDatas[0].productID;
            $scope.$apply();
        }, {exchID: exchID});
    };
    
    $scope.selectModalProduct = function (exchID) {
        findProductEntity(function (result) {
            $scope.modalProducts = result;
            //$scope.ModalEntity.productID = {};
            //$scope.ModalEntity.productID = $scope.productDatas[0].productID;
            $scope.$apply();
        }, {exchID: exchID});
    };
    
    //根据交易所和产品初始化所有合约信息
    $scope.selectFindInstrument = function (exchID,productID) {
    	getInstrument(function (result) {
    		$scope.instruments = result;
    		//$scope.ModalEntity.instrumentID = {};
            //$scope.ModalEntity.instrumentID = $scope.Instruments[0].instrumentID;
    		$scope.$apply();
    	},{exchID: exchID,productID: productID,instrumentID: ""});
    };

    $scope.exchangeDatas = {};
    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
   	    defaultExchange = {};
        defaultExchange.exchID = "OTC";
        defaultExchange.exchName = "场外";
        $scope.exchangeDatas.unshift(defaultExchange);
    });

    $scope.queryObject = {};
//    //查询
//    $scope.find = function (queryEntity) {
//        $scope.listEntitys = {};
//        $scope.isQuery = true;
//        $scope.queryObject = angular.copy(queryEntity);
//        findSettlePriceEntity(function (result) {
//            $scope.listEntitys = result;
//            $timeout(function() {
//            	$scope.isQuery = false;
//            	$scope.$apply();
//              }, 1500);
//        }, $scope.queryObject);
//    };

    //删除
    $scope.remove = function (index, entity) {
    	layer.confirm('确定删除？', {icon: 3}, function (count) {
    		deleteSettlePriceEntity(function(result){
    			if(result=='0'){
    				$scope.find();
            		layer.close(count);
    			}else{
    				layer.msg("删除失败！", {icon: 2, time: 3000});
    			}			
    		},entity.id);
    	});
    };

    $scope.ModalEntity = {};
    function formValidateReset() {
        $scope.myAddForm.settlePrice.$setPristine();
        $scope.myAddForm.lastSettlePrice.$setPristine();
        $scope.myAddForm.exchID.$setPristine();
        $scope.myAddForm.productID.$setPristine();
        $scope.myAddForm.instrumentID.$setPristine();
    }

    //获取上一日结算价数据
    $scope.getLastPrice = function (index,exchID,productID,instrumentID){
//    	if(index == undefined){
	    	$scope.ModalEntity.lastSettlePrice = "";
	    	if(exchID != "" && exchID != undefined &&
	    			productID != "" && productID != undefined &&
	    			instrumentID != "" && instrumentID != undefined){
		    	getLastSettlePrice(function(result){
		    		if(result==0){
		    			$scope.ModalEntity.lastSettlePrice = "";
		    		}else{
		    			$scope.ModalEntity.lastSettlePrice = result;
		    		}
		    		$scope.$apply();
		    	},exchID,productID,instrumentID);
	    	}
//    	}
    };
    
    //初始化模态窗
    $scope.initParameter = function () {
    	$scope.canClick =true;
        $scope.ModalEntity = {};
        $scope.queryAddEntitys=[];
        $scope.ModalEntity.settleDate = clearConstant.formatDate(new Date());
        if($scope.settlePrice_ready){
        	$scope.isShow = true;
        }
        $scope.modalProducts = $scope.productsAll;
        formValidateReset();
 
    };

    //修改
    $scope.initUpdateParam = function (index, entity) {
        $scope.isShow = false;
        $scope.canClick =false;
        $scope.ModalEntity = {};
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        $scope.ModalEntity.exchID = $scope.tempEntity.exchID;
        $scope.selectProduct($scope.ModalEntity.exchID);
        $scope.ModalEntity.productID = $scope.tempEntity.productID;
        $scope.selectInstrument($scope.ModalEntity.productID);
        $scope.ModalEntity.instrumentID = $scope.tempEntity.instrumentID;
        $scope.ModalEntity.lastSettlePrice = scientificToNumber($scope.ModalEntity.lastSettlePrice);
        $scope.ModalEntity.settlePrice = scientificToNumber($scope.ModalEntity.settlePrice);
        
        formValidateReset();
    };
    
    $scope.selectProduct = function (exchID) {
        findProductEntity(function (result) {
            $scope.productDatas = result;
            //$scope.ModalEntity.productID = {};
            //$scope.ModalEntity.productID = $scope.productDatas[0].productID;
            $scope.$apply();
        }, {exchID: exchID});
    };
    
    $scope.selectInstrument = function (productID) {
    	getInstrumentByProductID(function (result) {
    		$scope.instrumentDatas = result;
    		//$scope.ModalEntity.instrumentID = {};
            //$scope.ModalEntity.instrumentID = $scope.Instruments[0].instrumentID;
    		$scope.$apply();
    	},{productID: productID});
    };

    // 保存操作记录
    $scope.save = function (entity) {
    	if(entity.settleDate == "" || entity.settleDate == undefined || entity.settleDate == null){
    		layer.msg("结算日期不能为空,新增失败", {icon: 2, time: 3000});
            return false;
    	}
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        //增加
        if (index == undefined) {
            findSettlePriceEntity(function (result) {
                if (result.length > 0) {
                    layer.msg("不能对同一合约维护多条结算价", {icon: 2, time: 3000});
                    return false;
                } else {
                    saveSettlePriceEntity(function (result) {
                    	//关闭窗口
                        $("#settlePriceModal").modal("hide");
                        $scope.find();
                        $scope.listEntitys.push(result);
                        $scope.$digest();
                    }, entity);
                }
            }, entity);
            //修改
        } else {
            updateSettlePriceEntity(function (result) {     	
            	result.index = tableIndex;
        		$scope.listEntitys.splice(tableIndex-1, 1, result);  
                $scope.productTable.cells().every( function () {
                    if((tableIndex-1) == this[0][0].row){
                        if(this[0][0].column == 6){
                            this.data(scientificToNumber(result.settlePrice.toFixed(8)));
                            $scope.$apply();
                        }
                        if(this[0][0].column == 7){
                            this.data(scientificToNumber(result.lastSettlePrice.toFixed(8)));
                            $scope.$apply();
                        }
                    }
                });
                $scope.$digest();
                //$scope.find();
                //关闭窗口
                $("#settlePriceModal").modal("hide");
            }, entity);
        }
    };


    $scope.continueSave = function (entity) {
    	if(entity.settleDate == "" || entity.settleDate == undefined || entity.settleDate == null){
    		layer.msg("结算日期不能为空,继续新增失败", {icon: 2, time: 3000});
            return false;
    	}
        $timeout(function() {
        	$scope.getAddItems(entity.settleDate);
        }, 500);
    	
        //判断当前增加的结算价是否已经存在
        findSettlePriceEntity(function (result) {
            if (result.length > 0) {
                layer.msg("不能对同一合约维护多条结算价", {icon: 2, time: 3000});
                return false;
            } else {
                saveSettlePriceEntity(function (result) {
                    $scope.listEntitys.push(result);
                    var tem =$scope.ModalEntity;
                	var tmp ={};
                	angular.forEach($scope.queryAddEntitys, function (value, index, arrays) {
        				if(tem.exchID==value.exchID && tem.productID==value.productID &&tem.instrumentID==value.instrumentID){
        					index=index+1;
        					if(index<$scope.queryAddEntitys.length){
        						tmp	=$scope.queryAddEntitys[index];
        			        	$scope.canClick =false;
        			        	$scope.ModalEntity ={};
        			        	$scope.ModalEntity =tmp;
        			        	$scope.isAdd = false;
        			        	$scope.ModalEntity.settlePrice = "";
        			        	$scope.myAddForm.settlePrice.$setPristine();
        			            $scope.myAddForm.lastSettlePrice.$setPristine();
        			        	getLastSettlePrice(function(result){
        			        		if(result == 0){
        			        			$scope.ModalEntity.lastSettlePrice = 0;
        			        			$scope.$apply();
        			        		}else{
        			        			$scope.ModalEntity.lastSettlePrice = result;
        			        			$scope.$apply();
        			        		}
        			        		$("#settlePrice").focus();
        			        	},tmp.exchID,tmp.productID,tmp.instrumentID);
        				    } else{
        				    	$("#settlePriceModal").modal("hide");
        				    }
        					$scope.find($scope.queryEntity);
        					$scope.$apply();
        				}
        			});
                }, entity);
            }
        }, entity);
    };


    $scope.UploadEntity = {};
    //Begin导入结算价----------------------------------------------------------------
    $scope.uploadSettlePrice = function () {
        $scope.UploadEntity.uploadDate = clearConstant.formatDate(new Date());
    };

    $("#settlePriceFileuploader").uploadFile({
        url: framework.file.uploadUrl("settlePriceService", "uploadFile"),
        fileName: "file", // 名字不能改
        onSelect: function (files) {
            var fileName = files[0].name;
            if (!fileName.endWith("txt")) {
                jqueryConst.showMsg(2001);
                return false;
            }
            var settleDate = $("#uploadDate").val();
            if (settleDate == "") {
                layer.msg("请选择结算日期", {icon: 2, time: 3000});
                return false;
            }
            framework.service.request('settlePriceService', 'getDate', settleDate, function (errCode, errMsg, result) {
                if (errCode > 0) {
                    console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                }
            });
            return true;
        },
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response, function (errCode, errMsg, result) {
                if (errCode != 0) {
                    console.log(errCode);
                    layer.msg(errCode + ': ' + errMsg, {icon: 2});
                } else {
                    $("#settlePriceUploadModal").modal("hide");
                    $scope.find($scope.queryEntity);
//                    getAllSettlePriceEntity(function (result) {
//                        $scope.listEntitys = result;
//                        $scope.$apply();
//                    });
                }
            });
        }
    });
    //end --
    
    $scope.copySettlePrice = function () {
    	
    	var settlePriceType = document.getElementById("settlePriceType").value;
    	var settlePriceFlag;
    	if(settlePriceType == "settlementPrice"){
    		settlePriceFlag = true;
    	}else{
    		settlePriceFlag = false;
    	}
    	layer.load(2);
    	
    	setCurrSettlePrice(settlePriceFlag, function (errCode, errMsg, result) {
    		    		
    		layer.closeAll("loading");

    		var errorMessage = "";
            if (errCode > 0) {
                /*var messageArr = errMsg.split("#");
                for(var i=0; i < messageArr.length - 1; i++){
                    errorMessage = errorMessage + "【"+messageArr[i] + "】";
                }*/
                layer.alert(errMsg + "\n", {icon:2,area: ['360px'],});
            }
            if (errCode == 0) {
            	if(settlePriceFlag){
            		layer.alert("获取当前结算价成功", {icon:1});
            	}else {
            		layer.alert("获取当前收盘价成功", {icon:1});
            	}
            	
            	$scope.queryEntity = {};
                $scope.queryEntity.settleDate = clearConstant.formatDate(new Date());

            	//$scope.$apply();
            }
            $scope.find($scope.queryEntity);
    		
    	});
    	
    };
    
    
    //新增时获取表格数据
    $scope.getAddItems = function (settleDate){
    	$scope.queryAddEntitys = [];
    	$scope.isAdd = true;
    	$scope.ModalEntity = {};
    	$scope.ModalEntity.settleDate=settleDate;
    	$scope.ModalEntity.settlePrice = "";
        $scope.ModalEntity.lastSettlePrice = "";
        $scope.myAddForm.settlePrice.$setPristine();
        $scope.myAddForm.lastSettlePrice.$setPristine();
    	getAddItems(function(result){
    		if(result.length > 0){
    			$scope.isQuery = true;
        		$scope.queryAddEntitys = result;
        		$scope.queryAddEntitys[0].flag = 1;
        		//$scope.ModalEntity = angular.copy($scope.queryAddEntitys[0]);
            	$scope.isAdd = false;
            	//$scope.ModalEntity.settlePrice = "";
            	$scope.myAddForm.settlePrice.$setPristine();
                $scope.myAddForm.lastSettlePrice.$setPristine();
                $scope.ModalEntity=$scope.queryAddEntitys[0];
            	$scope.canClick =false;
            	getLastSettlePrice(function(lastPriceResult){
            		
            		if(lastPriceResult == 0){
            			$scope.ModalEntity.lastSettlePrice = 0;
            		}else{
            			$scope.ModalEntity.lastSettlePrice = lastPriceResult;
            		}
            		$scope.$apply();
            		$("#settlePrice").focus();
            	},$scope.queryAddEntitys[0].exchID,$scope.queryAddEntitys[0].productID,$scope.queryAddEntitys[0].instrumentID);
        		$timeout(function() {
                	$scope.isQuery = false;
                }, 1500);
    		}
    	},settleDate);
    };
    
    $scope.canClick =true;
    //新增时点击表格获取待输入值
    $scope.getqueryAddEntity = function(entity){
    	$scope.canClick =false;
    	$scope.ModalEntity = angular.copy(entity);
    	$scope.isAdd = false;
    	$scope.ModalEntity.settlePrice = "";
    	$scope.myAddForm.settlePrice.$setPristine();
        $scope.myAddForm.lastSettlePrice.$setPristine();
    	getLastSettlePrice(function(result){
    		if(result == 0){
    			$scope.ModalEntity.lastSettlePrice = 0;
    		}else{
    			$scope.ModalEntity.lastSettlePrice = result;
    		}
    		$scope.$apply();
    		$("#settlePrice").focus();
    	},entity.exchID,entity.productID,entity.instrumentID);
    };
  
    //定义产品基础信息的固定列头
    $scope.product_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "结算日期"},
        {title: "交易所代码"},
        {title: "品种代码"},
        {title: "合约代码"},
        {title: "结算价"},
        {title: "上一日结算价"},
        {title: "操作日期"},
        {title: "操作时间"},
        {title: "操作"}
    ]; 
    $("body").undelegate("#settlePrice_dynamic_table_wrapper td .update-row","click");
     $("body").delegate("#settlePrice_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.ModalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.initUpdateParam(id,$scope.ModalEntity);
    });
     $("body").undelegate("#settlePrice_dynamic_table_wrapper td .delete-row","click");
     $("body").delegate("#settlePrice_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.ModalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.remove(id,$scope.ModalEntity);
    })
 // 查询(前台分页)
    $scope.find = function(){
    	$scope.productDataset = [];
    	//更新表格对应的数据集
    	findSettlePriceEntity(function (result) {
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	var operate = "";
            	if($scope.settlePrice_update){
                	operate = operate.concat("<a class='update-row' data-toggle='modal' data-target='#settlePriceModal'>修改</a>");
            	}if($scope.settlePrice_delete){
                	operate = operate.concat( "<a class='delete-row' data-toggle='modal'>删除</a>");
            	}
                var tempArr = [(i+1),con[i].id,con[i].settleDate, con[i].exchID, con[i].productID,con[i].instrumentID,
                               con[i].settlePriceStr,con[i].lastSettlePriceStr,con[i].operateDate,con[i].operateTime,
                               operate];
	            $scope.productDataset.push(tempArr);
	            con[i].index = i+1;
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.productTable.clear().draw();
            $scope.productTable.rows.add($scope.productDataset).draw();
        },$scope.queryEntity);  	
    }
    
 // 初始化
    $timeout(function() {
    	  $scope.find($scope.queryEntity);
    }, 500);
 
    
  //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.productTable = $('#settlePrice_dynamic_table').DataTable( {
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

}]);
