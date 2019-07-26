/**
 * Created by Quantdo on 2016/07/18.
 */
myapp.controller('tradeAuthorityManageController', function($scope,$rootScope) {
	
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$scope.tradeAuthorityManageService = new com.quantdo.orgClear.service.TradeAuthorityManageService();
	
//	------------------------当前交易权限设置 start ---------------------------------
//	初始化交易权限查询entity
	$scope.tradeAuthorityQueryEntity = {};
//	初始化更新权限
	$scope.updateOrDel = {};
//	初始化更新权限实体
	$scope.updateOrDel.operInvestorTradingRightRisk = {};
//	初始当前交易权限化数据源
	$scope.tradeAuthorityManageDataset = [];
//	初始化数据
	$scope.tradeAuthorityManageDate = {};
	//将default转成“全部”
	$scope.keyAndArr =[{key:"default",name:"全部"}];
	$scope.changeDefaultToALL = function(arr,key){
		if(arr!=null&&arr!=undefined&&key!=null&&key!=undefined){
			for(var i=0;i<arr.length;i++){
				if(key==arr[i].key) return arr[i].name;
			}
		}
		return key;
	}
//	初始化当前交易权限显示列
	$scope.tradeAuthorityManageColumns_array = [
												{title: "机构代码"},
												{title: "机构简称"},
												{title: "投资者编号"},
												{title: "交易所"},
												{title: "品种/合约"},
												{title: "买开"},
												{title: "买平"},
												{title: "卖开"},
												{title: "卖平"},
												{title: "操作"},
	                                            ];
	
	function tradeAuthorityManageInitDataTables(table_id, table_columns, table_data,height){
	    return $("#" + table_id).DataTable({
	        data : table_data,
	        columns :table_columns,
	        scrollY: height,
	        paging: false,
	        retrieve: true,
	        destroy:true,
	        autoWidth: false,
	        //fixedColumns:   {
	        //    leftColumns: fixedColumns
	        //},
	        scrollX: true,
	        dom : 'rt<"bottom"ipl>',
	        ordering: true,
	        order: [[2, 'desc']],
	        //paging:   false,
	        //pagingType: "full_numbers",
	        language: {
	            emptyTable: "没有符合条件的记录",
	            info: "显示 _START_ 条到 _END_ 条 共 _TOTAL_ 条记录",
	            infoEmpty: "显示 0 条到 0 条 共 0 条记录",
	            lengthMenu: "显示 _MENU_ 条 记录"
	            //paginate: {
	            //    first: "首页",
	            //    last: "末页",
	            //    next: "下一页",
	            //    previous: "上一页"
	            //}
	        }
	    });
	}
	
   //初始化当前交易权限
	$scope.getTradeAuthorityManageTable = function() {
		 var mytable = document.getElementById("tradeManageInnerID");
         var outerContainer = document.getElementById("tradeManageOutID");
         outerContainer.removeChild(mytable);
         var newContainer = document.createElement("div");
         newContainer.id = "tradeManageInnerID";
         newContainer.innerHTML = "<table id='tradeAuthorityManage_table' class='cell-border stripe' cellspacing='0' width='100%'></table>";
         outerContainer.appendChild(newContainer);
         //该表格一定不能排序
		var table = initDataTables("tradeAuthorityManage_table", $scope.tradeAuthorityManageColumns_array, $scope.tradeAuthorityManageDataset,200,true);
		setTimeout(function(){
			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
		});
	};
//	初始化信息
	$scope.tradeAuthorityManageInit = function(isControl){
		$scope.queryTradeAuthorityManage({},isControl);
	}
//	查询交易权限信息
	$scope.queryTradeAuthorityManage = function(entity,isControl){
		$scope.tradeAuthorityManageService.findTradeAuthorityNow(entity,function(result){
			$scope.tradeAuthorityManageDataset = [];
			var con = result;
			$scope.tradeAuthorityManageDate = result;
			for(var i=0;i<con.length;i++){
//				买开代码
				var buyOpenCode = "";
				if(con[i].buyOpen == '1'){
					buyOpenCode = "<input type='checkbox' checked id='buyOpen_"+i+"'>";
				}else if(con[i].buyOpen == '0'){
					buyOpenCode = "<input type='checkbox' id='buyOpen_"+i+"'>";
				}else{
					buyOpenCode = "";
				}
//				买平代码
				var buyCloseCode = "";
				if(con[i].buyClose == '1'){
					buyCloseCode = "<input type='checkbox' checked id='buyClose_"+i+"'>";
				}else if(con[i].buyClose == '0'){
					buyCloseCode = "<input type='checkbox' id='buyClose_"+i+"'>";
				}else{
					buyCloseCode = "";
				}
//				卖开代码
				var sellOpenCode = "";
				if(con[i].sellOpen == '1'){
					sellOpenCode = "<input type='checkbox' checked id='sellOpen_"+i+"'>";
				}else if(con[i].sellOpen == '0'){
					sellOpenCode = "<input type='checkbox' id='sellOpen_"+i+"'>";
				}else{
					sellOpenCode = "";
				}
//				卖平代码
				var sellCloseCode = "";
				if(con[i].sellClose == '1'){
					sellCloseCode = "<input type='checkbox' checked id='sellClose_"+i+"'>";
				}else if(con[i].sellClose == '0'){
					sellCloseCode = "<input type='checkbox' id='sellClose_"+i+"'>";
				}else{
					sellCloseCode = "";
				}
				
				var tempArr = [con[i].brokerID,con[i].brokerName,con[i].traderID,$scope.changeDefaultToALL($scope.keyAndArr,con[i].exchID),$scope.changeDefaultToALL($scope.keyAndArr,con[i].instrumentID),buyOpenCode,
				               buyCloseCode,sellOpenCode,sellCloseCode,
				               "<a style='cursor:pointer;' class='authority_reset'>重置</a>&nbsp;&nbsp;" +
				               "<a style='cursor:pointer;' name ='TradeAuthorityManageService.changeAuthority' class='authority_update backFilter'>更新场上权限</a>&nbsp;&nbsp;" +
				               "<a style='cursor:pointer;' name ='TradeAuthorityManageService.changeAuthority' class='authority_delete backFilter'>删除场上权限</a>"];
				$scope.tradeAuthorityManageDataset.push(tempArr);
				//$scope.$apply();
			}
			$scope.getTradeAuthorityManageTable();
			var myfilter = document.getElementsByClassName("backFilter");
	        hideAfterFilter($rootScope.filterEntity,myfilter);
	        $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
		});
	}
	
	$scope.tradeAuthorityManageInit(true);
/*//	初始化表格信息
	$(document).ready(function(){
		$scope.tradeAuthorityManageInit();
		   setTimeout(function(){
			   var myfilter = document.getElementsByClassName("backFilter");
		       hideAfterFilter($rootScope.filterEntity,myfilter);
		   },"100")
	   });*/
//	交易权限查询按钮事件
	$scope.queryTradeAuthority = function(){
//		销毁表格
		//destroyDatatable("tradeAuthorityManage_table");
//		查询信息
		$scope.queryTradeAuthorityManage($scope.tradeAuthorityQueryEntity,false);
	}
	
//	重置
    $("body").delegate("#tradeAuthorityManage_table td .authority_reset","click",function(event){
    	var table = $("#tradeAuthorityManage_table").DataTable();
	    var tempArr = table.row($(this).parents('tr')).data();
    	var rowIndex = $(this).parents('tr')[0].rowIndex;
    	var getEntity = $scope.tradeAuthorityManageDate[rowIndex-1];
    	//alert(JSON.stringify(getEntity));
//    	买开
    	if(getEntity.buyOpen == "1"){
    		$("#buyOpen_" + (rowIndex-1)+"").prop("checked", true);
    	}else if(getEntity.buyOpen == "0"){
    		$("#buyOpen_" + (rowIndex-1)).prop("checked", false);
    	}
//    	买平
    	if(getEntity.buyClose == "1"){
    		$("#buyClose_" + (rowIndex-1)+"").prop("checked", true);
    	}else if(getEntity.buyClose == "0"){
    		$('#buyClose_' + (rowIndex-1)).prop("checked", false);
    	}
//    	卖开
    	if(getEntity.sellOpen == "1"){
    		$('#sellOpen_' + (rowIndex-1)).prop('checked', true);
    	}else if(getEntity.sellOpen == "0"){
    		$('#sellOpen_' + (rowIndex-1)).prop("checked", false);
    	}
//    	卖平
    	if(getEntity.sellClose == "1"){
    		$('#sellClose_' + (rowIndex-1)).prop("checked", true);
    	}else if(getEntity.sellClose == "0"){
    		$('#sellClose_' + (rowIndex-1)).prop("checked", false);
    	}
    });

//  更新场上权限
    $("body").delegate("#tradeAuthorityManage_table td .authority_update","click",function(event){
//    	初始化
    	$scope.updateOrDel = {};
    	$scope.updateOrDel.operInvestorTradingRightRisk = {};
    	var table = $("#tradeAuthorityManage_table").DataTable();
	    var tempArr = table.row($(this).parents('tr')).data();
    	var rowIndex = $(this).parents('tr')[0].rowIndex;
    	var getEntity = $scope.tradeAuthorityManageDataset[rowIndex-1];
    	var buyOpen = "";
    	if($("#buyOpen_" + (rowIndex-1)+"").is(':checked')){
    		buyOpen = "1";
    	}else{
    		buyOpen = "0";
    	}
    	var buyClose = "";
    	if($("#buyClose_" + (rowIndex-1)+"").is(':checked')){
    		buyClose = "1";
    	}else{
    		buyClose = "0";
    	}
    	var sellOpen = "";
    	if($("#sellOpen_" + (rowIndex-1)+"").is(':checked')){
    		sellOpen = "1";
    	}else{
    		sellOpen = "0";
    	}
    	var sellClose = "";
    	if($("#sellClose_" + (rowIndex-1)+"").is(':checked')){
    		sellClose = "1";
    	}else{
    		sellClose = "0";
    	}
    	$scope.updateOrDel.operateType = "update";
    	$scope.updateOrDel.operInvestorTradingRightRisk = {
    			brokerID:getEntity[0],
    			traderID:getEntity[2],
    			exchID:getEntity[3],
    			instrumentID:getEntity[4],
    			buyOpen:buyOpen,
    			buyClose:buyClose,
    			sellOpen:sellOpen,
    			sellClose:sellClose
    	};
    	
    	$scope.tradeAuthorityManageService.changeAuthority($scope.updateOrDel,function(result){
    		if(result.errCode == 0){
    			//destroyDatatable("tradeAuthorityManageStream_table");
    			//destroyDatatable("tradeAuthorityManage_table");
	    		$scope.queryTradeAuthorityManage($scope.tradeAuthorityQueryEntity,false);
	        	$scope.queryTradeAuthorityManageStream($scope.tradeAuthorityStreamQueryEntity);
    			layer.alert(result.errMessage);
    		}else{
    			layer.alert(result.errMessage);
    		}
    	});
    });
    
//  删除场上权限
    $("body").delegate("#tradeAuthorityManage_table td .authority_delete","click",function(event){
//    	初始化
    	$scope.updateOrDel = {};
    	$scope.updateOrDel.operInvestorTradingRightRisk = {};
    	var table = $("#tradeAuthorityManage_table").DataTable();
	    var tempArr = table.row($(this).parents('tr')).data();
    	var rowIndex = $(this).parents('tr')[0].rowIndex;
    	var getEntity = $scope.tradeAuthorityManageDate[rowIndex-1];
    	var buyOpen = "";
    	if($("#buyOpen_" + (rowIndex-1)+"").is(':checked')){
    		buyOpen = "1";
    	}else{
    		buyOpen = "0";
    	}
    	var buyClose = "";
    	if($("#buyClose_" + (rowIndex-1)+"").is(':checked')){
    		buyClose = "1";
    	}else{
    		buyClose = "0";
    	}
    	var sellOpen = "";
    	if($("#sellOpen_" + (rowIndex-1)+"").is(':checked')){
    		sellOpen = "1";
    	}else{
    		sellOpen = "0";
    	}
    	var sellClose = "";
    	if($("#sellClose_" + (rowIndex-1)+"").is(':checked')){
    		sellClose = "1";
    	}else{
    		sellClose = "0";
    	}
    	$scope.updateOrDel.operateType = "del";
    	$scope.updateOrDel.operInvestorTradingRightRisk = {
		brokerID:getEntity.brokerID,
		traderID:getEntity.traderID,
		exchID:getEntity.exchID,
		instrumentID:getEntity.instrumentID,
		buyOpen:buyOpen,
		buyClose:buyClose,
		sellOpen:sellOpen,
		sellClose:sellClose
    	};
    	 layer.confirm("确定删除该条信息？", {icon: 3}, function (count) {
    	$scope.tradeAuthorityManageService.changeAuthority($scope.updateOrDel,function(result){
    		if(result.errCode==0){
    			//destroyDatatable("tradeAuthorityManageStream_table");
    			//destroyDatatable("tradeAuthorityManage_table");
	    		$scope.queryTradeAuthorityManage($scope.tradeAuthorityQueryEntity,false);
	        	$scope.queryTradeAuthorityManageStream($scope.tradeAuthorityStreamQueryEntity);
    			layer.alert(result.errMessage);
    		}else{
    			layer.alert(result.errMessage);
    		}
    	});
    	 });
    });
//	------------------------当前交易权限设置 end ---------------------------------
	
	
	
//	------------------------交易权限变更上场流水 start -------------------------------
//	初始化交易权限变更流水查询数据初始化
	$scope.tradeAuthorityStreamQueryEntity = {};
//	交易权限变更上场流水数据初始化
	$scope.tradeAuthorityManageStreamDataset = [];
//	初始化交易权限变更上场流水显示列
	$scope.tradeAuthorityManageStreamColumns_array = [
												{title: "交易日"},
												{title: "操作日期"},
												{title: "操作时间"},
												{title: "上场操作"},
												{title: "机构代码"},
												{title: "机构简称"},
												{title: "投资者编号"},
												{title: "交易所"},
												{title: "品种/合约"},
												{title: "买开"},
												{title: "买平"},
												{title: "卖开"},
												{title: "卖平"}
	                                            ];
	//初始化交易权限变更上场流水
	$scope.getTradeAuthorityManageStreamTable = function() {
		 var mytable = document.getElementById("tradeManageInnerStreamID");
         var outerContainer = document.getElementById("tradeManageOutStreamID");
         outerContainer.removeChild(mytable);
         var newContainer = document.createElement("div");
         newContainer.id = "tradeManageInnerStreamID";
         newContainer.innerHTML = "<table id='tradeAuthorityManageStream_table' class='cell-border stripe' cellspacing='0' width='100%'></table>";
         outerContainer.appendChild(newContainer);
		var table = tradeAuthorityManageInitDataTables("tradeAuthorityManageStream_table", $scope.tradeAuthorityManageStreamColumns_array, $scope.tradeAuthorityManageStreamDataset,240);
		setTimeout(function(){
			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
		});
	};
	
//	初始化表格信息
	$scope.TradeAuthorityManageStreamTableInit = function(){
		$scope.queryTradeAuthorityManageStream({});
	}
	$scope.queryTradeAuthorityManageStream = function(entity){
		$scope.tradeAuthorityManageService.queryTradeAuthorityChangeOnStream(entity,function(result){
			$scope.tradeAuthorityManageStreamDataset = [];
			var con = result;
			for(var i=0;i<con.length;i++){
//				买开代码
				var buyOpenCode = "";
				if(con[i].buyOpen == '1'){
					buyOpenCode = "<input type='checkbox' checked='checked' disabled >";
				}else if(con[i].buyOpen == '0'){
					buyOpenCode = "<input type='checkbox' disabled >";
				}else{
					buyOpenCode = "";
				}
//				买平代码
				var buyCloseCode = "";
				if(con[i].buyClose == '1'){
					buyCloseCode = "<input type='checkbox' checked='checked' disabled >";
				}else if(con[i].buyClose == '0'){
					buyCloseCode = "<input type='checkbox' disabled>";
				}else{
					buyCloseCode = "";
				}
//				卖开代码
				var sellOpenCode = "";
				if(con[i].sellOpen == '1'){
					sellOpenCode = "<input type='checkbox' checked='checked' disabled >";
				}else if(con[i].sellOpen == '0'){
					sellOpenCode = "<input type='checkbox' disabled >";
				}else{
					sellOpenCode = "";
				}
//				卖平代码
				var sellCloseCode = "";
				if(con[i].sellClose == '1'){
					sellCloseCode = "<input type='checkbox' checked='checked' disabled >";
				}else if(con[i].sellClose == '0'){
					sellCloseCode = "<input type='checkbox' disabled >";
				}else{
					sellCloseCode = "";
				}
				var operateTypeContent = "";
				if(con[i].operateType == "0"){
					operateTypeContent = "更新";
				}else if(con[i].operateType == "1"){
					operateTypeContent = "删除";
				}
				var tempArr = [con[i].tradingDate,con[i].operateDate,con[i].operateTime,operateTypeContent,
				               con[i].brokerID,con[i].brokerName,con[i].traderID,$scope.changeDefaultToALL($scope.keyAndArr,con[i].exchID),$scope.changeDefaultToALL($scope.keyAndArr,con[i].instrumentID),buyOpenCode,buyCloseCode,
				               sellOpenCode,sellCloseCode];
				$scope.tradeAuthorityManageStreamDataset.push(tempArr);
			}
			$scope.getTradeAuthorityManageStreamTable();
//			alert(JSON.stringify($scope.tradeAuthorityManageStreamDataset));
			
		});

	}
	
//	初始化流水信息
	$scope.TradeAuthorityManageStreamTableInit();
	
//	流水查询点击事件
	$scope.queryTradeAuthorityStream = function(){
//		销毁表格
		//destroyDatatable("tradeAuthorityManageStream_table");
//		初始化表格信息
		$scope.queryTradeAuthorityManageStream($scope.tradeAuthorityStreamQueryEntity);
	}
//	------------------------交易权限变更上场流水 end ---------------------------------
});