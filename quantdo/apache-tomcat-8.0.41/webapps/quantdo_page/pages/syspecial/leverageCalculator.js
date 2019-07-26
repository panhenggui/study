myapp.controller('LeverageCalculatorController', function ($scope,$rootScope, $timeout) {
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});	
	
	//调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
    $scope.leverageCalculator_chooseCap = isShow("leverageCalculator_chooseCap"); // 确定
    $scope.leverageCalculator_getPrincipal = isShow("leverageCalculator_getPrincipal"); // 重新获取
    $scope.leverageCalculator_calculate = isShow("leverageCalculator_calculate"); // 计算
    $scope.leverageCalculator_query = isShow("leverageCalculator_query"); // 查询
    $scope.leverageCalculator_send = isShow("leverageCalculator_send"); // 推送
    $scope.leverageCalculator_set = isShow("leverageCalculator_set"); // 分发

    $scope.leverageCalculatorService = new com.quantdo.orgClear.servicesyspecial.leverageCalculatorService();
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
	$scope.subCapitalAccountService = new com.quantdo.orgClear.service.SubCapitalAccountService();

	$scope.addInstrumentList = [];
    	$scope.addCaitalPrincipalList = [];
    	$scope.addResultList = [];
    	$scope.lcAddOrderDataset = [];
    	$scope.lcAddResultDataset = [];
        $scope.lcAddResultDataList = [];
        $scope.subOrderList = [];
        $scope.subResultList = [];
        $scope.lcSubOrderDataset = [];
        $scope.lcSubResultDataset = [];
        $scope.lcSubResultDataList = [];
        $scope.queryEntity = {};
        $scope.queryResultEntity = {};
        $scope.queryCapitalAccounts = [];
        $scope.directions = clearConstant.tradeDirection;	//买卖
        $scope.lcSubTypes = clearConstant.lcSubType;
        $scope.marketTypes = clearConstant.marketType;

        $scope.isAdd = true;

        $scope.resetPrincipal = function(){
        	layer.confirm('确定重新获取名义本金？', {icon: 3}, function (count) {
    	    	$scope.leverageCalculatorService.resetPrincipal(function(result){
    	    		if(result == true){
    	    			$scope.changeFundProductID();
    	    			layer.msg('重新获取名义本金成功！', {icon : 1});
    	    			return false;
    	    		}
    	    		layer.close(count);
    	    	});
        	});
        }

        $scope.findBatch = function(){
        	$scope.leverageCalculatorService.findBatch(function(result){
        		if ($('input[type=radio][name=operType]:checked').val() == 'add') {
        			$scope.queryEntity.batch = result[0];
                	$scope.$apply();
        		}else{
        			$scope.queryEntity.batch = result[1];
                	$scope.$apply();
        		}
            });
        }

        $scope.findBatch();

        $('input[type=radio][name=operType]').change(function() {
            if($('input[type=radio][name=operType]:checked').val() == 'add') {
            	$scope.isAdd = true;
            	$scope.findBatch();
            	$scope.isMultiple = false;
            	$scope.$apply();
            	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
            }else{
            	$scope.isAdd = false;
            	$scope.findBatch();
            	$scope.changeType($scope.queryEntity.type);
            	$scope.$apply();
            	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
            }
        });

        //初始化机构信息
        $scope.instClientList = [];
        $scope.userID = localStorage.getItem("userName");
        getInstClientQueryConditionList(function(result){
        	$scope.instClientList = angular.copy(result);
            if($scope.instClientList.length > 1){
                $scope.queryEntity.instClientID = "";
            }else{
                $scope.queryEntity.instClientID = $scope.instClientList[0].instClientID;
            }
            $scope.$apply();

            // 初始化产品
            getFundProductByCondition({"instClientID":$scope.queryEntity.instClientID}, function(result){
                $scope.fundProductEntitys = result;
                $scope.$apply();
                $scope.changeFundProductID();
            });

            $scope.onlySend = false;
            findAllActiveTradeUser(function (result) {
                $scope.tradeUserLists = result;
                $scope.$apply();
                if(!$scope.leverageCalculator_set){
                	$scope.onlySend = true;
                	$scope.queryResultEntity.userID = $scope.userID;
                	$scope.$apply();
    			}
            },$scope.queryEntity.instClientID,null);

            $scope.leverageCalculatorService.findSubUserAccountByInst(function (result) {
                $scope.userAccountLists = result;
                $scope.$apply();
            },$scope.queryEntity.instClientID,'2');
        });

        queryInstClientID(function(result){
            if(result != undefined){
                $scope.noInst = true;
            }else{
                $scope.noInst = false;
            }
            $scope.$apply();
        });

        $scope.changeInstClient = function(){
        	if("" == $scope.queryEntity.instClientID){
        		$scope.queryEntity.instClientID = null;
        	}
        	// 查询产品
        	getFundProductByCondition({"instClientID":$scope.queryEntity.instClientID}, function(result){
        		$scope.fundProductEntitys = result;
        		$scope.$apply();
        		$scope.changeFundProductID();
    		});
    	}

        $scope.changeFundProductID = function(){
        	$scope.leverageCalculatorService.findCapitalAccount(function(result){
    	        $scope.queryCapitalAccounts = result;
    	        $scope.$apply();
    	        // 构建多选的资产单元
    	        $("#leverageCalculatorInnerAccountID").html("");
    			for(var i = 0;i < $scope.queryCapitalAccounts.length;i++){
    				var option = "<option></option>";
                    option = $(option).attr("value",result[i].instClientID + '\'' +result[i].subAccountID);
                    option = $(option).html(result[i].instClientID + '_' + result[i].subAccountID + '_' + result[i].subAccountName);
                    $("#leverageCalculatorInnerAccountID").append(option);
    			};
    	    	$("#leverageCalculatorInnerAccountID").multiselect("refresh");
    		},$scope.queryEntity.instClientID,$scope.queryEntity.fundProductID);
        }

        $("#leverageCalculatorInnerAccountID").multiselect({
        	checkAllText: '全选',
        	uncheckAllText:'全不选',
        	noneSelectedText:'',
        	selectedList : true,
        	classes : ''
        });

        $scope.queryEntity.direction = $scope.directions[0].key;
        $scope.queryEntity.type = $scope.lcSubTypes[0].key;
        $scope.isMultiple = false;
        $scope.changeType = function(type){
        	if(type == 0){
        		$scope.isMultiple = false;
        	}else{
        		$scope.isMultiple = true;
        		$scope.queryEntity.multiple = null;
        	}
        }

        $scope.exchangeDatas = [];
        $scope.queryProducts = [];
        //初始化交易所品种信息
    	getAllExchanges(function (result) {
    	    $scope.exchangeDatas = result;
    	    $scope.$apply();
    	    $scope.changeExchID();
    	});

    	//交易所,品种类别级联查询品种代码
        $scope.changeExchID = function(){
        	var entity = $scope.queryEntity;
            //根据交易所ID和品种类别查询产品信息
            getProductByExchID(function (result) {
                $scope.queryProducts = result;
                if(result.length > 0){
                	$scope.queryEntity.productID = result[0].productID;
                }else{
                	$scope.queryEntity.productID = "";
                }
                $scope.$apply();
            }, {'exchID': entity.exchID, 'productID': '',  'productStatus': ''});
        }

        //生成计算规则
        $scope.generateRule = function(){
        	var innerAccountIDs = $("#leverageCalculatorInnerAccountID").multiselect("getChecked").map(function(){
        		return this.value;
        	}).get();

        	if(innerAccountIDs == null || innerAccountIDs.length == 0){
        		layer.msg('未选择任何资产单元！', {icon : 2});
    			return false;
        	}else{
        		var innerAccountID = innerAccountIDs[0];
              	for (var i = 1; i < innerAccountIDs.length; i++) {
              		innerAccountID = innerAccountID + "," + innerAccountIDs[i];
       			}
              	$scope.queryEntity.innerAccountID = innerAccountID;
        	}

        	if(parseFloat($scope.queryEntity.multiple).toFixed(8) == "NaN"){
        		$scope.queryEntity.multiple = null;
        	}

        	if($('input[type=radio][name=operType]:checked').val() == "add"){
        		$scope.leverageCalculatorService.getAddPrincipal(function(principalResult){
        			$scope.addCaitalPrincipalList = principalResult;
        			$scope.lcAddOrder_columns = [
                 	    {title: "序号"},
                	    {title: "合约"},
                	    {title: "价格"}
                	];
        			var length = $scope.lcAddOrder_columns.length;
        			for(var i=0;i<$scope.addCaitalPrincipalList.length;i++){
        				$scope.lcAddOrder_columns[i+length] = {title:"资产单元-名义本金"}
        			}

        			$scope.leverageCalculatorService.getAddInstrument(function(instrumentResult){
        				$scope.addInstrumentList = instrumentResult;
        				$scope.lcAddOrderDataset = [];
        				// 绘制第一行数据
        				var temp = [1,"",""];
        				var tempLength = temp.length;
        				for(var i=0;i<$scope.addCaitalPrincipalList.length;i++){
        					temp[i+tempLength] = $scope.addCaitalPrincipalList[i].innerAccountID+"&nbsp;&nbsp;&nbsp;&nbsp;" +
        						"<input class='addPrincipal value-style' style='margin:0;text-align:center;'>";
        				}
        				$scope.lcAddOrderDataset.push(temp);
                        for(var i=1; i<instrumentResult.length+1;i++){

                        	//绘制每一条合约的数据
                        	var instrumentID = "<input class='addInstrumentID value-style' style='margin:0;text-align:center;'>";
                        	var settlePrice = "<input class='addSettlePrice value-style' style='margin:0;text-align:center;'>";

                            var tempArr = [(i+1),instrumentID,settlePrice];
                            var length = tempArr.length;
                			for(var j=0;j<$scope.addCaitalPrincipalList.length;j++){
                				tempArr[j+length] = "<input type='checkbox' class='lcAddCheckbox'>"
                			}
            	            $scope.lcAddOrderDataset.push(tempArr);
                        }

                        // 重新初始化表格
                        var mytable = document.getElementById("inner_lcAddOrder_dynamic_table");
                        var outerContainer = document.getElementById("outer_lcAddOrder_dynamic_table");
                        outerContainer.removeChild(mytable);
                        var newContainer = document.createElement("div");
                        newContainer.id = "inner_lcAddOrder_dynamic_table";
                        newContainer.innerHTML = "<table id='lcAddOrder_dynamic_table' class='cell-border stripe' cellspacing='0' width='100%'></table>";
                        outerContainer.appendChild(newContainer);

                        $scope.lcAddOrderTable = $('#lcAddOrder_dynamic_table').DataTable( {
            	    		data : $scope.lcAddOrderDataset,
            	        	columns :$scope.lcAddOrder_columns,
            	            dom: 'rt<"bottom"iplB>',
                            ordering:false,
            	            "paging": false,
            	            "info": false,
            	            scrollCollapse: true,
            				buttons: []
            	        });

                        //重新绘表
                        $scope.lcAddOrderTable.clear().draw();
                        $scope.lcAddOrderTable.rows.add($scope.lcAddOrderDataset).draw();

                        //给表格中的文本框赋值
                        for(var i=0; i<$scope.addCaitalPrincipalList.length;i++){
                        	$($(".addPrincipal")[i]).val($scope.addCaitalPrincipalList[i].principal);
                        	$($(".addPrincipal")[i]).attr("instClientID",$scope.addCaitalPrincipalList[i].instClientID);
                        	$($(".addPrincipal")[i]).attr("innerAccountID",$scope.addCaitalPrincipalList[i].innerAccountID);
                        }

                        for(var i=0; i<$scope.addInstrumentList.length;i++){
                        	$($(".addInstrumentID")[i]).val($scope.addInstrumentList[i].instrumentID);
                        	$($(".addSettlePrice")[i]).val($scope.addInstrumentList[i].settlePrice);
                        }

                        for(var i=0;i<$(".lcAddCheckbox").length;i++){
                        	$($(".lcAddCheckbox")[i]).attr("index",i);
                        }
            		},$scope.queryEntity);
        		},$scope.queryEntity);
        	}else{
        		$scope.leverageCalculatorService.generateSubRule(function(result){
        			if(result.length > 0){
        				if(result[0].type == 0){
            				$scope.lcSubOrder_columns = [
                             	{title: "序号"},
                                {title: "id",visible:false},
                                {title: "资产单元"},
                                {title: "名义本金"},
                                {title: "买卖方向"},
                                {title: "合约代码"},
                                {title: "持仓量"},
                                {title: "价格"},
                                {title: "倍数"},
                                {title: "优先级"}
                            ];
            			}else{
            				$scope.lcSubOrder_columns = [
        	                  	{title: "序号"},
        	                    {title: "id",visible:false},
        	                    {title: "资产单元"},
        	                    {title: "名义本金"},
        	                    {title: "买卖方向"},
        	                    {title: "合约代码"},
        	                    {title: "持仓量"},
        	                    {title: "价格"},
        	                    {title: "倍数"},
        	                    {title: "减仓倍数"}
        	                ];
            			}
        			}

        			var con = result;
            		var tempArray = new Array();
            		$scope.lcSubOrderDataset = new Array();
                    for(var i=0; i<con.length;i++){
                    	// 绘制名义本金，结算价以及优先级的文本框
                    	var principal = "<input class='principal value-style' style='margin:0;text-align:center;'>";

                        var settlePrice = "<input class='settlePrice value-style' style='margin:0;text-align:center;'>";

                        var priority = "<input class='priority value-style' style='margin:0;text-align:center;'>";

                        var tempArr = [(i+1),con[i].id,con[i].innerAccountID,principal,$scope.transDirection(con[i].direction),con[i].instrumentID,con[i].volume,
                                       settlePrice,parseFloat(con[i].multiple).toFixed(4),priority];
        	            $scope.lcSubOrderDataset.push(tempArr);
        	            con[i].index = tempArr[0];
                    }
                    $scope.subOrderList = con;

                    // 重新初始化表格
                    var mytable = document.getElementById("inner_lcSubOrder_dynamic_table");
                    var outerContainer = document.getElementById("outer_lcSubOrder_dynamic_table");
                    outerContainer.removeChild(mytable);
                    var newContainer = document.createElement("div");
                    newContainer.id = "inner_lcSubOrder_dynamic_table";
                    newContainer.innerHTML = "<table id='lcSubOrder_dynamic_table' class='cell-border stripe' cellspacing='0' width='100%'></table>";
                    outerContainer.appendChild(newContainer);

                	$scope.lcSubOrderTable = $('#lcSubOrder_dynamic_table').DataTable( {
                		data : $scope.lcSubOrderDataset,
                    	columns :$scope.lcSubOrder_columns,
                        dom: 'rt<"bottom"iplB>',
                        ordering:false,
                        "paging": false,
                        "info": false,
                        scrollCollapse: true,
            			buttons: []
                    });

                    //重新绘表
                    $scope.lcSubOrderTable.clear().draw();
                    $scope.lcSubOrderTable.rows.add($scope.lcSubOrderDataset).draw();
                    $scope.subOrderList = result;

                    //给表格中的文本框赋值
                    for(var i=0; i<con.length;i++){
                    	$($(".principal")[i]).val(con[i].principal);
                    	$($(".settlePrice")[i]).val(con[i].settlePrice);
                    	$($(".priority")[i]).val(con[i].priority);
                    }

        		},$scope.queryEntity)
        	}
        }

        $("body").undelegate("#lcAddOrder_dynamic_table td .addPrincipal","blur");
        //表格修改加仓名义本金事件
        $("body").delegate("#lcAddOrder_dynamic_table td .addPrincipal","blur",function(){
        	var innerAccountID = $(this).attr("innerAccountID");
        	var instClientID = $(this).attr("instClientID");

        	for(var i=0;i<$scope.addCaitalPrincipalList.length;i++){
            	if(innerAccountID==$scope.addCaitalPrincipalList[i].innerAccountID && instClientID==$scope.addCaitalPrincipalList[i].instClientID){
            		$scope.addCaitalPrincipalList[i].principal = $(this).val();
            		break;
            	}
            }
        });

        $("body").undelegate("#lcAddOrder_dynamic_table td .addSettlePrice","blur");
        //表格修改加仓价格事件
        $("body").delegate("#lcAddOrder_dynamic_table td .addSettlePrice","blur",function(){
        	var mytr = $(this).parents("tr");

            var tempArr = $scope.lcAddOrderTable.row(mytr).data();
            var index = tempArr[0]-2;
            $scope.addInstrumentList[index].settlePrice = $(this).val();
        });

        $("body").undelegate("#lcAddOrder_dynamic_table td .addInstrumentID","blur");
        //表格修改加仓合约代码事件
        $("body").delegate("#lcAddOrder_dynamic_table td .addInstrumentID","blur",function(){
        	var mytr = $(this).parents("tr");

            var tempArr = $scope.lcAddOrderTable.row(mytr).data();
            var index = tempArr[0]-2;
            $scope.addInstrumentList[index].instrumentID = $(this).val();
            $scope.leverageCalculatorService.changeAddInstrument(function(result){
            	$scope.addInstrumentList[index].settlePrice = result.settlePrice;
            	$scope.addInstrumentList[index].volumeMultiple = result.volumeMultiple;
            	$scope.addInstrumentList[index].exchangeRate = result.exchangeRate;
            	$($(".addSettlePrice")[index]).val($scope.addInstrumentList[index].settlePrice);
            },$scope.addInstrumentList[index])
        });

        $("body").undelegate("#lcSubOrder_dynamic_table td .settlePrice","blur");
        //表格修改减仓价格事件
        $("body").delegate("#lcSubOrder_dynamic_table td .settlePrice","blur",function(){
        	var mytr = $(this).parents("tr");

            var tempArr = $scope.lcSubOrderTable.row(mytr).data();
            var id = tempArr[1];
            for(var i = 0;i<$scope.subOrderList.length;i++){
            	if(id==$scope.subOrderList[i].id){
            		var tmpEntity = $scope.subOrderList[i];
            		break;
            	}
            }
            //重新计算倍数
            if(tmpEntity.principal == 0){
            	tmpEntity.multiple = 0;
            }else{
            	tmpEntity.multiple = parseFloat($(this).val() * tmpEntity.volume * tmpEntity.exchangeRate *
            		tmpEntity.volumeMultiple / tmpEntity.principal).toFixed(4);
            }
            tmpEntity.settlePrice = $(this).val();

            $($(mytr).children()[7]).html(tmpEntity.multiple);
        });

        $("body").undelegate("#lcSubOrder_dynamic_table td .principal","blur");
        //表格修改减仓名义本金事件
        $("body").delegate("#lcSubOrder_dynamic_table td .principal","blur",function(){
        	var mytr = $(this).parents("tr");

            var tempArr = $scope.lcSubOrderTable.row(mytr).data();
            var id = tempArr[1];
            for(var i = 0;i<$scope.subOrderList.length;i++){
            	if(id==$scope.subOrderList[i].id){
            		var tmpEntity = $scope.subOrderList[i];
            		break;
            	}
            }
            //重新计算倍数
            if($(this).val() == 0){
            	tmpEntity.multiple = 0;
            }else{
            	tmpEntity.multiple = parseFloat(tmpEntity.settlePrice * tmpEntity.volume * tmpEntity.exchangeRate *
            		tmpEntity.volumeMultiple / $(this).val()).toFixed(4);
            }
            tmpEntity.principal = $(this).val();

            $($(mytr).children()[7]).html(tmpEntity.multiple);
        });

        $("body").undelegate("#lcSubOrder_dynamic_table td .priority","blur");
        //表格修改减仓优先级事件
        $("body").delegate("#lcSubOrder_dynamic_table td .priority","blur",function(){
        	var mytr = $(this).parents("tr");

            var tempArr = $scope.lcSubOrderTable.row(mytr).data();
            var id = tempArr[1];
            for(var i = 0;i<$scope.subOrderList.length;i++){
            	if(id==$scope.subOrderList[i].id){
            		var tmpEntity = $scope.subOrderList[i];
            		break;
            	}
            }

            tmpEntity.priority = $(this).val();
        });

        //转换买卖方向
        $scope.transDirection = function (direction){
        	for(var i = 0;i < $scope.directions.length;i++){
    			if($scope.directions[i].key == direction){
    				return $scope.directions[i].text;
    			}
    		}
        }

        //计算倍数
        $scope.calculator = function(){

        	if($('input[type=radio][name=operType]:checked').val() == "add"){
        		if($scope.queryEntity.multiple == "" ||　$scope.queryEntity.multiple == null　|| $scope.queryEntity.multiple == undefined){
            		layer.msg('指令倍数不可为空！', {icon : 2});
            		return false;
            	}

        		// 根据用户的勾选动态生成加仓需计算的规则实体
        		var entitys = [];
        		for(var i=0;i<$(".lcAddCheckbox:checked").length;i++){
        			var index = $($(".lcAddCheckbox:checked")[i]).attr("index");
        			var principalIndex = index % $scope.addCaitalPrincipalList.length;
        			var instrumentIndex = parseInt(index / $scope.addCaitalPrincipalList.length);
        			var entity = {instClientID : $scope.addCaitalPrincipalList[principalIndex].instClientID,
    	    					innerAccountID : $scope.addCaitalPrincipalList[principalIndex].innerAccountID,
    	    					principal : parseFloat($scope.addCaitalPrincipalList[principalIndex].principal).toFixed(3),
    	    					exchID : $scope.addInstrumentList[instrumentIndex].exchID,
    	    					productID : $scope.addInstrumentList[instrumentIndex].productID,
    	    					instrumentID : $scope.addInstrumentList[instrumentIndex].instrumentID,
    	    					direction : $scope.addInstrumentList[instrumentIndex].direction,
    	    					settlePrice : parseFloat($scope.addInstrumentList[instrumentIndex].settlePrice).toFixed(8),
    	    					exchangeRate : $scope.addInstrumentList[instrumentIndex].exchangeRate,
    	    					volumeMultiple : $scope.addInstrumentList[instrumentIndex].volumeMultiple}
        			// 结算价或名义本金为0不纳入加仓计算
        			if(entity.settlePrice != 0 && entity.principal != 0 ){
        				entitys.push(entity);
        			}
        		}

        		if(entitys.length == 0){
            		layer.msg('没有选择加仓的合约！', {icon : 2});
            		return false;
            	}

        		var multiple = parseFloat($scope.queryEntity.multiple).toFixed(8);
        		if(multiple == "NaN"){
        			layer.msg('错误的指令倍数！', {icon : 2});
            		return false;
        		}

        		$scope.addOrderToTradeList = [];
        		$scope.leverageCalculatorService.addCalculator(function(result){
        			var con = result;
            		var tempArray = new Array();
            		var length = $scope.lcAddResultDataset.length;
                    for(var i=0; i<con.length;i++){
                        var tempArr = ["<a class='click-choice-one'>",(i+1+length),con[i].id,con[i].batch,con[i].tradeDate,con[i].innerAccountID,$scope.transDirection(con[i].direction),con[i].instrumentID,
                                       con[i].addMultiple,con[i].realAddVolume,con[i].calAddVolume,con[i].userID,$scope.transStatus(con[i].status)];
        	            $scope.lcAddResultDataset.push(tempArr);
        	            con[i].index = tempArr[0];
        	            $scope.lcAddResultList.push(con[i]);
                    }
                    $scope.lcAddResultList = con;
                    //重新绘表
                    $scope.lcAddResultTable.clear().draw();
                    $scope.lcAddResultTable.rows.add($scope.lcAddResultDataset).draw();
                    $scope.addResultList = con;
                    $scope.findBatch();
        		},entitys,multiple,$scope.queryEntity.batch);
        	}else{
        		if($scope.subOrderList.length == 0){
            		layer.msg('没有对应的仓可以减！', {icon : 2});
            		return false;
            	}
        		var list = [];
        		$scope.capitalAccountList = [];
        		for(var i=0;i<$scope.subOrderList.length;i++){
        			if($scope.capitalAccountList.indexOf($scope.subOrderList[i].innerAccountID) < 0){
        				$scope.capitalAccountList.push($scope.subOrderList[i].innerAccountID);
        			}
        		}

        		for(var i=0;i<$scope.capitalAccountList.length;i++){
        			var tmpList = [];
        			for(var j=0;j<$scope.subOrderList.length;j++){
        				if($scope.subOrderList[j].innerAccountID == $scope.capitalAccountList[i]){
        					tmpList.push($scope.subOrderList[j]);
        				}
        			}

        			// 按倍数减仓不需要对优先级进行排序
        			if(tmpList[0].type == 0){
        				for(var j=0;j<tmpList.length-1;j++){
            				for(var k=0;k<tmpList.length-j-1;k++){
            					if(tmpList[k].priority > tmpList[k+1].priority){
            						var tmp = tmpList[k];
            						tmpList[k] = tmpList[k+1];
            						tmpList[k+1] = tmp;
            					}
            				}
            			}
        			}

        			//按优先级减仓时 当前倍数为0,结算价为0,名义本金为0 或 按倍数减仓时 减仓倍数为0 不纳入减仓计算
        			for(var j=0;j<tmpList.length;j++){
        				tmpList[j].settlePrice = parseFloat(tmpList[j].settlePrice).toFixed(8);
    					tmpList[j].principal = parseFloat(tmpList[j].principal).toFixed(3);
    					tmpList[j].multiple = parseFloat(tmpList[j].multiple).toFixed(8);
    					if(tmpList[j].direction == '1'){
                            tmpList[j].direction = '0';
    					}else{
                            tmpList[j].direction = '1';
    					}
        				if(tmpList[j].principal != 0 && tmpList[j].settlePrice != 0 && tmpList[j].multiple != 0 && (tmpList[j].type == 0 || tmpList[j].priority != 0)){
        					list.push(tmpList[j]);
        				}
        			}
        		}

                if(list.length == 0){
                    layer.msg('没有对应的仓可以减！', {icon : 2});
                    return false;
                }

        		var multiple = parseFloat($scope.queryEntity.multiple).toFixed(8);
        		if(multiple == "NaN" && list[0].type == "0"){
        			layer.msg('错误的指令倍数！', {icon : 2});
            		return false;
        		}else if(multiple == "NaN" && list[0].type == "1"){
        			multiple = null;
        		}

        		$scope.subOrderToTradeList = [];
        		$scope.leverageCalculatorService.subCalculator(function(result){
        			var con = result;
            		var tempArray = new Array();
            		var length = $scope.lcSubResultDataset.length;
                    for(var i=0; i<con.length;i++){
                        var tempArr = ["<a class='click-choice-one'>",(i+1+length),con[i].id,con[i].batch,con[i].tradeDate,con[i].innerAccountID,$scope.transDirection(con[i].direction),con[i].instrumentID,
                                       con[i].subMultiple,con[i].realSubVolume,con[i].calSubVolume,parseFloat(con[i].realMultiple).toFixed(4),con[i].userID,$scope.transStatus(con[i].status)];
        	            $scope.lcSubResultDataset.push(tempArr);
        	            $scope.lcSubResultList.push(con[i]);
        	            con[i].index = tempArr[0];
                    }
                    $scope.lcSubResultList = con;
                    //重新绘表
                    $scope.lcSubResultTable.clear().draw();
                    $scope.lcSubResultTable.rows.add($scope.lcSubResultDataset).draw();
                    $scope.subResultList = con;
                    $scope.findBatch();
                    /*$scope.leverageCalculatorService.findBatch(function(result){
                    	$scope.queryEntity.batch = result;
                    	$scope.$apply();
                    })*/
        		},list,multiple,$scope.queryEntity.batch)
        	}
        }

        //初始化查询条件中的资产单元多选
        $scope.subCapitalAccountService.findAll(function(result){
        	$scope.queryResultCapitalAccounts = result;
            $scope.$apply();
            // 构建多选的资产单元
            $("#leverageCalculatorInnerAccountID_findResult").html("");
    		for(var i = 0;i < $scope.queryResultCapitalAccounts.length;i++){
    			var option = "<option></option>";
                option = $(option).attr("value",result[i].instClientID + '#' + result[i].subAccountID);
                option = $(option).html(result[i].instClientID + '_' + result[i].subAccountID + '_' + result[i].subAccountName);
                $("#leverageCalculatorInnerAccountID_findResult").append(option);
    		};
        	$("#leverageCalculatorInnerAccountID_findResult").multiselect("refresh");
        });

        $("#leverageCalculatorInnerAccountID_findResult").multiselect({
        	checkAllText: '全选',
        	uncheckAllText:'全不选',
        	noneSelectedText:'',
        	selectedList : true,
        	classes : ''
        });
        //获取交易日期
        // $scope.queryResultEntity.tradeDate = clearConstant.formatDate(new Date());

        //获取当前交易日
        function getDate() {
        	$scope.leverageCalculatorService.getCurrDate(function(result) {
            	if (result == "") {
                	$scope.currDate  = clearConstant.formatDate(new Date());
            		$scope.queryResultEntity.tradeDate = clearConstant.formatDate(new Date());
            	} else {
                	$scope.currDate = result;
            		$scope.queryResultEntity.tradeDate = result;
            	}
        	});
        }
        getDate();

        $scope.lcAddResultList = [];
        $scope.lcSubResultList = [];
        $scope.find = function(queryResultEntity){
        	var innerAccountIDs = $("#leverageCalculatorInnerAccountID_findResult").multiselect("getChecked").map(function(){
        		return this.value;
        	}).get();

    		var innerAccountID = innerAccountIDs[0];
          	for (var i = 1; i < innerAccountIDs.length; i++) {
          		innerAccountID = innerAccountID + "," + innerAccountIDs[i];
    		}
          	queryResultEntity.innerAccountID = innerAccountID;

          	if(queryResultEntity.batch == ""){
                queryResultEntity.batch = null;
    		}

        	if($('input[type=radio][name=operType]:checked').val() == "add"){
        		$scope.addOrderToTradeList = [];
        		$scope.leverageCalculatorService.findAddResult(function(result){
                    $("#lcAddResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a").addClass("click-choice-all");
                    $("#lcAddResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a").removeClass("clicked-choice-all");

        			var con = result;
            		var tempArray = new Array();
            		$scope.lcAddResultDataset = [];
                    for(var i=0; i<con.length;i++){
                    	var tempArr = ["<a class='click-choice-one'>",(i+1),con[i].id,con[i].batch,con[i].tradeDate,con[i].innerAccountID,$scope.transDirection(con[i].direction),con[i].instrumentID,
                                       con[i].addMultiple,con[i].realAddVolume,con[i].calAddVolume,con[i].userID,$scope.transStatus(con[i].status)];
        	            $scope.lcAddResultDataset.push(tempArr);
        	            con[i].index = tempArr[0];
                    }
                    $scope.lcAddResultList = con;
                    //重新绘表
                    $scope.lcAddResultTable.clear().draw();
                    $scope.lcAddResultTable.rows.add($scope.lcAddResultDataset).draw();
        		},queryResultEntity);
        	}else{
        		$scope.subOrderToTradeList = [];
        		$scope.leverageCalculatorService.findSubResult(function(result){
                    $("#lcSubResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a").addClass("click-choice-all");
                    $("#lcSubResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a").removeClass("clicked-choice-all");

        			var con = result;
            		var tempArray = new Array();
            		$scope.lcSubResultDataset = [];
                    for(var i=0; i<con.length;i++){
                        var tempArr = ["<a class='click-choice-one'>",(i+1),con[i].id,con[i].batch,con[i].tradeDate,con[i].innerAccountID,$scope.transDirection(con[i].direction),con[i].instrumentID,
                                       con[i].subMultiple,con[i].realSubVolume,con[i].calSubVolume,parseFloat(con[i].realMultiple).toFixed(4),con[i].userID,$scope.transStatus(con[i].status)];
        	            $scope.lcSubResultDataset.push(tempArr);
        	            con[i].index = tempArr[0];
                    }
                    $scope.lcSubResultList = con;
                    //重新绘表
                    $scope.lcSubResultTable.clear().draw();
                    $scope.lcSubResultTable.rows.add($scope.lcSubResultDataset).draw();
        		},queryResultEntity);
        	}
        }

        $scope.status = clearConstant.leverageCalculatorOrderStatus;
        $scope.transStatus = function(key){
            for(var i = 0;i < $scope.status.length;i++){
                if($scope.status[i].key == key){
                    return $scope.status[i].text;
                }
            }
            return "";
        }

        $scope.addOrderToTradeList = [];
        $("body").undelegate("#lcAddResult_dynamic_table_wrapper td a","click");
        $("body").delegate("#lcAddResult_dynamic_table_wrapper td a","click",function(){
            if($(this).hasClass("click-choice-one")){
                $(this).removeClass("click-choice-one");
                $(this).addClass("clicked-choice-one");

                var mytr = $(this).parents("tr");
                var tempArr = $scope.lcAddResultTable.row(mytr).data();
                var id = tempArr[2];
                for(var i = 0;i<$scope.lcAddResultList.length;i++){
                	if(id==$scope.lcAddResultList[i].id){
                		$scope.addOrderToTradeList.push($scope.lcAddResultList[i]);
                		break;
                	}
                }

                if($scope.lcAddResultList.length == $scope.addOrderToTradeList.length){
                    $("#lcAddResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a").addClass("clicked-choice-all");
                    $("#lcAddResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a").removeClass("click-choice-all");
                }
            }
            else{
                $(this).addClass("click-choice-one");
                $(this).removeClass("clicked-choice-one");

                $("#lcAddResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a").addClass("click-choice-all");
                $("#lcAddResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a").removeClass("clicked-choice-all");

                var mytr = $(this).parents("tr");
                var tempArr = $scope.lcAddResultTable.row(mytr).data();
                var id = tempArr[2];
                for(var i = 0;i<$scope.lcAddResultList.length;i++){
                	if(id==$scope.lcAddResultList[i].id){
                		var index = $scope.addOrderToTradeList.indexOf($scope.lcAddResultList[i]);
                		if(index != -1){
                			$scope.addOrderToTradeList.splice(index,1);
                		}
                		break;
                	}
                }
            }
        });

        $("body").undelegate("#lcAddResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a","click");
        $("body").delegate("#lcAddResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a","click",function(){
            if($(this).hasClass("click-choice-all")){
                $(this).removeClass("click-choice-all");
                $(this).addClass("clicked-choice-all");
                for(var i=0;i<$("#lcAddResult_dynamic_table_wrapper .dataTables_scrollBody td a").length;i++){
                    if($($("#lcAddResult_dynamic_table_wrapper .dataTables_scrollBody td a")[i]).hasClass("click-choice-one")){
                        $($("#lcAddResult_dynamic_table_wrapper .dataTables_scrollBody td a")[i]).removeClass("click-choice-one");
                        $($("#lcAddResult_dynamic_table_wrapper .dataTables_scrollBody td a")[i]).addClass("clicked-choice-one");
                    }
                }

                $scope.addOrderToTradeList = [];
                for(var i = 0;i<$scope.lcAddResultList.length;i++){
                	$scope.addOrderToTradeList.push($scope.lcAddResultList[i]);
                }
            }
            else{
                $(this).addClass("click-choice-all");
                $(this).removeClass("clicked-choice-all");
                for(var i=0;i<$("#lcAddResult_dynamic_table_wrapper .dataTables_scrollBody td a").length;i++){
                    if($($("#lcAddResult_dynamic_table_wrapper .dataTables_scrollBody td a")[i]).hasClass("clicked-choice-one")){
                        $($("#lcAddResult_dynamic_table_wrapper .dataTables_scrollBody td a")[i]).removeClass("clicked-choice-one");
                        $($("#lcAddResult_dynamic_table_wrapper .dataTables_scrollBody td a")[i]).addClass("click-choice-one");
                    }
                }

                $scope.addOrderToTradeList = [];
            }
        });

        $scope.subOrderToTradeList = [];
        $("body").undelegate("#lcSubResult_dynamic_table_wrapper td a","click");
        $("body").delegate("#lcSubResult_dynamic_table_wrapper td a","click",function(){
            if($(this).hasClass("click-choice-one")){
                $(this).removeClass("click-choice-one");
                $(this).addClass("clicked-choice-one");

                var mytr = $(this).parents("tr");
                var tempArr = $scope.lcSubResultTable.row(mytr).data();
                var id = tempArr[2];
                for(var i = 0;i<$scope.lcSubResultList.length;i++){
                	if(id==$scope.lcSubResultList[i].id){
                		$scope.subOrderToTradeList.push($scope.lcSubResultList[i]);
                		break;
                	}
                }

                if($scope.lcSubResultList.length == $scope.subOrderToTradeList.length){
                    $("#lcSubResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a").addClass("clicked-choice-all");
                    $("#lcSubResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a").removeClass("click-choice-all");
                }
            }
            else{
                $(this).addClass("click-choice-one");
                $(this).removeClass("clicked-choice-one");

                $("#lcSubResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a").addClass("click-choice-all");
                $("#lcSubResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a").removeClass("clicked-choice-all");

                var mytr = $(this).parents("tr");
                var tempArr = $scope.lcSubResultTable.row(mytr).data();
                var id = tempArr[2];
                for(var i = 0;i<$scope.lcSubResultList.length;i++){
                	if(id==$scope.lcSubResultList[i].id){
                		var index = $scope.subOrderToTradeList.indexOf($scope.lcSubResultList[i]);
                		if(index != -1){
                			$scope.subOrderToTradeList.splice(index,1);
                		}
                		break;
                	}
                }
            }
        });

        $("body").undelegate("#lcSubResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a","click");
        $("body").delegate("#lcSubResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a","click",function(){
            if($(this).hasClass("click-choice-all")){
                $(this).removeClass("click-choice-all");
                $(this).addClass("clicked-choice-all");
                for(var i=0;i<$("#lcSubResult_dynamic_table_wrapper .dataTables_scrollBody td a").length;i++){
                    if($($("#lcSubResult_dynamic_table_wrapper .dataTables_scrollBody td a")[i]).hasClass("click-choice-one")){
                        $($("#lcSubResult_dynamic_table_wrapper .dataTables_scrollBody td a")[i]).removeClass("click-choice-one");
                        $($("#lcSubResult_dynamic_table_wrapper .dataTables_scrollBody td a")[i]).addClass("clicked-choice-one");
                    }
                }

                $scope.subOrderToTradeList = [];
                for(var i = 0;i<$scope.lcSubResultList.length;i++){
                	$scope.subOrderToTradeList.push($scope.lcSubResultList[i]);
                }
            }
            else{
                $(this).addClass("click-choice-all");
                $(this).removeClass("clicked-choice-all");
                for(var i=0;i<$("#lcSubResult_dynamic_table_wrapper .dataTables_scrollBody td a").length;i++){
                    if($($("#lcSubResult_dynamic_table_wrapper .dataTables_scrollBody td a")[i]).hasClass("clicked-choice-one")){
                        $($("#lcSubResult_dynamic_table_wrapper .dataTables_scrollBody td a")[i]).removeClass("clicked-choice-one");
                        $($("#lcSubResult_dynamic_table_wrapper .dataTables_scrollBody td a")[i]).addClass("click-choice-one");
                    }
                }

                $scope.subOrderToTradeList = [];
            }
        });

        $scope.isSend = false;
        $scope.sendOrderToTrade = function(){
        	$scope.isSend = true;
        	var sendList = [];
        	if($('input[type=radio][name=operType]:checked').val() == 'add') {
        		sendList = angular.copy($scope.addOrderToTradeList);
        	}else{
        		sendList = angular.copy($scope.subOrderToTradeList);
        	}

        /*	if(sendList.length == 0){
        		layer.msg('未选中任何需要推送至交易端的指令！', {icon : 2});
        		$scope.isSend = false;
        		return false;
        	}*/

        	for(var i=0;i<sendList.length;i++){
        		if($scope.currDate != sendList[i].tradeDate){
                    layer.msg('不可推送非当前交易日的指令！', {icon : 2});
                    $scope.isSend = false;
                    return false;
    			}
    			if(sendList[i].status != '1'){
                    layer.msg('只能推送已分发未推送的指令！', {icon : 2});
                    $scope.isSend = false;
                    return false;
    			}
    			if(sendList[i].userID != $scope.userID){
                    layer.msg('只能推送属于当前登录用户的指令！', {icon : 2});
                    $scope.isSend = false;
                    return false;
    			}
        		sendList[i].brokerID = sendList[i].instClientID;
        		sendList[i].investorID = sendList[i].innerAccountID;
        		sendList[i].exchangeID = sendList[i].exchID;
        		sendList[i].tradePrice = sendList[i].settlePrice;
        		if($('input[type=radio][name=operType]:checked').val() == 'add') {
        			sendList[i].offsetFlag = '0';
        			sendList[i].volume = sendList[i].realAddVolume;
            	}else{
            		sendList[i].offsetFlag = '1';
            		sendList[i].volume = sendList[i].realSubVolume;
            	}
        		sendList[i].hedgeFlag = '1';
        	}

        	layer.confirm('确定推送选中指令？', {icon: 3}, function (count) {

        		var url = "v8client://batchorder/"+JSON.stringify(sendList);
            	$("#sendResultToTrade").attr("href",url);
            	document.getElementById("sendResultToTrade").click();
                for(var i=0;i<sendList.length;i++){
                    sendList[i].status = '2';
    			}

            	if($('input[type=radio][name=operType]:checked').val() == 'add') {
            		$scope.leverageCalculatorService.saveAddResult(function(result){
            			$scope.find($scope.queryResultEntity);
            			layer.msg('推送指令成功！', {icon : 1});
            			$scope.isSend = false;
            			$scope.$apply();
            			//$(".clicked-choice-all").attr("class","click-choice-all");
            		},sendList)
            	}else{
            		$scope.leverageCalculatorService.saveSubResult(function(result){
            			$scope.find($scope.queryResultEntity);
            			layer.msg('推送指令成功！', {icon : 1});
            			$scope.isSend = false;
            			$scope.$apply();
            			//$(".clicked-choice-all").attr("class","click-choice-all");
            		},sendList)
            	}

    	    	layer.close(count);
        	});
            $scope.isSend = false;
        }

        $scope.isChangeUserID = false;
        $scope.changeUserID = function(){
            $scope.isChangeUserID = true;
    		$scope.changeUserIDIndex = [];
    		$scope.changeUserIDValue = [];
    		if($('input[type=radio][name=operType]:checked').val() == 'add'){// 根据加仓还是减仓绘制查询表格
    			var tempArrList = [];
    			$scope.addOrderToTradeList = [];
                $("#lcAddResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a").addClass("click-choice-all");
                $("#lcAddResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a").removeClass("clicked-choice-all");

                var con = $scope.lcAddResultList;
    			for(var i=0;i<con.length;i++){//
    				if(con[i].status == '0' || con[i].status == '1'){
    					$scope.changeUserIDIndex.push(i);
    					$scope.changeUserIDValue.push(con[i].userID);
    					var userIDInput = getUserIDInput(con[i]);
    					var tempArr = ["",(i+1),con[i].id,con[i].batch,con[i].tradeDate,con[i].innerAccountID,$scope.transDirection(con[i].direction),con[i].instrumentID,
    						con[i].addMultiple,con[i].realAddVolume,con[i].calAddVolume,userIDInput,$scope.transStatus(con[i].status)];
    					tempArrList.push(tempArr);
    				}
    			}
    			//重新绘表
    			$scope.lcAddResultTable.clear().draw();
    			$scope.lcAddResultTable.rows.add(tempArrList).draw();
    		}else{
    			var tempArrList = [];
    			$scope.subOrderToTradeList = [];
                $("#lcSubResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a").addClass("click-choice-all");
                $("#lcSubResult_dynamic_table_wrapper .dataTables_scrollHeadInner th a").removeClass("clicked-choice-all");

                var con = $scope.lcSubResultList;
    			for(var i=0;i<con.length;i++){//
    				if(con[i].status == '0' || con[i].status == '1'){
    					$scope.changeUserIDIndex.push(i);
    					$scope.changeUserIDValue.push(con[i].userID);
    					var userIDInput = getUserIDInput(con[i]);
    					var tempArr = ["<a class='click-choice-one'>",(i+1),con[i].id,con[i].batch,con[i].tradeDate,con[i].innerAccountID,$scope.transDirection(con[i].direction),con[i].instrumentID,
                            con[i].subMultiple,con[i].realSubVolume,con[i].calSubVolume,parseFloat(con[i].realMultiple).toFixed(4),userIDInput,$scope.transStatus(con[i].status)];
    					tempArrList.push(tempArr);
    				}
    			}
    			//重新绘表
    			$scope.lcSubResultTable.clear().draw();
    			$scope.lcSubResultTable.rows.add(tempArrList).draw();
    		}
    		// 绘制交易员下拉框的初始值
    		for(var i=0;i<$scope.changeUserIDValue.length;i++){
    			var userID = $scope.changeUserIDValue[i];
    			if(userID == null){
    				$(".lcUserIDInput")[i].value = "";
    			}else{
    				$(".lcUserIDInput")[i].value = userID;
    			}
    		}
        }

        function getUserIDInput(entity){
            var userIDInput = "<select class = 'lcUserIDInput'><option value = ''></option>"
            for(var i=0;i<$scope.userAccountLists.length;i++){
                if($scope.userAccountLists[i].innerAccountID == entity.innerAccountID && $scope.userAccountLists[i].instClientID == entity.instClientID){
                	for(var j=0;j<$scope.tradeUserLists.length;j++){
                		if($scope.userAccountLists[i].userID == $scope.tradeUserLists[j].userID && $scope.userAccountLists[i].instClientID == $scope.tradeUserLists[j].instClientID){
                            userIDInput = userIDInput + "<option value='" + $scope.tradeUserLists[j].userID + "'>" +  $scope.tradeUserLists[j].userID
                                + "_" + $scope.tradeUserLists[j].userName + "</option>";
                            break;
    					}
    				}
                }
            }
            userIDInput = userIDInput + "</select>";
            return userIDInput;
        }

        $scope.saveUserID = function(){
            if($('input[type=radio][name=operType]:checked').val() == 'add'){// 根据加仓还是减仓绘制查询表格{
                for(var i=0;i<$scope.changeUserIDIndex.length;i++){
                    $scope.lcAddResultList[$scope.changeUserIDIndex[i]].userID = $(".lcUserIDInput")[i].value;
                    if($scope.lcAddResultList[$scope.changeUserIDIndex[i]].userID == ""){
                        $scope.lcAddResultList[$scope.changeUserIDIndex[i]].userID = null;
                        $scope.lcAddResultList[$scope.changeUserIDIndex[i]].status = '0';
                    }else{
                        $scope.lcAddResultList[$scope.changeUserIDIndex[i]].status = '1';
                    }
                }
                // 重绘表格
                $scope.lcAddResultDataset = [];
                var con = $scope.lcAddResultList;
                for(var i=0; i<con.length;i++){
                    var tempArr = ["<a class='click-choice-one'>",(i+1),con[i].id,con[i].batch,con[i].tradeDate,con[i].innerAccountID,$scope.transDirection(con[i].direction),con[i].instrumentID,
                        con[i].addMultiple,con[i].realAddVolume,con[i].calAddVolume,con[i].userID,$scope.transStatus(con[i].status)];
                    $scope.lcAddResultDataset.push(tempArr);
                }
                $scope.lcAddResultTable.clear().draw();
                $scope.lcAddResultTable.rows.add($scope.lcAddResultDataset).draw();
                // 保存数据
                $scope.leverageCalculatorService.saveAddResult(function(result){
                    layer.msg('指令分发成功！', {icon : 1});
                    $scope.$apply();
                },$scope.lcAddResultList);
            }else{
                for(var i=0;i<$scope.changeUserIDIndex.length;i++){
                    $scope.lcSubResultList[$scope.changeUserIDIndex[i]].userID = $(".lcUserIDInput")[i].value;
                    if($scope.lcSubResultList[$scope.changeUserIDIndex[i]].userID == ""){
                        $scope.lcSubResultList[$scope.changeUserIDIndex[i]].userID = null;
                        $scope.lcSubResultList[$scope.changeUserIDIndex[i]].status = '0';
                    }else{
                        $scope.lcSubResultList[$scope.changeUserIDIndex[i]].status = '1';
                    }
                }
                // 重绘表格
                $scope.lcSubResultDataset = [];
                var con = $scope.lcSubResultList;
                for(var i=0; i<con.length;i++){
                    var tempArr = ["<a class='click-choice-one'>",(i+1),con[i].id,con[i].batch,con[i].tradeDate,con[i].innerAccountID,$scope.transDirection(con[i].direction),con[i].instrumentID,
                        con[i].subMultiple,con[i].realSubVolume,con[i].calSubVolume,parseFloat(con[i].realMultiple).toFixed(4),con[i].userID,$scope.transStatus(con[i].status)];
                    $scope.lcSubResultDataset.push(tempArr);
                }
                $scope.lcSubResultTable.clear().draw();
                $scope.lcSubResultTable.rows.add($scope.lcSubResultDataset).draw();
                // 保存数据
                $scope.leverageCalculatorService.saveSubResult(function(result){
                    layer.msg('指令分发成功！', {icon : 1});
                    $scope.$apply();
                },$scope.lcSubResultList);
            }
            $scope.isChangeUserID = false;
        }

        $scope.cancelSaveUserID = function(){
    		layer.confirm('确认取消保存该次指令的分发？',{icon: 3}, function(count){
    			$scope.isChangeUserID = false;
    			if($('input[type=radio][name=operType]:checked').val() == 'add'){// 根据加仓还是减仓绘制查询表格
                    // 重绘表格
                    $scope.lcAddResultDataset = [];
                    var con = $scope.lcAddResultList;
                    for(var i=0; i<con.length;i++){
                        var tempArr = ["<a class='click-choice-one'>",(i+1),con[i].id,con[i].batch,con[i].tradeDate,con[i].innerAccountID,$scope.transDirection(con[i].direction),con[i].instrumentID,
                            con[i].addMultiple,con[i].realAddVolume,con[i].calAddVolume,con[i].userID,$scope.transStatus(con[i].status)];
                        $scope.lcAddResultDataset.push(tempArr);
                    }
                    $scope.lcAddResultTable.clear().draw();
                    $scope.lcAddResultTable.rows.add($scope.lcAddResultDataset).draw();
    			}else{
    				//重绘表格
                    $scope.lcSubResultDataset = [];
                    var con = $scope.lcSubResultList;
                    for(var i=0; i<con.length;i++){
                        var tempArr = ["<a class='click-choice-one'>",(i+1),con[i].id,con[i].batch,con[i].tradeDate,con[i].innerAccountID,$scope.transDirection(con[i].direction),con[i].instrumentID,
                            con[i].subMultiple,con[i].realSubVolume,con[i].calSubVolume,parseFloat(con[i].realMultiple).toFixed(4),con[i].userID,$scope.transStatus(con[i].status)];
                        $scope.lcSubResultDataset.push(tempArr);
                    }
                    $scope.lcSubResultTable.clear().draw();
                    $scope.lcSubResultTable.rows.add($scope.lcSubResultDataset).draw();
    			}
    			layer.close(count);
    			$scope.$apply();
    		});
    	}

        $scope.lcAddOrder_columns = [
    		{title: "序号"},
    	    {title: "合约"},
    	    {title: "价格"},
    	    {title: "资产单元-名义本金"}
    	];

        $scope.lcAddResult_columns = [
            {title:"<a class='click-choice-all'></a>"},
     	 	{title: "序号"},
     	    {title: "id",visible:false},
     	    {title: "批次"},
     	    {title: "日期"},
     	    {title: "资产单元"},
     	    {title: "买卖方向"},
     	    {title: "合约代码"},
     	    {title: "加仓倍数"},
     	    {title: "取整加仓量"},
     	    {title: "加仓量"},
            {title: "交易员"},
            {title: "指令状态"}
     	];

        $scope.lcSubOrder_columns = [
        	{title: "序号"},
            {title: "id",visible:false},
            {title: "资产单元"},
            {title: "名义本金"},
            {title: "买卖方向"},
            {title: "合约代码"},
            {title: "持仓量"},
            {title: "价格"},
            {title: "倍数"},
            {title: "优先级"}
        ];

        $scope.lcSubResult_columns = [
             {title:"<a class='click-choice-all'></a>"},
    	 	 {title: "序号"},
    	     {title: "id",visible:false},
    	     {title: "批次"},
    	     {title: "日期"},
    	     {title: "资产单元"},
    	     {title: "买卖方向"},
    	     {title: "合约代码"},
    	     {title: "减仓倍数"},
    	     {title: "取整减仓量"},
    	     {title: "减仓量"},
    	     {title: "减仓后倍数"},
             {title: "交易员"},
    		 {title: "指令状态"}
    	];

        //初始化
        $(document).ready(function() {

        	//会话列表初始化
        	$scope.lcAddOrderTable = $('#lcAddOrder_dynamic_table').DataTable( {
        		data : $scope.lcAddOrderDataset,
            	columns :$scope.lcAddOrder_columns,
                dom: 'rt<"bottom"iplB>',
                ordering:false,
                "paging": false,
                "info": false,
                scrollCollapse: true,
    			buttons: []
            });

        	$scope.lcAddResultTable = $('#lcAddResult_dynamic_table').DataTable( {
        		data : $scope.lcAddResultDataset,
            	columns :$scope.lcAddResult_columns,
                dom: 'rt<"bottom"iplB>',
                ordering:false,
                "paging": false,
                "info": false,
    			buttons: []
            });

        	$scope.lcSubOrderTable = $('#lcSubOrder_dynamic_table').DataTable( {
        		data : $scope.lcSubOrderDataset,
            	columns :$scope.lcSubOrder_columns,
                dom: 'rt<"bottom"iplB>',
                ordering:false,
                "paging": false,
                "info": false,
                scrollCollapse: true,
    			buttons: []
            });

        	$scope.lcSubResultTable = $('#lcSubResult_dynamic_table').DataTable( {
        		data : $scope.lcSubResultDataset,
            	columns :$scope.lcSubResult_columns,
                dom: 'rt<"bottom"iplB>',
                ordering:false,
                "paging": false,
                "info": false,
    			buttons: []
            });

        });

    });

