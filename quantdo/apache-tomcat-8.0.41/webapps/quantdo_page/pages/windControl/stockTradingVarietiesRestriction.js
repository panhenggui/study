/**
 * Created by Quantdo on 2016/6/6.
 */
myapp.controller('stockTradingVarietiesRestrictionController',function($scope,$rootScope) {
	
	$scope.stockTradingVarietiesRestrictionService = new com.quantdo.orgClear.service.StockTradingVarietiesRestrictionService();

	//设置按钮的名称
	var constant_temp = new com.quantdo.orgClear.constant.ClearConstants();
	$scope.stockTradingVarietiesRestriction_buttonName_save = constant_temp.buttonName.saveData;
	$scope.stockTradingVarietiesRestriction_buttonName_update = constant_temp.buttonName.updateData;
	$scope.stockTradingVarietiesRestriction_buttonName_detail_save = constant_temp.buttonName.setPara;
	$scope.stockTradingVarietiesRestriction_buttonName_detail_update = constant_temp.buttonName.resetPara;
	$scope.stockTradingShow = false;
	$scope.buttonEdit = true;
	//新增
	$scope.showDetail = function(){
		$scope.stockTradingShow = true;
		$scope.buttonEdit = true;
		$scope.addStockTradingVarietiesRestriction();
		$scope.stockCount = 1;
		setTimeout(function(){
			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
		})
	}
	//取消修改
	$scope.giveUpUpdate = function(){
		$scope.stockTradingShow = false;
		$scope.addStockTradingVarietiesRestriction();
	}
    //存储表格ID
    $scope.stockTradingVarietiesRestrictionEntity=[];
    $scope.stockUpType_dataset = [];//存储表格中的数据
    $scope.stockDownLeftType_dataset = [];//左下表格
    $scope.buttonEdit = true;
    $scope.entity = {};
    
    //表格重绘
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
    //保存所有组合分类下拉菜单的值
    $scope.sortNames = [];
    //初始化数据  
    $scope.stockTradingAddButtonIsShow = false;
    $scope.originDataStockTradingVarity = function(isControl){   	
    	var fundID = sessionStorage.listFundID;
    	$scope.stockTradingVarietiesRestrictionService.queryStockTradingVarietiesRestriction(function(result){
    		$scope.stockUpType_dataset = [];
    		var con = result;
            for(var i=0;i<con.length;i++){
                var tempArr = [i+1,con[i].assetType,con[i].id,
                               "<input name='checkbox' type='checkbox' disabled='disabled'  "+$rootScope.changeState(con[i].buy)+" />",
                               "<input name='checkbox' type='checkbox' disabled='disabled'  "+$rootScope.changeState(con[i].sell)+" />",
                               "<a style='cursor:pointer;' name='StockTradingVarietiesRestrictionService.deleteStockTradingVarietiesRestrictionByID' class='stock_upCombine backFilter'>[修改]</a>"+
                               "<a style='cursor:pointer;' name='StockTradingVarietiesRestrictionService.deleteStockTradingVarietiesRestrictionByID' class='stock_delCombine backFilter'>[删除]</a>",
                               con[i].typeFlag,con[i].typeName
                               ];
                $scope.stockUpType_dataset.push(tempArr); 
            }
            $scope.initDataTables_main("stockTradingVarietiesRestriction_up_table",$scope.columns_stock_array, $scope.stockUpType_dataset,"true");
            
            if(isControl){
     		   var myfilter = document.getElementsByClassName("backFilter");
     		   hideAfterFilter($rootScope.filterEntity,myfilter);
     		   $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
            }
            $scope.stockTradingAddButtonIsShow = true;
            $scope.$apply();
    	},fundID,sessionStorage.listBrokerID);
    };
    
    $scope.originDataStockTradingVarity(true);
    
    $('#stockTradingVarietiesRestriction_up_table').on( 'page.dt', function () {
    	setTimeout(function(){
    		var myfilter = document.getElementsByClassName("backFilter");
        	hideAfterFilter($rootScope.filterEntity,myfilter);
    	})
    }); 
    
    $("body").delegate('#stockTradingVarietiesRestriction_up_table_length div').on('change', 'select[name="stockTradingVarietiesRestriction_up_table_length"]', function () {
    	setTimeout(function(){
    		var myfilter = document.getElementsByClassName("backFilter");
        	hideAfterFilter($rootScope.filterEntity,myfilter);
    	})
    });
   /* $scope.stockTradingVAddShow = true;
    $(document).ready(function(){
    		 $scope.originDataStockTradingVarity();
   	   setTimeout(function(){
           $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
   		   var myfilter = document.getElementsByClassName("backFilter");
   		   hideAfterFilter($rootScope.filterEntity,myfilter);
   	   },"500")
      });
  */
    //期货交易品种限制总表
    $scope.columns_stock_array = [
            { title: "序号"},
            { title: "资产类型"},
            { title: "id",visible:false},
            { title: "买"},
            { title: "卖"},
            { title: "操作"},
            { title: "typeFlag",visible:false},
            { title: "typeName",visible:false}
    ];
    
    //保存组合分类表格的表头列
    $scope.stockLeftType_column_array = [
        {title:"序号"},
        {title:"选项"},
        {title:"分类名称"},
        {title:"操作"}
    ];
    
    //保存期货品种限制的表头列
    $scope.stockRightType_column_array = [
        {title:""},
        {title:""},
        {title:""},
        {title:""}
    ];
    //保存组合分类表格的数据
    $scope.stockLeftType_dataset = [
	                                   ["1","<select class='stock_typeFlag hidden'><option value=''></option></select>","<select class='stock_typeName'></select>",""],
	                                   ["<a style='cursor:pointer;' class='addRow'>+</a>","","",""]
                                  ];

    //保存组合分类表格的数据
    $scope.stockRightType_dataset = [
                                   ["<input style='cursor:pointer;' type='checkbox' ng-checked='isSelected'  id='stock_buy'>","买","<input style='cursor:pointer;' type='checkbox'  ng-checked='isSelected'  id='stock_sell'>","卖"]
                                ];
  
    
    //初始化数据表
    $scope.initDataTables_main = function(table_id,table_columns,table_data,orderFlag) {
    	return $("#" + table_id).DataTable({
            columns: table_columns,
            data: table_data,
            //scrollY: height,
            //scrollCollapse:true,
            scrollX: true,
            "aoColumnDefs": [
                             { "sWidth": "36%", "aTargets": [ 1 ] }
            ],
            dom: 'rt<"bottom"ipl>',
            ordering: orderFlag,
           // paging:   false,
            //pagingType: "full_numbers",
           // info:false,
            language: {
                emptyTable: "没有符合条件的记录",
                info: " _START_ 到 _END_  共 _TOTAL_ 条",
                infoEmpty: " 0 到 0  共 0 条",
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
    
    //初始化数据表
    $scope.initDataTables = function(table_id,table_columns,table_data,orderFlag) {
    	return $("#" + table_id).DataTable({
            columns: table_columns,
            data: table_data,
            scrollY: 150,
            scrollCollapse:true,
            scrollX: true,
            dom: 'rt<"bottom"ipl>',
            ordering: !orderFlag,
            paging:   false,
            //pagingType: "full_numbers",
            info:false,
            language: {
                emptyTable: "没有符合条件的记录",
                info: " _START_ 到 _END_  共 _TOTAL_ 条",
                infoEmpty: " 0 到 0  共 0 条",
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
  //初始化数据表
    $scope.initDataTablesLeft = function(table_id,table_columns,table_data,orderFlag) {
    	return $("#" + table_id).DataTable({
            columns: table_columns,
            data: table_data,
            scrollY: 150,
            scrollCollapse:true,
            scrollX: true,
            "aoColumnDefs": [
                             { "sWidth": "8%", "aTargets": [ 0] },
                             { "sWidth": "18%", "aTargets": [ 1 ] },
                             { "sWidth": "62%", "aTargets": [ 2 ] },
                             { "sWidth": "8%", "aTargets": [ 3 ] }
            ],
            dom: 'rt<"bottom"ipl>',
            ordering: !orderFlag,
            paging:   false,
            //pagingType: "full_numbers",
            info:false,
            language: {
                emptyTable: "没有符合条件的记录",
                info: " _START_ 到 _END_  共 _TOTAL_ 条",
                infoEmpty: " 0 到 0  共 0 条",
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
	//初始化资金账户总持仓表格
    //var hasUpstockTypeTable =  $scope.initDataTables("stockTradingVarietiesRestriction_up_table",$scope.columns_total_array, $scope.stockUpType_dataset,180);
    //初始化组合分类表格
    var hasLeftStockTypeTable = $scope.initDataTablesLeft("stockTradingVarietiesRestriction_down_left_table",$scope.stockLeftType_column_array,$scope.stockLeftType_dataset,true);
    //初始化组合分类表格
    var hasRightStockTypeTable = $scope.initDataTables("stockTradingVarietiesRestriction_down_right_table",$scope.stockRightType_column_array,$scope.stockRightType_dataset,true);


    //转换状态
    $rootScope.changeState = function(status){
        var lstatus = "";
        if("0"==status){
        	lstatus = "checked= 'checked'";
        }
        if("1" == status){
        	lstatus = "";
        }
        return lstatus;
    }
    
    
    //点击下方 + 号 所触发的事件
    $scope.stockCount = 1;
    $("body").delegate("#stockTradingVarietiesRestriction_down_left_table td .addRow","click",function(){
    	hasLeftStockTypeTable.row($(this).parents("tr")).remove().draw();
    	var index = hasLeftStockTypeTable.context[0].aoData.length+1;
    	$scope.stockCount = $scope.stockCount+1;
    	var flag = $scope.stockCount;
        var hasStockTypeData = [[index,"<select class='stock_typeFlag'><option value=0>且</option><option value=1>排除</option></select>","<select id='stock_typeName_"+flag+"' class='stock_typeName'></select>","<a style='cursor:pointer;' class='backFilter delCombineDetail'>删除</a>"],
                                 ["<a style='cursor:pointer;' class='addRow'>+</a>","","",""]];
        hasLeftStockTypeTable.rows.add(hasStockTypeData).draw();
        var id = "#stock_typeName_" + flag;
        for(var j=0;j<$scope.sortNames.length;j++){
            $(id).append("<option value='"+$scope.sortNames[j]+","+$scope.sortTypeID[j]+","+ $scope.masterID[j]+"'>"+$scope.sortNames[j]+"</option>");
        }
        $scope.$apply();
    })
    
    
    
    
    //修改
    $("body").delegate("#stockTradingVarietiesRestriction_up_table td .stock_upCombine", "click", function (){
	$scope.stockTradingShow = true;
	$scope.buttonEdit = false;
	  $scope.entity = {};
	  $scope.buttonEdit = false;
	  $scope.stockDownLeftType_dataset=[]
	  //为选中的行设置选中色
      if($(this).closest('tr').hasClass("selected")){
          $(this).closest('tr').removeClass("selected");
      }
      else{
          $("tr.selected").removeClass("selected");
          $(this).closest('tr').addClass("selected");
      }
	  
	  var table = $("#stockTradingVarietiesRestriction_up_table").DataTable();
      var tr = $(this).closest('tr');
      var tempArr = table.row(tr).data();
      $scope.entity.id = tempArr[2];
      document.getElementById('stock_buy').checked =  $scope.changeStatus(tempArr[3]);
      document.getElementById('stock_sell').checked =  $scope.changeStatus(tempArr[4]);
      var typeFlags = tempArr[6].split(";");
      var typeNames = tempArr[7].split(";");
	  destroyDatatable("stockTradingVarietiesRestriction_down_left_table");
	  hasLeftStockTypeTable = $scope.initDataTablesLeft("stockTradingVarietiesRestriction_down_left_table",$scope.stockLeftType_column_array,$scope.stockDownLeftType_dataset,300,true);
      
	  var hasStockTypeData = [];
	  var size=typeFlags.length;
	  $scope.stockCount = size-1;
      for(var i=0;i<size-1;i++){
	     var flag= i+1;
      	 if(i==0){
      		hasStockTypeData[i] = [flag,"","<select id='stock_typeName_"+flag+"' class='stock_typeName'></select>",""];
      	 }else{
      		hasStockTypeData[i] = [flag,"<select class='stock_typeFlag'><option value=0>且</option><option value=1>排除</option></select>"
      	                           ,"<select id='stock_typeName_"+flag+"'  class='stock_typeName'></select>"
      	                           ,"<a style='cursor:pointer;' name='stockTradingVarietiesRestrictionService.deleteStockTradingVarietiesRestrictionByID' class='backFilter delCombineDetail'>删除</a>"
      	                     ]; 
      	 }
  	 }         
     hasStockTypeData[size-1] = ["<a style='cursor:pointer;' class='addRow'>+</a>","","",""];
     hasLeftStockTypeTable.rows.add(hasStockTypeData).draw();
     for(var j=0;j<size-1;j++){
    	 var id = "#stock_typeName_" + (j+1);
    	 for(var k=0;k<$scope.sortNames.length;k++){
              $(id).append("<option value='"+$scope.sortNames[k]+","+$scope.sortTypeID[k]+","+ $scope.masterID[k]+"'>"+$scope.sortNames[k]+"</option>");
    	 }
     }
     
     //	       初始化数据
     var tmpA = 0;
     for(var x=0;x<$("#stockTradingVarietiesRestriction_down_left_table .stock_typeName").length;x++){
    	 for(var y=0;y<$("#stockTradingVarietiesRestriction_down_left_table .stock_typeName")[x].length;y++){
    		 if($("#stockTradingVarietiesRestriction_down_left_table .stock_typeName")[x][y].value.indexOf(typeNames[tmpA])!=-1){
//	                     $("#typeName_"+(tmpA+1)+"").value = $("#futureVarietiesRestriction_down_left_table .stock_typeName")[x][y].value;
                 $("#stockTradingVarietiesRestriction_down_left_table .stock_typeName")[x][y].selected = true;
                 tmpA++;
                 break;
             }
    	 }
     }
     
     var tmpB = 0;
     for(var x=0;x<$("#stockTradingVarietiesRestriction_down_left_table .stock_typeFlag").length;x++){
    	 for(var y=0;y<$("#stockTradingVarietiesRestriction_down_left_table .stock_typeFlag")[x].length;y++){
    		 if($("#stockTradingVarietiesRestriction_down_left_table .stock_typeFlag")[x][y].value == typeFlags[tmpB+1]){
                 $("#stockTradingVarietiesRestriction_down_left_table .stock_typeFlag")[x][y].selected = true;
                 tmpB++;
                 break;
             }
    	 }
     }
     $scope.$apply();
     setTimeout(function(){
			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
		})
    });
    //删除
    $("body").delegate("#stockTradingVarietiesRestriction_up_table td .stock_delCombine", "click", function (){
    	 var table = $("#stockTradingVarietiesRestriction_up_table").DataTable();
    	 var mytr = $(this).parents('tr');
         var id = table.row(mytr).data()[2];
         
         layer.confirm("确定删除该条信息？", {icon: 3}, function (count) {
        	 layer.load(2, {
     	 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
     	 	   	});
	        //初始化数据
        	 $scope.stockTradingVarietiesRestrictionService.deleteStockTradingVarietiesRestrictionByID(function(result){   	
	        	if(result==true){
	                destroyDatatable("stockTradingVarietiesRestriction_up_table");
	                $scope.originDataStockTradingVarity(false);
	                $scope.addStockTradingVarietiesRestriction();
	                $scope.stockTradingShow = false;
	                $scope.$apply();
	                layer.alert("删除成功");
	        	}else{
	        		 layer.alert("删除成功");
	        	}
	        	layer.closeAll('loading');
	        },id);
        });
    });
    
    //过滤字符串中的checked属性
    $scope.changeStatus=function(str){
    	var index = str.indexOf("checked");
    	if(index==-1){
    		return false;
    	}else{
    		return true;
    	}
    }
    
    /*//点击行，代入数据
    $("body").delegate("#stockTradingVarietiesRestriction_up_table tbody tr", "click", function (){
    		  $scope.entity = {};
    		  $scope.buttonEdit = false;
	    	  $scope.stockDownLeftType_dataset=[]
	    	  //为选中的行设置选中色
	          if($(this).hasClass("selected")){
	              $(this).removeClass("selected");
	          }
	          else{
	              $("tr.selected").removeClass("selected");
	              $(this).addClass("selected");
	          }
	    	  
	          var table = $("#stockTradingVarietiesRestriction_up_table").DataTable();
	          var tempArr = table.row($(this)).data();
	          $scope.entity.id = tempArr[2];
	          document.getElementById('stock_buy').checked =  $scope.changeStatus(tempArr[3]);
	          document.getElementById('stock_sell').checked =  $scope.changeStatus(tempArr[4]);
	          var typeFlags = tempArr[6].split(";");
	          var typeNames = tempArr[7].split(";");
	  		  destroyDatatable("stockTradingVarietiesRestriction_down_left_table");
	  		  hasLeftStockTypeTable = $scope.initDataTablesLeft("stockTradingVarietiesRestriction_down_left_table",$scope.stockLeftType_column_array,$scope.stockDownLeftType_dataset,300,true);
	          
			  var hasStockTypeData = [];
			  var size=typeFlags.length;
	          for(var i=0;i<size-1;i++){
        	     var flag= i+1;
	          	 if(i==0){
	          		hasStockTypeData[i] = [flag,"","<select id='typeName_"+flag+"' class='typeName'></select>",""];
	          	 }else{
	          		hasStockTypeData[i] = [flag,"<select class='typeFlag'><option value=0>且</option><option value=1>排除</option></select>"
	          	                           ,"<select id='typeName_"+flag+"'  class='typeName'></select>"
	          	                           ,"<a style='cursor:pointer;' name='stockTradingVarietiesRestrictionService.deleteStockTradingVarietiesRestrictionByID' class='backFilter delCombineDetail'>删除</a>"
	          	                     ]; 
	          	 }
          	 }         
	         hasStockTypeData[size-1] = ["<a class='addRow'>+</a>","","",""];
             hasLeftStockTypeTable.rows.add(hasStockTypeData).draw();
	         for(var j=0;j<size-1;j++){
	        	 var id = "#typeName_" + (j+1);
	        	 for(var k=0;k<$scope.sortNames.length;k++){
		              $(id).append("<option value='"+$scope.sortNames[k]+","+$scope.sortTypeID[k]+","+ $scope.masterID[k]+"'>"+$scope.sortNames[k]+"</option>");
	        	 }
	         }
	         
	         //	       初始化数据
	         var tmpA = 0;
	         for(var x=0;x<$("#stockTradingVarietiesRestriction_down_left_table .typeName").length;x++){
	        	 for(var y=0;y<$("#stockTradingVarietiesRestriction_down_left_table .typeName")[x].length;y++){
	        		 if($("#stockTradingVarietiesRestriction_down_left_table .typeName")[x][y].value.indexOf(typeNames[tmpA])!=-1){
//	                     $("#typeName_"+(tmpA+1)+"").value = $("#futureVarietiesRestriction_down_left_table .typeName")[x][y].value;
	                     $("#stockTradingVarietiesRestriction_down_left_table .typeName")[x][y].selected = true;
	                     tmpA++;
	                     break;
	                 }
	        	 }
	         }
	         
	         var tmpB = 0;
	         for(var x=0;x<$("#stockTradingVarietiesRestriction_down_left_table .typeFlag").length;x++){
	        	 for(var y=0;y<$("#stockTradingVarietiesRestriction_down_left_table .typeFlag")[x].length;y++){
	        		 if($("#stockTradingVarietiesRestriction_down_left_table .typeFlag")[x][y].value == typeFlags[tmpB+1]){
	                     $("#stockTradingVarietiesRestriction_down_left_table .typeFlag")[x][y].selected = true;
	                     tmpB++;
	                     break;
	                 }
	        	 }
	         }
	         $scope.$apply();
    	});*/
    
    //分类名称删除
    $("body").delegate("#stockTradingVarietiesRestriction_down_left_table td .delCombineDetail", "click", function (){
    	 hasLeftStockTypeTable.row($(this).parents("tr")).remove().draw();
    	 for(var i=0;i<hasLeftStockTypeTable.context[0].aoData.length-1;i++){
             var index = hasLeftStockTypeTable.cell($(hasLeftStockTypeTable.context[0].aoData[i].nTr).children()[0]);
             index.data(i+1);
         }
    });
    

    //转换状态
    $rootScope.changeState = function(status){
        var lstatus = "";
        if("0"==status){
        	lstatus = "checked= 'checked'";
        }
        if("1" == status){
        	lstatus = "";
        }
        return lstatus;
    }
    
    
    //获取组合分类中所有的下拉信息
    $scope.getSortName = function(){
		$scope.sortNames = [];
        $scope.sortTypeID = [];
        $scope.masterID = [];
    	getSortNameByCapitalID(sessionStorage.listBrokerID,1,function(result){
            for(var i=0;i<result.length;i++){
                $scope.sortNames.push(result[i].sortName);
                $scope.sortTypeID.push(result[i].sortTypeID);
                $scope.masterID.push(result[i].masterID);
            }
            for(var j=0;j<$scope.sortNames.length;j++){
                $("#stockTradingVarietiesRestriction_down_left_table .stock_typeName").append("<option value='"+$scope.sortNames[j]+","+$scope.sortTypeID[j]+","+ $scope.masterID[j]+"'>"+$scope.sortNames[j]+"</option>");
            }
        });
    };
    $scope.getSortName();
    

    
    $scope.getSizeOfTable = function(id){
    	var table = document.getElementById("stockTradingVarietiesRestriction_down_left_table") ;
		return  table.rows.length;
    }
    
    $scope.addStockTradingVarietiesRestriction = function(){
    	$scope.stockTradingVarietiesRestriction_buttonName_detail = constant_temp.buttonName.setPara;
		document.getElementById('stock_buy').checked = false;
		document.getElementById('stock_sell').checked = false;
		$scope.buttonEdit = true;
		$scope.entity.id="-1";
		destroyDatatable("stockTradingVarietiesRestriction_down_left_table");
		$scope.getSortName();
		hasLeftStockTypeTable = $scope.initDataTablesLeft("stockTradingVarietiesRestriction_down_left_table",$scope.stockLeftType_column_array,$scope.stockLeftType_dataset,true);  
		//$scope.$apply();
    }
    
    $scope.changeTypeFlag = function(type){
    	if(type=="-1"||type==""){
    		return "";
    	}
    	if(type=="0"){
    		return "且";
    	}
    	if(type=="1"){
    		return "排除";
    	}
    }
    
    //保存或更新
    $scope.saveStockTradingVarietiesRestriction = function(){
    	

    	var combineEntity = {};
    	combineEntity.buy= document.getElementById('stock_buy').checked;
    	combineEntity.sell=document.getElementById('stock_sell').checked;
    	combineEntity.fundID = sessionStorage.listFundID;
    	combineEntity.id = $scope.entity.id;
    	
    	
        var contentDataList = [];
        
        if(combineEntity.id!=undefined && combineEntity.id!="-1"){
        	for(var i=0;i<hasLeftStockTypeTable.context[0].aoData.length-1;i++){
                var contentData = {};
                contentData.exchangeID = i+1;
                if(i!=0){
                	for(var j=0;j<$("#stockTradingVarietiesRestriction_down_left_table .stock_typeFlag")[i-1].length;j++){
                        if($("#stockTradingVarietiesRestriction_down_left_table .stock_typeFlag")[i-1][j].selected == true){
                            contentData.typeFlag = $("#stockTradingVarietiesRestriction_down_left_table .stock_typeFlag")[i-1][j].value;
                            break;
                        }
                    }
                }else{
                	contentData.typeFlag = "-1";
                }
                for(var j=0;j<$("#stockTradingVarietiesRestriction_down_left_table .stock_typeName")[i].length;j++){
                    if($("#stockTradingVarietiesRestriction_down_left_table .stock_typeName")[i][j].selected == true){                  
                        var typeInfo = $("#stockTradingVarietiesRestriction_down_left_table .stock_typeName")[i][j].value.split(",");
                        contentData.sortNames = typeInfo[0];
                        contentData.sortTypeID = typeInfo[1];
                        contentData.masterID = typeInfo[2];
                        break;
                    }
                }
                contentDataList.push(contentData);
            }
        }else{
            	for(var i=0;i<hasLeftStockTypeTable.context[0].aoData.length-1;i++){
                    var contentData = {};
                    contentData.exchangeID = i+1;
                    if(i!=0){
                    	for(var j=0;j<$("#stockTradingVarietiesRestriction_down_left_table .stock_typeFlag")[i].length;j++){
                            if($("#stockTradingVarietiesRestriction_down_left_table .stock_typeFlag")[i][j].selected == true){
                                contentData.typeFlag = $("#stockTradingVarietiesRestriction_down_left_table .stock_typeFlag")[i][j].value;
                                break;
                            }
                        }
                    }else{
                    	contentData.typeFlag = "-1";
                    }
                    for(var j=0;j<$("#stockTradingVarietiesRestriction_down_left_table .stock_typeName")[i].length;j++){
                        if($("#stockTradingVarietiesRestriction_down_left_table .stock_typeName")[i][j].selected == true){                  
                            var typeInfo = $("#stockTradingVarietiesRestriction_down_left_table .stock_typeName")[i][j].value.split(",");
                            contentData.sortNames = typeInfo[0];
                            contentData.sortTypeID = typeInfo[1];
                            contentData.masterID = typeInfo[2];
                            break;
                        }
                    }
                    contentDataList.push(contentData);
            }
        }
        
        combineEntity.stockLists = contentDataList;
        var str = "";
        $scope.names=[];
        var tmpSet = $scope.stockUpType_dataset;
        for(var i=0;i<contentDataList.length;i++){
        		var flag = $scope.changeTypeFlag(contentDataList[i].typeFlag);
        		var name = contentDataList[i].sortNames;
        		$scope.names.push(name);
        		str += flag+"【"+name+"】";
        }
       /* var flag1 = false;
        for(var k=0;k<tmpSet.length;k++){
        	if(tmpSet[k][1]==str){
        		flag1 = true;
        	}
        }
        if(flag1 && ($scope.entity.id =="-1" || $scope.entity.id==undefined)){
        	layer.alert("资产不允许类型重复!");
        	return false;
        }*/
        
        /*********修改后的效验方法************/
        if($scope.entity.id =="-1" || $scope.entity.id==undefined || $scope.entity.id == null || $scope.entity.id == ""){
        	 for(var k=0;k<tmpSet.length;k++){
             	if(tmpSet[k][1]==str){
             		layer.alert("资产不允许类型重复!");
                	return false;
             	}
             }
        }else {
        	 for(var k=0;k<tmpSet.length;k++){
              	if(tmpSet[k][1]==str && tmpSet[k][2] != $scope.entity.id){
              		layer.alert("资产不允许类型重复!");
                 	return false;
              	}
              }
        }
  
        var flag2 = false
        var ary = $scope.names;
        var nary=ary.sort();
	    for(var i=0;i<ary.length;i++){
	    	if(nary[i]==undefined||nary[i]==null){
	    		layer.alert("分类名称不能为空!");
		    	return false;
	    	}
	        if (nary[i]==nary[i+1]){
	        	flag2 = true;
	        }
	    }
	    
	    if(flag2){
	    	layer.alert("分类名称存在重复值!");
	    	return false;
        }
	    
	    var tmpEntity = "";
	    $scope.stockUpType_cap_dataset=[];
	    for(var m=0;m<$scope.stockUpType_dataset.length;m++){
	    	$scope.stockUpType_cap_dataset.push($scope.stockUpType_dataset[m][1]);
	    	if($scope.entity.id==$scope.stockUpType_dataset[m][2]){
	    		tmpEntity = $scope.stockUpType_dataset[m];
	    	}
	    }
	    $scope.stockUpType_cap_dataset.push(str);
	    //修改后判断类型重复
        var flag3 = false
        var ary1 = $scope.stockUpType_cap_dataset;
        var nary1=ary1.sort();
	    for(var i=0;i<ary1.length;i++){
	        if (nary1[i]==nary1[i+1]){
	        	flag3 = true;
	        }
	    }
	    
        var bBuy = combineEntity.buy;
        var bSell = combineEntity.sell;
        /*
        if(tmpEntity!=""){
            var tmpBuy = $scope.changeStatus(tmpEntity[3]);
            var tmpSell = $scope.changeStatus(tmpEntity[4]);
            if($scope.entity.id !="-1" && flag3 && tmpBuy==bBuy && tmpSell==bSell){
          	    	layer.alert("没有更新记录,请重新操作!");
                  	return false;
          	}
        }else{
        	//禁止修改过程中，对该记录没有资产类型及操作权限变动
    	    if($scope.entity.id !="-1" && flag3 && tmpBuy==bBuy && tmpSell==bSell){
    	    	layer.alert("没有更新记录或资产类型重复,请重新操作!");
            	return false;
    	    }
        }*/
        
        //买卖方式权限控制
        var flag4 = true;
        if(bBuy&&bSell||!bBuy&&!bSell||!bBuy&&bSell){
        	flag4 = false;
        }
        if(flag4){
        	document.getElementById('stock_buy').checked = false;
        	document.getElementById('stock_sell').checked = false;
        	layer.alert("买卖组合方式,暂不支持");
        	return false;
        }
        
        
    	//id为空
    	if(combineEntity.id==undefined || combineEntity.id=="-1"){		
    		layer.load(2, {
    	 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
    	 	   	});
        	$scope.stockTradingVarietiesRestrictionService.saveStockTradingVarietiesRestriction(function(result){
                var con = result;
                if(con==true){
                	destroyDatatable("stockTradingVarietiesRestriction_up_table");
                	$scope.originDataStockTradingVarity(false);
                	$scope.addStockTradingVarietiesRestriction();
                	 $scope.stockTradingShow = false;
                	 $scope.$apply();
                	layer.alert("新增成功");
                }else{
                	layer.alert("新增失败");
                }
                layer.closeAll('loading');
             },combineEntity,sessionStorage.listBrokerID);
    	}else{
    		
    		layer.load(2, {
 	 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
 	 	   	});
    		$scope.stockTradingVarietiesRestrictionService.updateStockTradingVarietiesRestriction(function(result){
    			layer.load(2, {
     	 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
     	 	   	});
    			var con = result;
                if(con==true){
                	destroyDatatable("stockTradingVarietiesRestriction_up_table");
                	$scope.originDataStockTradingVarity(false);
                	$scope.addStockTradingVarietiesRestriction();
                	 $scope.stockTradingShow = false;
                	 $scope.$apply();
                	layer.alert("修改成功");
                }else{
                	layer.alert("修改失败");
                }
                layer.closeAll('loading');
             },combineEntity,sessionStorage.listBrokerID);
    	}
        
    }
    
})