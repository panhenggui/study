/**
 * Created by Quantdo on 2016/6/1.
 */
'use strict';
var myapp = angular.module('myApp', ['ngRoute', 'ngAJAXTabs','controllers']);

myapp.controller("indexController",function($scope,$rootScope){
    //实例化服务接口
    $scope.capitalAccountService = new com.quantdo.orgClear.service.CapitalAccountService();
    $scope.operClientPositionService = new com.quantdo.orgClear.service.OperClientPositionService();
    $scope.operOrderService = new com.quantdo.orgClear.service.OperOrderService();

    $scope.instShortName="";
    queryInstShortName(function (result) {
        $scope.instShortName="";
        $scope.instShortName = result;
        if( $scope.instShortName==undefined){
            $scope.instShortName="主经纪商";
        }
        $scope.$apply();
    });

    $scope.userName = '';
    getUserName(function (result) {
        $scope.userName = result;
        $scope.$apply();
    });

    //初始化定时器时间
    $scope.queryEntity = {
        sleepTime:1
    };
    //判断定时器时间是否可以修改
    $scope.isStart = true;

    $scope.dataset = [];

    //买卖方向
    $rootScope.tradeDirection = clearConstant.tradeDirection;

    //交易类型
    $rootScope.tradeTypes = clearConstant.tradeTypes;

    //开平
    $rootScope.offsetFlag = clearConstant.offsetFlag;

    //报单状态
    $rootScope.orderStatus = clearConstant.orderStatus;

    //风控指标
    $rootScope.riskTypesRiskStrom = clearConstant.riskTypesRiskStrom;

    //转换状态
    $rootScope.changeStates = clearConstant.changeStates;
    
    //过滤
    findPermission(function(result){
    	$rootScope.filterEntity = result;
    });

    //获取买卖方向表示值
    $rootScope.getShowValue = function (tempArr,key){
    	if(key!=null&&key!=undefined&&key!=""){
    	    for(var i=0;i<tempArr.length;i++){
                if(key == tempArr[i].key){
                    return tempArr[i].text;
                }
            }
    	}else{
    		return key;
    	}
      return key;
    };
    
    //判断是资产单元，还是基金产品
    $rootScope.judegIsFund = function (tempArr,key){
    	var name = "";
    	if(key!=null&&key!=undefined&&key!=""){
    	    for(var i=0;i<tempArr.length;i++){
                if(key == tempArr[i].key){
                	name = tempArr[i].text;
                }
            }
    	    if(name == ""){
    	    	name = "基金产品";
    	    }
    	}else{
    		return "数据库数据异常";
    	}
    	return name;
    };

    $scope.judegeIsNum = function(index){
    	if(index == null){
    		return "";
    	}
    	if(!isNaN(index)){
    		return parseFloat(index).toFixed(2) + "%";
    	}else{
    		return "";
    	}
    }
    $scope.judegeIsNum2 = function(index){
    	if(index == null){
    		return "";
    	}
    	if(!isNaN(index)){
    		return parseFloat(index).toFixed(2);
    	}else{
    		return "";
    	}
    }
    //设置资金账户的表头列
    $rootScope.capitalAccount_columns_array = [
        { title: "机构代码"},
        { title: "机构简称"},
        { title: "资金账号"},
        {title: "投资者账号"},
        { title: "账号名称"},
        { title: "动态权益"},
        { title: "占用保证金"},
        { title: "可用资金"},
        { title: "风险度"},
        { title: "上次结算准备金"},
        { title: "入金金额"},
        { title: "出金金额"},
        { title: "平仓盈亏"},
        { title: "持仓盈亏"},
        { title: "手续费"},
        { title: "冻结的保证金"},
        { title: "冻结手续费"}
    ];

    //设置当前持仓的表头列
    $rootScope.currentPosition_columns_array = [
        { title: "机构代码"},
        { title: "机构简称"},
        { title: "投资者编号"},
        { title: "交易所代码"},
        { title: "合约代码"},
        { title: "买卖"},
        { title: "投保"},
        { title: "总持仓量"},
        { title: "总持仓成本"},
        { title: "昨持仓量"},
        { title: "昨日持仓成本"}
    ];

    //设置成交明细表头列
    $rootScope.traderDetail_columns_array = [
        { title: "机构代码"},
        { title: "机构简称"},
        {title: "投资者编号"},
        { title: "资金账号"},
        {title: "交易所代码"},
        {title: "合约代码"},
        {title: "买卖"},
        {title: "开平"},
        {title: "成交价格"},
        {title: "成交数量"},
        {title: "投保"},
        {title: "报单编号"},
        {title: "成交编号"},
        {title: "成交日期"},
        {title: "成交时间"}
        //{title: "风控单标识"}
    ];

    //设置所有报单表头列
    $rootScope.allOrders_columns_array = [
        { title: "机构代码"},
        { title: "机构简称"},
        { title: "投资者编号"},
        { title: "交易所代码"},
        { title: "合约代码"},
        { title: "买卖"},
        { title: "开平"},
        { title: "投保"},
        { title: "报单状态"},
        { title: "委托价格"},
        { title: "成交量"},
        { title: "报单量"},
        { title: "剩余量"},
        { title: "报单时间"}
        //{ title: "风控单标识"}
    ];

    //设置资金账户总持仓表头列
    $rootScope.capitalAccountSum_columns_array = [
        { title: "机构代码"},
        { title: "机构简称"},
        { title: "交易所代码"},
        { title: "合约代码"},
        { title: "买卖"},
        { title: "持仓量"}
    ];

    //设置资金账户分组表头列
    $rootScope.capitalAccountGroup_columns_array = [
        { title: "机构代码"},
        { title: "机构简称"},
        { title: "组号"},
        { title: "组名"},
        { title: "动态权益"},
        { title: "占用保证金"},
        { title: "可用资金"},
        { title: "上次结算准备金"},
        { title: "入金金额"},
        { title: "出金金额"},
        { title: "平仓盈亏"},
        { title: "持仓盈亏"},
        { title: "手续费"},
        { title: "冻结的保证金"},
        { title: "冻结手续费"}
    ];

    //设置基金净值表头列
    $rootScope.getRiskFundNetResult_columns_array = [
        { title: "产品代码"},
        { title: "产品简称"},
        { title: "单位净值"},
        { title: "产品净值"},
        { title: "单位净值档位"},
        { title: "期货保证金阈值"},
        { title: "期货保证金占比"},
        { title: "净保证金阈值"},
        { title: "净保证金占比"},
        { title: "单品种净保证金阈值"},
        { title: "单品种净保证金占比"},
        { title: "股指净保证金阈值"},
        { title: "股指净保证金占比"},
        { title: "期货合约价值阈值"},
        { title: "期货合约价值占比"},
        { title: "期货净合约价值阈值"},
        { title: "期货净合约价值占比"},
        { title: "净值日期"},
        { title: "净值时间"}
    ];

    //设置异常信息提示表头列
    $rootScope.exceptionInformation_columns_array = [
        {title: "id",visible:false},
        {title: "机构代码"},
        {title: "机构简称"},
        {title: "预警日期"},
        {title: "预警时间"},
        {title: "类型"},
        {title: "名称"},
        {title: "风控指标"},
        {title: "风控方式"},
        {title: "预警信息"},
        {title: "状态"},
        {title: "操作"},
        {title: "warnLevel",visible:false},
        {title: "isHandle",visible:false}
    ];

    //设置投顾账户表头列
    $rootScope.riskAccount = [
        {title:"机构代码"},
        {title:"机构简称"},
        {title:"资产单元"},
        {title:"账号名称"},
        {title:"动态权益"},
        {title:"占用保证金"},
        {title:"可用资金"},
        {title:"上次结算准备金"},
        {title:"入金金额"},
        {title:"出金金额"},
        {title:"平仓盈亏"},
        {title:"持仓盈亏"},
        {title:"手续费"},
        {title:"冻结的保证金"},
        {title:"冻结手续费"},
        {title:"风险净值"},
        {title:"质押金额",visible:false},
        {title:"初始资金"},
        {title:"币种",visible:false}
    ];
    
    $rootScope.DictID = clearConstant.treeDictID;

    //设置投顾账号总持仓
    $rootScope.riskAccountSum = [
		{ title: "机构代码"},
		{ title: "机构简称"},
        {title:"交易所代码"},
        {title:"合约代码"},
        {title:"买卖"},
        {title:"持仓量"}
    ]

    //根据tick值取小数位
    $rootScope.getFixedNumberByTick = function(tick){
        var mytick = tick.toString();
        if(mytick.length == 1){
            $scope.fixedNumber = 0;
        }
        else{
            $scope.fixedNumber = mytick.substring(2,mytick.length);
            if($scope.fixedNumber == 0){
                $scope.fixedNumber = 0;
            }
            else{
                $scope.fixedNumber = $scope.fixedNumber.length;
            }
        }
        return $scope.fixedNumber;
    }

    //替换数组中的元素
    $scope.replaceArr = function(loopArr,callbackTableID,returnArr,flag){
        for(var i=0;i<loopArr.length;i++){
            if(callbackTableID == loopArr[i]){
                returnArr.splice(flag,1,callbackTableID);
                return returnArr;
            }
        }
        return null;
    };

    //页面刷新时清空切入tab时存储的信息
    sessionStorage.myTableID = "";

    //保存产品信息
    $scope.productInfos = [];

    //保存产品风控设置一级菜单的值
    $scope.firstMenus = [];

    //保存产品风控设置二级菜单的值
    $scope.secondMenus = [];

    //保存产品风控设置三级菜单的值
    $scope.threeMenus = [];
    
    //保存资产单元风控设置一级菜单的值
    $scope.RiskAccountfirstMenus = [];

    //保存资产单元风控设置二级菜单的值
    $scope.RiskAccountsecondMenus = [];

    //保存资产单元风控设置三级菜单的值
    $scope.RiskAccountthreeMenus = [];
    
    //保存交易权限一级菜单的值
    $scope.TradeRightfirstMenus = [];

    //保存交易权限二级菜单的值
    $scope.TradeRightsecondMenus = [];

    //保存交易权限三级菜单的值
    $scope.TradeRightthreeMenus = [];
    
    //保存查询一级节点
    $scope.riskQueryfirstMenus = [];

    //保存查询二级节点
    $scope.riskQuerysecondMenus = [];

    //保存查询三级节点
    $scope.riskQuerythreeMenus = [];


    $scope.version = "";
    //获得登录机构的信息
    getBrokerIDAndBrokerName(function(result1){  
    	 if(result1.amType == "1"){
         	$rootScope.myriskAccountRiskControl = false;
         }
         if(result1.amType == "2"){
         	$rootScope.myriskAccountRiskControl = true;
         }
         if(result1.isSuperRisker == "0"){
         	$rootScope.isSuperRisker = false;
         }
         if(result1.isSuperRisker == "1"){
         	$rootScope.isSuperRisker = true;
         }
    //获取产品风控左边树数据
    getProductRiskMainScreenData("",function(result){
        
        $scope.publicSetData = result.publicSetData;
        if(result.fundIdAndSetData != null && result.fundIdAndSetData != undefined && result.fundIdAndSetData.length>0){
        	 $scope.fundIdAndSetData = result.fundIdAndSetData;
             angular.forEach($scope.fundIdAndSetData,function(data,index){
                 var myfunds = {};
                 myfunds.fundID = data.fundID;
                 myfunds.shortProductName = data.shortProductName;
                 myfunds.BrokerID = data.BrokerID;
                 myfunds.BrokerName = data.brokerName;
                 $scope.productInfos.push(myfunds);
             })
             sessionStorage.listFundID = $scope.fundIdAndSetData[0].fundID;
             sessionStorage.listBrokerID = $scope.fundIdAndSetData[0].BrokerID;
             //$("#" + $scope.fundIdAndSetData[0].fundID).addClass("visitedA");
             
             //获得一级节点
             for(var i=0;i<$scope.publicSetData.length;i++){
             	if($scope.publicSetData[i].idxDictpId==""&&$scope.publicSetData[i].idxDictId<20000){
             		 var menuObject = {};
                      menuObject.idxDictId = $scope.publicSetData[i].idxDictId;//获得节点id
                      menuObject.idxDictName = $scope.publicSetData[i].idxDictName;//获得节点名称
                      $scope.firstMenus.push(menuObject);
             	}
             	$scope.$apply();
             }
             
             //获得二级节点
             for(var j=0;j<$scope.firstMenus.length;j++){
                 for(var i=0;i<$scope.publicSetData.length;i++){
                 	if($scope.publicSetData[i].idxDictpId==$scope.firstMenus[j].idxDictId){
                 		 var firObject = {};
                          firObject.idxDictId = $scope.publicSetData[i].idxDictId;//获得节点id
                          firObject.idxDictName = $scope.publicSetData[i].idxDictName;//获得节点名称
                          firObject.idxDictType = $scope.publicSetData[i].idxDictType;//获得节点类型，0：表示还有下位节点，1：表示没有下位节点
                          $scope.secondMenus.push(firObject);
                          $scope.$apply();
                 	}
                 }
                 $scope.firstMenus[j].secondMenus = $scope.secondMenus;
                 $scope.$apply();
                 $scope.secondMenus=[];
             }
             //获得三级节点
             for(var j=0;j<$scope.firstMenus.length;j++){
             	var entity = $scope.firstMenus[j].secondMenus;
             	for(var k = 0;k<entity.length;k++){
             		 for(var i=0;i<$scope.publicSetData.length;i++){
                      	if($scope.publicSetData[i].idxDictpId==entity[k].idxDictId){
                      		 var firObject = {};
                               firObject.idxDictId = $scope.publicSetData[i].idxDictId;//获得节点id
                               firObject.idxDictName = $scope.publicSetData[i].idxDictName;//获得节点名称
                               $scope.threeMenus.push(firObject);
                               $scope.$apply();
                      	}
                      }
             		 $scope.firstMenus[j].secondMenus[k].threeMenus= $scope.threeMenus;
                      $scope.$apply();
                      $scope.threeMenus=[];
             	}
             }
        }
       
        //获得资产单元风控参数设置一级节点
        for(var i=0;i<$scope.publicSetData.length;i++){
        	if($scope.publicSetData[i].idxDictpId==""&&$scope.publicSetData[i].idxDictId>=20000&&$scope.publicSetData[i].idxDictId<30000){
        		 var menuObject = {};
                 menuObject.idxDictId = $scope.publicSetData[i].idxDictId;//获得节点id
                 menuObject.idxDictName = $scope.publicSetData[i].idxDictName;//获得节点名称
                 $scope.RiskAccountfirstMenus.push(menuObject);
        	}
        	$scope.$apply();
        }
        
        //获得资产单元风控参数设置二级节点
        for(var j=0;j<$scope.RiskAccountfirstMenus.length;j++){
            for(var i=0;i<$scope.publicSetData.length;i++){
            	if($scope.publicSetData[i].idxDictpId==$scope.RiskAccountfirstMenus[j].idxDictId){
            		 var firObject = {};
                     firObject.idxDictId = $scope.publicSetData[i].idxDictId;//获得节点id
                     firObject.idxDictName = $scope.publicSetData[i].idxDictName;//获得节点名称
                     firObject.idxDictType = $scope.publicSetData[i].idxDictType;//获得节点类型，0：表示还有下位节点，1：表示没有下位节点
                     $scope.RiskAccountsecondMenus.push(firObject);
                     $scope.$apply();
            	}
            }
            $scope.RiskAccountfirstMenus[j].RiskAccountsecondMenus = $scope.RiskAccountsecondMenus;
            $scope.$apply();
            $scope.RiskAccountsecondMenus=[];
        }
        //获得资产单元风控参数设置三级节点
        for(var j=0;j<$scope.RiskAccountfirstMenus.length;j++){
        	var entity = $scope.RiskAccountfirstMenus[j].RiskAccountsecondMenus;
        	for(var k = 0;k<entity.length;k++){
        		 for(var i=0;i<$scope.publicSetData.length;i++){
                 	if($scope.publicSetData[i].idxDictpId==entity[k].idxDictId){
                 		 var firObject = {};
                          firObject.idxDictId = $scope.publicSetData[i].idxDictId;//获得节点id
                          firObject.idxDictName = $scope.publicSetData[i].idxDictName;//获得节点名称
                          $scope.RiskAccountthreeMenus.push(firObject);
                          $scope.$apply();
                 	}
                 }
        		 $scope.RiskAccountfirstMenus[j].RiskAccountsecondMenus[k].RiskAccountthreeMenus= $scope.RiskAccountthreeMenus;
                 $scope.$apply();
                 $scope.RiskAccountthreeMenus=[];
        	}
        }
        
      //获得交易权限参数设置一级节点
        for(var i=0;i<$scope.publicSetData.length;i++){
        	if($scope.publicSetData[i].idxDictpId==""&&$scope.publicSetData[i].idxDictId>=30000&&$scope.publicSetData[i].idxDictId<40000){
        		 var menuObject = {};
                 menuObject.idxDictId = $scope.publicSetData[i].idxDictId;//获得节点id
                 menuObject.idxDictName = $scope.publicSetData[i].idxDictName;//获得节点名称
                 $scope.TradeRightfirstMenus.push(menuObject);
        	}
        	$scope.$apply();
        }
        
        //获得交易权限参数设置二级节点
        for(var j=0;j<$scope.TradeRightfirstMenus.length;j++){
            for(var i=0;i<$scope.publicSetData.length;i++){
            	if($scope.publicSetData[i].idxDictpId==$scope.TradeRightfirstMenus[j].idxDictId){
            		 var firObject = {};
                     firObject.idxDictId = $scope.publicSetData[i].idxDictId;//获得节点id
                     firObject.idxDictName = $scope.publicSetData[i].idxDictName;//获得节点名称
                     firObject.idxDictType = $scope.publicSetData[i].idxDictType;//获得节点类型，0：表示还有下位节点，1：表示没有下位节点
                     $scope.TradeRightsecondMenus.push(firObject);
                     $scope.$apply();
            	}
            }
            $scope.TradeRightfirstMenus[j].TradeRightsecondMenus = $scope.TradeRightsecondMenus;
            $scope.$apply();
            $scope.TradeRightsecondMenus=[];
        }
        //获得交易权限参数设置三级节点
        for(var j=0;j<$scope.TradeRightfirstMenus.length;j++){
        	var entity = $scope.TradeRightfirstMenus[j].TradeRightsecondMenus;
        	for(var k = 0;k<entity.length;k++){
        		 for(var i=0;i<$scope.publicSetData.length;i++){
                 	if($scope.publicSetData[i].idxDictpId==entity[k].idxDictId){
                 		 var firObject = {};
                          firObject.idxDictId = $scope.publicSetData[i].idxDictId;//获得节点id
                          firObject.idxDictName = $scope.publicSetData[i].idxDictName;//获得节点名称
                          $scope.TradeRightthreeMenus.push(firObject);
                          $scope.$apply();
                 	}
                 }
        		 $scope.TradeRightfirstMenus[j].TradeRightsecondMenus[k].TradeRightthreeMenus= $scope.TradeRightthreeMenus;
                 $scope.$apply();
                 $scope.TradeRightthreeMenus=[];
        	}
        }
        
        	 //获得查询一级节点
            for(var i=0;i<$scope.publicSetData.length;i++){
            	if($scope.publicSetData[i].idxDictpId==""&&$scope.publicSetData[i].idxDictId>=40000&&$scope.publicSetData[i].idxDictId<50000){
            		 var menuObject = {};
                     menuObject.idxDictId = $scope.publicSetData[i].idxDictId;//获得节点id
                     menuObject.idxDictName = $scope.publicSetData[i].idxDictName;//获得节点名称
                     $scope.riskQueryfirstMenus.push(menuObject);
            	}
            	$scope.$apply();
            }
            
        if($rootScope.myriskAccountRiskControl && !$rootScope.isSuperRisker){
	        //获得查询二级节点
	        for(var j=0;j<$scope.riskQueryfirstMenus.length;j++){
	            for(var i=0;i<$scope.publicSetData.length;i++){
	            	if($scope.publicSetData[i].idxDictpId==$scope.riskQueryfirstMenus[j].idxDictId){
	            		 var firObject = {};
	                     firObject.idxDictId = $scope.publicSetData[i].idxDictId;//获得节点id
	                     firObject.idxDictName = $scope.publicSetData[i].idxDictName;//获得节点名称
	                     firObject.idxDictType = $scope.publicSetData[i].idxDictType;//获得节点类型，0：表示还有下位节点，1：表示没有下位节点
	                     $scope.riskQuerysecondMenus.push(firObject);
	                     $scope.$apply();
	            	}
	            }
	            $scope.riskQueryfirstMenus[j].riskQuerysecondMenus = $scope.riskQuerysecondMenus;
	            $scope.$apply();
	            $scope.riskQuerysecondMenus=[];
	        }
        }else{
            //获得查询二级节点
            for(var j=0;j<$scope.riskQueryfirstMenus.length;j++){
                for(var i=0;i<$scope.publicSetData.length;i++){
                	if($scope.publicSetData[i].idxDictpId==$scope.riskQueryfirstMenus[j].idxDictId&&$scope.publicSetData[i].idxDictId!="40003"){
                		 var firObject = {};
                         firObject.idxDictId = $scope.publicSetData[i].idxDictId;//获得节点id
                         firObject.idxDictName = $scope.publicSetData[i].idxDictName;//获得节点名称
                         firObject.idxDictType = $scope.publicSetData[i].idxDictType;//获得节点类型，0：表示还有下位节点，1：表示没有下位节点
                         $scope.riskQuerysecondMenus.push(firObject);
                         $scope.$apply();
                	}
                }
                $scope.riskQueryfirstMenus[j].riskQuerysecondMenus = $scope.riskQuerysecondMenus;
                $scope.$apply();
                $scope.riskQuerysecondMenus=[];
            }
        }
        
        //获得查询三级节点
        for(var j=0;j<$scope.riskQueryfirstMenus.length;j++){
        	var entity = $scope.riskQueryfirstMenus[j].riskQuerysecondMenus;
        	for(var k = 0;k<entity.length;k++){
        		 for(var i=0;i<$scope.publicSetData.length;i++){
                 	if($scope.publicSetData[i].idxDictpId==entity[k].idxDictId){
                 		 var firObject = {};
                          firObject.idxDictId = $scope.publicSetData[i].idxDictId;//获得节点id
                          firObject.idxDictName = $scope.publicSetData[i].idxDictName;//获得节点名称
                          $scope.riskQuerythreeMenus.push(firObject);
                          $scope.$apply();
                 	}
                 }
        		 $scope.riskQueryfirstMenus[j].riskQuerysecondMenus[k].riskQuerythreeMenus= $scope.riskQuerythreeMenus;
                 $scope.$apply();
                 $scope.riskQuerythreeMenus=[];
        	}
        }
        
    });
    });
    //获得版本号
    getAllRiskVersionData(function(result){
        if(result!=undefined && result!=null && result.length>0){
            $scope.version = result[0].version;
        }
    });

    //获取所点击链接的基金编号
    $scope.getFundID = function(fundID,brokerID){
        var myLi = [];
        for(var i=0;i<$("#productInfosFlag")[0].childNodes.length;i++){
            if($("#productInfosFlag")[0].childNodes[i].nodeName == "LI"){
                myLi.push($("#productInfosFlag")[0].childNodes[i]);
            }
        }
        for(var i=0;i<myLi.length;i++){
            if(brokerID+fundID == myLi[i].childNodes[1].id){
                if(!$("#" +brokerID+fundID).hasClass("visitedA")){
                    $("#" +brokerID+fundID).addClass("visitedA");
                }
            }
            else{
                $(myLi[i].childNodes[1]).removeClass("visitedA");
            }
        }

        sessionStorage.listFundID = fundID;
        sessionStorage.listBrokerID = brokerID;
        $rootScope.modelFlag = "del";
    };

    getBrokerIDAndBrokerName(function(result){
        if(result.amType == "1"){
            if(!$("#riskLeft").hasClass("dispear")){
                $("#riskLeft").addClass("dispear");
            }
            $($("#menu-show")[0].childNodes[19]).addClass("hidden");
            $($("#menu-show")[0].childNodes[21]).addClass("hidden");
            $("#riskRight").addClass("fullRow");
        }
        else{
            $("#riskLeft").removeClass("dispear");
            $($("#menu-show")[0].childNodes[19]).removeClass("hidden");
            $($("#menu-show")[0].childNodes[21]).removeClass("hidden");
        }
    });

    $scope.clickAccount = 0;

    $rootScope.compLoad = [];

    $rootScope.stopTimer = true;

    $rootScope.stopTimerFlag = true;
    //点击树节点触发的事件
    $scope.closeDropDown = function(id){
        var myul = $("#"+id)[0].childNodes;
        //sessionStorage.myid = id;
        for(var i=0;i<myul.length;i++){
            if(myul[i].nodeName == "UL" || myul[i].nodeName == "LI"){
                if($scope.clickAccount%2 == 0){
                    $(myul[i]).addClass("hidden");
                }
                else{
                    $(myul[i]).removeClass("hidden");
                }
            }
        }
        $scope.clickAccount++;
    }

    var menuShow = document.getElementById("menu-show");
    var firstLiArr = menuShow.getElementsByTagName("li");
    var myTables = [];
    for(var i=0;i<firstLiArr.length;i++){
        if(!$(firstLiArr[i].childNodes[0]).hasClass("myopacity")){
            myTables.push(firstLiArr[i].id.substring(0,firstLiArr[i].id.length-3));
        }
    }
    sessionStorage.mytables = myTables;

    sessionStorage.initFlag = true;

    sessionStorage.initPage = "";

    $rootScope.circleFunc = function(){
        findCapitalAccount({})
            .then(function(result){
                $scope.tEntitys = result;
                return findBySubAccountIdAndAccountIdOfRiskByFundId({fundProductID:$rootScope.myData,brokerID:$rootScope.myBrokerID});
            })
            .then(function(result){
                //资金账户
                $scope.capitalAccount_dataset = [];
                var con = result;
                for(var i=0;i<con.length;i++){
                    var tempArry = [con[i].brokerageFirmID,con[i].instClientName,con[i].accountID, con[i].traderID, $rootScope.fundName(con[i].accountID), parseFloat(con[i].dynamicRights).toFixed(2),
                        parseFloat(con[i].margin).toFixed(2),parseFloat(con[i].available).toFixed(2),(parseFloat(con[i].risk).toFixed(4)*100).toFixed(2) + "%",
                        parseFloat(con[i].preBalance).toFixed(2),parseFloat(con[i].deposit).toFixed(2),parseFloat(con[i].withdraw).toFixed(2),
                        parseFloat(con[i].closeProfit).toFixed(2), parseFloat(con[i].positionProfit).toFixed(2),
                        parseFloat(con[i].fee).toFixed(2),parseFloat(con[i].frozenMargin).toFixed(2),
                        parseFloat(con[i].frozenFee).toFixed(2)];
                    $scope.capitalAccount_dataset.push(tempArry);
                }
                $scope.$apply();
                var table = $("#capitalAccount_table").DataTable();
                table.clear().draw();
                table.rows.add($scope.capitalAccount_dataset).draw();

                if(table.context.length>0){
                    var trDatas = table.context[0].aoData;
                    var myPaneFlag = $rootScope.trData.substring(1,$rootScope.trData.length-1);
                    for(var i=0;i<trDatas.length;i++){
                        var trData = trDatas[i]._aData;
                        var mytr = trDatas[i].nTr;
                        if(trData[0] == myPaneFlag){
                            $rootScope.capitalQueryID = trData[3];
                            $rootScope.queryGroupID = "";
                            $(mytr).addClass("selected");
                            $($("#capitalAccount_table_wrapper .DTFC_Cloned tbody tr")[$(mytr).context.rowIndex-1]).addClass('selected');
                            //break;
                        }
                    }
                }

                return getOperClientPositionSumByFundId($rootScope.myData,$rootScope.myBrokerID);
            })
            .then(function(result){
                //资金账户总持仓
                $scope.capitalAccountSum_dataset = [];
                var con = result;
                if(con != null){
                	  for(var i=0;i<con.length;i++){
                          var tempArr = [con[i].brokerageFirmID,con[i].instClientAbbrName,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),con[i].position];
                          $scope.capitalAccountSum_dataset.push(tempArr);
                      }
                }
                var mytable = $("#capitalAccountSum_table").DataTable();
                mytable.clear().draw();
                mytable.rows.add($scope.capitalAccountSum_dataset).draw();

                return getOperInvestorAccountGroup({});
            })
            .then(function(result){
                //资金账户分组
                $scope.capitalAccountGroup_dataset = [];
                var con = result;
                for(var i=0;i<con.length;i++){
                    var tempArr = [con[i].brokerageFirmID,con[i].instClientName,con[i].accountID,con[i].accountName,parseFloat(con[i].dynamicRights).toFixed(2),
                        parseFloat(con[i].margin).toFixed(2),parseFloat(con[i].available).toFixed(2),parseFloat(con[i].preBalance).toFixed(2),
                        parseFloat(con[i].deposit).toFixed(2),parseFloat(con[i].withdraw).toFixed(2),parseFloat(con[i].closeProfit).toFixed(2),
                        parseFloat(con[i].positionProfit).toFixed(2),parseFloat(con[i].fee).toFixed(2),parseFloat(con[i].frozenMargin).toFixed(2),
                        parseFloat(con[i].frozenFee).toFixed(2)];
                    $scope.capitalAccountGroup_dataset.push(tempArr);
                }
                var capitalGroupTalble = $("#capitalAccountGroup_table").DataTable();
                capitalGroupTalble.clear().draw();
                capitalGroupTalble.rows.add($scope.capitalAccountGroup_dataset).draw();

                if( capitalGroupTalble.context.length>0){
                    var trDatas =  capitalGroupTalble.context[0].aoData;
                    var myPaneFlag = $rootScope.trData.substring(1,$rootScope.trData.length-1);
                    for(var i=0;i<trDatas.length;i++){
                        var trData = trDatas[i]._aData;
                        var mytr = trDatas[i].nTr;
                        if(trData[0] == myPaneFlag){
                            $(mytr).addClass("selected");
                            $($("#capitalAccountGroup_table_wrapper .DTFC_Cloned tbody tr")[$(mytr).context.rowIndex-1]).addClass('selected');
                            //break;
                        }
                    }
                }

                return findAllAccountByAccountIdOrGroupId($rootScope.capitalQueryID,$rootScope.queryGroupID,$rootScope.myBrokerID);
            })
            .then(function(result){
                //当前持仓
                if(result != undefined){
                    $scope.currentPosition_dataset = [];
                    $scope.priceTick = result
                    var con = result;
                    for(var i=0;i<con.length;i++){
                        var tempArr = [con[i].brokerageFirmID,con[i].instClientAbbrName,con[i].traderID,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),
                            $rootScope.getShowValue($rootScope.tradeTypes,con[i].hedgeFlag),con[i].position,
                            parseFloat(con[i].positionCost).toFixed(2),con[i].ydPosition,parseFloat(con[i].ydPositionCost).toFixed(2)];
                        $scope.currentPosition_dataset.push(tempArr);
                    }
                    var positionTable = $("#currentPosition_table").DataTable();
                    positionTable.clear().draw();
                    positionTable.rows.add($scope.currentPosition_dataset).draw();
                }
                return findAllOrderByAccountIdOrGroupId($rootScope.capitalQueryID,$rootScope.queryGroupID,$rootScope.riskAndCapitalFlag,$rootScope.myBrokerID);
            })
            .then(function(result){
                //所有报单
                if(result != undefined){
                    $scope.allOrders_dataset = [];
                    var con = result;
                    for(var i=0;i<con.length;i++){
                        var tempArr = [con[i].brokerageFirmID,con[i].instClientName,con[i].investorID,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),
                            $rootScope.getShowValue($rootScope.offsetFlag,con[i].offsetFlag),
                            $rootScope.getShowValue($rootScope.tradeTypes,con[i].hedgeFlag),
                            $rootScope.getShowValue($rootScope.orderStatus,con[i].orderStatus),parseFloat(con[i].limitPrice).toFixed($rootScope.getFixedNumberByTick(con[i].priceTick)),con[i].volumeTraded,con[i].volume,con[i].volumeRemain,con[i].insertTime,""];
                        $scope.allOrders_dataset.push(tempArr);
                    }
                    var orderTable = $("#allOrders_table").DataTable();
                    orderTable.clear().draw();
                    orderTable.rows.add($scope.allOrders_dataset).draw();
                }

                return findAllCapitalByQueryByAccountIdOrGroupId($rootScope.capitalQueryID,$rootScope.queryGroupID,$rootScope.riskAndCapitalFlag,$rootScope.myBrokerID);
            })
            .then(function(result){
                //成交明细
                if(result != undefined){
                    $scope.traderDetail_dataset = [];
                    var con = result;
                    for(var i=0;i<con.length;i++){
                        var tempArry = [con[i].brokerid,con[i].instClientName,con[i].investorID,con[i].subAccountID,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),
                            $rootScope.getShowValue($rootScope.offsetFlag,con[i].offsetFlag),parseFloat(con[i].tradePrice).toFixed($rootScope.getFixedNumberByTick(con[i].priceTick)),con[i].tradeVolume,
                            $rootScope.getShowValue($rootScope.tradeTypes,con[i].hedgeFlag),con[i].orderSysID,con[i].tradeID,con[i].tradingDay,con[i].tradeTime];
                        $scope.traderDetail_dataset.push(tempArry);
                    }

                  /*  var detailTable = $("#traderDetail_table").DataTable();
                    detailTable.clear().draw();
                    detailTable.rows.add($scope.traderDetail_dataset).draw();*/
                    if($rootScope.riskAndCapitalFlag==1 &&($rootScope.queryGroupID==null||$rootScope.queryGroupID==undefined||$rootScope.queryGroupID=="")) $rootScope.isShowTraderDetail = true;
                    else $rootScope.isShowTraderDetail = false;
                    $scope.$apply();
                    var traderTable = $("#traderDetail_table").DataTable();
                    traderTable.destroy();
                    var table = $rootScope.tradeDetailinitDataTables("traderDetail_table",$rootScope.traderDetail_columns_array,$scope.traderDetail_dataset,180);
                }

                return getRiskWarnResult();
            })
            .then(function(result){
                //异常提示
                $scope.exceptionInformation_dataset = [];
                var con = result;
                for(var i=0;i<con.length;i++){
                	var action = "";
                	if(con[i].isHandled==0) action = "<a style='cursor:pointer;' class='riskWarnResultDel'>[处理]</a>";
                	 var tempArr = [con[i].id,con[i].instClientID,con[i].instClientAbbrName,con[i].warnDate,con[i].warnTime,$rootScope.judegIsFund($rootScope.isFundOrRiskAccount,con[i].tplID),con[i].shortProductName,$rootScope.getShowValue($rootScope.riskTypesRiskStrom,con[i].riskType),
                         $rootScope.getShowValue($rootScope.riskWay,con[i].cfgAction),con[i].warnInfo,$rootScope.getShowValue($rootScope.changeStates,con[i].isHandled),action,con[i].warnLevel,con[i].isHandled];
                    $scope.exceptionInformation_dataset.push(tempArr);
                }
                destroyDatatable("exceptionInformation_table");
                $rootScope.getTableExceptionInforMation($scope.exceptionInformation_dataset);
               /* var exception_table = $("#exceptionInformation_table").DataTable();
                exception_table.clear().draw();
                exception_table.rows.add($scope.exceptionInformation_dataset).draw();
*/
                return getRiskFundNetResult();
            })
            .then(function(result){
                var table = $("#getRiskFundNetResult_table").DataTable();
                //基金净值
                var con = result;
                $scope.dataset = [];
                for(var i=0;i<con.length;i++){
                    var tempArr = [con[i].brokerID,con[i].instClientAbbrName,con[i].fundProductID,con[i].fundProductName,parseFloat(con[i].unitNetValue).toFixed(4),parseFloat(con[i].fundNetValue).toFixed(2),
                                   $rootScope.changeUpDownRatio(con[i].upDownRatio),$rootScope.changeWarnLevelAndStopLossLevel(con[i].warnLevel),$rootScope.changeWarnLevelAndStopLossLevel(con[i].stopLossLevel),
                                   con[i].netValueLevel,con[i].netDate,con[i].netTime];
                    for(var j=0;j<con[i].dtlidxlist.length;j++){
                        var threshold = con[i].dtlidxlist[j].threshold;
                        var riskvalue = con[i].dtlidxlist[j].riskvalue;
                        if(riskvalue>=threshold){
                            var myrowAndTd = {};
                            myrowAndTd.myrow = i;
                            myrowAndTd.mytd = j;
                            //$rootScope.needHighlight.push(myrowAndTd);
                        }
                        if(threshold != null){
                            threshold = parseFloat(threshold).toFixed(2) + "%";
                        }
                        if(riskvalue != null){
                            riskvalue = parseFloat(riskvalue).toFixed(2) + "%";
                        }
                        tempArr.push(threshold);
                        tempArr.push(riskvalue);
                    }
                    var myaddLen = table.context[0].aoColumns.length-13;
                    if(con[i].dtlidxlist.length != myaddLen){
                        for(var k=0;k<myaddLen-con[i].dtlidxlist.length;k++){
                            tempArr.push("");
                        }
                    }
                    $scope.dataset.push(tempArr);
                }
                table.clear().draw();
                table.rows.add($scope.dataset).draw();
                $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                
                if(table.context.length>0) {
                    var trDatas = table.context[0].aoData;
                    var myPaneFlag = $rootScope.valueFlag.substring(1, $rootScope.valueFlag.length - 1);
                    for (var i = 0; i < trDatas.length; i++) {
                        var trData = trDatas[i]._aData;
                        var mytr = trDatas[i].nTr;
                        if (trData[0] == myPaneFlag) {
                            $(mytr).addClass("selected");
                            $($("#getRiskFundNetResult_table_wrapper .DTFC_Cloned tbody tr")[$(mytr).context.rowIndex-1]).addClass('selected');
                        }
                    }
                }

                return getRiskAccount("");
            })
            .then(function(result){
                //资产单元
                var con = result;
                $scope.riskAccount_dataset = [];
                for(var i=0;i<con.length;i++){
                    var tempArr = [con[i].brokerID,con[i].brokerName,con[i].subAccountID,con[i].subAccountName,parseFloat(con[i].dynamicRights).toFixed(2),parseFloat(con[i].margin).toFixed(2),
                        parseFloat(con[i].available).toFixed(2),parseFloat(con[i].preBalance).toFixed(2),parseFloat(con[i].deposit).toFixed(2),
                        parseFloat(con[i].withdraw).toFixed(2),parseFloat(con[i].closeProfit).toFixed(2),parseFloat(con[i].positionProfit).toFixed(2),
                        parseFloat(con[i].fee).toFixed(2),parseFloat(con[i].longFrozenMargin).toFixed(2)+parseFloat(con[i].shortFrozenMargin).toFixed(2),
                        parseFloat(con[i].frozenFee).toFixed(2),
                        $scope.judegeIsNum(con[i].riskNet),parseFloat(con[i].mortgage).toFixed(2),
                        $scope.judegeIsNum2(con[i].initialCapital),con[i].currency];
                    $scope.riskAccount_dataset.push(tempArr);
                }
                var table = $("#riskAccount_table").DataTable();
                table.clear().draw(false);
                table.rows.add($scope.riskAccount_dataset).draw();

                if(table.context.length>0){
                    var trDatas = table.context[0].aoData;
                    var myPaneFlag = $rootScope.trData.substring(1,$rootScope.trData.length-1);
                    for(var i=0;i<trDatas.length;i++){
                        var trData = trDatas[i]._aData;
                        var mytr = trDatas[i].nTr;
                        if(trData[0] == myPaneFlag){
                            $(mytr).addClass("selected");
                            $($("#riskAccount_table_wrapper .DTFC_Cloned tbody tr")[$(mytr).context.rowIndex-1]).addClass('selected');
                            //break;
                        }
                    }
                }

                return getRiskAccountSum("");
            })
            .then(function(result){
                //资产单元总持仓
                var con = result;
                $scope.riskAccountSum_dataset = [];
                for(var i=0;i<con.length;i++){
                    var tempArr = [con[i].brokerID,con[i].brokerName,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),con[i].position];
                    $scope.riskAccountSum_dataset.push(tempArr);
                }
                var riskSumTable = $("#riskAccountSum_table").DataTable();
                riskSumTable.clear().draw();
                riskSumTable.rows.add($scope.riskAccountSum_dataset).draw();
                sessionStorage.initFlag = false;
                clearTimeout($rootScope.timer);
                //debugger
                if($rootScope.stopTimer){
                    $rootScope.timer = setTimeout(function(){
                        $rootScope.circleFunc();
                    },sessionStorage.newSetTimer);
                }
            });
            //.catch(function(err){
            //    clearTimeout($rootScope.timer);
            //    //debugger
            //    if($rootScope.stopTimer){
            //        $rootScope.timer = setTimeout(function(){
            //            $rootScope.circleFunc();
            //        },sessionStorage.newSetTimer);
            //    }
            //});
    };

    sessionStorage.newSetTimer = $scope.queryEntity.sleepTime* 1000;

    $rootScope.timer = setTimeout(function(){
        $rootScope.circleFunc();
        //$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    },sessionStorage.newSetTimer);

    //执行轮询
    $scope.queryExe = function(queryEntity){
        $("#queryExe").addClass("button-query");
        $("#stopQuery").removeClass("button-query");
        sessionStorage.newSetTimer = queryEntity.sleepTime*1000;
        if(queryEntity.sleepTime < 1){
            layer.msg("轮询间隔必须大于1秒",{icon:2, time:1000});
            return false;
        }
        else{
            $scope.isStart = true;
            $scope.isStop = false;
            clearTimeout($rootScope.timer);
            $rootScope.stopTimerFlag = true;
            $rootScope.timer = setTimeout(function(){
                $rootScope.stopTimer = true;
                $rootScope.circleFunc();
            },sessionStorage.newSetTimer);
        }
    };

    //停止查询
    $scope.stopQuery = function(){
        $("#queryExe").removeClass("button-query");
        $("#stopQuery").addClass("button-query");
        $rootScope.stopTimer = false;
        //debugger
        clearTimeout($rootScope.timer);
        $("#sleepTime").focus();
        $scope.isStart = false;
        $scope.isStop = true;
        $rootScope.stopTimerFlag = false;
    };

    $scope.openRiskControl = function(){
    	$rootScope.changeTabToTab();
        var systemShow = document.getElementById("system-show");
        var mysecLis = systemShow.getElementsByTagName("li");
        $(mysecLis[0].childNodes[0]).removeClass("myopacity");
        $(mysecLis[1].childNodes[0]).addClass("myopacity");
        //$(mysecLis[2].childNodes[0]).addClass("myopacity");
        $("#productRisk").removeClass("hidden");
        //$("#capitalGroup").addClass("hidden");
        $("#riskAccountproductRisk").addClass("hidden");
        $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    };
    
    $scope.openriskAccountRiskControl = function(){
    	$rootScope.changeTabToTab();
        var systemShow = document.getElementById("system-show");
        var mysecLis = systemShow.getElementsByTagName("li");
        $(mysecLis[0].childNodes[0]).addClass("myopacity");
        $(mysecLis[1].childNodes[0]).removeClass("myopacity");
        //$(mysecLis[2].childNodes[0]).addClass("myopacity");
        $("#productRisk").addClass("hidden");
       // $("#capitalGroup").addClass("hidden");
        $("#riskAccountproductRisk").removeClass("hidden");
        $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    };
    
    $scope.openTradeRightControl = function(){
    	$rootScope.changeTabToTabForTradeRight();
    	//交易权限管理，代开一个界面，隐藏其他界面，以及对号，暂时只有一个页面，不做处理
    };

    $scope.openRiskQueryControl = function(){
    	$rootScope.changeTabToTabForriskQuery();
    	//查询，打开一个界面，隐藏其他界面，以及对号，暂时只有一个页面，不做处理
    }
    
});

var controllers = angular.module("controllers", []).run(function($rootScope) {
    //存储资金净值菜单栏
    $rootScope.valuePane = [
        {
            "name": "产品净值",
            "partial": "../pages/windControl/riskFundNetResult.html",
            "controller": "getRiskFundNetResultController",
            "includedInTabView": true
        }
    ];

    //存储投顾账户菜单
    $rootScope.riskPanes = [
        {
            "name": "资产单元",
            "partial": "../pages/windControl/riskAccount.html",
            "controller": "riskAccountController",
            "includedInTabView": true
        },
        {
            "name": "资产单元总持仓",
            "partial": "../pages/windControl/riskAccountSum.html",
            "controller": "riskAccountSumController",
            "includedInTabView": true
        }

    ];


   /* $rootScope.riskAccoutSetPanes = [
        {
            "name": "资产单元风控参数设置",
            "partial": "../pages/userriskparameter/userriskparameterfof.html",
            "controller": "userRiskparameterController",
            "includedInTabView": true
        },
        {
            "name": "资产单元期货交易品种设置",
            "partial": "../pages/windControl/riskAccountFutureVarietySet.html",
            "controller": "riskAccountFutureVarietySetController",
            "includedInTabView": true
        },
        {
            "name": "资产单元证券交易品种设置",
            "partial": "../pages/windControl/riskAccountStockVarietySet.html",
            "controller": "riskAccountStockVarietySetController",
            "includedInTabView": true
        }
    ];*/

    //存储资金账户菜单
    $rootScope.panes = [
        {
            "name": "资金账户",
            "partial": "../pages/windControl/capitalAccount.html",
            "controller": "capitalAccountController",
            "includedInTabView": true
        },
        {
            "name": "资金账户总持仓",
            "partial": "../pages/windControl/capitalAccountSum.html",
            "controller": "capitalAccountSumController",
            "includedInTabView": true
        },
        {
            "name": "资金账户分组",
            "partial": "../pages/windControl/capitalAccountGroup.html",
            "controller": "capitalAccountGroupController",
            "includedInTabView": true
        }

    ];

    $rootScope.capitalPanes = [
        {
            "name": "资产分类管理",
            "partial": "../pages/windControl/assetGroup.html",
            "controller": "assetGroupController",
            "includedInTabView": true
        }
    ];

    //存储风控设置菜单
    $rootScope.riskManagements = [
        //{
        //    "name": "净值占比设置",
        //    "partial": "../pages/windControl/productRisk.html",
        //    "controller": "productRiskController",
        //    "includedInTabView": true
        //}
        //{
        //    "name": "",
        //    "partial": "myhome.html",
        //    "controller": "myhomeCtroller",
        //    "includedInTabView": true
        //}
    ];
   /* //存储资产单元风控设置
    $rootScope.mysecLis = [
                              ];*/

    $rootScope.trData = "";

    $rootScope.valueFlag = "";

    //1表示点击资产单元，2表示资金账户
    $rootScope.riskAndCapitalFlag = "";

    //存储相关明细菜单栏
    $rootScope.centerPanes = [
        {
            "name": "当前持仓",
            "partial": "../pages/windControl/currentPosition.html",
            "controller": "currentPositionController",
            "includedInTabView": true
        },
        {
            "name": "成交明细",
            "partial": "../pages/windControl/traderDetail.html",
            "controller": "traderDetailController",
            "includedInTabView": true
        },
        {
            "name": "所有报单",
            "partial": "../pages/windControl/allOrders.html",
            "controller": "allOrdersController",
            "includedInTabView": true
        },
        {
            "name": "持仓查询",
            "partial": "../pages/windControl/positionQuery.html",
            "controller": "positionQueryController",
            "includedInTabView": true
        }
    ];

    //存储底部菜单栏
    $rootScope.bottomPanes = [
        {
            "name": "异常提示",
            "partial": "../pages/windControl/exceptionInformation.html",
            "controller": "exceptionInformationController",
            "includedInTabView": true
        }
    ];
    
    //储存资产单元风控设置菜单栏
    $rootScope.riskAccountproductRisks = [];
    //存储交易权限管理菜单栏
    $rootScope.myTradeRightManges = [];

    //存储查询菜单栏
    $rootScope.myriskQueryCaiDan = [];
    
    $rootScope.modelFlag ="产品净值";
    $rootScope.addPane = function(id,name,ctrl,partial,tabFlag) {
        sessionStorage.initPage = "aaa";
        //隐藏功能显示菜单栏
        var menuShow = document.getElementById("menu-show");
        var myfuncShow = document.getElementById("myfunc-show");
        var firstLiArr = menuShow.getElementsByTagName("li");
        menuShow.style.display = "none";
        myfuncShow.style.borderColor = "transparent";
        //if(name == "资产分类管理"){
        //    $("#productRisk").addClass("hidden");
        //    $("#capitalGroup").removeClass("hidden");
        //}
        //净值占比设置
        if(id == $rootScope.DictID.productRisk){
            ctrl = "productRiskController";
            partial = "windControl/productRisk.html";
        }
        //持仓占比设置
        else if(id == $rootScope.DictID.positionProportion){
            ctrl = "positionProportionSetController";
            partial = "windControl/positionProportionSet.html";
        }
        //单位净值止损
        else if(id == $rootScope.DictID.unitNetvalueStop){
            ctrl = "unitNetvalueStopController";
            partial = "windControl/unitNetvalueStop.html";
        }
        //日内最大回撤止损比例
        else if(id == $rootScope.DictID.riskDayStopLoss){
            ctrl = "riskDayStopLossController";
            partial = "windControl/riskDayStopLoss.html";
        }
        //期货交易品种限制
        else if(id == $rootScope.DictID.futureVarietiesRestriction){
            ctrl = "futureVarietiesRestrictionController";
            partial = "windControl/futureVarietiesRestriction.html";
        }
	    //资产单元风控参数设置
        else if(id == $rootScope.DictID.userriskparameterfof){
            ctrl = "userRiskparameterController";
            partial = "userriskparameter/userriskparameterfof.html";
        }
        //资产单元期货交易品种设置
        else if(id == $rootScope.DictID.riskAccountFutureVariety){
            ctrl = "riskAccountFutureVarietySetController";
            partial = "windControl/riskAccountFutureVarietySet.html";
        }
        //资产单元证券交易品种设置
        else if(id == $rootScope.DictID.riskAccountStockVariety){
            ctrl = "riskAccountStockVarietySetController";
            partial = "windControl/riskAccountStockVarietySet.html";
        }
        //交易权限管理
        else if(id == $rootScope.DictID.tradeAuthorityManage){
        	 ctrl = "tradeAuthorityManageController";
             partial = "windControl/tradeAuthorityManage.html";
        }
	    //证券交易品种限制
	    else if(id == $rootScope.DictID.stockTradingVarietiesRestriction){
            ctrl = "stockTradingVarietiesRestrictionController";
            partial = "windControl/stockTradingVarietiesRestriction.html";
        }
        //市场占比设置
        else if(id == $rootScope.DictID.marketProportionSet){
            ctrl = "marketProportionSetController";
            partial = "windControl/marketProportionSet.html";
        }
        //资产组合风控设置
        else if(id == $rootScope.DictID.portfolioRiskControl){
        	ctrl = "portfolioRiskControlSetController";
            partial = "windControl/portfolioRiskControlSet.html";
        }
        //交易所报单频率控制
        else if(id == $rootScope.DictID.exchangeOrderControl){
        	ctrl = "exchangeOrderControlController";
            partial = "windControl/exchangeOrderControl.html";
        }
        //期货数量控制
        else if(id == $rootScope.DictID.futureVolumeControl){
        	ctrl = "futureVolumeControlController";
            partial = "windControl/futureVolumeControl.html";
        }
        //同向反向设置
        else if(id == $rootScope.DictID.directionControl){
        	ctrl = "directionControlController";
            partial = "windControl/directionControl.html";
        }
        //资产单元交易所报单频率控制
        else if(id == $rootScope.DictID.riskAccountExchOrderControl){
        	ctrl = "riskAccountExchOrderControlController";
            partial = "windControl/riskAccountExchangeOrderControl.html";
        }
        //资产单元期货数量控制
        else if(id == $rootScope.DictID.riskAccountFutureVolumeControl){
        	ctrl = "riskAccountFutureVolumeControlController";
            partial = "windControl/riskAccountFutureVolumeControl.html";
        }
        //风控参数变更流水查询
        else if(id == $rootScope.DictID.riskOperLogQuery){
        	ctrl = "riskOperLogQueryController";
            partial = "windControl/riskOperLog.html";
        }
        //风控预警情况统计 
        else if(id == $rootScope.DictID.riskWarnResultCount){
        	ctrl = "riskWarnResultCountController";
            partial = "windControl/riskWarnResultCount.html";
        }
        //资产单元持仓核对
        else if(id == $rootScope.DictID.riskAccountPositionCheck){
        	ctrl = "riskAccountPositionCheckController";
            partial = "windControl/riskAccountPositionCheck.html";
        }
        var flag = 0;//标识添加tab到第一个菜单栏
        var mFlag = 0;
        var secondFlag = 0;//标识添加tab到第二个右侧菜单栏
        var threeFlag = 0;//标识添加tab到第三个菜单栏
        var fourFlag = 0;//标识添加tab到第四个菜单栏
        var fiveFlag = 0;//标识添加tab到第二个左侧菜单栏

        var productRiskFlag = 0;//标识添加tab到第二个左侧菜单栏

        var capitalGroupFlag = 0;
        var riskAccountSetFlag = 0;
        var tradeTightFlag = 0;
        var riskQueryFlag = 0;
        //tabFlag为1表示第一个菜单栏，为2表示第二个菜单栏，为3表示第三个菜单栏,为4表示第四个菜单栏
        if(tabFlag == 1){
            flag = 0;
            secondFlag = 1;
            threeFlag = 1;
            fourFlag = 1;
            fiveFlag = 1;
            productRiskFlag = 1;
            capitalGroupFlag = 1;
            riskAccountSetFlag = 1;
            tradeTightFlag = 1;
            riskQueryFlag = 1;
            if($rootScope.valuePane.length > 0){
                for(var i=0;i<firstLiArr.length;i++){
                    for(var j = 0;j < $rootScope.valuePane.length;j++){
                        if(name == $rootScope.valuePane[j].name){
                            flag = 1;
                        }
                        if(firstLiArr[i].innerText == $rootScope.valuePane[j].name){
                            $(firstLiArr[i].childNodes[0]).addClass("myopacity");
                        }
                    }
                }
            }
        }
        else if(tabFlag == 2){
            $("#riskRight").removeClass("dispear");
            if(!$("#riskLeft").hasClass("dispear"))
                $("#riskLeft").removeClass("fullRow");
            //$("#riskLeft").addClass("riskLeft");
            //if($("#riskRight").hasClass("dispear")){
            //    if(!$("#riskLeft").hasClass("fullRow"))
            //        $("#riskLeft").addClass("fullRow");
            //}
            //else{
            //    $("#riskLeft").removeClass("fullRow");
            //}
            //$("#riskRight").removeClass("fullRow");
            flag = 1;
            secondFlag = 0;
            threeFlag = 1;
            fourFlag = 1;
            fiveFlag = 1;
            productRiskFlag = 1;
            capitalGroupFlag = 1;
            riskAccountSetFlag = 1;
            tradeTightFlag = 1;
            riskQueryFlag = 1;
            if($rootScope.panes.length > 0){
                for(var i=0;i<firstLiArr.length;i++){
                    for(var j = 0;j < $rootScope.panes.length;j++){
                        if(name == $rootScope.panes[j].name){
                            secondFlag = 1;
                        }
                        if(firstLiArr[i].innerText == $rootScope.panes[j].name){
                            $(firstLiArr[i].childNodes[0]).addClass("myopacity");
                        }
                    }
                }
            }
        }
        else if(tabFlag == 3){
            //$(firstLiArr[myRightFlag[1]].childNodes[0]).removeClass("myopacity");
            flag = 1;
            secondFlag = 1;
            threeFlag = 0;
            fourFlag = 1;
            fiveFlag = 1;
            productRiskFlag = 1;
            capitalGroupFlag = 1;
            riskAccountSetFlag = 1;
            tradeTightFlag = 1;
            riskQueryFlag = 1;
            if($rootScope.centerPanes.length > 0){
                for(var i=0;i<firstLiArr.length;i++){
                    for(var j = 0;j < $rootScope.centerPanes.length;j++){
                        if(name == $rootScope.centerPanes[j].name){
                            threeFlag = 1;
                        }
                        if(firstLiArr[i].innerText == $rootScope.centerPanes[j].name){
                            $(firstLiArr[i].childNodes[0]).addClass("myopacity");
                        }
                    }
                }
            }
        }
        else if(tabFlag == 4){
            flag = 1;
            secondFlag = 1;
            threeFlag = 1;
            fourFlag = 0;
            fiveFlag = 1;
            productRiskFlag = 1;
            capitalGroupFlag = 1;
            riskAccountSetFlag = 1;
            tradeTightFlag = 1;
            riskQueryFlag = 1;
            if($rootScope.bottomPanes.length > 0){
                for(var i=0;i<firstLiArr.length;i++){
                    for(var j = 0;j < $rootScope.bottomPanes.length;j++){
                        if(name == $rootScope.bottomPanes[j].name){
                            fourFlag = 1;
                        }
                        if(firstLiArr[i].innerText == $rootScope.bottomPanes[j].name){
                            $(firstLiArr[i].childNodes[0]).addClass("myopacity");
                        }
                    }
                }
            }
        }
        else if(tabFlag == 5){
            $("#riskLeft").removeClass("dispear");
            $("#riskLeft").addClass("riskLeft");
            if(!$("#riskRight").hasClass("dispear")){
                $("#riskLeft").removeClass("fullRow");
            }
            $("#riskRight").removeClass("fullRow");
            flag = 1;
            secondFlag = 1;
            threeFlag = 1;
            fourFlag = 1;
            fiveFlag = 0;
            productRiskFlag = 1;
            capitalGroupFlag = 1;
            riskAccountSetFlag = 1;
            tradeTightFlag = 1;
            riskQueryFlag = 1;
            if($rootScope.riskPanes.length > 0){
                for(var i=0;i<firstLiArr.length;i++){
                    for(var j = 0;j < $rootScope.riskPanes.length;j++){
                        if(name == $rootScope.riskPanes[j].name){
                            fiveFlag = 1;
                        }
                        if(firstLiArr[i].innerText == $rootScope.riskPanes[j].name){
                            $(firstLiArr[i].childNodes[0]).addClass("myopacity");
                        }
                    }
                }
            }
        }
        else if(tabFlag == 6){
            flag = 1;
            secondFlag = 1;
            threeFlag = 1;
            fourFlag = 1;
            fiveFlag = 1;
            productRiskFlag = 0;
            capitalGroupFlag = 1;
            riskAccountSetFlag = 1;
            tradeTightFlag = 1;
            riskQueryFlag = 1;
            if($rootScope.riskManagements.length > 0){
                    for(var j = 0;j < $rootScope.riskManagements.length;j++){
                        if(name == $rootScope.riskManagements[j].name){
                            productRiskFlag = 1;
                        }
                    }
                }
        }
        else if(tabFlag == 7){
            flag = 1;
            secondFlag = 1;
            threeFlag = 1;
            fourFlag = 1;
            fiveFlag = 1;
            productRiskFlag = 1;
            capitalGroupFlag = 0;
            riskAccountSetFlag = 1;
            tradeTightFlag = 1;
            riskQueryFlag = 1;
            var systemShow = document.getElementById("system-show");
            var mysecLis = systemShow.getElementsByTagName("li");
            $(mysecLis[0].childNodes[0]).addClass("myopacity");
            $(mysecLis[1].childNodes[0]).addClass("myopacity");
            $(mysecLis[2].childNodes[0]).removeClass("myopacity");

            $("#riskAccountproductRisk").addClass("hidden");
            $("#productRisk").addClass("hidden");
            $("#capitalGroup").removeClass("hidden");

            if($rootScope.capitalPanes.length > 0){
                for(var j = 0;j < $rootScope.capitalPanes.length;j++){
                    if(name == $rootScope.capitalPanes[j].name){
                        capitalGroupFlag = 1;
                    }
                }
            }
        }
        else if(tabFlag == 8){
        	
        	 flag = 1;
             secondFlag = 1;
             threeFlag = 1;
             fourFlag = 1;
             fiveFlag = 1;
             productRiskFlag = 1;
             capitalGroupFlag = 1;
             tradeTightFlag = 1;
             riskAccountSetFlag = 0;
             riskQueryFlag = 1;
             if($rootScope.riskAccountproductRisks.length > 0){
                     for(var j = 0;j < $rootScope.riskAccountproductRisks.length;j++){
                         if(name == $rootScope.riskAccountproductRisks[j].name){
                        	 riskAccountSetFlag = 1;
                         }
                     }
                 }
           /* flag = 1;
            secondFlag = 1;
            threeFlag = 1;
            fourFlag = 1;
            fiveFlag = 1;
            productRiskFlag = 1;
            capitalGroupFlag = 1;
            riskAccountSetFlag = 0;
            var purviewShow = document.getElementById("purview-show");
            var mysecLis = purviewShow.getElementsByTagName("li");
            for(var i=0;i<mysecLis.length;i++){
                if(name == mysecLis[i].innerText){
                    $(mysecLis[i].childNodes[0]).removeClass("myopacity");
                }
                else{
                    if(!$(mysecLis[i].childNodes[0]).hasClass("myopacity")){
                        $(mysecLis[i].childNodes[0]).addClass("myopacity");
                    }
                }
            }
            if($rootScope.riskAccoutSetPanes.length > 0){
                for(var j = 0;j < $rootScope.riskAccoutSetPanes.length;j++){
                    if(name == $rootScope.riskAccoutSetPanes[j].name){
                        riskAccountSetFlag = 1;
                    }
                }
            }*/
        }else if(tabFlag == 9){
	    	 flag = 1;
	         secondFlag = 1;
	         threeFlag = 1;
	         fourFlag = 1;
	         fiveFlag = 1;
	         productRiskFlag = 1;
	         capitalGroupFlag = 1;
	         riskAccountSetFlag = 1;
	         tradeTightFlag = 0;
	         riskQueryFlag = 1;
	         if($rootScope.myTradeRightManges.length > 0){
	             for(var j = 0;j < $rootScope.myTradeRightManges.length;j++){
	                 if(name == $rootScope.myTradeRightManges[j].name){
	                	 tradeTightFlag = 1;
	                 }
	             }
	         }
        }else if(tabFlag == 10){
        	flag = 1;
            secondFlag = 1;
            threeFlag = 1;
            fourFlag = 1;
            fiveFlag = 1;
            productRiskFlag = 1;
            capitalGroupFlag = 1;
            riskAccountSetFlag = 1;
            tradeTightFlag = 1;
            riskQueryFlag = 0;
            if($rootScope.myriskQueryCaiDan.length > 0){
                for(var j = 0;j < $rootScope.myriskQueryCaiDan.length;j++){
                    if(name == $rootScope.myriskQueryCaiDan[j].name){
                    	riskQueryFlag = 1;
                    }
                }
            }
        }

        
        for(var i=0;i<firstLiArr.length;i++) {
            if (name == firstLiArr[i].innerText) {
                $(firstLiArr[i].childNodes[0]).removeClass("myopacity");
            }
        }
        if(flag == 0){
            $rootScope.valuePane.push({
                "name": name,
                "partial": partial,
                "controller": ctrl,
                "includedInTabView": true
            });
        }
        else if(secondFlag == 0){
            $rootScope.panes.push({
                "name": name,
                "partial": partial,
                "controller": ctrl,
                "includedInTabView": true
            });
        }
        else if(threeFlag == 0){
            $rootScope.centerPanes.push({
                "name": name,
                "partial": partial,
                "controller": ctrl,
                "includedInTabView": true
            });
        }
        else if(fourFlag == 0){
            $rootScope.bottomPanes.push({
                "name": name,
                "partial": partial,
                "controller": ctrl,
                "includedInTabView": true
            });
        }
        else if(fiveFlag == 0){
            $rootScope.riskPanes.push({
                "name": name,
                "partial": partial,
                "controller": ctrl,
                "includedInTabView": true
            });
        }
        else if(productRiskFlag == 0){
            $rootScope.riskManagements.push({
                "name": name,
                "partial": partial,
                "controller": ctrl,
                "includedInTabView": true
            });
        }
        else if(capitalGroupFlag == 0){
            $rootScope.capitalPanes.push({
                "name": name,
                "partial": partial,
                "controller": ctrl,
                "includedInTabView": true
            });
        }else if(riskAccountSetFlag == 0){
            $rootScope.riskAccountproductRisks.push({
                "name": name,
                "partial": partial,
                "controller": ctrl,
                "includedInTabView": true
            });
        }else if(tradeTightFlag==0){
        	$rootScope.myTradeRightManges.push({
                "name": name,
                "partial": partial,
                "controller": ctrl,
                "includedInTabView": true
            });
        }else if(riskQueryFlag==0){
        	$rootScope.myriskQueryCaiDan.push({
                "name": name,
                "partial": partial,
                "controller": ctrl,
                "includedInTabView": true
            });
        }
        else{
            $rootScope.modelFlag = name;
        }
        if(mFlag == 1){
            mFlag = 0;
            if(tabFlag == 'reg'){
                $rootScope.$apply();
            }
        }
        setTimeout(function(){
            //table.columns.adjust();
            $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
        });
    }
})
//过滤后实现页面隐藏
function hideAfterFilter(serviceArr,filterArr){
	var flag = false;
	for(var j=0;j<filterArr.length;j++){
//		sevice,fangfa
		var str = "service:"+filterArr[j].name.split(".")[0]+".";
		var name = filterArr[j].name.split(".")[1];
		var temp = [];
		for(var i=0;i<serviceArr.length;i++){
			if(serviceArr[i].indexOf(str) == 0){
				temp.push(serviceArr[i]);
			}
		}
		for(var k=0;k<temp.length;k++){
            flag = false;
			var funName = temp[k].split(".")[1];
			if(funName == "*" || name == funName){
				break;
			}
			if(k == temp.length-1){
				flag = true;
			}
		}
		if(flag){
			$(filterArr[j]).addClass("hidden");
		}
      
    }
}
//init datatable
function initDataTables(table_id, table_columns, table_data,height,orderFlag){
    return $("#" + table_id).DataTable({
        data : table_data,
        columns :table_columns,
        scrollY: height,
        paging: false,
        retrieve: true,
        destroy:true,
        autoWidth: false,
        //fixedColumns:   {
        //    leftColumns: fixedColumns
        //},
        scrollX: true,
        dom : 'rt<"bottom"ipl>',
        ordering: !orderFlag,
        //paging:   false,
        //pagingType: "full_numbers",
        language: {
            emptyTable: "没有符合条件的记录",
            info: "显示 _START_ 条到 _END_ 条 共 _TOTAL_ 条记录",
            infoEmpty: "显示 0 条到 0 条 共 0 条记录",
            lengthMenu: "显示 _MENU_ 条 记录"
            //paginate: {
            //    first: "首页",
            //    last: "末页",
            //    next: "下一页",
            //    previous: "上一页"
            //}
        }
    });
}

//destroy table
function destroyDatatable(table_id){
    var table = $("#"+table_id).DataTable();
    table.destroy();
}

//tab页面切换回调函数
//调用方法引入$rootScope并加入下面2行代码
//$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
//$scope.tabCallBackFunc = tabCallBackFunc;
function tabCallBackFunc(paneScope,event){
    //alert(paneScope.dtInstance.dataTable);
    if(event == "add"){//新增tab 暂不使用

    }else if(event == "out"){//切出tab

    }else if(event == "enter"){//切入tab
        sessionStorage.initPage = "aaa";
        var menuShow = document.getElementById("menu-show");
        var firstLiArr = menuShow.getElementsByTagName("li");
        var id = arguments[2];
        var targetName = arguments[3];
        var targetFlag = targetName.indexOf("[");
        if(targetFlag>0){
            targetName = targetName.substring(0,targetFlag);
        }
        var mypanes = arguments[4];
        for(var i=0;i<mypanes.length;i++){
            var cancelFlag = mypanes[i].tabTitle.indexOf("[");
            if(cancelFlag>0){
                var mycancelTitle = mypanes[i].tabTitle.substring(0,cancelFlag);
            }
            else{
                var mycancelTitle = mypanes[i].tabTitle;
            }
            for(var j=0;j<firstLiArr.length;j++){
                if(targetName == firstLiArr[j].innerText){
                    $(firstLiArr[j].childNodes[0]).removeClass("myopacity");
                }
                else if(mycancelTitle == firstLiArr[j].innerText){
                    $(firstLiArr[j].childNodes[0]).addClass("myopacity");
                }
            }
        }
        sessionStorage.myTableID = id;

        //$.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
        //$("table.dataTable.no-footer").addClass("fullTable");
        //var table = $(id).DataTable();
        //$('#container').css( 'display', 'block' );
        setTimeout(function(){
            //table.columns.adjust();
            $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
        });
        //table.columns.adjust()
        //table.tables().header().to$().addClass("fullTable");
        //table.state.save();
        //var mypage = table.page.info().page;
        //table.page( mypage ).draw(false);
    }else if(event == "close"){//关闭tab

    }
}
