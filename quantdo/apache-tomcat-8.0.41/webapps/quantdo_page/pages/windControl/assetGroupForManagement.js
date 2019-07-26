/**
 * Created by Quantdo on 2016/7/21.
 */
myapp.controller("assetGroupControllerForManagement",function ($scope, $rootScope,$timeout){
	//定义变量
	$scope.pageResults = [];
	$scope.myinitData = [];
	$scope.showDetailSortData_data = [];
	$scope.saveOrUpdateDetailSortEntity = {};
	$scope.saveOrUpdateCombineSortEntity = {};
	$scope.uploadDetailSortEntity = {};
	$scope.uploadDataSource = [];
	$scope.mySessionStorage = {};
	$scope.sortNames = [];
    $scope.sortTypeID = [];
    $scope.masterID = [];
    $scope.query_Disabled = false;
	//保存组合分类的变量
	$scope.saveCombineTabData = [];
	
	// 按钮权限
	$scope.assetGroup_addDetail = isShow("assetGroup_addDetail");
	$scope.assetGroup_addGroup = isShow("assetGroup_addGroup");
	$scope.assetGroup_import = isShow("assetGroup_import");
	$scope.assetGroup_delete = isShow("assetGroup_delete");
	$scope.assetGroup_detail = isShow("assetGroup_detail");
	$scope.assetGroup_update = isShow("assetGroup_update");
	$scope.assetGroup_query = isShow("assetGroup_query");
	
	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$("#hasGroupType_table tbody").empty();
	
	 //初始化组合分类表格选项下拉框
     $scope.combineFlag = [{text:"且"},{text:"排除"}];
	 //类型
	 $scope.assetContractType = clearConstant.assetContractType2;
	 $scope.detailSort_isDisabled = false;
	 $scope.combineSort_isDisabled = false;
	 //上传页面，点退出和X时调用该方法，清楚临时上边表中的数据
	    $scope.clearUpLoadTmpEntity = function(){
	        deleteRiskDataUpLoadTmpEntity(function(result){});
	    };
    //点击退出按钮所触发的操作
    $scope.exitModal = function(id){
        $("#" + id).modal("hide");
        if(id == "uploadDetailSortDataModal"){
            $scope.clearUpLoadTmpEntity();
        }
    };
	 
	 
	//初始化页面下拉框信息
    $scope.assetGroupEntity = [{brokerID:""},{dataSourceID:""},{capitalTypeID:""},{sortTypeID:""}];
    //定义modal框标题变量
    $scope.myModalTitle = {};
    $scope.myModalButton = {};
	//获取主页面所有下拉列表信息
    getSortScreenPullDownData("",function(result){
        $scope.brokerIDList = result.brokerIDList;
        $scope.assetGroupEntity.brokerID = $scope.brokerIDList[0].brokerID;

        $scope.dataSourceList = result.dataSourceList;
        $scope.assetGroupEntity.dataSourceID = $scope.dataSourceList[0].dataSourceID;

        $scope.capitalTypeList = result.capitalTypeList;
        $scope.assetGroupEntity.capitalTypeID = $scope.capitalTypeList[0].capitalTypeID;

        $scope.sortTypeList = result.sortTypeList;
        $scope.assetGroupEntity.sortTypeID = $scope.sortTypeList[0].sortTypeID;

        $scope.$apply();
    });
	
    //进入页面，初始化表格数据的公用函数
    $scope.initMainTable = function(entity){
    	 var mytable_asseGroup = document.getElementById("mytable_asseGroup");
         var outerContainer_asseGroup = document.getElementById("outerContainer_asseGroup");
         outerContainer_asseGroup.removeChild(mytable_asseGroup);
         var newContainer_asseGroup = document.createElement("div");
         newContainer_asseGroup.id = "mytable_asseGroup";
         newContainer_asseGroup.innerHTML = "<table id='assetGroup_table' class='cell-border stripe' cellspacing='0' width='100%'>" +
         		"<thead>"+
					"<tr>"+
						"<th>序号</th>"+
						"<th>分类名称</th>"+
						"<th>资产大类ID</th>"+
						"<th>资产大类</th>"+
						"<th>分类方式ID</th>"+
						"<th>分类方式</th>"+
						"<th>数据来源ID</th>"+
						"<th>数据来源</th>"+
						"<th>所属机构ID</th>"+
						"<th>所属机构</th>"+
						"<th>操作</th>"+
					"</tr>"+
				"</thead>"+
			"</table>";
         outerContainer_asseGroup.appendChild(newContainer_asseGroup);
         
    	 var myinitData = [];
    	 getTmpProductRiskSortQuery(entity,function(result){
    		if(result!=null&&result!=undefined&&result.length>0){
    			for(var i=0;i<result.length;i++){
    				 var entity = result[i];
    				 var cacl = "";
    				 if(entity.dataSourceID==1 && $scope.assetGroup_detail){
    					 cacl = '<a class="detail-row" data-toggle="modal" style="cursor: pointer" data-target="#showDetailSortDataModel">明细</a>'
    				 }
    				 //如果数据来源是自定义，并且是明细分类
    				 else if(entity.dataSourceID==4 && entity.sortTypeID==1){
    					 if($scope.assetGroup_detail){
    						 cacl = cacl.concat('<a class="detail-row" data-toggle="modal" style="cursor: pointer" data-target="#showDetailSortDataModel">明细</a>');
    					 }if($scope.assetGroup_update){
    						 cacl = cacl.concat('<a class="update-row" data-toggle="modal" style="cursor: pointer" data-target="#addOrUpdateDetailSortDataModal">修改</a>');
    					 }if($scope.assetGroup_delete){
    						 cacl = cacl.concat('<a class="delete-row" style="cursor: pointer" >删除</a>');
    					 }
//    					 cacl = '<a class="detailButton" data-toggle="modal" style="cursor: pointer" data-target="#showDetailSortDataModel">明细</a>'+
//					        '<a class="delete-row" data-toggle="modal" style="cursor: pointer" data-target="#addOrUpdateDetailSortDataModal">修改</a>'+
//					        '<a class="deleteButton" style="cursor: pointer" >删除</a>';
    				 }
    				 //如果数据来源是自定义，并且是组合分类
    				 else if(entity.dataSourceID==4 && entity.sortTypeID==2){
    					 if($scope.assetGroup_detail){
    						 cacl = cacl.concat('<a class="detail-row" data-toggle="modal" style="cursor: pointer" data-target="#showDetailSortDataModel">明细</a>');
    					 }if($scope.assetGroup_update){
    						 cacl = cacl.concat('<a class="update-row" data-toggle="modal" style="cursor: pointer" data-target="#addOrUpdateCombineSortDataModal">修改</a>');
    					 }if($scope.assetGroup_delete){
    						 cacl = cacl.concat('<a class="delete-row" style="cursor: pointer" >删除</a>');
    					 }
//    					 cacl = '<a class="detailButton" data-toggle="modal" style="cursor: pointer" data-target="#showDetailSortDataModel">明细</a>'+
//					        '<a class="updateButton" data-toggle="modal" style="cursor: pointer" data-target="#addOrUpdateCombineSortDataModal">修改</a>'+
//					        '<a class="deleteButton" style="cursor: pointer" >删除</a>';
    				 }
    				 
    				 else{
    					 if($scope.assetGroup_detail){
    						 cacl = cacl.concat('<a class="detail-row" data-toggle="modal" style="cursor: pointer" data-target="#showDetailSortDataModel">明细</a>');
    					 }if($scope.assetGroup_delete){
    						 cacl = cacl.concat('<a class="delete-row" style="cursor: pointer" >删除</a>');
    					 }
//    					 cacl = '<a class="detailButton" data-toggle="modal" style="cursor: pointer" data-target="#showDetailSortDataModel">明细</a>'+
//					        '<a class="deleteButton" style="cursor: pointer" >删除</a>';
    				 }
					 var temp = {
							 "index": i+1,
							 "sortName": entity.sortName,
			  	             "capitalTypeID": entity.capitalTypeID,
			  	             "capitalTypeName": entity.capitalTypeName,
			  	             "sortTypeID": entity.sortTypeID,
			  	             "sortTypeName": entity.sortTypeName,
			  	             "dataSourceID": entity.dataSourceID,
			  	             "dataSourceName": entity.dataSourceName,
			  	             "brokerID": entity.brokerID,
			  	             "brokerName": entity.brokerName,
			  	             "cacl": cacl
					 };
					 myinitData.push(temp); 
    			}
    		}
         $scope.assetGroup_table_table = $('#assetGroup_table').DataTable({
	    	"data":myinitData,
	    
	        "columns": [
	            {
	            	"data": "index", 
		            "class":"center",
			        "width":"5%"
	            },
	            
	            {
		              "data": "sortName", 
		              "class":"center",
			          "width":"9%"
	            },
	            
	            {
		              "data": "capitalTypeID", 
		              "class":"center",
			          "width":"9%",
			         "visible": false
	            },
	            
	            {
		              "data": "capitalTypeName", 
		              "class":"center",
			          "width":"9%"
	            },

	            {
		              "data": "sortTypeID",
		              "class":"center",
		              "width":"9%",
				      "visible": false
	            },
	            
	            {
		              "data": "sortTypeName",
		              "class":"center",
		              "width":"9%"
	            },
	           
	            {
		              "data": "dataSourceID",
		              "class":"center",
		              "width":"9%",
				      "visible": false
	            },
	            
	            {
		              "data": "dataSourceName",
		              "class":"center",
		              "width":"9%"
	            },
	            
	            {
		              "data": "brokerID",
		              "class":"center",
		              "width":"9%",
				      "visible": false
	            },
	            
	            {
		              "data": "brokerName",
		              "class":"center",
		              "width":"9%"
	            },
	            
	            {
	                  "data": "cacl",
		              "class":"center",
		              "width":"9%"
		        }
	        ],
	        "order": [[0, 'asc']],
	        "dom": 'rt<"bottom"iplB>',
	        "buttons": [],
	        "destroy":true,
	        "retrieve": true
	    });
     });
   }
    //初始化页面
    $scope.initMainTable({});
    
	//查询按钮
    $scope.assetQuery = function(entity){
    	$scope.query_Disabled = true;
    	setTimeout(function(){
    		$scope.query_Disabled = false;
    		$scope.$apply();
		},500)
        var queryEntity = {};
        queryEntity.brokerID = entity.brokerID;
        queryEntity.capitalTypeID = entity.capitalTypeID;
        queryEntity.dataSourceID = entity.dataSourceID;
        queryEntity.sortName = entity.sortName;
        queryEntity.sortTypeID = entity.sortTypeID;
        
        
        var mytable_asseGroup = document.getElementById("mytable_asseGroup");
        var outerContainer_asseGroup = document.getElementById("outerContainer_asseGroup");
        outerContainer_asseGroup.removeChild(mytable_asseGroup);
        var newContainer_asseGroup = document.createElement("div");
        newContainer_asseGroup.id = "mytable_asseGroup";
        newContainer_asseGroup.innerHTML = "<table id='assetGroup_table' class='cell-border stripe' cellspacing='0' width='100%'>" +
        		"<thead>"+
					"<tr>"+
						"<th>序号</th>"+
						"<th>分类名称</th>"+
						"<th>市场ID</th>"+
						"<th>市场</th>"+
						"<th>分类方式ID</th>"+
						"<th>分类方式</th>"+
						"<th>数据来源ID</th>"+
						"<th>数据来源</th>"+
						"<th>所属机构ID</th>"+
						"<th>所属机构</th>"+
						"<th>操作</th>"+
					"</tr>"+
				"</thead>"+
			"</table>";
        outerContainer_asseGroup.appendChild(newContainer_asseGroup);
        
        
        //$('#assetGroup_table').DataTable().destroy();
        $scope.initMainTable(queryEntity);
    }
    
    /*******************点击每一行的明细，删除 begin***********************/
    //点击删除按钮
    $("body").delegate("#assetGroup_table td .delete-row","click",function(){
        var table = $("#assetGroup_table").DataTable();
        var mytr = $(this).parents('tr');
        var tempArr = table.row(mytr).data();
        var detailEntity = {};
        detailEntity.sortName = tempArr.sortName;
        detailEntity.capitalTypeID = tempArr.capitalTypeID;
        detailEntity.sortTypeID = tempArr.sortTypeID;
        detailEntity.dataSourceID = tempArr.dataSourceID;
        detailEntity.brokerID = tempArr.brokerID;
    	layer.confirm("确定删除该条信息？", {icon: 3}, function (count) {
            deleteTmpProductRiskSortQuery(detailEntity,function(errCode,errMsg){
                if(errCode == 0){
                    layer.msg("删除成功", {icon: 1});
                    $('#assetGroup_table').DataTable().destroy();
                    $scope.initMainTable({});
                }else if(errCode>0){
                	layer.alert(errMsg); 
                }
                else{
                    layer.msg("删除失败", {icon: 2});
                }
            })
        })
    });
    
    //点击明细按钮,初始化明细展示Modal中的数据
    $("body").delegate("#assetGroup_table td .detail-row","click",function(){
    	
        var table = $("#assetGroup_table").DataTable();
        var mytr = $(this).parents('tr');
        var tempArr = table.row(mytr).data();
	
        var detailEntity = {};
        detailEntity.sortName = tempArr.sortName;
        detailEntity.capitalTypeID = tempArr.capitalTypeID;
        detailEntity.sortTypeID = tempArr.sortTypeID;
        detailEntity.dataSourceID = tempArr.dataSourceID;
        detailEntity.brokerID = tempArr.brokerID;
        
        if(detailEntity.sortTypeID==1){
        	$scope.myModalTitle.showDetailModal = "明细分类:["+tempArr.sortName+"] 合约明细";
        	$scope.$apply();
        }else if(detailEntity.sortTypeID==2){
        	$scope.myModalTitle.showDetailModal = "组合分类:["+tempArr.sortName+"] 合约明细";
        	$scope.$apply();
        }else {
        	$scope.myModalTitle.showDetailModal = "动态分类:["+tempArr.sortName+"] 合约明细";
        	$scope.$apply();
        }
        
        if(detailEntity.sortTypeID!=2){
            $('#showDetailSortData_table').DataTable().destroy();
            toachDetailButton(detailEntity,function(result){
            	 var myShowDetailData = [];
            	if(result!=null&&result!=undefined&&result.length>0){
            		for(var i=0;i<result.length;i++){
            			var entity = result[i];
            			 var temp = {
    							 "index": i+1,
    							 "instrumenID": entity.instrumenID,
    			  	             "instrumenName": entity.info,
    			  	             "exchangeID": entity.exchangeID
    					 };
    					 myShowDetailData.push(temp); 
            		}
            	}
    	    	 $scope.showDetailSortData_table_table = $('#showDetailSortData_table').DataTable({
    	 	    	"data":myShowDetailData,
    	 	    
    	 	        "columns": [
    	 	            {
    	 	            	"data": "index", 
    	 		            "class":"center",
    	 			        "width":"10%"
    	 	            },
    	 	            
    	 	            {
    	 		              "data": "instrumenID", 
    	 		              "class":"center",
    	 			          "width":"30%"
    	 	            },
    	 	            
    	 	            {
    	 		              "data": "instrumenName", 
    	 		              "class":"center",
    	 			          "width":"30%",
    	 	            },
    	 	            
    	 	            {
    	 		              "data": "exchangeID", 
    	 		              "class":"center",
    	 			          "width":"30%"
    	 	            }
    	 	        ],
    	 	        "order": [[0, 'asc']],
    	 	       "dom": 'rt<"bottom"iplB>',
    	 	       "buttons":[],
    	 	        "destroy":true,
    		        "retrieve": true
            });
        });
        }else{
            $('#showDetailSortData_table').DataTable().destroy();
            toachCombineRealDetailButton(detailEntity,function(result){
            	 var myShowDetailData = [];
            	if(result!=null&&result!=undefined&&result.length>0){
            		for(var i=0;i<result.length;i++){
            			var entity = result[i];
            			 var temp = {
    							 "index": i+1,
    							 "instrumenID": entity.instrumenID,
    			  	             "instrumenName": entity.info,
    			  	             "exchangeID": entity.exchangeID
    					 };
    					 myShowDetailData.push(temp); 
            		}
            	}
    	    	 $scope.showDetailSortData_table_table = $('#showDetailSortData_table').DataTable({
    	 	    	"data":myShowDetailData,
    	 	    
    	 	        "columns": [
    	 	            {
    	 	            	"data": "index", 
    	 		            "class":"center",
    	 			        "width":"10%"
    	 	            },
    	 	            
    	 	            {
    	 		              "data": "instrumenID", 
    	 		              "class":"center",
    	 			          "width":"30%"
    	 	            },
    	 	            
    	 	            {
    	 		              "data": "instrumenName", 
    	 		              "class":"center",
    	 			          "width":"30%",
    	 	            },
    	 	            
    	 	            {
    	 		              "data": "exchangeID", 
    	 		              "class":"center",
    	 			          "width":"30%"
    	 	            }
    	 	        ],
    	 	        "order": [[0, 'asc']],
    	 	       "dom": 'rt<"bottom"iplB>',
    	 	       "buttons":[],
    	 	        "destroy":true,
    		        "retrieve": true
            });
          });
        }
        $timeout(function(){
        	 		$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
        },500);
        $scope.$apply();
    });
    /*******************点击每一行的明细，删除 end********************/
    /*******************点击每一行的 修改 begin*********************/
    //点击主页面修改按钮，
    $("body").delegate("#assetGroup_table td .update-row","click",function(){
    	var table = $("#assetGroup_table").DataTable();
        var mytr = $(this).parents('tr');
        var tempArr = table.row(mytr).data();
        //如果是明细分类
        if(tempArr.sortTypeID==1){
        	//执行明细分类的初始化
        	$scope.ininDetailModalWhenUpdate(tempArr);
        }
        //如果是组合分类
        if(tempArr.sortTypeID==2){
        	//执行组合分类的初始化
        	$scope.initCombineModalWhenUpdate(tempArr);
        }
        
    });
    
    //修改时，明细分类的初始化
    $scope.ininDetailModalWhenUpdate = function(entity){
    	$scope.myModalTitle.showAddOrUpdateDetailSortModal = "修改明细分类："+entity.sortName;
    	$scope.myModalButton.saveOrUpdate = "修改";
    	$scope.saveOrUpdateDetailSortEntity.sortName = entity.sortName;
    	$scope.saveOrUpdateDetailSortEntity.capitalTypeID = entity.capitalTypeID;
    	$scope.queryDetailByID = "";
    	$scope.detailSort_isDisabled = true;
    	$scope.$apply();
    	//获得明细数据
    	toachDetailButton(entity,function(result){
       	 var myShowDetailData = [];
       	if(result!=null&&result!=undefined&&result.length>0){
       		for(var i=0;i<result.length;i++){
       			var entity = result[i];
       			 var temp = {
							 "instrumenID": entity.instrumenID,
			  	             "instrumenName": entity.info,
			  	             "exchangeID": entity.exchangeID
					 };
					 myShowDetailData.push(temp); 
       		}
       	}
       	$scope.mySessionStorage.sourceMasterID = result[0].id+"";
       	$scope.mySessionStorage.brokerID = result[0].brokerID;
       	
       	$scope.intAddOrUpdateDetailSortDataModalTable([],myShowDetailData);
    	});
    }
    
    //修改时组合分类的初始化
    $scope.initCombineModalWhenUpdate = function(entity){
    	$scope.myModalTitle.showAddOrUpdateCombineSortModal = "修改组合分类："+entity.sortName;
    	$scope.myModalButton.saveOrUpdate = "修改";
    	$scope.saveOrUpdateCombineSortEntity.sortName = entity.sortName;
    	$scope.saveOrUpdateCombineSortEntity.capitalTypeID = entity.capitalTypeID;
    	$scope.combineSort_isDisabled = true;
    	$scope.saveCombineTabData = [];
    	$scope.$apply();
    	//获得组合分类的明细
        toachDetailButtonForCombine(entity,function(result){
            var needAddGroup_dataset = [];
            for(var i=0;i<result.length;i++){
                var mydata = "";
                var tableSave = [];
            	for(var j=0;j<result[i].length;j++){
                    var tableHas = {};
                    mydata = mydata + result[i][j].instrumenID + "【"+result[i][j].info+"】";
                   /* sessionStorage.sourceMasterID = result[i][j].id;*/
                    $scope.mySessionStorage.sourceMasterID = result[i][j].id;
                   	$scope.mySessionStorage.brokerID = result[i][j].brokerID;
                    tableHas.exchangeID = result[i][j].exchangeID;
                    tableHas.instrumenID = result[i][j].instrumenID;
                    tableHas.info = result[i][j].info;
                    tableHas.sourceSortTypeID = result[i][j].sourceSortTypeID;
                    tableHas.sourceMasterID = result[i][j].sourceMasterID;
                    tableSave.push(tableHas);
                }
            	$scope.saveCombineTabData.push(tableSave);
            	$scope.$apply();
                needAddGroup_dataset.push(
						                		{
							                		exchangeID:i+1,
							                		info:mydata,
							                		cacl:"<a style='cursor:pointer;' class='delRow'>删除</a>"
						                		}
                						);
            	$scope.getSortName($scope.saveOrUpdateCombineSortEntity.capitalTypeID);
            	var addOrUpdateCombineSortDataModal_leftTable_data = 
                	[
						{exchangeID:"1",instrumenID:"<select id = 'typeFlagID_1' class='ass_typeFlag hidden'><option value=''></option></select>", info:"<select id = 'typeNameID_1' class='ass_typeName'></select>", cacl:""},
						{exchangeID:"<a style='cursor:pointer;' class='addRow'>+</a>",instrumenID:"", info:"", cacl:""}
                	 ];
            	$scope.intAddOrUpdateCombineSortDataModalTable(addOrUpdateCombineSortDataModal_leftTable_data,needAddGroup_dataset);
                $scope.$apply();
            }
        });
    }
    /*******************点击每一行的 修改 end***********************/
    
    /*******************点击增加明细分类 begin***********************/
    //点击增加明细按钮时，绘测Modal中左边表格和右边表格的共有方法
    $scope.intAddOrUpdateDetailSortDataModalTable = function(arrLeft,arrRight){
    	var temp_myfindByIDInstrumentData_left = [];
    	var temp_myfindByIDInstrumentData_right = [];
    	if(arrLeft!=null&&arrLeft!=undefined){
    		for(var i=0;i<arrLeft.length;i++){
    			var entity = arrLeft[i];
    			 var temp = {
						 "index": i+1,
						 "instrumenID": entity.instrumenID,
		  	             "instrumenName": entity.instrumenName,
		  	             "exchangeID": entity.exchangeID
				 };
    			 temp_myfindByIDInstrumentData_left.push(temp); 
    		}
    	}
    	if(arrRight!=null&&arrRight!=undefined){
    		for(var i=0;i<arrRight.length;i++){
    			var entity = arrRight[i];
    			 var temp = {
						 "index": i+1,
						 "instrumenID": entity.instrumenID,
		  	             "instrumenName": entity.instrumenName,
		  	             "exchangeID": entity.exchangeID
				 };
    			 temp_myfindByIDInstrumentData_right.push(temp); 
    		}
    	}
    	
    	//初始化左边表格
    	$('#unchoiceType_table').DataTable().destroy();
    	$scope.unchoiceType_table_table = $('#unchoiceType_table').DataTable({
 	    	"data":temp_myfindByIDInstrumentData_left,
 	    
 	        "columns": [
 	            {
 	            	"data": "index", 
 		            "class":"center",
 			        "width":"10%"
 	            },
 	            
 	            {
 		              "data": "instrumenID", 
 		              "class":"center",
 			          "width":"30%"
 	            },
 	            
 	            {
 		              "data": "instrumenName", 
 		              "class":"center",
 			          "width":"30%",
 	            },
 	            
 	            {
 		              "data": "exchangeID", 
 		              "class":"center",
 			          "width":"30%"
 	            }
 	        ],
 	        "order": [[0, 'asc']],
 	       "dom": 'rt<"bottom"iplB>',
 	       "buttons":[],
 	        "destroy":true,
	        "retrieve": true,
	        "adjust":true
        });
        //初始化右边表格
    	$('#choicedType_table').DataTable().destroy();
    	$scope.choicedType_table_table = $('#choicedType_table').DataTable({
 	    	"data":temp_myfindByIDInstrumentData_right,
 	    
 	        "columns": [
 	            {
 	            	"data": "index", 
 		            "class":"center",
 			        "width":"10%"
 	            },
 	            
 	            {
 		              "data": "instrumenID", 
 		              "class":"center",
 			          "width":"30%"
 	            },
 	            
 	            {
 		              "data": "instrumenName", 
 		              "class":"center",
 			          "width":"30%",
 	            },
 	            
 	            {
 		              "data": "exchangeID", 
 		              "class":"center",
 			          "width":"30%"
 	            }
 	        ],
 	        "order": [[0, 'asc']],
 	       "dom": 'rt<"bottom"iplB>',
 	       "buttons":[],
 	        "destroy":true,
	        "retrieve": true,
	        "adjust":true
        });
    	$timeout(function(){
    		$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    	},700);
    	
    }
	//点击增加明细按钮
    $scope.initAddDetailSortModal = function(){
    	$scope.myModalTitle.showAddOrUpdateDetailSortModal = "增加明细分类";
    	$scope.myModalButton.saveOrUpdate = "保存";
    	$scope.detailSort_isDisabled = false;
    	$scope.saveOrUpdateDetailSortEntity.sortName = "";
    	$scope.saveOrUpdateDetailSortEntity.capitalTypeID = "2";
    	$scope.queryDetailByID = "";
    	$scope.mySessionStorage.sourceMasterID = "";
       	$scope.mySessionStorage.brokerID = "";
    	$scope.intAddOrUpdateDetailSortDataModalTable([],[]);
    	
    	// 列对齐
//        $scope.unchoiceType_table_table.columns.adjust().draw();
//        $scope.choicedType_table_table.columns.adjust().draw();
        $timeout(function() {
            $("#addOrUpdateDetailSortDataModal").modal("show");
        },500);

   }
    
  //增加明细分类，当资产大类的下拉框内容改变时，清空表格
    $scope.changeSelect = function(){
    	$scope.queryDetailByID = "";
    	$scope.intAddOrUpdateDetailSortDataModalTable([],[]);
    }
    
    //当搜索框内容长度大于4时执行以下操作
    $scope.findByID = function(entity){
    	debugger;
        if(entity.capitalTypeID == "1"||entity.capitalTypeID == "3"||entity.capitalTypeID == "4"){
            $("#zqinformation").removeClass("hidden");
        }
        if(entity.capitalTypeID == "2"||entity.capitalTypeID == "5"||entity.capitalTypeID == "7"||entity.capitalTypeID == "8"||entity.capitalTypeID == "9"||entity.capitalTypeID == "a"){
            $("#qhinformation").removeClass("hidden");
        }
        if($scope.queryDetailByID.length>=4 && entity.capitalTypeID == "1" || $scope.queryDetailByID.length>=1 && entity.capitalTypeID == "2"|| $scope.queryDetailByID.length>=1 && entity.capitalTypeID == "5"
        	||$scope.queryDetailByID.length>=4 && entity.capitalTypeID == "3"||$scope.queryDetailByID.length>=4 && entity.capitalTypeID == "4"
        	|| $scope.queryDetailByID.length>=1 && entity.capitalTypeID == "7"|| $scope.queryDetailByID.length>=1 && entity.capitalTypeID == "8"
        	|| $scope.queryDetailByID.length>=1 && entity.capitalTypeID == "9"|| $scope.queryDetailByID.length>=1 && entity.capitalTypeID == "a"){
            if(!$("#zqinformation").hasClass("hidden")){
                $("#zqinformation").addClass("hidden");
            }
            if(!$("#qhinformation").hasClass("hidden")){
                $("#qhinformation").addClass("hidden");
            }
            var myqueryEntity = {};
            myqueryEntity.capitalTypeID = entity.capitalTypeID;
            myqueryEntity.instrumentID = $scope.queryDetailByID;
            findOperInstrumentByinstrumenID(myqueryEntity,function(result){
            	var myfindByIDInstrumentData_left = [];
                if(result != undefined&&result!=null){
                	for(var i=0;i<result.length;i++){
                	     var entity = result[i];
                         var temp = {
      							 "index": i+1,
      							 "instrumenID": entity.instrumenID,
      			  	             "instrumenName": entity.info,
      			  	             "exchangeID": entity.exchangeID
      				    };
                         myfindByIDInstrumentData_left.push(temp);	
                	}
                }
                
                $('#unchoiceType_table').DataTable().clear().draw();
                $('#unchoiceType_table').DataTable().rows.add(myfindByIDInstrumentData_left).draw();
            })
        }
    };
    //点击左边table中的某一行的时候，给改行设置颜色
    $("body").delegate("#unchoiceType_table tr","click",function(){
        //为选中的行设置选中色
    	var tr = $(this).closest('tr');
    	tr.toggleClass('assGroupSelected');
    });
    //点击右边table中的某一行的时候，给改行设置颜色
    $("body").delegate("#choicedType_table tr","click",function(){
        //为选中的行设置选中色
    	var tr = $(this).closest('tr');
    	tr.toggleClass('assGroupSelected');
    });
    //双击左边表格中的某一行
    $("body").delegate("#unchoiceType_table tr","dblclick",function(){
    	
    	var myfindByIDInstrumentData_left = [];
		var myfindByIDInstrumentData_right = [];
		for(var i=0;i<$("#choicedType_table").DataTable().context[0].aoData.length;i++){
			var temp = $("#choicedType_table").DataTable().context[0].aoData[i]._aData;
			myfindByIDInstrumentData_right.push(temp);
		}
    	 
    	//获得被选中的哪一行的数据
		var tr = $(this).closest('tr');
    	var tempArr =  $("#unchoiceType_table").DataTable().row(tr).data();
        for(var i=0;i<$("#unchoiceType_table").DataTable().context[0].aoData.length;i++){
        	var temp2 = $("#unchoiceType_table").DataTable().context[0].aoData[i]._aData;
        	if(tempArr.instrumenID==temp2.instrumenID&&tempArr.exchangeID==temp2.exchangeID){
    			for(var j=0;j<myfindByIDInstrumentData_right.length;j++){
        			if(myfindByIDInstrumentData_right[j].instrumenID==temp2.instrumenID&&myfindByIDInstrumentData_right[j].exchangeID==temp2.exchangeID){
        				layer.alert("不能添加重复的合约代码");
        	            return false;
        		     }
    		    }
    			myfindByIDInstrumentData_right.push(temp2);
        	}else{
        		myfindByIDInstrumentData_left.push(temp2);
        	}
        }
		$scope.intAddOrUpdateDetailSortDataModalTable(myfindByIDInstrumentData_left,myfindByIDInstrumentData_right);
    });
    
    //双击右边表格中的某一行
    $("body").delegate("#choicedType_table tr","dblclick",function(){
    	var myfindByIDInstrumentData_left = [];
		var myfindByIDInstrumentData_right = [];
		for(var i=0;i<$("#unchoiceType_table").DataTable().context[0].aoData.length;i++){
			var temp = $("#unchoiceType_table").DataTable().context[0].aoData[i]._aData;
			myfindByIDInstrumentData_left.push(temp);
		}
    	 
    	//获得被选中的哪一行的数据
		var tr = $(this).closest('tr');
    	var tempArr =  $("#choicedType_table").DataTable().row(tr).data();
        for(var i=0;i<$("#choicedType_table").DataTable().context[0].aoData.length;i++){
        	var temp2 = $("#choicedType_table").DataTable().context[0].aoData[i]._aData;
        	if(tempArr.instrumenID==temp2.instrumenID&&tempArr.exchangeID==temp2.exchangeID){
        		
        		var b = true;
        		for(var j=0;j<myfindByIDInstrumentData_left.length;j++){
        			if(myfindByIDInstrumentData_left[j].instrumenID==temp2.instrumenID&&myfindByIDInstrumentData_left[j].exchangeID==temp2.exchangeID){
        				b = false;
        				break;
        			}
    		    }
        		if(b){
        			myfindByIDInstrumentData_left.push(temp2);
        		}
        		
        	}else{
        		myfindByIDInstrumentData_right.push(temp2);
        	}
        }
		$scope.intAddOrUpdateDetailSortDataModalTable(myfindByIDInstrumentData_left,myfindByIDInstrumentData_right);
   });
    
    //点击》按钮
    $scope.addAlltoChoiced = function(){
    	var myfindByIDInstrumentData_right = [];
		for(var i=0;i<$("#choicedType_table").DataTable().context[0].aoData.length;i++){
			var temp = $("#choicedType_table").DataTable().context[0].aoData[i]._aData;
			myfindByIDInstrumentData_right.push(temp);
		}
    	for(var i=0;i<$("#unchoiceType_table").DataTable().context[0].aoData.length;i++){
    		var temp = $("#unchoiceType_table").DataTable().context[0].aoData[i]._aData;
    		for(var j=0;j<myfindByIDInstrumentData_right.length;j++){
    			if(myfindByIDInstrumentData_right[j].instrumenID==temp.instrumenID&&myfindByIDInstrumentData_right[j].exchangeID==temp.exchangeID){
    				layer.alert("不能添加重复的合约代码");
    	            return false;
    			}
    		}
    		myfindByIDInstrumentData_right.push(temp);
    	}
    	$scope.intAddOrUpdateDetailSortDataModalTable([],myfindByIDInstrumentData_right);
    }
   //点击《按钮
    $scope.removeAlltoChoiced = function(){
    	var myfindByIDInstrumentData_left = [];
		for(var i=0;i<$("#unchoiceType_table").DataTable().context[0].aoData.length;i++){
			var temp = $("#unchoiceType_table").DataTable().context[0].aoData[i]._aData;
			myfindByIDInstrumentData_left.push(temp);
		}
    	for(var i=0;i<$("#choicedType_table").DataTable().context[0].aoData.length;i++){
    		var temp = $("#choicedType_table").DataTable().context[0].aoData[i]._aData;
    		var b = true;
    		for(var j=0;j<myfindByIDInstrumentData_left.length;j++){
    			if(myfindByIDInstrumentData_left[j].instrumenID==temp.instrumenID&&myfindByIDInstrumentData_left[j].exchangeID==temp.exchangeID){
    				b = false;
    	            break;
    			}
    		}
    		if(b){
    			myfindByIDInstrumentData_left.push(temp);
    		}
    	}
    	$scope.intAddOrUpdateDetailSortDataModalTable(myfindByIDInstrumentData_left,[]);
    }
    //点击>按钮
    $scope.addTochoiced = function(){
    	var myfindByIDInstrumentData_right = [];
		for(var i=0;i<$("#choicedType_table").DataTable().context[0].aoData.length;i++){
			var temp = $("#choicedType_table").DataTable().context[0].aoData[i]._aData;
			myfindByIDInstrumentData_right.push(temp);
		}
		var myfindByIDInstrumentData_left = [];
		for(var i=0;i<$("#unchoiceType_table").DataTable().context[0].aoData.length;i++){
			var temp = $("#unchoiceType_table").DataTable().context[0].aoData[i]._aData;
			myfindByIDInstrumentData_left.push(temp);
		}
    	
    	var table = $("#unchoiceType_table").DataTable();
    	var entity = table.rows('.assGroupSelected').data();
    	for(var i=0;i<entity.length;i++){
    		
    		for(var j=0;j<myfindByIDInstrumentData_right.length;j++){
    			if(myfindByIDInstrumentData_right[j].instrumenID==entity[i].instrumenID&&myfindByIDInstrumentData_right[j].exchangeID==entity[i].exchangeID){
    				layer.alert("不能添加重复的合约代码");
    	            return false;
    			}
    		}
    		
    		myfindByIDInstrumentData_right.push(entity[i]);
    		
    		for(var j=0;j<myfindByIDInstrumentData_left.length;j++){
    			if(entity[i].instrumenID==myfindByIDInstrumentData_left[j].instrumenID&&entity[i].exchangeID==myfindByIDInstrumentData_left[j].exchangeID){
    				myfindByIDInstrumentData_left.splice(j,1);
    			}
    		}
    	}
    	$scope.intAddOrUpdateDetailSortDataModalTable(myfindByIDInstrumentData_left,myfindByIDInstrumentData_right);
    }
    //点击<按钮
    $scope.removeFromChoiced = function(){
    	var myfindByIDInstrumentData_right = [];
		for(var i=0;i<$("#choicedType_table").DataTable().context[0].aoData.length;i++){
			var temp = $("#choicedType_table").DataTable().context[0].aoData[i]._aData;
			myfindByIDInstrumentData_right.push(temp);
		}
		var myfindByIDInstrumentData_left = [];
		for(var i=0;i<$("#unchoiceType_table").DataTable().context[0].aoData.length;i++){
			var temp = $("#unchoiceType_table").DataTable().context[0].aoData[i]._aData;
			myfindByIDInstrumentData_left.push(temp);
		}
    	
    	var table = $("#choicedType_table").DataTable();
    	var entity = table.rows('.assGroupSelected').data();
    	for(var i=0;i<entity.length;i++){
    		
    		var b = true;
    		for(var j=0;j<myfindByIDInstrumentData_left.length;j++){
    			if(myfindByIDInstrumentData_left[j].instrumenID==entity[i].instrumenID&&myfindByIDInstrumentData_left[j].exchangeID==entity[i].exchangeID){
    				b = false;
    				break;
    			}
		    }
    		if(b){
    			myfindByIDInstrumentData_left.push(entity[i]);
    		}
    		
    		for(var j=0;j<myfindByIDInstrumentData_right.length;j++){
    			if(entity[i].instrumenID==myfindByIDInstrumentData_right[j].instrumenID&&entity[i].exchangeID==myfindByIDInstrumentData_right[j].exchangeID){
    				myfindByIDInstrumentData_right.splice(j,1);
    			}
    		}
    	}
    	$scope.intAddOrUpdateDetailSortDataModalTable(myfindByIDInstrumentData_left,myfindByIDInstrumentData_right);
    }
    
    //点击明细分类的保存按钮
    $scope.saveOrUpdateDetailSortData = function(entity){
    	var saveEntity = {};
    	saveEntity.id = $scope.mySessionStorage.sourceMasterID;
    	saveEntity.brokerID = $scope.mySessionStorage.brokerID;
        saveEntity.sortName = entity.sortName;
        saveEntity.capitalTypeID = entity.capitalTypeID;
        var contentDataList = [];
        for(var i=0;i<$("#choicedType_table").DataTable().context[0].aoData.length;i++){
            var contentData = {};
            contentData.instrumenID = $("#choicedType_table").DataTable().context[0].aoData[i]._aData.instrumenID;
            contentData.info = $("#choicedType_table").DataTable().context[0].aoData[i]._aData.instrumentName;
            contentData.exchangeID = $("#choicedType_table").DataTable().context[0].aoData[i]._aData.exchangeID;
            contentDataList.push(contentData);
        }
        saveEntity.contentDataList = contentDataList;

        if(saveEntity.sortName == undefined || saveEntity.sortName == ""){
            layer.alert("分类名称不能为空");
            return false;
        }
        if(saveEntity.sortName.length>200){
        	 layer.alert("分类名称最多允许由200个字符组成");
             return false;
        }
        else if($("#choicedType_table").DataTable().context[0].aoData.length<1){
            layer.alert("至少选择一条合约");
            return false;
        }
        for(var i=0;i<saveEntity.contentDataList.length;i++){
        	for(var j=i+1;j<saveEntity.contentDataList.length;j++){
        		if(saveEntity.contentDataList[i].instrumenID==saveEntity.contentDataList[j].instrumenID){
        			 layer.alert("合约不能重复");
        	            return false;
        		}
        	}
        }
        layer.load(2, {
    	    shade: [0.5,'#fff'] //0.1透明度的白色背景
    	});
        saveDetailSortData(saveEntity,function(errCode,msg){
            if(errCode == 0){
            	if(saveEntity.id==""||saveEntity.id==null||saveEntity.id==undefined){
            		layer.msg("新增成功", {icon: 1, time:3000});
            	}else{
            		layer.msg("修改成功", {icon: 1, time:3000});
            	}
                
                $('#assetGroup_table').DataTable().destroy();
                $scope.initMainTable({});
                $("#addOrUpdateDetailSortDataModal").modal("hide");
            }
            else if(errCode == 1){
                layer.alert(msg);
            }else if(errCode==11){
            	 layer.alert("来自系统的数据不能修改");
            }else if(errCode==21){
            	 layer.alert("来自万德的数据不能修改");
            }else if(errCode==31){
            	layer.alert("来自申万的数据不能修改");
            }
            else{
            	if(saveEntity.id==""||saveEntity.id==null||saveEntity.id==undefined){
            		layer.msg("新增失败",{icon: 2});
            	}else{
            		layer.msg("修改失败",{icon: 2});
            	}
                $("#addOrUpdateDetailSortDataModal").modal("hide");
            }
            layer.closeAll('loading');
        });
    }
    /*******************点击增加明细分类 end***********************/
    /*******************点击增加组合分类 begin*********************/
    
  //获取组合分类中所有的下拉信息
    $scope.getSortName = function(capitalTypeID){
        getsortName(capitalTypeID,"",function(result){
            $scope.sortNames = [];
            $scope.sortTypeID = [];
            $scope.masterID = [];
            for(var i=0;i<result.length;i++){
                $scope.sortNames.push(result[i].sortName);
                $scope.sortTypeID.push(result[i].sortTypeID);
                $scope.masterID.push(result[i].masterID);
            }

            for(var j=0;j<$scope.sortNames.length;j++){
                $("#hasGroupType_table .ass_typeName").append("<option value='"+$scope.sortNames[j]+","+$scope.sortTypeID[j]+","+ $scope.masterID[j]+"'>"+$scope.sortNames[j]+"</option>");
            }
            for(var k=0;k<$scope.combineFlag.length;k++){
                $("#hasGroupType_table .ass_typeFlag").append("<option value='"+$scope.combineFlag[k].text+"'>"+$scope.combineFlag[k].text+"</option>");
            }
        });
    };
    
    //增加或者修改组合分了是，切换资产大类，改变下拉框数据
    $scope.changeCombineCapital = function(){
    	$scope.getSortName($scope.saveOrUpdateCombineSortEntity.capitalTypeID);
    	var addOrUpdateCombineSortDataModal_leftTable_data = 
        	[
        	 {exchangeID:"1",instrumenID:"<select id = 'typeFlagID_1' class='ass_typeFlag hidden'><option value=''></option></select>", info:"<select id = 'typeNameID_1' class='ass_typeName'></select>", cacl:""},
        	 {exchangeID:"<a style='cursor:pointer;' class='addRow'>+</a>",instrumenID:"", info:"", cacl:""}
        	 ];
    	$scope.intAddOrUpdateCombineSortDataModalTable(addOrUpdateCombineSortDataModal_leftTable_data,[]);
    	 //$scope.$apply();
    }
    
    //点击组合按钮时，绘测Modal中左边表格和右边表格的共有方法
    $scope.intAddOrUpdateCombineSortDataModalTable = function(arrLeft,arrRight){
    	var temp_myfindByIDInstrumentData_left = [];
		for(var i=0;i<arrLeft.length;i++){
			var entity = arrLeft[i];
			 var temp = {
					 "exchangeID": entity.exchangeID,//1,2,3
					 "instrumenID": entity.instrumenID,//逻辑符号
	  	             "info": entity.info,//名称
	  	             "cacl": entity.cacl
			 
			 };
			 temp_myfindByIDInstrumentData_left.push(temp); 
		}
		
    	//初始化组合左边表格
    	$('#hasGroupType_table').DataTable().destroy();
    	$scope.hasGroupType_table_table = $('#hasGroupType_table').DataTable({
 	    	"data":temp_myfindByIDInstrumentData_left,
 	    
 	        "columns": [
 	            {
 	            	"data": "exchangeID", 
 		            "class":"center",
 			        "width":"30%"
 	            },
 	            
 	            {
 		              "data": "instrumenID", 
 		              "class":"center",
 	 			        "width":"20%"
 	            },
 	            
 	            {
 		              "data": "info", 
 		              "class":"center",
 	 			        "width":"20%"
 	            },
 	            
 	           {
		              "data": "cacl", 
		              "class":"center",
	 			        "width":"30%"
	            }
 	            
 	        ],
 	       "paging": false,
           //"scrollX": true,
           "info": false,
 	       "scrollY": 500,
           "scrollCollapse":true,
 	       "dom": 'rt<"bottom"iplB>',
 	      "buttons": [],
 	       "ordering": false,
 	       "destroy":true,
	        "retrieve": true
        });
        //初始化组合右边表格
    	
    	var temp_myfindByIDInstrumentData_right = [];
    	if(arrRight!=null&&arrRight!=undefined){
    		for(var i=0;i<arrRight.length;i++){
    			var entity = arrRight[i];
    			 var temp = {
						 "exchangeID": entity.exchangeID,
						 "info": entity.info,
						 "cacl":entity.cacl
				 };
    			 temp_myfindByIDInstrumentData_right.push(temp); 
    		}
    	}
    	
    	$('#needAddGroup_table').DataTable().destroy();
    	$scope.needAddGroup_table_table = $('#needAddGroup_table').DataTable({
 	    	"data":temp_myfindByIDInstrumentData_right,
 	    
 	        "columns": [
 	            {
 	            	"data": "exchangeID", 
 		            "class":"center",
 			        "width":"10%"
 	            },
 	            
 	            {
 		              "data": "info", 
 		              "class":"center",
 			          "width":"60%"
 	            },
 	            
 	           {
		              "data": "cacl", 
		              "class":"center",
			          "width":"30%",
	            }
 	            
 	        ],
 	         "order": [[0, 'asc']],
	    	 "paging": false,
	         "scrollX": true,
	         "info": false,
		     "scrollY": 450,
	         "scrollCollapse":true,
	         "dom": 'rt<"bottom"iplB>',
	         "buttons": [],
	         "ordering": true,
	         "destroy":true,
		      "retrieve": true
        });
    	
    	 $timeout(function() {
    		 $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
         },700);
    	
    }
    //点击增加组合分类按钮时，进行初始化
    $scope.initAddCombineSortType = function(){
    	$scope.myModalTitle.showAddOrUpdateCombineSortModal = "增加组合分类";
    	$scope.myModalButton.saveOrUpdate = "保存";
    	$scope.combineSort_isDisabled = false;
    	$scope.saveCombineTabData = [];
    	$scope.saveOrUpdateCombineSortEntity.sortName = "";
    	$scope.saveOrUpdateCombineSortEntity.capitalTypeID = "2";
    	$scope.mySessionStorage.sourceMasterID = "";
       	$scope.mySessionStorage.brokerID = "";
    	$scope.getSortName($scope.saveOrUpdateCombineSortEntity.capitalTypeID);
    	var addOrUpdateCombineSortDataModal_leftTable_data = 
        	[
        	 {exchangeID:"1",instrumenID:"<select id = 'typeFlagID_1' class='ass_typeFlag hidden'><option value=''></option></select>", info:"<select id = 'typeNameID_1' class='ass_typeName'></select>", cacl:""},
        	 {exchangeID:"<a style='cursor:pointer;' class='addRow'>+</a>",instrumenID:"", info:"", cacl:""}
        	 ];
    	$scope.intAddOrUpdateCombineSortDataModalTable(addOrUpdateCombineSortDataModal_leftTable_data,[]);
    	
    	 $timeout(function() {
             $("#addOrUpdateCombineSortDataModal").modal("show");
         },500);
    }
    $("body").undelegate("#hasGroupType_table td .addRow","click");
	
	//点击组合分类表格左侧的+所触发的事件
    $scope.assGroupcount = 1;
    $("body").delegate("#hasGroupType_table td .addRow","click",function(){
    	$("#hasGroupType_table").DataTable().row($(this).parents("tr")).remove().draw();
    	$scope.assGroupcount = $scope.assGroupcount+1;
    	var myindex = $scope.assGroupcount;
        var hasGroupTypeData = [
	                               {
	                                	exchangeID:$("#hasGroupType_table").DataTable().context[0].aoData.length+1,
	                                	instrumenID:"<select id = 'typeFlagID_"+myindex+"' class='ass_typeFlag'></select>",
	                                	info:"<select id = 'typeNameID_"+myindex+"' class='ass_typeName'></select>",
	                                	cacl:"<a style='cursor:pointer;' class='delRow'>删除</a>"
	                                },
                                	{
	                                	exchangeID:"<a style='cursor:pointer;' class='addRow'>+</a>",
	                                	instrumenID:"",
	                                	info:"",
	                                	cacl:""
                                	}
                                ];
        
        
        $("#hasGroupType_table").DataTable().rows.add(hasGroupTypeData).draw();
        
        
        var typeFlagID = "#typeFlagID_" + myindex;
        var typeNameID = "#typeNameID_" + myindex;
        
        for(var j=0;j<$scope.sortNames.length;j++){
            $(typeNameID).append("<option value='"+$scope.sortNames[j]+","+$scope.sortTypeID[j]+","+ $scope.masterID[j]+"'>"+$scope.sortNames[j]+"</option>");
        }
        for(var j=0;j<$scope.combineFlag.length;j++){
            $(typeFlagID).append("<option value='"+$scope.combineFlag[j].text+"'>"+$scope.combineFlag[j].text+"</option>");
        }
     
        $scope.$apply();
    })

    //组合分类  左侧 删除 按钮
     $("body").delegate("#hasGroupType_table td .delRow","click",function(){
    	 $("#hasGroupType_table").DataTable().row($(this).parents("tr")).remove().draw();
         for(var i=0;i<$("#hasGroupType_table").DataTable().context[0].aoData.length-1;i++){
             var index = $("#hasGroupType_table").DataTable().cell($($("#hasGroupType_table").DataTable().context[0].aoData[i].nTr).children()[0]);
             index.data(i+1);
         }
     });
    //组合分类中移动数据到右边表格中
    $scope.addCombineToRight = function(){
        var combine_dataset = [];
        var combineRightData = "";
        for(var i=0;i<$("#hasGroupType_table").DataTable().context[0].aoData.length-1;i++){
            var contentData = {};
            contentData.exchangeID = i+1;
            
            //获得且，排除，条件字段
            for(var j=0;j<$("#hasGroupType_table .ass_typeFlag")[i].length;j++){
                if($("#hasGroupType_table .ass_typeFlag")[i][j].selected == true){
                    contentData.instrumenID = $("#hasGroupType_table .ass_typeFlag")[i][j].value;
                    break;
                }
            }
            //获得，分类名称 字段
            for(var j=0;j<$("#hasGroupType_table .ass_typeName")[i].length;j++){
                if($("#hasGroupType_table .ass_typeName")[i][j].selected == true){
                    contentData.info = $("#hasGroupType_table .ass_typeName")[i][j].value.split(",")[0];
                    contentData.sourceSortTypeID = $("#hasGroupType_table .ass_typeName")[i][j].value.split(",")[1];
                    contentData.sourceMasterID = $("#hasGroupType_table .ass_typeName")[i][j].value.split(",")[2];
                    break;
                }
            }
            combine_dataset.push(contentData);
        }
        //验证同一条数据 是否有重复分类名称
        for(var i=0;i<combine_dataset.length;i++){
        	 for(var j=i+1;j<combine_dataset.length;j++){
             	if(combine_dataset[i].info==combine_dataset[j].info){
             		layer.alert("内容重复");
             		return false;
             	}
             }
        }
        //用于保存组合分类的变量
        $scope.saveCombineTabData.push(combine_dataset);
        for(var i=0;i<combine_dataset.length;i++){
            combineRightData = combineRightData + combine_dataset[i].instrumenID + "【" + combine_dataset[i].info +"】";
        }
        //$scope.needAddGroup_dataset.push([needAddGroupTable.context[0].aoData.length+1,$scope.combineRightData,"<a class='delRow'>删除</a>"]);
        //$("#needAddGroup_table").DataTable().row($(this).parents("tr")).remove().draw();
        var addDataTemp = 
                           {
                        	   exchangeID:$('#needAddGroup_table').DataTable().context[0].aoData.length+1,
                        	   info:combineRightData,
                        	   cacl:"<a style='cursor:pointer;' class='delRow'>删除</a>"
                           }
                           ;
        $('#needAddGroup_table').DataTable().row.add(addDataTemp).draw();
    };
    
    //组合分类，右侧，删除，按钮
    $("body").delegate("#needAddGroup_table td .delRow","click",function(){
       // $scope.needAddGroup_dataset.splice($(this).parents("tr")[0].rowIndex-1,1);
    	//用于保存组合分类的变量
        $scope.saveCombineTabData.splice($(this).parents("tr")[0].rowIndex-1,1);
        $scope.$apply();
    	$('#needAddGroup_table').DataTable().row($(this).parents("tr")).remove().draw();
        for(var i=0;i<$('#needAddGroup_table').DataTable().context[0].aoData.length;i++){
            var index = $('#needAddGroup_table').DataTable().cell($($('#needAddGroup_table').DataTable().context[0].aoData[i].nTr).children()[0]);
            index.data(i+1);
        }
    })
    
  //保存组合分类
    $scope.saveOrUpdateCombineSortData = function(entity){
        var combineEntity = {};
        combineEntity.sortName = entity.sortName;
        combineEntity.capitalTypeID = entity.capitalTypeID;
        combineEntity.contentDataList1 =  $scope.saveCombineTabData;
        combineEntity.id = $scope.mySessionStorage.sourceMasterID;
        combineEntity.brokerID = $scope.mySessionStorage.brokerID;
        if(combineEntity.sortName == undefined || combineEntity.sortName  == ""){
            layer.alert("分类名称不能为空");
            return false;
        }
        if(combineEntity.sortName.length>200){
        	 layer.alert("分类名称最多允许由200个字符组成");
             return false;
        }
        if($('#needAddGroup_table').DataTable().context[0].aoData.length<1){
            layer.alert("至少添加一条组合分类内容");
            return false;
        }
        layer.load(2, {
    	    shade: [0.5,'#fff'] //0.1透明度的白色背景
    	});
        saveCombineSortData(combineEntity,function(errCode,errMsg){
            if(errCode == 0){
            	if(combineEntity.id==""||combineEntity.id==null||combineEntity.id==undefined){
            		layer.msg("新增成功", {icon: 1, time:3000});
            	}else{
            		layer.msg("修改成功", {icon: 1, time:3000});
            	}
                //保存成功清空保存数据
                $scope.saveCombineTabData = [];
                $scope.saveOrUpdateCombineSortEntity.sortName = "";
                $scope.saveOrUpdateCombineSortEntity.capitalTypeID = "2";
                $('#assetGroup_table').DataTable().destroy();
                $scope.initMainTable({});
                $("#addOrUpdateCombineSortDataModal").modal("hide");
            }
            else if(errCode>0){
                layer.alert(errMsg);
            }
            else{
            	if(combineEntity.id==""||combineEntity.id==null||combineEntity.id==undefined){
            		 layer.msg("新增失败",{icon: 2});
            	}else{
            		 layer.msg("修改失败",{icon: 2});
            	}
               
                //保存失败也清空保存数据
                $scope.saveCombineTabData = [];
                $scope.saveOrUpdateCombineSortEntity.sortName = "";
                $scope.saveOrUpdateCombineSortEntity.capitalTypeID = "2";
                $("#addOrUpdateCombineSortDataModal").modal("hide");
            }
        })
        layer.closeAll('loading');
    };

    /*******************点击增加组合分类 end***********************/
    /*******************文件导入 begin***********************/
    //初始化文件导入页面数据显示表格
    $scope.initUploadModalTable = function(upload_temp_data){
    	var upload_data = [];
		for(var i=0;i<upload_temp_data.length;i++){
			var entity = upload_temp_data[i];
			 var temp = {
					 "index": i+1,//1,2,3
					 "sortName":entity.sortName,
					 "exchangeID":entity.exchangeID,
					 "instrumentID": entity.instrumentID,//逻辑符号
	  	             "instrumentName": entity.instrumentName//名称
			 };
			 upload_data.push(temp); 
		}
		
    	$('#fileUpload_table').DataTable().destroy();
    	$scope.fileUpload_table_table = $('#fileUpload_table').DataTable({
 	    	"data":upload_data,
 	    
 	        "columns": [
 	            {
 	            	"data": "index", 
 		            "class":"center"
 	            },
 	            {
		              "data": "sortName", 
		              "class":"center"
	            },
 	            
 	            {
 		              "data": "exchangeID", 
 		              "class":"center"
 	            },
 	            
 	            {
 		              "data": "instrumentID", 
 		              "class":"center"
 	            },
 	            
 	           {
		              "data": "instrumentName", 
		              "class":"center"
	            }
 	            
 	        ],
 	       "order": [[0, 'asc']],
 	       "dom": 'rt<"bottom"iplB>',
 	       "buttons":[],
 	       "destroy":true,
	        "retrieve": true
        });
    	
    	$timeout(function(){
    		$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    	},700);
    }
    //点击文件导入按钮，初始化modal'
    $scope.initUploadModal = function(){
    	 //数据来源
        getBrokerIDAndBrokerName(function(result){
            if(result.instClientID == ""){
                $scope.uploadDataSource = clearConstant.dataBrokeSource;
                $scope.uploadDetailSortEntity.dataSourceID = "2";
                $scope.$apply();
            }
            else{
                $scope.uploadDataSource = clearConstant.dataOtherSource;
                $scope.uploadDetailSortEntity.dataSourceID = "4";
                $scope.$apply();
            }
        })
        
        $scope.uploadDetailSortEntity.capitalTypeID = "2";
        $scope.myModalButton.saveOrUpdate = "确认导入";
        $scope.myModalTitle.showuploadDetailSortModal = "导入明细分类";
        $scope.clearUpLoadTmpEntity();//清空上传文件临时数据表格
        $scope.initUploadModalTable([]);//初始化table
        
        $timeout(function() {
            $("#uploadDetailSortDataModal").modal("show");
        },500);
    }
    
  //上传文件
    $("#uploadFundloaderAssGroup").uploadFile({
    	 dragdropWidth: 100,
         uploadStr:"Excel导入",
         dragDropStr: "",
         dragDropContainerClass:"",
         url: framework.file.uploadUrl("riskStromDataService", "holdExcelImport"),
         fileName: "file",// 名字不能改
         onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
                if(result.totNum>0){
                    layer.msg("成功导入数据"+result.totNum+"条记录！", {icon: 1, time: 3000});
                    getProductRiskDataUpLoadTmpEntity(function (result2) {
                    	var upload_temp_data = [];
                    	if(result2!=null&&result2!=undefined){
                    		for(var v=0;v<result2.length;v++){
                    			var tempEntity = {};
                    			tempEntity.sortName = result2[v].sortName;
                    			tempEntity.exchangeID = result2[v].exchangeID;
                    			tempEntity.instrumentID = result2[v].instrumentID;
                    			tempEntity.instrumentName = result2[v].instrumentName;
                    			upload_temp_data.push(tempEntity);
                    		}
                    	}
                    	$scope.initUploadModalTable(upload_temp_data);
                    });
                }else if(result.totNum==0){
                	 layer.msg("导入的数据无法匹配相应的合约代码", {icon: 2, time: 10000});
                	 $scope.initUploadModalTable([]);
                	 layer.closeAll('loading');
                	 return false;
                }else{
                    layer.msg("导入数据失败", {icon: 2, time: 10000});
                    $scope.initUploadModalTable([]);
                    layer.closeAll('loading');
                    return false;
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
        if(suffix == "xlsx" || suffix == "xls" ){
        } else {
            layer.msg('上传文件必须为Excel文件格式，例如：xlsx、xls', {icon: 2}, 3000);
            $scope.initUploadModalTable([]);
            layer.closeAll('loading');
            return false;
        }
    }
    });
    
    //每次点击excel导入的时候，清空上传数据的临时表格
    $("#uploadFundloader").on("click",function(){
        $scope.clearUpLoadTmpEntity();
    });
   //保存上传的内容
    $scope.uploadDetailSortData = function(entity){
        var fileEntity = {};
        fileEntity.capitalTypeID = entity.capitalTypeID;
        fileEntity.dataSourceID = entity.dataSourceID;
        if($('#fileUpload_table').DataTable().context[0].aoData.length<1){
            layer.alert("至少导入一条信息");
            return false;
        }
        layer.load(2, {
    	    shade: [0.5,'#fff'] //0.1透明度的白色背景
    	});
        saveRealUpLoadExcelData(fileEntity,function(errCode){
            if(errCode == 0){
                layer.msg("新增成功", {icon: 1, time:3000});
                $('#assetGroup_table').DataTable().destroy();
                $scope.initMainTable({});
                $("#uploadDetailSortDataModal").modal("hide");
            }
            else{
                layer.msg("新增失败",{icon: 2});
                $("#uploadDetailSortDataModal").modal("hide");
            }
            layer.closeAll('loading');
        })
    }
    /*******************文件导入 end***********************/
})