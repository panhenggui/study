myapp.controller('FofriskPositionDistributionController',function($scope) {
	 $scope.fofriskPositionDistributionService = new com.quantdo.orgClear.service.FofriskPositionDistributionService();
	/* //调用表格重绘函数
	 $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	 $scope.tabCallBackFunc = tabCallBackFunc;*/
	 
	 //日期组件
	 $("[forType='date']").datepicker({
			language : 'zh-CN',
			weekStart : 1,
			autoclose : true,
			clearBtn : true,
			todayHighlight : true,
			format : 'yyyymmdd'
		});
	 //定义变量
	 $scope.resultFlag = false;
	 $scope.queryEntity = {};
	 $scope.productgroups = [];
	 $scope.resultDataEntity = [];
	 $scope.myData = [];
	 //初始化产品组名称下拉框
	 $scope.fofriskPositionDistributionService.getProductGroupByBrokerID("",function(errCode, errMsg, result){
		 if(errCode==0){
			 $scope.productgroups = result;
			 $scope.$apply();
		 }
	 });
	 
	 //点击查询按钮
	 $scope.find = function(entity){
		 $scope.resultDataEntity = [];
		 $scope.myData = [];
		 $scope.fofriskPositionDistributionService.getDataByQuery("",entity.productgroupID,entity.instrumentID_productID,entity.updateTime,function(errCode, errMsg, result){
			 if(errCode==0){
				 $scope.resultDataEntity = result;
				 if( $scope.resultDataEntity.length>0){
					 for(var i=0;i<$scope.resultDataEntity.length;i++){
						 var entity = $scope.resultDataEntity[i];
						 var temp = {
								 "fundGroupID":entity.fundGroupID+"_"+entity.fundGroupName,
				  	             "fofInstClientID": "",
				  	             "productID": "",
				  	             "exchID": entity.exchID,
				  	             "instrumentID": entity.instrumentID,
				  	             "position_buy": entity.groupPositionBuy,
				  	             "position_sale": entity.groupPositionSale,
				  	             "position_net": entity.groupPositionNet
						 };
						 $scope.myData.push(temp); 
				     }
				 }
				 $scope.$apply();
			 }
			 $('#fofriskPostionDistribution_table').DataTable().destroy();
			 $scope.table = $('#fofriskPostionDistribution_table').DataTable( {
			    	"data":$scope.myData,
			    
			        "columns": [
			            {
			                "className":      'details-control',
			                "orderable":      false,
			                "data":           null,
			                "defaultContent": '',
			                "width":"44px"
			            },
			            
			            { "data": "fundGroupID", 
			               "class":"center",
			               "width":"177px"
			            },
			            
			            { "data": "fofInstClientID", 
			               "class":"center",
			               "width":"177px"
			            },

			            { "data": "productID",
			              "class":"center",
			              "width":"177px"
			            },
			            
			            { "data": "exchID",
			              "class":"center",
			              "width":"177px"
			            },
			           
			            { "data": "instrumentID",
			              "class":"center",
			              "width":"177px"
			            },
			            
			            { "data": "position_buy",
			              "class":"center",
			              "width":"177px"
			            },
			            
			            { "data": "position_sale",
			              "class":"center",
			              "width":"177px"
			            },
			            
			            { "data": "position_net",
			              "class":"center",
			              "width":"177px"
			            }
			        ],
			        //"ordering": false
			        "order": [[1, 'asc']]
			    } );
			 $scope.$apply();
		 });
	 }

	 
	 //获得全部数据
	 $scope.fofriskPositionDistributionService.getAllData("",function(errCode,errMsg,result){
		 $scope.resultDataEntity = [];
		 $scope.myData = [];
		 if(errCode==0){
			 $scope.resultDataEntity = result;
			 if($scope.resultDataEntity.length>0){
				 for(var i=0;i<$scope.resultDataEntity.length;i++){
					 var entity = $scope.resultDataEntity[i];
					 var temp = {
							 "fundGroupID":entity.fundGroupID+"_"+entity.fundGroupName,
			  	             "fofInstClientID": "",
			  	             "productID": "",
			  	             "exchID": entity.exchID,
			  	             "instrumentID": entity.instrumentID,
			  	             "position_buy": entity.groupPositionBuy,
			  	             "position_sale": entity.groupPositionSale,
			  	             "position_net": entity.groupPositionNet
					 };
					 $scope.myData.push(temp); 
			     }
			 }
			 $scope.$apply();
		 }
		 
		 $scope.table = $('#fofriskPostionDistribution_table').DataTable( {
		    	"data":$scope.myData,
		    
		        "columns": [
		            {
		                "className":      'details-control',
		                "orderable":      false,
		                "data":           null,
		                "defaultContent": '',
			              "width":"44px"
		               
		            },
		            
		            { "data": "fundGroupID", 
		               "class":"center",
			              "width":"177px"
		            },
		            
		            { "data": "fofInstClientID", 
		               "class":"center",
			              "width":"177px"
		            },

		            { "data": "productID",
		              "class":"center",
		              "width":"177px"
		            },
		            
		            { "data": "exchID",
		              "class":"center",
		              "width":"177px"
		            },
		           
		            { "data": "instrumentID",
		              "class":"center",
		              "width":"177px"
		            },
		            
		            { "data": "position_buy",
		              "class":"center",
		              "width":"177px"
		            },
		            
		            { "data": "position_sale",
		              "class":"center",
		              "width":"177px"
		            },
		            
		            { "data": "position_net",
		              "class":"center",
		              "width":"177px"
		            }
		        ],
		        //"ordering": false
		        "order": [[1, 'asc']]
		    } );
		 $scope.$apply();
	 });
	 
	 //点击加号，添加子行
	 function addChildRow (tr,rowData){
		var entity = $scope.resultDataEntity;
		 var newRow = "";
		 var temp = [];
		for(var i=0;i<entity.length;i++){
			var id = rowData.fundGroupID+rowData.exchID+rowData.instrumentID;
			var idd = entity[i].fundGroupID+"_"+entity[i].fundGroupName+entity[i].exchID+entity[i].instrumentID;
			if(id==idd){
				temp = entity[i].PositionDistributioDetail;
				break;
			}
		}
		for(var j=0;j<temp.length;j++){
			newRow = newRow+'<tr class ="myfofriskColor" id='+id+'>'+
	        '<td class="center" border="1px solid #dddddd">'+" "+'</td>'+
	        '<td class="center" border="1px solid #dddddd">'+" "+'</td>'+
	        '<td class="center" border="1px solid #dddddd">'+temp[j].fofInstClientID+'</td>'+
	        '<td class="center" border="1px solid #dddddd">'+temp[j].fundProductID+"_"+temp[j].shortProductName+'</td>'+
	        '<td class="center" border="1px solid #dddddd">'+temp[j].exchID+'</td>'+
	        '<td class="center" border="1px solid #dddddd">'+temp[j].instrumentID+'</td>'+
	        '<td class="center" border="1px solid #dddddd">'+temp[j].position_buy+'</td>'+
	        '<td class="center" border="1px solid #dddddd">'+temp[j].position_sale+'</td>'+
	        '<td class="center" border="1px solid #dddddd">'+temp[j].position_net+'</td>'+
	    '</tr>'
		}
	        $(tr).after(newRow);
		//return '<table id="fofriskPostionDistribution_child_table" class="table table-striped table-bordered table-hover myfofrisktable">'+newRow;
	 }
	 
	 //点击减号，删除子行
	 function deleteChildRow(tr,rowData){
		 while ($('#'+rowData.fundGroupID+rowData.exchID+rowData.instrumentID).length > 0)  
		    {  
			 $('#'+rowData.fundGroupID+rowData.exchID+rowData.instrumentID).remove();  
		    }  
	 }
	 
	 //展开和收起行
	
	 $("body").delegate('#fofriskPostionDistribution_table tbody').undelegate("click").on('click', 'td.details-control', function () {
		 
	    	//获得被点击的哪一行
	        var tr = $(this).closest('tr');
	        var row =  $("#fofriskPostionDistribution_table").DataTable().row(tr);
	        
	        if ( tr.hasClass('shown') ) {
	            //row.child.hide();
	            tr.removeClass('shown');
	            //调用方法，去除折叠行
	            deleteChildRow(tr,row.data());
	        }
	        else {
	            //row.child(addChildRow(tr,row.data())).show();
	            tr.addClass('shown');
	            //调用方法，添加折叠行
	            addChildRow(tr,row.data());
	        }
	        //var lastSort = $scope.table.context[0].aLastSort[0].col;
	    } );
	 
	 $("body").delegate('#fofriskPostionDistribution_table tbody').undelegate("click").on('click', 'th', function () {
		for(var i=0;i<$scope.table.context[0].aoData.length;i++){
			var detailControl = $($scope.table.context[0].aoData[i].anCells[0]);
			var detailRow = $($scope.table.context[0].aoData[i].nTr);
			 if ( detailRow.hasClass('shown') ) {
				 detailRow.removeClass('shown');
	             //调用方法，去除折叠行
	             deleteChildRow(detailControl,detailRow.data());
		      }
		}
	 });
	 
	 $("body").delegate('#fofriskPostionDistribution_table_length div').undelegate("change").on('change', 'select[name="fofriskPostionDistribution_table_length"]', function () {
			for(var i=0;i<$scope.table.context[0].aoData.length;i++){
				var detailControl = $($scope.table.context[0].aoData[i].anCells[0]);
				var detailRow = $($scope.table.context[0].aoData[i].nTr);
				 if ( detailRow.hasClass('shown') ) {
					 detailRow.removeClass('shown');
		             //调用方法，去除折叠行
		             deleteChildRow(detailControl,detailRow.data());
			      }
			}
		 });
	 
	 $("body").delegate('#fofriskPostionDistribution_table_filter div').undelegate("keyup").on('keyup', 'input[type="search"]', function () {
			for(var i=0;i<$scope.table.context[0].aoData.length;i++){
				var detailControl = $($scope.table.context[0].aoData[i].anCells[0]);
				var detailRow = $($scope.table.context[0].aoData[i].nTr);
				 if ( detailRow.hasClass('shown') ) {
					 detailRow.removeClass('shown');
		             //调用方法，去除折叠行
		             deleteChildRow(detailControl,detailRow.data());
			      }
			};
		 });
	 
	/* $("#fofriskPostionDistribution_table_paginate").children("ul:first").children("li:first").find("a").click(function(){
		 alert(1);
	 })
	 */
	/* $("body").delegate('#fofriskPostionDistribution_table_paginate div').on('click', , function () {
			for(var i=0;i<$scope.table.context[0].aoData.length;i++){
				var detailControl = $($scope.table.context[0].aoData[i].anCells[0]);
				var detailRow = $($scope.table.context[0].aoData[i].nTr);
				 if ( detailRow.hasClass('shown') ) {
					 detailRow.removeClass('shown');
		             //调用方法，去除折叠行
		             deleteChildRow(detailControl,detailRow.data());
			      }
			}
		 });*/
});