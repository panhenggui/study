myapp.controller('capTradeController', ['$scope','$timeout','Upload','$rootScope' ,function ($scope,$timeout,Upload,$rootScope) {
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

    $scope.ModalEntity = {};
    //定义页面查询对象
    $scope.queryEntity = {
        exchangeId: "",//交易所
        productID: "",//产品
        instrumentId: ""//合约
    };
    
    // 按钮权限
    $scope.capTrade_query = isShow("capTrade_query");
    $scope.capTrade_add = isShow("capTrade_add");
    $scope.capTrade_update = isShow("capTrade_update");
    $scope.capTrade_delete = isShow("capTrade_delete");

    $scope.queryEntity.startDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());
    $scope.tradeTypes = clearConstant.tradeTypes;		//投保标志
    $scope.offsetFlag = clearConstant.offsetFlag;		//开平
    $scope.isNotDatas = clearConstant.isNotDatas;		//开平
    
    $scope.offsetFlagss = clearConstant.offsetFlagss;
    $scope.orderPriceTypes = clearConstant.orderPriceTypes;		//开平
    
    
    

    $scope.listEntitys = [];
    $scope.trade = {};
    $scope.visible = true;
    $scope.desc = false;
    $scope.isupdate = false;
    $scope.cacheIndex = 0;
    $scope.instClientService = new com.quantdo.orgClear.service.instClientService();
    // 初始化机构记录
    $scope.instClientService.findByQuery(function (result) {
        $scope.instClientlists = result;
        $scope.$apply();
    },{});
    //机构名称转换
    $scope.transInstClient = function (instClientID) {
    	for(var i = 0;i < $scope.instClientlists.length; i++){
    		if($scope.instClientlists[i].instClientID == instClientID){
    			return $scope.instClientlists[i].instClientAbbrName;
    		}
    	}
    }
    
    $scope.selectExchange = function (exchID) {
        getAllProductByConditionEntity(
            function (result) {
                if (result.length > 0) {
                    $scope.productss  = result;
                    $scope.$apply();
                }
            }, {
                exchID: exchID,
                productID: '',
                productType:$scope.productType,
                productStatus: ''
            });
    };
    
    
    //买卖方向
    $scope.tradeDirections = clearConstant.tradeDirection;
/*    //初始化页面记录
    getAllTradeEntityByCap(function (result) {
    	if(result != null && result.length > 0){
    		$scope.listEntitys = result;
    		$scope.$apply();
    	}
    });
    */
    //转换投保
    $scope.transTradeTypes = function(key){
    	for(var i = 0;i < $scope.tradeTypes.length;i++){
    		if($scope.tradeTypes[i].key == key){
    			return $scope.tradeTypes[i].text;
    		}
    	}
    }

    //转换开平
    $scope.transOffSetFlags = function(key){
    	for(var i = 0;i < $scope.offsetFlag.length;i++){
    		if($scope.offsetFlag[i].key == key){
    			return $scope.offsetFlag[i].text;
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
        $scope.$apply();
    });

    //初始化资金账号
    $scope.Accounts = [];
    //初始化账户下拉列表
    getAllCapitalAccountEntity(function (result) {
        $scope.Accounts = result;
        $scope.$apply();
    });
    
    //当前交易日
	generateHisData(function(result) {
		$scope.tradingDate = result;
	});

    
    //初始化交易类别
    $scope.productTypes = clearConstant.productTypes;
    //初始化交易员信息
    
    //初始化策略信息
    $scope.strategyService = new com.quantdo.orgClear.service.strategyService();
    $scope.strategys = [];
    $scope.strategyService.findByQuery(function (result) {
        $scope.strategys = result;
        $scope.$apply();
    }, {});

    $scope.productss = [];
    findProductEntity(function (result) {
        $scope.productss = result;
        $scope.$apply();
    }, { productStatus: "1"});
    //根据产品类别初始化产品信息
    $scope.products = [];
    $scope.selectProduct = function (exchID, productType) {
//    	angular.forEach($scope.exchangeDatas,function(value,index,list){
//    		if(exchID == value.exchID){
//    			if(value.isDomestic == '0'){
//    				$scope.isDomestic = false;
//    				$scope.ModalEntity.offsetFlag = "";
//    			}else{
//    				$scope.isDomestic = true;
//    			}
//    		}
//    	});
    	if(exchID == "SHFE" || exchID == "INE"){
      		 $scope.offsetFlagss = clearConstant.offsetFlagss;	
   	   	}else {
   	   		$scope.offsetFlagss = clearConstant.offsetFlagssss;	
   	   	}
    	$scope.products = [];
    	//期权期货类型在产品中相同
    	/*var productT=productType;
    	if(productT =="2"){
    		productT="1";
    	}*/
        findProductEntity(function (result) {
            $scope.products = result;
            //$scope.ModalEntity.productID = $scope.products[0].productID;
            //$scope.generId($scope.ModalEntity.productID, $scope.ModalEntity.delivDate);
            $scope.$apply();
        }, {exchID: exchID, productType: productType, productStatus: "1"});
    };

    /*$scope.generId = function (productID, delivDate) {
        delivDate = clearConstant.convertData(delivDate);
        productID = clearConstant.convertData(productID);
        $scope.ModalEntity.instrumentId = productID + "" + delivDate;
    };*/

    $scope.tmpQueryEntity = angular.copy($scope.queryEntity);
//    // 查询
//    $scope.find = function (queryEntity) {
//    	if(queryEntity.endDate == undefined || queryEntity.endDate == ''){
//    		queryEntity.endDate = " ";
//    	}
//        queryEntity.tradeDate = queryEntity.startDate+"#"+queryEntity.endDate;
//        queryEntity.originTradeID==""?queryEntity.originTradeID=undefined:queryEntity.originTradeID;
//        $scope.tmpQueryEntity = angular.copy($scope.queryEntity);
//        // clear
//        $scope.listEntitys = [];
//        $scope.isQuery = true;
//        findTradeByCap(queryEntity, function (result) {
//        	if(result != null && result.length > 0){
//        		$scope.listEntitys = result;
//        	}
//            $timeout(function() {
//                $scope.isQuery = false;
//            }, 1500);
//        });
//    };
//    $scope.find ($scope.queryEntity);
    // 删除
    $scope.remove = function (trade, index) {
        //使用内置Index
        layer.confirm('确定删除该成交记录吗？', {icon: 3}, function (count) {
            deleteHisTrade(trade.id, function (result) {
                $scope.listEntitys.splice(index, 1);
                $scope.$apply();
                $scope.find($scope.queryEntity);
            });
            layer.close(count);
        });
    };

    function formValidateReset() {
    	$scope.myForm.instClientID.$setPristine();
    	$scope.myForm.offsetFlag.$setPristine();
        $scope.myForm.tradeDate.$setPristine();
        $scope.myForm.instrumentId.$setPristine();
        $scope.myForm.tradePrice.$setPristine();
        $scope.myForm.volume.$setPristine();
        $scope.myForm.exchangeId.$setPristine();
        $scope.myForm.productID.$setPristine();
        $scope.myForm.direction.$setPristine();
        //$scope.myForm.delivDate.$setPristine();
        $scope.myForm.originTradeID.$setPristine();
        $scope.myForm.rateByHand.$setPristine();
        $scope.myForm.rateByAmount.$setPristine();
        $scope.myForm.reachByHand.$setPristine();
        $scope.myForm.reachByAmount.$setPristine();
        $scope.myForm.investorId.$setPristine();
        $scope.myForm.tradeingTime.$setPristine();
        $scope.myForm.userID.$setPristine();
    }

    //初始化模态窗
    $scope.initParameter = function () {
        $scope.ModalEntity = {};
        $scope.ModalEntity.hedgeFlag = $scope.tradeTypes[0].key;
    	$scope.ModalEntity.tradeDate = $scope.tradingDate;
        $scope.ModalEntity.tradeingDate = clearConstant.formatDate(new Date());
        $scope.ModalEntity.exchangeId = $scope.exchangeDatas[0].exchID;
        $scope.ModalEntity.isTrade = $scope.isNotDatas[1].key;
        $scope.ModalEntity.rateByAmount = 0;
        $scope.ModalEntity.rateByHand = 0;
        $scope.ModalEntity.reachByAmount = 0;
        $scope.ModalEntity.reachByHand = 0;
        if($scope.exchangeDatas[0].isDomestic == '1'){	//国内
        	$scope.isDomestic = true;
        }else{
        	$scope.isDomestic = false;
        }
        //$scope.ModalEntity.productType = $scope.productTypes[0].key;
        if($scope.instClient!=null){
			$scope.isInstClient= true;
			$scope.ModalEntity.instClientID =  $scope.instClient.instClientID;
		}else{
			$scope.isInstClient= false;
	        $scope.ModalEntity.instClientID = $scope.instClientlists[0].instClientID;
		}

        if ($scope.ModalEntity.instClientID != undefined ){
        	findActiveCapByInstClientID(function (result) {
                $scope.activeAccounts = result;
                if(result.length > 0){
                	$scope.ModalEntity.investorId = $scope.activeAccounts[0].innerAccountID;
                	$scope.changeInvestorId($scope.ModalEntity.instClientID, $scope.ModalEntity.investorId);
                	$timeout(function(){
                		$("#capTradeModal").modal("show");
                	},500);
                }else{
                	$scope.ModalEntity.investorId = "";
                }
                $scope.$apply();
            },$scope.ModalEntity.instClientID);
        }
        
        $scope.selectProduct($scope.ModalEntity.exchangeId, $scope.ModalEntity.productType);
        $scope.ModalEntity.tradeingTime =clearConstant.currentTime();
        $scope.ModalEntity.direction = $scope.tradeDirections[0].key;
//        $scope.ModalEntity.innerAccountID = $scope.Accounts[0].innerAccountID;
        $scope.isUpdate = false;
        $scope.ischeck = false;
        $scope.ModalEntity.otFlag = 1;
        $scope.ModalEntity.originTradeID="00001";
        //1.计算成交手续费
        formValidateReset();
    };
    
    $scope.changeInvestorId = function(instClientID,innerAccountID){
     	//初始化交易员
     	findAllActiveTradeUser(function (result) {
  	        $scope.tradeUserLists = result;
  	        if(result.length > 0){
  	        	$scope.ModalEntity.userID = result[0].userID;
  	        }else{
  	        	$scope.ModalEntity.userID = "";
  	        }
  	        $scope.$apply();
  	    },instClientID,innerAccountID); 
     	
     };
    
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
    

    //修改
    $scope.initUpdateParam = function (entity, index) {
    	entity.isTrade = 0;
    	findActiveCapByInstClientID(function (result) {
            $scope.activeAccounts = result;
            $scope.changeInvestorId($scope.ModalEntity.instClientID, $scope.ModalEntity.investorId)
            //$scope.ModalEntity.investorId = $scope.activeAccounts[0].innerAccountID;
            $scope.$apply();
        },entity.instClientID);
        $scope.products = angular.copy($scope.productDatas);
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        $scope.changeInstClient($scope.ModalEntity.instClientID);
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
       //交割期 = 合约代码-产品代码
        //$scope.ModalEntity.delivDate = entity.instrumentId.substring($scope.ModalEntity.productID.length);
       //子资金账号 = 资金账号+交易员
//        $scope.ModalEntity.traderID = entity.subAccountId.substring(entity.innerAccountID.length,entity.subAccountId.length);
        findInstrumentEntity(function(resu){
        	//$scope.ModalEntity.productType = resu[0].productType;
        },{instrumentID:$scope.ModalEntity.instrumentId});
        /*angular.forEach($scope.productDatas, function (data, index, array) {
            if ($scope.ModalEntity.productID == data.productID) {
                $scope.ModalEntity.productType = data.productType;
            }
        });*/
        $scope.isUpdate = true;
//        $scope.ModalEntity.otFlag=0;
        formValidateReset();
        $timeout(function() {
        	   $("#capTradeModal").modal("show");
		}, 2000);
    };

    // 保存操作记录
    $scope.saveTrade = function (entity,iscontinue) {
        entity.tradeSrc = clearConstant.trade_src_2;
        entity.tradePriceStr = entity.tradePrice + "";
        var feeList = new Array();
        addValue(feeList,entity.rateByAmount);
        addValue(feeList,entity.rateByHand);
        addValue(feeList,entity.reachByAmount);
        addValue(feeList,entity.reachByHand);
        
        if(entity.tradePrice=="" || entity.volume==""){
        	layer.msg("成交价格和成交数量不能为空!", {icon: 2, time: 3000});
        	return false;
        }
        
        //结算日期要>= 成交日期
        if(entity.tradeDate < entity.tradeingDate){
        	layer.confirm('结算日期小于成交日期,是否保存？', {icon: 3}, function (count) {
        		layer.close(count);
        		saveTradeEntity(entity,iscontinue,feeList);
        	});
        }else{
        	saveTradeEntity(entity,iscontinue,feeList);
        }
    };
    
    function saveTradeEntity(entity,iscontinue,feeList){
    	var index = entity.recordIndex;
        var tableIndex = entity.index;
    	//增加
        if (index == undefined) {
        	//外部的报单 
        	if (entity.isTrade == 1){
//        		if(!$scope.isDomestic){
//        			entity.offsetFlag="0";
//        		}
        		entity.orderPriceType="2";
        		addOutCapTrade(entity, function (result) {
	            	if(result == undefined){
	            		layer.msg("新增失败!", {icon: 2, time: 1500});
	            		return false;
	            	}
	                $scope.listEntitys.unshift(result);
	                $scope.$apply();
	                layer.msg("新增成功!", {icon: 1, time: 1500});
	                if(!iscontinue){
	                    //关闭窗口
	                    $("#capTradeModal").modal("hide");
	                }
	                $scope.find($scope.queryEntity);
	            });
        	}else {
        		//校验唯一  放后台 ，js异步执行老报无法转换json对象
        		//checkCapTrade(function (result) {
        			//if (result) {
                     //   layer.msg("已存在该成交单信息，不可重复新增", {icon: 2, time: 3000});
                     //   return false;
                   // }else{
                       	addCapTrade(entity, feeList, function (resultTem) {
        	            	if(resultTem == undefined){
        	            		layer.msg("新增失败!", {icon: 2, time: 1500});
        	            		return false;
        	            	}
        	                $scope.listEntitys.unshift(resultTem);
        	                $scope.$apply();
        	                layer.msg("新增成功!", {icon: 1, time: 1500});
        	                if(!iscontinue){
        	                    //关闭窗口
        	                    $("#capTradeModal").modal("hide");
        	                }
        	                $scope.find($scope.queryEntity);
        	            });
                    //}
        	   // },entity);
        	}
            //修改
        } else {
            if ((entity.otFlag == undefined || entity.otFlag == 0)&& feeList.length!=4) {
                layer.msg("请输入计算手续费与上交手数", {icon: 2, time: 3000});
                return false;
            }
            updateHisTrade(entity, feeList, function (result) {
            	result.index = tableIndex;
            	result.tradePrice = result.tradePriceStr;
        		$scope.listEntitys.splice(tableIndex-1, 1, result);  
                $scope.productTable.cells().every( function () {
                    if((tableIndex-1) == this[0][0].row){
                        if(this[0][0].column == 10){
                            this.data($scope.transOffSetFlags(entity.offsetFlag));
                            $scope.$apply();
                        }
                        if(this[0][0].column == 11){
                            this.data($scope.transTradeTypes(entity.hedgeFlag));
                            $scope.$apply();
                        }
                        if(this[0][0].column == 12){
                            this.data(parseFloat(entity.tradePrice).toFixed(3));
                            $scope.$apply();
                        }
                        if(this[0][0].column == 13){
                            this.data(parseFloat(entity.volume).toFixed(0));
                            $scope.$apply();
                        }
                        if(this[0][0].column == 14){
                            this.data($scope.transTradeFee(result.brokerTradeFee));
                            $scope.$apply();
                        }
                        if(this[0][0].column == 16){
                            this.data(entity.userID);
                            $scope.$apply();
                        }
                        if(this[0][0].column == 17){
                            this.data(entity.tradeingDate);
                            $scope.$apply();
                        }
                        if(this[0][0].column == 18){
                            this.data(entity.tradeingTime);
                            $scope.$apply();
                        }
                    }

        		});
                if(!iscontinue){
                    //关闭窗口
                    $("#capTradeModal").modal("hide");
                }
                //$scope.find($scope.queryEntity);
            });
        }
    }

    $scope.UploadEntity = {};
    $scope.initUpload = function () {
        $scope.UploadEntity.uploadDate = clearConstant.formatDate(new Date());
    };
    /**
     * 导入成交文件
     */
    $("#fileuploader").uploadFile({
        url: framework.file.uploadUrl("importTradeService", "importFile"),
        fileName: "file", // 名字不能改
        onSelect: function (files) {
            var fileName = files[0].name;
            if (!fileName.endWith("csv")) {
                jqueryConst.showMsg(2002);
                return false;
            }
            var settleDate = $("#uploadDate").val();
            if (settleDate == "") {
                layer.msg("请选择文件导入日期", {icon: 2, time: 3000});
                return false;
            }
            framework.service.request('importTradeService', 'getDate', settleDate, function (errCode, errMsg, result) {
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
                    $("#uploadModal").modal("hide");
                    //按导入前条件查询
                    $scope.find($scope.tmpQueryEntity);
                    //导入前有查询条件修改，回到上次查询条件
                    $scope.queryEntity = angular.copy($scope.tmpQueryEntity);
                }
            });
        }
    });
    
    
    $scope.activeAccounts = [];
    $scope.changeInstClient = function(instClientID){
        $scope.activeAccounts = [];
        findActiveCapByInstClientID(function (result) {
            $scope.activeAccounts = result;
            $scope.$apply();
        },instClientID);
    };

    $scope.ischeck = false;
    //checkbox
    $scope.calcCharge = function (v) {
        $scope.ModalEntity.otFlag= v;
        if (v) {
            $scope.ischeck = false;
        } else {
            $scope.ischeck = true;
            $scope.ModalEntity.rateByAmount="";
            $scope.ModalEntity.rateByHand="";
            $scope.ModalEntity.reachByAmount="";
            $scope.ModalEntity.reachByHand="";
        }
    };

    function addValue(list,value)
    {
        list.push(value);
    }

    $scope.changeDate = function(date){
        $scope.ModalEntity.tradeingDate = date;
    };

    $scope.continueSaveTrade = function (entity) {
        //检查资产单元信息是否存在
        entity.tradeSrc = clearConstant.trade_src_2;
        $scope.saveTrade(entity,true);
        entity.tradePrice="";
        entity.volume="";
        $scope.myForm.tradePrice.$setPristine();
        $scope.myForm.volume.$setPristine();
    }; 
    
  //定义产品基础信息的固定列头
    $scope.product_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "结算日期"},
        {title: "成交编号"},
        {title: "资金账号"},
        {title: "交易所代码"},
        {title: "所属机构"},
        /*{title: "策略代码"},
        {title: "策略批次"},*/
        {title: "品种代码"},
        {title: "合约代码"},
        {title: "买卖方向"},
        {title: "开平标志"},
        {title: "投保标志"},
        {title: "成交价格"},
        {title: "成交数量"},
        {title: "交易手续费"},
        {title: "下单通道"},
        {title: "交易员"},
        {title: "成交日期"},
        {title: "成交时间"},
        {title: "录入成功标识"},
        {title: "录入结果信息"},
        {title: "操作"}
    ]; 
    $("body").undelegate("#capTrade_dynamic_table_wrapper td .update-row","click");
     $("body").delegate("#capTrade_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.ModalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.initUpdateParam($scope.ModalEntity,id);
    });
     $("body").undelegate("#capTrade_dynamic_table_wrapper td .delete-row","click");
     $("body").delegate("#capTrade_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.ModalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.remove($scope.ModalEntity,id);
    });
 // 查询(前台分页)
    $scope.find = function(queryEntity){
    	 if(queryEntity.endDate == undefined || queryEntity.endDate == ''){
     		queryEntity.endDate = " ";
     	}
         queryEntity.tradeDate = queryEntity.startDate+"#"+queryEntity.endDate;
         queryEntity.originTradeID==""?queryEntity.originTradeID=undefined:queryEntity.originTradeID;
         $scope.tmpQueryEntity = angular.copy($scope.queryEntity);
         // clear
         $scope.listEntitys = [];
         $scope.isQuery = true;
    	//将数据集赋值为空
    	$scope.productDataset = [];
    	//更新表格对应的数据集
    	findTradeByCap(queryEntity,function (result) {
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	var operate = "";
            	if(con[i].tradeSrc=='2' && con[i].isOtcTrade){
            		if($scope.capTrade_update){
            			operate = operate.concat("<a class='update-row' data-toggle='modal'>修改</a>");
            		}if($scope.capTrade_delete){
            			operate = operate.concat( "<a class='delete-row' data-toggle='modal'>删除</a>");
            		}
            	}
            	con[i].tradePrice = con[i].tradePriceStr;
                var tempArr = [(i+1),con[i].id,con[i].tradeDate, con[i].originTradeID, con[i].investorId,con[i].exchangeId, $scope.transInstClient(con[i].instClientID)/*,con[i].strategyID,con[i].strategyBatch*/,con[i].productID,con[i].instrumentId,$scope.transDirection(con[i].direction),$scope.transOffSetFlags(con[i].offsetFlag)
                               ,$scope.transTradeTypes(con[i].hedgeFlag),parseFloat(con[i].tradePrice).toFixed(3),parseFloat(con[i].volume).toFixed(0),$scope.transTradeFee(con[i].tradeFee),$scope.transTradeSrc(con[i].tradeSrc),con[i].userID,con[i].tradeingDate,con[i].tradeingTime,$scope.transErrorCode(con[i].errorCode),
                               $scope.formatMsg(con[i].errorCode)+" "+$scope.formatMsg(con[i].errorMsg),operate];
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
    
    $scope.formatMsg = function(key){
    	var result = "";
    	if(key!=null&&key!=undefined){
    		result =  key;
    	}
    	return result;
    }
    
    $scope.transTradeSrc = function(key){
    	if(key=='1'){
    		return "批量导入";
    	}else if(key=='2'){
    		return "手工录入";
    	}else{
    		return "";
    	}
    }
    
    $scope.transTradeFee = function(key){
    	var result = "";
    	if(key!=null&&key!=undefined){
    		result =  parseFloat(key).toFixed(2);
    	}
    	return result;
    }
    
    $scope.transErrorCode = function(key){
    	if(key==undefined){
    		return "";
    	}else if(key=='0'){
    		return "成功";
    	}else if(key=='99'){
    		return "待交易处理";
    	}else if(key !='0' && key !='99'){
    		return "失败";
    	}
    }
    
  //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.productTable = $('#capTrade_dynamic_table').DataTable( {
    		data : $scope.productDataset,
        	columns :$scope.product_columns,
        	"aaSorting" : [[2, "asc"],[3, "asc"],[6, "asc"],[4, "asc"]],
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
