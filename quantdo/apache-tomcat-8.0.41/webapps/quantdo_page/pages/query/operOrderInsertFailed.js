myapp.controller('OperOrderInsertFailedController', function ($scope, $timeout) {
	//1、实例化服务接口
	  //2、定义页面数据模型
    $scope.queryEntity = {
    		accountID:"",
    		instrumentID:"",
    		brokerageFirmID:"",
    		searchType:""
    };    //实际查询对象
    $scope.tmpQuery={
    		accountID:"",
     		instrumentID:"",
     		brokerageFirmID:"",
    		searchType:"1"};
	
	//2、定义页面数据模型
    $scope.queryEntity = {};    //实际查询对象
    $scope.searchTypes = clearConstant.operClientPositon_searchType;	//查询方式下拉框内容
    $scope.queryEntity.searchType = $scope.searchTypes[0].key;
    $scope.showID = $scope.searchTypes[0].text;
    $scope.showID1 = $scope.searchTypes[0].text;
    $scope.capitalAccountEntitys = [];			//所有资金帐号
    $scope.TraderEntitys = [];					//所有资产单元
    $scope.queryAccountEntitys = [];			//查询帐号下拉框内容
/*    $scope.traderTypes = clearConstant.tradeTypes;		//交易类型
    $scope.directions = clearConstant.tradeDirection;	//买卖
    $scope.offsetFlags = clearConstant.offsetFlag;	//开平
*/    $scope.listEntitys = [];
    $scope.listEntity = {};
    $scope.tmpEntity = {};
    $scope.instClientService = new com.quantdo.orgClear.service.instClientService();
	
/*	//初始化机构信息
	$scope.instClientService.findByQuery(function (result) {
	    $scope.instClientlistEntitys = result;
	    $scope.$apply();
	},{});
 
    //机构名称转换
	$scope.transInstClient = function (instClientID) {
	    for(var i = 0;i < $scope.instClientlistEntitys.length; i++){
	        if($scope.instClientlistEntitys[i].instClientID == instClientID){
	  	        return $scope.instClientlistEntitys[i].instClientAbbrName;
	 	    }
	    }
	}*/
	
    //获取所属投资机构
    queryAmType(function (result) {
        $scope.amType = result;
        if(result != null && result == '1'){
        	$scope.isMom = false;
        }else{
        	$scope.isMom = true;
        }
        $scope.$apply();
    });
    
    //所有资金帐号
    getAllCapitalAccountEntity(function (result) {
    	$scope.capitalAccountEntitys = [];
        for(var i = 0 ;i < result.length ; i++){
        	$scope.tmpEntity = {};
        	$scope.tmpEntity.accountID = result[i].innerAccountID;
        	$scope.tmpEntity.accountName = result[i].accountName;
        	$scope.tmpEntity.instClientID = result[i].instClientID;
        	$scope.capitalAccountEntitys.push($scope.tmpEntity);
        }
        $scope.queryAccountEntitys = $scope.capitalAccountEntitys;
        $scope.queryEntity.accountID = "";
        $scope.$apply();
    });
    
    //所有资产单元
    getAllTraderEntity(function (result) {
    	$scope.TraderEntitys = [];
        for(var i = 0 ;i < result.length ; i++){
        	$scope.tmpEntity = {};
        	$scope.tmpEntity.accountID = result[i].traderID;
        	$scope.tmpEntity.accountName = result[i].traderName;
        	$scope.tmpEntity.instClientID = result[i].instClientID;
        	$scope.TraderEntitys.push($scope.tmpEntity);
        }
    },null);
    
    
    //3、定义方法
    $scope.changeName = function (){
    	if($scope.queryEntity.searchType ==$scope.searchTypes[0].key){
    		$scope.showID = $scope.searchTypes[0].text;
    		$scope.queryAccountEntitys = $scope.capitalAccountEntitys;
    		$scope.queryEntity.accountID = "";
    	}else if($scope.queryEntity.searchType ==$scope.searchTypes[1].key){
    		$scope.showID = $scope.searchTypes[1].text;
    		$scope.queryAccountEntitys = $scope.TraderEntitys;
    		$scope.queryEntity.accountID = "";
    	}
    };
    /*    
    $scope.transTradeType = function (tradeType){
    	for(var i = 0;i < $scope.traderTypes.length;i++){
			if($scope.traderTypes[i].key == tradeType){
				return $scope.traderTypes[i].text;
			}
		}
    }
    
    $scope.transDirection = function (direction){
    	for(var i = 0;i < $scope.directions.length;i++){
			if($scope.directions[i].key == direction){
				return $scope.directions[i].text;
			}
		}
    }
    
    $scope.transOffsetFlag = function (offsetFlag){
    	for(var i = 0;i < $scope.offsetFlags.length;i++){
			if($scope.offsetFlags[i].key == offsetFlag){
				return $scope.offsetFlags[i].text;
			}
		}
    }
   
    $scope.tmpQuery = {};
    //4、数据初始化        
    //4.1、进入页面时调用查询方法
    $scope.find = function (queryEntity)  {
    	$scope.listEntitys = [];
    	$scope.isQuery = true;
    	$scope.tmpQuery = angular.copy(queryEntity);
        if($scope.tmpQuery.accountID != null){
        	var accountEntity = angular.copy($scope.tmpQuery.accountID);
            delete $scope.tmpQuery.accountID;
            $scope.tmpQuery.accountID = accountEntity.accountID;
            $scope.tmpQuery.instClientID = accountEntity.instClientID;
        }
        
    	if($scope.tmpQuery.searchType == "1"){
    		$scope.showID1 = $scope.searchTypes[0].text;
    		if($scope.tmpQuery.accountID == undefined || $scope.tmpQuery.accountID == ""){
    			findOperOrderInsertFailedAllCapitalByQuery(function (result){
        			if(result.length > 0){
        				for(var i = 0;i < result.length;i++){
        					$scope.tmpEntity = {};
        					$scope.tmpEntity.accountID = result[i].investorID;
        					$scope.tmpEntity.orderSysID = result[i].orderSysID;
        					$scope.tmpEntity.instrumentID = result[i].instrumentID;
        					$scope.tmpEntity.insertTime = result[i].insertTime;
        					$scope.tmpEntity.direction = result[i].direction;
        					$scope.tmpEntity.offsetFlag = result[i].offsetFlag;
        					$scope.tmpEntity.hedgeFlag = result[i].hedgeFlag;
        					$scope.tmpEntity.volume = result[i].volume;
        					$scope.tmpEntity.errorMsg = result[i].errorMsg;
        					$scope.tmpEntity.brokerageFirmID = result[i].brokerageFirmID;
        					$scope.tmpEntity.tradeUser = result[i].tradeUser;
        					$scope.tmpEntity.investManager = result[i].investManager;
        					$scope.tmpEntity.investAdviser = result[i].investAdviser;
        					$scope.tmpEntity.accountName = result[i].accountName;
        					$scope.listEntitys.push($scope.tmpEntity);
        				}
//        				for(var i = 0;i < $scope.capitalAccountEntitys.length;i++){
//        					for(var t = 0;t < $scope.listEntitys.length;t++){
//        						if($scope.capitalAccountEntitys[i].accountID == $scope.listEntitys[t].accountID && 
//        								$scope.capitalAccountEntitys[i].instClientID == $scope.listEntitys[t].brokerageFirmID){
//        							$scope.listEntitys[t].accountName = $scope.capitalAccountEntitys[i].accountName;
//        							continue;
//            	    			}
//        					}
//        	    		}
        			}
        		},{
        			instrumentID: $scope.tmpQuery.instrumentID
        		});
    		}else{
    			findOperOrderInsertFailedAllCapitalByQuery(function (result){
        			if(result.length > 0){
        				for(var i = 0;i < result.length;i++){
        					$scope.tmpEntity = {};
        					$scope.tmpEntity.accountID = result[i].investorID;
        					$scope.tmpEntity.orderSysID = result[i].orderSysID;
        					$scope.tmpEntity.instrumentID = result[i].instrumentID;
        					$scope.tmpEntity.insertTime = result[i].insertTime;
        					$scope.tmpEntity.direction = result[i].direction;
        					$scope.tmpEntity.offsetFlag = result[i].offsetFlag;
        					$scope.tmpEntity.hedgeFlag = result[i].hedgeFlag;
        					$scope.tmpEntity.volume = result[i].volume;
        					$scope.tmpEntity.errorMsg = result[i].errorMsg;
        					$scope.tmpEntity.brokerageFirmID = result[i].brokerageFirmID;
        					$scope.tmpEntity.tradeUser = result[i].tradeUser;
        					$scope.tmpEntity.investManager = result[i].investManager;
        					$scope.tmpEntity.investAdviser = result[i].investAdviser;
        					$scope.tmpEntity.accountName = result[i].accountName;
        					$scope.listEntitys.push($scope.tmpEntity);
        				}
//        				for(var i = 0;i < $scope.capitalAccountEntitys.length;i++){
//        					for(var t = 0;t < $scope.listEntitys.length;t++){
//        						if($scope.capitalAccountEntitys[i].accountID == $scope.listEntitys[t].accountID && 
//        								$scope.capitalAccountEntitys[i].instClientID == $scope.listEntitys[t].brokerageFirmID){
//        							$scope.listEntitys[t].accountName = $scope.capitalAccountEntitys[i].accountName;
//        							continue;
//            	    			}
//        					}
//        	    		}
        			}
        		},{
        			investorID: $scope.tmpQuery.accountID,
        			instrumentID: $scope.tmpQuery.instrumentID,
        			brokerageFirmID: $scope.tmpQuery.instClientID
        		});
    		}
    	}else if ($scope.tmpQuery.searchType == "2"){
    		$scope.showID1 = $scope.searchTypes[1].text;
    		if($scope.tmpQuery.accountID == undefined || $scope.tmpQuery.accountID == ""){
    			findOperOrderInsertFailedAllTraderByQuery(function (result){
        			if(result.length > 0){
        				for(var i = 0;i < result.length;i++){
        					$scope.tmpEntity = {};
        					$scope.tmpEntity.accountID = result[i].investorID;
        					$scope.tmpEntity.orderSysID = result[i].orderSysID;
        					$scope.tmpEntity.instrumentID = result[i].instrumentID;
        					$scope.tmpEntity.insertTime = result[i].insertTime;
        					$scope.tmpEntity.direction = result[i].direction;
        					$scope.tmpEntity.offsetFlag = result[i].offsetFlag;
        					$scope.tmpEntity.hedgeFlag = result[i].hedgeFlag;
        					$scope.tmpEntity.volume = result[i].volume;
        					$scope.tmpEntity.errorMsg = result[i].errorMsg;
        					$scope.tmpEntity.brokerageFirmID = result[i].brokerageFirmID;
        					$scope.tmpEntity.investAdviser = result[i].userID;
        					$scope.listEntitys.push($scope.tmpEntity);
        				}
        				for(var i = 0;i < $scope.TraderEntitys.length;i++){
        					for(var t = 0;t < $scope.listEntitys.length;t++){
        						if($scope.TraderEntitys[i].accountID == $scope.listEntitys[t].accountID && 
        								$scope.TraderEntitys[i].instClientID == $scope.listEntitys[t].brokerageFirmID){
        							$scope.listEntitys[t].accountName = $scope.TraderEntitys[i].accountName;
        							continue;
            	    			}
        					}
        	    		}
        			}
        		},{
        			instrumentID: $scope.tmpQuery.instrumentID
        		});
    		}else{
    			findOperOrderInsertFailedByQuery(function (result){
        			if(result.length > 0){
        				for(var i = 0;i < result.length;i++){
        					$scope.tmpEntity = {};
        					$scope.tmpEntity.accountID = result[i].investorID;
        					$scope.tmpEntity.orderSysID = result[i].orderSysID;
        					$scope.tmpEntity.instrumentID = result[i].instrumentID;
        					$scope.tmpEntity.insertTime = result[i].insertTime;
        					$scope.tmpEntity.direction = result[i].direction;
        					$scope.tmpEntity.offsetFlag = result[i].offsetFlag;
        					$scope.tmpEntity.hedgeFlag = result[i].hedgeFlag;
        					$scope.tmpEntity.volume = result[i].volume;
        					$scope.tmpEntity.errorMsg = result[i].errorMsg;
        					$scope.tmpEntity.brokerageFirmID = result[i].brokerageFirmID;
        					$scope.tmpEntity.investAdviser = result[i].userID;
        					$scope.listEntitys.push($scope.tmpEntity);
        				}
        				for(var i = 0;i < $scope.TraderEntitys.length;i++){
        					for(var t = 0;t < $scope.listEntitys.length;t++){
        						if($scope.TraderEntitys[i].accountID == $scope.listEntitys[t].accountID && 
        								$scope.TraderEntitys[i].instClientID == $scope.listEntitys[t].brokerageFirmID){
        							$scope.listEntitys[t].accountName = $scope.TraderEntitys[i].accountName;
        							continue;
            	    			}
        					}
        	    		}
        			}
        		},{
        			investorID: $scope.tmpQuery.accountID,
        			instrumentID: $scope.tmpQuery.instrumentID,
        			brokerageFirmID: $scope.tmpQuery.instClientID
        		});
    		}
    	}
    	$timeout(function() {
            $scope.isQuery = false;
        }, 1000);
    };*/
    
    
    $scope.orderFailedQuery = function ( opts ) {
        return function ( request, drawCallback, settings ) {        	
            var ajax          = false;
            var requestStart  = request.start;
            var drawStart     = request.start;
            var requestLength = request.length;
            var requestEnd    = requestStart + requestLength;
            var page = drawStart/requestLength + 1;
            // 获取settings中默认排序内容
            $scope.orderType = settings.aaSorting[0][0];
            var orderT = settings.aaSorting[0][1];
           
            if(orderT == "asc"){
                $scope.orderWay = 1;
            }else{
                $scope.orderWay = 2;
            }
                request.start = requestStart;
                var requestParams = {
                    "pageNo":page,
                    "pageSize":requestLength
                }
                var tempArray =[];
                findAllOrderFailedQueryInMapper($scope.tmpQuery, requestParams, $scope.orderType, $scope.orderWay, function(result){
                    var con = result.content;
                    $scope.result = con;
                  
                    for(var i = 0; i<con.length;i++){
	                	
                    	if(con[i].direction=="0"){
                    		con[i].direction="买";
                    	}else{
                    		con[i].direction="卖";
                    	}                        
                        if (con[i].hedgeFlag=="1"){
                    		con[i].hedgeFlag="投机";
                    	} else if (con[i].hedgeFlag=="2"){
                    		con[i].hedgeFlag="套利";
                    	} else if (con[i].hedgeFlag=="3"){
                    		con[i].hedgeFlag="套保";
                    	} else if (con[i].hedgeFlag=="4"){
                    		con[i].hedgeFlag="做市商";
                    	}
                        if(con[i].offsetFlag=="0"){
                    		con[i].offsetFlag="开仓";
                    	} else if (con[i].offsetFlag=="1"){
                    		con[i].offsetFlag="平仓";
                    	} else if (con[i].offsetFlag=="2"){
                    		con[i].offsetFlag="强平";
                    	} else if (con[i].offsetFlag=="3"){
                    		con[i].offsetFlag="平今";
                    	} else if (con[i].offsetFlag=="4"){
                    		con[i].offsetFlag="平昨";
                    	}        
                	var tempArr = [con[i].orderSysID,con[i].insertTime,con[i].accountID,
                                   con[i].accountName,con[i].instClientName, con[i].instrumentID,
                                   con[i].direction, con[i].offsetFlag,con[i].volume,
                                   con[i].hedgeFlag, con[i].errorMsg, con[i].tradeUser,
                                   con[i].investManager, con[i].investAdviser ];
                    tempArray.push(tempArr);
                    }
                    var json = {
                        "draw":request.draw,
                        "recordsTotal":result.totalRecord,
                        "recordsFiltered":result.totalRecord,
                        "data":tempArray,
                        "column":[14]
                    }
                    drawCallback( json );
            		
                    
                });
        }
    };
    

 //初始化
$(document).ready(function() {
	initPage();
});

function initPage(){
	//会话列表初始化
	var table = $('#orderFailed_table').DataTable( {
 	columns :[   
				{ title: "报单编号" },
				{ title: "申报时间" },
				{ title: "账号" },
				{ title: "账号名称" },
				{ title: "所属机构" },
				{ title: "合约代码" },
				{ title: "买卖" },
				{ title: "开平" },
				{ title: "申报量" },
				{ title: "交易类型" },
				{ title: "错误信息" },
				{ title: "交易员" },
				{ title: "投资经理" },
				{ title: "投资助理" }
			
		],
     "processing": true,
     "serverSide": true,
     "bFilter": false,
     "aaSorting" : [[2, "asc"]], // 默认的排序方式，按日期降序
     "aoColumnDefs": [
         { "bSortable": false, "aTargets": [] },
         {
             "aTargets": [1],
             "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                 
             }
         },
/*		      {
	          "targets": [ 17 ],
	          "visible": false
	        } */               
     ],
     "ajax": $scope.orderFailedQuery({}),
     "scrollY": 360,
     "scrollCollapse":true,
	 "scrollX": true
} );
}

// 查询(后台分页)
$scope.find = function(queryEntity){
	$scope.isQuery = true;
	$scope.tmpQuery=angular.copy(queryEntity);
	if($scope.tmpQuery.accountID != null){
    	var accountEntity = angular.copy($scope.tmpQuery.accountID);
        delete $scope.tmpQuery.accountID;
        $scope.tmpQuery.accountID = accountEntity.accountID;
        $scope.tmpQuery.brokerageFirmID = accountEntity.instClientID;
    }
   
	var table = $('#orderFailed_table').DataTable();
    table.draw();
    $timeout(function() {
    	  $scope.isQuery = false;
	}, 500);
}
    

//导出excel
$scope.exportExcelOOF = function (queryEntity) {
	$scope.tmpQuery=angular.copy(queryEntity);
	if($scope.tmpQuery.accountID != null){
   	var accountEntity = angular.copy($scope.tmpQuery.accountID);
       delete $scope.tmpQuery.accountID;
       $scope.tmpQuery.accountID = accountEntity.accountID;
       $scope.tmpQuery.brokerageFirmID = accountEntity.instClientID;
   }
	framework.file.export("实时错单查询.xls",'excel',{
		entityKey:['orderSysID','insertTime','accountID','accountName','instClientName',
		           'instrumentID','direction','offsetFlag','volume','hedgeFlag',
		           'errorMsg','userTrader','investorManager','investorAdvisor'],   
		headerKey:['报单编号','申报时间','账号','账号名称','所属机构',
		           '合约代码','买卖','开平','申报量','交易类型',
		           '错误信息','交易员', '投资经理','投资助理'],
       styles:['plainText','plainText','plainText','plainText','plainText',
		        'plainText','plainText','plainText','plainText','plainText',
		        'plainText','plainText','plainText','plainText'],
		title:"实时错单查询",
		
		dicMap:{direction:{'0':"买",'1':"卖"},hedgeFlag:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}
        ,offsetFlag:{'0':"开仓",'1':"平仓",'2':"强平",'3':"平今",'4':"平昨"}}
	},"operOrderInsertFailedService","exportExcelOOF",$scope.tmpQuery);
};
 
});

