myapp.controller('tradeController', ['$scope','$timeout','Upload','$rootScope' ,function ($scope,$timeout,Upload,$rootScope) {
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	$scope.InstrumentService = new com.quantdo.orgClear.service.InstrumentService();
	$scope.TradeService = new com.quantdo.orgClear.service.TradeService();

    $("[forType='date']").datepicker({
        language: 'zh-CN',
        weekStart: 1,
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        format: 'yyyymmdd'
    });

    $scope.ModalEntity = {};
    $scope.bulkModalEntity = {};
    $scope.addQueryEntity = {};
    //定义页面查询对象
    $scope.queryEntity = {
        exchangeId: "",//交易所
        productID: "",//产品
        instrumentId: ""//合约
    };
    
    // 按钮权限
    $scope.trade_query = isShow("trade_query");
    $scope.trade_add = isShow("trade_add");
    $scope.trade_update = isShow("trade_update");
    $scope.trade_delete = isShow("trade_delete");
    $scope.trade_addQuery = isShow("trade_addQuery");
    $scope.trade_export = isShow("trade_export");
    $scope.trade_upload = isShow("trade_upload");
    $scope.trade_addAuto = isShow("trade_addAuto");
    $scope.trade_bulkUpdate = isShow("trade_bulkUpdate");

	//当前交易日
	generateHisData(function(result) {
		$scope.tradingDate = result;
	});
    

    $scope.queryEntity.startDate = null;
    $scope.queryEntity.endDate = null;
    $scope.tradeTypes = clearConstant.tradeTypes;		//投保标志
    $scope.offsetFlag = clearConstant.offsetFlag;		//开平
    $scope.isNotDatas = clearConstant.isNotDatas;		//是否
    $scope.offsetFlagss = clearConstant.offsetFlagss;   //开平
    $scope.offsetFlagQuery = clearConstant.offsetFlagss;
    $scope.orderPriceTypes = clearConstant.orderPriceTypes;		//成交类型
    $scope.tradeSrcs = clearConstant.tradeSrcs;		//下单通道
    $scope.tradeSearchTypes = clearConstant.tradeSearchTypes;		//查询维度
    $scope.queryEntity.type = $scope.tradeSearchTypes[2].key;
    $scope.tradeAllocationStatus = clearConstant.tradeAllocationStatus; // 分配状态

    $scope.tradeUserLists = [];
    $scope.listEntitys = [];
    $scope.trade = {};
    $scope.visible = true;
    $scope.desc = false;
    $scope.isupdate = false;
    $scope.cacheIndex = 0;
    $scope.productExchDatas = [];
    $scope.tradeBulkDataset = [];
    //买卖方向
    $scope.tradeDirections = clearConstant.tradeDirection;
    $scope.instClientService = new com.quantdo.orgClear.service.instClientService();
    
    
    // 初始化机构记录
    $scope.instClientlists=[];
    $scope.instClientService.findByQuery(function (result) {
        $scope.instClientlists = result;
        $scope.$apply();
    },{amType:"2"});
    
    $scope.instClientlistsAll = [];
    $scope.instClientService.findByQuery(function (result) {
        $scope.instClientlistsAll = result;
        $scope.$apply();
    },{amType:""});
    
    $scope.instClient=null;
	getInstClient(function(result){
		$scope.instClient = result;
		if($scope.instClient!=null){
			$scope.isInstClient= true;
			$scope.ModalEntity.instClientID =  $scope.instClient.instClientID;
			$scope.addQueryEntity.instClientID =  $scope.instClient.instClientID;
		}else{
			$scope.isInstClient= false;
		}
	});
    
    //机构名称转换
    $scope.transInstClient = function (instClientID) {
    	for(var i = 0;i < $scope.instClientlistsAll.length; i++){
    		if($scope.instClientlistsAll[i].instClientID == instClientID){
    			return $scope.instClientlistsAll[i].instClientAbbrName;
    		}
    	}
    	
    	return "";
    }
/*    //初始化页面记录
    getAllTradeEntityBySubCap(function (result) {
    	if(result != null && result.length > 0){
    		$scope.listEntitys = result;
    		$scope.$apply();
    	}
    });*/
    
    //转换分配状态
    $scope.transTradeAllocationStatus = function(key){
    	for(var i = 0;i < $scope.tradeAllocationStatus.length;i++){
    		if($scope.tradeAllocationStatus[i].key == key){
    			return $scope.tradeAllocationStatus[i].text;
    		}
    	}
    	return "";
    }
    
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
    
    //初始化策略信息
    $scope.strategyService = new com.quantdo.orgClear.service.strategyService();
    $scope.strategys = [];
    $scope.strategyService.findByQuery(function (result) {
        $scope.strategys = result;
        $scope.$apply();
    }, {});
    
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

    //初始化交易类别
    $scope.productTypes = clearConstant.productTypes;
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
                productType:$scope.productType,
                productStatus: ''
        });
        /*if(exchID == "SHFE" || exchID == null){
      		$scope.offsetFlagQuery = clearConstant.offsetFlagss;	
   	   	}else {
   	   		$scope.offsetFlagQuery = clearConstant.offsetFlagssss;	
   	   	}*/
    };
    
    $scope.products = [];
    //根据产品类别初始化产品信息
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

/*    $scope.generId = function (productID, delivDate) {
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
//        findTradeBySubCap(queryEntity, function (result) {
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
            deleteTrade(trade.id, function (result) {
                //$scope.listEntitys.splice(index, 1);
                $scope.find($scope.queryEntity);
                $scope.$apply();
                layer.msg("删除成功！", {icon : 1,time : 2000});
                layer.close(count);
            });            
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
        $scope.myForm.userID.$setPristine();
        $scope.myForm.originTradeID.$setPristine();
        $scope.myForm.rateByHand.$setPristine();
        $scope.myForm.rateByAmount.$setPristine();
        $scope.myForm.reachByHand.$setPristine();
        $scope.myForm.reachByAmount.$setPristine();
        $scope.myForm.investorId.$setPristine();
        $scope.myForm.tradeingTime.$setPristine();
    }

    //初始化模态窗
    $scope.initParameter = function () {
        $scope.ModalEntity = {};
        $scope.ModalEntity.hedgeFlag = $scope.tradeTypes[0].key;
		$scope.ModalEntity.tradeDate = $scope.tradingDate;
        $scope.ModalEntity.tradeingDate = clearConstant.formatDate(new Date());
        $scope.ModalEntity.exchangeId = $scope.exchangeDatas[0].exchID;
        $scope.ModalEntity.isTrade = $scope.isNotDatas[1].key;
        /*if($scope.exchangeDatas[0].isDomestic == '1'){	//国内
        	$scope.isDomestic = true;
        }else{
        	$scope.isDomestic = false;
        }*/
        //$scope.ModalEntity.productType = $scope.productTypes[0].key;
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
    	        if($scope.activeTraders.length>0){
	  	        	 $scope.ModalEntity.investorId = $scope.activeTraders[0].traderID;
	  	        }
	  	        $scope.changeInvestorId($scope.ModalEntity.instClientID, $scope.ModalEntity.investorId);
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
        $scope.ModalEntity.tradeSrc = 2;
        //1.计算成交手续费
        formValidateReset();
    };

    //修改
    $scope.initUpdateParam = function (entity, index) {
    	findAllActiveTrader(function (result) {
	        $scope.activeTraders = result;
	        /*if($scope.activeTraders.length>0){
 	        	 $scope.ModalEntity.investorId = $scope.activeTraders[0].traderID;
 	        }*/
	        //$scope.ModalEntity.investorId = entity.investorId;
	        $scope.changeInvestorId($scope.ModalEntity.instClientID, $scope.ModalEntity.investorId)
  	        $scope.$apply();  
	        
	    },entity.instClientID);
        $scope.products = angular.copy($scope.productDatas);
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        $scope.ModalEntity.isTrade =$scope.isNotDatas[1].key;
        /*angular.forEach($scope.exchangeDatas,function(value,index,list){
    		if($scope.ModalEntity.exchangeId == value.exchID){
    			if(value.isDomestic == '0'){
    				$scope.isDomestic = false;
    			}else{
    				$scope.isDomestic = true;
    			}
    		}
    	});*/
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
     	   $("#tradeInsertModal").modal("show");
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
                //entity.tradeSrc = clearConstant.trade_src_2;
                $scope.saveTrade(entity,false);
            }
        }, {traderID: entity.investorId,instClientID : entity.instClientID});
    };

    // 保存操作记录
    $scope.saveTrade = function (entity,iscontinue) {
        var index = entity.recordIndex;
        if(entity.innerAccountID == ""){
        	entity.innerAccountID = null;
        }
        
        var feeList = new Array();
        addValue(feeList,entity.rateByAmount);
        addValue(feeList,entity.rateByHand);
        addValue(feeList,entity.reachByAmount);
        addValue(feeList,entity.reachByHand);

        if(entity.tradePrice=="" || entity.volume==""){
        	layer.msg("成交价格和成交数量不能为空!", {icon: 2, time: 3000});
        	return false;
        }
        if(entity.exchangeId == "SHFE" || entity.exchangeId == "CFFEX" || entity.exchangeId == "DCE" || entity.exchangeId == "CZCE"){
        	var patt = /^(\d)*$/g;
        	if(!patt.test(entity.originTradeID)){
        		layer.msg("当交易所为上期所、中金所、大商所、郑商所时，成交单号只能为数字！", {icon: 2, time: 3000});
            	return false;
        	}
        }else{
        	var patt = /^[^,\'\u0022]{1,64}$/g;
        	if(!patt.test(entity.originTradeID)){
        		layer.msg("成交单号不可为逗号、单引号、双引号！", {icon: 2, time: 3000});
            	return false;
        	}
        }
        entity.tradePriceStr = entity.tradePrice + "";
        //结算日期要>= 成交日期
        if(entity.tradeDate < entity.tradeingDate){
        	layer.confirm('结算日期小于成交日期,是否保存？', {icon: 3}, function (count) {
                layer.close(count);
                $scope.TradeService.checkInnerAccountID(entity,function(result){
                	if(result == true){
                		saveTradeEntity(entity,iscontinue,feeList);
                	}else{
                		layer.msg("该资产单元并没有绑定该父账户!", {icon: 2, time: 3000});
                    	return false;
                	}
                });
        	});
        }else{
        	$scope.TradeService.checkInnerAccountID(entity,function(result){
            	if(result == true){
            		saveTradeEntity(entity,iscontinue,feeList);
            	}else{
            		layer.msg("该资产单元并没有绑定该父账户!", {icon: 2, time: 3000});
                	return false;
            	}
            });
        }
    };
    
    function saveTradeEntity(entity,iscontinue,feeList){
    	var index = entity.recordIndex;
    	var tableIndex = entity.index;

    	//增加
        if (index == undefined) {
        	//外部的报单 
        	if (entity.isTrade == 1){
//        		if(!$scope.isDomestic){			// 国外交易所，买开，卖平
//        			if(entity.direction == '0'){
//        				entity.offsetFlag="0";
//        			}else{
//        				entity.offsetFlag="1";
//        			}
//        		}
        		
        		entity.orderPriceType="2";
        		addOutTrade(entity, function (result) {
	            	if(result == undefined){
	            		layer.msg("新增失败!", {icon: 2, time: 1500});
	            		return false;
	            	}
	                //$scope.listEntitys.unshift(result);
	                //$scope.find($scope.queryEntity);
	            	//$scope.showTradeResult(result);
	                $scope.$apply();
	                layer.msg("新增成功!", {icon: 1, time: 1500});
	                if(!iscontinue){
	                    //关闭窗口
	                    $("#tradeInsertModal").modal("hide");
	                }else{
	                	$scope.ModalEntity.tradePrice="";
	                	$scope.ModalEntity.volume="";
	                    $scope.myForm.tradePrice.$setPristine();
	                    $scope.myForm.volume.$setPristine();
	                    $scope.$apply();
	                }
	            });
        	}else {
        		//校验唯一
        		//checkSubCapTrade(function (result1) {
        		//	if (result1) {
                    //    layer.msg("已存在该成交单信息，不可重复新增", {icon: 2, time: 3000});
                     //   return false;
                   // }else{
                        addTrade(entity, feeList, function (resultTem) {
        	            	if(resultTem == undefined){
        	            		layer.msg("新增失败!", {icon: 2, time: 1500});
        	            		return false;
        	            	}
        	                //$scope.listEntitys.unshift(resultTem);
        	                $scope.$apply();
        	                layer.msg("新增成功!", {icon: 1, time: 1500});
        	                if(!iscontinue){
        	                    //关闭窗口
        	                    $("#tradeInsertModal").modal("hide");
        	                }else{
        	                	$scope.ModalEntity.tradePrice="";
        	                	$scope.ModalEntity.volume="";
        	                    $scope.myForm.tradePrice.$setPristine();
        	                    $scope.myForm.volume.$setPristine();
        	                    $scope.$apply();
        	                }
        	            });
                  //  }
        	   // },entity);
        	}
        	$timeout(function() {
        		$scope.find($scope.queryEntity);
        	}, 300);
            //修改
        } else {
            if ((entity.otFlag == undefined || entity.otFlag == 0)&& feeList.length!=4) {
                layer.msg("请输入计算手续费与上交手数", {icon: 2, time: 3000});
                return false;
            }
            updateTrade(entity, feeList, function (result) {
            	result.index = tableIndex;
            	result.tradePrice = result.tradePriceStr;
        		$scope.listEntitys.splice(tableIndex-1, 1, result);  
                $scope.productTable.cells().every( function () {
                    if((tableIndex-1) == this[0][0].row){
                        if(this[0][0].column == 12){
                            this.data($scope.transOffSetFlags(entity.offsetFlag));
                            $scope.$apply();
                        }
                        if(this[0][0].column == 13){
                            this.data($scope.transTradeTypes(entity.hedgeFlag));
                            $scope.$apply();
                        }
                        if(this[0][0].column == 14){
                            this.data(parseFloat(entity.tradePrice).toFixed(3));
                            $scope.$apply();
                        }
                        if(this[0][0].column == 15){
                            this.data(parseFloat(entity.volume).toFixed(0));
                            $scope.$apply();
                        }
                        if(this[0][0].column == 16){
                        	var tradeFee = $scope.formatStr(result.tradeFee);
                        	if(tradeFee == ""){
                        		tradeFee = "待结算";
                        	}
                            this.data(tradeFee);
                            $scope.$apply();
                        }
                        if(this[0][0].column == 18){
                            this.data(entity.userID);
                            $scope.$apply();
                        }
                        if(this[0][0].column == 19){
                            this.data(entity.tradeingDate);
                            $scope.$apply();
                        }
                        if(this[0][0].column == 20){
                            this.data(entity.tradeingTime);
                            $scope.$apply();
                        }
                    }

        		});
                if(!iscontinue){
                    //关闭窗口
                    $("#tradeInsertModal").modal("hide");
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
    	findEntityByTradIdAndInstClitId(function (result) {
            if (result.length != 1) {
                layer.msg("查询资产单元失败", {icon: 2, time: 3000});
                return false;
            }else{
                entity.subAccountId = result[0].subAccountID;
                //entity.tradeSrc = clearConstant.trade_src_2;
                $scope.saveTrade(entity,true);
            }
        }, {traderID: entity.investorId,instClientID : entity.instClientID});
    }; 
    
    //定义产品基础信息的固定列头
    $scope.product_columns = [
        {title:"<a class='click-choice-all'></a>"},
        {title: "序号"},
        {title: "id",visible:false},
        {title: "结算日期"},
        {title: "成交编号"},
        {title: "资产单元"},
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
    $("body").undelegate("#trade_dynamic_table_wrapper td .update-row","click");
    $("body").delegate("#trade_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
        var id = tempArr[2];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.ModalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.initUpdateParam($scope.ModalEntity,id);
    })
    $("body").undelegate("#trade_dynamic_table_wrapper td .delete-row","click");
    $("body").delegate("#trade_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
        var id = tempArr[2];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.ModalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.remove($scope.ModalEntity,id);
    })
    
    // 查询(前台分页)
    $scope.showResult = false;
    $scope.find = function(queryEntity){
    	/*if(queryEntity.endDate == undefined || queryEntity.endDate == ''){
     		queryEntity.endDate = " ";
     	}
        queryEntity.tradeDate = queryEntity.startDate+"#"+queryEntity.endDate;*/
    	 
    	queryEntity.startTradeingTime = $('#trade_startTradeingTime').val();
    	if(queryEntity.startTradeingTime == ""){
    		queryEntity.startTradeingTime = "00:00:00";
    	}else{
    		queryEntity.startTradeingTime += ":00"
    	}
    	queryEntity.endTradeingTime = $('#trade_endTradeingTime').val();
    	if(queryEntity.endTradeingTime == ""){
    		queryEntity.endTradeingTime = "23:59:59";
    	}else{
    		queryEntity.endTradeingTime += ":59"
    	}
    	 
        queryEntity.originTradeID==""?queryEntity.originTradeID=undefined:queryEntity.originTradeID;
        $scope.tmpQueryEntity = angular.copy($scope.queryEntity);
        var type = queryEntity.type;
        
        // clear
        $scope.listEntitys = [];
        $scope.isQuery = true;
        $scope.showResult = false;
    	//将数据集赋值为空
    	$scope.productDataset = [];
    	//多选清空
    	$scope.bulkTradeEntitys = [];
    	$(".dataTables_scrollHeadInner th a").removeClass("clicked-choice-all");
		$(".dataTables_scrollHeadInner th a").addClass("click-choice-all");
    	//更新表格对应的数据集
    	$scope.TradeService.findTradeByType(type,$scope.tmpQueryEntity,function (result) {
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
    		
            for(var i = 0; i<con.length;i++){
            	var operate = "";
            	if(con[i].tradeSrc !='3' && con[i].isOtcTrade && (type == $scope.tradeSearchTypes[0].key || type == $scope.tradeSearchTypes[3].key)){
	            	if($scope.trade_update){
	            		operate = operate.concat("<a class='update-row' data-toggle='modal'>修改</a>");
	            	}if($scope.trade_delete){
	            		operate = operate.concat( "<a class='delete-row' data-toggle='modal'>删除</a>");
	            	}
            	}
            	if(type == $scope.tradeSearchTypes[4].key){ 
            		operate = $scope.transTradeAllocationStatus(con[i].allocationStatus);
            	}
            	con[i].tradePrice = con[i].tradePriceStr;
            	
            	var check = "<a class='click-choice-one multiple-choice'>";
            	if(type == $scope.tradeSearchTypes[0].key && !con[i].isOtcTrade){
            		check = "<p></p>";
            	}
            	
                var tempArr = [check,(i+1),con[i].id,con[i].tradeDate, con[i].originTradeID,con[i].investorId,con[i].innerAccountID,con[i].exchangeId,$scope.transInstClient(con[i].instClientID),/*con[i].strategyID,con[i].strategyBatch,*/con[i].productID,con[i].instrumentId,$scope.transDirection(con[i].direction),$scope.transOffSetFlags(con[i].offsetFlag)
                               ,$scope.transTradeTypes(con[i].hedgeFlag),parseFloat(con[i].tradePrice).toFixed(3),parseFloat(con[i].volume).toFixed(0),transTradeFee(con[i].tradeFee),$scope.transTradeSrc(con[i].tradeSrc),con[i].userID,con[i].tradeingDate,con[i].tradeingTime
                               ,$scope.transErrorCode(con[i].errorCode),
                               $scope.formatMsg(con[i].errorCode)+" "+$scope.formatMsg(con[i].errorMsg),operate];
	            $scope.productDataset.push(tempArr);
	            con[i].index = i+1;
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.productTable.clear().draw();
            $scope.productTable.rows.add($scope.productDataset).draw();
            $scope.$apply();
            
            if(type == $scope.tradeSearchTypes[4].key){
    			$("#trade_dynamic_table_wrapper .DTFC_RightHeadWrapper thead th").html("状态");
    		}else{
    			$("#trade_dynamic_table_wrapper .DTFC_RightHeadWrapper thead th").html("操作");
    		}
        });  	
    }
    
    function transTradeFee(tradeFee){
    	if(tradeFee == null || tradeFee == undefined){
    		if($scope.queryEntity.type == $scope.tradeSearchTypes[0].key || $scope.queryEntity.type == $scope.tradeSearchTypes[3].key){
    			var result = "待结算";
    		}else{
    			var result = "";
    		}
    	}else{
    		var result = parseFloat(tradeFee).toFixed(2);
    	}
    	return result;
    }
     
     

     $scope.changeInvestorId = function(instClientID,subAccount){
     	//初始化交易员
     	 findAllActiveTradeUser(function (result) {
  	        $scope.tradeUserLists = result;
  	        if(result.length > 0){
  	        	$scope.ModalEntity.userID = result[0].userID;
  	        }else{
  	        	$scope.ModalEntity.userID = "";
  	        }
  	        $scope.$apply();
  	    },instClientID,subAccount); 
     	
     };
    
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
    		return "批量维护";
    	}else if(key=='2'){
    		return "手工录入";
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
    
    //定义资产单元成交单批量维护的固定列头
    $scope.tradeBulk_columns = [
        {title: "序号",visible:false},
        {title: "id",visible:false},
        {title: "机构代码"},
        {title: "所属机构"},
        {title: "成交日期"},
        {title: "成交时间"},
        {title: "成交编号"},
        {title: "资金账号"},
        {title: "资产单元"},
        {title: "交易所代码"},
        {title: "合约代码"},
        {title: "买卖方向"},
        {title: "开平标志"},
        {title: "投保标志"},
        {title: "成交数量"},
        {title: "成交价格"},
        {title: "交易员"},
        {title: "设置"}
    ]; 
    
    //定义资产单元成交单导入的固定列头
    $scope.tradeBulkUpload_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "机构代码"},
        {title: "所属机构"},
        {title: "成交日期"},
        {title: "成交时间"},
        {title: "成交编号"},
        {title: "资金账号"},
        {title: "资产单元"},
        {title: "交易所代码"},
        {title: "合约代码"},
        {title: "买卖方向"},
        {title: "开平标志"},
        {title: "投保标志"},
        {title: "成交数量"},
        {title: "成交价格"},
        {title: "交易员"}
    ]; 
    
    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.productTable = $('#trade_dynamic_table').DataTable( {
    		data : $scope.productDataset,
        	columns :$scope.product_columns,
        	//"aaSorting" : [[2, "asc"],[3, "asc"],[6, "asc"],[4, "asc"]],
//        	scrollY: 300,
//          scrollX: true,
        	//"aoColumnDefs": [ { "bSortable": false, "aTargets": [ 0 ] }],
        	ordering:false,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
			   
			]
        });
    	
    	//会话列表初始化
    	$scope.tradeBulkTable = $('#tradeBulk_dynamic_table').DataTable( {
    		data: $scope.tradeBulkDataset,
        	columns: $scope.tradeBulk_columns,
            dom: 'rt<"bottom"plB>',
            "paging": false,
            "info": false,
            scrollCollapse: true,
			buttons: [
			   
			]
        });
    	
    	//会话列表初始化
    	$scope.tradeBulkUploadTable = $('#tradeBulkUpload_dynamic_table').DataTable( {
    		data: $scope.tradeBulkUploadDataset,
        	columns: $scope.tradeBulkUpload_columns,
            dom: 'rt<"bottom"plB>',
            "paging": false,
            "info": false,
            scrollCollapse: true,
			buttons: [
			   
			]
        });
    	
    	$('#trade_startTradeingTime').clockTimePicker({});
    	$('#trade_endTradeingTime').clockTimePicker({});
    });
    
    /*$scope.isUpload = false; 
    $scope.initBulkParameter = function(){
    	$scope.isUpload = false; 
    	if($scope.isInstClient == false){
    		$scope.addQueryEntity.instClientID = null;
    	}else{
    		$scope.addQueryEntity.instClientID =  $scope.instClient.instClientID;
    	}
    	$scope.addQueryEntity.innerAccountID = null;
    	$scope.findBulkTrade();
    };*/
    
    /*$scope.findBulkTrade = function(){
        $scope.bulkListEntitys = [];
    	//更新表格对应的数据集
        $scope.TradeService.findBulkTrade($scope.addQueryEntity,function (result) {
        	$scope.tradeBulkDataset = [];
    		var con = result;
    		$scope.bulkListEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	con[i].tradePrice = con[i].tradePriceStr;
                var tempArr = [(i+1),con[i].id,con[i].instClientID,$scope.transInstClient(con[i].instClientID),con[i].tradeingDate,con[i].tradeingTime,
                    con[i].originTradeID,con[i].innerAccountID,con[i].investorId,con[i].exchangeId,con[i].instrumentId,
                    $scope.transDirection(con[i].direction),$scope.transOffSetFlags(con[i].offsetFlag),$scope.transTradeTypes(con[i].hedgeFlag),
                    parseFloat(con[i].volume).toFixed(0),con[i].tradePrice,con[i].userID];
	            $scope.tradeBulkDataset.push(tempArr);
	            con[i].index = i+1;
            }
            $scope.bulkListEntitys = con;
            //重新绘表
            $scope.tradeBulkTable.clear().draw();
            $scope.tradeBulkTable.rows.add($scope.tradeBulkDataset).draw();
            $timeout(function() {
            	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
            },200);
            
        });  
    };*/
    
    $scope.bulkTradeEntitys = [];
    $("body").undelegate("#trade_dynamic_table a.multiple-choice","click");
    $("body").delegate("#trade_dynamic_table a.multiple-choice","click",function(){
        if($(this).hasClass("click-choice-one")){
            $(this).removeClass("click-choice-one");
            $(this).addClass("clicked-choice-one");
            
            var mytr = $(this).parents("tr");
            var tempArr = $scope.productTable.row(mytr).data();
            var index = tempArr[1];
            for(var i = 0;i<$scope.listEntitys.length;i++){
            	if(index==$scope.listEntitys[i].index){
            		$scope.bulkTradeEntitys.push($scope.listEntitys[i]);
            		break;
            	}
            }
            
            if($scope.listEntitys.length == $scope.bulkTradeEntitys.length){
            	$(".dataTables_scrollHeadInner th a").addClass("clicked-choice-all");
                $(".dataTables_scrollHeadInner th a").removeClass("click-choice-all");
            }
            
        }
        else{
            $(this).addClass("click-choice-one");
            $(this).removeClass("clicked-choice-one");
            
            $(".dataTables_scrollHeadInner th a").addClass("click-choice-all");
            $(".dataTables_scrollHeadInner th a").removeClass("clicked-choice-all");
            
            var mytr = $(this).parents("tr");
            var tempArr = $scope.productTable.row(mytr).data();
            var ind = tempArr[1];
            for(var i = 0;i<$scope.listEntitys.length;i++){
            	if(ind==$scope.listEntitys[i].index){
            		var index = $scope.bulkTradeEntitys.indexOf($scope.listEntitys[i]);
            		if(index != -1){
            			$scope.bulkTradeEntitys.splice(index,1);
            		}
            		break;
            	}
            }
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
            
            $scope.bulkTradeEntitys = [];
            if($scope.queryEntity.type == $scope.tradeSearchTypes[0].key){
            	for(var i = 0;i<$scope.listEntitys.length;i++){
            		if($scope.listEntitys[i].isOtcTrade){
            			$scope.bulkTradeEntitys.push($scope.listEntitys[i]);
            		}
                }
            }else{
            	for(var i = 0;i<$scope.listEntitys.length;i++){
                	$scope.bulkTradeEntitys.push($scope.listEntitys[i]);
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
            
            $scope.bulkTradeEntitys = [];
        }

    });
    
    
    $('#trade_dynamic_table').on( 'page.dt', function () {
    	$timeout(function() {
    		if($(".dataTables_scrollHeadInner th a").hasClass("clicked-choice-all")){
        		for(var i=0;i<$(".dataTables_scrollBody td a").length;i++){
        			if($($(".dataTables_scrollBody td a")[i]).hasClass("click-choice-one")){
                        $($(".dataTables_scrollBody td a")[i]).removeClass("click-choice-one");
                        $($(".dataTables_scrollBody td a")[i]).addClass("clicked-choice-one");
                    }
                }
        	}else{
        		var aList = $(".dataTables_scrollBody tr td:nth-child(1) a");
        		for(var i=0;i<aList.length;i++){
        			if($(aList[i]).hasClass("click-choice-all")){
        				continue;
        			}
        			var mytr = $(aList[i]).parents("tr");
        	        var tempArr = $scope.productTable.row(mytr).data();
        	        var index = tempArr[1];
        	        for(var j = 0;j<$scope.listEntitys.length;j++){
	        	        if(index==$scope.listEntitys[j].index){
	        	        	if($scope.bulkTradeEntitys.indexOf($scope.listEntitys[j]) == -1){
	        	        		$(aList[i]).removeClass("clicked-choice-one");
	        	        		$(aList[i]).addClass("click-choice-one");
	        	        		break;
	        	        	}
	        	        }
	        		}
        	    }
        	}
        }, 100);
    })
    
    function bulkFormValidateReset() {
    	$scope.myBulkForm.subAccountID.$setPristine();
    	$scope.myBulkForm.userID.$setPristine();
    }
    
    $scope.bulkSubAccountIDs = [];
    $scope.bulkListEntitys = [];
    //批量维护
    $scope.initBulkParameter = function(){
    	$scope.bulkUpdate = false;
    	$scope.bulkModalEntity = {};
    	bulkFormValidateReset();
    	
    	if($scope.bulkTradeEntitys.length == 0){
    		layer.msg("未选中需要维护的成交单信息!", {icon: 2, time: 3000});
        	return false;
    	}else if($scope.bulkTradeEntitys.length == 1){ // 单个维护
    		$scope.isMultiple = false;
    		
    		$scope.tradeBulkDataset = [];
    		var con = angular.copy($scope.bulkTradeEntitys);
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	con[i].tradePrice = con[i].tradePriceStr;
                var tempArr = [(i+1),con[i].id,con[i].instClientID,$scope.transInstClient(con[i].instClientID),con[i].tradeDate,con[i].tradeingTime,
                    con[i].originTradeID,con[i].innerAccountID,con[i].subAccountId,con[i].exchangeId,con[i].instrumentId,
                    $scope.transDirection(con[i].direction),$scope.transOffSetFlags(con[i].offsetFlag),$scope.transTradeTypes(con[i].hedgeFlag),
                    parseFloat(con[i].volume).toFixed(0),con[i].tradePrice,con[i].userID,""];
	            $scope.tradeBulkDataset.push(tempArr);
	            con[i].index = i+1;
            }
            $scope.bulkListEntitys = con;
            //重新绘表
            $scope.tradeBulkTable.clear().draw();
            $scope.tradeBulkTable.rows.add($scope.tradeBulkDataset).draw();
            
            $scope.subBulkTradeList = [];
            $timeout(function(){
            	$("#tradeInsertBulkModal").modal("show");
            	$timeout(function(){
        			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
        			$scope.$apply();
        		},200);
            },1000);
    		
    		$scope.bulkSubAccountIDs = [];
    		// 查询资金账号对应的资产单元
    		$scope.TradeService.findByInnerAccountID($scope.bulkTradeEntitys[0].instClientID,$scope.bulkTradeEntitys[0].innerAccountID,function(result){
    			$scope.bulkSubAccountIDs = result;
    			$scope.$apply();
    		});
    		
    		$scope.allBulkTradeUserLists = [];
    		// 查询所有的交易员
    		findAllActiveTradeUser(function (result) {
      	        $scope.allBulkTradeUserLists = result;
      	        $scope.$apply();
      	    },$scope.bulkTradeEntitys[0].instClientID,null);
    		
    	}else{ // 多个批量维护
    		$scope.isMultiple = true;
        	
    		var innerAccountID = $scope.bulkTradeEntitys[0].innerAccountID;
        	for(var i=1;i<$scope.bulkTradeEntitys.length;i++){
        		if($scope.bulkTradeEntitys[i].innerAccountID != innerAccountID){
        			layer.msg("只能维护同一资金账号的成交单信息!", {icon: 2, time: 3000});
                	return false;
        		}
        	}
        	
    		$scope.bulkSubAccountIDs = [];
    		// 查询资金账号对应的资产单元
    		$scope.TradeService.findByInnerAccountID($scope.bulkTradeEntitys[0].instClientID,$scope.bulkTradeEntitys[0].innerAccountID,function(result){
    			$scope.bulkSubAccountIDs = result;
    			if(result.length > 0){
    				$scope.bulkModalEntity.subAccountID = result[0].subAccountID;
    				$scope.changeBulkSub($scope.bulkModalEntity.subAccountID);
    				$timeout(function(){
    					$("#tradeInsertBulkModal").modal("show");
    				},500);
    			}
    			
    			$scope.$apply();
    		});
    		
    	}
    	
    	// 重绘模态框位置
    	$('#tradeInsertBulkModal').on('show.bs.modal', function (e) {  
            $(this).find('.modal-dialog').css({
                'margin-left': function () {
                    var modalWidth = $('#tradeInsertBulkModal').find('.modal-content').width();
                    return ($(window).width() / 2 - modalWidth / 2);
                }
            });
        });
    }
    
    //批量修改
    $scope.initBulkUpdateParameter = function(){
    	bulkFormValidateReset()
    	
    	if($scope.bulkTradeEntitys.length == 0){
    		layer.msg("未选中需要修改的成交单信息!", {icon: 2, time: 3000});
        	return false;
    	}
    	
    	$scope.bulkUpdate = true;
    	$scope.isMultiple = true;
    	
    	for(var i=0;i<$scope.bulkTradeEntitys.length;i++){
    		if($scope.bulkTradeEntitys[i].innerAccountID == null || $scope.bulkTradeEntitys[i].innerAccountID == "" 
    			|| $scope.bulkTradeEntitys[i].innerAccountID == undefined){
    			layer.msg("不可选择资金账号为空的成交单进行修改", {icon: 2, time: 3000});
            	return false;
    		}
    	}
    	
		var innerAccountID = $scope.bulkTradeEntitys[0].innerAccountID;
    	for(var i=1;i<$scope.bulkTradeEntitys.length;i++){
    		if($scope.bulkTradeEntitys[i].innerAccountID != innerAccountID){
    			layer.msg("只能修改同一资金账号的成交单信息!", {icon: 2, time: 3000});
            	return false;
    		}
    	}
    	
    	var tradeIDList = [];
    	for(var i=0;i<$scope.bulkTradeEntitys.length;i++){
    		if(tradeIDList.indexOf($scope.bulkTradeEntitys[i].instClientID + "-" + $scope.bulkTradeEntitys[i].exchID 
    				+ "-" + $scope.bulkTradeEntitys[i].originTradeID + "-" + $scope.bulkTradeEntitys[i].direction) == -1){
    			tradeIDList.push($scope.bulkTradeEntitys[i].instClientID + "-" + $scope.bulkTradeEntitys[i].exchID 
    				+ "-" + $scope.bulkTradeEntitys[i].originTradeID + "-" + $scope.bulkTradeEntitys[i].direction);
    		}else{
    			layer.confirm("不能选择同一机构下交易所相同，成交编号相同，买卖方向相同的成交单进行批量修改!", {icon: 2,btn:['关闭']});
            	return false;
    		}
    	}
    	
    	$scope.bulkSubAccountIDs = [];
		// 查询资金账号对应的资产单元
		$scope.TradeService.findByInnerAccountID($scope.bulkTradeEntitys[0].instClientID,$scope.bulkTradeEntitys[0].innerAccountID,function(result){
			$scope.bulkSubAccountIDs = result;
			if(result.length > 0){
				$scope.bulkModalEntity.subAccountID = result[0].subAccountID;
				$scope.changeBulkSub($scope.bulkModalEntity.subAccountID);
			}
			
			$scope.$apply();
		});
		$("#tradeInsertBulkModal").modal("show");
		
		// 重绘模态框位置
    	$('#tradeInsertBulkModal').on('show.bs.modal', function (e) {  
            $(this).find('.modal-dialog').css({
                'margin-left': function () {
                    var modalWidth = $('#tradeInsertBulkModal').find('.modal-content').width();
                    return ($(window).width() / 2 - modalWidth / 2);
                }
            });
        });
    }
    
    $scope.changeBulkSub = function(subAccountID){
     	//初始化批量维护交易员
     	findAllActiveTradeUser(function (result) {
  	        $scope.bulkTradeUserLists = result;
  	        if(result.length > 0){
  	        	$scope.bulkModalEntity.userID = result[0].userID;
  	        }else{
  	        	$scope.bulkModalEntity.userID = "";
  	        }
  	        $scope.$apply();
  	    },$scope.bulkTradeEntitys[0].instClientID,subAccountID); 
    };
    
    $scope.addBulkTrade = function(){
    	// 数量input
    	var volume = "<input class='volume value-style' maxlength='8' style='margin:0;text-align:center;'>";
    	
    	// 开平标志input
    	if($scope.bulkTradeEntitys[0].exchangeId == 'SHFE' || $scope.bulkTradeEntitys[0].exchangeId == 'INE'){
    		var offsetFlag = "<select class='offsetFlag value-style'style='margin:0;text-align:center;'>" + 
    				"<option value=''></option>" +
    				"<option value='0'>开仓</option>" + "<option value='1'>平仓</option>" +
    				"<option value='3'>平今</option>" + "<option value='4'>平昨</option>" +
    				"</select>";
    	}else{
    		var offsetFlag = "<select class='offsetFlag value-style'style='margin:0;text-align:center;'>" +
    			"<option value=''></option>" + "<option value='0'>开仓</option>" + "<option value='1'>平仓</option>" +
				"</select>";
    	}
    	
    	// 资产单元input
    	var subAccountID = "<select class='subAccountID value-style'style='margin:0;text-align:center;'><option value=''></option>"
    	for(var i=0;i<$scope.bulkSubAccountIDs.length;i++){
    		subAccountID = subAccountID + "<option value='" + $scope.bulkSubAccountIDs[i].subAccountID + "'>" + 
    			$scope.bulkSubAccountIDs[i].instClientID + "_" + $scope.bulkSubAccountIDs[i].subAccountID + "_" + 
    			$scope.bulkSubAccountIDs[i].subAccountName + "</option>";
    	}
    	subAccountID = subAccountID + "</select>";
    	
    	// 交易员input
    	var userID = "<select class='userID value-style'style='margin:0;text-align:center;'><option value=''></option>"
        	for(var i=0;i<$scope.allBulkTradeUserLists.length;i++){
        		userID = userID + "<option value='" + $scope.allBulkTradeUserLists[i].userID + "'>" + 
        			$scope.allBulkTradeUserLists[i].userID + "_" + $scope.allBulkTradeUserLists[i].userName + "</option>";
        	}
    	userID = userID + "</select>";
    	
        // 删除input
    	var operate = "<a class='delete-row'>删除</a>";
    	
    	var tmp = [$scope.tradeBulkDataset.length+1,"","","","","","","",subAccountID,"","","",offsetFlag,"",volume,"",userID,operate];
        $scope.tradeBulkDataset.push(tmp);
        
        $scope.bulkListEntitys = $scope.tradeBulkDataset;
        //重新绘表
        $scope.tradeBulkTable.clear().draw();
        $scope.tradeBulkTable.rows.add($scope.tradeBulkDataset).draw();
        
        var sub = angular.copy($scope.bulkTradeEntitys[0]);
        sub.subAccountID = "";
        sub.investorId = "";
        sub.offsetFlag = "";
        sub.volume = "";
        sub.userID = "";
        $scope.subBulkTradeList.push(sub);
        
        for(var i=0; i<$scope.subBulkTradeList.length;i++){
        	$($(".subAccountID")[i]).val($scope.subBulkTradeList[i].subAccountID);
        	$($(".offsetFlag")[i]).val($scope.subBulkTradeList[i].offsetFlag);
        	$($(".volume")[i]).val($scope.subBulkTradeList[i].volume);
        	$($(".userID")[i]).val($scope.subBulkTradeList[i].userID);
        }
    }
    
    $("body").undelegate("#tradeBulk_dynamic_table td .subAccountID","change");
    //批量维护表格修改资产单元事件
    $("body").delegate("#tradeBulk_dynamic_table td .subAccountID","change",function(){
    	var mytr = $(this).parents("tr");
    	
        var tempArr = $scope.tradeBulkTable.row(mytr).data();
        var index = tempArr[0]-2;
        $scope.subBulkTradeList[index].subAccountID = $(this).val();
        $scope.subBulkTradeList[index].investorId = $(this).val();
        $scope.subBulkTradeList[index].userID = "";
        
        findAllActiveTradeUser(function (result) {
        	var userID = "<select class='userID value-style'style='margin:0;text-align:center;'></option>"
        	for(var i=0;i<result.length;i++){
        		userID = userID + "<option value='" + result[i].userID + "'>" + result[i].userID + "_" + result[i].userName + "</option>";
        	}
        	userID = userID + "</select>";
        	
        	var tmp = $scope.bulkListEntitys[index+1];
        	tmp[16] = userID;
        	$scope.bulkListEntitys[index+1] = tmp;
        	$scope.tradeBulkDataset = $scope.bulkListEntitys;
        	
        	if(result.length > 0){
        		$scope.subBulkTradeList[index].userID = result[0].userID;
        	}
        	
        	//重新绘表
            $scope.tradeBulkTable.clear().draw();
            $scope.tradeBulkTable.rows.add($scope.tradeBulkDataset).draw();
            
            for(var i=0; i<$scope.subBulkTradeList.length;i++){
            	$($(".subAccountID")[i]).val($scope.subBulkTradeList[i].subAccountID);
            	$($(".offsetFlag")[i]).val($scope.subBulkTradeList[i].offsetFlag);
            	$($(".volume")[i]).val($scope.subBulkTradeList[i].volume);
            	$($(".userID")[i]).val($scope.subBulkTradeList[i].userID);
            }
        	
  	    },$scope.bulkTradeEntitys[0].instClientID,$(this).val()); 
        
    });
    
    $("body").undelegate("#tradeBulk_dynamic_table td .offsetFlag","blur");
    //批量维护表格修改开平标志事件
    $("body").delegate("#tradeBulk_dynamic_table td .offsetFlag","blur",function(){
    	var mytr = $(this).parents("tr");
    	
        var tempArr = $scope.tradeBulkTable.row(mytr).data();
        var index = tempArr[0]-2;
        $scope.subBulkTradeList[index].offsetFlag = $(this).val();
        
    });
    
    $("body").undelegate("#tradeBulk_dynamic_table td .volume","blur");
    //批量维护表格修改数量事件
    $("body").delegate("#tradeBulk_dynamic_table td .volume","blur",function(){
    	var mytr = $(this).parents("tr");
    	
        var tempArr = $scope.tradeBulkTable.row(mytr).data();
        var index = tempArr[0]-2;
        $scope.subBulkTradeList[index].volume = $(this).val();
        
    });
    
    $("body").undelegate("#tradeBulk_dynamic_table td .userID","blur");
    //批量维护表格修改交易员事件
    $("body").delegate("#tradeBulk_dynamic_table td .userID","blur",function(){
    	var mytr = $(this).parents("tr");
    	
        var tempArr = $scope.tradeBulkTable.row(mytr).data();
        var index = tempArr[0]-2;
        $scope.subBulkTradeList[index].userID = $(this).val();
        
    });
    
    $("body").undelegate("#tradeBulk_dynamic_table_wrapper td .delete-row","click");
    //批量维护表格删除事件
    $("body").delegate("#tradeBulk_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.tradeBulkTable.row(mytr).data();
        var index = tempArr[0];
        $scope.bulkListEntitys.splice(index-1,1);
        $scope.subBulkTradeList.splice(index-2,1);
        //更新第一列的index值
        var tmpList = [];
        for(var i=0;i<$scope.bulkListEntitys.length;i++){
        	var tmp = angular.copy($scope.bulkListEntitys[i]);
        	tmp[0] = i+1;
        	tmpList.push(tmp);
        }
        $scope.bulkListEntitys = angular.copy(tmpList);     
        
        $scope.tradeBulkDataset = $scope.bulkListEntitys;
        //重新绘表
        $scope.tradeBulkTable.clear().draw();
        $scope.tradeBulkTable.rows.add($scope.tradeBulkDataset).draw();
        
        for(var i=0; i<$scope.subBulkTradeList.length;i++){
        	$($(".subAccountID")[i]).val($scope.subBulkTradeList[i].subAccountID);
        	$($(".offsetFlag")[i]).val($scope.subBulkTradeList[i].offsetFlag);
        	$($(".volume")[i]).val($scope.subBulkTradeList[i].volume);
        	$($(".userID")[i]).val($scope.subBulkTradeList[i].userID);
        }
    })
    
    $scope.saveTradeData = function(){
    	var saveEntitys = [];
    	if($scope.isMultiple){
    		if($scope.bulkModalEntity.subAccountID == null || $scope.bulkModalEntity.subAccountID == "" || $scope.bulkModalEntity.subAccountID == undefined){
    			layer.msg("资产单元不可为空!", {icon: 2, time: 3000});
            	return false;
    		}
    		if($scope.bulkModalEntity.userID == null || $scope.bulkModalEntity.userID == "" || $scope.bulkModalEntity.userID == undefined){
    			layer.msg("交易员不可为空!", {icon: 2, time: 3000});
            	return false;
    		}
    		for(var i=0;i<$scope.bulkTradeEntitys.length;i++){
    			$scope.bulkTradeEntitys[i].subAccountId = $scope.bulkModalEntity.subAccountID;
    			$scope.bulkTradeEntitys[i].investorId = $scope.bulkModalEntity.subAccountID;
    			if($scope.bulkModalEntity.userID == ""){
    				$scope.bulkTradeEntitys[i].userID = null;
    			}else{
    				$scope.bulkTradeEntitys[i].userID = $scope.bulkModalEntity.userID;
    			}
    			saveEntitys.push($scope.bulkTradeEntitys[i]);
    		}
    	}else{
    		var sumVolume = 0;
    		var subLists = [];
    		for(var i=0;i<$scope.subBulkTradeList.length;i++){
    			if($scope.subBulkTradeList[i].subAccountID == ""){
        			layer.msg("资产单元不可为空!", {icon: 2, time: 3000});
                	return false;
        		}
    			if($scope.subBulkTradeList[i].userID == ""){
        			layer.msg("交易员不可为空!", {icon: 2, time: 3000});
                	return false;
        		}
    			
    			if(subLists.indexOf($scope.subBulkTradeList[i].subAccountID) == -1){
    				subLists.push($scope.subBulkTradeList[i].subAccountID);
    			}else{
    				layer.msg("资产单元必须各不相同!", {icon: 2, time: 3000});
                	return false;
    			}
    			
    			if($scope.subBulkTradeList[i].offsetFlag == ""){
        			layer.msg("开平标志不可为空!", {icon: 2, time: 3000});
                	return false;
        		}
    			
    			if($scope.subBulkTradeList[i].volume == ""){
        			layer.msg("数量不可为空!", {icon: 2, time: 3000});
                	return false;
        		}else{
        			var reg = /^[1-9][0-9]{0,7}$/;
        			if(!reg.test($scope.subBulkTradeList[i].volume)){
        				layer.msg("数量必须为正整数!", {icon: 2, time: 3000});
                    	return false;
        			}else{
        				sumVolume = sumVolume + (+$scope.subBulkTradeList[i].volume);
        			}
        		}
    		}
    		
    		if(sumVolume != $scope.bulkTradeEntitys[0].volume){
    			layer.msg("子账户分配的成交单数量之和必须等于父账户成交单数量!", {icon: 2, time: 3000});
            	return false;
    		}
    		
    		saveEntitys = angular.copy($scope.subBulkTradeList);
    		
    		for(var i=0;i<saveEntitys.length;i++){
    			saveEntitys[i].subAccountId = saveEntitys[i].subAccountID;
    			saveEntitys[i].investorId = saveEntitys[i].subAccountID;
    			if(saveEntitys[i].userID == ""){
    				saveEntitys[i].userID = null;
    			}
    		}
    	}
    	
    	if($scope.bulkUpdate){//批量修改
    		$scope.TradeService.saveBulkUpdateData(saveEntitys,function(result){
    			if(result.flag == 1){
    				$("#tradeInsertBulkModal").modal("hide");
    	       		layer.msg("修改成功!", {icon: 1, time: 2000});
    	       		$scope.showTradeResult(result.value);
    			}else{
    				layer.confirm(result.errorMsg,{icon:2,btn:['关闭']});
    				return false;
    			}
    			
	       	});
    	}else{  //批量维护
    		$scope.TradeService.saveUploadData(saveEntitys,function(result){
    			$("#tradeInsertBulkModal").modal("hide");
	       		layer.msg("维护成功!", {icon: 1, time: 2000});
	       		$scope.showTradeResult(result);
	       	});
    	}
    }
    
    $scope.addTradeAuto = function(){
    	
    	layer.confirm('自动匹配只能对资金账户和资产单元是一对一关系的成交单进行自动匹配,是否继续？', {icon:3}, function(count){    		
    		layer.close(count);
    		$scope.TradeService.addTradeAuto(function(result){
	   	   		layer.msg("自动匹配成功!", {icon: 1, time: 2000});
	   	   		$scope.showTradeResult(result);
	   	   	});
    	});
    	
    }
    
    $scope.showTradeResult = function(result){
    	//多选清空
    	$scope.bulkTradeEntitys = [];
    	$(".dataTables_scrollHeadInner th a").removeClass("clicked-choice-all");
		$(".dataTables_scrollHeadInner th a").addClass("click-choice-all");
    	//更新表格对应的数据集
		$scope.showResult = true;
		var con = result;
		var tempArray = new Array();
		var tempArrayList = new Array();
		
        for(var i = 0; i<con.length;i++){
        	var operate = "";
        	con[i].tradePrice = con[i].tradePriceStr;
        	/*if(con[i].tradeFee == null || con[i].tradeFee == undefined){
        		if(type == $scope.tradeSearchTypes[0].key || type == $scope.tradeSearchTypes[3].key){
        			con[i].tradeFee = "待结算";
        		}else{
        			con[i].tradeFee = "";
        		}
        	}else{
        		con[i].tradeFee = parseFloat(con[i].tradeFee).toFixed(2);
        	}*/
            var tempArr = ["<a class='click-choice-one multiple-choice'>",(i+1),con[i].id,con[i].tradeDate, con[i].originTradeID,con[i].investorId,con[i].innerAccountID,con[i].exchangeId,$scope.transInstClient(con[i].instClientID),/*con[i].strategyID,con[i].strategyBatch,*/con[i].productID,con[i].instrumentId,$scope.transDirection(con[i].direction),$scope.transOffSetFlags(con[i].offsetFlag)
                           ,$scope.transTradeTypes(con[i].hedgeFlag),con[i].tradePrice,parseFloat(con[i].volume).toFixed(0),transTradeFee(con[i].tradeFee),$scope.transTradeSrc(con[i].tradeSrc),con[i].userID,con[i].tradeingDate,con[i].tradeingTime
                           ,$scope.transErrorCode(con[i].errorCode),
                           $scope.formatMsg(con[i].errorCode)+" "+$scope.formatMsg(con[i].errorMsg),operate];
            tempArrayList.push(tempArr);
            con[i].index = i+1;
        }

        //重新绘表
        $scope.productTable.clear().draw();
        $scope.productTable.rows.add(tempArrayList).draw();
        
		$("#trade_dynamic_table_wrapper .DTFC_RightHeadWrapper thead th").html("操作");
		$scope.$apply();

    }
    
    // 导出
    $scope.exportExcelBulkTrade = function () {
    	
    	$scope.queryEntity.startTradeingTime = $('#trade_startTradeingTime').val();
    	if($scope.queryEntity.startTradeingTime == ""){
    		$scope.queryEntity.startTradeingTime = "00:00:00";
    	}else{
    		$scope.queryEntity.startTradeingTime += ":00"
    	}
    	$scope.queryEntity.endTradeingTime = $('#trade_endTradeingTime').val();
    	if($scope.queryEntity.endTradeingTime == ""){
    		$scope.queryEntity.endTradeingTime = "23:59:59";
    	}else{
    		$scope.queryEntity.endTradeingTime += ":59"
    	}
    	 
    	$scope.queryEntity.originTradeID==""?$scope.queryEntity.originTradeID=undefined:$scope.queryEntity.originTradeID;
        
    	framework.file.export("资产单元成交单批量维护.xls",'excel',{
    		entityKey:['instClientID','instClientAbbrName','tradeingDate','tradeingTime','originTradeID','innerAccountID','investorId',
			           'exchangeId','instrumentId','direction','offsetFlag','hedgeFlag','volume','tradePrice','userID'],
			headerKey:['机构代码','所属机构','成交日期','成交时间','成交编号','资金账号','资产单元','交易所代码','合约代码','买卖方向','开平标志','投保标志','成交数量','成交价格','交易员'],
			styles:['plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText',
			        'plainText','plainText','plainText','plainText','plainText'],
			title:"资产单元成交单批量维护",
			dicMap:{direction:{'0':"买",'1':"卖"},offsetFlag:{'0':'开仓','1':'平仓','2':'强平','3':'平今','4':'平昨'}
				,hedgeFlag:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}}
		},"tradeService","exportExcelBulkTrade",$scope.queryEntity);
    };
    
    //导入
    $("#tradeFileuploader").uploadFile({
    	dragdropWidth: 125,
        uploadStr:"Excel导入",
        dragDropStr: "",
        showAbort: false,
        dragDropContainerClass:"",
        url: framework.file.uploadUrl("tradeService", "uploadExcel", [null]),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
                if(errCode != 0) {
                    layer.confirm(errMsg,{icon: 2, btn:['关闭']});
                } else {
                	if(result.errCode == 1){
                		layer.confirm(result.errMsg,{icon: 2, btn:['关闭']});
                	}else{
                		$scope.tradeBulkUploadDataset = [];
                		var con = result.data;
                		$scope.bulkUplaodListEntitys = result.data;
                		var tempArray = new Array();
                        for(var i = 0; i<con.length;i++){
                        	con[i].tradePrice = con[i].tradePriceStr;
                            var tempArr = [(i+1),con[i].id,con[i].instClientID,$scope.transInstClient(con[i].instClientID),con[i].tradeDate,con[i].tradeingTime,
                                con[i].originTradeID,con[i].innerAccountID,con[i].investorId,con[i].exchangeId,con[i].instrumentId,
                                $scope.transDirection(con[i].direction),$scope.transOffSetFlags(con[i].offsetFlag),$scope.transTradeTypes(con[i].hedgeFlag),
                                parseFloat(con[i].volume).toFixed(0),con[i].tradePrice,con[i].userID];
            	            $scope.tradeBulkUploadDataset.push(tempArr);
            	            con[i].index = i+1;
                        }
                        $scope.bulkUplaodListEntitys = con;
                        //重新绘表
                        $scope.tradeBulkUploadTable.clear().draw();
                        $scope.tradeBulkUploadTable.rows.add($scope.tradeBulkUploadDataset).draw();
                        
                        $("#tradeUploadModal").modal("hide");
                        $("#tradeUploadBulkModal").modal("show");
                        $timeout(function() {
                        	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
                        },200);
                        $scope.$apply();
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
    
    $scope.saveUploadData = function(){
    	$scope.TradeService.saveUploadData($scope.bulkUplaodListEntitys,function(result){
    		 $("#tradeUploadBulkModal").modal("hide");
    		 layer.msg("保存导入数据成功!", {icon: 1, time: 2000});
    		 $scope.find($scope.queryEntity);
    	});
    }
    
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
