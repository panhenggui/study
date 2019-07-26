	myapp.controller('HisOrderServiceController', function ($scope, $timeout) {
	 $scope.queryEntity = {
	    		accountID:"",
	    		instrumentID:"",
	    		brokerageFirmID:"",
	     		orderStatus:"",
	     		beginDate:"",
	     		endDate:"",
	    		searchType:""
	    };    //实际查询对象
	    $scope.tmpQuery={
	    		accountID:"",
	     		instrumentID:"",
	     		brokerageFirmID:"",
	     		orderStatus:"",
	     		beginDate:"",
	     		endDate:"",
	    		searchType:"1"};
	
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});	
	
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
	$scope.searchTypes = clearConstant.operClientPositon_searchType;	//查询方式下拉框内容
	$scope.orderStatus=clearConstant.orderStatus;//报单状态
	$scope.directions = clearConstant.tradeDirection;//买卖
	$scope.offsetFlags = clearConstant.offsetFlag;//开平
	$scope.traderTypes = clearConstant.tradeTypes;//交易所类型
	$scope.investorTypes = clearConstant.investorType;//投资者类型
	//2、定义页面数据模型
    $scope.queryEntity = {};    //实际查询对象
    $scope.queryEntity.beginDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());
	$scope.capitalAccountEntitys = [];			//所有资金帐号
    $scope.TraderEntitys = [];					//所有资产单元
    $scope.queryAccountEntitys = [];			//查询帐号下拉框内容
    $scope.queryEntity.searchType = $scope.searchTypes[0].key;
    $scope.tmpEntity = {};
    $scope.listEntitys = [];
    $scope.showID = $scope.searchTypes[0].text;
    $scope.showID1 = $scope.searchTypes[0].text;
    $scope.sumVolumeTraded = 0;//申请量
    $scope.sumVolume = 0;//申请量
    $scope.count = 0;    
    $scope.isShow = {};//资产单元 隐藏自报单编号 和下单席位号
    
    $scope.hisOrder_export = isShow("hisOrder_export");
	$scope.hisOrder_query = isShow("hisOrder_query");
	  
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
    
    //初始化机构信息
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
    }
	
   
//    $scope.queryEntity.orderStatus = $scope.orderStatus[0].key;
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
    
   /* //-------------------------------------------
    $scope.tmpQuery = {};
    $scope.find = function (queryEntity)  {
    	$scope.isShow = queryEntity.searchType;
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
    	if($scope.tmpQuery.searchType=="1"){
    		$scope.showID1 = $scope.searchTypes[0].text;
    		if($scope.tmpQuery.accountID == undefined || $scope.tmpQuery.accountID == ""){
    			findHisOrderAllCapitalByQuery(function(result){
	    			$scope.sumVolumeTraded = 0;//申请量
	    		    $scope.sumVolume = 0;//申请量
	    		    $scope.count=0;
	    			$scope.listEntitys =result;
	    			if(result.length>0){
	    	    		for(i=0;i<result.length;i++){
	    	        		$scope.sumVolumeTraded+=result[i].volumeTraded;
	    	        		$scope.sumVolume+= result[i].volume;
	    	        		$scope.count+=1;
	    	        	}
	    	    	}
//	    			for(var i = 0;i < $scope.capitalAccountEntitys.length;i++){
//    					for(var t = 0;t < $scope.listEntitys.length;t++){
//    						if($scope.capitalAccountEntitys[i].accountID == $scope.listEntitys[t].investorID && 
//    								$scope.capitalAccountEntitys[i].instClientID == $scope.listEntitys[t].brokerageFirmID){
//    							$scope.listEntitys[t].accountName = $scope.capitalAccountEntitys[i].accountName;
//    							continue;
//        	    			}
//    					}
//    	    		}
	    			$scope.$apply();
	    		},{instrumentID:$scope.tmpQuery.instrumentID,
	    			orderStatus:$scope.tmpQuery.orderStatus,
	    			investorType:"1"},
	    		$scope.tmpQuery.beginDate,$scope.tmpQuery.endDate);
    		}else{
    			findHisOrderAllCapitalByQuery(function(result){
	    			$scope.sumVolumeTraded = 0;//申请量
	    		    $scope.sumVolume = 0;//申请量
	    		    $scope.count=0;
	    			$scope.listEntitys =result;
	    			if(result.length>0){
	    	    		for(i=0;i<result.length;i++){
	    	        		$scope.sumVolumeTraded+=result[i].volumeTraded;
	    	        		$scope.sumVolume+= result[i].volume;
	    	        		$scope.count+=1;
	    	        	}
	    	    	}
//	    			for(var i = 0;i < $scope.capitalAccountEntitys.length;i++){
//    					for(var t = 0;t < $scope.listEntitys.length;t++){
//    						if($scope.capitalAccountEntitys[i].accountID == $scope.listEntitys[t].investorID && 
//    								$scope.capitalAccountEntitys[i].instClientID == $scope.listEntitys[t].brokerageFirmID){
//    							$scope.listEntitys[t].accountName = $scope.capitalAccountEntitys[i].accountName;
//    							continue;
//        	    			}
//    					}
//    	    		}
	    			$scope.$apply();
	    		},{accountID:$scope.tmpQuery.accountID,
	    			instrumentID:$scope.tmpQuery.instrumentID,
	    			orderStatus:$scope.tmpQuery.orderStatus,
	    			brokerageFirmID: $scope.tmpQuery.instClientID,
	    			investorType:"1"},
	    		$scope.tmpQuery.beginDate,$scope.tmpQuery.endDate);
    		}
    	}else if($scope.tmpQuery.searchType=="2"){
    		$scope.showID1 = $scope.searchTypes[1].text;
    		if($scope.tmpQuery.accountID == undefined || $scope.tmpQuery.accountID == ""){
    			findHisOrderAllTraderByQuery(function(result){
	    			$scope.sumVolumeTraded = 0;//申请量
	    		    $scope.sumVolume = 0;//申请量
	    		    $scope.count=0;//一共多少笔
	    			$scope.listEntitys =result;
	    			if(result.length>0){
	    	    		for(i=0;i<result.length;i++){
	    	        		$scope.sumVolumeTraded+=result[i].volumeTraded;
	    	        		$scope.sumVolume+= result[i].volume;
	    	        		$scope.count+=1;
	    	        	}
	    	    	}
	    			for(var i = 0;i < $scope.TraderEntitys.length;i++){
    					for(var t = 0;t < $scope.listEntitys.length;t++){
    						if($scope.TraderEntitys[i].accountID == $scope.listEntitys[t].investorID && 
    								$scope.TraderEntitys[i].instClientID == $scope.listEntitys[t].brokerageFirmID){
    							$scope.listEntitys[t].accountName = $scope.TraderEntitys[i].accountName;
    							continue;
        	    			}
    					}
    	    		}
	    			$scope.$apply();
	    		},{instrumentID:$scope.tmpQuery.instrumentID,
	    			orderStatus:$scope.tmpQuery.orderStatus,
	    			investorType:"2"},
	    			$scope.tmpQuery.beginDate,$scope.tmpQuery.endDate);
    		}else{
    			findByQueryHisOrder(function(result){
	    			$scope.sumVolumeTraded = 0;//申请量
	    		    $scope.sumVolume = 0;//申请量
	    		    $scope.count=0;//一共多少笔
	    			$scope.listEntitys =result;
	    			if(result.length>0){
	    	    		for(i=0;i<result.length;i++){
	    	        		$scope.sumVolumeTraded+=result[i].volumeTraded;
	    	        		$scope.sumVolume+= result[i].volume;
	    	        		$scope.count+=1;
	    	        	}
	    	    	}
	    			for(var i = 0;i < $scope.TraderEntitys.length;i++){
    					for(var t = 0;t < $scope.listEntitys.length;t++){
    						if($scope.TraderEntitys[i].accountID == $scope.listEntitys[t].investorID && 
    								$scope.TraderEntitys[i].instClientID == $scope.listEntitys[t].brokerageFirmID){
    							$scope.listEntitys[t].accountName = $scope.TraderEntitys[i].accountName;
    							continue;
        	    			}
    					}
    	    		}
	    			$scope.$apply();
	    		},{accountID:$scope.tmpQuery.accountID,
	    			instrumentID:$scope.tmpQuery.instrumentID,
	    			orderStatus:$scope.tmpQuery.orderStatus,
	    			brokerageFirmID: $scope.tmpQuery.instClientID,
	    			investorType:"2"},
	    			$scope.tmpQuery.beginDate,$scope.tmpQuery.endDate);
    		}
    	}
    	$timeout(function() {
            $scope.isQuery = false;
        }, 1000);
    };
    */
    
   /* //买卖
    $scope.transDirection = function (direction){
    	for(var i = 0;i < $scope.directions.length;i++){
			if($scope.directions[i].key == direction){
				return $scope.directions[i].text;
			}
		}
    }
    //开平
    $scope.transOffsetFlag = function (offsetFlag){
    	for(var i = 0;i < $scope.offsetFlags.length;i++){
    		if($scope.offsetFlags[i].key == offsetFlag){
    			return $scope.offsetFlags[i].text;
    		}
    	}
    }
    //报单状态
    $scope.transOrderStatus = function (orderStatusl){
    	for(var i = 0;i < $scope.orderStatus.length;i++){
    		if($scope.orderStatus[i].key == orderStatusl){
    			return $scope.orderStatus[i].text;
    		}
    	}
    }
    //交易类型
    $scope.transTradeType = function (tradeType){
    	for(var i = 0;i < $scope.traderTypes.length;i++){
			if($scope.traderTypes[i].key == tradeType){
				return $scope.traderTypes[i].text;
			}
		}
    }
    //投资者类型
    $scope.transInvestorType = function (investorType){
    	for(var i = 0;i < $scope.investorTypes.length;i++){
    		if($scope.investorTypes[i].key == investorType){
    			return $scope.investorTypes[i].text;
    		}
    	}
    }*/
    
    $scope.hisOrderQuery = function ( opts ) {
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
                findAllHisOrderQueryInMapper($scope.tmpQuery, requestParams, $scope.orderType, $scope.orderWay, function(result){
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
                        if(con[i].orderStatus=="0"){
                    		con[i].orderStatus="全部成交";
                    	} else if (con[i].orderStatus=="1"){
                    		con[i].orderStatus="部分成交还在队列中";
                    	} else if (con[i].orderStatus=="2"){
                    		con[i].orderStatus="部分成交不在队列中";
                    	} else if (con[i].orderStatus=="3"){
                    		con[i].orderStatus="未成交还在队列中";
                    	} else if (con[i].orderStatus=="4"){
                    		con[i].orderStatus="未成交不在队列中";
                    	} else if (con[i].orderStatus=="5"){
                    		con[i].orderStatus="撤单";
                    	} else if (con[i].orderStatus=="6"){
                    		con[i].orderStatus="订单已报入交易所未应答";
                    	} else if (con[i].orderStatus=="7"){
                    		con[i].orderStatus="部分撤单";
                    	} 
                    	var tempArr = [con[i].settleDate ,con[i].tradingDay , con[i].orderSysID,con[i].insertTime,con[i].accountID,
                                       con[i].accountName,con[i].instClientName, con[i].instrumentID,
                                       con[i].direction, con[i].offsetFlag,con[i].limitPrice,
                                       con[i].volume, con[i].volumeTraded, con[i].orderStatus,
                                       con[i].exchID, con[i].hedgeFlag, con[i].eachFee,
                                       con[i].eachMargin, con[i].tradeUser,con[i].investManager,
                                       con[i].userID,con[i].subOrderSysID, con[i].cancelUserID,con[i].cancelTime, con[i].seatID,
                                       con[i].ipAddress, con[i].macAddress,con[i].errorMsg ];
                        tempArray.push(tempArr);
                    }
                	var json = {
                            "draw":request.draw,
                            "recordsTotal":result.totalRecord,
                            "recordsFiltered":result.totalRecord,
                            "data":tempArray,
                            "column":[28]
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

	var table = $('#hisOrder_table').DataTable( {
	 	columns :[ 
					{ title: "结算日期" },
					{ title: "报单日期" },
					{ title: "报单编号" },
					{ title: "申报时间" },
					{ title: "账号" },
					{ title: "账号名称" },
					{ title: "所属机构" },
					{ title: "合约代码" },
					{ title: "买卖" },
					{ title: "开平" },
					{ title: "委托价格" },
					{ title: "申报量" },
					{ title: "成交量" },
					{ title: "报单状态" },
					{ title: "交易所代码" },
					{ title: "交易类型" },
					{ title: "冻结手续费" },
					{ title: "冻结保证金" },
					{ title: "交易员" },
					{ title: "投资经理" },
					{ title: "投资助理" },
					{ title: "子报单编号" },
					{ title: "撤单用户" },
					{ title: "撤单时间" },
					{ title: "下单席位号" },
					{ title: "IP地址" },
					{ title: "MAC地址" },
					{ title: "备注" }
		
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
	     "ajax": $scope.hisOrderQuery({}),
	     "scrollY": 360,
	     "scrollCollapse":true,
		 "scrollX": true,
		 "footerCallback": function () {
			 $scope.api = this.api();
			  $timeout(function() {
				  
			    	 $($(".dataTables_scrollFoot .hisOrderFoot tr")[0].childNodes[11]).html(
			    			 $scope.api.column( 11, {page:'current'} ).data().sum());
			    	 $($(".dataTables_scrollFoot .hisOrderFoot tr")[0].childNodes[12]).html(
			    			 $scope.api.column( 12, {page:'current'} ).data().sum());
			    
			         },"200")  
			  }
	} );	
}

// 查询(后台分页)
$scope.find = function(queryEntity){
	$scope.isQuery = true;
    $scope.isShow = $scope.queryEntity.searchType;
	$scope.tmpQuery=angular.copy(queryEntity);
	if($scope.tmpQuery.accountID != null){
    	var accountEntity = angular.copy($scope.tmpQuery.accountID);
        delete $scope.tmpQuery.accountID;
        $scope.tmpQuery.accountID = accountEntity.accountID;
        $scope.tmpQuery.brokerageFirmID = accountEntity.instClientID;
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
   
	var table = $('#hisOrder_table').DataTable();
    table.draw();
    $timeout(function() {
    	  $scope.isQuery = false;
	}, 500);
}
//导出excel
$scope.exportExcelHO = function (queryEntity) {
	$scope.tmpQuery=angular.copy(queryEntity);
	if($scope.tmpQuery.accountID != null){
   	var accountEntity = angular.copy($scope.tmpQuery.accountID);
       delete $scope.tmpQuery.accountID;
       $scope.tmpQuery.accountID = accountEntity.accountID;
       $scope.tmpQuery.brokerageFirmID = accountEntity.instClientID;
   }
	framework.file.export("历史委托查询.xls",'excel',{
		entityKey:['settleDate','tradingDay',
		           'orderSysID','insertTime','accountID','accountName','instClientName',
		           'instrumentID','direction','offsetFlag','limitPriceStr','volumeStr',
		           'volumeTradedStr','orderStatus','exchID','hedgeFlag','eachFeeStr',
		           'eachMarginStr','investorAdvisor','investorManager','userID','subOrderSysID',
		           'cancelUserID','cancelTime','seatID','ipAddress','macAddress', 'errorMsg'],
		           
		headerKey:['结算日期','报单日期',
		           '报单编号','申报时间','账号','账号名称','所属机构',
		           '合约代码','买卖','开平','委托价格','申报量',
		           '成交量','报单状态', '交易所代码','交易类型','冻结手续费',
		           '冻结保证金','交易员', '投资经理','投资助理','子报单编号',
		           '撤单用户','撤单时间', '下单席位号','IP地址','MAC地址','备注'],
       styles:['plainText','plainText',
               'plainText','plainText','plainText','plainText','plainText',
		        'plainText','plainText','plainText','plainText','plainText',
		        'plainText','plainText','plainText','plainText','plainText',
		        'plainText','plainText','plainText','plainText','plainText',
		        'plainText','plainText','plainText','plainText','plainText',
		        'plainText'],
		title:"历史委托查询",
		
		dicMap:{direction:{'0':"买",'1':"卖"},hedgeFlag:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}
        ,offsetFlag:{'0':"开仓",'1':"平仓",'2':"强平",'3':"平今",'4':"平昨"}
		,orderStatus:{'0':"全部成交",'1':"部分成交还在队列中",'2':"部分成交不在队列中",'3':"未成交还在队列中",'4':"未成交不在队列中",'5':"撤单",'6':"订单已报入交易所未应答",'7':"部分撤单"}}
	},"hisOrderService","exportExcelHO",$scope.tmpQuery);
};
});

