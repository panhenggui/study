myapp.controller('OperTradeController', function ($scope, $timeout) {
	

	//1、实例化服务接口
	//1.1、 实例化客户实时持仓服务接口
	//1.2、公用查询服务接口
	$scope.commonQueryservice = new com.quantdo.orgClear.service.CommonQueryService();
	
	// 按钮权限
	$scope.operTrade_query = isShow("operTrade_query");
	$scope.operTrade_export = isShow("operTrade_export");
	//2、定义页面数据模型
    $scope.queryEntity = {
    		investorID:"",
    		instrumentID:"",
    		brokerid:"",
    		searchType:""
    };    //实际查询对象
    $scope.tmpQuery={
    		investorID:"",
     		instrumentID:"",
     		brokerid:"",
    		searchType:"1"};
    $scope.searchTypes = clearConstant.operClientPositon_searchType;	//查询方式下拉框内容
    $scope.queryEntity.searchType = $scope.searchTypes[0].key;
    $scope.showID = $scope.searchTypes[0].text;
    $scope.showID1 = $scope.searchTypes[0].text;
    $scope.capitalAccountEntitys = [];			//所有资金帐号
    $scope.TraderEntitys = [];					//所有资产单元
    $scope.queryAccountEntitys = [];			//查询帐号下拉框内容

    $scope.seatSystems = clearConstant.seatSystems;	//通道系统
    $scope.listEntitys = [];
    $scope.listEntity = {};
    $scope.sumTradeVolume = 0;
    $scope.sumUsedFee = 0;
    $scope.tmpEntity = {};
    $scope.instClientService = new com.quantdo.orgClear.service.instClientService();
	
	//初始化机构信息
	$scope.instClientService.findByQuery(function (result) {
	    $scope.instClientlistEntitys = result;
	    $scope.$apply();
	},{});
 
    
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
	                findAllByQueryInMapper($scope.tmpQuery, requestParams, $scope.orderType, $scope.orderWay, function(result){
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

	                	var tempArr = [con[i].tradeTime,con[i].tradeID,con[i].investorID,con[i].accountName,con[i].instClientName,
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
	                        "column":[17]
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
 	var table = $('#operTrade_table').DataTable( {
     	columns :[   
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
				  
			    	 $($(".dataTables_scrollFoot .operTradefoot tr")[0].childNodes[10]).html(
			    			 $scope.api.column( 10, {page:'current'} ).data().sum());
			    	 $($(".dataTables_scrollFoot .operTradefoot tr")[0].childNodes[11]).html(
			    			 $scope.api.column( 11, {page:'current'} ).data().sum().toFixed(3));
			    	 $($(".dataTables_scrollFoot .operTradefoot tr")[0].childNodes[13]).html(
			    			 $scope.api.column( 13, {page:'current'} ).data().sum()); 
			    
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
       
    	var table = $('#operTrade_table').DataTable();
        table.draw();
        $timeout(function() {
        	  $scope.isQuery = false;
		}, 500);
    }
    
  //导出excel
	$scope.exportExcelOT = function (queryEntity) {
		$scope.tmpQuery=angular.copy(queryEntity);
		if($scope.tmpQuery.accountID != null){
	   	var accountEntity = angular.copy($scope.tmpQuery.accountID);
	       delete $scope.tmpQuery.accountID;
	       $scope.tmpQuery.investorID = accountEntity.accountID;
	       $scope.tmpQuery.brokerid = accountEntity.instClientID;
	   }
		framework.file.export("实时成交查询.xls",'excel',{
			entityKey:['tradeTime','tradeID','investorID','accountName','instClientName',
			           'exchID', 'instrumentID','direction','offsetFlag','hedgeFlag',
			           'tradeVolume', 'tradePrice','orderSysID','usedFee','tradeUser',
			           'investManager','investAdviser'],
           
			headerKey:['成交时间','成交号','账号','账号名称','所属机构',
			           '交易所代码','合约代码','买卖','开平','交易类型',
			           '成交量','成交价','报单编号','手续费', '交易员',
			           '投资经理','投资助理'],
			styles:['plainText','plainText','plainText','plainText','plainText',
			        'plainText','plainText','plainText','plainText','plainText',
			        'plainText','plainText','plainText','plainText','plainText',
			        'plainText','plainText'],
			title:"实时成交查询",
			dicMap:{direction:{'0':"买",'1':"卖"},hedgeFlag:{'1':"投机",'2':"套利",'3':"套保",'4':"做市商"}
			,offsetFlag:{'0':"开仓",'1':"平仓",'2':"强平",'3':"平今",'4':"平昨"}}
		},"operTradeService","exportExcelOT",$scope.tmpQuery);
	};
  
});

