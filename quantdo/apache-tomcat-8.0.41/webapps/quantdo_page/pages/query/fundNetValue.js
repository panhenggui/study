myapp.controller('FundNetValueController', function ($scope, $timeout,$rootScope) {
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	
	$scope.tabCallBackFunc = tabCallBackFunc;	
	 $scope.queryEntity={
			    fundProductID:"",
	    		instClientID:""};
	
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService(); 
    $scope.fundNetValue_query = isShow("fundNetValue_query");
    $scope.fundNetValue_export = isShow("fundNetValue_export");
   
    //初始化产品信息
    getFundProductByCondition({"instClientID":""}, function (result) {
        $scope.queryFundProEntitys = result;
        $scope.$apply();
    });    

     // 查询(前台分页)
    $scope.find = function () {
    	$scope.isQuery = true;
    	//将数据集赋值为空
    	$scope.fundNetValueDataset = [];
        queryAllFundNet($scope.queryEntity, function(result){
        	   var con = result;
	           for(var i = 0; i<con.length;i++){                   
	            	var tempArr = [con[i].instClientAbbrName,  con[i].fundProductName,parseFloat(con[i].unitNetValue).toFixed(4),
	            	               parseFloat(con[i].fundNetValue).toFixed(2),con[i].marginRatioThreshold,
	                               con[i].marginRatio, con[i].netMarginRatioThreshold ,con[i].netMarginRatio,con[i].singleMarginRatioThreshold,con[i].singleMarginRatio];
	            	$scope.fundNetValueDataset.push(tempArr);
	            }
	            //重新绘表
	            $scope.fundNetValueTable.clear().draw();
	            $scope.fundNetValueTable.rows.add($scope.fundNetValueDataset).draw();
            });
        $timeout(function() {
      	  $scope.isQuery = false;
  	}, 500);
    };
    $scope.find();
    
    $scope.fundNetValue_columns = [
				{ title: "所属机构" },
 				{ title: "产品简称" },
 				{ title: "单位净值" },
 				{ title: "资产净值" },
 				{ title: "期货保证金占比阈值" },
 				{ title: "期货保证金占比" },
 				{ title: "净头寸保证金占比阈值" },
 				{ title: "净头寸保证金占比" },
 				{ title: "单品种保证金占比阈值" },
 				{ title: "单品种保证金占比" }
   ]
  //初始化
  $(document).ready(function() {
	//会话列表初始化
	$scope.fundNetValueTable = $('#FundNetValue_dynamic_table').DataTable( {
		data : $scope.fundNetValueDataset,
    	columns :$scope.fundNetValue_columns,
        dom: 'rt<"bottom"iplB>',
        
		buttons: []
    } );
  });


	//导出excel
	$scope.exportExcelHFN = function (queryEntity) {
		$scope.tmpQuery=angular.copy(queryEntity);
		framework.file.export("产品净值查询.xls",'excel',{
			entityKey:[  'instClientAbbrName','fundProductName','unitNetValue','fundNetValue','marginRatioThreshold'
			             ,'marginRatio','netMarginRatioThreshold','netMarginRatio','singleMarginRatioThreshold','singleMarginRatio'],     
			headerKey:['所属机构','产品简称','单位净值','资产净值','期货保证金占比阈值',
			           '期货保证金占比','净头寸保证金占比阈值','净头寸保证金占比','单品种保证金占比阈值',"单品种保证金占比"],
			styles:['plainText','plainText','plainText','plainText','plainText',
			          'plainText','plainText','plainText','plainText'],
			title:"净值查询"
		},"fundNetValueService","exportExcelFN",$scope.tmpQuery);
	};  
});

