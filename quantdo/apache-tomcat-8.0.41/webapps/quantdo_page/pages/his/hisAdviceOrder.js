myapp.controller('HisAdviceorderQueryController', function ($scope, $rootScope,$timeout) {
	$scope.queryEntity = {};
	$scope.fundProductEntitys = [];
	// 获取指令状态
	$scope.orderStatus = clearConstant.adviceOrderStatus;
	// 获取类别
	$scope.businessType = clearConstant.businessType;
	
	 $scope.hisAdviceOrder_query = isShow("hisAdviceOrder_query");
	 $scope.hisAdviceOrder_export = isShow("hisAdviceOrder_export");
	   
	    //调用表格重绘函数
		$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
		$scope.tabCallBackFunc = tabCallBackFunc;

	
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});
	
	// 初始化日期
    $scope.queryEntity.settleStartDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.settleEndDate= clearConstant.formatDate(new Date());
    
    
    $scope.instClientList = [];
    $scope.instClientlistEntitys = [];
    getInstClientQueryConditionList(function(result){
    	$scope.instClientList = angular.copy(result);
    	if($scope.instClientList.length > 1){
    		$scope.queryEntity.brokerID = "";
    	}else{
    		$scope.queryEntity.brokerID = $scope.instClientList[0].instClientID;
    	}
	    $scope.$apply();
    });
    
    $scope.instClientService = new com.quantdo.orgClear.service.instClientService();
	
	//初始化机构信息
	/*$scope.instClientService.findByQuery(function (result) {
	    $scope.instClientlistEntitys = result;
	    if($scope.instClientList.length > 1){
    		$scope.queryEntity.brokerID = "";
    	}else{
    		$scope.queryEntity.brokerID = $scope.instClientList[0].instClientID;
    	}
	    $scope.$apply();
	},{});*/
	
	queryInstClientID(function(result){
    	if(result != undefined){
    		$scope.noInst = true;
    	}else{
    		$scope.noInst = false;
    	}
    	$scope.$apply();
    });
    
	// 初始化
	getFundProductByCondition({"instClientID":$scope.queryEntity.brokerID}, function(result){
		$scope.fundProductEntitys = result;
		$scope.$apply();
	});
    
    $scope.changeInstClient = function(){
    	if("" == $scope.queryEntity.brokerID){
    		$scope.queryEntity.brokerID = null;
    	}
    	// 查询产品
    	getFundProductByCondition({"instClientID":$scope.queryEntity.brokerID}, function(result){
    		$scope.fundProductEntitys = result;
    		$scope.$apply();
		});
	}
 
    function initPage(){
    	//会话列表初始化
    	var table = $('#hisAdviceOrder_table').DataTable( {
	     	columns :[   
	     	          	{ title: "交易日期" },
	    				{ title: "指令编号" },
	    				{ title: "产品" },
	    				{ title: "投资者代码" },
	    				{ title: "工作流" },
	    				{ title: "指令用户" },
	    				{ title: "交易标的" },
	    				{ title: "买卖" },
	    				{ title: "开平" },
	    				{ title: "指令价格" },
	    				{ title: "指令数量" },
	    				{ title: "剩余数量" },
	    				{ title: "未成交数量" },
	    				{ title: "成交数量" },
	    				{ title: "指令状态" },
	    				{ title: "类别" },
	    				{ title: "IP地址" },
	    				{ title: "MAC地址" },
	    				{ title: "营业部" }
	    			
	    		],
	         "processing": true,
	         "serverSide": true,
	         "bFilter": false,
	         "aaSorting" : [], // 默认的排序方式，按日期降序
	         "aoColumnDefs": [
	             { "bSortable": false, "aTargets": [] },
	             {
	                 "aTargets": [1],
	                 "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	                     
	                 }
	             },            
	         ],
	         "ajax": $scope.hisAdviceOrderQuery({}),
		     dom: 'rt<"bottom"iplB>',
			 buttons: [],
	    	 "scrollX": true,
	    	 "footerCallback": function () {
	    	     var api = this.api();
	    		 
	    	     $scope.hisAdviceOrderService.totalHisAdviceOrder($scope.queryEntity, function(retrunData){
	    				if(retrunData != null && retrunData != undefined){
	    					$( api.column( 10 ).footer() ).html(parseFloat(retrunData.volume).toFixed(0));
	    					$( api.column( 11 ).footer() ).html(parseFloat(retrunData.volumeFrozen).toFixed(0));
	    					$( api.column( 12 ).footer() ).html(parseFloat(retrunData.volumeRemain).toFixed(0));
	    					$( api.column( 13 ).footer() ).html(parseFloat(retrunData.volumeTraded).toFixed(0));
	    				}else{
	    					$( api.column( 10 ).footer() ).html(0);
	    					$( api.column( 11 ).footer() ).html(0);
	    					$( api.column( 12 ).footer() ).html(0);
	    					$( api.column( 13 ).footer() ).html(0);
	    				}
	    			});

	    		}
	    } );
    }
    $scope.hisAdviceOrderService = new com.quantdo.orgClear.service.hisAdviceOrderService();
    
    $scope.hisAdviceOrderQuery = function ( opts ) {
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
                $scope.hisAdviceOrderService.findByCondition($scope.queryEntity, requestParams, $scope.orderType, $scope.orderWay, function(result){
                    var con = result.content;
                    $scope.result = con;
                  
                    for(var i = 0; i<con.length;i++){
	                
                    	if(con[i].direction=="0"){
                    		con[i].direction="买";
                    	}else{
                    		con[i].direction="卖";
                    	}                        
                        if (con[i].offsetFlag=="0"){
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
                        var tempArr = [con[i].tradingDay, con[i].orderSysID,con[i].productName,con[i].investorID,con[i].workFlow,con[i].userID,
                                       con[i].instrumentID,con[i].direction,
                                       con[i].offsetFlag, 
                                       parseFloat(con[i].limitPrice).toFixed(2), 
                                       parseFloat(con[i].volume).toFixed(0),
                                       parseFloat(con[i].volumeFrozen).toFixed(0),
                                       parseFloat(con[i].volumeRemain).toFixed(0),
                                       parseFloat(con[i].volumeTraded).toFixed(0),
                                       $scope.transferStatus(con[i].orderstatus),
                                       $scope.transferBusinessType(con[i].businessType),
                                       con[i].ipAddress,
                                       con[i].macAddress,
                                       con[i].branchID];
                        tempArray.push(tempArr);
                    }
                    var json = {
                        "draw":request.draw,
                        "recordsTotal":result.totalRecord,
                        "recordsFiltered":result.totalRecord,
                        "data":tempArray
                   
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
    	var table = $('#hisAdviceOrder_table').DataTable();
    	table.draw();
        $timeout(function() {
        	  $scope.isQuery = false;
    	}, 500);
    }
    
    // 指令状态转换
    $scope.transferStatus = function(key){
    	var result = "";
    	for(var x in $scope.orderStatus){
    		if(key == $scope.orderStatus[x].key){
    			result = $scope.orderStatus[x].text;
    			break;
    		}
    	}
    	return result;
    }
    // 类别转换
    $scope.transferBusinessType= function(key){
    	var result = "";
    	for(var x in $scope.businessType){
    		if(key == $scope.businessType[x].key){
    			result = $scope.businessType[x].text;
    			break;
    		}
    	}
    	return result;
    }

    //    导出excel
    $scope.exportExcel = function (queryEntity) {
    	    framework.file.export("历史指令查询.xls",'excel',{
			entityKey:['tradingDay','orderSysID','productName','investorID','workFlow','userID','instrumentID',
			           'direction','offsetFlag','limitPrice','volume','volumeFrozen','volumeRemain',
			           'volumeTraded','orderstatus','businessType','ipAddress','macAddress','branchID'],
			headerKey:['交易日期','指令编号','产品','投资者代码','工作流','指令用户','交易标的','买卖','开平','指令价格','指令数量','剩余数量',
			           '未成交数量','成交数量','指令状态','类别','IP地址','MAC地址','营业部'],
			styles:['plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText',
			        'plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText'],
			title:"历史指令查询",
			
			dicMap:{direction:{'0':"买",'1':"卖"},offsetFlag:{'0':"开仓",'1':"平仓",'2':"强平",'3':"平今",'4':"平昨"},
				orderstatus:{'0':"全部成交",'1':"部分成交还在队列中",'2':"部分成交不在队列中",'3':"未成交还在队列中",'4':"未成交不在队列中",
					'5':"撤单(不在队列中)",'6':"订单已报入交易所未应答",'7':"部分撤单还在队列中",'8':"部分成交部分撤单还在队列中",'B':"投顾报单",
					'C':"投资经理驳回",'D':"投资经理通过",'E':"交易员已报入",'F':"交易员驳回",'G':"投资经理报单"},
				businessType:{'1':"普通",'2':"撤单",'3':"ETF申赎",'4':"最优五档即时成交剩余撤销",
					'5':"最优五档即时成交剩余转限价",'6':"即时成交剩余撤销",'7':"全额成交或撤销",'8':"本方最优价格",'9':"对方最优价格",
					'a':"套利组合单",'c':"行权",'d':"金交所中立仓申报",'e':"金交所递延交割申报"}}
		},"hisAdviceOrderService","exportExcel",$scope.queryEntity);
    	
    };
});