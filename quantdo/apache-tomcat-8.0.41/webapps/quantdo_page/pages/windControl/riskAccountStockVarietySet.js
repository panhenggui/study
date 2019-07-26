/**
 * Created by Quantdo on 2016/6/6.
 */
myapp.controller('riskAccountStockVarietySetController',function($scope,$rootScope) {
	
	$scope.riskAccountStockVarietySetService = new com.quantdo.orgClear.service.RiskAccountStockVarietySetService();
	$scope.riskAccountFutureVarietySetService = new com.quantdo.orgClear.service.RiskAccountFutureVarietySetService();
	//设置按钮的名称
	var constant_temp = new com.quantdo.orgClear.constant.ClearConstants();
	
	$scope.riskAccountStockVarietySet_buttonName_save = constant_temp.buttonName.saveData;
	$scope.riskAccountStockVarietySet_buttonName_update = constant_temp.buttonName.updateData;
	$scope.riskAccountStockVarietySet_buttonName_detail_save = constant_temp.buttonName.setPara;
	$scope.riskAccountStockVarietySet_buttonName_detail_update = constant_temp.buttonName.resetPara;
	$scope.buttonEdit = true;
	$scope.riskAccounStockShow = false;
	
	//新增
	$scope.showDetail = function(){
		$scope.riskAccountStockSelect = false;
		$scope.buttonEdit = true;
		$scope.riskAccounStockShow = true;
		 $scope.addRiskAccountStockSet();
		 setTimeout(function(){
				$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
			})
	}
	
	//取消修改
	$scope.giveUpUpdate = function(){
		$scope.riskAccounStockShow = false;
		 $scope.addRiskAccountStockSet();
	}
    //存储表格ID
    $scope.riskStockSetUpType_dataset = [];//存储表格中的数据
    
    //表格重绘
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
    //保存所有组合分类下拉菜单的值
    $scope.sortNames = [];
    $scope.entity={};
   
    $scope.subAccountList = [];
    //数据初始化下拉框信息-资产单元
    $scope.riskStockEntity={};
    $scope.riskAccountFutureVarietySetService.querySubAccount(function(result){
    	if(result.length>0){
    		$scope.subAccountList = result;
    		$scope.riskStockEntity.riskAccount = $scope.subAccountList[0].subAccountID;
    	}
    	$scope.$apply();
    });
    
    if($scope.subAccountList.length>0){
		$scope.entity.riskAccount = $scope.subAccountList[0].riskAccount;
	}

    //初始化数据  
    $scope.riskAccountStockAddButtonIsShow = false;
    $scope.originData = function(isControl){   	
    	$scope.riskAccountStockVarietySetService.query(function(result){
    		$scope.riskStockSetUpType_dataset = [];
    		var con = result;
            for(var i=0;i<con.length;i++){
                var tempArr = [i+1,con[i].brokerID,con[i].riskAccount,con[i].brokerName,con[i].riskAccountName,con[i].assetType,con[i].id,
                               "<input name='checkbox' type='checkbox' disabled='disabled'  "+$rootScope.changeState(con[i].buy)+" />",
                               "<input name='checkbox' type='checkbox' disabled='disabled'  "+$rootScope.changeState(con[i].sell)+" />",
                               "<a style='cursor:pointer;' name='RiskAccountStockVarietySetService.deleteRiskAccountStockeSet' class='riskStock_upCombine backFilter'>[修改]</a>"+
                               "<a style='cursor:pointer;' name='RiskAccountStockVarietySetService.deleteRiskAccountStockeSet' class='riskStock_delCombine backFilter'>[删除]</a>",
                               con[i].typeFlag,con[i].typeName
                               ];
                $scope.riskStockSetUpType_dataset.push(tempArr);
            }
            $scope.initDataTables_main("riskAccountStockVarietySet_up_table",$scope.columns_total_array, $scope.riskStockSetUpType_dataset,300);
            if(isControl){
    		   var myfilter = document.getElementsByClassName("backFilter");
    		   hideAfterFilter($rootScope.filterEntity,myfilter);
    		   $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
            }
            $scope.riskAccountStockAddButtonIsShow = true;
            $scope.$apply();
    	},"","");
    	
    };
    $scope.originData(true);
    
    $('#riskAccountStockVarietySet_up_table').on( 'page.dt', function () {
       	setTimeout(function(){
       		var myfilter = document.getElementsByClassName("backFilter");
           	hideAfterFilter($rootScope.filterEntity,myfilter);
       	})
       }); 
       
       $("body").delegate('#riskAccountStockVarietySet_up_table_length div').on('change', 'select[name="riskAccountStockVarietySet_up_table_length"]', function () {
       	setTimeout(function(){
       		var myfilter = document.getElementsByClassName("backFilter");
           	hideAfterFilter($rootScope.filterEntity,myfilter);
       	})
       });
   /* $scope.riskAccountStockAddShow = true;
    $(document).ready(function(){
   	   $scope.originData();
   	   setTimeout(function(){
           $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
   		   var myfilter = document.getElementsByClassName("backFilter");
   		   hideAfterFilter($rootScope.filterEntity,myfilter);
   		$scope.$apply();
   	   },"500")
      });*/
  
    //期货交易品种限制总表
    $scope.columns_total_array = [
            { title: "序号"},
            { title: "机构代码",visible:false},
            { title: "资产单元ID",visible:false},
            { title: "机构"},
            { title: "资产单元"},
            { title: "资产类型"},
            { title: "id",visible:false},
            { title: "买"},
            { title: "卖"},
            { title: "操作"},
            { title: "typeFlag",visible:false},
            { title: "typeName",visible:false}
            
    ];
    
    //保存组合分类表格的表头列
    $scope.riskStockSetLeftType_column_array = [
        {title:"序号"},
        {title:"选项"},
        {title:"分类名称"},
        {title:"操作"}
    ];
    
    //保存期货品种限制的表头列
    $scope.riskStockSetRightType_column_array = [
        {title:""},
        {title:""},
        {title:""},
        {title:""}
    ];
    //保存组合分类表格的数据
    $scope.riskStockSetLeftType_dataset = [
                                   ["1","<select class='riskStock_typeFlag hidden'><option value=''></option></select>","<select class='riskStock_typeName'></select>",""],
                                   ["<a style='cursor:pointer;' class='addRow'>+</a>","","",""]
                                  ];

    //保存组合分类表格的数据
    $scope.riskStockSetRightType_dataset = [
                                   ["<input style='cursor:pointer;' type='checkbox' id='stock_buy'>","买","<input style='cursor:pointer;' type='checkbox' id='stock_sell'>","卖"]
                                ];


    //初始化数据表
    $scope.initDataTablesLeft = function(table_id,table_columns,table_data,height,orderFlag) {
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
    
  //初始化数据表
    $scope.initDataTables = function(table_id,table_columns,table_data,height,orderFlag) {
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
    $scope.initDataTables_main = function(table_id,table_columns,table_data,height,orderFlag) {
    	return $("#" + table_id).DataTable({
            columns: table_columns,
            data: table_data,
            //scrollY: height,
            //scrollCollapse:true,
            scrollX: true,
           /* "aoColumnDefs": [
                             { "sWidth": "36%", "aTargets": [ 3 ] }
            ],*/
            dom: 'rt<"bottom"ipl>',
            ordering: !orderFlag,
           // paging:   false,
            //pagingType: "full_numbers",
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
        
    //初始化组合分类表格
    var hasLeftRiskStockSetTypeTable = $scope.initDataTablesLeft("riskAccountStockVarietySet_down_left_table",$scope.riskStockSetLeftType_column_array,$scope.riskStockSetLeftType_dataset,300,true);
    //初始化买卖开平表格
    var hasRightRiskStockSetTypeTable = $scope.initDataTables("riskAccountStockVarietySet_down_right_table",$scope.riskStockSetRightType_column_array,$scope.riskStockSetRightType_dataset,300,true);


    //点击下方左侧 + 号所触发的事件
    $scope.riskScount = 1;
    $("body").delegate("#riskAccountStockVarietySet_down_left_table td .addRow","click",function(){
    	hasLeftRiskStockSetTypeTable.row($(this).parents("tr")).remove().draw();
    	var index= hasLeftRiskStockSetTypeTable.context[0].aoData.length+1;
    	$scope.riskScount = $scope.riskScount + 1;
    	var flag = $scope.riskScount;
        var hasRiskStockSetTypeData = [[index,"<select class='riskStock_typeFlag'><option value=0>且</option><option value=1>排除</option></select>","<select id='stocktypeName_"+flag+"' class='riskStock_typeName'></select>","<a style='cursor:pointer;' class='backFilter delCombineDetail'>删除</a>"],
                                 ["<a style='cursor:pointer;' class='addRow'>+</a>","","",""]];
        hasLeftRiskStockSetTypeTable.rows.add(hasRiskStockSetTypeData).draw();
        var id = "#stocktypeName_" + flag;
        for(var j=0;j<$scope.sortNames.length;j++){
            $(id).append("<option value='"+$scope.sortNames[j]+","+$scope.sortTypeID[j]+","+ $scope.masterID[j]+"'>"+$scope.sortNames[j]+"</option>");
        }
        $scope.$apply();
    })
    
    
    //修改
    $("body").delegate("#riskAccountStockVarietySet_up_table td .riskStock_upCombine", "click", function (event){
    	$scope.riskAccountStockSelect = true;
    	$scope.buttonEdit = false;
    	$scope.riskAccounStockShow = true;
    	event.stopPropagation();
    		  $scope.entity = {};
    		  $scope.buttonEdit = false;
	    	  $scope.riskStockSetLeftType_dataset=[]
	    	  //为选中的行设置选中色
	          if($(this).closest('tr').hasClass("selected")){
	              $(this).closest('tr').removeClass("selected");
	          }
	          else{
	              $("tr.selected").removeClass("selected");
	              $(this).closest('tr').addClass("selected");
	          }
	    	  
	    	  var table = $("#riskAccountStockVarietySet_up_table").DataTable();
	          var tr = $(this).closest('tr');
	          var tempArr = table.row(tr).data();
	          $scope.entity.id = tempArr[6];
	          document.getElementById('stock_buy').checked =  $scope.changeState(tempArr[7]);
	          document.getElementById('stock_sell').checked = $scope.changeState(tempArr[8]);
	          var typeFlags = tempArr[10].split(";");
	          var typeNames = tempArr[11].split(";");
	          $scope.riskStockEntity.riskAccount = tempArr[1]+":"+tempArr[2];
	          $scope.$apply();
	  		  destroyDatatable("riskAccountStockVarietySet_down_left_table");
			  hasLeftRiskStockSetTypeTable = $scope.initDataTablesLeft("riskAccountStockVarietySet_down_left_table",$scope.riskStockSetLeftType_column_array,$scope.riskStockSetLeftType_dataset,300,true);
	          
			  var hasRiskStockSetTypeData = [];
			  var size=typeFlags.length;
			  $scope.riskScount = size - 1;
	          for(var i=0;i<size-1;i++){
        	     var flag= i+1;
	          	 if(i==0){
	          		hasRiskStockSetTypeData[i] = [flag,"","<select id='stocktypeName_"+flag+"' class='riskStock_typeName'></select>",""];
	          	 }else{
	          		hasRiskStockSetTypeData[i] = [flag,"<select class='riskStock_typeFlag'><option value=0>且</option><option value=1>排除</option></select>"
	          	                           ,"<select id='stocktypeName_"+flag+"'  class='riskStock_typeName'></select>"
	          	                           ,"<a style='cursor:pointer;' class='backFilter delCombineDetail'>删除</a>"
	          	                     ]; 
	          	 }
          	 }         
	         hasRiskStockSetTypeData[size-1] = ["<a style='cursor:pointer;' class='addRow'>+</a>","","",""];
	         hasLeftRiskStockSetTypeTable.rows.add(hasRiskStockSetTypeData).draw();
	         //var id = "#typeName_" + flag;
	         for(var j=0;j<size-1;j++){
	        	 var id = "#stocktypeName_" + (j+1);
	        	 for(var k=0;k<$scope.sortNames.length;k++){
		              $(id).append("<option value='"+$scope.sortNames[k]+","+$scope.sortTypeID[k]+","+ $scope.masterID[k]+"'>"+$scope.sortNames[k]+"</option>");
	        	 }
	         }
	         
	         //	       初始化数据
	         var tmpA = 0;
	         for(var x=0;x<$("#riskAccountStockVarietySet_down_left_table .riskStock_typeName").length;x++){
	        	 for(var y=0;y<$("#riskAccountStockVarietySet_down_left_table .riskStock_typeName")[x].length;y++){
	        		 if($("#riskAccountStockVarietySet_down_left_table .riskStock_typeName")[x][y].value.indexOf(typeNames[tmpA])!=-1){
	                     $("#riskAccountStockVarietySet_down_left_table .riskStock_typeName")[x][y].selected = true;
	                     tmpA++;
	                     break;
	                 }
	        	 }
	         }
	         
	         var tmpB = 0;
	         for(var x=0;x<$("#riskAccountStockVarietySet_down_left_table .riskStock_typeFlag").length;x++){
	        	 for(var y=0;y<$("#riskAccountStockVarietySet_down_left_table .riskStock_typeFlag")[x].length;y++){
	        		 if($("#riskAccountStockVarietySet_down_left_table .riskStock_typeFlag")[x][y].value == typeFlags[tmpB+1]){
	                     $("#riskAccountStockVarietySet_down_left_table .riskStock_typeFlag")[x][y].selected = true;
	                     tmpB++;
	                     break;
	                 }
	        	 }
	         }
	         setTimeout(function(){
	 			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
	 		})
	         $scope.$apply();
    	});
    
    //删除
    $("body").delegate("#riskAccountStockVarietySet_up_table td .riskStock_delCombine", "click", function (event){
    	event.stopPropagation();
    	 var table = $("#riskAccountStockVarietySet_up_table").DataTable();
    	 var mytr = $(this).parents('tr');
         var id = table.row(mytr).data()[6];
         layer.confirm("确定删除该条信息？", {icon: 3}, function (count) {
        	layer.load(2, {
   	 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
   	 	   	});
	        //初始化数据
	        $scope.riskAccountStockVarietySetService.deleteRiskAccountStockSet(function(result){   	
	        	if(result==true){
	                destroyDatatable("riskAccountStockVarietySet_up_table");
	                $scope.originData(false);
	                $scope.addRiskAccountStockSet();
	                $scope.riskAccounStockShow = false;
	                $scope.$apply();
	                layer.alert("删除成功");
	        	}else{
	        		layer.alert("删除失败");
	        	}
	        	layer.closeAll('loading');
	        },id);
        });
    });
    
    //过滤字符串中的checked属性
    $scope.changeState=function(str){
    	var index = str.indexOf("checked");
    	if(index==-1){
    		return false;
    	}else{
    		return true;
    	}
    }
    //点击期货品种设置左下角页面表格行所触发的事件
    $("body").delegate("#riskAccountStockVarietySet_down_left_table td .delCombineDetail", "click", function (){
    	 hasLeftRiskStockSetTypeTable.row($(this).parents("tr")).remove().draw();
    	 for(var i=0;i<hasLeftRiskStockSetTypeTable.context[0].aoData.length-1;i++){
             var index = hasLeftRiskStockSetTypeTable.cell($(hasLeftRiskStockSetTypeTable.context[0].aoData[i].nTr).children()[0]);
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
    	getSortNameByCapitalID("",1,function(result){
            for(var i=0;i<result.length;i++){
                $scope.sortNames.push(result[i].sortName);
                $scope.sortTypeID.push(result[i].sortTypeID);
                $scope.masterID.push(result[i].masterID);
            }
            for(var j=0;j<$scope.sortNames.length;j++){
                $("#riskAccountStockVarietySet_down_left_table .riskStock_typeName").append("<option value='"+$scope.sortNames[j]+","+$scope.sortTypeID[j]+","+ $scope.masterID[j]+"'>"+$scope.sortNames[j]+"</option>");
            }
        });
    };
    $scope.getSortName();
    
    $scope.getSizeOfTable = function(id){
    	var table = document.getElementById("riskAccountStockVarietySet_down_left_table") ;
		return  table.rows.length;
    }
    
    $scope.addRiskAccountStockSet = function(){
    	$scope.riskAccountStockSelect = false;
    	$scope.riskAccountStockVarietySet_buttonName_detail = constant_temp.buttonName.setPara;
    	$scope.riskStockSetLeftType_dataset = [];
		document.getElementById('stock_buy').checked = false;
		document.getElementById('stock_sell').checked = false;
		$scope.entity={};
		$scope.entity.id="-1";
    	$scope.buttonEdit = true;
    	//$("#riskAccountStockVarietySet_riskAccount").get(0).selectedIndex;//设置下拉框默认值
    	$("#riskAccountStockVarietySet_riskAccount").get(0).selected = true;
    	
		destroyDatatable("riskAccountStockVarietySet_down_left_table");
		$scope.getSortName();
		hasLeftRiskStockSetTypeTable = $scope.initDataTablesLeft("riskAccountStockVarietySet_down_left_table",$scope.riskStockSetLeftType_column_array,$scope.riskStockSetLeftType_dataset,300,true);
        var flag = 1;
		var hasRiskStockSetTypeData = [[flag,"","<select id='stocktypeName_"+flag+"' class='riskStock_typeName'></select>",""],
                                 ["<a style='cursor:pointer;' class='addRow'>+</a>","","",""]];
        hasLeftRiskStockSetTypeTable.rows.add(hasRiskStockSetTypeData).draw();
        var id = "#stocktypeName_" + flag;
        for(var j=0;j<$scope.sortNames.length;j++){
            $(id).append("<option value='"+$scope.sortNames[j]+","+$scope.sortTypeID[j]+","+ $scope.masterID[j]+"'>"+$scope.sortNames[j]+"</option>");
        }
       // $scope.$apply();
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
    
    $scope.saveOrUpdate = function(riskStockEntity){	
    	
    	var combineEntity = {};
    	combineEntity.buy = document.getElementById('stock_buy').checked;
    	combineEntity.sell =document.getElementById('stock_sell').checked;
    	combineEntity.brokerID = $scope.riskStockEntity.riskAccount.split(":")[0];
    	combineEntity.riskAccount = $scope.riskStockEntity.riskAccount.split(":")[1];
    	combineEntity.id = $scope.entity.id;
    	
        var contentDataList = [];
        
        if(combineEntity.id){
        	for(var i=0;i<hasLeftRiskStockSetTypeTable.context[0].aoData.length-1;i++){
                var contentData = {};
                contentData.exchangeID = i+1;
                if(i!=0){
                	for(var j=0;j<$("#riskAccountStockVarietySet_down_left_table .riskStock_typeFlag")[i-1].length;j++){
                        if($("#riskAccountStockVarietySet_down_left_table .riskStock_typeFlag")[i-1][j].selected == true){
                            contentData.typeFlag = $("#riskAccountStockVarietySet_down_left_table .riskStock_typeFlag")[i-1][j].value;
                            break;
                        }
                    }
                }else{
                	contentData.typeFlag = "-1";
                }
                for(var j=0;j<$("#riskAccountStockVarietySet_down_left_table .riskStock_typeName")[i].length;j++){
                    if($("#riskAccountStockVarietySet_down_left_table .riskStock_typeName")[i][j].selected == true){                  
                        var typeInfo = $("#riskAccountStockVarietySet_down_left_table .riskStock_typeName")[i][j].value.split(",");
                        contentData.sortNames = typeInfo[0];
                        contentData.sortTypeID = typeInfo[1];
                        contentData.masterID = typeInfo[2];
                        break;
                    }
                }
                contentDataList.push(contentData);
            }
        }else{
            	for(var i=0;i<hasLeftRiskStockSetTypeTable.context[0].aoData.length-1;i++){
                    var contentData = {};
                    contentData.exchangeID = i+1;
                    if(i!=0){
                    	for(var j=0;j<$("#riskAccountStockVarietySet_down_left_table .riskStock_typeFlag")[i].length;j++){
                            if($("#riskAccountStockVarietySet_down_left_table .riskStock_typeFlag")[i][j].selected == true){
                                contentData.typeFlag = $("#riskAccountStockVarietySet_down_left_table .riskStock_typeFlag")[i][j].value;
                                break;
                            }
                        }
                    }else{
                    	contentData.typeFlag = "-1";
                    }
                    for(var j=0;j<$("#riskAccountStockVarietySet_down_left_table .riskStock_typeName")[i].length;j++){
                        if($("#riskAccountStockVarietySet_down_left_table .riskStock_typeName")[i][j].selected == true){                  
                            var typeInfo = $("#riskAccountStockVarietySet_down_left_table .riskStock_typeName")[i][j].value.split(",");
                            contentData.sortNames = typeInfo[0];
                            contentData.sortTypeID = typeInfo[1];
                            contentData.masterID = typeInfo[2];
                            break;
                        }
                    }
                    contentDataList.push(contentData);
            }
        }
        
        combineEntity.stockSetLists = contentDataList;
        var str = "";
        $scope.names=[];
        var tmpSet = $scope.riskStockSetUpType_dataset;
        for(var i=0;i<contentDataList.length;i++){
        		var flag = $scope.changeTypeFlag(contentDataList[i].typeFlag);
        		var name = contentDataList[i].sortNames;
        		$scope.names.push(name);
        		str += flag+"【"+name+"】";
        }
        
        //判断数据是否重复
        for(var i=0;i<tmpSet.length;i++){
        	if(tmpSet[i][1]==combineEntity.brokerID&&tmpSet[i][2]==combineEntity.riskAccount&&tmpSet[i][5]==str&&tmpSet[i][6]!=combineEntity.id){
        		layer.alert("数据重复");
            	return false;
        	}
        }
        var flag1 = false;
        for(var k=0;k<tmpSet.length;k++){
        	if(tmpSet[k][1]==str){
        		flag1 = true;
        	}
        }
        if(flag1 && ($scope.entity.id =="-1" || $scope.entity.id==undefined)){
        	layer.alert("资产不允许类型重复!");
        	return false;
        }
        
        if(combineEntity.riskAccount==undefined || combineEntity.riskAccount==""){
        	layer.alert("资产单元不可为空!");
        	return false;
        }
  
        var flag2 = false
        var ary = $scope.names;
        var nary=ary.sort();
	    for(var i=0;i<ary.length;i++){
	        if (nary[i]==nary[i+1]){
	        	if(nary[i]==undefined||nary[i]==null){
		    		layer.alert("分类名称不能为空!");
			    	return false;
		    	}
	        	flag2 = true;
	        }
	    }
	    
	    if(flag2){
	    	layer.alert("分类名称存在重复值!");
	    	return false;
        }
	    
	    var tmpEntity = "";
	    $scope.riskStockSetUpType_cap_dataset=[];
	    for(var m=0;m<$scope.riskStockSetUpType_dataset.length;m++){
	    	$scope.riskStockSetUpType_cap_dataset.push($scope.riskStockSetUpType_dataset[m][1]);
	    	if($scope.entity.id==$scope.riskStockSetUpType_dataset[m][2]){
	    		tmpEntity = $scope.riskStockSetUpType_dataset[m];
	    	}
	    }
	    $scope.riskStockSetUpType_cap_dataset.push(str);
	    //修改后判断类型重复
        var flag3 = false
        var ary1 = $scope.riskStockSetUpType_cap_dataset;
        var nary1=ary1.sort();
	    for(var i=0;i<ary1.length;i++){
	        if (nary1[i]==nary1[i+1]){
	        	flag3 = true;
	        }
	    }
	    var flag = true;
        var buy = combineEntity.buy;
        var sell = combineEntity.sell;
        //买卖方式权限控制
        var flag4 = true;
        if(buy&&sell||!buy&&!sell||!buy&&sell){
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
        	$scope.riskAccountStockVarietySetService.saveRiskAccountStockVarietySet(function(result){
                var con = result;
                if(con==true){
                	destroyDatatable("riskAccountStockVarietySet_up_table");
                	$scope.originData(false);
                	$scope.addRiskAccountStockSet();
                	 $scope.riskAccounStockShow = false;
 	                $scope.$apply();
                	layer.alert("新增成功");
                }else{
                	layer.alert("新增失败");
                }
                layer.closeAll('loading');
             },combineEntity);
    	}else{
    		layer.load(2, {
 	 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
 	 	   	});
    		$scope.riskAccountStockVarietySetService.updateRiskAccountStockVarietySet(function(result){
                var con = result;
                if(con==true){
                	destroyDatatable("riskAccountStockVarietySet_up_table");
                	$scope.originData(false);
                	$scope.addRiskAccountStockSet();
                	$scope.riskAccounStockShow = false;
 	                $scope.$apply();
                	layer.alert("修改成功");
                }else{
                	layer.alert("修改失败");
                }
                layer.closeAll('loading');
             },combineEntity);
    	}
    }
    
})