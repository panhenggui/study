myapp.controller('dailySettleController', function ($scope, $rootScope, $timeout, $interval) {
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});
    $scope.settleDate = clearConstant.formatDate(new Date());
    //$scope.nextSettleDate = clearConstant.formatDate(new Date());
    $scope.progress = false;
    $scope.iserror = false;
    $scope.currStatus = '';
    $scope.statusIndex = -1;
    
	$scope.isEven = false;
	$scope.isOdd = true;
    
    $scope.dailySettle_settle = isShow("dailySettle_settle");
    $scope.dailySettle_audit = isShow("dailySettle_audit");
    $scope.dailySettle_capitalAudit = isShow("dailySettle_capitalAudit");
    $scope.dataToTrade_audit = isShow("dailySettle_outSideaudit");
    
    $scope.isPosition1 = false;
    $scope.isPosition2 = false;
    $scope.isCapital = false;
    $scope.outSidePositionAuditFlag = false;
    $scope.dailySettle = true;
    
    $scope.audit = function(flag){
    	$scope.isPosition1 = false;
        $scope.isPosition2 = false;
        $scope.isCapital = false;
        $scope.dailySettle = false;
    	$scope.positionAuditDataset = [];
    	$scope.positionAuditCapDataset = [];
    	$scope.positionAuditSubDataset = [];
    	auditAfterDailySettle(flag, function(result){
            if(undefined == result || null == result || result.length == 1){
                layer.msg("当前没有数据参与稽核，无稽核结果展示！", {icon: 2, time: 3000});
                $scope.listEntitys = [];
            }
    		$scope.listEntitys = result;
    		if(result[0].TradeToSettle == 1){
    			$scope.isPosition1 = true;
    			result.splice(0,1);
    			/*for(var i = 0;i < $scope.listEntitys.length;i++){
				if(i % 2 == 0){
					$scope.listEntitys[i].isOdd = true;
					$scope.listEntitys[i].isEven = false;
				}
				else{
					$scope.listEntitys[i].isOdd = false;
					$scope.listEntitys[i].isEven = true;
				}
				$scope.$apply();
				};*/
    			for(var i=0;i<result.length;i++){
        			$scope.listEntitys[i].capStr = ""; // 结算稽核修改资金账号显示
        			for(var j=0;j<result[i].cap.length-1;j++){
        				$scope.listEntitys[i].capStr += $scope.listEntitys[i].cap[j] + " , "; 
        			}
        			$scope.listEntitys[i].capStr += $scope.listEntitys[i].cap[j];
        			
        			$scope.listEntitys[i].subCapStr = ""; // 结算稽核修改资产单元显示
                    if(result[i].subCap.length != 0){
                        for(j=0;j<result[i].subCap.length-1;j++){
                            $scope.listEntitys[i].subCapStr += $scope.listEntitys[i].subCap[j] + " , ";
                        }
                        $scope.listEntitys[i].subCapStr += $scope.listEntitys[i].subCap[j];
                    }
        		}	
        		
        		var con = result;
                for(var i = 0; i<con.length;i++){
                    var tempArr = [(i+1),con[i].exch,con[i].capStr,con[i].subCapStr,con[i].instrumentid,con[i].details,con[i].pass];
    	            $scope.positionAuditDataset.push(tempArr);
    	            con[i].index = tempArr[0];
                }
                $scope.listEntitys = con;
                //重新绘表
                $scope.positionAuditTable.clear().draw();
                $scope.positionAuditTable.rows.add($scope.positionAuditDataset).draw();
        		$scope.$apply();
        		$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
        		//给稽核结果加上颜色
        		for(var i=0;i<result.length;i++){
        			if(result[i].pass == "1"){
        				$($("#positionAudit_dynamic_table tr")[i+1]).css('color','green');
        			}else if(result[i].pass == "0"){
        				$($("#positionAudit_dynamic_table tr")[i+1]).css('color','red');
        			}
        		}
    		}else if(result[0].settleToSettle == 2){
    			$scope.isPosition2 = true;
    			result.splice(0,1);
    			var con = result;
                for(var i = 0; i<con.length;i++){
                	if(con[i].subAccountID == undefined){
                		var tempArr = [(i+1),con[i].settleDate,con[i].instClientID,con[i].innerAccountID,con[i].exchID,con[i].instrumentID,
                		    $scope.transHedgeFlag(con[i].hedgeFlag),con[i].buyPosition,con[i].sellPosition,con[i].position];
        	            $scope.positionAuditCapDataset.push(tempArr);
        	            con[i].index = tempArr[0];
                	}else{
                		var tempArr = [(i+1),con[i].settleDate,con[i].instClientID,con[i].innerAccountID,con[i].subAccountID,con[i].exchID,con[i].instrumentID,
                			$scope.transHedgeFlag(con[i].hedgeFlag),con[i].buyPosition,con[i].sellPosition,con[i].position];
                   	    $scope.positionAuditSubDataset.push(tempArr);
                   	    con[i].index = tempArr[0];
                	}
                }
                $scope.listEntitys = con;
                //重新绘表
                $scope.positionAuditCapTable.clear().draw();
                $scope.positionAuditCapTable.rows.add($scope.positionAuditCapDataset).draw();
                $scope.positionAuditSubTable.clear().draw();
                $scope.positionAuditSubTable.rows.add($scope.positionAuditSubDataset).draw();
        		$scope.$apply();
        		$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    		}
    	});
    }
    
    $('#positionAudit_dynamic_table').on( 'page.dt', function () {
    	if($scope.isPosition1 == true){
    		$timeout(function() {
        		var trArr = $("#positionAudit_dynamic_table tr");
        		for(var i=1;i<trArr.length;i++){
        			var tempArr = $scope.positionAuditTable.row(trArr[i]).data();
        			if(tempArr[6] == "1"){
        				$($("#positionAudit_dynamic_table tr")[i]).css('color','green');
        			}else if(tempArr[6] == "0"){
        				$($("#positionAudit_dynamic_table tr")[i]).css('color','red');
        			}
        		}
        	},100);
    	}
    });
    
    //更改显示条数的时候修改颜色
	$("body").delegate('#positionAudit_dynamic_table_length div').on('change', 'select[name="positionAudit_dynamic_table_length"]', function () {
		if($scope.isPosition1 == true){
    		$timeout(function() {
        		var trArr = $("#positionAudit_dynamic_table tr");
        		for(var i=1;i<trArr.length;i++){
        			var tempArr = $scope.positionAuditTable.row(trArr[i]).data();
        			if(tempArr[6] == "1"){
        				$($("#positionAudit_dynamic_table tr")[i]).css('color','green');
        			}else if(tempArr[6] == "0"){
        				$($("#positionAudit_dynamic_table tr")[i]).css('color','red');
        			}
        		}
        	},100);
    	}
	});
    
    $scope.capitalAudit = function(){
    	$scope.isPosition1 = false;
        $scope.isPosition2 = false;
        $scope.isCapital = true;
        $scope.dailySettle = false;
    	$scope.capitalAuditDataset = [];
    	capitalAuditAfterDailySettle(function(result){
    		$scope.listEntitys = result;
    		var tempArray = new Array();
    		tempArray = ["总手续费",result.tradeFee[0],result.tradeFee[1],result.tradeFee[2]];
    		$scope.capitalAuditDataset.push(tempArray);
    		tempArray = ["权利金收支",result.premium[0],result.premium[1],result.premium[2]];
    		$scope.capitalAuditDataset.push(tempArray);
    		tempArray = ["当日盈亏",result.dailyProfit[0],result.dailyProfit[1],result.dailyProfit[2]];
    		$scope.capitalAuditDataset.push(tempArray);
    		$scope.capitalAuditTable.clear().draw();
            $scope.capitalAuditTable.rows.add($scope.capitalAuditDataset).draw();
    		$scope.$apply();

    		if(result.dailyProfit[2] != 0){
    			$($($($("#capitalAudit_dynamic_table tr")[1])).children()[3]).css('color','red');
    		}
    		if(result.tradeFee[2] != 0){
    			$($($($("#capitalAudit_dynamic_table tr")[2])).children()[3]).css('color','red');
    		}
    		if(result.premium[2] != 0){
    			$($($($("#capitalAudit_dynamic_table tr")[3])).children()[3]).css('color','red');
    		}
    	});
    	
    }
    
    $scope.transHedgeFlag = function(key){
		if(key=="1"){
			return "投机";
		}else if(key=="2"){
			return "套利";
		}else if(key=="3"){
			return "套保";
		}else if(key=="4"){
			return "做市商";
		}else{
			return "";
		}
	};
    
    //定义持仓稽核列头
    $scope.positionAudit_columns = [
        {title: "序号"},
        {title: "所属机构"},
        {title: "资金账号"},
        {title: "资产单元"},
        {title: "合约"},
        {title: "详情"},
        {title: "通过",visible:false}
    ]; 
    
    $scope.positionAuditCap_columns = [
    	{title: "序号"},
    	{title: "结算日期"},
        {title: "所属机构"},
        {title: "资金账号"},
        {title: "交易所代码"},
        {title: "合约代码"},
        {title: "交易类型"},
        {title: "买持仓量"},
        {title: "卖持仓量"},
        {title: "净持仓量"}
    ];  
    $scope.positionAuditSub_columns = [
    	{title: "序号"},
        {title: "结算日期"},
        {title: "所属机构"},
        {title: "资金账号"},
        {title: "资产单元"},
        {title: "交易所代码"},
        {title: "合约代码"},
        {title: "交易类型"},
        {title: "买持仓量"},
        {title: "卖持仓量"},
        {title: "净持仓量"}
    ];  
    
    //定义资金稽核列头
    $scope.capitalAudit_columns = [
        {title: ""},
        {title: "资金账号累计"},
        {title: "资产单元累计"},
        {title: "差额"}
    ];  
    
    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.positionAuditTable = $('#positionAudit_dynamic_table').DataTable( {
    		data : $scope.positionAuditDataset,
        	columns :$scope.positionAudit_columns,
            dom: 'rt<"bottom"iplB>',
			buttons: []
        });
    	
    	$scope.positionAuditCapTable = $('#positionAuditCap_dynamic_table').DataTable( {
    		data : $scope.positionAuditCapDataset,
        	columns :$scope.positionAuditCap_columns,
            dom: 'rt<"bottom"iplB>',
			buttons: []
        });
    	
    	$scope.positionAuditSubTable = $('#positionAuditSub_dynamic_table').DataTable( {
    		data : $scope.positionAuditSubDataset,
        	columns :$scope.positionAuditSub_columns,
            dom: 'rt<"bottom"iplB>',
			buttons: []
        });
    	
    	$scope.capitalAuditTable = $('#capitalAudit_dynamic_table').DataTable( {
    		data : $scope.capitalAuditDataset,
        	columns :$scope.capitalAudit_columns,
            dom: 'rt<"bottom"iplB>',
			buttons: []
        });
    });
    
    //结算状态
    $scope.settleStatus = [
        {text: '结算前', key: '1'},
        {text: '结算处理', key: '2'},
        {text: '结算完成', key: '3'}
    ];
    
	getNextTradeDate($scope.settleDate, function (errCode, errMsg, result) {
		
		if (errCode != 0) {
			
			layer.msg(errMsg, {icon: 2, time: 10000});
		}
		else {
			
			$scope.nextSettleDate = result;
			$scope.$apply();
		}
		
	});
    //改变下一个交易日
    $scope.changeNextTradeDate = function () {
    	
    	var settleDate =$scope.settleDate;
    	
    	getNextTradeDate(settleDate, function (errCode, errMsg, result) {
    		if (errCode != 0) {
    			layer.msg(errMsg, {icon: 2, time: 10000});
    		}
    		else {
    			$scope.nextSettleDate = result;
    			$scope.$apply();
    		}
            $scope.findSettleStepDetail($scope.settleDate);
    	});


    };
    
    //开始日终清算
    $scope.settle = function (object, object1) {
    	$scope.isPosition1 = false;
        $scope.isPosition2 = false;
        $scope.isCapital = false;
    	$scope.progress = true;
    	//$scope.settleDate = clearConstant.formatDate($scope.settleDate);
    	var settleDate =$scope.settleDate;
    	var nextSettleDate = $scope.nextSettleDate;
    	
    	if (settleDate ==""){
    		$scope.progress = false;
    		layer.msg("结算日期不能为空!", {icon: 2, time: 3000});
        	return false;
    	}
    	
    	if (nextSettleDate <= settleDate) {
    		$scope.progress = false;
    		layer.msg("下一交易日必须要大于当前结算日!", {icon: 2, time: 3000});
        	return false;
    	}
    	$scope.iserror = false;
    	dailySettle(settleDate, nextSettleDate, function (errCode, errMsg) {
    		
    		if (errCode != 0) {
    			$scope.progress = false;
    			$scope.iserror = true;
    			$scope.$apply();
    			layer.confirm(errMsg, {icon: 2}, function (count) {layer.close(count);});
    			return false;
    		}
    		
    	});    	
    	
    	$timeout(function(){
    		var statusInterval = setInterval(function () {
	       		 //获取当前结算状态
	       		$scope.currStatus = '';
	       		findCurrStatus(function (result) {
	           		$scope.currStatus = result.settleStatus;
	           		$scope.statusIndex = parseInt($scope.currStatus) - 1;
	           		if ($scope.currStatus == $scope.settleStatus[2].key && ! $scope.iserror) {
	           			
	           			$scope.progress = false;
	           			layer.alert("日终结算成功!", {icon: 1, time: 3000});			
	           			$scope.$apply();
	           			clearInterval(statusInterval);
	           		}
	           		
	           		if ($scope.iserror) {
	           			$scope.progress = false;
	           			$scope.$apply();
	           			clearInterval(statusInterval);
	           		}
	           		$scope.$apply();
	           	}, $scope.settleDate);
    		}, 2000);
    	},2000);
    	
    }




/*****************************************修改结算界面流程************************************************/
$scope.queryFlag = true;

//定义持仓稽核列头
    $scope.dailySettle_columns = [
        {title: "stepCode", visible:false},
        {title: "状态", width:"8%"},
        {title: "菜单", width:"20%"},
        {title: "日志信息", width:"40%"},
        {title: "调整菜单", width:"20%"},
        {title: "操作", width:"8%"},
        {title: "结果", width:"8%"}
    ];


    $scope.dailySettleDataset = [];


    //初始化
    $(document).ready(function() {
        //会话列表初始化
        $scope.dailySettleTable = $('#dailySettle_dynamic_table').DataTable( {
            'searching':false, //去掉搜索框
            'data':$scope.dailySettleDataset,
            'columns':$scope.dailySettle_columns,
            'destroy':true,
            'retrieve': true,
            'paging': false,
            'stateSave':true,
            'ordering': false,
            'scrollCollapse':true,
            'scrollX':true,
            'info':false,
            'dom': '<"top">rt<"bottom"pl>',
            "pagingType":"full_numbers",
            'scrollY':true,
            "createdRow": function (row, data, dataIndex) {
                $(row).children('td').eq(1).attr('style', 'text-align: left;');
                $(row).children('td').eq(2).attr('style', 'text-align: left;');
                $(row).children('td').eq(3).attr('style', 'text-align: left; cursor:pointer;');
            },
            "bLengthChange":false
        });
    });

    $scope.buttonName = "开始结算";
    $scope.isContinue = "0";//开始结算
    $scope.findSettleStepDetail = function(settleDate){
        if(!$scope.queryFlag){
            return;
        }
        $scope.queryFlag = false;
        getDailyStepDetail(settleDate, function(result){
            var con = result.RESULT_LIST;
            $scope.progress_result =  result.RESULT_PROGRESS;
            $("#settle_progress_id")[0].style.width = $scope.progress_result + "%";

            $scope.dailySettleDataset = new Array();
            $scope.settleStepListEntitys = result.RESULT_LIST;
            for(var i = 0; i<con.length;i++){
				var executeStatus = "";
				if(i == 0){
				    if(con[i].executeStatus != 0){
                        $scope.buttonName = "继续结算";
                        $scope.isContinue = "1";
                    }else{
                        $scope.buttonName = "开始结算";
                        $scope.isContinue = "0";
                    }
                }
                if( i == con.length - 1 && con[i].executeResult == '1'){
                    $scope.buttonName = "重新结算";
                    $scope.isContinue = "2";
                }
				if(con[i].executeStatus == "0"){
                    executeStatus = "<span class=\"label label-white middle\">未 执 行</span>"
				}else if(con[i].executeStatus == "1"){
                    executeStatus = "<span class=\"label label-warning label-black middle\">执 行 中</span>";
				}else{
					executeStatus = "<span class=\"label btn-success label-black bigger\">已 完 成</span>"
				}

				var executeResult = "";
				if(con[i].executeResult == "1"){
					executeResult = "<span class=\"label btn-success label-black big\">通   过</span>"
				}else if(con[i].executeResult == "2"){
                    executeResult = "<span class=\"label label-danger label-black big\">失   败</span>"
				}
				var operate = "";
				if(con[i].runFlag == "0"){
                    operate = "<a class='update-row' style='width:100%' data-toggle='modal' data-target='#singleEdgeProductGroupModal'>开始执行</a>";
				}else if(con[i].runFlag == "1"){
                    operate = "<a class='update-row' style='width:100%' data-toggle='modal' data-target='#singleEdgeProductGroupModal'>继续执行</a>";
				}else if(con[i].runFlag == "2"){
                    operate = "<a class='delete-row' style='width:100%' data-toggle='modal' data-target='#singleEdgeProductGroupModal'>重新执行</a>";
				}
				var handleMenu = ""
				if(null != con[i].handleMenu && "" != con[i].handleMenu){
					var array = con[i].handleMenu.split(",");
                    handleMenu = "<a class='toMenu-row' style='width:100%' data-toggle='modal' data-target='#singleEdgeProductGroupModal'>"+array[2]+"</a>";
				}
                var tempArr = [con[i].stepCode, executeStatus, con[i].stepName, con[i].remark, handleMenu , operate, executeResult];
                $scope.dailySettleDataset.push(tempArr);
            }
            //重新绘表
            $scope.dailySettleTable.clear().draw();
            $scope.dailySettleTable.rows.add($scope.dailySettleDataset).draw();
            $scope.$apply();
            $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
            $scope.queryFlag = true;
		});
	}

    function toMenu(submenu,topmenu,name,ctrl,partial){
        $rootScope.addPane(submenu,topmenu,name,ctrl,partial);
    }



    $scope.findSettleStepDetail($scope.settleDate);


    $scope.queryLog = false;
    $scope.canSettle = false;
    $("body").undelegate("#dailySettle_dynamic_table_wrapper td .update-row", "click");
    $("body").delegate("#dailySettle_dynamic_table_wrapper td .update-row", "click",function(){
        var mytr = $(this).parents("tr");
        var tempArr = $scope.dailySettleTable.row(mytr).data();
        var stepCode = tempArr[0];
        for(var i = 0;i<$scope.settleStepListEntitys.length;i++){
            if(stepCode == $scope.settleStepListEntitys[i].stepCode){
                $scope.ModalEntity = $scope.settleStepListEntitys[i];
            }
        }
        if($scope.canSettle){
        	return;
		}
        $("#settle_progress_id")[0].style.width = "0%";
        $scope.progress = true;
        $scope.queryLog = true;
        $scope.canSettle = true;
        $scope.realQueryLog();
        $scope.realQueryStepInfo();
        executeSettle($scope.ModalEntity.stepCode, $scope.settleDate, "0", $scope.nextSettleDate, function(result){
            $scope.queryLog = false;
            if(result.resultFlag == "1"){
                //失败
                layer.alert(result.resultMessage, {icon: 2});
            }else if(result.resultFlag == "2"){
                layer.alert(result.resultMessage, {icon: 0});
            }
            $scope.findSettleStepDetail($scope.settleDate)
            $scope.getSettleLog()
		});
    });


    $("body").undelegate("#dailySettle_dynamic_table_wrapper td .delete-row", "click");
    $("body").delegate("#dailySettle_dynamic_table_wrapper td .delete-row", "click",function(){
        var mytr = $(this).parents("tr");
        var tempArr = $scope.dailySettleTable.row(mytr).data();
        var stepCode = tempArr[0];
        for(var i = 0;i<$scope.settleStepListEntitys.length;i++){
            if(stepCode == $scope.settleStepListEntitys[i].stepCode){
                $scope.ModalEntity = $scope.settleStepListEntitys[i];
            }
        }
        if($scope.canSettle){
            return;
        }
        $("#settle_progress_id")[0].style.width = "0%";
        $scope.progress = true;
        $scope.queryLog = true;
        $scope.canSettle = true;
        $scope.realQueryLog();
        $scope.realQueryStepInfo();
        executeSettle($scope.ModalEntity.stepCode, $scope.settleDate, "1", $scope.nextSettleDate, function(result){
            $scope.queryLog = false;
            if(result.resultFlag == "1"){
            	//失败
                layer.alert(result.resultMessage, {icon: 2});
			}else if(result.resultFlag == "2"){
                layer.alert(result.resultMessage, {icon: 0});
            }
            $scope.findSettleStepDetail($scope.settleDate)
            $scope.getSettleLog()
        });
    });



    $("body").undelegate("#dailySettle_dynamic_table_wrapper td .toMenu-row", "click");
    $("body").delegate("#dailySettle_dynamic_table_wrapper td .toMenu-row", "click",function(){
        var mytr = $(this).parents("tr");
        var tempArr = $scope.dailySettleTable.row(mytr).data();
        var stepCode = tempArr[0];
        for(var i = 0;i<$scope.settleStepListEntitys.length;i++){
            if(stepCode == $scope.settleStepListEntitys[i].stepCode){
                $scope.ModalEntity = $scope.settleStepListEntitys[i];
            }
        }
        var array = $scope.ModalEntity.handleMenu.split(",");
        $rootScope.addPane(array[0], array[1], array[2], array[3], array[4]);
        $scope.findSettleStepDetail($scope.settleDate)
    });


    //自动化流程结算
    $scope.settleButtion = function(){
        $scope.isPosition1 = false;
        $scope.isPosition2 = false;
        $scope.isCapital = false;
        $scope.dailySettle = true;
        $("#settle_progress_id")[0].style.width = "0%";

        if($scope.isContinue == "2"){
            //重新结算
            layer.confirm('确定是否重新结算？', {icon:3}, function(count){
                layer.close(count);
                $scope.progress = true;
                $scope.queryLog = true;
                $scope.canSettle = true;
                $scope.realQueryLog();
                $scope.realQueryStepInfo();
                autoSettle($scope.settleDate, $scope.nextSettleDate, $scope.isContinue, function(result){
                    $scope.queryLog = false;
                    if(result.resultFlag == "1"){
                        //失败
                        layer.alert(result.resultMessage, {icon: 2});
                    }else if(result.resultFlag == "2"){
                        layer.confirm(result.resultMessage + "，是否继续结算？", {icon:3}, function(count){
                            layer.close(count);
                            $scope.settleButtion();
                        });
                    }
                    $scope.findSettleStepDetail($scope.settleDate)
                    $scope.getSettleLog()
                });

            });
        }else{
            $scope.progress = true;
            $scope.queryLog = true;
            $scope.canSettle = true;
            $scope.realQueryLog();
            $scope.realQueryStepInfo();
            autoSettle($scope.settleDate, $scope.nextSettleDate, $scope.isContinue, function(result){
                $scope.queryLog = false;
                if(result.resultFlag == "1"){
                    //失败
                    layer.alert(result.resultMessage, {icon: 2});
                }else if(result.resultFlag == "2"){
                    layer.confirm(result.resultMessage + "，是否继续结算？", {icon:3}, function(count1){
                        layer.close(count1);
                        $scope.settleButtion();
                    });
                }
                $scope.findSettleStepDetail($scope.settleDate)
                $scope.getSettleLog()
            });
        }
    }





	//获取日志
    $scope.getSettleLog = function(){
        $("#dailySettleMarjorLogID").html("");
    	if(!$scope.queryLog){
            $interval.cancel($scope.timeOutQuery);
            $interval.cancel($scope.timeOutStepInfo);
            $scope.canSettle = false;
            $scope.progress = false;
        }
        //operModel:2 代表结算日志信息
        getMajorLog({operModel:"2"}, function(result){
        	if(null == result || "" == result || undefined == result){
        		return;
			}
			var html = $("<ul></ul>");
			for(var i = 0; i<result.length; i++){
				if(result[i].logType == '1'){
					//正常日志
                    html.append("<li style='color:green;'>" + result[i].operateDate+" "+result[i].operateTime+ "         " + result[i].logContent + "</li>");
				}else if(result[i].logType == '2'){
					//警告日志
                    html.append("<li style='color:orange;'>" + result[i].operateDate+" "+result[i].operateTime+ "         " + result[i].logContent + "</li>");
				}else if(result[i].logType == '3'){
					//失败日志
                    html.append("<li style='color: red;'>" + result[i].operateDate+" "+result[i].operateTime+ "         " + result[i].logContent + "</li>");
				}else{
                    html.append("<li>" + result[i].operateDate+" "+result[i].operateTime+ "         " + result[i].logContent + "</li>");
				}
			}
            $("#dailySettleMarjorLogID").append(html)
		});
	}


	//定时获取日志函数
	$scope.realQueryLog = function(){
        // $scope.timeOutQuery = $interval($scope.getSettleLog() ,200, 1000);
        $scope.timeOutQuery = $interval(function(){
            $scope.getSettleLog();
        },1000);
	}

    $scope.realQueryStepInfo = function(){
        // $scope.timeOutStepInfo = $interval($scope.findSettleStepDetail($scope.settleDate) ,200, 1000);
        $scope.timeOutStepInfo = $interval(function(){
            $scope.findSettleStepDetail($scope.settleDate)
        },500);
    }


});
