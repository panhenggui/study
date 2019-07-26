myapp.controller('FSGetPriceController', ['$scope', '$timeout', 'Upload','$rootScope', function ($scope, $timeout, Upload,$rootScope) {
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
    
    $scope.fSGetPriceService = new com.quantdo.orgClear.service.fSGetPriceService();
    
    $scope.queryEntity = {};
    $scope.queryTimeEntity = {};
    $scope.queryEntity.settleDate = clearConstant.formatDate(new Date());
    $scope.Instruments={};
    $scope.listEntitys = [];
    
    // 按钮呢权限
    $scope.fSGetPrice_query = isShow("fSGetPrice_query");
    $scope.fSGetPrice_add = isShow("fSGetPrice_add");
    $scope.fSGetPrice_update = isShow("fSGetPrice_update");
    $scope.fSGetPrice_delete = isShow("fSGetPrice_delete");
    $scope.fSGetPrice_set = isShow("fSGetPrice_set");
    
    $scope.fSGetPriceService.getTime(function(result){
    	$scope.queryTimeEntity.hour = result.substring(0,2);
    	$scope.queryTimeEntity.minute = result.substring(2,4);
    	$scope.queryTimeEntity.second = result.substring(4,6);
    	$scope.$apply();
    });
    
    //初始化模态窗
    $scope.initSetTimeParameter = function () {
        $scope.addTimeEntity = {};
        $scope.addTimeEntity.hour = $scope.queryTimeEntity.hour;
        $scope.addTimeEntity.minute = $scope.queryTimeEntity.minute;
        $scope.addTimeEntity.second = $scope.queryTimeEntity.second;
        formValidateReset();
    };
    
    $scope.saveTime = function(entity){
    	if(entity.hour>23){
    		layer.msg("小时不可大于23,新增失败！", {icon: 2, time: 3000});
            return false;
    	}
    	if(entity.minute>59){
    		layer.msg("分钟不可大于59,新增失败！", {icon: 2, time: 3000});
            return false;
    	}
    	if(entity.second>59){
    		layer.msg("秒不可大于59,新增失败！", {icon: 2, time: 3000});
            return false;
    	}
    	var time = entity.hour+""+entity.minute+""+entity.second;
    	$scope.fSGetPriceService.setTime(function(result){
    		$scope.queryTimeEntity.hour = result.substring(0,2);
        	$scope.queryTimeEntity.minute = result.substring(2,4);
        	$scope.queryTimeEntity.second = result.substring(4,6);
        	$scope.$apply();
        	$("#fSGetPriceSetTimeModal").modal("hide");
        	layer.msg("新增成功", {icon: 1, time: 3000});
    	},time)
    };

    //初始化所有产品信息并默人选中第一项
    getAllProductEntity(function (result) {
        $scope.products = result;
        $scope.productsAll = result;
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
    
    // 查询(前台分页)
    $scope.find = function(){
    	$scope.fSGetPriceDataset = [];
    	//更新表格对应的数据集
    	$scope.fSGetPriceService.findByCondition(function (result) {
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	var operate = "";
            	if($scope.fSGetPrice_update){
                	operate = operate.concat("<a class='update-row' data-toggle='modal' data-target='#fSGetPriceModal'>修改</a>");
            	}if($scope.fSGetPrice_delete){
                	operate = operate.concat( "<a class='delete-row' data-toggle='modal'>删除</a>");
            	}
            	con[i].lastPrice = con[i].lastPriceStr;
                var tempArr = [(i+1),con[i].id,con[i].settleDate, con[i].exchID, con[i].productID,con[i].instrumentID,
                               con[i].lastPrice,operate];
	            $scope.fSGetPriceDataset.push(tempArr);
	            con[i].index = i+1;
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.fSGetPriceTable.clear().draw();
            $scope.fSGetPriceTable.rows.add($scope.fSGetPriceDataset).draw();
        },$scope.queryEntity);  	
    }
    
 // 初始化
    $timeout(function() {
    	  $scope.find($scope.queryEntity);
    }, 500);
    
    //初始化模态窗
    $scope.initParameter = function () {
    	$scope.canClick =true;
        $scope.ModalEntity = {};
        $scope.queryAddEntitys=[];
        $scope.ModalEntity.settleDate = clearConstant.formatDate(new Date());
        $scope.isShow = true;
        formValidateReset();
 
    };
    
    $("body").undelegate("#fSGetPrice_dynamic_table_wrapper td .update-row","click");
    $("body").delegate("#fSGetPrice_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.fSGetPriceTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.ModalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.initUpdateParam(id,$scope.ModalEntity);
    });
    
    $scope.ModalEntity = {};
    function formValidateReset() {
        $scope.myAddForm.lastPrice.$setPristine();
        $scope.myAddForm.exchID.$setPristine();
        $scope.myAddForm.productID.$setPristine();
        $scope.myAddForm.instrumentID.$setPristine();
    }
    
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
    
    $("body").undelegate("#fSGetPrice_dynamic_table_wrapper td .delete-row","click");
    $("body").delegate("#fSGetPrice_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.fSGetPriceTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.ModalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.remove(id,$scope.ModalEntity);
    })
    
    //删除
    $scope.remove = function (index, entity) {
    	layer.confirm('确定删除？', {icon: 3}, function (count) {
    		$scope.fSGetPriceService.remove(function(result){
    			if(result=='0'){
    				$scope.find();
            		layer.close(count);
    			}else{
    				layer.msg("删除失败！", {icon: 2, time: 3000});
    			}			
    		},entity.id);
    	});
    };

    // 保存操作记录
    $scope.save = function (entity) {
    	if(entity.settleDate == "" || entity.settleDate == undefined || entity.settleDate == null){
    		layer.msg("结算日期不能为空,新增失败", {icon: 2, time: 3000});
            return false;
    	}
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        entity.lastPriceStr = entity.lastPrice;
        //增加
        if (index == undefined) {
        	$scope.fSGetPriceService.findByCondition(function (result) {
                if (result.length > 0) {
                    layer.msg("不能对同一合约维护多条结算价", {icon: 2, time: 3000});
                    return false;
                } else {
                	$scope.fSGetPriceService.add(function (result) {
                    	//关闭窗口
                        $("#fSGetPriceModal").modal("hide");
                        layer.msg("新增成功", {icon: 1, time: 3000});
                        $scope.find();
                        $scope.listEntitys.push(result);
                        $scope.$digest();
                    }, entity);
                }
            }, entity);
            //修改
        } else {
        	$scope.fSGetPriceService.update(function (result) {     	
            	result.index = tableIndex;
        		$scope.listEntitys.splice(tableIndex-1, 1, result);  
                $scope.fSGetPriceTable.cells().every( function () {
                    if((tableIndex-1) == this[0][0].row){
                        if(this[0][0].column == 6){
                            this.data(result.lastPriceStr);
                            $scope.$apply();
                        }
                    }
                });
                $scope.$digest();
                //$scope.find();
                //关闭窗口
                $("#fSGetPriceModal").modal("hide");
                layer.msg("修改成功", {icon: 1, time: 3000});
            }, entity);
        }
    };


    $scope.continueSave = function (entity) {
    	entity.lastPriceStr = entity.lastPrice;
    	if(entity.settleDate == "" || entity.settleDate == undefined || entity.settleDate == null){
    		layer.msg("结算日期不能为空,继续新增失败", {icon: 2, time: 3000});
            return false;
    	}
        $timeout(function() {
        	$scope.getAddItems(entity.settleDate);
        }, 500);
        //判断当前增加的结算价是否已经存在
        $scope.fSGetPriceService.findByCondition(function (result) {
        	$scope.isQuery = false;
            if (result.length > 0) {
                layer.msg("不能对同一合约维护多条结算价", {icon: 2, time: 3000});
                return false;
            } else {
            	$scope.fSGetPriceService.add(function (result) {
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
        			        	$scope.ModalEntity.lastPrice = "";
        			        	$scope.myAddForm.lastPrice.$setPristine();
        				    } else{
        				    	$("#fSGetPriceModal").modal("hide");
        				    	layer.msg("继续新增成功", {icon: 1, time: 3000});
        				    }
        					$scope.find($scope.queryEntity);
        					$scope.$apply();
        				}
        			});
                }, entity);
            }
        }, entity);
    };
    
    //新增时获取表格数据
    $scope.getAddItems = function (settleDate){
    	$scope.isQuery = true;
    	$scope.queryAddEntitys = [];
    	$scope.isAdd = true;
    	$scope.ModalEntity = {};
    	$scope.ModalEntity.settleDate=settleDate;
    	$scope.ModalEntity.lastPrice = "";
        $scope.myAddForm.lastPrice.$setPristine();
        $scope.fSGetPriceService.getAddItems(function(result){
    		if(result.length > 0){
    			$scope.isQuery = true;
        		$scope.queryAddEntitys = result;
        		$scope.queryAddEntitys[0].flag = 1;
            	$scope.isAdd = false;
            	$scope.myAddForm.lastPrice.$setPristine();
                $scope.ModalEntity=$scope.queryAddEntitys[0];
            	$scope.canClick =false;
        		$timeout(function() {
                	$scope.isQuery = false;
                }, 1500);
    		}else{
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
    	$scope.ModalEntity.lastPrice = "";
    	$scope.myAddForm.lastPrice.$setPristine();
    };
  
    //定义产品基础信息的固定列头
    $scope.fSGetPrice_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "结算日期"},
        {title: "交易所代码"},
        {title: "品种代码"},
        {title: "合约代码"},
        {title: "结算价"},
        {title: "操作"}
    ]; 
      
    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.fSGetPriceTable = $('#fSGetPrice_dynamic_table').DataTable( {
    		data : $scope.fSGetPriceDataset,
        	columns :$scope.fSGetPrice_columns,
        	//scrollY: 300,
        	//scrollX: true,
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
