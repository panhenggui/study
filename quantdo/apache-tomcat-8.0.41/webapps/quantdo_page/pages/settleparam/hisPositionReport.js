myapp.controller('HisPositionReportController', function ($scope, $timeout,$rootScope) {
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'	
	});
	// 调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;

	$scope.service = new com.quantdo.orgClear.service.HisPositionReportService();
	
	// 定义页面数据模型
    $scope.queryEntity = {};
    $scope.hisPositionReportDataset = [];
    $scope.hisPositionReportEntitys = [];
    $scope.productDatas = [];
    $scope.picShow = false;
    
    $scope.searchTypes = clearConstant.hisPositionReport_searchType;	//查询方式下拉框内容
    $scope.queryEntity.searchType = $scope.searchTypes[0].key;
    
    $scope.currencys = clearConstant.currencys;
    // 按钮权限
    $scope.hisPositionReport_query = isShow("hisPositionReport_query");

    // 初始化日期
    $scope.queryEntity.startSettleDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endSettleDate = clearConstant.formatDate(new Date());
    $scope.nowDate = clearConstant.formatDate(new Date());
    
    // 列头
    $scope.hisPositionReportColumns = [
        { title: "合计标题"},
        { title: "资产单元"},
		{ title: "品种"},
		{ title: "币种"},
		{ title: "总盈亏"},
		{ title: "操作"}
    ]; 
   
	// 初始化产品
    getProductByExchID(function (result) {
  	    $scope.productDatas = [];
        if(result !=undefined && result.length>0){
            $scope.productDatas = result;
            $scope.$apply();
            $("#futuresProductID").html("");
			for(var i = 0;i < $scope.productDatas.length;i++){
				$("#futuresProductID").append("<option value='"+$scope.productDatas[i].productID+"'>"+$scope.productDatas[i].productID+
					'_'+$scope.productDatas[i].productName+"</option>");
			};
	    	$("#futuresProductID").multiselect("refresh");
        }
    }, {'exchID': '', 'productID': '', 'productType': '', 'productStatus': ''});

    $("#futuresProductID").multiselect({ 
    	checkAllText: '全选',
    	uncheckAllText:'全不选',
    	noneSelectedText:'',
    	selectedList : true,
    	classes : ''
    });
    
    // 初始化所属机构
    getInstClientQueryConditionList(function(result){
    	$scope.instClientList = angular.copy(result);
    	if($scope.instClientList.length > 1){
    		$scope.queryEntity.instClientID = $scope.instClientList[0].instClientID;
    	}else{
    		$scope.queryEntity.instClientID = $scope.instClientList[0].instClientID;
    	}
    });
    
    queryInstClientID(function(result){
    	if(result != undefined){
    		$scope.noInst = true;
    	}else{
    		$scope.noInst = false;
    	}
    });
    
    $scope.queryCapitalAccounts = new Array();
    $scope.changeInstClient = function(){
		//查询资产单元
		findBySubCapitalAccountInfo({"instClientID":$scope.queryEntity.instClientID}, function(result){
			$scope.queryCapitalAccounts = [];
	        $scope.queryCapitalAccounts = result;
	        $scope.$apply();
	        // 构建多选的品种代码
	        $("#futuresSubAccountID").html("");
			for(var i = 0;i < $scope.queryCapitalAccounts.length;i++){
				$("#futuresSubAccountID").append("<option value='"+$scope.queryCapitalAccounts[i].subAccountID+"'>"+$scope.queryCapitalAccounts[i].instClientID+
					'_'+$scope.queryCapitalAccounts[i].subAccountID+'_'+$scope.queryCapitalAccounts[i].subAccountName+"</option>");
			};
	    	$("#futuresSubAccountID").multiselect("refresh");
		});
	}
    
    $("#futuresSubAccountID").multiselect({ 
    	checkAllText: '全选',
    	uncheckAllText:'全不选',
    	noneSelectedText:'',
    	selectedList : true,
    	classes : ''
    });
    
    //查询资产单元
	findBySubCapitalAccountInfo({"instClientID":$scope.queryEntity.instClientID}, function(result){
		$scope.queryCapitalAccounts = [];
        $scope.queryCapitalAccounts = result;
        $scope.$apply();
        // 构建多选的品种代码
        $("#futuresSubAccountID").html("");
		for(var i = 0;i < $scope.queryCapitalAccounts.length;i++){
			$("#futuresSubAccountID").append("<option value='"+$scope.queryCapitalAccounts[i].subAccountID+"'>"+$scope.queryCapitalAccounts[i].instClientID+
				'_'+$scope.queryCapitalAccounts[i].subAccountID+'_'+$scope.queryCapitalAccounts[i].subAccountName+"</option>");
		};
    	$("#futuresSubAccountID").multiselect("refresh");
	});
    
	// 根据页面条件查询
    $scope.find = function () {
    	if($scope.queryEntity.instClientID == "" || $scope.queryEntity.instClientID == undefined){
    		layer.msg('机构不能为空！！', {
				icon : 2
			});
    	}else if($scope.queryEntity.startSettleDate == "" || $scope.queryEntity.startSettleDate == undefined){
    		layer.msg('开始日期不能为空！！', {
				icon : 2
			});
    	}else if($scope.queryEntity.endSettleDate == "" || $scope.queryEntity.endSettleDate == undefined){
    		layer.msg('结束日期不能为空！！', {
				icon : 2
			});
    	}else if($scope.queryEntity.endSettleDate > $scope.nowDate){
    		layer.msg('结束日期不能大于当前日期！！', {
				icon : 2
			});
    	}else if($scope.queryEntity.startSettleDate > $scope.queryEntity.endSettleDate){
    		layer.msg('开始日期不能大于结束日期！！', {
				icon : 2
			});
    	}else{
    		//判断是否已结算
        	$scope.service.isSettled($scope.queryEntity.endSettleDate,function(result){
        		if(!result){
        			layer.msg('当前交易日未结算，请结算后重新打开该页面或者修改查询条件', {
        				icon : 2
        			});
        		}else{
        	    		$scope.isQuery = true; 
        	    		$scope.hisPositionReportEntitys = [];
        	            $scope.hisPositionReportDataset = [];
        	            
        	            // 合计
        	            $scope.totalProfits = 0;
        	            // 转换多选的资产单元
        	            
        	            var subAccountIDs = $("#futuresSubAccountID").multiselect("getChecked").map(function(){
        	       	   	   return this.value;    
        	       	   	}).get();

        	            if (subAccountIDs != null && subAccountIDs.length>0){
        	             	var subAccountID = subAccountIDs[0];
        	              	for (var i = 1; i < subAccountIDs.length; i++) {
        	              		subAccountID = subAccountID+","+subAccountIDs[i];
        	       			}
        	              	$scope.queryEntity.subAccountID=subAccountID;
        	            }else{
        	             	$scope.queryEntity.subAccountID = "";
        	            }
        	            if($scope.queryEntity.subAccountID == undefined){
        	             	$scope.queryEntity.subAccountID = "";
        	            }
        	            
        	            var ProductIDs = $("#futuresProductID").multiselect("getChecked").map(function(){
        	         	   return this.value;    
        	         	}).get();
        	            
        	            if (ProductIDs != null && ProductIDs.length>0){
        	             	var ProductID = ProductIDs[0];
        	              	for (var i = 1; i < ProductIDs.length; i++) {
        	              		ProductID = ProductID+","+ProductIDs[i];
        	       			}
        	              	$scope.queryEntity.productID=ProductID;
        	            }else{
        	             	$scope.queryEntity.productID = "";
        	            }
        	            if($scope.queryEntity.productID == undefined){
        	             	$scope.queryEntity.productID = "";
        	            }
        	            
        	            $scope.searchType = $scope.queryEntity.searchType;
        	            
        	            $scope.service.backPagingHisPositionReport($scope.queryEntity,function(result){
        	    			var con = result;
        	                $scope.result = con;
        	                var dataArr = new Array();
        	                for(var i=0;i<con.length;i++){
        	                	var operate1 = "<a class='details-control'></a>";
        	                    var operate2 = "<a class='update-row hPRUpdate' data-toggle='modal' data-target=''>盈亏图</a>";
        	        			var dataArr = [operate1+con[i].title,con[i].subAccountID,con[i].productID,$scope.transCurrency(con[i].currency),parseFloat(con[i].totalProfit).toFixed(2),operate2];
        	        			$scope.hisPositionReportDataset.push(dataArr);
        	        			$scope.totalProfits += parseFloat(con[i].totalProfit);
        	        			con[i].index = i+1;
        	        	    }               
        	                
        	                $scope.hisPositionReportEntitys = con;
        	                $scope.hisPositionReportTable.clear().draw();
        	    	        $scope.hisPositionReportTable.rows.add($scope.hisPositionReportDataset).draw();
        	    			$scope.$apply();
        	    			
        	    			$scope.picShow = false;
        	            });
        	            $timeout(function() {
        	                $scope.isQuery = false;
        	            }, 1000);
        		}
        	});
    	}
    };
    
    $timeout(function() {
    	$scope.find(); 
    }, 1000);
    
    //展开行
	$("body").undelegate("#hisPositionReport_dynamic_table td a.details-control","click");
	$("body").delegate("#hisPositionReport_dynamic_table td a.details-control","click",function(){
    	//获得被点击的哪一行
		var tr = $(this).parents("tr");
        var row = $scope.hisPositionReportTable.row(tr);
        if(row.data() == undefined){
        	var children = $($(this).parents("tr")).children();
        	var data = [];
        	for(var i=0;i<children.length;i++){
        		data[i] = children[i].innerHTML;
        	}
        	if ( tr.hasClass('shown') ) {
                tr.removeClass('shown');
                //调用方法，去除折叠行
                deleteChildRow(tr,data);
            }
            else {
                tr.addClass('shown');
                //调用方法，添加折叠行
                addChildRow(tr,data);
            }
        }else{
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
        }
        
    });
	
	 //点击加号，添加子行
	 function addChildRow (tr,rowData){
		var entity = $scope.hisPositionReportEntitys;
		var newRow = "";
		var temp = [];
		var flag = false;
		var id = rowData[1]+"_"+rowData[2];
		for(var i=0;i<entity.length;i++){
			var idd = entity[i].subAccountID+"_"+entity[i].productID;
			if(id==idd){
				temp = entity[i].subMap;
				flag = true;
				break;
			}
		}
		if(flag == false){
			var id = rowData[1]+"_"+rowData[2];
			for(var i=0;i<entity.length;i++){
				for(var j=0;j<entity[i].subMap.length;j++){
					var idd = entity[i].subMap[j].subAccountID+"_"+entity[i].subMap[j].productID;
					if(id==idd){
						temp = entity[i].subMap[j].subMap;
						break;
					}
				}
			}
		}
		for(var j=0;j<temp.length;j++){
			var currency = $scope.transCurrency(temp[j].currency);
			var totalProfit = parseFloat(temp[j].totalProfit).toFixed(2);
			var originalProfit = parseFloat(temp[j].originalProfit).toFixed(2);
			var title = (temp[j].title == undefined) ? "" : temp[j].title;
			if(temp[j].subMap == undefined){
				newRow = newRow+'<tr class="myHPRCheckColor" role="row" id='+id+'>'+
		        '<td class="center myfont">'+title+'</td>'+
		        '<td class="center myfont">'+temp[j].subAccountID+'</td>'+
		        '<td class="center myfont">'+temp[j].productID+'</td>'+
		        '<td class="center myfont">'+currency+'</td>'+
		        '<td class="center myfont">'+originalProfit+'</td>'+
		        '<td class="center myfont"></td></tr>';
			}else{
				newRow = newRow+'<tr class="myHPRCheckColor" role="row" id='+id+'>'+
		        '<td class="center myfont"><a class="details-control"></a>'+title+'</td>'+
		        '<td class="center myfont">'+temp[j].subAccountID+'</td>'+
		        '<td class="center myfont">'+temp[j].productID+'</td>'+
		        '<td class="center myfont">'+currency+'</td>'+
		        '<td class="center myfont">'+totalProfit+'</td>'+
		        '<td class="center myfont"><a class="update-row hPRUpdate" data-toggle="modal" data-target="#profitlossModal">盈亏图</a></td></tr>';
			}
			
		}
	    $(tr).after(newRow);
	 }
	 
	//点击减号，删除子行
	function deleteChildRow(tr,rowData){
		while ($('#'+rowData[1]+"_"+rowData[2]).length > 0)  
		{
			/*if($('#'+rowData[1]+"_"+rowData[2])[0].subMap != undefined){
				for(var i=0;i<$('#'+rowData[1]+"_"+rowData[2]).length;i++){
					$('#'+$('#'+rowData[1]+"_"+rowData[2])[i].subAccountID+"_"+$('#'+rowData[1]+"_"+rowData[2])[i].productID).remove();  
				}
			}*/
			var entity = $scope.hisPositionReportEntitys;
			var temp = [];
			var flag = false;
			var id = rowData[1]+"_"+rowData[2];
			for(var i=0;i<entity.length;i++){
				var idd = entity[i].subAccountID+"_"+entity[i].productID;
				if(id==idd){
					temp = entity[i].subMap;
					flag = true;
					break;
				}
			}
			if(flag){
				if(temp[0].subMap != undefined){
					for(var i=0;i<temp.length;i++){
						while ($('#'+temp[i].subAccountID+"_"+temp[i].productID).length > 0)  
					    {  
							$('#'+temp[i].subAccountID+"_"+temp[i].productID).remove();  
					    }   
					}
				}
			}
			$('#'+rowData[1]+"_"+rowData[2]).remove();  
		 }  
	 }
	
	 //排序的时候关闭展开的行  
	 $("body").delegate('#hisPositionReport_dynamic_table tbody').on('click', 'th', function () {
		for(var i=0;i<$scope.hisPositionReportTable.context[0].aoData.length;i++){
			var detailControl = $($scope.hisPositionReportTable.context[0].aoData[i].anCells[0]);
			var detailRow = $($scope.hisPositionReportTable.context[0].aoData[i].nTr);
			if(detailRow.hasClass('shown') ) {
				detailRow.removeClass('shown');
	            //调用方法，去除折叠行
	            deleteChildRow(detailControl,detailRow.data());
		    }
		}
	 });
	 
	 //更改显示条数的时候关闭展开的行
	 $("body").delegate('#hisPositionReport_dynamic_table_length div').on('change', 'select[name="hisPositionReport_dynamic_table_length"]', function () {
		for(var i=0;i<$scope.hisPositionReportTable.context[0].aoData.length;i++){
			var detailControl = $($scope.hisPositionReportTable.context[0].aoData[i].anCells[0]);
			var detailRow = $($scope.hisPositionReportTable.context[0].aoData[i].nTr);
			if(detailRow.hasClass('shown') ) {
				detailRow.removeClass('shown');
	            //调用方法，去除折叠行
	            deleteChildRow(detailControl,detailRow.data());
		    }
		}
	 });
	 
	 //换页的时候关闭展开的行
	 $('#hisPositionReport_dynamic_table').on( 'page.dt', function () {
		 for(var i=0;i<$scope.hisPositionReportTable.context[0].aoData.length;i++){
			 var detailControl = $($scope.hisPositionReportTable.context[0].aoData[i].anCells[0]);
			 var detailRow = $($scope.hisPositionReportTable.context[0].aoData[i].nTr);
			 if(detailRow.hasClass('shown') ) {
				 detailRow.removeClass('shown');
	             //调用方法，去除折叠行
	             deleteChildRow(detailControl,detailRow.data());
		     }
		 }
	 });
	 
	/*//在页面上进行的所有单击操作都不折叠已经展开的行
	$("body").delegate('#hisPositionReport_dynamic_table_length').on('click', function () {
		setTimeout(function(){
			var trlist = $("#hisPositionReport_dynamic_table").find("tr");  
			for(var i=1;i<trlist.length;i++){
				//获得被点击的哪一行
				var  tr =$(trlist[i]);  
				var row =  $("#hisPositionReport_dynamic_table").DataTable().row(tr);
				if(row.data() == undefined){
					var children = $($(this).parents("tr")).children();
			        var data = [];
			        for(var i=0;i<children.length;i++){
			        	data[i] = children[i].innerHTML;
			        }
			        if ( tr.hasClass('shown') ) {
						tr.removeClass('shown');
					    //调用方法，去除折叠行
					    deleteChildRow(tr,data);
					    tr.addClass('shown');
					    //调用方法，添加折叠行
					    addChildRow(tr,data);
					}
			    }else{
			    	if ( tr.hasClass('shown') ) {
						tr.removeClass('shown');
						//调用方法，去除折叠行
						deleteChildRow(tr,row.data());
						tr.addClass('shown');
						//调用方法，添加折叠行
						addChildRow(tr,row.data());
					}
			    }        
			}
		});
	 });*/
	 

    $scope.transInstClientID = function(instClientID){
    	for(var i=0;i<$scope.instClientList.length;i++){
			if($scope.instClientList[i].instClientID == instClientID){
				return $scope.instClientList[i].instClientName;
			}
		}
    }
    
    $scope.transInstClientName = function(instClientName){
    	for(var i=0;i<$scope.instClientList.length;i++){
			if($scope.instClientList[i].instClientName == instClientName){
				return $scope.instClientList[i].instClientID;
			}
		}
    }
    
    $scope.transCurrency = function(key){
    	for(var i=0;i<$scope.currencys.length;i++){
			if($scope.currencys[i].key == key){
				return $scope.currencys[i].text;
			}
		}
    }
    
    //初始化
    $(document).ready(function() {
	    //会话列表初始化
    	$scope.hisPositionReportTable = $('#hisPositionReport_dynamic_table').DataTable( {
    		data : $scope.hisPositionReportDataset,
        	columns :$scope.hisPositionReportColumns,
//        	scrollY: 300,
//          scrollX: true,
            dom: 'rt<"bottom"iplB>',
			buttons: [
			],
			footerCallback: function () {
                var api = this.api();
                if($scope.totalProfits == undefined || $scope.totalProfits == null || $scope.totalProfits == ""){
                	$scope.totalProfits = 0;
                }
 			   	$( api.column( 4 ).footer() ).html(parseFloat($scope.totalProfits).toFixed(2));
    	    }
        });
    });
 
    // 折线图
	// 横轴数据
    $scope.xdata = [];
	// 纵轴数据
	$scope.ydata = [];
	$scope.name = ['总盈亏'];
	
	// 点击盈亏图出现图表
    $("body").undelegate("#hisPositionReport_dynamic_table .update-row","click");
    $("body").delegate("#hisPositionReport_dynamic_table .update-row","click",function(event){
 	    var mytr = $(this).parents('tr');
 		var table = $("#hisPositionReport_dynamic_table").DataTable();
 	    if(table.row(mytr).data() == undefined){
	       	var children = $($(this).parents("tr")).children();
	       	var tempArr = [];
	       	for(var i=0;i<children.length;i++){
	       		tempArr[i] = children[i].innerHTML;
	       	}
 	    }else{
 	    	var tempArr = table.row(mytr).data();
 	    }
 	    $scope.picShow = true;
 	    /*// 转换多选的资产单元
 	    var subAccountIDs = $("#futuresSubAccountID").multiselect("getChecked").map(function(){
   	   	   return this.value;    
   	   	}).get();

        if (subAccountIDs != null && subAccountIDs.length>0){
         	var subAccountID = subAccountIDs[0];
          	for (var i = 1; i < subAccountIDs.length; i++) {
          		subAccountID = subAccountID+","+subAccountIDs[i];
   			}
          	$scope.queryEntity.subAccountID=subAccountID;
        }else{
         	$scope.queryEntity.subAccountID = "";
        }
        if($scope.queryEntity.subAccountID == undefined){
         	$scope.queryEntity.subAccountID = "";
        }
        
        var ProductIDs = $("#futuresProductID").multiselect("getChecked").map(function(){
        	return this.value;    
    	}).get();
        
        if (ProductIDs != null && ProductIDs.length>0){
         	var ProductID = ProductIDs[0];
          	for (var i = 1; i < ProductIDs.length; i++) {
          		ProductID = ProductID+","+ProductIDs[i];
   			}
          	$scope.queryEntity.productID=ProductID;
        }else{
         	$scope.queryEntity.productID = "";
        }
        if($scope.queryEntity.productID == undefined){
         	$scope.queryEntity.productID = "";
        }*/
 	    $scope.queryEntity.subAccountID = tempArr[1];
 	    $scope.queryEntity.productID = tempArr[2];
       
 	    $scope.$apply();
 	    $scope.service.findHisPositionReportChart(function(result){
 	    	if($scope.queryEntity.startSettleDate == "" || $scope.queryEntity.startSettleDate == undefined){
 	    		layer.msg('开始日期不能为空！！', {
 					icon : 2
 				});
 	    	}else if($scope.queryEntity.endSettleDate == "" || $scope.queryEntity.endSettleDate == undefined){
 	    		layer.msg('结束日期不能为空！！', {
 					icon : 2
 				});
 	    	}else if($scope.queryEntity.endSettleDate > $scope.nowDate){
 	    		layer.msg('结束日期不能大于当前日期！！', {
 					icon : 2
 				});
 	    	}else if($scope.queryEntity.startSettleDate > $scope.queryEntity.endSettleDate){
 	    		layer.msg('开始日期不能大于结束日期！！', {
 					icon : 2
 				});
 	    	}else{
 	 	        var len = result.length;
 	 	        $scope.xdata = [];
 	 	        $scope.ydata = [];
 	 	        for(var i=0;i<result.length;i++){
 	 	        	$scope.xdata.push(result[i].settleDate);
 	 	        	$scope.ydata.push(result[i].totalProfit);
 	 	        }
 	 	        $scope.showChart($scope.name,$scope.xdata,$scope.ydata,tempArr);
 	 	        $("#profitlossModal").modal("show");
 	    	}
 	    },$scope.queryEntity)
 	    
    });
    
    $scope.showChart = function(name,xdata,ydata,tempArr){
	    $('#hisPositionReport_container').highcharts({
	        chart: {
	            type: 'line'
	        },
	        legend: {
	            align: 'left',
	            verticalAlign: 'top',
	            x: 0,
	            y: 100
	        },
	        title: {
	            text: "盈亏图"
	        },
	        xAxis: {
	            categories: xdata
	        },
	        yAxis: {
	            title: {
	                text: ''
	            },
//	            min : 0,
//				max : 2,
//				tickPositions :[0,0.5,1,1.5,2],
//	            tickInterval: 0.1  // 自定义y轴的间距
	        },
	        tooltip: {
	            shared: true
	        },
	        plotOptions: {
	            line: {
	                dataLabels: {
	                    enabled: true          // 开启数据标签
	                },
	                enableMouseTracking: true, // 关闭鼠标跟踪，对应的提示框、点击事件会失效
	                allowOverlap: true         // 允许数据标签重叠
	            }
	        },
	        series: [{name: name,data: ydata,color:'#FF6600'}]
	    });
    }
    
    function getAllDate(startTime,endTime){
    	var arr = [];
    	var startTime1 = getDate(startTime);
        var endTime1 = getDate(endTime);
        while((endTime1.getTime()-startTime1.getTime())>=0){
          var year = startTime1.getFullYear().toString();
          var month = startTime1.getMonth()<=8?"0"+(startTime1.getMonth()+1).toString():(startTime1.getMonth()+1).toString();
          var day = startTime1.getDate().toString().length==1?"0"+startTime1.getDate().toString():startTime1.getDate().toString();
          startTime1.setDate(startTime1.getDate()+1);
          arr.push(year+month+day);
        }
        return arr;
    }
    
    // 获取2日期间的所有日期
    function getDate(datestr){
    	  var date = new Date(datestr.substring(0,4),datestr.substring(4,6)-1,datestr.substring(6,8));
    	  return date;
    }
});
