myapp.controller('exerciseTradeController', ['$scope','$timeout','Upload','$rootScope' ,function ($scope,$timeout,Upload,$rootScope) {
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	$scope.InstrumentService = new com.quantdo.orgClear.service.InstrumentService()
	
    $("[forType='date']").datepicker({
        language: 'zh-CN',
        weekStart: 1,
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        format: 'yyyymmdd'
    });

    $scope.ModalEntity = {};
    //定义页面查询对象
    $scope.queryEntity = {
        exchangeId: "",//交易所
        productID: "",//产品
        instrumentId: ""//合约
    };
    
    // 按钮权限
    $scope.exerciseTrade_query = isShow("exerciseTrade_query");
    $scope.exerciseTrade_add = isShow("exerciseTrade_add");
    $scope.exerciseTrade_update = isShow("exerciseTrade_update");
    $scope.exerciseTrade_delete = isShow("exerciseTrade_delete");

	//当前交易日
	generateHisData(function(result) {
		$scope.tradingDate = result;
	});
    

    $scope.queryEntity.startDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());
    $scope.isNotDatas = clearConstant.isNotDatas;		//开平
    $scope.orderPriceTypes = clearConstant.orderPriceTypes;		//成交类型

    $scope.listEntitys = [];
    $scope.trade = {};
    $scope.visible = true;
    $scope.desc = false;
    $scope.isupdate = false;
    $scope.cacheIndex = 0;
    $scope.productExchDatas = [];
    //买卖方向
    $scope.tradeDirections = clearConstant.tradeDirection;
    $scope.tradeTypes = clearConstant.tradeTypes;		//投保标志
    $scope.instClientService = new com.quantdo.orgClear.service.instClientService();
    
    
    // 初始化机构记录
    $scope.instClientlists=[];
    $scope.instClientService.findByQuery(function (result) {
        $scope.instClientlists = result;
        $scope.$apply();
    },{amType:"2"});
    
    
    $scope.instClient=null
	getInstClient(function(result){
		$scope.instClient = result;
		if($scope.instClient!=null){
			$scope.isInstClient= true;
			$scope.ModalEntity.instClientID =  $scope.instClient.instClientID;
		}else{
			$scope.isInstClient= false;
		}
	});
    
    //机构名称转换
    $scope.transInstClient = function (instClientID) {
    	for(var i = 0;i < $scope.instClientlists.length; i++){
    		if($scope.instClientlists[i].instClientID == instClientID){
    			return $scope.instClientlists[i].instClientAbbrName;
    		}
    	}
    }

    //转换投保
    $scope.transTradeTypes = function(key){
    	for(var i = 0;i < $scope.tradeTypes.length;i++){
    		if($scope.tradeTypes[i].key == key){
    			return $scope.tradeTypes[i].text;
    		}
    	}
    }

    
    //初始化交易所信息并默人选中第一个
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
        $scope.$apply();
    });
    //初始化所有产品信息并默人选中第一个
    getAllProductEntity(function (result) {
        $scope.productDatas = result;
        $scope.productExchDatas = result;
        $scope.$apply();
    });
    //根据交易所
    $scope.changeProductDatas = function(exchID){
    	$scope.productExchDatas = [];
    	var con = $scope.productDatas;
    	for(var i=0;i<con.length;i++){
    		 if(exchID==con[i].exchID){
    			 $scope.productExchDatas.push(con[i]);
    		 }
    	}
    }

    //初始化交易员信息

    $scope.traders = [];
    //初始化所有交易员信息
    getAllTraderEntity(function (result) {
        $scope.traders = result;
        $scope.$apply();
    });
    
    $scope.activeTraders = [];
    $scope.changeInstClient = function(instClientID){
    	 findAllActiveTrader(function (result) {
    	        $scope.activeTraders = result;
    	        $scope.$apply();
    	 },instClientID);
    };
    
    $scope.selectExchange = function (exchID) {
        getAllProductByConditionEntity(
            function (result) {
                if (result.length > 0) {
                    $scope.productDatas  = result;
                    $scope.$apply();
                }
            }, {
                exchID: exchID,
                productID: '',
                productType:'2',
                productStatus: ''
            });
    };
    
    $scope.products = [];
    //根据产品类别初始化产品信息
    $scope.selectProduct = function (exchID) {
    	$scope.products = [];

        findProductEntity(function (result) {
            $scope.products = result;
            $scope.$apply();
        }, {exchID: exchID, productStatus: "1"});
    };

    $scope.generId = function (productID) {
        productID = clearConstant.convertData(productID);
        $scope.ModalEntity.instrumentId = productID;
    };

    $scope.tmpQueryEntity = angular.copy($scope.queryEntity);

    // 删除
    $scope.remove = function (trade, index) {
        //使用内置Index
        layer.confirm('确定删除该期权行权信息吗？', {icon: 3}, function (count) {
        	deleteExerciseTrade(trade.id, function (result) {
                $scope.listEntitys.splice(index, 1);
                $scope.find($scope.queryEntity);
                $scope.$apply();
                layer.msg("删除成功！", {icon : 1,time : 2000});
                layer.close(count);
            });            
        });
    };

    function formValidateReset() {
    	$scope.myForm.instClientID.$setPristine();
        $scope.myForm.tradeDate.$setPristine();
        $scope.myForm.instrumentId.$setPristine();
        $scope.myForm.volume.$setPristine();
        $scope.myForm.exchangeId.$setPristine();
        $scope.myForm.productID.$setPristine();
        $scope.myForm.direction.$setPristine();
        $scope.myForm.rateByHand.$setPristine();
        $scope.myForm.rateByAmount.$setPristine();
        $scope.myForm.investorId.$setPristine();
    }

    //初始化模态窗
    $scope.initParameter = function () {
        $scope.ModalEntity = {};
		$scope.ModalEntity.tradeDate = $scope.tradingDate;
        $scope.ModalEntity.exchangeId = $scope.exchangeDatas[0].exchID;
        if($scope.exchangeDatas[0].isDomestic == '1'){	//国内
        	$scope.isDomestic = true;
        }else{
        	$scope.isDomestic = false;
        }
        if($scope.instClient!=null){
			$scope.isInstClient= true;
			$scope.ModalEntity.instClientID =  $scope.instClient.instClientID;
		}else{
			$scope.isInstClient= false;
	        $scope.ModalEntity.instClientID = $scope.instClientlists[0].instClientID;
		}
        
        if($scope.ModalEntity.instClientID !=undefined ){
        	findAllActiveTrader(function (result) {
    	        $scope.activeTraders = result;
    	        $scope.ModalEntity.investorId = $scope.activeTraders[0].traderID;
    	        $scope.$apply();
    	 },$scope.ModalEntity.instClientID);
        }
        
        $scope.selectProduct($scope.ModalEntity.exchangeId);
     
        $scope.ModalEntity.direction = $scope.tradeDirections[0].key;
        $scope.ModalEntity.hedgeFlag = $scope.tradeTypes[0].key;
//        $scope.ModalEntity.innerAccountID = $scope.Accounts[0].innerAccountID;
        $scope.isUpdate = false;
        $scope.ModalEntity.otFlag = 1;
        //1.计算成交手续费
        formValidateReset();
    };

    //修改
    $scope.initUpdateParam = function (entity, index) {
    	findAllActiveTrader(function (result) {
	        $scope.activeTraders = result;
	        $scope.$apply();
	    },entity.instClientID);
        $scope.products = angular.copy($scope.productDatas);
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        $scope.ModalEntity.isTrade =$scope.isNotDatas[1].key;
        angular.forEach($scope.exchangeDatas,function(value,index,list){
    		if($scope.ModalEntity.exchangeId == value.exchID){
    			if(value.isDomestic == '0'){
    				$scope.isDomestic = false;
    			}else{
    				$scope.isDomestic = true;
    			}
    		}
    	});
        $scope.isUpdate = true;
        formValidateReset();
        $timeout(function() {
     	   $("#exerciseTradeInsertModal").modal("show");
		}, 1000);
    };

    $scope.checkSubAccountId = function (entity) {
        //检查资产单元信息是否存在
        findEntityByTradIdAndInstClitId(function (result) {
            if (result.length != 1) {
                layer.msg("查询资产单元失败", {icon: 2, time: 3000});
                return false;
            }else{
                entity.subAccountId = result[0].subAccountID;
                $scope.saveTrade(entity,false);
            }
        }, {traderID: entity.investorId,instClientID : entity.instClientID});
    };

    // 保存操作记录
    $scope.saveTrade = function (entity,iscontinue) {
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        
        var feeList = new Array();
        
        addValue(feeList,entity.rateByAmount);
        addValue(feeList,entity.rateByHand);
        
        if( entity.volume==""){
        	layer.msg("行权数量不能为空!", {icon: 2, time: 3000});
        	return false;
        }

        //增加
        if (index == undefined) {

        	addExerciseTrade(entity, feeList, function (resultTem) {
            	if(resultTem == undefined){
            		layer.msg("新增失败!", {icon: 2, time: 1500});
            		return false;
            	}
                $scope.listEntitys.unshift(resultTem);
                $scope.$apply();
                layer.msg("新增成功!", {icon: 1, time: 1500});
                if(!iscontinue){
                    //关闭窗口
                    $("#exerciseTradeInsertModal").modal("hide");
                    $scope.find($scope.queryEntity);
                }
            });
            //修改
        } else {
            if ( feeList.length!=2) {
                layer.msg("请输入计算手续费与上交手数", {icon: 2, time: 3000});
                return false;
            }
            updateExerciseTrade(entity, feeList, function (result) {
            	result.index = tableIndex;
        		$scope.listEntitys.splice(tableIndex-1, 1, result);  
                $scope.productTable.cells().every( function () {
                    if((tableIndex-1) == this[0][0].row){

                        if(this[0][0].column == 12){
                            this.data(parseFloat(entity.volume).toFixed(0));
                            $scope.$apply();
                        }
                        if(this[0][0].column == 13){
                            this.data($scope.formatStr(result.brokerTradeFee));
                            $scope.$apply();
                        }
               
                    }

        		});
                if(!iscontinue){
                    //关闭窗口
                    $("#exerciseTradeInsertModal").modal("hide");
                }
            });
        }
    };

    $scope.UploadEntity = {};
    $scope.initUpload = function () {
        $scope.UploadEntity.uploadDate = clearConstant.formatDate(new Date());
    };

    function addValue(list,value)
    {
        list.push(value);
    }
    $scope.continueSaveTrade = function (entity) {
        //检查资产单元信息是否存在
    	findEntityByTradIdAndInstClitId(function (result) {
            if (result.length != 1) {
                layer.msg("查询资产单元失败", {icon: 2, time: 3000});
                return false;
            }else{
                entity.subAccountId = result[0].subAccountID;
                $scope.saveTrade(entity,true);
     
                entity.volume="";
                $scope.myForm.volume.$setPristine();
            }
        }, {traderID: entity.investorId,instClientID : entity.instClientID});
    }; 
    
    //定义产品基础信息的固定列头
    $scope.product_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "行权日期"},
        {title: "所属机构"},
        {title: "资产单元"},
        {title: "交易所代码"},   
        {title: "品种代码"},
        {title: "合约代码"},
        {title: "买卖方向"},
        {title: "投保标志"},
        {title: "行权数量"},
        {title: "手续费"},
        {title: "操作"}
    ]; 
    $("body").undelegate("#exercise_trade_dynamic_table_wrapper td .update-row","click");
     $("body").delegate("#exercise_trade_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.ModalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.initUpdateParam($scope.ModalEntity,id);
    })
    $("body").undelegate("#exercise_trade_dynamic_table_wrapper td .delete-row","click");
    $("body").delegate("#exercise_trade_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.ModalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.remove($scope.ModalEntity,id);
    })
 // 查询(前台分页)
    $scope.find = function(queryEntity){
    	 if(queryEntity.endDate == undefined || queryEntity.endDate == ''){
     		queryEntity.endDate = " ";
     	}
         queryEntity.tradeDate = queryEntity.startDate+"#"+queryEntity.endDate;
         $scope.tmpQueryEntity = angular.copy($scope.queryEntity);
         // clear
         $scope.listEntitys = [];
         $scope.isQuery = true;
    	//将数据集赋值为空
    	$scope.productDataset = [];
    	//更新表格对应的数据集
    	findExerciseTradeByCondition(queryEntity,function (result) {
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	var operate = "";
            	if( con[i].isOtcTrade){
            		if($scope.exerciseTrade_update){
    	        		operate = operate.concat("<a class='update-row' data-toggle='modal'>修改</a>");
    	        	}if($scope.exerciseTrade_delete){
    	        		operate = operate.concat( "<a class='delete-row' data-toggle='modal'>删除</a>");
    	        	}
            	}
                var tempArr = [(i+1),con[i].id,con[i].tradeDate,$scope.transInstClient(con[i].instClientID),con[i].investorId,con[i].exchangeId,
                                con[i].productID,con[i].instrumentId,$scope.transDirection(con[i].direction),$scope.transTradeTypes(con[i].hedgeFlag)
                               ,parseFloat(con[i].volume).toFixed(0),$scope.formatStr(con[i].tradeFee) ,operate];
	            $scope.productDataset.push(tempArr);
	            con[i].index = i+1;
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.productTable.clear().draw();
            $scope.productTable.rows.add($scope.productDataset).draw();
        });  	
    }
    
 // 初始化
    $timeout(function() {
    	  $scope.find($scope.queryEntity);
    }, 500);
 
    
  //转换买卖方向
    $scope.transDirection = function(key){
    	if(key=='0'){
    		return "买";
    	}else if(key=='1'){
    		return "卖";
    	}else{
    		return "";
    	}
    }
    $scope.formatStr = function(key){
    	var result = "";
    	if(key!=null&&key!=undefined){
    		result =  parseFloat(key).toFixed(2)
    	}
    	return result;
    }
  //转换投保
    $scope.transTradeTypes = function(key){
    	for(var i = 0;i < $scope.tradeTypes.length;i++){
    		if($scope.tradeTypes[i].key == key){
    			return $scope.tradeTypes[i].text;
    		}
    	}
    }


    
  //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.productTable = $('#exercise_trade_dynamic_table').DataTable( {
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

//回车事件
function tradeKeyup(e, o) {
	var appElement = document.querySelector('[ng-controller=tradeController]');
    var $scope = angular.element(appElement).scope();
    if (e.keyCode == 13) {
    	var tabNum = o.getAttribute("tab");
    	var tag =false;
//    	if(tabNum == 14 && ($scope.ModalEntity.otFlag == undefined || $scope.ModalEntity.otFlag == 0)){
//       	 	tag = getTradeTagByTab(19);
//    	}else{
    	  	tag = getTradeTagByTab(parseInt(tabNum) + 1);
//    	}
    	if (tag) {
    		tag.focus();
	        if (tag.tagName == "INPUT") {
	            tag.select();
	        }
	        return false;
    	}
    }
}

function getTradeTagByTab(t) {
  var spans = document.getElementsByTagName("span");
  for (var j = 0; j < spans.length; j++) {
      if (spans[j].getAttribute("tab") == t)
          return spans[j];
  }

  var inputs = $(":input");
  for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].getAttribute("tab") == t)
          return inputs[i];
  }
  return false;
}
