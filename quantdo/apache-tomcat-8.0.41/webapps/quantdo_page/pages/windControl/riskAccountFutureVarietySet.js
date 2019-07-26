/**
 * Created by Quantdo on 2016/6/6.
 */
myapp.controller('riskAccountFutureVarietySetController',function($scope,$rootScope) {
	
	$scope.riskAccountFutureVarietySetService = new com.quantdo.orgClear.service.RiskAccountFutureVarietySetService();
	$scope.futureVarietiesRestrictionService = new com.quantdo.orgClear.service.FutureVarietiesRestrictionService();
	//设置按钮的名称
	var constant_temp = new com.quantdo.orgClear.constant.ClearConstants();
	
	$scope.riskAccountFutureVarietySet_buttonName_save = constant_temp.buttonName.saveData;
	$scope.riskAccountFutureVarietySet_buttonName_update = constant_temp.buttonName.updateData;
	$scope.riskAccountFutureVarietySet_buttonName_detail_save = constant_temp.buttonName.setPara;
	$scope.riskAccountFutureVarietySet_buttonName_detail_update = constant_temp.buttonName.resetPara;
	$scope.riskAccountFutureShow = false;
	$scope.buttonEdit = true;
	//新增
	$scope.showDetail = function(){
		$scope.riskAccountFutureShow = true;
		$scope.buttonEdit = true;
		$scope.addRiskAccountFutureVarietySet();
		$scope.risKAccountSelect = false;
		setTimeout(function(){
			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
		})
	}
	//取消修改
	$scope.giveUpUpdate = function(){
		$scope.riskAccountFutureShow = false;
		$scope.addRiskAccountFutureVarietySet();
	}
    //存储表格ID
    $scope.riskFutureSetEntity=[];
    $scope.riskFutureSetUpType_dataset = [];//存储表格中的数据
    $scope.subAccountList=[];
    
    
    //表格重绘
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
    //保存所有组合分类下拉菜单的值
    $scope.sortNames = [];
    $scope.entity={};
   
    $scope.riskAccounts = [];  
  
    //数据初始化下拉框信息-资产单元
    $scope.riskAccountEntity={};
    $scope.riskAccountFutureVarietySetService.querySubAccount(function(result){
    	if(result.length>0){
    		$scope.subAccountList = result;
    		$scope.riskAccountEntity.riskAccount = $scope.subAccountList[0].subAccountID;
    	}
    	$scope.$apply();
    });
    

    //初始化数据  
    $scope.riskAccountFutureAddButtonIsShow = false;
    $scope.originData = function(isControl){   	
    	$scope.riskAccountFutureVarietySetService.query(function(result){
    		$scope.riskFutureSetUpType_dataset = [];
    		var con = result;
            for(var i=0;i<con.length;i++){
                var tempArr = [i+1,con[i].brokerID,con[i].riskAccount,con[i].brokerName,con[i].riskAccountName,con[i].assetType,con[i].id,
                               "<input name='checkbox' type='checkbox' disabled='disabled'  "+$rootScope.changeState(con[i].buyOpen)+" />",
                               "<input name='checkbox' type='checkbox' disabled='disabled'  "+$rootScope.changeState(con[i].buyFlat)+" />",
                               "<input name='checkbox' type='checkbox' disabled='disabled'  "+$rootScope.changeState(con[i].sellOpen)+" />",
                               "<input name='checkbox' type='checkbox' disabled='disabled'  "+$rootScope.changeState(con[i].sellFlat)+" />",
                               "<a style='cursor:pointer;' name='RiskAccountFutureVarietySetService.saveRiskAccountFutureVarietySet' class='riskFuture_upCombine backFilter'>[修改]</a>"+
                               "<a style='cursor:pointer;' name='RiskAccountFutureVarietySetService.saveRiskAccountFutureVarietySet' class='riskFuture_delCombine backFilter'>[删除]</a>",
                               con[i].typeFlag,con[i].typeName
                               ];
                $scope.riskFutureSetUpType_dataset.push(tempArr);
            }
            $scope.initDataTables("riskAccountFutureVarietySet_up_table",$scope.columns_total_array, $scope.riskFutureSetUpType_dataset,true);
            if(isControl){
    		   var myfilter = document.getElementsByClassName("backFilter");
    		   hideAfterFilter($rootScope.filterEntity,myfilter);
    		   $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
            }
            $scope.riskAccountFutureAddButtonIsShow = true;
            $scope.$apply();
    	},"","");
    };
    
    $scope.originData(true);
    
    $('#riskAccountFutureVarietySet_up_table').on( 'page.dt', function () {
       	setTimeout(function(){
       		var myfilter = document.getElementsByClassName("backFilter");
           	hideAfterFilter($rootScope.filterEntity,myfilter);
       	})
       }); 
       
       $("body").delegate('#riskAccountFutureVarietySet_up_table_length div').on('change', 'select[name="riskAccountFutureVarietySet_up_table_length"]', function () {
       	setTimeout(function(){
       		var myfilter = document.getElementsByClassName("backFilter");
           	hideAfterFilter($rootScope.filterEntity,myfilter);
       	})
       });
   /* $scope.riskAccountFutureAddShow = true;
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
            { title: "买开"},
            { title: "买平"},
            { title: "卖开"},
            { title: "卖平"},
            { title: "操作"},
            { title: "typeFlag",visible:false},
            { title: "typeName",visible:false}
            
    ];
    
    //保存组合分类表格的表头列
    $scope.riskFutureSetLeftType_column_array = [
        {title:"序号"},
        {title:"选项"},
        {title:"分类名称"},
        {title:"操作"}
    ];
    
    //保存期货品种限制的表头列
    $scope.riskFutureSetRightType_column_array = [
        {title:""},
        {title:"开"},
        {title:"平"}
    ];
    //保存组合分类表格的数据
    $scope.riskFutureSetLeftType_dataset = [
                                   ["1","<select class='riskFuture_typeFlag hidden'><option value=''></option></select>","<select class='riskFuture_typeName'></select>",""],
                                   ["<a style='cursor:pointer;' class='addRow'>+</a>","","",""]
                                  ];

    //保存组合分类表格的数据
    $scope.riskFutureSetRightType_dataset = [
                                   ["买","<input style='cursor:pointer;' type='checkbox' id='riskFutureSet_buyOpen'>","<input style='cursor:pointer;' type='checkbox'  id='riskFutureSet_buyFlat'>"],
                                   ["卖","<input style='cursor:pointer;' type='checkbox' id='riskFutureSet_sellOpen'>","<input style='cursor:pointer;' type='checkbox' id='riskFutureSet_sellFlat'>"]
                                ];


    //初始化固定宽度数据表
    $scope.initDataTables = function(table_id,table_columns,table_data,orderFlag) {
    	return $("#" + table_id).DataTable({
            columns: table_columns,
            data: table_data,
            //scrollY: height,
            //scrollCollapse:true,
            scrollX: true,
           /* "aoColumnDefs": [
                             { "sWidth": "36%", "aTargets": [3] }
            ],*/
            dom: 'rt<"bottom"ipl>',
            ordering: orderFlag,
            //paging:   false,
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
    //初始化非固定宽度数据表
    $scope.initNOWidthDataTablesLeft = function(table_id,table_columns,table_data,orderFlag) {
    	return $("#" + table_id).DataTable({
            columns: table_columns,
            data: table_data,
            scrollY: 150,
            scrollCollapse:true,
            scrollX: true,
            /*"aoColumnDefs": [
                             { "sWidth": "8%", "aTargets": [ 0] },
                             { "sWidth": "18%", "aTargets": [ 1 ] },
                             { "sWidth": "62%", "aTargets": [ 2 ] },
                             { "sWidth": "8%", "aTargets": [ 3 ] }
            ],*/
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
    //初始化非固定宽度数据表
    $scope.initNOWidthDataTables = function(table_id,table_columns,table_data,orderFlag) {
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
        
    //初始化组合分类表格
    var hasLeftRiskFutureSetTypeTable = $scope.initNOWidthDataTablesLeft("riskAccountFutureVarietySet_down_left_table",$scope.riskFutureSetLeftType_column_array,$scope.riskFutureSetLeftType_dataset,true);
    //初始化买卖开平表格
    var hasRightRiskFutureSetTypeTable = $scope.initNOWidthDataTables("riskAccountFutureVarietySet_down_right_table",$scope.riskFutureSetRightType_column_array,$scope.riskFutureSetRightType_dataset,true);


    //点击下方左侧 + 号所触发的事件
    $("body").undelegate("#riskAccountFutureVarietySet_down_left_table td .addRow","click");
    $scope.riskFCount = 1;
    $("body").delegate("#riskAccountFutureVarietySet_down_left_table td .addRow","click",function(){
    	$("#riskAccountFutureVarietySet_down_left_table").DataTable().row($(this).parents("tr")).remove().draw();
    	var index= $("#riskAccountFutureVarietySet_down_left_table").DataTable().context[0].aoData.length+1;
    	$scope.riskFCount = $scope.riskFCount + 1;
    	var flag = $scope.riskFCount;
        var hasfiskFutureSetTypeData = [[index,"<select class='riskFuture_typeFlag' ng-model='fiskFutureSetVarietiesRestrictionEntity.riskFuture_typeFlag'><option value=0>且</option><option value=1>排除</option></select>","<select id='futureTypeName_"+flag+"' ng-model='fiskFutureSetVarietiesRestrictionEntity.riskFuture_typeName' class='riskFuture_typeName'></select>","<a style='cursor:pointer;' name='RiskFutureSetVarietiesRestrictionService.deleteVarietiesRestrictionService' class='backFilter delCombineDetail'>删除</a>"],
                                 ["<a style='cursor:pointer;' class='addRow'>+</a>","","",""]];
        $("#riskAccountFutureVarietySet_down_left_table").DataTable().rows.add(hasfiskFutureSetTypeData).draw();
        var id = "#futureTypeName_" + flag;
        for(var j=0;j<$scope.sortNames.length;j++){
            $(id).append("<option value='"+$scope.sortNames[j]+","+$scope.sortTypeID[j]+","+ $scope.masterID[j]+"'>"+$scope.sortNames[j]+"</option>");
        }
        $scope.$apply();
    })
    
    
    //修改
    $("body").delegate("#riskAccountFutureVarietySet_up_table td .riskFuture_upCombine", "click", function (event){
    	event.stopPropagation();
    	$scope.riskAccountFutureShow = true;
    	$scope.buttonEdit = false;
    	$scope.risKAccountSelect = true;
    		  $scope.entity = {};
    		  $scope.buttonEdit = false;
	    	  $scope.riskFutureSetLeftType_dataset=[]
	    	  //为选中的行设置选中色
	          if($(this).closest('tr').hasClass("selected")){
	              $(this).closest('tr').removeClass("selected");
	          }
	          else{
	              $("tr.selected").removeClass("selected");
	              $(this).closest('tr').addClass("selected");
	          }
	    	  
	    	  var table = $("#riskAccountFutureVarietySet_up_table").DataTable();
	          var tr = $(this).closest('tr');
	          var tempArr = table.row(tr).data();
	          $scope.entity.id = tempArr[6];
	          document.getElementById('riskFutureSet_buyOpen').checked =  $scope.changeState(tempArr[7]);
	          document.getElementById('riskFutureSet_buyFlat').checked =  $scope.changeState(tempArr[8]);
	          document.getElementById('riskFutureSet_sellOpen').checked = $scope.changeState(tempArr[9]);
	          document.getElementById('riskFutureSet_sellFlat').checked = $scope.changeState(tempArr[10]);
	          var typeFlags = tempArr[12].split(";");
	          var typeNames = tempArr[13].split(";");
	          $scope.riskAccountEntity.riskAccount = tempArr[1]+":"+tempArr[2];
	          $scope.$apply();
	  		  destroyDatatable("riskAccountFutureVarietySet_down_left_table");
			  hasLeftRiskFutureSetTypeTable = $scope.initNOWidthDataTablesLeft("riskAccountFutureVarietySet_down_left_table",$scope.riskFutureSetLeftType_column_array,$scope.riskFutureSetLeftType_dataset,true);
	          
			  var hasRiskFutureSetTypeData = [];
			  var size=typeFlags.length;
			  $scope.riskFCount = size -1;
	          for(var i=0;i<size-1;i++){
        	     var flag= i+1;
	          	 if(i==0){
	          		hasRiskFutureSetTypeData[i] = [flag,"","<select id='futureTypeName_"+flag+"' class='riskFuture_typeName'></select>",""];
	          	 }else{
	          		hasRiskFutureSetTypeData[i] = [flag,"<select class='riskFuture_typeFlag'><option value=0>且</option><option value=1>排除</option></select>"
	          	                           ,"<select id='futureTypeName_"+flag+"'  class='riskFuture_typeName'></select>"
	          	                           ,"<a style='cursor:pointer;' name='RiskAccountFutureVarietySetService.RiskAccountFutureSet' class='backFilter delCombineDetail'>删除</a>"
	          	                     ]; 
	          	 }
          	 }         
	         hasRiskFutureSetTypeData[size-1] = ["<a style='cursor:pointer;' class='addRow'>+</a>","","",""];
	         hasLeftRiskFutureSetTypeTable.rows.add(hasRiskFutureSetTypeData).draw();
	         //var id = "#typeName_" + flag;
	         for(var j=0;j<size-1;j++){
	        	 var id = "#futureTypeName_" + (j+1);
	        	 for(var k=0;k<$scope.sortNames.length;k++){
		              $(id).append("<option value='"+$scope.sortNames[k]+","+$scope.sortTypeID[k]+","+ $scope.masterID[k]+"'>"+$scope.sortNames[k]+"</option>");
	        	 }
	         }
	         
	         //	       初始化数据
	         var tmpA = 0;
	         for(var x=0;x<$("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeName").length;x++){
	        	 for(var y=0;y<$("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeName")[x].length;y++){
	        		 if($("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeName")[x][y].value.indexOf(typeNames[tmpA])!=-1){
	                     $("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeName")[x][y].selected = true;
	                     tmpA++;
	                     break;
	                 }
	        	 }
	         }
	         
	         var tmpB = 0;
	         for(var x=0;x<$("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeFlag").length;x++){
	        	 for(var y=0;y<$("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeFlag")[x].length;y++){
	        		 if($("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeFlag")[x][y].value == typeFlags[tmpB+1]){
	                     $("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeFlag")[x][y].selected = true;
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
    $("body").delegate("#riskAccountFutureVarietySet_up_table td .riskFuture_delCombine", "click", function (event){
    	event.stopPropagation();
    	 var table = $("#riskAccountFutureVarietySet_up_table").DataTable();
    	 var mytr = $(this).parents('tr');
         var id = table.row(mytr).data()[6];
         layer.confirm("确定删除该条信息？", {icon: 3}, function (count) {
        	layer.load(2, {
   	 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
   	 	   	});
	        //初始化数据
	        $scope.riskAccountFutureVarietySetService.deleteRiskAccountFutureSet(function(result){   	
	        	if(result==true){
	                destroyDatatable("riskAccountFutureVarietySet_up_table");
	                $scope.originData(false);
	                $scope.addRiskAccountFutureVarietySet();
	                $scope.riskAccountFutureShow = false;
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
    $("body").delegate("#riskAccountFutureVarietySet_down_left_table td .delCombineDetail", "click", function (){
    	 hasLeftRiskFutureSetTypeTable.row($(this).parents("tr")).remove().draw();
    	 for(var i=0;i<hasLeftRiskFutureSetTypeTable.context[0].aoData.length-1;i++){
             var index = hasLeftRiskFutureSetTypeTable.cell($(hasLeftRiskFutureSetTypeTable.context[0].aoData[i].nTr).children()[0]);
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
        $scope.futureVarietiesRestrictionService.getFutureControlCapitalType("2","",function(result){
            for(var i=0;i<result.length;i++){
                $scope.sortNames.push(result[i].sortName);
                $scope.sortTypeID.push(result[i].sortTypeID);
                $scope.masterID.push(result[i].masterID);
            }
            for(var j=0;j<$scope.sortNames.length;j++){
                $("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeName").append("<option value='"+$scope.sortNames[j]+","+$scope.sortTypeID[j]+","+ $scope.masterID[j]+"'>"+$scope.sortNames[j]+"</option>");
            }
        });
    };
    $scope.getSortName();
    
    $scope.getSizeOfTable = function(id){
    	var table = document.getElementById("riskAccountFutureVarietySet_down_left_table") ;
		return  table.rows.length;
    }
    
    $scope.addRiskAccountFutureVarietySet = function(){
    	$scope.risKAccountSelect = false;
    	$scope.riskAccountFutureVarietySet_buttonName_detail = constant_temp.buttonName.setPara;
    	$scope.riskFutureSetLeftType_dataset = [];
		document.getElementById('riskFutureSet_buyOpen').checked = false;
		document.getElementById('riskFutureSet_buyFlat').checked = false;
		document.getElementById('riskFutureSet_sellOpen').checked = false;
		document.getElementById('riskFutureSet_sellFlat').checked = false;
		//$('#riskAccountFutureVarietySet_riskAccount').get(0).selectedIndex;//索引
		$("#riskAccountFutureVarietySet_riskAccount").get(0).selected = true;
	    //$("#riskAccountFutureVarietySet_riskAccount").get(0).selectedIndex=0;
		$scope.entity={};
		$scope.entity.id="-1";
    	$scope.buttonEdit = true;
		
		destroyDatatable("riskAccountFutureVarietySet_down_left_table");
		$scope.getSortName();
		hasLeftRiskFutureSetTypeTable = $scope.initNOWidthDataTablesLeft("riskAccountFutureVarietySet_down_left_table",$scope.riskFutureSetLeftType_column_array,$scope.riskFutureSetLeftType_dataset,true);
        var flag = 1;
		var hasRiskFutureSetTypeData = [[flag,"","<select id='futureTypeName_"+flag+"' class='riskFuture_typeName'></select>",""],
                                 ["<a style='cursor:pointer;' class='addRow'>+</a>","","",""]];
        hasLeftRiskFutureSetTypeTable.rows.add(hasRiskFutureSetTypeData).draw();
        var id = "#futureTypeName_" + flag;
        for(var j=0;j<$scope.sortNames.length;j++){
            $(id).append("<option value='"+$scope.sortNames[j]+","+$scope.sortTypeID[j]+","+ $scope.masterID[j]+"'>"+$scope.sortNames[j]+"</option>");
        }
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
    
    $scope.saveOrUpdate = function(riskAccountEntity){	
    	
    	var combineEntity = {};
    	combineEntity.buyOpen= document.getElementById('riskFutureSet_buyOpen').checked;
    	combineEntity.buyFlat=document.getElementById('riskFutureSet_buyFlat').checked;
    	combineEntity.sellOpen=document.getElementById('riskFutureSet_sellOpen').checked;
    	combineEntity.sellFlat=document.getElementById('riskFutureSet_sellFlat').checked;
    	combineEntity.brokerID = $scope.riskAccountEntity.riskAccount.split(":")[0];
    	combineEntity.riskAccount = $scope.riskAccountEntity.riskAccount.split(":")[1];
    	combineEntity.id = $scope.entity.id;
    	
        var contentDataList = [];
        
        if(combineEntity.id){
        	for(var i=0;i<hasLeftRiskFutureSetTypeTable.context[0].aoData.length-1;i++){
                var contentData = {};
                contentData.exchangeID = i+1;
                if(i!=0){
                	for(var j=0;j<$("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeFlag")[i-1].length;j++){
                        if($("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeFlag")[i-1][j].selected == true){
                            contentData.typeFlag = $("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeFlag")[i-1][j].value;
                            break;
                        }
                    }
                }else{
                	contentData.typeFlag = "-1";
                }
                for(var j=0;j<$("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeName")[i].length;j++){
                    if($("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeName")[i][j].selected == true){                  
                        var typeInfo = $("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeName")[i][j].value.split(",");
                        contentData.sortNames = typeInfo[0];
                        contentData.sortTypeID = typeInfo[1];
                        contentData.masterID = typeInfo[2];
                        break;
                    }
                }
                contentDataList.push(contentData);
            }
        }else{
            	for(var i=0;i<hasLeftRiskFutureSetTypeTable.context[0].aoData.length-1;i++){
                    var contentData = {};
                    contentData.exchangeID = i+1;
                    if(i!=0){
                    	for(var j=0;j<$("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeFlag")[i].length;j++){
                            if($("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeFlag")[i][j].selected == true){
                                contentData.typeFlag = $("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeFlag")[i][j].value;
                                break;
                            }
                        }
                    }else{
                    	contentData.typeFlag = "-1";
                    }
                    for(var j=0;j<$("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeName")[i].length;j++){
                        if($("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeName")[i][j].selected == true){                  
                            var typeInfo = $("#riskAccountFutureVarietySet_down_left_table .riskFuture_typeName")[i][j].value.split(",");
                            contentData.sortNames = typeInfo[0];
                            contentData.sortTypeID = typeInfo[1];
                            contentData.masterID = typeInfo[2];
                            break;
                        }
                    }
                    contentDataList.push(contentData);
            }
        }
        
        combineEntity.futureSetLists = contentDataList;
        var str = "";
        $scope.names=[];
        var tmpSet = $scope.riskFutureSetUpType_dataset;
        
        for(var i=0;i<contentDataList.length;i++){
        		var flag = $scope.changeTypeFlag(contentDataList[i].typeFlag);
        		var name = contentDataList[i].sortNames;
        		$scope.names.push(name);
        		str += flag+"【"+name+"】";
        }
        
        //判断数据是否重复
        for(var i=0;i<tmpSet.length;i++){
        	if(tmpSet[i][1]==combineEntity.brokerID && tmpSet[i][2]==combineEntity.riskAccount&&tmpSet[i][5]==str&&tmpSet[i][6]!=combineEntity.id){
        		layer.alert("数据重复");
            	return false;
        	}
        }
        
        var flag1 = false;
        for(var k=0;k<tmpSet.length;k++){
        	if(tmpSet[k][2]==str){
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
	    $scope.riskFutureSetUpType_cap_dataset=[];
	    for(var m=0;m<$scope.riskFutureSetUpType_dataset.length;m++){
	    	$scope.riskFutureSetUpType_cap_dataset.push($scope.riskFutureSetUpType_dataset[m][1]);
	    	if($scope.entity.id==$scope.riskFutureSetUpType_dataset[m][2]){
	    		tmpEntity = $scope.riskFutureSetUpType_dataset[m];
	    	}
	    }
	    $scope.riskFutureSetUpType_cap_dataset.push(str);
	    //修改后判断类型重复
        var flag3 = false
        var ary1 = $scope.riskFutureSetUpType_cap_dataset;
        var nary1=ary1.sort();
	    for(var i=0;i<ary1.length;i++){
	        if (nary1[i]==nary1[i+1]){
	        	flag3 = true;
	        }
	    }
	    
        var bOpen = combineEntity.buyOpen;
        var bFlat = combineEntity.buyFlat;
        var sOpen = combineEntity.sellOpen;
        var sFlat = combineEntity.sellFlat;
        
        if((bOpen&&bFlat&&sOpen&&sFlat)||(!bOpen&&!bFlat&&!sOpen&&!sFlat)||(!bOpen&&bFlat&&!sOpen&&sFlat)){
        	//id为空
        	if(combineEntity.id==undefined || combineEntity.id=="-1"){
        		
        		layer.load(2, {
        	 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
        	 	   	});
	        	$scope.riskAccountFutureVarietySetService.saveRiskAccountFutureVarietySet(function(result){
	                var con = result;
	                if(con==true){
	                	destroyDatatable("riskAccountFutureVarietySet_up_table");
	                	$scope.originData(false);
	                	$scope.addRiskAccountFutureVarietySet();
	                	$scope.riskAccountFutureShow = false;
	                	$scope.$apply();
	                	layer.alert("新增成功");
	                }else{
	                	layer.alert("新增失败");
	                }
	                layer.closeAll('loading');
	                return false;
	             },combineEntity);
        	}else{
        		
        		layer.load(2, {
     	 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
     	 	   	});
        		$scope.riskAccountFutureVarietySetService.updateRiskAccountFutureVarietySet(function(result){
	                var con = result;
	                if(con==true){
	                	destroyDatatable("riskAccountFutureVarietySet_up_table");
	                	$scope.originData(false);
	                	$scope.addRiskAccountFutureVarietySet();
	                	$scope.riskAccountFutureShow = false;
	                	$scope.$apply();
	                	layer.alert("修改成功");
	                }else{
	                	layer.alert("修改失败");
	                }
	                layer.closeAll('loading');
	                return false;
	             },combineEntity);
        	}
        }else{
        	layer.alert("买卖开平组合方式,暂不支持");
        	document.getElementById('riskFutureSet_buyOpen').checked = false;
    		document.getElementById('riskFutureSet_buyFlat').checked = false;
    		document.getElementById('riskFutureSet_sellOpen').checked = false;
    		document.getElementById('riskFutureSet_sellFlat').checked = false;
        }
    	
    }
    
})