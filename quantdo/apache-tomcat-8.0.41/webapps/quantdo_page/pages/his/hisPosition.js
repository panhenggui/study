myapp.controller('HisPositionQueryController', function ($scope, $timeout,$rootScope) {
	
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});
	
    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;

	$scope.queryEntity = {
			settleStartDate:"",
			settleEndDate:"",
    		accountID:"",
    		instrumentID:"",
    		combTradeType:"1",
    		productType:"",
    		searchType:""
    };    //实际查询对象
    $scope.tmpQuery={
    		instClientID:"",
    		settleStartDate: clearConstant.formatDate(new Date()),
			settleEndDate: clearConstant.formatDate(new Date()),
    		accountID:"",
     		instrumentID:"",
     		productType:"1",
     		combTradeType:"1",
    		searchType:"1"};
    
    $scope.instClientList = null;
    $scope.instClientlistEntitys = [];
    getInstClientQueryConditionList(function(result){
    	$scope.instClientList = angular.copy(result);
    });
    
    $scope.searchTypes = clearConstant.operClientPositon_searchType;	//查询方式下拉框内容
    $scope.productTypes = clearConstant.position_productTypes;
    $scope.showID = $scope.searchTypes[0].text;
    $scope.capitalAccountEntitys = [];			//所有资金帐号
    $scope.TraderEntitys = [];					//所有资产单元
    $scope.queryAccountEntitys = [];			//查询帐号下拉框内容
    $scope.traderTypes = clearConstant.tradeTypes;		//交易类型
    $scope.directions = clearConstant.tradeDirection;	//买卖
    $scope.combTradeTypes = clearConstant.combTradeTypes;	//组合类型
    $scope.listEntitys = [];
    $scope.listEntity = {};
    $scope.sumPosition = 0;
    $scope.sumUsedMargin = 0;
    $scope.tmpEntity = {};
    $scope.hisPositionQuery_export = isShow("hisPositionQuery_export");
    $scope.hisPositionQuery_query = isShow("hisPositionQuery_query");
    $scope.instClientID = '';  
    
    
    //获取所属投资机构
    queryAmType(function (result) {
        $scope.amType = result;
        if(result != null && result == '1'){
        	$scope.isMom = false;
        }else{
        	$scope.isMom = true;
        }
        $scope.isCom =false;
        $scope.$apply();
    });
    
    queryInstClientID(function (result) {
        $scope.instClientID = result;
        $scope.queryEntity={};
        if($scope.instClientID != undefined ){
        	 $scope.isInstClient = true;
        	 $scope.queryEntity.instClientID=$scope.instClientID;
        	 $scope.$apply();
        	 if(!$scope.isMom){//FOF机构
        		 $scope.isSearchType = false; 
        	 }else{
        		 $scope.queryEntity.searchType = $scope.searchTypes[0].key;
             	 $scope.isSearchType = true;
        	 }
        	 $scope.queryEntity.combTradeType = $scope.combTradeTypes[0].key;
        	 $scope.queryEntity.settleStartDate = clearConstant.formatDate(new Date());
        	 $scope.queryEntity.settleEndDate= clearConstant.formatDate(new Date());
        }else{
        	$scope.isInstClient = false;
        	$scope.queryEntity.searchType = $scope.searchTypes[0].key;
        	$scope.isSearchType = true;
        	$scope.queryEntity.combTradeType = $scope.combTradeTypes[0].key;
        	$scope.queryEntity.settleStartDate = clearConstant.formatDate(new Date());
       	 	$scope.queryEntity.settleEndDate= clearConstant.formatDate(new Date());
        }
        $scope.$apply();
    });
    
    
$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
	
	//初始化机构信息
	$scope.instClientService.findByQuery(function (result) {
	    $scope.instClientlistEntitys = result;
	    $scope.$apply();
/*	    if($scope.instClientlistEntitys.length > 1){
    		$scope.queryEntity.instClientID = "";
    	}else{
    		$scope.queryEntity.instClientID = $scope.instClientlistEntitys[0].instClientID;
    	}
	    queryInstClientID(function(result){
	    	if(result != undefined){
	    		$scope.noInst = true;
	    	}else{
	    		$scope.noInst = false;
	    	}
	    	$scope.$apply();
	    });*/
	},{});
 
    //机构名称转换
	$scope.transInstClient = function (instClientID) {
	    for(var i = 0;i < $scope.instClientlistEntitys.length; i++){
	        if($scope.instClientlistEntitys[i].instClientID == instClientID){
	  	        return $scope.instClientlistEntitys[i].instClientAbbrName;
	 	    }
	    }
	}
    
    
    $scope.showInstrumentID = "合约代码";
    $scope.changeTradeType = function(){

		//资金账号
		if($scope.queryEntity.combTradeType == 2){
			$scope.showInstrumentID = "组合合约代码";
			
		} else if($scope.queryEntity.combTradeType == 1){
			$scope.showInstrumentID = "合约代码";
		}
	}
    
    
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
    
    $scope.changeInstClient = function(){
    	if("" == $scope.queryEntity.instClientID){
    		$scope.queryEntity.instClientID = null;
    	}
		//资金账号
		if($scope.queryEntity.searchType == 1){
			$scope.showID = "资金账号";
			//查询资金账号
			findCapitalAccountByQuery({"brokerageFirmID":$scope.queryEntity.instClientID}, function(result){
				pushEntitys(result, 1);
				$scope.$apply();
			});
		} else if($scope.queryEntity.searchType == 2){ //资产单元
			$scope.showID = "资产单元";
			//查询资产单元
			findBySubCapitalAccountInfo({"instClientID":$scope.queryEntity.instClientID}, function(result){
				pushEntitys(result, 2);
				$scope.$apply();
			});
		}
	}
    
    function pushEntitys(s, type){
		$scope.tEntitys = [];
		$scope.queryAccountEntitys = new Array();
		if(type == 1){
			angular.forEach(s, function (value, index, arrays) {
				$scope.tmpEntitys = {"accountID":"", "accountName":"", "instClientID":""};
				$scope.tmpEntitys.accountID = value.innerAccountID;
				$scope.tmpEntitys.accountName = value.accountName;
				$scope.tmpEntitys.instClientID = value.instClientID;
				$scope.queryAccountEntitys.push($scope.tmpEntitys);
			});
		}else if(type == 2){
			angular.forEach(s, function (value, index, arrays) {
				$scope.tmpEntitys = {"accountID":"", "accountName":"", "instClientID":""};
				$scope.tmpEntitys.accountID = value.subAccountID;
				$scope.tmpEntitys.accountName = value.subAccountName;
				$scope.tmpEntitys.instClientID = value.instClientID;
				$scope.queryAccountEntitys.push($scope.tmpEntitys);
			});
		}
		
		$scope.$apply();
	}
    
    
    function initPage(){
    	//会话列表初始化
    	var table = $('#hisPosition_table').DataTable( {
	     	columns :[   
	     	          	{ title: "结算日" },
	    				{ title: "账号" },
	    				{ title: "账号名称" },
	    				{ title: "所属机构" },
	    				{ title: "交易所代码" },
	    				{ title: "合约代码" },
	    				{ title: "买卖" },
	    				{ title: "交易类型" },
	    				{ title: "持仓量" },
	    				{ title: "持仓均价" },
	    				{ title: "保证金" },
	    				{ title: "持仓盈亏" },
	    				{ title: "市价" }
	    			
	    		],
	         "processing": true,
	         "serverSide": true,
	          dom: 'rt<"bottom"iplB>',
			  buttons: [],
	         "bFilter": false,
	         "aaSorting" : [], // 默认的排序方式，按日期降序
	        // "aaSorting" : [[2, "asc"]], // 默认的排序方式，按日期降序
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
	         "ajax": $scope.hisPositionQuery({}),
	         //"scrollY": 360,
	         //"scrollCollapse":true,
	    	 "scrollX": true,
	    	 "footerCallback": function () {
	    		 
	    		 var api = this.api();
	    		 
	    		 $scope.hisPositionQueryService.totalHisClientPos($scope.tmpQuery, function(retrunData){
	    				if(retrunData != null && retrunData != undefined){
	    					$( api.column( 8 ).footer() ).html(parseFloat(retrunData.positionStr).toFixed(0));
	    					$( api.column( 10 ).footer() ).html("--");
	    				//	$( api.column( 10 ).footer() ).html(parseFloat(retrunData.usedMarginStr).toFixed(2));
	    				}else{
	    					$( api.column( 8 ).footer() ).html(0);
	    				//	$( api.column( 10 ).footer() ).html(0.00);
	    					$( api.column( 10 ).footer() ).html("--");

	    				}
	    			});
	    		 
	    		 
	    	/*	 $scope.apii = this.api();
	    		  $timeout(function() {
	    			  $($(".dataTables_scrollFoot .hisPositionFoot tr")[0].childNodes[8]).html(
	    		    		$scope.apii.column( 8, {page:'current'} ).data().sum());
	    		      $($(".dataTables_scrollFoot .hisPositionFoot tr")[0].childNodes[9]).html(
	    		    	    $scope.apii.column( 9, {page:'current'} ).data().sum().toFixed(3)); 
	    		   },"200")*/
	    		}
	    } );
    	
    	//会话列表初始化
    	var comtable = $('#comhisPosition_table').DataTable( {
    		columns :[   
                    { title: "结算日" },
    				{ title: "账号" },
    				{ title: "账号名称" },
    				{ title: "所属机构" },
    				{ title: "交易所代码" },
    				{ title: "组合合约代码" },
    				{ title: "买卖" },
    				{ title: "持仓量" },
    				{ title: "合约一" },
    				{ title: "合约一持仓量" },
    				{ title: "合约一保证金" },
    				{ title: "合约二" },
    				{ title: "合约二持仓量" },
    				{ title: "合约二保证金" }
    			
    		],
    	 "processing": true,
    	 "serverSide": true,
    	 "bFilter": false,
    	 dom: 'rt<"bottom"iplB>',
		 buttons: [],
    	 "aaSorting" : [], 
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
    	 "ajax": $scope.comHisClientPositionQuery({}),
    	 //"scrollY": 360,
    	 //"scrollCollapse":true,
    	 "scrollX": true,
    	 "footerCallback": function () {
    	     var api = this.api();
    		 
    	     totalComHisClientPos($scope.tmpQuery, function(retrunData){
    				if(retrunData != null && retrunData != undefined){

    					$( api.column( 10 ).footer() ).html(parseFloat(retrunData.margin1).toFixed(2));
    					$( api.column( 9 ).footer() ).html(parseFloat(retrunData.position1).toFixed(2));
    					$( api.column( 13 ).footer() ).html(parseFloat(retrunData.margin2).toFixed(2));
    					$( api.column( 12 ).footer() ).html(parseFloat(retrunData.position2).toFixed(2));
    					$( api.column( 7 ).footer() ).html(parseFloat(retrunData.position).toFixed(2));
    				}else{
    					$( api.column( 13 ).footer() ).html(0.00);
    					$( api.column( 7 ).footer() ).html(0.00);
    					$( api.column( 9 ).footer() ).html(0.00);
    					$( api.column( 10 ).footer() ).html(0.00);
    					$( api.column( 12 ).footer() ).html(0.00);
    				
    				}
    			});

    		}
    	} );
    	
    	
    	
    	
    }
    
    
    $scope.hisPositionQueryService = new com.quantdo.orgClear.service.hisPositionQueryService();
    
    $scope.hisPositionQuery = function ( opts ) {
        return function ( request, drawCallback, settings ) {        	
            var ajax          = false;
            var requestStart  = request.start;
            var drawStart     = request.start;
            var requestLength = request.length;
            var requestEnd    = requestStart + requestLength;
            var page = drawStart/requestLength + 1;
            // 获取settings中默认排序内容
            if( settings.aaSorting.length == 0 ){
            	
            	$scope.orderType =null;
            	$scope.orderWay = 2;
            }else {
            	 $scope.orderType = settings.aaSorting[0][0];
                 var orderT = settings.aaSorting[0][1];
                
                 if(orderT == "asc"){
                     $scope.orderWay = 1;
                 }else{
                     $scope.orderWay = 2;
                 }
            }
           
                request.start = requestStart;
                var requestParams = {
                    "pageNo":page,
                    "pageSize":requestLength
                }
                var tempArray =[];
                $scope.tmpQuery.brokerid = $scope.tmpQuery.instClientID;
                $scope.hisPositionQueryService.findByCondition($scope.tmpQuery, requestParams, $scope.orderType, $scope.orderWay, function(result){
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
                    	if ($scope.tmpQuery.searchType == 1){
                            var tempArr = [con[i].settleDate, con[i].accountID,con[i].accountName,con[i].instClientName,
                                con[i].exchID,con[i].instrumentID, con[i].direction,
                                con[i].hedgeFlag, con[i].position,
                                parseFloat(con[i].positionAvg).toFixed(3),
                                "--",
                               // parseFloat(con[i].positionProfit).toFixed(2),
                                "--",
                                parseFloat(con[i].lastPrice).toFixed(3)];

						}else {
                            var tempArr = [con[i].settleDate, con[i].accountID,con[i].accountName,con[i].instClientName,
                                con[i].exchID,con[i].instrumentID, con[i].direction,
                                con[i].hedgeFlag, con[i].position,
                                parseFloat(con[i].positionAvg).toFixed(3),"--","--",
                                /*parseFloat(con[i].usedMargin).toFixed(2),
                                parseFloat(con[i].positionProfit).toFixed(2),*/
                                parseFloat(con[i].lastPrice).toFixed(3)];

						}

                        tempArray.push(tempArr);
                    }
                    var json = {
                        "draw":request.draw,
                        "recordsTotal":result.totalRecord,
                        "recordsFiltered":result.totalRecord,
                        "data":tempArray,
                        "column":[12]
                    }
                    drawCallback( json );
            		
                    
                });
        }
    };
    
    $scope.comHisClientPositionQuery = function ( opts ) {
        return function ( request, drawCallback, settings ) {        	
            var ajax          = false;
            var requestStart  = request.start;
            var drawStart     = request.start;
            var requestLength = request.length;
            var requestEnd    = requestStart + requestLength;
            var page = drawStart/requestLength + 1;
            // 获取settings中默认排序内容
            if( settings.aaSorting.length == 0 ){
            	
            	$scope.orderType =null;
            	$scope.orderWay = 2;
            }else {
            	 $scope.orderType = settings.aaSorting[0][0];
                 var orderT = settings.aaSorting[0][1];
                
                 if(orderT == "asc"){
                     $scope.orderWay = 1;
                 }else{
                     $scope.orderWay = 2;
                 }
            }
                request.start = requestStart;
                var requestParams = {
                    "pageNo":page,
                    "pageSize":requestLength
                }
                var tempArray =[];
                $scope.tmpQuery.brokerid = $scope.tmpQuery.instClientID;
                findComByCondition($scope.tmpQuery, requestParams, $scope.orderType, $scope.orderWay, function(result){
                    var con = result.content;
                    $scope.result = con;
                  
                    for(var i = 0; i<con.length;i++){
	                	
                    	if(con[i].direction=="0"){
                    		con[i].direction="买";
                    	}else{
                    		con[i].direction="卖";
                    	}                        
                    	
                	var tempArr = [con[i].settleDate,con[i].accountID,con[i].accountName,con[i].brokerID, con[i].exchID,con[i].combInstrumentID,
                	               con[i].direction,   parseFloat(con[i].position).toFixed(2), con[i].instrumentID1,   parseFloat(con[i].position1).toFixed(2),   parseFloat(con[i].margin1).toFixed(2),
                	                con[i].instrumentID2,   parseFloat(con[i].position2).toFixed(2),   parseFloat(con[i].margin2).toFixed(2)];
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
    
 // 查询(后台分页)
    $scope.find = function(queryEntity){
    	$scope.isQuery = true;
    	$scope.tmpQuery=angular.copy(queryEntity);
    	if($scope.tmpQuery.accountID != null){
        	var accountEntity = angular.copy($scope.tmpQuery.accountID);
            delete $scope.tmpQuery.accountID;
            $scope.tmpQuery.accountID = accountEntity.accountID;
//            $scope.tmpQuery.instClientID = accountEntity.instClientID;
        }
    	 if(queryEntity.combTradeType==1){
    	    	var table = $('#hisPosition_table').DataTable();
    	    	$scope.isCom=false;
    	    	table.draw();
    	    }else {
    	    	var table = $('#comhisPosition_table').DataTable();
    	    	$scope.isCom=true;
    	    	table.draw();
    	    }
        $timeout(function() {
        	  $scope.isQuery = false;
    	}, 500);
    }
    
    
    
    //导出excel
    $scope.exportExcelHip = function (queryEntity) {
    	$scope.tmpQuery=angular.copy(queryEntity);
    	if($scope.tmpQuery.accountID != null){
        	var accountEntity = angular.copy($scope.tmpQuery.accountID);
            delete $scope.tmpQuery.accountID;
            $scope.tmpQuery.accountID = accountEntity.accountID;
//            $scope.tmpQuery.instClientID = accountEntity.instClientID;
        }
    	if(queryEntity.combTradeType == 1){
	    	framework.file.export("历史持仓查询.xls",'excel',{
				entityKey:['settleDate','accountID','accountName','instClientName','exchID','instrumentID','direction',
				           'hedgeFlag','positionStr','positionAvgStr','usedMarginStr','positionProfitStr','lastPriceStr'],
				headerKey:['结算日','账号','账号名称','所属机构','交易所代码','合约代码','买卖','交易类型','持仓量','持仓均价','保证金','持仓盈亏', '市价'],
				styles:['plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText',
				        'plainText','plainText','plainText'],
				title:"历史持仓查询",
				
				dicMap:{direction:{'0':"买",'1':"卖"},hedgeFlag:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}}
			},"hisPositionService","exportExcelHip",$scope.tmpQuery);
    	} else {
        	framework.file.export("历史持仓查询.xls",'excel',{
    			entityKey:['settleDate','accountID','accountName','brokerID','exchID','combInstrumentID','direction',
    			           'position','instrumentID1','position1','margin1','instrumentID2','position2','margin2'],
    			headerKey:['结算日','账号','账号名称','所属机构','交易所代码','组合合约代码','买卖','持仓量','合约一','合约一持仓量','合约一保证金','合约二', '合约二持仓量', '合约二保证金'],

    			
    			styles:['plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText',
    			        'plainText','plainText','plainText','plainText','plainText'],
    			title:"历史持仓查询",
    			
    			dicMap:{direction:{'0':"买",'1':"卖"}}
    		},"hisPositionService","exportExcelHCOCP",$scope.tmpQuery);
    	}
    };
});