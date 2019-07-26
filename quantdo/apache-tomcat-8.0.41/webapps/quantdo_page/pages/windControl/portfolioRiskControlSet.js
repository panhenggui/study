/**
 * Created by Quantdo on 2016/07/18.
 */
myapp.controller('portfolioRiskControlSetController', function($scope,$rootScope) {
	$("[forType='date']").datepicker({
        language:  "zh-CN",
        weekStart: 1,
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        format: "yyyymmdd"
    });
	$scope.portfolioRiskControlSetService = new com.quantdo.orgClear.service.PortfolioRiskControlSetService();
	//初始风控方式是可以使用的
	$scope.portfolioRiskControlSetActionCode = false;
    //初始化日期不能点击
    $scope.dateNotEdit = true;

    //初始化时间不能点击
    $scope.timeNotEdit = true;
    
    //初始化条件不能点击
    $scope.ruleNotEdit = true;
//    指标日期选中
    $scope.dateIndexNotEdit = true;
    
    $scope.ruleIndexNotEdit = true;
    
    $scope.timeIndexNotEdit = true;
    //初始化分母不可选择    
    $scope.denominatorNotEdit = true;
    
    //指标名称
    $scope.indexName = "";
    $scope.index = {};
	// 获取下拉框的值服务
	$scope.riskGroupDictionaryService = new com.quantdo.orgClear.service.RiskGroupDictionaryService();
	//比较符
    $scope.compareFlag = clearConstant.compareFlag;
	
    //风控方式
    $scope.riskWay = clearConstant.riskWay;
    
    //资产指标
    $scope.assetIndicators = clearConstant.assetIndicators;
    
    $scope.assetIndicators4product = [];
    $scope.riskGroupDictionaryService.findDictionary4Product(function(result){
		for(var i=0;i<result.length;i++){
			 var temp = {text: result[i].dictName, key: result[i].dictId}
			 $scope.assetIndicators4product.push(temp);
		}
	});
	// 保存信息实体
	$scope.entity = {};
	$scope.indexCalculation = {};
	// 存储表格中的数据
	$scope.dataset = [];
	// 初始化数据
	$scope.initData = {};
	
	//运算符号
	$scope.myCalcuTagLeft = clearConstant.calcuTagLeft;
	$scope.myCalcuTagRight = clearConstant.calcuTagRight;
	
	
	//初始化隐藏指标阈值
	$scope.portfolioRiskControlSetShow = false;
	//点击新增指标阈值
	$scope.addShowDetail = function(){
		$scope.portfolioRiskControlSetActionCode = false;
		$scope.portfolioRiskControlSetShow = true;
		$scope.addIndicatorThreshold();
	}
	//点击取消更新
	$scope.giveUpUpdate = function(){
		$scope.addIndicatorThreshold();
		$scope.portfolioRiskControlSetShow = false;
	}
	//隐藏大的div
	$scope.portfolioRiskControlSetShowAll = false;
	//点击新增资产组合风控设置
	$scope.showAllShow = function(){
		$scope.portfolioRiskControlSetShowAll = true;
		$scope.indexNameISUser = false;
		$scope.addInit();
		if($scope.portfolioRiskControlSetShow) $scope.addShowDetail();
		setTimeout(function(){
			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
		});
	}
	
	//点击取消修改
	$scope.giveUpShowAllShow = function(){
		$scope.portfolioRiskControlSetShowAll = false;
		$scope.portfolioRiskControlSetShow = false;
		$scope.addInit();
		setTimeout(function(){
			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
		});
	}
	
	//	数据初始化
	$scope.portfolioRIskControlSetShow = false;
	$scope.initTableData = function(isControl) {
		$scope.dataset = [];
		$scope.initData = [];
		$scope.portfolioRiskControlSetService.findRiskIndexSet(sessionStorage.listFundID,sessionStorage.listBrokerID,function(result){
			$scope.initData = result;
			$scope.$apply();
            for(var i=0;i<$scope.initData.length;i++){
            	var tempArr = [i+1,$scope.initData[i].indexName,$scope.initData[i].descr,
            	               "<a style='cursor:pointer;' name='PortfolioRiskControlSetService.updateRiskIndexSet' class='backFilter portfolioRiskControlSet_updateIndex'>[修改]</a> " +
            	               "<a style='cursor:pointer;' name='PortfolioRiskControlSetService.deleteRiskIndexSet' class='backFilter portfolioRiskControlSet_deleteIndex'>[删除]</a> ",$scope.initData[i].id];
            	$scope.dataset.push(tempArr);
            }
			$scope.getTable();
			if(isControl){
	           var myfilter = document.getElementsByClassName("backFilter");
	           hideAfterFilter($rootScope.filterEntity,myfilter);
	           $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
			}
			$scope.portfolioRIskControlSetShow = true;
        	$scope.$apply();
		});
	}
	//初始化范围
	$scope.idxGroup = [];
	//分母
	$scope.denominatorList = [];
	$scope.riskGroupDictionaryService.findDictionary(function(result){
		$scope.denominatorList = result;
	});

	//指标生效条件
	$scope.indexConditionList = [];
	$scope.riskGroupDictionaryService.findDictionary4index(function(result){
		$scope.indexConditionList = result;
	});
	// 资产组合风控设置表格
	$scope.getTable = function() {
		var columns_array = [ 
		    {title : "序号"}, 
			{title : "指标名称"},
			{title : "指标计算公式描述"}, 
			{title : "操作"},
			{title: "id", visible:false }
			];
		$("#portfolioRiskControlSet_table").DataTable({
            data : $scope.dataset,
            columns :columns_array,
            //scrollY: 120,
            //ordering: false,
            order: [[0,"asc"]],
            //paging: false,
           // scrollX: true,
            //info: false,
            retrieve: true,
            destroy:true,
            scrollX: true,
            dom : 'rt<"bottom"ipl>',
            language: {
            	 emptyTable: "没有符合条件的记录",
                 info: " _START_ 到 _END_  共 _TOTAL_ 条",
                 infoEmpty: " 0 到 0  共 0 条",
                 //lengthMenu: "显示 _MENU_ 条",
                 paginate: {
                     first: "首页",
                     last: "末页",
                     next: "下一页",
                     previous: "上一页"
                 }
            }
        });
		//var table = initDataTables("portfolioRiskControlSet_table", columns_array,$scope.dataset, 120);
	};
	$scope.buttonStatus = {};
	
	$scope.initTableData(true);
	
   $('#portfolioRiskControlSet_table').on( 'page.dt', function () {
       	setTimeout(function(){
       		var myfilter = document.getElementsByClassName("backFilter");
           	hideAfterFilter($rootScope.filterEntity,myfilter);
       	})
       }); 
       
       $("body").delegate('#portfolioRiskControlSet_table_length div').on('change', 'select[name="portfolioRiskControlSet_table_length"]', function () {
       	setTimeout(function(){
       		var myfilter = document.getElementsByClassName("backFilter");
           	hideAfterFilter($rootScope.filterEntity,myfilter);
       	})
       });
	
	$scope.updateId = "";
	$("body").undelegate("#portfolioRiskControlSet_table td .portfolioRiskControlSet_updateIndex","click");
	$("body").delegate("#portfolioRiskControlSet_table td .portfolioRiskControlSet_updateIndex","click",function(){
		$scope.indexNameISUser = true;
		setTimeout(function(){
			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
		});
		 //为选中的行设置选中色
        if($(this).closest('tr').hasClass("selected")){
            $(this).closest('tr').removeClass("selected");
        }
        else{
            $("tr.selected").removeClass("selected");
            $(this).closest('tr').addClass("selected");
        }
        var table = $("#portfolioRiskControlSet_table").DataTable();
       // var tempArr = table.row($(this)).data();
 	   var mytr = $(this).parents('tr');
 	   var tempArr = table.row(mytr).data();
 	   var updateIdTemp = tempArr[4];
 	   $scope.updateId = updateIdTemp;
 	   var tmpEntity = {};
 	   for(var x in $scope.initData){
 		   if($scope.initData[x].id == updateIdTemp){
 			   tmpEntity = $scope.initData[x];
 			   break;
 		   }
 	   }
// 		   分别赋值
 	   $scope.indexName = tmpEntity.indexName;
 	   if(tmpEntity.startDate || tmpEntity.endDate){
 		   $scope.buttonStatus.indexDateStatus = true;
 		   $scope.dateIndexNotEdit = false;
 	   }else{
 		   $scope.buttonStatus.indexDateStatus = false;
		   $scope.dateIndexNotEdit = true;
 	   }
 	   $scope.index.startDate = tmpEntity.startDate;
 	   $scope.index.endDate = tmpEntity.endDate;
 	   document.getElementById("indexStartTime").value = tmpEntity.startTime;
 	   document.getElementById("indexEndTime").value = tmpEntity.endTime;
 	   if(tmpEntity.startTime || tmpEntity.endTime){
 		   $scope.buttonStatus.indexTimeStatus = true;
 		   $scope.timeIndexNotEdit = false;
 	   }else{
 		   $scope.buttonStatus.indexTimeStatus = false;
		   $scope.timeIndexNotEdit = true;  
 	   }
 	   $scope.index.leftValue = tmpEntity.lconval;
 	   $scope.index.leftSymbol = tmpEntity.lcontag;
 	   $scope.index.centerValue = tmpEntity.condfield;
 	   $scope.index.rightSymbol = tmpEntity.rcontag;
 	   $scope.index.rightValue = tmpEntity.rconval;
 	   if(tmpEntity.lconval || tmpEntity.lcontag || tmpEntity.condfield || tmpEntity.rcontag || tmpEntity.rconval){
 		   $scope.buttonStatus.indexRuleStatus = true;
 		   $scope.ruleIndexNotEdit = false;
 	   }else{
 		   $scope.buttonStatus.indexRuleStatus = false;
		   $scope.ruleIndexNotEdit = true; 
 	   }
 	   $scope.index.descr = tmpEntity.descr;
 	   $scope.index.expression = tmpEntity.expression;
 	   $scope.indexCalculation.denominator = tmpEntity.denominator;
 	   if(tmpEntity.denominator){
 		   $scope.buttonStatus.denominatorStatus = true;
 		   $scope.denominatorNotEdit = false;
 	   }else{
 		   $scope.buttonStatus.denominatorStatus = false;
 		   $scope.denominatorNotEdit = true;  
 	   }
// 	   denominator:$scope.indexCalculation.denominator,
// 		   指标阈值
// 	   $scope.indexCalculationFormulaList = tmpEntity.indexCalculationFormulaList;
 	   destroyDatatable("indexCalculationFormula_table");
 	   $scope.pCount = 1;
 	   $scope.updateIndexCalculationFormula(tmpEntity.indexCalculationFormulaList);
 	   $scope.indexCalculationFormulaList = [];
 	   $scope.indicatorThresholdList = tmpEntity.indicatorThresholdList;
 	   destroyDatatable("indicatorThreshold_table");
 	   $scope.initDataIndicatorThreshold();
 	   $scope.initIndicatorThreshold();
// 	         初始化计算公式表格
// 	   改变按钮
 	   $scope.buttonEdit = false;
 	   $scope.addIndicatorThreshold();
 	   $scope.portfolioRiskControlSetShowAll = true;
	   $scope.portfolioRiskControlSetShow = false;
 	  $scope.$apply();
   });
	$scope.buttonEdit = true;
	
//	点击新增按钮触发事件
    $scope.addInit = function(){
       $scope.pCount = 1;
       $scope.buttonEdit = true;
       $scope.indexName = "";
       $scope.index = {};
       $scope.leftValue = "";
       $scope.leftSymbol = "";
       $scope.centerValue = "";
       $scope.rightSymbol = "";
       $scope.rightValue = "";
 	   document.getElementById("indexStartTime").value = "";
 	   document.getElementById("indexEndTime").value = "";
 	   document.getElementById("indicatorThresholdStartTime").value = "";
 	   document.getElementById("indicatorThresholdEndTime").value = "";
	   $scope.indexCalculation = {};
	   $scope.indicatorThreshold = {};
	   $scope.buttonStatus.indexDateStatus = false;
	   $scope.buttonStatus.indexTimeStatus = false;
	   $scope.buttonStatus.indexRuleStatus = false;
	   $scope.buttonStatus.denominatorStatus = false;
	   
//	    指标日期选中
	    $scope.dateIndexNotEdit = true;
	    
	    $scope.ruleIndexNotEdit = true;
	    
	    $scope.timeIndexNotEdit = true;
	    
	    $scope.denominatorNotEdit = true;
	    
	    
	    $scope.buttonStatus.indicatorDateStatus = false;
	    $scope.buttonStatus.indicatorTimeStatus = false;
	    $scope.buttonStatus.ruleStatus = false;
	    $scope.dateNotEdit = true;
	    $scope.timeNotEdit = true;
	    $scope.ruleNotEdit = true;
	    $scope.indicatorButtonShow = true;
// 		   指标阈值
 	   $scope.indexCalculationFormulaList = [];
 	   destroyDatatable("indexCalculationFormula_table");
 	   $scope.initIndexCalculationFormula();
 	   $scope.initIndexCalculationFormulaSelect();
 	   
 	   $scope.indicatorThresholdList = [];
 	   destroyDatatable("indicatorThreshold_table");
 	   $scope.initDataIndicatorThreshold();
 	   $scope.initIndicatorThreshold();
// 	         初始化计算公式表格
// 	   改变按钮
// 	   $scope.$apply();
 	  $scope.index.leftSymbol = "<";
 	  $scope.index.centerValue = "currUnitNetValue";
 	  $scope.index.rightSymbol = "<=";
 	  if($scope.portfolioRiskControlSetShow) $scope.addIndicatorThreshold();
    }
//	修改时候加载表格
	$scope.updateIndexCalculationFormula = function(entity){
		$scope.index_dataset = [];
		for(var i=0;i<entity.length;i++){
			$scope.pCount = $scope.pCount + 1;
			var myindex = $scope.pCount;
			var tempArr = [i+1,
			               "<select class='myCalcuTagLeft' style='width: 100px;' id='myCalcuTagLeft_"+myindex+"'></select>",
			               "<select class='myidxGroup' id='myidxGroup_"+myindex+"'></select>",
			               "<select class='myidxTpl' id='myidxTpl_"+myindex+"'></select>",
			               "<input type='number' id='myNumber_"+myindex+"'>",
			               "<select class='myCalcuTagRight' style='width: 100px;' id='myCalcuTagRight_"+myindex+"'></select>",
                           "<a style='cursor:pointer;' class='deleteIndex' id='deleteIndex_"+myindex+"'>[删除]</a>"];
           $scope.index_dataset.push(tempArr);
           
		}
        $scope.index_dataset.push(["<a style='cursor:pointer;' class='indexCalculationFormulaAddRow'>+</a>","","","","","",""]);
		$("#indexCalculationFormula_table").DataTable({
            data : $scope.index_dataset,
            columns :$scope.indexCalculationFormula_columns_array,
            scrollY: 170,
            ordering: false,
            order: [[0,"desc"]],
            paging: false,
            scrollX: true,
            "aoColumnDefs": [
                             { "sWidth": "4%", "aTargets": [ 0] },
                             { "sWidth": "15%", "aTargets": [ 1] },
                             { "sWidth": "20%", "aTargets": [ 2 ] },
                             { "sWidth": "20%", "aTargets": [ 3 ] },
                             { "sWidth": "18%", "aTargets": [ 4 ] },
                             { "sWidth": "15%", "aTargets": [ 5] },
                             { "sWidth": "4%", "aTargets": [ 6 ] }
            ],
            dom: 'rt<"bottom"ipl>',
            info: false,
            language: {
                emptyTable: "没有符合条件的记录"
            }
        });
//		加载表格数据
		for(var j=0;j<$scope.idxGroup.length;j++){
            $("#indexCalculationFormula_table .myidxGroup").append("<option value='"+$scope.idxGroup[j].groupID+"'>"+$scope.idxGroup[j].groupName+"</option>");
        }

//       初始化数据
        var tmpA=0;
        for(var x=0;x<$("#indexCalculationFormula_table .myidxGroup").length;x++){
            for(var y=0;y<$("#indexCalculationFormula_table .myidxGroup")[x].length;y++){
                if($("#indexCalculationFormula_table .myidxGroup")[x][y].value == entity[tmpA].groupID){
                    $("#indexCalculationFormula_table .myidxGroup")[x][y].selected = true;
                    var myindex = $("#indexCalculationFormula_table .myidxTpl")[x].id.split("_")[1];
                    if($("#indexCalculationFormula_table .myidxGroup")[x][y].value.indexOf("fundProduct")>-1){
               		    for(var k=0;k<$scope.assetIndicators4product.length;k++){
                            $("#myidxTpl_"+myindex+"").append("<option value='"+$scope.assetIndicators4product[k].key+"'>"+$scope.assetIndicators4product[k].text+"</option>");
                            $("#myidxGroup_"+myindex+"").attr("disabled","disabled");
                        }
                    }else{
                    	 for(var k=0;k<$scope.assetIndicators.length;k++){
                             $("#myidxTpl_"+myindex+"").append("<option value='"+$scope.assetIndicators[k].key+"'>"+$scope.assetIndicators[k].text+"</option>");
                             $("#myidxGroup_"+myindex+"").attr("disabled","disabled");
                         }
                    }
                    tmpA++;
                    break;
                }
            }
        }
        
        var tmpB=0;
        for(var i=0;i<$("#indexCalculationFormula_table .myidxTpl").length;i++){
            for(var j=0;j<$("#indexCalculationFormula_table .myidxTpl")[i].length;j++){
                if($("#indexCalculationFormula_table .myidxTpl")[i][j].value == entity[tmpB].assetIndicators){
                    $("#indexCalculationFormula_table .myidxTpl")[i][j].selected = true;
                    tmpB++;
                    break;
                }
            }
        }
        
        for(var j=0;j<$scope.myCalcuTagLeft.length;j++){
            $("#indexCalculationFormula_table .myCalcuTagLeft").append("<option value='"+$scope.myCalcuTagLeft[j].key+"'>"+$scope.myCalcuTagLeft[j].text+"</option>");
        }
        var tmpC=0;
        for(var i=0;i<$("#indexCalculationFormula_table .myCalcuTagLeft").length;i++){
            for(var j=0;j<$("#indexCalculationFormula_table .myCalcuTagLeft")[i].length;j++){
                if($("#indexCalculationFormula_table .myCalcuTagLeft")[i][j].value == entity[tmpC].calcuTagLeft){
                    $("#indexCalculationFormula_table .myCalcuTagLeft")[i][j].selected = true;
                    tmpC++;
                    break;
                }
            }
        }
        
        for(var j=0;j<$scope.myCalcuTagRight.length;j++){
            $("#indexCalculationFormula_table .myCalcuTagRight").append("<option value='"+$scope.myCalcuTagRight[j].key+"'>"+$scope.myCalcuTagRight[j].text+"</option>");
        }
        var tmpD=0;
        for(var i=0;i<$("#indexCalculationFormula_table .myCalcuTagRight").length;i++){
            for(var j=0;j<$("#indexCalculationFormula_table .myCalcuTagRight")[i].length;j++){
                if($("#indexCalculationFormula_table .myCalcuTagRight")[i][j].value == entity[tmpD].calcuTagRight){
                    $("#indexCalculationFormula_table .myCalcuTagRight")[i][j].selected = true;
                    tmpD++;
                    break;
                }
            }
        }
        
        for(var i=0;i<$("#indexCalculationFormula_table input").length;i++){
            $("#indexCalculationFormula_table input")[i].value = entity[i].weight;
         }
	}
	
	$("body").delegate("#portfolioRiskControlSet_table td .portfolioRiskControlSet_deleteIndex","click",function(event){
		event.stopPropagation();
		//隐藏增加指标阈值界面
		var table = $("#portfolioRiskControlSet_table").DataTable();
		var mytr = $(this).parents('tr');
		var tempArr = table.row(mytr).data();
		var delId = tempArr[4];
		//$scope.addInit();
		layer.confirm("确定删除该条信息？", {icon: 3}, function (count) {
		   table.row(mytr).remove().draw(false);
		   $scope.portfolioRiskControlSetService.delRiskIndexSet(delId,function(result){
			    $scope.portfolioRiskControlSetShow = false;
				$scope.addIndicatorThreshold();
				$scope.portfolioRiskControlSetShowAll = false;
				$scope.addInit();
				$scope.$apply();
			   if(result){
				   if(result.errCode == '0'){
					   destroyDatatable("portfolioRiskControlSet_table");
					   $scope.initTableData(false);  
				   }
				   layer.alert(result.errMessage);
			   }else{
				   layer.alert("后台遇到未知错误");
			   }
		   	});
		});
	});
	//初始化指标计算公式表格
    $scope.indexCalculationFormula_columns_array = [
        {title:"序号"},
        {title:"运算符号"},
        {title:"资产范围"},
        {title:"资产指标"},
        {title:"权重"},
        {title:"运算符号"},
        {title:"操作"}
    ];
	//初始化指标计算公式表格
    $scope.initIndexCalculationFormula = function(){
        $scope.index_dataset = [];
        for(var i=0;i<3;i++){
        	$scope.pCount = $scope.pCount + 1;
			var myindex = $scope.pCount;
            var tempArr = [i+1,
                           "<select class='myCalcuTagLeft' style='width: 100px;' id='myCalcuTagLeft_"+myindex+"'></select>",
                            "<select class='myidxGroup' id='myidxGroup_"+myindex+"'></select>",
                            "<select class='myidxTpl' id='myidxTpl_"+myindex+"'></select>",
                            "<input type='number' id='myNumber_"+myindex+"'>",
                            "<select class='myCalcuTagRight' style='width: 100px;' id='myCalcuTagRight_"+myindex+"'></select>",
                            "<a style='cursor:pointer;' class='deleteIndex' id='deleteIndex_"+myindex+"'>[删除]</a>"];
            $scope.index_dataset.push(tempArr);
        }
        $scope.index_dataset.push(["<a style='cursor:pointer;' class='indexCalculationFormulaAddRow'>+</a>","","","","","",""]);
        //初始化指标计算公式表格
        $("#indexCalculationFormula_table").DataTable({
            data : $scope.index_dataset,
            columns :$scope.indexCalculationFormula_columns_array,
            scrollY: 170,
            ordering: false,
            order: [[0,"desc"]],
            paging: false,
            scrollX: true,
            "aoColumnDefs": [
                             { "sWidth": "4%", "aTargets": [ 0] },
                             { "sWidth": "15%", "aTargets": [ 1] },
                             { "sWidth": "20%", "aTargets": [ 2 ] },
                             { "sWidth": "20%", "aTargets": [ 3 ] },
                             { "sWidth": "18%", "aTargets": [ 4 ] },
                             { "sWidth": "15%", "aTargets": [ 5] },
                             { "sWidth": "4%", "aTargets": [ 6 ] }
            ],
            dom: 'rt<"bottom"ipl>',
            info: false,
            language: {
                emptyTable: "没有符合条件的记录"
            }
        });
    };
    
    $("body").undelegate("#indexCalculationFormula_table td .indexCalculationFormulaAddRow","click");
	$("body").delegate("#indexCalculationFormula_table td .indexCalculationFormulaAddRow","click",function(){
		var myDetailTable = $("#indexCalculationFormula_table").DataTable();
        myDetailTable.row($(this).parents('tr'))
            .remove().draw(false);
		$scope.addIndexCalculationFormulal();
	});

    //	初始化指标的选择框的值
    $scope.idxGroup = {};
    $scope.initIndexCalculationFormulaSelect = function(){
    	//数据初始化
    	$scope.portfolioRiskControlSetService.findRiskGroup(sessionStorage.listBrokerID,sessionStorage.listFundID,function(result){
    		$scope.idxGroup = result;
    	
            for(var j=0;j<$scope.idxGroup.length;j++){
                $("#indexCalculationFormula_table .myidxGroup").append("<option value='"+$scope.idxGroup[j].groupID+"'>"+$scope.idxGroup[j].groupName+"</option>");
            }

            for(var j=0;j<$scope.assetIndicators4product.length;j++){
                $("#indexCalculationFormula_table .myidxTpl").append("<option value='"+$scope.assetIndicators4product[j].key+"'>"+$scope.assetIndicators4product[j].text+"</option>");
            }
            
            for(var j=0;j<$scope.myCalcuTagLeft.length;j++){
                $("#indexCalculationFormula_table .myCalcuTagLeft").append("<option value='"+$scope.myCalcuTagLeft[j].key+"'>"+$scope.myCalcuTagLeft[j].text+"</option>");
            }
            
            for(var j=0;j<$scope.myCalcuTagRight.length;j++){
                $("#indexCalculationFormula_table .myCalcuTagRight").append("<option value='"+$scope.myCalcuTagRight[j].key+"'>"+$scope.myCalcuTagRight[j].text+"</option>");
            }
    	});
    };
//  初始化表格
    $scope.initIndexCalculationFormula();
    $scope.initIndexCalculationFormulaSelect();
    //	指标阈值
    $scope.indicatorThreshold_columns_array = [
        {title:"序号"},
        {title:"生效日期"},
        {title:"生效时间"},
        {title:"生效条件"},
        {title:"指标范围"},
        {title:"控制方式"},
        {title:"操作"}
    ];
    
    $scope.indicatorThreshold_dataset = [];
  //指标阈值
    $scope.initIndicatorThreshold = function(){
        //初始化指标阈值表格
        $("#indicatorThreshold_table").DataTable({
            data : $scope.indicatorThreshold_dataset,
            columns :$scope.indicatorThreshold_columns_array,
            scrollY: 150,
            //scrollCollapse:true,
            paging: false,
            scrollX: true,
            //info: false,
            "aoColumnDefs": [
                             { "sWidth": "35%", "aTargets": [ 4 ] }
            ],
            dom: 'rt<"bottom"ipl>',
            language: {
           	 emptyTable: "没有符合条件的记录",
                info: " _START_ 到 _END_  共 _TOTAL_ 条",
                infoEmpty: " 0 到 0  共 0 条",
           }
        });

    };
//    初始化阈值
    $scope.initIndicatorThreshold();
    
	$rootScope.setTabPaneScope($scope, "tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;

	$("body").undelegate("#indexCalculationFormula_table td .deleteIndex","click");
	$("body").delegate("#indexCalculationFormula_table td .deleteIndex", "click", function (){
//        var myDetailTable = $("#indexCalculationFormula_table").DataTable();
//        
//        myDetailTable.row($(this).parents('tr'))
//            .remove().draw(false);
//        $scope.changeDescr();
		$("#indexCalculationFormula_table").DataTable().row($(this).parents("tr")).remove().draw();
        for(var i=0;i<$("#indexCalculationFormula_table").DataTable().context[0].aoData.length-1;i++){
            var index = $("#indexCalculationFormula_table").DataTable().cell($($("#indexCalculationFormula_table").DataTable().context[0].aoData[i].nTr).children()[0]);
            index.data(i+1);
        }
        $scope.changeDescr();
        $scope.$apply();
    });
	//执行风控指标表格中的新增功能(+号)
	//$scope.pCount = 1;
    $scope.addIndexCalculationFormulal = function(){
        var myDetailTable = $("#indexCalculationFormula_table").DataTable();
        var flag = myDetailTable.context[0].aoData.length+1;
        $scope.pCount = $scope.pCount + 1;
        var myindex = $scope.pCount;
        myDetailTable.row.add([flag,"<select style='width: 100px;' class='myCalcuTagLeft' id='myCalcuTagLeft_"+myindex+"'></select>",
                               "<select class='myidxGroup' id='myidxGroup_"+myindex+"'></select>",
					            "<select class='myidxTpl' id='myidxTpl_"+myindex+"'></select>",
					            "<input type='number' class='myindex' id='myNumber_"+myindex+"'>",
					            "<select style='width: 100px;' class='myCalcuTagRight' id='myCalcuTagRight_"+myindex+"'></select>",
					            "<a style='cursor:pointer;' class='deleteIndex' id='deleteIndex_"+myindex+"'>[删除]</a>"]).draw();
        myDetailTable.row.add(["<a style='cursor:pointer;' class='indexCalculationFormulaAddRow'>+</a>","","","","","",""]).draw();
        for(var j=0;j<$scope.idxGroup.length;j++){
            $("#myidxGroup_"+myindex+"").append("<option value='"+$scope.idxGroup[j].groupID+"'>"+$scope.idxGroup[j].groupName+"</option>");
        }

        for(var j=0;j<$scope.assetIndicators4product.length;j++){
            $("#myidxTpl_"+myindex+"").append("<option value='"+$scope.assetIndicators4product[j].key+"'>"+$scope.assetIndicators4product[j].text+"</option>");
        }
        
        for(var j=0;j<$scope.myCalcuTagLeft.length;j++){
        	 $("#myCalcuTagLeft_"+myindex+"").append("<option value='"+$scope.myCalcuTagLeft[j].key+"'>"+$scope.myCalcuTagLeft[j].text+"</option>");
        }
        
        for(var j=0;j<$scope.myCalcuTagRight.length;j++){
       	 $("#myCalcuTagRight_"+myindex+"").append("<option value='"+$scope.myCalcuTagRight[j].key+"'>"+$scope.myCalcuTagRight[j].text+"</option>");
       }
       
        $("#indexCalculationFormula_table .myindex").focus();
    };
  //checkbox指标选中日期控件可点击
    $scope.changeIndexDateState = function(){
        if($scope.dateIndexNotEdit){
            $scope.dateIndexNotEdit = false;
        }
        else{
            $scope.dateIndexNotEdit = true;
            $scope.index.startDate = "";
            $scope.index.endDate = "";
        }
    };
    $scope.changeIndexTimeState = function(){
        if($scope.timeIndexNotEdit){
            $scope.timeIndexNotEdit = false;
        }
        else{
            $scope.timeIndexNotEdit = true;
            document.getElementById("indexStartTime").value = "";
      	   	document.getElementById("indexEndTime").value = "";
        }
    };
    $scope.changeIndexRuleState = function(){
        if($scope.ruleIndexNotEdit){
            $scope.ruleIndexNotEdit = false;
            $scope.index.leftValue = "";
            $scope.index.leftSymbol = "<";
            $scope.index.centerValue = "currUnitNetValue";
            $scope.index.rightSymbol = "<=";
            $scope.index.rightValue = "";
        }
        else{
            $scope.ruleIndexNotEdit = true;
            $scope.index.leftValue = "";
            $scope.index.leftSymbol = "<";
            $scope.index.centerValue = "currUnitNetValue";
            $scope.index.rightSymbol = "<=";
            $scope.index.rightValue = "";
        }
    };
    //checkbox选中日期控件可点击
    $scope.changeDateState = function(){
        if($scope.dateNotEdit){
            $scope.dateNotEdit = false;
        }
        else{
            $scope.dateNotEdit = true;
            $scope.indicatorThreshold.startDate = "";
            $scope.indicatorThreshold.endDate = "";
        }
    };
    //checkbox选中时间控件可点击
    $scope.changeTimeState = function(){
        if($scope.timeNotEdit){
            $scope.timeNotEdit = false;
        }
        else{
            $scope.timeNotEdit = true;
            document.getElementById("indicatorThresholdStartTime").value = "";
      	   	document.getElementById("indicatorThresholdEndTime").value = "";
        }
    };
//    checkbox选中生效条件
    $scope.changeRuleState = function(){
        if($scope.ruleNotEdit){
            $scope.ruleNotEdit = false;
            $scope.indicatorThreshold.lconval1 = "";
            $scope.indicatorThreshold.lcontag1 = "<";
            $scope.indicatorThreshold.condfield1 = "currUnitNetValue";
            $scope.indicatorThreshold.rcontag1 = "<=";
            $scope.indicatorThreshold.rconval1 = "";
        }
        else{
            $scope.ruleNotEdit = true;
            $scope.indicatorThreshold.lconval1 = "";
            $scope.indicatorThreshold.lcontag1 = "<";
            $scope.indicatorThreshold.condfield1 = "currUnitNetValue";
            $scope.indicatorThreshold.rcontag1 = "<=";
            $scope.indicatorThreshold.rconval1 = "";
        }
    };
    
//    分母选中生效条件
    $scope.changeDenominatorState = function(){
    	if($scope.denominatorNotEdit){
            $scope.denominatorNotEdit = false;
        }
        else{
            $scope.denominatorNotEdit = true;
            $scope.indexCalculation.denominator = "";
        }
    	$scope.changeDescr();
//    	$scope.$apply();
    };
    
//    表格中数据添加
    $scope.indicatorThresholdList = [];
//    存储指标阈值
//    指标阈值属性
    $scope.indicatorThreshold = "";
    
    //效验公共方法
    judgeDateAndCon = function(tmpEntity){
    	debugger;
    	//日期+时间+生效条件验证
    	if(!$scope.dateNotEdit && ($scope.timeNotEdit||$scope.ruleNotEdit)){
    		layer.alert("选择日期，必须选择时间和生效条件");
			return false;
    	}
    	//时间+生效条件验证
    	if(!$scope.timeNotEdit && $scope.ruleNotEdit){
    		layer.alert("选择时间，必须选择生效条件");
			return false;
    	}
    	//日期验证判断
    	if(!$scope.dateNotEdit){
    		if(!tmpEntity.startDate){
    			layer.alert("开始日期不能为空");
    			return false;
    		}
    		if(!tmpEntity.endDate){
    			layer.alert("结束日期不能为空");
    			return false;
    		}
    		if(tmpEntity.endDate&&tmpEntity.startDate){
    			if(tmpEntity.startDate-tmpEntity.endDate>0){
    				layer.alert("结束日期不能小于开始日期");
        			return false;
    			}
    		}
    	}
    	//时间验证判断
    	if(!$scope.timeNotEdit){
    		if(!tmpEntity.startTime){
    			layer.alert("开始时间不能为空");
    			return false;
    		}
    		if(!tmpEntity.endTime){
    			layer.alert("结束时间不能为空");
    			return false;
    		}
    		if(tmpEntity.startTime&&tmpEntity.endTime){
    			startT = tmpEntity.startTime.replace(/:/g,"");
       			endT = tmpEntity.endTime.replace(/:/g,"");
       			if(startT-endT>=0){
       				layer.alert("结束时间必须大于开始时间"); 
       		       	return false;
       			}
    		}
    	}
    	//验证生效条件
    	if(!$scope.ruleNotEdit){
    		if(tmpEntity.rcontag1 && tmpEntity.rconval1 && tmpEntity.lcontag1 && tmpEntity.lconval1){
    			if(tmpEntity.lcontag1=="="&&tmpEntity.rcontag1=="="&&tmpEntity.rconval1-tmpEntity.lconval1!=0){
    				layer.alert("指标生效条件有误");
	    			return false;
    			}
    			if((tmpEntity.lcontag1=="="&&tmpEntity.rcontag1!="=")||(tmpEntity.lcontag1!="="&&tmpEntity.rcontag1=="=")){
    				layer.alert("指标生效条件有误");
	    			return false;
    			}
    		}
    		if(tmpEntity.lconval1){
    			if(isNaN(tmpEntity.lconval1)){
    				layer.alert("指标生效条件的取值范围是:[-10000000000.0000，10000000000.0000]");
        			return false;
    			}
    			if(tmpEntity.lconval1-10000000000>0){
    				layer.alert("指标生效条件的取值范围是:[-10000000000.0000，10000000000.0000]");
        			return false;
    			}
    			if(-10000000000-tmpEntity.lconval1>0){
    				layer.alert("指标生效条件的取值范围是:[-10000000000.0000，10000000000.0000]");
        			return false;
    			}
    			var point2 = tmpEntity.lconval1.length-1;
        		var point1 = tmpEntity.lconval1.indexOf(".");
        		if(point1>=0){
        			var str = tmpEntity.lconval1.substring(point1,point2);
        			if(str.length>4){
        				layer.alert("指标生效条件的取值范围是:[-10000000000.0000，10000000000.0000]"); 
                    	return false;
        			}
        		}
    		}
    		if(tmpEntity.rconval1){
    			if(isNaN(tmpEntity.rconval1)){
    				layer.alert("指标生效条件的取值范围是:[-10000000000.0000，10000000000.0000]");
        			return false;
    			}
    			if(tmpEntity.rconval1-10000000000>0){
    				layer.alert("指标生效条件的取值范围是:[-10000000000.0000，10000000000.0000]");
        			return false;
    			}
    			if(-10000000000-tmpEntity.rconval1>0){
    				layer.alert("指标生效条件的取值范围是:[-10000000000.0000，10000000000.0000]");
        			return false;
    			}
    			var point2 = tmpEntity.rconval1.length-1;
        		var point1 = tmpEntity.rconval1.indexOf(".");
        		if(point1>=0){
        			var str = tmpEntity.rconval1.substring(point1,point2);
        			if(str.length>4){
        				layer.alert("指标生效条件的取值范围是:[-10000000000.0000，10000000000.0000]"); 
                    	return false;
        			}
        		}
    		}
    		if(!tmpEntity.lconval1 && tmpEntity.lcontag1){
    			layer.alert("指标生效条件：左边值不能为空");
    			return false;
    		}
    		if(tmpEntity.lconval1 && !tmpEntity.lcontag1){
    			layer.alert("指标生效条件：左比较符不能为空");
    			return false;
    		}
    		if(!tmpEntity.condfield1){
    			layer.alert("指标生效条件字段不能为空");
    			return false;
    		}
    		if(!tmpEntity.rcontag1 && tmpEntity.rconval1){
    			layer.alert("指标生效条件：右比较符不能为空");
    			return false;
    		}
    		if(tmpEntity.rcontag1 && !tmpEntity.rconval1){
    			layer.alert("指标生效条件：右边值不能为空");
    			return false;
    		}
    		if(!tmpEntity.rcontag1 && !tmpEntity.rconval1 && !tmpEntity.lcontag1 && !tmpEntity.lconval1){
    			layer.alert("指标生效条件不能为空");
    			return false;
    		}
    		if(tmpEntity.rcontag1 && tmpEntity.rconval1 && tmpEntity.lcontag1 && tmpEntity.lconval1){
				if(tmpEntity.lconval1-tmpEntity.rconval1>=0&&(tmpEntity.lcontag1=="<"||tmpEntity.rcontag1=="<")){
	    			layer.alert("指标生效条件：左边值需小于右边值");
	    			return false;
	    		}
	    		if(tmpEntity.lconval1-tmpEntity.rconval1>0){
	    			layer.alert("指标生效条件：左边值不能大于右边值");
	    			return false;
	    		}
    		}
    		
    		if(tmpEntity.lconval1!=null&&tmpEntity.lconval1!=""&&tmpEntity.lconval1!=undefined&&tmpEntity.rconval1!=null&&tmpEntity.rconval1!=""&&tmpEntity.rconval1!=undefined){
    			if(tmpEntity.lconval1==tmpEntity.rconval1){
    				if(tmpEntity.lcontag1!="="||tmpEntity.rcontag1!="="){
    					layer.alert("左边值需小于右边值");
    	    			return false;
    				}
    			}
    		}
    	}
    	//验证指标设置
    	if(tmpEntity.rcontag2 && tmpEntity.rconval2 && tmpEntity.lcontag2 && tmpEntity.lconval2){
			if(tmpEntity.lcontag2=="="&&tmpEntity.rcontag2=="="&&tmpEntity.rconval2-tmpEntity.lconval2!=0){
				layer.alert("指标设置有误");
    			return false;
			}
			if((tmpEntity.lcontag2=="="&&tmpEntity.rcontag2!="=")||(tmpEntity.lcontag2!="="&&tmpEntity.rcontag2=="=")){
				layer.alert("指标设置有误");
    			return false;
			}
		}
		if(tmpEntity.lconval2){
			if(isNaN(tmpEntity.lconval2)){
				layer.alert("指标参数的取值范围是:[-10000000000.0000，10000000000.0000]");
    			return false;
			}
			if(tmpEntity.lconval2-10000000000>0){
				layer.alert("指标参数的取值范围是:[-10000000000.0000，10000000000.0000]");
    			return false;
			}
			if(-10000000000-tmpEntity.lconval2>0){
				layer.alert("指标参数的取值范围是:[-10000000000.0000，10000000000.0000]");
    			return false;
			}
			var point2 = tmpEntity.lconval2.length-1;
    		var point1 = tmpEntity.lconval2.indexOf(".");
    		if(point1>=0){
    			var str = tmpEntity.lconval2.substring(point1,point2);
    			if(str.length>4){
    				layer.alert("指标参数的取值范围是:[-10000000000.0000，10000000000.0000]"); 
                	return false;
    			}
    		}
		}
		if(tmpEntity.rconval2){
			if(isNaN(tmpEntity.rconval2)){
				layer.alert("指标参数的取值范围是:[-10000000000.0000，10000000000.0000]");
    			return false;
			}
			if(tmpEntity.rconval2-10000000000>0){
				layer.alert("指标参数的取值范围是:[-10000000000.0000，10000000000.0000]");
    			return false;
			}
			if(-10000000000-tmpEntity.rconval2>0){
				layer.alert("指标参数的取值范围是:[-10000000000.0000，10000000000.0000]");
    			return false;
			}
			var point2 = tmpEntity.rconval2.length-1;
    		var point1 = tmpEntity.rconval2.indexOf(".");
    		if(point1>=0){
    			var str = tmpEntity.rconval2.substring(point1,point2);
    			if(str.length>4){
    				layer.alert("指标参数的取值范围是:[-10000000000.0000，10000000000.0000]"); 
                	return false;
    			}
    		}
		}
    	if(tmpEntity.lconval2 && !tmpEntity.lcontag2){
    		layer.alert("指标设置:左比较符不能为空");
    		return false;
    	}
    	if(!tmpEntity.lconval2 && tmpEntity.lcontag2){
    		layer.alert("指标设置:左边值不能为空");
    		return false;
    	}
    	if(!tmpEntity.rcontag2 && tmpEntity.rconval2){
    		layer.alert("指标设置:右比较符不能为空");
    		return false;
    	}
    	if(tmpEntity.rcontag2 && !tmpEntity.rconval2){
    		layer.alert("指标设置:右边值不能为空");
    		return false;
    	}
    	if(!tmpEntity.lconval2 && !tmpEntity.lcontag2 && !tmpEntity.rcontag2 && !tmpEntity.rconval2){
    		layer.alert("指标设置不能为空");
    		return false;
    	}
    	if(tmpEntity.lconval2 && tmpEntity.lcontag2 && tmpEntity.rcontag2 && tmpEntity.rconval2){
    		if(tmpEntity.lconval2-tmpEntity.rconval2>=0&&(tmpEntity.lcontag2=="<"||tmpEntity.rcontag2=="<")){
    			layer.alert("指标参数左边值需小于右边值");
    			return false;
    		}
    		if(tmpEntity.lconval2-tmpEntity.rconval2>0){
    			layer.alert("指标参数左边值不能大于右边值");
    			return false;
    		}
    	}
		if(tmpEntity.lconval2!=null&&tmpEntity.lconval2!=""&&tmpEntity.lconval2!=undefined&&tmpEntity.rconval2!=null&&tmpEntity.rconval2!=""&&tmpEntity.rconval2!=undefined){
			if(tmpEntity.lconval2==tmpEntity.rconval2){
				if(tmpEntity.lcontag2!="="||tmpEntity.rcontag2!="="){
					layer.alert("左边值需小于右边值");
	    			return false;
				}
			}
		}
    	if(!tmpEntity.actionCode){
    		layer.alert("控制方式不能为空");
    		return false;
    	}
    }

    
    //页面保存
    $scope.saveIndicatorThreshold = function(entity){
    	/*$scope.entity.applyStatus = status;
    	$scope.entity.rejectRemark = angular.copy($scope.ModalEntity.rejectRemark);*/
    	if(entity.lconval1 == null||entity.lconval1 == undefined || entity.lconval1 == "") entity.lcontag1 = "";
    	if(entity.rconval1 == null||entity.rconval1 == undefined || entity.rconval1 == "") entity.rcontag1 = "";
    	if(entity.lcontag1 == "" && entity.rcontag1 == "") entity.condfield1 = "";
    	if(entity.lconval2 == null||entity.lconval2 == undefined || entity.lconval2 == "") entity.lcontag2 = "";
    	if(entity.rconval2 == null||entity.rconval2 == undefined || entity.rconval2 == "") entity.rcontag2 = "";
    	
    	$scope.tmp = entity;
    	$scope.entity = angular.copy($scope.tmp);
    	$scope.entity.startTime = document.getElementById("indicatorThresholdStartTime").value;
    	$scope.entity.endTime = document.getElementById("indicatorThresholdEndTime").value;
    	/*******************新增指标阈值 验证开始*******************************/
    	var b = judgeDateAndCon($scope.entity);//效验输入规范
    	if(b==false){
	    	 $scope.indicatorThreshold.lcontag1 = "<";
	   	     $scope.indicatorThreshold.condfield1 = "currUnitNetValue";
	   	     $scope.indicatorThreshold.rcontag1 = "<=";
	   	     $scope.indicatorThreshold.actionCode = "1";
	   	     $scope.indicatorThreshold.lcontag2 = "<";
	   	     $scope.indicatorThreshold.rcontag2 = "<=";
    		 return false;
    	}
    	
    	var back = $scope.judgeOverlap($scope.entity,$scope.indicatorThresholdList);//效验区间是否重复
    	if(back){
			layer.alert("区间重复");
			 $scope.indicatorThreshold.lcontag1 = "<";
		     $scope.indicatorThreshold.condfield1 = "currUnitNetValue";
		     $scope.indicatorThreshold.rcontag1 = "<=";
		     $scope.indicatorThreshold.actionCode = "1";
		     $scope.indicatorThreshold.lcontag2 = "<";
		     $scope.indicatorThreshold.rcontag2 = "<=";
    		 return false;
		}
    	/*******************新增指标阈值 验证结束*******************************/
    	$scope.indicatorThresholdList.push($scope.entity);
    	
//    	初始化数据
    	destroyDatatable("indicatorThreshold_table");
    	$scope.initDataIndicatorThreshold();
    	$scope.initIndicatorThreshold();
    	$scope.addIndicatorThreshold();
    	$scope.portfolioRiskControlSetShow = false;
    	//$scope.$apply();
    };
    
    
/*//    判断日期区间时候重复或者嵌套
    $scope.dateJudge = function(oldStartDate,oldStartTime,oldEndDate,oldEndTime,newStartDate,newStartTime,newEndDate,newEndTime){
//    	日期相等的情况下判断时间
    	if(oldStartDate == newStartDate && oldEndDate == newEndDate){
//    		判断时间区间
    		
    	}
    	
    };*/
    
    //页面保存时，判断日期+时间+生效条件+指标范围 是否重叠，或嵌套
    $scope.judgeOverlap = function(entity,myArr){
    	var startDateNew = entity.startDate;
    	var endDateNew = entity.endDate;
    	var startTimeNew = entity.startTime;
    	var endTimeNew = entity.endTime;
    	var lconval1New = entity.lconval1;
    	var lcontag1New = entity.lcontag1;
    	var rcontag1New = entity.rcontag1;
    	var rconval1New = entity.rconval1;
    	var lconval2New = entity.lconval2;
    	var lcontag2New = entity.lcontag2;
    	var rcontag2New = entity.rcontag2;
    	var rconval2New = entity.rconval2;
    	var condfield1New = entity.condfield1;
    	if(startTimeNew) startTimeNew = startTimeNew.replace(":","");
    	if(endTimeNew) endTimeNew = endTimeNew.replace(":","");
    	
    	if(myArr!=undefined&&myArr.length>0){
    		for(var i=0;i<myArr.length;i++){
    			var startDateOld = myArr[i].startDate;
    	    	var endDateOld = myArr[i].endDate;
    	    	var startTimeOld = myArr[i].startTime;
    	    	var endTimeOld = myArr[i].endTime;
    	    	var lconval1Old = myArr[i].lconval1;
    	    	var lcontag1Old = myArr[i].lcontag1;
    	    	var rcontag1Old = myArr[i].rcontag1;
    	    	var rconval1Old = myArr[i].rconval1;
    	    	var lconval2Old = myArr[i].lconval2;
    	    	var lcontag2Old = myArr[i].lcontag2;
    	    	var rcontag2Old = myArr[i].rcontag2;
    	    	var rconval2Old = myArr[i].rconval2;
    	    	var condfield1Old = myArr[i].condfield1;
    	    	if(startTimeOld) startTimeOld = startTimeOld.replace(":","");
    	    	if(endTimeOld) endTimeOld = endTimeOld.replace(":","");
    	    	/********************不完全效验***********************/
    	    	//如果新数据日期，时间，生效条件存在，只和旧数据中，日期，时间，生效条件存在的进行校验
    	    	if(startDateNew && startTimeNew && condfield1New && startDateOld && startTimeOld && condfield1Old){
    	    		//如果日期有交集
    	    		if(!(startDateNew-endDateOld>0||endDateNew-startTimeOld<0)){
    	    			//如果时间有交集
    	    			if(!(startTimeNew-endTimeOld>0||endTimeNew-startTimeOld<0)){
    	    				//如果生效条件字段一样
    	    				if(condfield1New==condfield1Old){
    	    					//如果生效条件重复
    	    					var a_index1 = -10000000001;
    	    					var b_index1 = 10000000001;
    	    					
    	    					var back = $scope.judgeCon(lconval1New,lcontag1New,rcontag1New,rconval1New,lconval1Old,lcontag1Old,rcontag1Old,rconval1Old,a_index1,b_index1);
    	    					if(back){
    	    						//如果指标区间也重复
    	    						var a_index2 = -10000000001;
        	    					var b_index2 = 10000000001;
    	    						var back = $scope.judgeCon(lconval2New,lcontag2New,rcontag2New,rconval2New,lconval2Old,lcontag2Old,rcontag2Old,rconval2Old,a_index2,b_index2);
    	    						if(back){
    	    							return back;
    	    						}
    	    					}
    	    				}
    	    			}
    	    		}
    	    	}
    	    	//如果新数据 时间，生效条件存在，只和旧数据中，时间，生效条件存在的进行校验
    	    	if(!startDateNew && startTimeNew && condfield1New && !startDateOld && startTimeOld && condfield1Old){
	    			//如果时间有交集
	    			if(!(startTimeNew-endTimeOld>0||endTimeNew-startTimeOld<0)){
	    				//如果生效条件字段一样
	    				if(condfield1New==condfield1Old){
	    					//如果生效条件重复
	    					var a_index1 = -10000000001;
	    					var b_index1 = 10000000001;
	    					
	    					var back = $scope.judgeCon(lconval1New,lcontag1New,rcontag1New,rconval1New,lconval1Old,lcontag1Old,rcontag1Old,rconval1Old,a_index1,b_index1);
	    					if(back){
	    						//如果指标区间也重复
	    						var a_index2 = -10000000001;
    	    					var b_index2 = 10000000001;
	    						var back = $scope.judgeCon(lconval2New,lcontag2New,rcontag2New,rconval2New,lconval2Old,lcontag2Old,rcontag2Old,rconval2Old,a_index2,b_index2);
	    						if(back){
	    							return back;
	    						}
	    					}
	    				}
	    			}
    	    	}
    	    	//如果新数据 生效条件存在，只和旧数据中，生效条件存在的进行校验
    	    	if(!startDateNew && !startTimeNew && condfield1New && !startDateOld && !startTimeOld && condfield1Old){
    				//如果生效条件字段一样
    				if(condfield1New==condfield1Old){
    					//如果生效条件重复
    					var a_index1 = -10000000001;
    					var b_index1 = 10000000001;
    					
    					var back = $scope.judgeCon(lconval1New,lcontag1New,rcontag1New,rconval1New,lconval1Old,lcontag1Old,rcontag1Old,rconval1Old,a_index1,b_index1);
    					if(back){
    						//如果指标区间也重复
    						var a_index2 = -10000000001;
	    					var b_index2 = 10000000001;
    						var back = $scope.judgeCon(lconval2New,lcontag2New,rcontag2New,rconval2New,lconval2Old,lcontag2Old,rcontag2Old,rconval2Old,a_index2,b_index2);
    						if(back){
    							return back;
    						}
    					}
    				}
    	    	}
    	    	//如果新数据日期，时间，存在，只和旧数据中，日期，时间，存在的进行校验
    	    	if(startDateNew && startTimeNew && !condfield1New && startDateOld && startTimeOld && !condfield1Old){
    	    		//如果日期有交集
    	    		if(!(startDateNew-endDateOld>0||endDateNew-startTimeOld<0)){
    	    			//如果时间有交集
    	    			if(!(startTimeNew-endTimeOld>0||endTimeNew-startTimeOld<0)){
    						//如果指标区间也重复
    	    				var a_index2 = -10000000001;
	    					var b_index2 = 10000000001;
    						var back = $scope.judgeCon(lconval2New,lcontag2New,rcontag2New,rconval2New,lconval2Old,lcontag2Old,rcontag2Old,rconval2Old,a_index2,b_index2);
    						if(back){
    							return back;
    						}
    	    			}
    	    		}
    	    	}
    	    	//如果新数据时间，存在，只和旧数据中时间，存在的进行校验
    	    	if(!startDateNew && startTimeNew && !condfield1New && !startDateOld && startTimeOld && !condfield1Old){
	    			//如果时间有交集
	    			if(!(startTimeNew-endTimeOld>0||endTimeNew-startTimeOld<0)){
						//如果指标区间也重复
	    				var a_index2 = -10000000001;
    					var b_index2 = 10000000001;
						var back = $scope.judgeCon(lconval2New,lcontag2New,rcontag2New,rconval2New,lconval2Old,lcontag2Old,rcontag2Old,rconval2Old,a_index2,b_index2);
						if(back){
							return back;
						}
	    			}
    	    	}
    	    	//如果新数据 都不存在，只和旧数据中都不存在的进行校验
    	    	if(!startDateNew && !startTimeNew && !condfield1New && !startDateOld && !startTimeOld && !condfield1Old){
					//如果指标区间也重复
    	    		var a_index2 = -10000000001;
					var b_index2 = 10000000001;
					var back = $scope.judgeCon(lconval2New,lcontag2New,rcontag2New,rconval2New,lconval2Old,lcontag2Old,rcontag2Old,rconval2Old,a_index2,b_index2);
					if(back){
						return back;
					}
    	    	}
    	
		}
	}	
}
		
  //判断条件区间是否有交集的方法(数据格式只有以下几种情况：[a,b],(a,b],[a,b),(a,b),[a,a],a和b有可能为无穷)
    $scope.judgeCon = function(lconvalNew, lcontagNew, rcontagNew, rconvalNew, lconvalOld, lcontagOld, rcontagOld, rconvalOld,a_index,b_index){
		var back = false;//表示无交集
		if((lconvalNew == ""||lconvalNew == undefined|| lconvalNew == null)&&rcontagNew != "=") {
			lconvalNew = a_index;//数据下限a+1
			lcontagNew = "<";
		}
		if((rconvalNew == ""||rconvalNew == undefined||rconvalNew == null)&&lcontagNew != "="){
			rconvalNew = b_index;//数据上限是：b-1
			rcontagNew = "<";
		}
		if((lconvalOld == ""||lconvalOld == undefined|| lconvalOld == null)&&rcontagOld != "=") {
			lconvalOld = a_index;//数据下限a+1
			lcontagOld = "<";
		}
		if((rconvalOld == ""||rconvalOld == undefined||rconvalOld == null)&&lcontagOld != "="){
			rconvalOld = b_index;//数据上限是：b-1
			rcontagOld = "<";
		}
		
		//如果新数据类似：1=p/p=1/1=p=1
		if(lcontagNew == "="||rcontagNew == "="){
			var pointNew = "";
		    if(lconvalNew != ""&&lconvalNew != undefined&&lconvalNew != null){
		    	pointNew = lconvalNew;
		    }else{
		    	pointNew = rconvalNew;
		    }
		    
		    //如果老数据也类似：1=p/p=1/1=p=1
		    if(lcontagOld == "="||rcontagOld == "="){
		    	 var pointOld = "";
				    if(lconvalOld != ""&&lconvalOld != undefined&&lconvalOld != null){
				    	pointOld = lconvalOld;
				    }else{
				    	pointOld = rconvalOld;
				    }
				    if(pointNew-pointOld ==0){
				    	back = true;
				    }
		    }
		    //如果老数据类似：[a,b]
		    if(lcontagOld == "<=" && rcontagOld == "<="){
		    	if(pointNew-lconvalOld>=0 && pointNew-rconvalOld<=0){
		    		back = true;
		    	}
		    }
		    
		    //如果老数据类似：[a,b)
		    if(lcontagOld == "<=" && rcontagOld == "<"){
		    	if(pointNew-lconvalOld >= 0 && pointNew-rconvalOld < 0){
		    		back = true;
		    	}
		    }
		    //如果老数据类似：(a,b]
		    if(lcontagOld == "<" && rcontagOld == "<="){
		    	if(pointNew-lconvalOld > 0 && pointNew-rconvalOld <= 0){
		    		back = true;
		    	}
		    }
		    //如果老数据类似;(a,b)
		    if(lcontagOld == "<" && rcontagOld =="<"){
		    	if(pointNew-lconvalOld > 0 && pointNew-rconvalOld < 0){
		    		back = true;
		    	}
		    }
		    
		}
		//如果新数据类似：(a,b)/[a,b]/[a,b)/(a,b]
		if(lcontagNew != "="&&rcontagNew != "="){
			 //如果老数据也类似：1=p/p=1/1=p=1
		    if(lcontagOld == "="||rcontagOld == "="){
		    	 var pointOld = "";
				    if(lconvalOld != "" && lconvalOld != undefined && lconvalOld != null){
				    	pointOld = lconvalOld;
				    }else{
				    	pointOld = rconvalOld;
				    }
				    if(pointOld-lconvalNew > 0 && pointOld-rconvalNew < 0){
				    	back = true;
				    }
				    if(lcontagNew == "<=" && lcontagOld == "="){
				    	if(lconvalNew-lconvalOld==0) back = true;
				    }
				    if(lcontagNew == "<=" && rcontagOld == "="){
				    	if(lconvalNew-rconvalOld == 0) back = true;
				    }
				    if(rcontagNew == "<=" && lcontagOld == "="){
				    	if(rconvalNew-lconvalOld ==0) back = true;
				    }
				    if(rcontagNew == "<=" && rcontagOld == "="){
				    	if(rconvalNew-rconvalOld == 0) back = true;
				    }
				    
		    }else{//如果老数据类似：(a,b)/[a,b]/[a,b)/(a,b]
		    	if(lconvalOld-lconvalNew>0 && lconvalOld-rconvalNew<0){
		    		back = true;
		    	}
		    	if(rconvalOld-lconvalNew>0 && rconvalOld-rconvalNew<0){
		    		back = true;
		    	}
		    	if(lconvalOld-lconvalNew<0 && rconvalOld-rconvalNew>0){
		    		back = true;
		    	}
		    }
		    
		    if(lcontagNew == "<="&&lcontagOld == "<="){
		    	if(lconvalNew-lconvalOld == 0) back = true;
		    }
		    if(lcontagNew == "<=" && rcontagOld == "<="){
		    	if(lconvalNew-rconvalOld == 0) back = true;
		    }
		    if(rcontagNew == "<=" && lcontagOld == "<="){
		    	if(rconvalNew-lconvalOld == 0) back = true;
		    }
		    if(rcontagNew == "<=" && rcontagOld == "<="){
		    	if(rconvalNew-rconvalOld == 0) back = true;
		    }
		    if(rconvalNew == rconvalOld || lconvalNew == lconvalOld){
		    	back = true;
		    }
		}
		return back;
	}
     
    
//    初始化指标阈值数据新增
    $scope.initDataIndicatorThreshold = function(){
    	$scope.indicatorThreshold_dataset = [];
    	for(var i=0;i<$scope.indicatorThresholdList.length;i++){
    		var condfield1Name = "";
    		for(var x in $scope.indexConditionList){
            	if($scope.indexConditionList[x].dictId == $scope.indicatorThresholdList[i].condfield1){
            		condfield1Name = $scope.indexConditionList[x].dictName;
            		break;
            	}
            }
//    		判断生效日期
    		var tmpStartDate = "";
    		if(!$scope.indicatorThresholdList[i].startDate){
    			$scope.indicatorThresholdList[i].startDate = "";
    		}
    		if(!$scope.indicatorThresholdList[i].endDate){
    			$scope.indicatorThresholdList[i].endDate = "";
    		}
    		if($scope.indicatorThresholdList[i].startDate && $scope.indicatorThresholdList[i].endDate){
    			tmpStartDate = $scope.indicatorThresholdList[i].startDate+"-"+$scope.indicatorThresholdList[i].endDate;
    		}else{
    			tmpStartDate = $scope.indicatorThresholdList[i].startDate+"&nbsp;"+$scope.indicatorThresholdList[i].endDate;
    		}
    		var tmpStartTime = "";
    		if(!$scope.indicatorThresholdList[i].startTime){
    			$scope.indicatorThresholdList[i].startTime = "";
    		}
    		if(!$scope.indicatorThresholdList[i].endTime){
    			$scope.indicatorThresholdList[i].endTime = "";
    		}
    		if($scope.indicatorThresholdList[i].startTime && $scope.indicatorThresholdList[i].endTime){
    			tmpStartTime = $scope.indicatorThresholdList[i].startTime+"-"+$scope.indicatorThresholdList[i].endTime;
    		}else{
    			tmpStartTime = $scope.indicatorThresholdList[i].startTime+"&nbsp;"+$scope.indicatorThresholdList[i].endTime;
    		}
    		
    		var tmpRule = "";
    		if(!$scope.indicatorThresholdList[i].lconval1){
    			$scope.indicatorThresholdList[i].lconval1 = "";
    		}
    		if(!$scope.indicatorThresholdList[i].lcontag1){
    			$scope.indicatorThresholdList[i].lcontag1 = "";
    		}
    		if(!$scope.indicatorThresholdList[i].rcontag1){
    			$scope.indicatorThresholdList[i].rcontag1 = "";
    		}
    		if(!$scope.indicatorThresholdList[i].rconval1){
    			$scope.indicatorThresholdList[i].rconval1 = "";
    		}
			tmpRule = $scope.indicatorThresholdList[i].lconval1+$scope.indicatorThresholdList[i].lcontag1+condfield1Name+$scope.indicatorThresholdList[i].rcontag1+$scope.indicatorThresholdList[i].rconval1;

    		var tmpLconval2 = "";
    		if(!$scope.indicatorThresholdList[i].lconval2){
    			$scope.indicatorThresholdList[i].lconval2 = "";
    		}
    		tmpLconval2 = $scope.indicatorThresholdList[i].lconval2;
    		var tmpLcontag2 = "";
    		if(!$scope.indicatorThresholdList[i].lcontag2){
    			$scope.indicatorThresholdList[i].lcontag2 = "";
    		}
    		tmpLcontag2 = $scope.indicatorThresholdList[i].lcontag2;
    		var tmpRcontag2 = "";
    		if(!$scope.indicatorThresholdList[i].rcontag2){
    			$scope.indicatorThresholdList[i].rcontag2 = "";
    		}
    		tmpRcontag2 = $scope.indicatorThresholdList[i].rcontag2;
    		var tmpRconval2 = "";
    		if(!$scope.indicatorThresholdList[i].rconval2){
    			$scope.indicatorThresholdList[i].rconval2 = "";
    		}
    		tmpRconval2 = $scope.indicatorThresholdList[i].rconval2;
    		var tmpActionCode = "";
    		for(var x in $scope.riskWay){
    			if($scope.riskWay[x].key == $scope.indicatorThresholdList[i].actionCode){
    				tmpActionCode = $scope.riskWay[x].text;
    			}
    		}
    		var tempArr = [i+1,tmpStartDate,
    		               tmpStartTime,
    		               tmpRule,
    		               tmpLconval2+tmpLcontag2+"指标"+tmpRcontag2+tmpRconval2,
    		               tmpActionCode,
    		               "<a style='cursor:pointer;' class='indicatorThreshold_updateIndex'>[修改]</a> " +
    		               "<a style='cursor:pointer;' class='indicatorThreshold_deleteIndex'>[删除]</a> "];
    		$scope.indicatorThreshold_dataset.push(tempArr);
        }
    };
    
    $("body").undelegate("#indicatorThreshold_table td .indicatorThreshold_deleteIndex","click");
    $("body").delegate("#indicatorThreshold_table td .indicatorThreshold_deleteIndex", "click", function (event){
    	event.stopPropagation();
    	
    	var myDetailTable = $("#indicatorThreshold_table").DataTable();
        var rowIndex = $(this).parents('tr')[0].rowIndex;
        var roww = myDetailTable.row($(this).parents('tr'));
        layer.confirm("确定删除该条信息？", {icon: 3}, function (count) {
        	roww.remove().draw(false);
	        $scope.indicatorThresholdList.splice(rowIndex-1, 1);
	        $scope.portfolioRiskControlSetShow = false;
			$scope.addIndicatorThreshold();
	        $scope.$apply();
     	layer.alert("删除成功");
    	});
    });
    
    //    修改的列数字
    $scope.indicatorThresholdIndex = "";
    $scope.indicatorButtonShow = true;
    $("body").undelegate("#indicatorThreshold_table td .indicatorThreshold_updateIndex","click");
    $("body").delegate("#indicatorThreshold_table td .indicatorThreshold_updateIndex", "click", function (){
    	//为选中的行设置选中色
        if($(this).closest('tr').hasClass("selected")){
            $(this).closest('tr').removeClass("selected");
        }
        else{
            $("tr.selected").removeClass("selected");
            $(this).closest('tr').addClass("selected");
        }
    	$scope.addIndicatorThreshold();
    	$scope.indicatorThreshold = {};
    	$scope.indicatorButtonShow = false;
    	document.getElementById("indicatorThresholdStartTime").value = "";
    	document.getElementById("indicatorThresholdEndTime").value = "";
    	var myDetailTable = $("#indicatorThreshold_table").DataTable();
        var rowIndex = $(this).parents('tr')[0].rowIndex;
        
        $scope.indicatorThresholdIndex = rowIndex;
        
        
        
        $scope.indicatorThreshold = angular.copy($scope.indicatorThresholdList[rowIndex-1]);
 	    if($scope.indicatorThreshold.startTime || $scope.indicatorThreshold.endTime){
 		    $scope.buttonStatus.indicatorTimeStatus = true;
 		    $scope.timeNotEdit = false;
 		    document.getElementById("indicatorThresholdStartTime").value = $scope.indicatorThreshold.startTime;
 		    document.getElementById("indicatorThresholdEndTime").value = $scope.indicatorThreshold.endTime;
 	    }
 	   
 	    if($scope.indicatorThreshold.startDate || $scope.indicatorThreshold.endDate){
 	    	$scope.buttonStatus.indicatorDateStatus = true;
 		    $scope.dateNotEdit = false;
 	    }
 	    if($scope.indicatorThreshold.lcontag1 || $scope.indicatorThreshold.condfield1 
 	    		|| $scope.indicatorThreshold.condfieldShortName1 || $scope.indicatorThreshold.rcontag1 
 	    		|| $scope.indicatorThreshold.rconval1){
 	    	$scope.buttonStatus.ruleStatus = true;
 		    $scope.ruleNotEdit = false;
 	    }
 	   $scope.portfolioRiskControlSetActionCode = true;
 	   $scope.portfolioRiskControlSetShow = true;
 	   $scope.$apply();
    });
    
    
    
    
    $scope.updateIndicatorThreshold = function(entity){
    	
    	if(entity.lconval1 == null||entity.lconval1 == undefined || entity.lconval1 == "") entity.lcontag1 = "";
    	if(entity.rconval1 == null||entity.rconval1 == undefined || entity.rconval1 == "") entity.rcontag1 = "";
    	if(entity.lcontag1 == "" && entity.rcontag1 == "") entity.condfield1 = "";
    	if(entity.lconval2 == null||entity.lconval2 == undefined || entity.lconval2 == "") entity.lcontag2 = "";
    	if(entity.rconval2 == null||entity.rconval2 == undefined || entity.rconval2 == "") entity.rcontag2 = "";
    	
    	
    	$scope.tmpIndicator = entity;
    	$scope.entitytmpIndicator = angular.copy($scope.tmpIndicator);
    	$scope.entitytmpIndicator.startTime = document.getElementById("indicatorThresholdStartTime").value;
    	$scope.entitytmpIndicator.endTime = document.getElementById("indicatorThresholdEndTime").value;
    	
    	/***************************指标生效条件 效验开始*************************/
    	var b2 = judgeDateAndCon($scope.entitytmpIndicator);
    	if(b2==false){
    		 $scope.indicatorThreshold.lcontag1 = "<";
	   	     $scope.indicatorThreshold.condfield1 = "currUnitNetValue";
	   	     $scope.indicatorThreshold.rcontag1 = "<=";
	   	     $scope.indicatorThreshold.actionCode = "1";
	   	     $scope.indicatorThreshold.lcontag2 = "<";
	   	     $scope.indicatorThreshold.rcontag2 = "<=";
    		return false;
    	}
    	var tmpE = [];
    	for(var t=0;t<$scope.indicatorThresholdList.length;t++){
    		tmpE.push($scope.indicatorThresholdList[t]);
    	}
    	tmpE.splice($scope.indicatorThresholdIndex-1,1);
    	var back = $scope.judgeOverlap($scope.entitytmpIndicator,tmpE);//效验区间是否重复
    	if(back){
			layer.alert("区间重复");
			 $scope.indicatorThreshold.lcontag1 = "<";
	   	     $scope.indicatorThreshold.condfield1 = "currUnitNetValue";
	   	     $scope.indicatorThreshold.rcontag1 = "<=";
	   	     $scope.indicatorThreshold.actionCode = "1";
	   	     $scope.indicatorThreshold.lcontag2 = "<";
	   	     $scope.indicatorThreshold.rcontag2 = "<=";
    		return false;
		}
    	/***************************指标生效条件 效验结束*************************/
    	
    	$scope.indicatorThresholdList.splice($scope.indicatorThresholdIndex-1,1,$scope.entitytmpIndicator);
    	destroyDatatable("indicatorThreshold_table");
    	$scope.initDataIndicatorThreshold();
    	$scope.initIndicatorThreshold();
    	
    	$scope.portfolioRiskControlSetShow = false;
		$scope.addIndicatorThreshold();
    	//$scope.$apply();
    }
    $scope.addIndicatorThreshold = function(){
    	$scope.portfolioRiskControlSetActionCode = false;
    	$scope.indicatorThresholdIndex = "";
    	$scope.indicatorButtonShow = true;
    	$scope.indicatorThreshold = {};
    	document.getElementById("indicatorThresholdStartTime").value = "";
	    document.getElementById("indicatorThresholdEndTime").value = "";
	    $scope.buttonStatus.indicatorTimeStatus = false;
	    $scope.buttonStatus.indicatorDateStatus = false;
	    $scope.buttonStatus.ruleStatus = false;
	    $scope.timeNotEdit = true;
	    $scope.dateNotEdit = true;
	    $scope.ruleNotEdit = true;
	     $scope.indicatorThreshold.lcontag1 = "<";
	     $scope.indicatorThreshold.condfield1 = "currUnitNetValue";
	     $scope.indicatorThreshold.rcontag1 = "<=";
	     $scope.indicatorThreshold.actionCode = "1";
	     $scope.indicatorThreshold.lcontag2 = "<";
	     $scope.indicatorThreshold.rcontag2 = "<=";
    }
    
    //效验指标生效条件公共方法
    judegIndexDataAndCon = function(tmpEntity){
    	//日期+时间验证
    	if(!$scope.dateIndexNotEdit&&$scope.timeIndexNotEdit){
    		layer.alert("选择日期，必须选择时间");
			return false;
    	}
    	//日期验证判断
    	if(!$scope.dateIndexNotEdit){
    		if(!tmpEntity.startDate){
    			layer.alert("开始日期不能为空");
    			return false;
    		}
    		if(!tmpEntity.endDate){
    			layer.alert("结束日期不能为空");
    			return false;
    		}
    		if(tmpEntity.endDate&&tmpEntity.startDate){
    			if(tmpEntity.startDate-tmpEntity.endDate>0){
    				layer.alert("结束日期不能小于开始日期");
        			return false;
    			}
    		}
    	}
    	//时间验证判断
    	if(!$scope.timeIndexNotEdit){
    		if(!tmpEntity.startTime){
    			layer.alert("开始时间不能为空");
    			return false;
    		}
    		if(!tmpEntity.endTime){
    			layer.alert("结束时间不能为空");
    			return false;
    		}
    		if(tmpEntity.startTime&&tmpEntity.endTime){
    			startT = tmpEntity.startTime.replace(/:/g,"");
       			endT = tmpEntity.endTime.replace(/:/g,"");
       			if(startT-endT>=0){
       				layer.alert("结束时间必须大于开始时间"); 
       		       	return false;
       			}
    		}
    	}
    	//验证生效条件
    	if(!$scope.ruleIndexNotEdit){
    		if(tmpEntity.rcontag && tmpEntity.rconval && tmpEntity.lcontag && tmpEntity.lconval){
    			if(tmpEntity.lcontag=="="&&tmpEntity.rcontag=="="&&tmpEntity.rconval-tmpEntity.lconval!=0){
    				layer.alert("指标生效条件有误");
	    			return false;
    			}
    			if((tmpEntity.lcontag=="="&&tmpEntity.rcontag!="=")||(tmpEntity.lcontag!="="&&tmpEntity.rcontag=="=")){
    				layer.alert("指标生效条件有误");
	    			return false;
    			}
    		}
    		if(tmpEntity.lconval){
    			if(isNaN(tmpEntity.lconval)){
    				layer.alert("指标生效条件的取值范围是:[-10000000000.0000，10000000000.0000]");
        			return false;
    			}
    			if(tmpEntity.lconval-10000000000>0){
    				layer.alert("指标生效条件的取值范围是:[-10000000000.0000，10000000000.0000]");
        			return false;
    			}
    			if(-10000000000-tmpEntity.lconval>0){
    				layer.alert("指标生效条件的取值范围是:[-10000000000.0000，10000000000.0000]");
        			return false;
    			}
    			var point2 = tmpEntity.lconval.length-1;
        		var point1 = tmpEntity.lconval.indexOf(".");
        		if(point1>=0){
        			var str = tmpEntity.lconval.substring(point1,point2);
        			if(str.length>4){
        				layer.alert("指标生效条件的取值范围是:[-10000000000.0000，10000000000.0000]"); 
                    	return false;
        			}
        		}
    		}
    		if(tmpEntity.rconval){
    			if(isNaN(tmpEntity.rconval)){
    				layer.alert("指标生效条件的取值范围是:[-10000000000.0000，10000000000.0000]");
        			return false;
    			}
    			if(tmpEntity.rconval-10000000000>0){
    				layer.alert("指标生效条件的取值范围是:[-10000000000.0000，10000000000.0000]");
        			return false;
    			}
    			if(-10000000000-tmpEntity.rconval>0){
    				layer.alert("指标生效条件的取值范围是:[-10000000000.0000，10000000000.0000]");
        			return false;
    			}
    			var point2 = tmpEntity.rconval.length-1;
        		var point1 = tmpEntity.rconval.indexOf(".");
        		if(point1>=0){
        			var str = tmpEntity.rconval.substring(point1,point2);
        			if(str.length>4){
        				layer.alert("指标生效条件的取值范围是:[-10000000000.0000，10000000000.0000]"); 
                    	return false;
        			}
        		}
    		}
    		if(!tmpEntity.lconval && tmpEntity.lcontag){
    			layer.alert("指标生效条件：左边值不能为空");
    			return false;
    		}
    		if(tmpEntity.lconval && !tmpEntity.lcontag){
    			layer.alert("指标生效条件：左比较符不能为空");
    			return false;
    		}
    		if(!tmpEntity.condfield){
    			layer.alert("指标生效条件字段不能为空");
    			return false;
    		}
    		if(!tmpEntity.rcontag && tmpEntity.rconval){
    			layer.alert("指标生效条件：右比较符不能为空");
    			return false;
    		}
    		if(tmpEntity.rcontag && !tmpEntity.rconval){
    			layer.alert("指标生效条件：右边值不能为空");
    			return false;
    		}
    		if(!tmpEntity.rcontag && !tmpEntity.rconval && !tmpEntity.lcontag && !tmpEntity.lconval){
    			layer.alert("指标生效条件不能为空");
    			return false;
    		}
    		if(tmpEntity.rcontag && tmpEntity.rconval && tmpEntity.lcontag && tmpEntity.lconval){
				if(tmpEntity.lconval-tmpEntity.rconval>=0&&(tmpEntity.lcontag=="<"||tmpEntity.rcontag=="<")){
	    			layer.alert("指标生效条件：左边值需小于右边值");
	    			return false;
	    		}
	    		if(tmpEntity.lconval-tmpEntity.rconval>0){
	    			layer.alert("指标生效条件：左边值不能大于右边值");
	    			return false;
	    		}
    		}
    	}
    	
    	if(tmpEntity.lconval!=null&&tmpEntity.lconval!=""&&tmpEntity.lconval!=undefined&&tmpEntity.rconval!=null&&tmpEntity.rconval!=""&&tmpEntity.rconval!=undefined){
			if(tmpEntity.lconval==tmpEntity.rconval){
				if(tmpEntity.lcontag!="="||tmpEntity.rcontag!="="){
					layer.alert("左边值需小于右边值");
	    			return false;
				}
			}
		}
    }
    
//    最后的保存方法
    $scope.savePortfolioRisk = function(){
    	
    	//隐藏增加指标阈值界面
    	$scope.portfolioRiskControlSetShow = false;
		$scope.addIndicatorThreshold();
		//$scope.$apply();
    	$scope.addEntity = {};
//    	获取指标阈值的所有数据
//    	获取指标公式所有值
    	$scope.indexCalculationFormulaList = [];
        var myDetailTable = $("#indexCalculationFormula_table").DataTable();
        var weightFlag = false;
        for(var i=0;i<myDetailTable.context[0].aoData.length-1;i++){
            var myParameter = {};
            for(var j=0;j<$("#indexCalculationFormula_table .myidxGroup")[i].length;j++){
            	if($("#indexCalculationFormula_table .myidxGroup")[i][j].selected == true){
                    myParameter.groupID = $("#indexCalculationFormula_table .myidxGroup")[i][j].value;
                }
            }
            for(var j=0;j<$("#indexCalculationFormula_table .myidxTpl")[i].length;j++){
                if($("#indexCalculationFormula_table .myidxTpl")[i][j].selected == true){
                    myParameter.assetIndicators = $("#indexCalculationFormula_table .myidxTpl")[i][j].value;
                }
            }
            for(var j=0;j<$("#indexCalculationFormula_table .myCalcuTagLeft")[i].length;j++){
                if($("#indexCalculationFormula_table .myCalcuTagLeft")[i][j].selected == true){
                    myParameter.calcuTagLeft = $("#indexCalculationFormula_table .myCalcuTagLeft")[i][j].value;
                }
            }
            for(var j=0;j<$("#indexCalculationFormula_table .myCalcuTagRight")[i].length;j++){
                if($("#indexCalculationFormula_table .myCalcuTagRight")[i][j].selected == true){
                    myParameter.calcuTagRight = $("#indexCalculationFormula_table .myCalcuTagRight")[i][j].value;
                }
            }
            myParameter.weight = $("#indexCalculationFormula_table input")[i].value;
            if(!myParameter.weight){
            	weightFlag = true;
            }
            myParameter.denominator = $scope.indexCalculation.denominator;
            $scope.indexCalculationFormulaList.push(myParameter);
        }
    	$scope.addEntity = {
    			fundId:sessionStorage.listFundID,
    			indexName:$scope.indexName,
    			startDate:$scope.index.startDate,
    			endDate:$scope.index.endDate,
    			startTime:document.getElementById("indexStartTime").value,
    			endTime:document.getElementById("indexEndTime").value,
    			lconval:$scope.index.leftValue,
    			lcontag:$scope.index.leftSymbol,
    			condfield:$scope.index.centerValue,
    			rcontag:$scope.index.rightSymbol,
    			rconval:$scope.index.rightValue,
    			indexCalculationFormulaList:$scope.indexCalculationFormulaList,
    			denominator:$scope.indexCalculation.denominator,
    			descr:$scope.index.descr,
    			expression:$scope.index.expression,
    			indicatorThresholdList:$scope.indicatorThresholdList
    	};
    	
    	if($scope.addEntity.lconval == null||$scope.addEntity.lconval == undefined||$scope.addEntity.lconval == "") $scope.addEntity.lcontag = "";
    	if($scope.addEntity.rconval == null||$scope.addEntity.rconval == undefined||$scope.addEntity.rconval == "") $scope.addEntity.rcontag = "";
    	if($scope.addEntity.lcontag == "" && $scope.addEntity.rcontag == "") $scope.addEntity.condfield = "";
    	
    	/***************************指标生效条件 效验开始*************************/
    	if($scope.indicatorThresholdList==null||$scope.indicatorThresholdList==undefined||$scope.indicatorThresholdList.length<1){
    		layer.alert("至少添加一条指标阈值条件");
    		return false;
    	}
    	if(!$scope.addEntity.indexName){
    		layer.alert("指标名称不能为空");
    		return false;
    	}
    	if($scope.addEntity.indexName.length>200){
    		layer.alert("指标名称最多允许200字符组成");
    		return false;
    	}
    	var b3 = judegIndexDataAndCon($scope.addEntity);
    	if(b3==false){
    		return false;
    	}
    	//验证分子是否为空
    	if(!$scope.addEntity.indexCalculationFormulaList||$scope.addEntity.indexCalculationFormulaList.length<1){
    		layer.alert("指标计算公式不能为空");
    		return false;
    	}
    	if($scope.buttonStatus.denominatorStatus && ($scope.indexCalculation.denominator == ""||$scope.indexCalculation.denominator == null||$scope.indexCalculation.denominator == undefined)){
    			layer.alert("分母不能为空");
    			return false;
    	}
    	//验证(资产范围+资产指标)是否重复
    	if($scope.addEntity.indexCalculationFormulaList && $scope.addEntity.indexCalculationFormulaList.length>0){
    		var temp = "";
    		for(var i=0;i<$scope.addEntity.indexCalculationFormulaList.length;i++){
    			temp = temp+$scope.addEntity.indexCalculationFormulaList[i].groupID+$scope.addEntity.indexCalculationFormulaList[i].assetIndicators+",";
    		}
    		for(var j=0;j<$scope.addEntity.indexCalculationFormulaList.length;j++){
    			if(temp.replace($scope.addEntity.indexCalculationFormulaList[j].groupID+$scope.addEntity.indexCalculationFormulaList[j].assetIndicators+",",":").indexOf($scope.addEntity.indexCalculationFormulaList[j].groupID+$scope.addEntity.indexCalculationFormulaList[j].assetIndicators+",")>-1){
    				layer.alert("[资产范围]+[资产指标]不能重复");
    	    		return false;
    			}
    		}
    		for(var k=0;k<$scope.addEntity.indexCalculationFormulaList.length;k++){
    			var tmpGroupID1 = $scope.addEntity.indexCalculationFormulaList[k].groupID;
    			for(var n=0;n<$scope.addEntity.indexCalculationFormulaList.length;n++){
    				var tmpGroupID2 = $scope.addEntity.indexCalculationFormulaList[n].groupID;
    				if(tmpGroupID1.indexOf("fundProduct") >-1 && tmpGroupID2.indexOf("fundProduct") == -1){
    					layer.alert("资产范围若为基金产品，只能全为基金产品");
        	    		return false;
    				}
    			}
    		}
    		var flag = $scope.judegCalcuTag($scope.addEntity.indexCalculationFormulaList);
    		if(!flag){
    			layer.alert("指标计算公式不正确：运算符号不匹配");
    			return false;
    		}
    		var tmpFlag = $scope.limitCaclTag($scope.addEntity.indexCalculationFormulaList);
    		if(!tmpFlag){
    			layer.alert("指标计算公式异常：不支持嵌套运算");
    			return false;
    		}
    	}
    	//验证权重值是否符合条件
    	if(weightFlag){
        	layer.alert("权重不能为空");
        	return false;
        }
    	if($scope.addEntity.indexCalculationFormulaList && $scope.addEntity.indexCalculationFormulaList.length>0){
    		for(var i=0;i<$scope.addEntity.indexCalculationFormulaList.length;i++){
    			var tempWeight = $scope.addEntity.indexCalculationFormulaList[i].weight;
    			if(tempWeight==0){
    				layer.alert("权重的取值范围是：[-10000.00,10000.00]且不能为0");
    	        	return false;
    			}
    			else if(tempWeight-10000>0){
    				layer.alert("权重的取值范围是：[-10000.00,10000.00]");
    	        	return false;
    			}
    			else if(-10000-tempWeight>0){
    				layer.alert("权重的取值范围是：[-10000.00,10000.00]");
    	        	return false;
    			}else{
    				var point2 = tempWeight.length-1;
            		var point1 = tempWeight.indexOf(".");
            		if(point1>=0){
            			var str = tempWeight.substring(point1,point2);
            			if(str.length>2){
            				layer.alert("权重的取值范围是：[-10000.00,10000.00]"); 
                        	return false;
            			}
            		}
    			}
    		}
    	}
    	/***************************指标生效条件 效验结束*************************/
    	layer.load(2, {
 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
 	   	});
    	$scope.portfolioRiskControlSetShowAll = false;
		$scope.addInit();
    	$scope.portfolioRiskControlSetService.savePortfolioRiskControlSet($scope.addEntity,sessionStorage.listBrokerID,function(result){
    		if(result){
    			layer.alert(result.errMessage);
    			destroyDatatable("portfolioRiskControlSet_table");
 			   	$scope.initTableData(false);
    		}else{
    			layer.alert("后台遇到未知错误");
    		}
    		layer.closeAll('loading');
    	});
    	
    };
    $scope.updatePortfolioRisk = function(){
    	
    	$scope.portfolioRiskControlSetShow = false;
		$scope.addIndicatorThreshold();
		//$scope.$apply();
    	$scope.addEntity = {};
//    	获取指标阈值的所有数据
//    	获取指标公式所有值
    	$scope.indexCalculationFormulaList = [];
    	var weightFlag = false;
        var myDetailTable = $("#indexCalculationFormula_table").DataTable();
        for(var i=0;i<myDetailTable.context[0].aoData.length-1;i++){
            var myParameter = {};
            for(var j=0;j<$("#indexCalculationFormula_table .myidxGroup")[i].length;j++){
            	if($("#indexCalculationFormula_table .myidxGroup")[i][j].selected == true){
                    myParameter.groupID = $("#indexCalculationFormula_table .myidxGroup")[i][j].value;
                }
            }
            for(var j=0;j<$("#indexCalculationFormula_table .myidxTpl")[i].length;j++){
                if($("#indexCalculationFormula_table .myidxTpl")[i][j].selected == true){
                    myParameter.assetIndicators = $("#indexCalculationFormula_table .myidxTpl")[i][j].value;
                }
            }
            
            for(var j=0;j<$("#indexCalculationFormula_table .myCalcuTagLeft")[i].length;j++){
                if($("#indexCalculationFormula_table .myCalcuTagLeft")[i][j].selected == true){
                    myParameter.calcuTagLeft = $("#indexCalculationFormula_table .myCalcuTagLeft")[i][j].value;
                }
            }
            
            for(var j=0;j<$("#indexCalculationFormula_table .myCalcuTagRight")[i].length;j++){
                if($("#indexCalculationFormula_table .myCalcuTagRight")[i][j].selected == true){
                    myParameter.calcuTagRight = $("#indexCalculationFormula_table .myCalcuTagRight")[i][j].value;
                }
            }
            
            myParameter.weight = $("#indexCalculationFormula_table input")[i].value;
            if(!myParameter.weight){
            	weightFlag = true;
            }
            myParameter.denominator = $scope.indexCalculation.denominator;
            $scope.indexCalculationFormulaList.push(myParameter);
        }
    	$scope.addEntity = {
    			id:$scope.updateId,
    			indexName:$scope.indexName,
    			startDate:$scope.index.startDate,
    			endDate:$scope.index.endDate,
    			startTime:document.getElementById("indexStartTime").value,
    			endTime:document.getElementById("indexEndTime").value,
    			lconval:$scope.index.leftValue,
    			lcontag:$scope.index.leftSymbol,
    			condfield:$scope.index.centerValue,
    			rcontag:$scope.index.rightSymbol,
    			rconval:$scope.index.rightValue,
    			indexCalculationFormulaList:$scope.indexCalculationFormulaList,
    			denominator:$scope.indexCalculation.denominator,
    			descr:$scope.index.descr,
    			expression:$scope.index.expression,
    			indicatorThresholdList:$scope.indicatorThresholdList
    	};
    	
    	if($scope.addEntity.lconval == null||$scope.addEntity.lconval == undefined||$scope.addEntity.lconval == "") $scope.addEntity.lcontag = "";
    	if($scope.addEntity.rconval == null||$scope.addEntity.rconval == undefined||$scope.addEntity.rconval == "") $scope.addEntity.rcontag = "";
    	if($scope.addEntity.lcontag == "" && $scope.addEntity.rcontag == "") $scope.addEntity.condfield = "";
    	
    	/***************************指标生效条件 效验开始*************************/
    	if($scope.indicatorThresholdList==null||$scope.indicatorThresholdList==undefined||$scope.indicatorThresholdList.length<1){
    		layer.alert("至少添加一条指标阈值条件");
    		return false;
    	}
    	if(!$scope.addEntity.indexName){
    		layer.alert("指标名称不能为空");
    		return false;
    	}
    	if($scope.addEntity.indexName.length>200){
    		layer.alert("指标名称最多允许200字符组成");
    		return false;
    	}
    	//验证生效条件
    	var b4 = judegIndexDataAndCon($scope.addEntity);
    	if(b4==false){
    		return false;
    	}
    	//验证分子是否为空
    	if(!$scope.addEntity.indexCalculationFormulaList||$scope.addEntity.indexCalculationFormulaList.length<1){
    		layer.alert("指标计算公式不能为空");
    		return false;
    	}
    	if($scope.buttonStatus.denominatorStatus && ($scope.indexCalculation.denominator == ""||$scope.indexCalculation.denominator == null||$scope.indexCalculation.denominator == undefined)){
			layer.alert("分母不能为空");
			return false;
	    }
    	//验证(资产范围+资产指标)是否重复,运算符号合理
    	if($scope.addEntity.indexCalculationFormulaList && $scope.addEntity.indexCalculationFormulaList.length>0){
    		var temp = "";
    		for(var i=0;i<$scope.addEntity.indexCalculationFormulaList.length;i++){
    			temp = temp+$scope.addEntity.indexCalculationFormulaList[i].groupID+$scope.addEntity.indexCalculationFormulaList[i].assetIndicators+",";
    		}
    		for(var j=0;j<$scope.addEntity.indexCalculationFormulaList.length;j++){
    			if(temp.replace($scope.addEntity.indexCalculationFormulaList[j].groupID+$scope.addEntity.indexCalculationFormulaList[j].assetIndicators+",",":").indexOf($scope.addEntity.indexCalculationFormulaList[j].groupID+$scope.addEntity.indexCalculationFormulaList[j].assetIndicators+",")>-1){
    				layer.alert("[资产范围]+[资产指标]不能重复");
    	    		return false;
    			}
    		}
    		for(var k=0;k<$scope.addEntity.indexCalculationFormulaList.length;k++){
    			var tmpGroupID1 = $scope.addEntity.indexCalculationFormulaList[k].groupID;
    			for(var n=0;n<$scope.addEntity.indexCalculationFormulaList.length;n++){
    				var tmpGroupID2 = $scope.addEntity.indexCalculationFormulaList[n].groupID;
    				if(tmpGroupID1.indexOf("fundProduct") >-1 && tmpGroupID2.indexOf("fundProduct") == -1){
    					layer.alert("资产范围若为基金产品，只能全为基金产品");
        	    		return false;
    				}
    			}
    		}
    		var flag = $scope.judegCalcuTag($scope.addEntity.indexCalculationFormulaList);
    		if(!flag){
    			layer.alert("指标计算公式不正确：运算符号不匹配");
    			return false;
    		}
    		var tmpFlag = $scope.limitCaclTag($scope.addEntity.indexCalculationFormulaList);
    		if(!tmpFlag){
    			layer.alert("指标计算公式异常：不支持嵌套运算");
    			return false;
    		}
    	}
    	//验证权重值是否符合条件
    	if(weightFlag){
        	layer.alert("权重不能为空");
        	return false;
        }
    	if($scope.addEntity.indexCalculationFormulaList && $scope.addEntity.indexCalculationFormulaList.length>0){
    		for(var i=0;i<$scope.addEntity.indexCalculationFormulaList.length;i++){
    			var tempWeight = $scope.addEntity.indexCalculationFormulaList[i].weight;
    			if(tempWeight==0){
    				layer.alert("权重的取值范围是：[-10000.00,10000.00]且不能为0");
    	        	return false;
    			}
    			else if(tempWeight-10000>0){
    				layer.alert("权重的取值范围是：[-10000.00,10000.00]");
    	        	return false;
    			}
    			else if(-10000-tempWeight>0){
    				layer.alert("权重的取值范围是：[-10000.00,10000.00]");
    	        	return false;
    			}else{
    				var point2 = tempWeight.length-1;
            		var point1 = tempWeight.indexOf(".");
            		if(point1>=0){
            			var str = tempWeight.substring(point1,point2);
            			if(str.length>2){
            				layer.alert("权重的取值范围是：[-10000.00,10000.00]"); 
                        	return false;
            			}
            		}
    			}
    		}
    	}
    	/***************************指标生效条件 效验结束*************************/
    	
    	layer.load(2, {
  		   shade: [0.5,'#fff'] //0.1透明度的白色背景
  	   	});
    	
    	$scope.portfolioRiskControlSetShowAll = false;
		$scope.addInit();
    	
    	$scope.portfolioRiskControlSetService.updateRiskIndexSet($scope.addEntity,sessionStorage.listBrokerID,function(result){
    		if(result){
    			layer.alert(result.errMessage);
    			destroyDatatable("portfolioRiskControlSet_table");
 			   	$scope.initTableData(false);
    		}else{
    			layer.alert("后台遇到未知错误");
    		}
    		layer.closeAll('loading');
    	});
    }
    
//    指标生效条件 中修改时候
    $("body").delegate("#indexCalculationFormula_table .myidxGroup", "change", function (){
    	//获得当前行
    	 var table = $("#indexCalculationFormula_table").DataTable();
    	 var id = $(this).parents('tr').context.id;
    	 var value = $(this).parents('tr').context.value;
    	 var myindex = id.split("_")[1];
    	 if(value.indexOf("fundProduct")>-1){
    		 $("#myidxTpl_"+myindex+"").empty();
    		 for(var k=0;k<$scope.assetIndicators4product.length;k++){
                 $("#myidxTpl_"+myindex+"").append("<option value='"+$scope.assetIndicators4product[k].key+"'>"+$scope.assetIndicators4product[k].text+"</option>");
             }
    	 }else{
    		 $("#myidxTpl_"+myindex+"").empty();
        	 for(var k=0;k<$scope.assetIndicators.length;k++){
                 $("#myidxTpl_"+myindex+"").append("<option value='"+$scope.assetIndicators[k].key+"'>"+$scope.assetIndicators[k].text+"</option>");
             }
    	 }
    	$scope.changeDescr();
    	$scope.$apply();
    });
    $("body").delegate("#indexCalculationFormula_table .myidxTpl", "change", function (){
    	$scope.changeDescr();
    	$scope.$apply();
    }); 
    $("body").delegate("#indexCalculationFormula_table input", "change", function (){
    	$scope.changeDescr();
    	$scope.$apply();
    }); 
    $("body").delegate("#indexCalculationFormula_table .myCalcuTagLeft", "change", function (){
    	$scope.changeDescr();
    	$scope.$apply();
    }); 
    $("body").delegate("#indexCalculationFormula_table .myCalcuTagRight", "change", function (){
    	$scope.changeDescr();
    	$scope.$apply();
    }); 
    $scope.changeDescr = function(){
    	var tmpList = [];
    	var myDetailTable = $("#indexCalculationFormula_table").DataTable();
        for(var i=0;i<myDetailTable.context[0].aoData.length-1;i++){
            var myParameter = {};
            var len = $("#indexCalculationFormula_table .myidxGroup")[i].length;
            for(var j=0;j<len;j++){
            	if($("#indexCalculationFormula_table .myidxGroup")[i][j].selected == true){
                    myParameter.groupID = $("#indexCalculationFormula_table .myidxGroup")[i][j].value;
                }
            }
            for(var j=0;j<$("#indexCalculationFormula_table .myidxTpl")[i].length;j++){
                if($("#indexCalculationFormula_table .myidxTpl")[i][j].selected == true){
                    myParameter.assetIndicators = $("#indexCalculationFormula_table .myidxTpl")[i][j].value;
                }
            }
            for(var j=0;j<$("#indexCalculationFormula_table .myCalcuTagLeft")[i].length;j++){
                if($("#indexCalculationFormula_table .myCalcuTagLeft")[i][j].selected == true){
                    myParameter.calcuTagLeft = $("#indexCalculationFormula_table .myCalcuTagLeft")[i][j].value;
                }
            }
            for(var j=0;j<$("#indexCalculationFormula_table .myCalcuTagRight")[i].length;j++){
                if($("#indexCalculationFormula_table .myCalcuTagRight")[i][j].selected == true){
                    myParameter.calcuTagRight = $("#indexCalculationFormula_table .myCalcuTagRight")[i][j].value;
                }
            }
            myParameter.weight = $("#indexCalculationFormula_table input")[i].value;
            tmpList.push(myParameter);
        }
        //（【所有股票】【成本】*1 + 【中小板股票】【市值】*-1+ 【股票型封闭基金】【市值】）/【基金上日净值】
        var str = "";
        var numberStr = "";
        for(var m=0;m<tmpList.length;m++){
        	for(var x in $scope.myCalcuTagLeft){
        		if($scope.myCalcuTagLeft[x].key == tmpList[m].calcuTagLeft){
        			str +=$scope.myCalcuTagLeft[x].text;
        			numberStr +=$scope.myCalcuTagLeft[x].key;
        			break;
        		}
        	}
        	for(var x in $scope.idxGroup){
        		if($scope.idxGroup[x].groupID == tmpList[m].groupID){
        			str +="【"+$scope.idxGroup[x].groupName+"】";
        			numberStr +=$scope.idxGroup[x].groupID+"*";
        			break;
        		}
        	}
        	for(var x in $scope.assetIndicators){
        		if($scope.assetIndicators[x].key == tmpList[m].assetIndicators){
        			str +="【"+$scope.assetIndicators[x].text+"】";
        			numberStr +=$scope.assetIndicators[x].key+"";
        			break;
        		}
        	}
        	for(var x in $scope.assetIndicators4product){
        		if($scope.assetIndicators4product[x].key == tmpList[m].assetIndicators){
        			str +="【"+$scope.assetIndicators4product[x].text+"】";
        			numberStr +=$scope.assetIndicators4product[x].key+"";
        			break;
        		}
        	}
        	
        	if(tmpList[m].weight -0<0){
    			str+="*("+tmpList[m].weight+")";
        		numberStr+="*("+tmpList[m].weight+")";
    		}else{
    			str+="*"+tmpList[m].weight;
        		numberStr+="*"+tmpList[m].weight;
    		}
        	
         	if(m == tmpList.length-1){
         		for(var x in $scope.myCalcuTagRight){
            		if($scope.myCalcuTagRight[x].key == tmpList[m].calcuTagRight){
            			str +=$scope.myCalcuTagRight[x].text;
            			numberStr +=$scope.myCalcuTagRight[x].key;
            			break;
            		}
            	}
        	}else{
        		for(var x in $scope.myCalcuTagRight){
            		if($scope.myCalcuTagRight[x].key == tmpList[m].calcuTagRight){
            			str +=$scope.myCalcuTagRight[x].text+"+";
            			numberStr +=$scope.myCalcuTagRight[x].key+"+";
            			break;
            		}
            	}
        	}
        }
        str +="";
        numberStr += "";
		 for(var x in $scope.denominatorList){
	     	if($scope.denominatorList[x].dictId == $scope.indexCalculation.denominator){
	     		 str = "{"+str+"}";
	             numberStr = "{"+numberStr+"}";
	     		 str +="/【";
	             numberStr += "/";
	     		str+=$scope.denominatorList[x].dictName;
	     		numberStr+=$scope.denominatorList[x].dictId;
	     		str += "】";
	     		break;
	     	}
	     }
        $scope.index.descr = str;
        $scope.index.expression = numberStr;
    }
    
    //公共方法：判断运算符号是否匹配
    $scope.judegCalcuTag = function(entity){
    	var calcuTagLeftNum = 0;
    	var calcuTagRightNum = 0;
    	var leftArr = [];
    	var rightArr = [];
    	for(var i=0;i<entity.length;i++){
    		if(entity[i].calcuTagLeft && entity[i].calcuTagLeft == "ABS("){
    			calcuTagLeftNum = calcuTagLeftNum + 1;
    			leftArr.push(i+1);
    		}
    		if(entity[i].calcuTagRight && entity[i].calcuTagRight == ")"){
    			calcuTagRightNum = calcuTagRightNum + 1;
    			rightArr.push(i+1);
    		}
    	}
    	if(calcuTagLeftNum-calcuTagRightNum!=0){
    		return false;
    	}
    	for(var i=leftArr.length-1;i>=0;i--){
    		var indexL = leftArr[i];
    		var flag = false;
    		var tag = 0;
    		for(var j=0;j<rightArr.length;j++){
    			var indexR = rightArr[j];
    			if(indexR-indexL>=0){
    				flag = true;
    				tag = j;
    				break;
    			}
    		}
    		if(!flag){
    			return false;
    		}else{
    			rightArr.splice(tag,1);
    		}
    	}
    	return true;
    }
    
    //公共方法：对运算符号进行限制，只允许平行的绝对值
    $scope.limitCaclTag = function(entity){
    	debugger;
    	var leftArr = [];
    	var rightArr = [];
    	for(var i=0;i<entity.length;i++){
    		if(entity[i].calcuTagLeft && entity[i].calcuTagLeft == "ABS("){
    			leftArr.push(i+1);
    		}
    		if(entity[i].calcuTagRight && entity[i].calcuTagRight == ")"){
    			rightArr.push(i+1);
    		}
    	}
    	for(var i=0;i<leftArr.length-1;i++){
    		var leftArr1 = leftArr[i];
    		var leftArr2 = leftArr[i+1];
    		var rightNum = 0;
    		for(var j=0;j<rightArr.length;j++){
    			var rightArrIndex = rightArr[j];
    			if(rightArrIndex-leftArr1>=0 && rightArrIndex-leftArr2<0) rightNum++;
    		}
    		if(rightNum!=1) return false;
    	}
    	return true;
    }
    
    
    
});