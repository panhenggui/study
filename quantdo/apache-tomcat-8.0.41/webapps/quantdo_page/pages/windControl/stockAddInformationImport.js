/**
 * Created by Quantdo on 2016/6/6.
 */
myapp.controller('stockAddInformationImportController',function($scope,$rootScope) {
	$scope.stockAddInformationImportService = new com.quantdo.orgClear.service.StockAddInformationImportService();
	
	$scope.stockAddInformationImportEntity={};
	// 按钮权限
	$scope.stockAddInformationImport_import = isShow("stockAddInformationImport_import");
	$scope.stockAddInformationImport_query = isShow("stockAddInformationImport_query");
	
    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	/*//进入页面 初始化所属机构下拉框
	$scope.stockAddInformationImportService.getBrokerIDDatas(function (result) {
        if(result != null && result.length>0) {
        	 $scope.brokerDatas = result;
        	$scope.stockAddInformationImportEntity.brokerID = result[0].instClientID;
        }
    	$scope.$apply();
    });*/
    //存储表格ID
    $scope.stockAddInformationImportEntity.capitalTypeID = "1";
    
    $scope.dataset = [];//存储表格中的数据  
    //初始化数据表
    $scope.initDataTables = function(table_id,table_columns,table_data,orderFlag) {
    	return $("#" + table_id).DataTable({
            columns: table_columns,
            data: table_data,
            scrollX: true,
            ordering: orderFlag,
            dom: 'rt<"bottom"iplB>',
            buttons: [
       			   
          			],
            language: {
                emptyTable: "没有符合条件的记录",
                info: " 当前第_START_ 到 _END_条  共 _TOTAL_ 条记录",
                infoEmpty: "当前第 0 到 0条  共 0 条记录",
                lengthMenu: "显示 _MENU_ 条",
                paginate: {
                    first: "首页",
                    last: "末页",
                    next: "下一页",
                    previous: "上一页"
                }
            }
        })
    }; 
    
    //根据类型加载对应表格的数据
    $scope.executeTable = function(capitalID,dataset){
    	var stockTable = document.getElementById("stockTable");
    	var stockTableDestroy = document.getElementById("stockTableDestroy");
    	stockTable.removeChild(stockTableDestroy);
    	var newContainer = document.createElement("div");
        newContainer.id = "stockTableDestroy";
        newContainer.innerHTML = "<table id='stockAddInformationImport_table' class='cell-border stripe'></table>";
    	stockTable.appendChild(newContainer);
    	//股票
    	if(capitalID=="1"){
    		$scope.initDataTables("stockAddInformationImport_table",$scope.columns_stock_array, dataset,true);
    	}
    	//基金
    	if(capitalID=="3"){
    		$scope.initDataTables("stockAddInformationImport_table",$scope.columns_fund_array, dataset,true);
    	}
    	//债券
    	if(capitalID=="4"){
    		$scope.initDataTables("stockAddInformationImport_table",$scope.columns_bond_array, dataset,true);
    	}
    }

    
    var capitalID = "";
    //股票表格设置
    $scope.columns_stock_array = [
            { title: "序号"},
            { title: "交易所"},
            { title: "证券代码"},
            { title: "证券名称"},
            { title: "股票总股本"},
            { title: "股票流通股本"}
    ];
    //基金表格设置
    $scope.columns_fund_array = [
            { title: "序号"},
            { title: "交易所"},
            { title: "证券代码"},
            { title: "证券名称"},
            { title: "基金最新份额"}
    ];
    //债券表格设置
    $scope.columns_bond_array = [
            { title: "序号"},
            { title: "交易所"},
            { title: "证券代码"},
            { title: "证券名称"},
            { title: "债券发行量"}
    ];
    
    //初始化数据
    var table = $scope.initDataTables("stockAddInformationImport_table",$scope.columns_stock_array, $scope.dataset,true);  
    
    $scope.stockTypeChange = function(entity){
    	$scope.dataset = [];
    	capitalID = entity.capitalTypeID;
    	var type = entity.capitalTypeID;
    	var stockTable = document.getElementById("stockTable");
    	var stockTableDestroy = document.getElementById("stockTableDestroy");
    	stockTable.removeChild(stockTableDestroy);
    	var newContainer = document.createElement("div");
        newContainer.id = "stockTableDestroy";
        newContainer.innerHTML = "<table id='stockAddInformationImport_table' class='cell-border stripe'></table>";
    	stockTable.appendChild(newContainer);
    	//股票
    	if(type=="1"){
    		var table = $scope.initDataTables("stockAddInformationImport_table",$scope.columns_stock_array, $scope.dataset,true);
    	}
    	//基金
    	if(type=="3"){
    		var table = $scope.initDataTables("stockAddInformationImport_table",$scope.columns_fund_array, $scope.dataset,true);
    	}
    	//债券
    	if(type=="4"){
    		var table = $scope.initDataTables("stockAddInformationImport_table",$scope.columns_bond_array, $scope.dataset,true);
    	}
    }
    
    $scope.isXlsx = "";
    //选择附加信息
    $("#stockAddInformationImport_upload").uploadFile({
    	dragdropWidth: 100,
        uploadStr:"选择文件",
        dragDropStr: "",
        dragDropContainerClass:"",
        url: framework.file.uploadUrl("stockAddInformationImportService", "holdExcelImport",[null]),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
            	if(errCode!=0){
            		layer.alert("导入失败", {icon: 2, time: 10000});
            		layer.closeAll('loading');
            		return false;
            	}
            	
            	if(result.errorMes){
            		layer.alert(result.errorMes, {icon: 2, time: 10000});
            		layer.closeAll('loading');
            		return false;
            	}else{
                    layer.alert("成功导入"+result.totNum+"条记录！", {icon: 1, time: 3000});
                    //导入股票
                    if(result.stock&&result.stock.length>0){
                    	/* $scope.dataset =[];
                		 table.clear().draw();
                         for(var i=0;i<result.stock.length;i++){
                             $scope.dataset.push([i+1,result.stock[i].tradeMarket,result.stock[i].securityID,result.stock[i].securityName,result.stock[i].totalEquity,result.stock[i].flowEquity]);
                         }
                         table.rows.add($scope.dataset).draw();
                         $scope.executeTable("1",$scope.dataset);
                         $scope.$apply();*/
                    	$scope.find({"capitalTypeID":"1"});
                    }
                    //导入基金
                    if(result.fund&&result.fund.length>0){
                    	 /*$scope.dataset =[];
                		 table.clear().draw();
                         for(var i=0;i<result.fund.length;i++){
                             $scope.dataset.push([i+1,result.fund[i].tradeMarket,result.fund[i].securityID,result.fund[i].securityName,result.fund[i].totalEquity,""]);
                         }
                         table.rows.add($scope.dataset).draw();
                         $scope.executeTable("3",$scope.dataset);
                         $scope.$apply();*/
                    	$scope.find({"capitalTypeID":"3"});
                    }
                    //导入债券
                    if(result.bond&&result.bond.length>0){
                    	 /*$scope.dataset =[];
                		 table.clear().draw();
                         for(var i=0;i<result.bond.length;i++){
                             $scope.dataset.push([i+1,result.bond[i].tradeMarket,result.bond[i].securityID,result.bond[i].securityName,result.bond[i].totalEquity,""]);
                         }
                         table.rows.add($scope.dataset).draw();
                         $scope.executeTable("4",$scope.dataset);
                         $scope.$apply();*/
                    	$scope.find({"capitalTypeID":"4"});
                    }
            	}
            });
            layer.closeAll('loading');
        },
        onSelect: function (files) {
        	 layer.load(2, {
          	    shade: [0.5,'#fff'] //0.1透明度的白色背景
          	});
            var file = files[0];
            var fileName = file.name;
            var suffix = fileName.substring(fileName.lastIndexOf('.') + 1);
            if(suffix == "xlsx"){
            	this.url=framework.file.uploadUrl("stockAddInformationImportService", "holdExcelImport",["false",$scope.stockAddInformationImportEntity.capitalTypeID,null])
            }else if(suffix == "xls") {
            	 this.url=framework.file.uploadUrl("stockAddInformationImportService", "holdExcelImport",["true",$scope.stockAddInformationImportEntity.capitalTypeID,null])
            }else {
                layer.msg('上传文件必须为Excel文件格式，例如：.xlsx，.xls', {icon: 2}, 3000);
                layer.closeAll('loading');
                return false;
            }
        }
    });
    
    $scope.find = function(entity){
    	//查询股票
    	if(entity.capitalTypeID=="1"){
    		$scope.stockAddInformationImportService.findStock(entity,function (result) {
    			$scope.dataset =[];
       		    table.clear().draw();
       		    if(result!=null){
       		     for(var i=0;i<result.length;i++){
       		    	 $scope.dataset.push([i+1,result[i].tradeMarket,result[i].securityID,result[i].securityName,result[i].totalEquity,result[i].flowEquity]);
                 }
       		    }
                table.rows.add($scope.dataset).draw();
                $scope.executeTable("1",$scope.dataset);
                $scope.$apply();
        	});
    	}
    	//查询基金
    	if(entity.capitalTypeID=="3"){
    		$scope.stockAddInformationImportService.findfund(entity,function (result) {
    			 $scope.dataset =[];
        		 table.clear().draw();
        		 if(result!=null){
        			 for(var i=0;i<result.length;i++){
        				 $scope.dataset.push([i+1,result[i].tradeMarket,result[i].securityID,result[i].securityName,result[i].totalEquity,""]);
                     } 
        		 }
                 table.rows.add($scope.dataset).draw();
                 $scope.executeTable("3",$scope.dataset);
                 $scope.$apply();
        	});
    	}
    	//查询债券
    	if(entity.capitalTypeID=="4"){
    		$scope.stockAddInformationImportService.findBond(entity,function (result) {
    			 $scope.dataset =[];
        		 table.clear().draw();
        		 if(result!=null){
        			 for(var i=0;i<result.length;i++){
        				 $scope.dataset.push([i+1,result[i].tradeMarket,result[i].securityID,result[i].securityName,result[i].totalEquity,""]);
                     }
        		 }
                 table.rows.add($scope.dataset).draw();
                 $scope.executeTable("4",$scope.dataset);
                 $scope.$apply();
        	});
    	}
    	
    }
})