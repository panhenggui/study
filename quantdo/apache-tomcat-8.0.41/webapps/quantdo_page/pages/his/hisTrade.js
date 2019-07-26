myapp.controller('HisTradeController', function ($scope, $timeout) {
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});	
	//1、实例化服务接口
	//1.1、 实例化客户实时持仓服务接口
	//1.2、公用查询服务接口
    $scope.queryEntity = {
    		investorID:"",
    		instrumentID:"",
    		brokerid:"",
    		beginDate:"",
     		endDate:"",
    		searchType:""
    };    //实际查询对象
    $scope.tmpQuery={
    		investorID:"",
     		instrumentID:"",
     		brokerid:"",
     		beginDate:"",
     		endDate:"",
    		searchType:"1"};
	
	
	$scope.commonQueryservice = new com.quantdo.orgClear.service.CommonQueryService();
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
	
	//2、定义页面数据模型
    $scope.queryEntity = {};    //实际查询对象
    $scope.searchTypes = clearConstant.operClientPositon_searchType;	//查询方式下拉框内容
    $scope.queryEntity.searchType = $scope.searchTypes[0].key;
    $scope.queryEntity.beginDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());
    $scope.showID = $scope.searchTypes[0].text;
    $scope.showID1 = $scope.searchTypes[0].text;
    $scope.capitalAccountEntitys = [];			//所有资金帐号
    $scope.TraderEntitys = [];					//所有资产单元
    $scope.queryAccountEntitys = [];			//查询帐号下拉框内容
    $scope.traderTypes = clearConstant.tradeTypes;		//交易类型
    $scope.directions = clearConstant.tradeDirection;	//买卖
    $scope.offsetFlags = clearConstant.offsetFlag;	//开平
    $scope.seatSystems = clearConstant.seatSystems;	//通道系统
    $scope.listEntitys = [];
    $scope.listEntity = {};
    $scope.sumTradeVolume = 0;
    $scope.sumUsedFee = 0;
    $scope.tmpEntity = {};
    $scope.hisTrade_export = isShow("hisTrade_export");
    $scope.hisTrade_query = isShow("hisTrade_query");
    
    
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
    
   /* //初始化机构信息
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
    
    $scope.transOffsetFlag = function (offsetFlag){
    	for(var i = 0;i < $scope.offsetFlags.length;i++){
			if($scope.offsetFlags[i].key == offsetFlag){
				return $scope.offsetFlags[i].text;
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
    
    $scope.transSeatSystem = function (seatSystemKey){
    	for(var i = 0;i < $scope.seatSystems.length;i++){
			if($scope.seatSystems[i].key == seatSystemKey){
				return $scope.seatSystems[i].text;
			}
		}
    }*/
    
    /*$scope.tmpQuery = {};
    //4、数据初始化        
    //4.1、进入页面时调用查询方法
    $scope.find = function (queryEntity)  {
    	var startDate = queryEntity.beginDate;
    	var endDate = queryEntity.endDate;
    	$scope.listEntitys = [];
    	$scope.isQuery = true;
    	$scope.tmpQuery = angular.copy(queryEntity);
        if($scope.tmpQuery.accountID != null){
        	var accountEntity = angular.copy($scope.tmpQuery.accountID);
            delete $scope.tmpQuery.accountID;
            $scope.tmpQuery.accountID = accountEntity.accountID;
            $scope.tmpQuery.instClientID = accountEntity.instClientID;
        }
        if($scope.tmpQuery.beginDate > $scope.tmpQuery.endDate){
    		layer.msg('开始日期不能大于结束日期！！', {
				icon : 2
			});
    		$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
			return false;
    	}
        
    	if($scope.tmpQuery.searchType == "1"){
    		$scope.showID1 = $scope.searchTypes[0].text;
    		if($scope.tmpQuery.accountID == undefined || $scope.tmpQuery.accountID == ""){
    			findHisTradeAllCapitalByQuery(function (result){
        		    $scope.sumTradeVolume = 0;
        		    $scope.sumUsedFee = 0;
        			if(result.length > 0){
        				for(var i = 0;i < result.length;i++){
        					$scope.tmpEntity = {};
        					$scope.tmpEntity.settleDate = result[i].settleDate;
        					$scope.tmpEntity.tradeDate = result[i].tradeDate;
        					$scope.tmpEntity.tradeTime = result[i].tradeTime;
        					$scope.tmpEntity.tradeTime = result[i].tradeTime;
        					$scope.tmpEntity.tradeID = result[i].tradeID;
        					$scope.tmpEntity.accountID = result[i].accountID;
        					$scope.tmpEntity.investorID = result[i].investorID;
        					$scope.tmpEntity.exchID = result[i].exchID;
        					$scope.tmpEntity.instrumentID = result[i].instrumentID;
        					$scope.tmpEntity.direction = result[i].direction;
        					$scope.tmpEntity.offsetFlag = result[i].offsetFlag;
        					$scope.tmpEntity.hedgeFlag = result[i].hedgeFlag;
        					$scope.tmpEntity.tradeVolume = result[i].tradeVolume;
        					$scope.tmpEntity.tradePrice = result[i].tradePrice;
        					$scope.tmpEntity.orderSysID = result[i].orderSysID;
        					$scope.tmpEntity.seatID = result[i].seatID;
        					$scope.tmpEntity.seatSystem = result[i].seatSystem;
        					$scope.tmpEntity.usedFee = result[i].usedFee;
        					$scope.tmpEntity.brokerid = result[i].brokerid;
        					$scope.tmpEntity.tradeUser = result[i].tradeUser;
        					$scope.tmpEntity.investManager = result[i].investManager;
        					$scope.tmpEntity.investAdviser = result[i].investAdviser;
        					$scope.listEntitys.push($scope.tmpEntity);
        					$scope.sumTradeVolume+=result[i].tradeVolume;
        					$scope.sumUsedFee+=result[i].usedFee;
        				}
        				for(var i = 0;i < $scope.capitalAccountEntitys.length;i++){
        					for(var t = 0;t < $scope.listEntitys.length;t++){
        						if($scope.capitalAccountEntitys[i].accountID == $scope.listEntitys[t].investorID && 
        								$scope.capitalAccountEntitys[i].instClientID == $scope.listEntitys[t].brokerid){
        							$scope.listEntitys[t].accountName = $scope.capitalAccountEntitys[i].accountName;
        							continue;
            	    			}
        					}
        	    		}
        			}
        		},{
        			instrumentID: $scope.tmpQuery.instrumentID
        		}, startDate, endDate);
    		}else{
    			findHisTradeByQuery(function (result){
        		    $scope.sumTradeVolume = 0;
        		    $scope.sumUsedFee = 0;
        			if(result.length > 0){
        				for(var i = 0;i < result.length;i++){
        					$scope.tmpEntity = {};
        					$scope.tmpEntity.settleDate = result[i].settleDate;
        					$scope.tmpEntity.tradeDate = result[i].tradeDate;
        					$scope.tmpEntity.tradeTime = result[i].tradeTime;
        					$scope.tmpEntity.tradeID = result[i].tradeID;
        					$scope.tmpEntity.accountID = result[i].accountID;
        					$scope.tmpEntity.investorID = result[i].investorID;
        					$scope.tmpEntity.exchID = result[i].exchID;
        					$scope.tmpEntity.instrumentID = result[i].instrumentID;
        					$scope.tmpEntity.direction = result[i].direction;
        					$scope.tmpEntity.offsetFlag = result[i].offsetFlag;
        					$scope.tmpEntity.hedgeFlag = result[i].hedgeFlag;
        					$scope.tmpEntity.tradeVolume = result[i].tradeVolume;
        					$scope.tmpEntity.tradePrice = result[i].tradePrice;
        					$scope.tmpEntity.orderSysID = result[i].orderSysID;
        					$scope.tmpEntity.seatID = result[i].seatID;
        					$scope.tmpEntity.seatSystem = result[i].seatSystem;
        					$scope.tmpEntity.usedFee = result[i].usedFee;
        					$scope.tmpEntity.brokerid = result[i].brokerid;
        					$scope.tmpEntity.tradeUser = result[i].tradeUser;
        					$scope.tmpEntity.investManager = result[i].investManager;
        					$scope.tmpEntity.investAdviser = result[i].investAdviser;
        					$scope.listEntitys.push($scope.tmpEntity);
        					$scope.sumTradeVolume+=result[i].tradeVolume;
        					$scope.sumUsedFee+=result[i].usedFee;
        				}
        				for(var i = 0;i < $scope.capitalAccountEntitys.length;i++){
        					for(var t = 0;t < $scope.listEntitys.length;t++){
        						if($scope.capitalAccountEntitys[i].accountID == $scope.listEntitys[t].investorID && 
        								$scope.capitalAccountEntitys[i].instClientID == $scope.listEntitys[t].brokerid){
        							$scope.listEntitys[t].accountName = $scope.capitalAccountEntitys[i].accountName;
        							continue;
            	    			}
        					}
        	    		}
        				$scope.$apply();
        			}
        		},{
        			investorID: $scope.tmpQuery.accountID,
        			instrumentID: $scope.tmpQuery.instrumentID,
        			brokerageFirmID: $scope.tmpQuery.instClientID
        		}, startDate, endDate);
    		}
    	}else if ($scope.tmpQuery.searchType == "2"){
    		$scope.showID1 = $scope.searchTypes[1].text;
    		if($scope.tmpQuery.accountID == undefined || $scope.tmpQuery.accountID == ""){
    			findHisTradeAllTraderByQuery(function (result){
        		    $scope.sumTradeVolume = 0;
        		    $scope.sumUsedFee = 0;
        			if(result.length > 0){
        				for(var i = 0;i < result.length;i++){
        					$scope.tmpEntity = {};
        					$scope.tmpEntity.settleDate = result[i].settleDate;
        					$scope.tmpEntity.tradeDate = result[i].tradeDate;
        					$scope.tmpEntity.tradeTime = result[i].tradeTime;
        					$scope.tmpEntity.tradeID = result[i].tradeID;
        					$scope.tmpEntity.accountID = result[i].accountID;
        					$scope.tmpEntity.investorID = result[i].investorID;
        					$scope.tmpEntity.exchID = result[i].exchID;
        					$scope.tmpEntity.instrumentID = result[i].instrumentID;
        					$scope.tmpEntity.direction = result[i].direction;
        					$scope.tmpEntity.offsetFlag = result[i].offsetFlag;
        					$scope.tmpEntity.hedgeFlag = result[i].hedgeFlag;
        					$scope.tmpEntity.tradeVolume = result[i].tradeVolume;
        					$scope.tmpEntity.tradePrice = result[i].tradePrice;
        					$scope.tmpEntity.orderSysID = result[i].orderSysID;
        					$scope.tmpEntity.seatID = result[i].seatID;
        					$scope.tmpEntity.seatSystem = result[i].seatSystem;
        					$scope.tmpEntity.usedFee = result[i].usedFee;
        					$scope.tmpEntity.brokerid = result[i].brokerid;
        					$scope.tmpEntity.investAdviser = result[i].investAdviser;
        					$scope.listEntitys.push($scope.tmpEntity);
        					$scope.sumTradeVolume+=result[i].tradeVolume;
        					$scope.sumUsedFee+=result[i].usedFee;
        				}
        				for(var i = 0;i < $scope.TraderEntitys.length;i++){
        					for(var t = 0;t < $scope.listEntitys.length;t++){
        						if($scope.TraderEntitys[i].accountID == $scope.listEntitys[t].investorID && 
        								$scope.TraderEntitys[i].instClientID == $scope.listEntitys[t].brokerid){
        							$scope.listEntitys[t].accountName = $scope.TraderEntitys[i].accountName;
        							continue;
            	    			}
        					}
        	    		}
        			}
        		},{
        			instrumentID: $scope.tmpQuery.instrumentID
        		}, startDate, endDate);
    		}else{
    			findHisTradeBySubQuery(function (result){
        		    $scope.sumTradeVolume = 0;
        		    $scope.sumUsedFee = 0;
        			if(result.length > 0){
        				for(var i = 0;i < result.length;i++){
        					$scope.tmpEntity = {};
        					$scope.tmpEntity.settleDate = result[i].settleDate;
        					$scope.tmpEntity.tradeDate = result[i].tradeDate;
        					$scope.tmpEntity.tradeTime = result[i].tradeTime;
        					$scope.tmpEntity.tradeID = result[i].tradeID;
        					$scope.tmpEntity.accountID = result[i].accountID;
        					$scope.tmpEntity.investorID = result[i].investorID;
        					$scope.tmpEntity.exchID = result[i].exchID;
        					$scope.tmpEntity.instrumentID = result[i].instrumentID;
        					$scope.tmpEntity.direction = result[i].direction;
        					$scope.tmpEntity.offsetFlag = result[i].offsetFlag;
        					$scope.tmpEntity.hedgeFlag = result[i].hedgeFlag;
        					$scope.tmpEntity.tradeVolume = result[i].tradeVolume;
        					$scope.tmpEntity.tradePrice = result[i].tradePrice;
        					$scope.tmpEntity.orderSysID = result[i].orderSysID;
        					$scope.tmpEntity.seatID = result[i].seatID;
        					$scope.tmpEntity.seatSystem = result[i].seatSystem;
        					$scope.tmpEntity.usedFee = result[i].usedFee;
        					$scope.tmpEntity.brokerid = result[i].brokerid;
        					$scope.tmpEntity.investAdviser = result[i].investAdviser;
        					$scope.listEntitys.push($scope.tmpEntity);
        					$scope.sumTradeVolume+=result[i].tradeVolume;
        					$scope.sumUsedFee+=result[i].usedFee;
        				}
        				for(var i = 0;i < $scope.TraderEntitys.length;i++){
        					for(var t = 0;t < $scope.listEntitys.length;t++){
        						if($scope.TraderEntitys[i].accountID == $scope.listEntitys[t].investorID && 
        								$scope.TraderEntitys[i].instClientID == $scope.listEntitys[t].brokerid){
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
        		}, startDate, endDate);
    		}
    	}
    	$timeout(function() {
            $scope.isQuery = false;
        }, 1000);
    };
    */
    
    $scope.operTradeQuery = function ( opts ) {
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
                findAllHisByQueryInMapper($scope.tmpQuery, requestParams, $scope.orderType, $scope.orderWay, function(result){
                    var con = result.content;
                    $scope.result = con;
                  
                    for(var i = 0; i<con.length;i++){
                    	if(con[i].direction=="0"){
                    		con[i].direction="买";
                    	}else{
                    		con[i].direction="卖";
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
                        
                        if (con[i].hedgeFlag=="1"){
                    		con[i].hedgeFlag="投机";
                    	} else if (con[i].hedgeFlag=="2"){
                    		con[i].hedgeFlag="套利";
                    	} else if (con[i].hedgeFlag=="3"){
                    		con[i].hedgeFlag="套保";
                    	} else if (con[i].hedgeFlag=="4"){
                    		con[i].hedgeFlag="做市商";
                    	}
                	var tempArr = [con[i].settleDate , con[i].tradeDate, con[i].tradeTime,con[i].tradeID,con[i].investorID,con[i].accountName,con[i].instClientName,
                                   con[i].exchID,con[i].instrumentID, con[i].direction, con[i].offsetFlag,
                                   con[i].hedgeFlag, con[i].tradeVolume,con[i].tradePrice, con[i].orderSysID, con[i].usedFee, 
                                   con[i].tradeUser,con[i].investManager,con[i].investAdviser];
                    tempArray.push(tempArr);
                    }
                    var json = {
                        "draw":request.draw,
                        "recordsTotal":result.totalRecord,
                        "recordsFiltered":result.totalRecord,
                        "data":tempArray,
                        "column":[19]
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
	var table = $('#hisTrade_table').DataTable( {
 	columns :[   
				{ title: "结算日期" },
				{ title: "报单日期" },
				{ title: "成交时间" },
				{ title: "成交号" },
				{ title: "账号" },
				{ title: "账号名称" },
				{ title: "所属机构" },
				{ title: "交易所代码" },
				{ title: "合约代码" },
				{ title: "买卖" },
				{ title: "开平" },
				{ title: "交易类型" },
				{ title: "成交量" },
				{ title: "成交价" },
				{ title: "报单编号" },
				{ title: "手续费" },
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
     "ajax": $scope.operTradeQuery({}),
     "scrollY": 360,
     "scrollCollapse":true,
	 "scrollX": true,
	 "footerCallback": function () {
		 $scope.api = this.api();
		  $timeout(function() {
			  
		    	 $($(".dataTables_scrollFoot .hisTradefoot tr")[0].childNodes[12]).html(
		    			 $scope.api.column( 12, {page:'current'} ).data().sum());
		    	 $($(".dataTables_scrollFoot .hisTradefoot tr")[0].childNodes[13]).html(
		    			 $scope.api.column( 13, {page:'current'} ).data().sum().toFixed(3));
		    	 $($(".dataTables_scrollFoot .hisTradefoot tr")[0].childNodes[15]).html(
		    			 $scope.api.column( 15, {page:'current'} ).data().sum()); 
		    
		         },"200")
		         
		  }
      
} );

}

// 查询(后台分页)
$scope.find = function(queryEntity){
	$scope.isQuery = true;
	$scope.tmpQuery=angular.copy(queryEntity);
	if($scope.tmpQuery.accountID != null){
    	var accountEntity = angular.copy($scope.tmpQuery.accountID);
        delete $scope.tmpQuery.accountID;
        $scope.tmpQuery.investorID = accountEntity.accountID;
        $scope.tmpQuery.brokerid = accountEntity.instClientID;
    }
	if($scope.tmpQuery.beginDate > $scope.tmpQuery.endDate){
		layer.msg('开始日期不能大于结束日期！！', {
			icon : 2
		});
		$timeout(function() {
            $scope.isQuery = false;
        }, 1000);
		return false;
	}
	var table = $('#hisTrade_table').DataTable();
    table.draw();
    $timeout(function() {
    	  $scope.isQuery = false;
	}, 500);
}
//导出excel
$scope.exportExcelHT = function (queryEntity) {
	$scope.tmpQuery=angular.copy(queryEntity);
	if($scope.tmpQuery.accountID != null){
   	var accountEntity = angular.copy($scope.tmpQuery.accountID);
       delete $scope.tmpQuery.accountID;
       $scope.tmpQuery.investorID = accountEntity.accountID;
       $scope.tmpQuery.brokerid = accountEntity.instClientID;
   }
	framework.file.export("历史成交查询.xls",'excel',{
		entityKey:[ 'settleDate','tradeDate',
		           'tradeTime','tradeID','investorID','accountName','instClientName',
		           'exchID', 'instrumentID','direction','offsetFlag','hedgeFlag',
		           'tradeVolume', 'tradePrice','orderSysID','usedFee','tradeUser',
		           'investManager','investAdviser'],
   
		headerKey:['结算日期','报单日期',
		           '成交时间','成交号','账号','账号名称','所属机构',
		           '交易所代码','合约代码','买卖','开平','交易类型',
		           '成交量','成交价','报单编号','手续费', '交易员',
		           '投资经理','投资助理'],
		styles:['plainText','plainText',
		        'plainText','plainText','plainText','plainText','plainText',
		        'plainText','plainText','plainText','plainText','plainText',
		        'plainText','plainText','plainText','plainText','plainText',
		        'plainText','plainText'],
		title:"历史成交查询",
		dicMap:{direction:{'0':"买",'1':"卖"},hedgeFlag:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}
		,offsetFlag:{'0':"开仓",'1':"平仓",'2':"强平",'3':"平今",'4':"平昨"}}
	},"hisTradeService","exportExcelHT",$scope.tmpQuery);
};
    
    
});

