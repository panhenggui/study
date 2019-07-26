myapp.controller('SubMoneyIOController', function ($scope, $rootScope,$timeout) {
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	//1、实例化服务接口
	//1.1、 实例化出入金服务接口
	$scope.service = new com.quantdo.orgClear.service.SubMoneyIOService();
	//1.2、 实例化内部资金服务接口
	$scope.capitalAccountService = new com.quantdo.orgClear.service.CapitalAccountService();
    $scope.subCapitalAccountService = new com.quantdo.orgClear.service.SubCapitalAccountService();
    $scope.dataToTradeService = new com.quantdo.orgClear.service.dataToTradeService();
	$scope.SubMoneyIODataset = [];
	
	// 按钮权限
	$scope.subMoneyIO_query = isShow("subMoneyIO_query");
	$scope.subMoneyIO_inAdd = isShow("subMoneyIO_inAdd");
	$scope.subMoneyIO_outAdd = isShow("subMoneyIO_outAdd");
	
	$scope.exchangeDatas = [];
	
	$scope.dataToTradeService.getCurrDate(function(result) {
		$scope.currDate = result;
	});

    //初始化交易所信息并默人选中第一个
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
        $scope.$apply();
    });
	
	//定义固定列头
    $scope.SubMoneyIO_columns = [     
        {title: "序号"},
        {title: "结算日期"},
        {title: "资产单元"},
        {title: "出金"},
        {title: "入金"},
        {title: "币种"},
        {title: "类型"},
        {title: "期货合约"},
        {title: "备注"},
        {title: "操作员"},
        {title: "操作日期"},
        {title: "操作时间"}
	]
   //初始化查询选项
    $scope.types = [
        {text: '出入金', key: '1'},
        {text: '手续费调整', key: '2'}
    ];
    
	//初始化查询选项
    $scope.isRecheckDatas = [
        {text: '未复核', key: '0'},
        {text: '复核', key: '1'}
    ];
    
	//2、定义页面数据模型
    $scope.queryEntity = {
    		   "isRecheck":""
    };
    $scope.tempEntity={};
    $scope.modalEntity = {};
    $scope.listEntitys = []; 
    $scope.modalAvailable = 0;
    $scope.currencyEntity = clearConstant.currenys;
    //2.1、是否
    $scope.isNotDatas = clearConstant.isNotDatas;
    //2.2、 银行代码
    $scope.bankIDDatas = clearConstant.bankIDDatas;
    
    $scope.queryEntity.startDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());
    
    //子资金账号
    $scope.QuerySubAccounts = {};

    $scope.subCapitalAccountService.findAllByIsActive(function (result) {
        $scope.QuerySubAccounts = result;
        $scope.$apply();
    },{});
    
    
//    getAllBackAccountEntity(function (result) {
//        $scope.bankAccounts = result;
//    });

    //根据资金账户查询子资金
    $scope.selectSubAccountID = function (innerAccountID) {
    	$scope.modalEntity.availMoney = 0;
    	if($scope.modalEntity.operType==1)
    	{
        	getAccountCapitalByInnerAccountIDEntity(innerAccountID, function (result) {
        		$scope.tmpAccountCapitals = result;
        		if ($scope.tmpAccountCapitals.length > 0)
        		{
        			$scope.modalEntity.availMoney = $scope.tmpAccountCapitals[$scope.tmpAccountCapitals.length - 1].availMoney;
        			$scope.$apply();
        		}
            });
    	}

    	$scope.modalEntity.subAccountID = {};
    	findSubCapitalEntity(function (result) {
            $scope.SubAccounts = result;
            if ($scope.SubAccounts.length > 0)
            {
                $scope.modalEntity.subAccountID = $scope.SubAccounts[0].subAccountID;
                $scope.selectFinalInterest($scope.SubAccounts[0].subAccountID);
                $scope.modalEntity.currency = $scope.SubAccounts[0].currency;
            }
            $scope.$apply();
        }, {isActive:"1"});
    };
    
    $scope.getSubAccountCurrency = function(subAccountID){
    	findSubCapitalEntity(function(result){
    		if(result != null && result.length > 0){
    			$scope.modalEntity.currency = result[0].currency;
    			$scope.$apply();
    		}
    	},{
    		subAccountID : subAccountID,isActive:"1"
    	});
    }
    
    //查询权益
    $scope.selectFinalInterest = function (subAccountID) {
    	if($scope.modalEntity.operType==1)
    	{
    		return false;
    	}
    	$scope.modalEntity.finalInterest = 0;
    	getSubAccountCapitalBysubAccountIDEntity(subAccountID, function (result) {
    		$scope.tmpSubAccountCapitals = result;
    		if ($scope.tmpSubAccountCapitals.length > 0)
    		{
    			$scope.modalEntity.finalInterest = $scope.tmpSubAccountCapitals[$scope.tmpSubAccountCapitals.length - 1].finalInterest;
    			$scope.$apply();
    		}
        });

    };
    
    $scope.transCurrency = function (key){
    	for(var i = 0 ; i < $scope.currencyEntity.length;i++){
    		if($scope.currencyEntity[i].key == key){
    			return $scope.currencyEntity[i].text;
    		}
    	}
    }
    
    $scope.transType = function (key){
    	for(var i = 0 ; i < $scope.types.length;i++){
    		if($scope.types[i].key == key){
    			return $scope.types[i].text;
    		}
    	}
    }
    
    //3、定义方法
    //3.1、查询出入金
/*    $scope.find = function (queryEntity) {
        $scope.listEntitys = [];      
        $scope.isQuery = true;
        $scope.service.findByCondition(queryEntity,function (result) {
            $scope.listEntitys = result;
            $timeout(function() {
            	$scope.isQuery = false;
            	$scope.$apply();
              }, 1500);
        });
    };*/

    // 根据页面条件查询
    $scope.find = function () {  	
    	$scope.isQuery = true;
		$scope.SubMoneyIODataset = [];
		$scope.listEntitys = [];
		$scope.service.findByCondition($scope.queryEntity,function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;

			for(var i = 0; i<con.length;i++){
				if(con[i].instrumentID == null){
					var instrumentID = "";
				}else{
					var instrumentID = con[i].exchID+"_"+con[i].instrumentID;
				}
		    	var tempArr = [(i+1),con[i].settleDate,con[i].subAccountID,con[i].moneyOut,con[i].moneyIn,$scope.transCurrency(con[i].currency),
		    		$scope.transType(con[i].type),instrumentID,con[i].remark,con[i].operatorID,con[i].operateDate,con[i].operateTime]
		    	$scope.SubMoneyIODataset.push(tempArr); 
			}
			//重新绘表
	        $scope.SubMoneyIOTable.clear().draw();
	        $scope.SubMoneyIOTable.rows.add($scope.SubMoneyIODataset).draw();
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		});
		
		
    };
    $timeout(function() {
    	$scope.find(); 
     }, 500);
    
    
    
    
    //3.2、保存出入金
    $scope.save = function (entity) { 
    	if(entity.instrumentID != undefined && entity.instrumentID != null && entity.instrumentID != "" && 
    		(entity.exchID == undefined || entity.exchID == null || entity.exchID == "")){
    		layer.msg("若已填写期货合约交易所不可为空！",{icon: 2});
    		return false;
    	}
    	if(entity.exchID != undefined && entity.exchID != null && entity.exchID != "" && 
        	(entity.instrumentID == undefined || entity.instrumentID == null || entity.instrumentID == "")){
        	layer.msg("若已填写交易所期货合约不可为空！",{icon: 2});
        	return false;
        }
        if(entity.instrumentID != undefined && entity.instrumentID != null && entity.instrumentID != ""){
        	$scope.service.checkInstrumentID(entity.exchID,entity.instrumentID,function(result){
        		if(result.length == 0){
        			layer.msg("该期货合约不存在！",{icon: 2});
        			return false;
        		}else{
        			checkDate(entity);
        		}
        	});
        }else{
        	checkDate(entity);
        }    
    };  
    
    function checkDate(entity){
    	if(entity.settleDate < $scope.currDate){
    		layer.msg("不可选择当前交易日之前的日期进行出入金！",{icon: 2});
			return false;
    	}
    	$scope.service.checkDate(entity.settleDate,function(result){
    		if(result == 0){
    			layer.msg("该日期不为交易日！",{icon: 2});
    			return false;
    		}else{
    			save(entity);
    		}
    	});
    }
    
    function save(entity){
    	var index = entity.recordIndex;
    	getOperInvestorAccountAvailable(function (result){
        	if(result.length > 0){
        		$scope.modalAvailable = result[0].available;
        	}else{
        		$scope.modalAvailable = 0;
        	}
        	findSubCapitalEntity(function (subResult){
        		if($scope.modalEntity.operType==1 && subResult.length < 1){
        			layer.msg("该资产单元已注销，入金失败",{icon: 2});
                	return false;
        		}else if($scope.modalEntity.operType==1 && $scope.modalEntity.moneyIn <= 0){
                	layer.msg("入金金额必须大于0",{icon: 2});
                	return false;
                }else if($scope.modalEntity.operType==2 && $scope.modalEntity.moneyOut <= 0){
                	layer.msg("出金金额必须大于0",{icon: 2});
                	return false;
                }
                else if($scope.modalEntity.operType==2 && (result.length < 1 || $scope.modalAvailable < $scope.modalEntity.moneyOut)){
                	if( entity.isNotData == $scope.isNotDatas[0].key ){
                		layer.msg("出金金额大于可用资金，出金失败",{icon: 2});
                    	return false;
                	}
                	
                }
            	
            	/*else if($scope.modalEntity.operType==1 && $scope.modalEntity.moneyIn > $scope.modalEntity.availMoney){
                	layer.msg("入金金额必须小于可用金额.",{icon: 2});
                	return false;
                }
                else if($scope.modalEntity.operType==2 && $scope.modalEntity.moneyOut > $scope.modalEntity.finalInterest){
                	layer.msg("出金金额必须小于可用金额.",{icon: 2});
                	return false;
                }*/
                //增加
                if (index == undefined) {
                	$scope.service.add(entity,function (result) {
                		if(result == null || result == undefined){
                			layer.msg("非机构用户不可新增！",{icon: 2});
                        	return false;
                		}else{
                			result.innerAccountID = entity.innerAccountID;
                    		$scope.listEntitys.unshift(result);  
                    	    $scope.find(); 
                    		$scope.$apply(); 
                    		layer.msg("新增成功！",{icon: 1});
//                    		$scope.resultFlag = true;
//                            $scope.resultInfo = "出入金信息保存成功!";
//                            $timeout(function () {
//                                $scope.resultFlag = false;
//                                $scope.resultInfo = "";
//                            }, 3000);
                		}
//                		
                	});          	    		
                    //修改
                } else {
                	$scope.service.update(entity,function (result) {
                		$scope.listEntitys.splice(index, 1, entity);  
                		$scope.find(); 
                		$scope.$apply();        		
//                		$scope.resultFlag = true;
//                        $scope.resultInfo = "出入金信息保存成功!";
//                        $timeout(function () {
//                            $scope.resultFlag = false;
//                            $scope.resultInfo = "";
//                        }, 3000);
                	});  
                }
                //关闭窗口
                $("#subMoneyIOModal").modal("hide");
        	},{
        		subAccountID: entity.subAccountID,
        		isActive: 1
        	});
        },{
        	accountID: entity.subAccountID,
        	currency: entity.currency
        });
    }
    //3.3、删除出入金
    $scope.remove = function (entity,index) {
        //使用内置Index
    	if(entity.isRecheck == 1)
    	{
    		layer.msg("出入金信息已复核，不能删除！", {icon: 2, time: 3000});
            return false;
    	}
    	$scope.service.remove(entity.id,function (result) {
        	$scope.listEntitys.splice(index, 1);
        	$scope.find(); 
    		$scope.$apply();    		
//    		$scope.resultFlag = true;
//            $scope.resultInfo = "出入金信息记录删除成功!";
//            $timeout(function () {
//                $scope.resultFlag = false;
//                $scope.resultInfo = "";
//            }, 3000);
    	});       
    };    
    //3.4、初始化新增页面的参数
    $scope.initAddParam = function (operType) {
        $scope.modalEntity = {};
        $scope.modalEntity.settleDate = $scope.currDate;
        $scope.modalEntity.operType = operType;
        if(operType==1){
        	$scope.modalEntity.moneyOut = 0;
        }else{
        	$scope.modalEntity.moneyIn = 0;
        }
//        $scope.modalEntity.currency = $scope.currencyEntity[0].key;
        $scope.modalEntity.bankID = $scope.bankIDDatas[0].key;        
        $scope.modalEntity.moneyType = "0";        
//        $scope.modalEntity.innerAccountID = $scope.accountDatas[0].innerAccountID;
        $scope.selectSubAccountID($scope.modalEntity.innerAccountID);
        $scope.modalEntity.isNotData = $scope.isNotDatas[0].key;   
//        $scope.modalEntity.bankAccount = $scope.bankAccounts[0].bankAccountID;   
        $scope.notRunTime=true;
        $scope.formValidateReset();
        $timeout(function(){
        	$("#subMoneyIOModal").modal("show");
        },1000);
     }; 
     $scope.isRunTimeTrade = function () {
         if( $scope.modalEntity.isNotData == $scope.isNotDatas[0].key ){
             $scope.modalEntity.subAccountID="";
        	 $scope.notRunTime=true;
         }else{
        	 $scope.notRunTime=false;
         }
     }
     
     

     //3.6、表单校验信息重置
     $scope.formValidateReset = function (){
     	$scope.myForm.settleDate.$setPristine();     	
     	$scope.myForm.moneyOut.$setPristine();
     	$scope.myForm.moneyIn.$setPristine();     	
     	$scope.myForm.type.$setPristine(); 
     }     
    
    //4、数据初始化        
    //4.1、进入页面时调用查询方法
    $scope.service.findAllList(function (result) {
		$scope.listEntitys=result;  
		$scope.$apply();        		
	}); 
    //4.2 日历控件
    $("[forType='date']").datepicker({
        language: 'zh-CN',
        weekStart: 1,
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        format: 'yyyymmdd'
    });
//    //4.3 初始化内部账户下拉列表
//    $scope.capitalAccountService.findAll(function (result) {
//        $scope.accountDatas = result;
//    });   
    
    //页面复核
    $scope.transIsRecheck = function (key) {
        var count = $scope.isRecheckDatas.length;
        for (var i = 0; i < count; i++) {
            if ($scope.isRecheckDatas[i].key == key) {
                return $scope.isRecheckDatas[i].text;
            }
        }
    }
    
  //初始化
    $(document).ready(function() {
		    	//会话列表初始化
		    	$scope.SubMoneyIOTable = $('#SubMoneyIO_dynamic_table').DataTable( {
			    		data : $scope.SubMoneyIODataset,
			        	columns :$scope.SubMoneyIO_columns,
			            dom: 'rt<"bottom"iplB>',
			            
						buttons: []
		        } );
      }); 
});

