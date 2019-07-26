myapp.controller('ProjectBriefController', function ($scope, $timeout,$rootScope) {
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'	
	});
	
    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$scope.queryEntity={
	     		beginDate:"",
	     		endDate:"",
	     		productID:"",
	     		productType:""};
	$scope.productTypes = clearConstant.productTypes;
    
    $scope.nowDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.beginDate = $scope.nowDate;
    $scope.queryEntity.endDate = $scope.nowDate;
    
    $scope.projectBrief_query = isShow("projectBrief_query");

    // 重置
    $scope.reset = function(){
    	$scope.queryEntity = {};
    	$scope.queryEntity.beginDate = $scope.nowDate;
        $scope.queryEntity.endDate = $scope.nowDate;
    }
    //-------------------------------------------
    $scope.tmpQuery = {};
    
    $scope.queryAllProjectBrief = function ( opts ) {
        return function ( request, drawCallback, settings ) {        	
            var ajax          = false;
            var requestStart  = request.start;
            var drawStart     = request.start;
            var requestLength = request.length;
            var requestEnd    = requestStart + requestLength;
            var page = drawStart/requestLength + 1;
            // 获取settings中默认排序内容
            //$scope.orderType = settings.aaSorting[0][0];
            var orderT = settings.aaSorting[0][1];
            
            if(orderT == "asc"){
                $scope.orderWay = 1;
            }else{
                $scope.orderWay = 2;
            }
                request.start = requestStart;
                var requestParams = {
                    "pageNo":page,
                    "pageSize":requestLength
                }
//                queryAllHisFundNet($scope.queryEntity, requestParams, $scope.orderType, $scope.orderWay, function(result){
//                    var con = result.content;
//                    $scope.temEntitys = result.content;
//                    $scope.result = con;
//                    var tempArray = new Array();
//                    var operate = "";
//                    
//                    for(var i = 0; i<con.length;i++){
//                    	$scope.temEntity=con[i];
//                    	$scope.temIndex=i;
//	                	/*var tempArr = [con[i].id,con[i].settleDate,  con[i].instClientName,con[i].shortProductName,
//	                	               parseFloat(con[i].fundNetValue).toFixed(3),parseFloat(con[i].unitNetValue).toFixed(4),  con[i].fundProductQuota,
//	                                   operate,            con[i].operateDate,   con[i].operateTime,
//	                                   con[i].instClientID ,con[i].fundProductID,con[i].netDate ,con[i].netTime];*/
//                    	var tempArr = [];
//	                    tempArray.push(tempArr);
//                    }
//                    var json = {
//                        "draw":request.draw,
//                        "recordsTotal":result.totalRecord,
//                        "recordsFiltered":result.totalRecord,
//                        "data":tempArray,
//                        "column":[9]
//                    }
//                    drawCallback( json );
//                });
                
                var tempArray = new Array();
                var operate = "<a class='update-row' data-toggle='modal' data-target='#pictureModal'>详细</a>";
//                var operate = "<a class='update-row'>详细</a>";

                var tempArr = ['1','20170502','IF','','0.13%','2.12%','1.02%',operate,'20000000','10%'];
                tempArray.push(tempArr);
                var json = {
                        "draw":request.draw,
                        "recordsTotal":0,
                        "recordsFiltered":0,
                        "data":tempArray,
                        "column":[9]
                    }
                    drawCallback( json );
        }
    };
    
    $("body").undelegate("#ProjectBrief_dynamic_table_wrapper td .update-row","click");

    $("body").delegate("#ProjectBrief_dynamic_table_wrapper td .update-row","click",function(){
    	  $scope.showPicture();
    	  $timeout(function() {
		  $("#pictureModal").modal("show");
		}, 1000);
    	 
    });

	 //初始化
	$(document).ready(function() {
		initPage();
	});
	
	function initPage(){
		//会话列表初始化
		var hisFundNetTable = $('#ProjectBrief_dynamic_table').DataTable( {
		   	columns :[
		   	            { title: "序号"},
		 				{ title: "交易日期" },
		 				{ title: "品种" },
		 				{ title: "类型" },
		 				{ title: "昨日浮动" },
		 				{ title: "浮动盈亏" },
		 				{ title: "交易盈亏" },
		 				{ title: "2017年变动" },
		 				{ title: "投资标的资产额" },
		 				{ title: "该标的占总资产额比例(%)" }
		 			
		 	],
		    "processing": true,
		    "serverSide": true,
		    footerCallback: function () {
		    	var api = this.api();
	            $(api.column( 4 ).footer()).html(0);
				$(api.column( 5 ).footer()).html(0);
				$(api.column( 6 ).footer()).html(0);
				$(api.column( 7 ).footer()).html(0);
				$(api.column( 8 ).footer()).html(0);
				$(api.column( 9 ).footer()).html(0);
	       	},
		    dom: 'rt<"bottom"iplB>',
		    buttons: [],
		    "bFilter": false,
		    "ajax": $scope.queryAllProjectBrief({}),
			"scrollX": true
		});
	}
	
	//查询(后台分页)
	$scope.find = function(queryEntity){
		 $scope.isQuery = true;
	
	     $scope.tmpQuery=angular.copy(queryEntity);
		 if($scope.tmpQuery.beginDate > $scope.tmpQuery.endDate){
		 		layer.msg('开始日期不能大于结束日期！！', {
						icon : 2
					});
		 		$timeout(function() {
		             $scope.isQuery = false;
		         }, 1000);
				return false;
		 	}
	 	 $scope.queryEntity=angular.copy($scope.tmpQuery);
		 var table = $('#ProjectBrief_dynamic_table').DataTable();
	     table.draw();
	     $timeout(function() {
	   	    $scope.isQuery = false;
		 }, 500);
	}
	
	// 折线图
	// 横轴数据
	$scope.xdata = [];
	// 纵轴数据
	$scope.ydata = [];
	$scope.name = '维科';
	$scope.showChart = function(name,xdata,ydata){
			if($scope.queryEntity.beginDate == $scope.queryEntity.endDate){
				var chartTitle = $scope.queryEntity.beginDate + '的单位净值走势';
			}else{
				var chartTitle = $scope.queryEntity.beginDate + '-' + $scope.queryEntity.endDate + '期间的单位净值走势';
			}
		  	$scope.picShow = true;
		    $('#projectBrief_container').highcharts({
		        chart: {
		            type: 'line'
		        },
		        title: {
		            text: chartTitle
		        },
//		        subtitle: {
//		            text: '数据来源: www.highcharts.com'
//		        },
		        xAxis: {
		        	type: 'datetime',
	                dateTimeLabelFormats: {
	                    minute: '%H:%M',
	                },
		            categories: xdata
		        },
		        yAxis: {
		            title: {
		                text: ''
		            },
//		            min : 0,
//					max : 2,
					tickPositions :[0,0.5,1,1.5,2],
//		            tickInterval: 0.1  // 自定义y轴的间距
		        },
		        plotOptions: {
		            line: {
		                dataLabels: {
		                    enabled: true          // 开启数据标签
		                },
		                enableMouseTracking: false // 关闭鼠标跟踪，对应的提示框、点击事件会失效
		            }
		        },
//		        tooltip: {
//	                shared: true,
//	                useHTML: true,
//	                headerFormat: '<small>{point.key}</small><table>',
//	                pointFormat: '<tr><td style="color: {series.color}"></td>' +
//	                '<td style="text-align: right"><b>{point.y}</b></td></tr>',
//	                footerFormat: '</table>',
//	                valueDecimals: 2,
//	            },
		        series: [{
		            name: name,
		            data: ydata
		        }]
		    });
	}
	
	 //隐藏状态图
    $scope.hidePicture = function(){
        $scope.picShow = false;
    }
    // 显示折线图
    $scope.showPicture = function(){
    	if($scope.queryEntity.beginDate == "" || $scope.queryEntity.beginDate == undefined){
    		layer.msg('开始日期不能为空！！', {
				icon : 2
			});
    	}else if($scope.queryEntity.endDate == "" || $scope.queryEntity.endDate == undefined){
    		layer.msg('结束日期不能为空！！', {
				icon : 2
			});
    	}else if($scope.queryEntity.endDate > $scope.nowDate){
    		layer.msg('结束日期不能大于当前日期！！', {
				icon : 2
			});
    	}else if($scope.queryEntity.beginDate > $scope.queryEntity.endDate){
    		layer.msg('开始日期不能大于结束日期！！', {
				icon : 2
			});
    	}else{
    		$scope.xdata = getAllDate($scope.queryEntity.beginDate,$scope.queryEntity.endDate);
        	var len = $scope.xdata.length;
        	$scope.ydata.splice(len);
        	$scope.ydata = []
        	for(var i=0;i<len;i++){
        		// 随机数
//        		$scope.ydata.push(Number(parseFloat(Math.random()*-1+Math.random()).toFixed(4)));
        		$scope.ydata.push(Number(parseFloat((Math.random()+i)*(1/len)+0.5).toFixed(2)));

        	}
        	$scope.showChart($scope.name,$scope.xdata,$scope.ydata);
    	}
    }
    
    function getAllDate(startTime,endTime){
    	var arr = [];
    	var startTime = getDate(startTime);
        var endTime = getDate(endTime);
        while((endTime.getTime()-startTime.getTime())>=0){
          var year = startTime.getFullYear();
          var month = startTime.getMonth().toString().length==1?"0"+startTime.getMonth().toString():startTime.getMonth();
          var day = startTime.getDate().toString().length==1?"0"+startTime.getDate():startTime.getDate();
          startTime.setDate(startTime.getDate()+1);
          arr.push(year+month+day);
        }
        return arr;
    }
    
    // 获取2日期间的所有日期
    function getDate(datestr){
    	  var date = new Date(datestr.substring(0,4),datestr.substring(4,6),datestr.substring(6,8));
    	  return date;
    }
    
//  //字符串转日期格式，strDate要转为日期格式的字符串
//    function getDate(strDate){
//      var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/, 
//       function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
//      return date;
//    }
});

