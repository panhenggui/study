myapp.controller('HisInvestorAccountController', function ($scope, $timeout,$rootScope) {
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
	
	//2、定义页面数据模型
	 $scope.tmpQuery={
			    traderID:"",
			    brokerageFirmID:"",
	     		beginDate: clearConstant.formatDate(new Date()),
	     		endDate: clearConstant.formatDate(new Date()),
	     		searchType:"1"};
    
	$scope.hisInvestorAccountService = new com.quantdo.orgClear.service.HisInvestorAccountService();
	$scope.capitalAccountService = new com.quantdo.orgClear.service.CapitalAccountService();
	$scope.subCapitalAccountService = new com.quantdo.orgClear.service.SubCapitalAccountService();
	
	 $scope.hisInvestorAccount_query = isShow("hisInvestorAccount_query");
	 $scope.hisInvestorAccount_export = isShow("hisInvestorAccount_export");
	
	 
	 $scope.currenys = clearConstant.currenys;
	    //转换币种
	    $scope.transCurrencys = function(key){
	    	for(var i = 0;i < $scope.currenys.length;i++){
	    		if($scope.currenys[i].key == key){
	    			return $scope.currenys[i].text;
	    		}
	    	}
	    }
	
	$scope.listEntitys = {}; //table数据
	//$scope.capitalAccounts = {}; //资金账号
	//$scope.subCapitalAccounts = {}; //资产单元
	//$scope.ModelEntity = {};
	$scope.margin = 0;//保证金
	$scope.closeProfit = 0;//平仓盈亏
	$scope.positionProfit = 0;//持仓盈亏
	$scope.dynamicRights = 0; //动态权益
	$scope.queryEntity={}; //查询类型
	$scope.searchTypes = clearConstant.operClientPositon_searchType;
	$scope.queryEntity.searchType= $scope.searchTypes[0].key;
    $scope.queryEntity.beginDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());
	$scope.typeName = {};
	$scope.tEntitys = [];
	$scope.tmpResult = {};
	
	$scope.instClientList = null;
    getInstClientQueryConditionList(function(result){
    	$scope.instClientList = angular.copy(result);
    	if($scope.instClientList.length > 1){
    		$scope.queryEntity.brokerageFirmID = "";
    	}else{
    		$scope.queryEntity.brokerageFirmID = $scope.instClientList[0].instClientID;
    	}
    	$scope.$apply();
    });
    
    queryInstClientID(function(result){
    	if(result != undefined){
    		$scope.noInst = true;
    	}else{
    		$scope.noInst = false;
    	}
    });
	
    /*$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
	
	//初始化机构信息
	$scope.instClientService.findByQuery(function (result) {
	    $scope.instClientlistEntitys = result;
	    $scope.$apply();
	},{});*/
 
/*    //机构名称转换
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
	
	$scope.queryTypeFunction = function(){
		//资金账号
		if($scope.queryEntity.searchType == 1){
			$scope.typeName = "资金账号";
			//查询资金账号
			$scope.capitalAccountService.findAll(function(result){
				$scope.tEntitys = result;
				$scope.$apply();
			});
		} else if($scope.queryEntity.searchType == 2){ //资产单元
			$scope.typeName = "资产单元";
			//查询资产单元
			$scope.subCapitalAccountService.findAll(function(result){
				pushEntitys(result);
				$scope.$apply();
			});
		}
	}
	
	$scope.changeInstClient = function(){
		//资金账号
		if($scope.queryEntity.searchType == 1){
			$scope.typeName = "资金账号";
			//查询资金账号
			findCapitalAccountByQuery({"brokerageFirmID":$scope.queryEntity.brokerageFirmID}, function(result){
				$scope.tEntitys = result;
				$scope.$apply();
			});
		} else if($scope.queryEntity.searchType == 2){ //资产单元
			$scope.typeName = "资产单元";
			//查询资产单元
			findBySubCapitalAccountInfo({"instClientID":$scope.queryEntity.brokerageFirmID}, function(result){
				pushEntitys(result);
				$scope.$apply();
			});
		}
	}
	
	//查询资金账号
	$scope.capitalAccountService.findAll(function(result){
		$scope.typeName = "资金账号";
		$scope.tEntitys = result;
		$scope.$apply();
	});
	
	function pushEntitys(s){
		$scope.tEntitys = [];
		angular.forEach(s, function (value, index, arrays) {
			$scope.tmpEntitys = {};
			$scope.tmpEntitys.accountID = value.subAccountID;
			$scope.tmpEntitys.innerAccountID = value.subAccountID;
			$scope.tmpEntitys.accountName = value.subAccountName;
			$scope.tmpEntitys.instClientID = value.instClientID;
			$scope.tEntitys.push($scope.tmpEntitys);
		});
		$scope.$apply();
	}
	
	/*$scope.tmpQuery = {};
	$scope.find = function(accountID){
		$scope.tmpQuery = {};
        if(accountID != null){
        	var accountEntity = angular.copy(accountID);
            $scope.tmpQuery.accountID = accountEntity.innerAccountID;
            $scope.tmpQuery.instClientID = accountEntity.instClientID;
        }
        
		$scope.tmpQuery.queryType = $scope.queryType;
		$scope.tmpQuery.beginDate = $scope.beginDate;
		$scope.tmpQuery.endDate = $scope.endDate;
		$scope.hisInvestorAccountService.findBySubAccountIdAndAccountId(function(result){
			$scope.listEntitys = result;
			for(var i = 0; i < $scope.tEntitys.length; i++){
				for(var j = 0; j < $scope.listEntitys.length;j++){
					if($scope.tEntitys[i].innerAccountID == $scope.listEntitys[j].traderID &&
							$scope.tEntitys[i].instClientID == $scope.listEntitys[j].brokerageFirmID){
						$scope.listEntitys[j].accountName = $scope.tEntitys[i].accountName;
					}
				}
			}
			sum();
			$scope.$apply();
		},$scope.tmpQuery);

	}
	
	function sum(){
		$scope.margin = 0;//保证金
		$scope.closeProfit = 0;//平仓盈亏
		$scope.positionProfit = 0;//持仓盈亏
		$scope.dynamicRights = 0; //动态权益
		angular.forEach($scope.listEntitys, function (value, index, arrays) {
			$scope.margin += value.margin;
			$scope.closeProfit += value.closeProfit;
			$scope.positionProfit += value.positionProfit;
			$scope.dynamicRights += value.dynamicRights;
		});
	}*/
	
	  $scope.hisAccountQuery = function ( opts ) {
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
	                findAllHisAccountByQueryInMapper($scope.tmpQuery, requestParams, $scope.orderType, $scope.orderWay, function(result){
	                    var con = result.content;
	                    $scope.result = con;
	                  
	                    for(var i = 0; i<con.length;i++){
	                    	var tempArr = [con[i].settleDate,  con[i].traderID,con[i].accountName,con[i].instClientName,
		                	               parseFloat(con[i].preBalance).toFixed(2),parseFloat(con[i].deposit).toFixed(2), parseFloat(con[i].available).toFixed(2), parseFloat(con[i].margin).toFixed(2),
		                	               parseFloat(con[i].fee).toFixed(2), parseFloat(con[i].frozenMargin).toFixed(2),parseFloat(con[i].frozenFee).toFixed(2),
		                	               parseFloat(con[i].closeProfit).toFixed(2), parseFloat(con[i].positionProfit).toFixed(2),
		                	               parseFloat(con[i].dynamicRights).toFixed(2),parseFloat(con[i].premium ).toFixed(2),$scope.transCurrencys(con[i].currency)];
		 
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
		var table = $('#hisAccount_table').DataTable( {
	 	columns :[  
                    { title: "交易日期" }, 
					{ title: "账号" },
					{ title: "账号名称" },
					{ title: "所属机构" },
					{ title: "上日结存" },
					{ title: "今日出入金" },
					{ title: "可用资金" },
					{ title: "保证金" },
					{ title: "手续费" },
					{ title: "冻结保证金" },
					{ title: "冻结手续费" },
					{ title: "平仓盈亏" },
					{ title: "持仓盈亏" },
					{ title: "动态权益" },
					{ title: "权利金收支" },
					{ title: "币种" }
				
			],
	     "processing": true,
	     "serverSide": true,
	     "bFilter": false, 
	     dom: 'rt<"bottom"iplB>',
		 buttons: [],
	     "aaSorting" : [], // 默认的排序方式，按日期降序
	        //  "aaSorting" : [[2, "asc"]], // 默认的排序方式，按日期降序
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
	     "ajax": $scope.hisAccountQuery({}),
	     //"scrollY": 360,
	     //"scrollCollapse":true,
		 "scrollX": true
		/* "footerCallback": function () {
			 
             var api = this.api();
			 totalHisCapitalReport($scope.tmpQuery, function(retrunData){
					if(retrunData != null && retrunData != undefined){
						$( api.column( 7 ).footer() ).html(parseFloat(retrunData.marginStr).toFixed(2));
						$( api.column( 11 ).footer() ).html(parseFloat(retrunData.closeProfitStr).toFixed(2));
						$( api.column( 12 ).footer() ).html(parseFloat(retrunData.positionProfitStr).toFixed(2));
						$( api.column( 13 ).footer() ).html(parseFloat(retrunData.dynamicRightsStr).toFixed(2));
					}else{
						$( api.column( 7 ).footer() ).html(0.00);
						$( api.column( 11 ).footer() ).html(0.00);
						$( api.column( 12 ).footer() ).html(0.00);
						$( api.column( 13 ).footer() ).html(0.00);
					}
				});
			 
			 
			 
			 $scope.apii = this.api();
			  $timeout(function() {
				  $($(".dataTables_scrollFoot .hisAccountFoot tr")[0].childNodes[7]).html(
			    		$scope.apii.column( 7, {page:'current'} ).data().sum().toFixed(2));
			      $($(".dataTables_scrollFoot .hisAccountFoot tr")[0].childNodes[11]).html(
			    	    $scope.apii.column( 11, {page:'current'} ).data().sum().toFixed(2)); 
			      $($(".dataTables_scrollFoot .hisAccountFoot tr")[0].childNodes[12]).html(
				    	    $scope.apii.column( 12, {page:'current'} ).data().sum().toFixed(2)); 
			      $($(".dataTables_scrollFoot .hisAccountFoot tr")[0].childNodes[13]).html(
				    	    $scope.apii.column( 13, {page:'current'} ).data().sum().toFixed(2)); 
			   },"200")
			}*/
	} );
	}

	// 查询(后台分页)
	$scope.find = function(queryEntity){
		$scope.isQuery = true;
		$scope.tmpQuery=angular.copy(queryEntity);
		if($scope.tmpQuery.accountID != null){
	    	var accountEntity = angular.copy($scope.tmpQuery.accountID);
	        delete $scope.tmpQuery.accountID;
	        $scope.tmpQuery.traderID = accountEntity.accountID;
//	        $scope.tmpQuery.brokerageFirmID = accountEntity.instClientID;
	    }
	   
		var table = $('#hisAccount_table').DataTable();
	    table.draw();
	    $timeout(function() {
	    	  $scope.isQuery = false;
		}, 500);
	}
	

	//导出excel
	$scope.exportExcelHIA = function (queryEntity) {
		$scope.tmpQuery=angular.copy(queryEntity);
		if($scope.tmpQuery.accountID != null){
	    	var accountEntity = angular.copy($scope.tmpQuery.accountID);
	        delete $scope.tmpQuery.accountID;
	        $scope.tmpQuery.traderID = accountEntity.accountID;
//	        $scope.tmpQuery.brokerageFirmID = accountEntity.instClientID;
	    }
		framework.file.export("历史资金查询.xls",'excel',{
			entityKey:['settleDate','traderID','accountName','instClientName','preBalanceStr','depositStr','availableStr','marginStr',
			           'feeStr','frozenMarginStr','frozenFeeStr','closeProfitStr','positionProfitStr','dynamicRightsStr','premiumStr','currency'],
			           
			           
			 headerKey:['交易日期','账号','账号名称','所属机构','上日结存','今日出入金','可用资金','保证金','手续费','冻结保证金','冻结手续费','平仓盈亏', '持仓盈亏','动态权益','权利金收支','币种'],
			styles:['plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText',
			        'plainText','plainText','plainText','plainText'],
			title:"历史资金查询",
			dicMap:{currency:{'CNY':"人民币",'USD':"美元",'JPY':"日元",'AUD':"澳元",'GBP':"英镑",'HKD':"港币",
				'KRW':"韩元",'EUR':"欧元",'SGD':"新加坡元",'MYR':"林吉特",'CAD':"加元",'CENT':"美分"}}
		},"hisInvestorAccountService","exportExcelHIA",$scope.tmpQuery);
	};

		
	
});

