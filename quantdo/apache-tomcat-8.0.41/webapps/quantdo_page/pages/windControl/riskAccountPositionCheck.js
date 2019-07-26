//资产单元持仓核对(MOM)
myapp.controller('riskAccountPositionCheckController',function($scope,$rootScope) {
	$scope.riskAccountPositionCheckService = new com.quantdo.orgClear.service.RiskAccountPositionCheckService();
	 //调用表格重绘函数
	 $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	 $scope.tabCallBackFunc = tabCallBackFunc;
	//表数据
	$scope.riskAccountPositionCheck_Datas = [];
	$scope.riskAccountPositionCheck_backEntity = [];
	//表格初始化方法
	$scope.initRiskAccountPositionCheck_table = function(id,data,isOrder){
		 $scope.table = $('#'+id).DataTable({
		    	data:data,
		        columns: [
		            {
			              className:      'details-control',
			              orderable:      false,
			              data:           null,
			              defaultContent: '',
				          width:          "44px"
		            },
		            
		            { 
			              data:  "brokerID", 
			              visible:false,
			              class: "center"
		            },
		            
		            { 
			              data:  "exchID", 
			              visible:false,
			              class: "center"
		            },
		            
		            { 
			              data: "exchName", 
			              class:"center"
		            },
		            
		            { 
		            	  data: "instrumentID", 
			              class:"center"
		            },

		            { 
		            	  data: "instrumentName", 
		            	  visible:false,
			              class:"center"
		            },
		            
		            { 
		            	  data: "investorID", 
		            	  visible:false,
			              class:"center"
		            },
		            
		            { 
		            	  data: "investorName", 
			              class:"center"
		            },
		           
		            { 
		            	  data: "investorNetPosition", 
			              class:"center"
		            },
		            
		            { 
		            	  data: "subAccountID", 
		            	  visible:false,
			              class:"center"
		            },
		            
		            { 
		            	  data: "subAccountName", 
			              class:"center"
		            },
		            { 
		            	  data: "subAccountNetPosition", 
			              class:"center"
		            },
		            { 
		            	  data: "orderFlag", 
		            	  visible:false,
			              class:"center"
		            }
		        ],
		        ordering: isOrder,
		        order: [[12, 'asc'],[2, 'desc'],[4, 'desc']],
		        retrieve: true,
	            destroy:true,
	            dom: 'rt<"bottom"ipl>',
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
	            },
		 
		      createdRow: function ( row, data, index ) {
	              if(data.investorNetPosition != data.subAccountNetPosition){
	                  $("td", row).addClass("myred");
	              }
		      }
	    });
	}
	$scope.initRiskAccountPositionCheck_table("riskAccountPositionCheck_table",$scope.riskAccountPositionCheck_Datas,true);
	
	//点击生成持仓核对
	$scope.getSysPosition = function(){
		 layer.load(2, {
       	    shade: [0.5,'#fff'] //0.1透明度的白色背景
       	});
		$scope.riskAccountPositionCheckService.getSysPosition(function(result){
			$scope.riskAccountPositionCheck_Datas = [];
			$scope.riskAccountPositionCheck_backEntity = [];
			if(result!=null){
				$scope.riskAccountPositionCheck_backEntity = result;
				$scope.$apply();
				for(var i=0;i<result.length;i++){
					var orderFlagTmp;
					if(result[i].investorNetPosition == result[i].subAccountNetPosition) orderFlagTmp = 2;
					else orderFlagTmp = 1;
					var tmpEntity = {
							brokerID:result[i].brokerID,	
							exchID:result[i].exchID,	
							exchName:result[i].exchName,
							instrumentID:result[i].instrumentID,
							instrumentName:result[i].instrumentName,
							investorID:"",
							investorName:"",
							investorNetPosition:result[i].investorNetPosition,
							subAccountID:"",
							subAccountName:"",
							subAccountNetPosition:result[i].subAccountNetPosition,
							orderFlag:orderFlagTmp
					}
					$scope.riskAccountPositionCheck_Datas.push(tmpEntity);
				}
			}
			 $('#riskAccountPositionCheck_table').DataTable().destroy();
			 $scope.initRiskAccountPositionCheck_table("riskAccountPositionCheck_table",$scope.riskAccountPositionCheck_Datas,true);
			 layer.closeAll('loading');
		});
		
	}
	$scope.getSysPosition();
	
	//展开行
	$("body").undelegate("#riskAccountPositionCheck_table td.details-control","click");
	$("body").delegate("#riskAccountPositionCheck_table td.details-control","click",function(){
    	//获得被点击的哪一行
        var tr = $(this).closest('tr');
        var row =  $("#riskAccountPositionCheck_table").DataTable().row(tr);
        
        if ( tr.hasClass('shown') ) {
            tr.removeClass('shown');
            //调用方法，去除折叠行
            deleteChildRow(tr,row.data());
        }
        else {
            tr.addClass('shown');
            //调用方法，添加折叠行
            addChildRow(tr,row.data());
        }
    } );
	
	 //点击加号，添加子行
	 function addChildRow (tr,rowData){
		var entity = $scope.riskAccountPositionCheck_backEntity;
		 var newRow = "";
		 var temp = [];
		for(var i=0;i<entity.length;i++){
			var id = rowData.brokerID+"_"+rowData.exchID+"_"+rowData.instrumentID;
			var idd = entity[i].brokerID+"_"+entity[i].exchID+"_"+entity[i].instrumentID;
			if(id==idd){
				temp = entity[i].netPositionDetailList;
				break;
			}
		}
		for(var j=0;j<temp.length;j++){
			newRow = newRow+'<tr class="myriskAccountPositionCheckColor" id='+id+'>'+
	        '<td class="center">'+" "+'</td>'+
	        '<td class="center">'+" "+'</td>'+
	        '<td class="center">'+" "+'</td>'+
	        '<td class="center">'+temp[j].investorName+'</td>'+
	        '<td class="center">'+temp[j].investorNetPosition+'</td>'+
	        '<td class="center">'+temp[j].subAccountName+'</td>'+
	        '<td class="center">'+temp[j].subAccountNetPosition+'</td>'+
	    '</tr>'
		}
	        $(tr).after(newRow);
	 }
	 
	//点击减号，删除子行
	 function deleteChildRow(tr,rowData){
		 while ($('#'+rowData.brokerID+"_"+rowData.exchID+"_"+rowData.instrumentID).length > 0)  
		    {  
			 $('#'+rowData.brokerID+"_"+rowData.exchID+"_"+rowData.instrumentID).remove();  
		    }  
	 }
	 
	//在页面上进行的所有单击操作都不折叠已经展开的行
	  $("body").delegate('#riskAccountPositionCheck_table_length').on('click', function () {
		  setTimeout(function(){
			  var  trlist = $("#riskAccountPositionCheck_table").find("tr");  
				 for(var i=1;i<trlist.length;i++){
					//获得被点击的哪一行
					    var  tr =$(trlist[i]);  
				        var row =  $("#riskAccountPositionCheck_table").DataTable().row(tr);
				        
				        if ( tr.hasClass('shown') ) {
				            tr.removeClass('shown');
				            //调用方法，去除折叠行
				            deleteChildRow(tr,row.data());
				            tr.addClass('shown');
				            //调用方法，添加折叠行
				            addChildRow(tr,row.data());
				        }
					 }
		  });
	 });
	 
/*	 //排序的时候关闭展开的行
	 $("body").delegate('#riskAccountPositionCheck_table tbody').on('click', 'th', function () {
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
	
	 //更改显示条数的时候关闭展开的行
	 $("body").delegate('#riskAccountPositionCheck_table_length div').on('change', 'select[name="riskAccountPositionCheck_table_length"]', function () {
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
	 
	 //换页的时候关闭展开的行
	 $('#riskAccountPositionCheck_table').on( 'page.dt', function () {
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
	 
	 
	 /* //排序的时候不关闭展开的行
	  $("body").delegate('#riskAccountPositionCheck_table tbody').on('click', 'th', function () {
		 var  trlist = $("#riskAccountPositionCheck_table").find("tr");  
		 for(var i=1;i<trlist.length;i++){
			//获得被点击的哪一行
			    var  tr =$(trlist[i]);  
		        var row =  $("#riskAccountPositionCheck_table").DataTable().row(tr);
		        
		        if ( tr.hasClass('shown') ) {
		            tr.removeClass('shown');
		            //调用方法，去除折叠行
		            deleteChildRow(tr,row.data());
		            tr.addClass('shown');
		            //调用方法，添加折叠行
		            addChildRow(tr,row.data());
		        }
			 }
		 });
		 
	  //换页的时候不关闭展开的行
	  $('#riskAccountPositionCheck_table').on( 'page.dt', function () {
		  
		  setTimeout(function(){
			  var  trlist = $("#riskAccountPositionCheck_table").find("tr");  
				 for(var i=1;i<trlist.length;i++){
					//获得被点击的哪一行
					    var  tr =$(trlist[i]);  
				        var row =  $("#riskAccountPositionCheck_table").DataTable().row(tr);
				        
				        if ( tr.hasClass('shown') ) {
				            tr.removeClass('shown');
				            //调用方法，去除折叠行
				            deleteChildRow(tr,row.data());
				            tr.addClass('shown');
				            //调用方法，添加折叠行
				            addChildRow(tr,row.data());
				        }
					 }
		  });
	  });
	  
	  //更改显示条数的时候不关闭展开的行
	  $("body").delegate('#riskAccountPositionCheck_table_length div').on('change', 'select[name="riskAccountPositionCheck_table_length"]', function () {
		  var  trlist = $("#riskAccountPositionCheck_table").find("tr");  
			 for(var i=1;i<trlist.length;i++){
				//获得被点击的哪一行
				    var  tr =$(trlist[i]);  
			        var row =  $("#riskAccountPositionCheck_table").DataTable().row(tr);
			        
			        if ( tr.hasClass('shown') ) {
			            tr.removeClass('shown');
			            //调用方法，去除折叠行
			            deleteChildRow(tr,row.data());
			            tr.addClass('shown');
			            //调用方法，添加折叠行
			            addChildRow(tr,row.data());
			        }
				 }
	  });*/

});