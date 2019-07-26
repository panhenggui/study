/**
 * Created by Quantdo on 2016/6/6.
 */
myapp.controller('futureVarietiesRestrictionController',function($scope,$rootScope) {
	
	$scope.futureVarietiesRestrictionService = new com.quantdo.orgClear.service.FutureVarietiesRestrictionService();
	//设置按钮的名称
	var constant_temp = new com.quantdo.orgClear.constant.ClearConstants();
	$scope.futureVarietiesRestriction_buttonName_detail_save = constant_temp.buttonName.setPara;
	$scope.futureVarietiesRestriction_buttonName_save = constant_temp.buttonName.saveData;
	$scope.futureVarietiesRestriction_buttonName_update = constant_temp.buttonName.updateData;
	$scope.futureVarietiesRestriction_buttonName_detail_update = constant_temp.buttonName.resetPara;
	$scope.buttonEdit = true;
	$scope.futureVarietiesRestrictionShow = false;
	
	//新增
	$scope.showDetail = function(){
		$scope.buttonEdit = true;
		$scope.futureVarietiesRestrictionShow = true;
		$scope.addFutureVarietiesRestriction();
		$scope.futureCount = 1;
		setTimeout(function(){
			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
		})
	}
	//取消修改
	$scope.geveUpUpdate = function(){
		$scope.futureVarietiesRestrictionShow = false;
		$scope.addFutureVarietiesRestriction();
	}
    //存储表格ID
    $scope.futureVarietiesRestrictionEntity=[];
    $scope.futureUpType_dataset = [];//存储表格中的数据
    
    //表格重绘
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
    //保存所有组合分类下拉菜单的值
    $scope.sortNames = [];
    $scope.entity={};
   


    //初始化数据  
    $scope.futureVaritAddButtonIsShow = false;
    $scope.originData = function(isControl){   	
//    	var fundID = "0003";//临时值
    	var fundID = sessionStorage.listFundID;
    	$scope.futureVarietiesRestrictionService.queryFutureVarietiesRestriction(function(result){
    		$scope.futureUpType_dataset = [];
    		var con = result;
            for(var i=0;i<con.length;i++){
                var tempArr = [i+1,con[i].assetType,con[i].id,
                               "<input name='checkbox' type='checkbox' disabled='disabled'  "+$rootScope.changeState(con[i].buyOpen)+" />",
                               "<input name='checkbox' type='checkbox' disabled='disabled'  "+$rootScope.changeState(con[i].buyFlat)+" />",
                               "<input name='checkbox' type='checkbox' disabled='disabled'  "+$rootScope.changeState(con[i].sellOpen)+" />",
                               "<input name='checkbox' type='checkbox' disabled='disabled'  "+$rootScope.changeState(con[i].sellFlat)+" />",
                               "<a style='cursor:pointer;' name='FutureVarietiesRestrictionService.deleteVarietiesRestrictionService' class='future_upCombine backFilter'>[修改]</a>"+
                               "<a style='cursor:pointer;' name='FutureVarietiesRestrictionService.deleteVarietiesRestrictionService' class='future_delCombine backFilter'>[删除]</a>",
                               con[i].typeFlag,con[i].typeName
                               ];
                $scope.futureUpType_dataset.push(tempArr);
            }
            
            $scope.initDataTables_main("futureVarietiesRestriction_up_table",$scope.columns_total_array, $scope.futureUpType_dataset,300);
            if(isControl){
     		   var myfilter = document.getElementsByClassName("backFilter");
     		   hideAfterFilter($rootScope.filterEntity,myfilter);
     		   $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
            }
            $scope.futureVaritAddButtonIsShow = true;
            $scope.$apply();
    	},fundID,sessionStorage.listBrokerID);
    };
    
    $scope.originData(true);
    
    $('#futureVarietiesRestriction_up_table').on( 'page.dt', function () {
    	setTimeout(function(){
    		var myfilter = document.getElementsByClassName("backFilter");
        	hideAfterFilter($rootScope.filterEntity,myfilter);
    	})
    }); 
    
    $("body").delegate('#futureVarietiesRestriction_up_table_length div').on('change', 'select[name="futureVarietiesRestriction_up_table_length"]', function () {
    	setTimeout(function(){
    		var myfilter = document.getElementsByClassName("backFilter");
        	hideAfterFilter($rootScope.filterEntity,myfilter);
    	})
    });
  /*  $scope.futureVaritAddShow = true;
    $(document).ready(function(){
    	$scope.originData();
   	   setTimeout(function(){
           $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
   		   var myfilter = document.getElementsByClassName("backFilter");
   		   hideAfterFilter($rootScope.filterEntity,myfilter);
   	   },"500")
      });*/
  
    //期货交易品种限制总表
    $scope.columns_total_array = [
            { title: "序号"},
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
    $scope.futureLeftType_column_array = [
        {title:"序号"},
        {title:"选项"},
        {title:"分类名称"},
        {title:"操作"}
    ];
    
    //保存期货品种限制的表头列
    $scope.futureRightType_column_array = [
        {title:""},
        {title:"开"},
        {title:"平"}
    ];
    //保存组合分类表格的数据
    $scope.futureLeftType_dataset = [
                                   ["1","<select class='future_typeFlag hidden'><option value=''></option></select>","<select class='future_typeName'></select>",""],
                                   ["<a style='cursor:pointer;' class='addRow'>+</a>","","",""]
                                  ];

    //保存组合分类表格的数据
    $scope.futureRightType_dataset = [
                                   ["买","<input style='cursor:pointer;' type='checkbox' ng-checked='isSelected' ng-model='futureVarietiesRestrictionEntity.future_buyOpen'  id='future_buyOpen'>","<input style='cursor:pointer;' type='checkbox'  ng-checked='isSelected' ng-model='futureVarietiesRestrictionEntity.future_buyFlat'  id='future_buyFlat'>"],
                                   ["卖","<input style='cursor:pointer;' type='checkbox'  ng-checked='isSelected' ng-model='futureVarietiesRestrictionEntity.future_sellOpen' id='future_sellOpen'>","<input style='cursor:pointer;' type='checkbox'  ng-checked='isSelected' ng-model='futureVarietiesRestrictionEntity.future_sellFlat' id='future_sellFlat'>"]
                                ];


    //初始化数据表
    $scope.initDataTables_main = function(table_id,table_columns,table_data,height,orderFlag) {
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
            ordering: !orderFlag,
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
    //初始化数据表
    $scope.initDataTables = function(table_id,table_columns,table_data,height,orderFlag) {
    	return $("#" + table_id).DataTable({
            columns: table_columns,
            data: table_data,
            scrollY: 150,
            scrollCollapse:true,
            scrollX: true,
            "aoColumnDefs": [
                             { "sWidth": "36%", "aTargets": [ 1 ] }
            ],
            dom: 'rt<"bottom"ipl>',
            ordering: !orderFlag,
            paging:   false,
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
    
    //初始化下方左侧数据表
    $scope.initLeftDataTables = function(table_id,table_columns,table_data,height,orderFlag) {
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
                info: "显示 _START_ 条到 _END_ 条 共 _TOTAL_ 条记录",
                infoEmpty: "显示 0 条到 0 条 共 0 条记录",
                lengthMenu: "显示 _MENU_ 条 记录"
            }
        })
    };
        

	//初始化资金账户总持仓表格
    //var hasUpFutureTypeTable =  $scope.initDataTables("futureVarietiesRestriction_up_table",$scope.columns_total_array, $scope.futureUpType_dataset,180);
    //初始化组合分类表格
    var hasLeftFutureTypeTable = $scope.initLeftDataTables("futureVarietiesRestriction_down_left_table",$scope.futureLeftType_column_array,$scope.futureLeftType_dataset,150,true);
    //初始化组合分类表格
    var hasRightFutureTypeTable = $scope.initDataTables("futureVarietiesRestriction_down_right_table",$scope.futureRightType_column_array,$scope.futureRightType_dataset,300,true);


    //点击+号
    $scope.futureCount = 1;
    $("body").delegate("#futureVarietiesRestriction_down_left_table td .addRow","click",function(){
    	hasLeftFutureTypeTable.row($(this).parents("tr")).remove().draw();
    	var index = hasLeftFutureTypeTable.context[0].aoData.length+1;
    	$scope.futureCount = $scope.futureCount+1;
    	var flag = $scope.futureCount;
        var hasfutureTypeData = [[index,"<select class='future_typeFlag' ng-model='futureVarietiesRestrictionEntity.future_typeFlag'><option value=0>且</option><option value=1>排除</option></select>","<select id='future_typeName_"+flag+"' ng-model='futureVarietiesRestrictionEntity.future_typeName' class='future_typeName'></select>","<a style='cursor:pointer;' name='FutureVarietiesRestrictionService.deleteVarietiesRestrictionService' class='backFilter delCombineDetail'>删除</a>"],
                                 ["<a style='cursor:pointer;' class='addRow'>+</a>","","",""]];
        hasLeftFutureTypeTable.rows.add(hasfutureTypeData).draw();
        var id = "#future_typeName_" + flag;
        for(var j=0;j<$scope.sortNames.length;j++){
            $(id).append("<option value='"+$scope.sortNames[j]+","+$scope.sortTypeID[j]+","+ $scope.masterID[j]+"'>"+$scope.sortNames[j]+"</option>");
        }
        $scope.$apply();
    })
  //修改
  $("body").delegate("#futureVarietiesRestriction_up_table td .future_upCombine", "click", function (event){
	      event.stopPropagation();
		  $scope.entity = {};
		  $scope.futureVarietiesRestrictionShow = true;
		  $scope.buttonEdit = false;
    	  $scope.futureLeftType_dataset=[]
    	  //为选中的行设置选中色
          if($(this).closest('tr').hasClass("selected")){
              $(this).closest('tr').removeClass("selected");
          }
          else{
              $("tr.selected").removeClass("selected");
              $(this).closest('tr').addClass("selected");
          }
    	  
    	  var table = $("#futureVarietiesRestriction_up_table").DataTable();
          var tr = $(this).closest('tr');
          var tempArr = table.row(tr).data();
          $scope.entity.id = tempArr[2];
          document.getElementById('future_buyOpen').checked =  $scope.changeState(tempArr[3]);
          document.getElementById('future_buyFlat').checked =  $scope.changeState(tempArr[4]);
          document.getElementById('future_sellOpen').checked = $scope.changeState(tempArr[5]);
          document.getElementById('future_sellFlat').checked = $scope.changeState(tempArr[6]);
          var typeFlags = tempArr[8].split(";");
          var typeNames = tempArr[9].split(";");
  		  destroyDatatable("futureVarietiesRestriction_down_left_table");
		  hasLeftFutureTypeTable = $scope.initLeftDataTables("futureVarietiesRestriction_down_left_table",$scope.futureLeftType_column_array,$scope.futureLeftType_dataset,300,true);
          
		  var hasfutureTypeData = [];
		  var size=typeFlags.length;
		  $scope.futureCount = size-1;
          for(var i=0;i<size-1;i++){
    	     var flag= i+1;
          	 if(i==0){
                hasfutureTypeData[i] = [flag,"","<select id='future_typeName_"+flag+"' class='future_typeName'></select>",""];
          	 }else{
          		hasfutureTypeData[i] = [flag,"<select class='future_typeFlag'><option value=0>且</option><option value=1>排除</option></select>"
          	                           ,"<select id='future_typeName_"+flag+"'  class='future_typeName'></select>"
          	                           ,"<a style='cursor:pointer;' name='FutureVarietiesRestrictionService.deleteVarietiesRestrictionService' class='backFilter delCombineDetail'>删除</a>"
          	                     ]; 
          	 }
      	 }         
         hasfutureTypeData[size-1] = ["<a style='cursor:pointer;' class='addRow'>+</a>","","",""];
         hasLeftFutureTypeTable.rows.add(hasfutureTypeData).draw();
         //var id = "#typeName_" + flag;
         for(var j=0;j<size-1;j++){
        	 var id = "#future_typeName_" + (j+1);
        	 for(var k=0;k<$scope.sortNames.length;k++){
	              $(id).append("<option value='"+$scope.sortNames[k]+","+$scope.sortTypeID[k]+","+ $scope.masterID[k]+"'>"+$scope.sortNames[k]+"</option>");
        	 }
         }
         
         //	       初始化数据
         var tmpA = 0;
         for(var x=0;x<$("#futureVarietiesRestriction_down_left_table .future_typeName").length;x++){
        	 for(var y=0;y<$("#futureVarietiesRestriction_down_left_table .future_typeName")[x].length;y++){
        		 if($("#futureVarietiesRestriction_down_left_table .future_typeName")[x][y].value.indexOf(typeNames[tmpA])!=-1){
//	                     $("#typeName_"+(tmpA+1)+"").value = $("#futureVarietiesRestriction_down_left_table .future_typeName")[x][y].value;
                     $("#futureVarietiesRestriction_down_left_table .future_typeName")[x][y].selected = true;
                     tmpA++;
                     break;
                 }
        	 }
         }
         
         var tmpB = 0;
         for(var x=0;x<$("#futureVarietiesRestriction_down_left_table .future_typeFlag").length;x++){
        	 for(var y=0;y<$("#futureVarietiesRestriction_down_left_table .future_typeFlag")[x].length;y++){
        		 if($("#futureVarietiesRestriction_down_left_table .future_typeFlag")[x][y].value == typeFlags[tmpB+1]){
                     $("#futureVarietiesRestriction_down_left_table .future_typeFlag")[x][y].selected = true;
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
    $("body").delegate("#futureVarietiesRestriction_up_table td .future_delCombine", "click", function (event){
    	event.stopPropagation();
    	 var table = $("#futureVarietiesRestriction_up_table").DataTable();
    	 var mytr = $(this).parents('tr');
         var id = table.row(mytr).data()[2];
         layer.confirm("确定删除该条信息？", {icon: 3}, function (count) {
        	layer.load(2, {
   	 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
   	 	   	});
	        //初始化数据
	        $scope.futureVarietiesRestrictionService.deleteVarietiesRestrictionService(function(result){   	
	        	if(result==true){
	                destroyDatatable("futureVarietiesRestriction_up_table");
	                $scope.originData(false);
	                $scope.addFutureVarietiesRestriction();
	                $scope.futureVarietiesRestrictionShow = false;
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
   /* //点击行，代入数据
    $("body").delegate("#futureVarietiesRestriction_up_table tbody tr", "click", function (){
    		  $scope.entity = {};
    		  $scope.buttonEdit = false;
	    	  $scope.futureLeftType_dataset=[]
	    	  //为选中的行设置选中色
	          if($(this).hasClass("selected")){
	              $(this).removeClass("selected");
	          }
	          else{
	              $("tr.selected").removeClass("selected");
	              $(this).addClass("selected");
	          }
	    	  
	          var table = $("#futureVarietiesRestriction_up_table").DataTable();
	          var tempArr = table.row($(this)).data();
	          $scope.entity.id = tempArr[2];
	          document.getElementById('future_buyOpen').checked =  $scope.changeState(tempArr[3]);
	          document.getElementById('future_buyFlat').checked =  $scope.changeState(tempArr[4]);
	          document.getElementById('future_sellOpen').checked = $scope.changeState(tempArr[5]);
	          document.getElementById('future_sellFlat').checked = $scope.changeState(tempArr[6]);
	          var typeFlags = tempArr[8].split(";");
	          var typeNames = tempArr[9].split(";");
	  		  destroyDatatable("futureVarietiesRestriction_down_left_table");
			  hasLeftFutureTypeTable = $scope.initLeftDataTables("futureVarietiesRestriction_down_left_table",$scope.futureLeftType_column_array,$scope.futureLeftType_dataset,300,true);
	          
			  var hasfutureTypeData = [];
			  var size=typeFlags.length;
	          for(var i=0;i<size-1;i++){
        	     var flag= i+1;
	          	 if(i==0){
	                hasfutureTypeData[i] = [flag,"","<select id='typeName_"+flag+"' class='typeName'></select>",""];
	          	 }else{
	          		hasfutureTypeData[i] = [flag,"<select class='typeFlag'><option value=0>且</option><option value=1>排除</option></select>"
	          	                           ,"<select id='typeName_"+flag+"'  class='typeName'></select>"
	          	                           ,"<a style='cursor:pointer;' name='FutureVarietiesRestrictionService.deleteVarietiesRestrictionService' class='backFilter delCombineDetail'>删除</a>"
	          	                     ]; 
	          	 }
          	 }         
             hasfutureTypeData[size-1] = ["<a class='addRow'>+</a>","","",""];
	         hasLeftFutureTypeTable.rows.add(hasfutureTypeData).draw();
	         //var id = "#typeName_" + flag;
	         for(var j=0;j<size-1;j++){
	        	 var id = "#typeName_" + (j+1);
	        	 for(var k=0;k<$scope.sortNames.length;k++){
		              $(id).append("<option value='"+$scope.sortNames[k]+","+$scope.sortTypeID[k]+","+ $scope.masterID[k]+"'>"+$scope.sortNames[k]+"</option>");
	        	 }
	         }
	         
	         //	       初始化数据
	         var tmpA = 0;
	         for(var x=0;x<$("#futureVarietiesRestriction_down_left_table .typeName").length;x++){
	        	 for(var y=0;y<$("#futureVarietiesRestriction_down_left_table .typeName")[x].length;y++){
	        		 if($("#futureVarietiesRestriction_down_left_table .typeName")[x][y].value.indexOf(typeNames[tmpA])!=-1){
//	                     $("#typeName_"+(tmpA+1)+"").value = $("#futureVarietiesRestriction_down_left_table .typeName")[x][y].value;
	                     $("#futureVarietiesRestriction_down_left_table .typeName")[x][y].selected = true;
	                     tmpA++;
	                     break;
	                 }
	        	 }
	         }
	         
	         var tmpB = 0;
	         for(var x=0;x<$("#futureVarietiesRestriction_down_left_table .typeFlag").length;x++){
	        	 for(var y=0;y<$("#futureVarietiesRestriction_down_left_table .typeFlag")[x].length;y++){
	        		 if($("#futureVarietiesRestriction_down_left_table .typeFlag")[x][y].value == typeFlags[tmpB+1]){
	                     $("#futureVarietiesRestriction_down_left_table .typeFlag")[x][y].selected = true;
	                     tmpB++;
	                     break;
	                 }
	        	 }
	         }
	         $scope.$apply();
    	});*/


    
    //删除分类名称
    $("body").delegate("#futureVarietiesRestriction_down_left_table td .delCombineDetail", "click", function (){    	 
    	 hasLeftFutureTypeTable.row($(this).parents("tr")).remove().draw();
         for(var i=0;i<hasLeftFutureTypeTable.context[0].aoData.length-1;i++){
             var index = hasLeftFutureTypeTable.cell($(hasLeftFutureTypeTable.context[0].aoData[i].nTr).children()[0]);
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
        $scope.futureVarietiesRestrictionService.getFutureControlCapitalType("2",sessionStorage.listBrokerID,function(result){
            for(var i=0;i<result.length;i++){
                $scope.sortNames.push(result[i].sortName);
                $scope.sortTypeID.push(result[i].sortTypeID);
                $scope.masterID.push(result[i].masterID);
            }
            for(var j=0;j<$scope.sortNames.length;j++){
                $("#futureVarietiesRestriction_down_left_table .future_typeName").append("<option value='"+$scope.sortNames[j]+","+$scope.sortTypeID[j]+","+ $scope.masterID[j]+"'>"+$scope.sortNames[j]+"</option>");
            }
        });
    };
    $scope.getSortName();
    
    $scope.getSizeOfTable = function(id){
    	var table = document.getElementById("futureVarietiesRestriction_down_left_table") ;
		return  table.rows.length;
    }
    
    $scope.addFutureVarietiesRestriction = function(){
    	$scope.futureVarietiesRestriction_buttonName_detail = constant_temp.buttonName.setPara;
    	$scope.futureLeftType_dataset = [];
		document.getElementById('future_buyOpen').checked = false;
		document.getElementById('future_buyFlat').checked = false;
		document.getElementById('future_sellOpen').checked = false;
		document.getElementById('future_sellFlat').checked = false;
		$scope.entity={};
		$scope.entity.id="-1";
    	$scope.buttonEdit = true;
		
		destroyDatatable("futureVarietiesRestriction_down_left_table");
		$scope.getSortName();
		hasLeftFutureTypeTable = $scope.initLeftDataTables("futureVarietiesRestriction_down_left_table",$scope.futureLeftType_column_array,$scope.futureLeftType_dataset,300,true);
        var flag = 1;
		var hasfutureTypeData = [[flag,"","<select id='future_typeName_"+flag+"' class='future_typeName'></select>",""],
                                 ["<a style='cursor:pointer;' class='addRow'>+</a>","","",""]];
        hasLeftFutureTypeTable.rows.add(hasfutureTypeData).draw();
        var id = "#future_typeName_" + flag;
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
    
    $scope.saveFutureVarietiesRestriction = function(){	
    	
    	var combineEntity = {};
    	combineEntity.buyOpen= document.getElementById('future_buyOpen').checked;
    	combineEntity.buyFlat=document.getElementById('future_buyFlat').checked;
    	combineEntity.sellOpen=document.getElementById('future_sellOpen').checked;
    	combineEntity.sellFlat=document.getElementById('future_sellFlat').checked;
    	combineEntity.fundID = sessionStorage.listFundID;
    	combineEntity.id = $scope.entity.id;
    	
        var contentDataList = [];
        
        if(combineEntity.id){
        	for(var i=0;i<hasLeftFutureTypeTable.context[0].aoData.length-1;i++){
                var contentData = {};
                contentData.exchangeID = i+1;
                if(i!=0){
                	for(var j=0;j<$("#futureVarietiesRestriction_down_left_table .future_typeFlag")[i-1].length;j++){
                        if($("#futureVarietiesRestriction_down_left_table .future_typeFlag")[i-1][j].selected == true){
                            contentData.typeFlag = $("#futureVarietiesRestriction_down_left_table .future_typeFlag")[i-1][j].value;
                            break;
                        }
                    }
                }else{
                	contentData.typeFlag = "-1";
                }
                for(var j=0;j<$("#futureVarietiesRestriction_down_left_table .future_typeName")[i].length;j++){
                    if($("#futureVarietiesRestriction_down_left_table .future_typeName")[i][j].selected == true){                  
                        var typeInfo = $("#futureVarietiesRestriction_down_left_table .future_typeName")[i][j].value.split(",");
                        contentData.sortNames = typeInfo[0];
                        contentData.sortTypeID = typeInfo[1];
                        contentData.masterID = typeInfo[2];
                        break;
                    }
                }
                contentDataList.push(contentData);
            }
        }else{
            	for(var i=0;i<hasLeftFutureTypeTable.context[0].aoData.length-1;i++){
                    var contentData = {};
                    contentData.exchangeID = i+1;
                    if(i!=0){
                    	for(var j=0;j<$("#futureVarietiesRestriction_down_left_table .future_typeFlag")[i].length;j++){
                            if($("#futureVarietiesRestriction_down_left_table .future_typeFlag")[i][j].selected == true){
                                contentData.typeFlag = $("#futureVarietiesRestriction_down_left_table .future_typeFlag")[i][j].value;
                                break;
                            }
                        }
                    }else{
                    	contentData.typeFlag = "-1";
                    }
                    for(var j=0;j<$("#futureVarietiesRestriction_down_left_table .future_typeName")[i].length;j++){
                        if($("#futureVarietiesRestriction_down_left_table .future_typeName")[i][j].selected == true){                  
                            var typeInfo = $("#futureVarietiesRestriction_down_left_table .future_typeName")[i][j].value.split(",");
                            contentData.sortNames = typeInfo[0];
                            contentData.sortTypeID = typeInfo[1];
                            contentData.masterID = typeInfo[2];
                            break;
                        }
                    }
                    contentDataList.push(contentData);
            }
        }
        
        combineEntity.futureLists = contentDataList;
        var str = "";
        $scope.names=[];
        var tmpSet = $scope.futureUpType_dataset;
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
	    $scope.futureUpType_cap_dataset=[];
	    for(var m=0;m<$scope.futureUpType_dataset.length;m++){
	    	$scope.futureUpType_cap_dataset.push($scope.futureUpType_dataset[m][1]);
	    	if($scope.entity.id==$scope.futureUpType_dataset[m][2]){
	    		tmpEntity = $scope.futureUpType_dataset[m];
	    	}
	    }
	    $scope.futureUpType_cap_dataset.push(str);
	    //修改后判断类型重复
        var flag3 = false
        var ary1 = $scope.futureUpType_cap_dataset;
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
        /*
        if(tmpEntity!=""){
            var tmpBOpen = $scope.changeState(tmpEntity[3]);
            var tmpBFlat = $scope.changeState(tmpEntity[4]);
            var tmpSOpen = $scope.changeState(tmpEntity[5]);
            var tmpSFlat = $scope.changeState(tmpEntity[6]);
            if($scope.entity.id !="-1" && flag3 && tmpBOpen==bOpen 
          	      && tmpBFlat==bFlat && tmpSOpen==sOpen && tmpSFlat==sFlat){
          	    	layer.alert("没有更新记录,请重新操作!");
                  	return false;
          	}
        }else{
        	//禁止修改过程中，对该记录没有资产类型及操作权限变动
    	    if($scope.entity.id !="-1" && flag3 && tmpBOpen==bOpen 
    	      && tmpBFlat==bFlat && tmpSOpen==sOpen && tmpSFlat==sFlat){
    	    	layer.alert("没有更新记录或资产类型重复,请重新操作!");
            	return false;
    	    }
        }*/
        
        if((bOpen&&bFlat&&sOpen&&sFlat)||(!bOpen&&!bFlat&&!sOpen&&!sFlat)||(!bOpen&&bFlat&&!sOpen&&sFlat)){
        	//id为空
        	if(combineEntity.id==undefined || combineEntity.id=="-1"){
        		
        		layer.load(2, {
        	 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
        	 	   	});
	        	$scope.futureVarietiesRestrictionService.saveFutureVarietiesRestriction(function(result){
	                var con = result;
	                if(con==true){
	                	destroyDatatable("futureVarietiesRestriction_up_table");
	                	$scope.originData(false);
	                	$scope.addFutureVarietiesRestriction();
	                	 $scope.futureVarietiesRestrictionShow = false;
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
        		$scope.futureVarietiesRestrictionService.updateFutureVarietiesRestriction(function(result){
	                var con = result;
	                if(con==true){
	                	destroyDatatable("futureVarietiesRestriction_up_table");
	                	$scope.originData(false);
	                	$scope.addFutureVarietiesRestriction();
	                	$scope.futureVarietiesRestrictionShow = false;
	                	 $scope.$apply();
	                	layer.alert("修改成功");
	                }else{
	                	layer.alert("修改失败");
	                }
	                layer.closeAll('loading');
	             },combineEntity,sessionStorage.listBrokerID);
        	}
        }else{
        	layer.alert("买卖开平组合方式,暂不支持");
        	document.getElementById('future_buyOpen').checked = false;
    		document.getElementById('future_buyFlat').checked = false;
    		document.getElementById('future_sellOpen').checked = false;
    		document.getElementById('future_sellFlat').checked = false;
        }
    	
    }
    
})