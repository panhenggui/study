myapp.controller('HisFundNetValueController', function ($scope, $timeout,$rootScope) {
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
	
	 $scope.queryEntity={
			    fundProductID:"",
	    		instClientID:"",
	     		beginDate:"",
	     		endDate:""};
	
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
    $scope.queryEntity.beginDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());
    
    $scope.hisFundNetValue_query = isShow("hisFundNetValue_query");
    $scope.hisFundNetValue_export = isShow("hisFundNetValue_export");
    $scope.hisFundNetValue_update = isShow("hisFundNetValue_update");
   
    
    $scope.instClientList = null;
    getInstClientQueryConditionList(function(result){
    	$scope.instClientList = angular.copy(result);
    	if($scope.instClientList.length > 1){
    		$scope.queryEntity.instClientID = "";
    	}else{
    		$scope.queryEntity.instClientID = $scope.instClientList[0].instClientID;
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
    
    //-------------------------------------------
    $scope.tmpQuery = {};
    $scope.find = function (queryEntity)  {
    	$scope.listEntitys=[];
        $scope.isQuery = true;
        $scope.tmpQuery = angular.copy(queryEntity);
    	if($scope.tmpQuery.beginDate > $scope.tmpQuery.endDate){
    		layer.msg('开始日期不能大于结束日期！！', {
				icon : 2
			});
    		$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
			return false;
    	}
		findByQueryHisFund(function(result){
			$scope.listEntitys=result;
			$scope.$apply();
		},$scope.tmpQuery.fundProductID,$scope.tmpQuery.beginDate,$scope.tmpQuery.endDate);
    	$timeout(function() {
            $scope.isQuery = false;
        }, 1000);
    };
   //初始化机构信息
    $scope.instClientService.findByQuery(function (result) {
        $scope.instClientlistEntitys = result;
        $scope.$apply();
    },{});
    
    //初始化产品信息
    getFundProductByCondition({"instClientID":""}, function (result) {
        $scope.queryFundProEntitys = result;
        $scope.$apply();
    });
    
    $scope.changeInstClient = function(){
    	getFundProductByCondition({"instClientID":$scope.queryEntity.instClientID}, function (result) {
            $scope.queryFundProEntitys = result;
            $scope.$apply();
        });
    }
    
/*    //机构名称转换
    $scope.transInstClient = function (instClientID) {
    	for(var i = 0;i < $scope.instClientlistEntitys.length; i++){
    		if($scope.instClientlistEntitys[i].instClientID == instClientID){
    			return $scope.instClientlistEntitys[i].instClientAbbrName;
    		}
    	}
    }*/
    
/*    // 修改
    $scope.initUpdateParam = function (index, entity) {
    	$scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.brokId="";
        $scope.brokId = $scope.tempEntity.brokerageFirmID;
        $scope.capitalEntity = angular.copy($scope.tempEntity);
        $scope.isUpdate = true;
        $timeout(function() {
        	  $("#hisFundModal").modal("show");
        }, 1000);
    };*/
    
    $scope.save = function (entity) {
        saveHisFund(function (result) {
        	 $scope.find($scope.queryEntity);
            // 关闭窗口
            $("#hisFundModal").modal("hide");
        },entity);
    }
    
    
    
    $scope.queryAllHisFundNetValue = function ( opts ) {
        return function ( request, drawCallback, settings ) {        	
            var ajax          = false;
            var requestStart  = request.start;
            var drawStart     = request.start;
            var requestLength = request.length;
            var requestEnd    = requestStart + requestLength;
            var page = drawStart/requestLength + 1;
            // 获取settings中默认排序内容
            //$scope.orderType = settings.aaSorting[0][0];
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
                queryAllHisFundNet($scope.queryEntity, requestParams, $scope.orderType, $scope.orderWay, function(result){
                    var con = result.content;
                    $scope.temEntitys = result.content;
                    $scope.result = con;
                    var tempArray = new Array();
                    var operate = "";
                   if($scope.hisFundNetValue_update){
                    	operate  = "<a class='update-row' data-toggle='modal'>修改</a>";
                    }
                    for(var i = 0; i<con.length;i++){
                    	$scope.temEntity=con[i];
                    	$scope.temIndex=i;
                        if(con[i].operateDate==undefined){
                        	con[i].operateDate=" ";
                        }
                        if(con[i].operateTime==undefined){
                        	con[i].operateTime=" ";
                        }
	                	var tempArr = [con[i].id,con[i].settleDate,  con[i].instClientName,con[i].shortProductName,
	                	               parseFloat(con[i].fundNetValue).toFixed(3),parseFloat(con[i].unitNetValue).toFixed(4),  con[i].fundProductQuota,
	                                   operate,            con[i].operateDate,   con[i].operateTime,
	                                   con[i].instClientID ,con[i].fundProductID,con[i].netDate ,con[i].netTime];
	                    tempArray.push(tempArr);
                    }
                    var json = {
                        "draw":request.draw,
                        "recordsTotal":result.totalRecord,
                        "recordsFiltered":result.totalRecord,
                        "data":tempArray,
                        "column":[9]
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
	var hisFundNetTable = $('#HisFundNetValue_dynamic_table').DataTable( {
   	columns :[
   	            { title: "id",visible:false },
 				{ title: "交易日期" },
 				{ title: "所属机构" },
 				{ title: "产品名称" },
 				{ title: "产品资产净值" },
 				{ title: "产品单位净值" },
 				{ title: "产品份额" },
 				{ title: "操作" },
 				{ title: "修改日期" },
 				{ title: "修改时间" }
 			
 		],
       "processing": true,
       "serverSide": true,
       dom: 'rt<"bottom"iplB>',
       buttons: [],
       "bFilter": false,
       //"aaSorting" : [[0, "asc"],[1, "asc"],[2, "asc"]], // 默认的排序方式，按日期降序
       "aoColumnDefs": [
           //{ "bSortable": false, "aTargets": [] },
/*           {
               "aTargets": [1],
               "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {                   
               }
           },*/
/*		   {
	          "targets": [ 9 ],
	          "visible": false
		   },*/
	       {
	          "targets": [ 10 ],
	          "visible": false
		   },
	       {
	          "targets": [ 11 ],
	          "visible": false
		   },
		   {
		          "targets": [ 12 ],
		          "visible": false
		   },
	       {
	          "targets": [ 13 ],
	          "visible": false
		   }
           
       ],
       "ajax": $scope.queryAllHisFundNetValue({}),
       //"scrollY": collapse,
       //"scrollCollapse":true
		"scrollX": true
} );
}

//查询(后台分页)
$scope.find = function(queryEntity){
	 $scope.isQuery = true;

     $scope.tmpQuery=angular.copy(queryEntity);
	 if($scope.tmpQuery.beginDate > $scope.tmpQuery.endDate){
	 		layer.msg('开始日期不能大于结束日期！！', {
					icon : 2
				});
	 		$timeout(function() {
	             $scope.isQuery = false;
	         }, 1000);
				return false;
	 	}
// 	 if($scope.tmpQuery.fundProductID != null){
//     	var accountEntity = angular.copy($scope.tmpQuery.fundProductID);
//         delete $scope.tmpQuery.fundProductID;
//         $scope.tmpQuery.fundProductID = accountEntity.fundProductID;
//         $scope.tmpQuery.instClientID = accountEntity.instClientID;
//     }
 	 $scope.queryEntity=angular.copy($scope.tmpQuery);
	 var table = $('#HisFundNetValue_dynamic_table').DataTable();
     table.draw();
     $timeout(function() {
   	    $scope.isQuery = false;
	 }, 500);
}


$("body").undelegate("#HisFundNetValue_dynamic_table_wrapper td .update-row","click");
//修改按钮点击事件
$("body").delegate("#HisFundNetValue_dynamic_table_wrapper td .update-row","click",function(event){
    var table = $("#HisFundNetValue_dynamic_table").DataTable();
    var mytr = $(this).parents('tr');
    var tempArr = table.row(mytr).data();
    var id = tempArr[0];
    for(var i = 0;i<$scope.temEntitys.length;i++){
    	if(id==$scope.temEntitys[i].id){
    		$scope.modalEntity = $scope.temEntitys[i];
    	}
    }
    $scope.isUpdate = true;
    $scope.capitalAccountForm.$setPristine();
    $scope.capitalEntity = {};
    $scope.capitalEntity = angular.copy($scope.modalEntity);
    $scope.capitalAccountForm.$setPristine();
    $timeout(function() {
  	  $("#hisFundModal").modal("show");
    }, 1000);
    $scope.$apply();
});


//导出excel
$scope.exportExcelHFN = function (queryEntity) {
	$scope.tmpQuery=angular.copy(queryEntity);

	if($scope.tmpQuery.beginDate > $scope.tmpQuery.endDate){
	 		layer.msg('开始日期不能大于结束日期！！', {
					icon : 2
				});
	 		$timeout(function() {
	             $scope.isQuery = false;
	         }, 1000);
				return false;
	}
//	if($scope.tmpQuery.fundProductID != null){
//  	    var accountEntity = angular.copy($scope.tmpQuery.fundProductID);
//        delete $scope.tmpQuery.fundProductID;
//        $scope.tmpQuery.fundProductID = accountEntity.fundProductID;
////        $scope.tmpQuery.instClientID = accountEntity.instClientID;
//    }
	
	framework.file.export("历史净值查询.xls",'excel',{
		entityKey:[ 'settleDate','instClientName','shortProductName','fundNetValue','unitNetValue',
		           'fundProductQuota', 'operateDate','operateTime'],     
		headerKey:['交易日期','所属机构', '产品名称','产品资产净值','产品单位净值',
		           '产品份额','修改日期', '修改时间'],
		styles:['plainText','plainText','plainText','plainText','plainText',
		        'plainText','plainText','plainText'],
		title:"历史净值查询"
	},"hisFundNetValueService","exportExcelHFN",$scope.tmpQuery);
};
  

});

